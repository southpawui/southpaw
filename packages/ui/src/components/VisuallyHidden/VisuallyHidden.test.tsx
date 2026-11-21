import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { VisuallyHidden } from "./VisuallyHidden";

describe("VisuallyHidden", () => {
  it("renders a span with its slot and the sr-only class", () => {
    render(<VisuallyHidden>hidden</VisuallyHidden>);
    const el = screen.getByText("hidden");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("data-slot", "visually-hidden");
    // The literal class stays, so `.sr-only` selectors still match
    expect(el).toHaveClass("sr-only");
    expect(el).not.toHaveAttribute("data-focusable");
  });

  it("adds GOV.UK's fixes: no negative margin, no text selection, spacer pseudo-elements", () => {
    render(<VisuallyHidden>hidden</VisuallyHidden>);
    const cls = screen.getByText("hidden").className;
    expect(cls).toContain("m-0");
    expect(cls).toContain("select-none");
    expect(cls).toContain("before:content-['\\00a0']");
    expect(cls).toContain("after:content-['\\00a0']");
  });

  it("stays in the accessibility tree: hidden text completes a link's name", () => {
    render(
      <a href="/name">
        Change<VisuallyHidden> name</VisuallyHidden>
      </a>,
    );
    // jsdom ignores CSS pseudo-elements, so it reads "Changename". The nbsp spacers
    // restore the space in real browsers; the Playwright check covers that.
    expect(screen.getByRole("link", { name: /^Change\s*name$/ })).toBeInTheDocument();
  });

  it("render swaps the element and className merges", () => {
    render(
      <VisuallyHidden render={(props) => <h2 {...props}>{props.children}</h2>} className="custom">
        Section
      </VisuallyHidden>,
    );
    const heading = screen.getByRole("heading", { level: 2, name: "Section" });
    expect(heading).toHaveAttribute("data-slot", "visually-hidden");
    expect(heading).toHaveClass("sr-only", "custom");
  });

  it("forwards its ref", () => {
    let node: HTMLSpanElement | null = null;
    render(<VisuallyHidden ref={(n) => void (node = n)}>hidden</VisuallyHidden>);
    expect(node).toBe(screen.getByText("hidden"));
  });

  describe("focusable", () => {
    it("hides only while neither it nor a child has focus", () => {
      render(
        <VisuallyHidden focusable>
          <a href="#main">Skip</a>
        </VisuallyHidden>,
      );
      const el = screen.getByRole("link").parentElement!;
      expect(el).toHaveAttribute("data-focusable");
      // No bare sr-only: it's conditional on not-focus-within / not-active
      expect(el.className.split(" ")).not.toContain("sr-only");
      expect(el.className).toContain("not-focus-within:not-active:sr-only");
      expect(el.className).toContain("not-focus-within:not-active:before:content-['\\00a0']");
    });

    it("can be the focusable element itself via render", async () => {
      const user = userEvent.setup();
      render(
        <VisuallyHidden
          focusable
          render={(props) => (
            <a {...props} href="#main">
              {props.children}
            </a>
          )}
        >
          Skip to main content
        </VisuallyHidden>,
      );
      const link = screen.getByRole("link", { name: "Skip to main content" });
      expect(link).toHaveAttribute("data-slot", "visually-hidden");
      expect(link).toHaveAttribute("data-focusable");
      // focus-within includes the element itself, so focusing it reveals it
      expect(link.className).toContain("not-focus-within:not-active:sr-only");
      await user.tab();
      expect(link).toHaveFocus();
    });

    it("its content can be reached with Tab", async () => {
      const user = userEvent.setup();
      render(
        <VisuallyHidden focusable>
          <a href="#main">Skip</a>
        </VisuallyHidden>,
      );
      await user.tab();
      expect(screen.getByRole("link", { name: "Skip" })).toHaveFocus();
    });
  });

  it("renders on the server", () => {
    const html = renderToString(<VisuallyHidden>hidden</VisuallyHidden>);
    expect(html).toContain('data-slot="visually-hidden"');
    expect(html).toContain("hidden");
  });
});
