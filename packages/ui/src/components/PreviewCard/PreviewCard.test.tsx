import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { PreviewCard, DEFAULT_DELAY, DEFAULT_CLOSE_DELAY } from "./PreviewCard";

function Basic(props: {
  disabled?: boolean;
  touch?: boolean;
  defaultOpen?: boolean;
  size?: "sm" | "md" | "lg";
  arrow?: boolean;
  label?: string;
}) {
  const label = props.label ?? "GitHub";
  return (
    <PreviewCard.Root disabled={props.disabled} touch={props.touch} defaultOpen={props.defaultOpen}>
      <PreviewCard.Trigger href={`#${label}`}>{label}</PreviewCard.Trigger>
      <PreviewCard.Content size={props.size} arrow={props.arrow}>
        <PreviewCard.Title>{label} title</PreviewCard.Title>
        <PreviewCard.Description>{label} description</PreviewCard.Description>
      </PreviewCard.Content>
    </PreviewCard.Root>
  );
}

const popups = () => document.querySelectorAll<HTMLElement>('[data-slot="preview-card-popup"]');
const popup = () => document.querySelector<HTMLElement>('[data-slot="preview-card-popup"]');
const isOpen = (el: HTMLElement | null = popup()) => !!el && el.hasAttribute("data-open");

function hover(el: Element) {
  fireEvent.mouseEnter(el);
  fireEvent.mouseMove(el);
}

afterEach(() => {
  vi.useRealTimers();
});

describe("PreviewCard", () => {
  describe("trigger", () => {
    it("is a real link with its href", () => {
      render(<Basic />);
      const link = screen.getByRole("link", { name: "GitHub" });
      expect(link).toHaveAttribute("href", "#GitHub");
      expect(link).toHaveAttribute("data-slot", "preview-card-trigger");
      expect(link.className).toContain("underline");
    });

    it("forwards refs to the anchor", () => {
      const ref = React.createRef<HTMLAnchorElement>();
      render(
        <PreviewCard.Root>
          <PreviewCard.Trigger ref={ref} href="#x">
            x
          </PreviewCard.Trigger>
        </PreviewCard.Root>,
      );
      expect(ref.current).toBe(screen.getByRole("link", { name: "x" }));
    });
  });

  describe("delays (Emil: delay the first, then instant)", () => {
    it(`opens after ${DEFAULT_DELAY}ms of hover`, () => {
      vi.useFakeTimers();
      render(<Basic />);
      hover(screen.getByRole("link"));
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY - 50));
      expect(isOpen()).toBe(false);
      act(() => vi.advanceTimersByTime(60));
      expect(isOpen()).toBe(true);
    });

    it(`closes ${DEFAULT_CLOSE_DELAY}ms after the pointer leaves`, () => {
      vi.useFakeTimers();
      render(<Basic />);
      const link = screen.getByRole("link");
      hover(link);
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY + 10));
      expect(isOpen()).toBe(true);
      fireEvent.mouseLeave(link);
      act(() => vi.advanceTimersByTime(DEFAULT_CLOSE_DELAY - 50));
      expect(isOpen()).toBe(true);
      act(() => vi.advanceTimersByTime(400));
      expect(isOpen()).toBe(false);
    });

    it("respects delay / closeDelay on the trigger", () => {
      vi.useFakeTimers();
      render(
        <PreviewCard.Root>
          <PreviewCard.Trigger href="#a" delay={100}>
            a
          </PreviewCard.Trigger>
          <PreviewCard.Content>card</PreviewCard.Content>
        </PreviewCard.Root>,
      );
      hover(screen.getByRole("link"));
      act(() => vi.advanceTimersByTime(110));
      expect(isOpen()).toBe(true);
    });
  });

  describe("Group (warm group)", () => {
    function People() {
      return (
        <PreviewCard.Group>
          <Basic label="Ada" />
          <Basic label="Grace" />
        </PreviewCard.Group>
      );
    }

    it("opens the first card after the delay, then neighbours instantly", () => {
      vi.useFakeTimers();
      render(<People />);
      const [ada, grace] = screen.getAllByRole("link");
      hover(ada!);
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY + 10));
      expect(screen.getByText("Ada title")).toBeInTheDocument();
      // First card animates (not instant).
      expect(popup()).not.toHaveAttribute("data-instant");

      fireEvent.mouseLeave(ada!);
      hover(grace!);
      act(() => vi.advanceTimersByTime(20));
      const graceCard = screen
        .getByText("Grace title")
        .closest<HTMLElement>('[data-slot="preview-card-popup"]');
      expect(isOpen(graceCard)).toBe(true);
      expect(graceCard).toHaveAttribute("data-instant");
    });

    it("closes the previous card instantly when a neighbour opens", () => {
      vi.useFakeTimers();
      render(<People />);
      const [ada, grace] = screen.getAllByRole("link");
      hover(ada!);
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY + 10));
      hover(grace!);
      act(() => vi.advanceTimersByTime(20));
      const open = [...popups()].filter((p) => isOpen(p));
      expect(open).toHaveLength(1);
      expect(open[0]).toHaveTextContent("Grace title");
    });

    it("cools down after the group timeout", () => {
      vi.useFakeTimers();
      render(<People />);
      const [ada, grace] = screen.getAllByRole("link");
      hover(ada!);
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY + 10));
      fireEvent.mouseLeave(ada!);
      act(() => vi.advanceTimersByTime(2000));
      expect([...popups()].some((p) => isOpen(p))).toBe(false);
      hover(grace!);
      act(() => vi.advanceTimersByTime(100));
      expect([...popups()].some((p) => isOpen(p))).toBe(false);
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY));
      expect(screen.getByText("Grace title")).toBeInTheDocument();
    });

    it("applies the group's delay to its cards", () => {
      vi.useFakeTimers();
      render(
        <PreviewCard.Group delay={200}>
          <Basic label="Ada" />
        </PreviewCard.Group>,
      );
      hover(screen.getByRole("link"));
      act(() => vi.advanceTimersByTime(210));
      expect(isOpen()).toBe(true);
    });
  });

  describe("states", () => {
    it("disabled never opens; the link still works", () => {
      vi.useFakeTimers();
      render(<Basic disabled />);
      const link = screen.getByRole("link");
      hover(link);
      fireEvent.focus(link);
      act(() => vi.advanceTimersByTime(2000));
      expect(isOpen()).toBe(false);
      expect(link).toHaveAttribute("href", "#GitHub");
    });

    it("opens on keyboard focus without animation", () => {
      vi.useFakeTimers();
      render(<Basic />);
      act(() => {
        screen.getByRole("link").focus();
      });
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY + 10));
      expect(isOpen()).toBe(true);
      expect(popup()).toHaveAttribute("data-instant");
    });

    it("closes on Escape", () => {
      render(<Basic defaultOpen />);
      expect(isOpen()).toBe(true);
      fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });
      expect(isOpen()).toBe(false);
    });
  });

  describe("touch (opt-in)", () => {
    it("does not open on long-press by default", () => {
      vi.useFakeTimers();
      render(<Basic />);
      fireEvent.touchStart(screen.getByRole("link"), { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => vi.advanceTimersByTime(1500));
      expect(isOpen()).toBe(false);
    });

    it("opens on a 700ms long-press when touch is set", () => {
      vi.useFakeTimers();
      render(<Basic touch />);
      const link = screen.getByRole("link");
      fireEvent.touchStart(link, { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => vi.advanceTimersByTime(699));
      expect(isOpen()).toBe(false);
      act(() => vi.advanceTimersByTime(1));
      expect(isOpen()).toBe(true);
    });

    it("does not follow the link after a long-press", () => {
      vi.useFakeTimers();
      render(<Basic touch />);
      const link = screen.getByRole("link");
      fireEvent.touchStart(link, { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => vi.advanceTimersByTime(700));
      const touchEnd = fireEvent.touchEnd(link);
      expect(touchEnd).toBe(false); // preventDefault was called
      const click = fireEvent.click(link);
      expect(click).toBe(false);
    });

    it("a normal tap follows the link", () => {
      vi.useFakeTimers();
      render(<Basic touch />);
      const link = screen.getByRole("link");
      fireEvent.touchStart(link, { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => vi.advanceTimersByTime(100));
      expect(fireEvent.touchEnd(link)).toBe(true);
      expect(fireEvent.click(link)).toBe(true);
    });

    it("cancels the long-press when the finger moves (scroll)", () => {
      vi.useFakeTimers();
      render(<Basic touch />);
      const link = screen.getByRole("link");
      fireEvent.touchStart(link, { touches: [{ clientX: 0, clientY: 0 }] });
      fireEvent.touchMove(link, { touches: [{ clientX: 0, clientY: 40 }] });
      act(() => vi.advanceTimersByTime(1000));
      expect(isOpen()).toBe(false);
    });
  });

  describe("Content and styling", () => {
    it.each([
      ["sm", "w-64"],
      ["md", "w-80"],
      ["lg", "w-96"],
    ] as const)("size %s", (size, cls) => {
      render(<Basic defaultOpen size={size} />);
      expect(popup()).toHaveAttribute("data-size", size);
      expect(popup()!.className).toContain(cls);
      expect(popup()!.className).toContain("max-w-[var(--available-width)]");
    });

    it("defaults to md", () => {
      render(<Basic defaultOpen />);
      expect(popup()).toHaveAttribute("data-size", "md");
    });

    it("renders the arrow only when asked", () => {
      const { unmount } = render(<Basic defaultOpen />);
      expect(document.querySelector('[data-slot="preview-card-arrow"]')).toBeNull();
      unmount();
      render(<Basic defaultOpen arrow />);
      expect(document.querySelector('[data-slot="preview-card-arrow"]')).not.toBeNull();
    });

    it("hides the card when the trigger scrolls out of view", () => {
      render(<Basic defaultOpen />);
      const positioner = document.querySelector('[data-slot="preview-card-positioner"]')!;
      expect(positioner.className).toContain("data-[anchor-hidden]:invisible");
    });

    it("forwards the trigger's density to the portalled popup", () => {
      render(
        <div data-density="compact">
          <Basic defaultOpen />
        </div>,
      );
      expect(popup()).toHaveAttribute("data-density", "compact");
    });

    it("renders layout parts with data-slots", () => {
      render(
        <PreviewCard.Root defaultOpen>
          <PreviewCard.Trigger href="#x">x</PreviewCard.Trigger>
          <PreviewCard.Content>
            <PreviewCard.Media>
              <img src="" alt="" />
            </PreviewCard.Media>
            <PreviewCard.Title>t</PreviewCard.Title>
            <PreviewCard.Description>d</PreviewCard.Description>
          </PreviewCard.Content>
        </PreviewCard.Root>,
      );
      for (const slot of [
        "preview-card-positioner",
        "preview-card-popup",
        "preview-card-media",
        "preview-card-title",
        "preview-card-description",
      ]) {
        expect(document.querySelector(`[data-slot="${slot}"]`), slot).not.toBeNull();
      }
    });
  });

  describe("/improve regressions (sign-off 2026-11-16)", () => {
    it("a Group cools down even if the open card unmounts", () => {
      vi.useFakeTimers();
      function Harness({ showAda }: { showAda: boolean }) {
        return (
          <PreviewCard.Group>
            {showAda && <Basic label="Ada" />}
            <Basic label="Grace" />
          </PreviewCard.Group>
        );
      }
      const { rerender } = render(<Harness showAda />);
      hover(screen.getByRole("link", { name: "Ada" }));
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY + 10));
      expect(screen.getByText("Ada title")).toBeInTheDocument();
      // Unmount the open card without it ever reporting a close.
      rerender(<Harness showAda={false} />);
      act(() => vi.advanceTimersByTime(2000));
      hover(screen.getByRole("link", { name: "Grace" }));
      act(() => vi.advanceTimersByTime(100));
      expect(isOpen()).toBe(false); // cold again: waits for the full delay
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY));
      expect(isOpen()).toBe(true);
    });

    it("detached triggers (handle) get touch long-press from their Root", () => {
      vi.useFakeTimers();
      const handle = PreviewCard.createHandle<{ name: string }>();
      render(
        <>
          <PreviewCard.Trigger handle={handle} payload={{ name: "Ada" }} href="#ada">
            Ada
          </PreviewCard.Trigger>
          <PreviewCard.Root handle={handle} touch>
            {({ payload }) => <PreviewCard.Content>{payload?.name} card</PreviewCard.Content>}
          </PreviewCard.Root>
        </>,
      );
      fireEvent.touchStart(screen.getByRole("link", { name: "Ada" }), {
        touches: [{ clientX: 0, clientY: 0 }],
      });
      act(() => vi.advanceTimersByTime(700));
      expect(screen.getByText("Ada card")).toBeInTheDocument();
    });

    it("forwards onOpenChange with the reason", () => {
      vi.useFakeTimers();
      const onOpenChange = vi.fn();
      render(
        <PreviewCard.Root onOpenChange={onOpenChange}>
          <PreviewCard.Trigger href="#x">x</PreviewCard.Trigger>
          <PreviewCard.Content>card</PreviewCard.Content>
        </PreviewCard.Root>,
      );
      hover(screen.getByRole("link"));
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY + 10));
      expect(onOpenChange).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ reason: "trigger-hover" }),
      );
    });

    it("supports controlled open", () => {
      const { rerender } = render(
        <PreviewCard.Root open={false}>
          <PreviewCard.Trigger href="#x">x</PreviewCard.Trigger>
          <PreviewCard.Content>card</PreviewCard.Content>
        </PreviewCard.Root>,
      );
      expect(isOpen()).toBe(false);
      rerender(
        <PreviewCard.Root open>
          <PreviewCard.Trigger href="#x">x</PreviewCard.Trigger>
          <PreviewCard.Content>card</PreviewCard.Content>
        </PreviewCard.Root>,
      );
      expect(isOpen()).toBe(true);
    });

    it("disabled wins over controlled open", () => {
      render(
        <PreviewCard.Root open disabled>
          <PreviewCard.Trigger href="#x">x</PreviewCard.Trigger>
          <PreviewCard.Content>card</PreviewCard.Content>
        </PreviewCard.Root>,
      );
      expect(isOpen()).toBe(false);
    });
  });

  describe("shared card (handle + payload)", () => {
    it("shows the payload of the trigger that opened it", () => {
      vi.useFakeTimers();
      const handle = PreviewCard.createHandle<{ name: string }>();
      render(
        <>
          <PreviewCard.Trigger handle={handle} payload={{ name: "Ada" }} href="#ada">
            Ada
          </PreviewCard.Trigger>
          <PreviewCard.Trigger handle={handle} payload={{ name: "Grace" }} href="#grace">
            Grace
          </PreviewCard.Trigger>
          <PreviewCard.Root handle={handle}>
            {({ payload }) => (
              <PreviewCard.Content>
                <PreviewCard.Viewport>{payload?.name} card</PreviewCard.Viewport>
              </PreviewCard.Content>
            )}
          </PreviewCard.Root>
        </>,
      );
      hover(screen.getByRole("link", { name: "Grace" }));
      act(() => vi.advanceTimersByTime(DEFAULT_DELAY + 10));
      expect(screen.getByText("Grace card")).toBeInTheDocument();
      expect(document.querySelector('[data-slot="preview-card-viewport"]')).not.toBeNull();
    });
  });
});
