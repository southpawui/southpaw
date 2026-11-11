import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./Dialog";
import { Button } from "../Button/Button";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";
import { Separator } from "../Separator/Separator";

const meta: Meta = {
  title: "Components/Dialog",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="solid" />}>Edit profile</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Header>
            <div>
              <Dialog.Title>Edit profile</Dialog.Title>
              <Dialog.Description>Make changes to your profile here.</Dialog.Description>
            </div>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <div className="flex flex-col gap-4">
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input defaultValue="George Yiakoumi" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input purpose="email" defaultValue="george@example.com" />
              </Field.Root>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="solid" />}>Save changes</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

/* ============================================================
 * SIZES
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger render={<Button variant="outline" />}>{size}</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop />
            <Dialog.Popup size={size}>
              <Dialog.Header>
                <div>
                  <Dialog.Title>Size: {size}</Dialog.Title>
                  <Dialog.Description>This dialog uses the {size} size variant.</Dialog.Description>
                </div>
                <Dialog.CloseButton />
              </Dialog.Header>
              <Dialog.Body>
                <p className="text-fg-default text-sm">
                  Content area for the {size} dialog. The max-width changes based on the size prop.
                </p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close render={<Button variant="outline" />}>Close</Dialog.Close>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * LONG CONTENT (scrollable body)
 * ============================================================ */

export const LongContent: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="solid" />}>Terms of Service</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Header>
            <div>
              <Dialog.Title>Terms of Service</Dialog.Title>
              <Dialog.Description>Please read and accept the terms.</Dialog.Description>
            </div>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body className="max-h-[60vh]">
            <div className="flex flex-col gap-4 text-sm">
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i} className="text-fg-default">
                  <strong>Section {i + 1}.</strong> Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              ))}
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="outline" />}>Decline</Dialog.Close>
            <Dialog.Close render={<Button variant="solid" color="brand" />}>Accept</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};

/* ============================================================
 * WITH FORM
 * ============================================================ */

export const WithForm: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="solid" />}>Create project</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup size="lg">
          <Dialog.Header>
            <div>
              <Dialog.Title>Create a new project</Dialog.Title>
              <Dialog.Description>
                Fill in the details below to set up your project.
              </Dialog.Description>
            </div>
            <Dialog.CloseButton />
          </Dialog.Header>
          <Dialog.Body>
            <div className="flex flex-col gap-4">
              <Field.Root>
                <Field.Label>Project name</Field.Label>
                <Input placeholder="My awesome project" />
              </Field.Root>
              <Field.Root>
                <Field.Label>Description</Field.Label>
                <Input placeholder="A brief description..." />
                <Field.Description>Optional — you can add this later.</Field.Description>
              </Field.Root>
              <Separator />
              <Field.Root>
                <Field.Label>Repository URL</Field.Label>
                <Input purpose="url" placeholder="https://github.com/..." />
              </Field.Root>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
            <Dialog.Close render={<Button variant="solid" color="brand" />}>
              Create project
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
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
          <Dialog.Root>
            <Dialog.Trigger render={<Button variant="solid" />}>Open dialog</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop />
              <Dialog.Popup>
                <Dialog.Header>
                  <div>
                    <Dialog.Title>Dialog on {theme}</Dialog.Title>
                    <Dialog.Description>
                      Testing dialog appearance across themes.
                    </Dialog.Description>
                  </div>
                  <Dialog.CloseButton />
                </Dialog.Header>
                <Dialog.Body>
                  <div className="flex flex-col gap-4">
                    <Field.Root>
                      <Field.Label>Name</Field.Label>
                      <Input placeholder="Enter your name" />
                    </Field.Root>
                  </div>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
                  <Dialog.Close render={<Button variant="solid" />}>Confirm</Dialog.Close>
                </Dialog.Footer>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      ))}
    </div>
  ),
};
