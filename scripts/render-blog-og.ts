/**
 * Renders public/og/blog/<slug>.png from the same CSS as components/blog/BlogCover.tsx.
 * Run: npm run og:blog
 * Needs Google Chrome and the Inter Tight files downloaded on first run.
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { posts } from "../lib/blog/posts";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const WIDTH = 1200;
const HEIGHT = 630;
const SCALE = 2;

function coverCss(): string {
  const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
  const start = css.indexOf("/* blog-cover:start");
  const end = css.indexOf("/* blog-cover:end */");
  if (start < 0 || end < 0) throw new Error("blog-cover CSS markers missing from app/globals.css");
  const block = css.slice(css.indexOf("*/", start) + 2, end);
  const grain = join(ROOT, "public/brand/grain.png");
  return block.replace('url("/brand/grain.png")', `url("${grain}")`);
}

function ensureFont(dir: string, file: string, url: string) {
  const dest = join(dir, file);
  const result = spawnSync("curl", ["-fsSL", "-o", dest, url], { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`Could not download ${file}`);
  return dest;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cardHtml(title: string, mark: string, fontDir: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
@font-face { font-family: "Inter Tight"; font-weight: 800; src: url("${join(fontDir, "InterTight-800.ttf")}") format("truetype"); }
@font-face { font-family: "Inter Tight"; font-weight: 600; src: url("${join(fontDir, "InterTight-600.ttf")}") format("truetype"); }
:root { --font-inter-tight: "Inter Tight"; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: #050505; }
${coverCss()}
.blog-cover { width: ${WIDTH}px; height: ${HEIGHT}px; aspect-ratio: auto; }
</style>
</head>
<body>
<div class="blog-cover">
  <div class="blog-cover-silk"></div>
  <div class="blog-cover-grain"></div>
  <div class="blog-cover-vignette"></div>
  <div class="blog-cover-stage">
    <div class="blog-cover-markcol">
      <div class="blog-cover-mark"><img src="${mark}" alt="" /></div>
      <div class="blog-cover-reflect"><img src="${mark}" alt="" /></div>
    </div>
    <div class="blog-cover-copy">
      <p class="blog-cover-kicker">Vo Creations</p>
      <p class="blog-cover-title">${escapeHtml(title)}</p>
      <p class="blog-cover-tag">make them remember<span>.</span></p>
    </div>
  </div>
</div>
</body>
</html>`;
}

function shot(htmlPath: string, pngPath: string) {
  const profile = join(tmpdir(), `vo-og-chrome-${process.pid}-${Math.random().toString(16).slice(2)}`);
  mkdirSync(profile, { recursive: true });
  const result = spawnSync(
    "timeout",
    [
      "8",
      "google-chrome",
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      `--force-device-scale-factor=${SCALE}`,
      `--window-size=${WIDTH},${HEIGHT}`,
      `--user-data-dir=${profile}`,
      "--virtual-time-budget=4000",
      `--screenshot=${pngPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: "inherit" },
  );
  rmSync(profile, { recursive: true, force: true });
  if (!existsSync(pngPath)) {
    throw new Error(`chrome exited ${result.status} without writing ${pngPath}`);
  }
}

function fit(src: string, dest: string) {
  const py = `
from PIL import Image
im = Image.open(${JSON.stringify(src)}).convert("RGB")
# Headless sometimes adds a scrollbar gutter. Keep the top-left card.
im = im.crop((0, 0, min(im.width, ${WIDTH * SCALE}), min(im.height, ${HEIGHT * SCALE})))
im = im.resize((${WIDTH}, ${HEIGHT}), Image.Resampling.LANCZOS)
im.save(${JSON.stringify(dest)}, "PNG", optimize=True)
print(im.size)
`;
  const result = spawnSync("python3", ["-c", py], { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`Could not write ${dest}`);
}

const fontDir = join(tmpdir(), "vo-og-fonts");
mkdirSync(fontDir, { recursive: true });
ensureFont(
  fontDir,
  "InterTight-800.ttf",
  "https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjjwiqXA.ttf",
);
ensureFont(
  fontDir,
  "InterTight-600.ttf",
  "https://fonts.gstatic.com/s/intertight/v9/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj0QiqXA.ttf",
);

const mark = join(ROOT, "public/brand/chrome-mono.webp");
const outDir = join(ROOT, "public/og/blog");
mkdirSync(outDir, { recursive: true });
const work = join(tmpdir(), "vo-og-html");
mkdirSync(work, { recursive: true });

for (const post of posts) {
  const htmlPath = join(work, `${post.slug}.html`);
  const rawPath = join(work, `${post.slug}-raw.png`);
  const dest = join(outDir, `${post.slug}.png`);
  writeFileSync(htmlPath, cardHtml(post.title, mark, fontDir));
  shot(htmlPath, rawPath);
  fit(rawPath, dest);
  console.log(dest);
}
