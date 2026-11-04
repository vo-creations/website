import Link from "next/link";
import Article, { H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, BOOKING_URL, getPost } from "@/lib/blog/posts";

const post = getPost("in-house-creator-programs-stall");
const link = "text-text underline decoration-white/30 underline-offset-4";

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "math", label: "Why is the bench too small?" },
  { id: "time", label: "Why doesn't coaching scale?" },
  { id: "what-it-looks-like", label: "What do 45 to 50 creators look like?" },
  { id: "hybrid", label: "What if we keep someone in-house?" },
];

const faqs: FaqItem[] = [
  {
    question: "Why do in-house creator programs stall at 5 to 10 creators?",
    answer:
      "Virality is a power law, and a small bench is unlikely to include the creator who breaks out. Recruiting and weekly coaching also take more time than a growth team has.",
  },
  {
    question: "How many creators do your campaigns run?",
    answer: "Liftoff ran 50 creators. Higgsfield ran 45. First videos go live in 10 to 14 days.",
  },
  {
    question: "Can we keep an in-house owner?",
    answer:
      "Yes. They approve claims, own the product story, and read the daily Slack report. We bring the trained creators, scripts, posting, editing, and creator bonuses.",
  },
];

export default function InHouseStallPage() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>Almost every AI and fintech app we talk to has tried it:</p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Hire a UGC manager.</li>
        <li>Recruit some creators.</li>
        <li>Send them product.</li>
        <li>Post.</li>
      </ol>
      <p>It works for a few weeks. Then it plateaus at 5–10 creators and stays there. That isn&apos;t a talent problem. It&apos;s a math problem and a time problem.</p>
      <H2 id="math">Why is the bench too small?</H2>
      <p>
        Views don&apos;t spread evenly across creators. Virality is a power law: most videos do a little, and a few do almost everything. A bench of 8 creators is too small to find the breakout, and too small to replace them when they leave. You&apos;ll conclude UGC doesn&apos;t work for your app, when you just never ran enough creators to find the one who pops.
      </p>
      <H2 id="time">Why doesn&apos;t coaching scale?</H2>
      <p>
        To run 50 creators, you have to find far more than 50, trial them, cut most of them, and coach the rest every week. Nobody on a growth team has time for that on top of their job. So the program stalls, creators churn, and you&apos;re back to recruiting.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Every creator finishes a two-week paid trial before touching a brand account.</li>
        <li>We keep the top 1% of applicants and coach them every week.</li>
        <li>Our core team of four approves every script and video.</li>
      </ul>
      <p>That&apos;s a full-time operation, not a side project.</p>
      <H2 id="what-it-looks-like">What do 45 to 50 creators look like?</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Link className={link} href="/case-studies/liftoff">Liftoff</Link>: 50 creators, 174M+ views in 90 days, a $0.82 CPM, zero paid ads.
        </li>
        <li>
          <Link className={link} href="/case-studies/higgsfield">Higgsfield</Link>: 45 creators, 72M+ views in 35 days, about a $0.96 CPM.
        </li>
      </ul>
      <p>The pattern is the same every time: run many creators at once, find who pops, and double down every week.</p>
      <p>If you still want to build in-house, do it with three rules: plan for 50+ creators, not 10; coach every week instead of sending briefs; cut the bottom of the roster every two weeks and put more behind the top. If you can&apos;t staff that, that&apos;s the job we do.</p>
      <H2 id="hybrid">What if we keep someone in-house?</H2>
      <p>
        Keep your in-house person as the owner. They approve claims, own the product story, and read the daily report in a shared Slack channel. We bring trained creators from a 1,000+ roster, plus scripts, posting, editing, and creator bonuses. First videos go live in 10–14 days, and you own every video.{" "}
        <Link className={link} href="/#process">How a campaign runs</Link>
      </p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;Vo Creations helped scale our UGC efforts from 0 to 100. One of the best teams in this space.&rdquo;</p>
        <p>Wassim Bouchelouh, CMO, Liftoff</p>
      </blockquote>
      <p>
        Stuck at 10 creators? We&apos;ll show you what a 50-creator roster looks like for your app.{" "}
        <a className={link} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a 30-min fit call
        </a>
      </p>
    </Article>
  );
}
