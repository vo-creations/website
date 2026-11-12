import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LogoImage from "@/components/LogoImage";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Our work",
  description:
    "Named Vo Creations case studies: the headline number and the outcome, for fomo, Liftoff, Higgsfield, and Krea.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    title: "Our work",
    description:
      "Named Vo Creations case studies: the headline number and the outcome, for fomo, Liftoff, Higgsfield, and Krea.",
    url: "https://vocreations.com/case-studies",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vo Creations" }],
  },
};

export default function CaseStudyIndex() {
  return (
    <div className="editorial">
      <Nav variant="editorial" />
      <main id="main" className="work-index">
        <div className="ed-wrap">
          <p className="lab">Case studies</p>
          <h1 className="display">Our work.</h1>
          <p className="lede work-dek">
            One number and one outcome from each named campaign.
          </p>
          <div className="work-wall">
            {caseStudies.map((study) => (
              <Link key={study.slug} href={`/case-studies/${study.slug}`} className="work-card">
                <LogoImage
                  src={study.logo}
                  alt={`${study.name} logo`}
                  boxClassName={`work-logo is-${study.slug}`}
                />
                <p className="work-figure">{study.figure}</p>
                <p className="work-outcome">{study.outcome}</p>
                <span className="work-more">
                  Read case study
                  <span className="work-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer tone="editorial" />
    </div>
  );
}
