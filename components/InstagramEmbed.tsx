"use client";

import { useEffect, useRef, useState } from "react";

interface InstagramEmbedProps {
  url: string;
  label?: string;
  poster?: string;
  posterAlt?: string;
}

export default function InstagramEmbed({ url, label, poster, posterAlt }: InstagramEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded) return;
    if (!(window as any).instgrm) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => (window as any).instgrm?.Embeds?.process();
    } else {
      (window as any).instgrm.Embeds.process();
    }
  }, [loaded]);

  // DECISION 2026-10: do not mount Instagram's embed iframe until click.
  // Posters are saved locally. Posts without a poster use a labeled card,
  // not a black box. See docs/DECISIONS.md (topic: site-audit-2026-10).
  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-border bg-[#1a1a1a] text-left"
        aria-label={label ? `Play ${label} video` : "Play Instagram video"}
      >
        {poster ? (
          <img
            src={poster}
            alt={posterAlt ?? (label ? `${label} still` : "Talking-head UGC still")}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,#3a2a22,transparent_45%),radial-gradient(circle_at_80%_80%,#1c2430,#111)] px-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-[15px] font-semibold text-white">
              IG
            </span>
            <span className="text-[15px] font-medium text-white">Instagram</span>
            <span className="text-[15px] text-white/70">Play on Instagram</span>
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
            <span className="ml-1 h-0 w-0 border-b-[10px] border-l-[16px] border-t-[10px] border-b-transparent border-l-[#0a0a0a] border-t-transparent" />
          </span>
        </span>
        {label && (
          <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
            <span className="text-[15px] font-medium text-white">{label}</span>
          </span>
        )}
      </button>
    );
  }

  return (
    <div ref={containerRef} className="overflow-hidden rounded-2xl">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        style={{
          background: "#1C1C1C",
          border: 0,
          borderRadius: "16px",
          margin: 0,
          maxWidth: "100%",
          minWidth: "240px",
          width: "100%",
        }}
      />
      {label && (
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-[15px] font-medium text-text-secondary">{label}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-text-dim transition-colors hover:text-text-secondary"
          >
            View on Instagram &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
