import type { Metadata } from "next";
import Link from "next/link";
import CaseStudy from "@/components/blog/CaseStudy";
import { BOOKING_URL } from "@/lib/blog/posts";
import { caseStudyBySlug } from "@/lib/case-studies";

const study = caseStudyBySlug("krea");
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

export default function KreaCaseStudy() {
  return (
    <CaseStudy slug={study.slug} title={study.title} description={study.description}>
      <h2>Summary</h2>
      <p>
        <strong>Client:</strong> Krea, an AI creative platform
        <br />
        <strong>Window:</strong> about 3 months; the dashboard shows Jul 28 – Oct 18
        <br />
        <strong>What we did:</strong> ran an organic creator campaign that&apos;s still running
      </p>
      <div className="case-table-wrap">
        <table className="case-table">
          <caption className="sr-only">Krea results</caption>
          <tbody>
            <tr>
              <th scope="row">Organic views</th>
              <td>130M+ (dashboard: 130.6M)</td>
            </tr>
            <tr>
              <th scope="row">CPM</th>
              <td>Under $3</td>
            </tr>
            <tr>
              <th scope="row">Engagements</th>
              <td>4.7M (4.7% rate); 1.8M likes</td>
            </tr>
            <tr>
              <th scope="row">Status</th>
              <td>Still growing</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>What we did</h2>
      <p>
        We wrote the scripts, coached the creators, and every week put more behind the videos and creators that were working. Three months in, daily views were still climbing.
      </p>
      <h2>Why it worked</h2>
      <p>
        The engagement rate. 4.7% across 130M+ views means people weren&apos;t just scrolling past. That&apos;s the comment-section effect that polished ads don&apos;t get.
      </p>
      <h2>Quote</h2>
      <blockquote className="case-quote">
        <p>&ldquo;Vo Creations helped Krea go from 1→100 with UGC. One of the best agencies in the space.&rdquo;</p>
        <p>Miguel Lara, Growth Marketing, Krea</p>
      </blockquote>
      <h2>CTA</h2>
      <p>
        <a className={link} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a 30-min fit call
        </a>
        {" · "}
        <Link className={link} href="/blog/ugc-vs-paid-ads-app-growth">UGC vs paid ads for app growth</Link>
      </p>
      <p>
        More results:{" "}
        <Link className={link} href="/case-studies/higgsfield">Higgsfield: 72M+ in 35 days</Link>
        {" · "}
        <Link className={link} href="/case-studies/liftoff">Liftoff: $0.82 CPM</Link>
        {" · "}
        <Link className={link} href="/case-studies/fomo">FOMO: #3 in Finance</Link>
      </p>
    </CaseStudy>
  );
}
