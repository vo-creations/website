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
              className={`inline-flex min-h-11 items-center rounded-full border px-4 text-[15px] font-semibold ${
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
            <Image
              src={`/og/blog/${post.slug}.png`}
              alt={post.title}
              width={1200}
              height={630}
              sizes="(max-width: 768px) 100vw, 720px"
              className="h-auto w-full"
            />
            <div className="px-6 py-6">
              <p className="mb-3 text-[15px] font-semibold text-[#d4d4d0]">
                {post.category} · {formatBlogDate(post.datePublished)} · {post.readingMinutes} min read
              </p>
              <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-text">{post.title}</h2>
              <p className="text-base leading-relaxed text-[#d4d4d0]">{post.directAnswer}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
