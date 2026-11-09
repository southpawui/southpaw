import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders with data-slot", () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText("Test")).toHaveAttribute("data-slot", "badge");
  });

  it("renders default variant", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default")).toHaveAttribute("data-variant", "default");
  });

  it("renders danger variant", () => {
    render(<Badge variant="danger">Error</Badge>);
    expect(screen.getByText("Error")).toHaveAttribute("data-variant", "danger");
  });

  it("renders icon when provided", () => {
    render(<Badge icon={<span data-testid="icon">★</span>}>With icon</Badge>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders dismiss button when onDismiss provided", () => {
    const onDismiss = vi.fn();
    render(<Badge onDismiss={onDismiss}>Dismissible</Badge>);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button clicked", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Badge onDismiss={onDismiss}>Dismissible</Badge>);
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("does not render dismiss button without onDismiss", () => {
    render(<Badge>No dismiss</Badge>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Badge className="test-class">Custom</Badge>);
    expect(screen.getByText("Custom").className).toContain("test-class");
  });

  it("renders outline appearance", () => {
    render(<Badge appearance="outline">Outline</Badge>);
    expect(screen.getByText("Outline").className).toContain("border");
  });
});
