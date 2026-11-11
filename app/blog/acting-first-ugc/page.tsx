// DECISION 2026-11: student pay stays unbranded and linked to the interviews — see docs/DECISIONS.md
import Link from "next/link";
import Article, { H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, BOOKING_URL, getPost } from "@/lib/blog/posts";

const post = getPost("acting-first-ugc");
const link = "text-text underline decoration-white/30 underline-offset-4";

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "why-acting-comes-first", label: "Why acting comes first" },
  { id: "what-acting-means", label: "What does acting mean in a UGC video?" },
  { id: "what-it-did", label: "What did it do for our students?" },
  { id: "what-we-skip", label: "What do we skip so acting gets the time?" },
];

const faqs: FaqItem[] = [
  {
    question: "What do you mean by acting?",
    answer:
      "Delivery on camera: tone, pacing, facial expressions, posture, and believing the line. The creator plays the person the viewer already is, like a student who froze on an exam.",
  },
  {
    question: "Do creators write their own scripts?",
    answer:
      "No. Scripts and formats are written for the campaign and every creator gets the same ones. Our core team of four approves every script and video before it posts.",
  },
  {
    question: "Are the student numbers typical?",
    answer:
      "No. They are our best cases from the Student Interviews playlist, and some of the totals include pending payouts. Each one links to the full interview so you can check the number yourself.",
  },
  {
    question: "How are creators trained?",
    answer:
      "Every creator finishes a two-week paid trial before touching a brand account. We keep the top 1% of applicants and coach them every week.",
  },
];

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className={link} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function ActingFirstPage() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        Every creator on a campaign gets the same script, the same format, and the same brief. Two of them can post it on the same day and one gets 1,000 views while the other gets a million. The script didn&apos;t change. The delivery did.
      </p>
      <p>
        That is why acting is the first thing we train, ahead of filming tricks, captions, or how many deals a creator can stack. Below is what that means in practice, and six students from our{" "}
        <Out href="https://www.youtube.com/playlist?list=PLUE-BBDtNWPYn87q5dsZ5R-eoM8GVEBmY">Student Interviews</Out>{" "}
        who show what it does.
      </p>

      <H2 id="why-acting-comes-first">Why acting comes first</H2>
      <p>
        A creator on one of our campaigns does not ideate, write hooks, or invent formats. That work is done before they press record. What is left is the part only they can do: say the line like they mean it.
      </p>
      <p>
        I say the same thing in almost every student interview:{" "}
        <Out href="https://www.youtube.com/watch?v=LRxsDH78coI&t=1739s">acting is literally everything</Out>
        , because it is the one thing a creator can control. On Zane&apos;s call I put it as plainly as I can: how do you scale? You go viral. How do you go viral?{" "}
        <Out href="https://www.youtube.com/watch?v=LRxsDH78coI&t=1839s">Act.</Out>
      </p>
      <p>
        For a brand, this is the whole point. The viewer does not see your script. They see a face, hear a voice, and decide in a second whether this person has lived the problem. If they believe the person, they stay, comment, and install. If they don&apos;t, nothing else in the video matters.
      </p>

      <H2 id="what-acting-means">What does acting mean in a UGC video?</H2>
      <p>Not drama. Not a performance voice. It means:</p>
      <ol className="list-decimal space-y-4 pl-5">
        <li>
          <strong>Becoming the persona.</strong> For a study tool, the creator is a student who is actually struggling. For a money app, they are someone who actually made the money. If the creator doesn&apos;t believe the line, the viewer won&apos;t either.
        </li>
        <li>
          <strong>Real expressions, not random ones.</strong> Faces that match what is being said. A little exaggeration is fine. Expressions that don&apos;t fit the line read as fake.
        </li>
        <li>
          <strong>Tone and pacing.</strong> Casual, not salesy. Someone sharing a secret, not reading an ad.
        </li>
        <li>
          <strong>Reps and review.</strong> Creators rewatch their own videos, study what went viral and why, and get line-level coaching every week.
        </li>
      </ol>
      <p>
        The same idea runs through{" "}
        <Link className={link} href="/blog/text-on-screen-ugc">
          why text-on-screen stalls
        </Link>{" "}
        and{" "}
        <Link className={link} href="/blog/ugc-for-ai-startups">
          why talking-head beats a product demo
        </Link>
        . A caption can&apos;t make anyone feel understood. A person can, if they can act.
      </p>

      <H2 id="what-it-did">What did it do for our students?</H2>
      <p>
        These are our best cases, not averages. Numbers are what students said or showed on screen in the interview, and pending payouts are labeled.
      </p>
      <p>
        <strong>Enya: about $19K from one deal in one month.</strong> Before joining, Enya was stacking low-pay deals. On one premium campaign she hit about 7 million views with four videos over a million, and showed{" "}
        <Out href="https://www.youtube.com/watch?v=QUkXvd6Ooz8&t=460s">$10,780 paid and $8,170 pending</Out>{" "}
        for the month, working around{" "}
        <Out href="https://www.youtube.com/watch?v=R10yXRXnlq8&t=471s">10 hours a week</Out>
        . What changed was her{" "}
        <Out href="https://www.youtube.com/watch?v=QUkXvd6Ooz8&t=335s">delivery</Out>
        : facial expressions, conviction in her voice, and studying how top creators presented themselves. When she reposted the same video, it hit the same views again.{" "}
        <Out href="https://www.youtube.com/watch?v=R10yXRXnlq8">Full interview</Out>
      </p>
      <p>
        <strong>Justin Nguyen: on pace for $19K from one deal.</strong> Justin was a tax accountant who made $800 in his first month of UGC. On one premium campaign he got{" "}
        <Out href="https://www.youtube.com/watch?v=XzRdlHdXboA&t=400s">5.2 million views in about two weeks</Out>{" "}
        and was{" "}
        <Out href="https://www.youtube.com/watch?v=XzRdlHdXboA&t=437s">on pace for $19K that month</Out>{" "}
        from that deal alone, with{" "}
        <Out href="https://www.youtube.com/watch?v=XzRdlHdXboA&t=841s">44 unique videos</Out>
        . Base pay alone would have taken roughly 360 videos to reach the same number.
      </p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;I didn&apos;t think I&apos;d be good on camera at all. But it&apos;s just literally something you work on every single day.&rdquo;</p>
        <p>
          <Out href="https://www.youtube.com/watch?v=XzRdlHdXboA&t=1642s">Justin Nguyen</Out>, former tax accountant
        </p>
      </blockquote>
      <p>
        <strong>Catherine: from about $5K to $6K a month to about $19K in her first month.</strong> Catherine was already doing UGC when she joined. About a month later she was at{" "}
        <Out href="https://www.youtube.com/watch?v=RF5LmAeFKf4&t=24s">roughly $18K to $19K</Out>
        , and her top video hit{" "}
        <Out href="https://www.youtube.com/watch?v=RF5LmAeFKf4&t=273s">3.7 million views</Out>
        . Her method is the one we teach:{" "}
        <Out href="https://www.youtube.com/watch?v=RF5LmAeFKf4&t=719s">rewatch yourself</Out>
        , because what you think you copied often did not come across that way.
      </p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;Even when I&apos;m eating, I&apos;m practicing.&rdquo;</p>
        <p>
          <Out href="https://www.youtube.com/watch?v=RF5LmAeFKf4&t=676s">Catherine</Out>, on her first month
        </p>
      </blockquote>
      <p>
        <strong>Zane: a 7.5 million view video, then he quit his job.</strong> Zane&apos;s breakout was a{" "}
        <Out href="https://www.youtube.com/watch?v=LRxsDH78coI&t=1193s">7.5 million view video</Out>
        , and he kept repeating the format to more million-view hits. His explanation was about voice, not editing: he spoke{" "}
        <Out href="https://www.youtube.com/watch?v=LRxsDH78coI&t=1423s">casually instead of selling</Out>
        . He made{" "}
        <Out href="https://www.youtube.com/watch?v=LRxsDH78coI&t=2731s">about $8,000</Out>{" "}
        the month that format took off, and left his job. By the time we recorded, his deals added up to about $17K a month in base pay{" "}
        <Out href="https://www.youtube.com/watch?v=LRxsDH78coI&t=2836s">before bonuses</Out>
        . <Out href="https://www.youtube.com/watch?v=LRxsDH78coI">Full interview</Out>
      </p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;It&apos;s very important to just tap into that actor kind of state when you&apos;re recording.&rdquo;</p>
        <p>
          <Out href="https://www.youtube.com/watch?v=LRxsDH78coI&t=1682s">Zane</Out>
        </p>
      </blockquote>
      <p>
        <strong>Will: his first $1,000 in his first week, $50K+ in payouts within about three months.</strong> Will had tried dropshipping, Amazon FBA, and other mentorships before. He made his{" "}
        <Out href="https://www.youtube.com/watch?v=BW0U1zDF7K4&t=132s">first $1,000 in his first week</Out>
        . Adding up his payouts on screen about three months in, paid and pending, he put the total at{" "}
        <Out href="https://www.youtube.com/watch?v=BW0U1zDF7K4&t=614s">&ldquo;50s at least,&rdquo;</Out>{" "}
        including $12K earned and $10K pending from one campaign. The $48K a month in the video title is his projection if he hits base on every deal, not cash collected.
      </p>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;The hardest thing about UGC is like, you know, just acting, you know, becoming the persona you&apos;re trying to portray in your videos.&rdquo;</p>
        <p>
          <Out href="https://www.youtube.com/watch?v=BW0U1zDF7K4&t=1684s">Will</Out>
        </p>
      </blockquote>
      <p>
        <strong>Lukas: about $12K to $13K a month, in two languages.</strong> Lukas is a 20-year-old creator from Germany who worried his accent would hold him back. Instead, one client had him make videos in German, where he says he can{" "}
        <Out href="https://www.youtube.com/watch?v=sPrdv9963rU&t=245s">bring over more emotions</Out>{" "}
        than in English. He told us he was on track for about{" "}
        <Out href="https://www.youtube.com/watch?v=sPrdv9963rU">$12K to $13K</Out>{" "}
        a month. Delivery mattered more than a perfect accent.
      </p>
      <p>
        One note on the playlist: Daniel Yun, known as Kimchi, started as a student and{" "}
        <Out href="https://www.youtube.com/watch?v=IsjRRM8d6n4&t=266s">hit a $30K month</Out>{" "}
        and became one of our campaign leads. He is now our co-founder and COO, so we don&apos;t count his numbers as a typical student outcome.
      </p>

      <H2 id="what-we-skip">What do we skip so acting gets the time?</H2>
      <ul className="list-disc space-y-4 pl-5">
        <li>
          <strong>Filming tricks.</strong> Lighting gets fixed early, like it did for{" "}
          <Out href="https://www.youtube.com/watch?v=SaYPXjv3-DU&t=534s">Richard</Out>
          . After that, real expressions are the{" "}
          <Out href="https://www.youtube.com/watch?v=R10yXRXnlq8&t=668s">key difference</Out>{" "}
          between a 1K-view video and a million.
        </li>
        <li>
          <strong>Text on screen.</strong> A caption explains the product. A person makes the viewer feel seen. We don&apos;t teach captions as the main event.
        </li>
        <li>
          <strong>Stacking low-pay deals.</strong> Five weak deals means hundreds of rushed videos. One deal and ten extra minutes perfecting a single video can do more. Enya and Justin both did it on one campaign.
        </li>
      </ul>
      <blockquote className="border-l border-white/20 pl-4">
        <p>&ldquo;If you treat UGC like an art form and you truly learn the skill of acting, you will go viral.&rdquo;</p>
        <p>
          <Out href="https://www.youtube.com/watch?v=QUkXvd6Ooz8&t=355s">Thienvu Vo</Out>, Student Interviews
        </p>
      </blockquote>
      <p>
        Watch all the interviews on the{" "}
        <Out href="https://www.youtube.com/playlist?list=PLUE-BBDtNWPYn87q5dsZ5R-eoM8GVEBmY">Student Interviews playlist</Out>
        , then ask us how we coach the creators who would run your campaign.
      </p>
      <p>
        <a className={link} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
          Book a 30-min fit call
        </a>
      </p>
      <p>
        Related:{" "}
        <Link className={link} href="/blog/text-on-screen-ugc">
          Why text-on-screen UGC is killing your app growth
        </Link>
        {" · "}
        <Link className={link} href="/blog/ugc-for-ai-startups">
          UGC for AI startups
        </Link>
        {" · "}
        <Link className={link} href="/blog/questions-before-hiring-a-ugc-agency">
          12 questions to ask before hiring a UGC agency
        </Link>
      </p>
    </Article>
  );
}
