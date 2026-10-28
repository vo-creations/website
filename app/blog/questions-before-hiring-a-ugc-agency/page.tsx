import type { Metadata } from "next";
import Link from "next/link";
import Article, { ArticleTable, H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { getPost, postUrl } from "@/lib/blog/posts";

const post = getPost("questions-before-hiring-a-ugc-agency");

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
  { id: "what-are-you-hiring-them-to-own", label: "What are you hiring them to own?" },
  { id: "what-to-ask-about-creators", label: "What should you ask about the creators?" },
  { id: "what-to-ask-about-the-videos", label: "What should you ask about the videos?" },
  { id: "what-to-ask-about-the-money", label: "What should you ask about the money?" },
  { id: "what-to-ask-about-proof", label: "What should you ask about proof?" },
  { id: "the-twelve-questions", label: "What are the 12 questions?" },
  { id: "how-to-read-the-answers", label: "How should you read the answers?" },
];

const faqs: FaqItem[] = [
  {
    question: "What is the single most useful question?",
    answer:
      "Who does the work after the video is delivered? If the agency cannot name the person who watches the comments and decides the next test, you are hiring a production vendor, not a program.",
  },
  {
    question: "Should I ask for a rate per video?",
    answer:
      "Ask what the price is for, not for a unit you may not want. A managed program is a month. A file shop is a video. Those answers should not be forced into the same rate card.",
  },
  {
    question: "How does Vo Creations answer the price question?",
    answer:
      "Campaigns start at $50K a month. Creator bonuses are billed separately. The minimum is 90 days, then month to month. There are no refunds.",
  },
  {
    question: "What should they say about training?",
    answer:
      "A clear answer describes a filter: how someone gets in, what they have to do before they post for you, and what 'good' means. 'We have a network' is not a training answer.",
  },
  {
    question: "Can I see case studies first?",
    answer:
      "You can ask. On our site, named results stay behind a booking call. A public page of unnamed screenshots is not the same thing as a walkthrough of what was posted and by whom.",
  },
  {
    question: "What if they will not answer the term and refund questions?",
    answer:
      "Treat that as the answer. A minimum, a way to leave after it, and a clear refund policy are basic. If they are fuzzy, the rest of the proposal is theater.",
  },
  {
    question: "Are these questions only for agencies?",
    answer:
      "Use them on marketplaces and freelancers too. The point is to see which jobs bounce back onto your team. The model comparison is the companion to this list.",
  },
  {
    question: "Who wrote this list?",
    answer:
      "Thienvu Vo, co-founder of Vo Creations, an in-house UGC agency in New York founded in 2025 with Daniel Yun. The answers we give about ourselves are the public operating facts, not a pitch deck of client names.",
  },
];

export default function HiringQuestionsPost() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        Most UGC pitches are a tour of other people&apos;s videos. That tour feels like diligence and answers almost nothing. You can watch ten great clips and still not know who trained the creator, who posts tomorrow, or what you are allowed to do when the month is quiet. The questions below are the ones that survive the tour.
      </p>
      <p>
        They are written for a founder hiring an agency, and they are also the questions we expect to be asked. Vo Creations is an in-house UGC agency for AI startups and consumer apps, founded in 2025 in New York by Thienvu Vo and Daniel Yun. Where we have a public answer, it is included. Where the honest answer is &quot;that depends, and anyone quoting a universal number is guessing,&quot; the piece says that instead of inventing one.
      </p>

      <H2 id="what-are-you-hiring-them-to-own">What are you hiring them to own?</H2>
      <p>
        Start here, before format and price. A UGC engagement can own three different things: a file, a person, or a channel. A file is a video you can post. A person is a creator you can call again. A channel is the ongoing mess of accounts, comments, tests, and the decision about what to make next. Agencies use the word &quot;program&quot; for all three. Make them pick.
      </p>
      <p>
        If they own a file, your team still owns the channel. If they own a person, you still own the system that person works inside. If they own the channel, you should be able to take a week off without the posting stopping. Ask who is on the hook on a Wednesday when you do not reply. The name, or the absence of a name, is the product.
      </p>
      <p>
        Write your own sentence before the call: &quot;We need someone to run organic talking-head video so our team does not.&quot; Or: &quot;We need ten files for ads we already know how to buy.&quot; Those are both legitimate. They are not the same hire. Bringing the second sentence to a program pitch, or the first sentence to a marketplace, is how the relationship goes sour in month two.
      </p>

      <H2 id="what-to-ask-about-creators">What should you ask about the creators?</H2>
      <p>
        &quot;How many creators do you have&quot; is a vanity question. A large pool you cannot describe is a spreadsheet. Ask how someone gets in, what they have to survive before they post for a brand, and what happens if they are wrong for the product.
      </p>
      <p>
        A useful answer has a filter with time in it. At Vo Creations, creators apply, interview, and finish a two-week paid trial before they touch a brand account. We keep the top 1%. That is a specific filter. &quot;We work with top creators&quot; is not. You want to hear the step where a person can fail.
      </p>
      <p>
        Then ask who they look like. An AI product and a consumer app do not want a generic host. The creator has to be someone the user could be. If the agency casts from a single house style, your category will be played by an actor. Casting is the strategy. Treat a vague cast as a vague strategy.
      </p>
      <p>
        Ask what training means after they are in. A brief is not training. Training is a shared standard for the story, the first line, and how the product is allowed to appear. If every creator is inventing the format, you do not have a program. You have parallel freelancers with a logo on the invoice.
      </p>

      <H2 id="what-to-ask-about-the-videos">What should you ask about the videos?</H2>
      <p>
        Ask for the format in one sentence they would be embarrassed to waffle on. Ours is: a creator looks into the camera and tells a story the audience has lived, and the product shows up inside that story. No studio. No text-on-screen template. No script that sounds like a script. If an agency cannot be that plain, they will sell you whatever the last client liked.
      </p>
      <p>
        Ask who approves, and when. Every script and video we ship is approved before it goes live. That is slower than &quot;creators just post,&quot; and it is the point. Unapproved volume is how a brand voice dies in public. You want a yes on approval, and you want to know whether approval is a bottleneck you personally have to clear. Most of our brands do a weekly call. Some want more creative control. Some check in and leave the cuts alone. The wrong answer is &quot;it depends, we&apos;ll figure it out,&quot; because that means you are the process.
      </p>
      <p>
        Ask where the video lives. Organic accounts on TikTok, Instagram, YouTube, and Facebook are a different asset from a file dropped in Slack. Ask who replies to comments. Ask what a winning video becomes. In our program, a video that has already earned attention is the creative you can later put spend behind. If they have no theory of what happens after the post, they are a production shop.
      </p>
      <p>
        Ask about volume without turning it into a contest. A campaign here produces 2,400+ videos a month. That number is a description of a roster, not a promise that thousands of videos will each become a hit. Anyone who sells volume as a guarantee of outcomes is skipping the part where most tests exist to be discarded.
      </p>

      <H2 id="what-to-ask-about-the-money">What should you ask about the money?</H2>
      <p>
        Ask for the shape of the price before the size of the price. Is this a month, a video, or a cost per thousand views? Those are different products. We charge a month. Campaigns start at $50K. The{" "}
        <Link href="/blog/what-a-managed-ugc-program-costs" className="text-text underline decoration-white/30 underline-offset-4">
          cost breakdown
        </Link>{" "}
        explains why we will not pretend there is one market CPM or one freelancer rate.
      </p>
      <p>
        Ask what sits outside the number. Creator bonuses here are billed separately, every month, on top of the base. That is deliberate. You should see management and creator pay as different lines. If an agency blends them, you cannot tell whether a renewal got more expensive because the work grew or because the people on camera earned more.
      </p>
      <p>
        Ask the term and the exit in the same breath. We ask for 90 days. Accounts need to warm up, and a format needs more than one cycle. After that it is month to month. There are no refunds. You are not stuck in a long contract, and you are not paid back for a month that felt slow. Both halves matter. A minimum with no end is a trap. A refund clause that covers warmup is a request to skip the work.
      </p>
      <p>
        Ask what the fee does not buy. Paid media is not the retainer. One-off films are not the retainer. A small test budget is not this product. If $50K a month is money you would need back if week two looks quiet, do not start.
      </p>

      <H2 id="what-to-ask-about-proof">What should you ask about proof?</H2>
      <p>
        Ask what they will show you, and what they will not. We will talk about method in public: trained creators, organic talking-head, 1B+ views generated, 500+ creators trained, first posts in 10-14 days. Named campaign results stay behind a call. The cards on the site are blurred on purpose. A competitor&apos;s page of client logos is not automatically better evidence. It is a different disclosure choice, and you should still ask what was posted, on which accounts, and who ran it.
      </p>
      <p>
        Ask them to separate their proof from a borrowed screenshot. A view count with no account, no dates, and no description of the format is a mood. You can enjoy the mood and still not hire it. If they cannot walk through one campaign without hiding behind an NDA for every ordinary operating fact, assume the operating facts are thin.
      </p>
      <p>
        Ask who the work is not for. A straight answer is a good sign. We are not for one-off videos or small budgets. We are for AI startups and consumer apps that want the program run in-house. If an agency claims it is for everyone, the delivery will be a template, because templates are the only way to serve everyone.
      </p>

      <H2 id="the-twelve-questions">What are the 12 questions?</H2>
      <p>
        Take this into the call. The middle column is why the question exists. The last column is the shape of a clear answer, not a script. Our own public answer is in the sections above wherever we have one.
      </p>
      <ArticleTable
        caption="Twelve questions to ask before hiring a UGC agency"
        headers={["Question", "Why it matters", "A clear answer sounds like"]}
        rows={[
          ["Do you train creators, or only source them?", "A contact list is not a standard.", "A filter with time in it, including how someone fails."],
          ["Who posts, and on which accounts?", "A file and a channel are different assets.", "Organic accounts, a file for your ads team, or the creator's own handle. Named, not blended."],
          ["Is the work talking-head, text-on-screen, or a demo?", "Format is the strategy.", "One sentence you could put on a brief without translating it."],
          ["How many videos, and who approves them?", "Volume without approval is a brand risk. Approval without an owner is a bottleneck.", "A monthly output and a named approver who is not you by default."],
          ["When is the first post?", "Speed and patience are both real.", "A start date, plus the period they refuse to be judged inside."],
          ["What happens if a creator is wrong for the product?", "Rosters drift.", "A way to stop using that person without restarting the whole contract."],
          ["What is the minimum term, and how do we leave?", "Warmup needs a floor. You need a door.", "A minimum, then a simple way to stop. No fog."],
          ["What is inside the fee?", "Retainers hide scope.", "The jobs included: recruiting, training, posting, iteration. And the jobs excluded."],
          ["Are creator bonuses separate from management?", "Blended invoices make renewals impossible to read.", "Two lines. You can point at each."],
          ["Do you refund a slow month?", "Refunds and warmup fight each other.", "A yes or a no. Not a vibe."],
          ["What proof will you actually walk through?", "Screenshots are not a method.", "A campaign you can discuss, or a clear statement that names stay private until a call."],
          ["Who is this not for?", "A vendor for everyone will template the work.", "A category, a budget floor, and a format they will not fake."],
        ]}
      />

      <H2 id="how-to-read-the-answers">How should you read the answers?</H2>
      <p>
        Listen for nouns. A campaign manager, a two-week trial, a weekly call, a separate bonus line, a 90-day floor. Nouns can be checked. Adjectives cannot. &quot;Premium,&quot; &quot;viral,&quot; &quot;full service,&quot; and &quot;AI-powered&quot; are how a thin operation survives a first call.
      </p>
      <p>
        Listen for the job that bounces back to you. Every time the answer is &quot;you&apos;ll have a dashboard,&quot; add that task to your team&apos;s week and price the hire again. A marketplace can be the right tool once you see that bounce. A freelancer can be the right tool when the bounce is &quot;you will direct this one person.&quot; An in-house agency is the right tool when the bounce is small. The full comparison is in{" "}
        <Link href="/blog/in-house-ugc-vs-marketplace-vs-freelancers" className="text-text underline decoration-white/30 underline-offset-4">
          in-house agency vs marketplace vs freelancers
        </Link>
        .
      </p>
      <p>
        Listen for format. If you are an AI startup, &quot;we&apos;ll make content&quot; is not enough. You need talking-head stories with the product inside them, not a tour of the interface. That argument is in{" "}
        <Link href="/blog/ugc-for-ai-startups" className="text-text underline decoration-white/30 underline-offset-4">
          why talking-head video beats a product demo
        </Link>
        . If they light up only when you mention text on screen, you already know the answer.
      </p>
      <p>
        Then decide with the price shape, not against it. A $50K month is a lot for a folder and a bargain for a channel you no longer have to staff. Those are not close. The questions exist so you can tell which one you were just offered.
      </p>
    </Article>
  );
}
