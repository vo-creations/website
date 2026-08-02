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

## topic: agency-only-redesign — _2026-08-01 (hero left-align actually fixed, texture removed)_

Branch `redesign/agency-only` (still not merged). The previous entry's
left-align fix didn't actually take — root cause and a real fix this time.

- **Root cause: `mx-auto` on the hero's content wrapper.** The wrapper had
  `max-w-[720px] w-full mx-auto flex flex-col items-start text-left`.
  `items-start`/`text-left` correctly left-align each child *within* the
  wrapper, but `mx-auto` centers the wrapper itself as a block inside the
  section — on a wide viewport that puts a 720px column floating in the
  middle of the screen, which reads as "centered" regardless of what
  alignment is set inside it. Fix: dropped `mx-auto` (and the now-pointless
  `w-full`) entirely, so the wrapper is a plain block that starts at the
  section's own left padding edge, same as every other block element
  without auto margins.
- **`.bg-dots` removed from the hero and deleted from `globals.css`
  entirely** (grepped first — it had no other callers) — flat solid
  background, matching the Playkit.co reference, no texture at all.
- **Verified this time with a real headless browser, not just markup
  inspection.** No Playwright/Chromium was installed; installed both
  (`npx playwright install chromium`, plus the `playwright` npm package
  in a scratch dir outside the repo) and used actual
  `getBoundingClientRect()` calls against the running dev server to
  confirm the kicker pill, headline, subheading, and hero CTA all sit at
  `x=24px` (the viewport edge plus the section's own `px-6` padding) —
  not `x≈360px`, which is where they'd sit if still centered on a 1440px
  viewport. Confirmed at both a 1440px desktop and a 390px mobile
  viewport, and took real screenshots of both to visually confirm the
  result (readable, cleanly left-aligned, flat black background, no
  visible dot texture).
- **Headline weight/tracking already maxed out within the current type
  system, left as-is.** `tracking-tighter` is Tailwind's tightest
  built-in letter-spacing utility (tighter than the `tracking-tight` the
  brief suggested trying) and `font-extrabold` (800) is the heaviest
  weight actually loaded for Inter in `app/layout.tsx` — a heavier class
  would either be clamped to the same 800 by the browser or trigger
  synthetic/faux bolding, which tends to look worse, not better. Did not
  touch the site-wide `-webkit-text-stroke` on `.font-extrabold` in
  `globals.css` (a deliberate, established convention affecting every
  bold heading, not hero-specific) without being able to confirm removing
  it for just this headline would actually help.

## topic: agency-only-redesign — _2026-08-01 (hero inset shared with Nav, headline max-width)_

Branch `redesign/agency-only` (still not merged).

- **Hero's left edge now genuinely tracks the nav logo's left edge at
  every viewport width**, not just one hardcoded padding number. The nav
  bar's actual box model is non-trivial — `w-[calc(100%-24px)]
  max-w-[1100px]` on the fixed, transform-centered `<nav>`, plus a
  separate `px-5 md:px-6` on the inner pill — so a flat `px-6` on the
  hero (the previous "fix") only matched at one specific viewport width
  by coincidence, not by construction. Extracted `NAV_CONTAINER` and
  `NAV_INNER_PADDING` as exported constants from `components/Nav.tsx`
  (used by Nav's own JSX too, not just copied into it — genuinely one
  source of truth) and imported them into `app/page.tsx`'s hero wrapper:
  `${NAV_CONTAINER} mx-auto ${NAV_INNER_PADDING}` reproduces the nav's
  centering (via `mx-auto`, the natural-flow equivalent of the nav's
  fixed-position `left-1/2 -translate-x-1/2` trick) and left padding
  exactly. Verified with real `getBoundingClientRect()` calls at 1024px,
  1440px, and 1920px viewports — nav logo and hero content left edges
  land within 1px of each other at all three (the 1px is the nav pill's
  own border-width, imperceptible).
- **Headline gets its own `max-w-[720px]`**, separate from the wrapper's
  now-wider `max-w-[1100px]` (matching nav) — wraps at roughly
  half-to-two-thirds of the viewport as specified (measured ratios: 0.61
  at 1024px, 0.48 at 1440px, 0.36 at 1920px), instead of stretching the
  full container width.
- **Vertical nav-to-content gap** (147px, nav bottom to kicker pill top
  at 1440px) left unchanged — no real Playkit.co reference was available
  to calibrate against (see below), and the actual rendered screenshot
  reads as comfortably spaced, neither cramped nor excessive.
- **`playkit.co` does not resolve to a UGC/creator-marketing site.**
  Fetched it directly (via a headless Chromium instance installed this
  session — see the previous entry) expecting the "build your viral
  growth channel with tech ugc" hero referenced earlier in this thread;
  it's actually Subsplash, a church-management software company ("Grow
  your church every day of the week"). Flagged to the user rather than
  silently treating Subsplash's layout as if it were the intended
  reference, or silently proceeding without checking at all. The
  headline max-width ratio was satisfied using the explicit numeric
  target given directly in the request instead.

## topic: agency-only-redesign — _2026-08-01 (single-line headline, star badge, warm palette)_

Branch `redesign/agency-only` (still not merged).

- **Hero headline is now just "Make them remember."** — the "Content that
  converts." second line is gone. Removed the h1's `max-w-[720px]` cap
  entirely (it was sized for the old two-line phrase); a caught-in-review
  bug: `element.getClientRects().length` on a block element always
  returns `1` regardless of internal line wraps — it does not measure
  visual lines the way `Range.getClientRects()` over the text content
  does. Trusting that method first reported "1 line" when the headline
  was actually wrapping to two at 1440px; the screenshot was what caught
  it. Re-verified afterward with a corrected line-count helper (a `Range`
  over the element's text, rects deduped by rounded `top`) across six
  viewports: single line for both headline and subheading from 768px up,
  natural two/three-line wraps only at 390px and 320px — matching "one
  line unless it naturally wraps at smaller widths" as specified.
- **Subheading**: widened `max-w-[540px]` → `max-w-[760px]` so the full
  sentence fits on one line at typical desktop widths (confirmed single-
  line from 768px up) instead of wrapping at all; also wrapped "in-house"
  in a `whitespace-nowrap` span as a safeguard for whenever it does wrap
  narrower (confirmed intact through 320px).
- **Kicker badge**: text now title-case ("The Team Behind 1B+ Views"),
  flanked by a `✦` character on each side in place of the single dot
  indicator.
- **Palette warmed toward "cookies and cream."** `text.DEFAULT`
  `#F5EDE3` → `#F7F0DD` (the brief's first suggested value). Checked
  `bg.DEFAULT`/`card`/`elevated` first rather than assuming — all three
  already had R>G>B (warm-biased, not neutral/cool), consistent with the
  "Agency theme (amber)" origins — but nudged them slightly warmer anyway
  per the brief's "warm those slightly too" (`#0F0D0B`→`#120F0A`,
  `#1A1714`→`#1E1810`, `#241F1A`→`#2A2216`, `#0e0d0a`→`#110D08`) for a
  more deliberately rich near-black rather than an incidentally-warm one.
  `text.secondary`/`dim` were already warm and weren't called out
  specifically, so left unchanged.
  - Grepped for every hardcoded hex duplicating the old token values
    (Tailwind classes pick up config changes automatically; raw hex
    strings don't) and updated the ones that were background-matching,
    not independent style choices: `globals.css`'s scrollbar-track and
    `::selection` color, `InstagramEmbed.tsx`'s placeholder background,
    and the hollow-center fill on `ViewsChart.tsx`'s data points (in
    `campaigns/maxxd`, otherwise out of scope for style changes — this
    one hex was purely "match the page background," not a stylistic
    choice, so it needed to move with the token).
  - Verified sitewide via computed styles, not just the hero: Case
    Studies/Team/FAQ `h2` elements all resolve to `rgb(247, 240, 221)`
    (`#F7F0DD`), body background resolves to `rgb(18, 15, 10)`
    (`#120F0A`) — confirmed the token change actually propagates, not
    just assumed it from editing one file.

## topic: agency-only-redesign — _2026-08-01 (bg tokens desaturated, case-study card cleanup, Thienvu photo)_

Branch `redesign/agency-only` (still not merged).

- **`bg.*` tokens were reading as brown/orange, not near-black.** Root
  cause: the previous round's warming pass (`text: single-line headline,
  star badge, warm palette` above) nudged `bg.DEFAULT`/`card`/`elevated`/
  `subtle` warmer by eye without checking hue — turns out all four sat at
  ~hue 30-37°, essentially the same hue family as `accent`'s `#F5A623`
  (~hue 37°), just darkened and desaturated to ~29-30%. At that low a
  lightness, a 30% saturation matching the accent hue reads as literal
  brown, not "near-black with warmth." Desaturated all four to ~9-10%
  while keeping their relative lightness ordering (`subtle` < `DEFAULT` <
  `card` < `elevated`): `#120F0A`→`#121110`, `#1E1810`→`#1C1917`,
  `#2A2216`→`#262220`, `#110D08`→`#0F0E0D`. Re-synced the same three
  hardcoded-hex duplicates flagged last round: `globals.css` scrollbar-
  track, `InstagramEmbed.tsx` placeholder background, `ViewsChart.tsx`
  data-point hollow fill (all matched `bg.DEFAULT`/`bg.card`, not
  independent choices — see prior entry for why these three specifically
  need to move with the token). Verified via computed styles: body now
  `rgb(18,17,16)`, case-study/team/CTA cards now `rgb(28,25,23)` — R-G-B
  spread dropped from ~14-18 to 5, i.e. genuinely near-neutral rather
  than same-hue-as-accent-but-dark.
- **Audited `ResultCard.tsx` and the team section for leftover
  `text-accent`/`border-accent` instances the user flagged as "still
  orange."** Found none — the quote mark, mini-stat values, view count,
  and verified badge were already on `text-text`/`text-text-secondary`
  from an earlier sweep this session. Concluded the orange the user was
  seeing was the `bg.*` hue issue above (a same-hue-family dark brown
  reads as "orange" against the cream text), not leftover accent text.
  Left the two remaining accent uses in `ResultCard.tsx`
  (`hover:border-accent/25` on the card border, `bg-accent/[0.03]` quote-
  bar tint) as-is — both pre-approved in an earlier round as
  intentionally subtle, not part of this complaint.
- **Case-study card cleanup** (`components/ResultCard.tsx`), scoped to
  "cleaner," not a rebuild:
  - View-count block: added a "Total views" eyebrow label above the
    number and moved the inline "views" suffix out of the big number
    (it was crowding the `text-5xl` figure); `viewsSub` now sits below
    on its own line. Gives the stat a clear label → number → detail
    reading order instead of number-with-suffix + unlabeled detail.
  - Expandable Challenge/Approach/Result block: replaced inline
    `<strong>Challenge:</strong>` labels (competing for weight with the
    paragraph's own bold spans elsewhere on the card) with small
    uppercase eyebrow labels above each paragraph, `space-y-5` between
    blocks instead of `mt-3.5` per-paragraph, `leading-[1.7]` instead of
    `leading-relaxed`. Reads as three distinct labeled sections instead
    of a wall of bolded-inline text.
  - Minor spacing tightening for consistency: header block `pb-5`→`pb-6`,
    quote bar `py-5`→`py-6`, mini-stat tiles `p-3.5`→`p-4`/`gap-2.5`→
    `gap-3`, quote mark `text-4xl opacity-40`→`text-3xl text-text-dim`
    (was competing visually with the view-count number at the same
    opacity-driven weight).
- **Thienvu Vo's headshot swapped.** New file saved to
  `public/videos/team-thienvu-new.jpg` — arrived on disk as
  `team-thienvu-new.JPG` (uppercase extension); renamed to lowercase
  before referencing it, since macOS's case-insensitive-but-case-
  preserving filesystem would have hidden a mismatch that breaks on
  Vercel's case-sensitive Linux filesystem in prod. `team` array's
  `image` field in `app/page.tsx` now points at the new file; old
  `team-thienvu.jpg` left on disk unreferenced rather than deleted.
  Confirmed via Playwright (`naturalWidth`/`naturalHeight` + screenshot,
  not just a 200 on the file request) that it renders at full resolution
  and crops correctly under the card's `aspect-square object-cover` —
  first screenshot attempt caught it still lazy-loading (blank box) at
  300ms post-scroll, which was a verification-timing issue, not a code
  bug; a longer wait showed the photo rendering correctly.

## topic: trusted-by-logos — _2026-08-01 (four real clients added)_

Branch `redesign/agency-only` (still not merged).

- **Added four confirmed real clients** to the `trustedBrands` marquee in
  `app/page.tsx`: Higgsfield, Hyperknow, Kortix, Tomo. Purely additive —
  all nine existing logos (Aonic, BlackBox AI, Causes, Codedex, Dubbing,
  Fable, Kicker, Liftoff, Makon AI) kept as-is.
- **Sourcing**: user could only make out a partial name ("...rtix") on a
  cropped screenshot of a competitor site (viewd.net)'s own trusted-by
  row. WebFetch got a flat 403 on viewd.net (bot-blocked); used the
  Playwright headless browser already set up in this session's scratch
  dir to load the live page directly and read the real DOM — image
  `src`/`alt` attributes for the SVG-based logos, and inline text content
  for the two clients rendered as plain styled wordmarks (`aonic`,
  Hyperknow — no logo asset, just styled text on viewd.net, confirmed by
  reading the surrounding HTML, not by inference). That resolved the
  full row: Higgsfield, aonic, BlackBox AI, Hyperknow, Causes, Tomo,
  Fable, Kortix — the cut-off name was **Kortix** (`kortix.com`, the
  open-source "AI command center" behind the Suna agent; confirmed
  `kortix.ai` 301s to `kortix.com`, so `.com` is canonical). Four of
  those eight were already in our list (Aonic, BlackBox AI, Causes,
  Fable) — only Higgsfield, Hyperknow, Kortix, and Tomo were new.
  "Tomo" had no logo asset on viewd.net to identify it by, and the name
  alone is ambiguous (surfboard shaper, mortgage lender, credit-card
  fintech all use it) — resolved to **TomoCredit** (`tomocredit.com`) on
  fit: a consumer fintech card app is the kind of DTC/app brand a
  creator-UGC marketplace like viewd would plausibly serve, versus a
  boutique surfboard maker or a mortgage lender.
- **Per the brief, none of the four logo assets were taken from viewd.net's
  rendering** — each was sourced from the client's own official site,
  fetched directly with the same Playwright browser (WebFetch 403'd on
  at least one target too, so this was the only working path all
  around):
  - **Kortix** — grabbed the exact inline SVG wordmark (icon + type,
    `fill="currentColor"`) straight from `kortix.com`'s nav, kept
    unmodified, recolored to white via CSS `color`, rendered to a
    transparent PNG.
  - **Tomo** — downloaded TomoCredit's own official asset directly
    (`tomocredit.com/images/tomoLogoWhiteGreen.svg`, `alt="TomoCredit
    Logo"`) — already white wordmark + teal accent dot, no background
    rect, so no recoloring or chip needed.
  - **Higgsfield** — their nav is icon-only (no combined wordmark
    lockup on the live site, checked Wikipedia's infobox too, nothing
    there either); pulled the real icon SVG path from `higgsfield.ai`'s
    nav markup and paired it with a typeset "Higgsfield" wordmark, the
    same icon-plus-typeset-text pattern already used for `causes.png`
    in this same array (and the same pattern viewd.net itself uses for
    this exact client, independently arrived at, not copied from them).
  - **Hyperknow** — no exposed SVG/asset URL (Framer site, icon is an
    inline data-URI background-image); took a real 3x-scale screenshot
    of their own nav lockup instead, then color-keyed white background
    out and remapped surviving ink to white via a luminance-alpha pass
    (Python/PIL) rather than a flat threshold, so the antialiasing
    survived and the edges stayed clean at marquee size.
  - All four cropped to their true content bbox and dropped into
    `public/logos/` following the existing naming convention (lowercase
    company key, `.png`), then wired into `trustedBrands` the same way
    every other entry is — no chip, `h-14 object-contain`, since none of
    the four has Liftoff's uncolor-keyable-gradient problem.
- Verified via Playwright against the running dev server: all 13 unique
  brands present in the marquee's DOM in the expected order, zero broken
  images (`naturalWidth`/`complete` checked, not just a 200), and
  individual element screenshots of all four new logos confirm they
  render at consistent `h-14` sizing alongside the existing set.

## topic: trusted-by-logos — _2026-08-01 (re-sourced all 9 originals, fixed Tomo, added 5 more)_

Branch `redesign/agency-only` (still not merged).

- **Re-sourced all nine original hand-saved logos** (Aonic, BlackBox AI,
  Causes, Codedex, Dubbing, Fable, Kicker, Liftoff, Makon AI) directly
  from each brand's live site rather than trusting the old files, which
  had baked-in backgrounds and inconsistent quality. Used the same
  Playwright scratch setup as before, scanning each site's header/nav
  for the actual logo asset (`<img src>` on real URLs, or an inline
  `<svg>`) instead of screenshotting rendered pixels, so every source is
  a real vector or an original transparent-background raster:
  - **Direct asset downloads** (already transparent, no recoloring
    needed beyond white-ifying monochrome ones): Aonic
    (`aoniclife.com/cdn/shop/files/AONIC_LOGO_BOLD.png`, a Shopify CDN
    file), Causes (`_next/static/media/Causes-logo.*.svg`, icon only),
    Codedex (`/images/coin-cropped.png`, icon only), Dubbing AI
    (`/assets/logo_header_icon-*.png`, icon+wordmark combined), Kicker
    (`/logo-icon.png` + `/logo-text.png`, served separately by their own
    Next app), Makon AI (`/_astro/logo-mark-onlight.svg` +
    `/_astro/logo-word-onlight.svg`, an Astro site).
  - **Inline SVGs pulled from live nav markup**: BlackBox AI
    (`fill="currentColor"`, recolored via CSS), Fable (multi-color badge
    icon + already-white "fable" text — used completely unmodified, no
    recoloring needed), Liftoff (icon only).
  - **Liftoff's `needsChip` requirement is gone.** The old hand-saved
    `liftoff.jpeg` had a baked-in diagonal blue gradient background that
    couldn't be color-keyed. The real vector, pulled straight from
    `liftoffrank.com`'s nav, turned out to use a `linearGradient` whose
    stops are both `white` (i.e. flat white dressed up as a gradient,
    presumably for a since-unused theming hook) — genuinely flat, no
    chip needed. Paired with typeset "Liftoff" text, same as the icon-
    only sources below. `needsChip` stays in the code as a dead but
    harmless escape hatch — flagged in a comment rather than deleted,
    since a future source could need it again.
  - **Icon-only sources paired with typeset wordmark text** (matching
    the existing Causes-style pattern from the prior Higgsfield/
    Hyperknow round): Causes, Codedex ("Codédex"), Liftoff.
  - **Selective recolor, not full monochrome**: Softr's SVG has the
    3-color icon (blue/pink/yellow blocks) plus a near-black `#030712`
    wordmark fill — recolored only that one fill to white, left the
    icon colors untouched. Dubbing AI's PNG has a colorful mascot icon
    to the left and a dark navy-gray "Dubbing AI" wordmark to the
    right, baked into one raster with no way to select-by-fill — split
    the image at the icon/text pixel boundary (found by column-scanning
    for the icon's cyan/blue vs. the text's navy-gray) and recolored
    only the text half, keeping the icon's original alpha channel
    verbatim rather than re-deriving it from luminance (an earlier pass
    used a luminance-derived alpha for the recolored text and it came
    out visibly gray instead of crisp white — fixed by keeping the
    source pixel's own alpha and just overwriting RGB to pure white).
  - **Makon AI's icon needed a black/white swap**, not a flat recolor:
    the source is black ink (eyes, nose) on a near-white face fill,
    designed for a light background. Recoloring black→white directly
    would have produced a solid white blob (ink and fill both white,
    no contrast). Fixed by swapping instead: black ink → white,
    white/`#FFFEFE` face fill → transparent — result is a white linework
    panda-face silhouette against our dark background, which is the
    correct read for a dark-mode variant of a light-mode-only asset.
  - One extraction bug caught and fixed: Tomo's wordmark SVG (see
    below) was pulled via `element.outerHTML`, which does not include
    the `xmlns` namespace declaration present on the live DOM node —
    fine inline in a browser page (namespace is inherited from the
    parent HTML document) but invisible/unrenderable once saved as a
    standalone `.svg` file and loaded via `<img src>`. Fixed by adding
    `xmlns="http://www.w3.org/2000/svg"` back before rendering; the
    other extracted inline SVGs happened to already carry their own
    xmlns attribute in the source markup and didn't need the fix.
- **Tomo was mis-sourced last round.** The prior entry resolved "Tomo"
  to TomoCredit (`tomocredit.com`) by inference — a plausible fit for a
  DTC/app-brand creator marketplace's client roster, but not confirmed.
  This round the user confirmed the correct site is `tomo.ai` (a
  flower/sun-mark companion app, "500,000+ people ❤️ Tomo" on their own
  homepage) — different company entirely. Replaced `tomo.png` with
  `tomo.ai`'s actual icon + wordmark, both inline SVGs (`fill="currentColor"`)
  pulled from their nav and recolored to white.
- **Added five more real clients**: Cooksat (`cooksat.com`, `/assets/
  graphics/branding/CookSAT_vector_logo.svg` icon, paired with typeset
  "CookSAT"), Softr (`softr.io`, full combined SVG lockup from their
  Webflow CDN), Yorby (`yorby.ai`, `/yorby-logo-new.png` icon — a pale
  lavender abstract mark, left in its native soft tone rather than
  forced to pure white since that's the actual brand color and it reads
  fine against our dark background — paired with typeset "Yorby"),
  Dealism (`dealism.ai`, a Framer site — pulled the full lockup image
  straight from `framerusercontent.com`, recolored the dark wordmark to
  white), Notta (`notta.ai`, logo was embedded as a base64-encoded SVG
  data URI directly in the page's `<img src>` rather than a fetchable
  URL — decoded it, recolored `fill="black"` to white).
- **Full final roster, 18 clients**: Aonic, BlackBox AI, Causes,
  Codedex, Cooksat, Dealism, Dubbing AI, Fable, Higgsfield, Hyperknow,
  Kicker, Kortix, Liftoff, Makon AI, Notta, Softr, Tomo, Yorby.
- Verified via Playwright against the running dev server. One real
  finding during verification, not a logo bug: the marquee's infinite-
  scroll track (`.animate-scroll`, a CSS `transform: translateX(...)`
  keyframe animation) freezes at an arbitrary mid-animation offset when
  paused via `animationPlayState`, which can leave a given logo's
  element sitting at a negative x position outside the viewport —
  `scrollIntoViewIfNeeded()` does nothing for a transform-positioned
  element (there's no scrollable overflow to scroll), so a screenshot
  taken right after landed blank for whichever logo the pause happened
  to catch off-screen, which briefly looked like a broken asset (it
  wasn't). Fixed the verification method by removing the animation
  class entirely instead of pausing it, so the track sits at its
  natural `translateX(0)` position and every element is reachable;
  re-ran the check and confirmed all 18 logos load with real
  `naturalWidth`/`naturalHeight` and paint correctly.

## topic: trusted-by-logos — _2026-08-01 (Makon/Tomo/Liftoff color restore)_

Branch `redesign/agency-only` (still not merged).

- **Makon, Tomo, and Liftoff were flat white/monochrome in the marquee
  while other logos showed real color** — not a shared filter bug (grepped
  the marquee JSX, confirmed no `grayscale`/`filter` class applied to any
  logo, `Image` elements are plain `object-contain`) and not corrupted
  files — each was a deliberate full recolor-to-white in the prior
  round's re-sourcing pass, made without checking whether the source
  actually had brand color to lose. Investigated each individually
  rather than assuming the same root cause for all three:
  - **Tomo**: the nav mark (`fill: rgb(44,37,17)`, a dark ink color) really
    is near-monochrome on their own site — but their `apple-icon.png`
    (`tomo.ai/apple-icon.png`) shows the same flower/face glyph rendered
    in real color (yellow petals, green face). Recolored the icon's
    petal path to `#FFE566` (sampled from the app icon) and the two eye
    paths to a dark ink `#2C2511`, kept the "Tomo" wordmark white.
  - **Makon**: the panda mark is genuinely black-and-white everywhere
    checked (nav, `favicon.svg`, `apple-touch-icon.png`) — no hidden
    color on the mark itself. But `makon.ai`'s primary CTA button uses a
    real brand purple, `rgb(139,44,251)` / `#8B2CFB` — recolored the
    "makon" wordmark to that purple, left the panda icon white
    (monochrome by design, not a bug).
  - **Liftoff**: the nav SVG's gradient stops are genuinely
    `white`→`white` (confirmed both from the static markup and
    `getComputedStyle(stop).stopColor` on the live page) — not a
    processing artifact, their nav mark really is flat white on their
    dark-navy site. The color lives in their app-icon/logo.png asset
    instead: a light-to-medium blue background chip
    (`rgb(43-71,171-183,255)`, roughly `#4FB2FF`) behind the same glyph
    rendered in dark navy. Recolored the icon itself to `#4FB2FF`
    (rather than reproducing the background-chip treatment, to stay
    consistent with how every other marquee logo is unboxed) and kept
    "Liftoff" white.
  - Verified against the live dev server, not just the static PNGs:
    screenshotted each logo's `<img>` element directly out of the
    running marquee and confirmed yellow/purple/blue render correctly
    in place.

## topic: hero-copy — _2026-08-01 (lowercase tagline, Let's Talk CTA)_

Branch `redesign/agency-only` (still not merged).

- **Headline lowercased**: "Make them remember." → "make them remember."
  per README's brand section (tagline is lowercase/small-caps with a
  trailing period; the hero headline hadn't been matched to it until now).
- **"Apply for a campaign slot →" replaced with "Let's Talk" sitewide**,
  plus a small Vo Creations mark icon inside the button next to the text.
  Grepped for the exact string first rather than guessing at call sites —
  three occurrences, not one: the hero CTA (`app/page.tsx`), `CTABlock`'s
  default `buttonText` prop (`components/CTABlock.tsx`, used once,
  unconfigured, so the default IS the live copy), and a separate,
  differently-styled button on the `campaigns/maxxd` dashboard page that
  a page-scoped grep for `app/page.tsx` alone would have missed.
  - The nav/footer logo (`/vocreations-logo.webp`) is a flat RGB webp
    with a near-black square baked into the background (no alpha
    channel) — unusable directly on a white button. Extracted just the
    white "V" glyph via the same luminance-alpha technique used
    throughout this session, recolored to black (the button is
    `bg-white text-black`), and saved as
    `public/vocreations-mark-black.png` for reuse in all three buttons.
- **"TRUSTED BY" label now gets the same ✦-flanked treatment as the
  hero's kicker badge** — same character, same `text-white text-[10px]
  leading-none` styling, just without the badge's pill border (the label
  wasn't pill-shaped to begin with and didn't need to become one).

## topic: showcase-marquee — _2026-08-01 (auto-scroll conversion, embeds)_

Branch `redesign/agency-only` (still not merged).

- **"Content that goes viral" converted from manual horizontal-scroll
  to an auto-scrolling marquee**, reusing the exact mechanism the
  Trusted By logo strip already uses: `overflow-hidden` wrapper, inner
  track duplicated (`[...items, ...items]`) and animated
  `translateX(0) → translateX(-50%)` for a seamless loop. Added a
  slower `animate-scroll-slow` (70s vs. the logo strip's 35s) in
  `tailwind.config.ts` — same `scroll` keyframe, just slower, since
  these cards are far bigger than a logo and 35s reads as frantic.
  - **Pauses on hover** (`hover:[animation-play-state:paused]`, a
    Tailwind arbitrary-property utility, no config change needed) —
    not explicitly requested, but without it the two self-hosted
    videos' existing hover-to-play/tap-to-unmute interaction would
    fight the card sliding out from under the cursor mid-hover.
    Platform embeds don't have an equivalent interaction to protect,
    but pausing is harmless for them too.
- **Removed post-1.mp4 and post-3.mp4** from `showcaseVideos`, kept
  post-2.mp4 and post-4.mp4. Added 10 new entries as platform embeds
  (8 Instagram, 2 TikTok, 1 Facebook reel — one Instagram link doubles
  the total to 10) rather than self-hosted files, per instruction not
  to download/rehost external posts. `showcaseVideos` is now a mixed
  union type (`type: "video"` for self-hosted, `type: "instagram" |
  "tiktok" | "facebook"` for embeds) rendered with a per-type branch in
  the marquee map.
- **Instagram**: reused the existing `components/InstagramEmbed.tsx`
  unmodified — its default (unloaded) state is already a simple
  `{url}/embed` iframe in an `aspect-[9/16]` box, which needs no click
  interaction to show real content and was already the right shape for
  a marquee card. Confirmed via Playwright against the actual embed URLs
  (not assumed): the bare iframe does render Instagram's full post
  chrome (header, media, like/comment icons) within the box, just takes
  a few seconds longer to paint than a local asset would.
- **TikTok**: new `components/TikTokEmbed.tsx`, using TikTok's official
  `tiktok-embed` blockquote + `embed.js` widget script — confirmed
  working end-to-end against both real URLs. TikTok's `embed.js`
  exposes no public re-scan/render API (`window.tiktokEmbed` only has
  `lib.receiveMessage`), so instead of a shared one-time script load
  (the `InstagramEmbed` pattern), each `TikTokEmbed` instance injects
  its own fresh `<script>` tag on mount — confirmed via an isolated
  test that appending the script *after* the blockquote already exists
  in the DOM (the React mount order) still gets it processed, since the
  script's `onload` does a full re-scan rather than a one-time init.
- **Facebook**: new `components/FacebookEmbed.tsx`, using the iframe
  Video Plugin (`facebook.com/plugins/video.php?href=...`), not the
  JS-SDK/`fb-root` approach — confirmed the plugin renders the specific
  public reel without an App ID and without the viewer needing to be
  logged in, even though navigating to the reel URL directly now hits a
  Facebook login wall (verified both paths independently: direct nav →
  login modal; plugin iframe → real video content, likes/comments count
  visible). This is the one embed most likely to have been "genuinely
  hard to extract cleanly" and it turned out fine.
- **All three new/reused embed components share the same shape**:
  `bg-bg-card rounded-2xl aspect-[9/16] border border-border overflow-hidden`,
  matching the self-hosted video cards' box so every card in the row is
  the same width and aspect ratio. Self-hosted cards are ~39px taller
  than embed cards (an extra footer row for likes/engagement/view-post
  link that the embeds don't have — their platform chrome already shows
  engagement inline) — acceptable per the brief ("official embeds...
  can't be hover-styled exactly... that's expected and fine"), and
  `items-center` on the track keeps the row visually aligned despite
  the height difference.
- **No embed needed a fallback** — Instagram, TikTok (both links), and
  the Facebook reel all render their real content cleanly via each
  platform's official embed method. Verified with real network requests
  against the live URLs during development, not just code review.

## topic: hero-stats-countup — _2026-08-01_

Branch `redesign/agency-only` (still not merged).

- **Hero stats (1B+ / 30+ / 500+ / 9) count up from 0 on scroll-into-view**,
  via a small local `useInView` (IntersectionObserver, `threshold: 0.3`,
  disconnects after first fire — fires immediately on mount if the row is
  already in the initial viewport, which it usually is on a `min-h-screen`
  hero) and `useCountUp` (`requestAnimationFrame`, easeOutCubic, 1400ms)
  defined inline in `app/page.tsx` — hero-only usage, didn't justify a
  `hooks/` directory for a first hook.
- **"1B+" has no honest literal count-up** (0→1 isn't a count; 0→1,000,000,000
  isn't readable at 60fps). Counts 0→1000 formatted as `${n}M+` while
  animating, and only on the final frame (`n >= 1000`) swaps to the fixed
  "1B+" label — reads as a satisfying climb through large numbers that
  lands on the real headline figure, not a literal frame-accurate count.
  "30+"/"500+" count straight to their value with a "+" suffix; "9" counts
  straight with no suffix.
- `StatCounter` is a separate child component (not a hook call inside
  `.map()`) — calling a hook conditionally-per-iteration inside a loop
  violates React's rules of hooks even when the array is a static
  constant; a child component per stat sidesteps that legitimately, each
  instance manages its own hook state independently.
- **Verified the count-up actually animates, not just jumps to the final
  value** — an early test polling every 250ms after `waitUntil: "load"`
  showed only the settled end state every time; the real cause was
  `"load"` plus the round-trip to read the DOM already eating most of the
  1400ms window before the first sample, not a broken animation. Re-ran
  polling every 100ms from `domcontentloaded` and captured the real climb
  (`0 → 166M+ → 370M+ → ... → 907M+ → 1B+`), confirmed easing and duration
  match spec before trusting it.

## topic: hero-floating-card — _2026-08-01_

Branch `redesign/agency-only` (still not merged).

- **Single floating showcase-post mockup added to the hero's right side**,
  `hidden xl:block` (1280px+) — explicitly not the two-column
  copy-left/cards-right layout from the `nav logo/border, two-column hero`
  entry above, which was reverted for unrelated reasons (a `mask-image`
  dimming bug, not the floating-card idea itself) but is the reason this
  round got tested carefully rather than assumed safe.
  - **Positioning**: `absolute right-6 2xl:right-16 top-1/2
    -translate-y-1/2`, sized `w-[220px]`, anchored to the `<section>`
    (not the `NAV_CONTAINER`-capped text column), so it sits in the
    empty right margin outside the text's line length rather than
    inside the same constrained container as the copy. Verified with
    real screenshots at 1280/1440/1600/1920px — the headline, subhead,
    buttons, and stats never come near the card's left edge at any of
    them — plus 1024px/390px to confirm the `xl:` breakpoint actually
    hides it below that width rather than leaving a half-collapsed state.
  - **z-index**: text column is `relative z-10`, card wrapper is `z-0`
    with `pointer-events-none` (the inner card itself is
    `pointer-events-auto`, so hover-to-play on the video still works) —
    belt-and-suspenders given the positioning alone should already
    prevent overlap; kept both rather than relying on position math
    alone a second time on this branch.
  - `aria-hidden="true"` on the wrapper — it's decorative, the same clip
    already exists non-decoratively in "Content that goes viral" below.
- **Content**: reuses `post-2.mp4` (3.7M views, 189K likes, 5.10% eng.),
  the better-performing of the two self-hosted clips still in
  `showcaseVideos` after the marquee round's trim — same
  `aspect-[9/16]` card shape, view-count badge, and hover-to-play/`#t=0.1`
  thumbnail handling as the showcase section's own cards, so it reads as
  the same design language rather than a one-off.
- **New `float` keyframe** in `tailwind.config.ts`
  (`translateY(0) ↔ translateY(-10px)`, `ease-in-out`, 5s, infinite) —
  verified via `getComputedStyle(...).transform` polling that it's
  actually oscillating (not frozen at one frame), not just visually
  eyeballed from a single screenshot.

## topic: hero-copy — _2026-08-01 (Let's Talk button restyled)_

Branch `redesign/agency-only` (still not merged, supersedes the CTA-copy
part of the same-named entry above — that entry is still current for the
"Let's Talk" text/icon-inclusion decision, this one only changes the
button's visual treatment).

- **"Let's Talk" restyled from a solid white pill to an outlined pill**
  (`border border-white`, `bg-transparent`/`hover:bg-white/10`, closer to
  good-marketing.co's button treatment) at all three call sites (hero,
  `CTABlock` default, `campaigns/maxxd`) — explicitly kept monochrome
  white/cream, not good-marketing's amber/gold, per the standing
  no-orange-on-buttons decision.
- **New `public/vocreations-mark-white.png`** — the outline button needs
  white text/icon on a transparent background, and the icon file that
  existed (`vocreations-mark-black.png`, made for the old *solid white*
  button) is black ink, invisible against the dark page background an
  outline button now shows through. Extracted the same way as the black
  version — luminance-alpha off `vocreations-logo.webp`, just filled
  white instead of black — rather than trying to reuse or recolor the
  black one at render time.
  - No separate "boxed icon" bug existed to fix — the icon was already a
    plain inline `<Image>` with no background wrapper in the JSX; the
    solid-white-pill treatment just made a black glyph against a bright
    white pill look more visually separated/boxed than it does now
    against a transparent/outlined button. Addressed by matching the
    requested end state (icon plain and inline, no visual box) rather
    than hunting for a "background box" that turned out not to be there
    in the markup.

## topic: hero-story-card — _2026-08-01_

Branch `redesign/agency-only` (still not merged). Supersedes the
`hero-floating-card` entry above's *content* (still a single floating
card, still `hidden xl:block`, still `animate-float` — only what's inside
the card changed, from a static video to a 4-stage loop).

- **Confirmed the 4-stage animation had never actually been built** before
  starting — the previous turn's summary described it, but `app/page.tsx`
  still had the single static `post-2.mp4` card verbatim. Checked via
  `grep` before writing any code rather than trusting the prior summary,
  per the user's explicit framing of this turn ("if it did get built...
  skip to the fixes"). It hadn't.
- **New `components/HeroStoryCard.tsx`**: a self-contained looping
  mockup — account created → posting content → views climbing → revenue
  growing, ~2.8s per stage, crossfades via opacity on absolutely-stacked
  `StageWrap`s inside one fixed `aspect-[9/16]` card. Each stage's own
  counters (`useCountUp`) reset and replay from 0 every time that stage
  becomes active again, not just on first mount, so the loop feels alive
  on every pass, not just the first. A thin 4-segment progress bar at
  the top (Instagram-story-style) fills over each stage's dwell time —
  not explicitly requested, but a natural, cheap companion to a staged
  loop that makes the cycling legible at a glance.
  - Only advances while the card itself is on-screen
    (`IntersectionObserver`, kept alive rather than disconnected after
    first match — the hero-stats `useInView` disconnects after one fire
    since it only needs to trigger once, this one needs to keep tracking
    to pause/resume as the user scrolls).
  - **Real bug caught before shipping**: stage 2's 3×3 video-thumbnail
    grid used `aspect-[9/16]` per cell (a full vertical-video ratio) —
    at the card's actual 240px width that grid alone was taller than
    the whole card, and the "Posting content" label silently clipped
    off the bottom edge (the card's `overflow-hidden` hides overflow
    rather than growing the box). Caught by screenshotting each stage
    individually rather than only checking stage 1, fixed by making the
    thumbnails `aspect-square` (how a real profile grid actually looks),
    reverified via `scrollHeight === clientHeight` on the card plus
    fresh screenshots of all four stages showing no clipping.
- **Extracted `useCountUp` into `components/useCountUp.ts`**, shared
  between the hero stats and the new story card rather than duplicated —
  it's now used in two genuinely different places with different
  trigger semantics (fire-once vs. replay-on-reactivate), which the
  hook already handled correctly (resets to 0 whenever `trigger` goes
  false), so no behavior needed to change to make it shared.

## topic: hero-layout-proportions — _2026-08-01_

Branch `redesign/agency-only` (still not merged).

- **The floating card was crowding/nearly touching the right edge of the
  viewport at common laptop widths** (1280-1440px) — margin to the
  viewport edge measured -24px to -64px relative to where I'd checked
  before (i.e., inside the section's `overflow-hidden`, not actually
  clipped, but close enough to read as cut off with zero breathing
  room). Root cause: the card was `absolute`-positioned in the margin
  *outside* the `NAV_CONTAINER`-capped text column (max 1100px,
  centered), not inside it — so its available space was whatever the
  browser happened to leave outside a container sized independently of
  it, not a real proportional share. At 1280px that outside margin is
  only ~90px, thinner than the card itself.
  - **Fixed by making it a real two-column layout inside the same
    container** instead: `NAV_CONTAINER` wraps a `flex xl:flex-row
    xl:justify-between` row, left column capped `xl:max-w-[620px]`
    (down from the effectively-unbounded width it had before), right
    column a fixed `w-[240px]`. Both now draw from the same 1100px
    budget, so the split is proportional at every width rather than
    dependent on leftover space. Re-measured: margin to viewport edge
    is now 114px (1280px) up to 434px (1920px), gap between text and
    card is a constant 192px at every width checked.
  - Headline now wraps to two lines ("make them" / "remember.") at the
    narrower column width instead of one — a clean word-boundary break,
    not a mid-word hyphenation, and a very common hero pattern; not
    treated as a regression. Subheading's own `max-w` tightened from
    760px to 560px since the parent column is now the binding constraint
    at `xl`+ anyway.
- **Hero stats count-up slowed from 1.4s to 2.2s** (`STATS_COUNT_DURATION`
  in `app/page.tsx`) — the first cut was too fast to actually read the
  numbers climbing, confirmed by polling the DOM every 200ms and finding
  it settled well under a second in practice. Re-verified after the
  change: samples now show a visible climb out to ~2.4s before landing
  on the final value. The story card's own internal counters stayed at
  their original ~1.8s (tuned to fit inside a single ~2.8s stage
  window, a different constraint than the hero stats').

## topic: hero-story-card — _2026-08-01 (4 stages → 6, real process)_

Branch `redesign/agency-only` (still not merged). Extends, doesn't
supersede, the entry above of the same topic name.

- **Expanded from 4 stages to 6** to cover the actual process end to
  end: sourcing creators → building strategy → accounts warming up
  (was "account created") → posting content (unchanged) → views &
  engagement (was "views climbing," added a secondary engagement-%
  stat) → revenue & growth (was "revenue growing," added a 3-chip row
  for revenue/users/awareness instead of one number). Same loop
  mechanic, same ~2.8s/stage, same card size — only the stage content
  changed. `StagePostingContent` left byte-for-byte unchanged per the
  brief ("already built, already reads well, don't change it").
- **Stage 3 (accounts warming up) and its stat row now take real
  styling cues from Vo Creations' actual Instagram**, not a generic
  mockup — checked `instagram.com/vocreations` directly (its `og:
  description` confirms the real stat-line convention: "9 Followers, 7
  Following, 0 Posts") and matched the layout it actually renders:
  circular avatar with the username beside it (not stacked above/
  below), and stat pairs as a bold number over a small label, side by
  side — replaced the old single inline sentence
  ("0 posts · 0 followers") with that two-stat-pair layout.
- **New stages (sourcing, strategy)**: sourcing shows 4 avatar circles
  with a checkmark badge landing on each in a staggered sequence;
  strategy shows a small checklist card (4 items) fading/sliding in
  top to bottom. Both follow the same "real content, simple execution"
  bar as the existing stages — no new visual language introduced.
- **Reverified no overflow on any of the 6 stages** the same way the
  4-stage version's bug was caught last time: `scrollHeight ===
  clientHeight` on the card plus a screenshot of every stage
  individually (not just spot-checking one or two) — all six fit
  cleanly inside the same fixed `aspect-[9/16]` card with room to
  spare, no repeat of the aspect-ratio mistake from last round.

## topic: marquee-polish — _2026-08-01_

Branch `redesign/agency-only` (still not merged).

- **Both marquees (Trusted By, Content that goes viral) now fade to
  the background color at their left/right edges** instead of hard-
  cutting — a `mask-image` linear-gradient (transparent → opaque over
  the first/last ~12% of the container width) on the `overflow-hidden`
  wrapper, not the scrolling track (masking the track would have moved
  the fade with the animation instead of anchoring it to the
  container). Needs both `maskImage` and `WebkitMaskImage` — Safari
  doesn't support the unprefixed property. Shared as one
  `edgeFadeStyle` object in `app/page.tsx` rather than duplicated
  inline on both wrappers, since it's the same mask for both.
- **Both marquees slowed ~1.7x** (`scroll`: 35s→60s, `scroll-slow`:
  70s→120s, in `tailwind.config.ts`) — both read as too fast to
  actually track a given logo or card as it passed. Verified the
  computed `animationDuration` on the live page (60s/120s) rather than
  just trusting the config value made it through the build unchanged.

## topic: homepage-section-order — _2026-08-01_

Branch `redesign/agency-only` (still not merged).

- **Reordered homepage sections in `app/page.tsx`**: Case Studies
  (`id="results"`) now sits directly after "Our Work" (Content that
  goes viral), and How It Works now sits directly after Team, right
  before FAQ. New order: Hero → Trusted By → Our Work → Case Studies →
  Team → How It Works → FAQ → Final CTA. Pure relocation — moved the
  How It Works block (comment + `<section>`) as one unit and removed
  the now-doubled-up divider next to it; no content inside any section
  changed.

## topic: lets-talk-button-polish — _2026-08-01_

Branch `redesign/agency-only` (still not merged).

- **Icon moved from the left of "Let's Talk" to the right**, at all
  three call sites (hero, `CTABlock` default, `campaigns/maxxd`) — now
  reads "Let's Talk [mark]" instead of "[mark] Let's Talk".
- **Real bug found and fixed**: the "visible box around the icon" the
  user reported wasn't a wrapper `<div>` (there wasn't one) — it was
  `public/vocreations-mark-white.png` (and `-black.png`) carrying a
  faint non-zero alpha across almost the *entire* canvas, not just the
  glyph. Root cause: the luminance-alpha extraction script mapped
  alpha directly from luminance with no cutoff, and the source
  `vocreations-logo.webp`'s "black" background is actually
  `rgb(~10,11,15)`, not pure black — that small non-zero luminance
  became a small non-zero alpha (~12/255) *everywhere*, reading as a
  faint light haze/box behind the glyph once composited onto the
  button. Fixed by adding a luminance threshold (0.10) below which
  alpha is forced to exactly 0, then rescaling the remaining range so
  the glyph's own antialiased edges stay smooth — re-verified corner
  alpha is exactly 0 post-fix (was 12) and the bbox crop shrank to the
  glyph's real bounds (was inflated by the haze). Regenerated both
  `vocreations-mark-white.png` and `-black.png` with the same fixed
  script since both shared the same root cause.

## topic: showcase-marquee — _2026-08-01 (self-hosted cards unified with embeds)_

Branch `redesign/agency-only` (still not merged). Extends the entry of
the same topic name above.

- **Self-hosted video cards restyled to match the embed cards'
  structure** — they were the odd one out: `aspect-[9/16]` video
  *plus* a separate `p-3` footer row below it (likes/engagement/view-
  post link), making them taller overall than the Instagram/TikTok/
  Facebook cards, which are a single `aspect-[9/16]` box with the
  label/link overlaid via an absolute-positioned bottom gradient bar.
  Moved the self-hosted cards to the same pattern: outer wrapper is
  now `bg-bg-card rounded-2xl aspect-[9/16] relative overflow-hidden
  border border-border` (identical classes to the embed components),
  video fills it via `absolute inset-0`, and the likes/engagement/
  view-post row is now an absolute bottom gradient overlay instead of
  a separate box below. Moved "Tap to unmute" from bottom-left to
  top-right to free up the bottom edge for the new overlay. Net
  result: every card in the row — self-hosted or embedded — is now
  the same aspect ratio, corner radius, and border treatment, matching
  as closely as each platform's embed constraints allow (per the
  brief; embeds still can't be hover-styled identically, that's
  expected).

## topic: team-section-polish — _2026-08-01_

Branch `redesign/agency-only` (still not merged).

- **Heading**: "Proven Viral Creators" → "Proven Viral Creators,
  Turned Agency Operators."
- **Bios rewritten**: Thienvu's title "Founder of Vo Creations
  Mentorship" → "CEO of VoC Mentorship" (second line unchanged).
  Daniel's title "150M+ views as a creator" → "COO of VoC Mentorship";
  his second line expanded from "$200K+ in earnings" to a full
  creator-economy-operator bio that folds the old figure back in
  ("...Also generated 150M+ views as a creator and $200K+ in
  earnings").
- **Thienvu's photo crop**: default `object-position: center` left
  too much empty grass/pillar above him. Added a per-team-member
  `imagePosition` field to the `team` array (`"center 75%"` for
  Thienvu, plain `"center"` for Daniel, who didn't need a change),
  applied via inline `style={{ objectPosition: t.imagePosition }}`
  rather than a Tailwind utility class — the value needs to vary per
  team member at runtime, which Tailwind's JIT can't do from a
  dynamic string. Chose an inline style over a second hardcoded
  Tailwind class conditional since a plain CSS value here is simpler
  and just as explicit.

## topic: footer-polish — _2026-08-01_

Branch `redesign/agency-only` (still not merged).

- **Footer's bottom bar had a brown tint** — not a bad token choice
  like the CTA-block fix earlier in this branch, but the `<footer>`
  itself has no background color at all, so it's transparent to
  `body`'s `background-image` in `globals.css`: two maroon radial
  gradients (`rgba(120,24,24,...)`) anchored to the *viewport's*
  top-left and bottom-right corners via `background-attachment:
  fixed`. Since the footer is the last thing on the page, it's
  usually sitting right where the bottom-right corner gradient is
  strongest when scrolled into view — the bottom bar specifically,
  being the lowest content, catches the most concentrated dose. Fixed
  by giving the whole `<footer>` an explicit `bg-bg` (not just the
  bottom-bar div) so nothing in it is transparent to that fixed
  gradient, rather than patching only the specific div the user
  flagged — the same root cause could just as easily show up higher
  in the footer on a short viewport.
- **Tagline**: "Your in-house UGC program, without the overhead." →
  "Your world-class in-house UGC program, without the overhead."

## topic: hero-story-card — _2026-08-01 (real iPhone shell, not a generic card)_

Branch `redesign/agency-only` (still not merged). Extends the entries of
the same topic name above — only the outer shell changed, stage content
is untouched except where noted.

- **Outer container rebuilt as a real iPhone mockup**, not a plain
  rounded card: an outer "bezel" div (`rounded-[42px]`, a subtle metal-
  toned gradient, thin light border) wraps an inner "screen" div at a
  smaller radius (`rounded-[34px]`) with visible bezel band between
  them — the two-radius structure is what actually reads as a phone
  rather than a big rounded rectangle. A dynamic-island cutout (solid
  black pill, top-center) replaced the old bare progress-bar strip as
  the top-most element; the strip didn't disappear, it moved to sit
  just below the island (matching how real iOS apps like Instagram
  Stories lay out their own progress segments in the safe area under
  the island, not overlapping it).
- **Vo Creations mark now lives inside the island itself** — a tiny
  white V-mark (`vocreations-mark-white.png`) centered in the pill, as
  if the phone were mid-way through a branded Live Activity — rather
  than a separate watermark badge bolted onto a corner. Directly
  addresses "reads as distinctly Vo Creations branded, not a generic
  phone screen."
- **Card widened** from `w-[240px]` to `w-[264px]` ("slightly bigger").
  Re-verified no hero overlap at 1280/1440/1920px afterward — margin
  to the viewport edge is unchanged (114-434px, same as before the
  resize, since the card grew into its own already-generous gap rather
  than encroaching on the text column), gap between text and card
  dropped from 192px to 168px, still comfortable.
- Every `StageWrap` needed more top clearance for the taller new chrome
  (island + repositioned progress bar takes real vertical space the
  old bare strip didn't) — changed from uniform `p-5` to `px-5 pb-5
  pt-16`. Reverified all six stages individually for overflow the same
  way as every prior round on this card: `scrollHeight === clientHeight`
  plus a screenshot of each stage, not just the first one.

## topic: showcase-marquee — _2026-08-01 (zero self-hosted videos left, YouTube added, interleaved)_

Branch `redesign/agency-only` (still not merged). Extends the entries of
the same topic name above.

- **The 2 remaining self-hosted mp4 cards are gone.** Both were the
  *same underlying posts* as two existing Instagram links already in
  the array's source data (`postUrl` on the old video entries pointed
  at `DTRCvh2E1Lu`/`DUMI_NwD0Xa`) — replaced with the real Instagram
  embed of each post instead of re-hosting or re-deriving anything.
  `showcaseVideos`' type union dropped `"video"` entirely; the carousel
  JSX lost its whole self-hosted-video branch (video element, hover-
  play handlers, `#t=0.1` thumbnail trick) — now a single 4-branch
  embed-only render (Instagram/TikTok/Facebook/YouTube). Confirmed via
  `document.querySelectorAll("video").length === 0` on the live page,
  not just by reading the code.
- **Added 2 YouTube Shorts** via a rebuilt `components/YouTubeEmbed.tsx`
  — it existed already but was unused anywhere on the site and shaped
  for a different context (`{videoId, title, watchUrl}` props,
  `aspect-video` landscape box, from what looks like leftover
  scaffolding). Realigned it to the same `{url, label}` prop shape and
  `aspect-[9/16]` card treatment as TikTok/Facebook/Instagram, since
  it's unused elsewhere so realigning it carried zero regression risk.
  Extracts the video ID from a `/shorts/{id}` URL (also handles
  `?v=`/`youtu.be/` in case a non-Shorts link is ever added) and shows
  a click-to-load thumbnail (`img.youtube.com/vi/{id}/hqdefault.jpg`)
  with a YouTube-red play button, matching the other embeds' lazy-load
  pattern.
- **Interleaved by platform** — 14 items total (2 TikTok, 9 Instagram,
  1 Facebook, 2 YouTube), reordered so consecutive cards are usually a
  different platform. Instagram is the clear majority (9 of 14), so by
  the pigeonhole principle a handful of adjacent Instagram-Instagram
  pairs are mathematically unavoidable in any arrangement — targeted
  "never more than 2 in a row, no platform blocked together" rather
  than zero adjacent repeats, which isn't achievable with this mix.
- **Subheading**: "Real UGC from our trained creator network." → "Real
  UGC from our trained creator network across TT, IG, FB & YT."

## topic: trusted-by-logos — _2026-08-01 (uniform visual footprint)_

Branch `redesign/agency-only` (still not merged). Extends the entry of
the same topic name above.

- **Every logo now renders inside the same fixed `w-[130px] h-14` box**
  (both the normal branch and the unused-but-kept `needsChip` branch),
  with the `<Image>` itself set to `max-w-full max-h-full w-auto h-auto
  object-contain` so it scales to fit the box on whichever axis is
  tighter for that logo's aspect ratio, instead of the old fixed-height-
  only (`h-14 w-auto`) rule that let wide wordmarks render much wider
  than compact icon+text logos. Verified via `getBoundingClientRect()`
  on six consecutive logos in the live marquee — all exactly 130×56,
  not just eyeballed from a screenshot. Track gap tightened from
  `gap-x-12` to `gap-x-10` since the now-uniform boxes read a little
  emptier at the old spacing.

## topic: result-card-orange-audit — _2026-08-01_

Branch `redesign/agency-only` (still not merged). Orange kept resurfacing
in this section across earlier rounds, so this pass was a full grep, not
a spot check — every instance found is listed here, not just the ones
fixed.

- **Full search performed**: `text-accent`, `border-accent`, `bg-accent`,
  `fill-accent`, `stroke-accent` (case-insensitive), plus the three known
  amber hex literals (`#F5A623`, `#E08A1E`, `#f7c157`), across
  `components/ResultCard.tsx` and the Case Studies section wrapper in
  `app/page.tsx` (including `Label.tsx`, its section kicker). Exactly
  two hits, both in `ResultCard.tsx`, both already covered above — no
  hardcoded hex, nothing in the Case Studies wrapper itself, nothing in
  hover/focus states beyond the two found:
  1. `hover:border-accent/25` on the card's outer border (line 42) —
     the card's border brightened to amber on hover.
  2. `bg-accent/[0.03]` on the quote bar (line 90) — a near-invisible
     but real amber tint behind every quote.
  Fixed both to the neutral equivalent at the same opacity:
  `hover:border-white/20` and `bg-white/[0.03]`.
- **Real, separate bug found while adding logos to the 3 new cards**:
  the logo chip (`bg-white`) was making most logos *invisible*, not
  orange — checked actual pixel data on all 7 case-study logo files and
  found `blackbox.png`, `aonic.png`, and `higgsfield.png` are 100% white
  ink (monochrome, sourced for the dark Trusted By marquee), so on a
  white chip they rendered as blank space; `fable.png`/`codedex.png`/
  `liftoff.png` are partially white and only their colored portions
  survived. Not what was asked for this round, but directly blocks "add
  logos to all case study cards" from actually being visible, so fixed
  it: chip background `bg-white` → `bg-bg-elevated` (the same token
  every other elevated surface in the card already uses — tag pills,
  mini-stat tiles), padding `p-1` → `p-1.5` for a touch more breathing
  room against the darker background. All 7 logos (4 existing + 3 new)
  now genuinely visible, confirmed by screenshot, not just present in
  the DOM.
- **3 new case-study cards** (Liftoff, Aonic, Higgsfield) use
  `ResultCard`'s existing lighter path — no `quote`/`challenge`/
  `approach`/`result` passed (made `quote`/`quoteSource` optional on the
  interface rather than passing empty-string workarounds), so
  `expandable` is `false` and no "Click for full case study" / expand
  affordance appears, matching the brief's "non-expandable pattern"
  with zero changes to the component's rendering logic. Creator counts
  ride in `viewsSub` ("3 months / 50 creators" etc.) — the same compact
  format the four existing cards already use, not a new field. Tags are
  a single verified-not-guessed category each: Liftoff "Fitness app"
  and Aonic "Health & wellness" both confirmed by fetching their own
  sites' meta description just now (`aoniclife.com`: "Make healthy
  living enjoyable."), Higgsfield "AI video generation" from the
  research already on file from the trusted-by-logos round. No funding/
  location/specific claims invented for any of the three.
- `higgsfield.png` already existed in `public/logos/` from the earlier
  trusted-by-logos round — no new logo sourcing needed for this batch.

## topic: showcase-marquee — _2026-08-01 (3 more videos folded in)_

Branch `redesign/agency-only` (still not merged). Extends the entries of
the same topic name above.

- **Added 2 Instagram + 1 TikTok**, bringing the carousel to 17 items
  (11 Instagram, 3 TikTok, 1 Facebook, 2 YouTube). Folded into the
  existing interleaved order rather than appended after the last item —
  inserted where they best broke up existing same-platform runs, same
  approach as the original interleave.
- **Subheading platform order**: "...across TT, IG, FB & YT." → "...across
  IG, TT, FB & YT."

## topic: result-card-simplify — _2026-08-01_

Branch `redesign/agency-only` (still not merged). Supersedes the card
structure from the `result-card-orange-audit` entry above (that entry's
orange fixes and the `bg-white` → `bg-bg-elevated` logo-visibility fix
are both still current, just the chip itself is gone now).

- **Removed three things from every card**: the logo's boxed chip
  background (logo is now a plain `<Image>` in a fixed `h-9 w-[100px]`
  box, `object-contain`, no background — same fixed-box-plus-
  object-contain principle as the Trusted By marquee logos, scaled down
  for sitting inline next to a company name instead of alone in a
  row), the tag-pills row entirely (`tags` prop removed from the
  component and every call site, not just hidden), and the quote bar
  entirely (`quote`/`quoteSource` removed from the component and every
  call site — the four cards that had real quotes lost them too, per
  the brief).
- **Every card is expandable now** — `expandable` used to be computed
  from `!!(challenge || approach || result)`, so the three factless
  cards (Liftoff/Higgsfield/Aonic) rendered with no click affordance at
  all. Removed that gate; every card always shows "Click for full case
  study" and toggles open. The three factless cards' expanded state is
  the `miniStats` grid only (views/creators/timeframe, all real
  numbers already used elsewhere on each card) — no challenge/approach/
  result invented for them, matching the brief exactly. Also removed
  the unused `note` prop (`"non-expandable cards like Lore"` — that
  pattern is obsolete now that nothing is non-expandable).
  - `miniStats` grid now goes 3-wide instead of 4-wide when there are
    exactly 3 stats (`miniStats.length === 3 ? "md:grid-cols-3" :
    "md:grid-cols-4"`) — the three new cards only have 3 real numbers
    (views/creators/timeframe), and a 4-column grid with one empty slot
    read visibly lopsided.
- **Reordered all 7 cards by view count**: Liftoff (151M+) → Higgsfield
  (65M+) → Aonic (31M+) → Fable (25.4M) → BlackBox AI (11.5M) → Makon AI
  (10.2M) → Codedex (10M+).

## topic: logo-sizing-fix — _2026-08-01_

Branch `redesign/agency-only` (still not merged). Fixes the actual root
cause behind a complaint that had already come up once before ("Aonic
too big, BlackBox too small") and been half-addressed with per-file
sizing tweaks rather than the systemic fix below.

- **The Aonic logo was not missing, broken, or falling back to text** —
  `public/logos/aonic.png` is a real, valid 720×213 PNG (verified:
  opened it, confirmed a genuine "Aonic" wordmark when composited onto
  a dark background — the file just reads as blank white when previewed
  on a white background, the same white-ink-on-transparent situation
  that's come up repeatedly this branch). The actual bug: its content
  filled 100% of the canvas, zero transparent padding on any edge.
- **Real root cause, checked across all 18 files in `public/logos/`
  via bbox-vs-canvas measurement**: every logo was sized with
  `object-contain` inside a fixed box, which fits the image's full
  *canvas* dimensions into the box — not its visible content. Files
  varied from 0% baked-in padding (`aonic.png`, `dealism.png`,
  `dubbing.png`, `higgsfield.png`, `hyperknow.png`, `kortix.png`) up to
  62% vertical padding (`causes.png`, `cooksat.png`, `makon1.png`).
  A zero-padding file's real content fills its fitted box entirely; a
  62%-padding file's real content only fills a fraction of the same
  box — same CSS treatment, wildly different visual weight, entirely
  explained by how each file happened to be cropped when it was
  originally sourced/processed, not a rendering bug.
  - Fixed at the source: cropped all 18 files in `public/logos/` to
    their tight content bbox in place (`Image.getbbox()` +
    `.crop(bbox)`), removing 100% of the baked-in padding from every
    file. Now the canvas *is* the content for every logo, so
    `object-contain` in a fixed box produces consistent visual weight
    everywhere, by construction, not by chance.
- **New `components/LogoImage.tsx`** — the one place the fixed-box +
  `object-contain` technique is implemented, used by both the Trusted
  By marquee and `ResultCard.tsx` (the caller supplies the box size via
  `boxClassName`; the sizing *mechanism* is identical everywhere). This
  is the "systemic fix, not a one-off tweak" the brief asked for — any
  third place logos get added later inherits the same correct behavior
  automatically instead of needing its own bespoke sizing rule.
- Verified via `getBoundingClientRect()` on all 7 case-study logos live
  on the page: every box is exactly 130×36, not just eyeballed from a
  screenshot.

## topic: result-card-simplify — _2026-08-01 (redundant name text removed)_

Branch `redesign/agency-only` (still not merged). Extends the entry of
the same topic name above.

- **Removed the company-name text sitting next to the logo** — the
  header row is now just the logo (via `LogoImage`) and the big view
  stat; `company` stays in the props (used for the image's `alt` text
  and a text fallback if a card is ever added without a `logo`), it
  just no longer renders as a second, redundant visible label.

## topic: ambient-glow — _2026-08-01_

Branch `redesign/agency-only` (still not merged).

- **New `components/AmbientGlow.tsx`**, rendered once in `app/layout.tsx`
  (`position: fixed`, `-z-10`, `pointer-events-none`) so it's present
  site-wide rather than restarting per-section — two soft radial-
  gradient ellipses (cream/white, not the reference image's gold, per
  the brief — this site is monochrome) on independent transform-only
  keyframe animations (`translate` + `rotate`, 18s/22s, ease-in-out,
  infinite, offset by a 1.5s delay so they don't move in lockstep).
  Softness comes from the gradient's own falloff, not a `blur()`
  filter — blurring an element this large every frame is real paint
  cost, a gradient that's already soft at the DOM level animates for
  free since only `transform` changes.
- **Real blocker found and fixed**: the glow initially rendered
  correctly in the DOM (`-z-10`, confirmed via computed style) but was
  completely invisible in the hero — the hero `<section>` had its own
  explicit `bg-bg`, an opaque box that paints over anything behind it
  regardless of z-index or color similarity to what's underneath.
  `z-index: -1` only protects a fixed element from being covered by
  *content*, not from being painted under an opaque sibling's own box
  background. Fixed by removing the hero's `bg-bg` — it was redundant
  with `body`'s own `bg-bg` (same token, painted as the canvas
  background either way), so the fix has zero visual effect with the
  glow off and unblocks it in the hero specifically. Left `CTABlock`'s
  and the footer's own explicit backgrounds alone — those were added
  earlier this branch to fix a real bug (the body's separate maroon
  corner-glow gradient bleeding through into the footer's bottom bar),
  and undoing them risks reintroducing that, for a section where the
  ambient glow already isn't the point.
- Verified glow presence + text legibility by screenshotting every
  section (hero, Trusted By, Our Work, Case Studies, Team, How It
  Works, FAQ, CTA/footer) — visible and non-distracting everywhere it
  has an unobstructed opaque-free background, fully absent only where
  a section/card has its own solid `bg-bg-card`/`bg-bg-elevated` (by
  design, not a bug — those cards are opaque for unrelated reasons).
  Confirmed the animation is actually running (not a single static
  frame) by polling `getComputedStyle(...).transform` on both blobs 3s
  apart and seeing both matrices change independently. Confirmed no
  interactive element is blocked: FAQ accordion still expands on
  click, nav links still navigate, and `document.elementFromPoint()`
  at the "Let's Talk" button's exact center returns the button itself,
  not the glow div, proving `pointer-events: none` holds even directly
  over the glow's brightest point.
