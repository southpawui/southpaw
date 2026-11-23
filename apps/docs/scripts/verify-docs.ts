/**
 * Docs site verification: axe (violations + incompletes), duplicate IDs,
 * accessible names, keyboard checks and screenshots for every docs page in
 * light, dark and high-contrast at desktop and phone width.
 *
 *   pnpm --filter @southpawui/docs verify            (dev server on :3001)
 *   DOCS_URL=http://localhost:3001 node --experimental-strip-types scripts/verify-docs.ts
 *
 * Screenshots go to apps/docs/.verify/ (gitignored). Exit code 1 on any failure.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { AxeBuilder } from "@axe-core/playwright";
import { chromium, type Page } from "@playwright/test";

const BASE = process.env.DOCS_URL ?? "http://localhost:3001";
const OUT = path.join(import.meta.dirname, "../.verify");
const PAGES = ["/docs", "/docs/installation", "/docs/components/dialog"];
const THEMES = ["light", "dark", "high-contrast"] as const;
const VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  phone: { width: 375, height: 812 },
  small: { width: 320, height: 700 },
} as const;
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

type Result = { check: string; ok: boolean; detail?: string };
const results: Result[] = [];
const record = (check: string, ok: boolean, detail?: string) => {
  results.push({ check, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${check}${detail ? `\n      ${detail}` : ""}`);
};

const slug = (p: string) => p.replace(/^\/|\/$/g, "").replace(/\//g, "_") || "home";

async function axe(page: Page, label: string) {
  const r = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  const v = r.violations.map((x) => `${x.id} (${x.nodes.length}): ${x.nodes[0]?.target.join(" ")}`);
  record(`axe violations · ${label}`, v.length === 0, v.join("\n      "));
  // Incompletes are reported for review, not failed: axe can't decide them (e.g. text over gradients).
  const inc = r.incomplete.map(
    (x) =>
      `${x.id} (${x.nodes.length}): ${x.nodes
        .map((n) => n.target.join(" "))
        .slice(0, 3)
        .join(" | ")}`,
  );
  if (inc.length) console.log(`INFO  axe incomplete · ${label}\n      ${inc.join("\n      ")}`);
  for (const x of r.incomplete)
    for (const n of x.nodes.slice(0, 2))
      console.log(
        `WHY   ${x.id} · ${n.html.slice(0, 70)} :: ${(n.any[0] ?? n.all[0] ?? n.none[0])?.message.slice(0, 140)}`,
      );
}

async function domChecks(page: Page, label: string) {
  const { dupes, unnamed } = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((e) => e.id).filter(Boolean);
    const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    const interactive = document.querySelectorAll(
      'a[href], button, input, select, textarea, [role="button"], [role="tab"], [role="combobox"], [role="switch"], [role="checkbox"], [tabindex]:not([tabindex="-1"])',
    );
    const unnamed: string[] = [];
    for (const el of interactive) {
      const h = el as HTMLElement;
      if (h.closest("[hidden],[inert],[aria-hidden=true]") || h.offsetParent === null) continue;
      const name =
        h.getAttribute("aria-label") ||
        (h.getAttribute("aria-labelledby") &&
          h
            .getAttribute("aria-labelledby")!
            .split(" ")
            .map((id) => document.getElementById(id)?.textContent ?? "")
            .join(" ")) ||
        h.textContent ||
        h.getAttribute("title") ||
        (h as HTMLInputElement).labels?.[0]?.textContent;
      if (!name?.trim()) unnamed.push(h.outerHTML.slice(0, 120));
    }
    return { dupes, unnamed };
  });
  record(`duplicate ids · ${label}`, dupes.length === 0, dupes.join(", "));
  record(`accessible names · ${label}`, unnamed.length === 0, unnamed.join("\n      "));
}

/** No horizontal page scroll, and no code running under a floating copy button. */
async function layoutChecks(page: Page, label: string) {
  const { scrollW, clientW } = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  record(
    `no horizontal page scroll · ${label}`,
    scrollW <= clientW,
    `scrollWidth ${scrollW} > clientWidth ${clientW}`,
  );
  const overlaps = await page.evaluate(() => {
    const bad: string[] = [];
    for (const fig of document.querySelectorAll("figure.shiki")) {
      const button = fig.querySelector(":scope > div[class*='absolute'] button");
      const viewport = fig.querySelector(":scope > .fd-scroll-container");
      if (!button || !viewport || (fig as HTMLElement).offsetParent === null) continue;
      const b = button.getBoundingClientRect();
      const v = viewport.getBoundingClientRect();
      if (b.width && v.right > b.left + 1 && v.top < b.bottom && v.bottom > b.top)
        bad.push((fig.textContent ?? "").slice(0, 40));
    }
    return bad;
  });
  record(`copy buttons don't cover code · ${label}`, overlaps.length === 0, overlaps.join(" | "));
}

async function open(page: Page, url: string, theme: string) {
  await page.addInitScript((t) => localStorage.setItem("sp-theme", t), theme);
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
    for (const theme of THEMES) {
      for (const url of PAGES) {
        const ctx = await browser.newContext({ viewport, reducedMotion: "reduce" });
        const page = await ctx.newPage();
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
        await open(page, url, theme);
        const label = `${url} · ${theme} · ${vpName}`;
        const applied = await page.evaluate(() => document.documentElement.dataset.theme);
        record(`theme applied · ${label}`, applied === theme, `data-theme=${applied}`);
        await axe(page, label);
        await domChecks(page, label);
        await layoutChecks(page, label);
        if (url === "/docs/components/dialog") {
          // Inactive tab panels aren't rendered: check the southpawui tab's commands too.
          await page.getByRole("tab", { name: "southpawui" }).first().click();
          await layoutChecks(page, `${label} · southpawui tab`);
          await page.getByRole("tab", { name: "Manual" }).first().click();
        }
        await page.screenshot({
          path: path.join(OUT, `${slug(url)}--${theme}--${vpName}.png`),
          fullPage: true,
        });

        if (url === "/docs/components/dialog") {
          await page.getByRole("button", { name: "Edit profile" }).first().click();
          await page.getByRole("dialog").waitFor();
          await axe(page, `${label} · dialog open`);
          await page.screenshot({
            path: path.join(OUT, `${slug(url)}--${theme}--${vpName}--open.png`),
          });
          await page.keyboard.press("Escape");
        }
        record(
          `no console errors · ${label}`,
          errors.length === 0,
          errors.slice(0, 3).join("\n      "),
        );
        await ctx.close();
      }
    }
  }

  // Keyboard: Tab order reaches the main content, demo opens with Enter, Escape returns focus.
  {
    const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop });
    const page = await ctx.newPage();
    await open(page, "/docs/components/dialog", "light");
    const order: string[] = [];
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      order.push(
        await page.evaluate(() => {
          const a = document.activeElement as HTMLElement | null;
          return a
            ? `${a.tagName.toLowerCase()}:${(a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 30)}`
            : "none";
        }),
      );
    }
    console.log(`INFO  tab order (first 14): ${order.join(" → ")}`);
    const visibleRing = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement;
      const s = getComputedStyle(a);
      return s.outlineStyle !== "none" || s.boxShadow !== "none";
    });
    record("keyboard · focused element shows a focus indicator", visibleRing);

    const trigger = page.getByRole("button", { name: "Edit profile" }).first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("dialog").waitFor();
    // Base UI moves focus in after the popup mounts; allow it a moment.
    const inside = await page
      .waitForFunction(() => !!document.activeElement?.closest('[role="dialog"]'), null, {
        timeout: 2000,
      })
      .then(() => true)
      .catch(() => false);
    record("keyboard · Enter opens the demo dialog and focus moves inside", inside);
    // Human-speed presses: Base UI moves focus off its focus guard asynchronously.
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(150);
    }
    const stillInside = await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"]'),
    );
    record("keyboard · Tab stays trapped inside the dialog", stillInside);
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "detached" });
    const returned = await trigger.evaluate((el) => el === document.activeElement);
    record("keyboard · Escape closes and returns focus to the trigger", returned);

    // Tabs: arrow keys move focus between Preview and Code (manual activation), Enter selects.
    const previewTab = page.getByRole("tab", { name: "Preview" }).first();
    const codeTab = page.getByRole("tab", { name: "Code" }).first();
    await previewTab.focus();
    await page.keyboard.press("ArrowRight");
    record(
      "keyboard · ArrowRight moves focus Preview → Code",
      await codeTab.evaluate((el) => el === document.activeElement),
    );
    await page.keyboard.press("Enter");
    record(
      "keyboard · Enter selects the Code tab",
      (await codeTab.getAttribute("aria-selected")) === "true",
    );
    await page.screenshot({ path: path.join(OUT, "dialog--code-tab.png") });

    // Search: the hotkey opens the static Orama search, which finds page content.
    await page.locator("body").press(process.platform === "darwin" ? "Meta+k" : "Control+k");
    let opened = await page
      .locator("#fd-search-dialog-content")
      .isVisible()
      .catch(() => false);
    record("search · keyboard shortcut opens search", opened);
    if (!opened)
      await page
        .getByRole("button", { name: /search/i })
        .first()
        .click();
    const input = page.locator("#fd-search-dialog-content").getByRole("combobox");
    await input.waitFor();
    await input.fill("focus trap");
    // The static index downloads on first open; give it time on a cold server.
    await page
      .locator("#fd-search-dialog-content")
      .getByRole("option")
      .first()
      .waitFor({ timeout: 15000 })
      .catch(() => {});
    const hits = await page.locator("#fd-search-dialog-content").getByRole("option").count();
    record("search · 'focus trap' returns results", hits > 0, `${hits} results`);
    opened = true;
    await axe(page, "search dialog open");
    await page.screenshot({ path: path.join(OUT, "search--open.png") });
    await page.keyboard.press("Escape");

    // Theme + density controls are Southpaw Selects and switch the attributes.
    await page.getByRole("combobox", { name: "Theme" }).filter({ visible: true }).first().click();
    await page.getByRole("option", { name: "Dark" }).click();
    record(
      "controls · Theme select switches data-theme",
      (await page.evaluate(() => document.documentElement.dataset.theme)) === "dark",
    );
    await page.getByRole("combobox", { name: "Density" }).filter({ visible: true }).first().click();
    await page.getByRole("option", { name: "Compact" }).click();
    record(
      "controls · Density select switches data-density",
      (await page.evaluate(() => document.documentElement.dataset.density)) === "compact",
    );
    // A fresh page (no init script seeding the theme) reads the stored choices.
    const fresh = await ctx.newPage();
    await fresh.goto(BASE + "/docs/components/dialog", { waitUntil: "networkidle" });
    const persisted = await fresh.evaluate(() =>
      [document.documentElement.dataset.theme, document.documentElement.dataset.density].join("/"),
    );
    record("controls · choices persist across reload", persisted === "dark/compact", persisted);
    await fresh.screenshot({ path: path.join(OUT, "dialog--dark-compact.png"), fullPage: true });
    await ctx.close();
  }

  // Machine-readable output (BRIEF §8).
  for (const [url, expect] of [
    ["/llms.txt", "Dialog"],
    ["/llms-full.txt", "When to use"],
    ["/docs/components/dialog.md", "# Dialog"],
    ["/r/dialog.json", '"name": "dialog"'],
    ["/api/search", "dialog"],
  ] as const) {
    const res = await fetch(BASE + url);
    const body = await res.text();
    record(
      `endpoint · ${url}`,
      res.ok && body.includes(expect),
      `${res.status}, ${body.length} bytes`,
    );
  }

  // Install instructions (GEO-973): southpawui is the documented installer; shadcn isn't.
  {
    const md = await (await fetch(`${BASE}/docs/components/dialog.md`)).text();
    record(
      "install · dialog.md gives the southpawui commands",
      md.includes("npx southpawui@latest init") && md.includes("npx southpawui@latest add dialog"),
    );
    const outputs = await Promise.all(
      ["/llms-full.txt", "/docs/components/dialog", "/docs/installation"].map(async (u) =>
        (await fetch(BASE + u)).text(),
      ),
    );
    record(
      "install · no page or llms output tells people to run shadcn@latest",
      outputs.every((t) => !t.includes("shadcn@latest")),
    );
  }

  await browser.close();
  await writeFile(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));
  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n${results.length - failed.length}/${results.length} checks passed. Screenshots: ${OUT}`,
  );
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
