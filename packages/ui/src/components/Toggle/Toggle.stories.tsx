import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./index";

const meta: Meta<typeof Toggle> = {
  title: "Components/Toggle",
  component: Toggle,
};

export default meta;

export const Default: StoryObj = {
  render: () => <Toggle aria-label="Toggle bold">B</Toggle>,
};

export const DefaultPressed: StoryObj = {
  render: () => (
    <Toggle defaultPressed aria-label="Toggle bold">
      B
    </Toggle>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <Toggle disabled aria-label="Toggle bold">
      B
    </Toggle>
  ),
};
