import type { Meta, StoryObj } from "@storybook/react";
import { Fieldset } from "./Fieldset";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";
import { Checkbox } from "../Checkbox/Checkbox";
import { CheckboxGroup } from "../CheckboxGroup/CheckboxGroup";

const meta: Meta = {
  title: "Components/Fieldset",
};

export default meta;
type Story = StoryObj;

/* ---- Helper: Address fields ---- */
function AddressFields() {
  return (
    <div className="mt-4 flex flex-col gap-4">
      <Field.Root>
        <Field.Label>Street address</Field.Label>
        <Input type="text" placeholder="123 Main St" />
      </Field.Root>
      <Field.Root>
        <Field.Label>City</Field.Label>
        <Input type="text" placeholder="London" />
      </Field.Root>
      <Field.Root>
        <Field.Label>Postcode</Field.Label>
        <Input purpose="postcode" placeholder="SW1A 1AA" />
      </Field.Root>
    </div>
  );
}

/* ---- Helper: Checkbox option ---- */
function CheckboxOption({ name, label }: { name: string; label: string }) {
  return (
    <Field.Item>
      <Field.Group direction="row">
        <Checkbox.Root name={name} aria-label={label} />
        <Field.Content>
          <Field.Label className="cursor-pointer">{label}</Field.Label>
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
    <div className="sm:max-w-lg">
      <Fieldset.Root>
        <Fieldset.Legend>Personal Information</Fieldset.Legend>
        <div className="mt-4 flex flex-col gap-4">
          <Field.Root>
            <Field.Label>First name</Field.Label>
            <Input type="text" placeholder="George" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Last name</Field.Label>
            <Input type="text" placeholder="Yiakoumi" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input purpose="email" placeholder="george@example.com" />
            <Field.Description>Your primary contact email.</Field.Description>
          </Field.Root>
        </div>
      </Fieldset.Root>
    </div>
  ),
};

/* ============================================================
 * WITH DESCRIPTION
 * ============================================================ */

export const WithDescription: Story = {
  render: () => (
    <div className="sm:max-w-lg">
      <Fieldset.Root>
        <Fieldset.Legend>Delivery Address</Fieldset.Legend>
        <Fieldset.Description>
          Enter the address where you want your order delivered.
        </Fieldset.Description>
        <AddressFields />
      </Fieldset.Root>
    </div>
  ),
};

/* ============================================================
 * WITH ERROR
 * ============================================================ */

export const WithError: Story = {
  render: () => (
    <div className="sm:max-w-lg">
      <Fieldset.Root>
        <Fieldset.Legend>Contact Preferences</Fieldset.Legend>
        <Fieldset.Description>Choose how you would like us to contact you.</Fieldset.Description>
        <div className="mt-4">
          <Field.Root>
            <CheckboxGroup.Root>
              <CheckboxOption name="email" label="Email" />
              <CheckboxOption name="phone" label="Phone" />
              <CheckboxOption name="post" label="Post" />
            </CheckboxGroup.Root>
          </Field.Root>
        </div>
        <Fieldset.Error>Please select at least one contact method.</Fieldset.Error>
      </Fieldset.Root>
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-lg">
      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Default</p>
        <Fieldset.Root>
          <Fieldset.Legend>Billing Address</Fieldset.Legend>
          <Fieldset.Description>Where should we send invoices?</Fieldset.Description>
          <AddressFields />
        </Fieldset.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Error</p>
        <Fieldset.Root>
          <Fieldset.Legend>Contact Preferences</Fieldset.Legend>
          <div className="mt-4">
            <Field.Root>
              <CheckboxGroup.Root>
                <CheckboxOption name="email" label="Email" />
                <CheckboxOption name="phone" label="Phone" />
              </CheckboxGroup.Root>
            </Field.Root>
          </div>
          <Fieldset.Error>Select at least one contact method.</Fieldset.Error>
        </Fieldset.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
          Multiple errors
        </p>
        <Fieldset.Root>
          <Fieldset.Legend>Payment Details</Fieldset.Legend>
          <div className="mt-4 flex flex-col gap-4">
            <Field.Root>
              <Field.Label>Card number</Field.Label>
              <Input type="text" placeholder="1234 5678 9012 3456" />
            </Field.Root>
          </div>
          <Fieldset.Error errors={["Card number is required.", "Expiry date is required."]} />
        </Fieldset.Root>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">Disabled</p>
        <Fieldset.Root disabled>
          <Fieldset.Legend>Shipping Address</Fieldset.Legend>
          <Fieldset.Description>Same as billing address.</Fieldset.Description>
          <AddressFields />
        </Fieldset.Root>
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
          <div className="sm:max-w-lg">
            <Fieldset.Root>
              <Fieldset.Legend>Personal Info</Fieldset.Legend>
              <Fieldset.Description>Basic details.</Fieldset.Description>
              <div className="mt-4 flex flex-col gap-4">
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input type="text" placeholder="George Yiakoumi" />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Input purpose="email" placeholder="george@example.com" />
                </Field.Root>
              </div>
            </Fieldset.Root>
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
          <div className="flex flex-col gap-6 sm:max-w-lg">
            {/* Default */}
            <Fieldset.Root>
              <Fieldset.Legend>Default</Fieldset.Legend>
              <Fieldset.Description>A standard fieldset.</Fieldset.Description>
              <div className="mt-4 flex flex-col gap-4">
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input type="text" placeholder="George" />
                </Field.Root>
              </div>
            </Fieldset.Root>

            {/* Error */}
            <Fieldset.Root>
              <Fieldset.Legend>Error</Fieldset.Legend>
              <div className="mt-4">
                <Field.Root>
                  <CheckboxGroup.Root>
                    <CheckboxOption name="a" label="Option A" />
                    <CheckboxOption name="b" label="Option B" />
                  </CheckboxGroup.Root>
                </Field.Root>
              </div>
              <Fieldset.Error>Select at least one option.</Fieldset.Error>
            </Fieldset.Root>

            {/* Disabled */}
            <Fieldset.Root disabled>
              <Fieldset.Legend>Disabled</Fieldset.Legend>
              <div className="mt-4 flex flex-col gap-4">
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input type="text" placeholder="George" />
                </Field.Root>
              </div>
            </Fieldset.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
