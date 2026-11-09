import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxGroup } from "./CheckboxGroup";
import { Checkbox } from "../Checkbox/Checkbox";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/CheckboxGroup",
};

export default meta;
type Story = StoryObj;

/* ---- Helper ---- */
function CheckboxOption({
  name,
  label,
  description,
  ...props
}: {
  name: string;
  label: string;
  description?: string;
} & Omit<React.ComponentProps<typeof Checkbox.Root>, "name">) {
  return (
    <Field.Item>
      <Field.Group direction="row">
        <Checkbox.Root name={name} aria-label={label} {...props} />
        <Field.Content>
          <Field.Label className="cursor-pointer">{label}</Field.Label>
          {description && <Field.Description>{description}</Field.Description>}
        </Field.Content>
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
        <Field.Label>Notifications</Field.Label>
        <Field.Description>Choose which notifications you want to receive.</Field.Description>
        <CheckboxGroup.Root defaultValue={["updates"]}>
          <CheckboxOption name="updates" label="Product updates" />
          <CheckboxOption name="marketing" label="Marketing emails" />
          <CheckboxOption
            name="security"
            label="Security alerts"
            description="Important alerts about your account security."
          />
        </CheckboxGroup.Root>
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
          <Field.Label>Preferences</Field.Label>
          <CheckboxGroup.Root defaultValue={["email"]}>
            <CheckboxOption name="email" label="Email notifications" />
            <CheckboxOption name="sms" label="SMS notifications" />
            <CheckboxOption name="push" label="Push notifications" />
          </CheckboxGroup.Root>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Valid</p>
        <Field.Root>
          <Field.Label>Preferences</Field.Label>
          <CheckboxGroup.Root defaultValue={["email", "sms"]}>
            <CheckboxOption name="email" label="Email notifications" defaultChecked valid />
            <CheckboxOption name="sms" label="SMS notifications" defaultChecked valid />
            <CheckboxOption name="push" label="Push notifications" />
          </CheckboxGroup.Root>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Error</p>
        <Field.Root invalid>
          <Field.Label>Preferences</Field.Label>
          <CheckboxGroup.Root>
            <CheckboxOption name="email" label="Email notifications" />
            <CheckboxOption name="sms" label="SMS notifications" />
            <CheckboxOption name="push" label="Push notifications" />
          </CheckboxGroup.Root>
          <Field.Error>Please select at least one notification method.</Field.Error>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Disabled</p>
        <Field.Root disabled>
          <Field.Label>Preferences</Field.Label>
          <CheckboxGroup.Root defaultValue={["email"]} disabled>
            <CheckboxOption name="email" label="Email notifications" defaultChecked disabled />
            <CheckboxOption name="sms" label="SMS notifications" disabled />
            <CheckboxOption name="push" label="Push notifications" disabled />
          </CheckboxGroup.Root>
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
              <Field.Label>Notifications</Field.Label>
              <CheckboxGroup.Root defaultValue={["updates"]}>
                <CheckboxOption name="updates" label="Product updates" />
                <CheckboxOption name="marketing" label="Marketing emails" />
                <CheckboxOption name="security" label="Security alerts" />
              </CheckboxGroup.Root>
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
            {/* Default */}
            <Field.Root>
              <Field.Label>Default</Field.Label>
              <CheckboxGroup.Root defaultValue={["a"]}>
                <CheckboxOption name="a" label="Option A" defaultChecked />
                <CheckboxOption name="b" label="Option B" />
              </CheckboxGroup.Root>
            </Field.Root>

            {/* Valid */}
            <Field.Root>
              <Field.Label>Valid</Field.Label>
              <CheckboxGroup.Root defaultValue={["a"]}>
                <CheckboxOption name="a" label="Option A" defaultChecked valid />
                <CheckboxOption name="b" label="Option B" />
              </CheckboxGroup.Root>
            </Field.Root>

            {/* Error */}
            <Field.Root invalid>
              <Field.Label>Error</Field.Label>
              <CheckboxGroup.Root>
                <CheckboxOption name="a" label="Option A" />
                <CheckboxOption name="b" label="Option B" />
              </CheckboxGroup.Root>
              <Field.Error>Select at least one.</Field.Error>
            </Field.Root>

            {/* Disabled */}
            <Field.Root disabled>
              <Field.Label>Disabled</Field.Label>
              <CheckboxGroup.Root defaultValue={["a"]} disabled>
                <CheckboxOption name="a" label="Option A" defaultChecked disabled />
                <CheckboxOption name="b" label="Option B" disabled />
              </CheckboxGroup.Root>
            </Field.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
