// One overlay covering the whole locked ResultCard stack (not one per
// card — the section reads as a single "unlock this" moment, and a
// per-card CTA would repeat the same sentence 7 times). Sits absolutely
// over a `relative`-positioned wrapper in app/page.tsx's RESULTS section.
// href matches the booking link used by Nav/Footer/CTABlock verbatim
// (https://calendar.app.google/8x72A8nxr3gQpVfx7) — see docs/DECISIONS.md,
// topic: case-studies-lock.
export default function CaseStudiesLockOverlay({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-center px-6 rounded-[20px] bg-gradient-to-b from-bg/55 via-bg/80 to-bg/92 hover:from-bg/60 hover:via-bg/85 hover:to-bg/95 transition-colors"
    >
      <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#121212"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[18px] h-[18px]"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <div className="text-lg font-extrabold tracking-tight text-text">
        Full results revealed on a call
      </div>
      <p className="text-sm text-text-secondary max-w-[320px]">
        Logos, view counts and conversion numbers are live — book a call to
        unlock the real case studies.
      </p>
      <span className="inline-flex items-center gap-2 bg-white text-bg font-bold text-sm px-6 py-3 rounded-full mt-1">
        Book a call
      </span>
    </a>
  );
}
