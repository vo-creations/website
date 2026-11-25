"use client";

import { useEffect, type ReactNode } from "react";

// Opens a disclosure when the URL hash points at it or at anything inside it.
// #dashboard sits on the internal-dashboard disclosure. #quality is the
// approvals strip, outside any disclosure, so the hash only scrolls.
// DECISION 2026-11: see docs/DECISIONS.md (topic: homepage-rebalance-2026-11).
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
      for (const details of chain) {
        if (!details.open) details.open = true;
      }
      // Scroll even when nothing had to open. A late layout (posters, the
      // Slack image) can leave the browser's first hash jump short.
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

export function NotionChevron() {
  return (
    <svg className="notion-chevron" viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <path
        d="M6 3.5 11 8l-5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NotionToggle({
  id,
  title,
  summary,
  children,
  bare = false,
}: {
  id: string;
  title: string;
  summary: string;
  children: ReactNode;
  bare?: boolean;
}) {
  const titleId = `${id}-title`;
  const lineId = `${id}-line`;
  const shell = (
    <div className={bare ? "notion-shell is-bare" : "notion-shell"}>
      {/* The h2 stays outside the summary so it remains in the heading outline.
          The summary is named with aria-labelledby. Clicks on the title pass
          through to the summary. */}
      <h2 id={titleId} className="notion-title">
        {title}
      </h2>
      <details id={id} className={bare ? "notion is-bare" : "notion"} aria-labelledby={titleId}>
        <summary aria-labelledby={`${titleId} ${lineId}`}>
          <NotionChevron />
          <span className="notion-title-spacer" aria-hidden="true">
            {title}
          </span>
          <span id={lineId} className="notion-line">
            {summary}
          </span>
        </summary>
        <div className="notion-panel">{children}</div>
      </details>
    </div>
  );
  if (bare) return shell;
  return (
    <section className="notion-band">
      <div className="ed-wrap">{shell}</div>
    </section>
  );
}
