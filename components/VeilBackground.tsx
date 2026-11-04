// DECISION 2026-11: the silk gradient drifts in CSS. The WebGL canvas no
// longer covers it, and the grain layer stays still. See docs/DECISIONS.md
// (topic: silk-drift-2026-11).
export default function VeilBackground() {
  return (
    <div className="silk-field">
      <div className="silk-sheet" />
      <div className="silk-sheen" aria-hidden="true" />
    </div>
  );
}
