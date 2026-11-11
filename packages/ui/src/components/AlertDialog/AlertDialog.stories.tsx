import type { Meta, StoryObj } from "@storybook/react";
import { WarningCircle, Trash, ShieldWarning } from "@phosphor-icons/react";
import { AlertDialog } from "./AlertDialog";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/AlertDialog",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * DEFAULT (destructive confirmation)
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button color="danger" />}>Delete account</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop />
        <AlertDialog.Popup>
          <AlertDialog.Header>
            <div>
              <AlertDialog.Title>Are you sure?</AlertDialog.Title>
              <AlertDialog.Description>
                This action cannot be undone. This will permanently delete your account and all
                associated data.
              </AlertDialog.Description>
            </div>
          </AlertDialog.Header>
          <AlertDialog.Footer className="mt-6">
            <AlertDialog.Close render={<Button variant="outline" />}>Cancel</AlertDialog.Close>
            <AlertDialog.Close render={<Button color="danger" />}>Delete account</AlertDialog.Close>
          </AlertDialog.Footer>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  ),
};

/* ============================================================
 * WITH ICON
 * ============================================================ */

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <AlertDialog.Root>
        <AlertDialog.Trigger render={<Button variant="outline" />}>
          Unsaved changes
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Header>
              <AlertDialog.Icon color="danger">
                <WarningCircle weight="fill" />
              </AlertDialog.Icon>
              <AlertDialog.Title>Unsaved changes</AlertDialog.Title>
              <AlertDialog.Description>
                You have unsaved changes that will be lost if you leave this page.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer className="mt-6">
              <AlertDialog.Close render={<Button variant="outline" />}>
                Stay on page
              </AlertDialog.Close>
              <AlertDialog.Close render={<Button color="danger" />}>
                Discard changes
              </AlertDialog.Close>
            </AlertDialog.Footer>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <AlertDialog.Root>
        <AlertDialog.Trigger render={<Button color="danger" />}>Delete project</AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Header>
              <AlertDialog.Icon color="danger" shape="rounded">
                <Trash weight="fill" />
              </AlertDialog.Icon>
              <AlertDialog.Title>Delete project</AlertDialog.Title>
              <AlertDialog.Description>
                This will permanently remove the project and all its data.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer className="mt-6">
              <AlertDialog.Close render={<Button variant="outline" />}>Cancel</AlertDialog.Close>
              <AlertDialog.Close render={<Button color="danger" />}>
                Delete project
              </AlertDialog.Close>
            </AlertDialog.Footer>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      <AlertDialog.Root>
        <AlertDialog.Trigger render={<Button variant="outline" />}>
          Revoke access
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Backdrop />
          <AlertDialog.Popup>
            <AlertDialog.Header>
              <AlertDialog.Icon color="warning" shape="circle" size="lg">
                <ShieldWarning weight="fill" />
              </AlertDialog.Icon>
              <AlertDialog.Title>Revoke API access</AlertDialog.Title>
              <AlertDialog.Description>
                This will invalidate all existing API tokens. Connected services will stop working.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer className="mt-6">
              <AlertDialog.Close render={<Button variant="outline" />}>
                Keep access
              </AlertDialog.Close>
              <AlertDialog.Close render={<Button variant="solid" />}>
                Revoke access
              </AlertDialog.Close>
            </AlertDialog.Footer>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
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
          <div className="flex gap-3">
            <AlertDialog.Root>
              <AlertDialog.Trigger render={<Button color="danger" />}>
                Destructive
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Backdrop />
                <AlertDialog.Popup>
                  <AlertDialog.Header>
                    <AlertDialog.Icon color="danger">
                      <WarningCircle weight="fill" />
                    </AlertDialog.Icon>
                    <AlertDialog.Title>Delete item</AlertDialog.Title>
                    <AlertDialog.Description>
                      This action is permanent and cannot be undone.
                    </AlertDialog.Description>
                  </AlertDialog.Header>
                  <AlertDialog.Footer className="mt-6">
                    <AlertDialog.Close render={<Button variant="outline" />}>
                      Cancel
                    </AlertDialog.Close>
                    <AlertDialog.Close render={<Button color="danger" />}>Delete</AlertDialog.Close>
                  </AlertDialog.Footer>
                </AlertDialog.Popup>
              </AlertDialog.Portal>
            </AlertDialog.Root>

            <AlertDialog.Root>
              <AlertDialog.Trigger render={<Button variant="outline" />}>
                Confirm
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Backdrop />
                <AlertDialog.Popup>
                  <AlertDialog.Header>
                    <div>
                      <AlertDialog.Title>Confirm action</AlertDialog.Title>
                      <AlertDialog.Description>
                        Are you sure you want to proceed?
                      </AlertDialog.Description>
                    </div>
                  </AlertDialog.Header>
                  <AlertDialog.Footer className="mt-6">
                    <AlertDialog.Close render={<Button variant="outline" />}>
                      No, go back
                    </AlertDialog.Close>
                    <AlertDialog.Close render={<Button variant="solid" />}>
                      Yes, continue
                    </AlertDialog.Close>
                  </AlertDialog.Footer>
                </AlertDialog.Popup>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
