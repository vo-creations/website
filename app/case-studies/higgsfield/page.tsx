import type { Metadata } from "next";
import Link from "next/link";
import CaseStudy from "@/components/blog/CaseStudy";
import { BOOKING_URL } from "@/lib/blog/posts";
import { caseStudyBySlug, caseStudyOgImage } from "@/lib/case-studies";

const study = caseStudyBySlug("higgsfield");
const link = "text-text underline decoration-white/30 underline-offset-4";

export const metadata: Metadata = {
  title: study.title,
  description: study.description,
  alternates: { canonical: `/case-studies/${study.slug}` },
  openGraph: {
    title: study.title,
    description: study.description,
    url: `https://vocreations.com/case-studies/${study.slug}`,
    type: "article",
    images: [caseStudyOgImage],
  },
};

export default function HiggsfieldCaseStudy() {
  return (
    <CaseStudy slug={study.slug} title={study.title} description={study.description}>
      <h2>What we did</h2>
      <p>
        Forty-five creators posted organically across short-form platforms. We wrote the scripts, coached the creators, edited in-house, and every week put more behind the videos that were pulling views.
      </p>
      <h2>Why it worked</h2>
      <p>
        Speed and efficiency. The campaign reached 72M+ views in five weeks at under $1 per thousand. It also drove 336K+ shares, which is people sending the videos on, not just watching them. Likes / comments / shares: 502.2K / 228.3K / 336.3K.
      </p>
      <blockquote className="case-quote">
        <p>&ldquo;Really appreciate the responsiveness you guys have shown. Overall, the experience has been very great.&rdquo;</p>
        <p>Shotan Jakupov, Head of Growth, Higgsfield</p>
      </blockquote>
      <p>
        <Link className={link} href="/blog/ugc-for-ai-startups">UGC for AI startups</Link>
      </p>
      <a className="btn-talk case-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
        Book a 30-min fit call
      </a>
      <p>
        More results:{" "}
        <Link className={link} href="/case-studies/krea">Krea: 130M+ views and still growing</Link>
        {" · "}
        <Link className={link} href="/case-studies/liftoff">Liftoff: $0.82 CPM</Link>
      </p>
    </CaseStudy>
  );
}
