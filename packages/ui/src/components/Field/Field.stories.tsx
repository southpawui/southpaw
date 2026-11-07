import type { Meta, StoryObj } from "@storybook/react";
import { Field } from "./index";

const meta: Meta = {
  title: "Components/Field",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Email address</Field.Label>
      <Field.Control type="email" placeholder="you@example.com" />
      <Field.Description>We will never share your email.</Field.Description>
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Email address</Field.Label>
      <Field.Control type="email" placeholder="you@example.com" />
      <Field.Error>Please enter a valid email address.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root disabled>
      <Field.Label>Email address</Field.Label>
      <Field.Control
        type="email"
        placeholder="you@example.com"
        className="disabled:bg-neutral-50 disabled:text-neutral-400"
      />
      <Field.Description>This field is disabled.</Field.Description>
    </Field.Root>
  ),
};
