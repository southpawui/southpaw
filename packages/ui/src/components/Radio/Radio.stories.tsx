import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/Radio",
};

export default meta;
type Story = StoryObj;

/* ---- Helper for radio + label row ---- */
function RadioOption({
  value,
  label,
  description,
  ...props
}: {
  value: string;
  label: string;
  description?: string;
} & Omit<React.ComponentProps<typeof Radio.Root>, "value">) {
  return (
    <Field.Item>
      <Field.Group direction="row">
        <Radio.Root value={value} aria-label={label} {...props} />
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-fg-default cursor-pointer text-sm">{label}</span>
          {description && <span className="text-fg-muted text-sm">{description}</span>}
        </span>
      </Field.Group>
    </Field.Item>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <Field.Root>
        <Field.Label>Notification preference</Field.Label>
        <RadioGroup defaultValue="email">
          <RadioOption value="email" label="Email" />
          <RadioOption value="sms" label="SMS" />
          <RadioOption
            value="push"
            label="Push notification"
            description="Requires the mobile app to be installed."
          />
        </RadioGroup>
      </Field.Root>
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Default</p>
        <Field.Root>
          <Field.Label>Plan</Field.Label>
          <RadioGroup defaultValue="free">
            <RadioOption value="free" label="Free" />
            <RadioOption value="pro" label="Pro" />
          </RadioGroup>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Valid</p>
        <Field.Root>
          <Field.Label>Plan</Field.Label>
          <RadioGroup defaultValue="pro">
            <RadioOption value="free" label="Free" valid />
            <RadioOption value="pro" label="Pro" valid />
          </RadioGroup>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Error</p>
        <Field.Root invalid>
          <Field.Label>Plan</Field.Label>
          <RadioGroup>
            <RadioOption value="free" label="Free" />
            <RadioOption value="pro" label="Pro" />
          </RadioGroup>
          <Field.Error>Please select a plan.</Field.Error>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Disabled</p>
        <Field.Root disabled>
          <Field.Label>Plan</Field.Label>
          <RadioGroup defaultValue="pro">
            <RadioOption value="free" label="Free" />
            <RadioOption value="pro" label="Pro (current)" />
          </RadioGroup>
          <Field.Description>Contact support to change your plan.</Field.Description>
        </Field.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
            {density}
          </p>
          <div className="sm:max-w-md">
            <Field.Root>
              <Field.Label>Notification preference</Field.Label>
              <RadioGroup defaultValue="email">
                <RadioOption value="email" label="Email" />
                <RadioOption value="sms" label="SMS" />
                <RadioOption value="push" label="Push notification" />
              </RadioGroup>
            </Field.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="bg-surface-base rounded-lg p-6">
          <p className="text-fg-muted mb-4 text-xs font-medium uppercase tracking-wide">{theme}</p>
          <div className="flex flex-col gap-6 sm:max-w-md">
            <Field.Root>
              <Field.Label>Default</Field.Label>
              <RadioGroup defaultValue="pro">
                <RadioOption value="free" label="Free" />
                <RadioOption value="pro" label="Pro" />
              </RadioGroup>
            </Field.Root>
            <Field.Root>
              <Field.Label>Valid</Field.Label>
              <RadioGroup defaultValue="pro">
                <RadioOption value="free" label="Free" valid />
                <RadioOption value="pro" label="Pro" valid />
              </RadioGroup>
            </Field.Root>
            <Field.Root invalid>
              <Field.Label>Error</Field.Label>
              <RadioGroup>
                <RadioOption value="free" label="Free" />
                <RadioOption value="pro" label="Pro" />
              </RadioGroup>
            </Field.Root>
            <Field.Root disabled>
              <Field.Label>Disabled</Field.Label>
              <RadioGroup defaultValue="pro">
                <RadioOption value="free" label="Free" />
                <RadioOption value="pro" label="Pro" />
              </RadioGroup>
            </Field.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
