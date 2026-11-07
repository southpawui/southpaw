import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("Button stories have no a11y violations", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--solid&viewMode=story");
    await page.waitForSelector("[data-slot='button']");

    const results = await new AxeBuilder({ page })
      .disableRules(["landmark-one-main", "page-has-heading-one", "region"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
