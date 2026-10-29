import type { Metadata } from "next";

export const BOOKING_URL = "https://calendar.app.google/8x72A8nxr3gQpVfx7";

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
    slug: "in-house-ugc-vs-marketplace-vs-freelancers",
    title: "In-house UGC agency vs marketplace vs freelancers",
    description:
      "How an in-house UGC agency, a marketplace, and a freelancer differ on who trains the creator, who posts, and what you still have to manage.",
    category: "Models",
    directAnswer:
      "An in-house UGC agency trains creators and runs the posting as your program. A marketplace sells you access to people who will make a file. A freelancer is one person you manage yourself. The right buy is the one that matches whether you need a system or a single video.",
    datePublished: "2026-10-28",
    dateModified: "2026-10-28",
    authorId: "daniel",
    readingMinutes: 5,
    related: [
      "what-a-managed-ugc-program-costs",
      "questions-before-hiring-a-ugc-agency",
      "ugc-for-ai-startups",
    ],
  },
  {
    slug: "what-a-managed-ugc-program-costs",
    title: "What a managed UGC program costs",
    description:
      "Retainer, per-video, and CPM are different purchases. A Vo Creations program starts at $50K+ a month, all-inclusive, and guarantees the client's target CPM.",
    category: "Pricing",
    directAnswer:
      "A managed UGC program at Vo Creations starts at $50K+ a month, all-inclusive: trained creators, scripts, posting, creator bonuses, and daily Slack reporting. CPM means cost per 1,000 organic views. We guarantee your target CPM. Videos under 1,000 views do not count toward your CPM. 90 days, then month to month. No refunds after launch.",
    datePublished: "2026-10-28",
    dateModified: "2026-10-28",
    authorId: "daniel",
    readingMinutes: 6,
    related: [
      "in-house-ugc-vs-marketplace-vs-freelancers",
      "questions-before-hiring-a-ugc-agency",
      "text-on-screen-ugc",
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
    datePublished: "2026-10-28",
    dateModified: "2026-10-28",
    authorId: "thienvu",
    readingMinutes: 6,
    related: [
      "text-on-screen-ugc",
      "in-house-ugc-vs-marketplace-vs-freelancers",
      "questions-before-hiring-a-ugc-agency",
    ],
  },
  {
    slug: "questions-before-hiring-a-ugc-agency",
    title: "12 questions to ask before hiring a UGC agency",
    description:
      "Twelve questions that separate a managed UGC program from a folder of videos: training, posting, volume, term, the fee, refunds, and proof.",
    category: "Hiring",
    directAnswer:
      "Before you hire a UGC agency, ask who trains the creators, who posts, what the month includes, and what happens when a video misses. A managed program can answer those in operating terms. A vendor selling files will answer them with a rate card. The gap between those two answers is the whole decision.",
    datePublished: "2026-10-28",
    dateModified: "2026-10-28",
    authorId: "thienvu",
    readingMinutes: 6,
    related: [
      "in-house-ugc-vs-marketplace-vs-freelancers",
      "what-a-managed-ugc-program-costs",
      "ugc-for-ai-startups",
    ],
  },
  {
    slug: "text-on-screen-ugc",
    title: "Why Text-On-Screen UGC Is Killing Your App Growth",
    description:
      "Text-on-screen explains a product and gets swiped. Talking-head UGC is a person telling a story the viewer has lived. Here is the difference.",
    category: "Format",
    directAnswer:
      "Text-on-screen UGC puts a caption, a sound, and a product shot in front of someone and calls it content. It explains the product and then gets swiped. Talking-head UGC is a real person telling a story the viewer has lived, with the product inside that story. That is the format that earns the comment, the follow, and the install.",
    datePublished: "2026-03-24",
    dateModified: "2026-10-28",
    authorId: "thienvu",
    readingMinutes: 6,
    related: [
      "ugc-for-ai-startups",
      "in-house-ugc-vs-marketplace-vs-freelancers",
      "questions-before-hiring-a-ugc-agency",
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
      type: "article",
      publishedTime: `${post.datePublished}T00:00:00Z`,
      modifiedTime: `${post.dateModified}T00:00:00Z`,
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
    },
    twitter: {
      card: "summary_large_image",
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
