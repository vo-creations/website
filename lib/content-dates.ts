// Dates printed on the legal pages. app/sitemap.ts reads these so lastmod
// is not a second copy of the date. See docs/DECISIONS.md (topic: perf-a11y-2026-11).

export const privacyUpdated = "2026-11-10";
export const termsUpdated = "2026-11-03";
export const refundUpdated = "2026-10-28";

export function legalDateLabel(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
