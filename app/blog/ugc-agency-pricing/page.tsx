import Link from "next/link";
import Article, { ArticleTable, H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, BOOKING_URL, getPost } from "@/lib/blog/posts";

const post = getPost("ugc-agency-pricing");
const link = "text-text underline decoration-white/30 underline-offset-4";

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "how-many-views", label: "How many views does $50K buy?" },
  { id: "inside-the-fee", label: "What's inside the fee?" },
  { id: "outside-the-fee", label: "What's outside the fee?" },
  { id: "why-90-days", label: "Why 90 days?" },
  { id: "how-this-compares", label: "How this compares" },
];

const faqs: FaqItem[] = [
  {
    question: "What does $50K a month buy?",
    answer:
      "At a $1 target CPM, about 50 million organic views. At $4, about 12.5 million. Trained creators, scripts, in-house editing, posting, creator bonuses, and daily reporting are included.",
  },
  {
    question: "What is a CPM?",
    answer:
      "Cost per 1,000 organic views. We guarantee your target CPM. Videos under 1,000 views do not count toward it.",
  },
  {
    question: "Is paid ad spend included?",
    answer: "No. Paid ad spend is billed separately. The monthly fee already includes creator bonuses.",
  },
  {
    question: "What is the term?",
    answer: "90 days, then month to month. No refunds after launch. We take 10 new campaigns a month.",
  },
];

export default function UgcAgencyPricingPage() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        $50K+ a month, with a 90-day minimum and then month to month. We guarantee your target CPM, which is your cost per 1,000 organic views. Videos under 1,000 views don&apos;t count toward it. Paid ad spend is billed separately. There are no refunds after launch.
      </p>
      <H2 id="how-many-views">How many views does $50K buy?</H2>
      <p>Divide the monthly fee by your CPM and multiply by 1,000.</p>
      <ArticleTable
        caption="Organic views per month at $50K"
        headers={["Target CPM", "Organic views per month at $50K"]}
        rows={[
          ["$1", "50M"],
          ["$2", "25M"],
          ["$4", "12.5M"],
        ]}
      />
      <p>Hold us to that number. Here is what we have actually delivered:</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Link className={link} href="/case-studies/liftoff">Liftoff</Link>: 174M+ views in 90 days at a $0.82 CPM, with 50 creators and zero paid ads.
        </li>
        <li>
          <Link className={link} href="/case-studies/higgsfield">Higgsfield</Link>: 72M+ views in 35 days at about a $0.96 CPM, with 45 creators.
        </li>
        <li>
          <Link className={link} href="/case-studies/krea">Krea</Link>: 130M+ views in 12 weeks at under a $3 CPM, and still growing.
        </li>
        <li>
          <Link className={link} href="/case-studies/fomo">fomo</Link>: went from 625K to 3M+ users between June and August 2026 at under a $4 CPM, and reached #3 in US App Store Top Free Finance.
        </li>
      </ul>
      <H2 id="inside-the-fee">What&apos;s inside the fee?</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>Scripts</li>
        <li>Trained, coached creators from a roster of 1,000+</li>
        <li>Posting on TikTok, Instagram, YouTube, Facebook, and Snapchat</li>
        <li>In-house editing, optimized every week</li>
        <li>Creator bonuses</li>
        <li>A daily report in a shared Slack channel: spend vs budget, views, posts, active creators, CPM, engagement rate, and top creators from the last 7 days</li>
      </ul>
      <p>Our core team of four approves every script and video before it posts. You own every video made for your campaign. Creators own their accounts.</p>
      <H2 id="outside-the-fee">What&apos;s outside the fee?</H2>
      <p>
        <strong>Paid ad spend.</strong> Our rule is to post organically, a lot, and see what people actually watch. If you add paid, you only put money behind what&apos;s already working.
      </p>
      <p>What you give us: an onboarding survey, free product, promo codes, or app/site access, and custom tracking URLs.</p>
      <H2 id="why-90-days">Why 90 days?</H2>
      <p>
        Scripts are written on day 0 and creators are briefed within about 48 hours. Accounts warm up, and the first videos go live in 10–14 days. After that, we double down every week on the top videos. Ninety days gives that loop several cycles, and after that it&apos;s month to month.
      </p>
      <H2 id="how-this-compares">How this compares</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>A typical UGC agency hands over about 20 polished ads, one time, and you run them yourself.</li>
        <li>An in-house creator program means you hire, train, and manage creators, and most programs stall at 5–10 creators.</li>
        <li>Vo Creations runs a roster of 1,000+ trained creators and guarantees your CPM.</li>
      </ul>
      <p>
        <Link className={link} href="/blog/ugc-agency-vs-in-house">Full comparison</Link>
      </p>
      <p>This isn&apos;t for budgets under $50K a month, one-off videos, or paid-ads-only management. We take on 10 new campaigns a month.</p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;Vo Creations helped scale our UGC efforts from 0 to 100. One of the best teams in this space.&rdquo;</p>
        <p>Wassim Bouchelouh, CMO, Liftoff</p>
      </blockquote>
      <p>
        Bring your target CPM. On a call we&apos;ll work out your monthly view number.{" "}
        <a className={link} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a 30-min fit call
        </a>
      </p>
    </Article>
  );
}
