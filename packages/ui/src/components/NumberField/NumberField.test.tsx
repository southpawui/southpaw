import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberField, type NumberFieldRootProps, type NumberFieldGroupProps } from "./NumberField";
import { Field } from "../Field/Field";

function Labelled({
  group,
  invalid,
  ...root
}: NumberFieldRootProps & { group?: NumberFieldGroupProps; invalid?: boolean }) {
  return (
    <Field.Root invalid={invalid}>
      <Field.Label>Quantity</Field.Label>
      <NumberField.Root {...root}>
        <NumberField.Group {...group} />
      </NumberField.Root>
    </Field.Root>
  );
}

const input = () => screen.getByRole("textbox", { name: "Quantity" });
const group = (c: HTMLElement) => c.querySelector<HTMLElement>("[data-slot='number-field-group']")!;
const slots = (c: HTMLElement) =>
  Array.from(group(c).children).map((el) => el.getAttribute("data-slot"));

/** Make the group report a given rendered height (jsdom has no layout). */
function mockGroupHeight(height: number) {
  return vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const h = this.getAttribute("data-slot") === "number-field-group" ? height : 0;
    return { height: h, width: 0, top: 0, left: 0, right: 0, bottom: h, x: 0, y: 0, toJSON() {} };
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("NumberField", () => {
  describe("labelling + slots", () => {
    it("labels the input from Field.Label", () => {
      render(<Labelled defaultValue={1} />);
      expect(input()).toHaveValue("1");
    });

    it("adds data-slot to root, group and input", () => {
      const { container } = render(<Labelled />);
      expect(container.querySelector("[data-slot='number-field']")).toBeInTheDocument();
      expect(group(container)).toHaveAttribute("role", "group");
      expect(container.querySelector("[data-slot='number-field-input']")).toBeInTheDocument();
    });

    it("passes inputProps to the auto-rendered input (no Field)", () => {
      render(
        <NumberField.Root defaultValue={3}>
          <NumberField.Group inputProps={{ "aria-label": "Page", placeholder: "1" }} />
        </NumberField.Root>,
      );
      const el = screen.getByRole("textbox", { name: "Page" });
      expect(el).toHaveAttribute("placeholder", "1");
    });

    it("labels the steppers Increase / Decrease and keeps them out of the tab order", () => {
      render(<Labelled />);
      for (const name of ["Increase", "Decrease"]) {
        const btn = screen.getByRole("button", { name });
        expect(btn).toHaveAttribute("tabindex", "-1");
      }
    });
  });

  describe("controls layouts", () => {
    it('defaults to "end": input, decrement, increment', () => {
      const { container } = render(<Labelled />);
      expect(group(container)).toHaveAttribute("data-controls", "end");
      expect(slots(container)).toEqual([
        "number-field-input",
        "number-field-decrement",
        "number-field-increment",
      ]);
      expect(input().className).toContain("text-start");
    });

    it('"split" puts decrement first and centres the value', () => {
      const { container } = render(<Labelled controls="split" />);
      expect(slots(container)).toEqual([
        "number-field-decrement",
        "number-field-input",
        "number-field-increment",
      ]);
      expect(input().className).toContain("text-center");
    });

    it('"none" renders no steppers', () => {
      render(<Labelled controls="none" />);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it('"stacked" renders when each half is at least 24px', () => {
      mockGroupHeight(48);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { container } = render(<Labelled controls="stacked" />);
      expect(group(container)).toHaveAttribute("data-controls", "stacked");
      const stepper = container.querySelector<HTMLElement>("[data-slot='number-field-stepper']")!;
      expect(stepper).toBeInTheDocument();
      expect(
        within(stepper)
          .getAllByRole("button")
          .map((b) => b.getAttribute("aria-label")),
      ).toEqual(["Increase", "Decrease"]);
      expect(warn).not.toHaveBeenCalled();
    });

    it('"stacked" falls back to "end" and warns once when halves are under 24px', () => {
      mockGroupHeight(40);
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { container, rerender } = render(<Labelled controls="stacked" />);
      expect(group(container)).toHaveAttribute("data-controls", "end");
      expect(container.querySelector("[data-slot='number-field-stepper']")).not.toBeInTheDocument();
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain("WCAG 2.5.8");
      rerender(<Labelled controls="stacked" defaultValue={2} />);
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it('re-checks on resize: "stacked" recovers once the group is tall enough', () => {
      // Regression (sign-off /improve #3): e.g. a field first rendered inside a hidden panel.
      let height = 40;
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
        this: HTMLElement,
      ) {
        const h = this.getAttribute("data-slot") === "number-field-group" ? height : 0;
        return {
          height: h,
          width: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: h,
          x: 0,
          y: 0,
          toJSON() {},
        };
      });
      vi.spyOn(console, "warn").mockImplementation(() => {});
      let fire = () => {};
      const disconnect = vi.fn();
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(cb: () => void) {
            fire = cb;
          }
          observe() {}
          disconnect = disconnect;
        },
      );
      const { container, unmount } = render(<Labelled controls="stacked" />);
      expect(group(container)).toHaveAttribute("data-controls", "end");
      height = 48;
      act(() => fire());
      expect(group(container)).toHaveAttribute("data-controls", "stacked");
      height = 32;
      act(() => fire());
      expect(group(container)).toHaveAttribute("data-controls", "end");
      unmount();
      expect(disconnect).toHaveBeenCalled();
    });

    it("renders children instead of auto-composing (manual composition)", () => {
      const { container } = render(
        <Field.Root>
          <Field.Label>Quantity</Field.Label>
          <NumberField.Root>
            <NumberField.Group>
              <NumberField.Input />
              <NumberField.Increment>Up</NumberField.Increment>
            </NumberField.Group>
          </NumberField.Root>
        </Field.Root>,
      );
      expect(slots(container)).toEqual(["number-field-input", "number-field-increment"]);
      expect(screen.getByRole("button", { name: "Increase" })).toHaveTextContent("Up");
    });

    it("renders Phosphor icons in the steppers by default", () => {
      render(<Labelled />);
      expect(screen.getByRole("button", { name: "Increase" }).querySelector("svg")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  });

  describe("behaviour", () => {
    it("increments and decrements via the buttons", async () => {
      const user = userEvent.setup();
      render(<Labelled defaultValue={5} />);
      await user.click(screen.getByRole("button", { name: "Increase" }));
      expect(input()).toHaveValue("6");
      await user.click(screen.getByRole("button", { name: "Decrease" }));
      await user.click(screen.getByRole("button", { name: "Decrease" }));
      expect(input()).toHaveValue("4");
    });

    it("steps with the arrow keys", async () => {
      const user = userEvent.setup();
      render(<Labelled defaultValue={5} step={5} />);
      await user.click(input());
      await user.keyboard("{ArrowUp}");
      expect(input()).toHaveValue("10");
    });

    it("disables the stepper at a limit", () => {
      render(<Labelled defaultValue={10} max={10} />);
      expect(screen.getByRole("button", { name: "Increase" })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
      expect(screen.getByRole("button", { name: "Decrease" })).toHaveAttribute(
        "aria-disabled",
        "false",
      );
    });

    it("marks steppers aria-disabled when read-only", () => {
      const { container } = render(<Labelled readOnly defaultValue={2} />);
      expect(group(container)).toHaveAttribute("data-readonly");
      expect(screen.getByRole("button", { name: "Increase" })).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("formats with Intl options", () => {
      render(<Labelled defaultValue={9.5} format={{ style: "currency", currency: "GBP" }} />);
      expect(input()).toHaveValue("£9.50");
    });

    it("selects the value on focus when selectOnFocus is set", async () => {
      const user = userEvent.setup();
      render(<Labelled defaultValue={250} selectOnFocus />);
      await user.click(input());
      const el = input() as HTMLInputElement;
      expect([el.selectionStart, el.selectionEnd]).toEqual([0, 3]);
    });

    it("does not select on focus by default", async () => {
      const user = userEvent.setup();
      render(<Labelled defaultValue={250} />);
      await user.click(input());
      const el = input() as HTMLInputElement;
      expect(el.selectionEnd! - el.selectionStart!).toBe(0);
    });

    it("still calls a consumer onFocus with selectOnFocus", async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<Labelled selectOnFocus group={{ inputProps: { onFocus } }} />);
      await user.click(input());
      expect(onFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe("states", () => {
    it("valid sets data-success", () => {
      const { container } = render(<Labelled valid />);
      expect(group(container)).toHaveAttribute("data-success");
    });

    it("warning sets data-warning and overrides valid", () => {
      const { container } = render(<Labelled valid warning />);
      expect(group(container)).toHaveAttribute("data-warning");
      expect(group(container)).not.toHaveAttribute("data-success");
    });

    it("picks up invalid from Field", () => {
      const { container } = render(<Labelled invalid />);
      expect(group(container)).toHaveAttribute("data-invalid");
      expect(input()).toHaveAttribute("aria-invalid", "true");
    });

    it("loading shows a labelled spinner and marks the input busy", () => {
      const { container } = render(<Labelled loading />);
      expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
      expect(input()).toHaveAttribute("aria-busy", "true");
      expect(group(container)).toHaveAttribute("data-loading");
    });

    it("disabled disables the input", () => {
      render(<Labelled disabled />);
      expect(input()).toBeDisabled();
    });

    it("looks disabled when an ancestor <fieldset disabled> disables it (regression)", () => {
      // Base UI sets no data-disabled/aria-disabled in this case; only native :disabled matches.
      const { container } = render(
        <fieldset disabled>
          <Labelled />
        </fieldset>,
      );
      expect(input()).toBeDisabled();
      expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
      expect(group(container)).not.toHaveAttribute("data-disabled");
      expect(group(container).className).toContain(
        "has-[input:disabled]:opacity-[var(--sp-state-disabled-opacity)]",
      );
      expect(screen.getByRole("button", { name: "Increase" }).className).toContain(
        "disabled:[&_svg]:opacity-[var(--sp-state-disabled-opacity)]",
      );
    });
  });

  describe("adornments + size", () => {
    it("renders prepend and append around the input", () => {
      const { container } = render(<Labelled group={{ prepend: "£", append: "each" }} />);
      expect(slots(container)).toEqual([
        "number-field-prepend",
        "number-field-input",
        "number-field-append",
        "number-field-decrement",
        "number-field-increment",
      ]);
      expect(container.querySelector("[data-slot='number-field-prepend']")).toHaveTextContent("£");
    });

    it("keeps split steppers on the outside of adornments", () => {
      const { container } = render(<Labelled controls="split" group={{ prepend: "£" }} />);
      expect(slots(container)).toEqual([
        "number-field-decrement",
        "number-field-prepend",
        "number-field-input",
        "number-field-increment",
      ]);
    });

    it.each([
      ["sm", "--sp-control-height-sm"],
      ["md", "--sp-control-height)"],
      ["lg", "--sp-control-height-lg"],
    ] as const)("size %s maps to %s", (size, token) => {
      const { container } = render(<Labelled size={size} />);
      const root = container.querySelector("[data-slot='number-field']")!;
      expect(root).toHaveAttribute("data-size", size);
      expect(root.className).toContain(token);
    });

    it("lets adornments inherit the lg text size", () => {
      // Regression (sign-off /improve #2): addons were pinned to text-sm.
      const { container } = render(<Labelled size="lg" group={{ append: "kg" }} />);
      expect(group(container).className).toContain("text-base");
      expect(container.querySelector("[data-slot='number-field-append']")!.className).not.toContain(
        "text-sm",
      );
    });

    it("renders the scrub area slot", () => {
      const { container } = render(
        <NumberField.Root>
          <NumberField.ScrubArea>
            <span>Drag</span>
          </NumberField.ScrubArea>
          <NumberField.Group inputProps={{ "aria-label": "Value" }} />
        </NumberField.Root>,
      );
      expect(container.querySelector("[data-slot='number-field-scrub-area']")).toBeInTheDocument();
    });
  });

  describe("className", () => {
    // Regression (sign-off /improve #1): Base UI allows className as a function of
    // state, but cn()/clsx silently dropped functions.
    it("accepts a state function on Root, Group and Input", () => {
      const fn = (prefix: string) => (state: { disabled: boolean }) =>
        `${prefix}-${state.disabled ? "off" : "on"}`;
      const { container } = render(
        <Field.Root>
          <Field.Label>Quantity</Field.Label>
          <NumberField.Root disabled className={fn("root")}>
            <NumberField.Group className={fn("group")} inputProps={{ className: fn("input") }} />
          </NumberField.Root>
        </Field.Root>,
      );
      expect(container.querySelector("[data-slot='number-field']")).toHaveClass("root-off");
      expect(group(container)).toHaveClass("group-off", "border-2");
      expect(input()).toHaveClass("input-off", "tabular-nums");
    });

    it("accepts a state function on the steppers and keeps base classes", () => {
      render(
        <Field.Root>
          <Field.Label>Quantity</Field.Label>
          <NumberField.Root defaultValue={1}>
            <NumberField.Group>
              <NumberField.Input />
              <NumberField.Increment className={() => "custom-inc"} />
            </NumberField.Group>
          </NumberField.Root>
        </Field.Root>,
      );
      expect(screen.getByRole("button", { name: "Increase" })).toHaveClass(
        "custom-inc",
        "aspect-square",
      );
    });

    it("still merges string classNames", () => {
      const { container } = render(<Labelled className="custom-root" />);
      expect(container.querySelector("[data-slot='number-field']")).toHaveClass(
        "custom-root",
        "flex",
      );
    });
  });
});
