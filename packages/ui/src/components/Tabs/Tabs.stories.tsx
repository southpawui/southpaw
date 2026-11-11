import type { Meta, StoryObj } from "@storybook/react";
import { GearSixIcon, UserIcon, LockIcon, BellIcon } from "@phosphor-icons/react";
import { Tabs } from "./Tabs";

const meta: Meta = {
  title: "Components/Tabs",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Tabs.Root defaultValue="account" className="sm:max-w-lg">
      <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="password">Password</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="account">
        <h3 className="text-fg-default text-lg font-semibold">Account</h3>
        <p className="text-fg-muted mt-1 text-sm">Manage your account settings and preferences.</p>
      </Tabs.Panel>
      <Tabs.Panel value="password">
        <h3 className="text-fg-default text-lg font-semibold">Password</h3>
        <p className="text-fg-muted mt-1 text-sm">Change your password and security settings.</p>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <h3 className="text-fg-default text-lg font-semibold">Settings</h3>
        <p className="text-fg-muted mt-1 text-sm">
          Configure application preferences and notifications.
        </p>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

/* ============================================================
 * WITH ICONS
 * ============================================================ */

export const WithIcons: Story = {
  render: () => (
    <Tabs.Root defaultValue="profile" className="sm:max-w-lg">
      <Tabs.List>
        <Tabs.Tab value="profile">
          <UserIcon className="h-4 w-4" /> Profile
        </Tabs.Tab>
        <Tabs.Tab value="security">
          <LockIcon className="h-4 w-4" /> Security
        </Tabs.Tab>
        <Tabs.Tab value="notifications">
          <BellIcon className="h-4 w-4" /> Notifications
        </Tabs.Tab>
        <Tabs.Tab value="advanced">
          <GearSixIcon className="h-4 w-4" /> Advanced
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="profile">
        <p className="text-fg-muted text-sm">Edit your profile information.</p>
      </Tabs.Panel>
      <Tabs.Panel value="security">
        <p className="text-fg-muted text-sm">Manage your security settings.</p>
      </Tabs.Panel>
      <Tabs.Panel value="notifications">
        <p className="text-fg-muted text-sm">Configure notification preferences.</p>
      </Tabs.Panel>
      <Tabs.Panel value="advanced">
        <p className="text-fg-muted text-sm">Advanced configuration options.</p>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

/* ============================================================
 * VERTICAL
 * ============================================================ */

export const Vertical: Story = {
  render: () => (
    <Tabs.Root defaultValue="general" orientation="vertical" className="sm:max-w-lg">
      <Tabs.List>
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="appearance">Appearance</Tabs.Tab>
        <Tabs.Tab value="integrations">Integrations</Tabs.Tab>
        <Tabs.Tab value="billing" disabled>
          Billing
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="general">
        <h3 className="text-fg-default text-lg font-semibold">General</h3>
        <p className="text-fg-muted mt-1 text-sm">General workspace settings.</p>
      </Tabs.Panel>
      <Tabs.Panel value="appearance">
        <h3 className="text-fg-default text-lg font-semibold">Appearance</h3>
        <p className="text-fg-muted mt-1 text-sm">Customise the look and feel.</p>
      </Tabs.Panel>
      <Tabs.Panel value="integrations">
        <h3 className="text-fg-default text-lg font-semibold">Integrations</h3>
        <p className="text-fg-muted mt-1 text-sm">Connect third-party services.</p>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

/* ============================================================
 * DISABLED
 * ============================================================ */

export const Disabled: Story = {
  render: () => (
    <Tabs.Root defaultValue="tab1" className="sm:max-w-lg">
      <Tabs.List>
        <Tabs.Tab value="tab1">Active</Tabs.Tab>
        <Tabs.Tab value="tab2" disabled>
          Disabled
        </Tabs.Tab>
        <Tabs.Tab value="tab3">Another</Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="tab1">
        <p className="text-fg-muted text-sm">First panel content.</p>
      </Tabs.Panel>
      <Tabs.Panel value="tab3">
        <p className="text-fg-muted text-sm">Third panel content.</p>
      </Tabs.Panel>
    </Tabs.Root>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="bg-surface-base text-fg-default rounded-lg p-6"
        >
          <p className="text-fg-muted mb-4 text-xs font-semibold uppercase tracking-wide">
            {theme}
          </p>
          <Tabs.Root defaultValue="tab1" className="sm:max-w-md">
            <Tabs.List>
              <Tabs.Tab value="tab1">
                <UserIcon className="h-4 w-4" /> Account
              </Tabs.Tab>
              <Tabs.Tab value="tab2">
                <LockIcon className="h-4 w-4" /> Security
              </Tabs.Tab>
              <Tabs.Tab value="tab3" disabled>
                <BellIcon className="h-4 w-4" /> Disabled
              </Tabs.Tab>
              <Tabs.Indicator />
            </Tabs.List>
            <Tabs.Panel value="tab1">
              <p className="text-fg-muted text-sm">Account settings panel.</p>
            </Tabs.Panel>
            <Tabs.Panel value="tab2">
              <p className="text-fg-muted text-sm">Security settings panel.</p>
            </Tabs.Panel>
          </Tabs.Root>
        </div>
      ))}
    </div>
  ),
};
