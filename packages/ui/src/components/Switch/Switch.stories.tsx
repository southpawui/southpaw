import type { Meta, StoryObj } from "@storybook/react";
import { Check, X, Sun, Moon } from "@phosphor-icons/react";
import { Switch } from "./Switch";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/Switch",
};

export default meta;
type Story = StoryObj;

/* ---- Helper ---- */
function SwitchField({
  label,
  description,
  ...props
}: { label: string; description?: string } & React.ComponentProps<typeof Switch.Root>) {
  return (
    <Field.Root>
      <Field.Group direction="row">
        <Switch.Root aria-label={label} {...props} />
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
      <SwitchField label="Dark mode" />
      <SwitchField label="Notifications" defaultChecked />
      <SwitchField
        label="Marketing emails"
        description="Receive occasional updates about new features."
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
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Off</p>
        <SwitchField label="Dark mode" />
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">On</p>
        <SwitchField label="Notifications" defaultChecked />
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Valid</p>
        <SwitchField label="Email verified" defaultChecked valid />
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Error</p>
        <Field.Root invalid>
          <Field.Group direction="row">
            <Switch.Root aria-label="Accept terms" />
            <Field.Content>
              <Field.Label className="cursor-pointer">Accept terms</Field.Label>
              <Field.Error>You must accept to continue.</Field.Error>
            </Field.Content>
          </Field.Group>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Disabled on
        </p>
        <SwitchField label="Two-factor authentication" defaultChecked disabled />
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Disabled off
        </p>
        <SwitchField label="Beta features" disabled />
      </div>
    </div>
  ),
};

/* ============================================================
 * WITH LABELS (On/Off text inside track)
 * ============================================================ */

export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-4 sm:max-w-md">
      <SwitchField label="Dark mode" onLabel="On" offLabel="Off" />
      <SwitchField label="Notifications" onLabel="Yes" offLabel="No" defaultChecked />
      <SwitchField
        label="Marketing emails"
        description="Receive occasional updates about new features."
        onLabel="On"
        offLabel="Off"
      />
    </div>
  ),
};

/* ============================================================
 * WITH ICONS (inside thumb)
 * ============================================================ */

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 sm:max-w-md">
      <SwitchField
        label="Notifications"
        checkedIcon={<Check weight="bold" />}
        uncheckedIcon={<X weight="bold" />}
        defaultChecked
      />
      <SwitchField
        label="Dark mode"
        checkedIcon={<Moon weight="bold" />}
        uncheckedIcon={<Sun weight="bold" />}
      />
      <SwitchField
        label="Airplane mode"
        checkedIcon={<Check weight="bold" />}
        uncheckedIcon={<X weight="bold" />}
      />
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
            <SwitchField label="Dark mode" />
            <SwitchField label="Notifications" defaultChecked />
            <SwitchField label="Marketing emails" description="Receive occasional updates." />
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
            <SwitchField label="Off" />
            <SwitchField label="On" defaultChecked />
            <SwitchField label="Valid" defaultChecked valid />
            <Field.Root invalid>
              <Field.Group direction="row">
                <Switch.Root aria-label="Error" />
                <Field.Label className="cursor-pointer">Error</Field.Label>
              </Field.Group>
            </Field.Root>
            <SwitchField label="Disabled" defaultChecked disabled />
          </div>
        </div>
      ))}
    </div>
  ),
};
