import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Radio } from "./Radio";
import { RadioGroup } from "../RadioGroup/RadioGroup";

describe("Radio", () => {
  describe("Root", () => {
    it("renders as a radio", () => {
      render(
        <RadioGroup>
          <Radio.Root value="a" aria-label="Option A" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toBeInTheDocument();
    });

    it("applies data-slot attribute", () => {
      render(
        <RadioGroup>
          <Radio.Root value="a" aria-label="Option A" />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toHaveAttribute("data-slot", "radio");
    });

    it("auto-renders Indicator as children", () => {
      render(
        <RadioGroup defaultValue="a">
          <Radio.Root value="a" aria-label="Option A" />
        </RadioGroup>,
      );
      const radio = screen.getByRole("radio");
      expect(radio.querySelector("[data-slot='radio-indicator']")).toBeInTheDocument();
    });

    it("renders checked state", () => {
      render(
        <RadioGroup defaultValue="a">
          <Radio.Root value="a" aria-label="Option A" />
          <Radio.Root value="b" aria-label="Option B" />
        </RadioGroup>,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "true");
      expect(radios[1]).toHaveAttribute("aria-checked", "false");
    });

    it("renders disabled state", () => {
      render(
        <RadioGroup>
          <Radio.Root value="a" aria-label="Option A" disabled />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio")).toHaveAttribute("data-disabled", "");
    });

    it("applies valid classes when valid", () => {
      render(
        <RadioGroup defaultValue="a">
          <Radio.Root value="a" aria-label="Option A" valid />
        </RadioGroup>,
      );
      expect(screen.getByRole("radio").className).toContain("success");
    });
  });

  describe("Indicator", () => {
    it("renders with data-slot", () => {
      render(
        <RadioGroup defaultValue="a">
          <Radio.Root value="a" aria-label="Option A" />
        </RadioGroup>,
      );
      const indicator = screen.getByRole("radio").querySelector("[data-slot='radio-indicator']");
      expect(indicator).toBeInTheDocument();
    });
  });
});
