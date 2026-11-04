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
      <p>
        <strong>Client:</strong> Krea, an AI creative platform
        <br />
        <strong>Window:</strong> about 3 months; the dashboard shows Jul 28 – Oct 18
        <br />
        <strong>What we did:</strong> ran an organic creator campaign that&apos;s still running
      </p>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full border-collapse text-left text-[15px]">
          <caption className="sr-only">Krea results</caption>
          <tbody>
            <tr className="border-b border-white/10">
              <th scope="row" className="px-4 py-3 font-semibold text-text">Organic views</th>
              <td className="px-4 py-3">130M+ (dashboard: 130.6M)</td>
            </tr>
            <tr className="border-b border-white/10">
              <th scope="row" className="px-4 py-3 font-semibold text-text">CPM</th>
              <td className="px-4 py-3">Under $3</td>
            </tr>
            <tr className="border-b border-white/10">
              <th scope="row" className="px-4 py-3 font-semibold text-text">Engagements</th>
              <td className="px-4 py-3">4.7M (4.7% rate)</td>
            </tr>
            <tr className="border-b border-white/10">
              <th scope="row" className="px-4 py-3 font-semibold text-text">Likes</th>
              <td className="px-4 py-3">1.8M</td>
            </tr>
            <tr>
              <th scope="row" className="px-4 py-3 font-semibold text-text">Status</th>
              <td className="px-4 py-3">Still growing</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="font-display pt-8 text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text">What we did</h2>
      <p>
        We wrote the scripts, coached the creators, and every week put more behind the videos and creators that were working. Three months in, daily views were still climbing.
      </p>
      <h2 className="font-display pt-8 text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text">What stands out</h2>
      <p>
        The engagement rate. 4.7% across 130M+ views means people weren&apos;t just scrolling past. That&apos;s the comment-section effect that polished ads don&apos;t get.
      </p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;Vo Creations helped Krea go from 1→100 with UGC. One of the best agencies in the space.&rdquo;</p>
        <p>Miguel Lara, Growth Marketing, Krea</p>
      </blockquote>
      <h2 className="font-display pt-8 text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text">Want this for your AI product?</h2>
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
