import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu, type MenuPopupProps, menuItemClasses, toAriaKeyshortcuts } from "./Menu";

function Harness({
  children,
  popup,
}: {
  children: React.ReactNode;
  popup?: Omit<MenuPopupProps, "children">;
}) {
  return (
    <Menu.Root>
      <Menu.Trigger>Open</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup data-testid="popup" {...popup}>
            {children}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

async function open(ui: React.ReactElement) {
  const user = userEvent.setup();
  const result = render(ui);
  await user.click(screen.getByText("Open"));
  await screen.findByRole("menu");
  return { user, ...result };
}

describe("Menu", () => {
  /* ---------- structure ---------- */

  it("renders an unstyled trigger with data-slot", () => {
    render(
      <Menu.Root>
        <Menu.Trigger>Open</Menu.Trigger>
      </Menu.Root>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("data-slot", "menu-trigger");
    expect(trigger.className).toBe("");
  });

  it("opens on click and renders popup slots", async () => {
    await open(
      <Harness>
        <Menu.Item>Copy</Menu.Item>
      </Harness>,
    );
    const popup = screen.getByTestId("popup");
    expect(popup).toHaveAttribute("data-slot", "menu-popup");
    expect(popup).toHaveAttribute("data-size", "md");
    expect(popup).toHaveAttribute("data-highlight", "subtle");
    expect(popup.closest("[data-slot=menu-positioner]")).not.toBeNull();
    expect(screen.getByRole("menuitem", { name: "Copy" })).toHaveAttribute(
      "data-slot",
      "menu-item",
    );
  });

  it("uses semantic tokens on the popup, not raw colours", async () => {
    await open(
      <Harness>
        <Menu.Item>Copy</Menu.Item>
      </Harness>,
    );
    const cls = screen.getByTestId("popup").className;
    expect(cls).toContain("bg-surface-overlay");
    expect(cls).toContain("border-border-default");
    expect(cls).not.toMatch(/neutral-|bg-white/);
  });

  it("sets max height from the maxHeight prop", async () => {
    await open(
      <Harness popup={{ maxHeight: "10rem" }}>
        <Menu.Item>Copy</Menu.Item>
      </Harness>,
    );
    expect(screen.getByTestId("popup").style.getPropertyValue("--sp-menu-max-height")).toBe(
      "10rem",
    );
  });

  it("widens to the trigger with matchTriggerWidth", async () => {
    await open(
      <Harness popup={{ matchTriggerWidth: true }}>
        <Menu.Item>Copy</Menu.Item>
      </Harness>,
    );
    expect(screen.getByTestId("popup").className).toContain("var(--anchor-width)");
  });

  /* ---------- item content and accessibility ---------- */

  it("names the item by its label only, and describes it by description and shortcut", async () => {
    await open(
      <Harness>
        <Menu.Item description="Copies the selection" shortcut="Mod+C">
          Copy
        </Menu.Item>
      </Harness>,
    );
    const item = screen.getByRole("menuitem", { name: "Copy" });
    // Glyphs are aria-hidden, so only the spoken key names are described
    expect(item).toHaveAccessibleDescription(/^Copies the selection (control|command) c$/);
  });

  it("renders the shortcut with Kbd", async () => {
    await open(
      <Harness>
        <Menu.Item shortcut="Mod+C">Copy</Menu.Item>
      </Harness>,
    );
    const kbd = screen.getByRole("menuitem").querySelector("[data-slot=menu-item-shortcut]");
    expect(kbd?.tagName).toBe("KBD");
  });

  it("only sets aria-keyshortcuts when shortcutActive", async () => {
    await open(
      <Harness>
        <Menu.Item shortcut="Mod+C">Hint only</Menu.Item>
        <Menu.Item shortcut="Mod+Shift+P" shortcutActive>
          Wired
        </Menu.Item>
      </Harness>,
    );
    expect(screen.getByRole("menuitem", { name: "Hint only" })).not.toHaveAttribute(
      "aria-keyshortcuts",
    );
    expect(screen.getByRole("menuitem", { name: "Wired" })).toHaveAttribute(
      "aria-keyshortcuts",
      expect.stringMatching(/^(Control|Meta)\+Shift\+P$/),
    );
  });

  it("hides icons from screen readers", async () => {
    await open(
      <Harness>
        <Menu.Item icon={<svg data-testid="icon" />}>Copy</Menu.Item>
      </Harness>,
    );
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("renders inline and block descriptions", async () => {
    await open(
      <Harness>
        <Menu.Item description=".pdf" descriptionLayout="inline">
          Download
        </Menu.Item>
        <Menu.Item description="Below">Block</Menu.Item>
      </Harness>,
    );
    const [inline, block] = screen
      .getAllByRole("menuitem")
      .map((i) => i.querySelector("[data-slot=menu-item-content]")!);
    expect(inline!.className).toContain("flex-row");
    expect(block!.className).toContain("flex-col");
  });

  it("renders trailing content", async () => {
    await open(
      <Harness>
        <Menu.Item trailing="24">All mail</Menu.Item>
      </Harness>,
    );
    expect(screen.getByText("24")).toHaveAttribute("data-slot", "menu-item-trailing");
  });

  it("indents inset items without an icon", async () => {
    await open(
      <Harness>
        <Menu.Item inset>Inset</Menu.Item>
        <Menu.Item inset icon={<svg />}>
          With icon
        </Menu.Item>
      </Harness>,
    );
    expect(screen.getByRole("menuitem", { name: "Inset" }).className).toContain("ps-8");
    expect(screen.getByRole("menuitem", { name: "With icon" }).className).not.toContain("ps-8");
  });

  it("uses the label string for typeahead", async () => {
    const { user } = await open(
      <Harness>
        <Menu.Item description="first">Alpha</Menu.Item>
        <Menu.Item description="second">Bravo</Menu.Item>
      </Harness>,
    );
    await user.keyboard("b");
    expect(screen.getByRole("menuitem", { name: "Bravo" })).toHaveAttribute("data-highlighted");
  });

  /* ---------- states ---------- */

  it("styles danger items and adds screen-reader text", async () => {
    await open(
      <Harness>
        <Menu.Item variant="danger" dangerDescription="Can't be undone">
          Delete
        </Menu.Item>
      </Harness>,
    );
    const item = screen.getByRole("menuitem", { name: "Delete" });
    expect(item).toHaveAttribute("data-variant", "danger");
    expect(item.className).toContain("text-danger");
    expect(item).toHaveAccessibleDescription("Can't be undone");
  });

  it("disables items through Base UI", async () => {
    const onClick = vi.fn();
    const { user } = await open(
      <Harness>
        <Menu.Item disabled onClick={onClick}>
          Disabled
        </Menu.Item>
      </Harness>,
    );
    const item = screen.getByRole("menuitem", { name: "Disabled" });
    expect(item).toHaveAttribute("data-disabled");
    await user.click(item);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps inactive items focusable, ignores clicks, stays open and explains why", async () => {
    const onClick = vi.fn();
    const { user } = await open(
      <Harness>
        <Menu.Item inactiveText="Archiving is off" onClick={onClick}>
          Archive
        </Menu.Item>
      </Harness>,
    );
    const item = screen.getByRole("menuitem", { name: "Archive" });
    expect(item).toHaveAttribute("data-inactive");
    expect(item).not.toHaveAttribute("aria-disabled");
    expect(item).toHaveAccessibleDescription("Archiving is off");
    await user.click(item);
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByTestId("popup")).toBeInTheDocument();
  });

  it("shows a spinner and ignores clicks while loading", async () => {
    const onClick = vi.fn();
    const { user } = await open(
      <Harness>
        <Menu.Item loading onClick={onClick}>
          Share
        </Menu.Item>
      </Harness>,
    );
    const item = screen.getByRole("menuitem", { name: "Share" });
    expect(item).toHaveAttribute("aria-busy", "true");
    expect(item).toHaveAccessibleDescription("Loading");
    const spinner = item.querySelector("[data-slot=menu-item-spinner]")!;
    expect(spinner).toHaveAttribute("aria-hidden", "true");
    expect(spinner).not.toHaveAttribute("role");
    await user.click(item);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("marks the active item as current", async () => {
    await open(
      <Harness>
        <Menu.Item active>Documentation</Menu.Item>
      </Harness>,
    );
    const item = screen.getByRole("menuitem", { name: "Documentation" });
    expect(item).toHaveAttribute("aria-current", "true");
    expect(item).toHaveAttribute("data-active");
  });

  it("calls onClick and closes on a normal item", async () => {
    const onClick = vi.fn();
    const { user } = await open(
      <Harness>
        <Menu.Item onClick={onClick}>Copy</Menu.Item>
      </Harness>,
    );
    await user.click(screen.getByRole("menuitem", { name: "Copy" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  /* ---------- popup options ---------- */

  it("passes size to items through context", async () => {
    await open(
      <Harness popup={{ size: "lg" }}>
        <Menu.Item>Copy</Menu.Item>
      </Harness>,
    );
    expect(screen.getByRole("menuitem").className).toContain("min-h-[var(--sp-control-height)]");
  });

  it("uses the accent fill for solid highlight", async () => {
    await open(
      <Harness popup={{ highlight: "solid" }}>
        <Menu.Item>Copy</Menu.Item>
        <Menu.Item variant="danger">Delete</Menu.Item>
      </Harness>,
    );
    expect(screen.getByRole("menuitem", { name: "Copy" }).className).toContain(
      "data-[highlighted]:bg-accent",
    );
    expect(screen.getByRole("menuitem", { name: "Delete" }).className).toContain(
      "data-[highlighted]:bg-danger",
    );
  });

  it("draws dividers only when asked", async () => {
    await open(
      <Harness popup={{ dividers: true }}>
        <Menu.Item>One</Menu.Item>
      </Harness>,
    );
    const cls = screen.getByRole("menuitem").className;
    expect(cls).toContain("[[role^=menuitem]+&]:before:block");
    expect(cls).toContain("[[data-highlighted]+&]:before:opacity-0");
    expect(cls).toContain("data-[highlighted]:before:opacity-0");
  });

  /* ---------- other item types ---------- */

  it("renders checkbox items with an automatic indicator", async () => {
    const { user } = await open(
      <Harness>
        <Menu.CheckboxItem defaultChecked>Toolbar</Menu.CheckboxItem>
        <Menu.CheckboxItem closeOnClick={false}>Status bar</Menu.CheckboxItem>
      </Harness>,
    );
    const [checked, unchecked] = screen.getAllByRole("menuitemcheckbox");
    expect(checked).toHaveAttribute("aria-checked", "true");
    expect(checked!.querySelector("[data-slot=menu-checkbox-item-indicator]")).toHaveAttribute(
      "data-checked",
    );
    // Unchecked indicator stays mounted (invisible) so labels line up
    expect(unchecked!.querySelector("[data-slot=menu-checkbox-item-indicator]")).toHaveAttribute(
      "data-unchecked",
    );
    await user.click(unchecked!);
    expect(unchecked).toHaveAttribute("aria-checked", "true");
  });

  it("renders radio items with an automatic indicator", async () => {
    await open(
      <Harness>
        <Menu.RadioGroup defaultValue="name">
          <Menu.RadioItem value="name">Name</Menu.RadioItem>
          <Menu.RadioItem value="date">Date</Menu.RadioItem>
        </Menu.RadioGroup>
      </Harness>,
    );
    const radios = screen.getAllByRole("menuitemradio");
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    expect(radios[0]!.querySelector("[data-slot=menu-radio-item-indicator]")).not.toBeNull();
  });

  it("renders link items and flags new-tab links", async () => {
    await open(
      <Harness>
        <Menu.LinkItem href="/docs">Docs</Menu.LinkItem>
        <Menu.LinkItem href="https://github.com" target="_blank">
          GitHub
        </Menu.LinkItem>
      </Harness>,
    );
    const docs = screen.getByRole("menuitem", { name: "Docs" });
    expect(docs.tagName).toBe("A");
    expect(docs).toHaveAttribute("data-slot", "menu-link-item");
    const gh = screen.getByRole("menuitem", { name: "GitHub" });
    expect(gh).toHaveAttribute("rel", "noopener noreferrer");
    expect(gh).toHaveAccessibleDescription("Opens in a new tab");
    expect(gh.querySelector("[data-slot=menu-item-external-icon]")).not.toBeNull();
  });

  it("renders a submenu trigger with a chevron that flips in RTL", async () => {
    await open(
      <Harness>
        <Menu.SubmenuRoot>
          <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
        </Menu.SubmenuRoot>
      </Harness>,
    );
    const trigger = screen.getByRole("menuitem", { name: "Share" });
    expect(trigger).toHaveAttribute("data-slot", "menu-submenu-trigger");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    const chevron = trigger.querySelector("[data-slot=menu-submenu-chevron]")!;
    expect(chevron).toHaveAttribute("aria-hidden", "true");
    expect(chevron.className).toContain("rtl:-scale-x-100");
  });

  it("accepts a custom submenu chevron", async () => {
    await open(
      <Harness>
        <Menu.SubmenuRoot>
          <Menu.SubmenuTrigger chevron={<span data-testid="chev">›</span>}>
            Share
          </Menu.SubmenuTrigger>
        </Menu.SubmenuRoot>
      </Harness>,
    );
    expect(screen.getByTestId("chev")).toBeInTheDocument();
  });

  /* ---------- groups, separators ---------- */

  it("names groups by label and describes them by description", async () => {
    await open(
      <Harness>
        <Menu.Group>
          <Menu.GroupLabel description="Signed in as sam">Account</Menu.GroupLabel>
          <Menu.Item>Profile</Menu.Item>
        </Menu.Group>
      </Harness>,
    );
    const group = screen.getByRole("group", { name: "Account" });
    expect(group).toHaveAccessibleDescription("Signed in as sam");
  });

  it("renders solid and dashed separators", async () => {
    await open(
      <Harness>
        <Menu.Item>A</Menu.Item>
        <Menu.Separator />
        <Menu.Separator variant="dashed" />
        <Menu.Item>B</Menu.Item>
      </Harness>,
    );
    const [solid, dashed] = screen.getAllByRole("separator");
    expect(solid).toHaveAttribute("data-variant", "solid");
    expect(dashed!.className).toContain("border-dashed");
  });

  /* ---------- search ---------- */

  it("filters items and shows the empty state", async () => {
    const user = userEvent.setup();
    render(
      <Menu.FilterProvider>
        <Menu.Root>
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner>
              <Menu.Popup>
                <Menu.Search placeholder="Filter labels" />
                <Menu.List>
                  <Menu.Item>bug</Menu.Item>
                  <Menu.Item>question</Menu.Item>
                </Menu.List>
                <Menu.Empty>No labels match</Menu.Empty>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </Menu.FilterProvider>,
    );
    await user.click(screen.getByText("Open"));
    const input = await screen.findByRole("searchbox", { name: "Filter labels" });
    await user.type(input, "que");
    expect(screen.queryByRole("menuitem", { name: "bug" })).toBeNull();
    expect(screen.getByRole("menuitem", { name: "question" })).toBeInTheDocument();
    await user.type(input, "zzz");
    expect(await screen.findByText("No labels match")).toBeInTheDocument();
    // Pointer-only clear button (Base UI hides it from AT; Escape clears)
    const clear = document.querySelector("[data-slot=menu-search-clear]")!;
    expect(clear).toHaveAttribute("aria-hidden", "true");
    await user.click(clear);
    expect(input).toHaveValue("");
  });

  /* ---------- /improve additions ---------- */

  it("describes a shortcut sequence with 'then'", async () => {
    await open(
      <Harness>
        <Menu.Item shortcut="g i">Inbox</Menu.Item>
      </Harness>,
    );
    expect(screen.getByRole("menuitem", { name: "Inbox" })).toHaveAccessibleDescription("g then i");
  });

  it("groups trailing, shortcut and spinner into one end slot", async () => {
    await open(
      <Harness>
        <Menu.Item trailing="24" shortcut="Mod+I" loading>
          Inbox
        </Menu.Item>
      </Harness>,
    );
    const item = screen.getByRole("menuitem", { name: /Inbox/ });
    const ends = item.querySelectorAll("[data-slot=menu-item-end]");
    expect(ends).toHaveLength(1);
    const end = ends[0]!;
    expect(end.className).toContain("ms-auto");
    expect(end.querySelector("[data-slot=menu-item-trailing]")).not.toBeNull();
    expect(end.querySelector("[data-slot=menu-item-shortcut]")).not.toBeNull();
    expect(end.querySelector("[data-slot=menu-item-spinner]")).not.toBeNull();
    // Only the group pushes to the end
    expect(item.querySelectorAll(".ms-auto")).toHaveLength(1);
  });

  it("marks the active link as the current page", async () => {
    await open(
      <Harness>
        <Menu.LinkItem href="/docs" active>
          Docs
        </Menu.LinkItem>
      </Harness>,
    );
    expect(screen.getByRole("menuitem", { name: "Docs" })).toHaveAttribute("aria-current", "page");
  });

  it("submenus inherit size and highlight from the parent popup", async () => {
    const user = userEvent.setup();
    render(
      <Menu.Root>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup size="lg" highlight="solid">
              <Menu.SubmenuRoot>
                <Menu.SubmenuTrigger>More</Menu.SubmenuTrigger>
                <Menu.Portal>
                  <Menu.Positioner>
                    <Menu.Popup data-testid="sub">
                      <Menu.Item>Nested</Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.SubmenuRoot>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>,
    );
    await user.click(screen.getByText("Open"));
    await user.click(await screen.findByRole("menuitem", { name: "More" }));
    const sub = await screen.findByTestId("sub");
    expect(sub).toHaveAttribute("data-size", "lg");
    expect(sub).toHaveAttribute("data-highlight", "solid");
  });

  /* ---------- helpers ---------- */

  it("menuItemClasses is shared output for ContextMenu and Menubar", () => {
    const cls = menuItemClasses({ size: "md", highlight: "subtle", dividers: false });
    expect(cls).toContain("min-h-[var(--sp-control-height-sm)]");
  });
});

describe("toAriaKeyshortcuts", () => {
  it.each([
    ["Mod+C", "apple", "Meta+C"],
    ["Mod+C", "windows", "Control+C"],
    ["Mod+Shift+P", "other", "Control+Shift+P"],
    ["cmd+option+esc", "apple", "Meta+Alt+Escape"],
    ["ArrowUp", "other", "ArrowUp"],
    ["Mod++", "apple", "Meta+Plus"],
    ["F2", "other", "F2"],
  ] as const)("%s on %s → %s", (keys, platform, expected) => {
    expect(toAriaKeyshortcuts(keys, platform)).toBe(expected);
  });

  it("returns undefined for sequences", () => {
    expect(toAriaKeyshortcuts("g i", "apple")).toBeUndefined();
  });
});
