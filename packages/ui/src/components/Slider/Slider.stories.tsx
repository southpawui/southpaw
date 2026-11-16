import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider, type SliderSize } from "./Slider";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";

const meta: Meta = {
  title: "Components/Slider",
};

export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------
 * Default
 * ------------------------------------------------------------ */

export const Default: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Slider.Root defaultValue={40}>
        <Slider.Header>
          <Slider.Label>Volume</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

/* ------------------------------------------------------------
 * States — default, valid, invalid (Field), disabled, read-only
 * ------------------------------------------------------------ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <Slider.Root defaultValue={40}>
        <Slider.Header>
          <Slider.Label>Default</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
      <Slider.Root defaultValue={60} valid>
        <Slider.Header>
          <Slider.Label>Valid</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
      <Field.Root invalid>
        <Slider.Root defaultValue={90}>
          <Slider.Header>
            <Slider.Label>Invalid</Slider.Label>
            <Slider.Value />
          </Slider.Header>
        </Slider.Root>
        <Field.Error match>Pick 80 or less.</Field.Error>
      </Field.Root>
      <Slider.Root defaultValue={30} disabled>
        <Slider.Header>
          <Slider.Label>Disabled</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
      <Slider.Root defaultValue={70} readOnly>
        <Slider.Header>
          <Slider.Label>Read-only</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Sizes
 * ------------------------------------------------------------ */

const SIZES: SliderSize[] = ["sm", "md", "lg"];

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      {SIZES.map((size) => (
        <Slider.Root key={size} size={size} defaultValue={50}>
          <Slider.Header>
            <Slider.Label>Size {size}</Slider.Label>
            <Slider.Value />
          </Slider.Header>
        </Slider.Root>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------
 * Range + multi-thumb
 * ------------------------------------------------------------ */

export const Range: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <Slider.Root defaultValue={[20, 80]} format={{ style: "currency", currency: "GBP" }}>
        <Slider.Header>
          <Slider.Label>Price</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
      <Slider.Root defaultValue={[30, 50]} minStepsBetweenValues={10} thumbCollisionBehavior="push">
        <Slider.Header>
          <Slider.Label>At least 10 apart (push)</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

export const MultiThumb: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Slider.Root defaultValue={[10, 40, 75]}>
        <Slider.Header>
          <Slider.Label>Breakpoints</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Marks + restrict to marks
 * ------------------------------------------------------------ */

const TEMPS = [
  { value: 0, label: "0°C" },
  { value: 20, label: "20°C" },
  { value: 37, label: "37°C" },
  { value: 100, label: "100°C" },
];

export const Marks: Story = {
  render: () => (
    <div className="flex flex-col gap-10 sm:max-w-md">
      <Slider.Root defaultValue={40} step={10} marks>
        <Slider.Header>
          <Slider.Label>One mark per step</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
      <Slider.Root defaultValue={37} marks={TEMPS} formatValue={(v) => `${v}°C`}>
        <Slider.Header>
          <Slider.Label>Labelled marks</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

export const RestrictToMarks: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Slider.Root
        defaultValue={37}
        marks={[...TEMPS, { value: 60, hidden: true }]}
        restrictToMarks
        formatValue={(v) => `${v}°C`}
      >
        <Slider.Header>
          <Slider.Label>Only marked values (60°C is a hidden mark)</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Value label (Tooltip)
 * ------------------------------------------------------------ */

export const ValueLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-12 pt-8 sm:max-w-md">
      <Slider.Root defaultValue={30} valueLabel="auto">
        <Slider.Label>auto (hover, focus, drag)</Slider.Label>
      </Slider.Root>
      <Slider.Root defaultValue={[25, 70]} valueLabel="always">
        <Slider.Label>always</Slider.Label>
      </Slider.Root>
      <Slider.Root defaultValue={60} valueLabel="off">
        <Slider.Label>off</Slider.Label>
      </Slider.Root>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Format + scale
 * ------------------------------------------------------------ */

function bytes(v: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let n = v;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${Math.round(n)} ${units[i]}`;
}

export const FormatAndScale: Story = {
  render: () => (
    <div className="flex flex-col gap-12 pt-8 sm:max-w-md">
      <Slider.Root defaultValue={0.25} min={0} max={1} step={0.05} format={{ style: "percent" }}>
        <Slider.Header>
          <Slider.Label>Opacity (Intl format)</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
      <Slider.Root
        defaultValue={20}
        min={10}
        max={40}
        scale={(v) => 2 ** v}
        formatValue={(v) => bytes(v)}
        valueLabel="always"
      >
        <Slider.Header>
          <Slider.Label>Storage (2^x scale)</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Origin + track modes
 * ------------------------------------------------------------ */

export const Origin: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <Slider.Root defaultValue={-20} min={-50} max={50} origin="center" marks={[0]}>
        <Slider.Header>
          <Slider.Label>Balance (fills from the centre)</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
      <Slider.Root defaultValue={80} origin={60}>
        <Slider.Header>
          <Slider.Label>Fills from 60</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

export const TrackModes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      {(["normal", "inverted", "none"] as const).map((track) => (
        <Slider.Root key={track} defaultValue={[30, 70]} track={track}>
          <Slider.Header>
            <Slider.Label>track=&quot;{track}&quot;</Slider.Label>
            <Slider.Value />
          </Slider.Header>
        </Slider.Root>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------
 * Draggable range + editable handles (Ant)
 * ------------------------------------------------------------ */

export const DraggableRange: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Slider.Root defaultValue={[30, 60]} draggableTrack>
        <Slider.Header>
          <Slider.Label>Drag the filled range to move both</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

export const Editable: Story = {
  render: () => (
    <div className="flex flex-col gap-3 sm:max-w-md">
      <Slider.Root
        defaultValue={[20, 50, 80]}
        editable={{ minCount: 1, maxCount: 5 }}
        marks={[0, 25, 50, 75, 100]}
      >
        <Slider.Header>
          <Slider.Label>Gradient stops</Slider.Label>
          <Slider.Value />
        </Slider.Header>
        <Slider.Body>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Marks />
              <Slider.Thumbs />
            </Slider.Track>
          </Slider.Control>
        </Slider.Body>
        <div className="flex gap-2">
          <Slider.AddHandle />
          <Slider.RemoveHandle />
        </div>
      </Slider.Root>
      <p className="text-fg-muted text-xs">
        Click the track or use Add handle (max 5). Press Delete on a focused handle, use Remove
        handle, or drag it off the track to remove it (min 1).
      </p>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Paired input (Carbon) — composed with Input until Slider.Input (NumberField) lands
 * ------------------------------------------------------------ */

function WithInputDemo() {
  const [value, setValue] = React.useState(40);
  const [draft, setDraft] = React.useState("40");
  const inputId = React.useId();
  const commitDraft = () => {
    const n = Number(draft);
    const next = Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : value;
    setValue(next);
    setDraft(String(next));
  };
  return (
    <div className="flex flex-col gap-2 sm:max-w-md">
      <span id={`${inputId}-label`} className="text-fg-default text-sm font-medium">
        Brightness
      </span>
      <div className="flex items-center gap-4">
        <Slider.Root
          value={value}
          onValueChange={(v) => {
            setValue(v);
            setDraft(String(v));
          }}
          className="flex-1"
          aria-labelledby={`${inputId}-label`}
          getAriaLabel={() => "Brightness"}
        />
        <div className="w-20">
          <Input
            aria-label="Brightness value"
            id={inputId}
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitDraft();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const WithInput: Story = { render: () => <WithInputDemo /> };

/* ------------------------------------------------------------
 * Min / max labels
 * ------------------------------------------------------------ */

export const MinMax: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Slider.Root
        defaultValue={[200, 650]}
        min={0}
        max={1000}
        step={50}
        showMinMax
        format={{ style: "currency", currency: "GBP", maximumFractionDigits: 0 }}
      >
        <Slider.Header>
          <Slider.Label>Budget</Slider.Label>
          <Slider.Value />
        </Slider.Header>
      </Slider.Root>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Vertical
 * ------------------------------------------------------------ */

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-12">
      <Slider.Root orientation="vertical" defaultValue={60}>
        <Slider.Label>Gain</Slider.Label>
      </Slider.Root>
      <Slider.Root orientation="vertical" defaultValue={[20, 70]} marks={TEMPS} showMinMax>
        <Slider.Label>Range</Slider.Label>
      </Slider.Root>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Field — label, description, error
 * ------------------------------------------------------------ */

export const WithField: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <Field.Root>
        <Slider.Root defaultValue={30} name="radius">
          <Slider.Header>
            <Slider.Label>Search radius</Slider.Label>
            <Slider.Value />
          </Slider.Header>
        </Slider.Root>
        <Field.Description>Miles from your postcode.</Field.Description>
      </Field.Root>
      <Field.Root invalid>
        <Slider.Root defaultValue={0} name="seats">
          <Slider.Header>
            <Slider.Label>Seats</Slider.Label>
            <Slider.Value />
          </Slider.Header>
        </Slider.Root>
        <Field.Error match>Choose at least one seat.</Field.Error>
      </Field.Root>
    </div>
  ),
};

/* ------------------------------------------------------------
 * Density
 * ------------------------------------------------------------ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <Slider.Root defaultValue={[25, 75]} marks={TEMPS} showMinMax>
            <Slider.Header>
              <Slider.Label>{density}</Slider.Label>
              <Slider.Value />
            </Slider.Header>
          </Slider.Root>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------
 * Themes — every state × size, range, marks, value label, 3 themes
 * ------------------------------------------------------------ */

function ThemePanel({ theme }: { theme: "light" | "dark" | "high-contrast" }) {
  return (
    <section data-theme={theme} className="bg-surface-base text-fg-default rounded-lg p-6">
      <h3 className="text-fg-muted mb-4 text-xs font-semibold uppercase tracking-wide">{theme}</h3>
      <div className="grid gap-x-10 gap-y-8 pt-6 sm:grid-cols-2">
        <Slider.Root defaultValue={40} valueLabel="always">
          <Slider.Label>Default</Slider.Label>
        </Slider.Root>
        <Slider.Root defaultValue={60} valid>
          <Slider.Label>Valid</Slider.Label>
        </Slider.Root>
        <Field.Root invalid>
          <Slider.Root defaultValue={90}>
            <Slider.Label>Invalid</Slider.Label>
          </Slider.Root>
        </Field.Root>
        <Slider.Root defaultValue={30} disabled>
          <Slider.Label>Disabled</Slider.Label>
        </Slider.Root>
        <Slider.Root defaultValue={70} readOnly>
          <Slider.Label>Read-only</Slider.Label>
        </Slider.Root>
        <Slider.Root defaultValue={[20, 80]} marks={TEMPS}>
          <Slider.Label>Range + marks</Slider.Label>
        </Slider.Root>
        {SIZES.map((size) => (
          <Slider.Root key={size} size={size} defaultValue={50} track="inverted">
            <Slider.Label>Size {size} (inverted)</Slider.Label>
          </Slider.Root>
        ))}
      </div>
    </section>
  );
}

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <ThemePanel key={theme} theme={theme} />
      ))}
    </div>
  ),
};
