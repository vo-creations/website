"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLockup from "@/components/BrandLockup";

const navLinks = [
  { href: "/#results", label: "Results" },
  { href: "/case-studies", label: "Our work" },
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

function EditorialNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-[22px] md:px-10 xl:h-[76px] xl:px-16">
        <a href="/" className="brand-link" aria-label="Vo Creations">
          <BrandLockup />
        </a>
        <div className="hidden items-center gap-9 text-[14px] text-[#d6d6d2] xl:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="inline-flex min-h-11 items-center">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href="https://calendly.com/vocreations/vo-creations-agency-discovery-call" target="_blank" rel="noopener noreferrer" className="btn-talk whitespace-nowrap">
            Book a call
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-5 w-5 text-[#eef0f4]" aria-hidden="true">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-white/10 bg-[#0B0D12] px-[22px] py-2 md:px-10 xl:hidden">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex min-h-11 items-center text-[15px] text-[#eef0f4]">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export default function Nav({ variant = "bar" }: { variant?: "bar" | "editorial" }) {
  if (variant === "editorial") return <EditorialNav />;
  return <BarNav />;
}

function BarNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] ${NAV_CONTAINER}`}>
      <div className={`flex items-center justify-between rounded-full border border-white/15 bg-[#0B0D12]/85 py-3 backdrop-blur-[20px] ${NAV_INNER_PADDING}`}>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="brand-link shrink-0"
          aria-label="Vo Creations"
        >
          <BrandLockup height={32} />
        </Link>

        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex min-h-11 items-center rounded-full px-3.5 text-[15px] font-medium transition-colors ${
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
            href="https://calendly.com/vocreations/vo-creations-agency-discovery-call"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full bg-white px-5 text-[15px] font-semibold text-black transition-transform hover:-translate-y-px md:px-6"
          >
            Book a call
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden -mr-1 flex h-11 w-11 items-center justify-center text-text"
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
              className={`flex min-h-11 items-center border-b border-border py-3 text-[15px] font-medium last:border-b-0 ${
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
