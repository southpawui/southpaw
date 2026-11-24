import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  ArrowCounterClockwiseIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Select } from "../Select/Select";
import { Popover } from "../Popover/Popover";
import { Toggle } from "../Toggle/Toggle";
import { NumberField } from "../NumberField/NumberField";
import { Checkbox } from "../Checkbox/Checkbox";
import { Switch } from "../Switch/Switch";
import { Field } from "../Field/Field";

const meta: Meta = {
  title: "Components/ButtonGroup",
};

export default meta;
type Story = StoryObj;

const WRAP = "w-full sm:max-w-lg";

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="text-fg-muted text-xs font-medium uppercase tracking-wide">{children}</p>;
}

const VARIANTS = ["solid", "outline", "ghost"] as const;
/** `inverse` is shown separately, on a dark (fg-default) surface. */
const COLORS = ["default", "brand", "danger"] as const;

function Alignment({
  variant = "outline",
  ...rest
}: React.ComponentProps<typeof ButtonGroup.Root>) {
  return (
    <ButtonGroup.Root attached aria-label="Text alignment" variant={variant} {...rest}>
      <Button icon={<TextAlignLeftIcon />}>Left</Button>
      <Button icon={<TextAlignCenterIcon />}>Centre</Button>
      <Button icon={<TextAlignRightIcon />}>Right</Button>
    </ButtonGroup.Root>
  );
}

/* ============================================================
 * Default — spaced actions (GOV.UK button group)
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <ButtonGroup.Root className={WRAP} aria-label="Form actions">
      <Button>Save and continue</Button>
      <Button variant="outline">Save as draft</Button>
      <Button variant="ghost">Cancel</Button>
    </ButtonGroup.Root>
  ),
};

/* ============================================================
 * Attached
 * ============================================================ */

export const Attached: Story = {
  render: () => (
    <div className={`flex flex-col gap-6 ${WRAP}`}>
      <Heading>Outline</Heading>
      <Alignment />
      <Heading>Solid (automatic dividers)</Heading>
      <Alignment variant="solid" />
      <Heading>Ghost</Heading>
      <Alignment variant="ghost" />
      <Heading>Brand solid</Heading>
      <Alignment variant="solid" color="brand" />
      <Heading>Text only</Heading>
      <ButtonGroup.Root attached aria-label="Period" variant="outline">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
        <Button>Year</Button>
      </ButtonGroup.Root>
    </div>
  ),
};

/* ============================================================
 * Orientation
 * ============================================================ */

export const Orientation: Story = {
  render: () => (
    <div className={`flex flex-wrap gap-8 ${WRAP}`}>
      <section aria-label="Vertical spaced" className="flex flex-col gap-2">
        <Heading>Vertical, spaced</Heading>
        <ButtonGroup.Root orientation="vertical" aria-label="Account">
          <Button variant="outline">Profile</Button>
          <Button variant="outline">Billing</Button>
          <Button variant="outline">Sign out</Button>
        </ButtonGroup.Root>
      </section>
      <section aria-label="Vertical attached" className="flex flex-col gap-2">
        <Heading>Vertical, attached</Heading>
        <ButtonGroup.Root orientation="vertical" attached variant="outline" aria-label="Zoom">
          <Button>Zoom in</Button>
          <Button>Reset</Button>
          <Button>Zoom out</Button>
        </ButtonGroup.Root>
      </section>
      <section aria-label="Vertical attached solid" className="flex flex-col gap-2">
        <Heading>Vertical, attached solid</Heading>
        <ButtonGroup.Root orientation="vertical" attached aria-label="Layer order">
          <Button>Bring forward</Button>
          <Button>Send backward</Button>
        </ButtonGroup.Root>
      </section>
    </div>
  ),
};

/* ============================================================
 * Responsive — GOV.UK stacking
 * ============================================================ */

export const Responsive: Story = {
  render: () => (
    <div className={`flex flex-col gap-6 ${WRAP}`}>
      <Heading>stackBelow=&quot;sm&quot; (default) — resize below 640px</Heading>
      <ButtonGroup.Root aria-label="Application actions">
        <Button>Submit application</Button>
        <Button variant="outline">Save and come back later</Button>
      </ButtonGroup.Root>
      <Heading>stackBelow=&#123;false&#125; — stays in a row, wraps if needed</Heading>
      <ButtonGroup.Root stackBelow={false} aria-label="Editor actions">
        <Button size="sm">Bold</Button>
        <Button size="sm">Italic</Button>
        <Button size="sm">Link</Button>
      </ButtonGroup.Root>
    </div>
  ),
};

/* ============================================================
 * Group props — size / variant / color / disabled
 * ============================================================ */

export const GroupProps: Story = {
  render: () => (
    <div className={`flex flex-col gap-6 ${WRAP}`}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <Heading>size=&quot;{size}&quot;</Heading>
          <ButtonGroup.Root attached size={size} variant="outline" aria-label={`Size ${size}`}>
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
            <Button size="icon" srOnly={`More options (${size})`} icon={<CaretDownIcon />} />
          </ButtonGroup.Root>
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <Heading>color=&quot;danger&quot; variant=&quot;outline&quot;</Heading>
        <ButtonGroup.Root color="danger" variant="outline" aria-label="Danger zone">
          <Button>Archive</Button>
          <Button>Delete</Button>
        </ButtonGroup.Root>
      </div>
      <div className="flex flex-col gap-2">
        <Heading>A Button&apos;s own prop wins</Heading>
        <ButtonGroup.Root variant="outline" aria-label="Override">
          <Button>Outline (from group)</Button>
          <Button variant="solid">Solid (own prop)</Button>
        </ButtonGroup.Root>
      </div>
      <div className="flex flex-col gap-2">
        <Heading>disabled — every button</Heading>
        <ButtonGroup.Root attached disabled variant="outline" aria-label="Disabled group">
          <Button>One</Button>
          <Button>Two</Button>
          <Button>Three</Button>
        </ButtonGroup.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * Separator + Text
 * ============================================================ */

function Pagination() {
  const [page, setPage] = React.useState(3);
  return (
    <ButtonGroup.Root attached variant="outline" aria-label="Pagination">
      <Button
        size="icon"
        srOnly="Previous page"
        icon={<CaretLeftIcon />}
        disabled={page <= 1}
        onClick={() => setPage((p) => p - 1)}
      />
      <ButtonGroup.Text aria-live="polite">Page {page} of 9</ButtonGroup.Text>
      <Button
        size="icon"
        srOnly="Next page"
        icon={<CaretRightIcon />}
        disabled={page >= 9}
        onClick={() => setPage((p) => p + 1)}
      />
    </ButtonGroup.Root>
  );
}

export const SeparatorAndText: Story = {
  render: () => (
    <div className={`flex flex-col gap-6 ${WRAP}`}>
      <Heading>Separator splits an attached group into runs</Heading>
      <ButtonGroup.Root attached aria-label="History">
        <Button icon={<ArrowCounterClockwiseIcon />}>Undo</Button>
        <ButtonGroup.Separator />
        <Button icon={<ArrowClockwiseIcon />}>Redo</Button>
      </ButtonGroup.Root>
      <Heading>Separator in a spaced group</Heading>
      <ButtonGroup.Root variant="ghost" stackBelow={false} aria-label="Formatting">
        <Button>Bold</Button>
        <Button>Italic</Button>
        <ButtonGroup.Separator />
        <Button>Link</Button>
      </ButtonGroup.Root>
      <Heading>Text segment</Heading>
      <Pagination />
      <Heading>Text as a label</Heading>
      <ButtonGroup.Root attached aria-labelledby="currency-label">
        <ButtonGroup.Text id="currency-label">Currency</ButtonGroup.Text>
        <Button variant="outline">GBP</Button>
        <Button variant="outline">EUR</Button>
        <Button variant="outline">USD</Button>
      </ButtonGroup.Root>
    </div>
  ),
};

/* ============================================================
 * With Input / Select
 * ============================================================ */

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Select.Item value={value}>
      <Select.ItemIndicator />
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}

export const WithInputAndSelect: Story = {
  render: () => (
    <div className={`flex flex-col gap-6 ${WRAP}`}>
      <Heading>Input + Button</Heading>
      <ButtonGroup.Root attached aria-label="Search">
        <Input aria-label="Search terms" placeholder="Search…" prepend={<MagnifyingGlassIcon />} />
        <Button>Search</Button>
      </ButtonGroup.Root>
      <Heading>Select + Input + Button</Heading>
      <ButtonGroup.Root attached aria-label="Invite">
        <Select.Root
          defaultValue="editor"
          items={{ viewer: "Viewer", editor: "Editor", admin: "Admin" }}
        >
          <Select.Trigger aria-label="Role">
            <Select.Value />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.List>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <Input aria-label="Email address" placeholder="name@example.com" />
        <Button variant="outline">Invite</Button>
      </ButtonGroup.Root>
    </div>
  ),
};

/* ============================================================
 * Grow + align
 * ============================================================ */

export const GrowAndAlign: Story = {
  render: () => (
    <div className={`flex flex-col gap-6 ${WRAP}`}>
      <Heading>grow (attached)</Heading>
      <ButtonGroup.Root attached grow variant="outline" aria-label="View">
        <Button>List</Button>
        <Button>Grid</Button>
        <Button>Map</Button>
      </ButtonGroup.Root>
      <Heading>grow (spaced)</Heading>
      <ButtonGroup.Root grow stackBelow={false} aria-label="Decision">
        <Button variant="outline">Decline</Button>
        <Button>Accept</Button>
      </ButtonGroup.Root>
      <Heading>align=&quot;end&quot; (dialog footer)</Heading>
      <ButtonGroup.Root align="end" aria-label="Dialog actions">
        <Button variant="ghost">Cancel</Button>
        <Button>Confirm</Button>
      </ButtonGroup.Root>
      <Heading>align=&quot;center&quot; (empty state)</Heading>
      <ButtonGroup.Root align="center" aria-label="Get started">
        <Button>Create project</Button>
        <Button variant="outline">Import</Button>
      </ButtonGroup.Root>
    </div>
  ),
};

/* ============================================================
 * Split button — Popover now; switch to Menu at GEO-928
 * ============================================================ */

export const SplitButton: Story = {
  render: () => (
    <ButtonGroup.Root attached aria-label="Save" className={WRAP}>
      <Button>Save</Button>
      <Popover.Root>
        <Popover.Trigger
          render={<Button size="icon" srOnly="More save options" icon={<CaretDownIcon />} />}
        />
        <Popover.Portal>
          <Popover.Positioner sideOffset={4} align="end">
            <Popover.Popup aria-label="Save options" className="w-auto min-w-48 p-1">
              {/* Choosing an option closes the popover (Menu replaces this at GEO-928). */}
              <ButtonGroup.Root
                orientation="vertical"
                grow
                variant="ghost"
                className="gap-0"
                aria-label="Save options"
              >
                <Popover.Close render={<Button className="justify-start" />}>
                  Save as draft
                </Popover.Close>
                <Popover.Close render={<Button className="justify-start" />}>
                  Save and publish
                </Popover.Close>
              </ButtonGroup.Root>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </ButtonGroup.Root>
  ),
};

/* ============================================================
 * Nested groups (shadcn)
 * ============================================================ */

export const Nested: Story = {
  render: () => (
    <ButtonGroup.Root stackBelow={false} aria-label="Editor toolbar" className={WRAP}>
      <ButtonGroup.Root attached variant="outline" aria-label="History">
        <Button size="icon" srOnly="Undo" icon={<ArrowCounterClockwiseIcon />} />
        <Button size="icon" srOnly="Redo" icon={<ArrowClockwiseIcon />} />
      </ButtonGroup.Root>
      <Alignment />
    </ButtonGroup.Root>
  ),
};

/* ============================================================
 * Disabled cascade — a disabled group disables every control inside it,
 * like <fieldset disabled> (George, 2026-11-18)
 * ============================================================ */

function DisabledCascadeDemo() {
  const [disabled, setDisabled] = React.useState(true);
  return (
    <div className={`flex flex-col gap-6 ${WRAP}`}>
      <Field.Root>
        <Field.Group direction="row">
          <Switch.Root checked={disabled} onCheckedChange={setDisabled} />
          <Field.Label>Disable the groups</Field.Label>
        </Field.Group>
      </Field.Root>
      <div className="flex flex-col gap-2">
        <Heading>Attached: Select + Input + Button</Heading>
        <ButtonGroup.Root attached disabled={disabled} variant="outline" aria-label="Invite">
          <Select.Root defaultValue="editor" items={{ viewer: "Viewer", editor: "Editor" }}>
            <Select.Trigger aria-label="Role">
              <Select.Value />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner>
                <Select.Popup>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
          <Input aria-label="Email" placeholder="name@example.com" />
          <Button>Invite</Button>
        </ButtonGroup.Root>
      </div>
      <div className="flex flex-col gap-2">
        <Heading>Spaced: Toggle, NumberField, Checkbox, Switch, Button</Heading>
        <ButtonGroup.Root disabled={disabled} stackBelow={false} aria-label="Mixed controls">
          <Toggle>Bold</Toggle>
          <NumberField.Root defaultValue={2} min={0} className="w-32">
            <NumberField.Group inputProps={{ "aria-label": "Quantity" }} />
          </NumberField.Root>
          <Field.Root className="w-auto">
            <Field.Group direction="row">
              <Checkbox.Root />
              <Field.Label>Gift wrap</Field.Label>
            </Field.Group>
          </Field.Root>
          <Field.Root className="w-auto">
            <Field.Group direction="row">
              <Switch.Root />
              <Field.Label>Express</Field.Label>
            </Field.Group>
          </Field.Root>
          <Button>Add to basket</Button>
        </ButtonGroup.Root>
      </div>
    </div>
  );
}

export const DisabledCascade: Story = {
  render: () => <DisabledCascadeDemo />,
};

/* ============================================================
 * States
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className={`flex flex-col gap-5 ${WRAP}`}>
      <Heading>Default</Heading>
      <Alignment />
      <Heading>One button disabled</Heading>
      <ButtonGroup.Root attached variant="outline" aria-label="One disabled">
        <Button>Left</Button>
        <Button disabled>Centre</Button>
        <Button>Right</Button>
      </ButtonGroup.Root>
      <Heading>Whole group disabled</Heading>
      <Alignment disabled />
      <Heading>Loading</Heading>
      <ButtonGroup.Root aria-label="Saving">
        <Button loading>Saving…</Button>
        <Button variant="outline" disabled>
          Cancel
        </Button>
      </ButtonGroup.Root>
      <Heading>Danger</Heading>
      <Alignment color="danger" />
      <p className="text-fg-muted text-sm">
        Valid / error states don&apos;t apply to a group of actions; each Button carries its own
        state.
      </p>
    </div>
  ),
};

/* ============================================================
 * Density
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className={`flex flex-col gap-8 ${WRAP}`}>
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density} className="flex flex-col gap-3">
          <Heading>{density}</Heading>
          <ButtonGroup.Root stackBelow={false} aria-label={`${density} spaced`}>
            <Button>Save</Button>
            <Button variant="outline">Draft</Button>
            <Button variant="ghost">Cancel</Button>
          </ButtonGroup.Root>
          <Alignment />
          <Alignment variant="solid" />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * Themes — every variant × colour, attached + spaced
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className={`flex flex-col gap-8 ${WRAP}`}>
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          aria-label={`${theme} theme`}
          className="bg-surface-base text-fg-default flex flex-col gap-4 rounded-lg p-6"
        >
          <Heading>{theme}</Heading>
          {VARIANTS.map((variant) =>
            COLORS.map((color) => (
              <ButtonGroup.Root
                key={`${variant}-${color}`}
                attached
                variant={variant}
                color={color}
                aria-label={`${variant} ${color}`}
              >
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup.Root>
            )),
          )}
          <ButtonGroup.Root stackBelow={false} aria-label={`${theme} spaced`}>
            <Button>Primary</Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="ghost">Tertiary</Button>
          </ButtonGroup.Root>
          <Alignment disabled />
          <Pagination />
          <div className="bg-fg-default flex flex-col gap-3 rounded-md p-3">
            {VARIANTS.map((variant) => (
              <ButtonGroup.Root
                key={variant}
                attached
                variant={variant}
                color="inverse"
                aria-label={`${variant} inverse`}
              >
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup.Root>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};
