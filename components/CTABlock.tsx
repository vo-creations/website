export default function CTABlock({
  heading = "1B+ views. Your target CPM, guaranteed.",
  sub = "Campaigns start at $50K+ a month. First posts go live in 10-14 days.",
  buttonText = "Book a call",
  href = "https://calendar.app.google/8x72A8nxr3gQpVfx7",
}: {
  heading?: string;
  sub?: string;
  buttonText?: string;
  href?: string;
}) {
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
          className="inline-flex items-center rounded-full bg-white px-9 py-4 text-base font-semibold text-black transition-transform hover:-translate-y-px"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
