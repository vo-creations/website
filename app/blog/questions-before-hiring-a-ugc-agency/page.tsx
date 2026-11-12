import Link from "next/link";
import Article, { H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, BOOKING_URL, getPost } from "@/lib/blog/posts";

const post = getPost("questions-before-hiring-a-ugc-agency");
const link = "text-text underline decoration-white/30 underline-offset-4";

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "the-twelve", label: "What are the 12 questions?" },
  { id: "end-the-call", label: "Which answers should end the call?" },
];

const faqs: FaqItem[] = [
  {
    question: "Who posts the videos?",
    answer:
      "Our creators post organically on TikTok, Instagram, YouTube, Facebook, and Snapchat. Creators own their accounts. You own every video.",
  },
  {
    question: "What do you guarantee?",
    answer:
      "Your target CPM, which is your cost per 1,000 organic views. Videos under 1,000 views do not count toward it.",
  },
  {
    question: "Who approves scripts and videos?",
    answer: "Our core team of four approves every script and video before it posts.",
  },
];

export default function QuestionsPage() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        Most UGC agency calls go the same way: a reel of viral videos, a logo slide, and a rate card. None of that tells you who trains the creators, who posts, or what happens when a video flops.
      </p>
      <p>Ask these 12 questions and score each answer 0 or 1. If an agency scores under 9, keep shopping. Our answers are under each question, so you can hold us to them too.</p>
      <H2 id="the-twelve">What are the 12 questions?</H2>
      <ol className="list-decimal space-y-4 pl-5">
        <li>
          <strong>Do you train creators, or just source them?</strong> Every creator finishes a two-week paid trial before touching a brand account. We keep the top 1% of applicants and coach them every week.
        </li>
        <li>
          <strong>How many creators will run my campaign?</strong>{" "}
          <Link className={link} href="/case-studies/liftoff">Liftoff</Link> ran 50 and{" "}
          <Link className={link} href="/case-studies/higgsfield">Higgsfield</Link> ran 45. In-house programs usually stall at 5–10.
        </li>
        <li>
          <strong>Who posts, and where?</strong> Our creators post organically on TikTok, Instagram, YouTube, Facebook, and Snapchat. Creators own their accounts.
        </li>
        <li>
          <strong>Who approves scripts and videos?</strong> Our core team of four approves every one before it posts.
        </li>
        <li>
          <strong>When does the first video go live?</strong> Scripts on day 0, creators briefed within about 48 hours, and first videos live in 10–14 days.{" "}
          <Link className={link} href="/#process">How a campaign runs</Link>
        </li>
        <li>
          <strong>What do you guarantee?</strong> Your target CPM, which is your cost per 1,000 organic views.
        </li>
        <li>
          <strong>What doesn&apos;t count?</strong> Videos under 1,000 views don&apos;t count toward your CPM.
        </li>
        <li>
          <strong>What&apos;s inside the fee?</strong> Scripts, creators, coaching, posting, in-house editing, creator bonuses, and daily reporting. Paid ad spend is billed separately.{" "}
          <Link className={link} href="/blog/ugc-agency-pricing">Pricing</Link>
        </li>
        <li>
          <strong>What&apos;s the minimum, and how do I leave?</strong> 90 days, then month to month. No refunds after launch.
        </li>
        <li>
          <strong>What do I see every day?</strong> A report in a shared Slack channel covering spend vs budget, views, posts, active creators, CPM, engagement rate, and top creators from the last 7 days.
        </li>
        <li>
          <strong>What happens when a video misses?</strong> We handle all takedowns and re-edits. You own every video.
        </li>
        <li>
          <strong>Show me proof with a time window and a CPM.</strong>{" "}
          <Link className={link} href="/case-studies/fomo">fomo</Link> went from 625K to 3M+ users between June and August 2026, with about 50% of users coming from Vo&apos;s creators, at under a $4 CPM. On August 21, 2026, it ranked #3 in US App Store Top Free Finance, ahead of Cash App and Kalshi.
        </li>
      </ol>
      <H2 id="end-the-call">Which answers should end the call?</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>&ldquo;We have a network.&rdquo;</strong> Ask what it takes to get in.
        </li>
        <li>
          <strong>&ldquo;We do organic and paid.&rdquo;</strong> Ask which comes first. Ours: organic first, then ad money only behind what has already worked.
        </li>
        <li>
          <strong>&ldquo;We can flex.&rdquo;</strong> Ask what they turn down. Ours: budgets under $50K a month, one-off videos, and paid-ads-only management.
        </li>
      </ul>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;Really appreciate the responsiveness you guys have shown. Overall, the experience has been very great.&rdquo;</p>
        <p>Shotan Jakupov, Head of Growth, Higgsfield</p>
      </blockquote>
      <p>
        Ask us all 12 on a call. We&apos;ll answer with numbers.{" "}
        <a className={link} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a 30-min fit call
        </a>
      </p>
      <p>
        Related:{" "}
        <Link className={link} href="/blog/ugc-agency-vs-in-house">UGC agency vs in-house creator program</Link>
        {" · "}
        <Link className={link} href="/#results">All results</Link>
      </p>
    </Article>
  );
}
