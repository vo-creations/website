"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatBlogDate, type BlogPostMeta } from "@/lib/blog/posts";

export default function BlogIndexList({ posts }: { posts: BlogPostMeta[] }) {
  const categories = ["All", ...Array.from(new Set(posts.map((post) => post.category)))];
  const [active, setActive] = useState("All");
  const visible = active === "All" ? posts : posts.filter((post) => post.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Blog categories">
        {categories.map((category) => {
          const selected = category === active;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(category)}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold ${
                selected
                  ? "border-white bg-white text-black"
                  : "border-white/15 text-text-secondary hover:border-white/40 hover:text-text"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-4">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block overflow-hidden rounded-2xl border border-white/10 bg-bg-card/50 hover:border-white/20"
          >
            {post.image ? (
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
                sizes="(max-width: 768px) 100vw, 720px"
                className="h-auto w-full"
              />
            ) : null}
            <div className="px-6 py-6">
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-[2px] text-text-dim">
                {post.category} · {formatBlogDate(post.dateModified)} · {post.readingMinutes} min read
              </p>
              <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-text">{post.title}</h2>
              <p className="text-sm leading-relaxed text-text-secondary">{post.directAnswer}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
