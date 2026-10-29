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
  { id: "what-does-it-cost", label: "What does a managed UGC program cost?" },
  { id: "what-is-a-retainer", label: "What is a retainer actually paying for?" },
  { id: "how-is-per-video-different", label: "How is per-video pricing different?" },
  { id: "how-is-cpm-different", label: "How is CPM different from a program?" },
  { id: "what-does-50k-cover", label: "What does $50K a month cover here?" },
  { id: "what-is-billed-separately", label: "What is billed on top of the retainer?" },
  { id: "why-90-days-and-no-refund", label: "Why 90 days, and why no refund?" },
  { id: "when-is-this-the-wrong-buy", label: "When is this the wrong purchase?" },
];

const faqs: FaqItem[] = [
  {
    question: "How much does a Vo Creations campaign cost?",
    answer:
      "Campaigns start at $50K a month. That is the program fee. Creator bonuses are billed separately each month, on top of that base. There are no refunds.",
  },
  {
    question: "Is there a contract longer than 90 days?",
    answer:
      "We ask for a 90-day minimum so accounts can warm up and a few testing cycles can find the format. After that the work is month to month. You are not locked into a long contract past the minimum.",
  },
  {
    question: "What do creator bonuses cover?",
    answer:
      "Creator bonuses are the pay that goes to the people making the videos, billed separately from strategy and management. The split exists so you can see which dollars pay the operators and which dollars pay the creators.",
  },
  {
    question: "Do you publish a per-video rate card?",
    answer:
      "No. The offer is a managed month, not a menu of clips. Per-video pricing is a different model, and we do not quote a market rate for it because those numbers move and are not our product.",
  },
  {
    question: "Does the $50K include paid ad spend?",
    answer:
      "The retainer is the program: creators, training, approved videos, and the organic posting. Paid media is a later decision, made with creative that has already earned attention. Do not assume the monthly fee is also your ad budget.",
  },
  {
    question: "How many videos are in a month?",
    answer:
      "A campaign produces 2,400+ videos a month. First posts go live within 10-14 days of kickoff. Volume is the point of a roster, not a promise that every video will travel.",
  },
  {
    question: "What if the first month is quiet?",
    answer:
      "There are no refunds. The 90 days exist because warmup and testing do not finish in week one. If the fit is wrong after the minimum, you are month to month and can stop. You are not paid back for the months already run.",
  },
];

export default function ProgramCostPost() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        Pricing pages for UGC tend to do one of two unhelpful things. They hide the number, or they print a rate card that mixes a creator&apos;s fee, a usage license, and a promise about views. Those are three different purchases. This piece separates them, then says exactly what Vo Creations charges and what that charge is for.
      </p>
      <p>
        We will not invent a &quot;typical&quot; freelancer rate or a &quot;standard&quot; CPM. Those figures depend on the category, the license, and the year, and a blog post that states them as fact is usually guessing. Where a model has no single honest number, the description stays qualitative. Where we have our own number, it is stated in plain dollars.
      </p>

      <H2 id="what-does-it-cost">What does a managed UGC program cost?</H2>
      <p>
        At Vo Creations, campaigns start at $50K a month. Creator bonuses are billed separately, on top of that base. The minimum term is 90 days. After that the work is month to month. There are no refunds.
      </p>
      <p>
        That is the whole price architecture. The $50K is not a pile of videos with a unit price you can divide. It is the cost of running the program: recruiting, training, a campaign manager, approvals, posting, and the weekly decision about what to make next. The bonuses are the creators&apos; variable pay, kept on their own line so you can see them.
      </p>
      <p>
        If you need a smaller test, this is the wrong product. We say that on purpose. A managed roster for an AI startup or a consumer app is a serious operating expense. It should look like one.
      </p>

      <H2 id="what-is-a-retainer">What is a retainer actually paying for?</H2>
      <p>
        A retainer is a fee for a span of time, not for a count of assets. You are paying so that a team shows up every week with the same standard, whether last week&apos;s best video was obvious or not. The work that makes a channel is mostly the unglamorous part: killing the hooks that did not hold, recasting a story onto a better face, warming an account before it is asked to convert, and answering comments like a person who uses the product.
      </p>
      <p>
        Those tasks do not fit a per-video invoice cleanly. If you only pay when a file is delivered, nobody is paid to decide that the file should not exist. The retainer is how you buy that judgment. It is also how you buy availability. The manager is already in the account on Monday. You are not opening a new project every time you want ten more variations of the story that worked.
      </p>
      <p>
        A retainer can hide waste if the scope is vague. Ours is not a blank check for &quot;social.&quot; The scope is organic talking-head UGC, made by creators we trained, posted as the brand&apos;s program. Studio shoots, text-on-screen templates, and one-off launch films are a different engagement. If a proposal cannot name the format, the retainer is a fog machine.
      </p>

      <H2 id="how-is-per-video-different">How is per-video pricing different?</H2>
      <p>
        Per-video pricing buys a file. You agree on a length, a number of hooks, a round of notes, and a license. The creator or the marketplace delivers. You own a cut you can post or run as an ad, within whatever the license says.
      </p>
      <p>
        That is a clean buy when you already have a producer. Your team knows the story, knows the account, and needs more faces or more variations than it can shoot. Paying per video lets you add supply without hiring a department. The risk is that you become the department. Briefs, feedback, posting, and the postmortem all stay on your side, because none of them were in the unit price.
      </p>
      <p>
        Per-video pricing also trains the wrong argument. The conversation becomes &quot;how many videos did we get&quot; instead of &quot;which story should we repeat.&quot; A cheap video that teaches you nothing and an expensive video that becomes the only ad you need are not comparable units. If your dashboard is a count of files, you will optimize the count.
      </p>
      <p>
        We do not publish a per-video menu, and we will not borrow someone else&apos;s rate card and call it the market. If a partner quotes you per video, ask what is excluded: revisions, whitelisting, raw files, the right to run it as an ad, and any obligation to post it themselves. The headline price is the smallest part of that sentence.
      </p>

      <H2 id="how-is-cpm-different">How is CPM different from a program?</H2>
      <p>
        CPM is a price per thousand views. It shows up in two places. Paid media buys impressions. Some creator deals also pay a bonus when a video crosses a view line. Both uses share a trait: the invoice moves when the view counter moves.
      </p>
      <p>
        That can be a fair way to pay for distribution. It is a strange way to pay for a creative system. A video can be the right story and still take three weeks to find its audience. A video can rack up views from the wrong people and teach you nothing about installs. If the only number on the contract is CPM, you have bought attention, not a program that knows what to do with it.
      </p>
      <p>
        Organic and paid also get confused here. Our work starts organic. The videos have to earn the view before anyone talks about putting money behind them. A CPM you pay to force the view is a different sport. It can be the right sport later, once a story has already proved it can hold a person who was not targeted. It is a bad first contract if you still do not know which story that is.
      </p>
      <p>
        So when someone offers &quot;UGC at a $X CPM,&quot; treat the number as a media price, not as proof the creative system is cheap or expensive. We are not going to supply the X. Ask instead what happens on the days the video does not travel, and who is paid to make the next one smarter.
      </p>

      <H2 id="what-does-50k-cover">What does $50K a month cover here?</H2>
      <p>
        The $50K month is the in-house program. Concretely, that includes the operating pieces we already run in public:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Creator recruiting. People apply, interview, and finish a two-week paid trial before they touch a brand account. We keep the top 1%.</li>
        <li>A campaign manager and a strategy built for the product: audience, account warming, hooks, messaging, and comment replies. Nothing recycled from another client.</li>
        <li>Talking-head videos, approved before they go live, across TikTok, Instagram, YouTube, and Facebook. A campaign produces 2,400+ videos a month.</li>
        <li>First posts within 10-14 days of kickoff, then daily operation so nothing stalls waiting on a founder.</li>
        <li>A weekly call if you want one. More creative involvement if you want that. A light check-in if you would rather stay out of the cuts.</li>
        <li>The bridge from organic to ads: when a video has already earned attention, it is tested creative you can put spend behind. The retainer is not itself your media budget.</li>
      </ul>
      <p>
        The company is in New York, founded in 2025. The work is for AI startups and consumer apps. The public proof of scale we will put in a sentence is the one already on the site: 1B+ views generated, from a roster of 1000+ vetted in-house creators trained through mentorship. Named campaign breakdowns stay behind a call. They are not a line item you can download.
      </p>

      <H2 id="what-is-billed-separately">What is billed on top of the retainer?</H2>
      <p>
        Creator bonuses. Each month they are invoiced separately from the $50K base, so you can see what went to strategy and management and what went to the people on camera. That separation is the point. A single blended number makes a renewal argument impossible, because nobody can tell whether the program got more expensive or the creators earned more.
      </p>
      <p>
        Paid media is also outside the retainer. If you decide to run the winning organic videos as ads, that spend is a media decision, not a hidden part of the program fee. Usage questions, whitelisting, and anything that asks a creator to lend their own account are part of the bonus and licensing conversation, not a surprise inside the base.
      </p>
      <ArticleTable
        caption="Retainer, per-video, and CPM compared as different purchases"
        headers={["", "Retainer", "Per video", "CPM"]}
        rows={[
          ["What the invoice tracks", "A month of the program", "Each delivered file", "Every thousand views"],
          ["Who decides the next test", "The campaign manager, with you if you want in", "Whoever is managing the order", "Whoever is buying the views"],
          ["What compounds", "Accounts, comments, a library of tested stories", "A folder of cuts", "A media result, for as long as you pay"],
          ["What a quiet week means", "The team keeps posting and changing the test", "You may have paid for a file that did not travel", "The invoice shrinks, and so does the learning if nobody is paid to study it"],
          ["Honest fit", "You want the channel run", "You already have operators", "You are buying distribution of a story you trust"],
        ]}
      />

      <H2 id="why-90-days-and-no-refund">Why 90 days, and why no refund?</H2>
      <p>
        Creator accounts need time to warm up. A format needs more than one cycle before you know it is the format. None of that is visible in week one, which is when anxious buyers ask for their money back. We ask for 90 days because that is how long it takes to build the campaign and start scaling it as an in-house program, not as a one-off project.
      </p>
      <p>
        There are no refunds. There is also no long lock-in past the minimum. After 90 days the work is month to month. If it is genuinely not working, you are not waiting out a year to leave. You also do not get the months you already ran returned to you. The process has to prove itself every month after the minimum, not only at signing, and the fee for the months already delivered stays earned.
      </p>
      <p>
        Read that as a fit filter. If you need a refund clause to feel safe, you are not ready for a program that spends its first weeks on accounts that look quiet on purpose. Warmup is part of the work. Paying for it and then asking for it back is a request to skip the part that makes the later views possible.
      </p>

      <H2 id="when-is-this-the-wrong-buy">When is this the wrong purchase?</H2>
      <p>
        It is the wrong purchase if you want one video, a small test, or a founder who still plans to brief every creator personally. It is the wrong purchase if $50K a month is a stretch you would need to claw back. It is the wrong purchase if you want text-on-screen volume and a template. That is a different factory, and we wrote why we do not run it in{" "}
        <Link href="/blog/text-on-screen-ugc" className="text-text underline decoration-white/30 underline-offset-4">
          why text-on-screen UGC stalls
        </Link>
        .
      </p>
      <p>
        It is the right purchase if you want trained creators, organic talking-head video, and a team that manages the roster. The model comparison, including when a marketplace or a freelancer is the smarter buy, is in{" "}
        <Link href="/blog/in-house-ugc-vs-marketplace-vs-freelancers" className="text-text underline decoration-white/30 underline-offset-4">
          in-house agency vs marketplace vs freelancers
        </Link>
        . The questions to ask any agency, including us, are in{" "}
        <Link href="/blog/questions-before-hiring-a-ugc-agency" className="text-text underline decoration-white/30 underline-offset-4">
          12 questions to ask before you hire
        </Link>
        .
      </p>
    </Article>
  );
}
