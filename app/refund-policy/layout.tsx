import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/refund-policy" },
  title: "Refund Policy",
  description:
    "Vo Creations agency campaigns: no refunds after launch. 90-day minimum, then month to month.",
  openGraph: {
    title: "Refund Policy | Vo Creations",
    description:
      "No refunds after a Vo Creations campaign launches. 90-day minimum, then month to month.",
    url: "https://vocreations.com/refund-policy",
    siteName: "Vo Creations",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vo Creations Refund Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | Vo Creations",
    description:
      "No refunds after a Vo Creations campaign launches. 90-day minimum, then month to month.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
