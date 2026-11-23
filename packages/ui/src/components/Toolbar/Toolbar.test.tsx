import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toolbar } from "./Toolbar";
import { ToggleGroup } from "../ToggleGroup/ToggleGroup";
import { computeOverflow } from "../../lib/use-overflow";
import { toAriaKeyShortcut } from "./Toolbar";

afterEach(() => vi.restoreAllMocks());

const Icon = () => <svg aria-hidden="true" />;

describe("Toolbar.Link", () => {
  it("uses the shared link focus ring", () => {
    render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Link href="/help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByRole("link", { name: "Help" });
    expect(link).toHaveAttribute("data-slot", "toolbar-link");
    expect(link).toHaveClass("focus-visible:sp-focus-ring");
    expect(link.className).not.toContain("outline-neutral-900");
    expect(link).not.toHaveAttribute("rel");
  });

  it("keeps the item radius (the ring doesn't bring Link's small radius)", () => {
    render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Link href="/help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByRole("link", { name: "Help" });
    expect(link).toHaveClass("rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]");
    expect(link).not.toHaveClass("rounded-sm");
  });

  it("keeps a function className alongside the shared classes (GEO-958)", () => {
    render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Link href="/help" className={() => "from-state"}>
          Help
        </Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByRole("link", { name: "Help" });
    expect(link).toHaveClass(
      "from-state",
      "focus-visible:sp-focus-ring",
      "rounded-[var(--sp-nested-radius,var(--radius-DEFAULT))]",
    );
  });

  it("a new-tab link gets the icon, hidden text and a merged rel", () => {
    render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Link href="https://example.com" target="_blank" rel="external">
          Docs
        </Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByRole("link", { name: /Docs\s*\(opens in new tab\)/ });
    expect(link).toHaveAttribute("rel", "external noopener noreferrer");
    expect(link.querySelector("svg[aria-hidden=true]")).not.toBeNull();
  });
});

describe("Toolbar.Root", () => {
  it("is a labelled toolbar with defaults: horizontal, bordered, md", () => {
    render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Button>Save</Toolbar.Button>
      </Toolbar.Root>,
    );
    const tb = screen.getByRole("toolbar", { name: "Formatting" });
    expect(tb).toHaveAttribute("data-variant", "bordered");
    expect(tb).toHaveAttribute("data-size", "md");
    expect(tb).toHaveClass("border", "bg-surface-raised");
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass(
      "h-[var(--sp-control-height)]",
    );
  });

  // Every item is the toolbar's size, including ToggleGroup items, whose own
  // ButtonGroupContext used to reset them to md (32x40 in sm, 48x40 in lg).
  it.each([
    ["sm", "h-[var(--sp-control-height-sm)]"],
    ["md", "h-[var(--sp-control-height)]"],
    ["lg", "h-[var(--sp-control-height-lg)]"],
  ] as const)("%s: Buttons, Toggles and ToggleGroup items share one height", (size, height) => {
    render(
      <Toolbar.Root aria-label="Sizes" size={size} overflow="none">
        <Toolbar.Button iconOnly icon={<Icon />} label="Undo" />
        <Toolbar.Button>Save</Toolbar.Button>
        <Toolbar.Toggle iconOnly icon={<Icon />} label="Bold" />
        <ToggleGroup.Root aria-label="Align" defaultValue={["l"]}>
          <Toolbar.Toggle value="l" iconOnly icon={<Icon />} label="Left" />
          <Toolbar.Toggle value="r" iconOnly icon={<Icon />} label="Right" />
        </ToggleGroup.Root>
        <ToggleGroup.Root
          aria-label="View"
          defaultValue={["a"]}
          items={[
            { value: "a", icon: <Icon />, srOnly: "Grid" },
            { value: "b", icon: <Icon />, srOnly: "List" },
          ]}
        />
      </Toolbar.Root>,
    );
    const heightTokens = /(^|\s)h-\[var\(--sp-control-height(-sm|-lg)?\)\]/g;
    for (const button of screen.getAllByRole("button")) {
      const found = [...button.className.matchAll(heightTokens)].map((m) => m[0].trim());
      expect(
        new Set(found),
        button.getAttribute("aria-labelledby") ?? button.textContent ?? "",
      ).toEqual(new Set([height]));
    }
  });

  it("vertical sets aria-orientation; flush drops the frame; condensed packs items", () => {
    render(
      <Toolbar.Root aria-label="Tools" orientation="vertical" variant="flush" gap="condensed">
        <Toolbar.Button>A</Toolbar.Button>
      </Toolbar.Root>,
    );
    const tb = screen.getByRole("toolbar");
    expect(tb).toHaveAttribute("aria-orientation", "vertical");
    expect(tb).not.toHaveClass("border");
    expect(tb).toHaveClass("gap-px", "flex-col");
  });

  it("size passes to every item", () => {
    render(
      <Toolbar.Root aria-label="Tools" size="lg">
        <Toolbar.Button iconOnly icon={<Icon />} label="Bold" />
        <Toolbar.Button>Text</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole("button", { name: "Bold" })).toHaveClass(
      "w-[var(--sp-control-height-lg)]",
    );
    expect(screen.getByRole("button", { name: "Text" })).toHaveClass(
      "h-[var(--sp-control-height-lg)]",
    );
  });

  it("sticky sets the offset variable", () => {
    render(
      <Toolbar.Root aria-label="Tools" sticky stickyOffset={64}>
        <Toolbar.Button>A</Toolbar.Button>
      </Toolbar.Root>,
    );
    const tb = screen.getByRole("toolbar");
    expect(tb).toHaveClass("sticky", "top-[var(--sp-toolbar-sticky-offset)]");
    expect(tb.style.getPropertyValue("--sp-toolbar-sticky-offset")).toBe("64px");
  });

  it("warns without a label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Toolbar.Root>
        <Toolbar.Button>A</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("aria-label"));
  });

  it("a nested Root is a labelled group in the same Tab stop", () => {
    render(
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button>Undo</Toolbar.Button>
        <Toolbar.Root aria-label="Text style">
          <Toolbar.Button>Bold</Toolbar.Button>
        </Toolbar.Root>
      </Toolbar.Root>,
    );
    expect(screen.getAllByRole("toolbar")).toHaveLength(1);
    expect(screen.getByRole("group", { name: "Text style" })).toBeInTheDocument();
  });
});

describe("keyboard", () => {
  function Bar() {
    return (
      <Toolbar.Root aria-label="Tools" overflow="none">
        <Toolbar.Button>First</Toolbar.Button>
        <Toolbar.Button disabled>Second</Toolbar.Button>
        <Toolbar.Button>Last</Toolbar.Button>
        <Toolbar.Link href="#help">Help</Toolbar.Link>
        <Toolbar.Input aria-label="Find" defaultValue="abc" />
      </Toolbar.Root>
    );
  }

  it("one Tab stop; arrows move, and disabled items stay focusable", async () => {
    render(<Bar />);
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    await userEvent.tab();
    expect(document.body).toHaveFocus();
  });

  it("Home and End jump to the first and last item", async () => {
    render(<Bar />);
    await userEvent.tab();
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("textbox", { name: "Find" })).toHaveFocus();
    // In the text field, Home/End move the caret instead
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("textbox")).toHaveFocus();
    screen.getByRole("button", { name: "Last" }).focus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    // From a disabled item too (it swallows its own keydown), and links count
    screen.getByRole("button", { name: "Second" }).focus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    screen.getByRole("link", { name: "Help" }).focus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
  });
});

describe("Toolbar.Button", () => {
  it("icon-only: the tooltip is its name, with the shortcut as aria-keyshortcuts", () => {
    render(
      <Toolbar.Root aria-label="Tools">
        <Toolbar.Button iconOnly icon={<Icon />} label="Bold" shortcut="Mod+B" />
      </Toolbar.Root>,
    );
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("aria-labelledby");
    // jsdom isn't an Apple platform: Mod is Control
    expect(button).toHaveAttribute("aria-keyshortcuts", "Control+B");
  });

  it("tooltip={false}: named by aria-label instead", () => {
    render(
      <Toolbar.Root aria-label="Tools">
        <Toolbar.Button iconOnly icon={<Icon />} label="Bold" tooltip={false} />
      </Toolbar.Root>,
    );
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-label", "Bold");
  });

  it("disabled: focusable, aria-disabled, no hover, and clicks do nothing", async () => {
    const onClick = vi.fn();
    render(
      <Toolbar.Root aria-label="Tools">
        <Toolbar.Button disabled onClick={onClick}>
          Delete
        </Toolbar.Button>
      </Toolbar.Root>,
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("data-disabled");
    expect(button.className).not.toMatch(/(^|\s)hover:/);
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("a disabled Root disables every item", () => {
    render(
      <Toolbar.Root aria-label="Tools" disabled>
        <Toolbar.Button>A</Toolbar.Button>
        <Toolbar.Toggle>B</Toolbar.Toggle>
      </Toolbar.Root>,
    );
    for (const b of screen.getAllByRole("button")) {
      expect(b).toHaveAttribute("aria-disabled", "true");
    }
  });
});

describe("Toolbar.Toggle", () => {
  it("presses, and an icon-only toggle is named by its tooltip", async () => {
    render(
      <Toolbar.Root aria-label="Tools">
        <Toolbar.Toggle iconOnly icon={<Icon />} label="Italic" />
      </Toolbar.Root>,
    );
    const toggle = screen.getByRole("button", { name: "Italic" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("disabled toggles don't change", async () => {
    render(
      <Toolbar.Root aria-label="Tools">
        <Toolbar.Toggle disabled>Underline</Toolbar.Toggle>
      </Toolbar.Root>,
    );
    const toggle = screen.getByRole("button", { name: "Underline" });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });
});

describe("Toolbar.Group", () => {
  it("attached groups connect outline items", () => {
    render(
      <Toolbar.Root aria-label="Tools">
        <Toolbar.Group attached aria-label="Align">
          <Toolbar.Button>Left</Toolbar.Button>
          <Toolbar.Button>Right</Toolbar.Button>
        </Toolbar.Group>
      </Toolbar.Root>,
    );
    const group = screen.getByRole("group", { name: "Align" });
    expect(group).toHaveAttribute("data-attached");
    expect(group.className).toContain("!rounded-none");
    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("data-variant", "outline");
  });

  it("a disabled group disables its items", () => {
    render(
      <Toolbar.Root aria-label="Tools">
        <Toolbar.Group disabled aria-label="G">
          <Toolbar.Button>A</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Button>B</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-disabled", "false");
  });
});

describe("hideLabelsBelow", () => {
  // jsdom has no matchMedia
  function mockMatchMedia(matches: boolean) {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) =>
        ({
          matches,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    });
  }

  it("below the breakpoint, labels are screen-reader-only and move into tooltips", () => {
    mockMatchMedia(true);
    render(
      <Toolbar.Root aria-label="Tools" hideLabelsBelow="sm">
        <Toolbar.Button icon={<Icon />}>Comment</Toolbar.Button>
      </Toolbar.Root>,
    );
    const button = screen.getByRole("button", { name: "Comment" });
    expect(button.querySelector("[data-slot=toolbar-label]")).toHaveClass("max-sm:sr-only");
    expect(button).toHaveAttribute("aria-labelledby");
  });

  it("above it, no tooltip", () => {
    mockMatchMedia(false);
    render(
      <Toolbar.Root aria-label="Tools" hideLabelsBelow="sm">
        <Toolbar.Button icon={<Icon />}>Comment</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(screen.getByRole("button", { name: "Comment" })).not.toHaveAttribute("aria-labelledby");
  });
});

describe("computeOverflow", () => {
  it("nothing overflows when everything fits", () => {
    expect(computeOverflow({ widths: [40, 40], gap: 4, available: 100, moreWidth: 32 })).toEqual(
      [],
    );
  });

  it("trailing items overflow, keeping room for More", () => {
    // 40+4+40+4+40 = 128 > 100. Budget: More 32; 32+4+40 = 76; +4+40 = 120 > 100
    expect(
      computeOverflow({ widths: [40, 40, 40], gap: 4, available: 100, moreWidth: 32 }),
    ).toEqual([1, 2]);
  });

  it("pinned items never overflow and their width is reserved", () => {
    expect(
      computeOverflow({
        widths: [40, 40, 40, 60],
        pinned: [false, false, false, true],
        gap: 4,
        available: 150,
        moreWidth: 32,
      }),
    ).toEqual([1, 2]);
  });

  it("after the first item that doesn't fit, later ones overflow too (order kept)", () => {
    expect(
      computeOverflow({ widths: [40, 90, 10], gap: 0, available: 100, moreWidth: 30 }),
    ).toEqual([1, 2]);
  });
});

describe("overflow menu", () => {
  // jsdom has no layout: give the toolbar 140px and every measured item 40px.
  function fakeLayout() {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.getAttribute("data-slot") === "toolbar" ? 140 : 0;
    });
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
      this: HTMLElement,
    ) {
      const inMeasure = this.parentElement?.getAttribute("data-slot") === "toolbar-measure";
      const width = inMeasure ? 40 : 0;
      return {
        width,
        height: 32,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: 32,
        toJSON() {},
      } as DOMRect;
    });
  }

  function Editor() {
    return (
      <Toolbar.Root aria-label="Editor">
        <Toolbar.Button>Undo</Toolbar.Button>
        <Toolbar.Separator />
        <Toolbar.Toggle defaultPressed>Bold</Toolbar.Toggle>
        <ToggleGroup.Root
          aria-label="Align"
          defaultValue={["left"]}
          items={[
            { value: "left", label: "Left" },
            { value: "right", label: "Right" },
          ]}
        />
        <Toolbar.Link href="/help">Help</Toolbar.Link>
      </Toolbar.Root>
    );
  }

  it("moves what doesn't fit into a More menu: toggles as checkboxes, a single ToggleGroup as radios", async () => {
    fakeLayout();
    render(<Editor />);
    const toolbar = screen.getByRole("toolbar", { name: "Editor" });
    const more = await within(toolbar).findByRole("button", { name: "More" }, { timeout: 3000 });
    expect(within(toolbar).getByRole("button", { name: "Undo" })).toBeInTheDocument();
    expect(within(toolbar).queryByRole("link", { name: "Help" })).not.toBeInTheDocument();

    await userEvent.click(more);
    const menu = await screen.findByRole("menu", {}, { timeout: 3000 });
    expect(within(menu).getByRole("menuitemcheckbox", { name: "Bold" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(within(menu).getByRole("menuitemradio", { name: "Left" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(within(menu).getByRole("menuitem", { name: "Help" })).toBeInTheDocument();

    // The menu changes the same state the toolbar item uses. A checkbox item keeps the
    // menu open (Base UI), so check it there, then close and reopen to see it persist.
    await userEvent.click(within(menu).getByRole("menuitemcheckbox", { name: "Bold" }));
    await waitFor(() =>
      expect(within(menu).getByRole("menuitemcheckbox", { name: "Bold" })).toHaveAttribute(
        "aria-checked",
        "false",
      ),
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument(), {
      timeout: 3000,
    });
    await userEvent.click(more);
    const reopened = await screen.findByRole("menu", {}, { timeout: 3000 });
    expect(within(reopened).getByRole("menuitemcheckbox", { name: "Bold" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("warns when items are wrapped in a component the menu can't see into", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    function Wrapped() {
      return (
        <>
          <Toolbar.Button>A</Toolbar.Button>
          <Toolbar.Button>B</Toolbar.Button>
        </>
      );
    }
    render(
      <Toolbar.Root aria-label="Wrapped">
        <Wrapped />
      </Toolbar.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("direct children"));
  });

  it("plain rows reserve the indicator column, so every icon lines up", async () => {
    fakeLayout();
    render(<Editor />);
    const more = await within(screen.getByRole("toolbar", { name: "Editor" })).findByRole(
      "button",
      { name: "More" },
      { timeout: 3000 },
    );
    await userEvent.click(more);
    const menu = await screen.findByRole("menu", {}, { timeout: 3000 });
    // Help is a plain row in a menu with checkbox and radio rows
    const help = within(menu).getByRole("menuitem", { name: "Help" });
    expect(help.querySelector("[data-slot=toolbar-menu-indicator-space]")).not.toBeNull();
    const bold = within(menu).getByRole("menuitemcheckbox", { name: "Bold" });
    expect(bold.querySelector("[data-slot=toolbar-menu-indicator-space]")).toBeNull();
  });

  it("the measuring copy is hidden from everyone", () => {
    fakeLayout();
    const { container } = render(<Editor />);
    const measure = container.querySelector("[data-slot=toolbar-measure]")!;
    expect(measure).toHaveAttribute("aria-hidden", "true");
    expect(measure).toHaveAttribute("inert");
  });

  it("overflow='wrap' and 'none' render no measuring copy", () => {
    const { container, rerender } = render(
      <Toolbar.Root aria-label="T" overflow="wrap">
        <Toolbar.Button>A</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(container.querySelector("[data-slot=toolbar-measure]")).toBeNull();
    expect(screen.getByRole("toolbar")).toHaveClass("flex-wrap");
    rerender(
      <Toolbar.Root aria-label="T" overflow="none">
        <Toolbar.Button>A</Toolbar.Button>
      </Toolbar.Root>,
    );
    expect(container.querySelector("[data-slot=toolbar-measure]")).toBeNull();
  });
});

describe("toAriaKeyShortcut", () => {
  it("maps Kbd syntax to aria-keyshortcuts names", () => {
    expect(toAriaKeyShortcut("Mod+B", "apple")).toBe("Meta+B");
    expect(toAriaKeyShortcut("Mod+Shift+z", "windows")).toBe("Control+Shift+Z");
    expect(toAriaKeyShortcut("Alt+ArrowUp", "other")).toBe("Alt+ArrowUp");
    // A sequence can't be expressed
    expect(toAriaKeyShortcut("g i", "other")).toBeUndefined();
  });
});

describe("wrapping separators", () => {
  it("a separator at the start or end of a wrapped line is marked, one mid-line isn't", async () => {
    const { markLineEdges } = await import("./Toolbar");
    const root = document.createElement("div");
    const make = (role: string | null, top: number) => {
      const el = document.createElement("div");
      if (role) el.setAttribute("role", role);
      el.getBoundingClientRect = () =>
        ({
          top,
          bottom: top + 32,
          height: 32,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: top,
          toJSON() {},
        }) as DOMRect;
      root.appendChild(el);
      return el;
    };
    make(null, 0);
    const mid = make("separator", 0);
    make(null, 0);
    const end = make("separator", 0); // last on line 1
    make(null, 40); // line 2
    markLineEdges(root);
    expect(mid).not.toHaveAttribute("data-line-edge");
    expect(end).toHaveAttribute("data-line-edge");
  });
});

describe("signoff regressions", () => {
  it("overflow re-measures when an item's own width changes: each measured item is observed", () => {
    const observed: Element[] = [];
    class FakeObserver {
      observe(el: Element) {
        observed.push(el);
      }
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal("ResizeObserver", FakeObserver);
    const { container } = render(
      <Toolbar.Root aria-label="Observed">
        <Toolbar.Button>A</Toolbar.Button>
        <Toolbar.Button>B</Toolbar.Button>
      </Toolbar.Root>,
    );
    const measure = container.querySelector("[data-slot=toolbar-measure]")!;
    for (const child of Array.from(measure.children)) expect(observed).toContain(child);
    vi.unstubAllGlobals();
  });

  it("the measuring copy renders no tooltips (no second set of portalled popups)", () => {
    const { container } = render(
      <Toolbar.Root aria-label="Tips">
        <Toolbar.Button iconOnly icon={<Icon />} label="Bold" />
        <Toolbar.Toggle iconOnly icon={<Icon />} label="Italic" />
      </Toolbar.Root>,
    );
    const measure = container.querySelector("[data-slot=toolbar-measure]")!;
    expect(measure.querySelector("[data-base-ui-tooltip-trigger]")).toBeNull();
    // One popup per visible icon-only item
    expect(document.querySelectorAll("[data-slot=tooltip-popup]")).toHaveLength(2);
  });

  it("line edges ignore Base UI focus guards and zero-size nodes", async () => {
    const { markLineEdges } = await import("./Toolbar");
    const root = document.createElement("div");
    const make = (attrs: Record<string, string>, top: number, height = 32) => {
      const el = document.createElement("span");
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      el.getBoundingClientRect = () =>
        ({
          top,
          bottom: top + height,
          height,
          left: 0,
          right: 0,
          width: 0,
          x: 0,
          y: top,
          toJSON() {},
        }) as DOMRect;
      root.appendChild(el);
      return el;
    };
    make({}, 0);
    const sep = make({ role: "separator" }, 0);
    // An open menu's trigger gets a 0-size focus guard before it
    make({ "data-base-ui-focus-guard": "" }, 0, 0);
    make({}, 0);
    markLineEdges(root);
    expect(sep).not.toHaveAttribute("data-line-edge");
  });
});
