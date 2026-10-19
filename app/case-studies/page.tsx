import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Public Vo Creations case studies: Fable and Cluely, plus the Maxxd campaign. Named results for consumer apps.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Case Studies | Vo Creations",
    description:
      "Public Vo Creations case studies: Fable and Cluely, plus the Maxxd campaign.",
    url: "https://vocreations.com/case-studies",
    type: "website",
  },
};

const studies = [
  {
    href: "/case-studies/fable",
    name: "Fable",
    line: "Social reading app. The published study: 10M+ organic views in 3 weeks with 3 creators. The homepage card now lists 25M+.",
  },
  {
    href: "/case-studies/cluely",
    name: "Cluely",
    line: "Consumer tech. 20M+ organic views, 20,000+ conversions, and 600+ videos in 2 months.",
  },
  {
    href: "/campaigns/maxxd",
    name: "Maxxd",
    line: "Fitness app. 575K+ organic views in 26 days, with no paid media.",
  },
];

export default function CaseStudiesIndex() {
  return (
    <>
      <Nav />
      <main className="pt-36 pb-24 px-6">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-text-secondary mb-4">
            Case studies
          </p>
          <h1 className="font-display text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight mb-4">
            Named work.
          </h1>
          <p className="text-text-secondary leading-relaxed mb-10">
            These are the studies we can publish. Numbers below are copied from the public Notion pages or from pages already on this site. Nothing here is estimated.
          </p>
          <div className="flex flex-col gap-4">
            {studies.map((study) => (
              <Link
                key={study.href}
                href={study.href}
                className="block rounded-2xl border border-white/10 bg-bg-card/50 px-6 py-6 hover:border-white/20 transition-colors"
              >
                <div className="text-xl font-extrabold tracking-tight mb-2">{study.name}</div>
                <p className="text-sm text-text-secondary leading-relaxed">{study.line}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
