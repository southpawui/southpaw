/**
 * Accessibility audit tool — runs axe-core on Storybook stories.
 *
 * Usage (from repo root):
 *   pnpm a11y <story-id>              Run on a single story
 *   pnpm a11y <component-name>        Run on all stories for a component
 *   pnpm a11y --all                   Run on every story
 *
 * Examples:
 *   pnpm a11y components-textarea--states
 *   pnpm a11y textarea                (matches all Textarea stories)
 *   pnpm a11y input
 *   pnpm a11y --all
 *
 * Requires Storybook running on localhost:6006 (or set STORYBOOK_URL).
 */

import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const STORYBOOK_URL = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";

// Page-level rules that don't apply to isolated story iframes
const DISABLED_RULES = ["landmark-one-main", "page-has-heading-one", "region"];

interface Violation {
  id: string;
  impact: string;
  help: string;
  helpUrl: string;
  nodes: { html: string; failureSummary: string }[];
}

interface StoryResult {
  storyId: string;
  title: string;
  violations: Violation[];
  passes: number;
  incomplete: number;
}

async function fetchStoryIds(filter?: string): Promise<{ id: string; title: string }[]> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const res = await page.goto(`${STORYBOOK_URL}/index.json`);
  const index = await res!.json();
  await browser.close();

  const entries = Object.values(
    index.entries as Record<string, { id: string; title: string; name: string; type: string }>,
  ).filter((e) => e.type === "story");

  if (!filter) return entries.map((e) => ({ id: e.id, title: `${e.title} / ${e.name}` }));

  // If filter looks like an exact story ID (contains --), match exactly
  if (filter.includes("--")) {
    const match = entries.find((e) => e.id === filter);
    return match ? [{ id: match.id, title: `${match.title} / ${match.name}` }] : [];
  }

  // Otherwise fuzzy match on component name
  const lower = filter.toLowerCase();
  return entries
    .filter((e) => e.id.toLowerCase().includes(lower) || e.title.toLowerCase().includes(lower))
    .map((e) => ({ id: e.id, title: `${e.title} / ${e.name}` }));
}

async function auditStories(stories: { id: string; title: string }[]): Promise<StoryResult[]> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const results: StoryResult[] = [];

  for (const story of stories) {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=${story.id}&viewMode=story`);
    await page.waitForTimeout(800);

    const axeResults = await new AxeBuilder({ page }).disableRules(DISABLED_RULES).analyze();

    // Filter out violations on aria-hidden elements (Base UI internals)
    const violations = axeResults.violations
      .map((v) => ({
        ...v,
        nodes: v.nodes.filter((n) => !n.html.includes('aria-hidden="true"')),
      }))
      .filter((v) => v.nodes.length > 0);

    results.push({
      storyId: story.id,
      title: story.title,
      violations: violations.map((v) => ({
        id: v.id,
        impact: v.impact ?? "unknown",
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map((n) => ({
          html: n.html,
          failureSummary: n.failureSummary ?? "",
        })),
      })),
      passes: axeResults.passes.length,
      incomplete: axeResults.incomplete.length,
    });
  }

  await browser.close();
  return results;
}

function printResults(results: StoryResult[]): boolean {
  let allPassed = true;

  for (const r of results) {
    if (r.violations.length === 0) {
      console.log(`  ✅ ${r.title} (${r.passes} passes)`);
    } else {
      allPassed = false;
      console.log(`  ❌ ${r.title}`);
      for (const v of r.violations) {
        console.log(`     [${v.impact}] ${v.id}: ${v.help}`);
        for (const n of v.nodes) {
          console.log(`       → ${n.html.slice(0, 120)}`);
          if (n.failureSummary) {
            console.log(`         ${n.failureSummary.split("\n")[0]}`);
          }
        }
        console.log(`       Docs: ${v.helpUrl}`);
      }
    }
  }

  console.log("");
  const total = results.length;
  const failed = results.filter((r) => r.violations.length > 0).length;
  const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);

  if (allPassed) {
    console.log(`✅ All ${total} stories pass — 0 violations`);
  } else {
    console.log(`❌ ${failed}/${total} stories failed — ${totalViolations} violation(s)`);
  }

  return allPassed;
}

/* ---- CLI ---- */

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    console.log(`
Usage: pnpm a11y <story-id | component-name | --all>

Examples:
  pnpm a11y components-textarea--states    Single story
  pnpm a11y textarea                       All Textarea stories
  pnpm a11y --all                          Every story in Storybook
`);
    process.exit(0);
  }

  const isAll = args[0] === "--all";
  const filter = isAll ? undefined : args[0];

  console.log(`\n🔍 Fetching stories${filter ? ` matching "${filter}"` : ""}...\n`);

  const stories = await fetchStoryIds(filter);

  if (stories.length === 0) {
    console.log(`No stories found${filter ? ` matching "${filter}"` : ""}.`);
    process.exit(1);
  }

  console.log(`Auditing ${stories.length} story(ies):\n`);

  const results = await auditStories(stories);
  const allPassed = printResults(results);

  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error("A11y audit error:", err.message);
  process.exit(1);
});
