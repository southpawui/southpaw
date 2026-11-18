import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Fieldset } from "./Fieldset";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";

describe("Fieldset", () => {
  it("renders Root as fieldset with data-slot", () => {
    render(
      <Fieldset.Root data-testid="fs">
        <Fieldset.Legend>Group</Fieldset.Legend>
      </Fieldset.Root>,
    );
    const el = screen.getByTestId("fs");
    expect(el.tagName).toBe("FIELDSET");
    expect(el).toHaveAttribute("data-slot", "fieldset");
  });

  it("renders Legend with data-slot", () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Group</Fieldset.Legend>
      </Fieldset.Root>,
    );
    const legend = screen.getByText("Group");
    expect(legend).toHaveAttribute("data-slot", "fieldset-legend");
  });

  it("renders Description with data-slot", () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Group</Fieldset.Legend>
        <Fieldset.Description>Helper text</Fieldset.Description>
      </Fieldset.Root>,
    );
    expect(screen.getByText("Helper text")).toHaveAttribute("data-slot", "fieldset-description");
  });

  it("renders Error with role=alert and icon", () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Group</Fieldset.Legend>
        <Fieldset.Error>Something went wrong.</Fieldset.Error>
      </Fieldset.Root>,
    );
    const error = screen.getByRole("alert");
    expect(error).toHaveAttribute("data-slot", "fieldset-error");
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  it("renders multiple errors as a list", () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Group</Fieldset.Legend>
        <Fieldset.Error errors={["Error one.", "Error two."]} />
      </Fieldset.Root>,
    );
    expect(screen.getByText("Error one.")).toBeInTheDocument();
    expect(screen.getByText("Error two.")).toBeInTheDocument();
    expect(screen.getByRole("alert").querySelector("ul")).toBeInTheDocument();
  });

  it("does not render Error when empty", () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Group</Fieldset.Legend>
        <Fieldset.Error />
      </Fieldset.Root>,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("supports disabled state", () => {
    render(
      <Fieldset.Root disabled data-testid="fs">
        <Fieldset.Legend>Group</Fieldset.Legend>
      </Fieldset.Root>,
    );
    expect(screen.getByTestId("fs")).toBeDisabled();
  });

  it("does not dim its container when disabled, only the legend and description (GEO-962)", () => {
    render(
      <Fieldset.Root disabled data-testid="fs">
        <Fieldset.Legend>Shipping</Fieldset.Legend>
        <Fieldset.Description>Same as billing.</Fieldset.Description>
        <Field.Root>
          <Field.Label>City</Field.Label>
          <Input aria-label="City" />
        </Field.Root>
      </Fieldset.Root>,
    );
    // Children dim themselves; a container opacity would double-dim them (~0.14).
    expect(screen.getByTestId("fs").className).not.toContain("opacity");
    const legend = screen.getByText("Shipping");
    expect(legend).toHaveAttribute("data-disabled");
    expect(legend.className).toContain(
      "data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]",
    );
    expect(screen.getByText("Same as billing.").className).toContain(
      "[[data-slot=fieldset][data-disabled]_&]:opacity-[var(--sp-state-disabled-opacity)]",
    );
    expect(screen.getByTestId("fs")).toHaveAttribute("data-disabled");
    // The Field inside is disabled through Base UI's Fieldset context, so its label dims itself.
    expect(screen.getByText("City")).toHaveAttribute("data-disabled");
    expect(screen.getByRole("textbox", { name: "City" })).toBeDisabled();
  });

  it("applies custom className", () => {
    render(
      <Fieldset.Root data-testid="fs" className="test-class">
        <Fieldset.Legend>Group</Fieldset.Legend>
      </Fieldset.Root>,
    );
    expect(screen.getByTestId("fs").className).toContain("test-class");
  });
});
