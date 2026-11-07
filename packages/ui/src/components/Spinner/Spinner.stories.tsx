import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;

export const Default: StoryObj<typeof Spinner> = {};

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const InText: StoryObj = {
  render: () => (
    <p className="text-fg-default flex items-center gap-2 text-sm">
      <Spinner /> Loading data...
    </p>
  ),
};

export const Colors: StoryObj = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="md" className="text-fg-default" />
      <Spinner size="md" className="text-brand" />
      <Spinner size="md" className="text-danger" />
      <Spinner size="md" className="text-fg-muted" />
    </div>
  ),
};
