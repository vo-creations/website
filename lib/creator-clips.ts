// DECISION 2026-11: proof overlays only where the repo recorded a view
// count for that file. No brand name was stored for any of these six.
// See docs/DECISIONS.md (topic: hero-declutter-2026-11).

export type CreatorClip = {
  src: string;
  poster: string;
  /** Recorded view count for this file. Absent when the repo has neither a brand nor a count. */
  proof?: string;
};

export const creatorClips: CreatorClip[] = [
  { src: "/videos/creator-01.mp4", poster: "/videos/creator-01.jpg" },
  // Trim of post-1.mp4. Homepage history and the text-on-screen essay both record 3.8M for that file.
  { src: "/videos/hero-clip-1.mp4", poster: "/videos/hero-clip-1.jpg", proof: "3.8M views" },
  { src: "/videos/creator-02.mp4", poster: "/videos/creator-02.jpg" },
  // Trim of post-4.mp4. The original showcase row recorded 1.5M for that file.
  { src: "/videos/hero-clip-3.mp4", poster: "/videos/hero-clip-3.jpg", proof: "1.5M views" },
  { src: "/videos/creator-03.mp4", poster: "/videos/creator-03.jpg" },
  { src: "/videos/creator-05.mp4", poster: "/videos/creator-05.jpg" },
];

export function proofFor(src: string) {
  return creatorClips.find((clip) => clip.src === src)?.proof;
}
