import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./index";
import { RadioGroup } from "../RadioGroup/index";

const meta: Meta = {
  title: "Components/Radio",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <RadioGroup defaultValue="a">
      <div className="flex flex-col gap-3">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 text-sm">
          <Radio.Root value="a">
            <Radio.Indicator />
          </Radio.Root>
          Option A
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 text-sm">
          <Radio.Root value="b">
            <Radio.Indicator />
          </Radio.Root>
          Option B
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 text-sm">
          <Radio.Root value="c">
            <Radio.Indicator />
          </Radio.Root>
          Option C
        </label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <RadioGroup defaultValue="a" disabled>
      <div className="flex flex-col gap-3">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 text-sm opacity-50">
          <Radio.Root value="a">
            <Radio.Indicator />
          </Radio.Root>
          Disabled selected
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="flex items-center gap-2 text-sm opacity-50">
          <Radio.Root value="b">
            <Radio.Indicator />
          </Radio.Root>
          Disabled unselected
        </label>
      </div>
    </RadioGroup>
  ),
};
