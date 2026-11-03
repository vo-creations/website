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
import { CONTACT_EMAILS } from "@/lib/site";

// DECISION 2026-11: the field is grainy black-and-white silk. Filled buttons
// are white on black. The serif VO monogram is the mark, including a large
// one beside the hero lockup from 1024px. See docs/DECISIONS.md
// (topic: silk-monogram-2026-11).

const BOOKING = "https://calendar.app.google/8x72A8nxr3gQpVfx7";

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
// See docs/DECISIONS.md (topic: creator-clips-2026-11).
const heroClips = [
  { src: "/videos/creator-01.mp4", poster: "/videos/creator-01.jpg" },
  { src: "/videos/hero-clip-1.mp4", poster: "/videos/hero-clip-1.jpg" },
  { src: "/videos/creator-02.mp4", poster: "/videos/creator-02.jpg" },
  { src: "/videos/hero-clip-3.mp4", poster: "/videos/hero-clip-3.jpg" },
  { src: "/videos/creator-03.mp4", poster: "/videos/creator-03.jpg" },
  { src: "/videos/creator-05.mp4", poster: "/videos/creator-05.jpg" },
];

const heroStats = [
  { target: 1000, format: (n: number) => (n >= 1000 ? "1B+" : `${n}M+`), label: "views generated" },
  { target: 5, format: (n: number) => `${n}M+`, label: "users converted" },
  { target: 1000, format: (n: number) => `${n}+`, label: "trained creators" },
  { target: 14, format: (n: number) => (n >= 14 ? "10–14" : `${n}`), label: "days to post" },
];

const trustedBrands = [
  { name: "Krea AI", file: "krea.png" },
  { name: "Higgsfield", file: "higgsfield.png" },
  { name: "BlackBox AI", file: "blackbox.png" },
  { name: "Fable", file: "fable.png" },
  { name: "Notta", file: "notta.png" },
  { name: "Softr", file: "softr.png" },
  { name: "Liftoff", file: "liftoff.png" },
  { name: "fomo.family", file: "fomo.png" },
  { name: "Makon AI", file: "makon.png" },
  { name: "Aonic", file: "aonic.png" },
];

// DECISION 2026-11: named proof is public. Hero lines are the deck headline
// set, in the owner's wording. See docs/DECISIONS.md (topic: named-proof-2026-11).
const heroProof = [
  { name: "Krea", line: "130M+ views in 3 months, under $3 CPM" },
  { name: "Liftoff", line: "174M+ views in 90 days, $0.82 avg CPM" },
  { name: "Higgsfield", line: "72M+ views in 35 days, ~$0.96 CPM" },
  { name: "FOMO", line: "#3 US App Store Finance" },
];

const steps = [
  { num: "Day 0", title: "Scripts", desc: "We write the scripts." },
  { num: "~48h", title: "Brief", desc: "Creators briefed." },
  { num: "10–14 days", title: "Live", desc: "Accounts warmed up, first videos live." },
  { num: "Every week", title: "Double down", desc: "Double down on the top videos." },
];

const results = [
  {
    name: "Krea",
    logo: "/logos/krea.png",
    figure: "130M+",
    lines: ["views in 3 months", "Under $3 CPM"],
  },
  {
    name: "FOMO",
    logo: "/logos/fomo.png",
    figure: "#3",
    lines: [
      "in US App Store Finance",
      "Ahead of Cash App and Kalshi",
      "Aug 21, 2026",
      "3M+ users, up from 625K in June",
      "~50% of users came from creators",
      "Sub-$4 our CPM",
    ],
  },
  {
    name: "Higgsfield",
    logo: "/logos/higgsfield.png",
    figure: "72M+",
    lines: ["views in 35 days", "45 creators", "~$0.96 CPM"],
  },
  {
    name: "Liftoff",
    logo: "/logos/liftoff.png",
    figure: "174M+",
    lines: ["views in 90 days", "50 creators", "$0.82 average CPM"],
  },
  {
    name: "CookSAT",
    // Official mark from cooksat.com/assets/graphics/branding/CookSAT_vector_logo.svg
    // plus the word in their nav face (Montserrat Bold). The card's grayscale
    // class matches the other logos. See docs/DECISIONS.md (topic: cooksat-logo-2026-11).
    logo: "/logos/cooksat.svg",
    figure: "$968K",
    lines: [
      "ARR from organic UGC",
      "Zero ad spend",
      "100K+ users from paid creators posting organic UGC",
      "55M views",
      "32 creators tracked",
      "Feb–Sep 2026",
    ],
  },
];

const quotes = [
  {
    quote: "Daniel who helped Krea go from 1→100 with UGC and is one of the best agency owners in the space.",
    by: "Miguel Lara, Krea",
  },
  {
    quote: "The UGC agency we trust most in the space.",
    by: "Miguel Lara, Krea",
    lead: true,
  },
  {
    quote: "Great engagement. You guys are doing a great job keeping your team engaged, and we love the quality of your creators and coaches.",
    by: "Will Timberlake, FOMO",
  },
  {
    quote: "Really appreciate the responsiveness you guys have shown. Overall, the experience has been very great.",
    by: "Shotan Jakupov, Higgsfield",
  },
  {
    quote: "Daniel has helped scale our UGC efforts from 0 to 100 and is one of the best talents in this space.",
    by: "Wassim Bouchelouh, Liftoff",
  },
];

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
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const team = [
  {
    name: "Daniel Yun",
    role: "Co-Founder · Los Angeles, CA",
    bio: "He started on camera: 150M+ views and $200K+ earned from his own content. His campaigns for consumer apps have reached 500M+ views and 5M+ users.",
    image: "/videos/team-daniel.jpg",
    slot: "t0",
  },
  {
    name: "Thienvu Vo",
    role: "Co-Founder · New York, NY",
    bio: "Grew his own Instagram past 70K followers. His students have earned $1M+ and generated 500M+ views. Brands at Vo Creations get that same system.",
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
    <div ref={ref} className="closer-mark">
      <img src="/brand/vo-logo.svg" alt="" width={2835} height={3298} />
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

function FounderPhoto({ children }: { children: React.ReactNode }) {
  const { ref, on } = useOnceVisible<HTMLDivElement>();
  return (
    <div ref={ref} className={`tph photo-in ${on ? "is-in" : ""}`}>
      {children}
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
              <span className="lab">UGC for AI startups &amp; tech consumer apps</span>
            </div>
            <div className="hero-copy" ref={heroCopyRef}>
              <h1 className="hero-lockup">
                <span className="hero-offer">Organic UGC for AI and tech apps. </span>
                <span className="hero-rise l1">
                  <span>make them </span>
                </span>
                <span className="hero-rise l2 delay">
                  <span>remember. </span>
                </span>
                <span className="hero-rise l2 l3 delay-2">
                  <span>that&apos;s why we have the biggest.</span>
                </span>
              </h1>
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
                    Let&apos;s Talk
                  </a>
                  <a className="btn-book" href={BOOKING} target="_blank" rel="noopener noreferrer">
                    Book a call ↗
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
              <div className="flex w-max items-center animate-scroll-logos motion-reduce:animate-none [&_img]:brightness-0 [&_img]:invert [&_img]:opacity-80">
                <div className="flex items-center gap-11 pr-11 xl:gap-[72px] xl:pr-[72px]">
                  {trustedBrands.map((brand) => (
                    <LogoImage key={brand.name} src={`/logos/${brand.file}`} alt={`${brand.name} logo`} boxClassName="h-[18px] w-auto xl:h-[21px]" />
                  ))}
                </div>
                <div className="flex items-center gap-11 pr-11 xl:gap-[72px] xl:pr-[72px]" aria-hidden="true">
                  {trustedBrands.map((brand) => (
                    <LogoImage key={`${brand.name}-2`} src={`/logos/${brand.file}`} alt="" boxClassName="h-[18px] w-auto xl:h-[21px]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <WorkCarousel />

        <section className="band mid-top" id="process">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">From signed to posting in 10–14 days.</h2>
            </div>
            <div className="sps">
              {steps.map((step, index) => (
                <Reveal key={step.num} className="sp" delay={index * 70}>
                  <span className="spw">{step.num}</span>
                  <span className="spn">{step.title}</span>
                  <span className="spd">{step.desc}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="band tight-top" id="results">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">Undeniable impact.</h2>
            </div>
            <div className="result-grid">
              {results.map((item) => (
                <article className="result-card" key={item.name}>
                  <h3 className="result-mark">
                    {item.logo ? (
                      <LogoImage src={item.logo} alt={item.name} boxClassName="h-6 w-auto grayscale" />
                    ) : (
                      item.name
                    )}
                  </h3>
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
              <p>Full case studies, spend and playbooks on the call.</p>
              <a className="btn-book" href={BOOKING} target="_blank" rel="noopener noreferrer">
                Book a call ↗
              </a>
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
                      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/60">{when}</span>
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

        <section className="band" id="testimonials">
          <div className="ed-wrap">
            <h2 className="display">In their words</h2>
            <p className="qbig">&ldquo;{quotes.find((item) => item.lead)?.quote}&rdquo;</p>
            <div className="qby">
              <i />
              <span className="lab">{quotes.find((item) => item.lead)?.by}</span>
            </div>
            <div className="tqs">
              {quotes.filter((item) => !item.lead).map((item) => (
                <div className="tq" key={item.by + item.quote.slice(0, 12)}>
                  <p>&ldquo;{item.quote}&rdquo;</p>
                  <span>{item.by}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="band border-t border-white/10" id="pricing">
          <div className="ed-wrap">
            <div className="sh">
              <h2 className="display">Organic UGC for AI startups and tech consumer apps.</h2>
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
                <p>1000+ vetted in-house creators trained through mentorship. They finish a two-week paid trial before they touch a brand account. We keep the top 1%. They post talking-head video on TikTok, Instagram, YouTube, Facebook, and Snapchat.</p>
              </div>
              <div>
                <span className="lab">What&apos;s included</span>
                <p>Trained creators, scripts, posting, creator bonuses, and daily Slack reporting. Paid media, the ad spend, is outside the fee and billed on top. First posts in 10–14 days.</p>
              </div>
              <div>
                <span className="lab">Terms</span>
                <p>90-day minimum, then month to month. No refunds after launch. You own every video. We guarantee your target CPM. CPM means cost per 1,000 organic views. Videos under 1,000 views don&apos;t count toward your CPM.</p>
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
              <h2 className="display">Proven viral creators, turned agency operators.</h2>
            </div>
            <div className="tms">
              {team.map((member) => (
                <figure key={member.name} className={`tm ${member.slot}`}>
                  <FounderPhoto>
                    {"webp" in member && member.webp ? (
                      <picture>
                        <source srcSet={member.webp} type="image/webp" />
                        <img src={member.image} alt={member.name} className="absolute inset-0 h-full w-full object-cover grayscale" style={{ objectPosition: "center" }} loading="lazy" decoding="async" />
                      </picture>
                    ) : (
                      <img src={member.image} alt={member.name} className="absolute inset-0 h-full w-full object-cover grayscale" style={{ objectPosition: "center" }} loading="lazy" decoding="async" />
                    )}
                  </FounderPhoto>
                  <figcaption>
                    <div className="tn">{member.name}</div>
                    <div className="tr">{member.role}</div>
                    <p>{member.bio}</p>
                  </figcaption>
                </figure>
              ))}
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
              <a className="feat-media" href={`/blog/${featured.slug}`}>
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
                  Let&apos;s Talk
                </a>
                <a className="btn-book" href={BOOKING} target="_blank" rel="noopener noreferrer">
                  Book a call ↗
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
