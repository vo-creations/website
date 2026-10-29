# SEO Work Diary — vocreations.com

## 2026-04-08: Google Search Console Indexing Fixes

### Issues Found (from GSC "Why pages aren't indexed" report)

| Issue | Pages | Status |
|---|---|---|
| Not found (404) | 9 | Fixed |
| Duplicate without user-selected canonical | 5 | Fixed |
| Alternate page with proper canonical tag | 5 | Fixed |
| Page with redirect | 3 | Fixed |
| Discovered - currently not indexed | 5 | Awaiting Google recrawl |
| Crawled - currently not indexed | 3 | 2 fixed, 1 no action needed |
| Soft 404 | 0 | Clean |

### Changes Made

**1. Old Squarespace URL redirects** (`next.config.mjs`)
- `/home` → `/`
- `/terms` → `/`
- `/Full` → `/`
- `/privacy-policy-3975-8774-8031-8438-2279-3890` → `/`
- `/terms-and-conditions-4338-7294-8836-7704-3508-2366` → `/`
- `/tmp/*` → `/` (Squarespace build artifacts)
- `/landing-page` → `/`
- `/thanks-for-applying` → `/`

**2. Middleware created** (`middleware.ts`)
- Redirects `www.vocreations.com` → `vocreations.com` (301)
- Strips tracking query params (`?wtime=`, `?trakyo_id=`) that caused duplicate URLs

**3. Vercel domain config updated**
- Changed primary domain from `www.vocreations.com` to `vocreations.com`
- `www.vocreations.com` now redirects → `vocreations.com` (308 permanent)
- Previously was reversed (non-www redirected to www with 307 temporary)

### No Action Needed

- `go.vocreations.com/6396a168` — old landing page subdomain, DNS record already removed. Google will drop it on its own.
- "Discovered - currently not indexed" pages (`/about`, `/blog/text-on-screen-ugc`, `/creators`, `/mentorship`) — real pages in sitemap, just awaiting Google crawl. (`/mentorship/enroll` was later removed entirely along with website checkout, see 2026-06 note below.)

### Next Steps

- [x] Deploy changes to Vercel
- [x] Click "Validate Fix" in GSC for: 404s, Duplicate canonical, Alternate canonical, Page with redirect
- [ ] Use GSC URL Inspection → "Request Indexing" for each of the 4 discovered-but-not-indexed pages
- [ ] Re-check GSC in 1-2 weeks to confirm issues are resolving

---

## 2026-04-08: GSC Validation Status Update

All 6 issue categories now show **Validation: Started** in GSC. Google is actively recrawling affected URLs. Expected resolution in 1-2 weeks.

Note: GSC property is registered under `www.vocreations.com` — sitemap submission must use the www URL. This is fine since www redirects to non-www.

---

## 2026-06: Website checkout removed

Removed the `/mentorship/enroll` page and the `/api/checkout` route. Mentorship is no longer sold through the website; sales go through direct Stripe payment links sent to buyers. `/mentorship/enroll` was also dropped from the sitemap. Google will drop the URL on its own once it recrawls (expect a "404/removed" status, which is intended).

---

## 2026-10-18: SEO/AEO audit fixes

See `docs/DECISIONS.md` topic `seo-aeo-2026-10` for the reasoning. Short version: final stat values are in the server HTML, FAQ answers are visible, `/blog` and the text-on-screen post are back, `/mentorship` is 410, showcase embeds wait for a click, the H1 names the UGC agency, the meta description is 110 characters, and the sitemap lists the restored URLs. Case-study pages drafted the same day were removed on 2026-10-19 (see below).

---

## 2026-10-19: Case-study proof stays gated

The owner reversed the public case-study pages. `/case-studies`, `/case-studies/fable`, and `/case-studies/cluely` are deleted and 404. Homepage cards, including Fable, stay blurred behind the book-a-call overlay. `/campaigns/maxxd` is not newly linked from the sitemap, `llms.txt`, or the homepage.

---

## 2026-10-19: Minimum deal is $50K/month

The public price floor moved from $30K/month to $50K/month in the FAQ (and its JSON-LD), the program section, `/llms.txt`, and the Service offer. 90 days, separate creator bonuses, and no refunds are unchanged.

---

## 2026-10-19: Banner brand system

The marketing pages now use the banner type and monochrome palette. The H1 still contains "UGC agency". Stat counters, the visible FAQ, gated result cards, and the $50K floor are unchanged. Open Graph art was replaced with a 1200×630 frame of the same lockup.

---

## 2026-10-26: Brand Instagram

Daniel confirmed the brand Instagram is https://www.instagram.com/vo.creations/. Organization `sameAs` and the `llms.txt` Profiles section now list it next to X (`https://x.com/VoCreationsUGC`) and the company LinkedIn. The footer and nav still have no social-link row.

---

## 2026-10-28: Blog template and four essays

The blog index and every post now share a template aimed at answer engines: a short definition under the H1, question headings, a table of contents, a visible FAQ that matches FAQPage JSON-LD, BlogPosting with a founder as author, and a breadcrumb. New essays cover the in-house vs marketplace vs freelancer choice, what a $50K month covers, talking-head UGC for AI startups, and 12 hiring questions. `llms.txt` lists them and adds who the agency serves, when to use it, and who is not a fit. Named results stay gated. No new client names or market rate cards.

---

## 2026-10-29: Creator count is 1000+

The public creator count moved from 500+ to 1000+. The meta description, Open Graph description, and Twitter description now say "1000+ creators". `llms.txt` and the homepage program line use "1000+ vetted in-house creators trained through mentorship". The hero stat counts to 1000+. The case-study card for that client was removed. The logo stays first in the Trusted By strip, and the locked cards are placeholders.
