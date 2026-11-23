import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { announce, destroyAnnouncer, ANNOUNCE_CLEAR_MS, ANNOUNCE_WRITE_DELAY_MS } from "./announce";
import { delayMs } from "./delay";

const regions = () => document.querySelectorAll("[data-slot=announcer]");

describe("announce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    destroyAnnouncer();
    vi.useRealTimers();
  });

  it("creates one polite, atomic, visually hidden region on first use", () => {
    expect(regions()).toHaveLength(0);
    announce("Loading orders");
    expect(regions()).toHaveLength(1);
    const region = regions()[0] as HTMLElement;
    expect(region).toHaveAttribute("role", "status");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
    expect(region.style.position).toBe("absolute");
  });

  it("writes the message after a short gap, so screen readers see a change", () => {
    announce("Loading orders");
    const region = regions()[0]!;
    expect(region.textContent).toBe("");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    expect(region.textContent).toBe("Loading orders");
  });

  it("reuses the same region for later messages", () => {
    announce("Loading orders");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    announce("Orders loaded");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    expect(regions()).toHaveLength(1);
    expect(regions()[0]!.textContent).toBe("Orders loaded");
  });

  it("skips an identical consecutive message", () => {
    announce("Loading");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    const region = regions()[0]!;
    const spy = vi.spyOn(region, "textContent", "set");
    announce("Loading");
    announce(" Loading ");
    expect(spy).not.toHaveBeenCalled();
  });

  it("force announces a repeat: the region empties, then the message is written again", () => {
    announce("Copied");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    const region = regions()[0]!;
    expect(region.textContent).toBe("Copied");
    announce("Copied", { force: true });
    expect(region.textContent).toBe("");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    expect(region.textContent).toBe("Copied");
  });

  it("force still ignores empty messages, and the default still skips repeats", () => {
    announce("Copied");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    const region = regions()[0]!;
    const spy = vi.spyOn(region, "textContent", "set");
    announce("  ", { force: true });
    announce("Copied");
    expect(spy).not.toHaveBeenCalled();
  });

  it("a forced repeat restarts the clear timer", () => {
    announce("Copied");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS + ANNOUNCE_CLEAR_MS - 1000);
    announce("Copied", { force: true });
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS + 1000);
    expect(regions()[0]!.textContent).toBe("Copied");
    vi.advanceTimersByTime(ANNOUNCE_CLEAR_MS);
    expect(regions()[0]!.textContent).toBe("");
  });

  it("clears the message later, and the same text can then be announced again", () => {
    announce("Loading");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS + ANNOUNCE_CLEAR_MS);
    expect(regions()[0]!.textContent).toBe("");
    announce("Loading");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    expect(regions()[0]!.textContent).toBe("Loading");
  });

  it("ignores empty messages", () => {
    announce("   ");
    expect(regions()).toHaveLength(0);
  });

  it("destroyAnnouncer removes the region and cancels a pending message", () => {
    announce("Loading");
    destroyAnnouncer();
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    expect(regions()).toHaveLength(0);
    announce("Loading");
    expect(regions()).toHaveLength(1);
  });

  it("after the app removes the region, the same message is announced again", () => {
    announce("Loading");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    regions()[0]!.remove();
    announce("Loading");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    expect(regions()).toHaveLength(1);
    expect(regions()[0]!.textContent).toBe("Loading");
  });

  it("recreates the region if the app removed it", () => {
    announce("A");
    regions()[0]!.remove();
    announce("B");
    vi.advanceTimersByTime(ANNOUNCE_WRITE_DELAY_MS);
    expect(regions()).toHaveLength(1);
    expect(regions()[0]!.textContent).toBe("B");
  });
});

describe("delayMs", () => {
  it("maps the shared delay API", () => {
    expect(delayMs(true)).toBe(1000);
    expect(delayMs("short")).toBe(300);
    expect(delayMs(450)).toBe(450);
    for (const none of [false, undefined, 0, -5, Number.NaN, Infinity]) {
      expect(delayMs(none as never)).toBe(0);
    }
  });
});
