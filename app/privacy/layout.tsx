import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description:
    "How Vo Creations LLC collects and uses information when you book a call, email, or browse vocreations.com.",
  openGraph: {
    title: "Privacy Policy",
    description:
      "How Vo Creations LLC collects and uses information when you book a call, email, or browse vocreations.com.",
    url: "https://vocreations.com/privacy",
    siteName: "Vo Creations",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Vo Creations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description:
      "How Vo Creations LLC collects and uses information when you book a call, email, or browse vocreations.com.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
