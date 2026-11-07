import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "./RadioGroup";
import { Radio } from "../Radio/Radio";
import { Field } from "../Field/Field";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
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
            <span className="text-fg-default text-sm">Push</span>
          </div>
        </Field.Item>
        <Field.Item>
          <div className="flex items-center gap-2">
            <Radio.Root value="none">
              <Radio.Indicator />
            </Radio.Root>
            <span className="text-fg-default text-sm">None</span>
          </div>
        </Field.Item>
      </RadioGroup>
    </Field.Root>
  ),
};
