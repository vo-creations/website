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
import Image from "next/image";

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

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#161513]";
const FOCUS_LIGHT = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function PaperHeading({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <div className="mb-12 grid gap-4 md:mb-16 md:grid-cols-[160px_minmax(0,1fr)] md:items-end md:gap-10">
      <p className="text-[13px] font-medium text-[#5c594f]">{kicker}</p>
      <h2 className="font-serif text-[clamp(40px,6vw,84px)] leading-[0.95] tracking-[-0.03em] text-[#161513]">
        {children}
      </h2>
    </div>
  );
}

// DECISION 2026-10: the reel is the hero. Poster is the LCP image. The file
// starts after idle, and stays off when the visitor prefers reduced motion.
// See docs/DECISIONS.md (topic: homepage-editorial-2026-10).
function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionOK, setMotionOK] = useState(false);
  const [controls, setControls] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    let timer = 0;
    let idle = 0;
    const start = () => setMotionOK(true);
    if (typeof window.requestIdleCallback === "function") {
      idle = window.requestIdleCallback(start, { timeout: 1200 });
    } else {
      timer = window.setTimeout(start, 700);
    }
    return () => {
      if (idle) window.cancelIdleCallback(idle);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!motionOK) return;
    videoRef.current?.play().catch(() => {});
  }, [motionOK]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#060606] text-white">
      <img
        src="/videos/hero-reel.jpg"
        alt=""
        width={1280}
        height={720}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {motionOK && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          controls={controls}
          aria-hidden={controls ? undefined : true}
        >
          <source src="/videos/hero-reel.webm" type="video/webm" />
          <source src="/videos/hero-reel.mp4" type="video/mp4" />
        </video>
      )}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.28)_18%,rgba(0,0,0,0.2)_55%,rgba(6,6,6,0.72)_78%,#F2F0EB_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.55)_34%,rgba(0,0,0,0.12)_58%,rgba(0,0,0,0.28)_100%)] md:block"
        aria-hidden="true"
      />
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-16 pt-32 md:px-14 md:pb-24">
        <div className="max-w-[1280px]">
          <p className="mb-5 flex items-center gap-3 text-[13px] font-medium tracking-[0.04em] text-[#e7e7e4] md:text-[15px]">
            <span className="h-px w-7 bg-[#c8c8c4]" aria-hidden="true" />
            The in-house UGC agency backed by elite mentorship
          </p>
          <h1 className="max-w-[12ch] text-white">
            <span className="sr-only">Organic UGC for AI and tech apps. </span>
            <span className="block font-display text-[clamp(64px,11vw,156px)] font-medium leading-[0.86] tracking-[-0.055em]">
              make them
            </span>
            <span className="mt-1 block font-serif text-[clamp(68px,11vw,156px)] italic leading-[0.84] tracking-[-0.03em] text-[#f4f1ea] [text-shadow:0_10px_40px_rgba(0,0,0,0.45)]">
              remember.
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
              Let&apos;s Talk
            </a>
            <a
              href="#proof"
              className={`inline-flex min-h-11 items-center text-[15px] font-medium text-white underline decoration-white/40 underline-offset-4 ${FOCUS_LIGHT}`}
            >
              See results
            </a>
            {motionOK && (
              <button
                type="button"
                onClick={() => setControls((on) => !on)}
                className={`inline-flex min-h-11 items-center rounded-full border border-white/35 bg-black/40 px-4 text-[15px] text-white backdrop-blur ${FOCUS_LIGHT}`}
              >
                {controls ? "Hide controls" : "Video controls"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const heroStats = [
  { target: 1000, format: (n: number) => (n >= 1000 ? "1B+" : `${n}M+`), label: "Views generated" },
  { target: 5, format: (n: number) => `${n}M+`, label: "Users converted" },
  { target: 1000, format: (n: number) => `${n}+`, label: "Trained creators" },
  { target: 14, format: (n: number) => (n >= 14 ? "10-14" : `${n}`), label: "Days to post" },
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
  { q: "How long do results take?", a: "First posts go live in 10-14 days. The minimum is 90 days so accounts can warm up and a few testing cycles can find the format. After that it is month to month." },
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
    image: "/videos/team-thienvu-new.jpg",
    // DECISION 2026-10: file is already a square head-and-shoulders crop.
    // See docs/DECISIONS.md (topic: fourth-pass-2026-10).
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
      <HeroFilm />
      <div className="paper-page bg-[#F2F0EB] text-[#161513]">

      <section className="px-6 pb-8 pt-6 md:px-14 md:pt-10">
        <div
          ref={statsRef}
          className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-10 md:grid-cols-4"
        >
          {heroStats.map((stat, index) => (
            <div key={stat.label} className={index ? "border-[#161513]/15 md:border-l md:pl-8" : ""}>
              <div className="font-serif text-[clamp(40px,5vw,72px)] font-normal leading-none tracking-[-0.03em] text-[#161513] tabular-nums">
                <StatCounter target={stat.target} trigger={statsInView} format={stat.format} />
              </div>
              <div className="mt-3 text-[15px] text-[#5c594f]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 md:px-14 md:py-32" id="testimonials">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="Testimonials">What teams say</PaperHeading>
          <div className="grid items-stretch gap-10 md:grid-cols-3 md:gap-12">
            <figure className="flex h-full flex-col border-t border-[#161513]/15 pt-6">
              <blockquote className="flex-1 font-serif text-[clamp(22px,2vw,28px)] leading-[1.25] text-[#161513]">
                <p>&ldquo;&hellip;helped us go from 1&rarr;100 with UGC and is one of the best agency owners in the space.&rdquo;</p>
                <p className="mt-4">&ldquo;&hellip;the UGC agency we trust most in the space.&rdquo;</p>
              </blockquote>
              <figcaption className="mt-6 text-[15px] text-[#5c594f]">Team at an AI creative app</figcaption>
            </figure>
            <figure className="flex h-full flex-col border-t border-[#161513]/15 pt-6">
              <blockquote className="flex-1 font-serif text-[clamp(22px,2vw,28px)] leading-[1.25] text-[#161513]">
                &ldquo;Great engagement btw boys. You guys are doing a great job keeping your team engaged, and we love the quality of your creators and coaches.&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-[15px] text-[#5c594f]">Team at a top-3 finance app</figcaption>
            </figure>
            <figure className="flex h-full flex-col border-t border-[#161513]/15 pt-6">
              <blockquote className="flex-1 font-serif text-[clamp(22px,2vw,28px)] leading-[1.25] text-[#161513]">
                &ldquo;&hellip;has helped scale our UGC efforts from 0 to 100 and is one of the best talents in this space.&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-[15px] text-[#5c594f]">Team at a consumer app</figcaption>
            </figure>
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
      <section className="border-y border-[#161513]/15 px-6 py-8 md:px-14">
        <div className="mx-auto grid max-w-[1280px] items-center gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          <h2 className="text-[13px] font-medium text-[#5c594f]">
            Brands we&apos;ve worked with
          </h2>
          <div className="overflow-hidden" style={edgeFadeStyle}>
            {/* DECISION 2026-10: monochrome on the paper field is black, this track only. Creator posters stay in color. */}
            <div className="flex w-max items-center gap-x-12 animate-scroll [&_img]:brightness-0">
              {trustedBrands.map((brand) => (
                <LogoImage
                  key={brand.name}
                  src={`/logos/${brand.file}`}
                  alt={`${brand.name} logo`}
                  boxClassName="h-[32px] w-auto"
                />
              ))}
              <div className="flex items-center gap-x-12" aria-hidden="true">
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

      <section id="proof" className="px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="Proof">Numbers from recent campaigns</PaperHeading>
          <p className="mb-12 max-w-[40rem] text-[17px] leading-relaxed text-[#3c3a36]">
            Vo Creations campaign results. Results are anonymized. Logos are brands we&apos;ve worked with. A typical outcome prices under $3 CPM.
          </p>
          <div className="border-t border-[#161513]/15">
            {[
              { figure: "130M+", detail: "An AI app, 3 months" },
              { figure: "#3 in Finance", detail: "A finance app. 3M+ users. Sub-$4 CPM." },
              { figure: "174M+", detail: "A consumer app at a $0.82 CPM" },
              { figure: "$968k ARR", detail: "Driven for one app" },
              { figure: "453M\n123M\n105M", detail: "Three AI apps, 90 days each" },
              { figure: "19.4M", detail: "An AI app, 2 weeks" },
              { figure: "21.5M and 15.9M", detail: "Two apps, 30 days each" },
              { figure: "Under $3 CPM", detail: "Typical for this distribution" },
            ].map((item) => (
              <div key={item.detail} className="grid items-end gap-4 border-b border-[#161513]/15 py-8 md:grid-cols-2 md:gap-16 md:py-10">
                <div className="whitespace-pre-line font-serif text-[clamp(52px,7vw,104px)] leading-[0.9] tracking-[-0.03em] text-[#161513]">
                  {item.figure}
                </div>
                <p className="max-w-md pb-2 text-[17px] leading-snug text-[#3c3a36]">{item.detail}</p>
              </div>
            ))}
          </div>
          <figure className="mt-20 grid items-end gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)] md:gap-16">
            <figcaption className="text-[17px] leading-relaxed text-[#3c3a36]">
              Every client gets this report in Slack, daily.
            </figcaption>
            <div className="overflow-hidden rounded-md border border-[#161513]/10 shadow-[0_30px_80px_rgba(22,21,19,0.12)]">
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
            </div>
          </figure>
        </div>
      </section>

      <section className="px-6 py-24 md:px-14 md:py-32" id="pricing">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="The program">Organic UGC for AI startups and tech consumer apps.</PaperHeading>
          <div className="grid items-stretch gap-12 border-t border-[#161513]/20 pt-10 md:grid-cols-3 md:gap-16">
            <div className="flex h-full flex-col">
              <h3 className="mb-4 text-[15px] font-medium text-[#5c594f]">Creators</h3>
              <p className="text-[16px] leading-relaxed text-[#3c3a36]">
                1000+ vetted in-house creators trained through mentorship. They finish a two-week paid trial before they touch a brand account. We keep the top 1%. They post talking-head video on TikTok, Instagram, YouTube, Facebook, and Snapchat.
              </p>
            </div>
            <div className="flex h-full flex-col">
              <p className="mb-4 font-serif text-[64px] leading-none tracking-[-0.04em] text-[#161513]">$50K+/mo</p>
              <h3 className="mb-4 text-[15px] font-medium text-[#5c594f]">What&apos;s included</h3>
              <p className="text-[16px] leading-relaxed text-[#3c3a36]">
                Trained creators, scripts, posting, creator bonuses, and daily Slack reporting. Paid media, the ad spend, is outside the fee and billed on top. First posts in 10-14 days.
              </p>
            </div>
            <div className="flex h-full flex-col">
              <h3 className="mb-4 text-[15px] font-medium text-[#5c594f]">Terms</h3>
              <p className="text-[16px] leading-relaxed text-[#3c3a36]">
                90-day minimum, then month to month. No refunds after launch. You own every video. We guarantee your target CPM. CPM means cost per 1,000 organic views. Videos under 1,000 views don&apos;t count toward your CPM.
              </p>
            </div>
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
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1280px] px-6 md:px-14">
          <PaperHeading kicker="Our work">Content that converts and goes viral.</PaperHeading>
          <p className="-mt-6 mb-12 max-w-[40rem] text-[17px] leading-relaxed text-[#3c3a36]">
            Real UGC from our trained creator network across TikTok, Instagram, YouTube, Facebook, and Snapchat.
          </p>
        </div>

        <div className="overflow-hidden" style={edgeFadeStyle}>
          <div className="flex w-max items-center gap-4 animate-scroll-slow hover:[animation-play-state:paused]">
            {showcaseVideos
              .filter((v) => v.type !== "facebook" && !(v.type === "instagram" && !v.poster))
              .map((v) => (
                <div key={v.url} className="aspect-[9/16] w-[260px] shrink-0 overflow-hidden sm:w-[280px]">
                  {v.type === "instagram" && (
                    <InstagramEmbed url={v.url} label={v.label} poster={v.poster} posterAlt={`Talking-head UGC still from ${v.url.split("/p/")[1]?.replace("/", "") ?? "Instagram"}`} />
                  )}
                  {v.type === "tiktok" && <TikTokEmbed url={v.url} label={v.label} thumb={v.thumb} />}
                  {v.type === "youtube" && <YouTubeEmbed url={v.url} label={v.label} />}
                </div>
              ))}
            <div className="flex items-center gap-4" aria-hidden="true">
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

      <section className="px-6 py-24 md:px-14 md:py-32" id="results">
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
              ].map((card) => (
                <ResultCard
                  key={card.label}
                  locked
                  paper
                  company={card.label}
                  views={card.views}
                  viewsSub={card.viewsSub}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-14 md:py-32" id="team">
        <div className="mx-auto max-w-[1100px]">
          <PaperHeading kicker="The team">Proven viral creators turned agency operators</PaperHeading>

          <div className="grid grid-cols-1 items-stretch gap-16 md:grid-cols-2 md:gap-20">
            {team.map((t, index) => (
              <div
                key={t.name}
                className={`flex h-full flex-col ${index === 1 ? "md:mt-24" : ""}`}
              >
                <div className="relative aspect-[4/5] bg-[#e6e2da]">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 340px"
                    className="object-cover grayscale"
                    style={{ objectPosition: t.imagePosition }}
                  />
                </div>
                <div className="flex flex-1 flex-col border-t border-[#161513]/15 pt-5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-[32px] leading-none text-[#161513]">{t.name}</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-[#5c594f]">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mt-3 text-[15px] text-[#5c594f]">
                    Co-Founder, {t.location}
                  </div>
                  <div className="mt-4 text-[16px] leading-relaxed text-[#3c3a36]">
                    {t.detailLine}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="How it works">From signed to posting in 10-14 days</PaperHeading>
          <p className="-mt-6 mb-12 max-w-[40rem] text-[17px] leading-relaxed text-[#3c3a36]">
            Creators finish a two-week paid trial. We keep the top 1%. Then the week looks like this.
          </p>

          <div className="grid grid-cols-1 items-stretch gap-10 border-t border-[#161513] sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="flex h-full flex-col pt-6">
                <div className="mb-4 text-[15px] text-[#5c594f]">
                  {s.num}
                </div>
                <h3 className="mb-3 font-serif text-[32px] leading-none tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-auto text-[16px] leading-relaxed text-[#3c3a36]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-14" id="fit">
        <div className="mx-auto grid max-w-[1280px] items-stretch gap-6 md:grid-cols-2 md:gap-10">
          <div className="flex h-full flex-col border border-[#161513]/15 p-8">
            <h2 className="mb-5 font-serif text-[clamp(32px,4vw,44px)] leading-none tracking-[-0.02em]">
              Good fit
            </h2>
            <ul className="space-y-3 text-[16px] leading-relaxed text-[#3c3a36]">
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
          <div className="flex h-full flex-col border border-[#161513]/15 bg-[#e7e3db] p-8">
            <h2 className="mb-5 font-serif text-[clamp(32px,4vw,44px)] leading-none tracking-[-0.02em] text-[#3c3a36]">
              Not a fit
            </h2>
            <ul className="space-y-3 text-[16px] leading-relaxed text-[#5c594f]">
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
        </div>
      </section>

      {/* FAQ — each question is its own bordered card (rounded-2xl, subtle
          border, internal padding) stacked with a gap, rather than a flat
          list with divider lines between items. See docs/DECISIONS.md
          (topic: faq-restyle). */}
      <section className="px-6 py-24 md:px-14 md:py-32" id="faq">
        <div className="mx-auto max-w-[1280px]">
          <PaperHeading kicker="FAQ">Frequently Asked Questions</PaperHeading>
          <div className="border-t border-[#161513] md:ml-[200px]">
            {agencyFaqs.map((faq) => {
              const panelId = `faq-${faq.q.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
              const open = openFaq === faq.q;
              return (
                <div key={faq.q} className="border-b border-[#161513]/15 py-5">
                  <button
                    type="button"
                    className={`flex min-h-11 w-full items-center justify-between gap-4 text-left ${FOCUS}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(open ? null : faq.q)}
                  >
                    <span className="text-[18px] tracking-tight text-[#161513]">{faq.q}</span>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#161513]/20 text-[#161513] transition-transform ${open ? "rotate-45" : ""}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  <div id={panelId} role="region" hidden={!open} className="mt-3 pr-14 text-[16px] leading-[1.7] text-[#3c3a36]">
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABlock paper />

      <Footer tone="paper" />
      </div>
    </>
  );
}
