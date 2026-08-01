"use client";

import { useEffect } from "react";

interface TikTokEmbedProps {
  url: string;
  label?: string;
}

// DECISION: TikTok's embed.js has no exposed re-scan API, so each mount injects
// its own fresh <script> tag rather than relying on a shared one-time load — the
// script's onload always re-scans the DOM for unprocessed .tiktok-embed blockquotes,
// so this reliably picks up blockquotes added after the script first ran (e.g. by
// React). See docs/DECISIONS.md (topic: showcase-marquee).
export default function TikTokEmbed({ url, label }: TikTokEmbedProps) {
  const videoId = url.match(/\/video\/(\d+)/)?.[1];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-bg-card rounded-2xl aspect-[9/16] relative border border-border overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <blockquote
          className="tiktok-embed"
          cite={url}
          data-video-id={videoId}
          style={{ maxWidth: "100%", minWidth: "100%", margin: 0 }}
        >
          <section></section>
        </blockquote>
      </div>
      {label && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
          <span className="text-xs text-white font-medium">{label}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/70 hover:text-white transition-colors pointer-events-auto"
          >
            TikTok &#8599;
          </a>
        </div>
      )}
    </div>
  );
}
