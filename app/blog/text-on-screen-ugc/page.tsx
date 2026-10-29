import Link from "next/link";
import Article, { H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import ClickToPlayYouTube from "@/components/ClickToPlayYouTube";
import { blogPostMetadata, getPost } from "@/lib/blog/posts";

const post = getPost("text-on-screen-ugc");

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "why-does-text-on-screen-stall", label: "Why does text-on-screen UGC stall?" },
  { id: "what-is-real-ugc", label: "What is real UGC?" },
  { id: "why-does-storytelling-work", label: "Why does talking-head storytelling work?" },
  { id: "what-can-a-story-do", label: "What can a story do that a caption cannot?" },
  { id: "why-do-comments-close-the-sale", label: "Why do comments close the sale?" },
  { id: "what-does-a-campaign-look-like", label: "What does a talking-head campaign look like?" },
  { id: "how-do-you-make-one", label: "How do you make a talking-head video?" },
];

const faqs: FaqItem[] = [
  {
    question: "What is text-on-screen UGC?",
    answer:
      "It is a video built from a text overlay, trending audio, a product shot, and a call to action. It communicates what the product is. It does not give the viewer a person to stay with.",
  },
  {
    question: "Why doesn't text-on-screen convert?",
    answer:
      "The viewer gets the gist in a couple of seconds and swipes. There is no emotional hook and nothing to identify with, so the comment section stays empty and the video has nothing to compound.",
  },
  {
    question: "What is talking-head UGC?",
    answer:
      "A real person on camera telling a story the target audience has lived. The product shows up inside the story, not as a pitch. No fancy editing, no text overlay doing the talking, no AI voiceover.",
  },
  {
    question: "Why do the comments matter as much as the video?",
    answer:
      "The video gets the view. The comments close the sale. When people say the story is theirs and tag friends, the next viewer sees a crowd, not just a clip. Text-on-screen rarely gives anyone a reason to write that comment.",
  },
  {
    question: "Can text-on-screen become a paid ad?",
    answer:
      "A story that already earned attention can be put behind spend, because the hook and the feeling were tested for free. A caption video does not give you that test. You would be boosting a guess.",
  },
  {
    question: "How do you start a talking-head video?",
    answer:
      "Start with the most specific version of the problem, not the feature list. Cast someone who has felt that problem. Show one flow like you are showing a friend. End with a way in that feels like access, not a banner.",
  },
];

const proof = [
  { views: "3.8M", href: "https://www.instagram.com/p/DTFU5uGjgqV/" },
  { views: "3.7M", href: "https://www.instagram.com/p/DTRCvh2E1Lu/" },
  { views: "2.9M", href: "https://www.instagram.com/p/DTGTfgsGI62/" },
];

export default function TextOnScreenPost() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <H2 id="why-does-text-on-screen-stall">Why does text-on-screen UGC stall?</H2>
      <p>
        A lot of text-on-screen videos do the same thing: text overlay, trending audio, product shot, call to action. The viewer gets the product name and swipes. The comment section stays empty.
      </p>
      <p>
        Text-on-screen explains the product. It does not give the viewer a person to stay with. Talking-head UGC does. The viewer gets the gist in a couple of seconds, and there is nothing to comment on.
      </p>
      <p className="font-semibold text-text">
        People buy a product that made them feel understood before they open the app store. A caption does not do that.
      </p>
      <H2 id="what-is-real-ugc">What is real UGC?</H2>
      <p>
        A real person on camera telling a story. No fancy editing. No text overlays. No AI voiceover. A human face, a real voice, and a narrative the viewer can place themselves in.
      </p>
      <p>
        The best-performing UGC we&apos;ve ever made follows the same structure: a creator looks into the camera and tells a story that the target audience has lived. The product shows up naturally, not as a pitch, but as part of the story.
      </p>
      <p>
        This is what we have tested across 50+ campaigns. The pattern is the same: a person, a specific mess, and the product inside the story.
      </p>
      <H2 id="why-does-storytelling-work">Why does talking-head storytelling work?</H2>
      <p>
        If the brief is &quot;explain what the product does,&quot; the video will sound like a tour. The viewer stays for a problem they have lived.
      </p>
      <p>
        Talking-head storytelling works because the viewer sees someone who looks like them and hears a problem they have lived. It reads as a conversation, not a product tour.
      </p>
        <p>The job is to get past the ad filter. Storytelling does that. A caption does not.</p>
      <ClickToPlayYouTube videoId="xL3zWBso9mw" title="Thienvu Vo: the story behind Vo Creations" />
      <H2 id="what-can-a-story-do">What can a story do that a caption cannot?</H2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="mb-3 font-extrabold text-text">Text-on-screen</h3>
          <ul className="list-disc space-y-2 pl-4">
            <li>Viewer learns product name</li>
            <li>No emotional response</li>
            <li>One algorithm cycle</li>
            <li>Can&apos;t become a paid ad</li>
            <li>No comment engagement</li>
            <li>Disposable by design</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="mb-3 font-extrabold text-text">Storytelling</h3>
          <ul className="list-disc space-y-2 pl-4">
            <li>Viewer feels understood</li>
            <li>Builds brand equity</li>
            <li>Compounds over time</li>
            <li>Organic to paid bridge</li>
            <li>Comments become social proof</li>
            <li>Every video is a future ad</li>
          </ul>
        </div>
      </div>
      <p>
        <strong className="text-text">1. Builds brand equity.</strong> Every talking-head video that resonates adds to a compounding library of trust signals. Text-on-screen is disposable. You watch it, get the info, and forget the brand. Storytelling creates emotional memory. The viewer remembers how the video made them feel, and that feeling gets attached to the brand.
      </p>
      <p>
        <strong className="text-text">2. Creates the conversion window.</strong> The moment a viewer thinks &quot;this is exactly what I needed&quot; is the moment they convert. Text doesn&apos;t create that moment. A story about a student who failed three exams and then found the tool that changed everything. That creates the moment.
      </p>
      <p>
        <strong className="text-text">3. Becomes a paid ad.</strong> The best organic content is also the best ad creative. When a talking-head video goes viral organically, you already know the story, hook, and emotional arc work. You just put budget behind it. With text-on-screen, you&apos;re always guessing, because there&apos;s no story to validate.
      </p>
      <H2 id="why-do-comments-close-the-sale">Why do comments close the sale?</H2>
      <p>The video gets the view. The comment section closes the sale. This is the part most brands completely ignore.</p>
      <p>
        When a talking-head video resonates, the comments fill with people saying &quot;I needed this,&quot; &quot;where was this when I was struggling,&quot; &quot;link??&quot;, and tagging friends. That comment section becomes a live testimonial wall. Every new viewer doesn&apos;t just see the video. They see hundreds of people validating the product underneath it.
      </p>
      <p>
        Text-on-screen videos almost never generate that kind of comment engagement. There&apos;s nothing to react to. Nothing to identify with. The comment section stays empty, and the algorithm reads that as a signal to stop pushing the video.
      </p>
      <p className="font-semibold text-text">
        Comments have to be earned. A caption gives people the product name and nothing to answer.
      </p>
      <H2 id="what-does-a-campaign-look-like">What does a talking-head campaign look like?</H2>
      <p>
        No text on screen. No AI clone. A person tells a story the viewer has lived, and the product shows up inside it. Vo Creations campaign results, clients anonymized: two apps, 30 days each, 21.5M and 15.9M views.
      </p>
      <p>
        Paid ads don&apos;t come with the comment section those stories earn. People saying &quot;this changed everything&quot; is the part you cannot buy as a media line.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {proof.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/10 bg-bg-card/50 p-4 text-center hover:border-white/20"
          >
            <div className="text-lg font-extrabold text-text">{item.views}</div>
            <div className="mt-1 text-[15px] uppercase tracking-wide text-text-dim">views on Instagram</div>
          </a>
        ))}
      </div>
      <H2 id="how-do-you-make-one">How do you make a talking-head video?</H2>
      <ol className="list-decimal space-y-4 pl-5">
        <li>
          <strong className="text-text">Find the story.</strong> Start with the most specific version of the problem, not the feature list. &quot;Students struggle with the SAT&quot; is a category. &quot;A student studied 5 hours a day, took 6 practice tests, and still scored 800&quot; is a person. That specificity is what makes someone feel seen.
        </li>
        <li>
          <strong className="text-text">Stop optimizing the wrong things.</strong> Video length, hashtags, posting time. None of it matters if the story doesn&apos;t land. The only thing that determines if a video converts is whether the viewer felt something.
        </li>
        <li>
          <strong className="text-text">Cast the right person.</strong> The creator has to look, talk, and feel like the person watching. A study tool needs a college student. A dev tool needs a developer. Cast someone who has felt the problem.
        </li>
        <li>
          <strong className="text-text">Show, don&apos;t pitch.</strong> Demo the product like you&apos;re showing a friend. One flow. One outcome. No feature list. Let the product appear naturally within the story.
        </li>
        <li>
          <strong className="text-text">End with access.</strong> &quot;Download now&quot; sounds like a banner. &quot;Comment X and I&apos;ll send you the method&quot; sounds like a person, and it converts higher for that reason.
        </li>
      </ol>
      <p>
        AI content is flooding every feed, which makes a real person on camera more useful, not less. Text-on-screen had its moment. For an AI product specifically, the same argument is in{" "}
        <Link href="/blog/ugc-for-ai-startups" className="text-text underline decoration-white/30 underline-offset-4">
          why talking-head video beats a product demo
        </Link>
        .
      </p>
    </Article>
  );
}
