import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  describe("Root", () => {
    it("renders as a checkbox", () => {
      render(<Checkbox.Root aria-label="Accept" />);
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("toggles checked state on click", async () => {
      const user = userEvent.setup();
      render(<Checkbox.Root aria-label="Accept" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("renders checked by default with defaultChecked", () => {
      render(<Checkbox.Root aria-label="Accept" defaultChecked />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("renders indeterminate state", () => {
      render(<Checkbox.Root aria-label="Select all" indeterminate />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    });

    it("renders disabled state", () => {
      render(<Checkbox.Root aria-label="Locked" disabled />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("data-disabled", "");
    });

    it("applies data-slot attribute", () => {
      render(<Checkbox.Root aria-label="Test" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("data-slot", "checkbox");
    });

    it("auto-renders Indicator as children", () => {
      render(<Checkbox.Root aria-label="Check" defaultChecked />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.querySelector("[data-slot='checkbox-indicator']")).toBeInTheDocument();
    });

    it("applies valid classes when valid and checked", () => {
      render(<Checkbox.Root aria-label="Valid" defaultChecked valid />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.className).toContain("success");
    });
  });

  describe("Indicator", () => {
    it("renders with data-slot", () => {
      render(<Checkbox.Root aria-label="Check" defaultChecked />);
      const indicator = screen
        .getByRole("checkbox")
        .querySelector("[data-slot='checkbox-indicator']");
      expect(indicator).toBeInTheDocument();
    });
  });
});
