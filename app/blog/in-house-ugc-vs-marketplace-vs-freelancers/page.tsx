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
  { id: "what-is-an-in-house-ugc-agency", label: "What is an in-house UGC agency?" },
  { id: "what-is-a-ugc-marketplace", label: "What is a UGC marketplace?" },
  { id: "what-is-a-freelancer-here", label: "What is a freelancer, in this comparison?" },
  { id: "how-do-the-three-compare", label: "How do the three models compare?" },
  { id: "who-owns-the-account", label: "Who owns the account, and why does that matter?" },
  { id: "what-happens-after-the-first-videos", label: "What happens after the first videos land?" },
  { id: "which-model-fits", label: "Which model fits a startup that needs a program?" },
  { id: "what-should-you-refuse", label: "What should you refuse to buy?" },
];

const faqs: FaqItem[] = [
  {
    question: "What is an in-house UGC agency?",
    answer:
      "An in-house UGC agency recruits creators, trains them, and runs the posting as your program. At Vo Creations that means organic talking-head video for AI startups and consumer apps, with the creators trained before they touch a brand account.",
  },
  {
    question: "How is a marketplace different from an agency?",
    answer:
      "A marketplace usually sells access to people who will make a video. You still brief, pick, review, and often decide what happens tomorrow. An agency that runs the program takes that operating work, not just the introduction.",
  },
  {
    question: "When is a freelancer the right hire?",
    answer:
      "A freelancer is the right hire when you want one specific person and you are ready to be their manager. It gets thin when you need a roster, a backup, and a system for what to post after the first week.",
  },
  {
    question: "Does Vo Creations post on the brand's accounts?",
    answer:
      "The program runs organic UGC on TikTok, Instagram, YouTube, and Facebook. Creators are managed, scripts and videos are approved before they go live, and the work is built as the brand's program rather than a folder of files you have to place yourself.",
  },
  {
    question: "How fast does an in-house program start?",
    answer:
      "After a consultation and onboarding call, first posts go live within 10-14 days of kickoff. We ask for 90 days so accounts can warm up and a few testing cycles can find the format.",
  },
  {
    question: "Can a marketplace replace a managed program?",
    answer:
      "Only if your own team is willing to do the managing. A marketplace can be a fine way to buy a video. It does not, by itself, train a roster, warm accounts, or decide what to repeat next week.",
  },
  {
    question: "Where do case studies fit in the decision?",
    answer:
      "Named campaign results stay behind a booking call. The public site shows blurred proof and this explanation of the model. If you need the numbers before you decide, book the call rather than hunting for a public case-study page.",
  },
];

export default function InHouseVsMarketplacePost() {
  return (
    <Article slug={post.slug} toc={toc} faqs={faqs}>
      <p>
        Founders shop for UGC the way they shop for software: they compare logos, ask for a deck, and pick the cheapest path that says it can post this month. The three paths on the table are not three prices for the same thing. An in-house agency, a marketplace, and a freelancer each hand you a different job. If you buy the wrong one, you will still have to do the job yourself.
      </p>
      <p>
        Vo Creations is an in-house UGC agency in New York, founded in 2025 by Thienvu Vo and Daniel Yun. We train creators and run organic talking-head video for AI startups and consumer apps. The team has 1B+ views generated. This piece is the operating comparison we wish every founder asked for before the first invoice, not a ranking of other companies.
      </p>

      <H2 id="what-is-an-in-house-ugc-agency">What is an in-house UGC agency?</H2>
      <p>
        An in-house UGC agency builds the creator team and then runs it as if it sat inside the brand. The point is not a one-time delivery. The point is a program: who is on camera, what they are allowed to say, which accounts they post from, what gets repeated, and what gets killed.
      </p>
      <p>
        At Vo Creations that program looks like this. Creators apply, interview, and finish a two-week paid trial before they touch a brand account. We keep the top 1%. A campaign manager builds the strategy around the product: audience, account warming, hooks, messaging, and how creators respond to comments. Every script and video is approved before it goes live, across TikTok, Instagram, YouTube, and Facebook.
      </p>
      <p>
        The format is talking-head storytelling. A creator looks into the camera and tells a story the audience has lived. The product shows up inside that story. There is no studio, no text-on-screen template, and no script that sounds like a script. A campaign produces 2,400+ videos a month. First posts go live in 10-14 days. We ask for 90 days so the accounts can warm up. After that it is month to month.
      </p>
      <p>
        You are buying continuity. The same standard, the same approval path, and a roster that does not disappear when one person gets busy. That is a different purchase from &quot;send us five videos.&quot;
      </p>

      <H2 id="what-is-a-ugc-marketplace">What is a UGC marketplace?</H2>
      <p>
        A marketplace is a directory with a checkout. Brands post a brief, creators apply, and someone picks a winner. The useful part is speed of introduction. You can see faces, rates, and past clips without running your own recruiting.
      </p>
      <p>
        The part people skip is everything after the introduction. Someone still has to write a brief a stranger can follow. Someone still has to reject the cut that missed the product. Someone still has to decide which account posts it, whether the comments get a reply, and what the next ten videos should learn from the first one. On a marketplace, that someone is usually you, or a junior marketer you already employed.
      </p>
      <p>
        Marketplaces are often priced per video or per creator, because the product on the shelf is the person or the file. That shape is honest if a file is what you need. It is a poor shape if you need a system. You can buy fifty files and still have no idea which story to run next Tuesday.
      </p>
      <p>
        None of this is a knock on the tool. A marketplace is a sourcing layer. Treat it as sourcing. The moment the sales page calls that layer a &quot;program,&quot; ask who is in the weekly review and who gets fired when the format is wrong. If the answer is your team, you did not buy a program.
      </p>

      <H2 id="what-is-a-freelancer-here">What is a freelancer, in this comparison?</H2>
      <p>
        A freelancer is one relationship. You found a person whose face, voice, and taste fit the product. You pay them, you brief them, you wait, you give notes. When it works, it works because of that person, not because of a bench behind them.
      </p>
      <p>
        That is the right tool for a narrow job. A founder video. A single launch film. A creator who already lives in your category and does not need to be taught the product. You can move fast, and you can keep the taste bar high, because you are the taste bar.
      </p>
      <p>
        The failure mode is scale and absence. One person gets sick, books a bigger client, or simply runs out of stories. There is no second creator who was trained on the same standard. There is no one whose job is to watch yesterday&apos;s comments and turn them into tomorrow&apos;s hook. You become the campaign manager, which is a real job, and it is not the job you hired a freelancer to do.
      </p>
      <p>
        Freelancers also vary wildly in how they price, because each person is a market of one. We will not pretend there is a standard rate. Ask what the fee covers: the filming, the posting, the whitelisting, the number of revisions, and what happens if you need ten more videos that sound like the first. If the answer is &quot;we&apos;ll see,&quot; you are about to become a producer.
      </p>

      <H2 id="how-do-the-three-compare">How do the three models compare?</H2>
      <p>
        Read the rows as jobs, not as scores. A cell that says &quot;usually you&quot; means the work does not vanish. It lands on your team.
      </p>
      <ArticleTable
        caption="In-house UGC agency, marketplace, and freelancer compared by who does the work"
        headers={["", "In-house agency", "Marketplace", "Freelancer"]}
        rows={[
          ["What you buy", "A program that posts and iterates", "Access to creators, usually per video", "One person's time and taste"],
          ["Who recruits", "The agency, against a trained standard", "The platform's pool, then you pick", "You, from your own network"],
          ["Who trains", "The agency, before they touch the account", "Often nobody. The brief is the training", "You, in the notes you send back"],
          ["Who manages the week", "A campaign manager", "Usually your team", "You"],
          ["Where it posts", "The program runs the organic accounts", "Often a file you still have to place", "Wherever you agree, one person at a time"],
          ["Volume", "Built for a roster and a monthly output", "As many orders as you can review", "As many as that person can shoot"],
          ["Next month", "The same system, with new tests", "A new order, unless you keep managing", "A new thread, if they are free"],
          ["Pricing shape", "A monthly program fee, plus creator bonuses", "Usually a price per video or per creator", "A personal rate, scoped per job"],
          ["Best fit", "You want the program run for you", "You have operators and need more faces", "You need one face and will direct them"],
        ]}
      />
      <p>
        Vo Creations sits in the first column. Campaigns start at $50K a month. Creator bonuses are billed separately, so strategy and creator pay stay easy to tell apart. There are no refunds. The 90-day minimum is the time we ask for before the work is month to month. The{" "}
        <Link href="/blog/what-a-managed-ugc-program-costs" className="text-text underline decoration-white/30 underline-offset-4">
          pricing piece
        </Link>{" "}
        goes through retainer, per-video, and CPM without inventing a market rate card.
      </p>

      <H2 id="who-owns-the-account">Who owns the account, and why does that matter?</H2>
      <p>
        A video is not the asset. The account that posts it is closer. Organic distribution compounds when the same account keeps showing up, the comments stack, and the next video is cut from what the last one taught you. A file in a Google Drive does none of that until a person posts it, replies, and decides the sequel.
      </p>
      <p>
        In-house, that sequence is the product. Creators are warmed on the accounts. Comments are part of the strategy, not a leftover. When a video earns the view, it is already tested creative, which is the bridge from organic UGC to UGC ads. You are not guessing which ad to cut. You are putting money behind a story that already held a stranger.
      </p>
      <p>
        On a marketplace, the file often arrives detached from an account. That can be exactly what a performance team wants: raw creative for ads they already know how to run. It is a bad fit if you hoped the marketplace would also build the organic presence. Those are two projects.
      </p>
      <p>
        With a freelancer, the account question is a contract question. Are they posting on a brand account, on their own, or handing you a file? Each answer changes what you own next month. Get it in writing before the first shoot, not after the video works and nobody knows who may run it as an ad.
      </p>

      <H2 id="what-happens-after-the-first-videos">What happens after the first videos land?</H2>
      <p>
        Week one is flattering in every model. You see faces, you see cuts, you feel motion. The model shows itself in week three, when most of the videos did the ordinary thing and one or two did something worth repeating.
      </p>
      <p>
        An in-house program is built for that moment. The campaign manager&apos;s job is the weekly cut: what to stop, what to remake, which creator should carry the story that worked. Real-time tracking is there so the review is about what converted, not about whose edit felt nicer in a meeting. We ask for 90 days because account warmup and a few testing cycles do not finish in week one.
      </p>
      <p>
        A marketplace can do this only if you install the habit yourself. Someone on your side has to tag the winner, rewrite the brief, and rebook the right creator. If that person is busy, the program silently becomes a content calendar with no memory.
      </p>
      <p>
        A freelancer can iterate fast if they are good and available. They cannot be two people. If the winning story needs a second face, a different city, or a weekend when they are booked, the iteration stops. That is not a character flaw. It is the shape of a one-person shop.
      </p>

      <H2 id="which-model-fits">Which model fits a startup that needs a program?</H2>
      <p>
        Buy a freelancer when the job is a person. Buy marketplace access when the job is a pile of options and your team will run the pile. Buy an in-house program when the job is &quot;make this a channel,&quot; and you do not want to staff the channel yourself.
      </p>
      <p>
        AI startups and consumer apps tend to need the third, because the product is hard to explain in a caption and the feed will not wait for a brand film. The creator has to look like the user and talk like the user. That is a casting and training problem, repeated hundreds of times, not a single casting choice. We wrote the format argument separately in{" "}
        <Link href="/blog/ugc-for-ai-startups" className="text-text underline decoration-white/30 underline-offset-4">
          why talking-head video beats a product demo
        </Link>
        .
      </p>
      <p>
        If your budget is a test, say so and buy a test. A $50K month is the wrong container for &quot;let&apos;s see if video works.&quot; It is the right container when you already know you want organic volume, a trained roster, and someone other than the founder running the comments. The questions to force that honesty are in{" "}
        <Link href="/blog/questions-before-hiring-a-ugc-agency" className="text-text underline decoration-white/30 underline-offset-4">
          12 questions to ask before hiring a UGC agency
        </Link>
        .
      </p>

      <H2 id="what-should-you-refuse">What should you refuse to buy?</H2>
      <p>
        Refuse a model that hides who does the work. If the proposal says &quot;done for you&quot; and the next sentence is a login to pick creators yourself, you are buying software plus homework. If the proposal says &quot;our creators&quot; and nobody can describe how those creators were trained, you are buying a contact list.
      </p>
      <p>
        Refuse proof you cannot inspect. Named results on this site stay gated. A public page full of borrowed screenshots is not a substitute for a conversation about what was actually posted, by whom, and on which accounts. Ask for the operating answers. The views, if you get them, should come after the method is clear.
      </p>
      <p>
        Refuse a price that mixes the fee and the creator pay so you cannot see either one. On our invoices the program starts at $50K a month and creator bonuses sit on top, billed separately. You should be able to point at the line that pays for management and the line that pays the person on camera. If a vendor will not separate those, you will not know what you are renewing.
      </p>
    </Article>
  );
}
