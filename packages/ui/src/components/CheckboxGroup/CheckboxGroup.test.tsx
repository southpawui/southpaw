import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CheckboxGroup } from "./CheckboxGroup";
import { Checkbox } from "../Checkbox/Checkbox";

describe("CheckboxGroup", () => {
  it("renders with data-slot", () => {
    render(
      <CheckboxGroup.Root data-testid="group">
        <Checkbox.Root name="a" aria-label="A" />
      </CheckboxGroup.Root>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("data-slot", "checkbox-group");
  });

  it("applies custom className", () => {
    render(
      <CheckboxGroup.Root data-testid="group" className="test-class">
        <Checkbox.Root name="a" aria-label="A" />
      </CheckboxGroup.Root>,
    );
    expect(screen.getByTestId("group").className).toContain("test-class");
  });

  it("manages defaultValue", () => {
    render(
      <CheckboxGroup.Root defaultValue={["a"]}>
        <Checkbox.Root name="a" aria-label="A" />
        <Checkbox.Root name="b" aria-label="B" />
      </CheckboxGroup.Root>,
    );
    expect(screen.getByRole("checkbox", { name: "A" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("checkbox", { name: "B" })).toHaveAttribute("aria-checked", "false");
  });

  it("passes disabled to children", () => {
    render(
      <CheckboxGroup.Root disabled>
        <Checkbox.Root name="a" aria-label="A" disabled />
      </CheckboxGroup.Root>,
    );
    expect(screen.getByRole("checkbox", { name: "A" })).toHaveAttribute("data-disabled", "");
  });
});
