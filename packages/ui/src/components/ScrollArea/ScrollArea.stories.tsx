import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ScrollArea,
  type ScrollAreaActions,
  type ScrollAreaType,
  type ScrollAreaEdgeIndicator,
} from "./ScrollArea";
import { Button } from "../Button/Button";
import { Spinner } from "../Spinner/Spinner";

const meta: Meta = {
  title: "Components/ScrollArea",
};

export default meta;
type Story = StoryObj;

/* ---- Helpers ---- */

const frame = "border-border-default bg-surface-base rounded-md border";
const caption = "text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide";

const tags = Array.from({ length: 40 }, (_, i) => `v1.2.0-beta.${40 - i}`);

function TagList({ count = tags.length }: { count?: number }) {
  return (
    <section className="p-4">
      <h4 className="text-fg-default mb-3 text-sm font-medium">Tags</h4>
      <ul className="text-fg-default text-sm">
        {tags.slice(0, count).map((tag) => (
          <li key={tag} className="border-border-default border-b py-2 last:border-b-0">
            {tag}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Tiles({ count = 15 }: { count?: number }) {
  return (
    <ul className="flex w-max gap-3 p-4">
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="bg-surface-sunken text-fg-default flex size-24 shrink-0 items-center justify-center rounded-md text-sm font-medium"
        >
          {i + 1}
        </li>
      ))}
    </ul>
  );
}

function Grid() {
  return (
    <table className="text-fg-default w-max text-sm">
      <tbody>
        {Array.from({ length: 30 }, (_, r) => (
          <tr key={r}>
            {Array.from({ length: 14 }, (_, c) => (
              <td key={c} className="border-border-default whitespace-nowrap border-b px-3 py-2">
                R{r + 1} · C{c + 1}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <ScrollArea.Root aria-label="Tags" className={`h-72 ${frame}`}>
        <TagList />
      </ScrollArea.Root>
    </div>
  ),
};

/* ============================================================
 * STATES
 * Valid / error / disabled don't apply to a scroll container
 * (agreed 2026-11-13). Shows overflow states, keyboard focus,
 * and every visibility type.
 * ============================================================ */

const types: ScrollAreaType[] = ["auto", "always", "hover", "scroll", "never"];

export const States: Story = {
  render: () => (
    <div className="grid gap-8 sm:max-w-2xl sm:grid-cols-2">
      <div>
        <p className={caption}>No overflow</p>
        <ScrollArea.Root aria-label="Short tag list" className={`h-48 ${frame}`}>
          <TagList count={2} />
        </ScrollArea.Root>
      </div>
      <div>
        <p className={caption}>Overflowing</p>
        <ScrollArea.Root aria-label="Overflowing tag list" className={`h-48 ${frame}`}>
          <TagList />
        </ScrollArea.Root>
      </div>
      <div>
        <p className={caption}>Keyboard focused</p>
        <ScrollArea.Root
          aria-label="Focused tag list"
          className={`h-48 ${frame}`}
          viewportProps={{ id: "scroll-area-focus-demo" }}
        >
          <TagList />
        </ScrollArea.Root>
      </div>
      <div>
        <p className={caption}>always · no overflow (track reserved)</p>
        <ScrollArea.Root type="always" aria-label="Always, short list" className={`h-48 ${frame}`}>
          <TagList count={2} />
        </ScrollArea.Root>
      </div>
      {types.map((type) => (
        <div key={type}>
          <p className={caption}>type=&quot;{type}&quot;</p>
          <ScrollArea.Root
            type={type}
            aria-label={`${type} scrollbars`}
            className={`h-48 ${frame}`}
          >
            <TagList />
          </ScrollArea.Root>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLElement>("#scroll-area-focus-demo")?.focus();
  },
};

/* ============================================================
 * AXES
 * ============================================================ */

export const Horizontal: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <ScrollArea.Root scrollbars="x" aria-label="Gallery" className={frame}>
        <Tiles />
      </ScrollArea.Root>
    </div>
  ),
};

export const BothAxes: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <ScrollArea.Root aria-label="Data grid" className={`h-72 ${frame}`}>
        <Grid />
      </ScrollArea.Root>
    </div>
  ),
};

/* ============================================================
 * SIZES
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className="grid gap-6 sm:max-w-2xl sm:grid-cols-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <p className={caption}>size=&quot;{size}&quot;</p>
          <ScrollArea.Root
            size={size}
            type="always"
            scrollbars="y"
            aria-label={`Tags, ${size}`}
            className={`h-56 ${frame}`}
          >
            <TagList />
          </ScrollArea.Root>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * OFFSET SCROLLBARS
 * ============================================================ */

function Rows() {
  return (
    <ul className="text-fg-default text-sm">
      {tags.map((tag) => (
        <li key={tag} className="bg-surface-sunken mb-1 flex justify-between rounded py-2 ps-3">
          <span>{tag}</span>
          <span className="text-fg-muted tabular-nums">12.4 MB</span>
        </li>
      ))}
    </ul>
  );
}

export const OffsetScrollbars: Story = {
  render: () => (
    <div className="grid gap-6 sm:max-w-xl sm:grid-cols-2">
      <div>
        <p className={caption}>Overlapping (default)</p>
        <ScrollArea.Root
          type="always"
          scrollbars="y"
          aria-label="Without offset"
          className={`h-56 ${frame}`}
        >
          <Rows />
        </ScrollArea.Root>
      </div>
      <div>
        <p className={caption}>offsetScrollbars=&quot;present&quot;</p>
        <ScrollArea.Root
          type="always"
          scrollbars="y"
          offsetScrollbars="present"
          aria-label="With offset"
          className={`h-56 ${frame}`}
        >
          <Rows />
        </ScrollArea.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * AUTOSIZE
 * ============================================================ */

function AutosizeDemo() {
  const [count, setCount] = React.useState(2);
  const [overflow, setOverflow] = React.useState(false);
  return (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setCount((c) => c + 2)}>
          Add tags
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCount(2)}>
          Reset
        </Button>
      </div>
      <ScrollArea.Root
        maxHeight={240}
        aria-label="Growing tag list"
        onOverflowChange={({ y }) => setOverflow(y)}
        className={frame}
      >
        <TagList count={count} />
      </ScrollArea.Root>
      <p className="text-fg-muted text-sm" aria-live="polite">
        {count} tags · {overflow ? "scrolling (max 240px reached)" : "growing with content"}
      </p>
    </div>
  );
}

export const Autosize: Story = { render: () => <AutosizeDemo /> };

/* ============================================================
 * EDGE INDICATORS
 * ============================================================ */

const indicators: ScrollAreaEdgeIndicator[] = ["none", "fade", "shadow"];

export const EdgeIndicators: Story = {
  render: () => (
    <div className="grid gap-6 sm:max-w-3xl sm:grid-cols-3">
      {indicators.map((edgeIndicator) => (
        <div key={edgeIndicator} className="flex flex-col gap-4">
          <p className={caption}>
            edgeIndicator=&quot;{edgeIndicator}&quot;{edgeIndicator === "fade" && " (default)"}
          </p>
          <ScrollArea.Root
            edgeIndicator={edgeIndicator}
            startScrollPosition={{ y: 160 }}
            aria-label={`Tags, ${edgeIndicator}`}
            className={`h-56 ${frame}`}
          >
            <TagList />
          </ScrollArea.Root>
          <ScrollArea.Root
            edgeIndicator={edgeIndicator}
            scrollbars="x"
            startScrollPosition={{ x: 120 }}
            aria-label={`Gallery, ${edgeIndicator}`}
            className={frame}
          >
            <Tiles />
          </ScrollArea.Root>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * SCROLL TO ELEMENT (imperative API)
 * ============================================================ */

function ScrollToDemo() {
  const actions = React.useRef<ScrollAreaActions>(null);
  return (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => actions.current?.scrollToTop("smooth")}>
          Top
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            actions.current?.scrollIntoView("[data-tag='v1.2.0-beta.20']", {
              block: "center",
              behavior: "smooth",
            })
          }
        >
          Go to beta.20
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => actions.current?.scrollToBottom("smooth")}
        >
          Bottom
        </Button>
      </div>
      <ScrollArea.Root actionsRef={actions} aria-label="Tags" className={`h-64 ${frame}`}>
        <ul className="text-fg-default p-4 text-sm">
          {tags.map((tag) => (
            <li
              key={tag}
              data-tag={tag}
              className="border-border-default border-b py-2 last:border-b-0"
            >
              {tag}
            </li>
          ))}
        </ul>
      </ScrollArea.Root>
      <p className="text-fg-muted text-xs">
        Smooth scrolling falls back to instant when the user prefers reduced motion.
      </p>
    </div>
  );
}

export const ScrollToElement: Story = { render: () => <ScrollToDemo /> };

/* ============================================================
 * INFINITE SCROLL (onBottomReached)
 * ============================================================ */

function InfiniteDemo() {
  const [items, setItems] = React.useState(() => Array.from({ length: 20 }, (_, i) => i + 1));
  const [loading, setLoading] = React.useState(false);
  const loadMore = () => {
    if (loading || items.length >= 100) return;
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, ...Array.from({ length: 20 }, (_, i) => prev.length + i + 1)]);
      setLoading(false);
    }, 600);
  };
  return (
    <div className="sm:max-w-md">
      <ScrollArea.Root
        onBottomReached={loadMore}
        aria-label="Activity feed"
        className={`h-72 ${frame}`}
      >
        <ul className="text-fg-default p-4 text-sm" aria-busy={loading}>
          {items.map((n) => (
            <li key={n} className="border-border-default border-b py-2">
              Activity {n}
            </li>
          ))}
        </ul>
        <div className="flex justify-center pb-4">
          {loading ? (
            <Spinner size="sm" label="Loading more" />
          ) : items.length >= 100 ? (
            <p className="text-fg-muted text-xs">End of feed</p>
          ) : null}
        </div>
      </ScrollArea.Root>
    </div>
  );
}

export const InfiniteScroll: Story = { render: () => <InfiniteDemo /> };

/* ============================================================
 * STICK TO BOTTOM (chat / logs)
 * ============================================================ */

function StickDemo() {
  const [lines, setLines] = React.useState(() =>
    Array.from({ length: 12 }, (_, i) => `[build] step ${i + 1} complete`),
  );
  React.useEffect(() => {
    const id = setInterval(() => {
      setLines((prev) =>
        prev.length >= 60 ? prev : [...prev, `[build] step ${prev.length + 1} complete`],
      );
    }, 800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-col gap-2 sm:max-w-md">
      <ScrollArea.Root stickToBottom aria-label="Build log" className={`h-56 ${frame}`}>
        <ol className="text-fg-default p-3 font-mono text-xs">
          {lines.map((line, i) => (
            <li key={i} className="py-0.5">
              {line}
            </li>
          ))}
        </ol>
      </ScrollArea.Root>
      <p className="text-fg-muted text-xs">
        Follows new lines. Scroll up to pause; scroll back to the bottom to resume.
      </p>
    </div>
  );
}

export const StickToBottom: Story = { render: () => <StickDemo /> };

/* ============================================================
 * STICKY HEADER
 * ============================================================ */

export const StickyHeader: Story = {
  render: () => (
    <div className="sm:max-w-md">
      {/* Fades would also mask the sticky header — opt out */}
      <ScrollArea.Root
        edgeIndicator="none"
        aria-labelledby="releases-caption"
        className={`h-72 ${frame}`}
      >
        <table className="text-fg-default w-full text-left text-sm">
          <caption id="releases-caption" className="sr-only">
            Releases
          </caption>
          <thead className="bg-surface-raised sticky top-0 z-[1]">
            <tr>
              <th scope="col" className="border-border-default border-b px-4 py-2 font-medium">
                Version
              </th>
              <th scope="col" className="border-border-default border-b px-4 py-2 font-medium">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag, i) => (
              <tr key={tag}>
                <td className="border-border-default border-b px-4 py-2">{tag}</td>
                <td className="border-border-default text-fg-muted border-b px-4 py-2">
                  2026-10-{String(28 - (i % 28)).padStart(2, "0")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea.Root>
    </div>
  ),
};

/* ============================================================
 * VIRTUALIZED (TanStack Virtual)
 * ============================================================ */

function VirtualDemo() {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const count = 10_000;
  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => 36,
    overscan: 8,
  });
  return (
    <div className="flex flex-col gap-2 sm:max-w-md">
      <ScrollArea.Root
        viewportRef={viewportRef}
        aria-label="10,000 rows"
        className={`h-72 ${frame}`}
      >
        <ul
          className="text-fg-default relative text-sm"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((row) => (
            <li
              key={row.key}
              aria-setsize={count}
              aria-posinset={row.index + 1}
              className="border-border-default absolute inset-x-0 flex items-center border-b px-4"
              style={{ height: row.size, transform: `translateY(${row.start}px)` }}
            >
              Row {row.index + 1}
            </li>
          ))}
        </ul>
      </ScrollArea.Root>
      <p className="text-fg-muted text-xs">
        Pass <code>viewportRef</code> as the virtualizer&apos;s scroll element.
      </p>
    </div>
  );
}

export const Virtualized: Story = { render: () => <VirtualDemo /> };

/* ============================================================
 * COMPOSED — bring your own parts
 * Root-level props (aria-label, maxHeight, callbacks, actionsRef)
 * still reach a consumer-supplied Viewport.
 * ============================================================ */

export const Composed: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <ScrollArea.Root aria-label="Release notes" maxHeight={240} className={frame}>
        <ScrollArea.Viewport render={<section />}>
          <ScrollArea.Content>
            <TagList />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb className="bg-fg-muted" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  ),
};

/* ============================================================
 * RTL
 * ============================================================ */

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="flex flex-col gap-6 sm:max-w-md">
      <ScrollArea.Root aria-label="قائمة" className={`h-48 ${frame}`}>
        <TagList />
      </ScrollArea.Root>
      <ScrollArea.Root scrollbars="x" aria-label="معرض" className={frame}>
        <Tiles />
      </ScrollArea.Root>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="grid gap-6 sm:max-w-3xl sm:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <p className={caption}>{density}</p>
          <ScrollArea.Root
            type="always"
            scrollbars="y"
            aria-label={`Tags, ${density}`}
            className={`h-56 ${frame}`}
          >
            <TagList />
          </ScrollArea.Root>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * THEMES — every type, size and edge indicator per theme
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="bg-surface-base rounded-lg p-6">
          <p className="text-fg-muted mb-4 text-xs font-medium uppercase tracking-wide">{theme}</p>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {types.map((type) => (
              <div key={type}>
                <p className={caption}>{type}</p>
                <ScrollArea.Root
                  type={type}
                  scrollbars="y"
                  aria-label={`${theme} ${type}`}
                  className={`h-40 ${frame}`}
                >
                  <TagList />
                </ScrollArea.Root>
              </div>
            ))}
            {(["sm", "md", "lg"] as const).map((size) => (
              <div key={size}>
                <p className={caption}>size {size}</p>
                <ScrollArea.Root
                  size={size}
                  type="always"
                  scrollbars="y"
                  aria-label={`${theme} size ${size}`}
                  className={`h-40 ${frame}`}
                >
                  <TagList />
                </ScrollArea.Root>
              </div>
            ))}
            {(["none", "shadow"] as const).map((edgeIndicator) => (
              <div key={edgeIndicator}>
                <p className={caption}>{edgeIndicator}</p>
                <ScrollArea.Root
                  edgeIndicator={edgeIndicator}
                  startScrollPosition={{ y: 120 }}
                  aria-label={`${theme} ${edgeIndicator}`}
                  className={`h-40 ${frame}`}
                >
                  <TagList />
                </ScrollArea.Root>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
