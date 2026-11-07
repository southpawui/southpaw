import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/Card",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Card.Root className="w-96">
      <Card.Header>
        <Card.Title>Project settings</Card.Title>
        <Card.Description>Manage your project configuration.</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="text-fg-default text-sm">
          Your project is currently on the <strong>Pro</strong> plan.
        </p>
      </Card.Content>
      <Card.Footer className="justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button variant="solid">Save</Button>
      </Card.Footer>
    </Card.Root>
  ),
};

export const Simple: StoryObj = {
  render: () => (
    <Card.Root className="w-96">
      <Card.Content>
        <p className="text-fg-default text-sm">A simple card with just content.</p>
      </Card.Content>
    </Card.Root>
  ),
};

export const NestedRadius: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide">
          Default card (24px padding, 14px radius — button uses its own radius)
        </p>
        <Card.Root className="w-96">
          <Card.Content className="flex flex-col gap-3">
            <Button color="brand" className="w-full">
              Default radius (10px)
            </Button>
            <Button variant="outline" className="w-full">
              Default radius (10px)
            </Button>
          </Card.Content>
        </Card.Root>
      </div>
      <div>
        <p className="text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide">
          Tight container (8px padding, 14px radius — concentric curves)
        </p>
        <div className="border-border-default bg-surface-raised w-96 rounded-[var(--radius-lg)] border p-2 shadow-sm [--sp-nested-radius:6px]">
          <div className="flex flex-col gap-2">
            <Button color="brand" className="w-full">
              Nested radius (6px)
            </Button>
            <Button variant="outline" className="w-full">
              Nested radius (6px)
            </Button>
          </div>
        </div>
      </div>
      <div>
        <p className="text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide">
          Standalone (no container)
        </p>
        <div className="flex gap-3">
          <Button color="brand">Default radius (10px)</Button>
          <Button variant="outline">Default radius (10px)</Button>
        </div>
      </div>
    </div>
  ),
};
