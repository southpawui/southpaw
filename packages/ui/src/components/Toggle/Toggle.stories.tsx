import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  HeartIcon,
  BellIcon,
  BellRingingIcon,
  PushPinIcon,
  StarIcon,
} from "@phosphor-icons/react";
import { Toggle } from "./Toggle";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Field } from "../Field/Field";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
  argTypes: {
    variant: { control: "select", options: ["solid", "outline", "ghost"] },
    color: { control: "select", options: ["default", "brand", "danger", "inverse"] },
    size: { control: "select", options: ["sm", "md", "lg", "icon"] },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

const VARIANTS = ["outline", "ghost", "solid"] as const;
const COLORS = ["default", "brand", "danger"] as const;
const WRAP = "flex w-full flex-col gap-6 sm:max-w-lg";

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">{children}</p>;
}

/** One row: unpressed + pressed of a given look. */
function Pair(props: React.ComponentProps<typeof Toggle>) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle {...props} />
      <Toggle {...props} defaultPressed />
    </div>
  );
}

/* ============================================================
 * Default
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className={WRAP}>
      <Toggle icon={<PushPinIcon />}>Pin</Toggle>
    </div>
  ),
};

/* ============================================================
 * Variants × pressed — each variant has an off/on pair (Chakra). Pressed isn't colour
 * alone: outline gets a thicker border, ghost gains a border, solid goes muted → full fill.
 * ============================================================ */

export const Variants: Story = {
  render: () => (
    <div className={WRAP}>
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <Heading>{variant} — unpressed / pressed</Heading>
          <Pair variant={variant} icon={<PushPinIcon />} label="Pin" />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * Indicator — a checkmark while pressed (space is reserved, so nothing shifts)
 * ============================================================ */

export const Indicator: Story = {
  render: () => (
    <div className={WRAP}>
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <Heading>{variant} with indicator</Heading>
          <Pair variant={variant} indicator label="Notifications" />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * Sizes (+ icon-only squares)
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className={WRAP}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <Heading>size=&quot;{size}&quot;</Heading>
          <div className="flex flex-wrap items-center gap-3">
            <Toggle size={size} icon={<StarIcon />} label="Favourite" />
            <Toggle size={size} icon={<StarIcon />} label="Favourite" defaultPressed />
          </div>
        </div>
      ))}
      <Heading>size=&quot;icon&quot; follows a ButtonGroup&apos;s size</Heading>
      <div className="flex flex-wrap items-center gap-3">
        {(["sm", "md", "lg"] as const).map((size) => (
          <ButtonGroup.Root key={size} size={size} aria-label={`Icon ${size}`}>
            <Toggle size="icon" icon={<TextBIcon />} srOnly={`Bold (${size})`} />
          </ButtonGroup.Root>
        ))}
      </div>
    </div>
  ),
};

/* ============================================================
 * Icon-only + pressedIcon — the icon changes, the name doesn't
 * ============================================================ */

export const IconOnly: Story = {
  render: () => (
    <div className={WRAP}>
      <Heading>pressedIcon swaps the icon; the accessible name stays the same</Heading>
      <div className="flex flex-wrap items-center gap-3">
        <Toggle
          size="icon"
          variant="ghost"
          icon={<HeartIcon />}
          pressedIcon={<HeartIcon weight="fill" />}
          srOnly="Favourite"
        />
        <Toggle
          size="icon"
          variant="ghost"
          icon={<HeartIcon />}
          pressedIcon={<HeartIcon weight="fill" />}
          srOnly="Favourite"
          defaultPressed
          color="danger"
        />
        <Toggle
          size="icon"
          icon={<BellIcon />}
          pressedIcon={<BellRingingIcon weight="fill" />}
          srOnly="Notifications"
          defaultPressed
        />
      </div>
      <p className="text-fg-muted text-sm">
        Don&apos;t swap the <em>label</em> (Mute → Unmute): if the meaning changes, use a Button
        (Spectrum guidance).
      </p>
    </div>
  ),
};

/* ============================================================
 * Loading, read-only, inactive
 * ============================================================ */

export const LoadingReadOnlyInactive: Story = {
  render: () => (
    <div className={WRAP}>
      <Heading>loading — spinner, toggling blocked</Heading>
      <Pair loading icon={<PushPinIcon />} label="Pin" />
      <Heading>readOnly — focusable, can&apos;t change</Heading>
      <Pair readOnly icon={<PushPinIcon />} label="Pin" />
      <Heading>inactive — looks disabled, stays focusable (pair with a Tooltip)</Heading>
      <Pair inactive icon={<PushPinIcon />} label="Pin" />
      <Heading>disabled — skipped by Tab</Heading>
      <Pair disabled icon={<PushPinIcon />} label="Pin" />
    </div>
  ),
};

/* ============================================================
 * Form — name/value submit like a checkbox
 * ============================================================ */

function FormDemo() {
  const [submitted, setSubmitted] = React.useState<string>("—");
  return (
    <form
      className={WRAP}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setSubmitted(JSON.stringify(Object.fromEntries(data.entries())));
      }}
    >
      <ButtonGroup.Root attached aria-label="Text style">
        <Toggle name="bold" icon={<TextBIcon />} srOnly="Bold" size="icon" defaultPressed />
        <Toggle name="italic" icon={<TextItalicIcon />} srOnly="Italic" size="icon" />
        <Toggle
          name="underline"
          value="yes"
          icon={<TextUnderlineIcon />}
          srOnly="Underline"
          size="icon"
        />
      </ButtonGroup.Root>
      <div className="flex items-center gap-3">
        <Button type="submit" label="Submit" />
        <output className="text-fg-muted font-mono text-sm" aria-live="polite">
          {submitted}
        </output>
      </div>
    </form>
  );
}

export const Form: Story = {
  render: () => <FormDemo />,
};

/* ============================================================
 * In a ButtonGroup — inherits size/variant/color/disabled
 * ============================================================ */

export const InButtonGroup: Story = {
  render: () => (
    <div className={WRAP}>
      <Heading>Attached, outline (group variant)</Heading>
      <ButtonGroup.Root attached variant="outline" aria-label="Formatting">
        <Toggle icon={<TextBIcon />} srOnly="Bold" size="icon" defaultPressed />
        <Toggle icon={<TextItalicIcon />} srOnly="Italic" size="icon" />
        <Toggle icon={<TextUnderlineIcon />} srOnly="Underline" size="icon" />
      </ButtonGroup.Root>
      <Heading>Spaced, ghost, size lg</Heading>
      <ButtonGroup.Root variant="ghost" size="lg" stackBelow={false} aria-label="Filters">
        <Toggle defaultPressed label="Open" />
        <Toggle label="Closed" />
        <Toggle label="Draft" />
      </ButtonGroup.Root>
      <Heading>Vertical, attached — toggles stretch to the group</Heading>
      <ButtonGroup.Root attached orientation="vertical" aria-label="View">
        <Toggle defaultPressed indicator label="Show grid" />
        <Toggle indicator label="Show rulers" />
        <Toggle indicator label="Snap" />
      </ButtonGroup.Root>
      <Heading>Disabled group</Heading>
      <ButtonGroup.Root attached disabled aria-label="Disabled formatting">
        <Toggle icon={<TextBIcon />} srOnly="Bold (disabled)" size="icon" defaultPressed />
        <Toggle icon={<TextItalicIcon />} srOnly="Italic (disabled)" size="icon" />
      </ButtonGroup.Root>
    </div>
  ),
};

/* ============================================================
 * With a Badge — compose, no badge prop (Carbon has badgeCount; George: compose instead)
 * ============================================================ */

export const WithBadge: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle icon={<BellIcon />}>
        Unread
        <Badge size="sm" variant="info">
          12
        </Badge>
      </Toggle>
      <Toggle icon={<BellIcon />} defaultPressed>
        Unread
        <Badge size="sm" variant="info">
          12
        </Badge>
      </Toggle>
    </div>
  ),
};

/* ============================================================
 * States — default, pressed, invalid, read-only, inactive, loading, disabled.
 * (No "valid": a toggle is an action, not a validated value.)
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className={WRAP}>
      {(
        [
          ["Default", {}],
          ["Pressed", { defaultPressed: true }],
          ["Invalid", { "aria-invalid": true }],
          ["Read-only", { readOnly: true, defaultPressed: true }],
          ["Inactive", { inactive: true }],
          ["Loading", { loading: true }],
          ["Disabled", { disabled: true }],
          ["Disabled + pressed", { disabled: true, defaultPressed: true }],
        ] as const
      ).map(([name, extra]) => (
        <div key={name} className="flex flex-col gap-2">
          <Heading>{name}</Heading>
          <Toggle icon={<PushPinIcon />} label={`Pin (${name.toLowerCase()})`} {...extra} />
        </div>
      ))}
      <Field.Root invalid>
        <Field.Label>In an invalid Field</Field.Label>
        <Toggle aria-invalid icon={<PushPinIcon />} label="Pin (in field)" />
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * Density
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <div className={WRAP}>
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density} className="flex flex-col gap-2">
          <Heading>{density}</Heading>
          <div className="flex flex-wrap items-center gap-3">
            <Toggle icon={<PushPinIcon />} label="Pin" />
            <Toggle icon={<PushPinIcon />} label="Pin" defaultPressed />
            <Toggle size="icon" icon={<TextBIcon />} srOnly={`Bold (${density})`} defaultPressed />
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * Themes — every variant × colour, unpressed/pressed, plus inverse on a dark surface
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="bg-surface-base flex flex-col gap-4 rounded-lg p-6"
        >
          <Heading>{theme}</Heading>
          {VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-wrap items-center gap-3">
              {COLORS.map((color) => (
                <React.Fragment key={color}>
                  <Toggle variant={variant} color={color} label={`${variant} ${color}`} />
                  <Toggle
                    variant={variant}
                    color={color}
                    label={`${variant} ${color}`}
                    defaultPressed
                  />
                </React.Fragment>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <Toggle indicator label="Indicator" defaultPressed />
            <Toggle readOnly label="Read-only" defaultPressed />
            <Toggle inactive label="Inactive" />
            <Toggle aria-invalid label="Invalid" />
            <Toggle disabled label="Disabled" defaultPressed />
          </div>
          <div className="bg-fg-default flex flex-wrap items-center gap-3 rounded-md p-4">
            {VARIANTS.map((variant) => (
              <React.Fragment key={variant}>
                <Toggle variant={variant} color="inverse" label={`${variant} inverse`} />
                <Toggle
                  variant={variant}
                  color="inverse"
                  label={`${variant} inverse`}
                  defaultPressed
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
