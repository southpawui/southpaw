import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LoadingOverlay, type LoadingOverlayProps } from "./LoadingOverlay";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Skeleton } from "../Skeleton/Skeleton";
import { Toggle } from "../Toggle/Toggle";
import { ToggleGroup } from "../ToggleGroup/ToggleGroup";
import { cn } from "../../lib/cn";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Components/LoadingOverlay",
  component: LoadingOverlay,
  parameters: {
    docs: {
      description: {
        component:
          "Covers a busy region while it reloads, filters or saves. The content is `aria-busy`, and `inert` once the overlay shows, so nothing behind it can be clicked or tabbed to. Focus inside moves to Cancel or the panel and comes back afterwards. Start and finish are announced once. For a first load with nothing to show yet, use Skeleton; for a whole-page block, `fullscreen`.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide", className)}>
    {children}
  </p>
);

const ORDERS = [
  ["1042", "Amira Khan", "3 books", "Ready to collect"],
  ["1041", "Tom Reid", "1 book", "On its way"],
  ["1039", "Priya Shah", "2 books", "Returned"],
];

const OrdersTable = ({ rows = ORDERS }: { rows?: string[][] }) => (
  <table className="text-fg-default w-full text-start text-sm">
    <thead className="text-fg-muted text-xs">
      <tr>
        {["Order", "Member", "Items", "Status"].map((h) => (
          <th key={h} className="border-border-default border-b py-2 pe-3 text-start font-semibold">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row[0]}>
          {row.map((cell, i) => (
            <td key={i} className="border-border-default border-b py-2 pe-3">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

/** A card whose table reloads for `ms` when its button is pressed (the button is inside the region). */
function ReloadingCard({ ms = 2000, ...overlay }: { ms?: number } & Partial<LoadingOverlayProps>) {
  const [loading, setLoading] = React.useState(false);
  const reload = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), ms);
  };
  return (
    <LoadingOverlay loading={loading} label="Loading orders" doneLabel="Orders loaded" {...overlay}>
      <Card.Root>
        <Card.Header>
          <Card.Title>Orders</Card.Title>
          <Card.Description>The three most recent orders</Card.Description>
        </Card.Header>
        <Card.Content>
          <OrdersTable />
        </Card.Content>
        <Card.Footer>
          <Button variant="outline" onClick={reload}>
            Reload
          </Button>
        </Card.Footer>
      </Card.Root>
    </LoadingOverlay>
  );
}

/** A loading region that shows at once, for static states. */
const Shown = (props: Partial<LoadingOverlayProps>) => (
  <LoadingOverlay loading delay={false} label="Loading orders" {...props}>
    <Card.Root>
      <Card.Content className="pt-6">
        <OrdersTable />
      </Card.Content>
    </Card.Root>
  </LoadingOverlay>
);

const cancel = (
  <Button variant="outline" size="sm">
    Cancel
  </Button>
);

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="sm:max-w-lg">
      <ReloadingCard />
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

const STATES: [string, Partial<LoadingOverlayProps>][] = [
  ["Loading (label only)", {}],
  ["With description", { description: "This can take a minute" }],
  ["With Cancel", { description: "Saving 3 changes", action: cancel, label: "Saving" }],
  ["Determinate (40%)", { value: 40, label: "Importing orders" }],
  ["Indeterminate bar", { value: null, label: "Importing orders" }],
  ["Blurred backdrop", { blur: true }],
];

export const States: Story = {
  render: () => (
    <div className="grid gap-8 sm:max-w-4xl sm:grid-cols-2">
      <div>
        <Label>Idle</Label>
        <LoadingOverlay label="Loading orders">
          <Card.Root>
            <Card.Content className="pt-6">
              <OrdersTable />
            </Card.Content>
          </Card.Root>
        </LoadingOverlay>
      </div>
      {STATES.map(([name, props]) => (
        <div key={name}>
          <Label>{name}</Label>
          <Shown {...props} />
        </div>
      ))}
      <p className="text-fg-muted text-sm sm:col-span-2">
        Finished: the overlay fades out and focus returns (see Default). Valid, error and disabled
        don’t apply to an overlay; a failed load is shown by the content, such as an Alert.
      </p>
    </div>
  ),
};

/* ============================================================
 * BEHAVIOUR
 * ============================================================ */

export const DelayAndMinDuration: Story = {
  name: "Delay and minimum duration",
  render: () => (
    <div className="grid gap-8 sm:max-w-4xl sm:grid-cols-2">
      <div>
        <Label>Fast (150ms): finishes inside the 300ms delay, so nothing shows</Label>
        <ReloadingCard ms={150} />
      </div>
      <div>
        <Label>Just past the delay (400ms): stays the 500ms minimum, no flicker</Label>
        <ReloadingCard ms={400} />
      </div>
    </div>
  ),
};

export const TallRegionWithStickyHeader: Story = {
  name: "Tall region with sticky header",
  render: () => {
    const rows = Array.from({ length: 40 }, (_, i) => [
      String(1100 - i),
      ["Amira Khan", "Tom Reid", "Priya Shah"][i % 3]!,
      `${(i % 4) + 1} books`,
      ["Ready to collect", "On its way", "Returned"][i % 3]!,
    ]);
    return (
      <div className="sm:max-w-lg">
        <p className="text-fg-muted mb-2 text-sm">
          Scroll the page: the panel stays in view, and the table’s sticky header stays under the
          backdrop.
        </p>
        <LoadingOverlay loading delay={false} label="Loading orders">
          <table className="text-fg-default w-full text-sm">
            <thead className="bg-surface-base sticky top-0 z-10 text-xs">
              <tr>
                {["Order", "Member", "Items", "Status"].map((h) => (
                  <th key={h} className="border-border-default border-b py-2 pe-3 text-start">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td key={i} className="border-border-default border-b py-2 pe-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </LoadingOverlay>
      </div>
    );
  },
};

export const Fullscreen: Story = {
  render: function Render() {
    const [loading, setLoading] = React.useState(false);
    return (
      <LoadingOverlay
        fullscreen
        loading={loading}
        label="Submitting your application"
        description="Don’t close this page"
        doneLabel="Application submitted"
      >
        <div className="flex flex-col items-start gap-3 sm:max-w-md">
          <p className="text-fg-default text-sm">
            Blocks the whole page through a modal dialog: everything else is inert, Escape does
            nothing, and focus returns to the button afterwards.
          </p>
          <Button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 2500);
            }}
          >
            Submit application
          </Button>
        </div>
      </LoadingOverlay>
    );
  },
};

export const WithUseTransition: Story = {
  name: "With useTransition",
  render: function Render() {
    const [isPending, startTransition] = React.useTransition();
    const [rows, setRows] = React.useState(ORDERS);
    // The filter shown as pressed. Never empty: pressing the active one keeps it on.
    const [active, setActive] = React.useState<string[]>(["all"]);
    const filter = (next: string[]) => {
      if (next.length === 0) return;
      setActive(next);
      const status = next[0] === "returned" ? "Returned" : null;
      startTransition(async () => {
        await new Promise((r) => setTimeout(r, 1200));
        startTransition(() => setRows(status ? ORDERS.filter((r) => r[3] === status) : ORDERS));
      });
    };
    return (
      <div className="flex flex-col gap-3 sm:max-w-lg">
        <ToggleGroup.Root aria-label="Filter orders" value={active} onValueChange={filter}>
          <Toggle value="all" label="All" size="sm" />
          <Toggle value="returned" label="Returned" size="sm" />
        </ToggleGroup.Root>
        {/* The old rows stay on screen while the new ones load: an overlay, not a Skeleton */}
        <LoadingOverlay loading={isPending} label="Filtering orders">
          <OrdersTable rows={rows} />
        </LoadingOverlay>
      </div>
    );
  },
};

export const SkeletonOrOverlay: Story = {
  name: "Skeleton or overlay?",
  render: () => (
    <div className="grid gap-8 sm:max-w-4xl sm:grid-cols-2">
      <div>
        <Label>First load, nothing to show yet: Skeleton</Label>
        <Skeleton.Group label="Loading orders">
          <Skeleton.Text lines={1} widths={["40%"]} />
          <Skeleton.Text lines={4} />
        </Skeleton.Group>
      </div>
      <div>
        <Label>Reloading content already on screen: LoadingOverlay</Label>
        <Shown />
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
        <li key={density} data-density={density}>
          <Label>{density}</Label>
          <Shown description="This can take a minute" action={cancel} />
        </li>
      ))}
    </ul>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          aria-label={theme}
          className="bg-surface-base text-fg-default flex flex-col gap-4 rounded-lg p-6"
        >
          <Label>{theme}</Label>
          <div className="grid gap-6 sm:grid-cols-3">
            {STATES.map(([name, props]) => (
              <div key={name}>
                <Label>{name}</Label>
                <Shown {...props} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
