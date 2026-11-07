import type { Meta, StoryObj } from "@storybook/react";
import { AlertDialog } from "./index";

const meta: Meta = {
  title: "Components/AlertDialog",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>Delete item</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Title>Are you sure?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. This will permanently delete the item and all associated
            data.
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Close className="border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50">
              Cancel
            </AlertDialog.Close>
            <AlertDialog.Close className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};
