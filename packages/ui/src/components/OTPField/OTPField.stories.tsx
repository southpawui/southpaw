import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OTPField, type OTPFieldRootProps } from "./OTPField";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { Form } from "../Form/Form";

const meta: Meta = {
  title: "Components/OTPField",
};

export default meta;
type Story = StoryObj;

/** Presentational width cap for stories. */
const WRAP = "w-full sm:max-w-md";

interface DemoProps extends OTPFieldRootProps {
  label: string;
  description?: string;
  error?: string;
  invalid?: boolean;
}

/** A labelled OTPField inside a Field — the recommended composition. */
function Demo({ label, description, error, invalid, ...root }: DemoProps) {
  return (
    <Field.Root invalid={invalid}>
      <Field.Label>{label}</Field.Label>
      <OTPField.Root {...root} />
      {description && <Field.Description>{description}</Field.Description>}
      {error && <Field.Error match>{error}</Field.Error>}
    </Field.Root>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">{children}</p>;
}

const SIZES = ["sm", "md", "lg"] as const;

function StateSet({ className, ...extra }: Partial<OTPFieldRootProps> & { className?: string }) {
  return (
    <div className={`flex flex-col gap-5 ${className ?? ""}`}>
      <Demo label="Default" groups={[3, 3]} {...extra} />
      <Demo label="Filled" groups={[3, 3]} defaultValue="482913" {...extra} />
      <Demo label="Valid" groups={[3, 3]} defaultValue="482913" valid {...extra} />
      <Demo
        label="Warning"
        description="This code expires in under a minute."
        groups={[3, 3]}
        defaultValue="482913"
        warning
        {...extra}
      />
      <Demo
        label="Error"
        groups={[3, 3]}
        defaultValue="482"
        invalid
        error="Enter the full 6-digit code."
        {...extra}
      />
      <Demo label="Disabled" groups={[3, 3]} defaultValue="482913" disabled {...extra} />
      <Demo label="Read-only" groups={[3, 3]} defaultValue="482913" readOnly {...extra} />
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
      label="Verification code"
      description="We sent a 6-digit code to the number ending 123."
      groups={[3, 3]}
    />
  ),
};

/* ============================================================
 * States
 * ============================================================ */

export const States: Story = {
  render: () => <StateSet className={WRAP} />,
};

/* ============================================================
 * Lengths + groups
 * ============================================================ */

export const LengthsAndGroups: Story = {
  render: () => (
    <div className={`flex flex-col gap-5 ${WRAP}`}>
      <Demo label="PIN (4, no groups)" length={4} />
      <Demo label="6 digits, no groups" length={6} />
      <Demo
        label="8 characters, no groups"
        length={8}
        validationType="alphanumeric"
        description="On narrow screens the slots shrink to fit (never below 24px)."
      />
      <Demo label="6 digits in pairs" groups={[2, 2, 2]} />
      <Demo label="8 characters, 4 + 4" groups={[4, 4]} validationType="alphanumeric" />
      <Demo
        label="Custom separator node"
        groups={[3, 3]}
        separator={<span className="text-fg-muted text-3xl leading-none">·</span>}
      />
      <Demo
        label="Separator as a function of its index"
        groups={[2, 2, 2]}
        separator={(i) => <span className="text-fg-muted text-xs font-medium">{i + 1}</span>}
      />
      <Demo label="No separator (gap only)" groups={[3, 3]} separator={null} />
    </div>
  ),
};

/* ============================================================
 * Sizes
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className={`flex flex-col gap-5 ${WRAP}`}>
      {SIZES.map((size) => (
        <Demo key={size} label={`Size ${size}`} size={size} groups={[3, 3]} defaultValue="48" />
      ))}
    </div>
  ),
};

/* ============================================================
 * Attached
 * ============================================================ */

export const Attached: Story = {
  render: () => (
    <div className={`flex flex-col gap-5 ${WRAP}`}>
      <Demo label="Attached" attached length={6} defaultValue="48" />
      <Demo label="Attached, grouped" attached groups={[3, 3]} defaultValue="4829" />
      <Demo
        label="Attached, error"
        attached
        groups={[3, 3]}
        defaultValue="48"
        invalid
        error="Enter the full 6-digit code."
      />
      <Demo label="Attached, disabled" attached groups={[3, 3]} defaultValue="482913" disabled />
    </div>
  ),
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
          <Demo label="Separate" groups={[3, 3]} defaultValue="48" />
          <Demo label="Attached" attached groups={[3, 3]} defaultValue="48" />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * Themes
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
          <div className="flex flex-col gap-5">
            <Heading>Attached</Heading>
            <Demo label="Attached" attached groups={[3, 3]} defaultValue="4829" />
            <Demo label="Attached, error" attached groups={[3, 3]} defaultValue="48" invalid />
            <Demo label="Attached, valid" attached groups={[3, 3]} defaultValue="482913" valid />
          </div>
          <div className="flex flex-col gap-5">
            <Heading>Sizes</Heading>
            {SIZES.map((size) => (
              <Demo
                key={size}
                label={`Size ${size}`}
                size={size}
                groups={[3, 3]}
                defaultValue="48"
              />
            ))}
          </div>
          <div className="flex flex-col gap-5">
            <Heading>Mask + placeholder</Heading>
            <Demo label="Masked" mask groups={[3, 3]} defaultValue="4829" />
            <Demo label="Placeholder" placeholder="○" groups={[3, 3]} defaultValue="48" />
          </div>
        </section>
      ))}
    </div>
  ),
};

/* ============================================================
 * Character types — Base UI validationType + normalizeValue
 * ============================================================ */

export const CharacterTypes: Story = {
  render: () => (
    <div className={`flex flex-col gap-5 ${WRAP}`}>
      <Demo label="Numeric (default)" groups={[3, 3]} description="Letters are rejected." />
      <Demo
        label="Alphanumeric, uppercased"
        groups={[3, 3]}
        validationType="alphanumeric"
        normalizeValue={(v) => v.toUpperCase()}
        description="normalizeValue uppercases as you type or paste."
      />
      <Demo label="Letters only" length={4} validationType="alpha" />
      <Demo
        label="Strip dashes on paste"
        groups={[3, 3]}
        normalizeValue={(v) => v.replace(/-/g, "")}
        description='Paste "123-456" — the dash is removed.'
      />
    </div>
  ),
};

/* ============================================================
 * Mask + placeholder
 * ============================================================ */

export const MaskAndPlaceholder: Story = {
  render: () => (
    <div className={`flex flex-col gap-5 ${WRAP}`}>
      <Demo
        label="PIN (masked)"
        description="Masking makes typos harder to spot. Only use it for codes that must stay private on screen."
        length={4}
        mask
        defaultValue="12"
      />
      <Demo label="Placeholder ○" groups={[3, 3]} placeholder="○" />
      <Demo label="Placeholder –" length={4} placeholder="–" />
    </div>
  ),
};

/* ============================================================
 * Behaviour — complete, autoSubmit, blur, select
 * ============================================================ */

function CompleteDemo() {
  const [code, setCode] = React.useState<string | null>(null);
  return (
    <Demo
      label="onValueComplete"
      groups={[3, 3]}
      onValueComplete={(value) => setCode(value)}
      description={code ? `Completed: ${code}` : "Fill every slot."}
    />
  );
}

function AutoSubmitDemo() {
  const [submitted, setSubmitted] = React.useState<string | null>(null);
  return (
    <Form
      aria-label="Verify"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(String(new FormData(e.currentTarget).get("code")));
      }}
    >
      <Demo
        label="Auto-submit"
        name="code"
        groups={[3, 3]}
        autoSubmit
        description={
          submitted
            ? `Submitted: ${submitted}`
            : "The form submits as soon as the last slot is filled."
        }
      />
    </Form>
  );
}

export const Behaviour: Story = {
  render: () => (
    <div className={`flex flex-col gap-5 ${WRAP}`}>
      <CompleteDemo />
      <AutoSubmitDemo />
      <Demo
        label="Blur on complete"
        groups={[3, 3]}
        blurOnComplete
        description="Focus leaves the field once it's full. Tell users this happens (WCAG 3.2.2)."
      />
      <Demo
        label="Filled slots select on focus (native)"
        groups={[3, 3]}
        defaultValue="482913"
        description="Click, Tab or arrow into a filled slot: Base UI selects its character, so typing replaces it."
      />
    </div>
  ),
};

/* ============================================================
 * Translated slot labels
 * ============================================================ */

export const SlotLabels: Story = {
  render: () => (
    <Demo
      className={WRAP}
      label="Code de vérification"
      description='Slots 2–6 are named "Caractère 2 sur 6"… via getSlotLabel. Slot 1 uses the field label.'
      groups={[3, 3]}
      getSlotLabel={(i, n) => `Caractère ${i + 1} sur ${n}`}
    />
  ),
};

/* ============================================================
 * Single input — the GOV.UK pattern
 * ============================================================ */

export const SingleInputGovUK: Story = {
  render: () => (
    <Field.Root className={WRAP}>
      <Field.Label>Security code</Field.Label>
      <Field.Description>
        We sent a code to the number ending 123. It expires in 15 minutes.
      </Field.Description>
      <Input
        name="security-code"
        defaultValue="482913"
        autoComplete="one-time-code"
        inputMode="numeric"
        spellCheck={false}
        maxLength={6}
        className="sm:max-w-40 [&_input]:font-medium [&_input]:tabular-nums [&_input]:tracking-[0.3em]"
      />
      <div className="flex items-center gap-2">
        <span className="text-fg-muted text-sm">Not received a code?</span>
        <Button variant="ghost" size="sm">
          Send a new code
        </Button>
      </div>
    </Field.Root>
  ),
};

/* ============================================================
 * Manual composition
 * ============================================================ */

export const Composition: Story = {
  render: () => (
    <Field.Root className={WRAP}>
      <Field.Label>Backup code</Field.Label>
      <OTPField.Root length={4} validationType="alphanumeric">
        <OTPField.Group>
          <OTPField.Input />
          <OTPField.Input aria-label="Character 2 of 4" />
        </OTPField.Group>
        <OTPField.Separator />
        <OTPField.Group>
          <OTPField.Input aria-label="Character 3 of 4" />
          <OTPField.Input aria-label="Character 4 of 4" />
        </OTPField.Group>
      </OTPField.Root>
      <Field.Description>
        Hand-composed: pass aria-label to slots 2..N yourself (auto-render does this for you).
      </Field.Description>
    </Field.Root>
  ),
};
