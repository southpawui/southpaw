import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders Root with data-slot", () => {
    render(
      <Avatar.Root data-testid="avatar">
        <Avatar.Fallback>GY</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-slot", "avatar");
  });

  it("renders fallback text", () => {
    render(
      <Avatar.Root>
        <Avatar.Image src="" alt="" />
        <Avatar.Fallback>GY</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByText("GY")).toBeInTheDocument();
  });

  it("supports size prop", () => {
    render(
      <Avatar.Root data-testid="avatar" size="lg">
        <Avatar.Fallback>L</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "lg");
  });

  it("supports shape prop", () => {
    render(
      <Avatar.Root data-testid="avatar" shape="square">
        <Avatar.Fallback>S</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByTestId("avatar")).toHaveAttribute("data-shape", "square");
  });

  it("renders Status with aria-label", () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>GY</Avatar.Fallback>
        <Avatar.Status status="online" />
      </Avatar.Root>,
    );
    expect(screen.getByLabelText("Status: online")).toHaveAttribute("data-slot", "avatar-status");
  });

  it("renders Group with data-slot", () => {
    render(
      <Avatar.Group data-testid="group">
        <Avatar.Root>
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("data-slot", "avatar-group");
  });

  it("shows overflow count when max is exceeded", () => {
    render(
      <Avatar.Group max={2}>
        <Avatar.Root>
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>B</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>C</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>D</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group>,
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Avatar.Root data-testid="avatar" className="test-class">
        <Avatar.Fallback>GY</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByTestId("avatar").className).toContain("test-class");
  });
});
