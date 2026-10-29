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
    desc: "Every creator applies, interviews, and completes a two week-long paid trial campaign before they ever touch your account. We accept the top 1%. From there, your dedicated campaign manager builds a strategy around your product specifically: audience, account warming, hooks, messaging, even how creators respond to comments. Nothing recycled from another client.",
  },
  {
    num: "03",
    title: "Launch & Scale",
    desc: "Every script and video is manually approved before it goes live, across TikTok, Instagram, YouTube, and Facebook. Real-time tracking in our internal tool shows exactly what's converting, so weekly testing and monthly reviews are built on data, not guesswork.",
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
}[] = [
  // DECISION: interleaved by platform (not grouped) so consecutive cards are
  // usually different platforms — Instagram is the majority (11 of 17) so a
  // few adjacent IG-IG pairs are unavoidable, but nothing is ever blocked
  // together in a long run. Zero self-hosted mp4s — every entry is a real
  // platform embed. New additions get folded into the existing order, not
  // appended at the end. See docs/DECISIONS.md (topic: showcase-marquee).
  { type: "instagram", url: "https://www.instagram.com/p/DXSp7ttDH9D/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DYaCAFXvnPw/", label: "Instagram" },
  { type: "tiktok", url: "https://www.tiktok.com/@jacobw.health/video/7644976113755622686", label: "TikTok", thumb: "/creators/tiktok-jacobw-thumb.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DVzqq6eEVMt/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DXE2rDtE2lI/", label: "Instagram" },
  { type: "youtube", url: "https://www.youtube.com/shorts/urpg-ygRKto", label: "YouTube" },
  { type: "instagram", url: "https://www.instagram.com/p/DZ6qfKHRJG6/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DWtNDXqjl3I/", label: "Instagram" },
  { type: "facebook", url: "https://www.facebook.com/reel/1604299521120091", label: "Facebook" },
  { type: "instagram", url: "https://www.instagram.com/p/DaJ2O4ON_uK/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DTRCvh2E1Lu/", label: "Instagram" },
  { type: "tiktok", url: "https://www.tiktok.com/@codewithsam4/video/7636811053304728853", label: "TikTok", thumb: "/creators/tiktok-codewithsam4-thumb.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DUMI_NwD0Xa/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DY5IDHqknw4/", label: "Instagram" },
  { type: "tiktok", url: "https://www.tiktok.com/@abgetsfit_/video/7631809332836830477", label: "TikTok", thumb: "/creators/tiktok-abgetsfit-thumb.jpg" },
  { type: "instagram", url: "https://www.instagram.com/p/DXzgEEwRXm2/", label: "Instagram" },
  { type: "youtube", url: "https://www.youtube.com/shorts/k1NNFSkVAgs", label: "YouTube" },
];

const trustedBrands: { name: string; file: string; needsChip?: boolean }[] = [
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

// DECISION: package floor is $50,000/mo as of 2026-10-19 (was $30,000/mo;
// before that, tiered $10k/3 creators and $20k/6 creators). 10-14 day
// posting start, 90-day minimum, month-to-month, no refunds, creator
// bonuses billed separately. See docs/DECISIONS.md (topic: pricing-2026-10).
const agencyFaqs = [
  { q: "What is Tech UGC?", a: "Tech UGC swaps traditional ad production for real creators showing your product in action: demoing it, explaining it, reacting to it, the way an actual user would. No studio, no script that sounds like a script. It's also one of the cheapest organic marketing channels out there: creator-made content costs a fraction of traditional production while still driving real reach. We run these campaigns at scale across TikTok, Instagram, YouTube, and Facebook, producing 2,400+ videos a month per brand and building organic reach before a single dollar of paid spend gets involved." },
  { q: "How long do results take?", a: "We ask for a 90-day minimum. Creator accounts need time to warm up, content needs a few testing cycles to find what performs, and none of that happens in week one: 90 days is what it takes to build a proper campaign and start scaling it as your in-house UGC program, not a one-off project." },
  { q: "How involved is the process?", a: "Whatever level works for you. Most brands hop on a weekly call to see what's performing and share updates on their end. Everything else runs without needing you in the loop. Creators get managed, content gets reviewed, strategy gets adjusted daily, all on our side. If you want more say in creative direction, we'll bring you in further. If you'd rather set it and check in once a week, that works too. Either way, nothing stalls waiting on you." },
  { q: "What would next steps look like?", a: "Fast. After a quick consultation and onboarding call, we're already sourcing creators: first content goes live within 10-14 days of kickoff." },
  { q: "What is the investment?", a: "Campaigns start at $50K/month. Creator bonuses are billed separately each month, on top of that base, so you always know exactly what's going toward strategy and management versus what's going directly to the creators making your content." },
  { q: "Do you offer refunds?", a: "No refunds, but also no long-term lock-in. We run month to month, so if something's genuinely not working, you're never stuck waiting out a contract to fix it or walk away. That's what you'd expect from a world-class in-house UGC team, backed by the same mentorship program that's already put $1M+ in students' pockets, without the overhead of actually building that team yourself. We're confident enough in the process to let it prove itself every single month, not just at signing." },
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
    location: "Richmond, VA",
    statLine: "CEO of VoC Mentorship",
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
    location: "Los Angeles, CA",
    statLine: "COO of VoC Mentorship",
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
      <section className="relative flex min-h-[100svh] items-center pt-28 pb-16">
        <div className={`relative z-10 ${NAV_CONTAINER} mx-auto ${NAV_INNER_PADDING}`}>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
            <div className="min-w-0">
              <h1>
                <span className="mb-6 block max-w-[36rem] font-sans text-[clamp(15px,1.6vw,22px)] font-medium leading-[1.3] tracking-[-0.006em] text-[#efefed]">
                  The in-house UGC agency backed by elite mentorship
                </span>
                <span className="block font-display text-[clamp(44px,5.6vw,88px)] font-extrabold leading-[0.9] tracking-[-0.045em] text-[#fbfbf9] [word-spacing:0.05em]">
                  <span className="block whitespace-nowrap">
                    ma<span style={{ letterSpacing: "0.012em" }}>k</span>e the<span style={{ letterSpacing: "-0.044em" }}>m</span>
                  </span>
                  <span className="block whitespace-nowrap">
                    remembe<span style={{ letterSpacing: "-0.075em" }}>r</span>
                    <span className="text-[#bdbdb8]">.</span>
                  </span>
                </span>
              </h1>
              <div className="mt-8 flex items-center gap-4">
                <span className="h-px w-10 shrink-0 bg-[#8a8a86]" aria-hidden="true" />
                <p className="whitespace-nowrap font-sans text-[clamp(16px,1.5vw,22px)] font-medium leading-[1.3] text-[#efefed]">
                  The team behind <b className="font-bold text-white">1B+</b> views
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
                  href="#results"
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
                  alt=""
                  width={900}
                  height={1090}
                  loading="lazy"
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
              Vo Creations is a UGC agency for AI startups and consumer apps. We recruit UGC creators, train them in-house, and run the accounts as your program: organic UGC on TikTok, Instagram, YouTube, and Facebook, then UGC ads built from the videos that already earned the view.
            </p>
            <p>
              The work is talking-head storytelling. A creator looks into the camera and tells a story the audience has lived. The product shows up inside that story. No studio, no text-on-screen template, no script that sounds like a script. Creators apply, interview, and finish a two-week paid trial before they touch a brand account. We keep the top 1%.
            </p>
            <p>
              A campaign produces 2,400+ videos a month. First posts go live in 10-14 days. We ask for 90 days so accounts can warm up and a few testing cycles can find the format. After that it is month to month, with no refunds and no long contract. Campaigns start at $50K a month. Creator bonuses are billed separately, so strategy and creator pay stay easy to tell apart.
            </p>
            <p>
              When a video gets the views and the comments, it is already tested creative. That is the bridge from organic UGC to UGC ads, and it is how app installs keep coming after a single post would have died. The same system has generated 1B+ views, with 1000+ vetted in-house creators trained through mentorship, and run across 50+ campaigns.
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
                {v.type === "instagram" && <InstagramEmbed url={v.url} label={v.label} />}
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
          <p className="text-base text-text-secondary mb-10">
            Click any card for the full story.
          </p>

          <div className="relative">
            <div className="flex flex-col gap-4">
              {/* Ordered by view count, highest to lowest. Every card is uniform:
                  logo, total views stat, timeframe/creators line, and an
                  expandable factual miniStats grid — no challenge/approach/result
                  prose on any card (removed 2026-08, see docs/DECISIONS.md,
                  topic: result-card-uniform). All `locked` — proof is blurred
                  behind CaseStudiesLockOverlay until a call is booked, see
                  docs/DECISIONS.md, topic: case-studies-lock. */}
              <ResultCard
                locked
                company="Liftoff"
                logo="/logos/liftoff.png"
                views="170M+"
                viewsSub="3 months / 50 creators"
                miniStats={[
                  { value: "170M+", label: "Views" },
                  { value: "50", label: "Creators" },
                  { value: "3", label: "Months" },
                ]}
              />

              <ResultCard
                locked
                company="Aonic"
                logo="/logos/aonic.png"
                views="31M+"
                viewsSub="30 days / 6 creators"
                miniStats={[
                  { value: "31M+", label: "Views" },
                  { value: "6", label: "Creators" },
                  { value: "30", label: "Days" },
                ]}
              />

              <ResultCard
                locked
                company="Fable"
                logo="/logos/fable.png"
                views="25M+"
                viewsSub="4 weeks / 3 creators"
                miniStats={[
                  { value: "25M+", label: "Total views" },
                  { value: "3", label: "Creators" },
                  { value: "30", label: "Days" },
                ]}
              />

              <ResultCard
                locked
                company="BlackBox AI"
                logo="/logos/blackbox.png"
                views="15M+"
                viewsSub="20 days / 40-60 paid-organic mix"
                miniStats={[
                  { value: "15M+", label: "Views" },
                  { value: "420", label: "Paid ads" },
                  { value: "20", label: "Days" },
                  { value: "40/60", label: "Paid/organic" },
                ]}
              />

              <ResultCard
                locked
                company="Makon AI"
                logo="/logos/makon.png"
                views="11M+"
                viewsSub="2 months / 8 creators"
                miniStats={[
                  { value: "11M+", label: "Views" },
                  { value: "8", label: "Creators" },
                  { value: "60", label: "Days" },
                ]}
              />

              <ResultCard
                locked
                company="Codédex"
                logo="/logos/codedex.png"
                views="10M+"
                viewsSub="2 months"
                miniStats={[
                  { value: "10M+", label: "Views" },
                  { value: "4", label: "Creators" },
                  { value: "60", label: "Days" },
                ]}
              />
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
                  <div className="text-xs text-text-dim font-semibold uppercase tracking-wide mt-1.5">
                    Co-Founder
                  </div>
                  <div className="flex items-center gap-1 text-sm text-text-secondary mt-1.5 mb-4">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                    </svg>
                    {t.location}
                  </div>
                  <div className="text-[15px] font-bold italic text-text">
                    {t.statLine}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
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
