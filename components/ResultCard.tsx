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
}

export default function ResultCard({
  company,
  logo,
  views,
  viewsSub,
  miniStats,
}: ResultCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="bg-bg-card/50 backdrop-blur-sm rounded-[20px] border border-white/10 overflow-hidden transition-colors hover:border-white/20 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="p-7 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5">
          {logo ? (
            <LogoImage src={logo} alt={`${company} logo`} boxClassName="h-7 w-auto" />
          ) : (
            <div className="text-[22px] font-extrabold tracking-tight">
              {company}
            </div>
          )}
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

      {/* Expand hint */}
      {!open && (
        <div className="text-xs text-text-dim px-7 pb-4 font-medium">
          Click for full case study &#8599;
        </div>
      )}

      {/* Expandable detail */}
      {open && (
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
                  <div className="text-[10px] text-text-dim uppercase tracking-wide mt-1 font-medium">
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
