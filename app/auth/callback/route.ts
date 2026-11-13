// Magic-link landing: exchange the PKCE code for a session cookie, then continue.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAuthEnv } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only allow same-origin LOCAL paths as the post-login destination. Reject
// protocol-relative ("//evil"), backslash ("/\\evil"), and absolute URLs
// ("https://…", "@evil") — otherwise `${origin}${next}` is an open redirect.
function safeNext(raw: string | null): string {
  const n = raw ?? "/leaderboard";
  return n.startsWith("/") && !n.startsWith("//") && !n.startsWith("/\\") ? n : "/leaderboard";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (!supabaseAuthEnv()) {
    return NextResponse.redirect(`${origin}/leaderboard/login`);
  }

  if (code) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    } catch {
      return NextResponse.redirect(`${origin}/leaderboard/login?error=link`);
    }
  }
  return NextResponse.redirect(`${origin}/leaderboard/login?error=link`);
}
