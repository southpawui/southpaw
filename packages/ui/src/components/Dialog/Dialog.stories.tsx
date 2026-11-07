import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./index";

const meta: Meta = {
  title: "Components/Dialog",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>Open dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you are done.
          </Dialog.Description>
          <div className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-neutral-900">Name</span>
              <input
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                defaultValue="George Yiakoumi"
              />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close className="border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50">
              Cancel
            </Dialog.Close>
            <Dialog.Close className="bg-neutral-900 text-white hover:bg-neutral-800">
              Save changes
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};
