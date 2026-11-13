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

// DECISION 2026-11: the field is grainy black-and-white silk. Filled buttons
// are white on black. The serif VO monogram is the mark, including a large
// one beside the hero lockup from 1024px. See docs/DECISIONS.md
// (topic: silk-monogram-2026-11).

const BOOKING = "https://calendly.com/vocreations/vo-creations-agency-discovery-call";

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
  const value = useCountUp(target, trigger, 2200, { ssrFinal: true });
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
  { name: "Consumer finance app", line: "3M+ users, Sub-$4 CPM" },
];

const steps = [
  { num: "01", title: "Brief", desc: "We write the scripts on day 0. Creators are briefed within about 48 hours." },
  { num: "02", title: "Training", desc: "Every creator finishes a two-week paid trial before touching a brand account. We keep the top 1% of applicants and coach them every week." },
  { num: "03", title: "Posting", desc: "Creators post organically on TikTok, Instagram, YouTube, Facebook, and Snapchat. Creators own their accounts." },
  { num: "04", title: "Reporting", desc: "Every client gets a daily report in a shared Slack channel. Each week we double down on the top videos." },
];

const results = [
  {
    label: "AI creative platform",
    figure: "130M+",
    lines: ["views in 12 weeks", "Under $3 CPM", "still growing", "Jul 28 – Oct 18, 2026", "4.7M engagements, 4.7% rate", "1.8M likes"],
  },
  {
    label: "Consumer finance app",
    figure: "3M+",
    lines: [
      "users, up from 625K in June",
      "Aug 21, 2026",
      "~50% of users came from Vo's creators",
      "Sub-$4 CPM",
    ],
  },
  {
    label: "AI video generation app",
    figure: "72M+",
    lines: ["views in 35 days", "45 creators", "~$0.96 CPM", "Jun 29 – Aug 3, 2026", "502K likes", "336K shares", "228K comments"],
  },
  {
    label: "Fitness social app",
    figure: "174M+",
    lines: ["views in 90 days", "50 creators", "$0.82 average CPM", "May 1 – Jul 31, 2026", "8.5K posts", "11.4M engagements", "Zero paid ads", "4.8★ App Store, 101K ratings"],
  },
  {
    label: "Test prep app",
    figure: "$968K",
    lines: [
      "ARR from organic UGC",
      "Zero ad spend",
      "100K+ users from paid creators posting organic UGC",
      "55M views",
      "32 creators tracked",
      "Feb–Sep 2026",
      "63% of views from one creator",
    ],
  },
];

// DECISION 2026-11: four quotes, one per person. Miguel's shorter line was removed.
// See docs/DECISIONS.md (topic: testimonials-four-2026-11).
const quotes = [
  {
    quote: "Vo Creations helped Krea go from 1→100 with UGC. One of the best agencies in the space.",
    by: "Miguel Lara, Growth Marketing, Krea",
    study: "/case-studies/krea",
  },
  {
    quote: "Great engagement. You guys are doing a great job keeping your team engaged, and we love the quality of your creators and coaches.",
    by: "Will Timberlake, UGC Manager, fomo",
    study: "/case-studies/fomo",
  },
  {
    quote: "Really appreciate the responsiveness you guys have shown. Overall, the experience has been very great.",
    by: "Shotan Jakupov, Head of Growth, Higgsfield",
    study: "/case-studies/higgsfield",
  },
  {
    quote: "Vo Creations helped scale our UGC efforts from 0 to 100. One of the best teams in this space.",
    by: "Wassim Bouchelouh, CMO, Liftoff",
    study: "/case-studies/liftoff",
  },
];

const agencyFaqs = [
  { q: "What is the investment?", a: "Campaigns start at $50K+ a month, all-inclusive: trained creators, scripts, posting, creator bonuses, and daily Slack reporting. CPM means cost per 1,000 organic views. We guarantee your target CPM. Videos under 1,000 views do not count toward your CPM. Paid media, the ad spend, is outside the fee and billed on top. The minimum is 90 days, then month to month. No refunds after launch." },
  { q: "Is paid media included?", a: "Paid media, the ad spend, is outside the fee and billed on top. The monthly fee already includes creator bonuses." },
  { q: "Do you offer refunds?", a: "No refunds after launch. The minimum is 90 days, then month to month." },
  { q: "How long do results take?", a: "First posts go live in 10–14 days. The minimum is 90 days so accounts can warm up and a few testing cycles can find the format. After that it is month to month." },
  { q: "Where do the videos post?", a: "TikTok, Instagram, YouTube, Facebook, and Snapchat. The format is organic talking-head UGC." },
  { q: "How do you report results?", a: "Every client gets a daily report in a shared Slack channel: spend against budget, total views, posts, active creators, CPM, engagement rate, and the top creators from the last 7 days. Each week we double down on the top videos. We also run campaigns from an internal dashboard." },
  { q: "Who owns the videos?", a: "You do. You own every video we make for your campaign. Creators own their accounts." },
  { q: "Who approves videos?", a: "Our core team of four approves every script and video before it posts." },
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
  {
    name: "Chad Parian",
    role: "Head of Strategy",
    bio: "Built UGC creator programs driving 300M+ views, and leads coaching and community for every creator we train.",
    slot: "t2",
  },
  {
    name: "Adam Chen",
    role: "Head of Creators",
    bio: "100M+ views across his campaigns, with brands like Based Body Works and Santa Cruz Paleo.",
    slot: "t3",
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
    <div ref={ref} className="closer-mark">
      {/* DECISION 2026-11: closer uses the blog chrome VO. Hero stays the silver serif.
          See docs/DECISIONS.md (topic: closer-chrome-2026-11). */}
      <picture>
        <source srcSet="/brand/closer-chrome.avif" type="image/avif" />
        <img src="/brand/closer-chrome.webp" alt="Vo Creations" width={640} height={764} decoding="async" loading="lazy" />
      </picture>
      <div className="closer-reflect" aria-hidden="true">
        <img src="/brand/closer-chrome.webp" alt="" width={640} height={764} decoding="async" />
      </div>
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

function HeroStats() {
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>();
  return (
    <div className="hst" ref={statsRef}>
      {heroStats.map((stat) => (
        <div key={stat.label} className="st">
          <div className="sn">
            <StatCounter target={stat.target} trigger={statsInView} format={stat.format} />
            <span className="ed-dot" aria-hidden="true" />
          </div>
          <div className="sl">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const heroCopyRef = useHeroDrift<HTMLDivElement>(-28);
  const heroMarkRef = useHeroDrift<HTMLDivElement>(18);
  const heroStageRef = useHeroDrift<HTMLDivElement>(-12);
  return (
    <div className="editorial">
      <link
        rel="preload"
        as="image"
        href={heroClips[0].poster}
        {...{ fetchpriority: "high" }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Nav variant="editorial" />
      <main id="main">
        <section className="hero-shell" aria-label="Introduction">
          <div className="hero-frame">
            <div className="hmeta">
              <span className="lab">The in-house UGC agency backed by elite mentorship</span>
              <span className="lab hmeta-aside">UGC for AI startups &amp; tech consumer apps</span>
            </div>
            <div className="hero-copy" ref={heroCopyRef}>
              {/* DECISION 2026-11: one 89px headline. The offer is a step down
                  (about 54px at 1440, 32px on a phone). See docs/DECISIONS.md
                  (topic: hero-offer-mark-2026-11). */}
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
                  <span className="hlead-rest">That&apos;s why we have the biggest numbers: 1B+ organic views.</span>
                </p>
              </div>
              {/* DECISION 2026-11: serif VO sits in the open space beside the
                  lockup, above the CTA row. Hidden under 1024px. */}
              <div className="hero-mark" ref={heroMarkRef} aria-hidden="true">
                <img src="/brand/vo-logo.svg" alt="" width={2835} height={3298} />
              </div>
              <div className="hb">
                <p className="hsub">
                  1000+ vetted in-house creators.
                  <br />
                  We guarantee your target CPM.
                </p>
                <ul className="hero-proof">
                  {heroProof.map((item) => (
                    <li key={item.name}>
                      <span className="hp-name">{item.name}</span>
                      <span className="hp-line">{item.line}</span>
                    </li>
                  ))}
                </ul>
                <div className="hcta">
                  <a className="btn-talk" href={BOOKING} target="_blank" rel="noopener noreferrer">
                    Book a 30-min fit call
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-visual" ref={heroStageRef}>
              <HeroCarousel clips={heroClips} />
            </div>
            <HeroStats />
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

        <section className="band mid-top" id="stuck">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">Where app growth gets stuck.</h2>
            </div>
            <div className="pcols">
              <div>
                <span className="lab">Paid</span>
                <p>Paid keeps getting pricier. Paid CAC on Meta and TikTok goes up every quarter.</p>
              </div>
              <div>
                <span className="lab">In-house</span>
                <p>In-house creator programs stall. Nobody has time to recruit and coach, so programs stall at 5–10 creators.</p>
              </div>
              <div>
                <span className="lab">Agencies</span>
                <p>Agency ads look like ads. Agencies hand over 20 polished ads that look like ads, and they flop.</p>
              </div>
            </div>
            <p className="lede mt-8">
              <a href="/blog/ugc-agency-vs-in-house">UGC agency vs in-house</a>
            </p>
          </div>
        </section>

        <section className="band tight-top" id="results">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">Results.</h2>
            </div>
            <div className="result-grid">
              {results.map((item) => (
                <article className="result-card" key={item.label}>
                  <h3 className="result-mark">{item.label}</h3>
                  <p className="result-figure">{item.figure}</p>
                  <ul>
                    {item.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="results-cta">
              <p>
                Every result from our own creators. Named case studies:{" "}
                <a href="/case-studies/fomo">fomo</a>
                {" · "}
                <a href="/case-studies/liftoff">Liftoff</a>
                {" · "}
                <a href="/case-studies/higgsfield">Higgsfield</a>
                {" · "}
                <a href="/case-studies/krea">Krea</a>
                .
              </p>
              <a className="btn-book" href={BOOKING} target="_blank" rel="noopener noreferrer">
                Book a call ↗
              </a>
            </div>
          </div>
        </section>

        <section className="band" id="process">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">How it works.</h2>
            </div>
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
            <p className="how-pack">Campaigns start at $50K+ a month. First posts go live in 10–14 days.</p>
            <div className="pcols mt-12">
              <div>
                <span className="lab">You give us</span>
                <p>An onboarding survey, free product, promo codes or app access, and custom tracking URLs.</p>
              </div>
              <div>
                <span className="lab">We handle</span>
                <p>Scripts, creator briefing and coaching, posting, in-house editing, creator bonuses, and daily reporting.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="band band-dark" id="reporting">
          <div className="ed-wrap">
            <div className="grid items-center gap-12 xl:grid-cols-12 xl:gap-x-6">
              <div className="xl:col-span-4">
                <h2 className="display">
                  Daily reports
                  <br />
                  in your Slack.
                </h2>
                <p className="lede mt-7">
                  Every client gets a daily report in a shared Slack channel: spend against budget, total views, posts, active creators, CPM, engagement rate, and the top creators from the last 7 days. Each week we double down on the top videos.
                </p>
                <div className="mt-11 border-t border-white/10">
                  {[
                    ["Spend vs budget", "Daily"],
                    ["Views · posts · CPM · engagement", "Daily"],
                    ["Top creators, last 7 days", "Daily"],
                  ].map(([label, when]) => (
                    <div key={label} className="flex items-center justify-between gap-4 border-b border-white/10 py-[13px] text-[15px] text-[#e7e7e4]">
                      <span>{label}</span>
                      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#EEF0F4]/60">{when}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="xl:col-span-7 xl:col-start-6">
                <SlackReport />
              </div>
            </div>
          </div>
        </section>

        {/* DECISION 2026-11: unnamed internal dashboard and creator tools. Never give the dashboard a product or vendor name — see docs/DECISIONS.md (topic: internal-dashboard-2026-11). */}
        <section className="band" id="dashboard">
          <div className="ed-wrap">
            <div className="ops-grid">
              <div>
                <h2 className="display">An internal dashboard.</h2>
                <p className="lede mt-7">
                  We run campaigns from an internal dashboard. It tracks every creator, video, account, and view, and the rest of the metrics. We pay creators from it, target Tier 1 countries, turn organic posts into paid, and run paid ads from the same place.
                </p>
              </div>
              <div>
                <h2 className="display">Creator tools.</h2>
                <p className="lede mt-7">
                  Creators get tools to run the work: auto-DMs, an auto-poster, Doomscroller, an AI editor, and trial reels.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="band" id="quality">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">Approvals, quality, and ownership.</h2>
            </div>
            <div className="pcols">
              <div>
                <span className="lab">Approvals</span>
                <p>Our core team of four approves every script and video before it posts.</p>
              </div>
              <div>
                <span className="lab">Creator quality</span>
                <p>Every creator finishes a two-week paid trial before touching a brand account. We keep the top 1% of applicants and coach them every week.</p>
              </div>
              <div>
                <span className="lab">If a video misses</span>
                <p>We handle all takedowns and re-edits. You own every video. Creators own their accounts.</p>
              </div>
            </div>
          </div>
        </section>

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
                  <a href={item.study}>Read the case study</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="band border-t border-white/10" id="pricing">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">What $50K+/month buys</h2>
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
            <div className="pcols">
              <div>
                <span className="lab">Creators</span>
                <p>1,000+ vetted in-house creators trained through mentorship. They finish a two-week paid trial before they touch a brand account. We keep the top 1% of applicants. They post talking-head video on TikTok, Instagram, YouTube, Facebook, and Snapchat.</p>
              </div>
              <div>
                <span className="lab">What&apos;s included</span>
                <p>
                  $50K+ a month. At a $1 target CPM that is 50M organic views. At $4 it is 12.5M. Everything included: trained creators, scripts, in-house editing, posting, creator bonuses, and daily reporting. Paid ad spend is billed separately.{" "}
                  <a href="/blog/ugc-agency-pricing">How the math works</a>
                </p>
              </div>
              <div>
                <span className="lab">Terms</span>
                <p>90-day minimum, then month to month. No refunds after launch. We take 10 new campaigns a month. You own every video. We guarantee your target CPM. CPM means cost per 1,000 organic views. Videos under 1,000 views don&apos;t count toward your CPM.</p>
              </div>
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
            <div className="tms">
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

        <section className="band mid-top" id="faq">
          <div className="ed-wrap">
            <div className="faq-grid">
              <div className="fl">
                <h2 className="display">Frequently asked questions.</h2>
              </div>
              <div className="fqs">
                {agencyFaqs.map((faq, index) => (
                  <details key={faq.q} className="fq" {...(index === 0 ? { open: true } : {})}>
                    <summary className="fh">
                      <span>{faq.q}</span>
                      <b aria-hidden="true" />
                    </summary>
                    <p className="faq-a">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="band tight-top" id="journal">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">UGC insights.</h2>
            </div>
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
                  Read the article ↗
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
        </section>

        <section className="closer">
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
                <p>Campaigns start at $50K+ a month. First posts go live in 10–14 days.</p>
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
                  Book a 30-min fit call
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
