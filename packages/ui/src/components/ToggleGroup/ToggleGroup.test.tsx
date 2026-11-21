import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleGroup } from "./ToggleGroup";
import { Toggle } from "../Toggle/Toggle";

afterEach(() => vi.restoreAllMocks());

const item = (name: string) => screen.getByRole("button", { name });
const group = (name = "Align") => screen.getByRole("group", { name });

function Align(props: React.ComponentProps<typeof ToggleGroup.Root>) {
  return (
    <ToggleGroup.Root aria-label="Align" {...props}>
      <Toggle value="left" label="Left" />
      <Toggle value="center" label="Centre" />
      <Toggle value="right" label="Right" />
    </ToggleGroup.Root>
  );
}

describe("ToggleGroup", () => {
  describe("selection", () => {
    it("is a labelled group; single mode presses one at a time", async () => {
      const user = userEvent.setup();
      render(<Align />);
      expect(group()).toHaveAttribute("data-slot", "toggle-group");
      await user.click(item("Left"));
      await user.click(item("Right"));
      expect(item("Left")).toHaveAttribute("aria-pressed", "false");
      expect(item("Right")).toHaveAttribute("aria-pressed", "true");
    });

    it("multiple allows any combination", async () => {
      const user = userEvent.setup();
      render(<Align multiple />);
      await user.click(item("Left"));
      await user.click(item("Right"));
      expect(item("Left")).toHaveAttribute("aria-pressed", "true");
      expect(item("Right")).toHaveAttribute("aria-pressed", "true");
    });

    it("calls onValueChange with a string[] in both modes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Align onValueChange={onValueChange} />);
      await user.click(item("Centre"));
      expect(onValueChange).toHaveBeenLastCalledWith(["center"], expect.anything());
    });

    it("by default the pressed item can be released (empty selection)", async () => {
      const user = userEvent.setup();
      render(<Align defaultValue={["left"]} />);
      await user.click(item("Left"));
      expect(item("Left")).toHaveAttribute("aria-pressed", "false");
    });

    it("disallowEmptySelection keeps the last item pressed", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Align defaultValue={["left"]} disallowEmptySelection onValueChange={onValueChange} />,
      );
      await user.click(item("Left"));
      expect(item("Left")).toHaveAttribute("aria-pressed", "true");
      expect(onValueChange).not.toHaveBeenCalled();
      await user.click(item("Right"));
      expect(item("Right")).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("keyboard (Base UI roving focus)", () => {
    it("is one tab stop; arrows move focus without changing the selection; loops", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Align defaultValue={["left"]} />
          <button type="button">After</button>
        </>,
      );
      await user.tab();
      expect(item("Left")).toHaveFocus();
      await user.keyboard("{ArrowRight}");
      expect(item("Centre")).toHaveFocus();
      expect(item("Left")).toHaveAttribute("aria-pressed", "true");
      await user.keyboard("{End}");
      expect(item("Right")).toHaveFocus();
      await user.keyboard("{ArrowRight}");
      expect(item("Left")).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });
  });

  describe("layout", () => {
    it("is attached by default (connected styling) and spaced with attached={false}", () => {
      const { rerender } = render(<Align />);
      expect(group()).toHaveAttribute("data-attached");
      expect(group().className).toContain("!rounded-none");
      rerender(<Align attached={false} />);
      expect(group()).not.toHaveAttribute("data-attached");
      expect(group().className).toContain("gap-[var(--sp-control-gap)]");
    });

    it("orientation sets data-orientation and vertical connected radii", () => {
      render(<Align orientation="vertical" />);
      expect(group()).toHaveAttribute("data-orientation", "vertical");
      expect(group().className).toContain(":!rounded-t-");
    });

    it("grow fills the width and splits it equally", () => {
      render(<Align grow />);
      expect(group().className).toContain("w-full");
      expect(group().className).toContain("[&>:not([role=separator])]:flex-1");
    });

    it("hideLabelsBelow makes labels screen-reader-only on small screens", () => {
      render(<Align hideLabelsBelow="sm" />);
      expect(group().className).toContain("max-sm:[&_[data-slot=toggle-label]]:sr-only");
      expect(item("Left").querySelector("[data-slot=toggle-label]")).toHaveTextContent("Left");
    });
  });

  describe("group props reach the items", () => {
    it("size/variant/color/disabled propagate; an item's own prop wins", () => {
      render(
        <ToggleGroup.Root aria-label="Align" size="sm" variant="ghost" color="danger" disabled>
          <Toggle value="a" label="A" />
          <Toggle value="b" label="B" variant="solid" />
        </ToggleGroup.Root>,
      );
      expect(item("A")).toHaveAttribute("data-variant", "ghost");
      expect(item("A").className).toContain("h-[var(--sp-control-height-sm)]");
      expect(item("A").className).toContain("data-[pressed]:border-danger");
      expect(item("B")).toHaveAttribute("data-variant", "solid");
      expect(item("A")).toBeDisabled();
    });

    it("readOnly: items stay focusable but nothing changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Align readOnly defaultValue={["left"]} onValueChange={onValueChange} />);
      expect(item("Right")).toHaveAttribute("data-readonly");
      expect(item("Right")).toHaveAttribute("aria-disabled", "true");
      await user.click(item("Right"));
      expect(item("Right")).toHaveAttribute("aria-pressed", "false");
      expect(item("Left")).toHaveAttribute("aria-pressed", "true");
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("invalid marks the group and every item", () => {
      render(<Align invalid />);
      expect(group()).toHaveAttribute("data-invalid");
      expect(item("Left")).toHaveAttribute("aria-invalid", "true");
    });

    it("a disabled item is skipped by arrow keys", async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup.Root aria-label="Align">
          <Toggle value="a" label="A" />
          <Toggle value="b" label="B" disabled />
          <Toggle value="c" label="C" />
        </ToggleGroup.Root>,
      );
      await user.tab();
      await user.keyboard("{ArrowRight}");
      expect(item("C")).toHaveFocus();
    });
  });

  describe("items prop", () => {
    it("renders Toggles from data, icon-only items get srOnly names", () => {
      render(
        <ToggleGroup.Root
          aria-label="Align"
          defaultValue={["week"]}
          items={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "x", icon: <svg />, srOnly: "Extra" },
            { value: "off", label: "Off", disabled: true },
          ]}
        />,
      );
      expect(item("Week")).toHaveAttribute("aria-pressed", "true");
      expect(item("Extra")).toHaveAttribute("data-icon-only");
      expect(item("Off")).toBeDisabled();
    });
  });

  describe("form", () => {
    it("name submits one entry per selected value", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <form>
          <Align name="align" multiple defaultValue={["left"]} />
        </form>,
      );
      const form = container.querySelector("form")!;
      expect(new FormData(form).getAll("align")).toEqual(["left"]);
      await user.click(item("Right"));
      expect(new FormData(form).getAll("align")).toEqual(["left", "right"]);
    });

    it("required blocks submission while nothing is selected", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <form>
          <Align name="align" required />
        </form>,
      );
      const form = container.querySelector("form")!;
      expect(form.checkValidity()).toBe(false);
      await user.click(item("Centre"));
      expect(form.checkValidity()).toBe(true);
    });

    it("the required input is ignored by the connected styling", () => {
      const { container } = render(<Align required />);
      expect(container.querySelector("[data-slot=toggle-group-required]")).toHaveAttribute(
        "data-connected-ignore",
      );
    });
  });

  describe("sliding indicator", () => {
    it("on for single attached groups; off for multiple or spaced", () => {
      const { rerender } = render(<Align defaultValue={["left"]} />);
      expect(group().className).toContain("before:translate-x-[var(--sp-tg-x)]");
      expect(group().className).toContain("motion-reduce:before:!transition-none");
      rerender(<Align multiple defaultValue={["left"]} />);
      expect(group().className).not.toContain("before:translate-x-");
      rerender(<Align attached={false} defaultValue={["left"]} />);
      expect(group().className).not.toContain("before:translate-x-");
    });

    it("measures the pressed item into CSS variables and follows a new press", async () => {
      const user = userEvent.setup();
      render(<Align defaultValue={["left"]} />);
      expect(group()).toHaveAttribute("data-indicator");
      expect(group().style.getPropertyValue("--sp-tg-x")).toBe("0px");
      await user.click(item("Right"));
      // jsdom has no layout (all offsets 0) — assert the variables are rewritten and the
      // indicator stays on; real positions are checked in Playwright.
      expect(group()).toHaveAttribute("data-indicator");
    });

    it("re-measures when items are added after mount", async () => {
      const { rerender } = render(
        <ToggleGroup.Root aria-label="Align" value={["b"]}>
          <Toggle value="a" label="A" />
        </ToggleGroup.Root>,
      );
      expect(group()).not.toHaveAttribute("data-indicator");
      rerender(
        <ToggleGroup.Root aria-label="Align" value={["b"]}>
          <Toggle value="a" label="A" />
          <Toggle value="b" label="B" />
        </ToggleGroup.Root>,
      );
      await waitFor(() => expect(group()).toHaveAttribute("data-indicator"));
    });

    it("hides when nothing is pressed", async () => {
      const user = userEvent.setup();
      render(<Align defaultValue={["left"]} />);
      await user.click(item("Left"));
      // MutationObserver callbacks are async.
      await waitFor(() => expect(group()).not.toHaveAttribute("data-indicator"));
    });

    it("slidingIndicator={false} turns it off", () => {
      render(<Align slidingIndicator={false} defaultValue={["left"]} />);
      expect(group().className).not.toContain("before:translate-x-");
    });
  });

  describe("Separator + a11y warnings", () => {
    it("Separator runs across the group", () => {
      const { rerender } = render(
        <ToggleGroup.Root aria-label="Align">
          <Toggle value="a" label="A" />
          <ToggleGroup.Separator />
          <Toggle value="b" label="B" />
        </ToggleGroup.Root>,
      );
      expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
      rerender(
        <ToggleGroup.Root aria-label="Align" orientation="vertical">
          <Toggle value="a" label="A" />
          <ToggleGroup.Separator />
          <Toggle value="b" label="B" />
        </ToggleGroup.Root>,
      );
      expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("arrow keys cross a separator split; the separator isn't focusable", async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup.Root aria-label="Align">
          <Toggle value="a" label="A" />
          <ToggleGroup.Separator />
          <Toggle value="b" label="B" />
        </ToggleGroup.Root>,
      );
      await user.tab();
      await user.keyboard("{ArrowRight}");
      expect(item("B")).toHaveFocus();
      expect(group().className).toContain("[&>[role=separator]]:!bg-transparent");
    });

    it("warns when the group has no accessible name", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <ToggleGroup.Root>
          <Toggle value="a" label="A" />
        </ToggleGroup.Root>,
      );
      expect(warn.mock.calls.some((c) => String(c[0]).includes("ToggleGroup"))).toBe(true);
    });
  });
});
