interface LogoImageProps {
  src: string;
  alt: string;
  boxClassName: string;
}

// DECISION: the one place logo sizing is implemented — a box (caller
// controls the box dimensions via boxClassName) with the image capped to
// max-w-full/max-h-full and object-contain, so every logo scales to fill
// its box based on actual visible ink. This only works because the
// underlying files in public/logos/ were trimmed to their tight content
// bbox (no internal transparent padding) — before that, files with heavy
// baked-in padding (e.g. old makon1.png at 62% vertical padding) rendered
// visibly smaller than zero-padding files (aonic.png, higgsfield.png) even
// inside an identical box, since object-contain fits the whole canvas, not
// the visible content. See docs/DECISIONS.md (topic: logo-sizing-fix).
// Whether the caller should fix both dimensions or just one depends on
// context: a fixed width+height box (like ResultCard.tsx's chip) is fine
// when logos sit in individually-sized slots, but a row of logos meant to
// read at the same visual height (the Trusted By marquee) needs a
// fixed-height/auto-width box instead — fixing both dimensions makes the
// actual render height depend on each logo's own aspect ratio, which is
// what caused a real "logos look inconsistently sized" bug. See
// docs/DECISIONS.md (topic: trusted-by-logos sizing, 2026-08-03).
//
// DECISION 2026-08-03: plain <img>, not next/image. next/image generates a
// "1x"/"2x" srcset, and on a real 2x (retina) display the browser divides
// the chosen candidate's actual pixel dimensions by 2 for CSS layout. Four
// of the ten Trusted By source PNGs (higgsfield/blackbox/fable/softr) are
// small enough that Next's optimizer can't produce a genuine 2x-resolution
// candidate for them (it never upscales past the source's native size), so
// on retina those four landed under the max-height ceiling post-divide and
// rendered visibly smaller than the rest — a real, measured bug (not an
// optical illusion), confirmed via getBoundingClientRect() at
// deviceScaleFactor 2 before and after. A plain <img> has no srcset, so
// natural-size auto-sizing + max-height is deterministic at every DPR. See
// docs/DECISIONS.md (topic: trusted-by-logos sizing, 2026-08-03).
export default function LogoImage({ src, alt, boxClassName }: LogoImageProps) {
  return (
    <div className={`flex items-center justify-center shrink-0 ${boxClassName}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full w-auto h-auto object-contain"
      />
    </div>
  );
}
