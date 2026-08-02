"use client";

import { useState } from "react";

interface YouTubeEmbedProps {
  url: string;
  label?: string;
}

// DECISION: matches the {url, label} prop shape and aspect-[9/16] card treatment
// already established by TikTokEmbed/FacebookEmbed/InstagramEmbed, not the
// aspect-video {videoId, title, watchUrl} shape this component originally had —
// it was unused anywhere on the site, so no regression risk in aligning it.
// See docs/DECISIONS.md (topic: showcase-marquee).
// YouTube always returns 200 for any resolution, even ones a video doesn't
// have — a missing maxresdefault/sddefault silently serves a tiny 120x90 gray
// placeholder instead of 404ing, so an HTTP-status check can't tell them
// apart. Falls back on the real signal: naturalWidth of the loaded image.
const THUMBNAIL_FALLBACK_CHAIN = ["maxresdefault", "sddefault", "hqdefault"];
const PLACEHOLDER_WIDTH = 120;

export default function YouTubeEmbed({ url, label }: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const [thumbTier, setThumbTier] = useState(0);
  const videoId = url.match(/(?:shorts\/|v=|youtu\.be\/)([\w-]+)/)?.[1] ?? "";
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${THUMBNAIL_FALLBACK_CHAIN[thumbTier]}.jpg`;

  return (
    <div className="bg-bg-card rounded-2xl aspect-[9/16] relative border border-border overflow-hidden group">
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
          title={label || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
        />
      ) : (
        <>
          <img
            src={thumbnailUrl}
            alt={label || "Video thumbnail"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onLoad={(e) => {
              if (
                e.currentTarget.naturalWidth <= PLACEHOLDER_WIDTH &&
                thumbTier < THUMBNAIL_FALLBACK_CHAIN.length - 1
              ) {
                setThumbTier((t) => t + 1);
              }
            }}
          />
          <div
            onClick={() => setLoaded(true)}
            className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center"
          >
            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <div className="w-0 h-0 border-l-[16px] border-l-[#0a0a0a] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
            </div>
          </div>
          {label && (
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
              <span className="text-xs text-white font-medium">{label}</span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-white/70 hover:text-white transition-colors pointer-events-auto"
              >
                YouTube &#8599;
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
