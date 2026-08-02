import Image from "next/image";

export default function CTABlock({
  heading = "Ready to scale with UGC?",
  sub = "10 new campaigns per month. Tell us about your brand.",
  buttonText = "Let's Talk",
  href = "https://calendar.app.google/8x72A8nxr3gQpVfx7",
}: {
  heading?: string;
  sub?: string;
  buttonText?: string;
  href?: string;
}) {
  return (
    // FAQ's own bottom padding (py-[100px]) + this section's top padding
    // (pt-20 = 80px) puts 180px between the last FAQ card and this card.
    // Footer's inner wrapper only has pt-16 (64px) before its own content
    // starts, so matching bottom padding here (pb-20) left the card 36px
    // closer to the footer than to the FAQ above it. pb-[116px] makes both
    // gaps 180px. Re-derive if FAQ's py or Footer's pt-16 ever change.
    <section className="text-center pt-20 pb-[116px]">
      <div className="max-w-[560px] mx-auto px-10 py-14 rounded-3xl border border-white/10 bg-bg-card/50 backdrop-blur-sm">
        <h3 className="text-[28px] font-extrabold tracking-tight mb-3">
          {heading}
        </h3>
        <p className="text-base text-text-secondary mb-6">{sub}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-transparent text-white font-bold text-base px-9 py-4 rounded-full border border-white hover:bg-white/10 hover:-translate-y-0.5 transition-all"
        >
          {buttonText}
          <Image
            src="/vocreations-mark-white.png"
            alt=""
            width={18}
            height={19}
            className="w-[15px] h-auto"
          />
        </a>
      </div>
    </section>
  );
}
