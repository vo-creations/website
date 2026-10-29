"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
//
// DECISION: on mount, the screen runs a one-time intro before this loop ever
// starts — "poweron" (black overlay, brief flicker, see the `screen-poweron`
// Tailwind animation) → "lockscreen" (Vo mark + wordmark + tagline, styled
// like a real iOS lockscreen, holds briefly) → "unlocking" (a passcode row
// beneath the tagline types out PASSCODE_PHRASE letter by letter, then a
// brief unlock glow) → "stages" (the loop below). Replaces an earlier
// version where the phone shell itself did a full 360° spin on load; that's
// gone entirely, the shell now just settles in (see `animate-phone-entrance`
// in app/page.tsx). The stage-cycling interval is gated on introPhase ===
// "stages" so it can't start ticking underneath the lockscreen/passcode
// moment. The first two phase changes are on fixed timers; "unlocking" is
// not — it ends when StageLockscreen calls back to say typing actually
// finished, not after a guessed duration (see the DECISION on
// StageLockscreen for the real bug a fixed-duration version had). See
// docs/DECISIONS.md (topic: hero-phone-entrance, hero-lockscreen-passcode).
const STAGE_MS = 2800;
const STAGE_COUNT = 6;
const LOCKSCREEN_HOLD_MS = 2200;

// Passcode moment: same phrase as the tagline above it (minus the trailing
// period — a passcode field doesn't type punctuation), one character every
// PASSCODE_LETTER_MS (mid-way in the 50-80ms range asked for), then a brief
// unlock glow — nominally PASSCODE_PHRASE.length * PASSCODE_LETTER_MS +
// UNLOCK_FLASH_MS ≈ 1.55s, inside the ~1.5-2s budget. Nothing times this
// phase out from the outside; see the DECISION comment on StageLockscreen
// for why the phase transition is driven by an onUnlocked callback instead.
const PASSCODE_PHRASE = "make them remember";
const PASSCODE_LETTER_MS = 65;
const UNLOCK_FLASH_MS = 380;

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
// 4 rows x 5 = 20 slots (was 2x5=10) — but only 14 genuinely distinct real
// creators exist across this site's entire showcase pool (11 Instagram + 3
// TikTok; the Facebook reel and 2 YouTube Shorts don't expose a fetchable
// creator avatar the way Instagram/TikTok's embed responses do, so they're
// not included here). ig-8 through ig-11 are 4 newly-sourced real avatars
// (same interception method as the rest, from Instagram posts already in
// app/page.tsx's showcaseVideos that hadn't had an avatar captured yet —
// DTRCvh2E1Lu, DUMI_NwD0Xa, DWtNDXqjl3I, DXzgEEwRXm2). The last 6 slots
// repeat the first 6 avatars rather than invent/hotlink placeholder faces —
// positioned 14+ slots away from their originals (2+ full rows down) so no
// repeated face reads as adjacent-duplicate in the rendered grid.
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
  "/creators/ig-8-avatar.jpg",
  "/creators/ig-9-avatar.jpg",
  "/creators/ig-10-avatar.jpg",
  "/creators/ig-11-avatar.jpg",
  "/creators/tiktok-jacobw-avatar.jpg",
  "/creators/ig-1-avatar.jpg",
  "/creators/tiktok-codewithsam4-avatar.jpg",
  "/creators/ig-2-avatar.jpg",
  "/creators/tiktok-abgetsfit-avatar.jpg",
  "/creators/ig-3-avatar.jpg",
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
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                <Image
                  src={src}
                  alt="Creator profile photo"
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
                  // Recomputed for 20 avatars (was 10, at 300+i*180ms): the
                  // old per-item delay would have put the last checkmark's
                  // pop-in past STAGE_MS (2800ms) entirely, arriving
                  // mid-transition-out or not at all. 150+i*95ms lands the
                  // last one (i=19) fully settled by ~2355ms, same ~450ms
                  // buffer before the stage advances that the original
                  // ratio had.
                  transitionDelay: active ? `${150 + i * 95}ms` : "0ms",
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
// DECISION: swapped the placeholder gray bar for Thienvu's real name + his
// actual handle (@itsthienvuvo, same one referenced in this site's own
// JSON-LD sameAs links) so this reads as one of our actual creators'
// accounts, not a stand-in. Followers now counts up to 70K+, matching his
// real bio stat in the Team section ("Grew his own IG past 70K
// followers") — supersedes an earlier version where followers stayed
// static at 0 to signal "day one of warm-up, nothing earned yet"; the
// account/growth-story framing won out over the literal day-one snapshot.
function StageAccountsWarming({ active }: { active: boolean }) {
  const following = useCountUp(340, active, 1800, { ssrFinal: true });
  const followers = useCountUp(70, active, 1800, { ssrFinal: true });
  return (
    <StageWrap active={active}>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border shrink-0">
            <Image
              src="/videos/team-thienvu.jpg"
              alt="Thienvu Vo"
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
            <div className="text-sm font-bold text-white tabular-nums">{followers}K+</div>
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
                alt="Creator video thumbnail"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="text-center text-sm font-extrabold text-text">
          Posted on the accounts
        </div>
      </div>
      <StageLabel text="Posting content" />
    </StageWrap>
  );
}

const BAR_HEIGHTS = [30, 45, 40, 62, 75, 95];

function StageViewsClimbing({ active }: { active: boolean }) {
  // Same convention as the hero's own "1B+" stat (app/page.tsx heroStats) —
  // counts 0→1000 displayed as raw "M+", swaps to "1B+" only on the last
  // frame, since there's no honest literal count for a billion. Matches
  // the hero's main stat exactly, not just coincidentally the same number.
  const views = useCountUp(1000, active, 1800, { ssrFinal: true });
  const engagement = useCountUp(124, active, 1800, { ssrFinal: true });
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
            {views >= 1000 ? "1B+" : `${views}M+`}
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
  const revenue = useCountUp(250, active, 1800, { ssrFinal: true });
  const users = useCountUp(5, active, 1800, { ssrFinal: true });
  const awareness = useCountUp(150, active, 1800, { ssrFinal: true });
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
          <StatChip value={`${users}M+`} label="Users" />
          <StatChip value={`+${awareness}%`} label="Awareness" />
        </div>
      </div>
      <StageLabel text="Revenue &amp; growth" />
    </StageWrap>
  );
}

// Plays once between the screen power-on and the first stage of the loop —
// centered mark + wordmark + tagline, standing in for an iOS lockscreen,
// plus a passcode row beneath it. Its own fade (not StageWrap's, which
// reserves top padding for the stage progress bar and expects a bottom
// StageLabel — neither applies here). `active` covers both the branding-only
// hold and the typing/unlock moment (so the whole thing fades in/out as one
// unit); `typing` flips on only once the hold has finished, starting the
// letter-by-letter reveal.
//
// DECISION: the typing loop drives itself off elapsed wall-clock time
// (Date.now() delta each animation frame), not a per-letter setInterval —
// and the parent finds out it's done via `onUnlocked`, not a second guessed
// setTimeout of its own. An earlier version had the parent independently
// time out to "stages" after PASSCODE_PHRASE.length * PASSCODE_LETTER_MS +
// UNLOCK_FLASH_MS; under any real per-tick overhead (each setInterval tick
// here triggers a React re-render, which isn't free) the interval could run
// slower in wall-clock terms than the parent's fixed-duration timer expected
// — so the parent moved on to the stage loop before typing ever finished,
// permanently cutting off the phrase mid-word and never firing the unlock
// glow at all (confirmed via a real repro: `waitForFunction` polling for the
// glow element timed out completely). requestAnimationFrame + elapsed-time
// math is self-correcting against that drift instead of compounding it, and
// signaling completion via a callback means the parent literally cannot
// advance before typing is actually done, regardless of how slow or fast
// the JS timers run in a given browser/device. See docs/DECISIONS.md
// (topic: hero-lockscreen-passcode).
function StageLockscreen({
  active,
  typing,
  onUnlocked,
}: {
  active: boolean;
  typing: boolean;
  onUnlocked: () => void;
}) {
  const [typedCount, setTypedCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const onUnlockedRef = useRef(onUnlocked);
  onUnlockedRef.current = onUnlocked;

  useEffect(() => {
    if (!typing) {
      setTypedCount(0);
      setUnlocked(false);
      return;
    }
    const start = Date.now();
    let rafId = 0;
    let flashTimer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const elapsed = Date.now() - start;
      const count = Math.min(PASSCODE_PHRASE.length, Math.floor(elapsed / PASSCODE_LETTER_MS));
      setTypedCount(count);
      if (count >= PASSCODE_PHRASE.length) {
        setUnlocked(true);
        flashTimer = setTimeout(() => onUnlockedRef.current(), UNLOCK_FLASH_MS);
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      if (flashTimer) clearTimeout(flashTimer);
    };
  }, [typing]);

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 transition-opacity duration-700 ${
        active ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Image
        src="/vocreations-mark-white.png"
        alt="Vo Creations"
        width={40}
        height={43}
        className="w-9 h-auto opacity-95"
      />
      <div className="flex flex-col items-center gap-1.5 mt-1">
        <span className="text-[15px] font-bold text-white tracking-tight">Vo Creations</span>
        <span className="text-[11px] text-white/55 tracking-wide">make them remember.</span>
      </div>
      {/* Passcode row — one slot per character of PASSCODE_PHRASE (spaces
          just get a wider blank gap, no underline), typed in via
          `typedCount`. Same plain sans-serif as the rest of the lockscreen,
          just small and uppercase-tracked to read as UI chrome rather than
          body copy. Wrapped in its own dark scrim (bg-black/45) — plain
          white text sitting directly on the phone shell's diagonal gradient
          sheen lost contrast wherever that gradient ran light, readable in
          motion but not reliably in a static screenshot. The scrim
          guarantees contrast regardless of what's behind it. */}
      <div className="relative mt-2 px-3 py-1.5 rounded-lg bg-black/45">
        <div className="flex items-end gap-[3px]">
          {PASSCODE_PHRASE.split("").map((ch, i) =>
            ch === " " ? (
              <div key={i} className="w-1.5 shrink-0" />
            ) : (
              <div key={i} className="flex flex-col items-center w-[9px] shrink-0">
                <span
                  className={`text-[9px] font-bold text-white leading-none h-[9px] transition-opacity duration-150 ${
                    i < typedCount ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {ch}
                </span>
                <span className="w-full h-[1.5px] bg-white/50 mt-1 rounded-full" />
              </div>
            )
          )}
        </div>
        {unlocked && (
          <div className="absolute inset-0 -m-2 rounded-full bg-white/70 blur-md animate-passcode-unlock pointer-events-none" />
        )}
      </div>
    </div>
  );
}

type IntroPhase = "poweron" | "lockscreen" | "unlocking" | "stages";

export default function HeroStoryCard() {
  const { ref, inView } = useElementInView<HTMLDivElement>();
  const [stage, setStage] = useState(0);
  const [introPhase, setIntroPhase] = useState<IntroPhase>("poweron");

  // Screen-poweron animation itself runs 500ms delay + 650ms duration (see
  // tailwind.config.ts `screen-poweron`) — this timer matches that so the
  // lockscreen only starts fading in once the screen has visually finished
  // brightening, not before. "unlocking" then runs the passcode typing +
  // unlock flash — deliberately NOT a third guessed setTimeout here. The
  // move to "stages" is driven by StageLockscreen's own `onUnlocked`
  // callback once typing has actually finished, not a fixed duration; see
  // the DECISION comment on StageLockscreen for why (a fixed-duration
  // version could cut the phrase off mid-word under real timer drift).
  useEffect(() => {
    const toLockscreen = setTimeout(() => setIntroPhase("lockscreen"), 1150);
    const toUnlocking = setTimeout(() => setIntroPhase("unlocking"), 1150 + LOCKSCREEN_HOLD_MS);
    return () => {
      clearTimeout(toLockscreen);
      clearTimeout(toUnlocking);
    };
  }, []);

  const handleUnlocked = useCallback(() => setIntroPhase("stages"), []);

  useEffect(() => {
    if (!inView || introPhase !== "stages") return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGE_COUNT), STAGE_MS);
    return () => clearInterval(id);
  }, [inView, introPhase]);

  const stagesActive = introPhase === "stages";

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
              alt="Vo Creations"
              width={12}
              height={13}
              className="w-[9px] h-auto opacity-80"
            />
          </div>
          <div
            className={`absolute top-[40px] left-5 right-5 flex gap-1.5 z-10 transition-opacity duration-500 ${
              stagesActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {Array.from({ length: STAGE_COUNT }).map((_, i) => (
              <div key={i} className="flex-1 h-[3px] rounded-full bg-white/15 overflow-hidden">
                <div
                  className={`h-full bg-white rounded-full ${stage === i ? "w-full transition-[width]" : "w-0"}`}
                  style={stage === i ? { transitionDuration: `${STAGE_MS}ms`, transitionTimingFunction: "linear" } : undefined}
                />
              </div>
            ))}
          </div>
          <StageLockscreen
            active={introPhase === "lockscreen" || introPhase === "unlocking"}
            typing={introPhase === "unlocking"}
            onUnlocked={handleUnlocked}
          />
          <StageSourcingCreators active={stagesActive && stage === 0} />
          <StageBuildingStrategy active={stagesActive && stage === 1} />
          <StageAccountsWarming active={stagesActive && stage === 2} />
          <StagePostingContent active={stagesActive && stage === 3} />
          <StageViewsClimbing active={stagesActive && stage === 4} />
          <StageRevenueGrowing active={stagesActive && stage === 5} />
          {/* Black screen-off overlay, fades out with a brief flicker once
              the phone shell has settled (see `screen-poweron` in
              tailwind.config.ts) — animation fill-mode `both` keeps it at
              opacity 0 for the rest of the component's life once it runs. */}
          <div className="absolute inset-0 z-30 bg-black pointer-events-none animate-screen-poweron" />
        </div>
      </div>
    </div>
  );
}
