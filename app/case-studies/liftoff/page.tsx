import type { Metadata } from "next";
import Link from "next/link";
import CaseStudy from "@/components/blog/CaseStudy";
import { BOOKING_URL } from "@/lib/blog/posts";
import { caseStudyBySlug, caseStudyMetadata } from "@/lib/case-studies";

const study = caseStudyBySlug("liftoff");
const link = "text-text underline decoration-white/30 underline-offset-4";

export const metadata: Metadata = caseStudyMetadata(study.slug);

export default function LiftoffCaseStudy() {
  return (
    <CaseStudy slug={study.slug} title={study.title} description={study.description}>
      <h2>What we did</h2>
      <p>
        We wrote the scripts, briefed and coached 50 creators, warmed up their accounts, and got the first videos live in the first two weeks. Every week after that, we put more behind the top videos and creators and cut what wasn&apos;t working. Editing was done in-house, and every script and video went through our core team of four before posting.
      </p>
      <h2>Why it worked</h2>
      <p>
        Our creators are coached, not just briefed. Fifty creators posting at once gives the power law room to work: a few creators break out, and we put more volume behind them. That&apos;s how 174M+ views came in at $0.82 per thousand with no ad spend.
      </p>
      <blockquote className="case-quote">
        <p>&ldquo;Vo Creations helped scale our UGC efforts from 0 to 100. One of the best teams in this space.&rdquo;</p>
        <p>Wassim Bouchelouh, CMO, Liftoff</p>
      </blockquote>
      <p>
        At Liftoff&apos;s CPM, $50K a month buys about 61M organic views.{" "}
        <Link className={link} href="/blog/ugc-agency-pricing">See pricing</Link>.
      </p>
      <a className="btn-talk case-cta" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
        Book a 30-min fit call
      </a>
      <p>
        More results:{" "}
        <Link className={link} href="/case-studies/higgsfield">Higgsfield: 72M+ views in 35 days</Link>
        {" · "}
        <Link className={link} href="/case-studies/fomo">fomo: #3 in Finance</Link>
        {" · "}
        <Link className={link} href="/blog/in-house-creator-programs-stall">Why in-house programs stall at 5–10 creators</Link>
      </p>
    </CaseStudy>
  );
}
