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

  it("renders Error with its icon and describes the fieldset (no live region, GEO-957)", () => {
    render(
      <Fieldset.Root data-testid="fs">
        <Fieldset.Legend>Group</Fieldset.Legend>
        <Fieldset.Error>Something went wrong.</Fieldset.Error>
      </Fieldset.Root>,
    );
    const error = screen.getByText("Something went wrong.").closest("[data-slot=fieldset-error]")!;
    expect(error).not.toHaveAttribute("role");
    // Not announced on page load; read when focus enters the group.
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByTestId("fs")).toHaveAttribute("aria-describedby", error.id);
    expect(screen.getByTestId("fs")).toHaveAccessibleDescription(/Something went wrong\./);
  });

  it("keeps a consumer aria-describedby alongside the error", () => {
    render(
      <Fieldset.Root data-testid="fs" aria-describedby="hint">
        <Fieldset.Legend>Group</Fieldset.Legend>
        <p id="hint">Pick one</p>
        <Fieldset.Error>Required.</Fieldset.Error>
      </Fieldset.Root>,
    );
    const ids = screen.getByTestId("fs").getAttribute("aria-describedby")!.split(" ");
    expect(ids[0]).toBe("hint");
    expect(ids).toHaveLength(2);
  });

  it("two Errors both describe the fieldset; hiding one keeps the other", () => {
    const { rerender } = render(
      <Fieldset.Root data-testid="fs">
        <Fieldset.Legend>Group</Fieldset.Legend>
        <Fieldset.Error id="e1">First.</Fieldset.Error>
        <Fieldset.Error id="e2">Second.</Fieldset.Error>
      </Fieldset.Root>,
    );
    expect(screen.getByTestId("fs").getAttribute("aria-describedby")).toBe("e1 e2");
    rerender(
      <Fieldset.Root data-testid="fs">
        <Fieldset.Legend>Group</Fieldset.Legend>
        <Fieldset.Error id="e1" />
        <Fieldset.Error id="e2">Second.</Fieldset.Error>
      </Fieldset.Root>,
    );
    expect(screen.getByTestId("fs").getAttribute("aria-describedby")).toBe("e2");
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
    expect(screen.getByText("Error one.").closest("ul")).toBeInTheDocument();
  });

  it("does not render Error when empty, and the fieldset isn't described", () => {
    render(
      <Fieldset.Root data-testid="fs">
        <Fieldset.Legend>Group</Fieldset.Legend>
        <Fieldset.Error />
      </Fieldset.Root>,
    );
    expect(document.querySelector("[data-slot=fieldset-error]")).toBeNull();
    expect(screen.getByTestId("fs")).not.toHaveAttribute("aria-describedby");
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
