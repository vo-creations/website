export const caseStudies = [
  {
    slug: "fomo",
    title: "FOMO: #3 in US App Store Top Free Finance",
    description:
      "Trained creators helped FOMO grow from 625K to 3M+ users and reach #3 in US App Store Top Free Finance, ahead of Cash App and Kalshi, at under $4 CPM.",
    date: "2026-11-03",
  },
  {
    slug: "liftoff",
    title: "Liftoff: 174M+ views in 90 days at a $0.82 CPM",
    description:
      "50 Vo Creations creators drove 174M+ organic views for Liftoff in 90 days (May 1–Jul 31, 2026) at a $0.82 CPM, with zero paid ads.",
    date: "2026-11-03",
  },
  {
    slug: "higgsfield",
    title: "Higgsfield: 72M+ views in 35 days",
    description:
      "45 Vo Creations creators drove 72M+ organic views for Higgsfield's AI video app in 35 days (Jun 29–Aug 3, 2026) at about $0.96 CPM.",
    date: "2026-11-03",
  },
  {
    slug: "krea",
    title: "Krea: 130M+ views in 3 months, and still growing",
    description:
      "Vo Creations creators drove 130M+ organic views for Krea's AI creative platform in 3 months at under $3 CPM, with 4.7M engagements, and it's still growing.",
    date: "2026-11-03",
  },
] as const;

export function caseStudyBySlug(slug: string) {
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) throw new Error(`Unknown case study: ${slug}`);
  return study;
}
