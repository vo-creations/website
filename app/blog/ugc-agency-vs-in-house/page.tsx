import Link from "next/link";
import Article, { ArticleTable, H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, BOOKING_URL, getPost } from "@/lib/blog/posts";

const post = getPost("ugc-agency-vs-in-house");
const link = "text-text underline decoration-white/30 underline-offset-4";

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "typical-agency", label: "The typical UGC agency" },
  { id: "in-house", label: "The in-house creator program" },
  { id: "vo-creations", label: "Vo Creations" },
  { id: "side-by-side", label: "Side by side" },
];

const faqs: FaqItem[] = [
  {
    question: "How is an in-house UGC agency different from a marketplace?",
    answer:
      "An in-house agency trains the creators, writes the scripts, and posts the videos. A marketplace sells you a video. Freelancers are people you hire and manage yourself.",
  },
  {
    question: "Why do in-house programs stall?",
    answer:
      "Nobody has time to recruit and coach, so most programs stall at 5 to 10 creators. Virality is a power law, and a bench that small is unlikely to find the breakout.",
  },
  {
    question: "What does Vo Creations run instead?",
    answer:
      "A roster of 1,000+ trained creators, a guaranteed target CPM, first videos in 10 to 14 days, and in-house editing optimized every week.",
  },
];

export default function UgcAgencyVsInHousePage() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>You have three ways to get creator content:</p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Hire a typical UGC agency.</li>
        <li>Build an in-house creator program.</li>
        <li>Bring in a team that runs the program like your own in-house team.</li>
      </ol>
      <p>Here is what each looks like at the 90-day mark.</p>
      <H2 id="typical-agency">The typical UGC agency</H2>
      <p>
        You get about 20 polished ads, delivered once, and you run them yourself. They look like ads, so they perform like ads. Paid CAC on Meta and TikTok keeps rising, and more polished ads don&apos;t fix that.
      </p>
      <H2 id="in-house">The in-house creator program</H2>
      <p>
        You hire, train, and manage creators, and they churn. Nobody has time to recruit and coach, so most programs stall at 5–10 creators. That&apos;s too few, because virality is a power law.{" "}
        <Link className={link} href="/blog/in-house-creator-programs-stall">Why programs stall</Link>
      </p>
      <H2 id="vo-creations">Vo Creations</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>A roster of 1,000+ trained, coached creators</li>
        <li>Your target CPM, guaranteed</li>
        <li>First videos live in 10–14 days</li>
        <li>In-house editing, optimized every week</li>
      </ul>
      <p>Results so far:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Link className={link} href="/case-studies/liftoff">Liftoff</Link>: 50 creators, 174M+ views in 90 days at a $0.82 CPM, zero paid ads.
        </li>
        <li>
          <Link className={link} href="/case-studies/higgsfield">Higgsfield</Link>: 45 creators, 72M+ views in 35 days at about a $0.96 CPM.
        </li>
      </ul>
      <H2 id="side-by-side">Side by side</H2>
      <ArticleTable
        caption="UGC agency, in-house program, and Vo Creations"
        headers={["", "Typical UGC agency", "In-house creator program", "Vo Creations"]}
        rows={[
          ["What you get", "About 20 polished ads", "A program you run", "A running program"],
          ["Who runs it", "You", "You hire, train, and manage", "Us, with a daily Slack report"],
          ["Creators", "One-off delivery", "Stalls at 5–10", "1,000+ trained"],
          ["Speed", "Per delivery", "Slow to recruit", "First videos in 10–14 days"],
          ["Pricing", "Per video", "Salaries and tools", "$50K+/mo, CPM guaranteed"],
        ]}
      />
      <p>
        On your side: an onboarding survey, free product or promo codes, tracking URLs, and someone who can veto a claim. Everything else is ours: scripts, coaching, posting, editing, creator bonuses, and reporting. You own every video.
      </p>
      <p>
        If you need to spend under $50K a month, want one-off videos, or only want paid-ads management, hire a typical agency or a freelancer.{" "}
        <Link className={link} href="/blog/ugc-agency-pricing">See pricing</Link>
      </p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;Vo Creations helped scale our UGC efforts from 0 to 100. One of the best teams in this space.&rdquo;</p>
        <p>Wassim Bouchelouh, CMO, Liftoff</p>
      </blockquote>
      <p>
        See what a 50-creator roster looks like for your app.{" "}
        <a className={link} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a 30-min fit call
        </a>
      </p>
    </Article>
  );
}
