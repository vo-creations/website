# CLAUDE.md — vocreations.com

<!-- Embedded build rules: website-build-rules v1 (single source: Projects/website-build-rules.md — re-sync, don't hand-edit this block) -->

## What this is
Marketing site for Vo Creations, a UGC agency that trains its own creators through live mentorship.

## Stack
Next.js 14 (App Router), TypeScript, Tailwind CSS. Hosted on Vercel, git-connected (main→prod).

## Run / deploy
- `npm run dev` — local at http://localhost:3000
- `npm run build` — production build
- Deploy: merge to `main`; Vercel's git integration builds and ships to vocreations.com. Do NOT `vercel deploy --prod` from a branch and expect it to stick — the next `main` deploy overwrites it (see DECISIONS `topic: deploy`).
<!-- docs gate: `npm run docs:check` (scripts/docs-check.mjs) — see website-build-rules.md — Enforcement -->

## Docs
- [docs/SITE.md](docs/SITE.md) — how it works now (present tense): wiring, routes, env, payments.
- [docs/DECISIONS.md](docs/DECISIONS.md) — why / what changed (past tense; latest entry per `topic:` wins).
- [docs/stripe-slack-integration.md](docs/stripe-slack-integration.md) — payments / webhook detail.
- [SEO-WORK-DIARY.md](SEO-WORK-DIARY.md) — SEO change history.
- [README.md](README.md) — human onboarding + brand voice.

## Decisions index (consult DECISIONS.md before re-deciding any of these)
- `sideshift-api` — Creator Data Platform: API base `app.sideshift.app/api/v1`, `x-api-key` auth, lifetime totals → daily snapshot subtraction. Wiring in SITE.md.
- `sideshift-multikey` — each key sees ONE company; `SIDESHIFT_KEYS` (JSON map or flat list) holds every brand key (daily sync + repull iterate all); ended programs are `status=archived`, listed with no status filter.
- `alltime-repull` — `scripts/repull-alltime.ts` (dry-run default) rebuilds authoritative all-time from API `topCreators` lifetime; re-keys backfill creators/programs to real ids (held: ghost/ambiguous/unmatched); `--anchor` additive-shifts well-captured + marks low-capture windows warming-up (snapshots.source / window_confident guard, migration 0003).
- `leaderboard-windows` — rank only creators who posted (`topCreators`); 7d/30d = snapshot deltas; all-time = live latest lifetime (vendor fixing repurposing; freeze fallback documented as TODO). Orphan creators upserted.
- `leaderboard-access` — `/leaderboard` gated by Supabase magic-link auth (per-creator); email→creator; overall + own campaigns; directed unknown-email screen; noindex. Supersedes shared-password plan.
- `campaign-accountability` — daily Slack digest (#campaigns): posts/creator/day vs target (4), per active campaign. Active = `programs.status='active'` (not the tracker sheet); SYNC STALE gate; no per-platform grain. Only Allinmotion live until brand keys land. Cron not yet scheduled (Danny-gated).
- `payments` — no website checkout; direct Stripe links; webhook → Slack (#ka-ching)
- `mercury-webhook` — Mercury bank events → Slack #ka-ching (incoming only)
- `marketing-2026-06` — guarantee + mentorship reframe (supersedes the old 3M / two-month framing)
- `agency-only-redesign` — on branch `redesign/agency-only` (not yet merged): dropped `/mentorship` + `/pre-call` funnel, softened copy to "in-house training program." Theme briefly went light, then reverted back to the original dark palette — dark is current. Supersedes the mentorship-funnel parts of `marketing-2026-06`.
- `single-page-site` — on branch `redesign/agency-only` (not yet merged): `/about`, `/creators`, `/roi` merged into `app/page.tsx` sections (deduped market-stats/calculator, kept once); `/blog` deleted outright. Old paths 301→ homepage anchors via `next.config.mjs`. Nav trimmed to 3 anchors (good-marketing.co pattern).
- `in-house-positioning` — on branch `redesign/agency-only` (not yet merged): reframed pitch from "UGC agency" to "your in-house UGC program" (hero headline/subhead, footer tagline); footer social icon row removed. `app/layout.tsx`'s SEO metadata still says "UGC agency" in 4 spots — flagged, not yet updated.
- `trusted-by-logos` — on branch `redesign/agency-only` (not yet merged): real client logos wired into the homepage marquee from `public/logos/`, transparent-background PNGs at `h-14`, all sourced from each brand's own site (not hand-saved/screenshotted). Most are monochrome white; Causes/Fable/Kicker/Codedex keep original brand color; Makon/Tomo/Liftoff got real brand-color accents restored after an over-aggressive white recolor (see DECISIONS). `needsChip` unused but kept as an escape hatch for a future uncolor-keyable source. 18 clients: Aonic, BlackBox AI, Causes, Codedex, Cooksat, Dealism, Dubbing AI, Fable, Higgsfield, Hyperknow, Kicker, Kortix, Liftoff, Makon AI, Notta, Softr, Tomo (tomo.ai, not TomoCredit), Yorby.
- `hero-copy` / `lets-talk-button-polish` — on branch `redesign/agency-only` (not yet merged): headline lowercase ("make them remember."), matches README's tagline convention. Primary CTA copy is "Let's Talk [V-mark icon]" (icon after the text, not before) sitewide — check `app/page.tsx` hero, `components/CTABlock.tsx` default, and `app/campaigns/maxxd/page.tsx` if changing it again. Button is an outlined pill (`border-white`/`bg-transparent`, not solid white). `public/vocreations-mark-white.png`/`-black.png` were regenerated with a luminance threshold — the originals had a faint non-zero alpha across the whole canvas (source webp's "black" bg wasn't pure black), which read as a visible box around the icon; if either mark PNG is ever regenerated from `vocreations-logo.webp` again, keep the threshold cutoff or the bug comes back. "TRUSTED BY" label has the same ✦-flanked treatment as the hero kicker badge.
- `hero-stats-countup` — on branch `redesign/agency-only` (not yet merged): hero stats (1B+/30+/500+/9) count up from 0 on scroll-into-view over 2.2s (`useInView` inline in `app/page.tsx` + shared `components/useCountUp.ts`). "1B+" counts 0→1000 as "M+" and swaps to "1B+" only on the last frame — there's no honest literal count for a billion.
- `hero-floating-card` / `hero-story-card` — on branch `redesign/agency-only` (not yet merged): the hero's right-side visual is `components/HeroStoryCard.tsx`, a 6-stage looping mockup (sourcing creators → building strategy → accounts warming up → posting content → views & engagement → revenue & growth, ~2.8s/stage) built as a real iPhone shell — outer bezel div + inner screen div at a smaller radius, dynamic-island cutout with a tiny Vo Creations V-mark inside it, stage-progress segments repositioned below the island. `w-[264px]` (was `w-[240px]`). Real two-column layout (`flex xl:flex-row` inside `NAV_CONTAINER`, left column capped `xl:max-w-[620px]`) — NOT absolute-positioned in the outer margin (that version crowded the viewport edge at 1280-1440px) and NOT the `lg:grid-cols-2` layout from the earlier (reverted) `nav logo/border, two-column hero` entry, reverted for an unrelated `mask-image` dimming bug. Check all entries under this topic before touching hero layout again.
- `marquee-polish` — on branch `redesign/agency-only` (not yet merged): Trusted By and Content-that-goes-viral marquees both fade at their left/right edges (`edgeFadeStyle` mask-image, shared const in `app/page.tsx`, applied to the `overflow-hidden` wrapper not the scrolling track) and both run slower (`scroll`: 60s, `scroll-slow`: 120s, in `tailwind.config.ts`).
- `showcase-marquee` — on branch `redesign/agency-only` (not yet merged): "Content that goes viral" is an auto-scrolling marquee (same mechanism as Trusted By, slower `animate-scroll-slow`, pauses on hover), 14 items, **all platform embeds, zero self-hosted mp4s** — 9 Instagram via `components/InstagramEmbed.tsx`, 2 TikTok via `components/TikTokEmbed.tsx`, 1 Facebook via `components/FacebookEmbed.tsx`, 2 YouTube Shorts via `components/YouTubeEmbed.tsx` (rewritten to the same `{url,label}`/`aspect-[9/16]` shape as the others — it existed but was unused and shaped differently before). Interleaved by platform, not grouped. Subheading: "...across TT, IG, FB & YT."
- `trusted-by-logos` sizing — on branch `redesign/agency-only` (not yet merged): every logo renders inside the same fixed `w-[130px] h-14` box (`object-contain`, both the normal and `needsChip` branches) so wordmark-heavy logos don't visually outweigh compact icon+text ones — see the main `trusted-by-logos` entry above for the client roster/sourcing.
- `homepage-section-order` — on branch `redesign/agency-only` (not yet merged): section order is Hero → Trusted By → Our Work → Case Studies → Team → How It Works → FAQ → Final CTA. Case Studies sits right after Our Work; How It Works sits right after Team, right before FAQ.
- `team-section-polish` — on branch `redesign/agency-only` (not yet merged): heading is "Proven Viral Creators, Turned Agency Operators." Thienvu is "CEO of VoC Mentorship," Daniel is "COO of VoC Mentorship" with an expanded operator bio (still folds in his old 150M+ views / $200K+ earnings figures). `team` array has a per-member `imagePosition` field (inline style, not a Tailwind class — needs to vary per member) for photo cropping; Thienvu's is `"center 75%"` to fix excess empty space above him from the default center crop.
- `footer-polish` — on branch `redesign/agency-only` (not yet merged): `<footer>` has an explicit `bg-bg` now — it used to be transparent to `body`'s fixed-attachment corner-glow gradient in `globals.css`, which read as an unwanted brown tint on the bottom bar specifically (closest to the viewport's bottom-right corner where that gradient is strongest). Tagline is "Your world-class in-house UGC program, without the overhead."
- `leaderboard` — removed 2026-06, rebuilding from scratch on the data platform (old Apps Script/middleware path scrapped)
- `canonical-domain` — non-www is canonical; www 308-redirects
- `showcase-video` — `#t=0.1` media fragment for iOS Safari thumbnails
- `content-assets` — `content/` binaries gitignored, live in Google Drive
- `docs-standard` — adopted website-build-rules v1 (this doc set + `docs:check`)

## Known-broken
<!-- Capped ~1 screen. Each entry: what + recheck-by + clearing condition. Past recheck-by → verify against code, don't trust. -->
- (none)

## Repo conventions
- **No em dashes in site copy** (use commas/colons/periods). Tagline: _make them remember._ (lowercase, small-caps, trailing dot).
- Metadata lives in each route's `layout.tsx` (or `page.tsx` for server pages); root metadata + JSON-LD in `app/layout.tsx`.

## Doc-discipline rules (do every session)
- Touched wiring? Update [docs/SITE.md](docs/SITE.md) in the same change. SITE points at `app/` + `.env.example`, never copies them.
- Made a non-obvious choice? Append a past-tense [docs/DECISIONS.md](docs/DECISIONS.md) entry (and a line in the Decisions index above). If it constrains code, leave `// DECISION yyyy-mm: <what> — see docs/DECISIONS.md` at the code site.
- Keep Known-broken current: each entry carries a `recheck-by` + clearing condition; delete when fixed.
- Present = SITE, past = DECISIONS; no fact in both. Run `npm run docs:check` before pushing.
