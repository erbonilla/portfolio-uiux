#!/usr/bin/env node
/**
 * Asset normalization (action plan Phase 4).
 *
 * Reads raw source art from /assets and emits web-ready, correctly-named,
 * correctly-encoded files into /public/{assets,icons,og}. In one pass it:
 *   - re-encodes the large source screenshots/hero to .avif/.webp/.jpg
 *   - FIXES THE TYPO  osteoplus-screenshoot* -> osteoplus-screenshot*
 *   - normalizes the brand art (two source ".svg" files are actually PNG
 *     data mislabelled .svg; the real vector is the wordmark)
 *   - generates a placeholder PWA icon set + OG image from the wordmark
 *     (B2: temporary until the final wordmark export is supplied)
 *
 * Idempotent: safe to re-run. Run via `pnpm assets:normalize`.
 */
import sharp from "sharp";
import { readFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "assets");
const OUT_ASSETS = path.join(ROOT, "public", "assets");
const OUT_ICONS = path.join(ROOT, "public", "icons");
const OUT_OG = path.join(ROOT, "public", "og");

const BG = "#050505"; // --pwa-bg-color / surface-bg-default (dark)
const BRAND = "#FF4F18"; // --color-brand-500

const log = (m) => console.log(`  ${m}`);

async function ensureDirs() {
  for (const d of [OUT_ASSETS, OUT_ICONS, OUT_OG]) {
    await mkdir(d, { recursive: true });
  }
}

/**
 * Raster sources -> optimized avif/webp/jpg. `out` is the corrected base name
 * (this is where the screenshoot->screenshot typo gets fixed).
 */
const RASTER = [
  { in: "hero-photo.png", out: "hero-photo", maxWidth: 1200 },
  { in: "atlan-screenshot.png", out: "atlan-screenshot", maxWidth: 1600 },
  { in: "atlan-screenshot-m.png", out: "atlan-screenshot-m", maxWidth: 900 },
  { in: "osteoplus-screenshoot.png", out: "osteoplus-screenshot", maxWidth: 1600 },
  { in: "osteoplus-screenshoot-m.png", out: "osteoplus-screenshot-m", maxWidth: 900 },
];

async function normalizeRaster() {
  for (const item of RASTER) {
    const inPath = path.join(SRC, item.in);
    if (!existsSync(inPath)) {
      log(`SKIP (missing): ${item.in}`);
      continue;
    }
    const buf = await readFile(inPath);
    const base = sharp(buf).resize({
      width: item.maxWidth,
      withoutEnlargement: true,
      fit: "inside",
    });

    await base
      .clone()
      .avif({ quality: 55 })
      .toFile(path.join(OUT_ASSETS, `${item.out}.avif`));
    await base
      .clone()
      .webp({ quality: 72 })
      .toFile(path.join(OUT_ASSETS, `${item.out}.webp`));
    await base
      .clone()
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(OUT_ASSETS, `${item.out}.jpg`));

    const rename = item.in.includes("screenshoot") ? "  [typo fixed]" : "";
    log(`${item.in} -> ${item.out}.{avif,webp,jpg}${rename}`);
  }
}

/** Brand art: the real wordmark vector + the two mislabelled-PNG marks. */
async function normalizeBrand() {
  // (ed)studio-text-primary.svg is a genuine SVG (the wordmark).
  const wordmarkSrc = path.join(SRC, "(ed)studio-text-primary.svg");
  if (existsSync(wordmarkSrc)) {
    await copyFile(wordmarkSrc, path.join(OUT_ASSETS, "edstudio-wordmark.svg"));
    log("(ed)studio-text-primary.svg -> edstudio-wordmark.svg");
  }
  // (ed)studio-primary.svg / -secondary.svg are PNG data with a .svg ext:
  // re-encode to .png so the extension is honest.
  for (const [src, out] of [
    ["(ed)studio-primary.svg", "edstudio-primary.png"],
    ["(ed)studio-secondary.svg", "edstudio-secondary.png"],
  ]) {
    const p = path.join(SRC, src);
    if (!existsSync(p)) continue;
    await sharp(await readFile(p)).png().toFile(path.join(OUT_ASSETS, out));
    log(`${src} (PNG-as-.svg) -> ${out}  [extension corrected]`);
  }
}

/** Recolor the wordmark paths (default black) to brand orange for dark tiles. */
async function brandedWordmarkBuffer() {
  const raw = await readFile(path.join(SRC, "(ed)studio-text-primary.svg"), "utf8");
  // Root svg is `fill="none"`; recolor it to brand so unfilled paths inherit
  // the brand orange and show on the dark canvas (paths with their own fill
  // keep it). Replace only the first (root) occurrence.
  return Buffer.from(raw.replace('fill="none"', `fill="${BRAND}"`), "utf8");
}

/** Placeholder PWA icon set + OG image (B2 — until final wordmark export). */
async function generateIcons() {
  const wordmark = await brandedWordmarkBuffer();

  // Square tile: brand wordmark centered on the dark canvas with padding.
  async function tile(size, pad, file, dir = OUT_ICONS) {
    const inner = Math.round(size * (1 - pad * 2));
    const glyph = await sharp(wordmark, { density: 600 })
      .resize({ width: inner, fit: "inside" })
      .png()
      .toBuffer();
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BG,
      },
    })
      .composite([{ input: glyph, gravity: "center" }])
      .png()
      .toFile(path.join(dir, file));
    log(`icon: ${file} (${size}x${size})`);
  }

  await tile(192, 0.16, "icon-192.png");
  await tile(512, 0.16, "icon-512.png");
  await tile(512, 0.26, "maskable-512.png"); // larger safe-zone padding
  await tile(180, 0.16, "apple-touch-icon.png");

  // OG image 1200x630, wordmark centered on dark canvas.
  const ogGlyph = await sharp(wordmark, { density: 600 })
    .resize({ width: 720, fit: "inside" })
    .png()
    .toBuffer();
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: BG },
  })
    .composite([{ input: ogGlyph, gravity: "center" }])
    .png()
    .toFile(path.join(OUT_OG, "home.png"));
  log("og: home.png (1200x630)");
}

async function main() {
  console.log("normalize-assets: starting…");
  await ensureDirs();
  await normalizeRaster();
  await normalizeBrand();
  await generateIcons();
  console.log("normalize-assets: done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
