"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import InstagramEmbed from "@/components/InstagramEmbed";
import TikTokEmbed from "@/components/TikTokEmbed";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import FacebookEmbed from "@/components/FacebookEmbed";

// DECISION 2026-11: the approved page is a drag carousel, not the old
// auto-scrolling marquee. Playback stays the official click-to-load embed
// (no self-hosted mp4, no iframe until a clip is opened). See docs/DECISIONS.md
// (topic: homepage-c-final-2026-11).

type Clip = {
  type: "instagram" | "tiktok" | "youtube" | "facebook";
  url: string;
  label: string;
  poster?: string;
  alt: string;
};

const SIZES = ["w1", "w2", "w3", "w2", "w1", "w3", "w2"] as const;

// Lead with the stills from the approved board, then the rest of the live
// showcase so nothing is dropped. Order of the tail follows the previous
// interleaved list.
const clips: Clip[] = [
  { type: "instagram", url: "https://www.instagram.com/p/DXzgEEwRXm2/", label: "Instagram", poster: "/creators/ig/DXzgEEwRXm2.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DVzqq6eEVMt/", label: "Instagram", poster: "/creators/ig/DVzqq6eEVMt.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "youtube", url: "https://www.youtube.com/shorts/urpg-ygRKto", label: "YouTube", poster: "/creators/yt-ur.jpg", alt: "A creator speaking to the camera in a vertical YouTube video." },
  { type: "tiktok", url: "https://www.tiktok.com/@abgetsfit_/video/7631809332836830477", label: "TikTok", poster: "/creators/tiktok-abgetsfit-thumb.jpg", alt: "A creator speaking to the camera in a vertical TikTok video." },
  { type: "instagram", url: "https://www.instagram.com/p/DY5IDHqknw4/", label: "Instagram", poster: "/creators/ig/DY5IDHqknw4.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "tiktok", url: "https://www.tiktok.com/@codewithsam4/video/7636811053304728853", label: "TikTok", poster: "/creators/tiktok-codewithsam4-thumb.jpg", alt: "A creator speaking to the camera in a vertical TikTok video." },
  { type: "youtube", url: "https://www.youtube.com/shorts/k1NNFSkVAgs", label: "YouTube", poster: "/creators/yt-k1.jpg", alt: "A creator speaking to the camera in a vertical YouTube video." },
  { type: "instagram", url: "https://www.instagram.com/p/DXSp7ttDH9D/", label: "Instagram", poster: "/creators/ig/DXSp7ttDH9D.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DYaCAFXvnPw/", label: "Instagram", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "tiktok", url: "https://www.tiktok.com/@jacobw.health/video/7644976113755622686", label: "TikTok", poster: "/creators/tiktok-jacobw-thumb.jpg", alt: "A creator speaking to the camera in a vertical TikTok video." },
  { type: "instagram", url: "https://www.instagram.com/p/DXE2rDtE2lI/", label: "Instagram", poster: "/creators/ig/DXE2rDtE2lI.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DZ6qfKHRJG6/", label: "Instagram", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DWtNDXqjl3I/", label: "Instagram", poster: "/creators/ig/DWtNDXqjl3I.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "facebook", url: "https://www.facebook.com/reel/1604299521120091", label: "Facebook", alt: "A creator speaking to the camera in a vertical Facebook video." },
  { type: "instagram", url: "https://www.instagram.com/p/DaJ2O4ON_uK/", label: "Instagram", poster: "/creators/ig/DaJ2O4ON_uK.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DTRCvh2E1Lu/", label: "Instagram", poster: "/creators/ig/DTRCvh2E1Lu.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DUMI_NwD0Xa/", label: "Instagram", poster: "/creators/ig/DUMI_NwD0Xa.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
];

function Player({ clip }: { clip: Clip }) {
  if (clip.type === "instagram") return <InstagramEmbed url={clip.url} startLoaded />;
  if (clip.type === "tiktok") return <TikTokEmbed url={clip.url} thumb={clip.poster} startLoaded />;
  if (clip.type === "youtube") return <YouTubeEmbed url={clip.url} label={clip.label} startLoaded />;
  return <FacebookEmbed url={clip.url} label={clip.label} startLoaded />;
}

export default function WorkCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(18);
  const [playing, setPlaying] = useState<string | null>(null);

  function measure() {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const seen = max <= 1 ? 1 : (el.scrollLeft + el.clientWidth) / el.scrollWidth;
    setProgress(Math.max(8, Math.min(100, seen * 100)));
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-clip]"));
    let current = 0;
    const edge = el.scrollLeft + 24;
    cards.forEach((card, i) => {
      if (card.offsetLeft - el.offsetLeft <= edge) current = i;
    });
    setIndex(current);
  }

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // measure on mount only; scroll updates itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function step(direction: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * Math.min(340, el.clientWidth * 0.72),
      behavior: reduce ? "auto" : "smooth",
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    if ((event.target as HTMLElement).closest("button, a, iframe")) return;
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = { x: event.clientX, left: el.scrollLeft, moved: false };
    el.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const el = scrollerRef.current;
    if (!drag || !el) return;
    const dx = event.clientX - drag.x;
    if (Math.abs(dx) > 6) drag.moved = true;
    el.scrollLeft = drag.left - dx;
  }

  function onPointerUp() {
    if (dragRef.current?.moved) suppressClick.current = true;
    dragRef.current = null;
  }

  const total = String(clips.length).padStart(2, "0");
  const current = String(index + 1).padStart(2, "0");
  const playingLabel = clips.find((clip) => clip.url === playing)?.label;

  return (
    <section className="band tight-top" id="work" aria-roledescription="carousel" aria-label="Our work" onKeyDown={onKeyDown}>
      <div className="ed-wrap">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="display">
              Content that converts
              <br />
              and goes viral.
            </h2>
            <p className="lede mt-6">
              Real UGC from our trained creator network across TikTok, Instagram, YouTube, Facebook, and Snapchat.
            </p>
          </div>
          <div className="ctr">
            <span className="idx" aria-live="polite">
              {current} / {total}
            </span>
            <span className="sr-only" aria-live="polite">
              {playingLabel ? `Playing ${playingLabel}` : ""}
            </span>
            <button type="button" aria-label="Previous videos" onClick={() => step(-1)}>
              ←
            </button>
            <button type="button" aria-label="Next videos" onClick={() => step(1)}>
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="wks"
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          suppressClick.current = false;
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        {clips.map((clip, i) => {
          const open = playing === clip.url;
          return (
            <figure key={clip.url} className={`wk ${SIZES[i % SIZES.length]}`} data-clip>
              <div className="wi">
                {open ? (
                  <div className="absolute inset-0" aria-label={`Playing ${clip.label} video`}>
                    <Player clip={clip} />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="absolute inset-0"
                    aria-label={`Play ${clip.label} video`}
                    onClick={() => setPlaying(clip.url)}
                  >
                    {clip.poster ? (
                      <Image src={clip.poster} alt={clip.alt} fill sizes="300px" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center bg-[#1c1c1b] text-[15px] text-white">
                        {clip.label}
                      </span>
                    )}
                    <span className="play-dot" aria-hidden="true">
                      <i />
                    </span>
                  </button>
                )}
              </div>
              <figcaption>
                <span>{clip.label}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div className="prog" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
