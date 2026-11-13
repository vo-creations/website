"use client";

// DECISION 2026-11: cursor ring light on the hero VO only. The silver ink
// stays the CSS mask. This canvas draws the highlight and nothing else.
// See docs/DECISIONS.md (topic: hero-ring-light-2026-11).

import { useEffect, useRef } from "react";

const LOGO_SRC = "/brand/vo-logo.svg";
const LOGO_ASPECT = 2835 / 3297.751756;
const MAP_HEIGHT = 320;
const DOME_RADIUS = 10;
const RIM_RADIUS = 2;
const MAX_DPR = 2;
const INTRO_BACKSTOP_MS = 2100;
const LIGHT_TAU = 0.26;
const GAIN_TAU = 0.42;
const DRIFT_GAIN = 0.72;
const POINTER_GAIN = 1;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Height lives in the green channel (blurred alpha). Sharp coverage is red.
// The catch is a ring in that slope field, offset by the pointer, so it
// reads as lacquer reflecting a ring light.
const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uMap;
uniform vec2 uTexel;
uniform vec2 uLight;
uniform float uIntensity;
uniform float uBevel;

void main() {
  float coverage = texture2D(uMap, vUv).r;
  if (coverage < 0.02) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float hL = texture2D(uMap, vUv + vec2(-uTexel.x, 0.0)).g;
  float hR = texture2D(uMap, vUv + vec2(uTexel.x, 0.0)).g;
  float hD = texture2D(uMap, vUv + vec2(0.0, -uTexel.y)).g;
  float hU = texture2D(uMap, vUv + vec2(0.0, uTexel.y)).g;
  // Slope of the height field. A ring light shows up where that slope
  // sits on a circle around the light, so the catch slides as the pointer moves.
  vec2 slope = vec2(hL - hR, hD - hU) * uBevel;
  vec2 center = uLight * 0.7;
  float band = length(slope - center) - 0.46;
  float core = exp(-band * band * 26.0);
  float halo = exp(-band * band * 6.0);
  float gloss = (core * 0.82 + halo * 0.2) * uIntensity;
  float mask = smoothstep(0.16, 0.7, coverage);
  float alpha = clamp(gloss, 0.0, 0.64) * mask;

  gl_FragColor = vec4(alpha, alpha, alpha, alpha);
}
`;

type Stoppable = { cancelled: boolean; stop: () => void };

export default function HeroMarkGloss() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state: Stoppable = { cancelled: false, stop: () => {} };
    void mountGloss(canvas, state);
    return () => {
      state.cancelled = true;
      state.stop();
    };
  }, []);

  return (
    <div className="hero-mark-face">
      <span className="hero-mark-ink" />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

async function mountGloss(canvas: HTMLCanvasElement, state: Stoppable) {
  const face = canvas.parentElement;
  if (!(face instanceof HTMLElement)) return;
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 1024px)");
  let generation = 0;
  let engineStop = () => {};

  const teardownEngine = () => {
    generation += 1;
    engineStop();
    engineStop = () => {};
  };

  const onMode = () => {
    if (state.cancelled) return;
    if (reduceQuery.matches || !desktopQuery.matches) {
      teardownEngine();
      if (reduceQuery.matches) face.dataset.gloss = "static";
      else delete face.dataset.gloss;
      return;
    }
    if (face.dataset.gloss === "live" || face.dataset.gloss === "pending" || face.dataset.gloss === "fallback") {
      return;
    }
    void boot();
  };

  state.stop = () => {
    reduceQuery.removeEventListener("change", onMode);
    desktopQuery.removeEventListener("change", onMode);
    teardownEngine();
    if (face.dataset.gloss === "pending" || face.dataset.gloss === "live") {
      delete face.dataset.gloss;
    }
  };
  reduceQuery.addEventListener("change", onMode);
  desktopQuery.addEventListener("change", onMode);

  if (reduceQuery.matches) {
    face.dataset.gloss = "static";
    return;
  }
  if (!desktopQuery.matches) return;

  await boot();

  async function boot() {
    const mark = canvas.parentElement;
    if (!(mark instanceof HTMLElement)) return;
    if (state.cancelled || reduceQuery.matches || !desktopQuery.matches) return;
    if (mark.dataset.gloss === "live" || mark.dataset.gloss === "pending") return;
    const token = generation;
    mark.dataset.gloss = "pending";

    await waitForIntro(state);
    if (stale()) return;
    await waitForIdle();
    if (stale()) return;

    let map: HeightMap | null = null;
    try {
      map = await buildHeightMap();
    } catch {
      map = null;
    }
    if (stale()) return;
    if (!map) {
      mark.dataset.gloss = "fallback";
      return;
    }

    const engine = createEngine(canvas, map);
    if (stale()) {
      engine?.dispose();
      return;
    }
    if (!engine) {
      mark.dataset.gloss = "fallback";
      return;
    }

    function stale() {
      return state.cancelled || token !== generation || reduceQuery.matches || !desktopQuery.matches;
    }

    const shellNode = canvas.closest(".hero-shell");
    const shell = shellNode instanceof HTMLElement ? shellNode : null;
    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let targetGain = 0;
    let lightX = 0;
    let lightY = 0;
    let gain = 0;
    let raf = 0;
    let last = 0;
    let inView = true;
    let visible = !document.hidden;

    const drift = () => !fineQuery.matches;

    const placeTarget = () => {
      if (!shell) return;
      const bounds = mark.getBoundingClientRect();
      const hero = shell.getBoundingClientRect();
      const cx = bounds.left + bounds.width * 0.5;
      const cy = bounds.top + bounds.height * 0.5;
      const sx = Math.max(hero.width, bounds.width) * 0.46;
      const sy = Math.max(hero.height, bounds.height) * 0.46;
      targetX = clamp((pointerX - cx) / sx, -1.25, 1.25);
      targetY = clamp((cy - pointerY) / sy, -1.25, 1.25);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last === 0 ? 0.016 : Math.min(0.05, (now - last) / 1000);
      last = now;

      if (drift()) {
        const t = now / 1000;
        targetX = Math.sin(t * 0.28) * 0.66;
        targetY = Math.sin(t * 0.17 + 1.15) * 0.38;
        targetGain = DRIFT_GAIN;
      } else if (pointerInside) {
        placeTarget();
        targetGain = POINTER_GAIN;
      } else {
        targetGain = 0;
      }

      lightX = damp(lightX, targetX, dt, LIGHT_TAU);
      lightY = damp(lightY, targetY, dt, LIGHT_TAU);
      gain = damp(gain, targetGain, dt, GAIN_TAU);
      engine.draw(lightX, lightY, gain);

      const idle =
        !drift() &&
        targetGain === 0 &&
        gain < 0.004 &&
        Math.hypot(lightX - targetX, lightY - targetY) < 0.004;
      if (idle) {
        engine.draw(lightX, lightY, 0);
        stopLoop();
      }
    };

    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };

    const startLoop = () => {
      if (raf || state.cancelled || document.hidden || !inView) return;
      if (reduceQuery.matches) return;
      if (canvas.clientWidth < 2 || canvas.clientHeight < 2) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const syncActive = () => {
      if (visible && inView && !reduceQuery.matches) startLoop();
      else stopLoop();
    };

    const onMove = (event: PointerEvent) => {
      if (drift()) return;
      pointerInside = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      startLoop();
    };
    const onLeave = () => {
      pointerInside = false;
      if (!drift()) startLoop();
    };
    const onVisibility = () => {
      visible = !document.hidden;
      syncActive();
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stopLoop();
      mark.dataset.gloss = "fallback";
    };

    shell?.addEventListener("pointermove", onMove, { passive: true });
    shell?.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onContextLost);

    const viewObserver = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        syncActive();
      },
      { threshold: 0.05 },
    );
    viewObserver.observe(mark);

    const resizeObserver = new ResizeObserver(() => {
      engine.resize();
      if (drift() || pointerInside) startLoop();
    });
    resizeObserver.observe(mark);

    const onFine = () => {
      if (drift()) {
        targetGain = DRIFT_GAIN;
        startLoop();
      } else if (!pointerInside) {
        targetGain = 0;
        startLoop();
      }
    };
    fineQuery.addEventListener("change", onFine);

    mark.dataset.gloss = "live";
    engine.resize();
    if (drift()) startLoop();

    engineStop = () => {
      stopLoop();
      shell?.removeEventListener("pointermove", onMove);
      shell?.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      fineQuery.removeEventListener("change", onFine);
      viewObserver.disconnect();
      resizeObserver.disconnect();
      engine.dispose();
      if (mark.dataset.gloss === "live") delete mark.dataset.gloss;
    };

    if (stale()) engineStop();
  }
}

function waitForIntro(state: Stoppable) {
  return new Promise<void>((resolve) => {
    const root = document.documentElement;
    if (root.getAttribute("data-intro") !== "play") {
      resolve();
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      window.clearTimeout(timer);
      overlay?.removeEventListener("animationend", onEnd);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (root.getAttribute("data-intro") !== "play" || state.cancelled) finish();
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-intro"] });
    const onEnd = (event: AnimationEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.id === "intro-overlay") finish();
    };
    const overlay = document.getElementById("intro-overlay");
    overlay?.addEventListener("animationend", onEnd);
    const timer = window.setTimeout(finish, INTRO_BACKSTOP_MS);
  });
}

function waitForIdle() {
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    const idle = window.requestIdleCallback;
    if (typeof idle === "function") idle(() => finish(), { timeout: 320 });
    window.setTimeout(finish, 360);
  });
}

type HeightMap = { width: number; height: number; pixels: Uint8Array };

async function buildHeightMap(): Promise<HeightMap | null> {
  const response = await fetch(LOGO_SRC);
  if (!response.ok) return null;
  const raw = await response.text();
  const height = MAP_HEIGHT;
  const width = Math.max(1, Math.round(height * LOGO_ASPECT));
  const svg = raw.replace("<svg ", `<svg width="${width}" height="${height}" `);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    const loaded = new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error("logo")), 3000);
      image.onload = () => {
        window.clearTimeout(timer);
        resolve();
      };
      image.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error("logo"));
      };
    });
    image.src = url;
    await loaded;
    const scratch = document.createElement("canvas");
    scratch.width = width;
    scratch.height = height;
    const ctx = scratch.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    const data = ctx.getImageData(0, 0, width, height).data;
    const alpha = new Float32Array(width * height);
    let peak = 0;
    for (let i = 0; i < alpha.length; i++) {
      const value = data[i * 4 + 3] / 255;
      alpha[i] = value;
      if (value > peak) peak = value;
    }
    if (peak < 0.2) return null;

    const dome = blurPasses(alpha, width, height, DOME_RADIUS, 3);
    const rim = blurPasses(alpha, width, height, RIM_RADIUS, 1);
    const pixels = new Uint8Array(width * height * 4);
    let heightPeak = 0;
    const mixed = new Float32Array(alpha.length);
    for (let i = 0; i < alpha.length; i++) {
      const value = dome[i] * 0.7 + rim[i] * 0.3;
      mixed[i] = value;
      if (value > heightPeak) heightPeak = value;
    }
    const scale = heightPeak > 0 ? 1 / heightPeak : 1;
    for (let i = 0; i < alpha.length; i++) {
      const offset = i * 4;
      pixels[offset] = Math.round(clamp(alpha[i], 0, 1) * 255);
      pixels[offset + 1] = Math.round(clamp(mixed[i] * scale, 0, 1) * 255);
      pixels[offset + 2] = 0;
      pixels[offset + 3] = 255;
    }
    return { width, height, pixels };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function blurPasses(src: Float32Array, width: number, height: number, radius: number, passes: number) {
  let current = src;
  for (let pass = 0; pass < passes; pass++) current = boxBlur(current, width, height, radius);
  return current;
}

function boxBlur(src: Float32Array, width: number, height: number, radius: number) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const windowSize = radius * 2 + 1;

  for (let y = 0; y < height; y++) {
    const row = y * width;
    let acc = 0;
    for (let k = -radius; k <= radius; k++) acc += src[row + clampIndex(k, width)];
    for (let x = 0; x < width; x++) {
      tmp[row + x] = acc / windowSize;
      acc += src[row + clampIndex(x + radius + 1, width)] - src[row + clampIndex(x - radius, width)];
    }
  }

  for (let x = 0; x < width; x++) {
    let acc = 0;
    for (let k = -radius; k <= radius; k++) acc += tmp[clampIndex(k, height) * width + x];
    for (let y = 0; y < height; y++) {
      out[y * width + x] = acc / windowSize;
      acc +=
        tmp[clampIndex(y + radius + 1, height) * width + x] -
        tmp[clampIndex(y - radius, height) * width + x];
    }
  }
  return out;
}

function clampIndex(value: number, size: number) {
  return Math.min(size - 1, Math.max(0, value));
}

type Engine = {
  draw: (x: number, y: number, intensity: number) => void;
  resize: () => void;
  dispose: () => void;
};

function createEngine(canvas: HTMLCanvasElement, map: HeightMap): Engine | null {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: false,
    });
  } catch {
    gl = null;
  }
  if (!gl) return null;

  const program = linkProgram(gl, VERT, FRAG);
  if (!program) {
    const lose = gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return null;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);

  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    map.width,
    map.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    map.pixels,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const uMap = gl.getUniformLocation(program, "uMap");
  const uTexel = gl.getUniformLocation(program, "uTexel");
  const uLight = gl.getUniformLocation(program, "uLight");
  const uIntensity = gl.getUniformLocation(program, "uIntensity");
  const uBevel = gl.getUniformLocation(program, "uBevel");
  gl.uniform1i(uMap, 0);
  gl.uniform2f(uTexel, 1 / map.width, 1 / map.height);
  gl.uniform1f(uBevel, 9);
  gl.disable(gl.BLEND);
  gl.clearColor(0, 0, 0, 0);
  if (!gl.getContextAttributes()?.alpha) {
    gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }
  gl.clear(gl.COLOR_BUFFER_BIT);

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl!.viewport(0, 0, width, height);
      gl!.useProgram(program);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
      gl!.enableVertexAttribArray(position);
      gl!.vertexAttribPointer(position, 2, gl!.FLOAT, false, 0, 0);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.uniform1i(uMap, 0);
      gl!.uniform2f(uTexel, 1 / map.width, 1 / map.height);
      gl!.uniform1f(uBevel, 9);
      gl!.disable(gl!.BLEND);
    } else {
      gl!.viewport(0, 0, canvas.width, canvas.height);
    }
  };

  const draw = (x: number, y: number, intensity: number) => {
    if (!gl) return;
    if (canvas.width < 2 || canvas.height < 2) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (intensity <= 0.001) return;
    gl.uniform2f(uLight, x, y);
    gl.uniform1f(uIntensity, intensity);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const dispose = () => {
    if (!gl) return;
    gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    const lose = gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    gl = null;
  };

  return { draw, resize, dispose };
}

function linkProgram(gl: WebGLRenderingContext, vert: string, frag: string) {
  const program = gl.createProgram();
  if (!program) return null;
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) {
    gl.deleteProgram(program);
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function damp(current: number, target: number, dt: number, tau: number) {
  const k = 1 - Math.exp(-dt / tau);
  return current + (target - current) * k;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
