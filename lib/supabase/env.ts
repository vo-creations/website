// Public Supabase auth settings for the gated leaderboard. Both names are
// listed in .env.example. createServerClient throws when either value is
// empty or the URL is not http(s), and that throw in middleware becomes HTTP 500
// (MIDDLEWARE_INVOCATION_FAILED) before the page can render.
// DECISION 2026-11: treat a missing pair as "not configured" — see docs/DECISIONS.md

export function supabaseAuthEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!url || !key || !/^https?:\/\//i.test(url)) return null;
  try {
    new URL(url);
  } catch {
    return null;
  }
  return { url, key };
}
