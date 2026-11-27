"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import LogoImage from "@/components/LogoImage";
import WorkCarousel from "@/components/WorkCarousel";
import { useCountUp } from "@/components/useCountUp";
import { Reveal, useOnceVisible } from "@/components/motion";
import { posts } from "@/lib/blog/posts";
import { creatorClips } from "@/lib/creator-clips";
import { CONTACT_EMAILS } from "@/lib/site";
import NotionToggle, { NotionChevron, useOpenDetailsForHash } from "@/components/NotionToggle";

// DECISION 2026-11: the field is grainy black-and-white silk. Filled buttons
// are white on black. The serif VO monogram is the mark, including a large
// one beside the hero lockup from 1024px. See docs/DECISIONS.md
// (topic: silk-monogram-2026-11).

const BOOKING = "https://calendly.com/vocreations/vo-creations-agency-discovery-call";
const MENTORSHIP = "https://vocreationsconfirmationportal.com/";
const DISCORD = "https://discord.gg/sZPxkg2bwW";

// DECISION 2026-11: the 6% edge fade stays a mask. A flat #0B0D12 overlay
// covered the moving silk and darkened the ends. See docs/DECISIONS.md
// (topic: trusted-by-strip-2026-11).
const EDGE_FADE =
  "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)";
const edgeFadeStyle: CSSProperties = {
  WebkitMaskImage: EDGE_FADE,
  maskImage: EDGE_FADE,
};

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
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function StatCounter({
  target,
  trigger,
  format,
}: {
  target: number;
  trigger: boolean;
  format: (n: number) => string;
}) {
  const value = useCountUp(target, trigger, 800, { ssrFinal: true });
  return <>{format(value)}</>;
}

// DECISION 2026-11: six clips, three women and three men, alternating.
// Opens on creator-01. hero-clip-5 is Thienvu and stays out.
// Proof labels live on lib/creator-clips.ts. See docs/DECISIONS.md
// (topic: creator-clips-2026-11, topic: hero-declutter-2026-11).
const heroClips = creatorClips;

const heroStats = [
  { target: 1000, format: (n: number) => (n >= 1000 ? "1B+" : `${n}M+`), label: "views generated" },
  // DECISION 2026-11: Daniel set this to 10M+. See docs/DECISIONS.md
  // (topic: installs-signups-10m-2026-11).
  { target: 10, format: (n: number) => `${n}M+`, label: "installs and signups" },
  { target: 1000, format: (n: number) => `${n}+`, label: "trained creators" },
  { target: 14, format: (n: number) => (n >= 14 ? "10–14" : `${n}`), label: "days to post" },
];

// DECISION 2026-11: nine more marks joined this row.
// Sources in docs/DECISIONS.md (topic: trusted-by-logos-2026-11).
// DECISION 2026-11: marks are pre-baked white ink. CookSAT is a luminance
// bake of the official SVG so the panda stays visible. The row uses
// opacity only and a 72.7s translate3d loop. The 6% edge fade stays a mask.
// See docs/DECISIONS.md (topic: trusted-by-strip-2026-11).
const trustedBrands = [
  { name: "Krea AI", file: "krea.png" },
  { name: "Higgsfield", file: "higgsfield.png" },
  { name: "BlackBox AI", file: "blackbox.png" },
  { name: "Fable", file: "fable.png" },
  { name: "Notta", file: "notta.png" },
  { name: "Softr", file: "softr.png" },
  { name: "Liftoff", file: "liftoff.png" },
  { name: "fomo.family", file: "fomo.png" },
  { name: "CookSAT", file: "cooksat.png" },
  { name: "Makon AI", file: "makon.png" },
  { name: "Aonic", file: "aonic.png" },
  { name: "micro1", file: "micro1.png" },
  { name: "Decart", file: "decart.png" },
  { name: "Tab", file: "tab.png" },
  { name: "Hedra", file: "hedra.png" },
  { name: "Cantina", file: "cantina.png" },
  { name: "Teamily", file: "teamily.png" },
  { name: "Based Body Works", file: "based.png" },
  { name: "Santa Cruz Paleo", file: "santa-cruz-paleo.png" },
  { name: "OpenArt AI", file: "openart.png" },
];

// DECISION 2026-11: result names are categories. Numbers stay the deck figures.
// See docs/DECISIONS.md (topic: anonymized-results-2026-11).
const heroProof = [
  { name: "AI creative platform", line: "130M+ views in 12 weeks, under $3 CPM" },
  { name: "Fitness social app", line: "174M+ views in 90 days, $0.82 avg CPM" },
  { name: "AI video generation app", line: "72M+ views in 35 days, ~$0.96 CPM" },
];

const steps = [
  { num: "01", title: "Brief", desc: "Scripts on day 0. Creators briefed within about 48 hours." },
  { num: "02", title: "Training", desc: "Every creator finishes a two-week paid trial before touching a brand account. We keep the top 1% of applicants and coach them every week." },
  { num: "03", title: "Posting", desc: "Organic posts on TikTok, Instagram, YouTube, Facebook, and Snapchat." },
  { num: "04", title: "Reporting", desc: "A daily Slack report. Each week we double down on the top videos." },
];

// Named rows use figures already on the case-study pages. Clips are the
// lead file for each study. See docs/DECISIONS.md (topic: named-stories-2026-11).
const storyRows = [
  {
    name: "Krea",
    href: "/case-studies/krea",
    figure: "130M+",
    kicker: "views in 12 weeks",
    support: "Under $3 CPM, with 4.7M engagements, and still growing.",
    logo: "/logos/krea.png",
    mark: "is-krea",
    clips: [
      { src: "/videos/krea-cat-vancity.mp4", poster: "/videos/krea-cat-vancity.jpg" },
      { src: "/videos/krea-sarah-stiles.mp4", poster: "/videos/krea-sarah-stiles.jpg" },
    ],
  },
  {
    name: "Higgsfield",
    href: "/case-studies/higgsfield",
    figure: "72M+",
    kicker: "views in 35 days",
    support: "~$0.96 CPM, from 45 creators.",
    logo: "/logos/higgsfield.png",
    mark: "is-higgs",
    clips: [
      { src: "/videos/creator-kelly.mp4", poster: "/videos/creator-kelly.jpg" },
      { src: "/videos/higgsfield-kelly-1.1m.mp4", poster: "/videos/higgsfield-kelly-1.1m.jpg" },
    ],
  },
  {
    name: "fomo",
    href: "/case-studies/fomo",
    figure: "#3",
    kicker: "US App Store Top Free Finance",
    support: "3M+ users, up from 625K in June, at under $4 CPM.",
    logo: "/logos/fomo.png",
    mark: "is-word",
    clips: [
      { src: "/videos/fomo-timmy-pham.mp4", poster: "/videos/fomo-timmy-pham.jpg" },
      { src: "/videos/fomo-bella.mp4", poster: "/videos/fomo-bella.jpg" },
    ],
  },
  {
    name: "Liftoff",
    href: "/case-studies/liftoff",
    figure: "174M+",
    kicker: "views in 90 days",
    support: "$0.82 avg CPM, from 50 creators, with zero paid ads.",
    logo: "/logos/liftoff.png",
    mark: "is-lift",
    clips: [
      { src: "/videos/liftoff-henry-266k.mp4", poster: "/videos/liftoff-henry-266k.jpg" },
      { src: "/videos/liftoff-daniel-147k.mp4", poster: "/videos/liftoff-daniel-147k.jpg" },
    ],
  },
];

// DECISION 2026-11: four quotes, one per person. Miguel's shorter line was removed.
// See docs/DECISIONS.md (topic: testimonials-four-2026-11).
const quotes = [
  {
    quote: "Vo Creations helped Krea go from 1→100 with UGC. One of the best agencies in the space.",
    by: "Miguel Lara, Growth Marketing, Krea",
    client: "Krea",
    study: "/case-studies/krea",
  },
  {
    quote: "Great engagement. You guys are doing a great job keeping your team engaged, and we love the quality of your creators and coaches.",
    by: "Will Timberlake, UGC Manager, fomo",
    client: "fomo",
    study: "/case-studies/fomo",
  },
  {
    quote: "Really appreciate the responsiveness you guys have shown. Overall, the experience has been very great.",
    by: "Shotan Jakupov, Head of Growth, Higgsfield",
    client: "Higgsfield",
    study: "/case-studies/higgsfield",
  },
  {
    quote: "Vo Creations helped scale our UGC efforts from 0 to 100. One of the best teams in this space.",
    by: "Wassim Bouchelouh, CMO, Liftoff",
    client: "Liftoff",
    study: "/case-studies/liftoff",
  },
];

const agencyFaqs = [
  { q: "What is the investment?", a: "Campaigns start at $50K+ a month, all-inclusive: trained creators, scripts, posting, creator bonuses, and daily Slack reporting. CPM means cost per 1,000 organic views. We guarantee your target CPM, then optimize every video for installs and lower CAC, not just views. Videos under 1,000 views do not count toward your CPM. Paid media, the ad spend, is outside the fee and billed on top. The minimum is 90 days, then month to month. No refunds after launch." },
  { q: "Is paid media included?", a: "Paid media, the ad spend, is outside the fee and billed on top. The monthly fee already includes creator bonuses." },
  { q: "Do you offer refunds?", a: "No refunds after launch. The minimum is 90 days, then month to month." },
  { q: "How long do results take?", a: "First posts go live in 10–14 days. The minimum is 90 days so accounts can warm up and a few testing cycles can find the format. After that it is month to month." },
  { q: "Where do the videos post?", a: "TikTok, Instagram, YouTube, Facebook, and Snapchat. The format is organic talking-head UGC." },
  { q: "How do you report results?", a: "Every client gets a daily report in a shared Slack channel: spend against budget, total views, posts, active creators, CPM, engagement rate, and the top creators from the last 7 days. Each week we double down on the top videos. We also run campaigns from an internal dashboard, where every creator, video, account, and view is tracked live." },
  { q: "Who owns the videos?", a: "You do. You own every video we make for your campaign. Creators own their accounts." },
  { q: "Who approves videos?", a: "The founders approve every script and video before it posts." },
  { q: "What do I need to provide?", a: "An onboarding survey, free product, promo codes or app access, and custom tracking URLs. We handle scripts, briefing, coaching, posting, editing, creator bonuses, and the daily report." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: agencyFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image?: string;
  webp?: string;
  slot: string;
};

const team: TeamMember[] = [
  {
    name: "Daniel Yun",
    role: "Co-Founder · Los Angeles, CA",
    bio: "He started on camera: 150M+ views and $200K+ earned from his own content. His app campaigns: 500M+ views, 5M+ users.",
    image: "/videos/team-daniel.jpg",
    slot: "t0",
  },
  {
    name: "Thienvu Vo",
    role: "Co-Founder · New York, NY",
    bio: "Grew his own Instagram past 70K followers. Creators he's trained have driven 500M+ views. Brands at Vo Creations get that same system.",
    image: "/videos/team-thienvu.jpg",
    webp: "/videos/team-thienvu.webp",
    slot: "t1",
  },
];

const featured = posts.find((post) => post.slug === "questions-before-hiring-a-ugc-agency") ?? posts[0];
const journalList = posts
  .filter((post) => post.slug !== featured.slug)
  .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

function shortDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

function useHeroDrift<T extends HTMLElement>(distance: number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, y / 720));
      el.style.transform = `translate3d(0, ${(p * distance).toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [distance]);
  return ref;
}

function CloserMark() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = el.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = (view - rect.top) / (view + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      el.style.transform = `rotate(${((clamped - 0.5) * 16).toFixed(2)}deg)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div ref={ref} className="closer-mark" role="img" aria-label="Vo Creations">
      {/* DECISION 2026-11: closer uses the hero's matte silver mask, not the chrome render.
          See docs/DECISIONS.md (topic: homepage-finish-2026-11). */}
      <span className="closer-mark-ink" aria-hidden="true" />
    </div>
  );
}

function SlackReport() {
  const { ref, on } = useOnceVisible<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal relative overflow-hidden ${on ? "is-in" : ""}`}>
      <picture>
        <source srcSet="/proof/slack-report.webp" type="image/webp" />
        <img
          src="/proof/slack-report.png"
          alt="Example of the daily Slack campaign report, with numbers blurred."
          width={1800}
          height={856}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-[6px] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
        />
      </picture>
      <span aria-hidden="true" className={`budget-wipe ${on ? "is-in" : ""}`} />
    </div>
  );
}

function StoryClip({ src, poster, name }: { src: string; poster: string; name: string }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        setPlaying(entry.isIntersecting);
      },
      { rootMargin: "160px", threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = true;
    if (playing && !paused) {
      const pending = node.play();
      if (pending) pending.catch(() => {});
    } else {
      node.pause();
    }
  }, [playing, paused]);
  return (
    <figure ref={ref} className="story-clip">
      <img src={poster} alt="" width={540} height={960} loading="lazy" decoding="async" />
      {playing && (
        <video ref={videoRef} autoPlay muted loop playsInline preload="none" poster={poster}>
          <source src={src} type="video/mp4" />
        </video>
      )}
      {!reduced && (
      <button
        type="button"
        className="hero-pause story-pause"
        aria-pressed={paused}
        aria-label={paused ? `Play ${name} video` : `Pause ${name} video`}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? (
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M5 3.2v9.6L13 8 5 3.2z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path d="M4 3h3v10H4V3zm5 0h3v10H9V3z" fill="currentColor" />
          </svg>
        )}
      </button>
      )}
    </figure>
  );
}

function HeroStats() {
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>();
  return (
    <div className="hst" ref={statsRef}>
      {heroStats.map((stat) => (
        <div key={stat.label} className="st">
          <div className="sn">
            <StatCounter target={stat.target} trigger={statsInView} format={stat.format} />
          </div>
          <div className="sl">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  useOpenDetailsForHash();
  const heroCopyRef = useHeroDrift<HTMLDivElement>(-28);
  const heroStageRef = useHeroDrift<HTMLDivElement>(-12);
  return (
    <div className="editorial">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Nav variant="editorial" />
      <main id="main">
        <section className="hero-shell" aria-label="Introduction">
          <div className="hero-frame">
            <div className="hero-copy" ref={heroCopyRef}>
              {/* DECISION 2026-11: one headline. The offer stays a step down.
                  The clip fan sits beside this lockup from 1280px, and under
                  it on a phone. See docs/DECISIONS.md
                  (topic: hero-offer-mark-2026-11, topic: homepage-impact-2026-11). */}
              <div className="hero-lockup">
                <h1>
                  <span className="hero-rise l1">
                    <span>make them</span>
                  </span>
                  <span className="hero-rise l2 delay">
                    <span>remember.</span>
                  </span>
                </h1>
                <p className="hlead">
                  <span className="hlead-offer">Organic UGC for AI and tech apps.</span>
                  <span className="hlead-rest">That&apos;s why we have the biggest numbers: 1B+ organic&nbsp;views.</span>
                </p>
              </div>
            </div>
            <div className="hero-visual" ref={heroStageRef}>
              <HeroCarousel clips={heroClips} />
            </div>
            <div className="hb">
              <p className="hsub">
                We guarantee your target CPM, then optimize every video for installs and lower CAC, not just views.
              </p>
              <div className="hcta">
                <a className="btn-talk" href={BOOKING} target="_blank" rel="noopener noreferrer">
                  Book a call
                </a>
              </div>
            </div>
            <ul className="hero-proof">
              {heroProof.map((item) => (
                <li key={item.name}>
                  <span className="hp-name">{item.name}</span>
                  <span className="hp-line">{item.line}</span>
                </li>
              ))}
            </ul>
            <HeroStats />
          </div>
        </section>

        <section className="story-band" id="results" aria-labelledby="results-title">
          <div className="ed-wrap">
            <h2 id="results-title">Results.</h2>
            <div className="story-rows">
              {storyRows.map((row, index) => (
                <article className={index % 2 === 1 ? "story-row is-flip" : "story-row"} key={row.href}>
                  <div className="story-copy">
                    <div className="story-figure">
                      <p className="story-num">{row.figure}</p>
                      <p className="story-kicker">{row.kicker}</p>
                    </div>
                    <div className="story-meta">
                      <a className="story-brand" href={row.href}>
                        <LogoImage
                          src={row.logo}
                          alt=""
                          boxClassName={`story-logo ${row.mark}`}
                          crop={row.mark !== "is-word"}
                        />
                        {row.mark === "is-word" ? (
                          <span className="sr-only keep-case">{row.name}</span>
                        ) : (
                          <span>{row.name}</span>
                        )}
                      </a>
                      <p className="story-support">{row.support}</p>
                    </div>
                  </div>
                  <div className="story-clips">
                    {row.clips.map((clip, clipIndex) => (
                      <StoryClip
                        key={clip.src}
                        src={clip.src}
                        poster={clip.poster}
                        name={`${row.name} ${clipIndex + 1}`}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <p className="story-foot">Figures from Vo Creations campaign data, Nov 2026.</p>
          </div>
        </section>

        <p className="stuck-line" id="stuck">
          Where app growth gets stuck. Paid CAC on Meta and TikTok goes up every quarter, in-house programs stall at 5–10 creators, and agencies hand over 20 polished ads that look like ads.{" "}
          <a className="text-link" href="/blog/ugc-agency-vs-in-house">UGC agency vs in-house</a>
        </p>

        <section className="guarantee-band" aria-labelledby="guarantee-title">
          <div className="ed-wrap">
            <h2 id="guarantee-title">Your target CPM, guaranteed.</h2>
            <p>We guarantee your target CPM, then optimize every video for installs and lower CAC, not just views. Videos under 1,000 views do not count toward your CPM.</p>
          </div>
        </section>

        <section className="border-b border-white/10" aria-label="Trusted by teams at">
          <div className="mx-auto grid max-w-[1440px] items-center gap-[18px] px-[22px] py-[26px] md:px-10 xl:grid-cols-[220px_minmax(0,1fr)] xl:px-[72px] xl:py-[34px]">
            <h2 className="lab">Trusted by teams at</h2>
            <div className="overflow-hidden" style={edgeFadeStyle}>
              <div className="flex w-max items-center animate-scroll-logos motion-reduce:animate-none motion-safe:will-change-transform [&_img]:opacity-80">
                <div className="flex items-center gap-11 pr-11 xl:gap-[72px] xl:pr-[72px]">
                  {trustedBrands.map((brand) => (
                    <LogoImage
                      key={brand.name}
                      src={`/logos/${brand.file}`}
                      alt={`${brand.name} logo`}
                      boxClassName="h-[18px] w-auto xl:h-[21px]"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-11 pr-11 xl:gap-[72px] xl:pr-[72px]" aria-hidden="true">
                  {trustedBrands.map((brand) => (
                    <LogoImage
                      key={`${brand.name}-2`}
                      src={`/logos/${brand.file}`}
                      alt=""
                      boxClassName="h-[18px] w-auto xl:h-[21px]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <WorkCarousel />

        {/* DECISION 2026-11: the three approval lines are visible here.
            #quality lands on this strip. Creators own their accounts stays
            in How it works. See docs/DECISIONS.md
            (topic: homepage-rebalance-2026-11). */}
        <section className="quality-strip" id="quality" aria-labelledby="quality-title">
          <div className="ed-wrap">
            <h2 id="quality-title" className="display">Approvals and ownership.</h2>
            <div className="quality-cols">
              <p>The founders approve every script and video before it posts.</p>
              <p>You own every video.</p>
              <p>We handle all takedowns and re-edits.</p>
            </div>
          </div>
        </section>

        <section className="report-band" id="reporting" aria-labelledby="reporting-title">
          <div className="ed-wrap">
            <div className="report-split">
              <div>
                <h2 id="reporting-title" className="display">
                  Daily reports
                  <br />
                  in your Slack.
                </h2>
                <ul className="report-rows">
                  {[
                    ["Spend vs budget", "Daily"],
                    ["Views · posts · CPM · engagement", "Daily"],
                    ["Top creators, last 7 days", "Daily"],
                  ].map(([label, when]) => (
                    <li key={label}>
                      <span>{label}</span>
                      <span>{when}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="report-shot">
                <SlackReport />
              </div>
            </div>
          </div>
        </section>

        {/* DECISION 2026-11: How it works, the dashboard, and FAQ share one
            hairline stack. #dashboard still opens that toggle. Creator tools
            moved into #creators. See docs/DECISIONS.md
            (topic: homepage-rebalance-2026-11). */}
        <div className="notion-stack">
          <NotionToggle
            id="process"
            title="How it works."
            summary="Scripts, training, organic posts, daily Slack."
          >
            <div className="how-list">
              {steps.map((step) => (
                <article key={step.num} className="how-step">
                  <span>{step.num}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="pcols">
              <div>
                <span className="lab">You give us</span>
                <p>An onboarding survey, free product, promo codes or app access, and custom tracking URLs.</p>
              </div>
              <div>
                <span className="lab">We handle</span>
                <p>Scripts, creator briefing and coaching, posting, in-house editing, creator bonuses, and daily reporting.</p>
              </div>
              <div>
                <span className="lab">Ownership</span>
                <p>Creators own their accounts.</p>
              </div>
            </div>
          </NotionToggle>
          {/* id="dashboard" keeps the old hash and opens this disclosure.
              Never name a dashboard vendor. */}
          <NotionToggle
            id="dashboard"
            title="An internal dashboard."
            summary="Every creator, video, and view, tracked live."
          >
            <p className="lede">
              Every creator, video, account, and view is tracked live in one dashboard, along with the rest of the metrics. We pay creators from it, target Tier 1 countries, turn organic posts into paid, and run the ads, all from there.
            </p>
          </NotionToggle>
          <NotionToggle
            id="faq"
            title="Frequently asked questions."
            summary="Investment, timing, reporting, ownership."
          >
            <div className="fqs">
              {agencyFaqs.map((faq) => (
                <details key={faq.q} className="fq">
                  <summary className="fh">
                    <NotionChevron />
                    <span>{faq.q}</span>
                  </summary>
                  <p className="faq-a">{faq.a}</p>
                </details>
              ))}
            </div>
          </NotionToggle>
        </div>

        <section className="band" id="testimonials">
          <div className="ed-wrap">
            <h2 className="display">In their words</h2>
            <div className="tqs">
              {quotes.map((item) => (
                <div className="tq" key={item.by + item.quote.slice(0, 12)}>
                  <p>&ldquo;{item.quote}&rdquo;</p>
                  {/* DECISION 2026-11: bylines stay uppercase. The brand stays lowercase.
                      See docs/DECISIONS.md (topic: fomo-brand-case-2026-11). */}
                  <span>
                    {item.by.endsWith("fomo") ? (
                      <>
                        {item.by.slice(0, -4)}
                        <span className="keep-case">fomo</span>
                      </>
                    ) : (
                      item.by
                    )}
                  </span>
                  <a href={item.study} aria-label={`Read the case study, ${item.client}`}>Read the case study</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="band border-t border-white/10" id="pricing">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">What $50K+/month buys</h2>
              <p className="lede mt-4">First posts go live in 10–14 days.</p>
            </div>
            <div className="pc">
              <p className="ed-price">
                $50K+<small>/mo</small>
              </p>
              <p className="pmin">
                <span className="lab">Minimum</span>
                90-day minimum, then month to month.
              </p>
            </div>
            <NotionToggle
              bare
              id="pricing-detail"
              title="What's in the fee."
              summary="Creators, the math, and the terms."
            >
              <div className="pcols">
                <div>
                  <span className="lab">Creators</span>
                  <p>1,000+ vetted in-house creators trained through mentorship. They finish a two-week paid trial before they touch a brand account. We keep the top 1% of applicants. They post talking-head video on TikTok, Instagram, YouTube, Facebook, and Snapchat.</p>
                </div>
                <div>
                  <span className="lab">What&apos;s included</span>
                  <p>
                    At a $1 target CPM that is 50M organic views. At $4 it is 12.5M. Included: trained creators, scripts, in-house editing, posting, creator bonuses, and daily reporting. Paid ad spend is billed separately.{" "}
                    <a className="text-link" href="/blog/ugc-agency-pricing">How the math works</a>
                  </p>
                </div>
                <div>
                  <span className="lab">Terms</span>
                  <p>No refunds after launch. We take 10 new campaigns a month. You own every video. We guarantee your target CPM, then optimize every video for installs and lower CAC, not just views. CPM means cost per 1,000 organic views. Videos under 1,000 views don&apos;t count toward your CPM.</p>
                </div>
              </div>
            </NotionToggle>
            <div className="section-cta">
              <a className="btn-talk" href={BOOKING} target="_blank" rel="noopener noreferrer">
                Book a call
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </section>

        <section className="band tight-top" id="fit">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">Good fit, and not a fit.</h2>
            </div>
            {/* DECISION 2026-11: bullets restored from the pre-C homepage.
                See docs/DECISIONS.md (topic: c-hero-blog-fit-2026-11). */}
            <div className="fit-grid">
              <article>
                <h3>Good fit</h3>
                <ul>
                  <li>AI and tech consumer apps.</li>
                  <li>Ready for $50K+ a month.</li>
                  <li>Want organic short-form at scale, with a CPM target.</li>
                </ul>
              </article>
              <article>
                <h3>Not a fit</h3>
                <ul>
                  <li>Budgets under $50K a month.</li>
                  <li>One-off videos.</li>
                  <li>Paid-ads-only management.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="band tight-top" id="team">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">The team behind 1B+ views.</h2>
            </div>
            <div className="tms" role="region" aria-label="Team" tabIndex={0}>
              {team.map((member) => (
                <figure key={member.name} className={`tm ${member.slot}`}>
                  <figcaption>
                    <div className="tn">{member.name}</div>
                    <div className="tr">{member.role}</div>
                    <p>{member.bio}</p>
                  </figcaption>
                </figure>
              ))}
              <p className="team-coaches">Plus a team of in-house coaches working with every creator.</p>
            </div>
          </div>
        </section>

        <section className="band tight-top" id="journal">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">UGC insights.</h2>
            </div>
            <div className="journal-scroller" role="region" aria-label="UGC insights" tabIndex={0}>
            <div className="feat">
              <a className="feat-media" href={`/blog/${featured.slug}`} aria-label={featured.title}>
                <Image
                  src={`/og/blog/${featured.slug}.png`}
                  alt=""
                  width={1200}
                  height={630}
                  sizes="(min-width: 1280px) 720px, 100vw"
                  className="h-auto w-full"
                />
              </a>
              <div className="ft2">
                <p className="lab">
                  {shortDate(featured.datePublished)} · {featured.category} · {featured.readingMinutes} min read
                </p>
                <h3 className="bt2">
                  <a href={`/blog/${featured.slug}`}>{featured.title}</a>
                </h3>
                <a className="btn-line mt-[26px]" href={`/blog/${featured.slug}`}>
                  Read the article<span aria-hidden="true">&nbsp;↗</span>
                </a>
              </div>
            </div>
            <div className="bls">
              {journalList.map((post) => (
                <a key={post.slug} className="bl" href={`/blog/${post.slug}`}>
                  <span className="bd">{shortDate(post.datePublished)}</span>
                  <span className="bc">{post.category}</span>
                  <span className="bt">{post.title}</span>
                  <span className="bm">{post.readingMinutes} min read</span>
                </a>
              ))}
            </div>
            </div>
          </div>
        </section>

        {/* DECISION 2026-11: brands lead with the filled booking pill.
            Mentorship is the outline link. Discord stays a quiet text link.
            See docs/DECISIONS.md (topic: homepage-finish-2026-11). */}
        <section className="band" id="creators" aria-label="For brands and creators">
          <div className="ed-wrap">
            <div className="sh">
              <p className="lab">Two paths</p>
            </div>
            <div className="paths">
              <article>
                <h2 className="display">For brands</h2>
                <p>Tell us about your app, and we&apos;ll tell you honestly if we&apos;re a fit.</p>
                <div className="path-actions">
                  <a className="btn-talk" href={BOOKING} target="_blank" rel="noopener noreferrer">
                    Book a call
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </article>
              <article id="tools">
                <h2 className="display">For creators</h2>
                <p>Learn UGC through Vo&apos;s mentorship, then keep building alongside other creators in the Discord.</p>
                <p className="path-tools">Auto-DMs, an auto-poster, Doomscroller, an AI editor, and trial reels.</p>
                <div className="path-actions">
                  <a className="btn-line" href={MENTORSHIP} target="_blank" rel="noopener noreferrer">
                    Join the mentorship
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <a className="path-quiet" href={DISCORD} target="_blank" rel="noopener noreferrer">
                    Join the Discord
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="closer" id="closer">
          <div className="ed-wrap relative">
            <CloserMark />
            <p className="lab">Ready to scale?</p>
            <h2>
              1B+ views.
              <br />
              Your target CPM, guaranteed.
            </h2>
            <div className="clb">
              <div>
                <div className="mail-row">
                  {CONTACT_EMAILS.map((email) => (
                    <a key={email} href={`mailto:${email}`}>
                      {email}
                    </a>
                  ))}
                </div>
              </div>
              <div className="ctas">
                <a className="btn-talk" href={BOOKING} target="_blank" rel="noopener noreferrer">
                  Book a call
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer tone="editorial" />
    </div>
  );
}
