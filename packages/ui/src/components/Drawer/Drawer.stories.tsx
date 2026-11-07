import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./index";

const meta: Meta = {
  title: "Components/Drawer",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Popup>
          <Drawer.Content>
            <div className="flex items-center justify-between">
              <Drawer.Title>Navigation</Drawer.Title>
              <Drawer.Close>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="sr-only">Close</span>
              </Drawer.Close>
            </div>
            <Drawer.Description>Browse the site sections.</Drawer.Description>
            <nav className="mt-6 flex flex-col gap-2">
              <a
                href="/home"
                className="rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Home
              </a>
              <a
                href="/components"
                className="rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Components
              </a>
              <a
                href="/docs"
                className="rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Documentation
              </a>
              <a
                href="/github"
                className="rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                GitHub
              </a>
            </nav>
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};
