// DECISION 2026-11: first-load homepage intro. The head script in
// app/layout.tsx decides whether it plays. This node stays in the HTML
// and stays aria-hidden. See docs/DECISIONS.md (topic: homepage-intro-2026-11).
export default function IntroOverlay() {
  return (
    <div id="intro-overlay" className="intro-overlay" aria-hidden="true">
      <div className="intro-mark" />
    </div>
  );
}
