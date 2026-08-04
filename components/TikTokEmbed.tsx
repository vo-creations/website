"use client";

import { useEffect, useState } from "react";

interface TikTokEmbedProps {
  url: string;
  label?: string;
}

// DECISION 2026-08: click-to-load, matching the pattern InstagramEmbed and
// YouTubeEmbed already use — TikTok's embed CDN has a real upstream
// reliability problem: the raw signed video/tos CDN URLs it 403s on are not
// something our code hotlinks or constructs. They're what TikTok's own
// official embed.js/iframe legitimately fetches internally once a
// <blockquote class="tiktok-embed"> is converted — confirmed by
// reproducing the identical 403s using TikTok's own exact oEmbed-API HTML
// output, pasted onto a bare static page with zero of our code involved.
// So this isn't fixable by embedding "more correctly"; we already were.
// What WAS fixable: the old version auto-loaded all 3 TikTok iframes on
// mount, so every visitor hit that flakiness immediately and
// simultaneously on every single page load, which is what was flooding
// the console with 403s and made the page feel stuck. Deferring the real
// embed (and TikTok's embed.js) until a visitor actually clicks to play
// cuts that failure surface to just the people who click, same as
// Instagram/YouTube already do. See docs/DECISIONS.md (topic:
// showcase-marquee, showcase-tiktok-reliability).
export default function TikTokEmbed({ url, label }: TikTokEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const videoId = url.match(/\/video\/(\d+)/)?.[1];

  useEffect(() => {
    if (!loaded) return;
    // TikTok's embed.js has no exposed re-scan API, so each activation
    // injects its own fresh <script> tag — the script's onload always
    // re-scans the DOM for unprocessed .tiktok-embed blockquotes, which
    // reliably picks up the blockquote this click just added.
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [loaded]);

  if (!loaded) {
    return (
      <div className="bg-bg-card rounded-2xl aspect-[9/16] relative border border-border overflow-hidden group">
        <div
          onClick={() => setLoaded(true)}
          className="absolute inset-0 bg-black flex items-center justify-center cursor-pointer"
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
              TikTok &#8599;
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-2xl aspect-[9/16] relative border border-border overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Matches TikTok's own oEmbed-API HTML output (data-embed-from,
            populated <section> fallback content, their suggested
            max-width/min-width) rather than an empty section — this is
            what their real embed markup looks like, not a simplification
            of it. */}
        <blockquote
          className="tiktok-embed"
          cite={url}
          data-video-id={videoId}
          data-embed-from="oembed"
          style={{ maxWidth: "100%", minWidth: "100%", margin: 0 }}
        >
          <section>
            <a target="_blank" rel="noopener noreferrer" title={label} href={url}>
              {label}
            </a>
          </section>
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
