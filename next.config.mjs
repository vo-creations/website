/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cap the srcset so small avatars are not offered a 3840w candidate.
    // See docs/DECISIONS.md (topic: seo-aeo-2026-10).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  async redirects() {
    return [
      // Single-page consolidation (2026-07): /about, /creators, /roi merged
      // into homepage sections. /blog was restored in 2026-10.
      // See docs/DECISIONS.md (topic: single-page-site, seo-aeo-2026-10).
      {
        source: "/about",
        destination: "/#team",
        permanent: true,
      },
      {
        source: "/creators",
        destination: "/",
        permanent: true,
      },
      {
        source: "/roi",
        destination: "/",
        permanent: true,
      },
      // The indexed long slug never existed as a route. The post lives at
      // /blog/text-on-screen-ugc. See docs/DECISIONS.md (topic: seo-aeo-2026-10).
      {
        source: "/blog/why-text-on-screen-ugc-is-killing-your-app-growth",
        destination: "/blog/text-on-screen-ugc",
        permanent: true,
      },
      // /mentorship is a 410 from app/mentorship/route.ts (retired creator
      // funnel). Do not redirect it here. /pre-call was only the booking
      // step of that funnel and was not a content page.
      // See docs/DECISIONS.md (topic: seo-aeo-2026-10).
      {
        source: "/pre-call",
        destination: "/",
        permanent: true,
      },
      // Old Squarespace pages → homepage (permanent redirects)
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/",
        permanent: true,
      },
      {
        source: "/Full",
        destination: "/",
        permanent: true,
      },
      {
        source: "/privacy-policy-3975-8774-8031-8438-2279-3890",
        destination: "/",
        permanent: true,
      },
      {
        source: "/terms-and-conditions-4338-7294-8836-7704-3508-2366",
        destination: "/",
        permanent: true,
      },
      {
        source: "/landing-page",
        destination: "/",
        permanent: true,
      },
      {
        source: "/thanks-for-applying",
        destination: "/",
        permanent: true,
      },
      // Squarespace build artifacts
      {
        source: "/tmp/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
