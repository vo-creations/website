import Link from "next/link";
import Article, { ArticleTable, H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, getPost } from "@/lib/blog/posts";

const post = getPost("what-a-managed-ugc-program-costs");

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "what-are-you-paying-for", label: "What are the three prices actually for?" },
  { id: "what-did-distribution-cost", label: "What did distribution cost on our campaigns?" },
  { id: "what-is-inside-the-fee", label: "What is inside the fee, and what is not?" },
  { id: "what-if-a-month-is-quiet", label: "What if a month is quiet?" },
  { id: "how-to-read-the-invoice", label: "How do you read the invoice?" },
];

const faqs: FaqItem[] = [
  {
    question: "How much does a Vo Creations program cost?",
    answer:
      "Campaigns start at $50K+ a month, all-inclusive: trained creators, scripts, posting, creator bonuses, and weekly reporting. CPM means cost per 1,000 organic views. We guarantee your target CPM. Videos under 1,000 views do not count toward your CPM. Paid media, the ad spend, is outside the fee and billed on top. The minimum is 90 days, then month to month. No refunds after launch.",
  },
  {
    question: "Does 'under $3 CPM' mean every campaign lands there?",
    answer:
      "No. Under $3 CPM is a general claim about results, and CPM means cost per 1,000 organic views. We guarantee your target CPM. That is not a credit or a refund. The two results above are specific and anonymized: a consumer app at a $0.82 average CPM, and a finance app under $4. They are not a promise that the next app matches either figure.",
  },
  {
    question: "Do videos under 1,000 views count toward your CPM?",
    answer:
      "No. Videos under 1,000 views do not count toward the client's spend. The monthly fee still covers the program that made them.",
  },
  {
    question: "Is paid media included?",
    answer:
      "No. Paid media sits outside the monthly fee. The fee already includes trained creators, scripts, posting, creator bonuses, and weekly reporting. Putting money behind a video that already earned attention is a later decision.",
  },
  {
    question: "Why won't you print a freelancer rate card?",
    answer:
      "Because there isn't one honest number. A personal rate depends on the person, the license, and the job. Quoting a range here would be a guess, so the marketplace and freelancer rows stay qualitative.",
  },
  {
    question: "Where can I see who the apps were?",
    answer:
      "On a call. The view counts and CPMs above are Vo Creations results with the client left off. We do not attach names to specific results.",
  },
];

export default function ProgramCostPost() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        The number up top is the whole offer. Everything under it is what that number is not: a per-video menu, a guessed freelancer rate, or a CPM you can photocopy onto the next app.
      </p>

      <H2 id="what-are-you-paying-for">What are the three prices actually for?</H2>
      <ArticleTable
        caption="Retainer, per-video, and CPM as different purchases"
        headers={["", "Monthly program", "Per video", "CPM"]}
        rows={[
          ["The invoice tracks", "A month of operating the channel", "Each delivered file", "Views, per thousand"],
          ["Who decides the sequel", "The program", "Whoever hired the video", "Whoever is buying the views"],
          ["A quiet video", "Videos under 1,000 views do not count toward your CPM", "You may already have paid for the file", "The view line stays small"],
          ["Market rate", "Ours is stated above", "No single honest rate. It depends on the job and the license.", "A media price, not proof the creative system is cheap"],
        ]}
      />
      <p>
        If you already have operators and you need more faces, per-video is a clean buy. If you need one person and you will direct them, hire them. Neither of those is a program. The operating comparison is in{" "}
        <Link href="/blog/in-house-ugc-vs-marketplace-vs-freelancers" className="text-text underline decoration-white/30 underline-offset-4">
          in-house agency vs marketplace vs freelancers
        </Link>
        .
      </p>

      <H2 id="what-did-distribution-cost">What did distribution cost on our campaigns?</H2>
      <p>
        As a general claim, this kind of distribution can price under $3 CPM. These two are Vo Creations campaign results. The clients are anonymized. They are results, not the guarantee. The guarantee is the client&apos;s own target CPM.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>A consumer app: 174M+ total views at a $0.82 average CPM.</li>
        <li>A finance app: reached #3 in the US App Store Finance category, 3M+ users, at a sub-$4 CPM.</li>
      </ul>
      <p>
        Read them as outcomes of organic first: post a lot, see what people actually watch, and only put ad money behind what is already working. They are not a rate card for the next category, and they are not the app&apos;s media budget. We don&apos;t publish what a client spent.
      </p>

      <H2 id="what-is-inside-the-fee">What is inside the fee, and what is not?</H2>
      <p>
        The monthly fee is all-inclusive: trained creators, scripts, posting, creator bonuses, and weekly reporting. Paid media sits outside that fee. Putting money behind a video that already earned attention is a later decision.
      </p>
      <p>
        Videos under 1,000 views don&apos;t count toward your CPM. We guarantee your target CPM.
      </p>
      <p>
        Example, not a result. A creator films three openings in one sitting. Two barely travel. The third is the one people finish. The misses do not count toward your CPM. The third is the one worth repeating, and only then worth spending behind.
      </p>

      <H2 id="what-if-a-month-is-quiet">What if a month is quiet?</H2>
      <p>
        Warmup is part of the work, and it can look quiet on purpose. There are no refunds after launch. The minimum is 90 days, then month to month. If it is not working after that, you stop. You are not stuck in a long contract, and you are not paying backward for a month the team already spent.
      </p>
      <p>
        If you need the fee returned whenever week two feels slow, this is the wrong product. A smaller test wants a freelancer or a per-video order, not this engagement.
      </p>

      <H2 id="how-to-read-the-invoice">How do you read the invoice?</H2>
      <p>
        One number. It includes trained creators, scripts, posting, creator bonuses, and weekly reporting. If a renewal goes up, someone should be able to say which job got heavier.
      </p>
      <p>
        Example invoice note, not a result: &quot;March program, all-inclusive. Two videos stayed under 1,000 views and did not count toward the CPM.&quot; You can audit that sentence. You cannot audit &quot;content package, as discussed.&quot;
      </p>
      <p>
        One more qualitative trap on per-video work: revisions. A cheap file with unlimited notes is often your team doing the edit in writing. Ask how many rounds are in the price, and what a new hook costs after delivery. I am not going to invent the dollar figure. The shape of the answer tells you whether you bought a finished video or a starting point.
      </p>
      <p>
        How to read the two results without turning them into a menu: the consumer app tells you views and the average CPM together. The finance app tells you a store rank, users, and a CPM band. Neither line includes what the client spent on media, and neither is a quote for a different category. If someone sells you &quot;the same CPM,&quot; ask which of those sentences they are copying. A copied CPM with no window and no category is not a result.
      </p>
      <p>
        On a per-video buy, the number that matters is the license, and I won&apos;t invent a dollar range for it. Ask, in one sentence, what they may do with the file and for how long: post it on their account, run it as an ad, or both, and whether that permission ends. A price with no window is a price for keeping the video. That question is the whole negotiation. The filming is the smaller part.
      </p>
    </Article>
  );
}
