// Shown when the gated board cannot start a session. Still noindex via the
// leaderboard layout. DECISION 2026-11: see docs/DECISIONS.md

export default function AuthUnavailable({ reason }: { reason: "missing" | "down" }) {
  return (
    <div className="screen">
      <div className="cup">
        <i className="ti ti-trophy" />
      </div>
      <h1>Leaderboard unavailable</h1>
      <p>
        {reason === "missing"
          ? "Sign-in is not configured for this deployment, so the leaderboard cannot load."
          : "Sign-in did not respond, so the leaderboard cannot load. Try again in a minute."}
      </p>
    </div>
  );
}
