import { render, screen } from "@testing-library/react";
import { mergeClassName, resolveClassName } from "./merge-class-name";
import { Checkbox } from "../components/Checkbox/Checkbox";
import { Switch } from "../components/Switch/Switch";
import { Field } from "../components/Field/Field";
import { Popover } from "../components/Popover/Popover";
import { Collapsible } from "../components/Collapsible/Collapsible";
import { Progress } from "../components/Progress/Progress";
import { Separator } from "../components/Separator/Separator";
import { Tabs } from "../components/Tabs/Tabs";
import { Select } from "../components/Select/Select";

/**
 * GEO-958: Base UI types `className` as `string | (state) => string`, and `cn()` silently
 * dropped the function form in every wrapper. One case per component family.
 */
describe("mergeClassName / resolveClassName", () => {
  it("merges a string with tailwind-merge (consumer wins)", () => {
    expect(mergeClassName("px-2 text-sm", "px-4")).toBe("text-sm px-4");
    expect(mergeClassName("px-2", undefined)).toBe("px-2");
  });

  it("wraps a function so it merges per state", () => {
    const fn = mergeClassName<{ open: boolean }>("base", (s) => (s.open ? "is-open" : "is-closed"));
    expect(typeof fn).toBe("function");
    expect((fn as (s: { open: boolean }) => string)({ open: true })).toBe("base is-open");
  });

  it("resolveClassName returns the string for a state", () => {
    expect(resolveClassName<{ a: number }>((s) => `n-${s.a}`, { a: 2 })).toBe("n-2");
    expect(resolveClassName("x", {})).toBe("x");
  });
});

describe("function className reaches the DOM (GEO-958 regression)", () => {
  it("form controls: Checkbox", () => {
    render(
      <Checkbox.Root
        aria-label="Agree"
        defaultChecked
        className={(s) => (s.checked ? "is-checked" : "is-unchecked")}
      />,
    );
    const box = screen.getByRole("checkbox", { name: "Agree" });
    expect(box.className).toContain("is-checked");
    expect(box).toHaveAttribute("data-slot", "checkbox");
  });

  it("form controls: Switch", () => {
    render(<Switch.Root aria-label="On" className={(s) => (s.checked ? "on" : "off")} />);
    expect(screen.getByRole("switch", { name: "On" }).className).toContain("off");
  });

  it("form controls: Field.Root", () => {
    const { container } = render(
      <Field.Root disabled className={(s) => (s.disabled ? "field-disabled" : "field-enabled")}>
        <Field.Label>Name</Field.Label>
      </Field.Root>,
    );
    expect(container.querySelector("[data-slot=field]")!.className).toContain("field-disabled");
  });

  it("selection: Select.Trigger keeps Southpaw's classes and adds the state class", () => {
    render(
      <Select.Root>
        <Select.Trigger aria-label="Fruit" className={(s) => (s.open ? "open" : "closed")} />
      </Select.Root>,
    );
    const trigger = screen.getByRole("combobox", { name: "Fruit" });
    expect(trigger.className).toContain("closed");
    expect(trigger.className).toContain("border-2");
  });

  it("overlays: Popover.Trigger", () => {
    render(
      <Popover.Root>
        <Popover.Trigger className={(s) => (s.open ? "pop-open" : "pop-closed")}>
          Open
        </Popover.Trigger>
      </Popover.Root>,
    );
    expect(screen.getByRole("button", { name: "Open" }).className).toContain("pop-closed");
  });

  it("disclosure: Collapsible.Root", () => {
    const { container } = render(
      <Collapsible.Root defaultOpen className={(s) => (s.open ? "c-open" : "c-closed")}>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      </Collapsible.Root>,
    );
    expect(container.firstElementChild!.className).toContain("c-open");
  });

  it("display: Progress.Root", () => {
    render(
      <Progress.Root value={40} aria-label="Upload" className={(s) => `status-${s.status}`} />,
    );
    expect(screen.getByRole("progressbar", { name: "Upload" }).className).toContain(
      "status-progressing",
    );
  });

  it("display: Separator, plain and labelled (resolved on a plain div)", () => {
    const { rerender } = render(
      <Separator orientation="vertical" className={(s) => `sep-${s.orientation}`} />,
    );
    expect(screen.getByRole("separator").className).toContain("sep-vertical");
    rerender(<Separator label="OR" className={(s) => `sep-${s.orientation}`} />);
    expect(screen.getByRole("separator").className).toContain("sep-horizontal");
  });

  it("navigation: Tabs.Root", () => {
    const { container } = render(
      <Tabs.Root defaultValue="a" className={(s) => `tabs-${s.orientation}`}>
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>,
    );
    expect(container.querySelector("[data-slot=tabs]")!.className).toContain("tabs-horizontal");
  });
});
