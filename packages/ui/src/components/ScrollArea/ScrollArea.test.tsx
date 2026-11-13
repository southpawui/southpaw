import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ScrollArea, type ScrollAreaActions } from "./ScrollArea";

/* ---- jsdom has no layout: fake an overflowing viewport ---- */
function mockOverflow({
  scrollHeight = 1000,
  clientHeight = 200,
  scrollWidth = 200,
  clientWidth = 200,
} = {}) {
  const spies = [
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(scrollHeight),
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(clientHeight),
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(scrollWidth),
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(clientWidth),
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(clientHeight),
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(clientWidth),
  ];
  return () => spies.forEach((s) => s.mockRestore());
}

function viewport(container: HTMLElement) {
  return container.querySelector<HTMLDivElement>("[data-slot='scroll-area-viewport']")!;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ScrollArea", () => {
  describe("auto-rendered structure", () => {
    it("renders root, viewport and content with data-slots", () => {
      const { container } = render(
        <ScrollArea.Root aria-label="List">
          <p>Item</p>
        </ScrollArea.Root>,
      );
      expect(container.querySelector("[data-slot='scroll-area']")).toBeInTheDocument();
      expect(viewport(container)).toBeInTheDocument();
      const content = container.querySelector("[data-slot='scroll-area-content']")!;
      expect(content).toContainElement(screen.getByText("Item"));
      expect(viewport(container)).toContainElement(content as HTMLElement);
    });

    it("keeps scrollbars mounted with type='always'", () => {
      const { container } = render(<ScrollArea.Root type="always">x</ScrollArea.Root>);
      const bars = container.querySelectorAll("[data-slot='scroll-area-scrollbar']");
      expect(bars).toHaveLength(2);
      expect(bars[0]!.querySelector("[data-slot='scroll-area-thumb']")).toBeInTheDocument();
    });

    it("renders only the vertical scrollbar with scrollbars='y' and locks x scrolling", () => {
      const { container } = render(
        <ScrollArea.Root type="always" scrollbars="y">
          x
        </ScrollArea.Root>,
      );
      const bars = container.querySelectorAll("[data-slot='scroll-area-scrollbar']");
      expect(bars).toHaveLength(1);
      expect(bars[0]).toHaveAttribute("data-orientation", "vertical");
      expect(viewport(container).style.overflowX).toBe("hidden");
    });

    it("renders no scrollbars with type='never'", () => {
      const { container } = render(<ScrollArea.Root type="never">x</ScrollArea.Root>);
      expect(container.querySelector("[data-slot='scroll-area-scrollbar']")).toBeNull();
      expect(container.querySelector("[data-slot='scroll-area-corner']")).toBeNull();
    });

    it("forwards ref to Root and viewportRef to the viewport", () => {
      const ref = React.createRef<HTMLDivElement>();
      const viewportRef = React.createRef<HTMLDivElement>();
      render(
        <ScrollArea.Root ref={ref} viewportRef={viewportRef}>
          x
        </ScrollArea.Root>,
      );
      expect(ref.current).toHaveAttribute("data-slot", "scroll-area");
      expect(viewportRef.current).toHaveAttribute("data-slot", "scroll-area-viewport");
    });
  });

  describe("composed mode", () => {
    it("uses the consumer's parts instead of auto-rendering", () => {
      const { container } = render(
        <ScrollArea.Root type="always">
          <ScrollArea.Viewport className="custom-viewport">
            <ScrollArea.Content>x</ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" />
        </ScrollArea.Root>,
      );
      expect(container.querySelectorAll("[data-slot='scroll-area-viewport']")).toHaveLength(1);
      expect(viewport(container)).toHaveClass("custom-viewport");
      expect(container.querySelectorAll("[data-slot='scroll-area-scrollbar']")).toHaveLength(1);
    });
  });

  describe("composed mode — Root-level props", () => {
    it("forwards aria-label from Root to a consumer Viewport", async () => {
      mockOverflow();
      render(
        <ScrollArea.Root aria-label="Options">
          <ScrollArea.Viewport>
            <ScrollArea.Content>x</ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea.Root>,
      );
      expect(await screen.findByRole("region", { name: "Options" })).toBeInTheDocument();
    });

    it("lets props on Viewport override Root-level ones", async () => {
      mockOverflow();
      render(
        <ScrollArea.Root aria-label="From root">
          <ScrollArea.Viewport aria-label="From viewport">x</ScrollArea.Viewport>
        </ScrollArea.Root>,
      );
      expect(await screen.findByRole("region", { name: "From viewport" })).toBeInTheDocument();
    });

    it("forwards maxHeight, actionsRef and viewportRef from Root", () => {
      const actions = React.createRef<ScrollAreaActions>();
      const viewportRef = React.createRef<HTMLDivElement>();
      const { container } = render(
        <ScrollArea.Root maxHeight={200} actionsRef={actions} viewportRef={viewportRef}>
          <ScrollArea.Viewport>x</ScrollArea.Viewport>
        </ScrollArea.Root>,
      );
      expect(viewport(container).style.maxHeight).toBe("200px");
      expect(actions.current!.getViewport()).toBe(viewport(container));
      expect(viewportRef.current).toBe(viewport(container));
    });

    it("forwards edge callbacks from Root", () => {
      mockOverflow({ scrollHeight: 1000, clientHeight: 200 });
      const onBottomReached = vi.fn();
      const { container } = render(
        <ScrollArea.Root onBottomReached={onBottomReached}>
          <ScrollArea.Viewport aria-label="List">x</ScrollArea.Viewport>
        </ScrollArea.Root>,
      );
      const vp = viewport(container);
      vp.scrollTop = 800;
      fireEvent.scroll(vp);
      expect(onBottomReached).toHaveBeenCalledTimes(1);
    });
  });

  describe("render prop", () => {
    it("renders the consumer's element with slot, Base UI attributes and region ARIA", async () => {
      mockOverflow();
      const { container } = render(
        <ScrollArea.Root aria-label="Results" viewportProps={{ render: <section /> }}>
          x
        </ScrollArea.Root>,
      );
      const vp = viewport(container);
      expect(vp.tagName).toBe("SECTION");
      expect(await screen.findByRole("region", { name: "Results" })).toBe(vp);
      expect(vp).toHaveAttribute("data-has-overflow-y");
    });

    it("supports a render function and still forwards the ref", async () => {
      mockOverflow();
      const viewportRef = React.createRef<HTMLDivElement>();
      render(
        <ScrollArea.Root
          aria-label="Results"
          viewportRef={viewportRef}
          viewportProps={{ render: (props) => <section {...props} data-custom="" /> }}
        >
          x
        </ScrollArea.Root>,
      );
      const region = await screen.findByRole("region", { name: "Results" });
      expect(region.tagName).toBe("SECTION");
      expect(region).toHaveAttribute("data-custom");
      expect(viewportRef.current).toBe(region);
    });
  });

  describe("styling props", () => {
    it("sets the scrollbar size variable per size", () => {
      const { container } = render(<ScrollArea.Root size="lg">x</ScrollArea.Root>);
      expect(container.firstElementChild!.className).toContain("[--sp-scrollbar-size:14px]");
    });

    it("sets the hide delay variable", () => {
      const { container } = render(<ScrollArea.Root scrollHideDelay={1200}>x</ScrollArea.Root>);
      expect(
        (container.firstElementChild as HTMLElement).style.getPropertyValue(
          "--sp-scroll-hide-delay",
        ),
      ).toBe("1200ms");
    });

    it("applies hover visibility classes to scrollbars", () => {
      const { container } = render(
        <ScrollArea.Root type="hover">
          <ScrollArea.Viewport>x</ScrollArea.Viewport>
          <ScrollArea.Scrollbar keepMounted />
        </ScrollArea.Root>,
      );
      const bar = container.querySelector("[data-slot='scroll-area-scrollbar']")!;
      expect(bar.className).toContain("opacity-0");
      expect(bar.className).toContain("data-[hovering]:opacity-100");
    });

    it("reserves a gutter with offsetScrollbars", () => {
      const { container } = render(<ScrollArea.Root offsetScrollbars="y">x</ScrollArea.Root>);
      expect(viewport(container).className).toContain("pe-[var(--sp-scrollbar-size)]");
      expect(viewport(container).className).not.toContain("pb-[var(--sp-scrollbar-size)]");
    });

    it("applies maxHeight and overscrollBehavior to the viewport", () => {
      const { container } = render(
        <ScrollArea.Root maxHeight={240} overscrollBehavior="contain">
          x
        </ScrollArea.Root>,
      );
      expect(viewport(container).style.maxHeight).toBe("240px");
      expect(viewport(container).style.overscrollBehavior).toBe("contain");
    });

    it("fades edges by default", () => {
      const { container } = render(<ScrollArea.Root>x</ScrollArea.Root>);
      expect(viewport(container).className).toContain("[mask-composite:intersect]");
    });

    it("fades only the scrolling axis", () => {
      const { container } = render(<ScrollArea.Root scrollbars="y">x</ScrollArea.Root>);
      expect(viewport(container).className).toContain("[mask-image:var(--sp-mask-y)]");
      expect(viewport(container).className).not.toContain("--sp-mask-x");
    });

    it("reserves scroll-padding equal to the fade so focused items aren't faded", () => {
      const { container } = render(<ScrollArea.Root scrollbars="y">x</ScrollArea.Root>);
      expect(viewport(container).className).toContain(
        "scroll-py-[var(--sp-scroll-area-fade-size,2rem)]",
      );
      expect(viewport(container).className).not.toContain("scroll-px-");
    });

    it("removes the fade with edgeIndicator='none'", () => {
      const { container } = render(<ScrollArea.Root edgeIndicator="none">x</ScrollArea.Root>);
      expect(viewport(container).className).not.toContain("mask-image");
    });

    it("renders decorative edge shadows for edgeIndicator='shadow'", () => {
      const { container } = render(
        <ScrollArea.Root edgeIndicator="shadow" scrollbars="y">
          x
        </ScrollArea.Root>,
      );
      const shadows = container.querySelectorAll("[data-slot='scroll-area-shadow']");
      expect(shadows).toHaveLength(2);
      shadows.forEach((s) => expect(s).toHaveAttribute("aria-hidden", "true"));
    });
  });

  describe("accessibility", () => {
    it("does not expose a region or name when nothing overflows", () => {
      const { container } = render(<ScrollArea.Root aria-label="List">x</ScrollArea.Root>);
      expect(viewport(container)).not.toHaveAttribute("role");
      expect(viewport(container)).not.toHaveAttribute("aria-label");
      expect(screen.queryByRole("region")).toBeNull();
    });

    it("becomes a named, focusable region when content overflows", async () => {
      mockOverflow();
      render(<ScrollArea.Root aria-label="Notifications">x</ScrollArea.Root>);
      const region = await screen.findByRole("region", { name: "Notifications" });
      expect(region).toHaveAttribute("tabindex", "0");
    });

    it("supports aria-labelledby", async () => {
      mockOverflow();
      render(
        <>
          <h2 id="heading">Tags</h2>
          <ScrollArea.Root aria-labelledby="heading">x</ScrollArea.Root>
        </>,
      );
      expect(await screen.findByRole("region", { name: "Tags" })).toBeInTheDocument();
    });

    it("warns in development when a scrollable region has no name", async () => {
      mockOverflow();
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<ScrollArea.Root>x</ScrollArea.Root>);
      await waitFor(() =>
        expect(warn).toHaveBeenCalledWith(expect.stringContaining("accessible name")),
      );
    });

    it("calls onOverflowChange when overflow starts", async () => {
      mockOverflow();
      const onOverflowChange = vi.fn();
      render(
        <ScrollArea.Root aria-label="List" onOverflowChange={onOverflowChange}>
          x
        </ScrollArea.Root>,
      );
      await waitFor(() => expect(onOverflowChange).toHaveBeenCalledWith({ x: false, y: true }));
    });
  });

  describe("scroll callbacks", () => {
    it("reports position and edge arrivals", () => {
      mockOverflow({ scrollHeight: 1000, clientHeight: 200 });
      const onScrollPositionChange = vi.fn();
      const onBottomReached = vi.fn();
      const onTopReached = vi.fn();
      const { container } = render(
        <ScrollArea.Root
          aria-label="List"
          onScrollPositionChange={onScrollPositionChange}
          onBottomReached={onBottomReached}
          onTopReached={onTopReached}
        >
          x
        </ScrollArea.Root>,
      );
      const vp = viewport(container);

      vp.scrollTop = 400;
      fireEvent.scroll(vp);
      expect(onScrollPositionChange).toHaveBeenLastCalledWith({ x: 0, y: 400 });
      expect(onBottomReached).not.toHaveBeenCalled();

      vp.scrollTop = 800;
      fireEvent.scroll(vp);
      expect(onBottomReached).toHaveBeenCalledTimes(1);

      // Staying at the bottom doesn't re-fire
      fireEvent.scroll(vp);
      expect(onBottomReached).toHaveBeenCalledTimes(1);

      vp.scrollTop = 0;
      fireEvent.scroll(vp);
      expect(onTopReached).toHaveBeenCalledTimes(1);
    });

    it("still calls a consumer onScroll", () => {
      const onScroll = vi.fn();
      const { container } = render(
        <ScrollArea.Root viewportProps={{ onScroll }}>x</ScrollArea.Root>,
      );
      fireEvent.scroll(viewport(container));
      expect(onScroll).toHaveBeenCalled();
    });

    it("applies startScrollPosition on mount", () => {
      mockOverflow();
      const { container } = render(
        <ScrollArea.Root startScrollPosition={{ y: 300 }}>x</ScrollArea.Root>,
      );
      expect(viewport(container).scrollTop).toBe(300);
    });
  });

  describe("actionsRef", () => {
    function setup() {
      const actions = React.createRef<ScrollAreaActions>();
      const { container } = render(
        <ScrollArea.Root actionsRef={actions} aria-label="List">
          <p data-testid="target">Target</p>
        </ScrollArea.Root>,
      );
      const vp = viewport(container);
      const scrollTo = vi.fn();
      vp.scrollTo = scrollTo as unknown as typeof vp.scrollTo;
      return { actions, vp, scrollTo };
    }

    it("exposes the viewport", () => {
      const { actions, vp } = setup();
      expect(actions.current!.getViewport()).toBe(vp);
    });

    it("scrollToBottom scrolls to scrollHeight", () => {
      mockOverflow({ scrollHeight: 900 });
      const { actions, scrollTo } = setup();
      actions.current!.scrollToBottom();
      expect(scrollTo).toHaveBeenCalledWith({ top: 900, behavior: "auto" });
    });

    it("downgrades smooth scrolling under prefers-reduced-motion", () => {
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true } as MediaQueryList));
      const { actions, scrollTo } = setup();
      actions.current!.scrollToTop("smooth");
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
      vi.unstubAllGlobals();
    });

    it("keeps smooth scrolling without reduced motion", () => {
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false } as MediaQueryList));
      const { actions, scrollTo } = setup();
      actions.current!.scrollToTop("smooth");
      expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
      vi.unstubAllGlobals();
    });

    it("scrollIntoView moves only the viewport, aligning to the nearest edge", () => {
      mockOverflow({ clientHeight: 200 });
      const { actions, vp, scrollTo } = setup();
      const target = screen.getByTestId("target");
      vi.spyOn(vp, "getBoundingClientRect").mockReturnValue({ top: 0, left: 0 } as DOMRect);
      // Target sits 500px down, 40px tall
      vi.spyOn(target, "getBoundingClientRect").mockReturnValue({
        top: 500,
        left: 0,
        height: 40,
        width: 100,
      } as DOMRect);
      // jsdom has no native scrollIntoView; stub it to prove we never call it
      const pageScroll = vi.fn();
      target.scrollIntoView = pageScroll;

      actions.current!.scrollIntoView(target);
      // nearest: bottom of target (540) − viewport height (200)
      expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 340 }));

      actions.current!.scrollIntoView("[data-testid='target']", { block: "start", offset: 8 });
      expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 492 }));

      expect(pageScroll).not.toHaveBeenCalled();
    });

    it("scrollIntoView defaults its offset to the viewport's scroll-padding", () => {
      mockOverflow({ clientHeight: 200 });
      const actions = React.createRef<ScrollAreaActions>();
      const { container } = render(
        <ScrollArea.Root
          actionsRef={actions}
          aria-label="List"
          viewportProps={{ style: { scrollPaddingTop: "32px" } }}
        >
          <p data-testid="target">Target</p>
        </ScrollArea.Root>,
      );
      const vp = viewport(container);
      const scrollTo = vi.fn();
      vp.scrollTo = scrollTo as unknown as typeof vp.scrollTo;
      vi.spyOn(vp, "getBoundingClientRect").mockReturnValue({ top: 0, left: 0 } as DOMRect);
      vi.spyOn(screen.getByTestId("target"), "getBoundingClientRect").mockReturnValue({
        top: 500,
        left: 0,
        height: 40,
        width: 100,
      } as DOMRect);

      actions.current!.scrollIntoView(screen.getByTestId("target"));
      // 540 bottom + 32 padding − 200 viewport
      expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 372 }));

      // An explicit offset wins
      actions.current!.scrollIntoView(screen.getByTestId("target"), { offset: 0 });
      expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ top: 340 }));
    });

    it("ignores elements outside the viewport", () => {
      const { actions, scrollTo } = setup();
      actions.current!.scrollIntoView(document.body);
      expect(scrollTo).not.toHaveBeenCalled();
    });
  });
});
