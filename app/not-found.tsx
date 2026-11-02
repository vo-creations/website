import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: {
    title: "Page not found",
    url: "https://vocreations.com/404",
    siteName: "Vo Creations",
  },
  twitter: {
    card: "summary_large_image",
    site: "@VoCreationsUGC",
  },
};

export default function NotFound() {
  return (
    <div className="editorial">
      <Nav variant="editorial" />
      <main id="main" className="flex min-h-[70vh] flex-col items-center justify-center px-6 pb-24 pt-16 text-center">
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-[2.5px] text-text-secondary">
          404
        </p>
        <h1 className="font-display text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight mb-4">
          This page is not here.
        </h1>
        <p className="text-text-secondary max-w-md leading-relaxed mb-8">
          The link may be old, or the page may have moved. The homepage is still up.
        </p>
        <Link
          href="/"
          className="inline-flex items-center bg-white text-black font-bold text-sm px-8 py-3.5 rounded-full hover:shadow-[0_0_24px_rgba(255,255,255,0.3)] hover:-translate-y-px transition-all"
        >
          Back to Vo Creations
        </Link>
      </main>
      <Footer tone="editorial" />
    </div>
  );
}
