/**
 * DOM inspection tool — dumps the rendered markup of a Storybook story.
 *
 * Usage (from repo root):
 *   pnpm dom <story-id>
 *
 * Examples:
 *   pnpm dom components-checkbox--default
 *   pnpm dom components-select--clearable
 *
 * Output:
 *   - Pretty-printed HTML with indentation
 *   - Flags redundant wrapper divs (div > div with no extra attrs/classes)
 *   - Shows data-slot tree structure
 */

import { chromium } from "@playwright/test";

const STORYBOOK_URL =
  process.env.STORYBOOK_URL ?? `http://localhost:${process.env.STORYBOOK_PORT ?? "6006"}`;

const storyId = process.argv[2];
if (!storyId) {
  console.error("Usage: pnpm dom <story-id>");
  process.exit(1);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const url = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
  await page.goto(url);
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    const root = document.querySelector("#storybook-root");
    if (!root) return { html: "", tree: "", warnings: [] };

    // Pretty-print HTML
    function prettyPrint(el: Element, indent: number): string {
      const pad = "  ".repeat(indent);
      const tag = el.tagName.toLowerCase();

      // Build attribute string — skip class (too noisy), show key attrs
      const keyAttrs = [
        "data-slot",
        "role",
        "aria-checked",
        "aria-invalid",
        "aria-labelledby",
        "aria-describedby",
        "aria-expanded",
        "aria-hidden",
        "data-orientation",
        "data-checked",
        "data-unchecked",
        "data-indeterminate",
        "data-disabled",
        "data-invalid",
        "data-filled",
        "data-placeholder",
        "id",
        "for",
        "type",
        "tabindex",
        "disabled",
        "readonly",
      ];
      const attrs = keyAttrs
        .filter((a) => el.hasAttribute(a))
        .map((a) => {
          const v = el.getAttribute(a);
          return v === "" ? a : `${a}="${v}"`;
        })
        .join(" ");

      // Check if element has meaningful classes (non-utility)
      const hasClasses =
        el.className && typeof el.className === "string" && el.className.length > 0;
      const classNote = hasClasses ? " [has classes]" : "";

      // Self-closing tags
      const selfClosing = ["input", "img", "br", "hr", "source"].includes(tag);
      const attrStr = attrs ? ` ${attrs}` : "";

      if (selfClosing) {
        return `${pad}<${tag}${attrStr}${classNote} />`;
      }

      // Text-only nodes
      const children = Array.from(el.children);
      if (children.length === 0) {
        const text = el.textContent?.trim() ?? "";
        const displayText = text.length > 60 ? text.substring(0, 57) + "..." : text;
        if (text) {
          return `${pad}<${tag}${attrStr}${classNote}>${displayText}</${tag}>`;
        }
        return `${pad}<${tag}${attrStr}${classNote} />`;
      }

      // Recursive children
      const childrenStr = children.map((c) => prettyPrint(c, indent + 1)).join("\n");
      return `${pad}<${tag}${attrStr}${classNote}>\n${childrenStr}\n${pad}</${tag}>`;
    }

    // Detect redundant wrappers: div > single div child with no meaningful difference
    function findRedundantWrappers(el: Element, path: string): string[] {
      const warnings: string[] = [];
      const children = Array.from(el.children);

      if (el.tagName === "DIV" && children.length === 1 && children[0].tagName === "DIV") {
        const parent = el;
        const child = children[0];
        const parentSlot = parent.getAttribute("data-slot");
        const childSlot = child.getAttribute("data-slot");
        const parentRole = parent.getAttribute("role");
        const childRole = child.getAttribute("role");

        // If neither has a data-slot or role, it's likely redundant
        if (!parentSlot && !childSlot && !parentRole && !childRole) {
          warnings.push(
            `${path}: <div> wraps a single <div> — both lack data-slot/role. Possibly redundant.`,
          );
        }
      }

      children.forEach((child, i) => {
        findRedundantWrappers(
          child,
          `${path} > ${child.tagName.toLowerCase()}${child.getAttribute("data-slot") ? `[${child.getAttribute("data-slot")}]` : ""}:nth(${i})`,
        );
      });

      return warnings;
    }

    // Build data-slot tree
    function slotTree(el: Element, indent: number): string {
      const lines: string[] = [];
      const slot = el.getAttribute("data-slot");
      const role = el.getAttribute("role");
      const tag = el.tagName.toLowerCase();

      if (slot || role) {
        const pad = "  ".repeat(indent);
        const label = slot ? `[${slot}]` : `{${role}}`;
        lines.push(`${pad}${tag} ${label}`);
      }

      Array.from(el.children).forEach((child) => {
        lines.push(
          ...slotTree(child, slot || role ? indent + 1 : indent)
            .split("\n")
            .filter(Boolean),
        );
      });

      return lines.join("\n");
    }

    const storyRoot = root.firstElementChild;
    if (!storyRoot) return { html: "", tree: "", warnings: [] };

    return {
      html: prettyPrint(storyRoot, 0),
      tree: slotTree(storyRoot, 0),
      warnings: findRedundantWrappers(storyRoot, "root"),
    };
  });

  console.log("📄 DOM Structure:\n");
  console.log(result.html);
  console.log("\n🏷️  Slot/Role Tree:\n");
  console.log(result.tree || "(no data-slot or role attributes found)");

  if (result.warnings.length > 0) {
    console.log("\n⚠️  Potential Redundant Wrappers:\n");
    result.warnings.forEach((w) => console.log(`  ${w}`));
  } else {
    console.log("\n✅ No redundant wrapper divs detected.");
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
