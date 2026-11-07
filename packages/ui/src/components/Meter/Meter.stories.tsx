import type { Meta, StoryObj } from "@storybook/react";
import { Meter } from "./Meter";

const meta: Meta = {
  title: "Components/Meter",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Meter.Root value={60}>
        <div className="flex items-center justify-between">
          <Meter.Label>Storage</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const Low: Story = {
  render: () => (
    <div className="w-64">
      <Meter.Root value={15}>
        <div className="flex items-center justify-between">
          <Meter.Label>CPU Usage</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const Medium: Story = {
  render: () => (
    <div className="w-64">
      <Meter.Root value={50}>
        <div className="flex items-center justify-between">
          <Meter.Label>Memory</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const High: Story = {
  render: () => (
    <div className="w-64">
      <Meter.Root value={90}>
        <div className="flex items-center justify-between">
          <Meter.Label>Disk Space</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};

export const AllLevels: Story = {
  render: () => (
    <div className="flex w-64 flex-col gap-6">
      <Meter.Root value={15}>
        <div className="flex items-center justify-between">
          <Meter.Label>Low</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>

      <Meter.Root value={50}>
        <div className="flex items-center justify-between">
          <Meter.Label>Medium</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>

      <Meter.Root value={90}>
        <div className="flex items-center justify-between">
          <Meter.Label>High</Meter.Label>
          <Meter.Value />
        </div>
        <Meter.Track>
          <Meter.Indicator />
        </Meter.Track>
      </Meter.Root>
    </div>
  ),
};
