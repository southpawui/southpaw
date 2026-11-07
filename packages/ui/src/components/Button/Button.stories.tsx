import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "brand", "outline", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: { children: "Solid Button", variant: "solid" },
};

export const Brand: Story = {
  args: { children: "Get Started", variant: "brand" },
};

export const Outline: Story = {
  args: { children: "Outline Button", variant: "outline" },
};

export const Ghost: Story = {
  args: { children: "Ghost Button", variant: "ghost" },
};

export const Danger: Story = {
  args: { children: "Delete Account", variant: "danger" },
};

export const Small: Story = {
  args: { children: "Small", size: "sm", variant: "solid" },
};

export const Large: Story = {
  args: { children: "Large", size: "lg", variant: "solid" },
};

export const Disabled: Story = {
  args: { children: "Disabled", disabled: true, variant: "solid" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="solid">Solid</Button>
      <Button variant="brand">Brand CTA</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const DensityComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div data-density="compact">
        <p className="text-fg-muted mb-2 text-sm">Compact</p>
        <div className="flex items-center gap-3">
          <Button variant="brand" size="sm">
            Small
          </Button>
          <Button variant="brand" size="md">
            Medium
          </Button>
          <Button variant="brand" size="lg">
            Large
          </Button>
        </div>
      </div>
      <div data-density="default">
        <p className="text-fg-muted mb-2 text-sm">Default</p>
        <div className="flex items-center gap-3">
          <Button variant="brand" size="sm">
            Small
          </Button>
          <Button variant="brand" size="md">
            Medium
          </Button>
          <Button variant="brand" size="lg">
            Large
          </Button>
        </div>
      </div>
      <div data-density="comfortable">
        <p className="text-fg-muted mb-2 text-sm">Comfortable</p>
        <div className="flex items-center gap-3">
          <Button variant="brand" size="sm">
            Small
          </Button>
          <Button variant="brand" size="md">
            Medium
          </Button>
          <Button variant="brand" size="lg">
            Large
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div data-theme="light" className="bg-surface-base rounded-lg p-6">
        <p className="text-fg-muted mb-3 text-sm">Light</p>
        <div className="flex items-center gap-3">
          <Button variant="solid">Solid</Button>
          <Button variant="brand">Brand</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>
      <div data-theme="dark" className="bg-surface-base rounded-lg p-6">
        <p className="text-fg-muted mb-3 text-sm">Dark</p>
        <div className="flex items-center gap-3">
          <Button variant="solid">Solid</Button>
          <Button variant="brand">Brand</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>
      <div data-theme="high-contrast" className="bg-surface-base rounded-lg p-6">
        <p className="text-fg-muted mb-3 text-sm">High Contrast</p>
        <div className="flex items-center gap-3">
          <Button variant="solid">Solid</Button>
          <Button variant="brand">Brand</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>
    </div>
  ),
};
