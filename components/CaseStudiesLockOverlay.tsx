export default function CaseStudiesLockOverlay({ href }: { href: string }) {
  return (
    <div className="mb-6 flex flex-col items-start gap-3 rounded-2xl border border-white/15 bg-[#141414] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-extrabold tracking-tight text-text">Full results shared on a call</p>
        <p className="mt-1 max-w-[420px] text-base text-[#d4d4d0]">
          The cards below are placeholders. Names and real figures stay off this page.
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
      >
        Book a call
      </a>
    </div>
  );
}
