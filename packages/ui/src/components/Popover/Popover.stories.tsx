import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./Popover";
import { Button } from "../Button/Button";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";

const meta: Meta = {
  title: "Components/Popover",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex justify-center pt-20">
      <Popover.Root>
        <Popover.Trigger render={<Button variant="outline" />}>Open popover</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup>
              <Popover.Title>Dimensions</Popover.Title>
              <Popover.Description>Set the dimensions for the layer.</Popover.Description>
              <div className="mt-4 flex flex-col gap-3">
                <Field.Root orientation="horizontal">
                  <Field.Label className="w-20">Width</Field.Label>
                  <Input defaultValue="100%" />
                </Field.Root>
                <Field.Root orientation="horizontal">
                  <Field.Label className="w-20">Height</Field.Label>
                  <Input defaultValue="25px" />
                </Field.Root>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  ),
};

/* ============================================================
 * WITH ARROW
 * ============================================================ */

export const WithArrow: Story = {
  render: () => (
    <div className="flex justify-center pt-20">
      <Popover.Root>
        <Popover.Trigger render={<Button variant="outline" />}>With arrow</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup>
              <Popover.Arrow />
              <Popover.Title>Info</Popover.Title>
              <Popover.Description>
                This popover includes an arrow pointing to the trigger element.
              </Popover.Description>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  ),
};

/* ============================================================
 * WITH FORM
 * ============================================================ */

export const WithForm: Story = {
  render: () => (
    <div className="flex justify-center pt-20">
      <Popover.Root>
        <Popover.Trigger render={<Button variant="solid" />}>Edit settings</Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8}>
            <Popover.Popup>
              <Popover.Title>Settings</Popover.Title>
              <Popover.Description>Update your notification preferences.</Popover.Description>
              <div className="mt-4 flex flex-col gap-3">
                <Field.Root>
                  <Field.Label>Name</Field.Label>
                  <Input defaultValue="George Yiakoumi" />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Email</Field.Label>
                  <Input purpose="email" defaultValue="george@example.com" />
                </Field.Root>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Popover.Close render={<Button variant="outline" size="sm" />}>
                  Cancel
                </Popover.Close>
                <Popover.Close render={<Button variant="solid" size="sm" />}>Save</Popover.Close>
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  ),
};

/* ============================================================
 * MATCH TRIGGER WIDTH
 * ============================================================ */

export const MatchTriggerWidth: Story = {
  render: () => (
    <div className="flex justify-center pt-20">
      <Popover.Root>
        <Popover.Trigger render={<Button variant="outline" className="w-64" />}>
          Select option
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={4}>
            <Popover.Popup className="w-[var(--anchor-width)]">
              <div className="flex flex-col">
                {["Option A", "Option B", "Option C", "Option D"].map((opt) => (
                  <Popover.Close
                    key={opt}
                    className="text-fg-default hover:bg-surface-sunken cursor-pointer px-3 py-2 text-left text-sm transition-colors"
                  >
                    {opt}
                  </Popover.Close>
                ))}
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
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
          <div className="flex justify-center pb-4 pt-12">
            <Popover.Root>
              <Popover.Trigger render={<Button variant="outline" />}>Open popover</Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner sideOffset={8}>
                  <Popover.Popup>
                    <Popover.Arrow />
                    <Popover.Title>Popover on {theme}</Popover.Title>
                    <Popover.Description>
                      Testing popover appearance across themes.
                    </Popover.Description>
                    <div className="mt-3 flex justify-end">
                      <Popover.Close render={<Button variant="outline" size="sm" />}>
                        Close
                      </Popover.Close>
                    </div>
                  </Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};
