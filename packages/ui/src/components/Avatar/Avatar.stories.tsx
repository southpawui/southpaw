import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./index";

const meta: Meta = {
  title: "Components/Avatar",
};

export default meta;
type Story = StoryObj;

export const WithImage: Story = {
  render: () => (
    <Avatar.Root>
      <Avatar.Image src="https://i.pravatar.cc/150?u=southpaw" alt="User avatar" />
      <Avatar.Fallback>SP</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const WithFallback: Story = {
  render: () => (
    <Avatar.Root>
      <Avatar.Image src="" alt="" />
      <Avatar.Fallback>GY</Avatar.Fallback>
    </Avatar.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar.Root size="sm">
        <Avatar.Image src="" alt="" />
        <Avatar.Fallback>S</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="md">
        <Avatar.Image src="" alt="" />
        <Avatar.Fallback>M</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="lg">
        <Avatar.Image src="" alt="" />
        <Avatar.Fallback>L</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
};
