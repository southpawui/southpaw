import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./index";
import { Field } from "../Field";

const meta: Meta = {
  title: "Components/Select",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Field.Root className="w-64">
      <Field.Label>Favourite fruit</Field.Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Select a fruit..." />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={4}>
            <Select.Popup>
              <Select.List>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
                <SelectItem value="mango">Mango</SelectItem>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  ),
};

export const Grouped: StoryObj = {
  render: () => (
    <Field.Root className="w-64">
      <Field.Label>Food preference</Field.Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Select a food..." />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={4}>
            <Select.Popup>
              <Select.List>
                <Select.Group>
                  <Select.GroupLabel>Fruits</Select.GroupLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                </Select.Group>
                <Select.Separator />
                <Select.Group>
                  <Select.GroupLabel>Vegetables</Select.GroupLabel>
                  <SelectItem value="carrot">Carrot</SelectItem>
                  <SelectItem value="broccoli">Broccoli</SelectItem>
                </Select.Group>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  ),
};

export const WithError: StoryObj = {
  render: () => (
    <Field.Root className="w-64" invalid>
      <Field.Label>Country</Field.Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Select a country..." />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={4}>
            <Select.Popup>
              <Select.List>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <Field.Error>Please select a country.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <Field.Root className="w-64" disabled>
      <Field.Label>Region</Field.Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Select a region..." />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
      </Select.Root>
      <Field.Description>Contact support to change your region.</Field.Description>
    </Field.Root>
  ),
};

/* ----- Helper component to reduce story boilerplate ----- */
function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Select.Item value={value}>
      <Select.ItemIndicator>
        <CheckIcon />
      </Select.ItemIndicator>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 4.5L6 7.5L9 4.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 6L5 9L10 3" />
    </svg>
  );
}
