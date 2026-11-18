import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { connectedClasses } from "../../lib/connected";
import { Toggle } from "../Toggle/Toggle";
import { NumberField } from "../NumberField/NumberField";
import { Checkbox } from "../Checkbox/Checkbox";
import { Field } from "../Field/Field";

afterEach(() => vi.restoreAllMocks());

const group = () => screen.getByRole("group");

describe("ButtonGroup", () => {
  describe("semantics", () => {
    it("renders role=group with its label and data-slot", () => {
      render(
        <ButtonGroup.Root aria-label="Actions">
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("group", { name: "Actions" })).toHaveAttribute(
        "data-slot",
        "button-group",
      );
    });

    it("keeps every button in the tab order (no roving focus)", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroup.Root attached aria-label="Actions">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup.Root>,
      );
      await user.tab();
      expect(screen.getByRole("button", { name: "One" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "Two" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "Three" })).toHaveFocus();
    });

    it("supports the render prop", () => {
      render(
        <ButtonGroup.Root render={<nav />} aria-label="Pages">
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(group().tagName).toBe("NAV");
    });

    it("warns when an attached group has no accessible name", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <ButtonGroup.Root attached>
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(warn.mock.calls.some((c) => String(c[0]).includes("aria-label"))).toBe(true);
    });

    it("does not warn when labelled", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <ButtonGroup.Root attached aria-label="Ok">
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe("layout", () => {
    it("is spaced by default and stacks below sm (GOV.UK)", () => {
      render(
        <ButtonGroup.Root aria-label="A">
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(group()).toHaveAttribute("data-orientation", "horizontal");
      expect(group()).not.toHaveAttribute("data-attached");
      expect(group().className).toContain("gap-[var(--sp-control-gap)]");
      expect(group().className).toContain("flex-col");
      expect(group().className).toContain("sm:flex-row");
    });

    it("stackBelow={false} keeps a row", () => {
      render(
        <ButtonGroup.Root aria-label="A" stackBelow={false}>
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(group().className).toContain("flex-row");
      expect(group().className).not.toContain("sm:flex-row");
    });

    it("attached applies the shared connected classes", () => {
      render(
        <ButtonGroup.Root attached aria-label="A">
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(group()).toHaveAttribute("data-attached");
      expect(group().className).toContain("[aria-owns]:empty,[type=hidden]))]:!rounded-s-");
      expect(group().className).not.toContain("gap-[var(--sp-control-gap)]");
    });

    it("vertical attached uses top/bottom radii", () => {
      render(
        <ButtonGroup.Root attached orientation="vertical" aria-label="A">
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(group().className).toContain("[aria-owns]:empty,[type=hidden]))]:!rounded-t-");
      expect(group().className).toContain("flex-col");
    });

    it("draws dividers between solid buttons in attached groups", () => {
      render(
        <ButtonGroup.Root attached aria-label="A">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup.Root>,
      );
      expect(group().className).toContain(
        "[data-variant=solid]+[type=hidden]+[data-variant=solid])]:shadow-",
      );
      expect(screen.getByRole("button", { name: "One" })).toHaveAttribute("data-variant", "solid");
    });

    it.each([
      ["start", "justify-start"],
      ["center", "justify-center"],
      ["end", "justify-end"],
    ] as const)("align=%s", (align, cls) => {
      render(
        <ButtonGroup.Root aria-label="A" align={align} stackBelow={false}>
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(group().className).toContain(cls);
    });

    it("align applies from sm up on a stacking group", () => {
      render(
        <ButtonGroup.Root aria-label="A" align="end">
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(group().className).toContain("sm:justify-end");
    });

    it("draws horizontal dividers between solid buttons in a vertical attached group", () => {
      render(
        <ButtonGroup.Root attached orientation="vertical" aria-label="A">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup.Root>,
      );
      expect(group().className).toContain("shadow-[inset_0_1px_0_");
    });

    it("grow stretches the children", () => {
      render(
        <ButtonGroup.Root aria-label="A" grow attached>
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(group().className).toContain("[&>:not([role=separator])]:flex-1");
    });

    it("lets an Input fill an attached row", () => {
      render(
        <ButtonGroup.Root aria-label="Search" attached>
          <Input aria-label="Terms" />
          <Button>Go</Button>
        </ButtonGroup.Root>,
      );
      expect(group().className).toContain("[&>[data-slot=input-group]]:flex-1");
      expect(screen.getByRole("textbox", { name: "Terms" })).toBeInTheDocument();
    });
  });

  describe("group props propagate to Buttons", () => {
    it("passes size, variant and color as defaults", () => {
      render(
        <ButtonGroup.Root aria-label="A" size="sm" variant="outline" color="danger">
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      const btn = screen.getByRole("button", { name: "One" });
      expect(btn).toHaveAttribute("data-variant", "outline");
      expect(btn.className).toContain("border-danger");
      expect(btn.className).toContain("h-[var(--sp-control-height-sm)]");
    });

    it("a Button's own prop wins", () => {
      render(
        <ButtonGroup.Root aria-label="A" variant="outline">
          <Button variant="ghost">One</Button>
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("button", { name: "One" })).toHaveAttribute("data-variant", "ghost");
    });

    it("disabled disables every Button, even one with disabled={false}", () => {
      render(
        <ButtonGroup.Root aria-label="A" disabled>
          <Button>One</Button>
          <Button disabled={false}>Two</Button>
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("button", { name: "One" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Two" })).toBeDisabled();
      expect(group()).toHaveAttribute("aria-disabled", "true");
    });

    it("icon-only Buttons match the group's size (regression)", () => {
      render(
        <ButtonGroup.Root aria-label="A" attached size="sm">
          <Button>Text</Button>
          <Button size="icon" srOnly="More" icon={<svg />} />
        </ButtonGroup.Root>,
      );
      const icon = screen.getByRole("button", { name: "More" });
      expect(icon.className).toContain("h-[var(--sp-control-height-sm)]");
      expect(icon.className).toContain("w-[var(--sp-control-height-sm)]");
      expect(icon.className).not.toContain("h-[var(--sp-control-height)]");
    });

    it("a standalone icon-only Button keeps the md square", () => {
      render(<Button size="icon" srOnly="Solo icon" icon={<svg />} />);
      expect(screen.getByRole("button", { name: "Solo icon" }).className).toContain(
        "h-[var(--sp-control-height)] w-[var(--sp-control-height)]",
      );
    });

    it("Buttons outside a group are unaffected", () => {
      render(<Button>Solo</Button>);
      const btn = screen.getByRole("button", { name: "Solo" });
      expect(btn).toHaveAttribute("data-variant", "solid");
      expect(btn).not.toBeDisabled();
    });

    it("a loading Button stays disabled even with disabled={false} (regression)", () => {
      // Before GEO-896, `{...props}` came after `disabled` and an explicit
      // disabled={false} re-enabled a loading Button.
      render(
        <Button loading disabled={false}>
          Saving
        </Button>,
      );
      // The spinner contributes "Loading" to the name ("LoadingSaving").
      expect(screen.getByRole("button", { name: /Saving/ })).toBeDisabled();
    });
  });

  describe("disabled cascades to every control (like <fieldset disabled>)", () => {
    it("renders a native fieldset", () => {
      render(
        <ButtonGroup.Root aria-label="A">
          <Button>One</Button>
        </ButtonGroup.Root>,
      );
      expect(group().tagName).toBe("FIELDSET");
    });

    it("disables Input, Toggle, NumberField and Button inside a disabled group", () => {
      render(
        <ButtonGroup.Root aria-label="A" disabled>
          <Input aria-label="Email" />
          <Toggle aria-label="Bold">B</Toggle>
          <NumberField.Root defaultValue={1}>
            <NumberField.Group inputProps={{ "aria-label": "Qty" }} />
          </NumberField.Root>
          <Button>Go</Button>
        </ButtonGroup.Root>,
      );
      // NumberField.Group is also role="group", so query ours by name.
      expect(screen.getByRole("group", { name: "A" })).toBeDisabled();
      expect(screen.getByRole("textbox", { name: "Email" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
      expect(screen.getByRole("textbox", { name: "Qty" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Go" })).toBeDisabled();
    });

    it("reaches Field-wrapped controls through Base UI's Fieldset context (Checkbox)", async () => {
      const user = userEvent.setup();
      render(
        <ButtonGroup.Root aria-label="A" disabled>
          <Field.Root>
            <Checkbox.Root aria-label="Gift wrap" />
          </Field.Root>
        </ButtonGroup.Root>,
      );
      const box = screen.getByRole("checkbox", { name: "Gift wrap" });
      expect(box).toHaveAttribute("data-disabled");
      await user.click(box);
      expect(box).toHaveAttribute("aria-checked", "false");
    });

    it("nothing inside a disabled group is reachable with Tab", async () => {
      const user = userEvent.setup();
      render(
        <>
          <ButtonGroup.Root aria-label="A" disabled>
            <Input aria-label="Email" />
            <Toggle aria-label="Bold">B</Toggle>
            <Button>Go</Button>
          </ButtonGroup.Root>
          <Button>After</Button>
        </>,
      );
      await user.tab();
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });

    it("an enabled group leaves its controls enabled", () => {
      render(
        <ButtonGroup.Root aria-label="A">
          <Input aria-label="Email" />
          <Toggle aria-label="Bold">B</Toggle>
        </ButtonGroup.Root>,
      );
      expect(group()).not.toBeDisabled();
      expect(screen.getByRole("textbox", { name: "Email" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Bold" })).toBeEnabled();
    });

    it("a nested group inside a disabled group is disabled too", () => {
      render(
        <ButtonGroup.Root aria-label="Outer" disabled>
          <ButtonGroup.Root aria-label="Inner" attached>
            <Toggle aria-label="Bold">B</Toggle>
            <Button>Inner button</Button>
          </ButtonGroup.Root>
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("group", { name: "Inner" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Bold" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Inner button" })).toBeDisabled();
    });

    it("with render={<nav />} Buttons are still disabled via context", () => {
      render(
        <ButtonGroup.Root aria-label="A" disabled render={<nav />}>
          <Button>Go</Button>
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("button", { name: "Go" })).toBeDisabled();
    });
  });

  describe("Separator + Text", () => {
    it("Separator runs across the group: vertical in a row, horizontal in a column", () => {
      const { rerender } = render(
        <ButtonGroup.Root aria-label="A" attached>
          <Button>One</Button>
          <ButtonGroup.Separator />
          <Button>Two</Button>
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
      rerender(
        <ButtonGroup.Root aria-label="A" attached orientation="vertical">
          <Button>One</Button>
          <ButtonGroup.Separator />
          <Button>Two</Button>
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("Text renders a non-interactive segment sized from the group", () => {
      render(
        <ButtonGroup.Root aria-label="A" attached size="lg">
          <ButtonGroup.Text>Page 1</ButtonGroup.Text>
        </ButtonGroup.Root>,
      );
      const text = screen.getByText("Page 1");
      expect(text).toHaveAttribute("data-slot", "button-group-text");
      expect(text.className).toContain("h-[var(--sp-control-height-lg)]");
    });

    it("Separator: an explicit orientation overrides the inferred one", () => {
      render(
        <ButtonGroup.Root aria-label="A" attached>
          <Button>One</Button>
          <ButtonGroup.Separator orientation="horizontal" />
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
    });

    it("Separator is inset in spaced groups, not attached ones", () => {
      const { rerender } = render(
        <ButtonGroup.Root aria-label="A" stackBelow={false}>
          <Button>One</Button>
          <ButtonGroup.Separator />
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("separator").className).toContain("my-1.5");
      rerender(
        <ButtonGroup.Root aria-label="A" attached>
          <Button>One</Button>
          <ButtonGroup.Separator />
        </ButtonGroup.Root>,
      );
      expect(screen.getByRole("separator").className).not.toContain("my-1.5");
    });

    it("Separator applies a function className (Base UI state form)", () => {
      render(
        <ButtonGroup.Root aria-label="A">
          <Button>One</Button>
          <ButtonGroup.Separator className={() => "custom-sep"} />
        </ButtonGroup.Root>,
      );
      const sep = screen.getByRole("separator");
      expect(sep.className).toContain("custom-sep");
      expect(sep.className).toContain("bg-border-control");
    });

    it("Text defaults to the md height without a group size", () => {
      render(
        <ButtonGroup.Root aria-label="A">
          <ButtonGroup.Text>Info</ButtonGroup.Text>
        </ButtonGroup.Root>,
      );
      expect(screen.getByText("Info").className).toContain("h-[var(--sp-control-height)]");
    });

    it("Text supports render", () => {
      render(
        <ButtonGroup.Root aria-label="A">
          <ButtonGroup.Text render={<strong />}>Total</ButtonGroup.Text>
        </ButtonGroup.Root>,
      );
      const el = screen.getByText("Total");
      expect(el.tagName).toBe("STRONG");
      expect(el).toHaveAttribute("data-slot", "button-group-text");
    });
  });

  describe("connectedClasses", () => {
    it("lifts hovered and focused children above their neighbours", () => {
      const cls = connectedClasses("horizontal");
      expect(cls).toContain("[type=hidden]):focus-visible]:z-20");
      expect(cls).toContain("[type=hidden]):has(:focus-visible)]:z-20");
    });

    it("ignores Base UI's hidden focus-guard spans around an open trigger (split button regression)", () => {
      // Opening a Popover inserts [data-base-ui-focus-guard] spans and an empty [aria-owns] span
      // next to the trigger. They used to steal :last-child (trigger lost its rounded end).
      const S = ":not([role=separator],[data-base-ui-focus-guard],[aria-owns]:empty,[type=hidden])";
      const cls = connectedClasses("horizontal");
      expect(cls).toContain(`[&>:nth-last-child(1_of_${S})]:!rounded-e-`);
      expect(cls).toContain(`[&>:nth-child(1_of_${S})]:!rounded-s-`);
      expect(cls).toContain(`${S}+[data-base-ui-focus-guard]+${S},`);
      expect(cls).toContain(`${S}+[type=hidden]+${S})]:-ms-0.5`);
    });
  });
});
