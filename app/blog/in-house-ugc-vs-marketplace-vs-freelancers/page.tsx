import Link from "next/link";
import Article, { ArticleTable, H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { blogPostMetadata, getPost } from "@/lib/blog/posts";

const post = getPost("in-house-ugc-vs-marketplace-vs-freelancers");

export const metadata = blogPostMetadata(post.slug);

const toc: TocItem[] = [
  { id: "what-are-you-buying", label: "What are you actually buying?" },
  { id: "how-do-they-compare", label: "How do the three models compare?" },
  { id: "what-did-a-program-produce", label: "What did a managed program produce?" },
  { id: "what-does-the-week-look-like", label: "What does the week look like?" },
  { id: "what-still-lands-on-you", label: "What still lands on your team?" },
];

const faqs: FaqItem[] = [
  {
    question: "Who still does the work if I hire through a marketplace?",
    answer:
      "Usually your team. The marketplace introduces a creator. Briefing, notes, posting, and the decision about tomorrow stay with whoever is managing the order, which is often you.",
  },
  {
    question: "When is a freelancer the better buy?",
    answer:
      "When you want one specific person and you will direct them. A freelancer is a bad fit when you need a second face, a backup, and someone whose job is the sequel.",
  },
  {
    question: "Do you name the apps behind the view counts?",
    answer:
      "No. The figures above are Vo Creations campaign results with the client left off. Named proof stays on a call. We do not attach names to specific results.",
  },
  {
    question: "What is the difference between a brief and coaching?",
    answer:
      "A brief is a document. Coaching is a weekly session with someone who has watched what the account actually held. Our creators are coached every week, not handed a PDF and left alone.",
  },
  {
    question: "Where do the videos post?",
    answer:
      "On the program accounts across TikTok, Instagram, YouTube, Facebook, and Snapchat. A file in a folder is a different purchase from an account that keeps posting.",
  },
  {
    question: "Who is on the operating team?",
    answer:
      "Chad is Head of Strategy. Adam Chen is Head of Creators. In-house coaches sit with the roster. The co-founders are Daniel Yun and Thienvu Vo.",
  },
];

export default function InHouseVsMarketplacePost() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        Vo Creations runs the in-house model. We have 1000+ vetted in-house creators, and the 1B+ views on the site are from creators we trained. Chad, Head of Strategy, runs the week. Adam Chen runs the creator bench. Coaches meet the roster every week. The fee, the CPM guarantee, and the term are on the{" "}
        <Link href="/#pricing" className="text-text underline decoration-white/30 underline-offset-4">
          program
        </Link>
        .
      </p>

      <H2 id="what-are-you-buying">What are you actually buying?</H2>
      <p>
        A file, a person, or a channel. A file is a video you can post. A person is someone you can call again. A channel is the accounts, the comments, and the decision about what to shoot next. If the proposal says &quot;program&quot; and the next sentence is a login where you pick creators, you bought a directory.
      </p>
      <p>
        Real creators who use the product are the cast, not influencers renting you an audience. Organic first: post a lot, see what people actually watch, and only put ad money behind what is already working.
      </p>

      <H2 id="how-do-they-compare">How do the three models compare?</H2>
      <ArticleTable
        caption="In-house agency, marketplace, and freelancer compared by who does the work"
        headers={["", "In-house agency", "Marketplace", "Freelancer"]}
        rows={[
          ["What you buy", "A channel that posts and iterates", "Access to creators, usually per video", "One person's time"],
          ["Who runs next week", "A campaign manager and coaches", "Usually your team", "You"],
          ["Training", "Weekly coaching before and after they post", "The brief is often the whole training", "Your notes"],
          ["If they are out", "Another trained creator is already on the bench", "You open a new order", "The work stops"],
          ["Pricing shape", "Starts at $50K+ a month, all-inclusive", "Usually a price per video. No single market rate.", "A personal rate, scoped per job"],
        ]}
      />
      <p>
        The pricing piece is{" "}
        <Link href="/blog/what-a-managed-ugc-program-costs" className="text-text underline decoration-white/30 underline-offset-4">
          what a managed program costs
        </Link>
        . This table is only the operating difference.
      </p>

      <H2 id="what-did-a-program-produce">What did a managed program produce?</H2>
      <p>
        Vo Creations campaign results. The clients are anonymized. No names, no logos.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Three AI apps, 90 days each: 453M, 123M, and 105M views.</li>
        <li>Two apps, 30 days each: 21.5M and 15.9M views.</li>
      </ul>
      <p>
        A folder of freelance cuts can be excellent and still not be this. Nobody was paid to decide the sequel, warm the account, or swap the face when the first creator was booked. That is the gap the table is about.
      </p>

      <H2 id="what-does-the-week-look-like">What does the week look like?</H2>
      <p>
        Example, not a campaign result. A brief we would actually run for a generic consumer app:
      </p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Problem: the user keeps meaning to start and does not.</li>
        <li>Specific mess: three abandoned setups, one half-finished Tuesday.</li>
        <li>Product turn: one screen, shown like a favor, not a tour.</li>
        <li>What changed: they finished the thing the same night.</li>
        <li>Soft CTA: &quot;Comment start and I&apos;ll send the setup.&quot;</li>
      </ol>
      <p>
        First line only: &quot;I downloaded it twice and still hadn&apos;t opened it.&quot;
      </p>
      <p>
        If people reply &quot;same, I quit on day two,&quot; the next video is that day-two quit, not a new feature. The comment is the brief. A marketplace order does not have a person whose job is to read it on Thursday.
      </p>
      <p>
        The same week, in operating terms: Monday the coaches mark which lines people finished. Strategy kills the openings that could belong to any app. Two creators reshoot the winner with their own mess, not a shared script. You get a note on what was stopped, not only a folder of what went live. That note is the product. A per-video invoice rarely includes it, because nobody is paid to throw work away.
      </p>
      <p>
        A first line for a money app, not one of the results above: &quot;I checked the balance and then didn&apos;t look again for nine days.&quot; If the comments are all &quot;I do the same with savings,&quot; the next opening is the nine days, not a tour of the home screen. The operator&apos;s job is to notice that by Thursday. The client&apos;s job is not.
      </p>

      <H2 id="what-still-lands-on-you">What still lands on your team?</H2>
      <p>
        You still need someone who can veto a claim. That is a check-in. If the proposal also needs you to write the hooks, pick the creator, and post the file, those hours are yours.
      </p>
      <p>
        A marketplace week is brief, wait, reject, and post it yourself. A freelancer week is one face and a hole if they book someone else. A program week is a product question from you, then the roster keeps moving. The cheaper invoice is often the one that hired you as the manager.
      </p>
      <p>
        Buy the marketplace if your team will run it, the freelancer if the job is one face, and the program if the hours are what you want back. Ask who clears a line before it posts. A channel keeps the comments and a record of which mess worked. A file leaves unless the license says otherwise. The views come after that decision.
      </p>
    </Article>
  );
}
