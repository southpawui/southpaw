import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  ListIcon,
  SquaresFourIcon,
  MapTrifoldIcon,
  ArrowsClockwiseIcon,
} from "@phosphor-icons/react";
import { ToggleGroup } from "./ToggleGroup";
import { Toggle } from "../Toggle/Toggle";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/ToggleGroup",
};

export default meta;
type Story = StoryObj;

const WRAP = "flex w-full flex-col gap-6 sm:max-w-lg";
const VARIANTS = ["outline", "ghost", "solid"] as const;
const COLORS = ["default", "brand", "danger"] as const;

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">{children}</p>;
}

function Alignment(props: React.ComponentProps<typeof ToggleGroup.Root>) {
  return (
    <ToggleGroup.Root aria-label="Text alignment" defaultValue={["left"]} {...props}>
      <Toggle value="left" icon={<TextAlignLeftIcon />} label="Left" />
      <Toggle value="center" icon={<TextAlignCenterIcon />} label="Centre" />
      <Toggle value="right" icon={<TextAlignRightIcon />} label="Right" />
    </ToggleGroup.Root>
  );
}

/* ============================================================
 * Default — single select, attached, sliding indicator
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className={WRAP}>
      <Alignment />
    </div>
  ),
};

/* ============================================================
 * Multiple
 * ============================================================ */

export const Multiple: Story = {
  render: () => (
    <div className={WRAP}>
      <Heading>multiple — any combination (no sliding indicator)</Heading>
      <ToggleGroup.Root multiple aria-label="Text style" defaultValue={["bold"]}>
        <Toggle value="bold" size="icon" icon={<TextBIcon />} srOnly="Bold" />
        <Toggle value="italic" size="icon" icon={<TextItalicIcon />} srOnly="Italic" />
        <Toggle value="underline" size="icon" icon={<TextUnderlineIcon />} srOnly="Underline" />
      </ToggleGroup.Root>
    </div>
  ),
};

/* ============================================================
 * disallowEmptySelection — the last pressed item can't be released
 * ============================================================ */

export const DisallowEmpty: Story = {
  render: () => (
    <div className={WRAP}>
      <Heading>Default — clicking the pressed item clears the selection</Heading>
      <Alignment />
      <Heading>disallowEmptySelection — one always stays selected</Heading>
      <Alignment disallowEmptySelection aria-label="Text alignment (always one)" />
    </div>
  ),
};

/* ============================================================
 * Orientation
 * ============================================================ */

export const Orientation: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col gap-2">
        <Heading>Vertical, attached</Heading>
        <Alignment orientation="vertical" aria-label="Alignment (vertical)" />
      </div>
      <div className="flex flex-col gap-2">
        <Heading>Vertical, spaced</Heading>
        <Alignment orientation="vertical" attached={false} aria-label="Alignment (spaced)" />
      </div>
    </div>
  ),
};

/* ============================================================
 * Attached vs spaced
 * ============================================================ */

export const AttachedVsSpaced: Story = {
  render: () => (
    <div className={WRAP}>
      <Heading>attached (default) — a segmented control</Heading>
      <Alignment aria-label="Attached alignment" />
      <Heading>attached=&#123;false&#125; — spaced items</Heading>
      <Alignment attached={false} variant="ghost" aria-label="Spaced alignment" />
    </div>
  ),
};

/* ============================================================
 * Grow — equal widths across the full width
 * ============================================================ */

export const Grow: Story = {
  render: () => (
    <div className={WRAP}>
      <ToggleGroup.Root grow aria-label="View" defaultValue={["list"]}>
        <Toggle value="list" icon={<ListIcon />} label="List" />
        <Toggle value="grid" icon={<SquaresFourIcon />} label="Grid" />
        <Toggle value="map" icon={<MapTrifoldIcon />} label="Map" />
      </ToggleGroup.Root>
    </div>
  ),
};

/* ============================================================
 * Icon-only (GEO-959: these need Tooltips once Tooltip lands)
 * ============================================================ */

export const IconOnly: Story = {
  render: () => (
    <div className={WRAP}>
      <ToggleGroup.Root aria-label="Alignment (icons)" defaultValue={["center"]}>
        <Toggle value="left" size="icon" icon={<TextAlignLeftIcon />} srOnly="Align left" />
        <Toggle value="center" size="icon" icon={<TextAlignCenterIcon />} srOnly="Align centre" />
        <Toggle value="right" size="icon" icon={<TextAlignRightIcon />} srOnly="Align right" />
        <Toggle value="justify" size="icon" icon={<TextAlignJustifyIcon />} srOnly="Justify" />
      </ToggleGroup.Root>
    </div>
  ),
};

/* ============================================================
 * hideLabelsBelow — labels become screen-reader-only on small screens
 * ============================================================ */

export const HideLabels: Story = {
  render: () => (
    <div className={WRAP}>
      <p className="text-fg-muted text-sm">
        Resize below 640px: the labels hide, the icons stay, and each item keeps its accessible
        name.
      </p>
      <ToggleGroup.Root hideLabelsBelow="sm" aria-label="View (responsive)" defaultValue={["grid"]}>
        <Toggle value="list" icon={<ListIcon />} label="List" />
        <Toggle value="grid" icon={<SquaresFourIcon />} label="Grid" />
        <Toggle value="map" icon={<MapTrifoldIcon />} label="Map" />
      </ToggleGroup.Root>
    </div>
  ),
};

/* ============================================================
 * items — data-driven
 * ============================================================ */

export const Items: Story = {
  render: () => (
    <div className={WRAP}>
      <ToggleGroup.Root
        aria-label="Period"
        defaultValue={["week"]}
        items={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
          { value: "year", label: "Year", disabled: true },
        ]}
      />
    </div>
  ),
};

/* ============================================================
 * Form — name submits the selected values
 * ============================================================ */

function FormDemo() {
  const [submitted, setSubmitted] = React.useState("—");
  return (
    <form
      className={WRAP}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(JSON.stringify([...new FormData(e.currentTarget).entries()]));
      }}
    >
      <ToggleGroup.Root name="days" multiple aria-label="Delivery days" defaultValue={["mon"]}>
        <Toggle value="mon" label="Mon" />
        <Toggle value="tue" label="Tue" />
        <Toggle value="wed" label="Wed" />
        <Toggle value="thu" label="Thu" />
        <Toggle value="fri" label="Fri" />
      </ToggleGroup.Root>
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
 * In a Field — required + invalid + error (GOV.UK: say what to do)
 * ============================================================ */

export const InField: Story = {
  render: () => (
    <div className={WRAP}>
      <Field.Root invalid>
        <Field.Label id="tg-size-label">Size</Field.Label>
        <ToggleGroup.Root
          aria-labelledby="tg-size-label"
          invalid
          required
          name="size"
          items={[
            { value: "s", label: "Small" },
            { value: "m", label: "Medium" },
            { value: "l", label: "Large" },
          ]}
        />
        <Field.Error match>Select a size</Field.Error>
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * Read-only
 * ============================================================ */

export const ReadOnly: Story = {
  render: () => (
    <div className={WRAP}>
      <Alignment readOnly aria-label="Alignment (read-only)" />
    </div>
  ),
};

/* ============================================================
 * Counts (compose a Badge) + separator + an action next to the group
 * ============================================================ */

export const WithBadgeAndAction: Story = {
  render: () => (
    <div className="flex w-full flex-wrap items-center gap-3 sm:max-w-lg">
      <ToggleGroup.Root aria-label="Issues" defaultValue={["open"]}>
        <Toggle value="open">
          Open
          <Badge size="sm" variant="info">
            12
          </Badge>
        </Toggle>
        <Toggle value="closed">
          Closed
          <Badge size="sm">48</Badge>
        </Toggle>
        <ToggleGroup.Separator />
        <Toggle value="mine" label="Mine" />
      </ToggleGroup.Root>
      <Button variant="ghost" icon={<ArrowsClockwiseIcon />} label="Refresh" />
    </div>
  ),
};

/* ============================================================
 * States — default, pressed, invalid, read-only, disabled group, disabled item
 * (No "valid": selecting an option isn't validated as correct.)
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className={WRAP}>
      <Heading>Default (nothing selected)</Heading>
      <Alignment defaultValue={[]} aria-label="Alignment: none" />
      <Heading>Pressed</Heading>
      <Alignment aria-label="Alignment: pressed" />
      <Heading>Invalid</Heading>
      <Alignment invalid defaultValue={[]} aria-label="Alignment: invalid" />
      <Heading>Read-only</Heading>
      <Alignment readOnly aria-label="Alignment: read-only" />
      <Heading>Disabled group</Heading>
      <Alignment disabled aria-label="Alignment: disabled" />
      <Heading>Disabled item</Heading>
      <ToggleGroup.Root aria-label="Alignment: one disabled" defaultValue={["left"]}>
        <Toggle value="left" label="Left" />
        <Toggle value="center" label="Centre" disabled />
        <Toggle value="right" label="Right" />
      </ToggleGroup.Root>
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
          <Alignment aria-label={`Alignment (${density})`} />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * RTL — the sliding indicator and arrow keys follow the direction
 * ============================================================ */

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className={WRAP}>
      <Alignment aria-label="Alignment (RTL)" defaultValue={["right"]} />
    </div>
  ),
};

/* ============================================================
 * Themes — every variant × colour, plus inverse on a dark surface
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
                <ToggleGroup.Root
                  key={color}
                  variant={variant}
                  color={color}
                  defaultValue={["b"]}
                  aria-label={`${theme} ${variant} ${color}`}
                >
                  <Toggle value="a" label="One" />
                  <Toggle value="b" label="Two" />
                  <Toggle value="c" label="Three" />
                </ToggleGroup.Root>
              ))}
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <Alignment invalid defaultValue={[]} aria-label={`${theme} invalid`} />
            <Alignment readOnly aria-label={`${theme} read-only`} />
            <Alignment disabled aria-label={`${theme} disabled`} />
          </div>
          <div className="bg-fg-default flex flex-wrap items-center gap-3 rounded-md p-4">
            {VARIANTS.map((variant) => (
              <ToggleGroup.Root
                key={variant}
                variant={variant}
                color="inverse"
                defaultValue={["b"]}
                aria-label={`${theme} ${variant} inverse`}
              >
                <Toggle value="a" label="One" />
                <Toggle value="b" label="Two" />
              </ToggleGroup.Root>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * Separator splits an attached group into runs — [One | Two]  [Three | Four]
 * (George's "last of type" decision): roving focus and the indicator cross the split.
 * ============================================================ */

export const SeparatorSplit: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="bg-surface-base flex flex-col gap-4 rounded-lg p-6"
        >
          <Heading>{theme}</Heading>
          <div className="flex flex-wrap items-center gap-3">
            <ToggleGroup.Root aria-label={`${theme} issues`} defaultValue={["open"]}>
              <Toggle value="open">
                Open
                <Badge size="sm" variant="info">
                  12
                </Badge>
              </Toggle>
              <Toggle value="closed">
                Closed
                <Badge size="sm">48</Badge>
              </Toggle>
              <ToggleGroup.Separator />
              <Toggle value="mine" label="Mine" />
            </ToggleGroup.Root>
            <Button variant="ghost" icon={<ArrowsClockwiseIcon />} label="Refresh" />
          </div>
          <div className="flex flex-wrap items-start gap-4">
            <ToggleGroup.Root aria-label={`${theme} outline`} defaultValue={["b"]}>
              <Toggle value="a" label="One" />
              <Toggle value="b" label="Two" />
              <ToggleGroup.Separator />
              <Toggle value="c" label="Three" />
              <Toggle value="d" label="Four" />
            </ToggleGroup.Root>
            <ToggleGroup.Root variant="solid" aria-label={`${theme} solid`} defaultValue={["c"]}>
              <Toggle value="a" label="One" />
              <Toggle value="b" label="Two" />
              <ToggleGroup.Separator />
              <Toggle value="c" label="Three" />
            </ToggleGroup.Root>
            <ToggleGroup.Root
              orientation="vertical"
              aria-label={`${theme} vertical`}
              defaultValue={["a"]}
            >
              <Toggle value="a" label="One" />
              <ToggleGroup.Separator />
              <Toggle value="b" label="Two" />
              <Toggle value="c" label="Three" />
            </ToggleGroup.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
