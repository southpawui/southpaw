import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { Indicator } from "./Indicator";
import { formatCount } from "../../lib/format-count";
import { destroyAnnouncer, ANNOUNCE_WRITE_DELAY_MS } from "../../lib/announce";

afterEach(() => vi.restoreAllMocks());

const badgeOf = (container: HTMLElement) =>
  container.querySelector<HTMLElement>("[data-slot=indicator-badge]")!;

const Bell = (props: React.ComponentPropsWithRef<"button">) => (
  <button type="button" aria-label="Notifications" {...props} />
);

describe("formatCount", () => {
  it("caps at max (default 99) with a localisable +", () => {
    expect(formatCount(5)).toBe("5");
    expect(formatCount(99)).toBe("99");
    expect(formatCount(120)).toBe("99+");
    expect(formatCount(1200, { max: 999, locale: "en" })).toBe("999+");
    expect(formatCount(1200, { max: false, locale: "en" })).toBe("1,200");
    expect(formatCount(120, { overflow: (m) => `más de ${m}` })).toBe("más de 99");
  });

  it("formats for the locale, and compact has no default cap", () => {
    expect(formatCount(1234, { max: false, locale: "de" })).toBe("1.234");
    expect(formatCount(1234, { format: "compact", locale: "en" })).toBe("1.2K");
    expect(formatCount(1500000, { format: "compact", locale: "en" })).toBe("1.5M");
  });
});

describe("Indicator (overlay)", () => {
  it("wraps the child in a non-interactive span; the badge is aria-hidden", () => {
    const { container } = render(
      <Indicator count={5} label={(n) => `${n} unread notifications`}>
        <Bell />
      </Indicator>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("SPAN");
    expect(root).toHaveAttribute("data-slot", "indicator");
    expect(root).not.toHaveAttribute("role");
    expect(root).not.toHaveAttribute("tabindex");
    const badge = badgeOf(container);
    expect(badge).toHaveAttribute("aria-hidden", "true");
    expect(badge.textContent).toBe("5");
  });

  it("the child keeps its name and is described by the label (raw count)", () => {
    render(
      <Indicator count={1234} label={(n) => `${n} unread notifications`}>
        <Bell />
      </Indicator>,
    );
    const button = screen.getByRole("button", { name: "Notifications" });
    expect(button).toHaveAccessibleDescription("1234 unread notifications");
    expect(badgeOf(document.body).textContent).toBe("99+");
  });

  it("merges with an existing aria-describedby", () => {
    render(
      <>
        <span id="hint">Opens your inbox</span>
        <Indicator count={2} label="2 unread">
          <Bell aria-describedby="hint" />
        </Indicator>
      </>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleDescription("Opens your inbox 2 unread");
  });

  it("0 is hidden unless showZero, and hidden ones say nothing", () => {
    const { rerender, container } = render(
      <Indicator count={0} label="0 unread">
        <Bell />
      </Indicator>,
    );
    expect(badgeOf(container)).toHaveClass("scale-0", "opacity-0");
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-describedby");
    rerender(
      <Indicator count={0} showZero label="0 unread">
        <Bell />
      </Indicator>,
    );
    expect(badgeOf(container)).not.toHaveClass("scale-0");
    expect(screen.getByRole("button")).toHaveAccessibleDescription("0 unread");
  });

  it("visible={false} stays mounted, scales away and drops the label", () => {
    const { container } = render(
      <Indicator count={3} label="3 unread" visible={false}>
        <Bell />
      </Indicator>,
    );
    expect(badgeOf(container)).toHaveClass("scale-0", "opacity-0");
    expect(container.querySelector("[data-slot=indicator-label]")).toBeNull();
    expect(container.firstElementChild).toHaveAttribute("data-hidden");
  });

  it("a dot falls back to 'New activity'", () => {
    render(
      <Indicator dot>
        <Bell />
      </Indicator>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleDescription("New activity");
  });

  it("a dot with a label function but no count still falls back to 'New activity'", () => {
    render(
      <Indicator dot label={(n) => `${n} new`}>
        <Bell />
      </Indicator>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleDescription("New activity");
  });

  it("warns once when an overlay count has no label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(
      <Indicator count={3}>
        <Bell />
      </Indicator>,
    );
    rerender(
      <Indicator count={4}>
        <Bell />
      </Indicator>,
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]![0]).toContain("give it a `label`");
  });

  it("a negative count shows 0 and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <Indicator count={-2} showZero label="x">
        <Bell />
      </Indicator>,
    );
    expect(badgeOf(container).textContent).toBe("0");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("can't be negative"));
  });

  it("position is logical and offset becomes CSS variables", () => {
    const { container } = render(
      <Indicator dot position="bottom-start" offset={{ x: 4, y: "2px" }} label="x">
        <Bell />
      </Indicator>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("data-position", "bottom-start");
    expect(root.style.getPropertyValue("--sp-indicator-ox")).toBe("4px");
    expect(root.style.getPropertyValue("--sp-indicator-oy")).toBe("2px");
    const badge = badgeOf(container);
    expect(badge.className).toContain("start-[var(--sp-indicator-inset)]");
    expect(badge.className).toContain("bottom-[var(--sp-indicator-inset)]");
    expect(badge.className).toContain("rtl:[--sp-indicator-dir:-1]");
  });

  it("the wrapper shrinks to its child, even in a stretching flex column", () => {
    const { container } = render(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Indicator count={6} label="6 unread">
          <Bell />
        </Indicator>
      </div>,
    );
    expect(container.querySelector("[data-slot=indicator]")).toHaveClass("w-fit");
  });

  it("circular overlap insets the corners by 14%", () => {
    const { container } = render(
      <Indicator dot overlap="circular" label="x">
        <Bell />
      </Indicator>,
    );
    expect(container.firstElementChild).toHaveClass("[--sp-indicator-inset:14%]");
  });

  it("tone: accent by default, never brand; disabled mutes and stops the pulse", () => {
    const { container, rerender } = render(
      <Indicator count={3} label="x" pulse>
        <Bell />
      </Indicator>,
    );
    expect(badgeOf(container)).toHaveClass("bg-accent");
    expect(badgeOf(container).className).toContain("sp-indicator-pulse");
    expect(badgeOf(container).className).toContain("motion-reduce:before:animate-none");
    expect(badgeOf(container).className).not.toContain("brand");
    rerender(
      <Indicator count={3} label="x" pulse tone="danger" disabled>
        <Bell />
      </Indicator>,
    );
    expect(badgeOf(container)).toHaveClass("bg-fg-muted");
    expect(badgeOf(container).className).not.toContain("sp-indicator-pulse");
    expect(badgeOf(container).textContent).toBe("3");
  });

  it("bordered by default on overlays; forced colours drawn in system colours", () => {
    const { container } = render(
      <Indicator count={3} label="x">
        <Bell />
      </Indicator>,
    );
    expect(badgeOf(container)).toHaveClass("ring-2", "ring-indicator-ring");
    expect(badgeOf(container).className).toContain("forced-colors:bg-[CanvasText]");
  });

  it.each([
    ["success", "circle", "Online"],
    ["danger", "bar", "Busy"],
    ["warning", "triangle", "Away"],
    ["info", "ringed-dot", "New"],
    ["neutral", "ring", "Offline"],
  ] as const)("status %s has its own shape (%s) and a default label", (status, shape, name) => {
    const { container } = render(
      <Indicator status={status}>
        <Bell />
      </Indicator>,
    );
    expect(container.querySelector(`svg[data-shape=${shape}]`)).not.toBeNull();
    expect(screen.getByRole("button")).toHaveAccessibleDescription(name);
  });

  it("pops when the count changes, not on first render", () => {
    const { container, rerender } = render(
      <Indicator count={1} label="x">
        <Bell />
      </Indicator>,
    );
    expect(badgeOf(container).className).not.toContain("sp-indicator-pop");
    rerender(
      <Indicator count={2} label="x">
        <Bell />
      </Indicator>,
    );
    expect(badgeOf(container).className).toContain("sp-indicator-pop");
  });

  it("a child that can't take aria-describedby gets the label read in place", () => {
    const { container } = render(
      <Indicator count={2} label="2 new">
        Inbox
      </Indicator>,
    );
    const label = container.querySelector("[data-slot=indicator-label]")!;
    expect(label).toHaveClass("sr-only");
    expect(label).not.toHaveAttribute("hidden");
  });

  it("forwards ref and render", () => {
    let node: HTMLElement | null = null;
    const { container } = render(
      <Indicator dot label="x" ref={(n) => void (node = n)} render={<div />}>
        <Bell />
      </Indicator>,
    );
    expect(node).toBe(container.firstElementChild);
    expect(node!.tagName).toBe("DIV");
  });
});

describe("Indicator (inline)", () => {
  it("joins the name of what it sits in: 'Issues (12)'", () => {
    render(
      <a href="#issues">
        Issues <Indicator count={12} />
      </a>,
    );
    expect(screen.getByRole("link", { name: "Issues (12)" })).toBeInTheDocument();
    const root = document.querySelector("[data-slot=indicator]")!;
    expect(root).toHaveAttribute("data-inline");
    expect(badgeOf(document.body)).not.toHaveClass("ring-2");
  });

  it("uses the label when given, with the raw count", () => {
    render(
      <a href="#issues">
        Issues <Indicator count={1500} max={999} label={(n) => `${n} open`} />
      </a>,
    );
    expect(screen.getByRole("link", { name: "Issues (1500 open)" })).toBeInTheDocument();
    expect(badgeOf(document.body).textContent).toBe("999+");
  });

  it("a hidden inline count collapses, leaving no gap", () => {
    const { container } = render(
      <a href="#issues">
        Issues <Indicator count={0} />
      </a>,
    );
    expect(badgeOf(container)).toHaveClass("hidden");
    expect(screen.getByRole("link", { name: "Issues" })).toBeInTheDocument();
  });

  it("status with showLabel shows the label as text", () => {
    render(<Indicator status="success" showLabel />);
    expect(screen.getByText("Online")).toBeVisible();
    expect(screen.getByText("Online")).not.toHaveClass("sr-only");
  });
});

describe("announce", () => {
  afterEach(() => {
    destroyAnnouncer();
    vi.useRealTimers();
  });

  it("is off by default", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Indicator count={1} label={(n) => `${n} unread`}>
        <Bell />
      </Indicator>,
    );
    rerender(
      <Indicator count={2} label={(n) => `${n} unread`}>
        <Bell />
      </Indicator>,
    );
    act(() => void vi.advanceTimersByTime(2000));
    expect(document.querySelector("[data-slot=announcer]")).toBeNull();
  });

  it("announces changes (debounced), never on first render", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Indicator count={1} label={(n) => `${n} unread`} announce>
        <Bell />
      </Indicator>,
    );
    act(() => void vi.advanceTimersByTime(2000));
    expect(document.querySelector("[data-slot=announcer]")).toBeNull();
    for (const n of [2, 3]) {
      rerender(
        <Indicator count={n} label={(c) => `${c} unread`} announce>
          <Bell />
        </Indicator>,
      );
    }
    act(() => void vi.advanceTimersByTime(400 + ANNOUNCE_WRITE_DELAY_MS));
    expect(document.querySelector("[data-slot=announcer]")!.textContent).toBe("3 unread");
  });
});

it("renders on the server", () => {
  const html = renderToString(
    <Indicator count={5} label="5 unread">
      <Bell />
    </Indicator>,
  );
  expect(html).toContain('data-slot="indicator"');
  expect(html).toContain("5 unread");
});
