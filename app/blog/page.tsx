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
    title: "UGC insights | Vo Creations",
    description:
      "Talking-head UGC, program pricing, and how to hire an in-house agency. Written by the Vo Creations founders.",
    url: "https://vocreations.com/blog",
    siteName: "Vo Creations",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vo Creations: make them remember.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VoCreationsUGC",
    title: "UGC insights | Vo Creations",
    description:
      "Talking-head UGC, program pricing, and how to hire an in-house agency. Written by the Vo Creations founders.",
    images: ["/og-image.png"],
  },
};

const xPosts = [
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
];

const ordered = [...posts].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

export default function BlogIndex() {
  return (
    <>
      <Nav />
      <main id="main" className="px-6 pb-24 pt-36">
        <div className="mx-auto max-w-[720px]">
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-[2.5px] text-text-secondary">Blog</p>
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
