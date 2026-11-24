import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./Toggle";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";

afterEach(() => vi.restoreAllMocks());

const toggle = (name: string | RegExp) => screen.getByRole("button", { name });

describe("Toggle", () => {
  describe("semantics + pressed state", () => {
    it("is a button with aria-pressed that toggles (uncontrolled)", async () => {
      const user = userEvent.setup();
      render(<Toggle label="Pin" />);
      const t = toggle("Pin");
      expect(t).toHaveAttribute("aria-pressed", "false");
      expect(t).toHaveAttribute("data-slot", "toggle");
      await user.click(t);
      expect(t).toHaveAttribute("aria-pressed", "true");
      expect(t).toHaveAttribute("data-pressed");
    });

    it("supports controlled pressed + onPressedChange", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(<Toggle label="Pin" pressed={false} onPressedChange={onPressedChange} />);
      await user.click(toggle("Pin"));
      expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
      expect(toggle("Pin")).toHaveAttribute("aria-pressed", "false");
    });

    it("Space and Enter toggle", async () => {
      const user = userEvent.setup();
      render(<Toggle label="Pin" />);
      await user.tab();
      await user.keyboard(" ");
      expect(toggle("Pin")).toHaveAttribute("aria-pressed", "true");
      await user.keyboard("{Enter}");
      expect(toggle("Pin")).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("variants, colours, sizes", () => {
    it("defaults to outline/default/md and sets data-variant", () => {
      render(<Toggle label="Pin" />);
      const t = toggle("Pin");
      expect(t).toHaveAttribute("data-variant", "outline");
      expect(t.className).toContain("h-[var(--sp-control-height)]");
      expect(t.className).toContain("data-[pressed]:border-accent");
    });

    it("pressed isn't colour alone: outline adds an inner outline, ghost gains a border", () => {
      const { rerender } = render(<Toggle label="Pin" />);
      // An outline, not a box-shadow: the focus ring is a box-shadow and must not be overridden.
      expect(toggle("Pin").className).toContain(
        "data-[pressed]:outline-1 data-[pressed]:outline-accent",
      );
      expect(toggle("Pin").className).not.toContain("data-[pressed]:shadow-");
      rerender(<Toggle label="Pin" variant="ghost" />);
      expect(toggle("Pin").className).toContain("border-transparent");
      expect(toggle("Pin").className).toContain("data-[pressed]:border-accent");
    });

    it.each([
      ["brand", "data-[pressed]:border-brand"],
      ["danger", "data-[pressed]:border-danger"],
      ["inverse", "data-[pressed]:border-surface-base"],
    ] as const)("color=%s", (color, cls) => {
      render(<Toggle label="Pin" color={color} />);
      expect(toggle("Pin").className).toContain(cls);
    });

    it("solid goes from a muted fill to the full fill", () => {
      render(<Toggle label="Pin" variant="solid" />);
      expect(toggle("Pin").className).toContain("bg-surface-sunken");
      expect(toggle("Pin").className).toContain("data-[pressed]:bg-accent");
    });

    it.each([
      ["sm", "h-[var(--sp-control-height-sm)]"],
      ["lg", "h-[var(--sp-control-height-lg)]"],
    ] as const)("size=%s", (size, cls) => {
      render(<Toggle label="Pin" size={size} />);
      expect(toggle("Pin").className).toContain(cls);
    });
  });

  describe("icons + indicator", () => {
    it("pressedIcon swaps the icon via CSS; the accessible name doesn't change", async () => {
      const user = userEvent.setup();
      render(
        <Toggle
          size="icon"
          srOnly="Favourite"
          icon={<svg data-testid="off" />}
          pressedIcon={<svg data-testid="on" />}
        />,
      );
      expect(screen.getByTestId("off").parentElement?.className).toContain(
        "group-data-[pressed]/toggle:hidden",
      );
      expect(screen.getByTestId("on").parentElement?.className).toContain(
        "hidden group-data-[pressed]/toggle:inline-flex",
      );
      await user.click(toggle("Favourite"));
      expect(toggle("Favourite")).toHaveAttribute("aria-pressed", "true");
    });

    it("indicator renders a hidden-until-pressed check that reserves space", () => {
      render(<Toggle label="Pin" indicator />);
      const ind = toggle("Pin").querySelector("[data-slot=toggle-indicator]");
      expect(ind).toHaveAttribute("aria-hidden", "true");
      expect(ind?.className).toContain("opacity-0");
      expect(ind?.className).toContain("group-data-[pressed]/toggle:opacity-100");
    });

    it("warns when icon-only has no accessible name", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Toggle size="icon" icon={<svg />} />);
      expect(warn.mock.calls.some((c) => String(c[0]).includes("accessible name"))).toBe(true);
    });

    it("does not warn when icon-only is named", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Toggle size="icon" icon={<svg />} srOnly="Bold" />);
      expect(warn).not.toHaveBeenCalled();
      expect(toggle("Bold")).toBeInTheDocument();
    });
  });

  describe("loading, readOnly, inactive, disabled, invalid", () => {
    it("loading shows a spinner, is busy and can't toggle", async () => {
      const user = userEvent.setup();
      render(<Toggle label="Pin" loading />);
      const t = toggle(/Pin/);
      expect(t).toHaveAttribute("aria-busy", "true");
      expect(t).toBeDisabled();
      await user.click(t);
      expect(t).toHaveAttribute("aria-pressed", "false");
    });

    it("the loading spinner doesn't join the name (WCAG 2.5.3)", () => {
      render(<Toggle label="Pin" loading />);
      // The name is the visible label; aria-busy says it's busy, not a status inside it
      expect(toggle("Pin")).toHaveAccessibleName("Pin");
      expect(screen.queryByRole("status")).toBeNull();
    });

    it("readOnly stays focusable but the state can't change", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(<Toggle label="Pin" readOnly defaultPressed onPressedChange={onPressedChange} />);
      const t = toggle("Pin");
      expect(t).toHaveAttribute("data-readonly");
      expect(t).toHaveAttribute("aria-disabled", "true");
      await user.tab();
      expect(t).toHaveFocus();
      await user.click(t);
      await user.keyboard(" ");
      expect(t).toHaveAttribute("aria-pressed", "true");
      expect(onPressedChange).not.toHaveBeenCalled();
    });

    it("inactive looks disabled, stays focusable and can't toggle", async () => {
      const user = userEvent.setup();
      render(<Toggle label="Pin" inactive />);
      const t = toggle("Pin");
      expect(t).toHaveAttribute("data-inactive");
      expect(t).toHaveAttribute("aria-disabled", "true");
      expect(t).not.toBeDisabled();
      expect(t.className).toContain("opacity-[var(--sp-state-disabled-opacity)]");
      expect(t.className).not.toMatch(/(^|\s)hover:/);
      await user.tab();
      expect(t).toHaveFocus();
      await user.click(t);
      expect(t).toHaveAttribute("aria-pressed", "false");
    });

    it("disabled is skipped by Tab", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Toggle label="Off" disabled />
          <Toggle label="On" />
        </>,
      );
      await user.tab();
      expect(toggle("On")).toHaveFocus();
      expect(toggle("Off")).toBeDisabled();
    });

    it("invalid draws the danger border from aria-invalid", () => {
      render(<Toggle label="Pin" aria-invalid />);
      expect(toggle("Pin")).toHaveAttribute("aria-invalid", "true");
      expect(toggle("Pin").className).toContain("aria-[invalid=true]:!border-danger");
    });
  });

  describe("form integration", () => {
    it("submits value (default 'on') only while pressed", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <form>
          <Toggle label="Bold" name="bold" />
          <Toggle label="Underline" name="underline" value="yes" defaultPressed />
        </form>,
      );
      const form = container.querySelector("form")!;
      expect(Object.fromEntries(new FormData(form))).toEqual({ underline: "yes" });
      await user.click(toggle("Bold"));
      expect(Object.fromEntries(new FormData(form))).toEqual({ bold: "on", underline: "yes" });
    });

    it("follows the controlled pressed prop", () => {
      const { container, rerender } = render(
        <form>
          <Toggle label="Bold" name="bold" pressed={false} />
        </form>,
      );
      const form = container.querySelector("form")!;
      expect(Object.fromEntries(new FormData(form))).toEqual({});
      rerender(
        <form>
          <Toggle label="Bold" name="bold" pressed />
        </form>,
      );
      expect(Object.fromEntries(new FormData(form))).toEqual({ bold: "on" });
    });
  });

  describe("width", () => {
    it("fits its content by default; className w-full overrides", () => {
      const { rerender } = render(<Toggle label="Pin" />);
      expect(toggle("Pin").className).toContain("w-fit");
      rerender(<Toggle label="Pin" className="w-full" />);
      expect(toggle("Pin").className).toContain("w-full");
      expect(toggle("Pin").className).not.toContain("w-fit");
    });

    it("inside a ButtonGroup the group's layout decides (w-auto override)", () => {
      render(
        <ButtonGroup.Root aria-label="Fmt" orientation="vertical" attached>
          <Toggle label="Bold" />
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("group", { name: "Fmt" }).className).toContain(
        "[&>[data-slot=toggle]:not([data-icon-only])]:w-auto",
      );
    });

    it("icon-only toggles keep their square inside a group (regression)", () => {
      render(
        <ButtonGroup.Root aria-label="Fmt" attached>
          <Toggle size="icon" icon={<svg />} srOnly="Bold" />
        </ButtonGroup.Root>,
      );
      expect(toggle("Bold")).toHaveAttribute("data-icon-only");
      expect(toggle("Bold").className).toContain("w-[var(--sp-control-height)]");
    });
  });

  describe("ButtonGroup integration", () => {
    it("inherits size/variant/color and the group's disabled", () => {
      render(
        <ButtonGroup.Root aria-label="Fmt" variant="ghost" color="danger" size="sm" disabled>
          <Toggle label="Bold" />
          <Toggle size="icon" icon={<svg />} srOnly="Italic" />
        </ButtonGroup.Root>,
      );
      const bold = toggle("Bold");
      expect(bold).toHaveAttribute("data-variant", "ghost");
      expect(bold.className).toContain("data-[pressed]:border-danger");
      expect(bold.className).toContain("h-[var(--sp-control-height-sm)]");
      expect(bold).toBeDisabled();
      expect(toggle("Italic").className).toContain("w-[var(--sp-control-height-sm)]");
    });

    it("a Toggle's own props win", () => {
      render(
        <ButtonGroup.Root aria-label="Fmt" variant="ghost">
          <Toggle label="Bold" variant="solid" />
        </ButtonGroup.Root>,
      );
      expect(toggle("Bold")).toHaveAttribute("data-variant", "solid");
    });
  });
});
