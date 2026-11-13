import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Kbd, parseKeys, resolveKey } from "./Kbd";

describe("Kbd", () => {
  it("renders a <kbd> with data-slot and defaults", () => {
    render(<Kbd>Esc</Kbd>);
    const el = screen.getByText("Esc");
    expect(el.tagName).toBe("KBD");
    expect(el).toHaveAttribute("data-slot", "kbd");
    expect(el).toHaveAttribute("data-variant", "outline");
    expect(el).toHaveAttribute("data-size", "md");
  });

  it("applies variant and size", () => {
    render(
      <Kbd variant="subtle" size="lg">
        K
      </Kbd>,
    );
    const el = screen.getByText("K");
    expect(el).toHaveAttribute("data-variant", "subtle");
    expect(el).toHaveAttribute("data-size", "lg");
  });

  it("merges className and forwards props and ref", () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <Kbd ref={ref} className="custom" title="Escape">
        Esc
      </Kbd>,
    );
    const el = screen.getByText("Esc");
    expect(el.className).toContain("custom");
    expect(el).toHaveAttribute("title", "Escape");
    expect(ref.current).toBe(el);
  });

  it("supports the render prop", () => {
    render(<Kbd render={<span />}>K</Kbd>);
    expect(screen.getByText("K").tagName).toBe("SPAN");
  });

  it("is not interactive", () => {
    render(<Kbd>K</Kbd>);
    expect(screen.getByText("K").className).toContain("pointer-events-none");
  });
});

describe("Kbd keys (platform-aware)", () => {
  it("renders Mod as ⌘ on Apple with spoken name", () => {
    const { container } = render(<Kbd keys="Mod+K" platform="apple" />);
    const cap = container.querySelector('[data-slot="kbd"]')!;
    expect(cap.tagName).toBe("KBD");
    expect(cap).toHaveAttribute("dir", "ltr");
    const visible = [...cap.querySelectorAll('[aria-hidden="true"]')].map((n) => n.textContent);
    expect(visible).toEqual(["⌘K"]);
    const spoken = [...cap.querySelectorAll(".sr-only")].map((n) => n.textContent);
    expect(spoken).toEqual(["command k"]);
  });

  it("renders Mod as Ctrl on Windows", () => {
    const { container } = render(<Kbd keys="Mod+Shift+P" platform="windows" />);
    const visible = [...container.querySelectorAll('[aria-hidden="true"]')].map(
      (n) => n.textContent,
    );
    expect(visible).toEqual(["Ctrl+Shift+P"]);
  });

  it("has one glyph span and one spoken span per cap", () => {
    const { container } = render(<Kbd keys="Mod+Shift+P" platform="apple" />);
    const cap = container.querySelector('[data-slot="kbd"]')!;
    expect(cap.querySelectorAll('[data-slot="kbd-glyph"]')).toHaveLength(1);
    expect(cap.querySelector('[data-slot="kbd-spoken"]')!.textContent).toBe("command shift p");
  });

  it("condensed chord is one cap; no group wrapper", () => {
    const { container } = render(<Kbd keys="Mod+Shift+P" platform="apple" />);
    expect(container.querySelectorAll('[data-slot="kbd"]')).toHaveLength(1);
    expect(container.querySelector('[data-slot="kbd-group"]')).toBeNull();
  });

  it("full format renders one cap per key with aria-hidden + separators", () => {
    const { container } = render(<Kbd keys="Mod+Shift+P" platform="other" format="full" />);
    const group = container.querySelector('[data-slot="kbd-group"]')!;
    expect(group.tagName).toBe("KBD");
    expect(group).toHaveAttribute("dir", "ltr");
    const caps = group.querySelectorAll('[data-slot="kbd"]');
    expect(caps).toHaveLength(3);
    expect(caps[0]!.textContent).toContain("Control");
    const seps = group.querySelectorAll('[data-slot="kbd-separator"]');
    expect(seps).toHaveLength(2);
    seps.forEach((s) => expect(s).toHaveAttribute("aria-hidden", "true"));
  });

  it("sequence renders a cap per step with hidden 'then'", () => {
    const { container } = render(<Kbd keys="g i" platform="apple" />);
    const caps = container.querySelectorAll('[data-slot="kbd"]');
    expect(caps).toHaveLength(2);
    const group = container.querySelector('[data-slot="kbd-group"]')!;
    const then = [...group.children].find((c) => c.textContent === "then")!;
    expect(then.className).toContain("sr-only");
  });

  it("full-format sequence shows visible 'then'", () => {
    const { container } = render(<Kbd keys="g i" format="full" platform="apple" />);
    const then = [...container.querySelectorAll('[data-slot="kbd-separator"]')].find(
      (c) => c.textContent === "then",
    )!;
    expect(then).not.toHaveAttribute("aria-hidden");
  });

  it("defaults to 'other' platform outside a browser-detected Apple device", () => {
    // jsdom's navigator.platform is empty → "other"
    const { container } = render(<Kbd keys="Mod+K" />);
    const visible = [...container.querySelectorAll('[aria-hidden="true"]')].map(
      (n) => n.textContent,
    );
    expect(visible).toEqual(["Ctrl+K"]);
  });
});

describe("Kbd.Group", () => {
  it("renders an outer <kbd> wrapping keys, ltr", () => {
    render(
      <Kbd.Group data-testid="group">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Kbd.Group>,
    );
    const group = screen.getByTestId("group");
    expect(group.tagName).toBe("KBD");
    expect(group).toHaveAttribute("data-slot", "kbd-group");
    expect(group).toHaveAttribute("dir", "ltr");
  });

  it("passes variant and size to keys via context", () => {
    render(
      <Kbd.Group variant="outline" size="sm">
        <Kbd>Ctrl</Kbd>
        <Kbd size="lg">B</Kbd>
      </Kbd.Group>,
    );
    expect(screen.getByText("Ctrl")).toHaveAttribute("data-variant", "outline");
    expect(screen.getByText("Ctrl")).toHaveAttribute("data-size", "sm");
    // Key-level prop wins
    expect(screen.getByText("B")).toHaveAttribute("data-size", "lg");
  });

  it("draws aria-hidden separators between keys", () => {
    const { container } = render(
      <Kbd.Group separator="+">
        <Kbd>Ctrl</Kbd>
        <Kbd>Alt</Kbd>
        <Kbd>Del</Kbd>
      </Kbd.Group>,
    );
    const seps = container.querySelectorAll('[data-slot="kbd-separator"]');
    expect(seps).toHaveLength(2);
    seps.forEach((s) => expect(s).toHaveAttribute("aria-hidden", "true"));
  });
});

describe("parseKeys / resolveKey", () => {
  it("splits chords and sequences", () => {
    expect(parseKeys("Mod+Shift+P")).toEqual([["Mod", "Shift", "P"]]);
    expect(parseKeys("g i")).toEqual([["g"], ["i"]]);
    expect(parseKeys("Mod+K  Mod+S")).toEqual([
      ["Mod", "K"],
      ["Mod", "S"],
    ]);
  });

  it("handles a literal plus key", () => {
    expect(parseKeys("Mod++")).toEqual([["Mod", "+"]]);
    expect(parseKeys("+")).toEqual([["+"]]);
  });

  it("resolves aliases and spoken names", () => {
    expect(resolveKey("cmd", "apple", "condensed")).toEqual({ label: "⌘", spoken: "command" });
    expect(resolveKey("Option", "apple", "full")).toEqual({ label: "Option", spoken: "option" });
    expect(resolveKey("ArrowUp", "other", "condensed")).toEqual({ label: "↑", spoken: "up arrow" });
    expect(resolveKey("Meta", "windows", "condensed")).toEqual({ label: "Win", spoken: "windows" });
    expect(resolveKey("f12", "other", "condensed")).toEqual({ label: "F12", spoken: "f12" });
    expect(resolveKey("/", "other", "condensed")).toEqual({ label: "/", spoken: "slash" });
  });
});

/* ============================================================
 * Platform detection, SSR, edge cases (added after /improve)
 * ============================================================ */

function stubNavigator(fields: { platform?: string; userAgent?: string; uaPlatform?: string }) {
  const restore: Array<() => void> = [];
  const define = (key: string, value: unknown) => {
    const prev = Object.getOwnPropertyDescriptor(window.navigator, key);
    Object.defineProperty(window.navigator, key, { value, configurable: true });
    restore.push(() =>
      prev
        ? Object.defineProperty(window.navigator, key, prev)
        : delete (window.navigator as unknown as Record<string, unknown>)[key],
    );
  };
  define("platform", fields.platform ?? "");
  define("userAgent", fields.userAgent ?? "");
  define("userAgentData", fields.uaPlatform ? { platform: fields.uaPlatform } : undefined);
  return () => restore.reverse().forEach((r) => r());
}

const glyphOf = (container: HTMLElement) =>
  container.querySelector('[data-slot="kbd-glyph"]')!.textContent;

describe("Kbd platform detection (auto)", () => {
  it.each([
    [{ platform: "MacIntel" }, "⌘K"],
    [{ platform: "iPhone" }, "⌘K"],
    [{ uaPlatform: "macOS" }, "⌘K"],
    [{ platform: "Win32" }, "Ctrl+K"],
    [{ uaPlatform: "Windows" }, "Ctrl+K"],
    [{ platform: "Linux x86_64" }, "Ctrl+K"],
    [{ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)" }, "⌘K"],
  ])("%o → %s", (nav, expected) => {
    const restore = stubNavigator(nav);
    try {
      const { container } = render(<Kbd keys="Mod+K" />);
      expect(glyphOf(container)).toBe(expected);
    } finally {
      restore();
    }
  });

  it("labels Meta as Win on Windows", () => {
    const restore = stubNavigator({ platform: "Win32" });
    try {
      const { container } = render(<Kbd keys="Meta" />);
      expect(glyphOf(container)).toBe("Win");
    } finally {
      restore();
    }
  });

  it("explicit platform overrides detection", () => {
    const restore = stubNavigator({ platform: "MacIntel" });
    try {
      const { container } = render(<Kbd keys="Mod+K" platform="windows" />);
      expect(glyphOf(container)).toBe("Ctrl+K");
    } finally {
      restore();
    }
  });
});

describe("Kbd SSR + hydration", () => {
  it("server renders 'other', then hydrates to the detected platform without mismatch", async () => {
    const { renderToString } = await import("react-dom/server");
    const { hydrateRoot } = await import("react-dom/client");
    const { act } = await import("react");

    const html = renderToString(<Kbd keys="Mod+K" />);
    expect(html).toContain("Ctrl+K");

    const restore = stubNavigator({ platform: "MacIntel" });
    const errors: unknown[] = [];
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    try {
      let root: ReturnType<typeof hydrateRoot> | undefined;
      await act(async () => {
        root = hydrateRoot(container, <Kbd keys="Mod+K" />, {
          onRecoverableError: (e) => errors.push(e),
        });
      });
      expect(errors).toEqual([]);
      expect(glyphOf(container)).toBe("⌘K");
      await act(async () => root!.unmount());
    } finally {
      container.remove();
      restore();
    }
  });
});

describe("Kbd edge cases", () => {
  it("whitespace-only keys falls back to children", () => {
    const { container } = render(<Kbd keys="   ">Esc</Kbd>);
    expect(container.querySelector('[data-slot="kbd-group"]')).toBeNull();
    expect(screen.getByText("Esc")).toHaveAttribute("data-slot", "kbd");
  });

  it("forwards ref and render to the outer group on multi-cap output", () => {
    const ref = { current: null as HTMLElement | null };
    const { container } = render(<Kbd ref={ref} keys="g i" render={<span />} data-testid="seq" />);
    const outer = screen.getByTestId("seq");
    expect(outer.tagName).toBe("SPAN");
    expect(outer).toHaveAttribute("data-slot", "kbd-group");
    expect(ref.current).toBe(outer);
    expect(container.querySelectorAll('[data-slot="kbd"]')).toHaveLength(2);
  });

  it("full format is selectable (prose); condensed is not; spoken text is never copied", () => {
    const { container: full } = render(<Kbd keys="Mod+K" format="full" platform="other" />);
    full
      .querySelectorAll('[data-slot="kbd"]')
      .forEach((k) => expect(k.className).not.toContain("select-none"));
    full
      .querySelectorAll('[data-slot="kbd-spoken"]')
      .forEach((s) => expect(s.className).toContain("select-none"));
    const { container: condensed } = render(<Kbd keys="Mod+K" platform="other" />);
    expect(condensed.querySelector('[data-slot="kbd"]')!.className).toContain("select-none");
  });
});
