import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Page-level rules that don't apply to isolated Storybook story iframes
const DISABLED_RULES = ["landmark-one-main", "page-has-heading-one", "region"];

// Fetch the story index from Storybook and test each story
test.describe("A11y audit — all stories", () => {
  let stories: { id: string; title: string; name: string }[] = [];

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    const res = await page.goto("/index.json");
    const index = await res!.json();
    stories = Object.values(
      index.entries as Record<string, { id: string; title: string; name: string; type: string }>,
    ).filter((e: { type: string }) => e.type === "story");
    await page.close();
  });

  test("every story passes axe", async ({ page }) => {
    const failures: { story: string; violations: string[] }[] = [];

    for (const story of stories) {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
      // Wait for content to render
      await page.waitForTimeout(500);

      const results = await new AxeBuilder({ page }).disableRules(DISABLED_RULES).analyze();

      // Filter out violations on aria-hidden elements (e.g. Base UI's internal hidden inputs)
      const violations = results.violations.filter((v) => {
        v.nodes = v.nodes.filter((n) => !n.html.includes('aria-hidden="true"'));
        return v.nodes.length > 0;
      });

      if (violations.length > 0) {
        failures.push({
          story: `${story.title} / ${story.name}`,
          violations: violations.map(
            (v) => `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`,
          ),
        });
      }
    }

    if (failures.length > 0) {
      const report = failures
        .map((f) => `\n${f.story}:\n  ${f.violations.join("\n  ")}`)
        .join("\n");
      console.log(`\n=== A11Y VIOLATIONS REPORT ===${report}\n`);
    }

    expect(failures).toEqual([]);
  });
});
