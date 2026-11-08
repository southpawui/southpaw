import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/Checkbox",
};

export default meta;
type Story = StoryObj;

/* ---- Helper for checkbox + label row ---- */
function CheckboxField({
  label,
  description,
  ...props
}: { label: string; description?: string } & React.ComponentProps<typeof Checkbox.Root>) {
  return (
    <Field.Root>
      <Field.Group direction="row">
        <Checkbox.Root {...props} />
        <Field.Content>
          <Field.Label className="cursor-pointer">{label}</Field.Label>
          {description && <Field.Description>{description}</Field.Description>}
        </Field.Content>
      </Field.Group>
    </Field.Root>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4 sm:max-w-md">
      <CheckboxField label="Accept terms and conditions" />
      <CheckboxField label="Email notifications" defaultChecked />
      <CheckboxField
        label="Marketing emails"
        description="Receive occasional updates about new features and offers."
      />
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
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Unchecked</p>
        <CheckboxField label="I agree to the privacy policy" />
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Checked</p>
        <CheckboxField label="Email notifications" defaultChecked />
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Indeterminate
        </p>
        <CheckboxField label="Select all" indeterminate />
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Valid</p>
        <CheckboxField label="Terms accepted" defaultChecked valid />
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Error</p>
        <Field.Root invalid>
          <Field.Group direction="row">
            <Checkbox.Root />
            <Field.Content>
              <Field.Label className="cursor-pointer">I agree to the privacy policy</Field.Label>
              <Field.Error>You must agree to continue.</Field.Error>
            </Field.Content>
          </Field.Group>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Disabled</p>
        <CheckboxField label="Mandatory agreement (cannot be changed)" defaultChecked disabled />
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Disabled unchecked
        </p>
        <CheckboxField label="Optional feature" disabled />
      </div>
    </div>
  ),
};

/* ============================================================
 * INDETERMINATE — parent/child pattern
 * ============================================================ */

function IndeterminateDemo() {
  const [children, setChildren] = useState([true, false, true]);

  const allChecked = children.every(Boolean);
  const someChecked = children.some(Boolean) && !allChecked;

  return (
    <div className="flex flex-col gap-2 sm:max-w-md">
      <Field.Root>
        <Field.Group direction="row">
          <Checkbox.Root
            checked={allChecked}
            indeterminate={someChecked}
            onCheckedChange={(checked) => setChildren([!!checked, !!checked, !!checked])}
          />
          <Field.Label className="cursor-pointer">Select all notifications</Field.Label>
        </Field.Group>
      </Field.Root>
      <div className="ml-6 flex flex-col gap-2">
        {["Email notifications", "Push notifications", "SMS notifications"].map((label, i) => (
          <Field.Root key={label}>
            <Field.Group direction="row">
              <Checkbox.Root
                checked={children[i]}
                onCheckedChange={(checked: boolean) => {
                  const next = [...children];
                  next[i] = !!checked;
                  setChildren(next);
                }}
              />
              <Field.Label className="cursor-pointer">{label}</Field.Label>
            </Field.Group>
          </Field.Root>
        ))}
      </div>
    </div>
  );
}

export const IndeterminatePattern: Story = {
  render: () => <IndeterminateDemo />,
};

/* ============================================================
 * WITH FIELD — composition with Field system
 * ============================================================ */

export const WithField: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <Field.Root>
        <Field.Group direction="row">
          <Checkbox.Root />
          <Field.Content>
            <Field.Label className="cursor-pointer">I accept the terms of service</Field.Label>
            <Field.Description>
              By checking this box you agree to our terms and privacy policy.
            </Field.Description>
          </Field.Content>
        </Field.Group>
      </Field.Root>

      <Field.Root invalid>
        <Field.Group direction="row">
          <Checkbox.Root />
          <Field.Content>
            <Field.Label className="cursor-pointer">I consent to data processing</Field.Label>
            <Field.Error>Consent is required to proceed.</Field.Error>
          </Field.Content>
        </Field.Group>
      </Field.Root>
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
          <div className="flex flex-col gap-3 sm:max-w-md">
            <CheckboxField label="Email notifications" />
            <CheckboxField label="Push notifications" defaultChecked />
            <CheckboxField
              label="SMS notifications"
              description="Standard messaging rates may apply."
            />
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
          <div className="flex flex-col gap-3 sm:max-w-md">
            <CheckboxField label="Unchecked" />
            <CheckboxField label="Checked" defaultChecked />
            <CheckboxField label="Indeterminate" indeterminate />
            <CheckboxField label="Valid" defaultChecked valid />
            <Field.Root invalid>
              <Field.Group direction="row">
                <Checkbox.Root />
                <Field.Content>
                  <Field.Label className="cursor-pointer">Error</Field.Label>
                </Field.Content>
              </Field.Group>
            </Field.Root>
            <CheckboxField label="Disabled" defaultChecked disabled />
          </div>
        </div>
      ))}
    </div>
  ),
};
