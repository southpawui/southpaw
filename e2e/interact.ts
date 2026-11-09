/**
 * Interactive E2E tool — navigate, hover, click, type, and screenshot.
 *
 * Designed to be called programmatically by an agent, not as a CLI.
 * Each action returns a description of what happened + optional screenshot path.
 *
 * Usage (from another script or inline):
 *   import { InteractiveSession } from './interact';
 *   const session = await InteractiveSession.create();
 *   await session.goto('components-textarea--states');
 *   await session.screenshot('initial');
 *   await session.hover('[data-slot="textarea"]');
 *   await session.screenshot('hovered');
 *   await session.click('[data-slot="textarea"]');
 *   await session.type('Hello world');
 *   await session.screenshot('typed');
 *   await session.close();
 *
 * CLI usage:
 *   pnpm interact <story-id> <action> [args...]
 *
 * Actions:
 *   goto <story-id>              Navigate to a story
 *   screenshot <name>            Take a screenshot (saved to e2e/__screenshots__/<name>.png)
 *   hover <selector>             Hover over an element
 *   click <selector>             Click an element
 *   type <text>                  Type text into the focused element
 *   focus <selector>             Focus an element (shows focus ring)
 *   blur                         Blur the currently focused element
 *   tab                          Press Tab key
 *   press <key>                  Press a key (Enter, Escape, ArrowDown, etc.)
 *   wait <ms>                    Wait for specified milliseconds
 *   evaluate <js>                Run JS in the page and print result
 *   list                         List all interactive elements on the page
 *   state                        Print current page state (URL, focused element, viewport)
 *
 * For multi-step sessions, use the script API (above) or chain CLI calls
 * by passing --keep-open to prevent browser close.
 */

import { chromium, type Browser, type BrowserContext, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const STORYBOOK_URL = process.env.STORYBOOK_URL ?? "http://localhost:6006";
const SCREENSHOTS_DIR = path.join(import.meta.dirname, "__screenshots__");

export class InteractiveSession {
  private browser: Browser;
  private context: BrowserContext;
  private page: Page;
  private stepCount = 0;

  private constructor(browser: Browser, context: BrowserContext, page: Page) {
    this.browser = browser;
    this.context = context;
    this.page = page;
  }

  static async create(viewport = { width: 1280, height: 900 }): Promise<InteractiveSession> {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    return new InteractiveSession(browser, context, page);
  }

  async goto(storyId: string): Promise<string> {
    const url = `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`;
    await this.page.goto(url, { waitUntil: "networkidle" });
    await this.page.waitForTimeout(500);
    return `Navigated to ${storyId}`;
  }

  async screenshot(name?: string): Promise<string> {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    this.stepCount++;
    const filename = name ?? `step-${String(this.stepCount).padStart(3, "0")}`;
    const filepath = path.join(SCREENSHOTS_DIR, `${filename}.png`);
    const root = this.page.locator("#storybook-root");
    const hasRoot = (await root.count()) > 0;
    if (hasRoot) {
      await root.screenshot({ path: filepath, type: "png" });
    } else {
      await this.page.screenshot({ path: filepath, type: "png" });
    }
    return filepath;
  }

  async hover(selector: string): Promise<string> {
    const el = this.page.locator(selector).first();
    await el.hover();
    const tag = await el.evaluate((e) => `<${e.tagName.toLowerCase()}>`);
    return `Hovered ${tag} matching "${selector}"`;
  }

  async click(selector: string): Promise<string> {
    const el = this.page.locator(selector).first();
    await el.click();
    const tag = await el.evaluate((e) => `<${e.tagName.toLowerCase()}>`);
    return `Clicked ${tag} matching "${selector}"`;
  }

  async type(text: string): Promise<string> {
    await this.page.keyboard.type(text, { delay: 50 });
    return `Typed "${text}"`;
  }

  async focus(selector: string): Promise<string> {
    const el = this.page.locator(selector).first();
    await el.focus();
    return `Focused "${selector}"`;
  }

  async blur(): Promise<string> {
    await this.page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    return "Blurred active element";
  }

  async tab(): Promise<string> {
    await this.page.keyboard.press("Tab");
    const focused = await this.page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return "nothing";
      const tag = el.tagName.toLowerCase();
      const slot = el.getAttribute("data-slot") ?? "";
      const label = el.getAttribute("aria-label") ?? el.textContent?.slice(0, 30) ?? "";
      return `${tag}${slot ? `[data-slot="${slot}"]` : ""} "${label}"`;
    });
    return `Tabbed → focused: ${focused}`;
  }

  async press(key: string): Promise<string> {
    await this.page.keyboard.press(key);
    return `Pressed "${key}"`;
  }

  async wait(ms: number): Promise<string> {
    await this.page.waitForTimeout(ms);
    return `Waited ${ms}ms`;
  }

  async evaluate(js: string): Promise<string> {
    const result = await this.page.evaluate(js);
    return JSON.stringify(result, null, 2);
  }

  async list(): Promise<string> {
    const elements = await this.page.evaluate(() => {
      const interactable = document.querySelectorAll(
        "button, input, textarea, select, a, [role='button'], [role='tab'], [role='checkbox'], [role='radio'], [role='switch'], [tabindex]",
      );
      return Array.from(interactable).map((el) => {
        const tag = el.tagName.toLowerCase();
        const slot = el.getAttribute("data-slot") ?? "";
        const role = el.getAttribute("role") ?? "";
        const label =
          el.getAttribute("aria-label") ??
          el.getAttribute("placeholder") ??
          el.textContent?.trim().slice(0, 40) ??
          "";
        const disabled = el.hasAttribute("disabled") ? " [disabled]" : "";
        return `${tag}${slot ? `[${slot}]` : ""}${role ? `(role=${role})` : ""} "${label}"${disabled}`;
      });
    });
    return elements.length > 0 ? elements.join("\n") : "No interactive elements found";
  }

  async state(): Promise<string> {
    const info = await this.page.evaluate(() => {
      const active = document.activeElement;
      return {
        url: window.location.href,
        title: document.title,
        focused: active
          ? `${active.tagName.toLowerCase()}${active.getAttribute("data-slot") ? `[${active.getAttribute("data-slot")}]` : ""}`
          : "none",
        viewport: { width: window.innerWidth, height: window.innerHeight },
      };
    });
    return JSON.stringify(info, null, 2);
  }

  async close(): Promise<void> {
    await this.browser.close();
  }
}

/* ---- CLI ---- */

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    console.log(`
Usage: pnpm interact <story-id> <actions...>

Actions are space-separated pairs:
  goto:<story-id>       Navigate to a story
  screenshot:<name>     Take a screenshot
  hover:<selector>      Hover an element
  click:<selector>      Click an element
  type:<text>           Type text
  focus:<selector>      Focus an element
  blur                  Blur focused element
  tab                   Press Tab
  press:<key>           Press a key
  wait:<ms>             Wait
  list                  List interactive elements
  state                 Print page state

Example:
  pnpm interact goto:components-textarea--states screenshot:initial hover:[data-slot=textarea] screenshot:hovered
`);
    process.exit(0);
  }

  const session = await InteractiveSession.create();

  for (const arg of args) {
    const [action, ...rest] = arg.split(":");
    const value = rest.join(":"); // rejoin in case value contains colons

    let result: string;

    switch (action) {
      case "goto":
        result = await session.goto(value);
        break;
      case "screenshot":
        result = await session.screenshot(value || undefined);
        break;
      case "hover":
        result = await session.hover(value);
        break;
      case "click":
        result = await session.click(value);
        break;
      case "type":
        result = await session.type(value);
        break;
      case "focus":
        result = await session.focus(value);
        break;
      case "blur":
        result = await session.blur();
        break;
      case "tab":
        result = await session.tab();
        break;
      case "press":
        result = await session.press(value);
        break;
      case "wait":
        result = await session.wait(parseInt(value));
        break;
      case "evaluate":
        result = await session.evaluate(value);
        break;
      case "list":
        result = await session.list();
        break;
      case "state":
        result = await session.state();
        break;
      default:
        result = `Unknown action: ${action}`;
    }

    console.log(`→ ${result}`);
  }

  await session.close();
}

main().catch((err) => {
  console.error("Interact error:", err.message);
  process.exit(1);
});
