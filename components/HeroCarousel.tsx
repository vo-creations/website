"use client";

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import type { CreatorClip } from "@/lib/creator-clips";

// DECISION 2026-11: CSS coverflow, no 3D library. Only the front clip mounts
// a video, and only after its poster has loaded and the carousel is in view.
// The front file uses preload="metadata". Side slides stay posters.
// See docs/DECISIONS.md (topic: perf-a11y-2026-11, topic: homepage-impact-2026-11).

const STEP_MS = 3600;

function slot(index: number, active: number, count: number) {
  let delta = index - active;
  const half = count / 2;
  if (delta > half) delta -= count;
  if (delta < -half) delta += count;
  if (delta === -half) return count / 2;
  return delta;
}

export default function HeroCarousel({ clips }: { clips: CreatorClip[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const swipedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [motionOK, setMotionOK] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [posterReady, setPosterReady] = useState(false);
  const count = clips.length;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // The poster is the LCP image. The mp4 waits until that image has
  // painted, the carousel is on screen, and the window load event has
  // fired, so the file does not share the poster's connection.
  useEffect(() => {
    if (reduced || !posterReady || !inView) {
      setMotionOK(false);
      return;
    }
    let idle = 0;
    let timer = 0;
    let loaded = false;
    const start = () => {
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(() => setMotionOK(true), { timeout: 800 });
      } else {
        timer = window.setTimeout(() => setMotionOK(true), 400);
      }
    };
    if (document.readyState === "complete") start();
    else {
      loaded = true;
      window.addEventListener("load", start, { once: true });
    }
    return () => {
      if (loaded) window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, [reduced, posterReady, inView]);

  useEffect(() => {
    if (reduced || paused || userPaused || !inView) return;
    const id = window.setTimeout(() => {
      setActive((current) => (current + 1) % count);
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [active, reduced, paused, userPaused, inView, count]);

  function step(direction: number) {
    setActive((current) => (current + direction + count) % count);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  function onPointerDown(event: PointerEvent) {
    if ((event.target as HTMLElement).closest("button")) return;
    dragRef.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }

  function onPointerUp(event: PointerEvent) {
    const start = dragRef.current;
    dragRef.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy)) return;
    swipedRef.current = true;
    step(dx < 0 ? 1 : -1);
  }

  return (
    <div
      ref={rootRef}
      className="hero-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Creator clips"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        dragRef.current = null;
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event: FocusEvent) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="hero-stage">
        <div className="hero-floor" aria-hidden="true" />
        <div className="hero-ring">
          {clips.map((clip, index) => {
            const pos = slot(index, active, count);
            const front = pos === 0;
            return (
              <div
                key={clip.src}
                className="hero-slide"
                data-pos={String(pos)}
                role="group"
                aria-roledescription="slide"
                aria-label={`Creator clip ${index + 1} of ${count}`}
                aria-hidden={front ? undefined : true}
                onClick={() => {
                  if (swipedRef.current) {
                    swipedRef.current = false;
                    return;
                  }
                  if (!front) setActive(index);
                }}
              >
                <div className="hero-slide-face">
                  {Math.abs(pos) <= 1 && (
                  <img
                    src={clip.poster}
                    alt=""
                    width={540}
                    height={960}
                    // React's fetchPriority prop is what the server preload link
                    // copies. The lowercase attribute is what the img itself needs.
                    fetchPriority={index === 0 ? "high" : "low"}
                    {...{ fetchpriority: index === 0 ? "high" : "low" }}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                    onLoad={index === 0 ? () => setPosterReady(true) : undefined}
                    ref={
                      index === 0
                        ? (node) => {
                            if (node?.complete && node.naturalWidth > 0) setPosterReady(true);
                          }
                        : undefined
                    }
                  />
                  )}
                  {front && motionOK && (
                    <video
                      className="absolute inset-0 h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster={clip.poster}
                    >
                      <source src={clip.src} type="video/mp4" />
                    </video>
                  )}
                  {clip.proof && <span className="clip-proof">{clip.proof}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {!reduced && (
        <button
          type="button"
          className="hero-pause"
          aria-pressed={userPaused}
          aria-label={userPaused ? "Play rotation" : "Pause rotation"}
          onClick={() => setUserPaused((value) => !value)}
        >
          {userPaused ? (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M5 3.2v9.6L13 8 5 3.2z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M4 3h3v10H4V3zm5 0h3v10H9V3z" fill="currentColor" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
