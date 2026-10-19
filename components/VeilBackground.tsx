"use client";

import { useEffect, useState } from "react";
import DarkVeil from "@/components/DarkVeil";

// DECISION 2026-10: DarkVeil stays the hero silk, but the WebGL loop does
// not start on small screens or reduced motion, and on desktop it waits
// until the browser is idle so it is not on the LCP/TBT path. A static
// CSS silk sits underneath either way. See docs/DECISIONS.md
// (topic: brand-system-2026-10).
export default function VeilBackground() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (mobile || reduce) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setLive(true);
    };

    const idle = window.requestIdleCallback;
    if (typeof idle === "function") {
      const id = idle(start, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(start, 1600);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="veil-still absolute inset-0" />
      {live && (
        <DarkVeil
          speed={0.28}
          resolutionScale={0.55}
          desaturate={1}
          tint={[1, 1, 1]}
          tintAmount={0.45}
          gamma={0.45}
        />
      )}
    </>
  );
}
