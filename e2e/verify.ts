/**
 * Component verification tool — runs ALL checks in sequence.
 * This is the single source of truth for whether a component is ready.
 *
 * Usage:
 *   pnpm verify <component-name>
 *
 * Example:
 *   pnpm verify radio
 *   pnpm verify checkbox
 *
 * Runs:
 *   1. Unit tests (Vitest)
 *   2. A11y audit (axe-core on all stories)
 *   3. Duplicate ID check (all stories)
 *   4. Accessible name check (all interactive elements)
 *   5. DOM redundancy check (redundant wrapper divs)
 *   6. Screenshots of all stories (saved for user review)
 */

import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execSync } from "child_process";

const STORYBOOK_URL = process.env.STORYBOOK_URL ?? "http://127.0.0.1:6006";

const component = process.argv[2];
if (!component) {
  console.error("Usage: pnpm verify <component-name>");
  console.error("Example: pnpm verify radio");
  process.exit(1);
}

const prefix = `components-${component.toLowerCase()}`;
let failures = 0;

function fail(msg: string) {
  console.error(`  ❌ ${msg}`);
  failures++;
}

function pass(msg: string) {
  console.log(`  ✅ ${msg}`);
}

async function main() {
  console.log(`\n🔍 Verifying component: ${component}\n`);

  // Step 1: Unit tests
  console.log("━━━ Step 1: Unit Tests ━━━");
  try {
    execSync("pnpm test", { cwd: process.cwd(), stdio: "pipe" });
    pass("All unit tests pass");
  } catch {
    fail("Unit tests failed — run `pnpm test` to see errors");
  }

  // Step 2-5: Browser-based checks
  console.log("\n━━━ Step 2: Fetching stories ━━━");
  let stories: string[] = [];
  try {
    const res = await fetch(`${STORYBOOK_URL}/index.json`);
    const index = (await res.json()) as { entries: Record<string, { id: string }> };
    stories = Object.values(index.entries)
      .map((e) => e.id)
      .filter((id) => id.startsWith(prefix + "--") || id === prefix);
  } catch {
    fail(`Could not fetch stories from ${STORYBOOK_URL}. Is Storybook running?`);
    process.exit(1);
  }

  if (stories.length === 0) {
    fail(`No stories found matching "${prefix}"`);
    process.exit(1);
  }
  pass(`Found ${stories.length} stories`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Page-level rules to ignore (Storybook iframe issues, not component issues)
  const IGNORE_RULES = ["landmark-one-main", "page-has-heading-one", "region", "bypass"];

  // Step 3: A11y audit (violations + inconclusives)
  console.log("\n━━━ Step 3: A11y Audit (violations + inconclusives) ━━━");
  for (const story of stories) {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=${story}&viewMode=story`);
    await page.waitForTimeout(2000);
    try {
      const results = await new AxeBuilder({ page }).analyze();
      const violations = results.violations.filter((v) => !IGNORE_RULES.includes(v.id));
      const incomplete = results.incomplete.filter((v) => !IGNORE_RULES.includes(v.id));

      if (violations.length > 0) {
        violations.forEach((v) => fail(`${story} — [${v.impact}] ${v.id}: ${v.description}`));
      } else if (incomplete.length > 0) {
        incomplete.forEach((v) =>
          console.log(
            `  ⚠️  ${story} — [inconclusive] ${v.id}: ${v.nodes.length} node(s) need manual review`,
          ),
        );
        pass(`${story} — a11y pass (${incomplete.length} inconclusive — manual review needed)`);
      } else {
        pass(`${story} — a11y pass (${results.passes.length} passes)`);
      }
    } catch {
      fail(`${story} — a11y audit error`);
    }
  }

  // Step 4: Duplicate ID check
  console.log("\n━━━ Step 4: Duplicate ID Check ━━━");
  for (const story of stories) {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=${story}&viewMode=story`);
    await page.waitForTimeout(2000);

    const dupes = await page.evaluate(() => {
      const idMap = new Map<string, string[]>();
      document.querySelectorAll("[id]").forEach((el) => {
        const id = el.id;
        if (!idMap.has(id)) idMap.set(id, []);
        idMap
          .get(id)!
          .push(
            el.tagName + (el.getAttribute("data-slot") ? `[${el.getAttribute("data-slot")}]` : ""),
          );
      });
      const dups: Record<string, string[]> = {};
      idMap.forEach((els, id) => {
        if (els.length > 1) dups[id] = els;
      });
      return dups;
    });

    if (Object.keys(dupes).length > 0) {
      fail(`${story} — duplicate IDs: ${JSON.stringify(dupes)}`);
    } else {
      pass(`${story} — no duplicate IDs`);
    }
  }

  // Step 5: Accessible name check
  console.log("\n━━━ Step 5: Accessible Name Check ━━━");
  for (const story of stories) {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=${story}&viewMode=story`);
    await page.waitForTimeout(1500);

    const missing = await page.evaluate(() => {
      const interactiveRoles = ["checkbox", "radio", "switch", "button", "combobox", "slider"];
      const elements = document.querySelectorAll(
        interactiveRoles.map((r) => `[role="${r}"]`).join(","),
      );
      const issues: string[] = [];
      elements.forEach((el) => {
        const role = el.getAttribute("role");
        const ariaLabel = el.getAttribute("aria-label");
        const ariaLabelledby = el.getAttribute("aria-labelledby");
        const textContent = el.textContent?.trim();
        const title = el.getAttribute("title");

        // Check if element has any accessible name source
        if (!ariaLabel && !ariaLabelledby && !textContent && !title) {
          const slot = el.getAttribute("data-slot") || el.tagName.toLowerCase();
          issues.push(`${role} (${slot}) has no accessible name`);
        }

        // If aria-labelledby references an element, check it exists
        if (ariaLabelledby) {
          const referenced = document.getElementById(ariaLabelledby);
          if (!referenced) {
            issues.push(
              `${role} aria-labelledby="${ariaLabelledby}" references non-existent element`,
            );
          }
        }
      });
      return issues;
    });

    if (missing.length > 0) {
      missing.forEach((m) => fail(`${story} — ${m}`));
    } else {
      pass(`${story} — all interactive elements have accessible names`);
    }
  }

  // Step 6: DOM redundancy check
  console.log("\n━━━ Step 6: DOM Redundancy Check ━━━");
  for (const story of stories) {
    await page.goto(`${STORYBOOK_URL}/iframe.html?id=${story}&viewMode=story`);
    await page.waitForTimeout(1500);

    const warnings = await page.evaluate(() => {
      function findRedundant(el: Element, path: string): string[] {
        const w: string[] = [];
        const children = Array.from(el.children);
        if (el.tagName === "DIV" && children.length === 1 && children[0].tagName === "DIV") {
          const parentSlot = el.getAttribute("data-slot");
          const childSlot = children[0].getAttribute("data-slot");
          const parentRole = el.getAttribute("role");
          const childRole = children[0].getAttribute("role");
          if (!parentSlot && !childSlot && !parentRole && !childRole) {
            w.push(`${path}: <div> wraps single <div> with no semantic purpose`);
          }
        }
        children.forEach((child) => {
          w.push(
            ...findRedundant(
              child,
              `${path}>${child.tagName.toLowerCase()}${child.getAttribute("data-slot") ? `[${child.getAttribute("data-slot")}]` : ""}`,
            ),
          );
        });
        return w;
      }
      const root = document.querySelector("#storybook-root > *");
      return root ? findRedundant(root, "root") : [];
    });

    if (warnings.length > 0) {
      warnings.forEach((w) => fail(`${story} — ${w}`));
    } else {
      pass(`${story} — no redundant wrappers`);
    }
  }

  // Step 7: Screenshots
  console.log("\n━━━ Step 7: Screenshots ━━━");
  for (const story of stories) {
    try {
      execSync(`pnpm screenshot ${story} --update`, { cwd: process.cwd(), stdio: "pipe" });
      pass(`${story} — screenshot saved`);
    } catch {
      fail(`${story} — screenshot failed`);
    }
  }

  await browser.close();

  // Summary
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  if (failures > 0) {
    console.error(`\n❌ FAILED — ${failures} issue(s) found. Fix before committing.\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ ALL CHECKS PASSED — ${component} is ready for review.\n`);
    console.log(
      `Screenshots saved in e2e/__screenshots__/ — ask user to review before committing.\n`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
