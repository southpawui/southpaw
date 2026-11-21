import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OTPField, defaultSlotLabel, type OTPFieldRootProps } from "./OTPField";
import { Field } from "../Field/Field";
import { Form } from "../Form/Form";

function Labelled({ invalid, ...root }: OTPFieldRootProps & { invalid?: boolean }) {
  return (
    <Field.Root invalid={invalid}>
      <Field.Label>Verification code</Field.Label>
      <OTPField.Root {...root} />
    </Field.Root>
  );
}

const slots = (c: HTMLElement) =>
  Array.from(c.querySelectorAll<HTMLInputElement>("[data-slot='otp-field-input']"));
const root = (c: HTMLElement) => c.querySelector<HTMLElement>("[data-slot='otp-field']")!;

afterEach(() => vi.restoreAllMocks());

describe("OTPField", () => {
  describe("auto-render", () => {
    it("renders `length` slots inside a group labelled by the Field", () => {
      const { container } = render(<Labelled length={6} />);
      expect(slots(container)).toHaveLength(6);
      expect(screen.getByRole("group", { name: "Verification code" })).toBe(root(container));
    });

    it("derives length from groups and inserts a separator between groups", () => {
      const { container } = render(<Labelled groups={[3, 3]} />);
      expect(slots(container)).toHaveLength(6);
      expect(container.querySelectorAll("[data-slot='otp-field-group']")).toHaveLength(2);
      expect(screen.getAllByRole("separator")).toHaveLength(1);
    });

    it("renders n-1 separators for n groups", () => {
      render(<Labelled groups={[2, 2, 2]} />);
      expect(screen.getAllByRole("separator")).toHaveLength(2);
    });

    it("accepts a separator node and wraps it in a separator", () => {
      render(<Labelled groups={[3, 3]} separator={<span>·</span>} />);
      expect(screen.getByRole("separator")).toHaveTextContent("·");
    });

    it("accepts a separator function of the index", () => {
      render(<Labelled groups={[2, 2, 2]} separator={(i) => `#${i}`} />);
      expect(screen.getAllByRole("separator").map((s) => s.textContent)).toEqual(["#0", "#1"]);
    });

    it("renders no separator when separator is null", () => {
      const { container } = render(<Labelled groups={[3, 3]} separator={null} />);
      expect(screen.queryByRole("separator")).not.toBeInTheDocument();
      expect(container.querySelectorAll("[data-slot='otp-field-group']")).toHaveLength(2);
    });

    it("warns once and falls back to `length` slots when groups don't add up", () => {
      // Regression (sign-off /improve): the warning ran on every render, and the mismatched
      // groups rendered 5 slots against length 6, which Base UI can't drive.
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      const { container, rerender } = render(<Labelled length={6} groups={[3, 2]} />);
      rerender(<Labelled length={6} groups={[3, 2]} placeholder="○" />);
      const ours = warn.mock.calls.filter((c) => String(c[0]).includes("add up to 5"));
      expect(ours).toHaveLength(1);
      expect(slots(container)).toHaveLength(6);
      expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    });

    it("renders children instead of auto-rendering (manual composition)", () => {
      const { container } = render(
        <Field.Root>
          <Field.Label>Code</Field.Label>
          <OTPField.Root length={2}>
            <OTPField.Input />
            <OTPField.Input aria-label="Second" />
          </OTPField.Root>
        </Field.Root>,
      );
      expect(slots(container)).toHaveLength(2);
      expect(screen.getByRole("textbox", { name: "Second" })).toBeInTheDocument();
    });
  });

  describe("slot labels", () => {
    it('names slots 2..N "Character n of N"; slot 1 uses the Field label', () => {
      const { container } = render(<Labelled length={4} />);
      const s = slots(container);
      expect(s[0]).not.toHaveAttribute("aria-label");
      expect(s[0]).toHaveAttribute("aria-labelledby");
      expect(s.slice(1).map((i) => i.getAttribute("aria-label"))).toEqual([
        "Character 2 of 4",
        "Character 3 of 4",
        "Character 4 of 4",
      ]);
    });

    it("counts across groups", () => {
      const { container } = render(<Labelled groups={[3, 3]} />);
      expect(slots(container)[4]).toHaveAttribute("aria-label", "Character 5 of 6");
    });

    it("uses getSlotLabel for translation", () => {
      render(<Labelled length={3} getSlotLabel={(i, n) => `Caractère ${i + 1} sur ${n}`} />);
      expect(screen.getByRole("textbox", { name: "Caractère 3 sur 3" })).toBeInTheDocument();
    });

    it("exposes the default label function", () => {
      expect(defaultSlotLabel(1, 6)).toBe("Character 2 of 6");
    });
  });

  describe("behaviour", () => {
    it("fills slots as you type and calls onValueComplete", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      const { container } = render(<Labelled length={4} onValueComplete={onComplete} />);
      await user.click(slots(container)[0]);
      await user.keyboard("1234");
      expect(slots(container).map((s) => s.value)).toEqual(["1", "2", "3", "4"]);
      expect(onComplete).toHaveBeenCalledWith("1234", expect.anything());
    });

    it("rejects letters with the default numeric validation", async () => {
      const user = userEvent.setup();
      const { container } = render(<Labelled length={4} />);
      await user.click(slots(container)[0]);
      await user.keyboard("a1");
      expect(slots(container)[0].value).toBe("1");
    });

    it("blurs on complete when blurOnComplete is set (and still calls onValueComplete)", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();
      const { container } = render(
        <Labelled length={3} blurOnComplete onValueComplete={onComplete} />,
      );
      await user.click(slots(container)[0]);
      await user.keyboard("123");
      expect(onComplete).toHaveBeenCalled();
      expect(root(container).contains(document.activeElement)).toBe(false);
    });

    it("keeps focus on complete by default", async () => {
      const user = userEvent.setup();
      const { container } = render(<Labelled length={3} />);
      await user.click(slots(container)[0]);
      await user.keyboard("123");
      expect(root(container).contains(document.activeElement)).toBe(true);
    });

    it("selects a filled slot's character on focus natively (no prop needed)", async () => {
      const user = userEvent.setup();
      const { container } = render(<Labelled length={3} defaultValue="123" />);
      const second = slots(container)[1];
      await user.click(second);
      expect([second.selectionStart, second.selectionEnd]).toEqual([0, 1]);
    });

    it("masks slots with mask", () => {
      const { container } = render(<Labelled length={3} mask />);
      expect(slots(container).every((s) => s.type === "password")).toBe(true);
    });

    it("is a single tab stop", () => {
      const { container } = render(<Labelled length={4} />);
      expect(slots(container).filter((s) => s.tabIndex === 0)).toHaveLength(1);
    });
  });

  describe("states + styling", () => {
    it("applies the placeholder to every slot", () => {
      const { container } = render(<Labelled length={3} placeholder="○" />);
      expect(slots(container).every((s) => s.placeholder === "○")).toBe(true);
    });

    it("valid sets data-success and a success border", () => {
      const { container } = render(<Labelled length={3} valid />);
      expect(root(container)).toHaveAttribute("data-success");
      expect(slots(container)[0].className).toContain("border-success");
    });

    it("warning overrides valid", () => {
      const { container } = render(<Labelled length={3} valid warning />);
      expect(root(container)).toHaveAttribute("data-warning");
      expect(root(container)).not.toHaveAttribute("data-success");
      expect(slots(container)[0].className).toContain("border-warning");
      expect(slots(container)[0].className).not.toContain("border-success");
    });

    it("marks slots aria-invalid when the field fails validation on submit", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Form aria-label="Verify">
          <Field.Root name="code">
            <Field.Label>Code</Field.Label>
            <OTPField.Root length={3} required />
          </Field.Root>
          <button type="submit">Verify</button>
        </Form>,
      );
      expect(slots(container)[0]).not.toHaveAttribute("aria-invalid");
      await user.click(screen.getByRole("button", { name: "Verify" }));
      for (const slot of slots(container)) {
        expect(slot).toHaveAttribute("data-invalid");
        expect(slot).toHaveAttribute("aria-invalid", "true");
      }
    });

    it("marks slots aria-invalid from Field", () => {
      const { container } = render(<Labelled length={3} invalid />);
      expect(slots(container)[0]).toHaveAttribute("aria-invalid", "true");
    });

    it("disables every slot", () => {
      const { container } = render(<Labelled length={3} disabled />);
      expect(slots(container).every((s) => s.disabled)).toBe(true);
    });

    it.each([
      ["sm", "--sp-control-height-sm", "text-sm"],
      ["md", "--sp-control-height)", "text-lg"],
      ["lg", "--sp-control-height-lg", "text-xl"],
    ] as const)("size %s maps to %s", (size, token, text) => {
      const { container } = render(<Labelled length={2} size={size} />);
      expect(root(container)).toHaveAttribute("data-size", size);
      expect(root(container).className).toContain(token);
      expect(slots(container)[0].className).toContain(text);
    });

    it("attached removes the gap and rounds only the group ends", () => {
      const { container } = render(<Labelled groups={[2, 2]} attached />);
      expect(root(container)).toHaveAttribute("data-attached");
      const group = container.querySelector("[data-slot='otp-field-group']")!;
      expect(group.className).not.toContain("gap-");
      expect(slots(container)[0].className).toContain("rounded-none");
      expect(slots(container)[0].className).toContain("[span:first-child>&]:rounded-s-");
    });

    it("lets slots shrink on narrow screens, but not below 24px", () => {
      // Regression (sign-off /improve): fixed-size slots overflowed 375px phones
      // (e.g. 6 ungrouped slots at comfortable density = 348px).
      const { container } = render(<Labelled length={8} />);
      const slot = container.querySelector("[data-slot='otp-field-slot']")!;
      expect(slot.className).toContain("shrink");
      expect(slot.className).toContain("min-w-6");
      expect(slot.className).toContain("w-[var(--sp-otp-size)]");
      expect(slots(container)[0].className).toContain("aspect-square");
      expect(container.querySelector("[data-slot='otp-field-group']")!.className).toContain(
        "min-w-0",
      );
    });

    it("wraps each slot for the fake caret, which is hidden in forced colours", () => {
      const { container } = render(<Labelled length={2} />);
      const slot = container.querySelector("[data-slot='otp-field-slot']")!;
      expect(slot.className).toContain("after:animate-pulse");
      expect(slot.className).toContain("motion-reduce:after:animate-none");
      expect(slot.className).toContain("forced-colors:after:!hidden");
    });
  });

  describe("className", () => {
    it("accepts a state function on Root and Input", () => {
      const { container } = render(
        <Field.Root>
          <Field.Label>Code</Field.Label>
          <OTPField.Root length={1} disabled className={(s) => (s.disabled ? "root-off" : "")}>
            <OTPField.Input className={(s) => (s.disabled ? "slot-off" : "")} />
          </OTPField.Root>
        </Field.Root>,
      );
      expect(root(container)).toHaveClass("root-off", "flex");
      expect(slots(container)[0]).toHaveClass("slot-off", "tabular-nums");
    });
  });
});
