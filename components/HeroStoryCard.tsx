"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCountUp } from "./useCountUp";

// DECISION: a 6-stage looping mockup (source → strategize → warm up → post →
// views/engagement → revenue/users/awareness) standing in for the hero's old
// single static video card — walks through the actual growth process instead
// of showing one frozen data point. Stages crossfade (StageWrap opacity) and
// each stage's own counters replay from 0 every time it becomes active again,
// not just once. Only advances while the card itself is on-screen
// (IntersectionObserver, not disconnected — this one needs to keep tracking,
// unlike the hero-stats one-shot trigger). Stage 3 (warm up) and the account
// stat row take styling cues from Vo Creations' real Instagram profile
// (@vocreations) — circular avatar, username next to it, stacked number-over-
// label stat pairs — rather than a generic placeholder. See docs/DECISIONS.md
// (topic: hero-story-card, hero-story-card-v2).
const STAGE_MS = 2800;
const STAGE_COUNT = 6;

// Real photos/thumbnails (public/videos/) standing in for the flat placeholder
// shapes inside the mockup — see docs/DECISIONS.md (topic: hero-story-card-v2).
// DECISION: team-danny.png (a formal studio headshot) read as a generic stock
// photo next to the other three casual creator selfies, so it's out. Only 3
// distinct real people are available (Thienvu, Daniel, Vincent) plus one
// additional candid Daniel photo (team-daniel-candid.png, copied from the
// source asset dump) — not enough for 6 unique faces, so the grid reuses
// Thienvu and Vincent once each, arranged so no repeat sits directly above/
// below or beside itself (a loose Latin square), so it doesn't read as an
// obvious duplicate at a glance the way 3 flat repeating columns would.
const SOURCING_AVATARS = [
  "/videos/team-thienvu-new.jpg",
  "/videos/team-daniel.jpg",
  "/videos/team-vincent.jpg",
  "/videos/team-daniel-candid.png",
  "/videos/team-vincent.jpg",
  "/videos/team-thienvu-new.jpg",
];
// Only 3 distinct real thumbnails exist. A naive i % 3 fill repeats the same
// row 3 times over (0,1,2 / 0,1,2 / 0,1,2), which is exactly the "same clip
// tiled" look this was meant to fix. This index order is a Latin square (no
// row or column repeats a source image) so the 3 real thumbnails still fill
// a fuller 3x3 grid without any two identical tiles lining up.
const POST_THUMBS = ["/videos/thumb-1.png", "/videos/thumb-2.png", "/videos/thumb-3.png"];
const POST_THUMB_ORDER = [0, 1, 2, 1, 2, 0, 2, 0, 1];

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
      className={`absolute inset-0 flex flex-col px-5 pb-5 pt-16 transition-opacity duration-500 ${
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

function StageSourcingCreators({ active }: { active: boolean }) {
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <div className="grid grid-cols-3 gap-x-3 gap-y-3">
          {SOURCING_AVATARS.map((src, i) => (
            <div key={i} className="relative w-9 h-9 shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-border">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center text-[9px] transition-all duration-400"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "scale(1)" : "scale(0)",
                  transitionDelay: active ? `${400 + i * 220}ms` : "0ms",
                }}
              >
                &#10003;
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-text-dim">Matched to your niche</div>
      </div>
      <StageLabel text="Sourcing creators" />
    </StageWrap>
  );
}

const STRATEGY_ITEMS = ["Content pillars", "Format testing plan", "Platform mix", "Posting cadence"];

function StageBuildingStrategy({ active }: { active: boolean }) {
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-bg-elevated rounded-xl border border-border p-4 flex flex-col gap-3.5">
          {STRATEGY_ITEMS.map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-2.5 transition-all duration-500"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateX(0)" : "translateX(-8px)",
                transitionDelay: active ? `${i * 280}ms` : "0ms",
              }}
            >
              <span className="w-4 h-4 rounded-full border border-text-dim shrink-0 flex items-center justify-center text-[9px] text-text">
                &#10003;
              </span>
              <span className="text-[11px] text-text-secondary font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <StageLabel text="Building strategy" />
    </StageWrap>
  );
}

const WARMUP_ITEMS = ["Profile optimized", "Engagement started", "Algorithm trust building"];

// DECISION: kept the avatar+username row from the real @vocreations Instagram
// layout (circular avatar, username placeholder beside it) so this still
// reads as "an account," but swapped the static 0-posts/0-followers pair for
// a staggered checklist (same pattern as StageBuildingStrategy) — a single
// frozen checkmark didn't read as a process happening over time the way a
// list checking off in sequence does.
function StageAccountsWarming({ active }: { active: boolean }) {
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border shrink-0">
            <Image
              src="/videos/team-thienvu-new.jpg"
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="h-3 w-20 bg-bg-elevated rounded-full" />
        </div>
        <div className="w-full bg-bg-elevated rounded-xl border border-border p-4 flex flex-col gap-3">
          {WARMUP_ITEMS.map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-2.5 transition-all duration-500"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateX(0)" : "translateX(-8px)",
                transitionDelay: active ? `${400 + i * 500}ms` : "0ms",
              }}
            >
              <span className="w-4 h-4 rounded-full border border-text-dim shrink-0 flex items-center justify-center text-[9px] text-text">
                &#10003;
              </span>
              <span className="text-[11px] text-text-secondary font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <StageLabel text="Accounts warming up" />
    </StageWrap>
  );
}

function StagePostingContent({ active }: { active: boolean }) {
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col justify-center gap-5">
        <div className="grid grid-cols-3 gap-1.5">
          {POST_THUMB_ORDER.map((thumbIndex, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-md overflow-hidden border border-border transition-all duration-500 origin-center"
              style={{
                transitionDelay: active ? `${i * 100}ms` : "0ms",
                opacity: active ? 1 : 0,
                transform: active ? "scale(1)" : "scale(0.6)",
              }}
            >
              <Image
                src={POST_THUMBS[thumbIndex]}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="text-center text-sm font-extrabold text-text">
          600-1,200 videos posted a month
        </div>
      </div>
      <StageLabel text="Posting content" />
    </StageWrap>
  );
}

const BAR_HEIGHTS = [30, 45, 40, 62, 75, 95];

function StageViewsClimbing({ active }: { active: boolean }) {
  const views = useCountUp(38, active, 1800);
  const engagement = useCountUp(51, active, 1800);
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex items-end gap-2 h-20 px-1">
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="flex-1 h-full rounded-t-md bg-gradient-to-t from-white/15 to-white/80 origin-bottom transition-transform duration-700"
              style={{
                transform: active ? `scaleY(${h / 100})` : "scaleY(0)",
                transitionDelay: active ? `${i * 90}ms` : "0ms",
              }}
            />
          ))}
        </div>
        <div className="text-center">
          <div className="text-2xl font-extrabold text-text tabular-nums">
            {(views / 10).toFixed(1)}M
          </div>
          <div className="text-xs text-text-dim mt-1">views and climbing</div>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-text-secondary">
          <span className="text-white">&#9650;</span>
          <span className="tabular-nums">{(engagement / 10).toFixed(1)}%</span> engagement
        </div>
      </div>
      <StageLabel text="Views &amp; engagement" />
    </StageWrap>
  );
}

// DECISION: "Liquid Glass" treatment (Apple's current UI language) —
// translucent frosted panel (bg-white/[0.08] + backdrop-blur-md, not a flat
// bg-bg-elevated fill), pill-shaped (rounded-full, not rounded-lg), with a
// soft inset highlight along the top edge standing in for glass refraction.
// Colors dropped entirely (was text-green/text-sky-400/text-fuchsia-400) as
// part of the sitewide black-and-white conversion — all three chips read as
// white now, distinguished only by their label.
function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/[0.08] backdrop-blur-md rounded-full border border-white/15 py-2.5 px-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
      <div className="text-sm font-extrabold tabular-nums text-white">{value}</div>
      <div className="text-[9px] text-white/55 uppercase tracking-wide mt-0.5">{label}</div>
    </div>
  );
}

function StageRevenueGrowing({ active }: { active: boolean }) {
  const revenue = useCountUp(42, active, 1800);
  const users = useCountUp(28, active, 1800);
  const awareness = useCountUp(64, active, 1800);
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex items-end gap-2 h-20 px-1">
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="flex-1 h-full rounded-t-md bg-gradient-to-t from-white/20 to-white/90 origin-bottom transition-transform duration-700"
              style={{
                transform: active ? `scaleY(${h / 100})` : "scaleY(0)",
                transitionDelay: active ? `${i * 90}ms` : "0ms",
              }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <StatChip value={`$${revenue}K`} label="Revenue" />
          <StatChip value={`${users}K`} label="Users" />
          <StatChip value={`+${awareness}%`} label="Awareness" />
        </div>
      </div>
      <StageLabel text="Revenue &amp; growth" />
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
    // DECISION: a real iPhone shell, not just a rounded card. Rebuilt for
    // iPhone 17 Pro Max fidelity — thinner bezel band (p-[3px], was p-2),
    // a titanium-style edge (multi-stop diagonal gradient standing in for a
    // brushed-metal highlight instead of one flat color), and small
    // protruding divs on the outer `relative` wrapper (not the overflow-
    // hidden screen, which would clip them) for the action button + volume
    // rocker on the left edge and the power button on the right edge,
    // matching real button placement. Dynamic-island cutout sized down
    // slightly (72x22 vs 76x24) to match the thinner bezel. See
    // docs/DECISIONS.md (topic: hero-story-card-v2).
    // DECISION: recolored again — from the "cosmic orange" copper finish to
    // a neutral silver/titanium finish, matching the site's move to a pure
    // black-and-white palette. Same multi-stop gradient structure (bright/
    // dark/bright rhythm standing in for a brushed-metal highlight sweep),
    // just recolored neutral gray instead of copper. This mockup only ever
    // shows the front (screen content across all 6 stages), so there's no
    // rear camera bump to recolor — the color read comes entirely from the
    // edge/button gradient.
    <div ref={ref} className="relative">
      <div className="absolute -left-[2px] top-[78px] w-[3px] h-[16px] rounded-l-[2px] bg-gradient-to-b from-[#e8e8e8] via-[#a8a8a8] to-[#4a4a4a]" />
      <div className="absolute -left-[2px] top-[104px] w-[3px] h-[26px] rounded-l-[2px] bg-gradient-to-b from-[#e8e8e8] via-[#a8a8a8] to-[#4a4a4a]" />
      <div className="absolute -left-[2px] top-[138px] w-[3px] h-[26px] rounded-l-[2px] bg-gradient-to-b from-[#e8e8e8] via-[#a8a8a8] to-[#4a4a4a]" />
      <div className="absolute -right-[2px] top-[112px] w-[3px] h-[52px] rounded-r-[2px] bg-gradient-to-b from-[#e8e8e8] via-[#a8a8a8] to-[#4a4a4a]" />

      <div className="rounded-[46px] p-[3px] shadow-2xl bg-[linear-gradient(135deg,#e8e8e8_0%,#a8a8a8_18%,#5c5c5c_38%,#8a8a8a_52%,#3d3d3d_72%,#c7c7c7_88%,#6b6b6b_100%)]">
        <div className="bg-bg-card/50 backdrop-blur-sm rounded-[43px] aspect-[9/16] relative overflow-hidden border border-black/40">
          <div className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[72px] h-[22px] bg-black rounded-full z-20 flex items-center justify-center">
            <Image
              src="/vocreations-mark-white.png"
              alt=""
              width={12}
              height={13}
              className="w-[9px] h-auto opacity-80"
            />
          </div>
          <div className="absolute top-[40px] left-5 right-5 flex gap-1.5 z-10">
            {Array.from({ length: STAGE_COUNT }).map((_, i) => (
              <div key={i} className="flex-1 h-[3px] rounded-full bg-white/15 overflow-hidden">
                <div
                  className={`h-full bg-white rounded-full ${stage === i ? "w-full transition-[width]" : "w-0"}`}
                  style={stage === i ? { transitionDuration: `${STAGE_MS}ms`, transitionTimingFunction: "linear" } : undefined}
                />
              </div>
            ))}
          </div>
          <StageSourcingCreators active={stage === 0} />
          <StageBuildingStrategy active={stage === 1} />
          <StageAccountsWarming active={stage === 2} />
          <StagePostingContent active={stage === 3} />
          <StageViewsClimbing active={stage === 4} />
          <StageRevenueGrowing active={stage === 5} />
        </div>
      </div>
    </div>
  );
}
