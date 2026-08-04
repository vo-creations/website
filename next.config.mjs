/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  async redirects() {
    return [
      // Single-page consolidation (2026-07): /about, /creators, /roi, /blog
      // merged into homepage sections. See docs/DECISIONS.md (topic: single-page-site).
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
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/",
        permanent: true,
      },
      // Agency-only redesign (2026-08): /mentorship + /pre-call funnel dropped.
      // See docs/DECISIONS.md (topic: agency-only-redesign).
      {
        source: "/mentorship",
        destination: "/",
        permanent: true,
      },
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
