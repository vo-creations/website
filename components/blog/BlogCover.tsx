// DECISION 2026-11: blog covers reuse the chrome monogram on a silk card — see docs/DECISIONS.md

type BlogCoverProps = {
  title: string;
  /** First card on the index. Loads the monogram ahead of the rest. */
  priority?: boolean;
};

export default function BlogCover({ title, priority = false }: BlogCoverProps) {
  return (
    <div className="blog-cover" aria-hidden="true">
      <div className="blog-cover-silk" />
      <div className="blog-cover-grain" />
      <div className="blog-cover-vignette" />
      <div className="blog-cover-stage">
        <div className="blog-cover-markcol">
          <div className="blog-cover-mark">
            <img
              src="/brand/chrome-mono.webp"
              alt=""
              width={936}
              height={1117}
              decoding={priority ? "sync" : "async"}
              loading={priority ? "eager" : "lazy"}
              {...(priority ? { fetchPriority: "high" as const } : {})}
            />
          </div>
          <div className="blog-cover-reflect">
            <img src="/brand/chrome-mono.webp" alt="" width={936} height={1117} decoding="async" />
          </div>
        </div>
        <div className="blog-cover-copy">
          <p className="blog-cover-kicker">Vo Creations</p>
          <p className="blog-cover-title">{title}</p>
          <p className="blog-cover-tag">
            make them remember<span>.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
