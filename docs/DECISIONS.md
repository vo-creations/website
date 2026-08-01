# DECISIONS — vocreations.com

Past-tense log of non-obvious calls: **why** something is the way it is, and what
changed. Append-only. Each entry has a `topic` key and a date.

**Reading rule:** the **latest entry on a `topic` wins.** A newer entry on the
same topic supersedes older ones (recency decides) — you do not need to find and
edit the old entry. For present-tense "how it works now," see
[SITE.md](SITE.md); this file is only the why/history.

---

## topic: campaign-accountability — _2026-06_

Built a daily **campaign accountability digest**: per active campaign, per creator, are
they posting vs a target (default **4 posts/creator/day**, `DAILY_POST_TARGET`). Posts to
Slack **#campaigns**. Engine: [`lib/queries/accountability.ts`](../lib/queries/accountability.ts)
(the one metric definition) → [`lib/digest/campaign-digest.ts`](../lib/digest/campaign-digest.ts)
(render + orchestrate) → `scripts/campaign-digest.ts` (`npm run digest:campaign`, dry-run
default) + `app/api/cron/campaign-digest` (strict, daily). New env
`SLACK_CAMPAIGNS_WEBHOOK_URL`; `notifySlack(text, url?)` now takes a channel webhook.

- **The only honest metric is posts/creator/day = latest − previous `lifetime_posts`.**
  Sideshift is lifetime-only with **no per-platform split per creator** (`topCreators[]` is
  `{id,name,totalViews,totalPosts}`; `platformBreakdown` is program-level only). So "1x/day
  on 4 platforms" is NOT reconstructable — it collapses to a flat per-creator posts target.
  **This is the known limitation, by data design, not a TODO.**
- **Gaps are normalized.** A failed sync skips a day, so the delta spans `latest − previous`
  snapshot dates and the target scales (`target x gapDays`). A creator with a single snapshot
  is `no_data`, never a fabricated zero.
- **Active-campaign source = `programs WHERE status='active'`** (driven by the daily sync),
  NOT the Campaign Tracker sheet. Only a program with a *fresh daily snapshot* can be held
  accountable; the sheet is human intent that drifts (verified 2026-06-10: the sheet lists
  Aonic/eComrads/CoWorker/Morphic active, but those exist in our DB only as `status=ended`
  backfill frozen at 2026-06-07 — `status='active'` correctly excludes them). The 27 backfill
  brands are all `ended`, so a frozen historical snapshot can never masquerade as today's.
- **Stop conditions (brief).** The cron runs `strict`: if the latest `sideshift` sync run is
  not status=ok AND dated today, it posts `SYNC STALE : <last good date>` and renders NO
  numbers. Ended campaigns drop out by status. Every printed number traces to a snapshots row.
- **KNOWN BLOCKER (shared with `topic: alltime-repull`): only `#Allinmotion (CPM Creators)`
  syncs live** — prod has the single `SIDESHIFT_API_KEY` (Vo Creations company), not the
  multi-brand `SIDESHIFT_KEYS`. Allinmotion is the agency's internal CPM pool, not a client
  campaign, and has posted 0 net content since 2026-06-07. The engine is campaign-agnostic and
  auto-covers Aonic/eComrads/CoWorker the moment their brand keys are added. **Verified Phase
  0/2:** DB latest snapshot posts == live Sideshift API, 25/25 exact; digest deltas trace to
  the raw snapshots rows.
- **CLIENT-ONLY FILTER — built (2026-06-10).** #campaigns is client campaigns only, so the
  internal pool is excluded at the source: `EXCLUDED_COMPANY_NAMES = { "Vo Creations" }` in
  [`lib/queries/accountability.ts`](../lib/queries/accountability.ts) drops any program whose
  `company_name` is in the set from `buildAccountabilityReport` — it cannot drive `asOf` or
  render a section (programs with a null company_name are kept). That is the **single reversal
  point**: empty the set to let the internal pool back in. Consequence today: with Allinmotion
  (company "Vo Creations") the only live program, the report is correctly **empty** until the
  client brand keys land. Verified by dry-run (below).
- **Metric APPROVED (Danny, 2026-06-10); NOT activated.** The posts/creator/day metric and the
  behind vs no-data distinction are signed off, and the engine is merged to `main` ready to run.
  But the digest does NOT post and the cron does NOT fire until the checklist below. Two
  independent off-switches keep it dark: (a) `/api/cron/campaign-digest` is absent from
  `vercel.json` `crons` (never scheduled), and (b) `SLACK_CAMPAIGNS_WEBHOOK_URL` is unset, so
  `notifySlack` returns false (no post). **Do NOT activate against `#Allinmotion` alone** — it is
  the internal Vo Creations pool, not the client accountability target.

**Activation checklist — flip the digest live to #campaigns (do ALL, in order):**
1. **Add the client brand keys.** Put the Aonic, eComrads, and CoWorker Sideshift API keys into
   `SIDESHIFT_KEYS` (Vercel **and** `.env.local`). Until this, the only `status='active'` program
   is the internal `#Allinmotion` pool, so there is nothing real to post — do not activate first.
2. **Verify ingest.** After the next 09:00 UTC sync, confirm `programs WHERE status='active'`
   includes the client campaigns with a snapshot dated today, then run `npm run digest:campaign`
   (dry-run) and check they render with real deltas.
3. **Internal-pool exclusion — already built, nothing to do.** The client-only filter
   (`EXCLUDED_COMPANY_NAMES`, see above) keeps Allinmotion / company "Vo Creations" out of the
   digest permanently. To include it again, empty that set in `lib/queries/accountability.ts`.
4. **Set the channel webhook.** Create a Slack Incoming Webhook bound to #campaigns; set
   `SLACK_CAMPAIGNS_WEBHOOK_URL` in Vercel (and `.env.local` for local posting).
5. **Register the cron.** Add to `vercel.json` `crons`:
   `{ "path": "/api/cron/campaign-digest", "schedule": "30 9 * * *" }` (after the 09:00 sync; uses
   the existing `CRON_SECRET` Bearer). Deploy by merging to `main`.
- **Deactivate / rollback:** remove the `vercel.json` cron entry, or unset
  `SLACK_CAMPAIGNS_WEBHOOK_URL` (posts become no-ops). No code change needed either way.

**Why:** an audit-tone "who is behind today" digest mirrors the sales-CRM daily intelligence,
pointed at creator posting. Proving it against live data before scheduling was the explicit
gate — the data turned out to expose that only one (internal) campaign is wired, which is the
real finding to act on (supply brand keys) rather than ship a digest over frozen data.

## topic: security — _2026-06_

Enabled **Row Level Security on every public table** (migration
`0002_enable_rls_public.sql`), with **no policies**.

**Why:** Supabase serves a PostgREST data API at `https://<ref>.supabase.co/rest/v1/<table>`
authenticated by the **anon key — which is public** (it ships to the browser for auth).
With RLS off, anyone with that key could read/write the tables directly (verified: anon
`GET /rest/v1/creators` returned live PII before the fix). The app does **not** use that
API — confirmed all data access is Drizzle over the direct/pooled Postgres connection
(`supabase.*` calls are auth-only: signInWithOtp/OAuth, getUser, exchangeCodeForSession,
signOut). That connection is the `postgres` role (`rolbypassrls = true`), so RLS does not
affect it.

**Effect:** RLS enabled + zero policies = deny-all for the `anon`/`authenticated` PostgREST
roles; the Drizzle app path bypasses RLS and is unaffected. Verified after: anon SELECT → 0
rows on all 7 tables, anon INSERT → 401 "violates row-level security policy", Drizzle reads
still return all rows. No `service_role` key is referenced anywhere in the codebase (clients
use only `NEXT_PUBLIC_SUPABASE_ANON_KEY`). If a product ever needs the Supabase data API,
add real policies then — do not just disable RLS.

## topic: sideshift-multikey — _2026-06_

Each Sideshift API key is scoped to **one company** and sees only that company's
programs — verified: the "Vo Creations" key returns exactly 2 programs (`#Allinmotion`
active + `Makon AI` archived) and **cannot** see other brands (BlackBox, Codédex, Fable…)
or their creators. A single key is why the live board had ~25 creators.

- **`SIDESHIFT_KEYS`** is the list of EVERY brand key. Two accepted formats (parsed in
  `configKeys()`, `lib/ingest/sideshift.ts`): a **JSON map** `{"BlackBox":"sk_live_…",…}`
  (preferred — the Apps Script format; keeps the brand label for the per-key coverage report)
  OR a flat comma/space/newline list. `SIDESHIFT_API_KEY` (single) stays as a fallback.
- The adapter iterates all keys and remembers which key each program came from, so the daily
  cron now covers all brands, not one. `fetchAllPrograms()` also returns per-key **coverage**
  (programs / creators / views) so a dead or wrong key shows up as a 0-row line.
- **Archived programs are reachable:** ended programs report `status=archived` (NOT `ended`);
  `GET /programs?status=ended` returns 0. `listActivePrograms()` filters `status=active`; the
  repull lists with **no status filter** (all statuses) and normalizes archived → `ended`.
  Before this, the adapter's `status=active`-only listing silently skipped archived programs.

**Why:** the agency runs many brands, each its own Sideshift company/key; covering only one
under-collected the platform. Supersedes the single-`SIDESHIFT_API_KEY` assumption in
`topic: sideshift-api` (that entry's endpoint contract is otherwise unchanged).

## topic: alltime-repull — _2026-06_ (creator merge + brand_key dedup + tripwire)

Refines the earlier `alltime-repull` entry after the multi-brand cron went live (3 brands:
aonic/ecomrads/coworker) and created **real-uid creator rows that duplicated the backfill rows**
(16 humans double-counted, ~20.5M views). The repull now reconciles identity at TWO grains:

- **Creator merge (one human = one creator_id).** CANONICAL = the cron-created real-uid row.
  `scripts/repull-alltime.ts` MERGEs a synthetic `backfill:` dup into it (re-point
  snapshots/campaign_accounts/program_creators conflict-safe, drop the synthetic row); RE-KEYs a
  backfill row when no cron twin exists yet. A backfill row CONTESTED by ≥2 real uids (a
  repurposed handle reused across campaigns) is HELD, never mis-merged.
- **Confirmed multi-uid → ALIAS.** When one human ends up with two REAL uids (repurposed handle),
  the secondary uid is ALIAS-MERGEd into the canonical AND recorded in **`creator_aliases`**
  (migration 0005). `upsertCreator` (`lib/ingest/sync.ts`) consults that table FIRST, so a future
  sync that still sees the secondary uid in topCreators routes to the canonical row → the merge is
  permanent (a plain delete would un-merge next sync). Confirmed cases are an explicit allowlist
  (`CONFIRMED_MERGES`) — extend per human (Johnathan Jen, 2026-06: `0NC7…` canonical, `MwVh…` alias).
- **Program-level brand_key dedup.** The backfill is per-BRAND, the live cron per-TIER.
  `programs.brand_key` (migration 0004) links them; `allTimeBoard` keeps live-tier rows and drops
  a brand's backfill/anchor row once a LIVE tier row exists for that (brand_key, creator) — one
  source per (brand_key, creator). **Provable no-op until brand_key is set** (all NULL → every row
  kept). Anchors go on the per-brand backfill program; capture% = brand-backfill-latest /
  brand-API-total (brand grain, not per-tier).
- **Lossless caveat + TRIPWIRE.** Dropping the anchor in favour of live tiers is lossless ONLY
  while the live tiers cover the brand total — true today (all 3 cron brands have 0 ended tiers,
  verified: 0 creators undercounted). If a brand later gains a tier that **ended before it was
  live-synced**, the dropped anchor would carry views the live tiers don't. Instead of a
  speculative MAX guard, the daily cron runs `anchorDropLoss()` (`lib/queries/leaderboard.ts`)
  and logs `anchor_drop_would_lose_views` to `sync_runs` + Slack with the exact brand/creator/delta
  — empty today, names the precise case to fix if it ever fires.
- **Apply order (no double-count window):** deploy the dedup+alias CODE first (no-op while
  brand_key NULL + aliases empty) → migrate 0004+0005 → `--apply` (merge/alias/re-key + brand_key)
  → `--apply --anchor`. Populating brand_key/aliases is what ACTIVATES the already-deployed dedup,
  so the board never sits anchored-but-un-deduped. Verified by an independent read-only pass:
  double-count 16→0, alias permanence, foldInto conflict-safety, override fires only for the
  allowlist, dedup/alias no-op today.

## topic: alltime-repull — _2026-06_

All-time totals undercounted Sideshift by 6–96% per creator (Kiera 13.4M vs ~28.6M; Casey
Arena effectively missing) because all-time was rebuilt by **summing date-windowed per-video
CSVs**, which omit older videos/campaigns. The fix repulls the SOURCE of truth — the API's
per-program lifetime `topCreators[]` — across every brand key and every program (active +
archived), grouped by the stable creator uid. Tool: `scripts/repull-alltime.ts`
(`npm run repull:alltime`, dry-run by default; reuses `topic: sideshift-multikey`).

- **Identity re-key.** The CSV backfill created creator/program rows under SYNTHETIC ids
  (`backfill:kiera-par`); the API keys on the real Sideshift uid. The repull **re-keys** each
  backfill row to its real uid via, in order: (a) a DB row already on the uid; (b) the master
  roster CSV `external_id` → canonical name (seed-convergent — the seed matches `external_id`
  first, so a re-keyed row is the SAME row the email seed attaches to); (c) handle; (d) a
  tolerant name match (`lib/ingest/match.ts`: Last,First / casing / whitespace / accents, ghost
  rows excluded). **Ghost / ambiguous / unmatched / merge-conflict are HELD for manual review —
  never force-matched, never auto-duplicated.** Programs get the same re-key (backfill program →
  real id by brand name).
- **All-time anchor + window-confidence guard (#5).** All-time ALWAYS anchors to the API total.
  The 7/30-day WINDOW is gated by **capture% = backfill latest / API all-time** per (program,
  creator):
  - **≥ 70% → ADDITIVE SHIFT** (`+ (API − current)` on every non-live snapshot): latest equals
    the API total AND the real recent deltas are preserved. Additive, NOT proportional —
    proportional would inflate deltas by the all-time miss ratio.
  - **< 70% → WARMING-UP**: write the all-time anchor (`snapshots.source='anchor'`, excluded from
    windows) and set `program_creators.window_confident=false`. `deltaBoard` then sources that
    pair's window from `source='live'` rows ONLY — so it reads warming-up until the cron
    accumulates real dailies (self-resolving, no backfill→anchor jump). Kiera (~47%) lands here.
  - `latest==0` → **irreconcilable** (reported, not forced).
  The repull reports per-creator capture%, method, and the warming-up list.
- **The guard (shipped here), schema + query + cron:** additive nullable columns
  `snapshots.source` (live | backfill | anchor) and `program_creators.window_confident`
  (migration `0003`); `deltaBoard`'s `elig` CTE excludes `anchor` rows and applies
  `window_confident IS NOT FALSE OR source='live'`; `allTimeBoard` includes everything; the cron
  tags new rows `source='live'`. **No-op on current data** (no anchor rows / no false flags →
  identical results; proven by `scripts/test-leaderboard.ts` staying green). **Deviation from
  the brief's "cron sets window_confident=true on first daily":** the cron does NOT flip the flag
  — the `elig` predicate already counts live rows for low-capture pairs, so windows build purely
  from real dailies with zero one-day jump; flipping would re-admit the unreliable backfill.
- **Gated rollout.** Default dry-run (re-key plan, held list, per-creator OLD-vs-API-NEW table,
  per-key coverage, program reconciliation, capture/method report). `--apply` = identity
  unification only; `--apply --anchor` = additionally anchor + additive-shift + mark low-capture.
  Both transactional, logged to `sync_runs` (source `repull-alltime`). **Requires the real
  `SIDESHIFT_KEYS` + the master roster CSV**; with only the single key it resolves Allinmotion
  (all 25 already real-keyed, 100% capture) and leaves the rest absent.

**Why:** fixing the SOURCE (API lifetime totals) corrects all-time AND the missing creators in
one pass; the per-video CSV stays only as re-anchored recent-window shape, and the confidence
guard keeps a poorly-captured backfill from showing fake-precise windows.

## topic: sideshift-api — _2026-06_

Phase 0 probe (`scripts/probe-sideshift.mjs`) confirmed the real Sideshift API
against a live key. The brief's assumed endpoints were close but the specifics
matter, so they are pinned here:

- **Base URL:** `https://app.sideshift.app/api/v1` (the public API; note the
  `app.` host + `/api/v1` path. `app.sideshift.app/api/*` without `/v1` is the
  web app's internal API and wants a Firebase token — not for us.)
- **Auth:** header `x-api-key: <key>` (NOT `Authorization: Bearer`).
- **Identity (brief confirmed):** the stable creator id is a Firebase uid, exposed
  identically as `topCreators[].id`, `handles[].userId`, and `/creators[].id` —
  this is the auto-link key (`creators.external_id`).
- **Endpoints the adapter uses:**
  - `GET /programs?status=active` — paginated `{data, page, total, totalPages}`.
    Each program: `id, name, companyId, companyName, status, startsAt/endsAt`
    (unix **seconds**), plus aggregate `stats` and a `handles[]` registry.
  - `GET /creators?programId=X&limit=200` — paginated full roster (default page
    size 25): `{id, name, email, phone, profileImageUrl, campaigns[]}`, where
    `campaigns[].handles[]` are the per-program handles. → CRM + campaign_accounts.
  - `GET /analytics/overview?programId=X&topCreatorsLimit=1000` — `data.topCreators[]`
    = `{id, name, totalViews, totalPosts}`, the **per-creator lifetime totals** =
    snapshot rows. Only creators with activity appear (verified: Σ topCreators
    views == summary.totalViews exactly, so it's the complete metrics set).
- **Date range:** `/analytics/overview` takes `topCreatorsLimit` (creator count),
  not a date range. Date-range params return 200 but don't change the payload →
  totals are **lifetime**; windows come from snapshot subtraction (as the brief
  assumed). The `topCreatorsLimit` knob is the one simplification found.

**Why pinned:** the adapter (`lib/ingest/sideshift.ts`) is the only place that
talks to this API; everything else reads normalized data. If the API changes,
this entry + that file are the two things to update.

## topic: leaderboard-windows — _2026-06_

How the leaderboard derives its numbers. Verified against the live API + fixtures
(program `WDeIefXYKcb5SIeMLhst`), not assumed. Refines `topic: sideshift-api`.

- **Population — rank only creators who POSTED (vendor-confirmed, Daniel 2026-06):**
  the ranked set is exactly `topCreators[]` (== `summary.uniqueCreators`). NO filtering
  by `creators.approved` (that tracks approved contracts, == `summary.activeContracts`,
  not the metric grain) and NO roster-membership filter. Identity joins from `handles[]`
  by `userId`; metrics from `topCreators[]` by `id` (join key LOCKED, live-tested 10/10).
- **Full metric set:** the knob is `topCreatorsLimit` (not `limit`/`topN`, which are
  ignored). `=1000` returns all `summary.uniqueCreators`. The adapter throws if it gets
  fewer than `uniqueCreators`, so silent truncation can't slip through.
- **All-time = LIVE lifetime totals (vendor will fix repurposing, Daniel 2026-06):**
  accounts get **repurposed** across campaigns — old content deleted, warm account kept —
  so a per-(creator, campaign) *lifetime* total can DECREASE after a campaign ends,
  contaminating **all-time** boards (7d/30d are clean — active campaigns, no repurposing
  that soon). The vendor confirmed they will fix the carried-over stats on their end
  (timeline unknown). **Decision: do NOT build the all-time-freeze workaround.** All-time
  uses the **latest** `lifetime_views` per (creator, program), summed across a creator's
  programs by stable `external_id` (full history, live values). **TODO (remove when
  vendor ships the fix):** if contamination proves material before then, build a freeze
  fallback (`MAX(lifetime_views)` per program+creator) — our `snapshots` are immutable,
  so the historical data for it is already preserved with zero loss.
- **Orphan creators → UPSERT (decided):** a `topCreators` metric can reference a creator
  absent from the current `/creators` roster (a repurposed one). The pipeline upserts the
  creator from the metric's `id`+`name` (already in `lib/ingest/sync.ts`) rather than
  skipping, so the posted-content population above is fully ranked. The `sync_runs`
  "views decreased" warning remains the erosion signal.

- **Window qualification is PER-PROGRAM (recorded choice):** a program contributes to an
  N-day window only if it individually has ≥ N days of snapshot history; warm-up + `asOf`
  + `daysOfHistory` derive from that same qualifying set, never a global min/max. Known
  gap: a creator active across two *disjoint young* campaigns (each < N days) sees the
  overall N-day board as warming up rather than stitched across campaigns — accepted.
- **Deltas floored at 0:** a 7d/30d window decrease never shows on the board
  (`greatest(delta, 0)`). The erosion signal is `sync_runs.warnings` (views_decreased),
  not the board. Tie ranking is **views-only** (equal views share a rank; `posts`/`name`
  set display order only). Delta baseline is the snapshot **at/before** `latest − N`
  (≤ ~1 day bias with daily snapshots) — accepted, no change.

**Why:** these are the difference between a correct board and a plausible-but-wrong one.
All of it lives ONLY in `lib/queries/leaderboard.ts`, proven by a committed, re-runnable
test (`scripts/test-leaderboard.ts`, CI job `leaderboard-test`). _Supersedes the earlier
all-time-freeze plan, dropped after the vendor confirmed an upstream fix._

## topic: leaderboard-access — _2026-06_

The leaderboard (`/leaderboard`, → `leaderboard.vocreations.com`) launched with
**per-creator magic-link auth (Supabase Auth)**, not a shared password.

- **Auth:** Supabase Auth, **magic links only** for launch (Google OAuth deferred —
  needs a Google Cloud client; follow-up). `lib/supabase/*` handles sessions; session
  refresh runs in `middleware.ts` for `/leaderboard` + `/auth` only.
- **Identity → data:** `session.email → creators.email → creator_id` (case-insensitive,
  `lib/queries/creator-access.ts`). All board data still comes from Drizzle keyed off
  the resolved creator — **no Supabase RLS** (Supabase is auth-only; our `creators`
  table is the authz source).
- **Access model:** a recognized creator sees the **overall** board + only the
  campaigns they're on (`program_creators`); the switcher lists only their campaigns;
  an unknown/unauthorized campaign param silently falls back to overall (enforced
  server-side in `page.tsx` against `getCreatorPrograms(creator.id)`, not the UI).
- **Overall-board cross-creator visibility is INTENDED (decided):** the overall board
  shows every creator's name + aggregate views across all campaigns to any recognized
  creator. This is by design (a shared agency board), not a leak — recorded so it's a
  conscious choice.
- **Alt emails are login-eligible (decided):** `creators.alt_email` (nullable, additive
  migration `0001`). `getCreatorByEmail` matches `email` OR `alt_email` (case-insensitive,
  input trimmed). The seed maps `email_primary → email`, `email_alt → alt_email`.
- **Open-redirect guard:** `/auth/callback` accepts only same-origin LOCAL `next` paths
  (must start with `/`, not `//` or `/\`); anything else falls back to `/leaderboard`.
- **Verification caveats (carry forward):**
  (a) The cross-campaign tamper defense (`page.tsx` resolves `c` only against the
  creator's own `getCreatorPrograms`) was verified by **code-path equivalence** — prod
  currently has a single active program, so there's no second campaign to tamper toward.
  **Re-verify with real data when a second campaign goes live.**
  (b) F1's **success-path** redirect branch (valid code → `${origin}${next}`) is exercised
  only after a real magic-link round-trip, which needs the SMTP cutover. **Pending the
  cutover round-trip test.**
- **YOU highlight** renders on both the list (ranks 4+) and the podium (top-3 card carries
  a YOU badge + teal treatment) — the motivational hook must be visible at launch.
- **Host rewrite for the subdomain:** `leaderboard.vocreations.com` rewrites any
  non-`/leaderboard`, non-`/auth` path to `/leaderboard` (in `middleware.ts`) — without
  it the subdomain root serves the marketing homepage. Uses the same
  `request.nextUrl.hostname` pattern as the www-redirect (only exercisable in production;
  `next dev` ignores a spoofed Host header). **VERIFIED in prod 2026-06-08** (commit
  `58b2f21`, DNS = CNAME → vercel-dns): `/` → 307 `/leaderboard/login`; `/about` → 307
  `/leaderboard/login` (rewritten, not the marketing page); `/auth/callback` → 307
  `/leaderboard/login?error=link` (the `?error=link` proves the callback route ran, i.e.
  `/auth` is NOT rewritten); apex `vocreations.com/` still 200 (marketing intact).
- **Staff access = Google OAuth + allow-list (decided):** agency staff sign in with Google
  (Supabase Google provider) and get the FULL dashboard — overall + ALL campaign boards,
  switcher unscoped, "staff view" badge, no YOU (staff aren't ranked). Allow-list is
  `STAFF_EMAILS` (comma-separated) OR `STAFF_EMAIL_DOMAINS` (default `vocreations.com`; set
  to `""` to disable domain matching), checked in `isStaffEmail()` before creator resolution.
  (Note: `@mohios.com` is NOT staff-by-domain — add such addresses to `STAFF_EMAILS`.)
  Non-staff unknown emails still get
  the directed screen. The magic-link + OAuth flows share `/auth/callback` (PKCE). **This
  same Google client is the planned auth for the Phase 4 CRM.**
- **Unknown email → directed screen (not a dead end):** "We don't recognize this email
  yet — DM Danny on Slack with the email you want to use." No data shown.
- **Seeding:** `scripts/seed-creator-emails.mjs` loads `creators.email` from a CSV
  (matches by Sideshift `external_id` / handle / name; dry-run by default).
- `noindex` (layout `robots`), standalone (no marketing nav).

**Why:** logging in as themselves is both the gate and the personalization (the "YOU"
row). Supersedes the interim shared-password / overall-board-only plan. **Supersedes
the old `Phase 5` "creator auth" step — pulled forward into launch.**

## topic: leaderboard-backfill — _2026-06_

Backfilled 7 months of history (2025-11-10 → 2026-06-07) so the 7d/30d boards render
real rankings instead of "warming up" (live snapshots only started 2026-06-07).
Tool: `scripts/backfill-snapshots.mjs` (dry-run by default; `--apply` writes).

- **Source data:** a per-brand CSV export (`backfill-input.csv`, 27 brands × 78 creators,
  brand-grain) + `handles-by-campaign.csv`. Gitignored (PII) — never committed.
- **Append-only:** `insert … on conflict (snapshot_date, program_id, creator_id) do
  nothing`. The live cron's rows are authoritative; the CSV only fills history before them.
- **Brand → program:** reuse an existing program by name; else create (`source='backfill'`,
  `status='ended'`). The 27 backfill brands were all net-new (Allinmotion, the only live
  program, was NOT in this export — its history is a separate follow-up backfill).
- **One human = one creator_id (condition A):** before creating, each backfill creator is
  matched to `active-creators-consolidated.csv` (the master roster) by normalized name; on
  match the row uses the master's **canonical name** so the email seed converges on it
  later (emails arrive via the seed, not here). 67/77 matched the master, 10 net-new
  (tagged in `creators.notes`; 4 are `Ghost: @handle` unattributed accounts).
- Also writes `program_creators` (participation, so the per-creator switcher works) and
  enriches `campaign_accounts` from the handles file.
- **Connection:** uses the DIRECT connection (`POSTGRES_URL_NON_POOLING`), not the
  transaction pooler — the pooler closes long multi-statement transactions; inserts are
  batched (chunks of 500) to keep it short.
- **Applied:** 27 programs, 77 creators, +714 campaign_accounts, 15,682 snapshots.
  Verified 5/5 spot-check (CSV lifetime == DB). **No-seam reconciliation (backfill latest
  ≈ live) is deferred to the Allinmotion follow-up** (disjoint datasets until then).

## topic: payments — _2026-06_

Removed the website checkout (`app/mentorship/enroll/` page and `app/api/checkout/`
route) and the Google Sheets logging in the Stripe webhook (`logToSheet`,
`GOOGLE_SHEET_WEBHOOK`).

**Why:** mentorship is no longer sold through the website — sales go via direct
Stripe payment links sent to buyers. Payment visibility is handled by Slack
notifications alone, so the Sheets path and the on-site checkout were dead weight.
The webhook (`app/api/stripe-webhook/route.js`) stays, posting to Slack only.
`STRIPE_PRICE_FULL` / `STRIPE_PRICE_PLAN` / `GOOGLE_SHEET_WEBHOOK` are now unused
in Vercel (safe to delete).

## topic: marketing-2026-06 — _2026-06_

Shipped a marketing refresh. Supersedes the previous framing.

- **Guarantee** (homepage): now "1,000,000 organic views minimum, or 50% of your
  fee back" — replaces the old "3M+ view baselines" language. (Note: `/creators`
  still references "3M+"; left as-is, not yet reconciled.)
- **Mentorship:** reframed as a 4-month path toward $10–15K/month, replacing the
  old "two months / $3–5K" framing.
- **New routes:** `/daniel`, `/danny`, `/thienvu` (conference/QR landings,
  `noindex`, standalone — no Nav/Footer), plus `/pre-call` and `/refund-policy`.

**Why:** stronger, more concrete positioning and dedicated conversion surfaces for
in-person/QR traffic. These are LIVE on `main` (an earlier SITE.md draft described
them as "not yet live" — that was stale and has been corrected).

## topic: leaderboard-trigger — _2026-06_

The `/campaigns/leaderboard` snapshot is built by an Apps Script on its **own**
time-driven trigger (06:30 daily), fully decoupled from the existing `syncActive()`
digest — installed as a separate trigger, not added inside `syncActive()`.

**Why:** a leaderboard failure must not be able to take down the daily Slack/Discord
campaign digest. Independent triggers isolate the blast radius. Sideshift API keys
stay in Apps Script; Vercel only knows the Web App URL + page password.

## topic: leaderboard — _2026-06_

Removed the creator leaderboard entirely: deleted `app/campaigns/leaderboard/`, the
basic-auth gate in `middleware.ts`, and the `LEADERBOARD_DATA_URL` /
`LEADERBOARD_PASSWORD` env vars (also removed from Vercel). **Supersedes
`topic: leaderboard-trigger`.**

**Why:** the V1 implementation wasn't good enough and is being rebuilt from scratch.
Removed now so the rebuild starts clean rather than extending dead code. The
out-of-repo Apps Script reference copy (`apps-script/campaign-tracker-v2.gs`) is
left in place because the same script still serves the daily campaign digest; its
leaderboard functions are dormant until the rebuild decides what to reuse.

## topic: canonical-domain — _2026-04_

Made **non-www** (`vocreations.com`) the canonical/primary domain; `www` now
308-redirects to it (previously reversed, with a 307). Added `middleware.ts` to
enforce the redirect and strip tracking query params (`?wtime=`, `?trakyo_id=`)
that created duplicate URLs. Added Squarespace legacy-URL redirects in
`next.config.mjs`.

**Why:** GSC flagged duplicate-without-canonical and 404 issues from the old
Squarespace site. Full SEO history: [../SEO-WORK-DIARY.md](../SEO-WORK-DIARY.md).

## topic: showcase-video — _(convention)_

Inline showcase `<video>` blocks always use `src={`${v.src}#t=0.1`}` plus
`playsInline muted loop preload="metadata"`, with `onMouseLeave` resetting
`currentTime = 0.1`.

**Why:** the `#t=0.1` media fragment forces iOS Safari to render the frame at 0.1s
as a thumbnail instead of a black box — no separate poster image needed. Reference:
`app/page.tsx`. Keep all raw `<video>` blocks identical.

## topic: content-assets — _2026-06_

Binary/internal assets under `content/` are gitignored (`*.png/jpg/jpeg/webp`
and `content/UGC Trackr/`); only `content/*.md` notes are tracked. The assets
(LinkedIn banners, source QR/photo files, and the "UGC Trackr" brief +
screenshots) live in Google Drive instead.

**Why:** none are referenced by the site (only `public/` is served; the QR/photo
sources are already duplicated under `public/`). Committing ~15MB of unreferenced
binaries would bloat git history permanently. The UGC Trackr brief is for a
separate project (`voc-trackr-internal` → `trackr.vocreations.com`) and, per the
brief itself, should not live in the marketing repo.

## topic: mercury-webhook — _2026-06_

Added `app/api/mercury-webhook/route.js`: Mercury bank `transaction.created`
events → Slack (#ka-ching, the same `SLACK_WEBHOOK_URL` as the Stripe webhook).
Posts **incoming payments only** (`amount > 0`). Parses Mercury's Events API
envelope (`resourceType` / `operationType` / `mergePatch`), NOT a `{type,data}`
shape. New env var: `MERCURY_WEBHOOK_SECRET`.

**Why:** the team wanted an "agency ka-ching" feed of incoming revenue alongside
the mentorship Stripe alerts. Signature is HMAC-SHA256 over `"<ts>.<body>"`
(`Mercury-Signature` header) with replay protection. Mercury has no test-event
feature, so the handler logs the full payload and falls back to a raw message on
an unexpected shape, to be refined from the first real event.

## topic: deploy — _2026-06-17_ (org migration broke auto-deploy)

On **2026-06-12** the GitHub repo was transferred from the `mohios-nz` user to the
**`vo-creations`** org (`vo-creations/Vo-Creations`, repo id `1211008171`; the old
`mohios-nz/Vo-Creations` path now 301-redirects there). The transfer **broke
Vercel's git auto-deploy**: a repo moving orgs drops the Vercel GitHub App's
authorization, so pushes to `main` stopped triggering builds. PRs #28, #29, #30 all
merged to `main` but never shipped — the last git-triggered prod build was #26
(`3e9d54d`, 2026-06-12).

**Bridge:** #30 (about-page edit) was shipped on 2026-06-17 with a one-off
`vercel --prod` from clean `main` (deploy `dpl_G7V7Resv…`). This is the documented
exception, valid ONLY because git auto-deploy is down — see the caveat below.

**Still open (Danny-gated, dashboard-only):** the Vercel **project** still lives in
the `mohios` team (`vercel.com/mohios/vocreations`); the `vo-creations` Vercel
account is empty. To finish the migration and restore merge-to-deploy, either
**transfer** the project (mohios team → vo-creations account; keeps domain + env
vars + history) or **re-import** `vo-creations/Vo-Creations` into the vo-creations
account and re-add env vars + move the `vocreations.com` domain. Either way,
reconnect the Vercel GitHub App to the `vo-creations` org. Until then, every deploy
needs a manual `vercel --prod`.

## topic: deploy — _2026-06_

Deploy by **merging to `main`**; Vercel's git integration builds and ships to
production. Do not deploy prod-only changes via `vercel deploy --prod` from a
branch and expect them to persist.

**Why:** production always resets to `main` on the next git deploy. A CLI/branch
deploy that was never merged silently reverted a live `/about` update when an
unrelated PR merged (recovered by cherry-picking the orphaned commit). Supersedes
the earlier "always deploy via CLI" practice.

## topic: docs-standard — _2026-06_

Adopted **website-build-rules v1**: `CLAUDE.md` router (with the embedded version
marker), `docs/SITE.md` (present-tense wiring, points at `app/` + `.env.example`,
does not enumerate routes/env), this file, and `scripts/docs-check.mjs` +
`.github/workflows/docs-check.yml` (env-sync, dead-links, version-skew).

**Why:** single source of truth for docs across website repos; the version-skew
check replaces the previous hand-rolled "known-broken 30-day expiry" check.
`build.yml` (runs `next build` on PRs) is kept separately, outside the standard.

## topic: agency-only-redesign — _2026-07-30_

Built on branch `redesign/agency-only` (not yet merged to `main`): dropped the
mentorship enrollment funnel and reframed the site as agency-only, plus a visual
refresh. Deleted `app/mentorship/` and `app/pre-call/` (and their nav/footer/
sitemap links); remaining "mentorship" copy on `app/page.tsx`, `app/about/page.tsx`,
`app/layout.tsx`, `app/creators/page.tsx`/`layout.tsx`, and
`app/campaigns/maxxd/page.tsx` was softened to "in-house training program"
language. Visually: a floating pill-style `Nav.tsx`, an Instrument Serif italic
accent font on key headline words, a redesigned homepage hero (kicker badge,
hex-texture background, "Trusted by" client strip), and the "Results" section
reframed as "Case Studies."

**Why:** mentorship was sold as a standalone enrollment product (`topic:
marketing-2026-06`); this removes that funnel entirely and repositions the company
as agency-only, with training framed as an internal differentiator rather than
something visitors buy into directly. Supersedes the mentorship-funnel parts of
`marketing-2026-06` (the `/pre-call` route and mentorship framing); the guarantee
copy and `/daniel`/`/danny`/`/thienvu` landings from that entry are unaffected.
No Stripe/payment wiring changed (`topic: payments` still holds) — the removed
pages had no payment links.

## topic: single-page-site — _2026-07-30_

Built on branch `redesign/agency-only` (not yet merged to `main`): collapsed
`/about`, `/creators`, and `/roi` into `app/page.tsx` as homepage sections
(`good-marketing.co`-style — nav shows only a few anchors, the page itself
has more scrollable sections than the nav lists). `/blog` (and its only post,
`/blog/text-on-screen-ugc`) is deleted outright, not merged; the user doesn't
maintain it. `next.config.mjs` `redirects()` sends the four old paths to their
new homes permanently: `/about` → `/#team`, `/creators` → `/#creators`, `/roi`
→ `/`, `/blog` and `/blog/*` → `/`.

- **Deduped, not concatenated.** About, Creators, and ROI each had their own
  near-identical "market stats" block (`marketStats`/`marketStats2`, UGC-spend
  figures) and Creators + ROI both had the same budget-calculator
  implementation. The merged homepage keeps exactly one of each — sourced from
  ROI's copy/styling, since the task named ROI as the source for both. About's
  "Our Network" video grid was also dropped as a duplicate: it showcased the
  same 4 posts (same view counts) as the homepage's existing "Content that
  goes viral" section, just with less data (no likes/engagement). Only About's
  founder-story video block (YouTube + 3 vertical clips) was merged, as
  `#our-story`-equivalent content ahead of "How it works."
- **Not everything on About came over.** The task named exactly three About
  sections to merge (story/video, differentiators, team); the "UGC + Paid Ads"
  comparison block wasn't on that list and was left behind when the page was
  deleted, not merged.
- **New anchors:** `#creators` (roster grid) and `#team` (founders) placed
  right after `#results` (Case Studies) — "see the case studies" → "meet the
  creators and founders who made them." Market stats + calculator sit between
  "Our Format" and "Pricing" — market education and ROI math before the price
  ask, same funnel position they held on the standalone ROI page.
- **Nav trimmed to match good-marketing.co's pattern.** `components/Nav.tsx`
  now lists exactly 3 anchors (Case Studies, Our Team, FAQ's) plus the Book a
  Call CTA; Creators and the market/calculator content are reachable by
  scrolling but not linked from nav, by design. `components/Footer.tsx`'s
  links now point at `/#team` and `/#creators`; the Blog link was removed.
- **Orphaned components deleted alongside `/blog`:** all of `components/blog/`
  (17 files + `hooks/`) — nothing outside `app/blog/` imported any of them,
  confirmed by grep before deletion. `components/VideoPlaceholder.tsx`,
  `AnimateIn.tsx`, `InstagramEmbed.tsx`, and `WistiaEmbed.tsx` are also unused
  repo-wide but predate this change (not orphaned *by* this merge), so they
  were left alone rather than swept up as unrelated cleanup.
- `app/sitemap.ts` now lists only the homepage; `/about`, `/creators`, `/roi`,
  and both `/blog` entries removed since those routes no longer exist.
  `docs/SITE.md`'s Routes section never enumerated these pages (it only calls
  out non-obvious wiring), so nothing there needed updating.

## topic: single-page-site — _2026-07-31_

Follow-up on branch `redesign/agency-only` (still not merged): removed the
`#creators` roster-grid section and the standalone `#pricing` section from
the homepage (pricing folded into a new FAQ item, "What's the investment?",
right after the existing creator-count FAQ). Rebuilt the `#team` section to
a good-marketing.co-style card (large photo, name + verified-badge icon,
location + pin icon, bold-italic accent stat line, plain detail line) with
real bios; the earlier "Co-Founder" title field is dropped, not part of
this card format.

- **`id="creators"` no longer exists.** `components/Footer.tsx`'s "Creators"
  link (`/#creators`) is removed, and `next.config.mjs`'s `/creators`
  redirect now points at `/` instead of the now-dead `/#creators` anchor —
  same pattern as `/roi`'s redirect. `#team` and `#faq` anchors are
  unaffected; `id="pricing"` was never set, so no redirect referenced it.

## topic: single-page-site — _2026-07-31 (hero + fonts)_

Second follow-up on branch `redesign/agency-only` (still not merged): deleted
the "Our Story" section (About's founder video block, merged into the
homepage two sessions ago) entirely — no replacement, no anchor pointed at
it.

- **Hero is intentionally monochrome, scoped to that one `<section>`.**
  Black background, white text, no amber — kicker pill, the "build" accent
  word, and both CTA buttons are white/black/gray only. This is a one-off
  exception to the site's light/amber theme (`topic: agency-only-redesign`),
  not a token change: `tailwind.config.ts`'s `bg`/`text`/`accent` tokens are
  untouched, the rest of the page still reads off them. Also dropped the
  `.bg-hex` texture and the amber radial-gradient glow from the hero (both
  were amber-tinted); the class itself stays in `globals.css` for reuse
  elsewhere, unused, not deleted. Added "make them remember." as a
  small-caps kicker line above the pill badge, matching the treatment
  already used in Nav/Footer.
- **New display font: Bricolage Grotesque** (`next/font/google`,
  `--font-bricolage`), wired as `tailwind.config.ts` `fontFamily.display`.
  Applied to the hero `<h1>` and every major section `<h2>` sitewide
  (`app/page.tsx` and `app/refund-policy/page.tsx`, matched by their shared
  `text-[clamp(24px,3.5vw,36px)] font-extrabold tracking-tight` class).
  Inter (`topic` two entries up) stays the body font everywhere.
- **Hero stat "100+ Trained creators" → "500+."** Grepped the repo for other
  aggregate creator-count claims first — the only other one
  ("From 3 minimum-wage jobs to 100+ creators...") lived in the now-deleted
  Story section, so no separate edit was needed. Individual per-person
  stats (Daniel's/Thienvu's personal view counts) are unrelated and
  untouched.
- **"Trusted by" is now a marquee**, using the `scroll` keyframe /
  `animate-scroll` utility that already existed in `tailwind.config.ts`
  unused. The logo list is duplicated once in the DOM (`[...trustedBrands,
  ...trustedBrands]`) for a seamless `translateX(-50%)` loop.
  **No real client logo files exist anywhere in the repo** (checked
  `public/` and `design/`) — this still renders the bold-text placeholder
  treatment, just animated. Real logo files need to land in `public/logos/`
  before this is done; a `TODO` comment above `trustedBrands` in
  `app/page.tsx` flags this at the code site.

## topic: in-house-positioning — _2026-07-31_

On branch `redesign/agency-only` (still not merged): reframed the core
pitch from "outside UGC agency" to "your embedded in-house UGC program."
Three spots updated: hero headline ("We're not an agency. We're your
in-house UGC program.", accent-italic treatment moved from "build" to
"in-house UGC program."), hero subheading ("...We run as an extension of
your team, not an outside vendor."), and the footer brand tagline ("Your
in-house UGC program, without the overhead.") — the old tagline's "UGC
agency that trains its own creators" line is gone along with it.

Also removed the footer's social icon row (TikTok/Instagram/YouTube/X)
entirely per direct request — brand mark, tagline, Links column, and CTA
column are otherwise unchanged.

- **Not a full sweep — flagged, not fixed, by design.** The user asked to
  scan `app/page.tsx` for other "agency"-framed headline copy and report
  back rather than have it rewritten wholesale. Found one direct conflict:
  the Team section's subtext still reads "Proven creators, turned **agency**
  owners" (`id="team"`, right under "Small team. Senior operators.") —
  left as-is, flagged for a decision.
- **Also flagged (out of the requested file scope, so untouched):**
  `app/layout.tsx`'s SEO surface repeats the old "UGC agency that trains its
  own creators" / "builds its own creator supply chain" framing four times —
  `metadata.description`, `openGraph.description`, `twitter.description`,
  and `organizationJsonLd.description`. None of these render on-page, but
  they'll surface in Google results and social-share previews, now out of
  step with the new hero copy. The `sameAs` social-profile URLs in
  `organizationJsonLd` are untouched on purpose — that's structured data
  about the company's social presence, a different concern from the visible
  footer icon row that was actually asked to be removed.

## topic: agency-only-redesign — _2026-07-31 (theme reverted to dark)_

The light-theme flip (this same topic, earlier entry) is reversed. Branch
`redesign/agency-only` (still not merged) is back to the original dark
palette: `tailwind.config.ts`'s `bg`/`text`/`border` tokens restored to
their pre-flip hex values (`bg.DEFAULT #0F0D0B`, `text.DEFAULT #F5EDE3`,
etc.); `accent` (amber) was never touched either direction.
`globals.css`'s scrollbar track/thumb, `::selection`, and the `.bg-hex`
texture stroke opacity are reverted to their dark-calibrated values too.

- **The `text-bg`/`text-text` button-contrast trick flips with the theme,
  by design — reverted along with it.** Buttons need dark text on the
  amber accent background regardless of theme; which *token* is dark
  depends on which theme is active. Light theme: `bg.DEFAULT` is white, so
  buttons used `text-text` (dark in light theme). Dark theme:
  `bg.DEFAULT` is near-black again, so buttons revert to `text-bg` — the
  original trick. All 6 call sites (`Nav`, `Footer`, `CTABlock`,
  `SaaStrLanding`, `campaigns/maxxd`, `refund-policy`) flipped back.
  Same logic for the handful of hardcoded `black/opacity` chrome utilities
  (nav pill hovers, secondary-button outlines) that were flipped to
  `white/opacity` for the light theme — reverted to black, EXCEPT the
  video-thumbnail overlays (`bg-black/50` badges, `from-black/85`
  gradients, embed play-button scrims), which were correctly never touched
  in either direction — those stay dark regardless of page theme by
  design.
- **The hero no longer hardcodes `bg-black`.** With the page dark again,
  `bg-bg` (`#0F0D0B`) is close enough to true black that the hero's own
  background override was redundant and looked like a seam at the section
  boundary. Swapped to the `bg-bg` token so it's pixel-identical to every
  other section's background. Same for every hero element that was neutral
  (not fighting amber) — kicker pill border/text, tagline, headline base
  color, subheading, stat dividers/numbers/labels — all switched from
  hardcoded `white/opacity` back to the normal `border-border` /
  `text-text` / `text-text-secondary` / `text-text-dim` tokens, so the hero
  reads as "just another section" rather than a separate design. What
  stays hardcoded, deliberately: the kicker dot (`bg-white`, since the
  token equivalent would be amber), the headline's emphasized clause
  (`text-text-secondary`, replacing what would otherwise be an amber
  span), and both CTA buttons (`bg-white text-black` primary, bold
  `border-white` outline secondary) — those are the actual "no amber in
  the hero" requirement from two sessions ago, preserved as-is.

## topic: trusted-by-logos — _2026-07-31_

Wired real client logos into the homepage's "Trusted by" marquee
(`app/page.tsx`), replacing the bold-text placeholder from the prior
session. 9 files landed in `public/logos/`: `aonic.jpg`, `blackbox.png`,
`causes.png`, `codedex.jpg`, `dubbing.png`, `fable.png`, `kicker.png`,
`liftoff.jpeg`, `makon1.png` — filenames matched what was specified
exactly, no discrepancies. (They were actually dropped in a `logos/`
folder at the repo root, not `public/logos/`; moved before wiring, since
only `public/` is served statically.)

- **Each logo sits in its own `bg-white rounded-xl` chip** (not a bare
  `<Image>`), because several of the source files have an opaque
  white/light background baked in rather than transparency — chipping
  every logo the same way, even the ones that would've floated free on
  transparent backgrounds, keeps all 9 visually consistent instead of some
  showing an awkward box and others not.
- Marquee mechanics (duplicate list once, `animate-scroll`,
  `overflow-hidden` wrapper) are unchanged from the placeholder version —
  just swapped `<span>{name}</span>` for the chip + `<Image>`.

## topic: agency-only-redesign — _2026-07-31 (monochrome text, moody bg, team/case-study polish)_

On branch `redesign/agency-only` (still not merged):

- **Amber removed from all TEXT color, buttons untouched.** Swept
  `components/Label.tsx`, `components/Nav.tsx`, `components/Footer.tsx`,
  and every `text-accent` in `app/page.tsx` individually — headline
  highlight words (`viral`, `Ever.`, `marketing budgets`, `impact.`) had
  their accent `<span>` removed outright rather than recolored, since
  the whole headline is already `font-extrabold` and an inline color was
  the only differentiator; stat numbers/badges/checkmarks switched to
  `text-text` (bright) so they still read as emphasized via brightness,
  not color. `components/ResultCard.tsx`'s own `text-accent` (the big
  view-count number, the decorative quote mark) was deliberately **not**
  touched — the task scoped the systematic sweep to `app/page.tsx` and
  `Nav.tsx`; flagged for a decision rather than assumed in scope.
- **Subtle warm-dark gradient, body-level.** `globals.css`'s `body` rule
  gained two low-alpha (`0.07`–`0.08`) maroon `radial-gradient`s pinned to
  opposite corners via `background-attachment: fixed`, layered under the
  existing `bg-bg` solid color. Intentionally applied page-wide rather than
  hero-only — the hero was just unified with the rest of the page's
  background in the prior session, so a hero-only gradient would have
  recreated the "separate box" problem that fix solved.
- **Team section:** heading → "Proven Viral Creators", subtitle line
  removed entirely (was "Proven creators, turned agency owners" —
  conflicted with the in-house-positioning work anyway, since it called
  Vo Creations an "agency"). Both members now show a "Co-Founder" tag
  (hardcoded once in JSX, not duplicated per-record — both say the exact
  same thing). Thienvu's credential line → "Founder of Vo Creations
  Mentorship".
- **Thienvu's team photo is blurry because the source file is
  160×160px** (`public/videos/team-thienvu.jpg`) — Daniel's is 600×600px.
  Confirmed via `file`/`sips`, and confirmed there's no CSS blur filter or
  object-fit difference between the two `<Image>` calls (identical code).
  Needs a higher-resolution source file; not something fixable in code.
- **Case study logos**, `ResultCard.tsx`: new optional `logo` prop, reused
  the same white-chip treatment as the "Trusted by" marquee for the same
  reason (source files have opaque light backgrounds). Wired the 4 that
  exist: `fable.png`, `codedex.jpg`, `blackbox.png`, `makon1.png`.
- **Video showcase → horizontal scroll, not a marquee.** Unlike "Trusted
  by," these videos need hover-to-play / tap-to-unmute, which a
  continuously-moving carousel would fight with — used
  `overflow-x-auto snap-x snap-mandatory` instead (manual, user-driven).
  Cards are fixed-width and `shrink-0`, so any number of future videos
  just extends the scroll area — no redesign needed to add a 5th, 10th, etc.
- **Footer's dangling "Links" column** (previously just a stale `/#about`
  link) repopulated with the same 3 anchors as the main nav (Case Studies /
  Our Team / FAQ's) rather than deleted — gives the column real utility
  instead of leaving a visibly empty grid cell.

## topic: agency-only-redesign — _2026-07-31 (follow-through: photo, amber sweep, logos, carousel)_

Four corrections on branch `redesign/agency-only` (still not merged), after
the prior session's pass on the same items didn't fully land.

- **Thienvu's team photo, re-confirmed as a source-file problem, not code.**
  `public/videos/team-thienvu.jpg` is 160×160px / 5.8KB (`file` + `sips`);
  `team-daniel.jpg` is 600×600px / 88KB. Both render through the exact same
  single `<Image fill className="object-cover" />` call inside one
  `team.map()` — no per-person branching, no `quality` prop, no filter, no
  transform. At the card's rendered size a 160px source has to upscale
  ~2–2.5x, which is the blur. Needs a higher-resolution source file; still
  not something fixable in code, confirmed a second time.
- **Amber-text sweep widened past `app/page.tsx`/`Nav.tsx`.** This time
  `components/ResultCard.tsx` (explicitly flagged last round, now fixed):
  the big view-count number, the decorative quote mark, and mini-stat
  values all switched `text-accent` → `text-text`. Also fixed for sitewide
  consistency: `app/refund-policy/page.tsx` (7 spots — headline highlight,
  4× numbered-step badges, a callout kicker, the contact-email link, the
  "Agreement" card heading) and `components/SaaStrLanding.tsx` (the SaaStr
  badge kicker on the `/daniel`/`/danny`/`/thienvu` QR pages). Left alone,
  deliberately: `app/campaigns/maxxd/**` (7 spots) — a separate internal
  client-dashboard tool with its own established accent-heavy stat
  aesthetic (`font-mono` stat displays, chart line color), never part of
  this redesign's scope; and `components/VideoPlaceholder.tsx` — confirmed
  dead code, imported nowhere. `border-accent`/`border-border-accent` was
  left everywhere it appears — borders, not text, and the task explicitly
  allowed keeping those.
- **Marquee logo chip wrapper removed.** The `bg-white rounded-xl` chip
  added last round is gone; each logo now renders bare via `<Image
  className="h-14 w-auto object-contain" />` at a visibly larger, uniform
  height. Several source files (Fable, Aonic, Dubbing AI, Kicker, Causes,
  Liftoff) still show their own baked-in light background — that's the
  source pixels, not a wrapper we're adding, and expected per the brief.
- **Video showcase carousel: root-caused why it looked static.** The
  `overflow-x-auto`/`snap-x` classes were already present, but at
  `w-[240px]` per card, 4 cards fit entirely inside the `max-w-[1100px]`
  section on any normal desktop viewport (996px of content in ~1052px of
  space) — nothing ever overflowed, so there was nothing to scroll.
  Widened cards to `w-[260px] sm:w-[300px]` (now ~1248px of content vs.
  ~1052px available, guaranteeing overflow and an edge peek even with
  only today's 4 videos) and added a `.scrollbar-hide` utility to
  `globals.css` (no Tailwind scrollbar plugin installed) — the
  scrollbar-hiding requirement from the brief had been missed entirely
  the first time around.

## topic: agency-only-redesign — _2026-07-31 (buttons monochrome, real logo, four sections cut)_

Branch `redesign/agency-only` (still not merged):

- **Every amber-background button, sitewide, converted to the hero's
  white-bg/black-text style** (dropping the `from-accent to-[#E08A1E]`
  gradient in favor of plain white — no gradient needed once it's
  monochrome). Found by grepping for `bg-accent`/the gradient pattern and
  filtering to actual buttons vs. incidental low-opacity accent tints
  (card/callout backgrounds, the quote bar in `ResultCard`, Nav's inert
  active-link pill) — tints were left alone, only real CTAs changed.
  6 buttons total: Nav "Book a call," Footer "make them remember,"
  `CTABlock`'s default "Apply for a campaign slot," the same button
  duplicated in `refund-policy` and `campaigns/maxxd`, and
  `SaaStrLanding`'s CTA on the `/daniel`/`/danny`/`/thienvu` pages.
  Unlike the text-color sweep, no file was carved out here — the brief's
  wording ("every ... button sitewide") didn't leave room for treating
  `campaigns/maxxd` as a separate product this time.
- **Footer brand mark is now the real logo**, not a "V" in a circle.
  `public/VoCreations Logo.webp` renamed to `public/vocreations-logo.webp`
  (URL-safe, no encoding needed) — which meant also fixing
  `organizationJsonLd.logo` in `app/layout.tsx`, the only other reference
  to the old filename, or the JSON-LD would've pointed at a 404.
- **Four sections deleted outright**, no replacement: "Our Format" (the
  talking-head comparison table), "What Makes Us Different" (the 01-04
  differentiators list), "The Market" (UGC-spend stat cards), and "Your
  Budget" (the influencer-cost calculator). All four were consecutive in
  the DOM, so removed as one contiguous block between "How It Works" and
  "Case Studies," leaving exactly one divider at the seam. Also removed:
  the now-dead `differentiators`/`marketStats`/`marketStats2` data arrays,
  and the `budget`/`videos` `useState` pair plus every value derived from
  them (`influencerCost`, `vocCostPerVideo`, `savings`, `savingsPercent`)
  — none of it had any remaining reader once the calculator section was
  gone. Grepped after removal to confirm nothing else in the file
  referenced any of it.

## topic: agency-only-redesign — _2026-07-31 (nav logo/border, two-column hero)_

Branch `redesign/agency-only` (still not merged):

- **Nav brand mark** now reuses the same `/vocreations-logo.webp` +
  wordmark pattern already established in `Footer.tsx`, sized down for the
  smaller nav pill (32px vs. the footer's 40px). The "make them remember."
  tagline that used to sit under the wordmark is gone — it moved into the
  hero as the new H1 (below), so it wasn't lost, just relocated.
- **Nav pill border** flipped from the barely-visible `border-border`
  (dark theme's `rgba(255,255,255,0.06)`) to `border-white/20`, on both
  the desktop pill and the mobile dropdown, so the nav reads as a
  deliberately outlined pill rather than a borderless floating bar.
- **Hero rebuilt as a two-column layout** (good-marketing.co-style): copy
  left, floating video-preview cards right, collapsing to a single
  centered column below the `lg` breakpoint (the right column is
  `hidden lg:block`, not resized down — floating overlapping cards don't
  translate to narrow screens, and the same videos are already visible
  in the "Content that goes viral" carousel further down, so nothing is
  lost on mobile).
  - The old H1 ("We're not an agency...") is gone. "make them remember."
    (previously a tiny Nav/Footer-style tagline) is now the actual H1,
    scaled up to hero size, keeping the same `[font-variant:small-caps]`
    treatment it always had. A second line, "Content that converts.," sits
    under it in the same size/weight but muted (`text-text-secondary`) —
    same subtle-distinction pattern used elsewhere for a headline's second
    clause, applied here to the whole second line instead of one word.
  - Subheading replaced outright with the single line specified: "Scale
    your B2C product with your own world-class in-house UGC program."
  - Applied `.bg-hex` to the hero background — it was defined in
    `globals.css` from an earlier session but never actually applied
    anywhere; confirmed via grep before adding it.
  - Floating cards reuse `showcaseVideos[0]` and `[1]` (already defined
    further down the file for the video carousel) with the same
    hover-to-play/tap-to-unmute handlers as every other video on the page,
    plus a small eye-icon + view-count badge in the corner of each.

## topic: agency-only-redesign — _2026-07-31 (hero dimming bug fixed, reverted to centered)_

On branch `redesign/agency-only` (still not merged): the two-column hero
from the previous entry didn't work out and is reverted.

- **Root cause of the "everything looks dim" report:** `.bg-hex` (and its
  successor `.bg-dots`) carries a `mask-image` intended to fade a
  *decorative* layer at the edges. The two-column hero applied the class
  directly to the `<section>` that also held the actual headline/CTAs —
  `mask-image` masks the whole element's painted output, descendants
  included, not just its own `background-image`. Every piece of real
  content inherited that same edge-fade, reading as a semi-transparent
  film over everything. Fixed by moving the texture back onto its own
  `absolute inset-0 ... pointer-events-none` div, sitting behind the
  content in DOM order — the pattern this file used before the
  two-column experiment, and the only correct way to use a masked
  decorative layer. Left a comment at both the CSS rule and the JSX call
  site spelling out why, so this doesn't regress a third time.
- **Two-column layout reverted to the original centered single column.**
  No more `lg:grid-cols-2` split, no floating video-preview cards, no
  `hidden lg:block` right column. The copy changes from that session
  (headline "make them remember." / "Content that converts.," the new
  one-line subheading) are kept — only the *layout* and the side videos
  were the problem, not the words.
- **Texture redesigned while fixing the bug**, per the separate ask to
  move off good-marketing.co's exact hex pattern: replaced with a plain
  CSS `radial-gradient` dot grid (`.bg-dots`, 28px spacing, 8% white
  opacity, same edge-fade mask as before) — no SVG needed, no repeating
  geometric shape, distinct from a honeycomb.

## topic: agency-only-redesign — _2026-08-01 (hero type/alignment, logo background removal)_

Branch `redesign/agency-only` (still not merged):

- **Hero headline: dropped small-caps + the Bricolage display font,
  switched to normal sentence case in Inter at `font-extrabold` (800).**
  Small-caps at hero size on a heavy display font was reading blocky;
  small-caps stays reserved for the small tagline usage in Nav/Footer,
  where it originated. Headline is "Make them remember." / "Content that
  converts." now (was already this copy, just re-cased).
- **Hero reverted to left-aligned** (was centered): wrapped the content in
  a `max-w-[720px] mx-auto` column that self-centers as a block while
  everything inside it — kicker, headline, subhead, CTAs, and the stats
  row — is left-aligned (`items-start text-left`). Stats row moved off
  `text-center`/`mx-auto` to match the rest of the column.
- **Logo background removal**, `public/logos/`: no ImageMagick in this
  environment; installed Pillow + numpy via pip (neither was present) and
  wrote a from-scratch fuzzy-color-to-transparent implementation (distance
  from a sampled target color, with a soft ramp zone instead of a hard
  cutoff to avoid jagged edges), auto-cropped to content bounding box
  after stripping.
  - **First pass revealed a second problem the naive approach didn't
    catch**: several logos (Aonic, Causes, Fable, Makon AI) have a dark/
    black wordmark, not just a light background. Stripping only the
    background left black-on-near-black — invisible against the page.
    Fixed by also recoloring genuinely dark, low-saturation pixels
    (`sat < 0.30, val < 0.55`, HSV) to white — tuned iteratively by
    actually viewing composited before/after renders (dark page bg
    behind each processed logo) via the Read tool's image support, not
    just checking that the command exited 0. Threshold required real
    tuning: value-only cutoffs wiped out genuinely dark-but-saturated
    icon colors (Causes' green/blue rings, Makon's purple mascot);
    saturation-only cutoffs missed Dubbing AI's slightly-blue-tinted
    gray text (sat 0.26) and left Fable's rich-black text hollow-outlined
    (its "black" ink has sat 0.27, computed saturation being numerically
    unstable at near-zero brightness). The combined threshold works
    because in every affected asset, real icon colors sit at
    `val > 0.5` even when as vivid as `sat = 1.0`, while the problem
    text sits at `val < 0.4` regardless of its (often near-zero, noisy)
    saturation.
  - `kicker.png` was deliberately excluded from recoloring — its black
    text sits on the logo's own cream card, not on the page background,
    so lightening it would've broken it against its own card.
  - `aonic.jpg` and `codedex.jpg` came out as `.png` (alpha requires it);
    old `.jpg` originals deleted, all references updated (marquee array
    + the Codedex `ResultCard`, which had its own separate reference to
    the old filename).
  - `liftoff.jpeg` has a genuine diagonal gradient background, not a flat
    color — can't be color-keyed. Left as an opaque JPEG, wrapped in a
    small `bg-bg-elevated` chip in the marquee (`needsChip` flag on its
    `trustedBrands` entry) instead of forcing a bad key.
  - Every processed file verified by compositing onto the actual page
    background color and viewing the result, not just confirming the
    script ran without error.
