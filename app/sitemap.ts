import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog/posts";

const base = "https://vocreations.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const newest = posts.reduce((latest, post) =>
    post.dateModified > latest ? post.dateModified : latest
  , posts[0].dateModified);

  return [
    {
      url: base,
      lastModified: new Date("2026-10-18"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(`${newest}T00:00:00Z`),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(`${post.dateModified}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: `${base}/refund-policy`,
      lastModified: new Date("2026-07-31"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
