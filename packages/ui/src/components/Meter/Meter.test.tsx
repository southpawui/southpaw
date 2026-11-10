import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Meter } from "./Meter";

describe("Meter", () => {
  it("renders Root with data-slot", () => {
    render(
      <Meter.Root data-testid="meter" value={50} aria-label="test">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(screen.getByTestId("meter")).toHaveAttribute("data-slot", "meter");
  });

  it("renders default state when no thresholds", () => {
    render(
      <Meter.Root data-testid="meter" value={50} aria-label="test">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(screen.getByTestId("meter")).toHaveAttribute("data-state", "default");
  });

  it("renders success state when value is in optimum range (low optimum)", () => {
    render(
      <Meter.Root data-testid="meter" value={15} low={30} high={70} optimum={0} aria-label="test">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(screen.getByTestId("meter")).toHaveAttribute("data-state", "success");
  });

  it("renders warning state when value is suboptimal", () => {
    render(
      <Meter.Root data-testid="meter" value={50} low={30} high={70} optimum={0} aria-label="test">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(screen.getByTestId("meter")).toHaveAttribute("data-state", "warning");
  });

  it("renders danger state when value is in poor range", () => {
    render(
      <Meter.Root data-testid="meter" value={85} low={30} high={70} optimum={0} aria-label="test">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(screen.getByTestId("meter")).toHaveAttribute("data-state", "danger");
  });

  it("renders Track with data-slot", () => {
    render(
      <Meter.Root value={50} aria-label="test">
        <Meter.Track data-testid="track">
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(screen.getByTestId("track")).toHaveAttribute("data-slot", "meter-track");
  });

  it("renders Label with data-slot", () => {
    render(
      <Meter.Root value={50}>
        <Meter.Label>Storage</Meter.Label>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(screen.getByText("Storage")).toHaveAttribute("data-slot", "meter-label");
  });

  it("applies custom className", () => {
    render(
      <Meter.Root data-testid="meter" value={50} className="test-class" aria-label="test">
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(screen.getByTestId("meter").className).toContain("test-class");
  });
});
