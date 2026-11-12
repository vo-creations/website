"use client";

import { useEffect, useRef, useState } from "react";
import type { CaseClip } from "@/lib/case-studies";

// Poster stays up until play so eight clips do not fetch or show player chrome.
export default function CaseClipCard({ clip }: { clip: CaseClip }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play();
  }, [playing]);

  return (
    <figure className="wk">
      <div className="wi">
        {playing ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            controls
            playsInline
            preload="none"
            poster={clip.poster}
            aria-label={`${clip.label}, ${clip.proof}`}
          >
            <source src={clip.src} type="video/mp4" />
          </video>
        ) : (
          <button
            type="button"
            className="case-clip-hit"
            aria-label={`Play ${clip.label}, ${clip.proof}`}
            onClick={() => setPlaying(true)}
          >
            <img src={clip.poster} alt="" width={540} height={960} loading="lazy" decoding="async" />
            <span className="case-clip-play" aria-hidden="true" />
            <span className="clip-proof">{clip.proof}</span>
          </button>
        )}
      </div>
      <figcaption>
        <span>{clip.label}</span>
      </figcaption>
    </figure>
  );
}
