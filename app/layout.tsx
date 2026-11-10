import type { Metadata } from "next";
import Script from "next/script";
import { Instrument_Serif, Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import VeilBackground from "@/components/VeilBackground";
import { CONTACT_EMAILS } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["200", "300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});

const SITE_DESCRIPTION =
  "Organic UGC for AI and consumer apps: 1B+ views since Jan 2026, 1,000+ trained creators, your target CPM guaranteed.";

export const metadata: Metadata = {
  title: {
    default: "Vo Creations: In-House UGC Team for AI & Consumer Apps",
    template: "%s | Vo Creations",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://vocreations.com"),
  alternates: {
    canonical: "https://vocreations.com/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Vo Creations: In-House UGC Team for AI & Consumer Apps",
    description: SITE_DESCRIPTION,
    url: "https://vocreations.com/",
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
    title: "Vo Creations: In-House UGC Team for AI & Consumer Apps",
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://vocreations.com/#organization",
  name: "Vo Creations",
  url: "https://vocreations.com/",
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    addressLocality: "New York",
  },
  logo: "https://vocreations.com/brand/vo-mark.png",
  description:
    "UGC agency that trains its own creators in-house. Talking-head storytelling for AI startups and consumer apps. Results: an AI creative platform, 130M+ views in 12 weeks, under $3 CPM. A fitness social app, 174M+ views in 90 days, $0.82 average CPM, 50 creators. An AI video generation app, 72M+ views in 35 days, ~$0.96 CPM, 45 creators. A consumer finance app, 3M+ users up from 625K in June, sub-$4 CPM. A test prep app, $968K ARR from organic UGC, 55M views, 32 creators tracked, Feb–Sep 2026.",
  founder: [
    {
      "@type": "Person",
      name: "Thienvu Vo",
      jobTitle: "Co-Founder",
      url: "https://x.com/itsthienvuvo",
      address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY" },
    },
    {
      "@type": "Person",
      name: "Daniel Yun",
      jobTitle: "Co-Founder",
      url: "https://www.linkedin.com/in/danielyun27",
      sameAs: ["https://www.linkedin.com/in/danielyun27"],
      address: { "@type": "PostalAddress", addressLocality: "Los Angeles", addressRegion: "CA" },
    },
  ],
  // Brand profiles only. Personal IG/TikTok/YouTube stay out.
  // Daniel confirmed the brand Instagram on 2026-10-26. See DECISIONS
  // topic: brand-profiles-2026-10.
  sameAs: [
    "https://x.com/VoCreationsUGC",
    "https://www.linkedin.com/company/vocreations/",
    "https://www.instagram.com/vo.creations/",
  ],
  contactPoint: CONTACT_EMAILS.map((email) => ({
    "@type": "ContactPoint",
    email,
    contactType: "customer support",
    url: `mailto:${email}`,
  })),
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
  url: "https://vocreations.com/",
  publisher: { "@id": "https://vocreations.com/#organization" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "In-house UGC program",
  serviceType: "UGC content",
  provider: { "@id": "https://vocreations.com/#organization" },
  areaServed: "US",
  description:
    "Organic UGC for AI startups and consumer apps, made by creators trained in-house. Talking-head videos across TikTok, Instagram, YouTube, Facebook, and Snapchat. Results: an AI creative platform, 130M+ views in 12 weeks, under $3 CPM. A fitness social app, 174M+ views in 90 days, $0.82 average CPM. An AI video generation app, 72M+ views in 35 days, ~$0.96 CPM. A consumer finance app, 3M+ users, sub-$4 CPM. A test prep app, $968K ARR from organic UGC and 55M views.",
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
      "Campaigns start at $50K+/month, all-inclusive: trained creators, scripts, posting, creator bonuses, and daily Slack reporting. We guarantee your target CPM. CPM means cost per 1,000 organic views. Videos under 1,000 views do not count toward your CPM. Paid media, the ad spend, is outside the fee and billed on top. 90-day minimum, then month to month. No refunds after launch.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;document.documentElement.classList.add("js-motion");}catch(e){}})();`,
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
      <body className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable} ${jetbrains.variable} relative font-sans bg-bg text-text antialiased overflow-x-hidden`}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* DECISION 2026-11: lazyOnload keeps gtag off the LCP path. Tracking still runs after load. */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-1TESF8060F" strategy="lazyOnload" />
        <Script id="ga-gtag" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-1TESF8060F');`}
        </Script>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          {/* Silver silk. The sheet drifts in CSS. Grain stays still.
              See docs/DECISIONS.md (topic: silk-drift-2026-11). */}
          <VeilBackground />
          <div className="film-grain absolute inset-0" />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
