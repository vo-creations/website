import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseClipCard from "@/components/blog/CaseClipCard";
import { authors, formatBlogDate } from "@/lib/blog/posts";
import { caseStudyBySlug, type CaseClip } from "@/lib/case-studies";

function CaseClips({ clips, board }: { clips: readonly CaseClip[]; board?: boolean }) {
  if (clips.length === 0) return null;
  return (
    <>
      <h2 className={board ? "case-clip-heading" : undefined}>Creator work</h2>
      <div className={board ? "case-clip-grid is-board" : "case-clip-grid"}>
        {board
          ? clips.map((clip) => <CaseClipCard key={clip.src} clip={clip} />)
          : clips.map((clip) => (
              <figure key={clip.src} className="wk">
                <div className="wi">
                  <img src={clip.poster} alt="" width={540} height={960} />
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    controls
                    playsInline
                    preload="none"
                    poster={clip.poster}
                  >
                    <source src={clip.src} type="video/mp4" />
                  </video>
                  <span className="clip-proof">{clip.proof}</span>
                </div>
                <figcaption>
                  <span>{clip.label}</span>
                </figcaption>
              </figure>
            ))}
      </div>
    </>
  );
}

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
  const study = caseStudyBySlug(slug);
  const leadClips = "leadClips" in study && study.leadClips;
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
    <div className="editorial blog-page case-study">
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
          <h1 className="font-display font-extrabold text-[#EEF0F4]">
            {title}
          </h1>
          <p className="mb-8 text-[15px] text-text-dim">
            <a href={author.url} className="font-semibold text-text-secondary hover:text-text">
              {author.name}
            </a>
            <span> · {date}</span>
          </p>
          <div className="case-body">
            <dl className="case-stats">
              {study.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>
                    {stat.value}
                    {stat.note ? <span className="case-stat-note">{stat.note}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
            {leadClips ? <CaseClips clips={study.clips} board /> : null}
            {children}
            {leadClips ? null : <CaseClips clips={study.clips} />}
          </div>
        </article>
      </main>
      <Footer tone="editorial" />
    </div>
  );
}
