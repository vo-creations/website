"use client";

import { useEffect, useState } from "react";

// DECISION 2026-10: `ssrFinal` paints `target` on the server (and on the
// first client render, so hydration matches). The count still replays from
// 0 once `trigger` flips true. Without this, useState(0) shipped "0M+" /
// "0+" in the HTML and Google snippets indexed the zeros.
// See docs/DECISIONS.md (topic: seo-aeo-2026-10).
export function useCountUp(
  target: number,
  trigger: boolean,
  duration = 1400,
  options?: { ssrFinal?: boolean },
) {
  const ssrFinal = options?.ssrFinal ?? false;
  const [value, setValue] = useState(ssrFinal ? target : 0);
  useEffect(() => {
    if (!trigger) return;
    let raf: number;
    let start: number | null = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    setValue(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);
  return value;
}
