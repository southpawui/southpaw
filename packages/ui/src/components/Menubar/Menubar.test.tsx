import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menubar } from "./Menubar";
import { Menu } from "../Menu/Menu";

function Bar(props: Partial<React.ComponentProps<typeof Menubar>> & { editDisabled?: boolean }) {
  const { editDisabled, ...rest } = props;
  return (
    <Menubar aria-label="Application" {...rest}>
      {[
        ["File", ["New", "Open", "Delete"]],
        ["Edit", ["Redo (disabled)", "Undo", "Copy"]],
        ["View", ["Zoom in"]],
        ["Help", ["Docs"]],
      ].map(([label, items]) => (
        <Menubar.Menu key={label as string} disabled={label === "Edit" && editDisabled}>
          <Menubar.Trigger>{label as string}</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Positioner>
              <Menubar.Popup data-testid={`popup-${label}`}>
                {(items as string[]).map((i) => (
                  <Menubar.Item key={i} disabled={i.endsWith("(disabled)")}>
                    {i}
                  </Menubar.Item>
                ))}
              </Menubar.Popup>
            </Menubar.Positioner>
          </Menubar.Portal>
        </Menubar.Menu>
      ))}
    </Menubar>
  );
}

describe("Menubar", () => {
  it("renders a named menubar with data-slot and semantic tokens", () => {
    render(<Bar />);
    const bar = screen.getByRole("menubar", { name: "Application" });
    expect(bar).toHaveAttribute("data-slot", "menubar");
    expect(bar.className).toContain("bg-surface-raised");
    expect(bar.className).not.toMatch(/neutral-|bg-white/);
  });

  it("renders triggers as menu items with a popup", () => {
    render(<Bar />);
    const file = screen.getByRole("menuitem", { name: "File" });
    expect(file).toHaveAttribute("data-slot", "menubar-trigger");
    expect(file).toHaveAttribute("aria-haspopup", "menu");
  });

  it("styles the open trigger with Menu's shared open state", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    const file = screen.getByRole("menuitem", { name: "File" });
    expect(file.className).toContain("aria-expanded:shadow-[inset_0_0_0_1.5px_currentColor]");
    await user.click(file);
    await screen.findByTestId("popup-File");
    expect(file).toHaveAttribute("aria-expanded", "true");
  });

  it("reuses Menu's parts", () => {
    expect(Menubar.Item).toBe(Menu.Item);
    expect(Menubar.Popup).toBe(Menu.Popup);
    expect(Menubar.SubmenuTrigger).toBe(Menu.SubmenuTrigger);
    expect(Menubar.Backdrop).toBe(Menu.Backdrop);
  });

  it("supports vertical orientation", () => {
    render(<Bar orientation="vertical" />);
    expect(screen.getByRole("menubar")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("disables the whole bar (Base UI disables every trigger)", () => {
    render(<Bar disabled />);
    for (const name of ["File", "Edit", "View", "Help"]) {
      expect(screen.getByRole("menuitem", { name })).toHaveAttribute("aria-disabled", "true");
    }
  });

  /* ---------- typeahead ---------- */

  it("moves focus to the next trigger starting with a typed character", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("v");
    expect(screen.getByRole("menuitem", { name: "View" })).toHaveFocus();
    await user.keyboard("h");
    expect(screen.getByRole("menuitem", { name: "Help" })).toHaveFocus();
    // Wraps around
    await user.keyboard("f");
    expect(screen.getByRole("menuitem", { name: "File" })).toHaveFocus();
  });

  it("skips disabled triggers in typeahead", async () => {
    const user = userEvent.setup();
    render(<Bar editDisabled />);
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("e");
    expect(screen.getByRole("menuitem", { name: "File" })).toHaveFocus();
  });

  it("ignores typing with modifiers", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("{Control>}v{/Control}");
    expect(screen.getByRole("menuitem", { name: "File" })).toHaveFocus();
  });

  it("still calls the consumer's onKeyDown", async () => {
    const onKeyDown = vi.fn();
    const user = userEvent.setup();
    render(<Bar onKeyDown={onKeyDown} />);
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("v");
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("ignores typing inside an open menu", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByTestId("popup-File");
    await user.keyboard("v");
    expect(screen.getByRole("menuitem", { name: "View" })).not.toHaveFocus();
    expect(screen.queryByTestId("popup-View")).toBeNull();
  });

  /* ---------- ArrowUp ---------- */

  it("calls the consumer's onKeyDown on a trigger", async () => {
    const onKeyDown = vi.fn();
    const user = userEvent.setup();
    render(
      <Menubar aria-label="Application">
        <Menubar.Menu>
          <Menubar.Trigger onKeyDown={onKeyDown}>File</Menubar.Trigger>
        </Menubar.Menu>
      </Menubar>,
    );
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("{ArrowUp}");
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("leaves ArrowUp alone in a vertical bar (it moves between triggers)", async () => {
    const user = userEvent.setup();
    render(<Bar orientation="vertical" />);
    screen.getByRole("menuitem", { name: "Edit" }).focus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "File" })).toHaveFocus();
    expect(screen.queryByTestId("popup-Edit")).toBeNull();
  });

  it("opens the menu at its last item on ArrowUp", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("{ArrowUp}");
    await screen.findByTestId("popup-File");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-highlighted"),
    );
  });

  /* ---------- Left/Right between open menus (APG) ---------- */

  it("Right from an open menu opens the next one at its first enabled item, as a keyboard open", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByTestId("popup-File");
    await user.keyboard("{ArrowRight}");
    await screen.findByTestId("popup-Edit");
    // Redo is disabled, so the first enabled item (Undo) is highlighted
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Undo" })).toHaveAttribute("data-highlighted"),
    );
    expect(screen.getByTestId("popup-Edit")).toHaveAttribute("data-keyboard-open");
  });

  it("wraps from the first menu to the last with Left", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByTestId("popup-File");
    await user.keyboard("{ArrowLeft}");
    await screen.findByTestId("popup-Help");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Docs" })).toHaveAttribute("data-highlighted"),
    );
  });

  it("skips a disabled menu when moving between open menus", async () => {
    const user = userEvent.setup();
    render(<Bar editDisabled />);
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByTestId("popup-File");
    await user.keyboard("{ArrowRight}");
    await screen.findByTestId("popup-View");
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Zoom in" })).toHaveAttribute("data-highlighted"),
    );
  });

  it("leaves Left/Right to a text field inside a menu", async () => {
    const user = userEvent.setup();
    render(
      <Menubar aria-label="Application">
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Positioner>
              <Menubar.Popup data-testid="popup-File">
                <input aria-label="Rename" defaultValue="report" />
                <Menubar.Item>Save</Menubar.Item>
              </Menubar.Popup>
            </Menubar.Positioner>
          </Menubar.Portal>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Positioner>
              <Menubar.Popup data-testid="popup-Edit">
                <Menubar.Item>Copy</Menubar.Item>
              </Menubar.Popup>
            </Menubar.Positioner>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar>,
    );
    screen.getByRole("menuitem", { name: "File" }).focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByTestId("popup-File");
    const input = screen.getByRole("textbox", { name: "Rename" });
    input.focus();
    await user.keyboard("{ArrowRight}");
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => requestAnimationFrame(r));
    expect(input).toHaveFocus();
  });
});
