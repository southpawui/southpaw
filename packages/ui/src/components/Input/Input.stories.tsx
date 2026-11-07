import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./index";
import { Field } from "../Field";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text...", "aria-label": "Example input" },
};

export const WithField: Story = {
  render: () => (
    <Field.Root className="w-80">
      <Field.Label>Email address</Field.Label>
      <Input type="email" placeholder="you@example.com" />
      <Field.Description>We will never share your email.</Field.Description>
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root className="w-80" invalid>
      <Field.Label>Email address</Field.Label>
      <Input type="email" defaultValue="not-an-email" />
      <Field.Error>Please enter a valid email address.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root className="w-80" disabled>
      <Field.Label>Email address</Field.Label>
      <Input type="email" placeholder="you@example.com" />
      <Field.Description>Managed by your organisation.</Field.Description>
    </Field.Root>
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Field.Root className="w-80">
      <Field.Label>Account ID</Field.Label>
      <Input type="text" defaultValue="usr_a1b2c3d4" readOnly />
    </Field.Root>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input size="sm" placeholder="Small" aria-label="Small input" />
      <Input size="md" placeholder="Medium" aria-label="Medium input" />
      <Input size="lg" placeholder="Large" aria-label="Large input" />
    </div>
  ),
};

export const DensityComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div data-density="compact">
        <p className="text-fg-muted mb-2 text-sm">Compact</p>
        <Input placeholder="Compact input" aria-label="Compact input" />
      </div>
      <div data-density="default">
        <p className="text-fg-muted mb-2 text-sm">Default</p>
        <Input placeholder="Default input" aria-label="Default input" />
      </div>
      <div data-density="comfortable">
        <p className="text-fg-muted mb-2 text-sm">Comfortable</p>
        <Input placeholder="Comfortable input" aria-label="Comfortable input" />
      </div>
    </div>
  ),
};
