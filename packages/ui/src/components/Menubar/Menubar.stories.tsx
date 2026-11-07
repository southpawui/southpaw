import type { Meta, StoryObj } from "@storybook/react";
import { Menubar } from "./index";
import { Menu } from "../Menu";

const meta: Meta<typeof Menubar> = {
  title: "Components/Menubar",
  component: Menubar,
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <Menu.Root>
        <Menu.Trigger>File</Menu.Trigger>
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

      <Menu.Root>
        <Menu.Trigger>Edit</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup>
              <Menu.Item>Undo</Menu.Item>
              <Menu.Item>Redo</Menu.Item>
              <Menu.Separator />
              <Menu.Item>Cut</Menu.Item>
              <Menu.Item>Copy</Menu.Item>
              <Menu.Item>Paste</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <Menu.Root>
        <Menu.Trigger>View</Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner sideOffset={4}>
            <Menu.Popup>
              <Menu.Item>Zoom In</Menu.Item>
              <Menu.Item>Zoom Out</Menu.Item>
              <Menu.Separator />
              <Menu.Item>Full Screen</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Menubar>
  ),
};
