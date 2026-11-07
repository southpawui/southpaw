import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./Separator";

const meta: Meta<typeof Separator> = {
  title: "Components/Separator",
  component: Separator,
};

export default meta;

export const Horizontal: StoryObj = {
  render: () => (
    <div className="w-80">
      <p className="text-sm text-neutral-700">Above the separator</p>
      <Separator className="my-4" />
      <p className="text-sm text-neutral-700">Below the separator</p>
    </div>
  ),
};

export const Vertical: StoryObj = {
  render: () => (
    <div className="flex h-10 items-center gap-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
};
