import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxGroup } from "./index";
import { Checkbox } from "../Checkbox/index";

const meta: Meta = {
  title: "Components/CheckboxGroup",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <CheckboxGroup defaultValue={["updates"]}>
      <span className="mb-1 text-sm font-medium text-neutral-900">Notifications</span>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="flex items-center gap-2">
        <Checkbox.Root name="updates">
          <Checkbox.Indicator />
        </Checkbox.Root>
        <span className="text-sm">Product updates</span>
      </label>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="flex items-center gap-2">
        <Checkbox.Root name="marketing">
          <Checkbox.Indicator />
        </Checkbox.Root>
        <span className="text-sm">Marketing emails</span>
      </label>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="flex items-center gap-2">
        <Checkbox.Root name="security">
          <Checkbox.Indicator />
        </Checkbox.Root>
        <span className="text-sm">Security alerts</span>
      </label>
    </CheckboxGroup>
  ),
};
