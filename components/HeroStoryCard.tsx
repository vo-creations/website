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

// DECISION: previously used team headshots (agency operators, not creators)
// as a stand-in, padded out with repeats since only 3-4 distinct photos
// existed. Replaced with real avatars/thumbnails pulled from the actual
// creators in the "Our Work" showcase carousel (app/page.tsx showcaseVideos)
// — captured via Playwright by loading each post's platform embed and
// intercepting the real avatar/thumbnail image response (not the site's own
// oEmbed call, which only returns skeleton-placeholder HTML with no real
// image data; the real assets only exist once the platform's embed.js
// renders client-side). 6 distinct creators: 3 TikTok (jacobw.health,
// codewithsam4, abgetsfit_) + 3 Instagram posts from the same carousel.
// Saved locally in public/creators/ rather than hotlinking — both
// platforms' CDN URLs are signed with expiry timestamps and reject direct
// curl requests outside the original browser session anyway. See
// docs/DECISIONS.md (topic: hero-story-card-v3).
// 10 distinct real creators (up from 6) — reads as an actual pool being
// matched against, not a handful of repeats. 3 TikTok + 7 Instagram, same
// capture method as before (avatar image intercepted from the platform's
// own embed render).
const SOURCING_AVATARS = [
  "/creators/tiktok-jacobw-avatar.jpg",
  "/creators/ig-1-avatar.jpg",
  "/creators/tiktok-codewithsam4-avatar.jpg",
  "/creators/ig-2-avatar.jpg",
  "/creators/tiktok-abgetsfit-avatar.jpg",
  "/creators/ig-3-avatar.jpg",
  "/creators/ig-4-avatar.jpg",
  "/creators/ig-5-avatar.jpg",
  "/creators/ig-6-avatar.jpg",
  "/creators/ig-7-avatar.jpg",
];
// 9 genuinely distinct real thumbnails now (3 TikTok + 6 Instagram, the
// latter using each post's actual main content image, not its avatar —
// captured the same way, just filtering for the largest same-path response,
// since Instagram's embed also loads small "suggested posts" thumbnails
// from unrelated accounts that aren't really "our content"). No repeats
// needed anymore — straight 1:1 index into the grid.
const POST_THUMBS = [
  "/creators/tiktok-jacobw-thumb.jpg",
  "/creators/tiktok-codewithsam4-thumb.jpg",
  "/creators/tiktok-abgetsfit-thumb.jpg",
  "/creators/ig-content-1.jpg",
  "/creators/ig-content-2.jpg",
  "/creators/ig-content-3.jpg",
  "/creators/ig-content-4.jpg",
  "/creators/ig-content-5.jpg",
  "/creators/ig-content-6.jpg",
];
const POST_THUMB_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Small monochrome line icons for the Building Strategy / Accounts Warming
// checklists — plain checkmarks read as a placeholder list; a distinct icon
// per item makes each row legible as its own concept at a glance.
function IconLayers() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
      <path d="M8 2.5 2.5 5.5 8 8.5l5.5-3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2.5 8.5 8 11.5l5.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2.5 11.5 8 14.5l5.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
function IconTrending() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
      <path d="M2 12l4-4 2.5 2.5L13.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 5h3.5v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v3.2l2 1.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconProfile() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 14c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconEngagement() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0">
      <path d="M8 13.5s-5.5-3.4-5.5-7A3 3 0 0 1 8 4.7 3 3 0 0 1 13.5 6.5c0 3.6-5.5 7-5.5 7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

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
        <div className="grid grid-cols-5 gap-x-2.5 gap-y-3">
          {SOURCING_AVATARS.map((src, i) => (
            <div key={i} className="relative w-8 h-8 shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-black flex items-center justify-center text-[8px] transition-all duration-400"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "scale(1)" : "scale(0)",
                  transitionDelay: active ? `${300 + i * 180}ms` : "0ms",
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

const STRATEGY_ITEMS = [
  { text: "Content pillars", Icon: IconLayers },
  { text: "Format testing plan", Icon: IconTrending },
  { text: "Platform mix", Icon: IconGrid },
  { text: "Posting cadence", Icon: IconClock },
];

// DECISION: was a single flat bg-bg-elevated card (solid, no blur) — clashed
// with the Liquid Glass treatment used elsewhere on the phone (the Revenue
// stage's StatChip pills). Rebuilt as individual glass pills (one per item,
// bg-white/[0.08] + backdrop-blur-md + border-white/15 + inset highlight,
// same recipe as StatChip) instead of one card holding plain text rows —
// matches the established language and gives each item its own icon instead
// of a bare checkmark.
function StageBuildingStrategy({ active }: { active: boolean }) {
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col justify-center gap-2">
        {STRATEGY_ITEMS.map(({ text, Icon }, i) => (
          <div
            key={text}
            className="flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-md rounded-full border border-white/15 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-500"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateX(0)" : "translateX(-8px)",
              transitionDelay: active ? `${i * 280}ms` : "0ms",
            }}
          >
            <span className="w-5 h-5 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-white">
              <Icon />
            </span>
            <span className="text-[11px] text-white font-medium flex-1">{text}</span>
            <span className="w-3.5 h-3.5 rounded-full bg-white text-black shrink-0 flex items-center justify-center text-[8px]">
              &#10003;
            </span>
          </div>
        ))}
      </div>
      <StageLabel text="Building strategy" />
    </StageWrap>
  );
}

const WARMUP_ITEMS = [
  { text: "Profile optimized", Icon: IconProfile },
  { text: "Engagement started", Icon: IconEngagement },
  { text: "Algorithm trust building", Icon: IconTrending },
];

// DECISION: kept the avatar+username row from the real @vocreations Instagram
// layout (circular avatar, username placeholder beside it) so this still
// reads as "an account." The checklist below was a single flat bg-bg-elevated
// card (solid, no blur) — same fix as StageBuildingStrategy: individual glass
// pills (bg-white/[0.08] + backdrop-blur-md + border-white/15) with a per-item
// icon instead of one card of plain checkmark+text rows.
// DECISION: the realistic signal of an account mid-warm-up is following
// climbing (the account follows others to build algorithm trust) while
// followers stays flat at 0 (nothing posted yet to earn any) — not a
// generic "0/0" pair. Swapped the placeholder gray bar for Thienvu's real
// name + his actual handle (@itsthienvuvo, same one referenced in this
// site's own JSON-LD sameAs links) so this reads as one of our actual
// creators' accounts, not a stand-in.
function StageAccountsWarming({ active }: { active: boolean }) {
  const following = useCountUp(340, active, 1800);
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
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-white leading-tight">Thienvu Vo</span>
            <span className="text-[10px] text-white/50 leading-tight">@itsthienvuvo</span>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-sm font-bold text-white tabular-nums">{following}</div>
            <div className="text-[9px] text-white/50 uppercase tracking-wide mt-0.5">following</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-white tabular-nums">0</div>
            <div className="text-[9px] text-white/50 uppercase tracking-wide mt-0.5">followers</div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          {WARMUP_ITEMS.map(({ text, Icon }, i) => (
            <div
              key={text}
              className="flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-md rounded-full border border-white/15 px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-500"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateX(0)" : "translateX(-8px)",
                transitionDelay: active ? `${400 + i * 500}ms` : "0ms",
              }}
            >
              <span className="w-5 h-5 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-white">
                <Icon />
              </span>
              <span className="text-[11px] text-white font-medium flex-1">{text}</span>
              <span className="w-3.5 h-3.5 rounded-full bg-white text-black shrink-0 flex items-center justify-center text-[8px]">
                &#10003;
              </span>
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
          <div className="text-[32px] font-extrabold tracking-tighter leading-none text-white tabular-nums">
            {(views / 10).toFixed(1)}M
          </div>
          <div className="text-xs text-text-dim mt-2">views and climbing</div>
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
    <div className="bg-white/[0.08] backdrop-blur-md rounded-full border border-white/15 py-3 px-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
      <div className="text-xl font-extrabold tracking-tighter leading-none tabular-nums text-white">{value}</div>
      <div className="text-[9px] text-white/55 uppercase tracking-wide mt-1.5">{label}</div>
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
      <div className="absolute -left-[2px] top-[95px] w-[3px] h-[16px] rounded-l-[2px] bg-gradient-to-b from-[#e8e8e8] via-[#a8a8a8] to-[#4a4a4a]" />
      <div className="absolute -left-[2px] top-[127px] w-[3px] h-[26px] rounded-l-[2px] bg-gradient-to-b from-[#e8e8e8] via-[#a8a8a8] to-[#4a4a4a]" />
      <div className="absolute -left-[2px] top-[168px] w-[3px] h-[26px] rounded-l-[2px] bg-gradient-to-b from-[#e8e8e8] via-[#a8a8a8] to-[#4a4a4a]" />
      <div className="absolute -right-[2px] top-[136px] w-[3px] h-[52px] rounded-r-[2px] bg-gradient-to-b from-[#e8e8e8] via-[#a8a8a8] to-[#4a4a4a]" />

      <div className="rounded-[46px] p-[3px] shadow-2xl bg-[linear-gradient(135deg,#e8e8e8_0%,#a8a8a8_18%,#5c5c5c_38%,#8a8a8a_52%,#3d3d3d_72%,#c7c7c7_88%,#6b6b6b_100%)]">
        <div className="bg-bg-card/50 backdrop-blur-sm rounded-[43px] aspect-[9/19.5] relative overflow-hidden border border-black/40">
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
