import Link from "next/link";

const footerLinks = [
  { href: "/#team", label: "About" },
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
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-sm font-bold text-accent">
                V
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                Vo Creations
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-[320px] mb-6">
              Your in-house UGC program, without the overhead.
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-[11px] text-text-dim uppercase tracking-[0.15em] font-semibold mb-5">
              Links
            </div>
            <div className="flex flex-col gap-3">
              {footerLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-text-secondary hover:text-text transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <div className="text-[11px] text-text-dim uppercase tracking-[0.15em] font-semibold mb-5">
              Ready to scale?
            </div>
            <a
              href="https://calendar.app.google/8x72A8nxr3gQpVfx7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent text-bg font-bold text-sm px-8 py-3.5 rounded-full hover:shadow-[0_0_32px_rgba(245,166,35,0.3)] hover:-translate-y-px transition-all"
            >
              make them remember.
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-text-dim">
            &copy; 2026 Vo Creations. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[13px] text-text-dim hover:text-text-secondary transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-[13px] text-text-dim hover:text-text-secondary transition-colors">
              Terms
            </Link>
            <Link href="/refund-policy" className="text-[13px] text-text-dim hover:text-text-secondary transition-colors">
              Refunds
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
