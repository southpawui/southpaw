import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./index";
import { Field } from "../Field";

const meta: Meta = {
  title: "Components/Checkbox",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Field.Root>
      <div className="flex items-center gap-2">
        <Checkbox.Root>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Field.Label className="cursor-pointer">Accept terms and conditions</Field.Label>
      </div>
    </Field.Root>
  ),
};

export const Checked: Story = {
  render: () => (
    <Field.Root>
      <div className="flex items-center gap-2">
        <Checkbox.Root defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Field.Label className="cursor-pointer">Email notifications</Field.Label>
      </div>
    </Field.Root>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <Field.Root>
      <div className="flex items-center gap-2">
        <Checkbox.Root indeterminate>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Field.Label className="cursor-pointer">Select all</Field.Label>
      </div>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root disabled>
      <div className="flex items-center gap-2">
        <Checkbox.Root defaultChecked>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Field.Label>Mandatory agreement (cannot be changed)</Field.Label>
      </div>
      <Field.Description>This was agreed during onboarding.</Field.Description>
    </Field.Root>
  ),
};

export const WithError: Story = {
  render: () => (
    <Field.Root invalid>
      <div className="flex items-center gap-2">
        <Checkbox.Root>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Field.Label className="cursor-pointer">I agree to the privacy policy</Field.Label>
      </div>
      <Field.Error>You must agree to continue.</Field.Error>
    </Field.Root>
  ),
};
