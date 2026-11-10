import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders with data-slot and role=status", () => {
    render(<Spinner data-testid="spinner" />);
    const el = screen.getByTestId("spinner");
    expect(el).toHaveAttribute("data-slot", "spinner");
    expect(el).toHaveAttribute("role", "status");
  });

  it("renders sr-only Loading text by default", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("renders visible label when provided", () => {
    render(<Spinner label="Saving..." />);
    expect(screen.getByText("Saving...")).toBeInTheDocument();
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });

  it("renders circle variant by default", () => {
    render(<Spinner data-testid="spinner" />);
    const svg = screen.getByTestId("spinner").querySelector("[data-slot='spinner-icon']");
    expect(svg).toBeInTheDocument();
  });

  it("renders dots variant", () => {
    render(<Spinner data-testid="spinner" variant="dots" />);
    const dots = screen.getByTestId("spinner").querySelector("[data-slot='spinner-dots']");
    expect(dots).toBeInTheDocument();
    expect(dots?.children).toHaveLength(3);
  });

  it("applies size classes", () => {
    render(<Spinner data-testid="spinner" size="lg" />);
    const icon = screen.getByTestId("spinner").querySelector("[data-slot='spinner-icon']");
    expect(icon?.getAttribute("class")).toContain("h-6");
  });

  it("applies custom className", () => {
    render(<Spinner data-testid="spinner" className="text-brand" />);
    expect(screen.getByTestId("spinner").className).toContain("text-brand");
  });
});
