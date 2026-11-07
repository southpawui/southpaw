import type { Meta, StoryObj } from "@storybook/react";
import { NavigationMenu } from "./NavigationMenu";

const meta: Meta = {
  title: "Components/NavigationMenu",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>
            Products
            <NavigationMenu.Icon>
              <ChevronDownIcon />
            </NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Portal>
            <NavigationMenu.Positioner sideOffset={4}>
              <NavigationMenu.Popup>
                <NavigationMenu.Content>
                  <div className="grid w-[400px] gap-2">
                    <NavigationMenu.Link href="#analytics">
                      <div className="font-medium">Analytics</div>
                      <p className="text-xs text-neutral-500">Track and measure user behaviour</p>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link href="#automation">
                      <div className="font-medium">Automation</div>
                      <p className="text-xs text-neutral-500">Automate repetitive workflows</p>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link href="#integrations">
                      <div className="font-medium">Integrations</div>
                      <p className="text-xs text-neutral-500">Connect with third-party tools</p>
                    </NavigationMenu.Link>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Popup>
            </NavigationMenu.Positioner>
          </NavigationMenu.Portal>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger>
            Resources
            <NavigationMenu.Icon>
              <ChevronDownIcon />
            </NavigationMenu.Icon>
          </NavigationMenu.Trigger>
          <NavigationMenu.Portal>
            <NavigationMenu.Positioner sideOffset={4}>
              <NavigationMenu.Popup>
                <NavigationMenu.Content>
                  <div className="grid w-[300px] gap-2">
                    <NavigationMenu.Link href="#docs">Documentation</NavigationMenu.Link>
                    <NavigationMenu.Link href="#blog">Blog</NavigationMenu.Link>
                    <NavigationMenu.Link href="#support">Support</NavigationMenu.Link>
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Popup>
            </NavigationMenu.Positioner>
          </NavigationMenu.Portal>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link
            href="#pricing"
            className="inline-flex items-center px-3 py-2 text-sm font-medium"
          >
            Pricing
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
};

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}
