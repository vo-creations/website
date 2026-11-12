export type CaseStat = { label: string; value: string; note?: string };
export type CaseClip = {
  src: string;
  poster: string;
  label: string;
  proof: string;
};

export const caseStudies = [
  {
    slug: "fomo",
    name: "fomo",
    title: "fomo: #3 in US App Store Top Free Finance",
    description:
      "Trained creators helped fomo grow from 625K to 3M+ users and reach #3 in US App Store Top Free Finance, ahead of Cash App and Kalshi, at under $4 CPM.",
    date: "2026-11-03",
    logo: "/logos/fomo.png",
    figure: "3M+",
    outcome: "users, up from 625K, under $4 CPM",
    // DECISION 2026-11: four color clips, name and view count only.
    // No handles or post URLs. The board leads the story.
    // See docs/DECISIONS.md (topic: fomo-clip-board-2026-11).
    leadClips: true,
    clips: [
      {
        src: "/videos/fomo-timmy-pham.mp4",
        poster: "/videos/fomo-timmy-pham.jpg",
        label: "Timmy Pham",
        proof: "2.4M views",
      },
      {
        src: "/videos/fomo-bella.mp4",
        poster: "/videos/fomo-bella.jpg",
        label: "Bella",
        proof: "93.4K views",
      },
      {
        src: "/videos/fomo-kat.mp4",
        poster: "/videos/fomo-kat.jpg",
        label: "Kat",
        proof: "25.5K views",
      },
      {
        src: "/videos/fomo-lukas.mp4",
        poster: "/videos/fomo-lukas.jpg",
        label: "Lukas",
        proof: "20.5K views",
      },
    ] as CaseClip[],
    stats: [
      { label: "Client", value: "fomo" },
      { label: "Category", value: "Consumer finance app" },
      { label: "Duration", value: "June–August 2026" },
      { label: "Business outcome", value: "625K to 3M+ users" },
      { label: "Share of users from creators", value: "~50%, all of them Vo creators" },
      { label: "Chart position", value: "#3 in US App Store Top Free Finance, Aug 21, 2026" },
      { label: "CPM", value: "Under $4" },
    ] as CaseStat[],
  },
  {
    slug: "liftoff",
    name: "Liftoff",
    title: "Liftoff: 174M+ views in 90 days at a $0.82 CPM",
    description:
      "50 Vo Creations creators drove 174M+ organic views for Liftoff in 90 days (May 1–Jul 31, 2026) at a $0.82 CPM, with zero paid ads.",
    date: "2026-11-03",
    logo: "/logos/liftoff.png",
    figure: "174M+",
    outcome: "$0.82 CPM in 90 days, zero paid ads",
    // [NEED: client clips + handles]
    clips: [] as CaseClip[],
    stats: [
      { label: "Client", value: "Liftoff" },
      { label: "Category", value: "Fitness app" },
      { label: "Duration", value: "May 1 – July 31, 2026" },
      { label: "Creators", value: "50" },
      { label: "Total views", value: "174M+ (dashboard: 174.2M)" },
      { label: "Business outcome", value: "Zero paid ads" },
      { label: "CPM", value: "$0.82, our lowest" },
    ] as CaseStat[],
  },
  {
    slug: "higgsfield",
    name: "Higgsfield",
    title: "Higgsfield: 72M+ views in 35 days",
    description:
      "45 Vo Creations creators drove 72M+ organic views for Higgsfield's AI video app in 35 days (Jun 29–Aug 3, 2026) at about $0.96 CPM.",
    date: "2026-11-03",
    logo: "/logos/higgsfield.png",
    figure: "72M+",
    outcome: "~$0.96 CPM in 35 days",
    // Kelly Zhao’s Higgsfield clip from Creator work. No handle is on file.
    clips: [
      {
        src: "/videos/creator-kelly.mp4",
        poster: "/videos/creator-kelly.jpg",
        label: "TikTok",
        proof: "2.2M views",
      },
    ] as CaseClip[],
    stats: [
      { label: "Client", value: "Higgsfield" },
      { label: "Category", value: "AI video app" },
      { label: "Duration", value: "June 29 – August 3, 2026" },
      { label: "Creators", value: "45" },
      { label: "Total views", value: "72M+", note: "Dashboard: 72.5M" },
      { label: "Engagements", value: "1.1M (1.5% rate)" },
      { label: "CPM", value: "~$0.96" },
    ] as CaseStat[],
  },
  {
    slug: "krea",
    name: "Krea",
    title: "Krea: 130M+ views in 12 weeks, and still growing",
    description:
      "Vo Creations creators drove 130M+ organic views for Krea's AI creative platform in 12 weeks at under $3 CPM, with 4.7M engagements, and it's still growing.",
    date: "2026-11-03",
    logo: "/logos/krea.png",
    figure: "130M+",
    outcome: "under $3 CPM in 12 weeks, still growing",
    // DECISION 2026-11: eight Launchpoint clips, name and rounded view count only.
    // No handles or post URLs were on file. The board leads the story.
    // See docs/DECISIONS.md (topic: krea-clip-board-2026-11).
    leadClips: true,
    clips: [
      {
        src: "/videos/krea-cat-vancity.mp4",
        poster: "/videos/krea-cat-vancity.jpg",
        label: "Cat Vancity",
        proof: "4.8M views",
      },
      {
        src: "/videos/krea-sarah-stiles.mp4",
        poster: "/videos/krea-sarah-stiles.jpg",
        label: "Sarah Stiles",
        proof: "4.0M views",
      },
      {
        src: "/videos/krea-william-pham.mp4",
        poster: "/videos/krea-william-pham.jpg",
        label: "William Pham",
        proof: "1.4M views",
      },
      {
        src: "/videos/krea-enya-cheng.mp4",
        poster: "/videos/krea-enya-cheng.jpg",
        label: "Enya Cheng",
        proof: "1.2M views",
      },
      {
        src: "/videos/krea-leon-song.mp4",
        poster: "/videos/krea-leon-song.jpg",
        label: "Leon Song",
        proof: "1.2M views",
      },
      {
        src: "/videos/krea-ej-mae-palafox.mp4",
        poster: "/videos/krea-ej-mae-palafox.jpg",
        label: "EJ Mae Palafox",
        proof: "1.1M views",
      },
      {
        src: "/videos/krea-zion-raines.mp4",
        poster: "/videos/krea-zion-raines.jpg",
        label: "Zion Raines",
        proof: "1.0M views",
      },
      {
        src: "/videos/krea-claudia-wong.mp4",
        poster: "/videos/krea-claudia-wong.jpg",
        label: "Claudia Wong",
        proof: "1.0M views",
      },
    ] as CaseClip[],
    stats: [
      { label: "Client", value: "Krea" },
      { label: "Category", value: "AI creative platform" },
      { label: "Duration", value: "Jul 28 – Oct 18, 2026" },
      { label: "Total views", value: "130M+ (dashboard: 130.6M)" },
      { label: "Engagements", value: "4.7M (4.7% rate); 1.8M likes" },
      { label: "Status", value: "Still growing" },
      { label: "CPM", value: "Under $3" },
    ] as CaseStat[],
  },
] as const;

export function caseStudyBySlug(slug: string) {
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) throw new Error(`Unknown case study: ${slug}`);
  return study;
}

export const caseStudyOgImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Vo Creations",
};
