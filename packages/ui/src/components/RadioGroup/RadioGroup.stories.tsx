import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "./RadioGroup";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/RadioGroup",
};

export default meta;
type Story = StoryObj;

/* ---- Helper ---- */
function RadioOption({ value, label }: { value: string; label: string }) {
  return (
    <Field.Item>
      <Field.Group direction="row">
        <RadioGroup.Item value={value} aria-label={label} />
        <span className="text-fg-default cursor-pointer text-sm">{label}</span>
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
        <RadioGroup.Root defaultValue="email">
          <RadioOption value="email" label="Email" />
          <RadioOption value="sms" label="SMS" />
          <RadioOption value="push" label="Push notification" />
          <RadioOption value="none" label="None" />
        </RadioGroup.Root>
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
          <RadioGroup.Root defaultValue="free">
            <RadioOption value="free" label="Free" />
            <RadioOption value="pro" label="Pro" />
          </RadioGroup.Root>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Valid</p>
        <Field.Root>
          <Field.Label>Plan</Field.Label>
          <RadioGroup.Root defaultValue="pro">
            <Field.Item>
              <Field.Group direction="row">
                <RadioGroup.Item value="free" aria-label="Free" valid />
                <span className="text-fg-default cursor-pointer text-sm">Free</span>
              </Field.Group>
            </Field.Item>
            <Field.Item>
              <Field.Group direction="row">
                <RadioGroup.Item value="pro" aria-label="Pro" valid />
                <span className="text-fg-default cursor-pointer text-sm">Pro</span>
              </Field.Group>
            </Field.Item>
          </RadioGroup.Root>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          With description
        </p>
        <Field.Root>
          <Field.Label>Plan</Field.Label>
          <RadioGroup.Root defaultValue="pro">
            <RadioOption value="free" label="Free" />
            <RadioOption value="pro" label="Pro" />
          </RadioGroup.Root>
          <Field.Description>Choose the plan that best fits your needs.</Field.Description>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Error</p>
        <Field.Root invalid>
          <Field.Label>Plan</Field.Label>
          <RadioGroup.Root>
            <RadioOption value="free" label="Free" />
            <RadioOption value="pro" label="Pro" />
          </RadioGroup.Root>
          <Field.Error>Please select a plan.</Field.Error>
        </Field.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Disabled</p>
        <Field.Root disabled>
          <Field.Label>Plan</Field.Label>
          <RadioGroup.Root defaultValue="pro">
            <RadioOption value="free" label="Free" />
            <RadioOption value="pro" label="Pro (current)" />
          </RadioGroup.Root>
          <Field.Description>Contact support to change your plan.</Field.Description>
        </Field.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * CHOICE CARDS
 * ============================================================ */

function ChoiceCard({
  value,
  title,
  description,
  price,
}: {
  value: string;
  title: string;
  description: string;
  price: string;
}) {
  return (
    <Field.Item
      render={
        // eslint-disable-next-line jsx-a11y/label-has-associated-control -- Field.Item wires the association at runtime via Base UI
        <label
          className={
            "border-border-control flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 " +
            "transition-[border-color,background-color] duration-[var(--sp-duration-fast)] ease-[var(--sp-easing-default)]" +
            "hover:border-fg-muted" +
            "has-[[data-checked]]:border-accent has-[[data-checked]]:bg-accent/5"
          }
        />
      }
    >
      <RadioGroup.Item value={value} className="mt-0.5" />
      <span className="flex flex-1 flex-col gap-1">
        <span className="text-fg-default text-sm font-medium">{title}</span>
        <span className="text-fg-muted text-sm">{description}</span>
      </span>
      <span className="text-fg-default text-sm font-semibold">{price}</span>
    </Field.Item>
  );
}

export const ChoiceCards: Story = {
  render: () => (
    <div className="sm:max-w-lg">
      <Field.Root>
        <Field.Label>Select a plan</Field.Label>
        <RadioGroup.Root defaultValue="pro">
          <ChoiceCard
            value="free"
            title="Free"
            description="For personal projects and small teams."
            price="$0/mo"
          />
          <ChoiceCard
            value="pro"
            title="Pro"
            description="For growing teams with advanced needs."
            price="$19/mo"
          />
          <ChoiceCard
            value="enterprise"
            title="Enterprise"
            description="Custom solutions for large organisations."
            price="Custom"
          />
        </RadioGroup.Root>
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
          <div className="sm:max-w-md">
            <Field.Root>
              <Field.Label>Notification preference</Field.Label>
              <RadioGroup.Root defaultValue="email">
                <RadioOption value="email" label="Email" />
                <RadioOption value="sms" label="SMS" />
                <RadioOption value="push" label="Push notification" />
              </RadioGroup.Root>
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
              <RadioGroup.Root defaultValue="pro">
                <RadioOption value="free" label="Free" />
                <RadioOption value="pro" label="Pro" />
              </RadioGroup.Root>
            </Field.Root>
            <Field.Root>
              <Field.Label>Valid</Field.Label>
              <RadioGroup.Root defaultValue="pro">
                <Field.Item>
                  <Field.Group direction="row">
                    <RadioGroup.Item value="free" aria-label="Free" valid />
                    <span className="text-fg-default cursor-pointer text-sm">Free</span>
                  </Field.Group>
                </Field.Item>
                <Field.Item>
                  <Field.Group direction="row">
                    <RadioGroup.Item value="pro" aria-label="Pro" valid />
                    <span className="text-fg-default cursor-pointer text-sm">Pro</span>
                  </Field.Group>
                </Field.Item>
              </RadioGroup.Root>
            </Field.Root>
            <Field.Root invalid>
              <Field.Label>Error</Field.Label>
              <RadioGroup.Root>
                <RadioOption value="free" label="Free" />
                <RadioOption value="pro" label="Pro" />
              </RadioGroup.Root>
            </Field.Root>
            <Field.Root disabled>
              <Field.Label>Disabled</Field.Label>
              <RadioGroup.Root defaultValue="pro">
                <RadioOption value="free" label="Free" />
                <RadioOption value="pro" label="Pro" />
              </RadioGroup.Root>
            </Field.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
