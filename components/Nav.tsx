"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#results", label: "Case Studies" },
  { href: "/#team", label: "Our Team" },
  { href: "/blog", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
];

// Shared with the hero (app/page.tsx) so its content's left edge always lines up
// with the logo below, instead of two hardcoded numbers drifting apart over time.
// NAV_CONTAINER is the same width/cap the nav bar itself uses (mx-auto for a
// normal-flow element does the same centering the nav gets from its fixed-position
// left-1/2/-translate-x-1/2 trick). NAV_INNER_PADDING matches the pill's own
// left padding, since that's what actually offsets the logo from the container edge.
export const NAV_CONTAINER = "w-[calc(100%-24px)] max-w-[1100px]";
export const NAV_INNER_PADDING = "px-5 md:px-6";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] ${NAV_CONTAINER}`}>
      <div className={`flex items-center justify-between rounded-full border border-white/15 bg-black/85 py-3 backdrop-blur-[20px] ${NAV_INNER_PADDING}`}>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 shrink-0"
        >
          <img src="/brand/vo-logo.svg" alt="Vo Creations" className="h-7 w-auto" />
          <span className="font-display text-base font-semibold tracking-[-0.03em] text-[#fbfbf9] md:text-lg">
            Vo Creations
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3.5 py-1.5 text-[15px] font-medium transition-colors ${
                pathname === link.href
                  ? "text-text bg-accent/10"
                  : "text-text-secondary hover:text-text hover:bg-bg-elevated"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://calendar.app.google/8x72A8nxr3gQpVfx7"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-black transition-transform hover:-translate-y-px md:px-6"
          >
            Book a call
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-text -mr-1"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-80 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-bg/95 backdrop-blur-[20px] border border-white/20 rounded-3xl px-6 py-4 flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-3 text-[15px] font-medium border-b border-border last:border-b-0 ${
                pathname === link.href ? "text-text" : "text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
