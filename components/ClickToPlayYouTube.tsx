"use client";

import { useState } from "react";

export default function ClickToPlayYouTube({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
      {loaded ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full group"
          aria-label={`Play ${title}`}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="w-0 h-0 border-l-[16px] border-l-[#0a0a0a] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
          </span>
        </button>
      )}
    </div>
  );
}
