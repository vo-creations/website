"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import InstagramEmbed from "@/components/InstagramEmbed";
import TikTokEmbed from "@/components/TikTokEmbed";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import FacebookEmbed from "@/components/FacebookEmbed";
import { kellyWorkClip, proofFor } from "@/lib/creator-clips";

// DECISION 2026-11: six hosted clips lead this row (three women, three men)
// and play only while the card is in view. Platform embeds stay click-to-load.
// See docs/DECISIONS.md (topic: creator-clips-2026-11).

type EmbedClip = {
  type: "instagram" | "tiktok" | "youtube" | "facebook";
  url: string;
  label: string;
  poster?: string;
  alt: string;
};

type FileClip = {
  type: "file";
  src: string;
  poster: string;
  label: string;
  alt: string;
  proof?: string;
};

type Clip = EmbedClip | FileClip;

const SIZES = ["w1", "w2", "w3", "w2", "w1", "w3", "w2"] as const;

const fileAlt = "A creator in a vertical video.";

// Kelly leads. The hero's six follow, then the live embeds. Kelly is not in the hero.
const clips: Clip[] = [
  { type: "file", src: kellyWorkClip.src, poster: kellyWorkClip.poster, label: "TikTok", alt: fileAlt, proof: kellyWorkClip.proof },
  { type: "file", src: "/videos/creator-01.mp4", poster: "/videos/creator-01.jpg", label: "TikTok", alt: fileAlt, proof: proofFor("/videos/creator-01.mp4") },
  { type: "file", src: "/videos/hero-clip-1.mp4", poster: "/videos/hero-clip-1.jpg", label: "Creator", alt: fileAlt, proof: proofFor("/videos/hero-clip-1.mp4") },
  { type: "file", src: "/videos/creator-02.mp4", poster: "/videos/creator-02.jpg", label: "TikTok", alt: fileAlt, proof: proofFor("/videos/creator-02.mp4") },
  { type: "file", src: "/videos/hero-clip-3.mp4", poster: "/videos/hero-clip-3.jpg", label: "Creator", alt: fileAlt, proof: proofFor("/videos/hero-clip-3.mp4") },
  { type: "file", src: "/videos/creator-03.mp4", poster: "/videos/creator-03.jpg", label: "Instagram", alt: fileAlt, proof: proofFor("/videos/creator-03.mp4") },
  { type: "file", src: "/videos/creator-05.mp4", poster: "/videos/creator-05.jpg", label: "TikTok", alt: fileAlt, proof: proofFor("/videos/creator-05.mp4") },
  { type: "instagram", url: "https://www.instagram.com/p/DXzgEEwRXm2/", label: "Instagram", poster: "/creators/ig/DXzgEEwRXm2.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DVzqq6eEVMt/", label: "Instagram", poster: "/creators/ig/DVzqq6eEVMt.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "youtube", url: "https://www.youtube.com/shorts/urpg-ygRKto", label: "YouTube", poster: "/creators/yt-ur.jpg", alt: "A creator speaking to the camera in a vertical YouTube video." },
  { type: "tiktok", url: "https://www.tiktok.com/@abgetsfit_/video/7631809332836830477", label: "TikTok", poster: "/creators/tiktok-abgetsfit-thumb.jpg", alt: "A creator speaking to the camera in a vertical TikTok video." },
  { type: "instagram", url: "https://www.instagram.com/p/DY5IDHqknw4/", label: "Instagram", poster: "/creators/ig/DY5IDHqknw4.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "tiktok", url: "https://www.tiktok.com/@codewithsam4/video/7636811053304728853", label: "TikTok", poster: "/creators/tiktok-codewithsam4-thumb.jpg", alt: "A creator speaking to the camera in a vertical TikTok video." },
  { type: "youtube", url: "https://www.youtube.com/shorts/k1NNFSkVAgs", label: "YouTube", poster: "/creators/yt-k1.jpg", alt: "A creator speaking to the camera in a vertical YouTube video." },
  { type: "instagram", url: "https://www.instagram.com/p/DXSp7ttDH9D/", label: "Instagram", poster: "/creators/ig/DXSp7ttDH9D.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "tiktok", url: "https://www.tiktok.com/@jacobw.health/video/7644976113755622686", label: "TikTok", poster: "/creators/tiktok-jacobw-thumb.jpg", alt: "A creator speaking to the camera in a vertical TikTok video." },
  { type: "instagram", url: "https://www.instagram.com/p/DXE2rDtE2lI/", label: "Instagram", poster: "/creators/ig/DXE2rDtE2lI.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DWtNDXqjl3I/", label: "Instagram", poster: "/creators/ig/DWtNDXqjl3I.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DaJ2O4ON_uK/", label: "Instagram", poster: "/creators/ig/DaJ2O4ON_uK.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DTRCvh2E1Lu/", label: "Instagram", poster: "/creators/ig/DTRCvh2E1Lu.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
  { type: "instagram", url: "https://www.instagram.com/p/DUMI_NwD0Xa/", label: "Instagram", poster: "/creators/ig/DUMI_NwD0Xa.jpg", alt: "A creator speaking to the camera in a vertical Instagram video." },
];

function Player({ clip }: { clip: EmbedClip }) {
  if (clip.type === "instagram") return <InstagramEmbed url={clip.url} startLoaded />;
  if (clip.type === "tiktok") return <TikTokEmbed url={clip.url} thumb={clip.poster} startLoaded />;
  if (clip.type === "youtube") return <YouTubeEmbed url={clip.url} label={clip.label} startLoaded />;
  return <FacebookEmbed url={clip.url} label={clip.label} startLoaded />;
}

function FileCard({ clip, size }: { clip: FileClip; size: (typeof SIZES)[number] }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => setOn(entry.isIntersecting),
      { rootMargin: "0px 120px", threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = true;
    const pending = node.play();
    if (pending) pending.catch(() => {});
  }, [on]);

  return (
    <figure ref={ref} className={`wk ${size}`} data-clip>
      <div className="wi">
        <img
          src={clip.poster}
          alt={clip.alt}
          width={540}
          height={960}
          loading="lazy"
          decoding="async"
          {...{ fetchpriority: "low" }}
        />
        {on && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={clip.poster}
            aria-hidden="true"
            ref={videoRef}
          >
            <source src={clip.src} type="video/mp4" />
          </video>
        )}
        {clip.proof && <span className="clip-proof">{clip.proof}</span>}
      </div>
      <figcaption>
        <span>{clip.label}</span>
      </figcaption>
    </figure>
  );
}

export default function WorkCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const pauseRef = useRef({ hover: false, focus: false, pointer: false, nudge: false });
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(18);
  const [playing, setPlaying] = useState<string | null>(null);

  function loopWidth() {
    const el = scrollerRef.current;
    const set = setRef.current;
    if (!el || !set) return 0;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    return set.offsetWidth + gap;
  }

  function wrapScroll() {
    const el = scrollerRef.current;
    const loop = loopWidth();
    if (!el || loop <= 1) return;
    if (el.scrollLeft >= loop) el.scrollLeft -= loop;
    else if (el.scrollLeft < 0) el.scrollLeft += loop;
  }

  function measure() {
    const el = scrollerRef.current;
    if (!el) return;
    wrapScroll();
    const loop = loopWidth() || el.scrollWidth;
    const seen = loop <= 1 ? 1 : ((el.scrollLeft % loop) + el.clientWidth) / loop;
    setProgress(Math.max(8, Math.min(100, seen * 100)));
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-clip]"));
    let current = 0;
    const edge = el.scrollLeft + 24;
    cards.forEach((card, i) => {
      if (card.offsetLeft - el.offsetLeft <= edge) current = i;
    });
    setIndex(current % clips.length);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce) return;
    el.style.scrollSnapType = "none";
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const node = scrollerRef.current;
      const loop = loopWidth();
      if (!node || loop <= 1) return;
      const dt = Math.min(48, now - last);
      last = now;
      const held = pauseRef.current;
      if (!held.hover && !held.focus && !held.pointer && !held.nudge) {
        node.scrollLeft += (32 * dt) / 1000;
      }
      if (node.scrollLeft >= loop) node.scrollLeft -= loop;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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
    pauseRef.current.nudge = true;
    window.setTimeout(() => {
      pauseRef.current.nudge = false;
    }, reduce ? 0 : 700);
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
    pauseRef.current.pointer = true;
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
    pauseRef.current.pointer = false;
  }

  const total = String(clips.length).padStart(2, "0");
  const current = String(index + 1).padStart(2, "0");
  const playingLabel = clips.find((clip) => clip.type !== "file" && clip.url === playing)?.label;

  return (
    <section
      className="band tight-top"
      id="work"
      aria-roledescription="carousel"
      aria-label="Creator work"
      onKeyDown={onKeyDown}
      onMouseEnter={() => {
        pauseRef.current.hover = true;
      }}
      onMouseLeave={() => {
        pauseRef.current.hover = false;
      }}
      onFocusCapture={() => {
        pauseRef.current.focus = true;
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) pauseRef.current.focus = false;
      }}
    >
      <div className="ed-wrap">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="display">Creator work.</h2>
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
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="wks-set"
            ref={copy === 0 ? setRef : undefined}
            aria-hidden={copy === 1 ? true : undefined}
            inert={copy === 1 ? true : undefined}
          >
            {clips.map((clip, i) => {
              const size = SIZES[i % SIZES.length];
              if (clip.type === "file") {
                return <FileCard key={`${copy}-${clip.src}`} clip={clip} size={size} />;
              }
              const open = playing === clip.url;
              return (
                <figure key={`${copy}-${clip.url}`} className={`wk ${size}`} data-clip>
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
                          <span className="absolute inset-0 flex items-center justify-center bg-[#141820] text-[15px] text-[#EEF0F4]">
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
        ))}
      </div>
      <div className="prog" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
