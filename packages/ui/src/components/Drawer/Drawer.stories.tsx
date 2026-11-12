import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./Drawer";
import { Button } from "../Button/Button";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";

const meta: Meta = {
  title: "Components/Drawer",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * DEFAULT (right side)
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Drawer.Root>
      <Drawer.Trigger render={<Button variant="solid" />}>Open drawer</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Popup>
          <Drawer.Header>
            <div>
              <Drawer.Title>Edit profile</Drawer.Title>
              <Drawer.Description>Update your personal information.</Drawer.Description>
            </div>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
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
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close render={<Button variant="outline" />}>Cancel</Drawer.Close>
            <Drawer.Close render={<Button variant="solid" />}>Save</Drawer.Close>
          </Drawer.Footer>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};

/* ============================================================
 * DIRECTIONS
 * ============================================================ */

export const Directions: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["left", "right", "top", "bottom"] as const).map((dir) => (
        <Drawer.Root key={dir} direction={dir}>
          <Drawer.Trigger render={<Button variant="outline" />}>{dir}</Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Backdrop />
            <Drawer.Popup>
              <Drawer.Header>
                <div>
                  <Drawer.Title>From {dir}</Drawer.Title>
                  <Drawer.Description>This drawer slides from the {dir}.</Drawer.Description>
                </div>
                <Drawer.CloseButton />
              </Drawer.Header>
              <Drawer.Body>
                <p className="text-fg-default text-sm">Content for the {dir} drawer.</p>
              </Drawer.Body>
            </Drawer.Popup>
          </Drawer.Portal>
        </Drawer.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * BOTTOM SHEET (with drag handle)
 * ============================================================ */

export const BottomSheet: Story = {
  render: () => (
    <Drawer.Root direction="bottom">
      <Drawer.Trigger render={<Button variant="solid" />}>Open bottom sheet</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Popup size="md">
          <Drawer.Handle />
          <Drawer.Header>
            <div>
              <Drawer.Title>Share</Drawer.Title>
              <Drawer.Description>Choose how to share this item.</Drawer.Description>
            </div>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <div className="flex flex-col gap-2">
              {["Copy link", "Email", "Messages", "Twitter", "LinkedIn"].map((item) => (
                <Drawer.Close
                  key={item}
                  className="text-fg-default hover:bg-surface-sunken cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                >
                  {item}
                </Drawer.Close>
              ))}
            </div>
          </Drawer.Body>
        </Drawer.Popup>
      </Drawer.Portal>
    </Drawer.Root>
  ),
};

/* ============================================================
 * SIZES
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Drawer.Root key={size}>
          <Drawer.Trigger render={<Button variant="outline" />}>{size}</Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Backdrop />
            <Drawer.Popup size={size}>
              <Drawer.Header>
                <div>
                  <Drawer.Title>Size: {size}</Drawer.Title>
                  <Drawer.Description>This drawer uses the {size} size.</Drawer.Description>
                </div>
                <Drawer.CloseButton />
              </Drawer.Header>
              <Drawer.Body>
                <p className="text-fg-default text-sm">Content area.</p>
              </Drawer.Body>
            </Drawer.Popup>
          </Drawer.Portal>
        </Drawer.Root>
      ))}
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
            <Drawer.Root>
              <Drawer.Trigger render={<Button variant="solid" />}>Right</Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup>
                  <Drawer.Header>
                    <div>
                      <Drawer.Title>Drawer on {theme}</Drawer.Title>
                      <Drawer.Description>Testing drawer appearance.</Drawer.Description>
                    </div>
                    <Drawer.CloseButton />
                  </Drawer.Header>
                  <Drawer.Body>
                    <Field.Root>
                      <Field.Label>Name</Field.Label>
                      <Input placeholder="Enter name" />
                    </Field.Root>
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Drawer.Close render={<Button variant="outline" />}>Cancel</Drawer.Close>
                    <Drawer.Close render={<Button variant="solid" />}>Save</Drawer.Close>
                  </Drawer.Footer>
                </Drawer.Popup>
              </Drawer.Portal>
            </Drawer.Root>

            <Drawer.Root direction="left">
              <Drawer.Trigger render={<Button variant="outline" />}>Left</Drawer.Trigger>
              <Drawer.Portal>
                <Drawer.Backdrop />
                <Drawer.Popup>
                  <Drawer.Header>
                    <div>
                      <Drawer.Title>Left drawer</Drawer.Title>
                      <Drawer.Description>Navigation panel.</Drawer.Description>
                    </div>
                    <Drawer.CloseButton />
                  </Drawer.Header>
                  <Drawer.Body>
                    <p className="text-fg-default text-sm">Nav content here.</p>
                  </Drawer.Body>
                </Drawer.Popup>
              </Drawer.Portal>
            </Drawer.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
