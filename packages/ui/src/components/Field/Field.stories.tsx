import type { Meta, StoryObj } from "@storybook/react";
import { Field } from "./Field";

const meta: Meta = {
  title: "Components/Field",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Field.Root className="w-80">
      <Field.Label>Email address</Field.Label>
      <Field.Control type="email" placeholder="you@example.com" />
      <Field.Description>We will never share your email.</Field.Description>
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root className="w-80" invalid>
      <Field.Label>Email address</Field.Label>
      <Field.Control type="email" defaultValue="not-an-email" />
      <Field.Error>Please enter a valid email address.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root className="w-80" disabled>
      <Field.Label>Email address</Field.Label>
      <Field.Control type="email" placeholder="you@example.com" />
      <Field.Description>This field is managed by your organisation.</Field.Description>
    </Field.Root>
  ),
};

export const Required: Story = {
  render: () => (
    <Field.Root className="w-80">
      <Field.Label>
        Full name <span className="text-danger">*</span>
      </Field.Label>
      <Field.Control type="text" placeholder="Jane Smith" required />
      <Field.Description>As it appears on your ID.</Field.Description>
    </Field.Root>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Field.Root className="w-80">
        <Field.Label>Default</Field.Label>
        <Field.Control type="text" placeholder="Default state" />
        <Field.Description>Hint text goes here.</Field.Description>
      </Field.Root>

      <Field.Root className="w-80" invalid>
        <Field.Label>Error</Field.Label>
        <Field.Control type="text" defaultValue="Bad input" />
        <Field.Error>This field has an error.</Field.Error>
      </Field.Root>

      <Field.Root className="w-80" disabled>
        <Field.Label>Disabled</Field.Label>
        <Field.Control type="text" placeholder="Cannot edit" />
        <Field.Description>Managed by your organisation.</Field.Description>
      </Field.Root>
    </div>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div data-theme="light" className="bg-surface-base rounded-lg p-6">
        <p className="text-fg-muted mb-3 text-sm">Light</p>
        <Field.Root className="w-80" invalid>
          <Field.Label>Email</Field.Label>
          <Field.Control type="email" defaultValue="bad" />
          <Field.Error>Invalid email.</Field.Error>
        </Field.Root>
      </div>
      <div data-theme="dark" className="bg-surface-base rounded-lg p-6">
        <p className="text-fg-muted mb-3 text-sm">Dark</p>
        <Field.Root className="w-80" invalid>
          <Field.Label>Email</Field.Label>
          <Field.Control type="email" defaultValue="bad" />
          <Field.Error>Invalid email.</Field.Error>
        </Field.Root>
      </div>
      <div data-theme="high-contrast" className="bg-surface-base rounded-lg p-6">
        <p className="text-fg-muted mb-3 text-sm">High Contrast</p>
        <Field.Root className="w-80" invalid>
          <Field.Label>Email</Field.Label>
          <Field.Control type="email" defaultValue="bad" />
          <Field.Error>Invalid email.</Field.Error>
        </Field.Root>
      </div>
    </div>
  ),
};
