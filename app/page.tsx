"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Nav, { NAV_CONTAINER, NAV_INNER_PADDING } from "@/components/Nav";
import Footer from "@/components/Footer";
import CTABlock from "@/components/CTABlock";
import Label from "@/components/Label";
import ResultCard from "@/components/ResultCard";
import CaseStudiesLockOverlay from "@/components/CaseStudiesLockOverlay";
import LogoImage from "@/components/LogoImage";
import InstagramEmbed from "@/components/InstagramEmbed";
import TikTokEmbed from "@/components/TikTokEmbed";
import FacebookEmbed from "@/components/FacebookEmbed";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { useCountUp } from "@/components/useCountUp";
import Image from "next/image";

// DECISION: both auto-scroll marquees (Trusted By, Content that goes viral)
// mask their edges so items fade into darkness instead of hard-cutting at the
// container boundary — applied to the `overflow-hidden` wrapper, not the
// scrolling track, so it doesn't move with the animation. Needs both the
// unprefixed and -webkit- properties; Safari doesn't support unprefixed
// mask-image yet. See docs/DECISIONS.md (topic: marquee-polish).
const EDGE_FADE_MASK =
  "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)";
const edgeFadeStyle: CSSProperties = {
  WebkitMaskImage: EDGE_FADE_MASK,
  maskImage: EDGE_FADE_MASK,
};

// DECISION: hero stats count up from 0 once the row scrolls into view (fires
// immediately on mount if already in view, e.g. tall viewports). "1B+" has no
// honest literal count-up (0→1 isn't a count, 0→1,000,000,000 isn't readable),
// so it counts 0→1000 formatted as "M+" and swaps to the fixed "1B+" label
// only on the final frame — reads as a satisfying climb through big numbers
// that lands on the real figure. 2.2s duration (not the useCountUp default) —
// the first cut ran at 1.4s and read as too fast to actually track.
// See docs/DECISIONS.md (topic: hero-stats-countup).
function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const STATS_COUNT_DURATION = 2200;

function StatCounter({
  target,
  trigger,
  format,
}: {
  target: number;
  trigger: boolean;
  format: (n: number) => string;
}) {
  const value = useCountUp(target, trigger, STATS_COUNT_DURATION, { ssrFinal: true });
  return <>{format(value)}</>;
}

const heroStats = [
  { target: 1000, format: (n: number) => (n >= 1000 ? "1B+" : `${n}M+`), label: "Views generated" },
  { target: 5, format: (n: number) => `${n}M+`, label: "Users converted" },
  { target: 1000, format: (n: number) => `${n}+`, label: "Trained creators" },
  { target: 14, format: (n: number) => (n >= 14 ? "10-14" : `${n}`), label: "Days to post" },
];

const steps = [
  {
    num: "01",
    title: "Apply & Qualify",
    desc: "We review your product, audience, and goals before saying yes. Not every brand is a fit, and we'd rather tell you that upfront than waste your budget finding out later.",
  },
  {
    num: "02",
    title: "Strategy & Creator Selection",
    desc: "Every creator applies, interviews, and completes a two-week paid trial before they touch a brand account. We keep the top 1%. From there, your campaign manager builds the strategy around your product: audience, account warming, hooks, messaging, and how creators answer comments.",
  },
  {
    num: "03",
    title: "Launch & Scale",
    desc: "Every script and video is approved before it posts, across TikTok, Instagram, YouTube, Facebook, and Snapchat. Weekly testing follows what people actually watch. We guarantee your target CPM.",
  },
];

// DECISION: showcase <video> uses the #t=0.1 thumbnail trick (and onMouseLeave resets
// to 0.1) for iOS Safari. Keep all blocks identical. See docs/DECISIONS.md (topic: showcase-video).
// DECISION: mixed self-hosted + platform-embed showcase row. Self-hosted entries keep
// hover-to-play; embeds (Instagram/TikTok/Facebook) use each platform's official embed
// method and don't support the same hover interaction — see docs/DECISIONS.md
// (topic: showcase-marquee).
const showcaseVideos: {
  type: "instagram" | "tiktok" | "facebook" | "youtube";
  url: string;
  label: string;
  thumb?: string;
  poster?: string;
}[] = [
  // DECISION: interleaved by platform (not grouped) so consecutive cards are
  // usually different platforms — Instagram is the majority (11 of 17) so a
  // few adjacent IG-IG pairs are unavoidable, but nothing is ever blocked
  // together in a long run. Zero self-hosted mp4s — every entry is a real
  // platform embed. New additions get folded into the existing order, not
  // appended at the end. See docs/DECISIONS.md (topic: showcase-marquee).
  { type: "instagram", url: "https://www.instagram.com/p/DXSp7ttDH9D/", label: "Instagram", poster: "/creators/ig/DXSp7ttDH9D.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DYaCAFXvnPw/", label: "Instagram" },
  { type: "tiktok", url: "https://www.tiktok.com/@jacobw.health/video/7644976113755622686", label: "TikTok", thumb: "/creators/tiktok-jacobw-thumb.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DVzqq6eEVMt/", label: "Instagram", poster: "/creators/ig/DVzqq6eEVMt.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DXE2rDtE2lI/", label: "Instagram", poster: "/creators/ig/DXE2rDtE2lI.jpg" },
  { type: "youtube", url: "https://www.youtube.com/shorts/urpg-ygRKto", label: "YouTube" },
  { type: "instagram", url: "https://www.instagram.com/p/DZ6qfKHRJG6/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DWtNDXqjl3I/", label: "Instagram", poster: "/creators/ig/DWtNDXqjl3I.jpg" },
  { type: "facebook", url: "https://www.facebook.com/reel/1604299521120091", label: "Facebook" },
  { type: "instagram", url: "https://www.instagram.com/p/DaJ2O4ON_uK/", label: "Instagram", poster: "/creators/ig/DaJ2O4ON_uK.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DTRCvh2E1Lu/", label: "Instagram", poster: "/creators/ig/DTRCvh2E1Lu.jpg" },
  { type: "tiktok", url: "https://www.tiktok.com/@codewithsam4/video/7636811053304728853", label: "TikTok", thumb: "/creators/tiktok-codewithsam4-thumb.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DUMI_NwD0Xa/", label: "Instagram", poster: "/creators/ig/DUMI_NwD0Xa.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DY5IDHqknw4/", label: "Instagram", poster: "/creators/ig/DY5IDHqknw4.jpg" },
  { type: "tiktok", url: "https://www.tiktok.com/@abgetsfit_/video/7631809332836830477", label: "TikTok", thumb: "/creators/tiktok-abgetsfit-thumb.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DXzgEEwRXm2/", label: "Instagram", poster: "/creators/ig/DXzgEEwRXm2.jpg" },
  { type: "youtube", url: "https://www.youtube.com/shorts/k1NNFSkVAgs", label: "YouTube" },
];

const trustedBrands: { name: string; file: string; needsChip?: boolean }[] = [
  { name: "Higgsfield", file: "higgsfield.png" },
  { name: "BlackBox AI", file: "blackbox.png" },
  { name: "Liftoff", file: "liftoff.png" },
  { name: "fomo.family", file: "fomo.png" },
  { name: "Krea AI", file: "krea.png" },
  { name: "Fable", file: "fable.png" },
  { name: "Notta", file: "notta.png" },
  { name: "Softr", file: "softr.png" },
  { name: "Aonic", file: "aonic.png" },
  { name: "Makon AI", file: "makon.png" },
];

// DECISION 2026-10: campaigns start at $50K+/month, all-inclusive (trained
// creators, scripts, posting, creator bonuses, weekly reporting). Bonuses are
// not a second invoice. We guarantee the client's target CPM. Videos under
// 1,000 views do not count toward the spend. 90-day minimum, then month to
// month. No refunds after launch. See docs/DECISIONS.md (topic: pricing-2026-10).
const agencyFaqs = [
  { q: "What is the investment?", a: "Campaigns start at $50K+/month, all-inclusive: trained creators, scripts, posting, creator bonuses, and weekly reporting. CPM means cost per 1,000 organic views, and we guarantee your target CPM. Videos under 1,000 views do not count toward the spend. The minimum is 90 days, then month to month. No refunds after launch." },
  { q: "Is paid media included?", a: "No. Paid media, the ad spend, is outside the fee and billed on top. The monthly fee already includes creator bonuses." },
  { q: "Who is a good fit?", a: "AI and tech consumer apps that are ready for $50K+ a month and want organic short-form at scale, with a CPM target. Budgets under $50K a month, one-off videos, and paid-ads-only management are not a fit." },
  { q: "Do you offer refunds?", a: "No refunds after launch. The minimum is 90 days, then month to month. We guarantee your target CPM. That guarantee is not a refund, a credit, or a make-good." },
  { q: "How long do results take?", a: "First posts go live in 10-14 days. We ask for 90 days so accounts can warm up and a few testing cycles can find the format. After that it is month to month." },
  { q: "Where do the videos post?", a: "TikTok, Instagram, YouTube, Facebook, and Snapchat. A campaign produces 2,400+ videos a month. The format is organic talking-head UGC." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: agencyFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

const team = [
  {
    name: "Thienvu Vo",
    location: "New York, NY",
    statLine: "",
    detailLine:
      "Grew his own IG past 70K followers, then proved it wasn't a fluke by teaching other creators exactly how he did it. His students have earned $1M+ and generated 500M+ views. Not from one lucky post. From content that performs the same way every time. That's not a growth story. That's a system. And it's the same one every brand at Vo Creations gets.",
    image: "/videos/team-thienvu-new.jpg",
    // DECISION: default center crop left too much empty space (grass/pillar)
    // above him; shifted down so he reads centered in the card. See
    // docs/DECISIONS.md (topic: team-section-polish).
    imagePosition: "center 75%",
  },
  {
    name: "Daniel Yun",
    location: "New York, NY",
    statLine: "",
    detailLine:
      "Before Daniel ran a single campaign for anyone else, he was the one on camera, racking up 150M+ views and $200K+ earned from his own content, from scratch. That's the seat most agency operators never sit in. Since then, his campaigns for consumer apps have pulled in 500M+ views and converted into 5M+ users, because he already knows what makes someone stop scrolling.",
    image: "/videos/team-daniel.jpg",
    imagePosition: "center",
  },
];

export default function Home() {
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Nav />

      {/* HERO — banner lockup. Headline is exactly two lines (make them /
          remember.). Chrome VO sits on the right from lg up. The UGC agency
          phrase stays inside the H1. See docs/DECISIONS.md
          (topic: brand-system-2026-10). */}
      <section className="relative flex items-center pb-12 pt-28 lg:min-h-[100svh] lg:pb-16">
        <div className={`relative z-10 ${NAV_CONTAINER} mx-auto ${NAV_INNER_PADDING}`}>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
            <div className="min-w-0">
              <h1>
                <span className="mb-6 block max-w-[36rem] font-sans text-[clamp(15px,1.6vw,22px)] font-medium leading-[1.3] tracking-[-0.006em] text-[#efefed]">
                  The in-house UGC agency backed by elite mentorship
                  <span className="sr-only"> </span>
                </span>
                <span className="block font-display text-[clamp(44px,5.6vw,88px)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#fbfbf9]">
                  <span className="block">
                    make them
                    <span className="sr-only"> </span>
                  </span>
                  <span className="mt-1 block">
                    remember<span className="text-[#bdbdb8]">.</span>
                  </span>
                </span>
              </h1>
              <div className="mt-8 max-w-[34rem] space-y-3">
                <p className="font-sans text-[clamp(16px,1.5vw,22px)] font-medium leading-[1.35] text-[#efefed]">
                  <b className="font-bold text-white">1B+</b> views. <b className="font-bold text-white">1000+</b> vetted in-house creators trained through mentorship. We guarantee your target CPM.
                </p>
                <p className="text-[15px] leading-[1.5] text-text-secondary">
                  An AI app: 130M+ views in 3 months. A consumer app: 174M+ views at a $0.82 CPM. Clients stay unnamed.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="https://calendar.app.google/8x72A8nxr3gQpVfx7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-white px-7 py-3 text-[15px] font-semibold text-black transition-transform hover:-translate-y-px"
                >
                  Let&apos;s Talk
                </a>
                <a
                  href="#proof"
                  className="text-[15px] font-medium text-[#efefed] underline decoration-white/30 underline-offset-4 hover:text-white"
                >
                  See results
                </a>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              {/* Static picture, not next/image: the optimizer's JPEG fallback
                  mats the alpha to black. Lazy so the mark stays off the
                  phone's high-priority path. See docs/DECISIONS.md
                  (topic: brand-system-2026-10). */}
              <picture>
                <source media="(min-width: 1024px)" srcSet="/brand/vo-chrome.avif" type="image/avif" />
                <source media="(min-width: 1024px)" srcSet="/brand/vo-chrome.webp" type="image/webp" />
                <img
                  src="/brand/vo-chrome-sm.webp"
                  alt="Vo Creations mark"
                  width={900}
                  height={1090}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-auto w-[220px] drop-shadow-[0_24px_36px_rgba(0,0,0,0.73)] lg:w-[380px]"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div
          ref={statsRef}
          className={`${NAV_CONTAINER} mx-auto grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4`}
        >
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[32px] font-bold leading-none tracking-[-0.04em] text-white tabular-nums">
                <StatCounter target={stat.target} trigger={statsInView} format={stat.format} />
              </div>
              <div className="mt-2 text-[13px] font-medium leading-[1.3] text-text-dim">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="proof" className="px-6 py-16">
        <div className="mx-auto max-w-[1100px]">
          <Label>Proof</Label>
          <h2 className="mb-3 font-display text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight">
            Results with the name left off.
          </h2>
          <p className="mb-8 max-w-[640px] text-[15px] leading-relaxed text-text-secondary">
            Vo Creations campaign results. Clients stay anonymized. A typical outcome prices under $3 CPM.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["130M+", "An AI app, 3 months"],
              ["#3 in Finance", "A finance app, 3M+ users, sub-$4 CPM"],
              ["174M+", "A consumer app at a $0.82 CPM"],
              ["$968k ARR", "Driven for one app"],
              ["453M, 123M, 105M", "Three AI apps, 90 days each"],
              ["19.4M", "An AI app, 2 weeks"],
              ["21.5M and 15.9M", "Two apps, 30 days each"],
              ["Under $3 CPM", "Typical for this distribution"],
            ].map(([figure, detail]) => (
              <div key={detail} className="rounded-2xl border border-white/10 bg-bg-card/50 p-5">
                <div className="font-display text-[26px] font-bold leading-none tracking-[-0.04em] text-white">
                  {figure}
                </div>
                <p className="mt-3 text-[13px] leading-[1.4] text-text-secondary">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUSTED BY — marquee with real client logos, transparent-background
          PNGs trimmed to tight bbox. Monochrome white where the brand's own
          site only ships a black/white mark (inverted for our dark bg where
          needed); real brand-color icons kept where one exists (Fable,
          Softr, Notta) paired with a white wordmark. All logos render at a
          fixed container height (via LogoImage's boxClassName="h-[30px]
          w-auto") — but container height alone isn't enough to make logos
          read as the same size: every icon+wordmark PNG was also rebuilt so
          the ICON's height exactly equals its own file's TEXT cap-height
          (ratio 1.00, applied uniformly to all 10, verified by script, not
          eyeballed) before the fixed-height container is applied. Skipping
          that step is what caused a real, previously-shipped bug where
          Notta/Aonic read bigger than Liftoff/Krea/Softr despite
          every container already measuring the identical height — the
          logos with a much-taller-than-text icon had their actual
          READABLE TEXT scaled down disproportionately when the whole file
          got fit to the container. LogoImage also renders via a plain
          <img>, not next/image, for a separate reason (a retina-only
          srcset bug) — see docs/DECISIONS.md, topic: trusted-by-logos
          sizing, all three 2026-08-03 entries, before changing any of
          this again. needsChip is an escape hatch for a source that can't
          be cleanly color-keyed (unused currently).
          DECISION: this section had no top padding, so the gap above the panel
          was much smaller than the gap below it. pt-[80px] fixed the local
          section-boundary asymmetry, but the hero above is `min-h-screen` +
          vertically centered — its content (the stats row) sits well above the
          hero section's own bottom edge, with the remainder made of flex-
          centering slack that scales with viewport height, not a fixed padding
          value. Measured via getBoundingClientRect (not eyeballed) at a
          1440x900 viewport: stats-row-bottom to panel-top = 228.86px, so
          pb-[129px] (129+Our Work's pt-[100px]=229) matches it there. This
          can't be made exact at every window height without changing the
          hero's centering behavior — it drifts on taller/shorter viewports
          since the hero's slack does and this section's padding can't. */}
      <section className="pt-[80px] pb-[129px] px-6">
        <div className="max-w-[1100px] mx-auto rounded-3xl border border-white/10 bg-bg-card/50 backdrop-blur-sm py-10">
          <div className="max-w-[900px] mx-auto text-center px-6">
            <div className="mb-6 flex items-center justify-center gap-3 text-[13px] font-medium leading-[1.3] text-text-dim">
              <span className="h-px w-10 bg-text-dim" aria-hidden="true" />
              Trusted by
            </div>
          </div>
          <div className="overflow-hidden" style={edgeFadeStyle}>
            <div className="flex w-max items-center gap-x-10 animate-scroll">
              {[...trustedBrands, ...trustedBrands].map((brand, i) =>
                brand.needsChip ? (
                  <div
                    key={`${brand.name}-${i}`}
                    className="shrink-0 w-[130px] h-14 bg-bg-elevated rounded-lg overflow-hidden"
                  >
                    <LogoImage
                      src={`/logos/${brand.file}`}
                      alt={brand.name}
                      boxClassName="w-full h-full px-3 py-2"
                    />
                  </div>
                ) : (
                  <LogoImage
                    key={`${brand.name}-${i}`}
                    src={`/logos/${brand.file}`}
                    alt={brand.name}
                    boxClassName="h-[30px] w-auto"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-[40px] px-6">
        <div className="max-w-[720px] mx-auto">
          <Label>The program</Label>
          <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-6">
            A UGC agency that runs the program in-house.
          </h2>
          <div className="space-y-4 text-[15px] text-text-secondary leading-[1.75]">
            <p>
              Vo Creations runs organic UGC for AI startups and consumer apps. Trained creators post talking-head video on TikTok, Instagram, YouTube, Facebook, and Snapchat. When a video already earns the view, it can become an ad.
            </p>
            <p>
              Creators apply, interview, and finish a two-week paid trial before they touch a brand account. We keep the top 1%.
            </p>
            <p>
              Campaigns start at $50K+ a month, all-inclusive: trained creators, scripts, posting, creator bonuses, and weekly reporting. We guarantee your target CPM. CPM means cost per 1,000 organic views. Videos under 1,000 views do not count toward the spend. Paid media, the ad spend, is outside the fee and billed on top. First posts go live in 10-14 days. The minimum is 90 days, then month to month. No refunds after launch.
            </p>
            <p>
              1B+ views. 1000+ vetted in-house creators trained through mentorship. 50+ campaigns. A typical result prices under $3 CPM.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT THAT GOES VIRAL — auto-scrolling marquee, same animate-scroll mechanism
          as Trusted By (track duplicated, translateX(-50%) loop), just a slower duration
          (animate-scroll-slow) since these cards are much bigger. Paused on hover so the
          two self-hosted videos' hover-to-play/tap-to-unmute still works without the card
          sliding out from under the cursor mid-interaction. Platform embeds (Instagram/
          TikTok/Facebook) can't support that same hover interaction — see docs/DECISIONS.md
          (topic: showcase-marquee). */}
      <section className="py-[100px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <Label>Our work</Label>
          <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            Content that converts and goes viral.
          </h2>
          <p className="text-base text-text-secondary mb-8">
            Real UGC from our trained creator network across IG, TT, FB &amp; YT.
          </p>
        </div>

        <div className="overflow-hidden" style={edgeFadeStyle}>
          <div className="flex w-max items-center gap-4 animate-scroll-slow hover:[animation-play-state:paused]">
            {[...showcaseVideos, ...showcaseVideos].map((v, i) => (
              <div key={`${v.url}-${i}`} className="shrink-0 w-[260px] sm:w-[300px]">
                {v.type === "instagram" && <InstagramEmbed url={v.url} label={v.label} poster={v.poster} />}
                {v.type === "tiktok" && <TikTokEmbed url={v.url} label={v.label} thumb={v.thumb} />}
                {v.type === "facebook" && <FacebookEmbed url={v.url} label={v.label} />}
                {v.type === "youtube" && <YouTubeEmbed url={v.url} label={v.label} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-white/15" />

      {/* RESULTS */}
      <section className="py-[100px]" id="results">
        <div className="max-w-[1000px] mx-auto px-6">
          <Label>Case Studies</Label>
          <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            Undeniable impact.
          </h2>
          <p className="mb-4 text-base text-text-secondary">
            Full results shared on a call.
          </p>
          <a
            href="https://calendar.app.google/8x72A8nxr3gQpVfx7"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-10 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
          >
            Book a call
          </a>

          <div className="relative">
            <div className="flex flex-col gap-4">
              {/* Locked cards show a category label only. The view figure is a
                  blurred placeholder, never a real total. See docs/DECISIONS.md
                  (topic: case-studies-lock). */}
              {[
                { label: "AI app · 3 months", views: "000M+", viewsSub: "00 days" },
                { label: "Finance app · 90 days", views: "000M+", viewsSub: "00 days" },
                { label: "Consumer app · 90 days", views: "000M+", viewsSub: "00 creators" },
                { label: "AI app · 90 days", views: "00.0M", viewsSub: "00 days" },
                { label: "AI app · 2 weeks", views: "00.0M", viewsSub: "00 days" },
                { label: "Consumer app · 30 days", views: "000M+", viewsSub: "00 days" },
              ].map((card) => (
                <ResultCard
                  key={card.label}
                  locked
                  company={card.label}
                  views={card.views}
                  viewsSub={card.viewsSub}
                />
              ))}
            </div>

            <CaseStudiesLockOverlay href="https://calendar.app.google/8x72A8nxr3gQpVfx7" />
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-white/15" />

      {/* TEAM */}
      <section className="py-[100px]" id="team">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>The team</Label>
          <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-10">
            Proven Viral Creators
            <br />
            Turned Agency Operators
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {team.map((t) => (
              <div
                key={t.name}
                className="bg-bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className="relative aspect-square bg-bg-elevated">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 340px"
                    className="object-cover"
                    style={{ objectPosition: t.imagePosition }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[17px] font-bold">{t.name}</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-text-secondary shrink-0">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mt-1.5 text-[13px] font-semibold uppercase tracking-wide text-text-dim">
                    Co-Founder
                  </div>
                  <div className="flex items-center gap-1 text-sm text-text-secondary mt-1.5 mb-4">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                    </svg>
                    {t.location}
                  </div>
                  {t.statLine ? (
                    <div className="text-[15px] font-bold italic text-text">{t.statLine}</div>
                  ) : null}
                  <div className="mt-1 text-sm text-text-secondary">
                    {t.detailLine}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-white/15" />

      {/* HOW IT WORKS — bento grid: 01 is a large left card spanning both
          rows, 02/03 stack on the right. Borrows the grid structure and
          large-accent-number/bold-headline typography from a reference
          screenshot, restyled to the site's own cream/dark card treatment
          (bg-bg-card/border-border, same as FAQ/team/results cards) instead
          of the reference's blue-on-navy palette. No day/tag labels in the
          corner — just the three steps. */}
      <section className="py-[100px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <Label>How it works</Label>
          <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            From signed to posting in 10-14 days
          </h2>
          <p className="text-base text-text-secondary mb-10">
            A methodology refined across 50+ campaigns. Not a black box.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:row-span-2 bg-bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8 md:p-10 flex flex-col justify-center">
              <div className="text-6xl font-black text-text tracking-tight mb-6">
                {steps[0].num}
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight mb-3">
                {steps[0].title}
              </h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">
                {steps[0].desc}
              </p>
            </div>

            {steps.slice(1).map((s) => (
              <div
                key={s.num}
                className="bg-bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 p-8"
              >
                <div className="text-4xl font-black text-text tracking-tight mb-4">
                  {s.num}
                </div>
                <h3 className="text-xl font-extrabold tracking-tight mb-3">
                  {s.title}
                </h3>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-white/15" />

      <section className="px-6 py-16" id="fit">
        <div className="mx-auto grid max-w-[1100px] gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-bg-card/50 p-8">
            <h2 className="mb-4 font-display text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight">
              Good fit
            </h2>
            <ul className="space-y-3 text-[15px] leading-relaxed text-text-secondary">
              <li>AI and tech consumer apps.</li>
              <li>Ready for $50K+ a month.</li>
              <li>Want organic short-form at scale, with a CPM target.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-bg-card/50 p-8">
            <h2 className="mb-4 font-display text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight">
              Not a fit
            </h2>
            <ul className="space-y-3 text-[15px] leading-relaxed text-text-secondary">
              <li>Budgets under $50K a month.</li>
              <li>One-off videos.</li>
              <li>Paid-ads-only management.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ — each question is its own bordered card (rounded-2xl, subtle
          border, internal padding) stacked with a gap, rather than a flat
          list with divider lines between items. See docs/DECISIONS.md
          (topic: faq-restyle). */}
      <section className="py-[100px]" id="faq">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>FAQ</Label>
          <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-10">
            Frequently Asked Questions
          </h2>

          <div className="max-w-[640px] flex flex-col gap-3">
            {agencyFaqs.map((faq) => (
              <details
                key={faq.q}
                className="group border border-white/10 rounded-2xl px-6 py-5 bg-bg-card/50 backdrop-blur-sm"
              >
                <summary className="flex justify-between items-center text-left gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-semibold tracking-tight">
                    {faq.q}
                  </span>
                  <span className="shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-secondary transition-transform group-open:rotate-45">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 text-[15px] text-text-secondary leading-[1.7] pr-10">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <CTABlock />

      <Footer />
    </>
  );
}
