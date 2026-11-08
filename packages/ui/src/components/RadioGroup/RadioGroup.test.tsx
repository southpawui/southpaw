import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RadioGroup } from "./RadioGroup";

describe("RadioGroup", () => {
  describe("Root", () => {
    it("renders as a radiogroup", () => {
      render(
        <RadioGroup.Root aria-label="Options">
          <RadioGroup.Item value="a" aria-label="A" />
        </RadioGroup.Root>,
      );
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    it("applies data-slot attribute", () => {
      render(
        <RadioGroup.Root aria-label="Options">
          <RadioGroup.Item value="a" aria-label="A" />
        </RadioGroup.Root>,
      );
      expect(screen.getByRole("radiogroup")).toHaveAttribute("data-slot", "radio-group");
    });

    it("renders multiple items", () => {
      render(
        <RadioGroup.Root aria-label="Options" defaultValue="a">
          <RadioGroup.Item value="a" aria-label="A" />
          <RadioGroup.Item value="b" aria-label="B" />
          <RadioGroup.Item value="c" aria-label="C" />
        </RadioGroup.Root>,
      );
      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });

    it("sets default value", () => {
      render(
        <RadioGroup.Root aria-label="Options" defaultValue="b">
          <RadioGroup.Item value="a" aria-label="A" />
          <RadioGroup.Item value="b" aria-label="B" />
        </RadioGroup.Root>,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "false");
      expect(radios[1]).toHaveAttribute("aria-checked", "true");
    });

    it("uses density-responsive gap", () => {
      render(
        <RadioGroup.Root aria-label="Options">
          <RadioGroup.Item value="a" aria-label="A" />
        </RadioGroup.Root>,
      );
      expect(screen.getByRole("radiogroup").className).toContain("gap-[var(--sp-control-gap)]");
    });
  });

  describe("Item", () => {
    it("renders as a radio", () => {
      render(
        <RadioGroup.Root aria-label="Options">
          <RadioGroup.Item value="a" aria-label="A" />
        </RadioGroup.Root>,
      );
      expect(screen.getByRole("radio")).toBeInTheDocument();
    });

    it("applies data-slot attribute", () => {
      render(
        <RadioGroup.Root aria-label="Options">
          <RadioGroup.Item value="a" aria-label="A" />
        </RadioGroup.Root>,
      );
      expect(screen.getByRole("radio")).toHaveAttribute("data-slot", "radio-item");
    });

    it("auto-renders Indicator as children", () => {
      render(
        <RadioGroup.Root aria-label="Options" defaultValue="a">
          <RadioGroup.Item value="a" aria-label="A" />
        </RadioGroup.Root>,
      );
      const radio = screen.getByRole("radio");
      expect(radio.querySelector("[data-slot='radio-indicator']")).toBeInTheDocument();
    });

    it("applies valid classes when valid", () => {
      render(
        <RadioGroup.Root aria-label="Options" defaultValue="a">
          <RadioGroup.Item value="a" aria-label="A" valid />
        </RadioGroup.Root>,
      );
      expect(screen.getByRole("radio").className).toContain("success");
    });

    it("renders disabled state", () => {
      render(
        <RadioGroup.Root aria-label="Options">
          <RadioGroup.Item value="a" aria-label="A" disabled />
        </RadioGroup.Root>,
      );
      expect(screen.getByRole("radio")).toHaveAttribute("data-disabled", "");
    });
  });
});
