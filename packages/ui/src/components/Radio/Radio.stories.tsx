import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./index";
import { RadioGroup } from "../RadioGroup/index";
import { Field } from "../Field";

const meta: Meta = {
  title: "Components/Radio",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Field.Root>
      <Field.Label>Notification preference</Field.Label>
      <RadioGroup defaultValue="email">
        <Field.Item>
          <div className="flex items-center gap-2">
            <Radio.Root value="email">
              <Radio.Indicator />
            </Radio.Root>
            <span className="text-fg-default text-sm">Email</span>
          </div>
        </Field.Item>
        <Field.Item>
          <div className="flex items-center gap-2">
            <Radio.Root value="sms">
              <Radio.Indicator />
            </Radio.Root>
            <span className="text-fg-default text-sm">SMS</span>
          </div>
        </Field.Item>
        <Field.Item>
          <div className="flex items-center gap-2">
            <Radio.Root value="push">
              <Radio.Indicator />
            </Radio.Root>
            <span className="text-fg-default text-sm">Push notification</span>
          </div>
        </Field.Item>
      </RadioGroup>
    </Field.Root>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <Field.Root disabled>
      <Field.Label>Plan</Field.Label>
      <RadioGroup defaultValue="pro">
        <Field.Item>
          <div className="flex items-center gap-2">
            <Radio.Root value="pro">
              <Radio.Indicator />
            </Radio.Root>
            <span className="text-fg-default text-sm">Pro (current)</span>
          </div>
        </Field.Item>
        <Field.Item>
          <div className="flex items-center gap-2">
            <Radio.Root value="enterprise">
              <Radio.Indicator />
            </Radio.Root>
            <span className="text-fg-default text-sm">Enterprise</span>
          </div>
        </Field.Item>
      </RadioGroup>
      <Field.Description>Contact support to change your plan.</Field.Description>
    </Field.Root>
  ),
};
