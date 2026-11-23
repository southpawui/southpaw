import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BellIcon, ChatCircleIcon, EnvelopeSimpleIcon, StarIcon } from "@phosphor-icons/react";
import {
  Indicator,
  type IndicatorPosition,
  type IndicatorStatus,
  type IndicatorTone,
} from "./Indicator";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { Tabs } from "../Tabs/Tabs";
import { Tooltip } from "../Tooltip/Tooltip";
import { cn } from "../../lib/cn";

const meta: Meta<typeof Indicator> = {
  title: "Components/Indicator",
  component: Indicator,
  parameters: {
    docs: {
      description: {
        component:
          "A count, dot, status or short content on the corner of its child, or inline beside text when it has no child. Screen readers never hear the visible “99+”: overlays add `label` (with the raw count) to the child’s description, and inline counts join the name of the tab or link. Status presets have their own shape, so they don’t rely on colour.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Indicator>;

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide", className)}>
    {children}
  </p>
);

const TONES: IndicatorTone[] = ["accent", "neutral", "danger", "success", "warning", "info"];
const STATUSES: IndicatorStatus[] = ["success", "danger", "warning", "info", "neutral"];
const SIZES = ["sm", "md", "lg"] as const;

/** An icon-only button named by its Tooltip (`type="label"`, GEO-959), wrapped by an Indicator. */
function IconButton({
  name,
  icon,
  ...indicator
}: { name: string; icon: React.ReactNode } & React.ComponentProps<typeof Indicator>) {
  return (
    <Tooltip.Root type="label">
      <Indicator {...indicator}>
        <Tooltip.Trigger render={<Button variant="outline" size="icon" icon={icon} />} />
      </Indicator>
      <Tooltip.Content>{name}</Tooltip.Content>
    </Tooltip.Root>
  );
}

/** A plain box to place indicators on, for layout stories. */
const Box = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "bg-surface-sunken border-border-default block size-12 rounded-md border",
      className,
    )}
  />
);

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    // Room for the badge, which sits half outside the button
    <div className="p-4">
      <IconButton
        name="Notifications"
        icon={<BellIcon />}
        count={5}
        label={(n) => `${n} unread notifications`}
      />
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="grid gap-8 p-2 sm:max-w-2xl sm:grid-cols-4">
      {(
        [
          ["Count", { count: 5 }],
          ["0 (hidden)", { count: 0 }],
          ["0 with showZero", { count: 0, showZero: true }],
          ["Over max: 99+", { count: 120 }],
          ["Compact", { count: 1234, format: "compact" }],
          ["Dot", { dot: true }],
          ["Pulse", { dot: true, pulse: true }],
          ["Hidden (visible=false)", { count: 3, visible: false }],
          ["Disabled (muted, keeps count)", { count: 7, tone: "danger", disabled: true }],
          ["Bordered (default)", { count: 3 }],
          ["Not bordered", { count: 3, bordered: false }],
        ] as const
      ).map(([name, opts]) => (
        <div key={name}>
          <Label>{name}</Label>
          <IconButton
            name="Messages"
            icon={<EnvelopeSimpleIcon />}
            label={(n) => `${n} unread messages`}
            {...opts}
          />
        </div>
      ))}
      {STATUSES.map((status) => (
        <div key={status}>
          <Label>Status: {status}</Label>
          <Indicator status={status} overlap="circular" position="bottom-end">
            <Avatar.Root>
              <Avatar.Fallback>AK</Avatar.Fallback>
            </Avatar.Root>
          </Indicator>
        </div>
      ))}
      <p className="text-fg-muted text-sm sm:col-span-4">
        Valid and error don’t apply: an indicator shows a count or status, not a value someone
        enters. Use the danger and success tones for meaning.
      </p>
    </div>
  ),
};

/* ============================================================
 * POSITIONS, OFFSET, OVERLAP
 * ============================================================ */

const POSITIONS: IndicatorPosition[] = [
  "top-start",
  "top-center",
  "top-end",
  "middle-start",
  "middle-center",
  "middle-end",
  "bottom-start",
  "bottom-center",
  "bottom-end",
];

const PositionGrid = () => (
  <div className="grid grid-cols-3 gap-8">
    {POSITIONS.map((position) => (
      <div key={position}>
        <Label>{position}</Label>
        <Indicator position={position} count={3} label="3 items" aria-hidden>
          <Box />
        </Indicator>
      </div>
    ))}
  </div>
);

export const Positions: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-4 sm:max-w-md">
      <PositionGrid />
      <div dir="rtl" lang="ar">
        <Label>Right to left: start and end flip</Label>
        <div className="flex gap-8">
          <Indicator position="top-end" count={3} label="٣ عناصر">
            <Button variant="outline">الرسائل</Button>
          </Indicator>
          <Indicator position="top-start" dot label="نشاط جديد" offset={{ x: 4 }}>
            <Button variant="outline">التنبيهات</Button>
          </Indicator>
        </div>
      </div>
    </div>
  ),
};

export const Offset: Story = {
  render: () => (
    <div className="flex flex-wrap gap-10 p-4">
      {(
        [
          ["none", undefined],
          ["4", 4],
          ["{ x: -6, y: 6 }", { x: -6, y: 6 }],
        ] as const
      ).map(([name, offset]) => (
        <div key={name}>
          <Label>offset {name}</Label>
          <Indicator dot offset={offset} label="New activity">
            <Button variant="outline">Inbox</Button>
          </Indicator>
        </div>
      ))}
    </div>
  ),
};

export const Overlap: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-10 p-4">
      <div>
        <Label>Circle (circular)</Label>
        <Indicator dot overlap="circular" label="New activity">
          <Avatar.Root size="lg">
            <Avatar.Fallback>AK</Avatar.Fallback>
          </Avatar.Root>
        </Indicator>
      </div>
      <div>
        <Label>Circle (rectangular)</Label>
        <Indicator dot label="New activity">
          <Avatar.Root size="lg">
            <Avatar.Fallback>AK</Avatar.Fallback>
          </Avatar.Root>
        </Indicator>
      </div>
      <div>
        <Label>Square</Label>
        <Indicator count={2} label="2 new">
          <Avatar.Root size="lg" shape="square">
            <Avatar.Fallback>AK</Avatar.Fallback>
          </Avatar.Root>
        </Indicator>
      </div>
    </div>
  ),
};

/* ============================================================
 * INLINE
 * ============================================================ */

export const Inline: Story = {
  render: () => (
    <div className="text-fg-default flex flex-col gap-6 sm:max-w-md">
      <div>
        <Label>In tabs (screen readers hear “Open (12)”)</Label>
        <Tabs.Root defaultValue="open">
          <Tabs.List>
            <Tabs.Tab value="open">
              Open <Indicator count={12} tone="neutral" />
            </Tabs.Tab>
            <Tabs.Tab value="closed">
              Closed <Indicator count={1500} tone="neutral" max={999} />
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="open">12 open issues</Tabs.Panel>
          <Tabs.Panel value="closed">1,500 closed issues</Tabs.Panel>
        </Tabs.Root>
      </div>
      <div>
        <Label>Status with visible text</Label>
        <div className="flex flex-wrap gap-4">
          {STATUSES.map((status) => (
            <Indicator key={status} status={status} showLabel />
          ))}
        </div>
      </div>
    </div>
  ),
};

/* ============================================================
 * FORMATTING AND CONTENT
 * ============================================================ */

export const Formatting: Story = {
  render: () => (
    <table className="text-fg-default text-sm">
      <thead>
        <tr className="text-fg-muted text-start text-xs">
          <th className="pe-6 text-start font-semibold">Locale</th>
          <th className="pe-6 text-start font-semibold">1,234 (no cap)</th>
          <th className="pe-6 text-start font-semibold">120 (max 99)</th>
          <th className="text-start font-semibold">1,234 compact</th>
        </tr>
      </thead>
      <tbody>
        {["en", "de", "ar-EG", "hi-IN"].map((locale) => (
          <tr key={locale}>
            <td className="py-2 pe-6">{locale}</td>
            <td className="pe-6">
              <Indicator count={1234} max={false} locale={locale} />
            </td>
            <td className="pe-6">
              <Indicator count={120} locale={locale} />
            </td>
            <td>
              <Indicator count={1234} format="compact" locale={locale} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};

export const Content: Story = {
  render: () => (
    <div className="flex flex-wrap gap-10 p-4">
      <Indicator content="New" tone="info" label="New feature">
        <Button variant="outline">Reports</Button>
      </Indicator>
      <IconButton
        name="Favourites"
        icon={<StarIcon />}
        content={<StarIcon weight="fill" className="size-2.5" />}
        tone="warning"
        label="Pinned"
      />
    </div>
  ),
};

/* ============================================================
 * TRANSITIONS
 * ============================================================ */

export const Transitions: Story = {
  render: function Render() {
    const [count, setCount] = React.useState(3);
    const [visible, setVisible] = React.useState(true);
    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setCount((c) => c + 1)}>
            Add one
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCount((c) => Math.max(0, c - 1))}>
            Remove one
          </Button>
          <Button variant="outline" size="sm" onClick={() => setVisible((v) => !v)}>
            {visible ? "Hide" : "Show"}
          </Button>
        </div>
        <IconButton
          name="Chat"
          icon={<ChatCircleIcon />}
          count={count}
          visible={visible}
          label={(n) => `${n} unread chats`}
          announce
        />
      </div>
    );
  },
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <ul className="grid gap-8 sm:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <li key={density} data-density={density} className="flex flex-col gap-3">
          <Label>{density} (the indicator keeps its size)</Label>
          <div className="flex items-center gap-6">
            <IconButton name="Notifications" icon={<BellIcon />} count={8} label="8 unread" />
            <Indicator count={4} label="4 new">
              <Button variant="outline">Inbox</Button>
            </Indicator>
          </div>
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
          className="bg-surface-base text-fg-default flex flex-col gap-6 rounded-lg p-6"
        >
          <Label>{theme}</Label>
          <div>
            <Label>Tones: count, dot, pulse, disabled</Label>
            <div className="flex flex-wrap gap-6 pt-3">
              {TONES.map((tone) => (
                <div key={tone} className="flex items-center gap-4">
                  <Indicator count={5} tone={tone} label={`${tone} 5`}>
                    <Box className="size-10" />
                  </Indicator>
                  <Indicator dot tone={tone} label={`${tone} dot`}>
                    <Box className="size-10" />
                  </Indicator>
                  <Indicator dot pulse tone={tone} label={`${tone} pulse`}>
                    <Box className="size-10" />
                  </Indicator>
                </div>
              ))}
              <Indicator count={5} tone="danger" disabled label="disabled 5">
                <Box className="size-10" />
              </Indicator>
            </div>
          </div>
          <div>
            <Label>Status shapes</Label>
            <div className="flex flex-wrap items-center gap-6 pt-3">
              {STATUSES.map((status) => (
                <Indicator key={status} status={status} overlap="circular" position="bottom-end">
                  <Avatar.Root>
                    <Avatar.Fallback>AK</Avatar.Fallback>
                  </Avatar.Root>
                </Indicator>
              ))}
              {STATUSES.map((status) => (
                <Indicator key={`i-${status}`} status={status} showLabel />
              ))}
            </div>
          </div>
          <div>
            <Label>Sizes; bordered and not</Label>
            <div className="flex flex-wrap items-center gap-6 pt-3">
              {SIZES.map((size) => (
                <Indicator key={size} size={size} count={120} label={`${size} 120`}>
                  <Box className="size-10" />
                </Indicator>
              ))}
              {SIZES.map((size) => (
                <Indicator key={`d-${size}`} size={size} dot label={`${size} dot`}>
                  <Box className="size-10" />
                </Indicator>
              ))}
              {SIZES.map((size) => (
                <Indicator key={`s-${size}`} size={size} status="warning">
                  <Box className="size-10" />
                </Indicator>
              ))}
              <Indicator count={3} bordered={false} label="not bordered 3">
                <Box className="size-10" />
              </Indicator>
              <span className="text-sm">
                Inline <Indicator count={12} />
              </span>
            </div>
          </div>
        </section>
      ))}
    </div>
  ),
};
