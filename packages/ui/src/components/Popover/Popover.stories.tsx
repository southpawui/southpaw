import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./index";

const meta: Meta = {
  title: "Components/Popover",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup>
            <Popover.Title>Popover Title</Popover.Title>
            <Popover.Description>
              This is a simple popover with a title and description. You can put any content here.
            </Popover.Description>
            <div className="mt-4 flex justify-end">
              <Popover.Close>Close</Popover.Close>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>With Arrow</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Title>Arrow Popover</Popover.Title>
            <Popover.Description>
              This popover includes an arrow pointing to the trigger.
            </Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger>Edit Settings</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup>
            <Popover.Title>Settings</Popover.Title>
            <Popover.Description>Update your notification preferences.</Popover.Description>
            <div className="mt-4 space-y-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="pop-name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="pop-name"
                  type="text"
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
                  defaultValue="George"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="pop-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="pop-email"
                  type="email"
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
                  defaultValue="george@example.com"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Popover.Close>Cancel</Popover.Close>
                <button
                  type="button"
                  className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  ),
};
