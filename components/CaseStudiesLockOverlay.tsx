export default function CaseStudiesLockOverlay({ href, paper = false }: { href: string; paper?: boolean }) {
  return (
    <div className={paper
      ? "mb-8 flex flex-col items-start gap-3 border-y border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between"
      : "mb-6 flex flex-col items-start gap-3 rounded-2xl border border-white/15 bg-[#141414] px-6 py-5 sm:flex-row sm:items-center sm:justify-between"}>
      <p className={`font-serif text-[clamp(28px,4vw,40px)] leading-none tracking-tight ${paper ? "text-[#F2F0EB]" : "text-lg font-extrabold text-text"}`}>Full results shared on a call</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-6 py-3 text-[15px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${paper ? "bg-[#F2F0EB] text-[#0B0B0C] focus-visible:outline-[#F2F0EB]" : "bg-white text-black focus-visible:outline-white"}`}
      >
        Book a call
      </a>
    </div>
  );
}
