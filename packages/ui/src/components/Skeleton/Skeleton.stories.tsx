import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, type SkeletonAnimation } from "./Skeleton";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { cn } from "../../lib/cn";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          "Placeholder shapes that keep the layout while content loads. Shapes are silent to screen readers; wrap a loading area in `Skeleton.Group` so it carries `aria-busy` and announces once. Wrap real content in `<Skeleton loading>` to size the placeholder to it. Under reduced motion every animation becomes a slow, gentle pulse.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide", className)}>
    {children}
  </p>
);

const ANIMATIONS: SkeletonAnimation[] = ["pulse", "wave", "none"];
const SHAPES = ["text", "circle", "rectangle", "rounded"] as const;

/** A list row: avatar, two lines of text. Reused across stories. */
const Row = ({ animation }: { animation?: SkeletonAnimation }) => (
  <div className="flex items-center gap-3">
    <Skeleton.Avatar animation={animation} />
    <div className="flex-1">
      <Skeleton.Text lines={2} animation={animation} />
    </div>
  </div>
);

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Skeleton.Group label="Loading profile" className="sm:max-w-md">
      <Row />
      <Skeleton.Text lines={3} />
      <Skeleton.Button />
    </Skeleton.Group>
  ),
};

/* ============================================================
 * SHAPES, ANIMATION, TEXT
 * ============================================================ */

export const Shapes: Story = {
  render: () => (
    <ul className="grid gap-6 sm:max-w-md sm:grid-cols-2">
      {SHAPES.map((shape) => (
        <li key={shape}>
          <Label>{shape}</Label>
          <Skeleton shape={shape} />
        </li>
      ))}
    </ul>
  ),
};

export const Animation: Story = {
  render: () => (
    <ul className="flex flex-col gap-6 sm:max-w-md">
      {ANIMATIONS.map((animation) => (
        <li key={animation}>
          <Label>{animation}</Label>
          <Row animation={animation} />
        </li>
      ))}
    </ul>
  ),
};

export const Text: Story = {
  render: () => (
    <div className="text-fg-default flex flex-col gap-6 sm:max-w-md">
      {[1, 3, 5].map((lines) => (
        <div key={lines}>
          <Label>{lines === 1 ? "1 line" : `${lines} lines`}</Label>
          <Skeleton.Text lines={lines} />
        </div>
      ))}
      <div>
        <Label>Heading (text-2xl), then body</Label>
        <Skeleton.Text lines={1} widths={["50%"]} className="text-2xl" />
        <Skeleton.Text lines={2} />
      </div>
      <div>
        <Label>Custom widths</Label>
        <Skeleton.Text lines={3} widths={["90%", "75%", 120]} />
      </div>
    </div>
  ),
};

/* ============================================================
 * PRESETS
 * ============================================================ */

const SIZES = ["sm", "md", "lg"] as const;

const Presets = ({
  animation,
  className,
}: {
  animation?: SkeletonAnimation;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-4", className)}>
    <div className="flex flex-wrap items-center gap-3">
      {SIZES.map((size) => (
        <Skeleton.Avatar key={`c-${size}`} size={size} animation={animation} />
      ))}
      {SIZES.map((size) => (
        <Skeleton.Avatar key={`s-${size}`} size={size} shape="square" animation={animation} />
      ))}
    </div>
    <div className="flex flex-wrap items-center gap-3">
      {SIZES.map((size) => (
        <Skeleton.Button key={size} size={size} animation={animation} />
      ))}
    </div>
    {SIZES.map((size) => (
      <Skeleton.Input key={size} size={size} animation={animation} />
    ))}
    <div className="grid grid-cols-2 gap-3">
      <Skeleton.Image animation={animation} icon />
      <Skeleton.Image aspectRatio="1 / 1" animation={animation} />
    </div>
  </div>
);

export const PresetShapes: Story = {
  name: "Presets",
  render: () => <Presets className="sm:max-w-md" />,
};

/* ============================================================
 * WRAPPER AND GROUP
 * ============================================================ */

const Toggle = ({ loading, onToggle }: { loading: boolean; onToggle: () => void }) => (
  <Button variant="outline" size="sm" onClick={onToggle} className="self-start">
    {loading ? "Finish loading" : "Load again"}
  </Button>
);

export const WrappingContent: Story = {
  render: function Render() {
    const [loading, setLoading] = React.useState(true);
    return (
      <div className="text-fg-default flex flex-col gap-4 sm:max-w-md">
        <Toggle loading={loading} onToggle={() => setLoading((l) => !l)} />
        <Skeleton.Group label="Loading member" loadedLabel="Member loaded" loading={loading}>
          <div className="flex items-center gap-3">
            <Skeleton shape="circle">
              <Avatar.Root>
                <Avatar.Fallback>AK</Avatar.Fallback>
              </Avatar.Root>
            </Skeleton>
            <Skeleton shape="text">
              <span className="text-lg font-semibold">Amira Khan</span>
            </Skeleton>
          </div>
          <Skeleton shape="text">
            <span>
              Member since 2019. Borrowed 42 books this year, mostly crime fiction and travel
              writing.
            </span>
          </Skeleton>
          <Skeleton>
            <Button>Renew membership</Button>
          </Skeleton>
        </Skeleton.Group>
      </div>
    );
  },
};

export const Group: Story = {
  render: function Render() {
    const [loading, setLoading] = React.useState(true);
    return (
      <div className="flex flex-col gap-4 sm:max-w-md">
        <Toggle loading={loading} onToggle={() => setLoading((l) => !l)} />
        <p className="text-fg-muted text-sm">
          The group has <code>aria-busy</code> while loading and announces “Loading orders” once,
          then “Orders loaded”. The rows themselves say nothing.
        </p>
        <Skeleton.Group
          label="Loading orders"
          loadedLabel="Orders loaded"
          loading={loading}
          animation="wave"
        >
          {loading ? (
            [0, 1, 2].map((i) => <Row key={i} />)
          ) : (
            <ul className="text-fg-default flex flex-col gap-2 text-sm">
              <li>Order 1042: 3 books, ready to collect</li>
              <li>Order 1041: 1 book, on its way</li>
              <li>Order 1039: 2 books, returned</li>
            </ul>
          )}
        </Skeleton.Group>
      </div>
    );
  },
};

export const Delay: Story = {
  render: function Render() {
    const [run, setRun] = React.useState(0);
    const [elapsed, setElapsed] = React.useState(0);
    React.useEffect(() => {
      const start = performance.now();
      const id = setInterval(() => setElapsed(Math.round(performance.now() - start)), 100);
      const stop = setTimeout(() => clearInterval(id), 1500);
      return () => {
        clearInterval(id);
        clearTimeout(stop);
      };
    }, [run]);
    return (
      <div className="text-fg-default flex flex-col gap-4 sm:max-w-md">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setRun((r) => r + 1)}>
            Replay
          </Button>
          <span className="text-fg-muted text-sm tabular-nums">{Math.min(elapsed, 1500)}ms</span>
        </div>
        <div key={run} className="flex flex-col gap-4">
          {(
            [
              ["none", false],
              ['"short" (300ms)', "short"],
              ["600", 600],
              ["true (1000ms)", true],
            ] as const
          ).map(([name, delay]) => (
            <div key={name}>
              <Label>{name}</Label>
              {/* The dashed box shows the space kept while the skeleton waits */}
              <div className="border-border-default rounded-md border border-dashed p-2">
                <Skeleton.Text lines={2} delay={delay} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/* ============================================================
 * COMPOSITION
 * ============================================================ */

export const CardLoading: Story = {
  render: function Render() {
    const [loading, setLoading] = React.useState(true);
    return (
      <div className="flex flex-col gap-4 sm:max-w-sm">
        <Toggle loading={loading} onToggle={() => setLoading((l) => !l)} />
        <Skeleton.Group label="Loading event" loadedLabel="Event loaded" loading={loading}>
          <Card.Root>
            <Skeleton.Image />
            <Card.Header>
              {/* Wrap the whole heading: hidden until loaded, never an empty heading */}
              <Skeleton shape="text">
                <Card.Title>Author talk: Writing the city</Card.Title>
              </Skeleton>
              <Skeleton shape="text">
                <Card.Description>Thursday 4 December, 6:30pm, Central Library</Card.Description>
              </Skeleton>
            </Card.Header>
            <Card.Footer>
              <Skeleton>
                <Button>Book a place</Button>
              </Skeleton>
            </Card.Footer>
          </Card.Root>
        </Skeleton.Group>
      </div>
    );
  },
};

/* ============================================================
 * STATES
 * ============================================================ */

// Reduced motion, as a static preview: Storybook can't force the media query
const reducedPreview =
  "bg-none [animation:sp-skeleton-pulse-reduced_3s_ease-in-out_infinite] rtl:[animation:sp-skeleton-pulse-reduced_3s_ease-in-out_infinite]";

export const States: Story = {
  render: () => (
    <div className="text-fg-default grid gap-8 sm:max-w-2xl sm:grid-cols-2">
      <div>
        <Label>Loading</Label>
        <Row />
      </div>
      <div>
        <Label>Loaded</Label>
        <Skeleton.Group loading={false}>
          <div className="flex items-center gap-3">
            <Skeleton shape="circle">
              <Avatar.Root>
                <Avatar.Fallback>AK</Avatar.Fallback>
              </Avatar.Root>
            </Skeleton>
            <Skeleton shape="text">
              <span>Amira Khan</span>
            </Skeleton>
          </div>
        </Skeleton.Group>
      </div>
      <div>
        <Label>Delayed (hidden, space kept)</Label>
        <div className="border-border-default rounded-md border border-dashed p-2">
          <Skeleton.Text lines={2} delay={600000} />
        </div>
      </div>
      {ANIMATIONS.map((animation) => (
        <div key={animation}>
          <Label>Animation: {animation}</Label>
          <Row animation={animation} />
        </div>
      ))}
      <div>
        <Label>Reduced motion (preview)</Label>
        <div className="flex items-center gap-3">
          <Skeleton.Avatar animation="wave" className={reducedPreview} />
          <div className="flex-1">
            <Skeleton animation="wave" shape="text" className={reducedPreview} />
            <Skeleton animation="wave" shape="text" width="60%" className={reducedPreview} />
          </div>
        </div>
      </div>
      <p className="text-fg-muted text-sm sm:col-span-2">
        Valid, error and disabled don’t apply: a skeleton isn’t interactive and has no value.
      </p>
    </div>
  ),
};

/* ============================================================
 * RTL
 * ============================================================ */

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" lang="ar" className="flex flex-col gap-6 sm:max-w-md">
      <div>
        <Label>Wave runs right to left</Label>
        <Row animation="wave" />
      </div>
      <div>
        <Label>Last line ends on the left</Label>
        <Skeleton.Text lines={3} />
      </div>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <ul className="grid gap-8 sm:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <li key={density} data-density={density} className="flex flex-col gap-3">
          <Label>{density}</Label>
          <Skeleton.Group label={`Loading ${density}`}>
            <Row />
            <Skeleton.Input />
            <Skeleton.Button />
          </Skeleton.Group>
        </li>
      ))}
    </ul>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

const SURFACES = ["base", "sunken", "raised", "alternate"] as const;
const surfaceClass: Record<(typeof SURFACES)[number], string> = {
  base: "bg-surface-base",
  sunken: "bg-surface-sunken",
  raised: "bg-surface-raised shadow-sm",
  alternate: "bg-surface-alternate",
};

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          aria-label={theme}
          className="bg-surface-base text-fg-default flex flex-col gap-6 rounded-lg p-6"
        >
          <Label>{theme}</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            {SURFACES.map((surface) => (
              <div key={surface} className={cn("rounded-md p-4", surfaceClass[surface])}>
                <Label>{surface}</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    {SHAPES.map((shape) => (
                      <Skeleton
                        key={shape}
                        shape={shape}
                        width={shape === "circle" ? 32 : 48}
                        height={shape === "text" ? undefined : 32}
                      />
                    ))}
                  </div>
                  {ANIMATIONS.map((animation) => (
                    <Row key={animation} animation={animation} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <Label>Presets</Label>
            <Presets className="sm:max-w-md" />
          </div>
        </section>
      ))}
    </div>
  ),
};
