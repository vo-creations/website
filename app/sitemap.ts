import type { MetadataRoute } from "next";

const base = "https://vocreations.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: base,
      lastModified: new Date("2026-10-18"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date("2026-10-18"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/blog/text-on-screen-ugc`,
      lastModified: new Date("2026-03-24"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${base}/refund-policy`,
      lastModified: new Date("2026-07-31"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
