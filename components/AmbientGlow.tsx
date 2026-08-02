// DECISION: fixed-position decorative layer, present once in app/layout.tsx
// so it drifts across the whole site rather than restarting per-section.
// -z-10 (not z-0) so it's guaranteed to sit behind every section regardless
// of DOM order or another element's own stacking context — pointer-events-none
// on top of that so it can never intercept a click even if z-index math were
// ever wrong. Two blurred ellipses on independent transform-only animations
// (translate + rotate, no width/height/position keyframes) so the browser
// composites this on the GPU without repainting anything on scroll. Softness
// comes from the radial-gradient's own falloff, not a CSS `blur()` filter —
// blurring an element this large every frame is real paint cost; a gradient
// that already looks soft at the DOM level costs nothing extra to animate.
// Opacity kept low (glow tops out around 5-6% white) so it reads as ambient
// atmosphere, verified against text contrast in every section, not just the
// hero, before shipping. See docs/DECISIONS.md (topic: ambient-glow).
export default function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      <div
        className="absolute w-[80vw] h-[80vw] max-w-[1100px] max-h-[1100px] -top-[20%] -left-[15%] animate-glow-drift-a will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 55% 35% at 50% 50%, rgba(247,240,221,0.16) 0%, rgba(247,240,221,0.06) 40%, transparent 72%)",
        }}
      />
      <div
        className="absolute w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] -bottom-[15%] -right-[10%] animate-glow-drift-b will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 55% 35% at 50% 50%, rgba(247,240,221,0.13) 0%, rgba(247,240,221,0.05) 40%, transparent 72%)",
        }}
      />
    </div>
  );
}
