import type { Metadata } from "next";
import Link from "next/link";
import CaseStudy from "@/components/blog/CaseStudy";
import { BOOKING_URL } from "@/lib/blog/posts";
import { caseStudyBySlug, caseStudyOgImage } from "@/lib/case-studies";

const study = caseStudyBySlug("fomo");
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

export default function FomoCaseStudy() {
  return (
    <CaseStudy slug={study.slug} title={study.title} description={study.description}>
      <h2>Summary</h2>
      <p>
        <strong>Client:</strong> FOMO, a consumer finance app
        <br />
        <strong>Window:</strong> June–August 2026
        <br />
        <strong>What we did:</strong> trained and coached creators inside FOMO&apos;s creator program
      </p>
      <div className="case-table-wrap">
        <table className="case-table">
          <caption className="sr-only">FOMO results</caption>
          <tbody>
            <tr>
              <th scope="row">Users</th>
              <td>625K to 3M+ (June to August 2026)</td>
            </tr>
            <tr>
              <th scope="row">Share of users from creators</th>
              <td>~50%, all of them Vo creators</td>
            </tr>
            <tr>
              <th scope="row">CPM</th>
              <td>Under $4</td>
            </tr>
            <tr>
              <th scope="row">Chart position</th>
              <td>#3 in US App Store Top Free Finance, Aug 21, 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        On August 21, 2026, FOMO ranked #3 in the US App Store&apos;s Top Free Finance chart. That put it behind Capital One and PayPal, and ahead of Cash App (#4), Venmo (#5) and Kalshi (#6).
      </p>
      <h2>What we did</h2>
      {/* [NEED: Daniel to confirm FOMO creator wording] "inside FOMO's program" vs "all of them ours" */}
      <p>
        FOMO already had a creator program. We trained and coached the creators inside it: scripts, briefing, weekly coaching, and doubling down on the videos that worked.
      </p>
      <p>
        Between June and August 2026, users grew from 625K to more than 3M. Roughly half of those users came from creators, all of them ours, at under a $4 CPM.
      </p>
      <h2>Why it worked</h2>
      <p>
        Finance apps are a crowded, low-trust category, and polished ads look like ads. A creator on their own account, talking about money the way their followers already do, earns a different kind of attention.
      </p>
      <blockquote className="case-quote">
        <p>&ldquo;Great engagement. You guys are doing a great job keeping your team engaged, and we love the quality of your creators and coaches.&rdquo;</p>
        <p>Will Timberlake, UGC Manager, FOMO</p>
      </blockquote>
      <p>Bring your target CPM. We&apos;ll show you the view and user math for your category.</p>
      <a className="btn-talk case-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
        Book a 30-min fit call
      </a>
      <p>
        More results:{" "}
        <Link className={link} href="/case-studies/liftoff">Liftoff: 174M+ views, $0.82 CPM</Link>
        {" · "}
        <Link className={link} href="/case-studies/krea">Krea: 130M+ views</Link>
        {" · "}
        <Link className={link} href="/blog/ugc-vs-paid-ads-app-growth">UGC vs paid ads for app growth</Link>
      </p>
    </CaseStudy>
  );
}
