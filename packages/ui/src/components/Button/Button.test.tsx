import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders with label prop", () => {
    render(<Button label="Save" />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("label prop takes precedence over children", () => {
    render(<Button label="Save">Ignored</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Save");
  });

  it("has data-slot attribute", () => {
    render(<Button label="Test" />);
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
  });

  it("fires onClick handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button label="Click" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button label="Disabled" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("defaults to solid variant and default color", () => {
    render(<Button label="Default" />);
    expect(screen.getByRole("button").className).toContain("bg-accent");
  });

  it("applies brand color", () => {
    render(<Button label="CTA" color="brand" />);
    expect(screen.getByRole("button").className).toContain("bg-brand");
  });

  it("applies danger color", () => {
    render(<Button label="Delete" color="danger" />);
    expect(screen.getByRole("button").className).toContain("bg-danger");
  });

  it("applies outline variant", () => {
    render(<Button label="Outline" variant="outline" />);
    expect(screen.getByRole("button").className).toContain("border-border-control");
  });

  it("applies ghost variant", () => {
    render(<Button label="Ghost" variant="ghost" />);
    expect(screen.getByRole("button").className).toContain("bg-transparent");
  });

  it("combines color and variant", () => {
    render(<Button label="Delete" color="danger" variant="outline" />);
    const classes = screen.getByRole("button").className;
    expect(classes).toContain("border-danger");
    expect(classes).toContain("text-danger");
  });

  it("renders icon at start by default", () => {
    render(<Button icon={<svg data-testid="icon" />} label="With icon" />);
    const icon = screen.getByRole("button").querySelector("[data-slot='button-icon']");
    expect(icon).toBeInTheDocument();
  });

  it("renders icon-only button with srOnly", () => {
    render(<Button size="icon" icon={<svg data-testid="icon" />} srOnly="Search" />);
    const btn = screen.getByRole("button", { name: "Search" });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("--sp-control-height");
  });

  it("sets aria-label from srOnly on icon-only button", () => {
    render(<Button size="icon" icon={<svg />} srOnly="Add item" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Add item");
  });

  it("renders sr-only text alongside visible label", () => {
    render(<Button label="Next" srOnly="Go to next page" />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveTextContent("Go to next page");
    expect(btn).toHaveTextContent("Next");
    expect(btn.querySelector(".sr-only")).toHaveTextContent("Go to next page");
  });

  it("has focus ring class", () => {
    render(<Button label="Focus" />);
    expect(screen.getByRole("button").className).toContain("sp-focus-ring");
  });

  it("has press scale feedback", () => {
    render(<Button label="Press" />);
    expect(screen.getByRole("button").className).toContain("--sp-scale-press");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Button ref={ref} label="Ref" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  describe("inactive (GEO-932, Primer)", () => {
    it("stays focusable, is aria-disabled and ignores activation", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button inactive label="Publish" onClick={onClick} />);
      const btn = screen.getByRole("button", { name: "Publish" });
      expect(btn).toHaveAttribute("aria-disabled", "true");
      expect(btn).not.toHaveAttribute("disabled");
      expect(btn).toHaveAttribute("data-inactive");
      await user.tab();
      expect(btn).toHaveFocus();
      await user.click(btn);
      await user.keyboard("{Enter}");
      await user.keyboard(" ");
      expect(onClick).not.toHaveBeenCalled();
    });

    it("has the disabled look without pointer-events-none, hover or press scale", () => {
      render(<Button inactive label="Publish" />);
      const cls = screen.getByRole("button", { name: "Publish" }).className;
      expect(cls).toContain("opacity-[var(--sp-state-disabled-opacity)]");
      expect(cls).toContain("cursor-not-allowed");
      expect(cls).not.toContain("hover:bg-accent/90");
      expect(cls).not.toContain("active:scale-");
    });

    it("disabled wins over inactive (not focusable)", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Button inactive disabled label="Both" />
          <Button label="Next" />
        </>,
      );
      expect(screen.getByRole("button", { name: "Both" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Both" })).not.toHaveAttribute("data-inactive");
      await user.tab();
      expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
    });
  });

  it("loading keeps a 90% fade, not the disabled fade (GEO-961 regression)", () => {
    render(<Button loading label="Saving" />);
    const btn = screen.getByRole("button", { name: /Saving/ });
    // Can't be activated, but stays focusable (GEO-935)
    expect(btn).toHaveAttribute("aria-disabled", "true");
    expect(btn.className).toContain("opacity-90");
    // The :disabled rule out-ranked the loading opacity, so loading showed at the disabled fade.
    expect(btn.className).not.toContain("disabled:opacity-");
  });

  it("loading keeps focus on the button, is busy, and ignores clicks (GEO-935)", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button label="Save" onClick={onClick} />);
    const btn = screen.getByRole("button", { name: "Save" });
    btn.focus();
    rerender(<Button label="Save" onClick={onClick} loading />);
    expect(btn).toHaveFocus();
    expect(btn).not.toHaveAttribute("disabled");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("the loading spinner doesn't join the name (WCAG 2.5.3)", () => {
    render(<Button loading label="Saving" />);
    expect(screen.getByRole("button")).toHaveAccessibleName("Saving");
    // No role=status inside the button: aria-busy on the button says it's busy
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("loading and disabled together stay natively disabled", () => {
    render(<Button label="Off" loading disabled />);
    expect(screen.getByRole("button", { name: /Off/ })).toBeDisabled();
  });

  it("a plain disabled Button still gets the disabled fade", () => {
    render(<Button disabled label="Off" />);
    expect(screen.getByRole("button", { name: "Off" }).className).toContain(
      "disabled:opacity-[var(--sp-state-disabled-opacity)]",
    );
  });
});
