import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const NOTION = "https://www.notion.so/Fable-2e2c58bd24a580d5bdf7e210957a75c1";

export const metadata: Metadata = {
  title: "Fable Case Study",
  description:
    "How Vo Creations helped Fable, a social reading app, reach 10M+ organic views in 3 weeks with 3 creators.",
  alternates: { canonical: "/case-studies/fable" },
  openGraph: {
    title: "Fable Case Study | Vo Creations",
    description:
      "10M+ organic views in 3 weeks with 3 creators. Published January 8, 2026.",
    url: "https://vocreations.com/case-studies/fable",
    type: "article",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Fable: 10M+ organic views in 3 weeks",
  datePublished: "2026-01-08",
  dateModified: "2026-10-18",
  author: { "@type": "Organization", name: "Vo Creations", url: "https://vocreations.com" },
  publisher: { "@type": "Organization", name: "Vo Creations", url: "https://vocreations.com" },
  mainEntityOfPage: "https://vocreations.com/case-studies/fable",
  description:
    "Vo Creations helped Fable generate over 10 million organic views in 3 weeks with 3 creators.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vocreations.com" },
    { "@type": "ListItem", position: 2, name: "Case studies", item: "https://vocreations.com/case-studies" },
    { "@type": "ListItem", position: 3, name: "Fable", item: "https://vocreations.com/case-studies/fable" },
  ],
};

export default function FableCaseStudy() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Nav />
      <main className="pt-36 pb-24 px-6">
        <article className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-text-secondary mb-4">
            <Link href="/case-studies" className="hover:text-text">Case studies</Link>
            <span> / Consumer tech</span>
          </p>
          <h1 className="font-display text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight mb-4">
            Fable
          </h1>
          <p className="text-sm text-text-dim mb-8">Published January 8, 2026</p>

          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              ["10M+", "Organic views"],
              ["3", "Creators"],
              ["3 weeks", "To that result"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-bg-card/50 p-4 text-center">
                <div className="text-2xl font-extrabold tracking-tight">{value}</div>
                <div className="text-[10px] uppercase tracking-wide text-text-dim mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-[15px] text-text-secondary leading-[1.75]">
            <p>
              Fable is a social reading app, often described as Spotify Wrapped for books: it turns reading habits, highlights, and identity into something shareable.
            </p>
            <p>
              The homepage card on this site currently lists Fable at 25M+ views, 3 creators, and about 30 days. The study this page follows was published earlier, on January 8, 2026, and reports a different figure: over 10 million organic views in 3 weeks, also with 3 creators. Both numbers are kept because both are sourced. This page does not blend them into one claim.
            </p>
            <p>
              In that published study, Vo Creations helped Fable generate over 10 million organic views in 3 weeks, with reading data framed emotionally enough to compete with mainstream consumer apps. The result used 3 creators.
            </p>
            <h2 className="text-text text-2xl font-extrabold tracking-tight pt-4">Barriers</h2>
            <p>
              <strong className="text-text">Category perception.</strong> Reading apps traditionally struggle to break into viral short-form culture. They are often seen as niche, or as something other than entertainment.
            </p>
            <p>
              <strong className="text-text">Shareability gap.</strong> Fable&apos;s product was already social. Its value was not being communicated in a way that compelled mass sharing.
            </p>
            <p>
              <strong className="text-text">Scale efficiency.</strong> Fable needed proof that organic UGC, not large influencer budgets, could drive reach, installs, and cultural relevance.
            </p>
            <h2 className="text-text text-2xl font-extrabold tracking-tight pt-4">Approach</h2>
            <p>
              <strong className="text-text">Identity-driven storytelling.</strong> Fable was positioned as personal identity data, not just a reading tracker: &quot;what your books say about you.&quot;
            </p>
            <p>
              <strong className="text-text">Creator minimalism.</strong> Instead of scaling headcount, the work focused on 3 highly aligned creators, iterating on formats, hooks, and emotional triggers.
            </p>
            <p>
              <strong className="text-text">Algorithm-native execution.</strong> Short, curiosity-based openers, fast pacing, and native captions turned introspection into shareable entertainment.
            </p>
            <p>
              Source:{" "}
              <a href={NOTION} className="underline underline-offset-4 hover:text-text" target="_blank" rel="noopener noreferrer">
                the public Fable study on Notion
              </a>
              .
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
