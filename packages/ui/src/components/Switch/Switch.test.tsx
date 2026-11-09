import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";

describe("Switch", () => {
  describe("Root", () => {
    it("renders as a switch", () => {
      render(<Switch.Root aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("applies data-slot attribute", () => {
      render(<Switch.Root aria-label="Toggle" />);
      expect(screen.getByRole("switch")).toHaveAttribute("data-slot", "switch");
    });

    it("toggles on click", async () => {
      const user = userEvent.setup();
      render(<Switch.Root aria-label="Toggle" />);
      const sw = screen.getByRole("switch");
      expect(sw).toHaveAttribute("aria-checked", "false");
      await user.click(sw);
      expect(sw).toHaveAttribute("aria-checked", "true");
    });

    it("renders checked by default", () => {
      render(<Switch.Root aria-label="Toggle" defaultChecked />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });

    it("renders disabled state", () => {
      render(<Switch.Root aria-label="Toggle" disabled />);
      expect(screen.getByRole("switch")).toHaveAttribute("data-disabled", "");
    });

    it("auto-renders Thumb as children", () => {
      render(<Switch.Root aria-label="Toggle" />);
      const sw = screen.getByRole("switch");
      expect(sw.querySelector("[data-slot='switch-thumb']")).toBeInTheDocument();
    });

    it("applies valid classes when valid and checked", () => {
      render(<Switch.Root aria-label="Toggle" defaultChecked valid />);
      expect(screen.getByRole("switch").className).toContain("success");
    });
  });
});
