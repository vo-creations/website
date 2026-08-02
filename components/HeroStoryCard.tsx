"use client";

import { useEffect, useRef, useState } from "react";
import { useCountUp } from "./useCountUp";

// DECISION: a 4-stage looping mockup (account → posting → views → revenue)
// standing in for the hero's old single static video card — walks through
// the actual growth story instead of showing one frozen data point. Stages
// crossfade (StageWrap opacity) and each stage's own counters replay from 0
// every time it becomes active again, not just once. Only advances while
// the card itself is on-screen (IntersectionObserver, not disconnected —
// this one needs to keep tracking, unlike the hero-stats one-shot trigger).
// See docs/DECISIONS.md (topic: hero-story-card).
const STAGE_MS = 2800;
const STAGE_COUNT = 4;

function useElementInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function StageWrap({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col p-5 transition-opacity duration-500 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {children}
    </div>
  );
}

function StageLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 justify-center pb-1">
      <span className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[11px] shrink-0">
        &#10003;
      </span>
      <span className="text-xs font-semibold text-text">{text}</span>
    </div>
  );
}

function StageAccountCreated({ active }: { active: boolean }) {
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-bg-elevated border border-border" />
        <div className="text-center">
          <div className="h-3 w-24 bg-bg-elevated rounded-full mx-auto mb-3" />
          <div className="text-xs text-text-dim">0 posts &middot; 0 followers</div>
        </div>
      </div>
      <StageLabel text="Account created" />
    </StageWrap>
  );
}

function StagePostingContent({ active }: { active: boolean }) {
  const count = useCountUp(180, active, 1800);
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col justify-center gap-5">
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-md bg-bg-elevated border border-border transition-all duration-500 origin-center"
              style={{
                transitionDelay: active ? `${i * 100}ms` : "0ms",
                opacity: active ? 1 : 0,
                transform: active ? "scale(1)" : "scale(0.6)",
              }}
            />
          ))}
        </div>
        <div className="text-center text-lg font-extrabold text-text tabular-nums">
          {count} videos posted
        </div>
      </div>
      <StageLabel text="Posting content" />
    </StageWrap>
  );
}

const BAR_HEIGHTS = [30, 45, 40, 62, 75, 95];

function StageViewsClimbing({ active }: { active: boolean }) {
  const raw = useCountUp(38, active, 1800);
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex items-end gap-2 h-24 px-1">
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="flex-1 h-full rounded-t-md bg-gradient-to-t from-text/15 to-text/60 origin-bottom transition-transform duration-700"
              style={{
                transform: active ? `scaleY(${h / 100})` : "scaleY(0)",
                transitionDelay: active ? `${i * 90}ms` : "0ms",
              }}
            />
          ))}
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold text-text tabular-nums">
            {(raw / 10).toFixed(1)}M
          </div>
          <div className="text-xs text-text-dim mt-1">views and climbing</div>
        </div>
      </div>
      <StageLabel text="Views climbing" />
    </StageWrap>
  );
}

function StageRevenueGrowing({ active }: { active: boolean }) {
  const value = useCountUp(42, active, 1800);
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex items-end gap-2 h-24 px-1">
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="flex-1 h-full rounded-t-md bg-gradient-to-t from-green/15 to-green/70 origin-bottom transition-transform duration-700"
              style={{
                transform: active ? `scaleY(${h / 100})` : "scaleY(0)",
                transitionDelay: active ? `${i * 90}ms` : "0ms",
              }}
            />
          ))}
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-extrabold text-text tabular-nums">
              ${value}K
            </span>
            <span className="text-[11px] font-bold text-green px-1.5 py-0.5 rounded bg-green/10">
              &#9650; 24%
            </span>
          </div>
          <div className="text-xs text-text-dim mt-1">revenue generated</div>
        </div>
      </div>
      <StageLabel text="Revenue growing" />
    </StageWrap>
  );
}

export default function HeroStoryCard() {
  const { ref, inView } = useElementInView<HTMLDivElement>();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGE_COUNT), STAGE_MS);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="bg-bg-card rounded-2xl border border-border shadow-2xl aspect-[9/16] relative overflow-hidden"
    >
      <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-10">
        {Array.from({ length: STAGE_COUNT }).map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full bg-white/15 overflow-hidden">
            <div
              className={`h-full bg-white rounded-full ${stage === i ? "w-full transition-[width]" : "w-0"}`}
              style={stage === i ? { transitionDuration: `${STAGE_MS}ms`, transitionTimingFunction: "linear" } : undefined}
            />
          </div>
        ))}
      </div>
      <StageAccountCreated active={stage === 0} />
      <StagePostingContent active={stage === 1} />
      <StageViewsClimbing active={stage === 2} />
      <StageRevenueGrowing active={stage === 3} />
    </div>
  );
}
