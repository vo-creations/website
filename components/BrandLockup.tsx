// DECISION 2026-11: the white serif VO monogram is the primary mark.
// See docs/DECISIONS.md (topic: silk-monogram-2026-11).
export default function BrandLockup({ height = 36 }: { height?: number }) {
  return (
    <span className="brand-lockup">
      <img src="/brand/vo-logo.svg" alt="" className="brand-mark" style={{ height }} />
      <span className="brand-word">VO CREATIONS</span>
    </span>
  );
}
