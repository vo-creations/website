"use client";

import { useState } from "react";
import Image from "next/image";

type MiniStat = { value: string; label: string };

interface ResultCardProps {
  company: string;
  logo?: string;
  tags: string[];
  views: string;
  viewsSub: string;
  quote?: string;
  quoteSource?: string;
  challenge?: string;
  approach?: string;
  result?: string;
  miniStats?: MiniStat[];
  note?: string;
}

export default function ResultCard({
  company,
  logo,
  tags,
  views,
  viewsSub,
  quote,
  quoteSource,
  challenge,
  approach,
  result,
  miniStats,
  note,
}: ResultCardProps) {
  const [open, setOpen] = useState(false);
  const expandable = !!(challenge || approach || result);

  return (
    <div
      className={`bg-bg-card rounded-[20px] border border-border overflow-hidden transition-colors hover:border-white/20 ${expandable ? "cursor-pointer" : ""}`}
      onClick={() => expandable && setOpen(!open)}
    >
      <div className="p-7 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-5">
          <div>
            <div className="flex items-center gap-3">
              {logo && (
                <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center shrink-0 overflow-hidden">
                  <Image
                    src={logo}
                    alt={`${company} logo`}
                    width={36}
                    height={36}
                    className="w-full h-full object-contain p-1.5"
                  />
                </div>
              )}
              <div className="text-[22px] font-extrabold tracking-tight">
                {company}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-text-secondary bg-bg-elevated px-3 py-1 rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-text-dim uppercase tracking-wide font-semibold mb-1">
              Total views
            </div>
            <div className="text-5xl md:text-[48px] font-black text-text tracking-tighter leading-none">
              {views}
            </div>
            <div className="text-xs text-text-dim mt-2 font-medium">
              {viewsSub}
            </div>
          </div>
        </div>
      </div>

      {/* Quote bar */}
      {quote && <div className="px-7 py-6 bg-white/[0.03] border-t border-border flex gap-3.5 items-start">
        <div className="text-3xl text-text-dim font-serif leading-none shrink-0 -mt-1">
          &ldquo;
        </div>
        <div>
          <div className="text-sm text-text-secondary leading-relaxed italic">
            {quote}
          </div>
          <div className="text-xs text-text-dim mt-2 not-italic font-medium">
            {quoteSource}
          </div>
        </div>
      </div>}

      {/* Expand hint */}
      {expandable && !open && (
        <div className="text-xs text-text-dim px-7 pb-4 font-medium">
          Click for full case study &#8599;
        </div>
      )}

      {/* Expandable detail */}
      {expandable && open && (
        <div className="px-7 py-6 border-t border-border space-y-5">
          {challenge && (
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wide font-semibold mb-1.5">
                Challenge
              </div>
              <p className="text-sm text-text-secondary leading-[1.7]">
                {challenge}
              </p>
            </div>
          )}
          {approach && (
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wide font-semibold mb-1.5">
                Approach
              </div>
              <p className="text-sm text-text-secondary leading-[1.7]">
                {approach}
              </p>
            </div>
          )}
          {result && (
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wide font-semibold mb-1.5">
                Result
              </div>
              <p className="text-sm text-text-secondary leading-[1.7]">
                {result}
              </p>
            </div>
          )}
          {miniStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {miniStats.map((s) => (
                <div
                  key={s.label}
                  className="bg-bg-elevated rounded-[10px] p-4 text-center"
                >
                  <div className="text-xl font-extrabold text-text tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[10px] text-text-dim uppercase tracking-wide mt-1 font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Simple note (non-expandable cards like Lore) */}
      {note && (
        <div className="px-7 pb-5 text-sm text-text-dim">{note}</div>
      )}
    </div>
  );
}
