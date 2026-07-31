import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://vocreations.com";

  return [
    {
      url: base,
      lastModified: new Date("2026-03-24"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
