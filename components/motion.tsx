"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// DECISION 2026-10: homepage motion is CSS + one shared IntersectionObserver.
// The html.js-motion class is set before paint only when the visitor has not
// asked for reduced motion. Without that class, reveals stay at their final
// state, so no-JS and reduced-motion visitors see the content immediately.
// See docs/DECISIONS.md (topic: homepage-motion-2026-10).

type RevealCb = () => void;
const callbacks = new WeakMap<Element, RevealCb>();
let sharedObserver: IntersectionObserver | null = null;

function observer() {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        sharedObserver?.unobserve(entry.target);
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
  );
  return sharedObserver;
}

export function useOnceVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    callbacks.set(el, () => setOn(true));
    const io = observer();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);
  return { ref, on };
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, on } = useOnceVisible<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${on ? "is-in" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function MaskText({ text }: { text: string }) {
  const { ref, on } = useOnceVisible<HTMLSpanElement>();
  const words = text.split(" ");
  return (
    <span ref={ref} className={`mask-line ${on ? "is-in" : ""}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <span className="mask-word" style={{ "--i": index } as CSSProperties}>
            <span>{word}</span>
          </span>
        </span>
      ))}
    </span>
  );
}

// Final string is the first paint (SSR). Digits count only after `trigger`,
// and the last frame writes `text` again so the DOM matches the source.
export function CountText({ text, trigger }: { text: string; trigger: boolean }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!trigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    const matches: RegExpExecArray[] = [];
    const pattern = /\d+(?:\.\d+)?/g;
    let found: RegExpExecArray | null;
    while ((found = pattern.exec(text))) matches.push(found);
    if (matches.length === 0) return;
    let raf = 0;
    let start: number | null = null;
    const duration = 1200;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      if (progress >= 1) {
        setOut(text);
        return;
      }
      const eased = ease(progress);
      let result = "";
      let last = 0;
      for (const match of matches) {
        const index = match.index ?? 0;
        result += text.slice(last, index);
        const raw = match[0];
        const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
        const value = Number(raw) * eased;
        result += decimals ? value.toFixed(decimals) : String(Math.round(value));
        last = index + raw.length;
      }
      result += text.slice(last);
      setOut(result);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, text]);
  return <>{out}</>;
}
