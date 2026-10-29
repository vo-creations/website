export default function CTABlock({
  heading = "1B+ views. Your target CPM, guaranteed.",
  sub = "Campaigns start at $50K+ a month. First posts go live in 10-14 days.",
  buttonText = "Book a call",
  href = "https://calendar.app.google/8x72A8nxr3gQpVfx7",
  paper = false,
}: {
  heading?: string;
  sub?: string;
  buttonText?: string;
  href?: string;
  paper?: boolean;
}) {
  if (paper) {
    return (
      <section className="relative overflow-hidden bg-[#0B0B0C] px-6 py-28 text-[#F2F0EB] md:py-36">
        <img
          src="/brand/vo-chrome-sm.webp"
          alt=""
          width={900}
          height={1090}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute -right-6 top-8 hidden w-[180px] opacity-80 md:block lg:w-[240px]"
        />
        <div className="relative mx-auto max-w-[1100px]">
          <h2 className="max-w-[16ch] font-serif text-[clamp(48px,7vw,96px)] leading-[0.92] tracking-[-0.03em]">
            {heading}
          </h2>
          <p className="mt-6 max-w-[36rem] text-[18px] leading-relaxed text-white/60">{sub}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[#F2F0EB] px-8 text-[15px] font-semibold text-[#0B0B0C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2F0EB]"
          >
            {buttonText}
          </a>
        </div>
      </section>
    );
  }
  return (
    <section className="px-6 pb-16 pt-4 text-center">
      <div className="mx-auto max-w-[560px] rounded-3xl border border-white/10 bg-bg-card/50 px-8 py-10 backdrop-blur-sm">
        <h2 className="mb-3 font-display text-[28px] font-extrabold tracking-[-0.04em] text-[#fbfbf9]">
          {heading}
        </h2>
        <p className="mb-6 text-base text-[#d4d4d0]">{sub}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-full bg-white px-9 py-4 text-base font-semibold text-black transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
