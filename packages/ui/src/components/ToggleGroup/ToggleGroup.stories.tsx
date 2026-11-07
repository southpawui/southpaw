import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup } from "./index";
import { Toggle } from "../Toggle/index";

const meta: Meta<typeof ToggleGroup> = {
  title: "Components/ToggleGroup",
  component: ToggleGroup,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <ToggleGroup>
      <Toggle aria-label="Bold">B</Toggle>
      <Toggle aria-label="Italic">I</Toggle>
      <Toggle aria-label="Underline">U</Toggle>
    </ToggleGroup>
  ),
};

export const WithDefaultValues: StoryObj = {
  render: () => (
    <ToggleGroup defaultValue={["bold"]}>
      <Toggle value="bold" aria-label="Bold">
        B
      </Toggle>
      <Toggle value="italic" aria-label="Italic">
        I
      </Toggle>
      <Toggle value="underline" aria-label="Underline">
        U
      </Toggle>
    </ToggleGroup>
  ),
};
