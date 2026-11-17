// Supabase names the leaderboard session cookie itself. createBrowserClient
// in lib/supabase/client.ts does not pass cookieOptions.name, so the name is
// the default storage key in @supabase/supabase-js: sb-<project-ref>-auth-token.
// A value that does not fit in one cookie is stored as that name plus .0, .1,
// and so on (@supabase/ssr chunker, 3180 characters). See docs/DECISIONS.md
// (topic: a11y-privacy-2026-11).

export function leaderboardSessionCookieName(supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL): string | null {
  const raw = supabaseUrl?.trim() ?? "";
  if (!raw) return null;
  try {
    const ref = new URL(raw).hostname.split(".")[0];
    if (ref) return `sb-${ref}-auth-token`;
  } catch {
    return null;
  }
  return null;
}
