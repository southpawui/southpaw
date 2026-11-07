import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./index";

const meta: Meta = {
  title: "Components/Tabs",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tabs.Root defaultValue="account">
      <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="password">Password</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="account">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Account</h3>
          <p className="text-sm text-neutral-600">Manage your account settings and preferences.</p>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="password">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Password</h3>
          <p className="text-sm text-neutral-600">Change your password and security settings.</p>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Settings</h3>
          <p className="text-sm text-neutral-600">
            Configure application preferences and notifications.
          </p>
        </div>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

export const DisabledTab: StoryObj = {
  render: () => (
    <Tabs.Root defaultValue="tab1">
      <Tabs.List>
        <Tabs.Tab value="tab1">Active</Tabs.Tab>
        <Tabs.Tab value="tab2" disabled>
          Disabled
        </Tabs.Tab>
        <Tabs.Tab value="tab3">Another</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="tab1">
        <p className="text-sm text-neutral-600">First panel content.</p>
      </Tabs.Panel>
      <Tabs.Panel value="tab3">
        <p className="text-sm text-neutral-600">Third panel content.</p>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};
