/**
 * Screenshot comparison tool for visual regression testing.
 *
 * Usage (from repo root):
 *   npx tsx e2e/screenshot.ts <story-id> [--update]
 *
 * Examples:
 *   npx tsx e2e/screenshot.ts components-textarea--states
 *   npx tsx e2e/screenshot.ts components-textarea--states --update
 *   npx tsx e2e/screenshot.ts components-button--solid --theme dark
 *   npx tsx e2e/screenshot.ts components-input--purpose --width 800
 *
 * Requires Storybook running on localhost:$STORYBOOK_PORT (default 6006; or set STORYBOOK_URL).
 *
 * Baselines are stored in e2e/__screenshots__/<story-id>.png
 * Diffs are written to    e2e/__screenshots__/<story-id>.diff.png
 */

import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/* ---- Config ---- */

const STORYBOOK_URL =
  process.env.STORYBOOK_URL ?? `http://localhost:${process.env.STORYBOOK_PORT ?? "6006"}`;
const SCREENSHOTS_DIR = path.join(import.meta.dirname, "__screenshots__");
const DEFAULT_VIEWPORT = { width: 1280, height: 900 };
const PIXEL_THRESHOLD = 0.1; // per-pixel color threshold (0-1)
const MISMATCH_TOLERANCE = 0.5; // percentage of pixels allowed to differ

/* ---- Types ---- */

interface ScreenshotOptions {
  storyId: string;
  update?: boolean;
  theme?: string;
  density?: string;
  width?: number;
  height?: number;
  waitMs?: number;
}

interface ComparisonResult {
  storyId: string;
  baselinePath: string;
  actualPath: string;
  diffPath: string;
  totalPixels: number;
  mismatchedPixels: number;
  mismatchPercentage: number;
  passed: boolean;
  isNew: boolean;
}

/* ---- Core ---- */

export async function screenshotStory(opts: ScreenshotOptions): Promise<ComparisonResult> {
  const {
    storyId,
    update = false,
    theme,
    density,
    width = DEFAULT_VIEWPORT.width,
    height = DEFAULT_VIEWPORT.height,
    waitMs = 1000,
  } = opts;

  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const baselinePath = path.join(SCREENSHOTS_DIR, `${storyId}.png`);
  const actualPath = path.join(SCREENSHOTS_DIR, `${storyId}.actual.png`);
  const diffPath = path.join(SCREENSHOTS_DIR, `${storyId}.diff.png`);

  // Build the story iframe URL with optional theme/density
  let url = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
  if (theme) url += `&globals=theme:${theme}`;

  // Launch browser and take screenshot
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();

  await page.goto(url, { waitUntil: "networkidle" });

  // Apply theme/density data attributes if specified
  if (theme || density) {
    await page.evaluate(
      ({ t, d }) => {
        if (t) document.body.setAttribute("data-theme", t);
        if (d) document.body.setAttribute("data-density", d);
      },
      { t: theme, d: density },
    );
    // Wait for theme/density styles to apply
    await page.waitForTimeout(200);
  }

  await page.waitForTimeout(waitMs);

  // Screenshot the story root, not the full page (avoids Storybook chrome)
  const storyRoot = page.locator("#storybook-root");
  const screenshotBuffer = await storyRoot.screenshot({ type: "png" });

  await browser.close();

  // Save actual screenshot
  fs.writeFileSync(actualPath, screenshotBuffer);

  // If no baseline exists or --update, save as baseline
  const hasBaseline = fs.existsSync(baselinePath);
  if (!hasBaseline || update) {
    fs.copyFileSync(actualPath, baselinePath);
    // Clean up actual + diff since baseline is now current
    if (fs.existsSync(actualPath) && update) fs.unlinkSync(actualPath);
    if (fs.existsSync(diffPath)) fs.unlinkSync(diffPath);

    return {
      storyId,
      baselinePath,
      actualPath,
      diffPath,
      totalPixels: 0,
      mismatchedPixels: 0,
      mismatchPercentage: 0,
      passed: true,
      isNew: !hasBaseline,
    };
  }

  // Compare with baseline
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const actual = PNG.sync.read(screenshotBuffer);

  // Handle size differences
  const maxWidth = Math.max(baseline.width, actual.width);
  const maxHeight = Math.max(baseline.height, actual.height);

  // Pad images to same size if needed
  const padded = (img: PNG, w: number, h: number): PNG => {
    if (img.width === w && img.height === h) return img;
    const out = new PNG({ width: w, height: h, fill: true });
    // Fill with transparent
    out.data.fill(0);
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
    return out;
  };

  const baselinePadded = padded(baseline, maxWidth, maxHeight);
  const actualPadded = padded(actual, maxWidth, maxHeight);
  const diff = new PNG({ width: maxWidth, height: maxHeight });

  const mismatchedPixels = pixelmatch(
    baselinePadded.data,
    actualPadded.data,
    diff.data,
    maxWidth,
    maxHeight,
    { threshold: PIXEL_THRESHOLD, includeAA: false },
  );

  const totalPixels = maxWidth * maxHeight;
  const mismatchPercentage = (mismatchedPixels / totalPixels) * 100;
  const passed = mismatchPercentage <= MISMATCH_TOLERANCE;

  // Write diff image
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  // Clean up actual if passed
  if (passed) {
    fs.unlinkSync(actualPath);
  }

  return {
    storyId,
    baselinePath,
    actualPath: passed ? "(cleaned up — passed)" : actualPath,
    diffPath,
    totalPixels,
    mismatchedPixels,
    mismatchPercentage,
    passed,
    isNew: false,
  };
}

/* ---- CLI ---- */

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "--help") {
    console.log(`
Usage: npx tsx e2e/screenshot.ts <story-id> [options]

Options:
  --update         Save current screenshot as new baseline
  --theme <name>   Set data-theme (light, dark, high-contrast)
  --density <name> Set data-density (compact, default, comfortable)
  --width <px>     Viewport width (default: 1280)
  --height <px>    Viewport height (default: 900)
  --wait <ms>      Wait time after load (default: 1000)

Examples:
  npx tsx e2e/screenshot.ts components-textarea--states
  npx tsx e2e/screenshot.ts components-textarea--states --update
  npx tsx e2e/screenshot.ts components-button--solid --theme dark
`);
    process.exit(0);
  }

  const storyId = args[0];
  const update = args.includes("--update");
  const theme = args[args.indexOf("--theme") + 1] || undefined;
  const density = args[args.indexOf("--density") + 1] || undefined;
  const width = args.includes("--width") ? parseInt(args[args.indexOf("--width") + 1]) : undefined;
  const height = args.includes("--height")
    ? parseInt(args[args.indexOf("--height") + 1])
    : undefined;
  const waitMs = args.includes("--wait") ? parseInt(args[args.indexOf("--wait") + 1]) : undefined;

  console.log(`📸 Capturing: ${storyId}${update ? " (updating baseline)" : ""}`);

  const result = await screenshotStory({ storyId, update, theme, density, width, height, waitMs });

  if (result.isNew) {
    console.log(`✅ New baseline saved: ${result.baselinePath}`);
  } else if (result.passed) {
    console.log(
      `✅ Passed — ${result.mismatchPercentage.toFixed(2)}% mismatch (${result.mismatchedPixels} pixels)`,
    );
  } else {
    console.log(
      `❌ FAILED — ${result.mismatchPercentage.toFixed(2)}% mismatch (${result.mismatchedPixels}/${result.totalPixels} pixels)`,
    );
    console.log(`   Baseline: ${result.baselinePath}`);
    console.log(`   Actual:   ${result.actualPath}`);
    console.log(`   Diff:     ${result.diffPath}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Screenshot tool error:", err.message);
  process.exit(1);
});
