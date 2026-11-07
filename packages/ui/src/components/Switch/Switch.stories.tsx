import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./index";

const meta: Meta = {
  title: "Components/Switch",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Switch.Root aria-label="Toggle feature">
      <Switch.Thumb />
    </Switch.Root>
  ),
};

export const DefaultChecked: StoryObj = {
  render: () => (
    <Switch.Root defaultChecked aria-label="Toggle feature">
      <Switch.Thumb />
    </Switch.Root>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch.Root disabled aria-label="Disabled off">
        <Switch.Thumb />
      </Switch.Root>
      <Switch.Root disabled defaultChecked aria-label="Disabled on">
        <Switch.Thumb />
      </Switch.Root>
    </div>
  ),
};

export const WithLabel: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch.Root id="airplane-mode" aria-label="Airplane mode">
        <Switch.Thumb />
      </Switch.Root>
      <label htmlFor="airplane-mode" className="text-sm font-medium">
        Airplane mode
      </label>
    </div>
  ),
};
