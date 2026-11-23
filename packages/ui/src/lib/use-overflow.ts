import * as React from "react";

/* ============================================================
 * useOverflow (GEO-928)
 *
 * Works out which items of a row don't fit, so they can move into a "More"
 * menu (Primer ActionBar, Spectrum ActionGroup `overflowMode="collapse"`).
 *
 * The measuring started inline in NavigationMenu's DesktopList. Toolbar is
 * the third user (after NavigationMenu and Tabs), so it lives here now;
 * NavigationMenu and Tabs move onto it in their restack follow-ups.
 *
 * How it measures: `measureRef` is a row where every item is rendered at its
 * natural width, in order (Toolbar renders an invisible, inert copy). Its
 * element children are the items; a child with `data-overflow-more` is the
 * More trigger, measured for its width but not an item. `containerRef` is
 * the real row: its content box is the space available. Both are watched
 * with a ResizeObserver, so labels hiding at a breakpoint or the container
 * resizing re-run it.
 *
 * Which items go: pinned items (`pinned[i]`) never overflow, and their width
 * is always reserved. Otherwise items stay in order while they fit; from the
 * first one that doesn't, every later unpinned item overflows too, so the
 * menu keeps the toolbar's order.
 * ============================================================ */

const useIsoLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export interface UseOverflowOptions {
  /** Off: nothing overflows and nothing is observed. */
  enabled: boolean;
  /** The real row. Its content box (minus padding) is the space available. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** A row of every item at natural width, plus an optional `[data-overflow-more]` child. */
  measureRef: React.RefObject<HTMLElement | null>;
  /** Items that never overflow, by index. */
  pinned?: readonly boolean[];
  /** Changes that should re-measure even without a resize (e.g. the item count). */
  deps?: React.DependencyList;
}

/** Pure part, exported for tests: which indices overflow. */
export function computeOverflow({
  widths,
  pinned = [],
  gap,
  available,
  moreWidth,
}: {
  widths: readonly number[];
  pinned?: readonly boolean[];
  gap: number;
  available: number;
  moreWidth: number;
}): number[] {
  const n = widths.length;
  if (n === 0 || available <= 0) return [];
  const total = widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(0, n - 1);
  if (total <= available + 0.5) return [];

  // Reserve the More trigger and every pinned item first.
  let used = moreWidth;
  let placed = 1; // the More trigger
  widths.forEach((w, i) => {
    if (pinned[i]) {
      used += w;
      placed += 1;
    }
  });
  used += gap * Math.max(0, placed - 1);

  const overflowed: number[] = [];
  let full = false;
  widths.forEach((w, i) => {
    if (pinned[i]) return;
    if (!full && used + gap + w <= available + 0.5) {
      used += gap + w;
    } else {
      full = true;
      overflowed.push(i);
    }
  });
  return overflowed;
}

export function useOverflow({
  enabled,
  containerRef,
  measureRef,
  pinned,
  deps = [],
}: UseOverflowOptions): number[] {
  const [overflowed, setOverflowed] = React.useState<number[]>([]);
  const pinnedKey = pinned ? pinned.map((p) => (p ? 1 : 0)).join("") : "";

  useIsoLayoutEffect(() => {
    if (!enabled) {
      setOverflowed((prev) => (prev.length ? [] : prev));
      return;
    }
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const run = () => {
      const children = Array.from(measure.children) as HTMLElement[];
      const more = children.find((c) => c.hasAttribute("data-overflow-more"));
      const items = children.filter((c) => !c.hasAttribute("data-overflow-more"));
      // Outer width: margins count (a separator's mx-1), like the gap does.
      const outer = (c: HTMLElement) => {
        const cs = getComputedStyle(c);
        return (
          c.getBoundingClientRect().width +
          (parseFloat(cs.marginLeft) || 0) +
          (parseFloat(cs.marginRight) || 0)
        );
      };
      const widths = items.map(outer);
      const style = getComputedStyle(container);
      const gap = parseFloat(getComputedStyle(measure).columnGap) || 0;
      const available =
        container.clientWidth -
        (parseFloat(style.paddingLeft) || 0) -
        (parseFloat(style.paddingRight) || 0);
      const next = computeOverflow({
        widths,
        pinned: pinnedKey.split("").map((c) => c === "1"),
        gap,
        available,
        moreWidth: more ? outer(more) : 0,
      });
      setOverflowed((prev) => (prev.join(",") === next.join(",") ? prev : next));
    };

    run();
    // A web font arriving late changes every label's width
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) run();
    });
    if (typeof ResizeObserver === "undefined") {
      return () => {
        cancelled = true;
      };
    }
    // The measuring row is 0x0, so its own size never changes: watch each item in it too
    // (a label changing, an icon swapping), as well as the container.
    const observer = new ResizeObserver(run);
    observer.observe(container);
    for (const child of Array.from(measure.children)) observer.observe(child);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [enabled, pinnedKey, containerRef, measureRef, ...deps]);

  return overflowed;
}
