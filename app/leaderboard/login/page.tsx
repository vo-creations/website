import LoginForm from "./LoginForm";
import AuthUnavailable from "../AuthUnavailable";
import { supabaseAuthEnv } from "@/lib/supabase/env";

export default function LoginPage() {
  if (!supabaseAuthEnv()) return <AuthUnavailable reason="missing" />;

  return (
    <div className="screen">
      <div className="cup">
        <i className="ti ti-trophy" />
      </div>
      <h1>Creator Leaderboard</h1>
      <p>See where you rank across your campaigns. Sign in with your email — no password.</p>
      <LoginForm />
    </div>
  );
}
