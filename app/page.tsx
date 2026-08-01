"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CTABlock from "@/components/CTABlock";
import Label from "@/components/Label";
import ResultCard from "@/components/ResultCard";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import Image from "next/image";

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
const showcaseVideos = [
  { src: "/videos/post-1.mp4", views: "3.8M", likes: "306K", engagement: "7.98%", postUrl: "https://www.instagram.com/p/DTFU5uGjgqV/" },
  { src: "/videos/post-2.mp4", views: "3.7M", likes: "189K", engagement: "5.10%", postUrl: "https://www.instagram.com/p/DTRCvh2E1Lu/" },
  { src: "/videos/post-3.mp4", views: "2.9M", likes: "152K", engagement: "5.36%", postUrl: "https://www.instagram.com/p/DTGTfgsGI62/" },
  { src: "/videos/post-4.mp4", views: "1.5M", likes: "59.6K", engagement: "4.91%", postUrl: "https://www.instagram.com/p/DUMI_NwD0Xa/" },
];

const agencyFaqs = [
  { q: "How many creators will be on my campaign?", a: "3 vetted creators at $10,000/mo, 6 at $20,000/mo. Every creator is trained through our program. No freelancers." },
  { q: "What's the investment?", a: "Starting at $10,000/mo for 3 vetted creators and 180 videos. $20,000/mo unlocks 6 creators and double the output. Paid upfront, no hidden fees." },
  { q: "What platforms do you post on?", a: "TikTok, Instagram Reels, YouTube Shorts, and Facebook. All four platforms, simultaneously." },
  { q: "How quickly can a campaign start?", a: "9 days from signed contract to first videos going live. Strategy and creator matching happen in Days 1-2." },
  { q: "What happens if creators underperform?", a: "We cut underperformers and replace them. That's the VoC Method. Test 7 formats, keep the winners, triple down." },
  { q: "Do you guarantee views or conversions?", a: "Yes. 1,000,000 organic views minimum, or 50% of your fee back. Only organic views count toward the guarantee, no paid views. We don't fake attribution or promise conversion rates we can't prove." },
  { q: "How is this different from hiring freelance creators?", a: "Our creators are trained through a 2-month in-house program. They know our format system, they've been tested, and they work as a coordinated team, not solo freelancers." },
  { q: "Can I see examples of past campaigns?", a: "Yes. Check the Results section above. We're happy to walk through case studies on a call." },
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

const verticalVideos = [
  { label: "My Story", src: "/videos/my-story.mp4", postUrl: "https://www.instagram.com/itsthienvuvo/reel/DOhA4Sakaku/" },
  { label: "Creator success", src: "/videos/creator-success.mp4", postUrl: "https://www.instagram.com/reel/DKucBvzMHbK/" },
  { label: "Creator example", src: "/videos/creator-example.mp4", postUrl: "https://www.instagram.com/reels/DHJSBnYO2As/" },
];

const differentiators = [
  {
    num: "01",
    title: "We train our own creators",
    desc: "Every creator went through our training program. They know our system, standards, and formats.",
  },
  {
    num: "02",
    title: "Talking-head only",
    desc: "15-40 seconds. Real face, real voice. No text-on-screen. That's what converts.",
  },
  {
    num: "03",
    title: "The VoC Method",
    desc: "Test 7 formats, cut the bottom 4, triple down on winners. Applied to every client.",
  },
  {
    num: "04",
    title: "Quality over quantity",
    desc: "10 new campaigns per month. Not 100. Every client gets senior attention.",
  },
];

const marketStats = [
  { num: "$10B+", text: "US UGC spend 2025", source: "↑ 11% YoY" },
  { num: "93%", text: "of marketers say UGC outperforms traditional ads", source: "Brand adoption" },
  { num: "6.9×", text: "more engagement than brand-created content", source: "vs branded content" },
];

const marketStats2 = [
  { num: "30-80%", text: "cheaper than influencer marketing", source: "Cost savings" },
  { num: "93%", text: "creator supply growth 2024-25", source: "Market growth" },
];

const team = [
  {
    name: "Thienvu Vo",
    location: "Richmond, VA",
    statLine: "Founder of Mentorship",
    detailLine: "Led students to $1M in earnings & 500M+ views",
    image: "/videos/team-thienvu.jpg",
  },
  {
    name: "Daniel Yun",
    location: "Los Angeles, CA",
    statLine: "150M+ views as a creator",
    detailLine: "$200K+ in earnings",
    image: "/videos/team-daniel.jpg",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [budget, setBudget] = useState(15000);
  const [videos, setVideos] = useState(180);

  const influencerCost = videos * 500;
  const vocCostPerVideo = budget / videos;
  const savings = influencerCost - budget;
  const savingsPercent = Math.round((savings / influencerCost) * 100);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Nav />

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-[160px] pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hex pointer-events-none" />
        <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(245,166,35,0.06)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-[12px] font-semibold text-text-secondary tracking-wide">
            The team behind 1B+ views
          </span>
        </div>

        <h1 className="relative text-[clamp(36px,6vw,68px)] font-extrabold leading-[1.05] tracking-tighter mb-6 animate-fade-up-delay-1">
          We don&apos;t hire creators.
          <br />
          We <span className="text-accent">build</span> them.
        </h1>

        <p className="relative text-[clamp(16px,2.2vw,20px)] text-text-secondary max-w-[540px] leading-relaxed mb-10 animate-fade-up-delay-2">
          Trained creators. Proven formats. Predictable virality.
          The only UGC agency that builds its own creator supply chain.
        </p>

        <div className="relative flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
          <a
            href="https://calendar.app.google/8x72A8nxr3gQpVfx7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-accent to-[#E08A1E] text-text font-bold text-base px-9 py-4 rounded-full hover:shadow-[0_0_40px_rgba(245,166,35,0.3)] hover:-translate-y-0.5 transition-all"
          >
            Apply for a campaign slot →
          </a>
          <a
            href="#results"
            className="inline-flex items-center gap-2 bg-transparent text-text font-medium text-base px-9 py-4 rounded-full border border-border hover:border-black/20 hover:bg-black/[0.03] transition-all"
          >
            See results →
          </a>
        </div>

        <div className="relative grid grid-cols-2 sm:flex sm:flex-row sm:gap-14 mt-[64px] sm:mt-[72px] w-full max-w-[320px] sm:w-auto sm:max-w-none mx-auto animate-fade-up-delay-4">
          {[
            ["1B+", "Views generated"],
            ["30+", "Brands scaled"],
            ["100+", "Trained creators"],
            ["9", "Days to launch"],
          ].map(([num, lbl], i) => (
            <div
              key={lbl}
              className={`text-center py-6 sm:py-0 ${
                i % 2 === 0 ? "border-r border-border sm:border-r-0" : ""
              } ${i < 2 ? "border-b border-border sm:border-b-0" : ""}`}
            >
              <div className="text-[28px] sm:text-[32px] font-extrabold tracking-tighter leading-none">
                {num}
              </div>
              <div className="text-[11px] font-medium text-text-dim tracking-wide uppercase mt-2">
                {lbl}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="pb-[80px] px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="text-[11px] font-semibold text-text-dim uppercase tracking-[0.2em] mb-6">
            Trusted by
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 opacity-70">
            {["Fable", "Codedex", "BlackBox AI", "Makon AI"].map((name) => (
              <span
                key={name}
                className="text-xl md:text-2xl font-extrabold tracking-tight text-text-secondary hover:text-text transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT THAT GOES VIRAL */}
      <section className="py-[100px]">
        <div className="max-w-[1100px] mx-auto px-6">
          <Label>Our work</Label>
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            Content that goes <span className="text-accent">viral</span>
          </h2>
          <p className="text-base text-text-secondary mb-8">
            Real UGC from our trained creator network.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {showcaseVideos.map((v) => (
              <div
                key={v.src}
                className="bg-bg-card rounded-2xl overflow-hidden border border-border group"
              >
                <div className="relative aspect-[9/16]">
                  <video
                    src={`${v.src}#t=0.1`}
                    playsInline
                    muted
                    loop
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                    onMouseEnter={(e) => { const el = e.currentTarget; el.play(); }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.pause(); el.currentTime = 0.1; }}
                    onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }}
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="text-[13px] font-bold text-white bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {v.views} views
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[11px] text-white/70 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm cursor-pointer">
                      Tap to unmute
                    </span>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="flex gap-3 text-[11px] text-text-dim font-medium">
                    <span>♥ {v.likes}</span>
                    <span>{v.engagement} eng.</span>
                  </div>
                  <a
                    href={v.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-accent hover:underline font-medium"
                  >
                    View post ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

      {/* STORY */}
      <section className="py-[100px]">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>Our story</Label>
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            The training program that became an{" "}
            <span className="text-accent">agency.</span>
          </h2>
          <p className="text-base text-text-secondary mb-8">
            From 3 minimum-wage jobs to 100+ creators and 50+ brands.
          </p>

          <div className="mb-5">
            <YouTubeEmbed
              videoId="xL3zWBso9mw"
              title="Thienvu: How I built Vo Creations"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {verticalVideos.map((v) => (
              <div
                key={v.label}
                className="bg-bg-card rounded-2xl overflow-hidden border border-border"
              >
                <div className="relative aspect-[9/16]">
                  <video
                    src={`${v.src}#t=0.1`}
                    playsInline
                    muted
                    loop
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                    onMouseEnter={(e) => { const el = e.currentTarget; el.play(); }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.pause(); el.currentTime = 0.1; }}
                    onClick={(e) => { e.currentTarget.muted = !e.currentTarget.muted; }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold text-white bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {v.label}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[11px] text-white/70 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm cursor-pointer">
                      Tap to unmute
                    </span>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-end">
                  <a
                    href={v.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-accent hover:underline font-medium"
                  >
                    View on Instagram ↗
                  </a>
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
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            From signed to viral in 9 days
          </h2>
          <p className="text-base text-text-secondary mb-10">
            A methodology refined across 50+ campaigns. Not a black box.
          </p>

          <div className="flex flex-col gap-5">
            {steps.map((s) => (
              <div key={s.num} className="flex gap-5 items-start">
                <div className="w-11 h-11 min-w-[44px] bg-bg-elevated rounded-[10px] flex items-center justify-center text-[15px] font-bold text-accent">
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

      {/* OUR FORMAT */}
      <section className="py-[100px]">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>Our format</Label>
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            Talking-head only. No text-on-screen.{" "}
            <span className="text-accent">Ever.</span>
          </h2>
          <p className="text-base text-text-secondary mb-10">
            Every platform&apos;s algorithm rewards authentic human content. A real face converts better than text overlays.
          </p>

          {/* Comparison — row-based table */}
          <div className="mb-8 border-t border-border">
            {/* Header */}
            <div className="grid grid-cols-2 md:grid-cols-[140px_1fr_1fr] gap-4 md:gap-6 py-4 border-b border-border">
              <div className="hidden md:block"></div>
              <div className="text-[11px] text-accent font-semibold uppercase tracking-wider">
                Vo Creations
              </div>
              <div className="text-[11px] text-text-dim font-semibold uppercase tracking-wider">
                Most UGC agencies
              </div>
            </div>
            {[
              ["Format", "Talking-head storytelling", "Text-on-screen, mixed formats"],
              ["Length", "15–40 seconds", "Varies (15s–3min)"],
              ["Why it works", "Authentic. Feels like a friend's recommendation.", "Looks “produced.” Platforms are deprioritizing it."],
              ["Creator skill", "High, from in-house training", "Low, anyone can overlay text"],
              ["Scroll-stop", "A real face holds attention", "Text competes with every other overlay"],
            ].map(([label, vo, others]) => (
              <div
                key={label}
                className="grid grid-cols-2 md:grid-cols-[140px_1fr_1fr] gap-x-4 md:gap-x-6 gap-y-3 py-5 border-b border-border last:border-b-0"
              >
                <div className="col-span-2 md:col-span-1 text-[11px] text-text-dim uppercase tracking-wide font-semibold">
                  {label}
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-accent leading-snug shrink-0">&#10003;</span>
                  <span className="text-sm text-text leading-snug">{vo}</span>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-text-dim leading-snug shrink-0">&#10007;</span>
                  <span className="text-sm text-text-dim leading-snug">{others}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-text-secondary leading-relaxed">
            Our creators are trained to tell a compelling story in 30 seconds
            with nothing but their face, their voice, and your product.
            That&apos;s the skill. That&apos;s what you&apos;re paying for.
          </p>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

      {/* DIFFERENTIATORS */}
      <section className="py-[100px]">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>What makes us different</Label>
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-10">
            Four things nobody else does.
          </h2>

          <div className="flex flex-col gap-5">
            {differentiators.map((d) => (
              <div key={d.num} className="flex gap-5 items-start">
                <div className="w-11 h-11 min-w-[44px] bg-bg-elevated rounded-[10px] flex items-center justify-center text-[15px] font-bold text-accent">
                  {d.num}
                </div>
                <div>
                  <h4 className="text-[17px] font-bold tracking-tight mb-1">
                    {d.title}
                  </h4>
                  <p className="text-[15px] text-text-secondary leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

      {/* MARKET STATS */}
      <section className="py-[100px] px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="max-w-[720px] mx-auto text-center mb-2">
            <Label>The market</Label>
            <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
              UGC is eating{" "}
              <span className="text-accent">marketing budgets</span>
            </h2>
            <p className="text-base text-text-secondary mb-10">
              Source: Mordor Intelligence, Fortune Insights, Whop,
              InfluencerMarketingHub 2026
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {marketStats.map((s) => (
              <div
                key={s.num}
                className="bg-bg-card rounded-2xl p-7 text-center border border-border hover:border-border-accent transition-colors"
              >
                <div className="text-[28px] font-extrabold text-accent tracking-tight">
                  {s.num}
                </div>
                <div className="text-[13px] text-text-secondary mt-2 leading-snug">
                  {s.text}
                </div>
                <div className="text-[10px] text-text-dim tracking-wide uppercase mt-2 font-medium">
                  {s.source}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-w-[660px] mx-auto">
            {marketStats2.map((s) => (
              <div
                key={s.num}
                className="bg-bg-card rounded-2xl p-7 text-center border border-border hover:border-border-accent transition-colors"
              >
                <div className="text-[28px] font-extrabold text-accent tracking-tight">
                  {s.num}
                </div>
                <div className="text-[13px] text-text-secondary mt-2 leading-snug">
                  {s.text}
                </div>
                <div className="text-[10px] text-text-dim tracking-wide uppercase mt-2 font-medium">
                  {s.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

      {/* BUDGET CALCULATOR */}
      <section className="py-[100px]">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>Your budget</Label>
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            Run the numbers
          </h2>
          <p className="text-base text-text-secondary mb-10">
            VoC vs. traditional influencer marketing.
          </p>

          {/* Sliders */}
          <div className="space-y-8 mb-10">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Monthly content budget</span>
                <span className="text-lg font-bold text-accent">
                  ${budget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={50000}
                step={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-bg-elevated cursor-pointer accent-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(245,166,35,0.4)]"
              />
              <div className="flex justify-between text-xs text-text-dim mt-1">
                <span>$5K</span>
                <span>$50K</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Videos needed per month</span>
                <span className="text-lg font-bold text-accent">{videos}</span>
              </div>
              <input
                type="range"
                min={30}
                max={360}
                step={10}
                value={videos}
                onChange={(e) => setVideos(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-bg-elevated cursor-pointer accent-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(245,166,35,0.4)]"
              />
              <div className="flex justify-between text-xs text-text-dim mt-1">
                <span>30</span>
                <span>360</span>
              </div>
            </div>
          </div>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-card rounded-2xl p-6 border border-border">
              <h4 className="text-sm font-semibold mb-2">Influencer marketing</h4>
              <div className="text-[28px] font-extrabold tracking-tight text-red">
                ${influencerCost.toLocaleString()}
              </div>
              <div className="text-[13px] text-text-secondary mt-2 leading-relaxed">
                $500/video avg · 2-4 week lead time · Limited usage rights
              </div>
            </div>

            <div className="bg-bg-card rounded-2xl p-6 border border-border-accent">
              <h4 className="text-sm font-semibold mb-2">Vo Creations UGC</h4>
              <div className="text-[28px] font-extrabold tracking-tight text-green">
                ${budget.toLocaleString()}
              </div>
              <div className="text-[13px] text-text-secondary mt-2 leading-relaxed">
                ~${Math.round(vocCostPerVideo)}/video · 9-day launch · Full
                ownership · VoC Method
              </div>
            </div>
          </div>

          {/* Savings */}
          {savings > 0 && (
            <div className="bg-green/[0.06] border border-green/[0.12] rounded-2xl p-6 text-center mt-5">
              <div className="text-4xl font-extrabold text-green tracking-tight">
                ${savings.toLocaleString()}
              </div>
              <div className="text-sm text-text-secondary mt-1">
                saved per month ({savingsPercent}% less)
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

      {/* RESULTS */}
      <section className="py-[100px]" id="results">
        <div className="max-w-[1000px] mx-auto px-6">
          <Label>Case Studies</Label>
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            Undeniable <span className="text-accent">impact.</span>
          </h2>
          <p className="text-base text-text-secondary mb-10">
            Click any card for the full story.
          </p>

          <div className="flex flex-col gap-4">
            <ResultCard
              company="Fable"
              tags={["Social reading app", "Palo Alto", "$28M raised", "Tiger Global, Redpoint"]}
              views="25.4M"
              viewsSub="4 weeks / 3 creators"
              quote="Vo Creations delivered 3M views in just 7 days. Their creators truly understand how to create content that resonates."
              quoteSource="Fable team"
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
              company="Codedex"
              tags={["Learn-to-code platform", "Brooklyn, NY", "$1M raised", "Hustle Fund, Goodwater"]}
              views="10M+"
              viewsSub="2 months"
              quote="We tried influencer marketing before, but Vo Creations gave us 10x the results at a fraction of the cost."
              quoteSource="Codedex team"
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

            <ResultCard
              company="BlackBox AI"
              tags={["AI Developer Tools", "Coding assistant"]}
              views="11.5M"
              viewsSub="20 days / 40-60 paid-organic mix"
              quote="Vo Creations made our paid ads indistinguishable from organic creator content. That's what scaled us."
              quoteSource="BlackBox AI team"
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
              tags={["EdTech", "SAT prep", "AI-powered"]}
              views="10.2M"
              viewsSub="2 months / 8 creators"
              quote="Vo Creations turned SAT prep, one of the hardest categories to make viral, into bingeable short-form content."
              quoteSource="Makon AI team"
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
          </div>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto h-px bg-border" />

      {/* TEAM */}
      <section className="py-[100px]" id="team">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>The team</Label>
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-2">
            Small team. Senior operators.
          </h2>
          <p className="text-base text-text-secondary mb-10">
            Proven creators, turned agency owners
          </p>

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
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[17px] font-bold">{t.name}</span>
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-accent shrink-0">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-text-secondary mt-1 mb-4">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                    </svg>
                    {t.location}
                  </div>
                  <div className="text-[15px] font-bold italic text-accent">
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

      {/* FAQ */}
      <section className="py-[100px]" id="faq">
        <div className="max-w-[720px] mx-auto px-6">
          <Label>FAQ</Label>
          <h2 className="text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight mb-10">
            Common questions
          </h2>

          <div className="max-w-[640px]">
            {agencyFaqs.map((faq, i) => (
              <div key={i} className="border-b border-border py-[22px]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-base font-semibold tracking-tight">
                    {faq.q}
                  </span>
                  <span
                    className={`text-[22px] text-accent font-light shrink-0 ml-4 transition-transform ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    +
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
