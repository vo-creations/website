import Link from "next/link";
import Article, { ArticleTable, H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, getPost } from "@/lib/blog/posts";

const post = getPost("questions-before-hiring-a-ugc-agency");

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "what-job", label: "What job are you hiring?" },
  { id: "the-twelve", label: "What are the 12 questions?" },
  { id: "how-an-answer-sounds", label: "How should an answer sound?" },
  { id: "what-proof-can-look-like", label: "What can proof look like without a name?" },
];

const faqs: FaqItem[] = [
  {
    question: "Which question matters if I only ask one?",
    answer:
      "Who reads the comments and decides the next video? If nobody has that job, you are buying files. Everything else is a detail on top of that.",
  },
  {
    question: "How do I tell coaching from a shared drive of briefs?",
    answer:
      "Ask what happened last Thursday. A coach can say which line was killed and why. A drive cannot. Weekly coaching means a person watched the account. A brief means a document went out.",
  },
  {
    question: "Should the creator be an influencer?",
    answer:
      "Not for this work. You want someone who could be the user and who actually uses the product. An audience they already own is a different purchase, and it changes who the viewer thinks is talking.",
  },
  {
    question: "What do I do with a view count and no account?",
    answer:
      "Treat it as a mood. Ask for the window, the category in plain words, and what was withheld. An anonymized result can still be specific. A screenshot with the name blurred and the context missing cannot.",
  },
  {
    question: "Where are price, term, and refunds answered?",
    answer:
      "In the pricing essay. This list is for spotting whether the operating answers are real. Price, term, and refunds are answered there.",
  },
  {
    question: "Can I use the hooks in this piece as the brief?",
    answer:
      "They are examples, so they are a shape, not your script. Swap in the mess your user actually has. If the line still works with the product name deleted, keep it. If it collapses, it was a pitch.",
  },
];

export default function HiringQuestionsPost() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        A pitch deck of other people&apos;s videos feels like diligence. It does not tell you who trains the creator, who posts, or who is allowed to kill a line. Ask the twelve questions. Listen for nouns.
      </p>

      <H2 id="what-job">What job are you hiring?</H2>
      <p>
        Write one sentence before the call. &quot;Run organic video so my team does not.&quot; Or &quot;Send ten files for ads we already know how to buy.&quot; Both are legitimate. They are not the same vendor. The{" "}
        <Link href="/blog/in-house-ugc-vs-marketplace-vs-freelancers" className="text-text underline decoration-white/30 underline-offset-4">
          model comparison
        </Link>{" "}
        is the longer version of that split. Price, term, and what a quiet month means live in the{" "}
        <Link href="/blog/what-a-managed-ugc-program-costs" className="text-text underline decoration-white/30 underline-offset-4">
          pricing essay
        </Link>
        .
      </p>

      <H2 id="the-twelve">What are the 12 questions?</H2>
      <ArticleTable
        caption="Twelve questions to ask before hiring a UGC agency"
        headers={["Question", "A clear answer has"]}
        rows={[
          ["Do you train people, or only source them?", "A step someone can fail, and a weekly coaching rhythm after they pass."],
          ["Who posts, and where?", "Named accounts on TikTok, Instagram, YouTube, Facebook, Snapchat, or a file you place yourself."],
          ["What is the format in one sentence?", "A face, a situation, the product as one turn. Not 'content'."],
          ["Who approves?", "A person who is not you by default."],
          ["When is the first post, and when will you not be judged?", "A start, and a window they refuse to call a verdict."],
          ["What if the creator is wrong?", "A way to stop using them without restarting the contract."],
          ["What is the minimum, and how do we leave?", "A floor, then a door. Said in one breath."],
          ["What is inside the fee?", "Jobs named, and jobs excluded."],
          ["Are creator bonuses inside the fee?", "Yes. One monthly fee covers them, with scripts, posting, and daily Slack reporting."],
          ["What happens to a video almost nobody watched?", "A plain rule, not a vibe."],
          ["What proof will you walk through?", "A window, a category, and what you will not publish."],
          ["Who is this not for?", "A budget, a format, or a job they will not pretend to do."],
        ]}
      />

      <H2 id="how-an-answer-sounds">How should an answer sound?</H2>
      <p>
        Nouns. A coach, a Thursday review, an account, a fee that already includes creator bonuses. &quot;Premium&quot; and &quot;full service&quot; are how a thin shop survives a first call.
      </p>
      <p>
        Example lines, not results. Reject: &quot;This AI tool is insane.&quot; Keep: &quot;I&apos;ve rewritten the first sentence twelve times and the meeting is in an hour.&quot; The second one still works if you delete the product. That is the test. More of those lines, for a study tool, a coding tool, and a writing tool, are in{" "}
        <Link href="/blog/ugc-for-ai-startups" className="text-text underline decoration-white/30 underline-offset-4">
          UGC for AI startups
        </Link>
        .
      </p>
      <p>
        If someone writes &quot;I do this every Sunday and still show up blank,&quot; a clear operator says the next video starts on Sunday night. A file shop sends another cut of the feature you already approved.
      </p>
      <p>
        Three of the twelve, heard out loud. Training: vague is &quot;we have a network.&quot; Clear is &quot;they can fail a trial, and a coach reviews last week&apos;s lines with them.&quot; Posting: vague is &quot;we distribute.&quot; Clear is a list of accounts, not a verb. Proof: vague is a logo slide. Clear is a window, a plain category, and a sentence about what they will not publish.
      </p>
      <p>
        Score the call in the notes app while you&apos;re still on it. One mark if you could name the person who owns Thursday. One mark if the format survived being said in a single sentence. One mark if they can say the monthly fee includes creator bonuses, scripts, posting, and daily Slack reporting. Zero on any of those and you are still shopping for a folder. The rest of the twelve are how you confirm the first three weren&apos;t a performance.
      </p>
      <p>
        Two answers I would not accept. &quot;Our creators are top tier&quot; does not say what they survived to get in, or who sits with them after the first post. &quot;We&apos;re fully organic and paid&quot; does not say which happens first. Organic first means you post, you see what people actually watch, and only then does money go behind a video. If they cannot put those steps in order, they will boost the tour.
      </p>
      <p>
        Bring a mess from your own product to the call, not a slogan. Ask them to say a first sentence back to you before the call ends. If they pitch the feature, you learned enough. If they find the hour, the score, or the bug, you are talking to someone who can be coached, and who can coach a roster. That thirty seconds tells you more than the logo slide.
      </p>
      <p>
        The last of the twelve is the one polite vendors dodge. Who is this not for? A useful answer names a job they will refuse: one-off videos, a team that wants to approve every line themselves, a format they don&apos;t shoot. A useless answer is &quot;we can flex.&quot; Flex is how you end up with a tour when you asked for a face. If they cannot stand next to a no, they will not kill a bad opening either.
      </p>
      <p>
        Leave the call with the twelve written in their words, not yours. Where they were specific, you have a contract to draft. Where they were warm and empty, you have a no. You do not need to be rude about it. You need the nouns.
      </p>
      <p>
        Write the proof answer in their syntax before you hang up. &quot;An AI app, a window, views, name withheld.&quot; Or &quot;a consumer app, total views, a cost per thousand, name withheld.&quot; If they cannot fill a sentence that plain, they were showing you a mood board. If they can, you still do not need the logo. You need the window and the category, and a promise about what stays off the public site.
      </p>
      <p>
        Then stop collecting questions. Twelve is enough to see the operation. A thirteenth is usually a way to delay the decision. Hire the team that had nouns, or don&apos;t. The format, the bench, and the fee are either real or they aren&apos;t. You will not find the missing noun by asking the same question in a softer voice. Write the gap down and end the call right now.
      </p>

      <H2 id="what-proof-can-look-like">What can proof look like without a name?</H2>
      <p>
        Vo Creations campaign result. The client is anonymized. An app: $968k ARR. That is a specific outcome with the name withheld. It is not a screenshot, and it is not a promise that the next app does the same thing. If a vendor cannot say the window, the plain category, and what they are refusing to publish, the number is a mood.
      </p>
    </Article>
  );
}
