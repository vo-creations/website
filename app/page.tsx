"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Nav, { NAV_CONTAINER, NAV_INNER_PADDING } from "@/components/Nav";
import Footer from "@/components/Footer";
import CTABlock from "@/components/CTABlock";
import Label from "@/components/Label";
import ResultCard from "@/components/ResultCard";
import LogoImage from "@/components/LogoImage";
import InstagramEmbed from "@/components/InstagramEmbed";
import TikTokEmbed from "@/components/TikTokEmbed";
import FacebookEmbed from "@/components/FacebookEmbed";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import HeroStoryCard from "@/components/HeroStoryCard";
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
  const value = useCountUp(target, trigger, STATS_COUNT_DURATION);
  return <>{format(value)}</>;
}

const heroStats = [
  { target: 1000, format: (n: number) => (n >= 1000 ? "1B+" : `${n}M+`), label: "Views generated" },
  { target: 30, format: (n: number) => `${n}+`, label: "Brands scaled" },
  { target: 500, format: (n: number) => `${n}+`, label: "Trained creators" },
  { target: 9, format: (n: number) => `${n}`, label: "Days to launch" },
];

const steps = [
  {
    num: "01",
    title: "Apply and qualify",
    desc: "We review your product, audience, and goals. Not every brand is a fit, and we'll be honest about it.",
    time: "Day 1",
  },
  {
    num: "02",
    title: "Strategy + creator matching",
    desc: "Campaign brief, format strategy, handpicked creators from our trained network. Not a marketplace.",
    time: "Days 1-2",
  },
  {
    num: "03",
    title: "Account warmup + launch",
    desc: "Creators warm up accounts and go live. 180 videos across TikTok, Instagram, YouTube, and Facebook.",
    time: "Days 3-9",
  },
  {
    num: "04",
    title: "Optimize with the VoC Method",
    desc: "Weekly format testing: try 7 formats, cut the bottom 4, triple down on winners. The methodology behind our 24M-view campaign.",
    time: "Ongoing weekly",
  },
  {
    num: "05",
    title: "Review + scale",
    desc: "Monthly performance review with your team. What's working, what's next, whether to scale up.",
    time: "Month end",
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
}[] = [
  // DECISION: interleaved by platform (not grouped) so consecutive cards are
  // usually different platforms — Instagram is the majority (11 of 17) so a
  // few adjacent IG-IG pairs are unavoidable, but nothing is ever blocked
  // together in a long run. Zero self-hosted mp4s — every entry is a real
  // platform embed. New additions get folded into the existing order, not
  // appended at the end. See docs/DECISIONS.md (topic: showcase-marquee).
  { type: "instagram", url: "https://www.instagram.com/p/DXSp7ttDH9D/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DYaCAFXvnPw/", label: "Instagram" },
  { type: "tiktok", url: "https://www.tiktok.com/@jacobw.health/video/7644976113755622686", label: "TikTok" },
  { type: "instagram", url: "https://www.instagram.com/p/DVzqq6eEVMt/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DXE2rDtE2lI/", label: "Instagram" },
  { type: "youtube", url: "https://www.youtube.com/shorts/urpg-ygRKto", label: "YouTube" },
  { type: "instagram", url: "https://www.instagram.com/p/DZ6qfKHRJG6/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DWtNDXqjl3I/", label: "Instagram" },
  { type: "facebook", url: "https://www.facebook.com/reel/1604299521120091", label: "Facebook" },
  { type: "instagram", url: "https://www.instagram.com/p/DaJ2O4ON_uK/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DTRCvh2E1Lu/", label: "Instagram" },
  { type: "tiktok", url: "https://www.tiktok.com/@codewithsam4/video/7636811053304728853", label: "TikTok" },
  { type: "instagram", url: "https://www.instagram.com/p/DUMI_NwD0Xa/", label: "Instagram" },
  { type: "instagram", url: "https://www.instagram.com/p/DY5IDHqknw4/", label: "Instagram" },
  { type: "tiktok", url: "https://www.tiktok.com/@liftwithpeej/video/7643895537434971422", label: "TikTok" },
  { type: "instagram", url: "https://www.instagram.com/p/DXzgEEwRXm2/", label: "Instagram" },
  { type: "youtube", url: "https://www.youtube.com/shorts/k1NNFSkVAgs", label: "YouTube" },
];

const trustedBrands: { name: string; file: string; needsChip?: boolean }[] = [
  { name: "Aonic", file: "aonic.png" },
  { name: "BlackBox AI", file: "blackbox.png" },
  { name: "Causes", file: "causes.png" },
  { name: "Codedex", file: "codedex.png" },
  { name: "Cooksat", file: "cooksat.png" },
  { name: "Dealism", file: "dealism.png" },
  { name: "Dubbing", file: "dubbing.png" },
  { name: "Fable", file: "fable.png" },
  { name: "Higgsfield", file: "higgsfield.png" },
  { name: "Hyperknow", file: "hyperknow.png" },
  { name: "Kicker", file: "kicker.png" },
  { name: "Kortix", file: "kortix.png" },
  { name: "Liftoff", file: "liftoff.png" },
  { name: "Makon AI", file: "makon1.png" },
  { name: "Notta", file: "notta.png" },
  { name: "Softr", file: "softr.png" },
  { name: "Tomo", file: "tomo.png" },
  { name: "Yorby", file: "yorby.png" },
];

// DECISION: trimmed from 8 questions to 6 — removed the guarantee question
// (referenced a "1M organic views or 50% refund" guarantee that was pulled
// off the page entirely, leaving it contradicting content that no longer
// exists) and the "see past campaigns" question (redundant with the Case
// Studies section directly above this one on the page). See
// docs/DECISIONS.md (topic: faq-restyle).
const agencyFaqs = [
  { q: "How many creators will be on my campaign?", a: "3 vetted creators at $10,000/mo, 6 at $20,000/mo. Every creator is trained through our program. No freelancers." },
  { q: "What's the investment?", a: "Starting at $10,000/mo for 3 vetted creators and 180 videos. $20,000/mo unlocks 6 creators and double the output. Paid upfront, no hidden fees." },
  { q: "What platforms do you post on?", a: "TikTok, Instagram Reels, YouTube Shorts, and Facebook. All four platforms, simultaneously." },
  { q: "How quickly can a campaign start?", a: "9 days from signed contract to first videos going live. Strategy and creator matching happen in Days 1-2." },
  { q: "What happens if creators underperform?", a: "We cut underperformers and replace them. That's the VoC Method. Test 7 formats, keep the winners, triple down." },
  { q: "How is this different from hiring freelance creators?", a: "Our creators are trained through a 2-month in-house program. They know our format system, they've been tested, and they work as a coordinated team, not solo freelancers." },
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
    detailLine: "Led students to $1M in earnings & 500M+ views",
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
      "Creator-economy operator. Built and managed campaigns that generated over 500M+ views & millions of users across consumer apps. Also generated 150M+ views as a creator and $200K+ in earnings",
    image: "/videos/team-daniel.jpg",
    imagePosition: "center",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Nav />

      {/* HERO — two columns from `xl` up (copy left, story card right), both living
          inside the same NAV_CONTAINER-capped wrapper so their widths are a real
          proportional split rather than the text column claiming the full 1100px
          and the card floating in whatever margin happens to be left outside it —
          that version clipped/crowded the card at common laptop widths (1280-1440px)
          because the leftover outer margin was too thin. Left column now caps at
          max-w-[620px] so the right column always has real dedicated space; verified
          no overlap at 1280/1440/1600/1920 after the change (previously verified at
          those same widths and still found it too tight). Collapses to a single
          centered column below `xl` (card hidden, not stacked — see
          docs/DECISIONS.md, topic: hero-floating-card, for why hidden was chosen).
          Headline is Inter (not the Bricolage display font) at heavy weight, normal
          case — small-caps at this size on a heavy display font read blocky/circus-
          like; small-caps stays reserved for the small tagline usage in Nav/Footer. */}
      <section className="min-h-screen flex flex-col justify-center pt-[160px] pb-20 relative overflow-hidden">
        <div className={`relative z-10 ${NAV_CONTAINER} mx-auto ${NAV_INNER_PADDING}`}>
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-12 xl:gap-10">
            <div className="flex flex-col items-start text-left xl:max-w-[620px]">
              <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 mb-8 animate-fade-up">
                <span className="text-white text-[10px] leading-none">✦</span>
                <span className="text-[12px] font-semibold text-text-secondary tracking-wide">
                  The Team Behind 1B+ Views
                </span>
                <span className="text-white text-[10px] leading-none">✦</span>
              </div>

              <h1 className="font-sans text-[clamp(40px,5.5vw,68px)] font-extrabold leading-[1.05] tracking-tighter mb-6 animate-fade-up-delay-1 text-text">
                make them remember.
              </h1>

              <p className="text-[clamp(16px,2.2vw,20px)] text-text-secondary max-w-[560px] leading-relaxed mb-10 animate-fade-up-delay-2">
                Scale your B2C product with your own world-class{" "}
                <span className="whitespace-nowrap">in-house</span> UGC program.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
                <a
                  href="https://calendar.app.google/8x72A8nxr3gQpVfx7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-transparent text-white font-bold text-base px-9 py-4 rounded-full border border-white hover:bg-white/10 hover:-translate-y-0.5 transition-all"
                >
                  Let&apos;s Talk
                  <Image
                    src="/vocreations-mark-white.png"
                    alt=""
                    width={18}
                    height={19}
                    className="w-[15px] h-auto"
                  />
                </a>
                <a
                  href="#results"
                  className="inline-flex items-center gap-2 bg-transparent text-white font-medium text-base px-9 py-4 rounded-full border border-white hover:bg-white/10 transition-all"
                >
                  See results →
                </a>
              </div>

              <div
                ref={statsRef}
                className="grid grid-cols-2 sm:flex sm:flex-row sm:gap-14 mt-[64px] sm:mt-[72px] w-full max-w-[320px] sm:w-auto sm:max-w-none animate-fade-up-delay-4"
              >
                {heroStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`text-left py-6 sm:py-0 ${
                      i % 2 === 0 ? "border-r border-border sm:border-r-0" : ""
                    } ${i < 2 ? "border-b border-border sm:border-b-0" : ""}`}
                  >
                    <div className="text-[28px] sm:text-[32px] font-extrabold tracking-tighter leading-none text-text tabular-nums">
                      <StatCounter target={stat.target} trigger={statsInView} format={stat.format} />
                    </div>
                    <div className="text-[11px] font-medium text-text-dim tracking-wide uppercase mt-2">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Story card — decorative, aria-hidden, hidden below `xl` (same growth
                clips/numbers already exist non-decoratively further down the page). */}
            <div
              aria-hidden="true"
              className="hidden xl:block w-[264px] shrink-0 animate-float"
            >
              <HeroStoryCard />
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY — marquee with real client logos, all recolored to transparent-
          background white/monochrome (or kept in original brand color where the
          source icon is multi-color, e.g. Causes, Fable). needsChip is an escape
          hatch for a source that can't be cleanly color-keyed (unused currently —
          the prior Liftoff asset needed it, the official vector doesn't). */}
      <section className="pb-[80px]">
        <div className="max-w-[900px] mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="text-white text-[10px] leading-none">✦</span>
            <span className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.2em]">
              Trusted by
            </span>
            <span className="text-white text-[10px] leading-none">✦</span>
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
                  boxClassName="w-[130px] h-14"
                />
              )
            )}
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
            Content that goes viral
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
                {v.type === "tiktok" && <TikTokEmbed url={v.url} label={v.label} />}
                {v.type === "facebook" && <FacebookEmbed url={v.url} label={v.label} />}
                {v.type === "youtube" && <YouTubeEmbed url={v.url} label={v.label} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

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

          <div className="flex flex-col gap-4">
            {/* Ordered by view count, highest to lowest. Liftoff/Higgsfield/Aonic
                have no real quote or challenge/approach/result narrative on file —
                their expanded state is the factual miniStats grid only, same as
                the other four, just without invented prose. */}
            <ResultCard
              company="Liftoff"
              logo="/logos/liftoff.png"
              views="151M+"
              viewsSub="3 months / 50 creators"
              miniStats={[
                { value: "151M+", label: "Views" },
                { value: "50", label: "Creators" },
                { value: "3", label: "Months" },
              ]}
            />

            <ResultCard
              company="Higgsfield"
              logo="/logos/higgsfield.png"
              views="65M+"
              viewsSub="30 days / 45 creators"
              miniStats={[
                { value: "65M+", label: "Views" },
                { value: "45", label: "Creators" },
                { value: "30", label: "Days" },
              ]}
            />

            <ResultCard
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
              company="Fable"
              logo="/logos/fable.png"
              views="25.4M"
              viewsSub="4 weeks / 3 creators"
              challenge="Break through in competitive book discovery. Traditional marketing wasn't reaching Gen Z readers where they spend time."
              approach="3 creators, 180 videos, 4 platforms. Applied the VoC Method: 7 format experiments in week 1, tracked performance, cut the bottom 4 formats, tripled down on the winners. One talking-head format hit 3.5M views. Every creator pivoted."
              result="25.4M total views in 30 days. The methodology that now powers every VoC campaign was born here."
              miniStats={[
                { value: "180", label: "Videos" },
                { value: "3", label: "Creators" },
                { value: "25.4M", label: "Total views" },
                { value: "30", label: "Days" },
              ]}
            />

            <ResultCard
              company="BlackBox AI"
              logo="/logos/blackbox.png"
              views="11.5M"
              viewsSub="20 days / 40-60 paid-organic mix"
              challenge="AI coding tools are niche and intimidating for mass short-form audiences. Traditional ads triggered ad blindness."
              approach="UGC-first paid ads designed to look identical to organic creator content. Problem → payoff storytelling: open with relatable pain (debugging frustration, time pressure), show BlackBox AI as the unlock. 420 paid ad variations tested with a 40/60 paid-to-organic content mix."
              result="11.5M organic views in just 20 days. 420 paid ads produced and deployed at scale. Strong engagement from developers, students, and builders asking workflow questions and tagging peers."
              miniStats={[
                { value: "11.5M", label: "Views" },
                { value: "420", label: "Paid ads" },
                { value: "20", label: "Days" },
                { value: "40/60", label: "Paid/organic" },
              ]}
            />

            <ResultCard
              company="Makon AI"
              logo="/logos/makon1.png"
              views="10.2M"
              viewsSub="2 months / 8 creators"
              challenge="SAT prep is perceived as boring and transactional. Most competitors relied on dense demos and jargon that students scrolled past."
              approach="Creator-led talking-head videos that felt personal and raw. Students speaking to students. Story-first, product-second: open with emotional tension (stress, burnout, parental pressure), then naturally introduce Makon AI as the turning point."
              result="10.2M organic views in 2 months. Comment sections filled with students asking questions, sharing stress, and tagging friends. Makon positioned as a modern, student-first SAT solution."
              miniStats={[
                { value: "10.2M", label: "Views" },
                { value: "8", label: "Creators" },
                { value: "60", label: "Days" },
                { value: "Gen Z", label: "Audience" },
              ]}
            />

            <ResultCard
              company="Codedex"
              logo="/logos/codedex.png"
              views="10M+"
              viewsSub="2 months"
              challenge="Reach Gen Z developers. Technical audience, hard to engage with traditional marketing."
              approach="Matched creators who are actual developers from our network. Content that spoke the audience's language authentically."
              result="10M+ views in 2 months. Strong community engagement and meaningful user acquisition."
              miniStats={[
                { value: "10M+", label: "Views" },
                { value: "4", label: "Platforms" },
                { value: "60", label: "Days" },
                { value: "Gen Z", label: "Audience" },
              ]}
            />
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

      {/* TEAM */}
      <section className="py-[100px]" id="team">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>The team</Label>
          <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-10">
            Proven Viral Creators, Turned Agency Operators
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {team.map((t) => (
              <div
                key={t.name}
                className="bg-bg-card rounded-2xl border border-border overflow-hidden"
              >
                <div className="relative aspect-square bg-bg-elevated">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
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

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

      {/* HOW IT WORKS */}
      <section className="py-[100px]">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>How it works</Label>
          <h2 className="font-display text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            From signed to viral in 9 days
          </h2>
          <p className="text-base text-text-secondary mb-10">
            A methodology refined across 50+ campaigns. Not a black box.
          </p>

          <div className="flex flex-col gap-5">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-5 items-start">
                <div className="w-11 h-11 min-w-[44px] bg-bg-elevated rounded-[10px] flex items-center justify-center text-[15px] font-bold text-text">
                  {s.num}
                </div>
                <div>
                  <h4 className="text-[17px] font-bold tracking-tight mb-1">
                    {s.title}
                  </h4>
                  <p className="text-[15px] text-text-secondary leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="text-xs text-text-dim mt-1 font-medium">
                    {s.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

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
            {agencyFaqs.map((faq, i) => (
              <div
                key={i}
                className="border border-border rounded-2xl px-6 py-5 bg-bg-card"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left gap-4"
                >
                  <span className="text-base font-semibold tracking-tight">
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-secondary transition-transform ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3.5 h-3.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="mt-3 text-[15px] text-text-secondary leading-[1.7] pr-10">
                    {faq.a}
                  </div>
                )}
              </div>
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
