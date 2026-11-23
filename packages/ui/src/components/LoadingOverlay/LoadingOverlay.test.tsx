import * as React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { LoadingOverlay, type LoadingOverlayProps } from "./LoadingOverlay";
import { destroyAnnouncer, ANNOUNCE_WRITE_DELAY_MS } from "../../lib/announce";

const content = (c: HTMLElement) =>
  c.querySelector<HTMLElement>("[data-slot=loading-overlay-content]")!;
const backdrop = () => document.querySelector<HTMLElement>("[data-slot=loading-overlay-backdrop]");
const region = () => document.querySelector("[data-slot=announcer]");
const tick = (ms: number) => act(() => void vi.advanceTimersByTime(ms));
// Effects (and the announcer's write timer) are scheduled when act flushes, so an
// announcement needs its own tick after the one that showed or hid the overlay
const heard = (ms = 0) => {
  tick(ms);
  tick(ANNOUNCE_WRITE_DELAY_MS);
};

function Region(props: Partial<LoadingOverlayProps>) {
  return (
    <LoadingOverlay label="Loading orders" {...props}>
      <button type="button">Reload</button>
      <table>
        <tbody>
          <tr>
            <td>Order 1042</td>
          </tr>
        </tbody>
      </table>
    </LoadingOverlay>
  );
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  destroyAnnouncer();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("LoadingOverlay", () => {
  it("idle: just the content, no busy, no overlay", () => {
    const { container } = render(<Region />);
    expect(container.firstElementChild).toHaveAttribute("data-slot", "loading-overlay");
    expect(content(container)).not.toHaveAttribute("aria-busy");
    expect(content(container)).not.toHaveAttribute("inert");
    expect(backdrop()).toBeNull();
  });

  it("aria-busy at once; inert, backdrop and announcement only after the delay", () => {
    const { container } = render(<Region loading />);
    expect(content(container)).toHaveAttribute("aria-busy", "true");
    expect(content(container)).not.toHaveAttribute("inert");
    expect(backdrop()).toBeNull();
    tick(300); // "short"
    expect(content(container)).toHaveAttribute("inert");
    expect(backdrop()).not.toBeNull();
    tick(ANNOUNCE_WRITE_DELAY_MS);
    expect(region()!.textContent).toBe("Loading orders");
  });

  it("if loading ends within the delay, nothing shows or is said", () => {
    const { container, rerender } = render(<Region loading />);
    tick(200);
    rerender(<Region loading={false} />);
    tick(2000);
    expect(backdrop()).toBeNull();
    expect(content(container)).not.toHaveAttribute("inert");
    expect(content(container)).not.toHaveAttribute("aria-busy");
    expect(region()).toBeNull();
  });

  it("once shown, stays for minDuration, then fades out and unmounts", () => {
    const { container, rerender } = render(<Region loading delay={false} />);
    tick(0);
    expect(backdrop()).not.toBeNull();
    rerender(<Region loading={false} delay={false} />);
    tick(400);
    expect(content(container)).toHaveAttribute("inert"); // still within 500ms
    tick(100);
    expect(content(container)).not.toHaveAttribute("inert");
    expect(backdrop()).toHaveAttribute("data-closing");
    tick(300);
    expect(backdrop()).toBeNull();
  });

  it("the overlay sits outside the busy, inert content", () => {
    const { container } = render(<Region loading delay={false} />);
    tick(0);
    expect(content(container).contains(backdrop())).toBe(false);
    const panel = screen.getByRole("group", { name: "Loading orders" });
    expect(panel).toHaveAttribute("tabindex", "-1");
  });

  it("the Spinner is a picture only: no second status region", () => {
    const { container } = render(<Region loading delay={false} />);
    tick(0);
    const spinner = container.querySelector("[data-slot=spinner]")!;
    expect(spinner).toHaveAttribute("role", "presentation");
    expect(spinner).toHaveAttribute("aria-hidden", "true");
    // No status region of its own (the shared announcer lives outside it)
    expect(container.querySelector("[role=status]")).toBeNull();
  });

  describe("focus", () => {
    it("moves from the region to the panel, and back when loading ends", () => {
      const { rerender } = render(<Region delay={false} />);
      const reload = screen.getByRole("button", { name: "Reload" });
      reload.focus();
      rerender(<Region loading delay={false} />);
      tick(0);
      expect(document.activeElement).toBe(screen.getByRole("group", { name: "Loading orders" }));
      rerender(<Region loading={false} delay={false} />);
      tick(500);
      expect(document.activeElement).toBe(reload);
    });

    it("goes to Cancel when there is one", () => {
      const cancel = <button type="button">Cancel</button>;
      const { rerender } = render(<Region delay={false} action={cancel} />);
      screen.getByRole("button", { name: "Reload" }).focus();
      rerender(<Region loading delay={false} action={cancel} />);
      tick(0);
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancel" }));
    });

    it("doesn't move focus that was outside the region", () => {
      const outside = document.createElement("button");
      document.body.appendChild(outside);
      outside.focus();
      render(<Region loading delay={false} />);
      tick(0);
      expect(document.activeElement).toBe(outside);
      outside.remove();
    });

    it("falls back to the region's first control if the saved one is gone", () => {
      // `gen` remounts the button while the overlay is up, so the saved node disconnects
      function Swap({ loading, gen }: { loading: boolean; gen: number }) {
        return (
          <LoadingOverlay label="Saving" loading={loading} delay={false}>
            <button key={gen} type="button">
              Edit
            </button>
          </LoadingOverlay>
        );
      }
      const { rerender } = render(<Swap loading={false} gen={0} />);
      screen.getByRole("button", { name: "Edit" }).focus();
      rerender(<Swap loading gen={0} />);
      tick(0);
      expect(document.activeElement).toBe(screen.getByRole("group", { name: "Saving" }));
      rerender(<Swap loading gen={1} />);
      rerender(<Swap loading={false} gen={1} />);
      tick(500);
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit" }));
    });
  });

  it("a closing backdrop lets clicks through to the content", () => {
    const { rerender } = render(<Region loading delay={false} />);
    tick(0);
    rerender(<Region loading={false} delay={false} />);
    tick(500);
    expect(backdrop()).toHaveAttribute("data-closing");
    expect(backdrop()!.className).toContain("data-[closing]:pointer-events-none");
  });

  it("falling back to the content itself makes it focusable only until focus leaves", () => {
    // The button disappears while the overlay is up, leaving nothing focusable
    function Gone({ loading, button }: { loading: boolean; button: boolean }) {
      return (
        <LoadingOverlay label="Saving" loading={loading} delay={false}>
          {button ? <button type="button">Save</button> : <p>Saved</p>}
        </LoadingOverlay>
      );
    }
    const { rerender, container } = render(<Gone loading={false} button />);
    screen.getByRole("button", { name: "Save" }).focus();
    rerender(<Gone loading button />);
    tick(0);
    rerender(<Gone loading button={false} />);
    rerender(<Gone loading={false} button={false} />);
    tick(500);
    const c = content(container);
    expect(document.activeElement).toBe(c);
    expect(c).toHaveAttribute("tabindex", "-1");
    act(() => c.blur());
    expect(c).not.toHaveAttribute("tabindex");
  });

  describe("announcements", () => {
    it("start once and finish once (doneLabel), forced so repeats are heard", () => {
      const { rerender } = render(<Region loading delay={false} doneLabel="Orders loaded" />);
      heard();
      expect(region()!.textContent).toBe("Loading orders");
      rerender(<Region loading={false} delay={false} doneLabel="Orders loaded" />);
      heard(500);
      expect(region()!.textContent).toBe("Orders loaded");
      // A second reload says "Loading orders" again
      rerender(<Region loading delay={false} doneLabel="Orders loaded" />);
      heard();
      expect(region()!.textContent).toBe("Loading orders");
    });

    it("no doneLabel: silent when finished", () => {
      const { rerender } = render(<Region loading delay={false} />);
      heard();
      rerender(<Region loading={false} delay={false} />);
      heard(500);
      expect(region()!.textContent).toBe("Loading orders");
    });
  });

  it("description and action render in the panel", () => {
    render(
      <Region
        loading
        delay={false}
        description="This can take a minute"
        action={<button type="button">Cancel</button>}
      />,
    );
    tick(0);
    const panel = screen.getByRole("group", { name: "Loading orders" });
    expect(panel).toHaveAccessibleDescription("This can take a minute");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("value shows a determinate progress bar named by the label", () => {
    render(<Region loading delay={false} value={40} />);
    tick(0);
    const bar = screen.getByRole("progressbar", { name: "Loading orders" });
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(document.querySelector("[data-slot=spinner]")).toBeNull();
  });

  it("blur is opt-in and respects reduced transparency", () => {
    render(<Region loading delay={false} blur />);
    tick(0);
    expect(backdrop()!.className).toContain("supports-[backdrop-filter]:backdrop-blur-sm");
    expect(backdrop()!.className).toContain("prefers-reduced-transparency:reduce");
  });

  describe("fullscreen", () => {
    it("is a modal dialog named by the label; Escape doesn't close it", () => {
      render(<Region loading delay={false} fullscreen />);
      tick(0);
      const dialog = screen.getByRole("dialog", { name: "Loading orders" });
      expect(dialog).toBeInTheDocument();
      fireEvent.keyDown(dialog, { key: "Escape" });
      tick(100);
      expect(screen.getByRole("dialog", { name: "Loading orders" })).toBeInTheDocument();
    });

    it("leaves inerting the page to the Dialog, not the content", () => {
      const { container } = render(<Region loading delay={false} fullscreen />);
      tick(0);
      expect(content(container)).not.toHaveAttribute("inert");
      expect(content(container)).toHaveAttribute("aria-busy", "true");
    });
  });

  it("render and ref", () => {
    let node: HTMLElement | null = null;
    const { container } = render(
      <LoadingOverlay render={<section aria-label="Orders" />} ref={(n) => void (node = n)}>
        x
      </LoadingOverlay>,
    );
    expect(container.firstElementChild!.tagName).toBe("SECTION");
    expect(node).toBe(container.firstElementChild);
  });

  it("renders on the server", () => {
    const html = renderToString(<Region loading />);
    expect(html).toContain('aria-busy="true"');
    expect(html).not.toContain("loading-overlay-backdrop");
  });
});
