import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./index";

describe("Button", () => {
  it("renders with text content", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
  });

  it("fires onClick handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("defaults to solid variant", () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole("button").className).toContain("bg-accent");
  });

  it("applies brand variant", () => {
    render(<Button variant="brand">CTA</Button>);
    expect(screen.getByRole("button").className).toContain("bg-brand");
  });

  it("applies outline variant", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button").className).toContain("border-border-control");
  });

  it("applies ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button").className).toContain("bg-transparent");
  });

  it("applies danger variant", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button").className).toContain("bg-danger");
  });

  it("applies size classes via density tokens", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toContain("--sp-control-height-sm");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button").className).toContain("--sp-control-height)");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("--sp-control-height-lg");
  });

  it("has focus ring class", () => {
    render(<Button>Focus</Button>);
    expect(screen.getByRole("button").className).toContain("sp-focus-ring");
  });

  it("has press scale feedback", () => {
    render(<Button>Press</Button>);
    expect(screen.getByRole("button").className).toContain("--sp-scale-press");
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });
});
