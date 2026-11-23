import * as React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { Skeleton } from "./Skeleton";
import { destroyAnnouncer, ANNOUNCE_WRITE_DELAY_MS } from "../../lib/announce";

const slot = (container: HTMLElement, name: string) =>
  container.querySelectorAll<HTMLElement>(`[data-slot="${name}"]`);

describe("Skeleton", () => {
  it("a shape is aria-hidden, has its slot, shape and animation, and no tab stop", () => {
    const { container } = render(<Skeleton />);
    const el = slot(container, "skeleton")[0]!;
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveAttribute("aria-hidden", "true");
    expect(el).toHaveAttribute("data-shape", "rounded");
    expect(el).toHaveAttribute("data-animation", "pulse");
    expect(el).not.toHaveAttribute("tabindex");
    expect(el).toHaveClass("bg-skeleton", "outline-skeleton-outline");
  });

  it("shape and animation set data attributes and classes", () => {
    const { container } = render(
      <>
        <Skeleton shape="circle" animation="wave" />
        <Skeleton shape="text" animation="none" />
        <Skeleton shape="rectangle" />
      </>,
    );
    const [circle, text, rect] = slot(container, "skeleton");
    expect(circle).toHaveAttribute("data-shape", "circle");
    expect(circle).toHaveClass("rounded-full");
    expect(circle!.className).toContain("sp-skeleton-wave");
    expect(circle!.className).toContain("rtl:[animation:sp-skeleton-appear");
    expect(text).toHaveAttribute("data-animation", "none");
    expect(text!.className).not.toContain("sp-skeleton-pulse");
    expect(text).toHaveClass("h-[1em]");
    expect(rect).toHaveClass("rounded-none");
  });

  it("reduced motion: both animations swap to the gentle pulse", () => {
    const { container } = render(
      <>
        <Skeleton animation="pulse" />
        <Skeleton animation="wave" />
      </>,
    );
    for (const el of slot(container, "skeleton")) {
      expect(el.className).toContain("motion-reduce:[animation:");
      expect(el.className).toContain("sp-skeleton-pulse-reduced");
    }
    expect(slot(container, "skeleton")[1]).toHaveClass("motion-reduce:bg-none");
  });

  it("width and height take numbers (px) or CSS lengths", () => {
    const { container } = render(<Skeleton width={120} height="2rem" />);
    const el = slot(container, "skeleton")[0]!;
    expect(el.style.width).toBe("120px");
    expect(el.style.height).toBe("2rem");
  });

  it("without children, renders nothing once loaded", () => {
    const { container } = render(<Skeleton loading={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  describe("delay", () => {
    it.each([
      [true, "1000ms"],
      ["short", "300ms"],
      [450, "450ms"],
    ] as const)("%s → %s, as a CSS variable (space reserved, no JS timer)", (delay, css) => {
      const { container } = render(<Skeleton delay={delay} />);
      const el = slot(container, "skeleton")[0]!;
      expect(el.style.getPropertyValue("--sp-skeleton-delay")).toBe(css);
      expect(el.className).toContain("sp-skeleton-appear_0s_var(--sp-skeleton-delay,0s)_backwards");
    });

    it("no delay sets no variable", () => {
      const { container } = render(<Skeleton />);
      expect(slot(container, "skeleton")[0]!.style.getPropertyValue("--sp-skeleton-delay")).toBe(
        "",
      );
    });
  });

  describe("wrapping children", () => {
    it("while loading, children are inert and hidden, and the skeleton fits them", () => {
      render(
        <Skeleton>
          <button type="button">Save</button>
        </Skeleton>,
      );
      const button = screen.getByText("Save");
      const wrapper = button.parentElement!;
      expect(wrapper).toHaveAttribute("data-slot", "skeleton");
      expect(wrapper).toHaveAttribute("inert");
      expect(wrapper).toHaveAttribute("aria-hidden", "true");
      expect(wrapper).toHaveClass("w-fit", "text-transparent", "[&_*]:invisible");
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("text shape: an inline bars span inside a block box, so it works in flex parents", () => {
      const { container } = render(
        <div style={{ display: "flex" }}>
          <Skeleton shape="text">A long heading</Skeleton>
        </div>,
      );
      const outer = slot(container, "skeleton")[0]!;
      const bars = screen.getByText("A long heading");
      expect(bars).toHaveAttribute("data-slot", "skeleton-bars");
      expect(bars.parentElement).toBe(outer);
      expect(bars).toHaveClass("box-decoration-clone", "bg-skeleton", "[&_*]:invisible");
      expect(outer).toHaveClass("block");
      expect(outer.className).not.toContain("invisible");
      expect(outer).not.toHaveClass("bg-skeleton");
      expect(outer).toHaveAttribute("inert");
    });

    it("text shape around a heading: hidden until loaded, never an empty heading", () => {
      const { container } = render(
        <Skeleton shape="text">
          <h3>Author talk</h3>
        </Skeleton>,
      );
      expect(screen.queryByRole("heading")).toBeNull();
      // Block children flow inline inside the bars so each line gets a bar
      expect(slot(container, "skeleton-bars")[0]).toHaveClass("[&_*]:!inline");
    });

    it("when loaded, renders only the children (no wrapper)", () => {
      const { container } = render(
        <Skeleton loading={false}>
          <h2>Orders</h2>
        </Skeleton>,
      );
      expect(container.innerHTML).toBe("<h2>Orders</h2>");
    });

    it("fades children in when loading turns false, not on first render", () => {
      const { rerender } = render(
        <Skeleton loading>
          <h2 className="title">Orders</h2>
        </Skeleton>,
      );
      rerender(
        <Skeleton loading={false}>
          <h2 className="title">Orders</h2>
        </Skeleton>,
      );
      const heading = screen.getByRole("heading", { name: "Orders" });
      expect(heading.className).toContain("sp-skeleton-fade-in");
      expect(heading).toHaveClass("title");
    });

    it("Fragment children appear without a fade, and without a React warning", () => {
      const error = vi.spyOn(console, "error").mockImplementation(() => {});
      const { rerender, container } = render(
        <Skeleton loading>
          <>
            <span>A</span>
            <span>B</span>
          </>
        </Skeleton>,
      );
      rerender(
        <Skeleton loading={false}>
          <>
            <span>A</span>
            <span>B</span>
          </>
        </Skeleton>,
      );
      expect(container.innerHTML).toBe("<span>A</span><span>B</span>");
      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });

    it("passes ref and render through", () => {
      let node: HTMLElement | null = null;
      const { container } = render(
        <Skeleton ref={(n) => void (node = n)} render={<div />} className="custom" />,
      );
      const el = slot(container, "skeleton")[0]!;
      expect(el.tagName).toBe("DIV");
      expect(node).toBe(el);
      expect(el).toHaveClass("custom");
    });
  });

  describe("Skeleton.Text", () => {
    it("renders the line count, last line 60%, with no list or paragraph roles", () => {
      const { container } = render(<Skeleton.Text lines={4} />);
      const text = slot(container, "skeleton-text")[0]!;
      expect(text).toHaveAttribute("aria-hidden", "true");
      const lines = slot(container, "skeleton-line");
      expect(lines).toHaveLength(4);
      expect(lines[3]!.style.width).toBe("60%");
      expect(lines[0]!.style.width).toBe("");
      expect(container.querySelector("ul, li, p")).toBeNull();
    });

    it("widths set each line; one line is full width", () => {
      const { container } = render(<Skeleton.Text lines={2} widths={[200, "40%"]} />);
      const lines = slot(container, "skeleton-line");
      expect(lines[0]!.style.width).toBe("200px");
      expect(lines[1]!.style.width).toBe("40%");
      const single = render(<Skeleton.Text lines={1} />).container;
      expect(slot(single, "skeleton-line")[0]!.style.width).toBe("");
    });
  });

  describe("presets", () => {
    it("Avatar: Avatar's sizes and shapes", () => {
      const { container } = render(
        <>
          <Skeleton.Avatar size="sm" />
          <Skeleton.Avatar size="lg" shape="square" />
        </>,
      );
      const [sm, lg] = slot(container, "skeleton-avatar");
      expect(sm).toHaveClass("size-8", "rounded-full");
      expect(lg).toHaveClass("size-14", "rounded-lg");
    });

    it("Button and Input: control heights (density), sizes and block", () => {
      const { container } = render(
        <>
          <Skeleton.Button size="lg" />
          <Skeleton.Button block />
          <Skeleton.Input size="sm" />
        </>,
      );
      const [lg, block] = slot(container, "skeleton-button");
      expect(lg).toHaveClass("h-[var(--sp-control-height-lg)]", "w-32");
      expect(block).toHaveClass("w-full");
      expect(slot(container, "skeleton-input")[0]).toHaveClass(
        "h-[var(--sp-control-height-sm)]",
        "w-full",
      );
    });

    it("Image: aspect ratio, and a visible decorative icon", () => {
      const { container } = render(<Skeleton.Image aspectRatio="4 / 3" icon />);
      const image = slot(container, "skeleton-image")[0]!;
      expect(image.style.aspectRatio).toBe("4 / 3");
      expect(image.querySelector("svg")).not.toBeNull();
      // Decoration, not wrapped content: not hidden or inert
      expect(image).not.toHaveAttribute("inert");
      expect(image).not.toHaveClass("[&_*]:invisible");
    });
  });

  describe("Skeleton.Group", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => {
      destroyAnnouncer();
      vi.useRealTimers();
    });
    const region = () => document.querySelector("[data-slot=announcer]");

    it("sets aria-busy and passes loading, animation and delay down", () => {
      const { container, rerender } = render(
        <Skeleton.Group label="Loading orders" animation="wave" delay="short">
          <Skeleton />
          <Skeleton.Text lines={2} />
        </Skeleton.Group>,
      );
      const group = slot(container, "skeleton-group")[0]!;
      expect(group).toHaveAttribute("aria-busy", "true");
      const shape = slot(container, "skeleton")[0]!;
      expect(shape).toHaveAttribute("data-animation", "wave");
      expect(shape.style.getPropertyValue("--sp-skeleton-delay")).toBe("300ms");
      rerender(
        <Skeleton.Group loading={false} label="Loading orders">
          <Skeleton />
          <Skeleton.Text lines={2} />
        </Skeleton.Group>,
      );
      expect(group).not.toHaveAttribute("aria-busy");
      expect(slot(container, "skeleton")).toHaveLength(0);
    });

    it("announces once per loading cycle, not once per item", () => {
      render(
        <Skeleton.Group label="Loading orders" loadedLabel="Orders loaded">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Skeleton.Group>,
      );
      act(() => void vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS + 1));
      expect(document.querySelectorAll("[data-slot=announcer]")).toHaveLength(1);
      expect(region()!.textContent).toBe("Loading orders");
    });

    it("says the loaded message when done, if loading was announced", () => {
      const { rerender } = render(
        <Skeleton.Group label="Loading orders" loadedLabel="Orders loaded">
          <Skeleton />
        </Skeleton.Group>,
      );
      act(() => void vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS + 1));
      rerender(
        <Skeleton.Group loading={false} label="Loading orders" loadedLabel="Orders loaded">
          <Skeleton />
        </Skeleton.Group>,
      );
      act(() => void vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS));
      expect(region()!.textContent).toBe("Orders loaded");
    });

    it("says nothing if loading ends before the delay", () => {
      const { rerender } = render(
        <Skeleton.Group label="Loading orders" loadedLabel="Orders loaded" delay>
          <Skeleton />
        </Skeleton.Group>,
      );
      act(() => void vi.advanceTimersByTime(500));
      rerender(
        <Skeleton.Group loading={false} label="Loading orders" loadedLabel="Orders loaded" delay>
          <Skeleton />
        </Skeleton.Group>,
      );
      act(() => void vi.advanceTimersByTime(2000));
      expect(region()).toBeNull();
    });

    it("a Skeleton's own loading wins over the Group's", () => {
      const { container } = render(
        <Skeleton.Group loading={false}>
          <Skeleton loading />
        </Skeleton.Group>,
      );
      expect(slot(container, "skeleton")).toHaveLength(1);
    });
  });

  it("hydrates server output without a mismatch", async () => {
    const tree = (
      <Skeleton.Group label="Loading">
        <Skeleton.Avatar />
        <Skeleton.Text lines={3} />
        <Skeleton.Image icon />
        <Skeleton delay="short" width={80} />
      </Skeleton.Group>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(tree);
    document.body.appendChild(container);
    const onRecoverableError = vi.fn();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await act(async () => {
      hydrateRoot(container, tree, { onRecoverableError });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
    container.remove();
  });
});
