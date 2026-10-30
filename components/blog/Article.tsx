import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  authors,
  BOOKING_URL,
  formatBlogDate,
  getPost,
  posts,
  postUrl,
  type BlogPostMeta,
} from "@/lib/blog/posts";

export type TocItem = { id: string; label: string };
export type FaqItem = { question: string; answer: string };

function articleJsonLd(post: BlogPostMeta, faqs: FaqItem[]) {
  const url = postUrl(post.slug);
  const author = authors[post.authorId];
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: post.title,
      description: post.description,
      datePublished: `${post.datePublished}T00:00:00Z`,
      dateModified: `${post.dateModified}T00:00:00Z`,
      author: { "@type": "Person", name: author.name, url: author.url },
      publisher: {
        "@type": "Organization",
          "@id": "https://vocreations.com/#organization",
          name: "Vo Creations",
          url: "https://vocreations.com/",
        logo: {
          "@type": "ImageObject",
          url: "https://vocreations.com/vocreations-logo.webp",
        },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: `https://vocreations.com/og/blog/${post.slug}.png`,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://vocreations.com/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://vocreations.com/blog" },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];
  return { "@context": "https://schema.org", "@graph": graph };
}

export function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display scroll-mt-28 pt-8 text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text"
    >
      {children}
    </h2>
  );
}

export function ArticleTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-white/15 bg-white/[0.03] text-text">
            {headers.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-white/10 align-top last:border-b-0">
              {row.map((cell, index) => (
                <td key={`${row[0]}-${index}`} className="px-4 py-3 text-text-secondary">
                  {index === 0 ? <span className="font-semibold text-text">{cell}</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Article({
  slug,
  toc,
  faqs,
  children,
}: {
  slug: string;
  toc: TocItem[];
  faqs: FaqItem[];
  children: React.ReactNode;
}) {
  const post = getPost(slug);
  const author = authors[post.authorId];
  const related = post.related.map((relatedSlug) => posts.find((item) => item.slug === relatedSlug)!);
  const published = formatBlogDate(post.datePublished);
  const updated = formatBlogDate(post.dateModified);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post, faqs)) }}
      />
      <Nav />
      <main id="main" className="px-6 pb-24 pt-36">
        <article className="mx-auto max-w-[720px]">
          <nav aria-label="Breadcrumb" className="mb-6 text-[15px] text-text-dim">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-text">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-text">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-text-secondary">{post.title}</li>
            </ol>
          </nav>

          <p className="mb-4 text-[13px] font-semibold uppercase tracking-[2px] text-text-dim">
            {post.category}
          </p>
          <h1 className="mb-5 font-display text-[clamp(32px,5vw,48px)] font-extrabold leading-[1.1] tracking-tight text-[#fbfbf9]">
            {post.title}
          </h1>
          <p className="mb-6 text-lg leading-[1.5] text-[#efefed]">{post.directAnswer}</p>
          <p className="mb-8 text-[15px] text-text-dim">
            <a href={author.url} className="font-semibold text-text-secondary hover:text-text">
              {author.name}
            </a>
            <span>
              {" "}
              · {post.dateModified !== post.datePublished ? `Published ${published} · ` : ""}
              Updated {updated} · {post.readingMinutes} min read
            </span>
          </p>

          {post.image ? (
            <Image
              src={post.image.src}
              alt={post.image.alt}
              width={post.image.width}
              height={post.image.height}
              sizes="(max-width: 768px) 100vw, 720px"
              className="mb-10 h-auto w-full rounded-2xl"
              priority
            />
          ) : null}

          <nav aria-label="On this page" className="mb-10 rounded-2xl border border-white/10 bg-bg-card/50 px-6 py-5">
            <p className="mb-3 text-[13px] font-semibold uppercase tracking-[2px] text-text-dim">
              On this page
            </p>
            <ol className="space-y-2 text-[15px]">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="inline-flex min-h-11 items-center text-text-secondary hover:text-text">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#questions-people-ask" className="inline-flex min-h-11 items-center text-text-secondary hover:text-text">
                  Questions people ask
                </a>
              </li>
            </ol>
          </nav>

          <div className="space-y-4 text-[18px] leading-[1.75] text-[#d4d4d0]">{children}</div>

          <aside className="mt-12 rounded-2xl border border-white/10 bg-bg-card/50 p-6">
            <p className="text-[13px] font-semibold uppercase tracking-[2px] text-text-dim">Author</p>
            <p className="mt-2 text-base font-semibold text-text">
              <a href={author.url} className="hover:underline">
                {author.name}
              </a>
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{author.bio}</p>
          </aside>

          <section id="questions-people-ask" className="scroll-mt-28 pt-12" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="mb-6 font-display text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text">
              Questions people ask
            </h2>
            <div className="flex flex-col gap-3">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-white/10 bg-bg-card/50 px-6 py-5">
                  <h3 className="text-base font-semibold tracking-tight text-text">{faq.question}</h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-text-secondary">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-12" aria-labelledby="read-next-heading">
            <h2 id="read-next-heading" className="mb-5 font-display text-[clamp(22px,3vw,28px)] font-extrabold tracking-tight text-text">
              Read next
            </h2>
            <div className="grid gap-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="rounded-2xl border border-white/10 bg-bg-card/50 px-6 py-5 hover:border-white/20"
                >
                  <p className="text-[13px] font-semibold uppercase tracking-[2px] text-text-dim">
                    {item.category} · {item.readingMinutes} min read
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-text">{item.title}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-3xl border border-white/10 bg-bg-card/50 px-8 py-10 text-center">
            <h2 className="font-display text-[26px] font-extrabold tracking-[-0.04em] text-[#fbfbf9]">
              See the program, then the results.
            </h2>
            <p className="mx-auto mt-3 max-w-[460px] text-[15px] leading-relaxed text-text-secondary">
              Campaigns start at $50K+ a month, all-inclusive. Named case studies stay behind a call. Book one and we will walk through them.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-full bg-white px-7 py-3 text-[15px] font-semibold text-black"
              >
                Book a call
              </a>
              <Link
                href="/#results"
                className="inline-flex min-h-11 items-center rounded-full border border-white px-7 py-3 text-[15px] font-semibold text-white"
              >
                Request the case studies
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
