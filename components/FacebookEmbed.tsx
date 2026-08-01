interface FacebookEmbedProps {
  url: string;
  label?: string;
}

// DECISION: uses Facebook's iframe Video Plugin (plugins/video.php), not the JS-SDK
// fb-root approach — it renders public videos/reels without an App ID and without
// requiring the viewer to be logged in, even though visiting the reel URL directly
// now hits a login wall. See docs/DECISIONS.md (topic: showcase-marquee).
export default function FacebookEmbed({ url, label }: FacebookEmbedProps) {
  const embedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;

  return (
    <div className="bg-bg-card rounded-2xl aspect-[9/16] relative border border-border overflow-hidden">
      <iframe
        src={embedSrc}
        className="absolute inset-0 w-full h-full"
        style={{ border: 0 }}
        scrolling="no"
        loading="lazy"
        allowFullScreen
        title={label || "Facebook video preview"}
      />
      {label && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
          <span className="text-xs text-white font-medium">{label}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/70 hover:text-white transition-colors pointer-events-auto"
          >
            Facebook &#8599;
          </a>
        </div>
      )}
    </div>
  );
}
