# SITE — vocreations.com (how it works now)

Present-tense wiring map. **Why things changed → [DECISIONS.md](DECISIONS.md)**;
payments detail → [stripe-slack-integration.md](stripe-slack-integration.md); SEO
history → [../SEO-WORK-DIARY.md](../SEO-WORK-DIARY.md). This file points at code; it
does not copy routes or env vars (those rot).

## Stack & deploy

Next.js 14 (App Router), TypeScript, Tailwind on Vercel (`mohios/vocreations`),
**git-connected: merge to `main` → production** (vocreations.com). Analytics: Vercel
Analytics + GA `G-1TESF8060F`. See [DECISIONS.md](DECISIONS.md) `topic: deploy`.

## Routes

Routes are the `app/` tree — read it, don't trust a copy here. Non-obvious wiring
only:

- `/daniel`, `/danny`, `/thienvu` — conference/QR landings: `noindex`, standalone
  (no Nav/Footer).
- `/mentorship` returns **410** (`app/mentorship/route.ts`). The old creator
  funnel is not redirected at the homepage. `/blog` and `/blog/text-on-screen-ugc`
  are real pages again. `/blog/why-text-on-screen-ugc-is-killing-your-app-growth`
  redirects to the real post. `/case-studies`, `/case-studies/fable`, and
  `/case-studies/cluely` are not routes (404). Homepage `#results` renders five
  case cards from `app/page.tsx`. Each card is a category, not a client name: an AI creative platform, a consumer finance app, an AI video generation app, a fitness social app, and a test prep app. The finance card does not state the store rank. The figures are unchanged. The Trusted By strip keeps its logos and adds CookSAT from `public/logos/cooksat.svg`, painted `#B4B8BF` at the same opacity, with the word at the other marks’ cap height. Each Results card puts its category above the figure in 12px uppercase `#7C828C`. Krea, Higgsfield, Liftoff, and FOMO were already in that strip. The named testimonials stay. The
  hero proof strip sits under the subline. There is no placeholder table. The Slack image is
  still `public/proof/slack-report.png` (numbers are not readable). The homepage
  is the dark homepage in `app/page.tsx` (blue-black `#0B0D12` field, `#EEF0F4` type, the fixed DarkVeil behind it). The hero eyebrow sits above one Inter Tight headline, “make them remember.” The offer line “Organic UGC for AI and tech apps.” is one step down: about 54px at 1440 and 32px on a phone, weight 500, `#E6E8EC`, with 32–40px above it. “That’s why we have the biggest numbers: 1B+ organic views.” is 20px in `#C9CDD4`. The top-right label is hidden under 768px. The 1000+ subline follows. The hero stat reads “5M+ installs and signups”. `#results` is headed “Results.” The hero proof strip uses the same category labels as the cards. From 1280px its five cards are one equal-width row and stretch to the same height. Below that they stack. `#work` is headed “Creator work.” The row auto-scrolls, pauses while hovered, focused, or touched, and does not auto-scroll when reduced motion is on. The hero has one filled booking button. The lockup sits
  above `components/HeroCarousel.tsx`: six
  muted clips (`creatorClips` in `lib/creator-clips.ts`, passed as `heroClips`). A clip with a `proof` string renders a `.clip-proof` overlay on the hero card and on the matching `#work` card. Clips with no `proof` have no overlay. Only the front slide mounts an MP4, and only after `creator-01.jpg` has loaded and the carousel intersects the viewport (`preload="none"`). Side slides are posters
  with `loading="lazy"`. From 1440px the card is 268px and the outer pair stays inside the rail. There is no reflection under the cards. `public/videos/creator-01.jpg` is preloaded and is the only image with
  `fetchpriority="high"` (lowercase attribute; React's `fetchPriority` prop is not recognized by browsers). `#results` ends with the same booking URL as the other CTAs. Full case studies, spend, and playbooks stay on that call. The serif VO monogram (`public/brand/vo-logo.svg`, raster `public/brand/vo-mark.png`) is the nav, footer, and hero mark. The closer uses the blog chrome VO (`public/brand/closer-chrome.avif` and `.webp`, from `chrome-mono.webp`). From 1024px the hero monogram sits to the right of the lockup, about 40% smaller than the previous 132/180/196px widths (79/108/118px), in matte silver `#B8BCC4`, and it is hidden below that. `#pricing` is headed “What $50K+/month buys”. The fit section (`#fit`) is Good fit / Not
  a fit. Our work (`components/WorkCarousel.tsx`, `#work`) is a horizontal carousel. It leads with `creator-kelly` (2.2M views), then the same six hosted clips as the hero, each with a poster jpg. Kelly is not in the hero. A clip mounts its MP4 only while the card is in view (autoplay, muted, loop, playsInline, preload none). The platform embeds follow those six and still mount an iframe only after a click. Every `#work` card has a `.clip-proof` label. `DTRCvh2E1Lu` reads “3.7M views” and `DUMI_NwD0Xa` reads “1.5M views”, the counts recorded with those posts. The other embeds read their supplied counts: DXzgEEwRXm2 2.1M, DVzqq6eEVMt 1.1M, urpg-ygRKto 591K, @abgetsfit_ 386K, DY5IDHqknw4 16.8M, @codewithsam4 1.2M, k1NNFSkVAgs 549K, DXSp7ttDH9D 1.1M, @jacobw.health 6.3M, DXE2rDtE2lI 845K, DWtNDXqjl3I 730K, DaJ2O4ON_uK 357K, each followed by “ views”. `hero-clip-1` and `hero-clip-3` are captioned Instagram. Testimonials (`#testimonials`) are four quotes, one per person, in a two-column grid from 768px. `/blog` and each post use the
  same dark nav and footer (`Nav` `variant="editorial"`, `Footer`
  `tone="editorial"`). `/llms.txt` is a static file in `public/`. `public/manifest.webmanifest` is linked from the root metadata. GA `G-1TESF8060F` loads with `next/script` `strategy="lazyOnload"`.
  Organization `sameAs` in `app/layout.tsx` is the brand X, LinkedIn, and
  Instagram profiles (the footer links, also listed under Profiles in `public/llms.txt`). Daniel Yun's founder Person adds `sameAs` for `https://www.linkedin.com/in/danielyun27` only. PostalAddress is unchanged. Blog dates live in `lib/blog/posts.ts`. `app/sitemap.ts` builds `lastmod` from those dates and from `lib/content-dates.ts` (the legal pages' "Last updated" lines). There is no RSS feed. `contactPoint` lists `CONTACT_EMAILS` from `lib/site.ts`
  (mailto only, no phone). The footer and the homepage closer link those
  addresses. The footer links X, Instagram, and LinkedIn. The nav does not.
  Homepage sections sit in a `max-w-[1440px]` rail.
  Blog posts share `components/blog/Article.tsx` (answer under the H1, TOC,
  FAQPage + BlogPosting + BreadcrumbList JSON-LD). The index and sitemap
  read `lib/blog/posts.ts`. Index cards are `components/blog/BlogCover.tsx`:
  the chrome monogram (`public/brand/chrome-mono.webp`) on a grainy silk,
  the post title, and the tagline. `scripts/render-blog-og.ts` writes that
  same frame to `public/og/blog/<slug>.png`. Sitemap: `app/sitemap.ts`. `/campaigns/maxxd` returns 410.
  `/privacy` and `/terms` are real pages. `/refund-policy` is the agency refund policy.
- Display type on the homepage and blog is Inter Tight. Body is Inter. Both come from `next/font` in `app/layout.tsx`. The field is `#0B0D12` and body and heading type is `#EEF0F4`. Filled buttons stay white pills with dark text. The homepage hero and closer filled buttons say “Book a 30-min fit call”. The closer has no second “Book a call” link. The nav pill stays “Book a call”. Stat dots, the work progress line, Book a call underlines, and the open FAQ mark are white. The primary mark is `public/brand/vo-logo.svg`. Favicon, apple touch icon, and `app/icon.png` are the same monogram on black. Organization `logo` points at `public/brand/vo-mark.png`.
  `components/VeilBackground.tsx` paints a CSS satin sheet on every route. The sheet is `inset: -15%` and runs `silkA` (14s, ease-in-out, alternate) between `translate3d(-6vw, -4vw, 0) scale(1.08) rotate(-2deg)` and `translate3d(6vw, 3vw, 0) scale(1.14) rotate(2deg)`. A sheen sits above the sheet and under the grain: a screen-blended radial gradient, `inset: -40%`, running `sheen` (9s, ease-in-out, alternate) from `translate3d(-18vw, 8vw, 0)` to `translate3d(18vw, -6vw, 0)`. Both animate `transform` only and stay still when reduced motion is on. Film grain is `public/brand/grain.png` over that field and does not move. `/privacy`, `/terms`, and `/refund-policy` use the editorial header and footer on the same field. Open Graph image is `public/og-image.png`.
- `app/api/stripe-webhook` — Stripe payment events → Slack (#ka-ching).
- `app/api/mercury-webhook` — Mercury bank events → Slack (#ka-ching), incoming only.

## Environment

Env vars are declared in [`../.env.example`](../.env.example) — the source of truth
(`npm run docs:check` enforces code↔example sync). Real values are set in Vercel
(`mohios/vocreations`).

## Payments

No on-site checkout — mentorship is sold via direct Stripe payment links. Two
webhooks post to Slack #ka-ching: Stripe (`app/api/stripe-webhook/route.js`) and
Mercury (`app/api/mercury-webhook/route.js`). Detail:
[stripe-slack-integration.md](stripe-slack-integration.md); rationale in
[DECISIONS.md](DECISIONS.md) (`topic: payments`, `topic: mercury-webhook`).

## Creator Data Platform

Agency-owned creator-data warehouse + products that read it (Master Build Brief;
the leaderboard is the first tenant). Read the code, not a copy here. _Why:
[DECISIONS.md](DECISIONS.md) `topic: sideshift-api`._

- **DB:** Supabase Postgres + Drizzle. Schema [`lib/db/schema.ts`](../lib/db/schema.ts);
  migrations `lib/db/migrations/` (generated, never hand-edited). Runtime → pooled
  `POSTGRES_URL` (`lib/db/client.ts`); migrations → direct `POSTGRES_URL_NON_POOLING`.
- **Model:** immutable daily **snapshots** of lifetime view/post totals keyed at
  (creator + program); every window is a snapshot subtraction. Creators auto-link
  across campaigns via a stable Sideshift `userId` (`creators.external_id`).
- **Ingest seam:** vendor-agnostic `IngestAdapter` ([`lib/ingest/types.ts`](../lib/ingest/types.ts));
  [`lib/ingest/sideshift.ts`](../lib/ingest/sideshift.ts) is the only module touching the vendor.
  **Multi-brand:** each Sideshift key sees one company, so `SIDESHIFT_KEYS` (JSON map or flat
  list) holds every brand key and the adapter iterates all of them (archived programs included).
  _Why: DECISIONS `topic: sideshift-multikey`._
- **Pipeline:** [`lib/ingest/sync.ts`](../lib/ingest/sync.ts) — immutable `raw_ingest`,
  upserts (agency CRM fields preserved), idempotent snapshots (`source='live'`), `sync_runs`
  log, Slack warn on failure or a lifetime-views decrease. One program failing doesn't fail the batch.
- **Metrics (one definition):** [`lib/queries/leaderboard.ts`](../lib/queries/leaderboard.ts)
  — per-campaign + overall boards × {7d, 30d, all-time}. 7d/30d are snapshot deltas;
  all-time is `MAX(lifetime_views)` per (program, creator) from our snapshots (see
  DECISIONS `topic: leaderboard-windows`). The 7/30d `deltaBoard` applies the window-confidence
  guard (excludes `source='anchor'` rows; low-capture pairs use `source='live'` only — DECISIONS
  `topic: alltime-repull`). Returns a `warmingUp` state, never a fake zero.
- **All-time repull:** [`scripts/repull-alltime.ts`](../scripts/repull-alltime.ts)
  (`npm run repull:alltime`, dry-run by default) rebuilds authoritative all-time from the API's
  lifetime `topCreators` totals across all brand keys, re-keys/anchors the CSV-backfilled rows,
  and marks low-capture windows warming-up. Matcher: [`lib/ingest/match.ts`](../lib/ingest/match.ts)
  (`npm run test:match`). _Why: DECISIONS `topic: alltime-repull`._
- **Cron:** `app/api/cron/sync` daily 09:00 UTC (`vercel.json`), Bearer `CRON_SECRET`.
- **Campaign accountability digest:** [`lib/queries/accountability.ts`](../lib/queries/accountability.ts)
  computes posts/creator/day (latest − previous `lifetime_posts`) per `status='active'` program
  vs a target (`DAILY_POST_TARGET`); [`lib/digest/campaign-digest.ts`](../lib/digest/campaign-digest.ts)
  renders + posts to **#campaigns** (`SLACK_CAMPAIGNS_WEBHOOK_URL`). Manual:
  `npm run digest:campaign` (dry-run default). Cron: `app/api/cron/campaign-digest`
  (`strict` → SYNC STALE gate). **Currently DRY-RUN ONLY** — not in `vercel.json` `crons` and
  `SLACK_CAMPAIGNS_WEBHOOK_URL` unset, so it never posts. _Activation checklist + known limits
  (no per-platform grain; only Allinmotion syncs live): DECISIONS `topic: campaign-accountability`._
- **Probe:** `scripts/probe-sideshift.mjs` (Phase 0 discovery; fixtures gitignored, PII).
- **Leaderboard (`app/leaderboard/`):** gated creator board (→ `leaderboard.vocreations.com`).
  Supabase **magic-link** auth (`lib/supabase/*`, session refresh in `middleware.ts`);
  `session.email → creator` via `lib/queries/creator-access.ts`; reads the Phase 2 query
  layer. Shows overall + the creator's own campaigns; directed unknown-email screen;
  `noindex`. Re-skinned from `design/leaderboard-fun-prototype.html`. Email seeding:
  `scripts/seed-creator-emails.mjs`. Why: DECISIONS `topic: leaderboard-access`.
