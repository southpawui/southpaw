import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders Root with data-slot", () => {
    render(<Card.Root data-testid="card">Content</Card.Root>);
    expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "card");
  });

  it("renders elevated variant by default", () => {
    render(<Card.Root data-testid="card">Content</Card.Root>);
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "elevated");
  });

  it("renders outline variant", () => {
    render(
      <Card.Root data-testid="card" variant="outline">
        Content
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "outline");
  });

  it("renders filled variant", () => {
    render(
      <Card.Root data-testid="card" variant="filled">
        Content
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "filled");
  });

  it("renders Eyebrow with data-slot", () => {
    render(<Card.Eyebrow>Featured</Card.Eyebrow>);
    const el = screen.getByText("Featured");
    expect(el).toHaveAttribute("data-slot", "card-eyebrow");
    expect(el.tagName).toBe("SPAN");
  });

  it("renders Header with data-slot", () => {
    render(<Card.Header data-testid="header">Header</Card.Header>);
    expect(screen.getByTestId("header")).toHaveAttribute("data-slot", "card-header");
  });

  it("renders Title as h3 with data-slot", () => {
    render(<Card.Title>Title</Card.Title>);
    const title = screen.getByText("Title");
    expect(title.tagName).toBe("H3");
    expect(title).toHaveAttribute("data-slot", "card-title");
  });

  it("renders Description with data-slot", () => {
    render(<Card.Description>Desc</Card.Description>);
    expect(screen.getByText("Desc")).toHaveAttribute("data-slot", "card-description");
  });

  it("renders Content with data-slot", () => {
    render(<Card.Content data-testid="content">Body</Card.Content>);
    expect(screen.getByTestId("content")).toHaveAttribute("data-slot", "card-content");
  });

  it("renders Footer with data-slot", () => {
    render(<Card.Footer data-testid="footer">Actions</Card.Footer>);
    expect(screen.getByTestId("footer")).toHaveAttribute("data-slot", "card-footer");
  });

  it("renders Image with alt text", () => {
    render(<Card.Image src="test.jpg" alt="test image" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "test image");
    expect(img.closest("[data-slot='card-image']")).toBeInTheDocument();
  });

  it("renders direction attribute", () => {
    render(
      <Card.Root data-testid="card" direction="horizontal">
        Content
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-direction", "horizontal");
  });

  it("renders Action with data-slot", () => {
    render(<Card.Action>View</Card.Action>);
    expect(screen.getByText("View")).toHaveAttribute("data-slot", "card-action");
  });

  it("renders data-interactive as empty string when interactive", () => {
    render(
      <Card.Root data-testid="card" interactive>
        Content
      </Card.Root>,
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-interactive", "");
  });

  it("applies interactive classes when interactive", () => {
    render(
      <Card.Root data-testid="card" interactive>
        Content
      </Card.Root>,
    );
    expect(screen.getByTestId("card").className).toContain("cursor-pointer");
  });

  it("applies custom className", () => {
    render(
      <Card.Root data-testid="card" className="test-class">
        Content
      </Card.Root>,
    );
    expect(screen.getByTestId("card").className).toContain("test-class");
  });
});
