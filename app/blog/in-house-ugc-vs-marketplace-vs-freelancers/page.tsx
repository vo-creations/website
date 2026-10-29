import type { Metadata } from "next";
import Link from "next/link";
import Article, { ArticleTable, H2, type FaqItem, type TocItem } from "@/components/blog/Article";
import { getPost, postUrl } from "@/lib/blog/posts";

const post = getPost("in-house-ugc-vs-marketplace-vs-freelancers");

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
  { id: "what-are-you-buying", label: "What are you actually buying?" },
  { id: "how-do-they-compare", label: "How do the three models compare?" },
  { id: "what-did-a-program-produce", label: "What did a run program produce?" },
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
      "No. The figures above are Vo Creations campaign results with the client left off. Named proof stays on a call. We do not publish logos or links for those apps.",
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
        These are three different jobs. An in-house agency runs the channel. A marketplace sells access to people who will make a file. A freelancer is one person you manage. Pick the job you actually need, then the price will make sense.
      </p>
      <p>
        Vo Creations is the first of those. We have 1000+ vetted in-house creators, and the 1B+ views on the site are all from creators we trained. The program is $50K a month. Chad runs strategy. Adam Chen runs the creator bench. Coaches meet the roster every week.
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
          ["Pricing shape", "A monthly program fee, bonuses separate", "Usually a price per video. No single market rate.", "A personal rate, scoped per job"],
        ]}
      />
      <p>
        The pricing piece is{" "}
        <Link href="/blog/what-a-managed-ugc-program-costs" className="text-text underline decoration-white/30 underline-offset-4">
          what a managed program costs
        </Link>
        . This table is only the operating difference.
      </p>

      <H2 id="what-did-a-program-produce">What did a run program produce?</H2>
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
        Illustrative example, not a campaign result. A brief we would actually run for a generic consumer app:
      </p>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Problem: the user keeps meaning to start and does not.</li>
        <li>Specific mess: three abandoned setups, one half-finished Tuesday.</li>
        <li>Product turn: one screen, shown like a favor, not a tour.</li>
        <li>What changed: they finished the thing the same night.</li>
        <li>Soft CTA: &quot;Comment start and I&apos;ll send the setup.&quot;</li>
      </ol>
      <p>
        Illustrative hook, first line only: &quot;I downloaded it twice and still hadn&apos;t opened it.&quot;
      </p>
      <p>
        Illustrative comment follow-up: if people reply &quot;same, I quit on day two,&quot; the next video is that day-two quit, not a new feature.         The comment is the brief. A marketplace order does not have a person whose job is to read it on Thursday.
      </p>
      <p>
        The same week, in operating terms: Monday the coaches mark which lines people finished. Strategy kills the openings that could belong to any app. Two creators reshoot the winner with their own mess, not a shared script. You get a note on what was stopped, not only a folder of what went live. That note is the product. A per-video invoice rarely includes it, because nobody is paid to throw work away.
      </p>
      <p>
        Illustrative hook for a money app, not one of the results above: &quot;I checked the balance and then didn&apos;t look again for nine days.&quot; If the comments are all &quot;I do the same with savings,&quot; the next opening is the nine days, not a tour of the home screen.         The operator&apos;s job is to notice that by Thursday. Yours is not.
      </p>

      <H2 id="what-still-lands-on-you">What still lands on your team?</H2>
      <p>
        Even a run program needs a person on your side who can say what the product is not allowed to claim, and who can show up to a weekly call if you want one. That is a check-in, not a production job. If the proposal needs you to write hooks, pick the creator, and decide the posting account, add those hours to your own week before you compare the invoices.
      </p>
      <p>
        Marketplace, typical week: you write the brief, you wait, you reject the cut that missed the product, you still have to post it. Freelancer, typical week: one thread, one face, fast notes, and a hole if they book someone else. In-house, typical week: you answer a question about the product, and the roster keeps moving when you don&apos;t. Count the hours. The cheaper invoice is often the one that hired you as the manager.
      </p>
      <p>
        A last filter, still about the work and not about another price. Ask them to describe yesterday. If they can say which line was killed and which comment became today&apos;s opening, you are talking to an operator. If they can only show you the menu of people, you are talking to a store.
      </p>
      <p>
        What you own a month later is the other half of the table. A channel keeps the comments, the account, and a record of which mess worked. A file leaves with whoever posted it, unless the license says otherwise. A freelancer&apos;s thread lives in your inbox. When you stop paying, the channel is the only one of the three that still has an audience attached to a way of talking. That is why the view counts above are measured in weeks and months, not in a single delivery.
      </p>
      <p>
        None of this makes the other two models a mistake. Buy the marketplace when your team will actually run it. Buy the freelancer when the job is one face and you have the hours. Buy the program when the hours are the thing you are trying to stop spending. If you cannot say which of those sentences is yours, you are not ready to compare prices.
      </p>
      <p>
        Approval is the piece people skip in the comparison. On a program, someone other than the founder clears the line before it posts, so a bad claim does not learn your audience for you. On a marketplace cut, that person is often you, late, in a comment on a file. On a freelancer, it is a text thread at midnight. Same decision. Different hour of your week. Ask who holds it before you ask what the views were. The views come after that decision. They do not replace it on a call.
      </p>
    </Article>
  );
}
