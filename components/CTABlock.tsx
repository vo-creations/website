"use client";

import { useEffect, useRef } from "react";
import { MaskText, Reveal } from "@/components/motion";

export default function CTABlock({
  heading = "1B+ views. Your target CPM, guaranteed.",
  sub = "Campaigns start at $50K+ a month. First posts go live in 10-14 days.",
  buttonText = "Book a call",
  href = "https://calendar.app.google/8x72A8nxr3gQpVfx7",
  paper = false,
}: {
  heading?: string;
  sub?: string;
  buttonText?: string;
  href?: string;
  paper?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!paper) return;
    const section = sectionRef.current;
    const mark = markRef.current;
    if (!section || !mark) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = (view - rect.top) / (view + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      // About 14 degrees across the section. The mark stays inside its column.
      mark.style.transform = `rotate(${((clamped - 0.5) * 14).toFixed(2)}deg)`;
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
  }, [paper]);

  if (paper) {
    return (
      <section ref={sectionRef} className="bg-[#0B0B0C] px-6 py-24 text-[#F2F0EB] md:px-14 md:py-32">
        {/* DECISION 2026-10: the chrome mark lives in the container, not
            pinned to the viewport edge. See docs/DECISIONS.md
            (topic: homepage-motion-2026-10). */}
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_clamp(168px,22vw,250px)] lg:gap-20">
          <div className="min-w-0">
            <h2 className="max-w-[16ch] font-serif text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-[-0.03em]">
              <MaskText text={heading} />
            </h2>
            <Reveal delay={80}>
              <p className="mt-6 max-w-[36rem] text-[18px] leading-relaxed text-white/60">{sub}</p>
            </Reveal>
            <Reveal delay={140}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[#F2F0EB] px-8 text-[15px] font-semibold text-[#0B0B0C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2F0EB]"
              >
                {buttonText}
              </a>
            </Reveal>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              ref={markRef}
              src="/brand/vo-chrome-sm.webp"
              alt=""
              width={384}
              height={465}
              loading="lazy"
              decoding="async"
              className="h-auto w-[min(46vw,210px)] lg:w-full"
            />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="px-6 pb-16 pt-4 text-center">
      <div className="mx-auto max-w-[560px] rounded-3xl border border-white/10 bg-bg-card/50 px-8 py-10 backdrop-blur-sm">
        <h2 className="mb-3 font-display text-[28px] font-extrabold tracking-[-0.04em] text-[#fbfbf9]">
          {heading}
        </h2>
        <p className="mb-6 text-base text-[#d4d4d0]">{sub}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-full bg-white px-9 py-4 text-base font-semibold text-black transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
