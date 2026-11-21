import type { Meta, StoryObj } from "@storybook/react";
import { HashIcon, ThermometerIcon } from "@phosphor-icons/react";
import { NumberField, type NumberFieldRootProps, type NumberFieldGroupProps } from "./NumberField";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/NumberField",
};

export default meta;
type Story = StoryObj;

/* ---- Helpers ---- */

interface DemoProps extends NumberFieldRootProps {
  label: string;
  description?: string;
  error?: string;
  invalid?: boolean;
  group?: NumberFieldGroupProps;
}

/** A labelled NumberField inside a Field — the recommended composition. */
function Demo({ label, description, error, invalid, group, ...root }: DemoProps) {
  return (
    <Field.Root invalid={invalid}>
      <Field.Label>{label}</Field.Label>
      <NumberField.Root {...root}>
        <NumberField.Group {...group} />
      </NumberField.Root>
      {description && <Field.Description>{description}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">{children}</p>;
}

const CONTROLS = ["end", "split", "stacked", "none"] as const;
const SIZES = ["sm", "md", "lg"] as const;
/** Presentational width cap for stories — the component itself is full-width. */
const WRAP = "w-full sm:max-w-md";

function StateSet({
  controls = "end",
  className,
}: {
  controls?: NumberFieldRootProps["controls"];
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      <Demo label="Default" controls={controls} defaultValue={3} />
      <Demo label="Valid" controls={controls} defaultValue={3} valid />
      <Demo
        label="Warning"
        description="Unusually high. Check the value before you continue."
        controls={controls}
        defaultValue={98}
        warning
      />
      <Demo
        label="Error"
        controls={controls}
        defaultValue={0}
        invalid
        error="Enter a quantity of 1 or more."
      />
      <Demo label="Disabled" controls={controls} defaultValue={3} disabled />
      <Demo label="Read-only" controls={controls} defaultValue={3} readOnly />
      <Demo label="Loading" controls={controls} defaultValue={3} loading />
    </div>
  );
}

/* ============================================================
 * Default
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Demo
      className={WRAP}
      label="Quantity"
      description="Between 1 and 99."
      defaultValue={1}
      min={1}
      max={99}
    />
  ),
};

/* ============================================================
 * Controls — stepper layouts
 * ============================================================ */

export const Controls: Story = {
  render: () => (
    <div className={`flex flex-col gap-6 ${WRAP}`}>
      <Demo label="End (default)" controls="end" defaultValue={4} />
      <Demo label="Split" controls="split" defaultValue={4} />
      <Demo label="None (keyboard only)" controls="none" defaultValue={4} />
      <div data-density="comfortable" className="flex flex-col gap-1.5">
        <Heading>Comfortable density</Heading>
        <Demo label="Stacked" controls="stacked" defaultValue={4} />
      </div>
      <Demo
        label="Stacked at default density"
        description='Each half would be 20px (under WCAG 2.5.8’s 24px), so this falls back to "end".'
        controls="stacked"
        defaultValue={4}
      />
      <Demo
        label="Stacked, size lg"
        description="Large is tall enough for stacked steppers at default density."
        controls="stacked"
        size="lg"
        defaultValue={4}
      />
    </div>
  ),
};

/* ============================================================
 * Sizes
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className={`flex flex-col gap-4 ${WRAP}`}>
      {SIZES.map((size) => (
        <Demo key={size} label={`Size ${size}`} size={size} defaultValue={12} />
      ))}
    </div>
  ),
};

/* ============================================================
 * States
 * ============================================================ */

export const States: Story = {
  render: () => <StateSet className={WRAP} />,
};

/* ============================================================
 * Density
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className={`flex flex-col gap-10 ${WRAP}`}>
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density} className="flex flex-col gap-4">
          <Heading>{density}</Heading>
          {CONTROLS.map((controls) => (
            <Demo
              key={controls}
              label={`Controls: ${controls}`}
              controls={controls}
              defaultValue={8}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * Themes — all states, all layouts, all sizes, every theme
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className={`flex flex-col gap-8 ${WRAP}`}>
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          aria-label={`${theme} theme`}
          className="bg-surface-base text-fg-default flex flex-col gap-6 rounded-lg p-6"
        >
          <Heading>{theme}</Heading>
          <StateSet />
          <div className="flex flex-col gap-4">
            <Heading>Layouts</Heading>
            <Demo label="Split" controls="split" defaultValue={2} />
            <Demo label="None" controls="none" defaultValue={2} />
            <Demo label="Stacked (lg)" controls="stacked" size="lg" defaultValue={2} />
            <Demo label="Split, error" controls="split" defaultValue={2} invalid />
            <Demo label="Split, disabled" controls="split" defaultValue={2} disabled />
          </div>
          <div className="flex flex-col gap-4">
            <Heading>Sizes</Heading>
            {SIZES.map((size) => (
              <Demo key={size} label={`Size ${size}`} size={size} defaultValue={2} />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <Heading>Adornments</Heading>
            <Demo label="Price" group={{ prepend: "£" }} defaultValue={9.99} step={0.01} />
            <Demo label="Weight" group={{ append: "kg" }} defaultValue={70} />
          </div>
        </section>
      ))}
    </div>
  ),
};

/* ============================================================
 * Formatting — Intl.NumberFormat via `format`
 * ============================================================ */

export const Formatting: Story = {
  render: () => (
    <div className={`flex flex-col gap-4 ${WRAP}`}>
      <Demo
        label="Price (GBP)"
        description="format={{ style: 'currency', currency: 'GBP' }} — the symbol is part of the value screen readers hear."
        format={{ style: "currency", currency: "GBP" }}
        defaultValue={1249.5}
        step={0.5}
      />
      <Demo
        label="Discount"
        format={{ style: "percent" }}
        defaultValue={0.15}
        step={0.01}
        min={0}
        max={1}
      />
      <Demo
        label="Distance"
        format={{ style: "unit", unit: "kilometer", unitDisplay: "short" }}
        defaultValue={42.2}
        step={0.1}
      />
      <Demo
        label="Exchange rate (4 dp)"
        format={{ minimumFractionDigits: 4, maximumFractionDigits: 4 }}
        defaultValue={1.1712}
        step={0.0001}
      />
      <Demo
        label="Preis (de-DE)"
        locale="de-DE"
        format={{ style: "currency", currency: "EUR" }}
        defaultValue={1249.5}
      />
      <Demo
        label="Population (compact)"
        format={{ notation: "compact" }}
        defaultValue={67_000_000}
        step={1_000_000}
      />
    </div>
  ),
};

/* ============================================================
 * Adornments — prepend / append (same API as Input)
 * ============================================================ */

export const Adornments: Story = {
  render: () => (
    <div className={`flex flex-col gap-4 ${WRAP}`}>
      <Demo
        label="Price"
        description="Visual prefix. Use format instead when the unit must be read out with the value."
        group={{ prepend: "£" }}
        defaultValue={9.99}
        step={0.01}
      />
      <Demo label="Weight in kg" group={{ append: "kg" }} defaultValue={70} />
      <Demo
        label="Temperature in °C"
        group={{ prepend: <ThermometerIcon aria-hidden="true" />, append: "°C" }}
        defaultValue={21}
      />
      <Demo
        label="Order number"
        controls="none"
        group={{ prepend: <HashIcon aria-hidden="true" /> }}
        format={{ useGrouping: false }}
        defaultValue={10045}
      />
      <Demo
        label="Price, split"
        controls="split"
        group={{ prepend: "£", append: "each" }}
        defaultValue={4}
      />
    </div>
  ),
};

/* ============================================================
 * Range + step
 * ============================================================ */

export const RangeAndStep: Story = {
  render: () => (
    <div className={`flex flex-col gap-4 ${WRAP}`}>
      <Demo
        label="Guests"
        description="min 1, max 8. The button at a limit is disabled."
        min={1}
        max={8}
        defaultValue={8}
      />
      <Demo
        label="Step 5"
        description="Shift + arrow steps by largeStep (50), Alt + arrow by smallStep (1)."
        step={5}
        largeStep={50}
        smallStep={1}
        defaultValue={25}
      />
      <Demo
        label="Snap on step"
        description="snapOnStep: stepping from 7 goes to 10, not 12."
        step={5}
        snapOnStep
        defaultValue={7}
      />
      <Demo
        label="Allow out of range"
        description="allowOutOfRange: typed values outside 0–100 aren't clamped on blur. Validate with Field."
        min={0}
        max={100}
        allowOutOfRange
        defaultValue={120}
      />
    </div>
  ),
};

/* ============================================================
 * Scrub — drag on the label
 * ============================================================ */

export const Scrub: Story = {
  render: () => (
    <Field.Root className={WRAP}>
      <NumberField.Root defaultValue={50} min={0} max={100}>
        <NumberField.ScrubArea>
          <Field.Label>Opacity (drag the label)</Field.Label>
          <NumberField.ScrubAreaCursor />
        </NumberField.ScrubArea>
        <NumberField.Group append="%" />
      </NumberField.Root>
      <Field.Description>Drag left or right on the label to change the value.</Field.Description>
    </Field.Root>
  ),
};

/* ============================================================
 * Behaviour — wheel + select on focus
 * ============================================================ */

export const Behaviour: Story = {
  render: () => (
    <div className={`flex flex-col gap-4 ${WRAP}`}>
      <Demo
        label="Mouse wheel"
        description="allowWheelScrub: scroll over the focused field to step."
        allowWheelScrub
        defaultValue={10}
      />
      <Demo
        label="Select on focus"
        description="selectOnFocus: the whole value is selected, so typing replaces it."
        selectOnFocus
        defaultValue={250}
      />
    </div>
  ),
};

/* ============================================================
 * Width — size the field to the expected value (GOV.UK, Baymard)
 * ============================================================ */

export const Width: Story = {
  render: () => (
    <div className={`flex flex-col gap-4 ${WRAP}`}>
      <Demo
        label="Age"
        description="Full width by default; constrain with className."
        className="sm:max-w-32"
        defaultValue={30}
      />
      <Demo
        label="Year"
        className="sm:max-w-40"
        format={{ useGrouping: false }}
        defaultValue={2026}
      />
      <Demo
        label="Annual salary"
        className="sm:max-w-64"
        group={{ prepend: "£" }}
        defaultValue={42000}
      />
    </div>
  ),
};

/* ============================================================
 * Composition — manual parts + no Field
 * ============================================================ */

export const Composition: Story = {
  render: () => (
    <div className={`flex flex-col gap-6 ${WRAP}`}>
      <div className="flex flex-col gap-1.5">
        <Heading>Manual composition</Heading>
        <Field.Root>
          <Field.Label>Seats</Field.Label>
          <NumberField.Root defaultValue={2} min={0}>
            <NumberField.Group>
              <NumberField.Input />
              <NumberField.Decrement />
              <NumberField.Increment />
            </NumberField.Group>
          </NumberField.Root>
        </Field.Root>
      </div>
      <div className="flex flex-col gap-1.5">
        <Heading>Without Field (aria-label on the input)</Heading>
        <NumberField.Root defaultValue={1}>
          <NumberField.Group inputProps={{ "aria-label": "Page number" }} />
        </NumberField.Root>
      </div>
    </div>
  ),
};
