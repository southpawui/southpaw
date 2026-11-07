import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./Menu";

const meta: Meta = {
  title: "Components/Menu",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Open Menu</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup>
            <Menu.Item>New File</Menu.Item>
            <Menu.Item>Open File</Menu.Item>
            <Menu.Item>Save</Menu.Item>
            <Menu.Separator />
            <Menu.Item>Exit</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup>
            <Menu.Group>
              <Menu.GroupLabel>Edit</Menu.GroupLabel>
              <Menu.Item>Cut</Menu.Item>
              <Menu.Item>Copy</Menu.Item>
              <Menu.Item>Paste</Menu.Item>
            </Menu.Group>
            <Menu.Separator />
            <Menu.Group>
              <Menu.GroupLabel>View</Menu.GroupLabel>
              <Menu.Item>Zoom In</Menu.Item>
              <Menu.Item>Zoom Out</Menu.Item>
              <Menu.Item>Reset Zoom</Menu.Item>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const WithCheckboxItems: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>View Options</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup>
            <Menu.CheckboxItem checked>
              <Menu.CheckboxItemIndicator>
                <CheckIcon />
              </Menu.CheckboxItemIndicator>
              Show Toolbar
            </Menu.CheckboxItem>
            <Menu.CheckboxItem>
              <Menu.CheckboxItemIndicator>
                <CheckIcon />
              </Menu.CheckboxItemIndicator>
              Show Sidebar
            </Menu.CheckboxItem>
            <Menu.Separator />
            <Menu.Item>Preferences</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const WithRadioItems: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger>Sort By</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={4}>
          <Menu.Popup>
            <Menu.RadioGroup defaultValue="name">
              <Menu.RadioItem value="name">
                <Menu.RadioItemIndicator>
                  <DotIcon />
                </Menu.RadioItemIndicator>
                Name
              </Menu.RadioItem>
              <Menu.RadioItem value="date">
                <Menu.RadioItemIndicator>
                  <DotIcon />
                </Menu.RadioItemIndicator>
                Date
              </Menu.RadioItem>
              <Menu.RadioItem value="size">
                <Menu.RadioItemIndicator>
                  <DotIcon />
                </Menu.RadioItemIndicator>
                Size
              </Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3354 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.5553 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="3.5" fill="currentColor" />
    </svg>
  );
}
