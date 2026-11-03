import Link from "next/link";
import BrandLockup from "@/components/BrandLockup";
import { CONTACT_EMAILS } from "@/lib/site";

const footerLinks = [
  { href: "/#results", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/#team", label: "Our Team" },
  { href: "/#faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refund policy" },
];

function EditorialFooter() {
  return (
    <footer>
      <div className="ed-wrap pt-16">
        <div className="fg">
          <div className="c1">
            <a href="/" className="brand-link" aria-label="Vo Creations">
              <BrandLockup />
            </a>
            <p className="mt-[18px] max-w-[300px] text-[14px] text-[#EEF0F4]/65">
              The in-house UGC agency backed by elite mentorship.
            </p>
            <div className="mail-row">
              {CONTACT_EMAILS.map((email) => (
                <a key={email} href={`mailto:${email}`}>
                  {email}
                </a>
              ))}
            </div>
          </div>
          <div className="c2">
            <div className="lab">Site</div>
            <a className="flnk" href="/#results">Case Studies</a>
            <a className="flnk" href="/blog">Blog</a>
            <a className="flnk" href="/#team">Our Team</a>
            <a className="flnk" href="/#faq">FAQ</a>
          </div>
          <div className="c3">
            <div className="lab">Legal</div>
            <a className="flnk" href="/privacy">Privacy</a>
            <a className="flnk" href="/terms">Terms</a>
            <a className="flnk" href="/refund-policy">Refund policy</a>
          </div>
          <div className="c4">
            <div className="lab">Follow</div>
            <a className="flnk" href="https://x.com/VoCreationsUGC" target="_blank" rel="noopener noreferrer">X</a>
            <a className="flnk" href="https://www.instagram.com/vo.creations/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="flnk" href="https://www.linkedin.com/company/vocreations/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
        <p className="ed-word" aria-hidden="true">
          <span>make them</span> remember.
        </p>
        <div className="fbt">
          <span>© 2026 Vo Creations</span>
          <span>Los Angeles · New York</span>
        </div>
      </div>
    </footer>
  );
}

export default function Footer({ tone = "dark" }: { tone?: "dark" | "paper" | "editorial" }) {
  if (tone === "editorial") return <EditorialFooter />;
  const paper = tone === "paper";
  return (
    <footer className={paper ? "border-t border-white/10 bg-[#0B0D12] px-6 text-[#EEF0F4] md:px-14" : "border-t border-border px-6 md:px-14"}>
      <div className="mx-auto max-w-[1280px] pb-8 pt-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_1fr] gap-12 mb-16">
          {/* Brand */}
          <div>
            <a href="/" className="brand-link mb-4" aria-label="Vo Creations">
              <BrandLockup height={34} />
            </a>
            <p className={`mb-4 max-w-[320px] text-base leading-relaxed ${paper ? "text-white/60" : "text-[#d4d4d0]"}`}>
              The in-house UGC agency backed by elite mentorship.
            </p>
            <p className="mb-6 flex flex-col gap-1 text-[15px]">
              {CONTACT_EMAILS.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className={`inline-flex min-h-11 items-center underline decoration-white/30 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${paper ? "text-white/60 hover:text-[#F2F0EB] focus-visible:outline-[#F2F0EB]" : "text-[#d4d4d0] hover:text-text focus-visible:outline-white"}`}
                >
                  {email}
                </a>
              ))}
            </p>
            <div className="flex items-center gap-2 text-[15px] font-semibold">
              <a href="https://x.com/VoCreationsUGC" className={`inline-flex h-11 w-11 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${paper ? "text-[#F2F0EB] hover:text-white focus-visible:outline-[#F2F0EB]" : "text-text-secondary hover:text-text focus-visible:outline-white"}`} target="_blank" rel="noopener noreferrer">
                X
              </a>
              <a href="https://www.instagram.com/vo.creations/" className={`inline-flex min-h-11 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${paper ? "text-[#F2F0EB] hover:text-white focus-visible:outline-[#F2F0EB]" : "text-text-secondary hover:text-text focus-visible:outline-white"}`} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://www.linkedin.com/company/vocreations/" className={`inline-flex min-h-11 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${paper ? "text-[#F2F0EB] hover:text-white focus-visible:outline-[#F2F0EB]" : "text-text-secondary hover:text-text focus-visible:outline-white"}`} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className={`mb-2 text-[15px] font-semibold uppercase tracking-[0.15em] ${paper ? "text-white/60" : "text-text-dim"}`}>
              Links
            </div>
            <div className="flex flex-col">
              {footerLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`inline-flex min-h-11 items-center text-[15px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${paper ? "text-white/60 hover:text-[#F2F0EB] focus-visible:outline-[#F2F0EB]" : "text-[#d4d4d0] hover:text-text focus-visible:outline-white"}`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <div className={`mb-5 text-[15px] font-semibold uppercase tracking-[0.15em] ${paper ? "text-white/60" : "text-text-dim"}`}>
              Ready to scale?
            </div>
            <a
              href="https://calendar.app.google/8x72A8nxr3gQpVfx7"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-semibold transition-transform hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${paper ? "bg-[#F2F0EB] text-[#0B0B0C] focus-visible:outline-[#F2F0EB]" : "bg-white text-black focus-visible:outline-white"}`}
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
        <div className={`flex items-center justify-end gap-4 border-t pt-6 ${paper ? "border-white/10" : "border-border"}`}>
          <p className={`text-[15px] ${paper ? "text-white/60" : "text-text-dim"}`}>&copy; 2026 Vo Creations</p>
        </div>
      </div>
    </footer>
  );
}
