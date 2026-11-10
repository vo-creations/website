import type { Metadata } from "next";

export const BOOKING_URL = "https://calendly.com/vocreations/vo-creations-agency-discovery-call";

export const DEFAULT_OG_IMAGE = {
  src: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Vo Creations: make them remember.",
};

export type AuthorId = "thienvu" | "daniel";

export type BlogAuthor = {
  id: AuthorId;
  name: string;
  url: string;
  bio: string;
};

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  /** 40-60 words. Rendered under the H1 and reused as the index dek. */
  directAnswer: string;
  datePublished: string;
  dateModified: string;
  authorId: AuthorId;
  readingMinutes: number;
  related: [string, string, string];
  image?: { src: string; width: number; height: number; alt: string };
};

export const authors: Record<AuthorId, BlogAuthor> = {
  thienvu: {
    id: "thienvu",
    name: "Thienvu Vo",
    url: "https://x.com/itsthienvuvo",
    bio: "Thienvu Vo is a co-founder of Vo Creations in New York, NY.",
  },
  daniel: {
    id: "daniel",
    name: "Daniel Yun",
    url: "https://www.linkedin.com/in/danielyun27",
    bio: "Daniel Yun is a co-founder of Vo Creations in Los Angeles, CA.",
  },
};

export const posts: BlogPostMeta[] = [
  {
    slug: "ugc-agency-vs-in-house",
    title: "UGC agency vs in-house: which one actually scales",
    description:
      "An in-house UGC agency, a marketplace, and freelancers differ on who trains the creators, who posts, and who watches the numbers every day.",
    category: "Models",
    directAnswer:
      "An in-house UGC agency trains the creators, writes the scripts, and posts the videos. A marketplace sells you a video. Freelancers are people you hire and manage. The agency costs more per month because the bench, the coaching, and the daily reporting are the product. You are buying a system, not a folder of files.",
    datePublished: "2026-11-03",
    dateModified: "2026-11-03",
    authorId: "daniel",
    readingMinutes: 7,
    related: [
      "in-house-creator-programs-stall",
      "ugc-agency-pricing",
      "ugc-vs-paid-ads-app-growth",
    ],
  },
  {
    slug: "ugc-agency-pricing",
    title: "UGC agency pricing: what $50K/month buys",
    description:
      "A managed UGC program starts at $50K+ a month and guarantees your target CPM. At $1 that is about 50 million organic views. At $4 it is about 12.5 million.",
    category: "Pricing",
    directAnswer:
      "A managed UGC program starts at $50K+ a month and guarantees your target CPM. At a $1 CPM that is about 50 million organic views. At $4 it is about 12.5 million. Trained creators, scripts, editing, posting, and daily reporting are included. Paid ad spend is billed separately. The minimum is 90 days, then month to month.",
    datePublished: "2026-11-03",
    dateModified: "2026-11-03",
    authorId: "daniel",
    readingMinutes: 7,
    related: [
      "ugc-vs-paid-ads-app-growth",
      "ugc-agency-vs-in-house",
      "questions-before-hiring-a-ugc-agency",
    ],
  },
  {
    slug: "ugc-for-ai-startups",
    title: "UGC for AI startups: why talking-head video beats a product demo",
    description:
      "AI products are abstract. A talking-head video starts from a problem a person has lived. A product demo starts from the interface. Here is when each one belongs.",
    category: "AI",
    directAnswer:
      "UGC for an AI startup is a trained creator telling a story the user has already lived, with the product inside that story. A product demo starts at the interface and asks a stranger to care about a screen. Talking-head video earns the pause first. The demo still belongs, as one moment inside the story, not as the whole video.",
    datePublished: "2026-03-18",
    dateModified: "2026-11-03",
    authorId: "thienvu",
    readingMinutes: 6,
    related: [
      "text-on-screen-ugc",
      "ugc-agency-vs-in-house",
      "ugc-vs-paid-ads-app-growth",
    ],
  },
  {
    slug: "questions-before-hiring-a-ugc-agency",
    title: "12 questions to ask before hiring a UGC agency",
    description:
      "Twelve questions that separate a managed UGC program from a folder of videos: who trains, who posts, who owns the accounts, and what the month includes.",
    category: "Hiring",
    directAnswer:
      "Before you hire a UGC agency, ask who trains the creators, who posts, who owns the accounts, and what the month includes. A managed program can answer those in operating terms. A vendor selling files will answer them with a rate card. The gap between those two answers is the whole decision.",
    datePublished: "2026-11-02",
    dateModified: "2026-11-03",
    authorId: "thienvu",
    readingMinutes: 8,
    related: [
      "ugc-agency-pricing",
      "ugc-agency-vs-in-house",
      "ugc-vs-paid-ads-app-growth",
    ],
  },
  {
    slug: "ugc-vs-paid-ads-app-growth",
    title: "UGC vs paid ads for app growth",
    description:
      "Paid ads rent attention. Organic UGC is a person the viewer trusts, and the comment section keeps selling after the view.",
    category: "Growth",
    directAnswer:
      "Paid ads rent attention and stop when the budget stops. Organic UGC is a person the viewer trusts, and the comment section keeps selling after the view. At a $1 CPM, $50K buys about 50 million organic views. At $4 it buys about 12.5 million. The comparison is views per dollar, then what those views do.",
    datePublished: "2026-11-03",
    dateModified: "2026-11-03",
    authorId: "daniel",
    readingMinutes: 6,
    related: [
      "ugc-agency-pricing",
      "in-house-creator-programs-stall",
      "text-on-screen-ugc",
    ],
  },
  {
    slug: "in-house-creator-programs-stall",
    title: "Why in-house creator programs stall at 5 to 10 creators",
    description:
      "A bench of five to ten creators is too small for a power law, and a brief is not coaching. The program stalls when nobody owns the daily numbers.",
    category: "Operations",
    directAnswer:
      "In-house creator programs stall because the bench is too small for a power law, nobody owns the daily numbers, and the creators are briefed instead of coached. Five to ten creators cannot find the breakout or replace them when they leave. A bench that works is large, coached every week, and moved toward whatever is getting views.",
    datePublished: "2026-11-03",
    dateModified: "2026-11-03",
    authorId: "thienvu",
    readingMinutes: 6,
    related: [
      "ugc-agency-vs-in-house",
      "ugc-vs-paid-ads-app-growth",
      "ugc-agency-pricing",
    ],
  },
  {
    slug: "text-on-screen-ugc",
    title: "Why text-on-screen UGC is killing your app growth",
    description:
      "Text-on-screen explains a product and gets swiped. Talking-head UGC is a person telling a story the viewer has lived. Here is the difference.",
    category: "Format",
    directAnswer:
      "Text-on-screen UGC puts a caption, a sound, and a product shot in front of someone and calls it content. It explains the product and then gets swiped. Talking-head UGC is a real person telling a story the viewer has lived, with the product inside that story. That is the format that earns the comment, the follow, and the install.",
    datePublished: "2026-01-06",
    dateModified: "2026-10-30",
    authorId: "thienvu",
    readingMinutes: 6,
    related: [
      "ugc-for-ai-startups",
      "ugc-agency-vs-in-house",
      "ugc-vs-paid-ads-app-growth",
    ],
    image: {
      src: "/blog/text-vs-talking.jpg",
      width: 2048,
      height: 819,
      alt: "Text-on-screen vs talking-head storytelling, side by side comparison",
    },
  },
];

export function getPost(slug: string): BlogPostMeta {
  const post = posts.find((item) => item.slug === slug);
  if (!post) throw new Error(`Unknown blog post: ${slug}`);
  return post;
}

export function postUrl(slug: string): string {
  return `https://vocreations.com/blog/${slug}`;
}

export function blogPostMetadata(slug: string): Metadata {
  const post = getPost(slug);
  const image = {
    src: `/og/blog/${post.slug}.png`,
    width: 1200,
    height: 630,
    alt: post.title,
  };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl(post.slug),
      siteName: "Vo Creations",
      type: "article",
      publishedTime: `${post.datePublished}T00:00:00Z`,
      modifiedTime: `${post.dateModified}T00:00:00Z`,
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@VoCreationsUGC",
      title: post.title,
      description: post.description,
      images: [image.src],
    },
  };
}

export function formatBlogDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
