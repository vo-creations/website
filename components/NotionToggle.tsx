"use client";

import { useEffect, type ReactNode } from "react";

// Opens a disclosure when the URL hash points at it or at anything inside it.
// #quality sits inside How it works. #dashboard sits inside Daily reports.
// DECISION 2026-11: see docs/DECISIONS.md (topic: homepage-notion-2026-11).
export function useOpenDetailsForHash() {
  useEffect(() => {
    const open = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      const chain: HTMLDetailsElement[] = [];
      if (target instanceof HTMLDetailsElement) chain.push(target);
      let node = target.parentElement;
      while (node) {
        if (node instanceof HTMLDetailsElement) chain.push(node);
        node = node.parentElement;
      }
      let opened = false;
      for (const details of chain) {
        if (!details.open) {
          details.open = true;
          opened = true;
        }
      }
      if (!opened) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
      });
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='#']");
      if (!link) return;
      requestAnimationFrame(open);
    };

    open();
    window.addEventListener("hashchange", open);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", open);
      document.removeEventListener("click", onClick);
    };
  }, []);
}

export default function NotionToggle({
  id,
  title,
  summary,
  children,
  solo = false,
}: {
  id: string;
  title: string;
  summary: string;
  children: ReactNode;
  solo?: boolean;
}) {
  return (
    <section className={solo ? "notion-band is-solo" : "notion-band"}>
      <div className="ed-wrap">
        <details id={id} className="notion">
          <summary>
            <span className="notion-copy">
              <h2 className="notion-title">{title}</h2>
              <span className="notion-line">{summary}</span>
            </span>
            <svg className="notion-chevron" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M6 3.5 11 8l-5 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </summary>
          <div className="notion-panel">{children}</div>
        </details>
      </div>
    </section>
  );
}
