import Link from "next/link";
import Article, { H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, getPost } from "@/lib/blog/posts";

const post = getPost("ugc-for-ai-startups");

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "why-the-first-line", label: "Why does the first line do all the work?" },
  { id: "three-hooks", label: "What do hooks sound like for three kinds of AI apps?" },
  { id: "one-outline", label: "What does one full outline look like?" },
  { id: "what-the-format-did", label: "What did that format do in market?" },
];

const faqs: FaqItem[] = [
  {
    question: "Can I open on the interface if the product is the interesting part?",
    answer:
      "Only if the viewer already cares. In a feed they don't. Start on the mess they recognize, then show one screen as the turn. A tour is for the docs page and the sales call.",
  },
  {
    question: "Are these hooks from live campaigns?",
    answer:
      "No. The hooks and the outline are illustrative. The view counts later in the piece are separate: Vo Creations results for anonymized AI apps, not scripts you can match to a brand.",
  },
  {
    question: "Who should say the line?",
    answer:
      "Someone who uses the product. A student for a study tool, a person who actually codes for a coding tool, a person who stares at a blank doc for a writing tool. An influencer reading a brief sounds like an ad by the second sentence.",
  },
  {
    question: "How is this different from text on the screen?",
    answer:
      "A caption can carry the same words and still feel like a label. The face is what makes the line a confession instead of a sticker. The longer version of that argument is the text-on-screen essay, and this piece doesn't repeat it.",
  },
  {
    question: "What do I do with a comment that is better than the video?",
    answer:
      "Shoot that comment next. If fifty people say they quit on the outline, the next opening is the outline, not the feature you meant to cover. The coaches use the comment as the next brief.",
  },
  {
    question: "Do I need a different hook for every platform?",
    answer:
      "No. The same first line can run on TikTok, Instagram, YouTube, Facebook, and Snapchat. What changes is the cut length, not the situation. If the line only works with a caption doing the talking, it isn't a line yet.",
  },
];

export default function UgcForAiStartupsPost() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        A demo starts at the screen. The viewer has not agreed to care about your screen. A talking-head video starts at a mess they already recognize, and the product gets one moment inside it. That is the whole format. The lines below are how it sounds.
      </p>

      <H2 id="why-the-first-line">Why does the first line do all the work?</H2>
      <p>
        If the first sentence could sit on any AI app, it will. &quot;This changed how I work&quot; is a caption pretending to be a person. The line has to be a situation: a specific hour, a specific failure, something the right viewer has already done this week.
      </p>
      <p>
        The creator has to have lived a version of it. We cast people who use the product, and they are coached every week, not handed a brief and filmed once. Coaching is someone saying &quot;that line could be any app, say the hour.&quot;
      </p>

      <H2 id="three-hooks">What do hooks sound like for three kinds of AI apps?</H2>
      <p>Illustrative examples, not campaign results. First lines only.</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Study tool: &quot;I did five hours of review and still froze on question one.&quot;</li>
        <li>Coding tool: &quot;I&apos;ve had the same bug open since lunch and I stopped reading the error.&quot;</li>
        <li>Writing tool: &quot;The doc has a title and nothing else, and the meeting is in an hour.&quot;</li>
      </ul>
      <p>
        Illustrative comment follow-ups, if those lines actually ran:
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Study: replies like &quot;I do this the night before every exam&quot; become a video that starts at 11pm, not at the syllabus.</li>
        <li>Coding: &quot;I just stack console logs until it moves&quot; becomes the next opening. Don&apos;t answer it with a feature list.</li>
        <li>Writing: &quot;I rewrite the first sentence twelve times&quot; is the whole next story. The product shows up when the twelfth sentence finally stays.</li>
      </ul>

      <H2 id="one-outline">What does one full outline look like?</H2>
      <p>Illustrative script outline for the study tool. Same shape works for the other two if you swap the mess.</p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Problem: they studied and still don&apos;t know what they know.</li>
        <li>Specific mess: six practice tests, same score, notes that are just the textbook again.</li>
        <li>Product turn: one pass over the questions they missed, on the actual screen, like showing a friend.</li>
        <li>What changed: they walk in able to start, not able to recite the chapter.</li>
        <li>Soft CTA: &quot;Comment missed and I&apos;ll show the page I used.&quot;</li>
      </ol>
      <p>
        The demo is step three. It is not the video. The coding version of the same outline swaps the mess for a bug that has been open since lunch, and the turn is one error they finally read out loud. The writing version swaps it for a title and an empty page, and the turn is the sentence that stays. Don&apos;t film three tours. Film three messes.
      </p>
      <p>
        What makes the study hook work is the number of hours plus the freeze. Hours alone is a humblebrag. The freeze is the confession. The coding hook works because &quot;stopped reading the error&quot; is a behavior, not a mood. The writing hook works because the meeting is a clock. If you delete the clock, the line goes soft. Put a clock, a score, or a bug in the first sentence before you mention the product.
      </p>
      <p>
        If you want the argument against a caption doing this job, it&apos;s in{" "}
        <Link href="/blog/text-on-screen-ugc" className="text-text underline decoration-white/30 underline-offset-4">
          why text-on-screen stalls
        </Link>
        . This piece stays on the line.
      </p>

      <H2 id="what-the-format-did">What did that format do in market?</H2>
      <p>
        Vo Creations campaign results. The clients are anonymized AI apps. These are not the scripts above.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>An AI app: 19.4M views in 2 weeks.</li>
        <li>An AI app: 130M+ views in 3 months.</li>
      </ul>
      <p>
        Two weeks is one opening that people finished. Three months is that opening, recast, with the comments telling you the next one. Post first, then put money only behind what people already watched. The format depends on whether the first sentence is a situation someone has lived.
      </p>
      <p>
        In the edit, cut until the freeze, the bug, or the clock arrives before you breathe. If the creator explains the category first, the line is already dead. Leave one product moment and get out. A second feature is how a confession turns back into a tour.
      </p>
      <p>
        Cast from use, not from a follower count. The study line needs someone who has actually blanked an exam. The coding line needs someone who has actually stopped reading the error. The writing line needs someone who has actually sat in front of an empty doc with a meeting coming. You cannot coach a person into having lived it. You can coach the person who lived it into saying the hour instead of the slogan.
      </p>
      <p>
        The soft CTA is the last place people turn the story back into an ad. &quot;Download now&quot; arrives before the feeling finished. &quot;Comment missed and I&apos;ll show the page&quot; sounds like a person who just did the thing. Use the word they already used in the comments. If they said freeze, you say freeze. If they said bug, you say bug. The CTA is a door, not a banner, and it should be the shortest line in the video.
      </p>
    </Article>
  );
}
