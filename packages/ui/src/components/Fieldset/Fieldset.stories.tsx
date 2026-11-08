import type { Meta, StoryObj } from "@storybook/react";
import { Fieldset } from "./Fieldset";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";

const meta: Meta = {
  title: "Components/Fieldset",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend>Personal Information</Fieldset.Legend>
      <div className="mt-4 flex flex-col gap-4">
        <Field.Root>
          <Field.Label>First name</Field.Label>
          <Input type="text" placeholder="George" />
        </Field.Root>
        <Field.Root>
          <Field.Label>Last name</Field.Label>
          <Input type="text" placeholder="Yiakoumi" />
        </Field.Root>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input type="email" placeholder="george@example.com" />
          <Field.Description>Your primary contact email.</Field.Description>
        </Field.Root>
      </div>
    </Fieldset.Root>
  ),
};
