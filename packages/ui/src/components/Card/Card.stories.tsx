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
