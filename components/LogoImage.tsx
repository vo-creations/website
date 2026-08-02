import Image from "next/image";

interface LogoImageProps {
  src: string;
  alt: string;
  boxClassName: string;
}

// DECISION: the one place logo sizing is implemented — a fixed-size box
// (caller controls the box dimensions via boxClassName) with the image
// capped to max-w-full/max-h-full and object-contain, so every logo scales
// to fill its box based on actual visible ink. This only works because the
// underlying files in public/logos/ were trimmed to their tight content
// bbox (no internal transparent padding) — before that, files with heavy
// baked-in padding (e.g. old makon1.png at 62% vertical padding) rendered
// visibly smaller than zero-padding files (aonic.png, higgsfield.png) even
// inside an identical box, since object-contain fits the whole canvas, not
// the visible content. See docs/DECISIONS.md (topic: logo-sizing-fix).
export default function LogoImage({ src, alt, boxClassName }: LogoImageProps) {
  return (
    <div className={`flex items-center justify-center shrink-0 ${boxClassName}`}>
      <Image
        src={src}
        alt={alt}
        width={200}
        height={80}
        className="max-w-full max-h-full w-auto h-auto object-contain"
      />
    </div>
  );
}
