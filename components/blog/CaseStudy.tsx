import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { authors, formatBlogDate } from "@/lib/blog/posts";

const PUBLISHED = "2026-11-03";

export default function CaseStudy({
  slug,
  title,
  description,
  children,
}: {
  slug: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const url = `https://vocreations.com/case-studies/${slug}`;
  const author = authors.daniel;
  const date = formatBlogDate(PUBLISHED);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: title,
        description,
        datePublished: `${PUBLISHED}T00:00:00Z`,
        dateModified: `${PUBLISHED}T00:00:00Z`,
        author: { "@type": "Person", name: author.name, url: author.url },
        publisher: {
          "@type": "Organization",
          "@id": "https://vocreations.com/#organization",
          name: "Vo Creations",
          url: "https://vocreations.com/",
          logo: {
            "@type": "ImageObject",
            url: "https://vocreations.com/brand/vo-mark.png",
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://vocreations.com/" },
          { "@type": "ListItem", position: 2, name: "Results", item: "https://vocreations.com/#results" },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="editorial blog-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav variant="editorial" />
      <main id="main" className="blog-main">
        <article>
          <nav aria-label="Breadcrumb" className="mb-6 text-[15px] text-text-dim">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-text">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#results" className="hover:text-text">
                  Results
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-text-secondary">{title}</li>
            </ol>
          </nav>
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-[2px] text-text-dim">Case study</p>
          <h1 className="mb-5 font-display text-[clamp(32px,5vw,48px)] font-extrabold leading-[1.1] tracking-tight text-[#EEF0F4]">
            {title}
          </h1>
          <p className="mb-8 text-[15px] text-text-dim">
            <a href={author.url} className="font-semibold text-text-secondary hover:text-text">
              {author.name}
            </a>
            <span> · {date}</span>
          </p>
          <div className="space-y-4 text-[17px] leading-[1.65] text-text-secondary [&_strong]:font-semibold [&_strong]:text-text">
            {children}
          </div>
        </article>
      </main>
      <Footer tone="editorial" />
    </div>
  );
}
