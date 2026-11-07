import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./index";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
    placeholder: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "Enter text..." },
};

export const Small: Story = {
  args: { placeholder: "Small input", size: "sm" },
};

export const Medium: Story = {
  args: { placeholder: "Medium input", size: "md" },
};

export const Large: Story = {
  args: { placeholder: "Large input", size: "lg" },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled input", disabled: true },
};

export const WithValue: Story = {
  args: { defaultValue: "Hello, world!", "aria-label": "Example input" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};
