import Link from "next/link";

const footerLinks = [
  { href: "/#results", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/#team", label: "Our Team" },
  { href: "/#faq", label: "FAQ" },
  { href: "/refund-policy", label: "Refund policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-[1200px] mx-auto px-8 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_1fr] gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/brand/vo-logo.svg" alt="Vo Creations" className="h-8 w-auto" />
              <span className="font-display text-lg font-semibold tracking-[-0.03em] text-[#fbfbf9]">
                Vo Creations
              </span>
            </div>
            <p className="mb-6 max-w-[320px] text-base leading-relaxed text-[#d4d4d0]">
              Your world-class in-house UGC program, without the overhead.
            </p>
            <div className="flex items-center gap-4 text-[15px] font-semibold">
              <a href="https://x.com/VoCreationsUGC" className="text-text-secondary hover:text-text" target="_blank" rel="noopener noreferrer">
                X
              </a>
              <a href="https://www.instagram.com/vo.creations/" className="text-text-secondary hover:text-text" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="mb-5 text-[13px] font-semibold uppercase tracking-[0.15em] text-text-dim">
              Links
            </div>
            <div className="flex flex-col gap-3">
              {footerLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-base text-[#d4d4d0] transition-colors hover:text-text"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <div className="mb-5 text-[13px] font-semibold uppercase tracking-[0.15em] text-text-dim">
              Ready to scale?
            </div>
            <a
              href="https://calendar.app.google/8x72A8nxr3gQpVfx7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-transform hover:-translate-y-px"
            >
              Book a call
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom bar — DECISION: minimal treatment (brand + copyright only,
            no Privacy/Terms/Refunds links row), matching Athlete's Pen's
            bottom bar. The /privacy, /terms, /refund-policy routes stay in
            the codebase untouched (Vercel/Stripe compliance may still
            reference them) — this only removes the footer nav links to
            them. See docs/DECISIONS.md (topic: footer-polish). */}
        <div className="border-t border-border pt-6 flex justify-between items-center gap-4">
          <p className="text-[13px] text-text-dim">Vo Creations</p>
          <p className="text-[13px] text-text-dim">&copy; 2026 Vo Creations</p>
        </div>
      </div>
    </footer>
  );
}
