import Link from "next/link";
import Article, { H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, BOOKING_URL, getPost } from "@/lib/blog/posts";

const post = getPost("ugc-vs-paid-ads-app-growth");
const link = "text-text underline decoration-white/30 underline-offset-4";

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "the-math", label: "What does $50K buy in organic UGC?" },
  { id: "users", label: "Do views turn into users?" },
  { id: "why-organic", label: "Why organic beats polished ads" },
  { id: "where-paid-wins", label: "Where paid still wins" },
  { id: "tradeoffs", label: "What are the tradeoffs?" },
];

const faqs: FaqItem[] = [
  {
    question: "How many organic views does $50K buy?",
    answer: "At a $1 CPM, about 50 million. At $4, about 12.5 million. CPM means cost per 1,000 organic views.",
  },
  {
    question: "Should I turn paid ads off?",
    answer:
      "No. Post organically first, see what people watch, and put ad money only behind what has already worked. Ad spend is billed separately.",
  },
  {
    question: "How many creators does this take?",
    answer: "Liftoff ran 50 and Higgsfield ran 45. A handful of creators is too small to find the breakout.",
  },
];

export default function UgcVsPaidAdsPage() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        Paid CAC on Meta and TikTok goes up every quarter. Almost every AI and fintech app we talk to at your stage is seeing the same thing. The question isn&apos;t whether to stop paid. It&apos;s what your next $50K should do first.
      </p>
      <H2 id="the-math">What does $50K buy in organic UGC?</H2>
      <p>Organic UGC is priced the same way media is: cost per 1,000 views. The difference is the number.</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Link className={link} href="/case-studies/liftoff">Liftoff</Link>: 174M+ organic views in 90 days at a $0.82 CPM, with zero paid ads.
        </li>
        <li>
          <Link className={link} href="/case-studies/higgsfield">Higgsfield</Link>: 72M+ views in 35 days at about a $0.96 CPM.
        </li>
        <li>
          <Link className={link} href="/case-studies/krea">Krea</Link>: past 130M+ views in 12 weeks at under $3, and still growing.
        </li>
      </ul>
      <p>Run the same arithmetic on your budget. At a $1 CPM, $50K buys 50M organic views. At $4, it buys 12.5M.</p>
      <H2 id="users">Do views turn into users?</H2>
      <p>
        Fair objection. <Link className={link} href="/case-studies/fomo">FOMO</Link> went from 625K to 3M+ users between June and August 2026. About 50% of its users came from Vo&apos;s creators, at under a $4 CPM. On August 21, 2026, it ranked #3 in US App Store Top Free Finance, ahead of Cash App and Kalshi.
      </p>
      <H2 id="why-organic">Why organic beats polished ads</H2>
      <p>
        Agency ads look like ads, and people scroll past ads. Organic UGC is a real person on their own account, telling a story your user has lived. When a video works, the comment section does the selling. When it doesn&apos;t, you don&apos;t pay for it: videos under 1,000 views don&apos;t count toward your CPM.
      </p>
      <H2 id="where-paid-wins">Where paid still wins</H2>
      <p>
        Paid is the amplifier, not the test. Our rule: post organically, a lot, see what people actually watch, and only put ad money behind what&apos;s already working. Organic finds the winners and paid scales them. Ad spend is billed separately from our fee, so you decide how much goes behind each winner.
      </p>
      <p>
        Not 5 creators. Liftoff ran 50 and Higgsfield ran 45. Because virality is a power law, you need volume to find the few creators who pop. Then you double down on them every week. That&apos;s{" "}
        <Link className={link} href="/blog/in-house-creator-programs-stall">why in-house programs stall</Link>: nobody has time to recruit and coach 50 people. We have 1,000+ trained creators, and first videos go live in 10–14 days.
      </p>
      <H2 id="tradeoffs">What are the tradeoffs?</H2>
      <ul className="list-disc space-y-2 pl-5">
        <li>It&apos;s slower to start. Accounts warm up for 10–14 days before the first videos go live.</li>
        <li>It needs volume. A handful of creators won&apos;t find the breakout.</li>
        <li>It needs time. The loop needs a 90-day window to work.</li>
      </ul>
      <p>If you need installs tomorrow, paid is faster. If you need CAC down this quarter, start organic now.</p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;Great engagement. You guys are doing a great job keeping your team engaged, and we love the quality of your creators and coaches.&rdquo;</p>
        <p>Will Timberlake, UGC Manager, FOMO</p>
      </blockquote>
      <p>
        Bring your current paid CPM. We&apos;ll show you what $50K buys at your target CPM, and we guarantee that CPM.{" "}
        <a className={link} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a 30-min fit call
        </a>
      </p>
    </Article>
  );
}
