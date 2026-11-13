// Refreshes the Supabase auth session (rotates tokens) and writes the updated
// cookies onto the response. Called from middleware.ts for /leaderboard + /auth
// paths only, so the marketing pages pay no auth overhead.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseAuthEnv } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  const env = supabaseAuthEnv();
  // DECISION 2026-11: a missing Supabase URL or anon key used to throw here and
  // Vercel returned HTTP 500 (MIDDLEWARE_INVOCATION_FAILED) for /leaderboard.
  // Skip the refresh and let the page render its unavailable screen.
  // See docs/DECISIONS.md (topic: audit-fixes-2026-11-13).
  if (!env) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(env.url, env.key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    // Touch the user to trigger a token refresh when needed. Do not gate routing
    // here — the leaderboard page does its own auth + creator resolution.
    await supabase.auth.getUser();
  } catch (error) {
    console.error("leaderboard session refresh failed", error);
    return NextResponse.next({ request });
  }

  return response;
}
