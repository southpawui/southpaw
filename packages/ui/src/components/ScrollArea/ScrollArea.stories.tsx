import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./index";

const meta: Meta = {
  title: "Components/ScrollArea",
};

export default meta;

export const Vertical: StoryObj = {
  render: () => (
    <ScrollArea.Root className="h-48 w-64 rounded-md border border-neutral-200">
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium">Notifications</h4>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="border-b border-neutral-100 py-2 text-sm">
                Notification item {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar>
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};

export const Horizontal: StoryObj = {
  render: () => (
    <ScrollArea.Root className="w-80 rounded-md border border-neutral-200">
      <ScrollArea.Viewport>
        <ScrollArea.Content>
          <div className="flex gap-4 p-4">
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-sm font-medium"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  ),
};
