import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./index";

const meta: Meta = {
  title: "Components/Progress",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Progress.Root value={60} className="w-80">
      <div className="flex justify-between">
        <Progress.Label>Loading...</Progress.Label>
        <Progress.Value />
      </div>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
    </Progress.Root>
  ),
};

export const Empty: StoryObj = {
  render: () => (
    <Progress.Root value={0} aria-label="Progress" className="w-80">
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
    </Progress.Root>
  ),
};

export const Half: StoryObj = {
  render: () => (
    <Progress.Root value={50} className="w-80">
      <div className="flex justify-between">
        <Progress.Label>Uploading</Progress.Label>
        <Progress.Value />
      </div>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
    </Progress.Root>
  ),
};

export const Complete: StoryObj = {
  render: () => (
    <Progress.Root value={100} className="w-80">
      <div className="flex justify-between">
        <Progress.Label>Complete</Progress.Label>
        <Progress.Value />
      </div>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
    </Progress.Root>
  ),
};

export const Indeterminate: StoryObj = {
  render: () => (
    <Progress.Root value={null} className="w-80">
      <Progress.Label>Processing...</Progress.Label>
      <Progress.Track>
        <Progress.Indicator className="w-1/3 animate-[indeterminate_1.5s_ease-in-out_infinite]" />
      </Progress.Track>
    </Progress.Root>
  ),
};
