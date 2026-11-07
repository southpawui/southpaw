import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "./index";
import { Radio } from "../Radio/index";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <RadioGroup defaultValue="email">
      <div className="flex flex-col gap-3">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 text-sm">
          <Radio.Root value="email">
            <Radio.Indicator />
          </Radio.Root>
          Email notifications
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 text-sm">
          <Radio.Root value="sms">
            <Radio.Indicator />
          </Radio.Root>
          SMS notifications
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 text-sm">
          <Radio.Root value="push">
            <Radio.Indicator />
          </Radio.Root>
          Push notifications
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 text-sm">
          <Radio.Root value="none">
            <Radio.Indicator />
          </Radio.Root>
          No notifications
        </label>
      </div>
    </RadioGroup>
  ),
};
