import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog/posts";
import { caseStudies } from "@/lib/case-studies";
import { privacyUpdated, refundUpdated, termsUpdated } from "@/lib/content-dates";

const base = "https://vocreations.com";

function fromIso(iso: string) {
  return new Date(`${iso}T00:00:00Z`);
}

function latest(dates: string[]) {
  return dates.reduce((max, iso) => (iso > max ? iso : max));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const postModified = posts.map((post) => post.dateModified);
  const newestPost = latest(postModified);
  // The homepage journal prints these dates, so its lastmod is the newest one.
  const homepage = latest(posts.flatMap((post) => [post.datePublished, post.dateModified]));

  return [
    {
      url: `${base}/`,
      lastModified: fromIso(homepage),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      lastModified: fromIso(newestPost),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: fromIso(post.dateModified),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: `${base}/case-studies`,
      lastModified: fromIso(latest(caseStudies.map((study) => study.date))),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...caseStudies.map((study) => ({
      url: `${base}/case-studies/${study.slug}`,
      lastModified: fromIso(study.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    {
      url: `${base}/privacy`,
      lastModified: fromIso(privacyUpdated),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: fromIso(termsUpdated),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/refund-policy`,
      lastModified: fromIso(refundUpdated),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
