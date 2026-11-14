import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Folder, FileText, Gear, Minus, Plus, SidebarSimple } from "@phosphor-icons/react";
import { Collapsible, type CollapsibleSize, type CollapsibleVariant } from "./Collapsible";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/Collapsible",
};

export default meta;
type Story = StoryObj;

const caption = "text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide";
const variants: CollapsibleVariant[] = ["default", "bordered", "ghost"];
const sizes: CollapsibleSize[] = ["sm", "md", "lg"];

function Example({
  title = "Order details",
  ...props
}: { title?: string } & React.ComponentProps<typeof Collapsible.Root>) {
  return (
    <Collapsible.Root {...props}>
      <Collapsible.Trigger>{title}</Collapsible.Trigger>
      <Collapsible.Panel>
        <p>Order #10423 · 3 items · Ships from London in 2 working days.</p>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Example />
    </div>
  ),
};

/* ============================================================
 * STATES — valid / error don't apply to a disclosure
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <div>
        <p className={caption}>Closed</p>
        <Example variant="bordered" />
      </div>
      <div>
        <p className={caption}>Open</p>
        <Example variant="bordered" defaultOpen />
      </div>
      <div>
        <p className={caption}>Disabled</p>
        <Example variant="bordered" disabled />
      </div>
      <div>
        <p className={caption}>Disabled · open</p>
        <Example variant="bordered" disabled defaultOpen />
      </div>
    </div>
  ),
};

/* ============================================================
 * VARIANTS & SIZES
 * ============================================================ */

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      {variants.map((variant) => (
        <div key={variant}>
          <p className={caption}>{variant}</p>
          <Example variant={variant} defaultOpen />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      {sizes.map((size) => (
        <div key={size}>
          <p className={caption}>{size}</p>
          <Example variant="bordered" size={size} defaultOpen />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * ICONS
 * ============================================================ */

export const Icons: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <div>
        <p className={caption}>Chevron at end (default)</p>
        <Example variant="bordered" />
      </div>
      <div>
        <p className={caption}>Chevron at start (tree-like)</p>
        <Collapsible.Root variant="bordered">
          <Collapsible.Trigger iconPosition="start">Advanced settings</Collapsible.Trigger>
          <Collapsible.Panel>Proxy, cache and logging options.</Collapsible.Panel>
        </Collapsible.Root>
      </div>
      <div>
        <p className={caption}>Swap by state (plus / minus)</p>
        <Collapsible.Root variant="bordered">
          <Collapsible.Trigger
            icon={(open) => (open ? <Minus className="size-4" /> : <Plus className="size-4" />)}
          >
            What is your returns policy?
          </Collapsible.Trigger>
          <Collapsible.Panel>Free returns within 30 days.</Collapsible.Panel>
        </Collapsible.Root>
      </div>
      <div>
        <p className={caption}>No icon</p>
        <Collapsible.Root variant="bordered">
          <Collapsible.Trigger icon={null}>Read the terms</Collapsible.Trigger>
          <Collapsible.Panel>Terms apply.</Collapsible.Panel>
        </Collapsible.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * HEADER — icon-only trigger + extra actions (AntD / Spectrum)
 * ============================================================ */

export const HeaderWithActions: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <div>
        <p className={caption}>Whole title is the trigger, action beside it</p>
        <Collapsible.Root variant="bordered">
          <Collapsible.Header>
            <Collapsible.Trigger headingLevel={3}>Notifications</Collapsible.Trigger>
            <Button size="icon" variant="ghost" aria-label="Notification settings">
              <Gear className="size-4" aria-hidden="true" />
            </Button>
          </Collapsible.Header>
          <Collapsible.Panel>Email, push and SMS preferences.</Collapsible.Panel>
        </Collapsible.Root>
      </div>
      <div>
        <p className={caption}>Icon-only trigger (only the chevron toggles)</p>
        <Collapsible.Root variant="bordered">
          <Collapsible.Header className="ps-3">
            <h3 className="text-fg-default m-0 flex flex-1 items-center text-sm font-medium">
              Billing address
            </h3>
            <Collapsible.Trigger
              closedLabel="Show billing address"
              openLabel="Hide billing address"
            />
          </Collapsible.Header>
          <Collapsible.Panel>221B Baker Street, London NW1 6XE</Collapsible.Panel>
        </Collapsible.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * HEADING LEVEL & REGION
 * ============================================================ */

export const HeadingAndRegion: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Collapsible.Root variant="bordered" defaultOpen>
        <Collapsible.Trigger headingLevel={2}>Delivery information</Collapsible.Trigger>
        <Collapsible.Panel role="region">
          <p>
            The trigger sits inside an <code>&lt;h2&gt;</code> so it appears in the heading outline;
            the panel is a region named by the trigger.
          </p>
        </Collapsible.Panel>
      </Collapsible.Root>
    </div>
  ),
};

/* ============================================================
 * SHOW MORE
 * ============================================================ */

const review =
  "We stayed for a week in October. The rooms were spotless and the staff remembered our names from the second day. Breakfast was the highlight: fresh bread, local cheeses and coffee that was actually good. The location is quiet but a short walk from the old town. Only downside was the street parking, which filled up early on weekends. We would absolutely come back, and have already recommended it to friends planning a trip next spring.";

export const ShowMore: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <div>
        <p className={caption}>Long content — preview with fade</p>
        <Collapsible.Root>
          <Collapsible.Panel collapsedHeight={72}>
            <p className="leading-6">{review}</p>
          </Collapsible.Panel>
          <Collapsible.ShowMore showLabel="Read full review" hideLabel="Show less" />
        </Collapsible.Root>
      </div>
      <div>
        <p className={caption}>Short content — no toggle, no fade</p>
        <Collapsible.Root>
          <Collapsible.Panel collapsedHeight={72}>
            <p className="leading-6">Great stay, would book again.</p>
          </Collapsible.Panel>
          <Collapsible.ShowMore />
        </Collapsible.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * HORIZONTAL
 * ============================================================ */

export const Horizontal: Story = {
  render: () => (
    <div className="border-border-default h-56 overflow-hidden rounded-[var(--radius-DEFAULT)] border sm:max-w-lg">
      <Collapsible.Root orientation="horizontal" defaultOpen className="h-full">
        <Collapsible.Panel>
          <nav aria-label="Sidebar" className="border-border-default h-full w-48 border-e p-3">
            <ul className="text-fg-default flex flex-col gap-1 text-sm">
              <li>Inbox</li>
              <li>Drafts</li>
              <li>Sent</li>
              <li>Archive</li>
            </ul>
          </nav>
        </Collapsible.Panel>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <Collapsible.Trigger
            icon={<SidebarSimple className="size-4" />}
            closedLabel="Show sidebar"
            openLabel="Hide sidebar"
          />
          <p className="text-fg-muted text-sm">Main content</p>
        </div>
      </Collapsible.Root>
    </div>
  ),
};

/* ============================================================
 * MOTION — opacity, custom duration
 * ============================================================ */

export const Motion: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <div>
        <p className={caption}>animateOpacity</p>
        <Example variant="bordered" animateOpacity />
      </div>
      <div>
        <p className={caption}>transitionDuration=600 · ease-in-out</p>
        <Example
          variant="bordered"
          transitionDuration={600}
          transitionEasing="var(--sp-easing-in-out)"
        />
      </div>
      <p className="text-fg-muted text-xs">All motion is removed under prefers-reduced-motion.</p>
    </div>
  ),
};

/* ============================================================
 * NESTED — file tree
 * ============================================================ */

function TreeFolder({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <li>
      <Collapsible.Root size="sm" defaultOpen>
        <Collapsible.Trigger iconPosition="start">
          <span className="inline-flex items-center gap-1.5">
            <Folder className="size-4" aria-hidden="true" />
            {name}
          </span>
        </Collapsible.Trigger>
        <Collapsible.Panel contentProps={{ className: "!py-0 ps-5" }}>
          <ul>{children}</ul>
        </Collapsible.Panel>
      </Collapsible.Root>
    </li>
  );
}

function TreeFile({ name }: { name: string }) {
  return (
    <li className="text-fg-default flex min-h-[var(--sp-control-height-sm)] items-center gap-1.5 ps-8 text-sm">
      <FileText className="size-4" aria-hidden="true" />
      {name}
    </li>
  );
}

export const Nested: Story = {
  render: () => (
    <ul className="sm:max-w-xs" aria-label="Project files">
      <TreeFolder name="src">
        <TreeFolder name="components">
          <TreeFile name="Button.tsx" />
          <TreeFile name="Collapsible.tsx" />
        </TreeFolder>
        <TreeFile name="index.ts" />
      </TreeFolder>
      <TreeFile name="package.json" />
    </ul>
  ),
};

/* ============================================================
 * FIND IN PAGE (hidden="until-found")
 * ============================================================ */

export const FindInPage: Story = {
  render: () => (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <Collapsible.Root variant="bordered">
        <Collapsible.Trigger>Warranty</Collapsible.Trigger>
        <Collapsible.Panel>
          The warranty covers manufacturing defects for <strong>pineapple</strong> years.
        </Collapsible.Panel>
      </Collapsible.Root>
      <p className="text-fg-muted text-xs">
        Press ⌘F / Ctrl+F and search for “pineapple” — the panel opens to reveal the match
        (Chromium; other browsers keep it closed).
      </p>
    </div>
  ),
};

/* ============================================================
 * CONTROLLED
 * ============================================================ */

function ControlledDemo() {
  const [open, setOpen] = React.useState(false);
  const [log, setLog] = React.useState("—");
  return (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Open"} from outside
        </Button>
      </div>
      <Example
        variant="bordered"
        open={open}
        onOpenChange={setOpen}
        onOpenChangeComplete={(o) => setLog(o ? "opened" : "closed")}
      />
      <p className="text-fg-muted text-xs" aria-live="polite">
        Animation complete: {log}
      </p>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledDemo /> };

/* ============================================================
 * RTL
 * ============================================================ */

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="flex flex-col gap-4 sm:max-w-md">
      <Collapsible.Root variant="bordered" defaultOpen>
        <Collapsible.Trigger>تفاصيل الطلب</Collapsible.Trigger>
        <Collapsible.Panel>يشحن خلال يومي عمل.</Collapsible.Panel>
      </Collapsible.Root>
      <Collapsible.Root variant="bordered">
        <Collapsible.Trigger iconPosition="start">إعدادات متقدمة</Collapsible.Trigger>
        <Collapsible.Panel>خيارات إضافية.</Collapsible.Panel>
      </Collapsible.Root>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density} className="sm:max-w-md">
          <p className={caption}>{density}</p>
          <div className="flex flex-col gap-2">
            <Example variant="bordered" defaultOpen />
            <Example variant="bordered" title="Payment" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * THEMES — every variant, size and state per theme
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="bg-surface-base rounded-lg p-6">
          <p className="text-fg-muted mb-4 text-xs font-medium uppercase tracking-wide">{theme}</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {variants.map((variant) => (
              <div key={variant} className="flex flex-col gap-2">
                <p className={caption}>{variant}</p>
                <Example variant={variant} title="Open" defaultOpen />
                <Example variant={variant} title="Closed" />
                <Example variant={variant} title="Disabled" disabled />
                {sizes.map((size) => (
                  <Example key={size} variant={variant} size={size} title={`Size ${size}`} />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-6 sm:max-w-md">
            <p className={caption}>show more</p>
            <Collapsible.Root>
              <Collapsible.Panel collapsedHeight={48}>
                <p className="leading-6">{review}</p>
              </Collapsible.Panel>
              <Collapsible.ShowMore />
            </Collapsible.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
