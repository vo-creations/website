import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms",
  description:
    "Website and services terms for Vo Creations LLC. Campaigns follow each client agreement.",
  openGraph: {
    title: "Terms",
    description:
      "Website and services terms for Vo Creations LLC. Campaigns follow each client agreement.",
    url: "https://vocreations.com/terms",
    siteName: "Vo Creations",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vo Creations" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VoCreationsUGC",
    title: "Terms",
    description:
      "Website and services terms for Vo Creations LLC. Campaigns follow each client agreement.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
