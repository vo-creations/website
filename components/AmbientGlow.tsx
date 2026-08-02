// DECISION: fixed-position decorative layer, present once in app/layout.tsx
// so it drifts across the whole site rather than restarting per-section.
// -z-10 (not z-0) so it's guaranteed to sit behind every section regardless
// of DOM order or another element's own stacking context — pointer-events-none
// on top of that so it can never intercept a click even if z-index math were
// ever wrong.
//
// Rebuilt from a single centered radial blob (read as a faint darkening, not
// a light beam) to three elongated, staggered-angle "ribbons" — each is just
// a wide/short box (not the box's gradient shape) so an ordinary centered
// radial-gradient inside it already reads as an elongated beam. Three
// ribbons at three different rotation angles, positions, and animation
// paths is what produces the curved/swirling look asked for — a single
// straight ribbon animating would still just look like a bar sliding
// around. Softness is the gradient's own falloff, not a CSS `blur()` filter,
// and every animation only touches `transform` (translate + rotate), so the
// browser composites this on the GPU without repainting on scroll.
//
// Peak opacity intentionally much higher than the first version (up to 55%
// white at each ribbon's core) — verified against text contrast in every
// section afterward, not just the hero, per docs/DECISIONS.md
// (topic: ambient-glow-v2).
const RIBBON_GRADIENT_BRIGHT =
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(247,240,221,0.28) 30%, rgba(247,240,221,0.10) 55%, transparent 78%)";
const RIBBON_GRADIENT_MID =
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.45) 0%, rgba(247,240,221,0.22) 30%, rgba(247,240,221,0.08) 55%, transparent 78%)";
const RIBBON_GRADIENT_SOFT =
  "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.36) 0%, rgba(247,240,221,0.16) 32%, rgba(247,240,221,0.06) 58%, transparent 78%)";

export default function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div
        className="absolute w-[150vw] h-[24vw] max-w-[1900px] max-h-[320px] -top-[8%] -left-[25%] rotate-[-34deg] animate-glow-drift-a will-change-transform"
        style={{ background: RIBBON_GRADIENT_BRIGHT }}
      />
      <div
        className="absolute w-[130vw] h-[20vw] max-w-[1700px] max-h-[280px] top-[30%] -left-[15%] rotate-[-20deg] animate-glow-drift-b will-change-transform"
        style={{ background: RIBBON_GRADIENT_MID }}
      />
      <div
        className="absolute w-[120vw] h-[18vw] max-w-[1500px] max-h-[240px] top-[62%] -left-[10%] rotate-[-8deg] animate-glow-drift-c will-change-transform"
        style={{ background: RIBBON_GRADIENT_SOFT }}
      />
    </div>
  );
}
