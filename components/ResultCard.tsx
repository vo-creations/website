"use client";

import { useState } from "react";
import LogoImage from "./LogoImage";

type MiniStat = { value: string; label: string };

interface ResultCardProps {
  company: string;
  logo?: string;
  views: string;
  viewsSub: string;
  miniStats?: MiniStat[];
  // Gates the proof (logo, view count, stat grid) behind a blur — card
  // shape/layout stays intact, click-to-expand is disabled since there's
  // nothing legible to reveal. Paired with an overlay CTA rendered by the
  // parent section, not this component (one overlay per section, not per
  // card — see docs/DECISIONS.md, topic: case-studies-lock).
  locked?: boolean;
  paper?: boolean;
}

export default function ResultCard({
  company,
  logo,
  views,
  viewsSub,
  miniStats,
  locked = false,
  paper = false,
}: ResultCardProps) {
  const [open, setOpen] = useState(false);
  const isOpen = open && !locked;

  return (
    <div
      className={paper
        ? "overflow-hidden rounded-2xl border border-white/10 bg-[#111113]"
        : `bg-bg-card/50 backdrop-blur-sm rounded-[20px] border border-white/10 overflow-hidden transition-colors hover:border-white/20 ${locked ? "" : "cursor-pointer"}`}
      onClick={locked ? undefined : () => setOpen(!open)}
    >
      <div className="p-7 pb-6">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          {locked ? (
            <p className={`text-[17px] font-semibold tracking-tight ${paper ? "text-[#F2F0EB]" : "text-text"}`}>{company}</p>
          ) : logo ? (
            <LogoImage
              src={logo}
              alt={`${company} logo`}
              boxClassName="h-7 w-auto"
            />
          ) : (
            <div className="text-[22px] font-extrabold tracking-tight">{company}</div>
          )}
          <div
            className={`shrink-0 text-left sm:text-right ${locked ? (paper ? "blur-sm select-none" : "blur-md select-none") : ""}`}
            {...(locked ? { "data-nosnippet": true, "aria-hidden": true } : {})}
          >
            <div className={`mb-1 text-[15px] font-semibold uppercase tracking-wide ${paper ? "text-white/60" : "text-text-dim"}`}>
              Total views
            </div>
            <div className={`leading-none tracking-tighter ${paper ? "font-serif text-5xl text-[#F2F0EB] md:text-[64px]" : "text-5xl font-black text-text md:text-[48px]"}`}>
              {views}
            </div>
            <div className={`mt-2 text-[15px] font-medium ${paper ? "text-white/60" : "text-text-dim"}`}>{viewsSub}</div>
          </div>
        </div>
      </div>

      {/* Expand hint */}
      {!isOpen && !locked && (
        <div className="text-xs text-text-dim px-7 pb-4 font-medium">
          Click for full case study &#8599;
        </div>
      )}

      {/* Expandable detail */}
      {isOpen && (
        <div className="px-7 py-6 border-t border-border space-y-5">
          {miniStats && (
            <div
              className={`grid grid-cols-2 ${miniStats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"} gap-3 pt-1`}
            >
              {miniStats.map((s) => (
                <div
                  key={s.label}
                  className="bg-bg-elevated rounded-[10px] p-4 text-center"
                >
                  <div className="text-xl font-extrabold text-text tracking-tight">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[13px] font-medium uppercase tracking-wide text-text-dim">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
