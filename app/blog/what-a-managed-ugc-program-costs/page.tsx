import type { Metadata } from "next";
import Link from "next/link";
import Article, { ArticleTable, H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { getPost, postUrl } from "@/lib/blog/posts";

const post = getPost("what-a-managed-ugc-program-costs");

export const metadata: Metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: post.title,
    description: post.description,
    url: postUrl(post.slug),
    type: "article",
    publishedTime: `${post.datePublished}T00:00:00Z`,
    modifiedTime: `${post.dateModified}T00:00:00Z`,
  },
};

const toc: TocItem[] = [
  { id: "what-are-you-paying-for", label: "What are the three prices actually for?" },
  { id: "what-did-distribution-cost", label: "What did distribution cost on our campaigns?" },
  { id: "what-is-outside-the-fee", label: "What sits outside the monthly fee?" },
  { id: "what-if-a-month-is-quiet", label: "What if a month is quiet?" },
  { id: "how-to-read-the-invoice", label: "How do you read the invoice?" },
];

const faqs: FaqItem[] = [
  {
    question: "How much does a Vo Creations program cost?",
    answer:
      "Campaigns start at $50K a month for a 90-day engagement. Creator bonuses are billed separately. A month that has already been run is not refunded. After the opening term the work is month to month, so you can stop without waiting out a long contract.",
  },
  {
    question: "Does 'under $3 CPM' mean every campaign lands there?",
    answer:
      "No. It is the general claim for how this distribution can price. The two results below are specific and anonymized: a consumer app at a $0.82 average CPM, and a finance app under $4. They are not a promise that the next app matches either figure.",
  },
  {
    question: "What does 'videos under 1,000 views are free' mean?",
    answer:
      "A video that never clears 1,000 views is not something you pay a view bonus on. You still paid for the program that made it. The free part is the miss, not the month.",
  },
  {
    question: "Is paid media included?",
    answer:
      "No. The fee is the program and the organic posting. Putting money behind a video that already earned attention is a later decision, and it is not hidden inside the monthly number.",
  },
  {
    question: "Why won't you print a freelancer rate card?",
    answer:
      "Because there isn't one honest number. A personal rate depends on the person, the license, and the job. Quoting a range here would be a guess, so the marketplace and freelancer rows stay qualitative.",
  },
  {
    question: "Where can I see who the apps were?",
    answer:
      "On a call. The view counts and CPMs above are Vo Creations results with the client left off. We don't publish the name, the logo, or what they spent.",
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
          ["A quiet video", "The team keeps posting", "You may already have paid for the file", "The view line stays small"],
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
        As a general claim, this kind of distribution can price under $3 CPM. These two are Vo Creations campaign results. The clients are anonymized.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>A consumer app: 174M+ total views at a $0.82 average CPM.</li>
        <li>A finance app: reached #3 in the US App Store Finance category, 3M+ users, at a sub-$4 CPM.</li>
      </ul>
      <p>
        Read them as outcomes of organic first: post a lot, see what people actually watch, and only put ad money behind what is already working. They are not a rate card for the next category, and they are not the app&apos;s media budget. We don&apos;t publish what a client spent.
      </p>

      <H2 id="what-is-outside-the-fee">What sits outside the monthly fee?</H2>
      <p>
        Creator bonuses, on their own line, so management and the person on camera don&apos;t blur together. Paid media, if you later run a video that already held attention. And the miss: videos under 1,000 views are free. You are not paying a view bonus on a clip that never traveled. You are paying for the month that kept testing.
      </p>
      <p>
        Illustrative example, not a result. A creator films three openings in one sitting. Two barely travel. The third is the one people finish. The misses don&apos;t generate a view bill. The third is the one worth repeating, and only then worth spending behind. You can see the rule without turning every quiet clip into a debate about the monthly fee.
      </p>

      <H2 id="what-if-a-month-is-quiet">What if a month is quiet?</H2>
      <p>
        Warmup is part of the work, and it can look quiet on purpose. We don&apos;t refund a month that has already been run. That is the fee for the posting, the coaching, and the tests, including the ones that didn&apos;t travel. After the opening term you are month to month. If it is not working, you stop. You are not stuck in a long contract, and you are not paying backward for a month the team already spent.
      </p>
      <p>
        If you need the fee returned whenever week two feels slow, this is the wrong product. A smaller test wants a freelancer or a per-video order, not this engagement.
      </p>

      <H2 id="how-to-read-the-invoice">How do you read the invoice?</H2>
      <p>
        Two lines, every month. One is the program. One is the creator bonuses. If a renewal goes up, you should be able to see which line moved. A blended number makes that argument impossible: you cannot tell whether the operation got heavier or the people on camera earned more.
      </p>
      <p>
        Bonuses are not a surprise fee for existing. They are the variable pay for the work that traveled, kept off the base so the base stays readable. Ask what triggers one before you sign, in words a finance lead can repeat: a view threshold, a usage window, a creator lending their own account. If the answer is &quot;we&apos;ll see,&quot; you will relitigate it in month two.
      </p>
      <p>
        Illustrative invoice note, not a result: &quot;March program. Creator bonuses: two videos cleared the view rule and one usage extension.&quot; You can audit that sentence. You cannot audit &quot;content package, as discussed.&quot;
      </p>
      <p>
        A renewal conversation should start from those lines, not from a feeling that the month was &quot;a lot.&quot; If the bonus line moved because more videos traveled, that is the system working. If the program line moved, someone should be able to say which job got heavier. Write that question down before the first invoice, while everyone is still polite.
      </p>
      <p>
        One more qualitative trap on per-video work: revisions. A cheap file with unlimited notes is often your team doing the edit in writing. Ask how many rounds are in the price, and what a new hook costs after delivery. I am not going to invent the dollar figure. The shape of the answer tells you whether you bought a finished video or a starting point.
      </p>
      <p>
        Don&apos;t use the bonus line to relitigate a quiet test. The miss was already handled by the view rule. The bonus is for what traveled, or for a usage window you asked to extend. If those triggers were written down, the invoice is boring. Boring is the point.
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
