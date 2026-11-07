import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./ContextMenu";

const meta: Meta = {
  title: "Components/ContextMenu",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="flex h-36 w-72 items-center justify-center rounded-md border-2 border-dashed border-neutral-300 text-sm text-neutral-500">
          Right-click here
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item>Cut</ContextMenu.Item>
            <ContextMenu.Item>Copy</ContextMenu.Item>
            <ContextMenu.Item>Paste</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>Delete</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  ),
};

export const WithCheckboxAndRadio: StoryObj = {
  render: function Render() {
    const [showGrid, setShowGrid] = React.useState(true);
    const [showGuides, setShowGuides] = React.useState(false);

    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div className="flex h-36 w-72 items-center justify-center rounded-md border-2 border-dashed border-neutral-300 text-sm text-neutral-500">
            Right-click here
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup>
              <ContextMenu.Group>
                <ContextMenu.GroupLabel>View</ContextMenu.GroupLabel>
                <ContextMenu.CheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
                  <ContextMenu.CheckboxItemIndicator>
                    <CheckIcon />
                  </ContextMenu.CheckboxItemIndicator>
                  Show grid
                </ContextMenu.CheckboxItem>
                <ContextMenu.CheckboxItem checked={showGuides} onCheckedChange={setShowGuides}>
                  <ContextMenu.CheckboxItemIndicator>
                    <CheckIcon />
                  </ContextMenu.CheckboxItemIndicator>
                  Show guides
                </ContextMenu.CheckboxItem>
              </ContextMenu.Group>
              <ContextMenu.Separator />
              <ContextMenu.Group>
                <ContextMenu.GroupLabel>Zoom</ContextMenu.GroupLabel>
                <ContextMenu.RadioGroup defaultValue="100">
                  <ContextMenu.RadioItem value="50">
                    <ContextMenu.RadioItemIndicator>
                      <DotIcon />
                    </ContextMenu.RadioItemIndicator>
                    50%
                  </ContextMenu.RadioItem>
                  <ContextMenu.RadioItem value="100">
                    <ContextMenu.RadioItemIndicator>
                      <DotIcon />
                    </ContextMenu.RadioItemIndicator>
                    100%
                  </ContextMenu.RadioItem>
                  <ContextMenu.RadioItem value="200">
                    <ContextMenu.RadioItemIndicator>
                      <DotIcon />
                    </ContextMenu.RadioItemIndicator>
                    200%
                  </ContextMenu.RadioItem>
                </ContextMenu.RadioGroup>
              </ContextMenu.Group>
            </ContextMenu.Popup>
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    );
  },
};

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 6L5 9L10 3" />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <circle cx="6" cy="6" r="3" />
    </svg>
  );
}
