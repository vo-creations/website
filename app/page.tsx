"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CTABlock from "@/components/CTABlock";
import ResultCard from "@/components/ResultCard";
import CaseStudiesLockOverlay from "@/components/CaseStudiesLockOverlay";
import LogoImage from "@/components/LogoImage";
import InstagramEmbed from "@/components/InstagramEmbed";
import TikTokEmbed from "@/components/TikTokEmbed";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { useCountUp } from "@/components/useCountUp";
import { CountText, MaskText, Reveal, useOnceVisible } from "@/components/motion";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";

// DECISION: both auto-scroll marquees (Trusted By, Content that goes viral)
// mask their edges so items fade into darkness instead of hard-cutting at the
// container boundary — applied to the `overflow-hidden` wrapper, not the
// scrolling track, so it doesn't move with the animation. Needs both the
// unprefixed and -webkit- properties; Safari doesn't support unprefixed
// mask-image yet. See docs/DECISIONS.md (topic: marquee-polish).
const EDGE_FADE_MASK =
  "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)";
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

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2F0EB]";
const FOCUS_LIGHT = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function PaperHeading({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <div className="mb-12 grid gap-4 md:mb-16 md:grid-cols-[160px_minmax(0,1fr)] md:items-end md:gap-10">
      <Reveal>
        <p className="text-[13px] font-medium text-white/60">{kicker}</p>
      </Reveal>
      <h2 className="font-serif text-[clamp(40px,6vw,84px)] leading-[0.95] tracking-[-0.03em] text-[#F2F0EB]">
        {typeof children === "string" ? <MaskText text={children} /> : children}
      </h2>
    </div>
  );
}

// DECISION 2026-10: seven native 9:16 clips in a CSS coverflow.
// The first poster is the LCP image. Only the front clip mounts a video.
// See docs/DECISIONS.md (topic: hero-coverflow-2026-10).
// Order interleaves the original four with three creator trims:
// post-1, creator-success, post-2, creator-example (desk), post-4,
// creator-example (screen), post-3.
const heroClips = [
  { src: "/videos/hero-clip-1.mp4", poster: "/videos/hero-clip-1.jpg" },
  { src: "/videos/hero-clip-5.mp4", poster: "/videos/hero-clip-5.jpg" },
  { src: "/videos/hero-clip-2.mp4", poster: "/videos/hero-clip-2.jpg" },
  { src: "/videos/hero-clip-6.mp4", poster: "/videos/hero-clip-6.jpg" },
  { src: "/videos/hero-clip-3.mp4", poster: "/videos/hero-clip-3.jpg" },
  { src: "/videos/hero-clip-7.mp4", poster: "/videos/hero-clip-7.jpg" },
  { src: "/videos/hero-clip-4.mp4", poster: "/videos/hero-clip-4.jpg" },
];

function HeroFilm() {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (y < 8) {
        copy.style.opacity = "";
        copy.style.transform = "";
        return;
      }
      const view = window.innerHeight || 1;
      const p = Math.min(1, y / (view * 0.9));
      copy.style.opacity = String(1 - p * 0.92);
      copy.style.transform = `translate3d(0, ${p * -16}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="bg-[#0B0B0C] px-6 pb-16 pt-28 text-white md:px-14 md:pb-24 md:pt-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-8 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] xl:gap-6">
        <div ref={copyRef} className="hero-enter min-w-0">
          <p className="mb-5 flex items-center gap-3 text-[13px] font-medium tracking-[0.04em] text-[#e7e7e4] md:text-[15px]">
            <span className="h-px w-7 bg-[#c8c8c4]" aria-hidden="true" />
            The in-house UGC agency backed by elite mentorship
          </p>
          <h1 className="max-w-[12ch] text-white">
            <span className="sr-only">Organic UGC for AI and tech apps. Make them remember.</span>
            <span aria-hidden="true" className="block font-display text-[clamp(56px,6.4vw,104px)] font-medium leading-[0.86] tracking-[-0.055em]">
              make them
            </span>
            <span aria-hidden="true" className="mt-1 block font-serif text-[clamp(60px,6.6vw,108px)] italic leading-[0.84] tracking-[-0.03em] text-[#f4f1ea]">
              <MaskText text="remember." />
            </span>
          </h1>
          <p className="mt-7 max-w-[22rem] text-[17px] font-medium leading-[1.45] text-[#f3f3f0] sm:max-w-none md:text-[19px]">
            1000+ vetted in-house creators.
            <br className="sm:hidden" /> We guarantee your target CPM.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="https://calendar.app.google/8x72A8nxr3gQpVfx7"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center rounded-full bg-[#f2f2f0] px-7 text-[15px] font-medium text-black ${FOCUS_LIGHT}`}
            >
              Book a call
            </a>
            <a
              href="#proof"
              className={`inline-flex min-h-11 items-center text-[15px] font-medium text-white underline decoration-white/40 underline-offset-4 ${FOCUS_LIGHT}`}
            >
              See results
            </a>
          </div>
        </div>
        <HeroCarousel clips={heroClips} />
      </div>
    </section>
  );
}

const heroStats = [
  { target: 1000, format: (n: number) => (n >= 1000 ? "1B+" : `${n}M+`), label: "Views generated" },
  { target: 5, format: (n: number) => `${n}M+`, label: "Users converted" },
  { target: 1000, format: (n: number) => `${n}+`, label: "Trained creators" },
  { target: 14, format: (n: number) => (n >= 14 ? "10–14" : `${n}`), label: "Days to post" },
];

const steps = [
  { num: "Day 0", title: "Scripts", desc: "We write the scripts." },
  { num: "~48h", title: "Brief", desc: "Creators briefed." },
  { num: "10–14 days", title: "Live", desc: "Accounts warmed up, first videos live." },
  { num: "Every week", title: "Double down", desc: "Double down on the top videos." },
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
// creators, scripts, posting, creator bonuses, daily Slack reporting). Bonuses are
// not a second invoice. We guarantee the client's target CPM. Videos under
// 1,000 views do not count toward the spend. 90-day minimum, then month to
// month. No refunds after launch. No monthly video count.
// See docs/DECISIONS.md (topic: pricing-2026-10, topic: no-video-count-2026-10).
const agencyFaqs = [
  { q: "What is the investment?", a: "Campaigns start at $50K+ a month, all-inclusive: trained creators, scripts, posting, creator bonuses, and daily Slack reporting. CPM means cost per 1,000 organic views. We guarantee your target CPM. Videos under 1,000 views do not count toward your CPM. Paid media, the ad spend, is outside the fee and billed on top. The minimum is 90 days, then month to month. No refunds after launch." },
  { q: "Is paid media included?", a: "Paid media, the ad spend, is outside the fee and billed on top. The monthly fee already includes creator bonuses." },
  { q: "Do you offer refunds?", a: "No refunds after launch. The minimum is 90 days, then month to month." },
  { q: "How long do results take?", a: "First posts go live in 10–14 days. The minimum is 90 days so accounts can warm up and a few testing cycles can find the format. After that it is month to month." },
  { q: "Where do the videos post?", a: "TikTok, Instagram, YouTube, Facebook, and Snapchat. The format is organic talking-head UGC." },
  { q: "How do you report results?", a: "Every client gets a daily report in a shared Slack channel: spend against budget, total views, posts, active creators, CPM, engagement rate, and the top creators from the last 7 days. Each week we double down on the top videos." },
  { q: "Who owns the videos?", a: "You do. You own every video we make for your campaign." },
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
      "Grew his own Instagram past 70K followers. His students have earned $1M+ and generated 500M+ views. Brands at Vo Creations get that same system.",
    image: "/videos/team-thienvu.jpg",
    webp: "/videos/team-thienvu.webp",
    // DECISION 2026-10: color 890×1087 head-and-shoulders. The card is 4:5
    // and this file already fills it, so object-position stays center.
    // Grayscale is the CSS filter, same as Daniel. See docs/DECISIONS.md
    // (topic: thienvu-photo-2026-10).
    imagePosition: "center",
  },
  {
    name: "Daniel Yun",
    location: "Los Angeles, CA",
    statLine: "",
    detailLine:
      "He started on camera: 150M+ views and $200K+ earned from his own content. His campaigns for consumer apps have reached 500M+ views and 5M+ users.",
    image: "/videos/team-daniel.jpg",
    imagePosition: "center",
  },
];

function FounderPhoto({ children }: { children: React.ReactNode }) {
  const { ref, on } = useOnceVisible<HTMLDivElement>();
  return (
    <div ref={ref} className={`photo-in relative aspect-[4/5] overflow-hidden bg-[#151517] ${on ? "is-in" : ""}`}>
      {children}
    </div>
  );
}

function ProofRow({ figure, detail, index }: { figure: string; detail: string; index: number }) {
  const { ref, on } = useOnceVisible<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal border-t border-white/10 pt-6 ${on ? "is-in" : ""}`}
      style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
    >
      <div className="font-serif text-[clamp(48px,5vw,80px)] leading-[0.92] tracking-[-0.03em] text-[#F2F0EB] tabular-nums">
        <CountText text={figure} trigger={on} />
      </div>
      <p className="mt-4 max-w-[28rem] text-[17px] leading-snug text-white/60">{detail}</p>
    </div>
  );
}

function SlackReport() {
  const { ref, on } = useOnceVisible<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal relative overflow-hidden rounded-md border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.5)] ${on ? "is-in" : ""}`}
    >
      <picture>
        <source srcSet="/proof/slack-report.webp" type="image/webp" />
        <img
          src="/proof/slack-report.png"
          alt="Example of the daily Slack campaign report, with numbers blurred."
          width={1800}
          height={856}
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </picture>
      <span aria-hidden="true" className={`budget-wipe ${on ? "is-in" : ""}`} />
    </div>
  );
}

export default function Home() {
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>();
  const [openFaq, setOpenFaq] = useState<string | null>(agencyFaqs[0].q);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Nav />
      <main id="main">
      <HeroFilm />
      <div className="paper-page bg-[#0B0B0C] text-[#F2F0EB]">

      <section className="px-6 pb-8 pt-6 md:px-14 md:pt-10">
        <div
          ref={statsRef}
          className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-10 md:grid-cols-4"
        >
          {heroStats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 70} className={index ? "border-white/10 md:border-l md:pl-8" : ""}>
              <div className="font-serif text-[clamp(40px,5vw,72px)] font-normal leading-none tracking-[-0.03em] text-[#F2F0EB] tabular-nums">
                <StatCounter target={stat.target} trigger={statsInView} format={stat.format} />
              </div>
              <div className="mt-3 text-[15px] text-white/60">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#111113] px-6 py-24 md:px-14 md:py-32" id="testimonials">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="Testimonials">What teams say</PaperHeading>
          <div className="grid items-stretch gap-10 md:grid-cols-3 md:gap-12">
            <Reveal delay={0} className="h-full">
            <figure className="flex h-full flex-col border-t border-white/10 pt-6">
              <blockquote className="flex-1 font-serif text-[clamp(22px,2vw,28px)] leading-[1.25] text-[#F2F0EB]">
                <p>&ldquo;&hellip;helped us go from 1&rarr;100 with UGC and is one of the best agency owners in the space.&rdquo;</p>
                <p className="mt-4">&ldquo;&hellip;the UGC agency we trust most in the space.&rdquo;</p>
              </blockquote>
              <figcaption className="mt-6 text-[15px] text-white/60">Team at an AI creative app</figcaption>
            </figure>
            </Reveal>
            <Reveal delay={80} className="h-full">
            <figure className="flex h-full flex-col border-t border-white/10 pt-6">
              <blockquote className="flex-1 font-serif text-[clamp(22px,2vw,28px)] leading-[1.25] text-[#F2F0EB]">
                &ldquo;Great engagement btw boys. You guys are doing a great job keeping your team engaged, and we love the quality of your creators and coaches.&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-[15px] text-white/60">Team at a top-3 finance app</figcaption>
            </figure>
            </Reveal>
            <Reveal delay={160} className="h-full">
            <figure className="flex h-full flex-col border-t border-white/10 pt-6">
              <blockquote className="flex-1 font-serif text-[clamp(22px,2vw,28px)] leading-[1.25] text-[#F2F0EB]">
                &ldquo;&hellip;has helped scale our UGC efforts from 0 to 100 and is one of the best talents in this space.&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-[15px] text-white/60">Team at a consumer app</figcaption>
            </figure>
            </Reveal>
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
      <section className="border-y border-white/10 px-6 py-8 md:px-14">
        <div className="mx-auto grid max-w-[1280px] items-center gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          <h2 className="text-[13px] font-medium text-white/60">
            Brands we&apos;ve worked with
          </h2>
          <div className="overflow-hidden" style={edgeFadeStyle}>
            {/* DECISION 2026-10: monochrome on the dark field is white, this track only. Creator posters stay in color.
                Each half includes the same trailing gap so translateX(-50%) loops without a jump. */}
            <div className="flex w-max items-center animate-scroll motion-reduce:animate-none [&_img]:brightness-0 [&_img]:invert [&_img]:opacity-80">
              <div className="flex items-center gap-x-12 pr-12">
              {trustedBrands.map((brand) => (
                <LogoImage
                  key={brand.name}
                  src={`/logos/${brand.file}`}
                  alt={`${brand.name} logo`}
                  boxClassName="h-[32px] w-auto"
                />
              ))}
              </div>
              <div className="flex items-center gap-x-12 pr-12" aria-hidden="true">
                {trustedBrands.map((brand) => (
                  <LogoImage
                    key={`${brand.name}-loop`}
                    src={`/logos/${brand.file}`}
                    alt=""
                    boxClassName="h-[32px] w-auto"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="bg-[#111113] px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="Proof">Numbers from recent campaigns</PaperHeading>
          <Reveal>
            <p className="mb-12 max-w-[40rem] text-[17px] leading-relaxed text-white/60">
              Vo Creations campaign results. Results are anonymized. Logos are brands we&apos;ve worked with. Typical campaigns land under $3 CPM.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {[
              { figure: "130M+", detail: "An AI app, 3 months" },
              { figure: "#3 in Finance", detail: "A finance app. 3M+ users. Sub-$4 CPM." },
              { figure: "174M+", detail: "A consumer app at a $0.82 CPM" },
              { figure: "$968k ARR", detail: "Driven for one app" },
            ].map((item, index) => (
              <ProofRow key={item.detail} figure={item.figure} detail={item.detail} index={index} />
            ))}
          </div>
          <figure className="mt-20 grid items-end gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)] md:gap-16">
            <Reveal>
              <figcaption className="text-[17px] leading-relaxed text-white/60">
                Every client gets this report in Slack, daily.
              </figcaption>
            </Reveal>
            <SlackReport />
          </figure>
        </div>
      </section>

      <section className="px-6 py-24 md:px-14 md:py-32" id="pricing">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="Pricing">The program: $50K+/mo, all-inclusive.</PaperHeading>
          <div className="grid items-stretch gap-12 border-t border-white/10 pt-10 md:grid-cols-3 md:gap-16">
            <Reveal delay={0} className="h-full">
            <div className="flex h-full flex-col">
              <h3 className="mb-4 text-[15px] font-medium text-white/60">Creators</h3>
              <p className="text-[16px] leading-relaxed text-white/60">
                1000+ vetted in-house creators trained through mentorship. They finish a two-week paid trial before they touch a brand account. We keep the top 1%. They post talking-head video on TikTok, Instagram, YouTube, Facebook, and Snapchat.
              </p>
            </div>
            </Reveal>
            <Reveal delay={80} className="h-full">
            <div className="flex h-full flex-col">
              <p className="mb-4 font-serif text-[64px] leading-none tracking-[-0.04em] text-[#F2F0EB]">$50K+/mo</p>
              <h3 className="mb-4 text-[15px] font-medium text-white/60">What&apos;s included</h3>
              <p className="text-[16px] leading-relaxed text-white/60">
                Trained creators, scripts, posting, creator bonuses, and daily Slack reporting. Paid media, the ad spend, is outside the fee and billed on top. First posts in 10–14 days.
              </p>
            </div>
            </Reveal>
            <Reveal delay={160} className="h-full">
            <div className="flex h-full flex-col">
              <h3 className="mb-4 text-[15px] font-medium text-white/60">Terms</h3>
              <p className="text-[16px] leading-relaxed text-white/60">
                90-day minimum, then month to month. No refunds after launch. You own every video. We guarantee your target CPM. CPM means cost per 1,000 organic views. Videos under 1,000 views don&apos;t count toward your CPM.
              </p>
            </div>
            </Reveal>
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
      <section className="bg-[#0B0B0C] px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="Our work">Content that converts and goes viral.</PaperHeading>
          <Reveal>
          <p className="-mt-6 mb-12 max-w-[40rem] text-[17px] leading-relaxed text-white/60">
            Real UGC from our trained creator network across TikTok, Instagram, YouTube, Facebook, and Snapchat.
          </p>
          </Reveal>
        </div>

        <div className="overflow-hidden" style={edgeFadeStyle}>
          <div className="flex w-max items-center animate-scroll-slow hover:[animation-play-state:paused] motion-reduce:animate-none">
            <div className="flex items-center gap-4 pr-4">
            {showcaseVideos
              .filter((v) => v.type !== "facebook" && !(v.type === "instagram" && !v.poster))
              .map((v) => (
                <div key={v.url} className="aspect-[9/16] w-[260px] shrink-0 overflow-hidden sm:w-[280px]">
                  {v.type === "instagram" && (
                    <InstagramEmbed url={v.url} label={v.label} poster={v.poster} posterAlt="A creator speaking to the camera in a vertical Instagram video." />
                  )}
                  {v.type === "tiktok" && <TikTokEmbed url={v.url} label={v.label} thumb={v.thumb} />}
                  {v.type === "youtube" && <YouTubeEmbed url={v.url} label={v.label} />}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 pr-4" aria-hidden="true">
              {showcaseVideos
                .filter((v) => v.type !== "facebook" && !(v.type === "instagram" && !v.poster))
                .map((v) => (
                  <div key={`${v.url}-loop`} className="aspect-[9/16] w-[260px] shrink-0 overflow-hidden sm:w-[280px]">
                    {v.type === "instagram" && <InstagramEmbed url={v.url} label={v.label} poster={v.poster} posterAlt="" />}
                    {v.type === "tiktok" && <TikTokEmbed url={v.url} label={v.label} thumb={v.thumb} />}
                    {v.type === "youtube" && <YouTubeEmbed url={v.url} label={v.label} />}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#151517] px-6 py-24 md:px-14 md:py-32" id="results">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="Case Studies">Undeniable impact.</PaperHeading>
          <div>
            <CaseStudiesLockOverlay href="https://calendar.app.google/8x72A8nxr3gQpVfx7" paper />
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
              ].map((card, index) => (
                <Reveal key={card.label} delay={Math.min(index, 4) * 60}>
                <ResultCard
                  locked
                  paper
                  company={card.label}
                  views={card.views}
                  viewsSub={card.viewsSub}
                />
                </Reveal>
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-14 md:py-32" id="team">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="The team">Proven viral creators turned agency operators</PaperHeading>

          <div className="grid grid-cols-1 items-stretch gap-16 md:grid-cols-2 md:gap-20">
            {team.map((t, index) => (
              <div
                key={t.name}
                className={`flex h-full flex-col ${index === 1 ? "md:mt-24" : ""}`}
              >
                <FounderPhoto>
                  {"webp" in t && t.webp ? (
                    <picture>
                      <source srcSet={t.webp} type="image/webp" />
                      <img
                        src={t.image}
                        alt={t.name}
                        className="absolute inset-0 h-full w-full object-cover grayscale"
                        style={{ objectPosition: t.imagePosition }}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  ) : (
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 480px"
                      className="object-cover grayscale"
                      style={{ objectPosition: t.imagePosition }}
                    />
                  )}
                </FounderPhoto>
                <div className="flex flex-1 flex-col border-t border-white/10 pt-5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-[32px] leading-none text-[#F2F0EB]">{t.name}</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-white/60">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mt-3 text-[15px] text-white/60">
                    Co-Founder, {t.location}
                  </div>
                  <div className="mt-4 text-[16px] leading-relaxed text-white/60">
                    {t.detailLine}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111113] px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="How it works">From signed to posting in 10–14 days</PaperHeading>
          <Reveal>
          <p className="-mt-6 mb-12 max-w-[40rem] text-[17px] leading-relaxed text-white/60">
            Creators finish a two-week paid trial. We keep the top 1%. Then it runs like this.
          </p>
          </Reveal>

          <div className="grid grid-cols-1 items-stretch gap-10 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, index) => (
              <Reveal key={s.num} delay={index * 70} className="h-full">
              <div className="flex h-full flex-col pt-6">
                <div className="mb-4 text-[15px] text-white/60">
                  {s.num}
                </div>
                <h3 className="mb-3 font-serif text-[32px] leading-none tracking-[-0.02em]">
                  <MaskText text={s.title} />
                </h3>
                <p className="mt-auto text-[16px] leading-relaxed text-white/60">{s.desc}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-14" id="fit">
        <div className="mx-auto grid max-w-[1280px] items-stretch gap-6 md:grid-cols-2 md:gap-10">
          <Reveal className="h-full">
          <div className="flex h-full flex-col border border-white/10 p-8">
            <h2 className="mb-5 font-serif text-[clamp(32px,4vw,44px)] leading-none tracking-[-0.02em]">
              <MaskText text="Good fit" />
            </h2>
            <ul className="space-y-3 text-[16px] leading-relaxed text-white/60">
              {[
                "AI startups and tech consumer apps.",
                "Ready for $50K+ a month.",
                "Want organic short-form at scale, with a CPM target.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0 text-[#7dcea0]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5 9.5 17 19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          </Reveal>
          <Reveal delay={90} className="h-full">
          <div className="flex h-full flex-col border border-white/10 bg-[#151517] p-8">
            <h2 className="mb-5 font-serif text-[clamp(32px,4vw,44px)] leading-none tracking-[-0.02em] text-[#F2F0EB]">
              <MaskText text="Not a fit" />
            </h2>
            <ul className="space-y-3 text-[16px] leading-relaxed text-white/60">
              {["Budgets under $50K a month.", "One-off videos.", "Paid-ads-only management."].map((item) => (
                <li key={item} className="flex gap-3">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-0.5 h-6 w-6 shrink-0 text-[#c47a7a]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M7 7l10 10M17 7 7 17" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ — each question is its own bordered card (rounded-2xl, subtle
          border, internal padding) stacked with a gap, rather than a flat
          list with divider lines between items. See docs/DECISIONS.md
          (topic: faq-restyle). */}
      <section className="bg-[#111113] px-6 py-24 md:px-14 md:py-32" id="faq">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="FAQ">Frequently asked questions</PaperHeading>
          <div className="border-t border-white/10 md:ml-[200px]">
            {agencyFaqs.map((faq, index) => {
              const panelId = `faq-${faq.q.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
              const open = openFaq === faq.q;
              return (
                <Reveal key={faq.q} delay={Math.min(index, 5) * 40}>
                <div className="border-b border-white/10 py-5">
                  <button
                    type="button"
                    className={`flex min-h-11 w-full items-center justify-between gap-4 text-left ${FOCUS}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(open ? null : faq.q)}
                  >
                    <span className="text-[18px] tracking-tight text-[#F2F0EB]">{faq.q}</span>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#F2F0EB] transition-transform ${open ? "rotate-45" : ""}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  <div id={panelId} role="region" hidden={!open} className="mt-3 pr-14 text-[16px] leading-[1.7] text-white/60">
                    {faq.a}
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTABlock paper />
      </div>
      </main>
      <Footer tone="paper" />
    </>
  );
}
