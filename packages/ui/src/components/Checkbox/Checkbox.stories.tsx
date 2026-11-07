import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./index";

const meta: Meta = {
  title: "Components/Checkbox",
};

export default meta;
type Story = StoryObj;

export const Unchecked: Story = {
  render: () => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className="flex items-center gap-2">
      <Checkbox.Root defaultChecked={false}>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <span className="text-sm">Unchecked</span>
    </label>
  ),
};

export const Checked: Story = {
  render: () => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className="flex items-center gap-2">
      <Checkbox.Root defaultChecked>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <span className="text-sm">Checked</span>
    </label>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className="flex items-center gap-2">
      <Checkbox.Root checked="mixed">
        <Checkbox.Indicator>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span className="text-sm">Indeterminate</span>
    </label>
  ),
};

export const Disabled: Story = {
  render: () => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className="flex items-center gap-2">
      <Checkbox.Root disabled defaultChecked>
        <Checkbox.Indicator />
      </Checkbox.Root>
      <span className="text-sm text-neutral-400">Disabled</span>
    </label>
  ),
};
