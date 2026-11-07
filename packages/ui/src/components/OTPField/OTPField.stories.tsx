import type { Meta, StoryObj } from "@storybook/react";
import { OTPField } from "./OTPField";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/OTPField",
};

export default meta;
type Story = StoryObj;

export const SixDigit: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Verification code</Field.Label>
      <OTPField.Root length={6}>
        <OTPField.Input />
        <OTPField.Input />
        <OTPField.Input />
        <OTPField.Separator />
        <OTPField.Input />
        <OTPField.Input />
        <OTPField.Input />
      </OTPField.Root>
    </Field.Root>
  ),
};

export const FourDigit: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>PIN code</Field.Label>
      <OTPField.Root length={4}>
        <OTPField.Input />
        <OTPField.Input />
        <OTPField.Input />
        <OTPField.Input />
      </OTPField.Root>
    </Field.Root>
  ),
};

export const WithSeparators: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Two-factor code</Field.Label>
      <OTPField.Root length={6}>
        <OTPField.Input />
        <OTPField.Input />
        <OTPField.Separator />
        <OTPField.Input />
        <OTPField.Input />
        <OTPField.Separator />
        <OTPField.Input />
        <OTPField.Input />
      </OTPField.Root>
    </Field.Root>
  ),
};
