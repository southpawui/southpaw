import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/Switch",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Field.Root>
      <div className="flex items-center gap-3">
        <Switch.Root>
          <Switch.Thumb />
        </Switch.Root>
        <Field.Label className="cursor-pointer">Dark mode</Field.Label>
      </div>
    </Field.Root>
  ),
};

export const Checked: StoryObj = {
  render: () => (
    <Field.Root>
      <div className="flex items-center gap-3">
        <Switch.Root defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
        <Field.Label className="cursor-pointer">Notifications</Field.Label>
      </div>
    </Field.Root>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <Field.Root disabled>
      <div className="flex items-center gap-3">
        <Switch.Root defaultChecked>
          <Switch.Thumb />
        </Switch.Root>
        <Field.Label>Two-factor authentication</Field.Label>
      </div>
      <Field.Description>Required by your organisation.</Field.Description>
    </Field.Root>
  ),
};

export const AllStates: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field.Root>
        <div className="flex items-center gap-3">
          <Switch.Root>
            <Switch.Thumb />
          </Switch.Root>
          <Field.Label className="cursor-pointer">Off</Field.Label>
        </div>
      </Field.Root>
      <Field.Root>
        <div className="flex items-center gap-3">
          <Switch.Root defaultChecked>
            <Switch.Thumb />
          </Switch.Root>
          <Field.Label className="cursor-pointer">On</Field.Label>
        </div>
      </Field.Root>
      <Field.Root disabled>
        <div className="flex items-center gap-3">
          <Switch.Root>
            <Switch.Thumb />
          </Switch.Root>
          <Field.Label>Disabled off</Field.Label>
        </div>
      </Field.Root>
      <Field.Root disabled>
        <div className="flex items-center gap-3">
          <Switch.Root defaultChecked>
            <Switch.Thumb />
          </Switch.Root>
          <Field.Label>Disabled on</Field.Label>
        </div>
      </Field.Root>
    </div>
  ),
};
