// DECISION 2026-11: proof overlays only for verified view counts.
// creator-01, creator-02, creator-03, and creator-05 are Launchpoint totals.
// hero-clip-1 and hero-clip-3 stay the counts recorded with their source files.
// See docs/DECISIONS.md (topic: clip-proof-launchpoint-2026-11).

export type CreatorClip = {
  src: string;
  poster: string;
  /** Verified view count. Absent when the count is not verified. */
  proof?: string;
};

export const creatorClips: CreatorClip[] = [
  { src: "/videos/creator-01.mp4", poster: "/videos/creator-01.jpg", proof: "4.6M views" },
  // Trim of post-1.mp4. Homepage history and the text-on-screen essay both record 3.8M for that file.
  { src: "/videos/hero-clip-1.mp4", poster: "/videos/hero-clip-1.jpg", proof: "3.8M views" },
  { src: "/videos/creator-02.mp4", poster: "/videos/creator-02.jpg", proof: "4M views" },
  // Trim of post-4.mp4. The original showcase row recorded 1.5M for that file.
  { src: "/videos/hero-clip-3.mp4", poster: "/videos/hero-clip-3.jpg", proof: "1.5M views" },
  { src: "/videos/creator-03.mp4", poster: "/videos/creator-03.jpg", proof: "3M views" },
  { src: "/videos/creator-05.mp4", poster: "/videos/creator-05.jpg", proof: "2.4M views" },
];

export function proofFor(src: string) {
  return creatorClips.find((clip) => clip.src === src)?.proof;
}
