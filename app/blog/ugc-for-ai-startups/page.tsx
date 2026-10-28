import type { Metadata } from "next";
import Link from "next/link";
import Article, { ArticleTable, H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { getPost, postUrl } from "@/lib/blog/posts";

const post = getPost("ugc-for-ai-startups");

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
  { id: "what-is-ugc-for-an-ai-startup", label: "What is UGC for an AI startup?" },
  { id: "why-do-demos-die", label: "Why do product demos die in a feed?" },
  { id: "what-talking-head-does", label: "What does talking-head video do that a demo cannot?" },
  { id: "where-the-product-appears", label: "Where does the product still need to appear?" },
  { id: "how-to-brief-a-creator", label: "How should an AI startup brief a creator?" },
  { id: "what-the-first-90-days-test", label: "What should the first 90 days test?" },
  { id: "when-a-demo-is-right", label: "When is a demo still the right cut?" },
];

const faqs: FaqItem[] = [
  {
    question: "What is UGC for an AI startup?",
    answer:
      "It is organic video made by a trained creator who talks like the user. The story is a situation the viewer has lived. The AI product shows up inside that story, not as a feature tour. Vo Creations runs this as an in-house program for AI startups and consumer apps.",
  },
  {
    question: "Why not lead with a product demo?",
    answer:
      "A demo asks a stranger to care about an interface before they care about a person. Most people swipe. A talking-head video starts with the problem, which is the only reason the interface matters.",
  },
  {
    question: "Does the product still get shown?",
    answer:
      "Yes. One flow, one outcome, the way you would show a friend. The demo is a beat inside the story. It is not the whole video, and it is not a caption over a screen recording.",
  },
  {
    question: "Is text-on-screen a cheaper version of the same idea?",
    answer:
      "No. Text-on-screen explains. Talking-head storytelling makes the viewer feel understood. They are different formats. We break that down in the essay on why text-on-screen stalls.",
  },
  {
    question: "How soon can an AI startup start posting?",
    answer:
      "First posts go live within 10-14 days of kickoff. We still ask for 90 days. Accounts need to warm up, and the winning story is rarely the first one you liked in the brief.",
  },
  {
    question: "Who should be on camera?",
    answer:
      "Someone who could be the user. A student for a study tool. A developer for a dev tool. Casting is the work. A polished host who has never felt the problem will sound like an ad, even with a perfect script.",
  },
  {
    question: "Can you see examples before a call?",
    answer:
      "The public site keeps named campaign results behind a booking overlay. You can read the method here. The specific numbers are walked through on a call, not published as a case-study page.",
  },
];

export default function UgcForAiStartupsPost() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        AI startups keep shipping the same video. A cursor moves. A panel generates. A voice says &quot;watch this.&quot; The founder likes it because every feature they fought for is on screen. The viewer likes it for about a second, which is long enough to understand that an app exists and not long enough to care.
      </p>
      <p>
        Vo Creations is an in-house UGC agency for AI startups and consumer apps. We train creators and run organic talking-head video. The team has 1B+ views generated. The argument below is about format. It is not a tour of client logos. Those stay gated.
      </p>

      <H2 id="what-is-ugc-for-an-ai-startup">What is UGC for an AI startup?</H2>
      <p>
        UGC, user-generated content, is a person who could be the customer, making a video the brand can post. For an AI startup the useful version is narrow. The person looks into the camera and tells a story the audience has already lived. The product shows up as the turn in that story. Not as a slideshow. Not as a screen recording with a caption glued on top.
      </p>
      <p>
        That is a different job from &quot;explain the model.&quot; The viewer does not arrive wanting a model. They arrive mid-scroll, slightly bored, ready to leave. The only opening is a situation they recognize: the blank page, the meeting that should have been a search, the ten tabs that were supposed to become a decision. If the first line is a feature, you have started too late.
      </p>
      <p>
        We run this as a program, not as a batch of explainers. Creators apply, interview, and finish a two-week paid trial before they touch an account. A campaign manager handles audience, warmup, hooks, and the way comments get answered. Videos are approved before they go live on TikTok, Instagram, YouTube, and Facebook. A campaign produces 2,400+ videos a month, because finding the story is a volume problem.
      </p>

      <H2 id="why-do-demos-die">Why do product demos die in a feed?</H2>
      <p>
        A product demo assumes interest. A feed does not grant it. The demo starts at the interface, which is the least human part of the company, and asks the viewer to do the translating: from this button to their Tuesday. Most people will not do that work for a stranger.
      </p>
      <p>
        AI products make the problem worse. The interface often looks like every other interface. A text box. A sparkle icon. A result that appears too fast to feel. If the video&apos;s whole idea is &quot;look how fast the box works,&quot; you have made a commercial for a category, not for a product. The viewer cannot remember which box it was.
      </p>
      <p>
        Demos also fail the comment test. There is nothing to confess, nothing to argue with, nothing to tag a friend about. The comment section stays thin, and a thin comment section is a weak reason for the next person to stay. A story gives people a place to say &quot;this is me.&quot; A cursor moving across a dashboard does not.
      </p>
      <p>
        None of this means the product is bad. It means the video started at the wrong end. You felt the product was the interesting part because you built it. The viewer feels their problem is the interesting part because they are living it. The video has to begin where they are.
      </p>

      <H2 id="what-talking-head-does">What does talking-head video do that a demo cannot?</H2>
      <p>
        A face is a filter the brain already trusts more than a graphic. When someone who looks like the viewer describes a mess the viewer has made, the clip is processed closer to a conversation than to an ad. That is the whole opening. You get a few more seconds. Those seconds are where the product can mean something.
      </p>
      <p>
        Talking-head also carries specifics a demo sands off. &quot;I studied five hours, took six practice tests, and still froze&quot; is a person. &quot;Our AI tutor personalizes your plan&quot; is a brochure. The specific line is what makes a stranger feel seen. The brochure line is what every competitor can say, and is saying, in the next video down.
      </p>
      <p>
        There is a second effect that shows up later, if you keep the format. Stories stack. The account becomes a place, not a catalog. People comment, and the comments become part of why the next viewer stays. Text and interface tours rarely earn that pile. We wrote the longer version of this, including why captions are not a substitute, in{" "}
        <Link href="/blog/text-on-screen-ugc" className="text-text underline decoration-white/30 underline-offset-4">
          why text-on-screen UGC is killing your app growth
        </Link>
        .
      </p>
      <p>
        Talking-head is also the creative you can trust later as an ad. If a story held people when you were not paying for the view, you have a reason to put money behind it. A demo that was designed as an ad often dies twice: once in the organic feed, and again when you boost it, because it never had to earn anyone.
      </p>

      <H2 id="where-the-product-appears">Where does the product still need to appear?</H2>
      <p>
        Inside the story, once. Show the thing the way you would show a friend. One flow. One outcome. No feature list. If the viewer cannot picture using it, the feeling has nowhere to go and you have made a diary, not a piece of UGC.
      </p>
      <p>
        The order matters more than the polish. Problem, then the specific mess, then the product as the turn, then what changed, then a way in that does not sound like a banner. &quot;Comment and I&apos;ll send the setup&quot; is a door. &quot;Download now&quot; is a salesman who arrived before the story finished.
      </p>
      <p>
        Screen recordings are allowed inside that turn. They are not allowed to replace the person. A creator can flip the camera to the laptop for a few seconds and come back. What does not work is a faceless recording with a caption doing the talking. That is the demo, wearing a UGC costume.
      </p>
      <ArticleTable
        caption="Product demo versus talking-head UGC for an AI startup"
        headers={["", "Product demo", "Talking-head UGC"]}
        rows={[
          ["Opens on", "The interface", "A situation the viewer recognizes"],
          ["Asks the viewer to", "Understand the feature", "Feel the problem, then see the turn"],
          ["Sounds like", "A tour", "A person who has been there"],
          ["Comment section", "Usually thin. There is little to add", "People confess, argue, and tag friends"],
          ["What you learn", "Whether the UI is clear to someone who already cared", "Whether a story can hold a stranger"],
          ["Later, as an ad", "You are still guessing", "You are boosting a story that already earned the view"],
          ["Where it belongs", "A beat inside the story, or a page for people who are already looking", "The organic feed, at volume"],
        ]}
      />

      <H2 id="how-to-brief-a-creator">How should an AI startup brief a creator?</H2>
      <p>
        Do not brief the model. Brief the life around the model. Write the most specific version of the problem, the one a user would tell a friend, and ban the sentence that starts with &quot;our AI.&quot; If the creator cannot tell the story without the product name in the first line, the story is not ready.
      </p>
      <p>
        Cast for lived experience. A study tool wants someone who has actually studied badly. A coding tool wants someone who has actually been stuck. Authenticity here is not an accent you can direct. It is whether the person has felt the problem. A generalist who can &quot;play a founder&quot; will drift back into demo language, because demo language is what the brief rewarded.
      </p>
      <p>
        Give them the one flow they may show, and the outcome in human words. Not &quot;highlight the collaboration features.&quot; Try &quot;show the moment the empty doc becomes the outline you were avoiding.&quot; Then get out of the sentence-level rewrite. Creators who are trained, and then over-scripted, start to sound like the landing page. The landing page is why you needed a person.
      </p>
      <p>
        Approve for truth and for the product being real, not for coverage of the roadmap. Every extra feature you force into the minute makes the story worse. The features that matter will get their own videos, after you know which feeling made anyone stay.
      </p>

      <H2 id="what-the-first-90-days-test">What should the first 90 days test?</H2>
      <p>
        Not &quot;does video work.&quot; Video works or it does not depending on the story, the face, and the account. The first 90 days are for warmup and for a few testing cycles. Accounts that are asked to convert on day two are being used wrong. We ask for the 90-day minimum for that reason, then the work is month to month.
      </p>
      <p>
        In practice the tests are simple. Which opening makes the right person stop. Which creator can say the problem without performing it. Which single product moment is enough. Which comment you should reply to because it is the next script. You will not learn those from a deck. You learn them by posting, which is why a campaign is measured in thousands of videos, not in a hero film.
      </p>
      <p>
        First posts still happen fast. Within 10-14 days of kickoff, something is live. Fast and patient are both true. You start quickly so the learning has footage. You do not judge the channel on the first fortnight.
      </p>
      <p>
        The commercial frame around that patience is public. Campaigns start at $50K a month. Creator bonuses are separate. There are no refunds. If that shape is wrong for a company that still wants a single demo, do not force it. The model choice is covered in{" "}
        <Link href="/blog/in-house-ugc-vs-marketplace-vs-freelancers" className="text-text underline decoration-white/30 underline-offset-4">
          in-house agency vs marketplace vs freelancers
        </Link>
        .
      </p>

      <H2 id="when-a-demo-is-right">When is a demo still the right cut?</H2>
      <p>
        When the viewer is already looking. A docs page, a launch email, a sales call, a retargeting audience that has visited the product: those people asked for the interface. Give them the demo. Clarity is a kindness once interest exists.
      </p>
      <p>
        Inside the organic feed, use the demo as the turn, not the trailer. One flow, filmed like a favor, then back to the face. If your team cannot tell the story without the screen, you do not have a story yet. Go get the specific mess from a real user, including your own, and start the next video there.
      </p>
      <p>
        And if you are about to hire someone to do this, make them say the format out loud. &quot;Talking-head, product inside the story, no text-on-screen template&quot; is a real answer. &quot;High-quality AI content&quot; is not. The rest of the hiring questions are in{" "}
        <Link href="/blog/questions-before-hiring-a-ugc-agency" className="text-text underline decoration-white/30 underline-offset-4">
          12 questions to ask before hiring a UGC agency
        </Link>
        .
      </p>
    </Article>
  );
}
