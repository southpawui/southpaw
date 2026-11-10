import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("renders Root with data-slot", () => {
    render(
      <Progress.Root data-testid="progress" value={50} aria-label="test">
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>,
    );
    expect(screen.getByTestId("progress")).toHaveAttribute("data-slot", "progress");
  });

  it("renders with data-color", () => {
    render(
      <Progress.Root data-testid="progress" value={50} color="brand" aria-label="test">
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>,
    );
    expect(screen.getByTestId("progress")).toHaveAttribute("data-color", "brand");
  });

  it("renders default color by default", () => {
    render(
      <Progress.Root data-testid="progress" value={50} aria-label="test">
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>,
    );
    expect(screen.getByTestId("progress")).toHaveAttribute("data-color", "default");
  });

  it("renders Track with data-slot", () => {
    render(
      <Progress.Root value={50} aria-label="test">
        <Progress.Track data-testid="track">
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>,
    );
    expect(screen.getByTestId("track")).toHaveAttribute("data-slot", "progress-track");
  });

  it("renders Indicator with data-slot", () => {
    render(
      <Progress.Root value={50} aria-label="test">
        <Progress.Track>
          <Progress.Indicator data-testid="ind" />
        </Progress.Track>
      </Progress.Root>,
    );
    expect(screen.getByTestId("ind")).toHaveAttribute("data-slot", "progress-indicator");
  });

  it("renders Label with data-slot", () => {
    render(
      <Progress.Root value={50}>
        <Progress.Label>Loading</Progress.Label>
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>,
    );
    expect(screen.getByText("Loading")).toHaveAttribute("data-slot", "progress-label");
  });

  it("renders Value with data-slot", () => {
    render(
      <Progress.Root value={50} aria-label="test">
        <Progress.Value data-testid="val" />
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>,
    );
    expect(screen.getByTestId("val")).toHaveAttribute("data-slot", "progress-value");
  });

  it("applies custom className", () => {
    render(
      <Progress.Root data-testid="progress" value={50} className="test-class" aria-label="test">
        <Progress.Track>
          <Progress.Indicator />
        </Progress.Track>
      </Progress.Root>,
    );
    expect(screen.getByTestId("progress").className).toContain("test-class");
  });
});
