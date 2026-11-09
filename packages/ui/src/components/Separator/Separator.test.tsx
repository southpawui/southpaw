import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "./Separator";

describe("Separator", () => {
  it("renders with data-slot", () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId("sep")).toHaveAttribute("data-slot", "separator");
  });

  it("renders with role=separator", () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId("sep")).toHaveAttribute("role", "separator");
  });

  it("renders horizontal by default", () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId("sep")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders vertical orientation", () => {
    render(<Separator data-testid="sep" orientation="vertical" />);
    expect(screen.getByTestId("sep")).toHaveAttribute("data-orientation", "vertical");
  });

  it("renders label text when provided", () => {
    render(<Separator label="OR" />);
    expect(screen.getByText("OR")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Separator data-testid="sep" className="test-class" />);
    expect(screen.getByTestId("sep").className).toContain("test-class");
  });
});
