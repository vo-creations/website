"use client";

import { useEffect, useRef, useState } from "react";

interface InstagramEmbedProps {
  url: string;
  label?: string;
}

export default function InstagramEmbed({ url, label }: InstagramEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded) return;
    // Load IG embed script if not already present
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

  // DECISION 2026-10: do not mount Instagram's embed iframe (or embed.js)
  // until click. The old "preview" iframe still downloaded Instagram's
  // player for every card in the marquee, about 1.5 MB before anyone
  // pressed play. See docs/DECISIONS.md (topic: seo-aeo-2026-10).
  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="bg-bg-card rounded-2xl aspect-[9/16] relative border border-border overflow-hidden group w-full text-left"
        aria-label={label ? `Play ${label} video` : "Play Instagram video"}
      >
        <span className="absolute inset-0 bg-black flex items-center justify-center">
          <span className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <span className="w-0 h-0 border-l-[16px] border-l-[#0a0a0a] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
          </span>
        </span>
        {label && (
          <span className="absolute bottom-0 left-0 right-0 flex items-center px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
            <span className="text-xs text-white font-medium">{label}</span>
          </span>
        )}
      </button>
    );
  }

  return (
    <div ref={containerRef} className="rounded-2xl overflow-hidden">
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
          <span className="text-xs text-text-secondary font-medium">{label}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-dim hover:text-text-secondary transition-colors"
          >
            View on Instagram &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
