import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Fieldset } from "./Fieldset";

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

  it("applies custom className", () => {
    render(
      <Fieldset.Root data-testid="fs" className="test-class">
        <Fieldset.Legend>Group</Fieldset.Legend>
      </Fieldset.Root>,
    );
    expect(screen.getByTestId("fs").className).toContain("test-class");
  });
});
