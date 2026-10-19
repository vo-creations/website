import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import DarkVeil from "@/components/DarkVeil";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_DESCRIPTION =
  "UGC agency for AI startups and consumer apps. In-house creator programs, 1B+ views, and 500+ trained creators.";

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
  // Brand profiles only. Personal IG/TikTok/YouTube were removed.
  // Instagram @vocreationsugc could not be verified (Instagram answers
  // 200 for unknown paths), so it is left out. See DECISIONS
  // topic: seo-aeo-2026-10.
  sameAs: [
    "https://x.com/VoCreationsUGC",
    "https://www.linkedin.com/company/vocreations",
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
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: "50000",
      price: "50000",
      priceCurrency: "USD",
      unitText: "MONTH",
    },
    description:
      "Campaigns start at $50K/month. Creator bonuses are billed separately.",
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
      <body className={`${inter.variable} ${bricolageGrotesque.variable} font-sans bg-bg text-text antialiased overflow-x-hidden`}>
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-50"
        >
          {/* DECISION 2026-08: reintroduced a subtle cream (#F7F0DD) tint,
              not the old full sepia wash from before the black-and-white
              conversion. tintAmount 0.8, not DarkVeil's default 1.0 (fully
              tinted) or the first attempt's 0.4 (measured via actual pixel
              sampling on a real screenshot, not eyeballed — 0.4 produced
              only a ~2-4/255 R-vs-B channel spread even at the pattern's
              brightest points, imperceptible in practice). Cream itself is
              a low-saturation color, so even at 0.8 the spread stays
              modest; this isn't the old dramatic cookies-and-cream palette
              back, just enough to read as intentional warmth instead of a
              fully neutral grayscale template. Sitewide (this component
              renders once in layout), but it's most visible behind the
              hero specifically, since every section below it sits on its
              own opaque/near-opaque card background that mostly covers
              this layer. See docs/DECISIONS.md (topic:
              darkveil-cream-tint). */}
          <DarkVeil
            speed={0.35}
            resolutionScale={0.75}
            tint={[0.9686, 0.9412, 0.8667]}
            tintAmount={0.8}
          />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
