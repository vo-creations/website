"use client";

import { useEffect, useState } from "react";

// Resets to 0 whenever `trigger` goes false, so a call site that flips
// trigger true/false repeatedly (e.g. a looping story stage) replays the
// count from scratch each time, not just once ever.
export function useCountUp(target: number, trigger: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) {
      setValue(0);
      return;
    }
    let raf: number;
    let start: number | null = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);
  return value;
}
