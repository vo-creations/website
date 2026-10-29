"use client";

import { useState } from "react";

interface FacebookEmbedProps {
  url: string;
  label?: string;
}

// DECISION: uses Facebook's iframe Video Plugin (plugins/video.php), not the JS-SDK
// fb-root approach — it renders public videos/reels without an App ID and without
// requiring the viewer to be logged in, even though visiting the reel URL directly
// now hits a login wall. See docs/DECISIONS.md (topic: showcase-marquee).
// DECISION 2026-10: the iframe stays unmounted until click, same as Instagram
// and TikTok. See docs/DECISIONS.md (topic: seo-aeo-2026-10).
export default function FacebookEmbed({ url, label }: FacebookEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const embedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;

  return (
    <div className="bg-bg-card rounded-2xl aspect-[9/16] relative border border-border overflow-hidden group">
      {loaded ? (
        <iframe
          src={embedSrc}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          scrolling="no"
          allowFullScreen
          title={label || "Facebook video"}
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="absolute inset-0 bg-black flex items-center justify-center cursor-pointer"
          aria-label={label ? `Play ${label} video` : "Play Facebook video"}
        >
          <span className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <span className="w-0 h-0 border-l-[16px] border-l-[#0a0a0a] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
          </span>
        </button>
      )}
      {label && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
          <span className="text-[15px] text-white font-medium">{label}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex min-h-11 items-center text-[15px] text-white/70 hover:text-white transition-colors pointer-events-auto"
          >
            Facebook &#8599;
          </a>
        </div>
      )}
    </div>
  );
}
