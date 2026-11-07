import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./index";

const meta: Meta = {
  title: "Components/Slider",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Slider.Root defaultValue={50} className="w-80">
      <div className="flex justify-between">
        <Slider.Label>Volume</Slider.Label>
        <Slider.Value />
      </div>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  ),
};

export const Range: StoryObj = {
  render: () => (
    <Slider.Root defaultValue={[25, 75]} className="w-80">
      <div className="flex justify-between">
        <Slider.Label>Price range</Slider.Label>
        <Slider.Value />
      </div>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb />
          <Slider.Thumb />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  ),
};

export const WithMinMax: StoryObj = {
  render: () => (
    <Slider.Root defaultValue={20} min={0} max={100} step={5} className="w-80">
      <div className="flex justify-between">
        <Slider.Label>Brightness</Slider.Label>
        <Slider.Value />
      </div>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <Slider.Root defaultValue={40} disabled className="w-80">
      <div className="flex justify-between">
        <Slider.Label>Disabled</Slider.Label>
        <Slider.Value />
      </div>
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  ),
};
