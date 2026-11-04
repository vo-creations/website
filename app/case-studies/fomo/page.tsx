import type { Metadata } from "next";
import Link from "next/link";
import CaseStudy from "@/components/blog/CaseStudy";
import { BOOKING_URL } from "@/lib/blog/posts";
import { caseStudyBySlug } from "@/lib/case-studies";

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
  },
};

export default function FomoCaseStudy() {
  return (
    <CaseStudy slug={study.slug} title={study.title} description={study.description}>
      <p>
        <strong>Client:</strong> FOMO, a consumer finance app
        <br />
        <strong>Window:</strong> June–August 2026
        <br />
        <strong>What we did:</strong> trained and coached creators inside FOMO&apos;s creator program
      </p>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full border-collapse text-left text-[15px]">
          <caption className="sr-only">FOMO results</caption>
          <tbody>
            <tr className="border-b border-white/10">
              <th scope="row" className="px-4 py-3 font-semibold text-text">Users</th>
              <td className="px-4 py-3">625K to 3M+ (June to August 2026)</td>
            </tr>
            <tr className="border-b border-white/10">
              <th scope="row" className="px-4 py-3 font-semibold text-text">Share of users from creators</th>
              <td className="px-4 py-3">~50%, all of them Vo creators</td>
            </tr>
            <tr className="border-b border-white/10">
              <th scope="row" className="px-4 py-3 font-semibold text-text">CPM</th>
              <td className="px-4 py-3">Under $4</td>
            </tr>
            <tr>
              <th scope="row" className="px-4 py-3 font-semibold text-text">Chart position</th>
              <td className="px-4 py-3">#3 in US App Store Top Free Finance, Aug 21, 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2 className="font-display pt-8 text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text">The chart</h2>
      <p>
        On August 21, 2026, FOMO ranked #3 in the US App Store&apos;s Top Free Finance chart. That put it behind Capital One and PayPal, and ahead of Cash App (#4), Venmo (#5) and Kalshi (#6).
      </p>
      <h2 className="font-display pt-8 text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text">What we did</h2>
      <p>
        FOMO already had a creator program. We trained and coached the creators inside it: scripts, briefing, weekly coaching, and doubling down on the videos that worked.
      </p>
      <p>
        Between June and August 2026, users grew from 625K to more than 3M. Roughly half of those users came from creators, all of them ours, at under a $4 CPM.
      </p>
      <h2 className="font-display pt-8 text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text">Why it worked</h2>
      <p>
        Finance apps are a crowded, low-trust category, and polished ads look like ads. A creator on their own account, talking about money the way their followers already do, earns a different kind of attention.
      </p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;Great engagement. You guys are doing a great job keeping your team engaged, and we love the quality of your creators and coaches.&rdquo;</p>
        <p>Will Timberlake, UGC Manager, FOMO</p>
      </blockquote>
      <h2 className="font-display pt-8 text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text">Want this for your app?</h2>
      <p>
        Bring your target CPM. We&apos;ll show you the view and user math for your category.{" "}
        <a className={link} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a 30-min fit call
        </a>
      </p>
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
