import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogIndexList from "@/components/blog/BlogIndexList";
import { posts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "UGC Insights & Strategy Blog",
  description:
    "How an in-house UGC program actually works: talking-head video, pricing, hiring questions, and what to buy instead of a folder of clips.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "UGC Blog | Vo Creations",
    description:
      "Talking-head UGC, program pricing, and how to hire an in-house agency. Written by the Vo Creations founders.",
    url: "https://vocreations.com/blog",
    type: "website",
  },
};

const xPosts = [
  {
    url: "https://x.com/itsthienvuvo/status/2036103378099376588",
    author: "Thienvu Vo",
    handle: "@itsthienvuvo",
    date: "March 23, 2026",
    content:
      "Why text-on-screen UGC is killing your app growth: I've managed 30+ creator campaigns generating 100M+ views. 99% of brands are doing UGC wrong. They hire creators to make text-on-screen videos that get 2K views and zero conversions.",
  },
  {
    url: "https://x.com/itsthienvuvo/status/2036105952827469983",
    author: "Thienvu Vo",
    handle: "@itsthienvuvo",
    date: "March 23, 2026",
    content:
      "every time i've challenged an agency owner about text-on-screen videos, they got super defensive. i don't believe they work, and have yet to hear a good reason why they do. always willing to learn, like genuinely",
  },
  {
    url: "https://x.com/VoCreationsUGC/status/2035015697609191440",
    author: "Vo Creations",
    handle: "@VoCreationsUGC",
    date: "March 20, 2026",
    content: "dream come true :) amazing students, amazing campaigns.",
  },
  {
    url: "https://x.com/itsthienvuvo/status/2034305615196008619",
    author: "Thienvu Vo",
    handle: "@itsthienvuvo",
    date: "March 18, 2026",
    content:
      "most bootstrapped founders treat UGC like a paid ad. run it once, check the conversion, move on. that's the wrong mental model entirely. UGC is a compounding machine. you're not running one ad. you're running 300 experiments simultaneously until you find the format that converts, then you pour money behind it.",
  },
  {
    url: "https://x.com/itsthienvuvo/status/2014355079906664586",
    author: "Thienvu Vo",
    handle: "@itsthienvuvo",
    date: "February 2026",
    content:
      "i scaled my UGC agency to 100K/month in 2 months. here's how, full transparency: week 1 notified mentorship students about the upcoming agency deal flow and reached out to existing agencies. week 2 landed 2 clients (40K/month) through IG personal brand inbounds and built the fulfilment system. week 3 landed 1 client (10K/month) through a referral and had creators double down on winning formats. week 4 built case studies: fable, 15M views in 21 days with 3 creators, and averaged over 10M views/month for clients. week 5 started posting on x, landed an equity deal with an app, and hired 2 creator managers. week 6 focused on team management. week 7 referred 3 more deals (30K/month). week 8 expanded the creator manager team to 5.",
  },
];

const ordered = [...posts].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

export default function BlogIndex() {
  return (
    <>
      <Nav />
      <main className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-[720px]">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[2.5px] text-text-secondary">Blog</p>
          <h1 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight">
            UGC insights
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-text-secondary">
            Notes on running an in-house UGC program: the format, the price, and the questions to ask before you hire anyone to post.
          </p>
          <BlogIndexList posts={ordered} />

          <h2 className="mb-6 mt-16 font-display text-3xl font-extrabold tracking-tight">From X</h2>
          <div className="flex flex-col gap-4">
            {xPosts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/10 bg-bg-card/50 px-6 py-5 hover:border-white/20"
              >
                <div className="text-sm font-bold">{post.author}</div>
                <div className="mb-3 text-xs text-text-dim">
                  {post.handle} · {post.date}
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">{post.content}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
