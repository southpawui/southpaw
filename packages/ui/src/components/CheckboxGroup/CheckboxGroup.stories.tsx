import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxGroup } from "./CheckboxGroup";
import { Checkbox } from "../Checkbox/Checkbox";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/CheckboxGroup",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Notifications</Field.Label>
      <CheckboxGroup defaultValue={["updates"]}>
        <Field.Item>
          <div className="flex items-center gap-2">
            <Checkbox.Root name="updates">
              <Checkbox.Indicator />
            </Checkbox.Root>
            <span className="text-fg-default text-sm">Product updates</span>
          </div>
        </Field.Item>
        <Field.Item>
          <div className="flex items-center gap-2">
            <Checkbox.Root name="marketing">
              <Checkbox.Indicator />
            </Checkbox.Root>
            <span className="text-fg-default text-sm">Marketing emails</span>
          </div>
        </Field.Item>
        <Field.Item>
          <div className="flex items-center gap-2">
            <Checkbox.Root name="security">
              <Checkbox.Indicator />
            </Checkbox.Root>
            <span className="text-fg-default text-sm">Security alerts</span>
          </div>
        </Field.Item>
      </CheckboxGroup>
    </Field.Root>
  ),
};
