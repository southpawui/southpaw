import * as React from "react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextMenu } from "./ContextMenu";
import { Menu } from "../Menu/Menu";
import { Button } from "../Button/Button";

function Harness({
  rootProps,
  triggerProps,
  children = <ContextMenu.Item>Copy</ContextMenu.Item>,
}: {
  rootProps?: React.ComponentProps<typeof ContextMenu.Root>;
  triggerProps?: React.ComponentProps<typeof ContextMenu.Trigger>;
  children?: React.ReactNode;
}) {
  return (
    <ContextMenu.Root {...rootProps}>
      <ContextMenu.Trigger data-testid="area" {...triggerProps}>
        Area
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup data-testid="popup">{children}</ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

function stubPlatform(platform: string) {
  vi.spyOn(window.navigator, "platform", "get").mockReturnValue(platform);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ContextMenu", () => {
  /* ---------- trigger ---------- */

  it("renders a focusable trigger with data-slot and a focus ring", () => {
    render(<Harness />);
    const area = screen.getByTestId("area");
    expect(area).toHaveAttribute("data-slot", "context-menu-trigger");
    expect(area).toHaveAttribute("tabindex", "0");
    expect(area.className).toContain("focus-visible:sp-focus-ring");
  });

  it("lets the consumer opt out of the tab stop", () => {
    render(<Harness triggerProps={{ tabIndex: -1 }} />);
    expect(screen.getByTestId("area")).toHaveAttribute("tabindex", "-1");
  });

  it("does not claim to open on activation (no aria-haspopup / aria-expanded)", () => {
    render(<Harness />);
    const area = screen.getByTestId("area");
    expect(area).not.toHaveAttribute("aria-haspopup");
    expect(area).not.toHaveAttribute("aria-expanded");
  });

  /* ---------- opening ---------- */

  it("opens on right-click", async () => {
    render(<Harness />);
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 40, clientY: 40 });
    expect(await screen.findByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
    expect(screen.getByTestId("area")).toHaveAttribute("data-popup-open");
  });

  it.each([
    ["Shift+F10", { key: "F10", shiftKey: true }],
    ["the Menu key", { key: "ContextMenu" }],
  ])("opens from the keyboard with %s", async (_, init) => {
    render(<Harness />);
    const area = screen.getByTestId("area");
    area.focus();
    fireEvent.keyDown(area, init);
    expect(await screen.findByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
  });

  it("opens with Ctrl+Enter on macOS only", async () => {
    stubPlatform("Win32");
    const { unmount } = render(<Harness />);
    fireEvent.keyDown(screen.getByTestId("area"), { key: "Enter", ctrlKey: true });
    expect(screen.queryByRole("menuitem")).toBeNull();
    unmount();

    stubPlatform("MacIntel");
    render(<Harness />);
    const area = screen.getByTestId("area");
    await waitFor(() => {
      fireEvent.keyDown(area, { key: "Enter", ctrlKey: true });
      expect(screen.getByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
    });
  });

  it("ignores other keys", () => {
    render(<Harness />);
    const area = screen.getByTestId("area");
    fireEvent.keyDown(area, { key: "F10" });
    fireEvent.keyDown(area, { key: "Enter" });
    expect(screen.queryByRole("menuitem")).toBeNull();
  });

  it("still calls the consumer's onKeyDown", () => {
    const onKeyDown = vi.fn();
    render(<Harness triggerProps={{ onKeyDown }} />);
    fireEvent.keyDown(screen.getByTestId("area"), { key: "a" });
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it("opens from a focused child inside the area", async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger tabIndex={-1}>
          <ul>
            <li>
              <Button data-testid="row">Row</Button>
            </li>
          </ul>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Item>Copy</ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );
    fireEvent.keyDown(screen.getByTestId("row"), { key: "F10", shiftKey: true });
    expect(await screen.findByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
  });

  it("does not open, and leaves the native menu alone, when disabled", () => {
    render(<Harness rootProps={{ disabled: true }} />);
    const area = screen.getByTestId("area");
    const notPrevented = fireEvent.contextMenu(area);
    expect(notPrevented).toBe(true);
    fireEvent.keyDown(area, { key: "ContextMenu" });
    expect(screen.queryByRole("menuitem")).toBeNull();
  });

  it("leaves Shift+F10 and the Menu key to the browser when disabled", () => {
    render(<Harness rootProps={{ disabled: true }} />);
    const area = screen.getByTestId("area");
    // fireEvent returns false when the handler called preventDefault
    expect(fireEvent.keyDown(area, { key: "F10", shiftKey: true })).toBe(true);
    expect(fireEvent.keyDown(area, { key: "ContextMenu" })).toBe(true);
    expect(screen.queryByRole("menuitem")).toBeNull();
  });

  it("opens the inner menu when areas are nested", async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          Outer
          <ContextMenu.Root>
            <ContextMenu.Trigger data-testid="inner">Inner</ContextMenu.Trigger>
            <ContextMenu.Portal>
              <ContextMenu.Positioner>
                <ContextMenu.Popup>
                  <ContextMenu.Item>Inner action</ContextMenu.Item>
                </ContextMenu.Popup>
              </ContextMenu.Positioner>
            </ContextMenu.Portal>
          </ContextMenu.Root>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Item>Outer action</ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );
    fireEvent.contextMenu(screen.getByTestId("inner"), { clientX: 10, clientY: 10 });
    expect(await screen.findByRole("menuitem", { name: "Inner action" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Outer action" })).toBeNull();
  });

  /* ---------- open-area highlight ---------- */

  it("highlights the area while its menu is open", async () => {
    render(<Harness />);
    const area = screen.getByTestId("area");
    expect(area).not.toHaveAttribute("data-popup-open");
    expect(area.className).toContain("data-[popup-open]:bg-[var(--sp-state-pressed)]");
    expect(area.className).toContain("forced-colors:data-[popup-open]:outline-solid");
    fireEvent.contextMenu(area, { clientX: 40, clientY: 40 });
    await screen.findByRole("menuitem", { name: "Copy" });
    expect(area).toHaveAttribute("data-popup-open");
  });

  it("a right-click does not mark a Menu trigger inside the area as open", async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger data-testid="area">
          Row
          <Menu.Root>
            <Menu.Trigger>More</Menu.Trigger>
          </Menu.Root>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Item>Copy</ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 10, clientY: 10 });
    await screen.findByRole("menuitem", { name: "Copy" });
    const more = screen.getByRole("button", { name: "More", hidden: true });
    // Only the area is open; the button is not expanded, so it must not look pressed
    expect(screen.getByTestId("area")).toHaveAttribute("data-popup-open");
    expect(more).toHaveAttribute("aria-expanded", "false");
    expect(more).not.toHaveAttribute("data-popup-open");
  });

  /* ---------- keyboard opens skip the open animation ---------- */

  it("animates a right-click open", async () => {
    render(<Harness />);
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 40, clientY: 40 });
    await screen.findByRole("menuitem", { name: "Copy" });
    expect(screen.getByTestId("popup")).not.toHaveAttribute("data-keyboard-open");
  });

  it.each([
    ["Shift+F10", { key: "F10", shiftKey: true }],
    ["the Menu key", { key: "ContextMenu" }],
  ])("does not animate a %s open", async (_, init) => {
    render(<Harness />);
    fireEvent.keyDown(screen.getByTestId("area"), init);
    await screen.findByRole("menuitem", { name: "Copy" });
    expect(screen.getByTestId("popup")).toHaveAttribute("data-keyboard-open");
  });

  it("a right-click after a keyboard open animates again", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const area = screen.getByTestId("area");
    fireEvent.keyDown(area, { key: "ContextMenu" });
    await screen.findByRole("menuitem", { name: "Copy" });
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menuitem")).toBeNull());
    fireEvent.contextMenu(area, { clientX: 40, clientY: 40 });
    await screen.findByRole("menuitem", { name: "Copy" });
    expect(screen.getByTestId("popup")).not.toHaveAttribute("data-keyboard-open");
  });

  /* ---------- shared Menu parts ---------- */

  it("re-exports Menu's parts instead of copying them", () => {
    expect(ContextMenu.Popup).toBe(Menu.Popup);
    expect(ContextMenu.Item).toBe(Menu.Item);
    expect(ContextMenu.SubmenuTrigger).toBe(Menu.SubmenuTrigger);
    expect(ContextMenu.CheckboxItem).toBe(Menu.CheckboxItem);
    expect(ContextMenu.Separator).toBe(Menu.Separator);
  });

  it("renders Menu item features inside a context menu", async () => {
    render(
      <Harness>
        <ContextMenu.Item shortcut="Mod+C" description="Copies the selection">
          Copy
        </ContextMenu.Item>
        <ContextMenu.CheckboxItem defaultChecked>Show grid</ContextMenu.CheckboxItem>
        <ContextMenu.Item variant="danger">Delete</ContextMenu.Item>
      </Harness>,
    );
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 40, clientY: 40 });
    const copy = await screen.findByRole("menuitem", { name: "Copy" });
    expect(copy).toHaveAccessibleDescription(/^Copies the selection (control|command) c$/);
    expect(screen.getByRole("menuitemcheckbox")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute(
      "data-variant",
      "danger",
    );
    expect(screen.getByTestId("popup")).toHaveAttribute("data-slot", "menu-popup");
    expect(
      screen.getByTestId("popup").closest("[data-slot=context-menu-positioner]"),
    ).not.toBeNull();
  });

  it("passes popup options (size, highlight) to items", async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger data-testid="area">Area</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup size="lg" highlight="solid">
              <ContextMenu.Item>Copy</ContextMenu.Item>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 40, clientY: 40 });
    const item = await screen.findByRole("menuitem", { name: "Copy" });
    expect(item.className).toContain("data-[highlighted]:bg-accent");
    expect(item.className).toContain("min-h-[var(--sp-control-height)]");
  });

  it("supports search with Menu.FilterProvider", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu.FilterProvider>
        <ContextMenu.Root>
          <ContextMenu.Trigger data-testid="area">Area</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Positioner>
              <ContextMenu.Popup>
                <ContextMenu.Search placeholder="Filter actions" />
                <ContextMenu.List>
                  <ContextMenu.Item>Copy</ContextMenu.Item>
                  <ContextMenu.Item>Paste</ContextMenu.Item>
                </ContextMenu.List>
                <ContextMenu.Empty>No actions match</ContextMenu.Empty>
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </ContextMenu.FilterProvider>,
    );
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 40, clientY: 40 });
    const input = await screen.findByRole("searchbox", { name: "Filter actions" });
    await user.type(input, "pas");
    expect(screen.queryByRole("menuitem", { name: "Copy" })).toBeNull();
    expect(screen.getByRole("menuitem", { name: "Paste" })).toBeInTheDocument();
  });

  it("closes after choosing an item and calls its handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Harness>
        <ContextMenu.Item onClick={onClick}>Copy</ContextMenu.Item>
      </Harness>,
    );
    fireEvent.contextMenu(screen.getByTestId("area"), { clientX: 40, clientY: 40 });
    await user.click(await screen.findByRole("menuitem", { name: "Copy" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
