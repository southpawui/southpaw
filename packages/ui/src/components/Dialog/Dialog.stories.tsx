import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./index";
import { Button } from "../Button";
import { Field } from "../Field";
import { Input } from "../Input";

const meta: Meta = {
  title: "Components/Dialog",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="solid" />}>Edit profile</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you are done.
          </Dialog.Description>
          <div className="mt-6">
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Input defaultValue="George Yiakoumi" />
            </Field.Root>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
            <Dialog.Close render={<Button variant="solid" />}>Save changes</Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};
