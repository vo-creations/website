"use client";

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";

// DECISION 2026-10: CSS coverflow, no 3D library. Only the front clip mounts
// a video. See docs/DECISIONS.md (topic: hero-carousel-2026-10).

const STEP_MS = 3600;

type Clip = { src: string; poster: string };

function slot(index: number, active: number, count: number) {
  let delta = index - active;
  const half = count / 2;
  if (delta > half) delta -= count;
  if (delta < -half) delta += count;
  if (delta === -half) return count / 2;
  return delta;
}

export default function HeroCarousel({ clips }: { clips: Clip[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const swipedRef = useRef(false);
  const [active, setActive] = useState(0);
  const [motionOK, setMotionOK] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const count = clips.length;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduce);
    if (reduce) return;
    let timer = 0;
    let idle = 0;
    const start = () => setMotionOK(true);
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(start, { timeout: 1600 });
    } else {
      timer = window.setTimeout(start, 800);
    }
    return () => {
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (reduced || paused || userPaused) return;
    const id = window.setTimeout(() => {
      setActive((current) => (current + 1) % count);
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [active, reduced, paused, userPaused, count]);

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
                  <img
                    src={clip.poster}
                    alt=""
                    width={540}
                    height={960}
                    fetchPriority={index === 0 ? "high" : undefined}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
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
                </div>
                {front && (
                  <div className="hero-reflect" aria-hidden="true">
                    <img src={clip.poster} alt="" />
                  </div>
                )}
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
          onClick={() => setUserPaused((value) => !value)}
        >
          {userPaused ? "Play rotation" : "Pause rotation"}
        </button>
      )}
    </div>
  );
}
