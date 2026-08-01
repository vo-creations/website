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
    <section className="text-center py-20 bg-bg-card">
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
        <Image
          src="/vocreations-mark-white.png"
          alt=""
          width={18}
          height={19}
          className="w-[15px] h-auto"
        />
        {buttonText}
      </a>
    </section>
  );
}
