import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const NOTION = "https://www.notion.so/Cluely-2afc58bd24a580bf9828ee4633ceebf4";

export const metadata: Metadata = {
  title: "Cluely Case Study",
  description:
    "How Vo Creations helped Cluely reach 20M+ organic views, 20,000+ conversions, and 600+ videos in 2 months.",
  alternates: { canonical: "/case-studies/cluely" },
  openGraph: {
    title: "Cluely Case Study | Vo Creations",
    description:
      "20M+ organic views, 20,000+ conversions, and 600+ videos in 2 months.",
    url: "https://vocreations.com/case-studies/cluely",
    type: "article",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cluely: 20M+ organic views in 2 months",
  datePublished: "2025-11-18",
  dateModified: "2026-10-18",
  author: { "@type": "Organization", name: "Vo Creations", url: "https://vocreations.com" },
  publisher: { "@type": "Organization", name: "Vo Creations", url: "https://vocreations.com" },
  mainEntityOfPage: "https://vocreations.com/case-studies/cluely",
  description:
    "Vo Creations helped Cluely generate 20M+ organic views, 20,000+ conversions, and 600+ videos in 2 months.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://vocreations.com" },
    { "@type": "ListItem", position: 2, name: "Case studies", item: "https://vocreations.com/case-studies" },
    { "@type": "ListItem", position: 3, name: "Cluely", item: "https://vocreations.com/case-studies/cluely" },
  ],
};

export default function CluelyCaseStudy() {
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
            Cluely
          </h1>
          <p className="text-sm text-text-dim mb-8">Published November 18, 2025</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              ["20M+", "Organic views"],
              ["20K+", "Conversions"],
              ["600+", "Videos"],
              ["2 months", "Timeline"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-bg-card/50 p-4 text-center">
                <div className="text-2xl font-extrabold tracking-tight">{value}</div>
                <div className="text-[10px] uppercase tracking-wide text-text-dim mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-[15px] text-text-secondary leading-[1.75]">
            <p>
              Cluely is a consumer tech product built to make decision-making simpler and less overwhelming.
            </p>
            <p>
              In 2 months, Vo Creations helped Cluely generate 20M+ organic views, drive over 20,000 new conversions, and build a content engine of 600+ videos. The published summary says that engine was powered by 5 creators.
            </p>
            <p>
              The same study&apos;s approach section says the squad was 6 creators. Both lines are from the public page, so this writeup keeps both instead of picking one.
            </p>
            <h2 className="text-text text-2xl font-extrabold tracking-tight pt-4">Barriers</h2>
            <p>
              <strong className="text-text">Low brand awareness.</strong> Cluely had a strong product and limited exposure beyond an early adopter base.
            </p>
            <p>
              <strong className="text-text">Scroll-by problem.</strong> People found the idea interesting, but the content was not sticky enough to turn curiosity into action.
            </p>
            <p>
              <strong className="text-text">Trust gap.</strong> As a newer consumer tech product, Cluely needed social proof and emotional buy-in before users were ready to commit.
            </p>
            <h2 className="text-text text-2xl font-extrabold tracking-tight pt-4">Approach</h2>
            <p>
              <strong className="text-text">Creator-led storytelling.</strong> A small squad of creators (the study says 6 here) became the consistent faces of Cluely, so familiarity and trust could build.
            </p>
            <p>
              <strong className="text-text">Utility-driven narratives.</strong> Content leaned into lines like &quot;stop guessing, start knowing,&quot; &quot;before you waste money on this,&quot; and &quot;I wish I had Cluely sooner,&quot; showing how the product removes friction from everyday decisions.
            </p>
            <p>
              <strong className="text-text">Volume and iteration.</strong> Over 600 videos were produced in 2 months. Each one was analyzed, tagged, and iterated on. Hooks, watch time, and conversion signals shaped the next batch.
            </p>
            <p>
              Source:{" "}
              <a href={NOTION} className="underline underline-offset-4 hover:text-text" target="_blank" rel="noopener noreferrer">
                the public Cluely study on Notion
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
