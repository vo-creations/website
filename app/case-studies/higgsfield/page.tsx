import type { Metadata } from "next";
import Link from "next/link";
import CaseStudy from "@/components/blog/CaseStudy";
import { BOOKING_URL } from "@/lib/blog/posts";
import { caseStudyBySlug } from "@/lib/case-studies";

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
  },
};

export default function HiggsfieldCaseStudy() {
  return (
    <CaseStudy slug={study.slug} title={study.title} description={study.description}>
      <h2>Summary</h2>
      <p>
        <strong>Client:</strong> Higgsfield, an AI video app
        <br />
        <strong>Window:</strong> June 29 – August 3, 2026 (35 days)
        <br />
        <strong>What we did:</strong> ran an organic creator campaign
      </p>
      <div className="case-table-wrap">
        <table className="case-table">
          <caption className="sr-only">Higgsfield results</caption>
          <tbody>
            <tr>
              <th scope="row">Organic views</th>
              <td>72M+ (dashboard: 72.5M)</td>
            </tr>
            <tr>
              <th scope="row">CPM</th>
              <td>~$0.96</td>
            </tr>
            <tr>
              <th scope="row">Creators</th>
              <td>45</td>
            </tr>
            <tr>
              <th scope="row">Engagements</th>
              <td>1.1M (1.5% rate). Likes / comments / shares: 502.2K / 228.3K / 336.3K</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>What we did</h2>
      <p>
        Forty-five creators posted organically across short-form platforms. We wrote the scripts, coached the creators, edited in-house, and every week put more behind the videos that were pulling views.
      </p>
      <h2>Why it worked</h2>
      <p>
        Speed and efficiency. The campaign reached 72M+ views in five weeks at under $1 per thousand. It also drove 336K+ shares, which is people sending the videos on, not just watching them.
      </p>
      <h2>Quote</h2>
      <blockquote className="case-quote">
        <p>&ldquo;Really appreciate the responsiveness you guys have shown. Overall, the experience has been very great.&rdquo;</p>
        <p>Shotan Jakupov, Head of Growth, Higgsfield</p>
      </blockquote>
      <h2>CTA</h2>
      <p>
        <a className={link} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a 30-min fit call
        </a>
        {" · "}
        <Link className={link} href="/blog/ugc-for-ai-startups">UGC for AI startups</Link>
      </p>
      <p>
        More results:{" "}
        <Link className={link} href="/case-studies/krea">Krea: 130M+ views and still growing</Link>
        {" · "}
        <Link className={link} href="/case-studies/liftoff">Liftoff: $0.82 CPM</Link>
      </p>
    </CaseStudy>
  );
}
