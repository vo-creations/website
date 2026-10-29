import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import VeilBackground from "@/components/VeilBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["500", "600", "700", "800"],
});

const SITE_DESCRIPTION =
  "UGC agency for AI startups and consumer apps. In-house creator programs, 1B+ views, and 1000+ creators.";

export const metadata: Metadata = {
  title: {
    default: "Vo Creations: UGC Agency for Startups & Consumer Apps",
    template: "%s | Vo Creations",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://vocreations.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Vo Creations: Make Them Remember.",
    description: SITE_DESCRIPTION,
    url: "https://vocreations.com",
    siteName: "Vo Creations",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vo Creations: make them remember.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VoCreationsUGC",
    title: "Vo Creations: Make Them Remember.",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vo Creations",
  url: "https://vocreations.com",
  logo: "https://vocreations.com/vocreations-logo.webp",
  description:
    "UGC agency that trains its own creators in-house. Specializing in talking-head storytelling for AI startups and consumer apps.",
  founder: [
    {
      "@type": "Person",
      name: "Thienvu Vo",
      jobTitle: "Co-Founder",
      url: "https://x.com/itsthienvuvo",
    },
    {
      "@type": "Person",
      name: "Daniel Yun",
      jobTitle: "Co-Founder",
      url: "https://www.linkedin.com/in/danielyun27",
    },
  ],
  // Brand profiles only. Personal IG/TikTok/YouTube stay out.
  // Daniel confirmed the brand Instagram on 2026-10-26. See DECISIONS
  // topic: brand-profiles-2026-10.
  sameAs: [
    "https://x.com/VoCreationsUGC",
    "https://www.linkedin.com/company/vocreations",
    "https://www.instagram.com/vo.creations/",
  ],
  knowsAbout: [
    "User-Generated Content",
    "UGC Agency",
    "TikTok Marketing",
    "Creator Training",
    "Talking-Head UGC",
    "UGC for Startups",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vo Creations",
  url: "https://vocreations.com",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "In-house UGC program",
  serviceType: ["UGC content", "UGC ads"],
  provider: {
    "@type": "Organization",
    name: "Vo Creations",
    url: "https://vocreations.com",
  },
  areaServed: "US",
  description:
    "Organic UGC and UGC ads for AI startups and consumer apps, made by creators trained in-house. Talking-head videos across TikTok, Instagram, YouTube, and Facebook.",
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    // DECISION 2026-10: starting-at price uses UnitPriceSpecification minPrice only, no flat price — see docs/DECISIONS.md
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      minPrice: "50000",
      priceCurrency: "USD",
      unitText: "MONTH",
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: 1,
        unitCode: "MON",
      },
    },
    description:
      "Campaigns start at $50K+/month, all-inclusive: trained creators, scripts, posting, creator bonuses, and weekly reporting. We guarantee the client's target CPM (cost per 1,000 organic views). Videos under 1,000 views do not count toward the spend. 90-day minimum, then month to month. No refunds after launch.",
    url: "https://vocreations.com/#faq",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1TESF8060F" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-1TESF8060F');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd),
          }}
        />
      </head>
      <body className={`${inter.variable} ${interTight.variable} font-sans bg-bg text-text antialiased overflow-x-hidden`}>
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        >
          {/* Silver silk, not the old cream tint. WebGL is desktop-only and
              idle-deferred. See docs/DECISIONS.md (topic: brand-system-2026-10). */}
          <VeilBackground />
          <div className="film-grain absolute inset-0" />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
