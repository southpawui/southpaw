import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./index";

const meta: Meta = {
  title: "Components/Select",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Select.Root>
      <Select.Trigger className="w-48" aria-label="Select an option">
        <Select.Value placeholder="Select a fruit..." />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={4}>
          <Select.Popup>
            <Select.List>
              <Select.Item value="apple">
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
              <Select.Item value="banana">
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>Banana</Select.ItemText>
              </Select.Item>
              <Select.Item value="cherry">
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>Cherry</Select.ItemText>
              </Select.Item>
              <Select.Item value="grape">
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>Grape</Select.ItemText>
              </Select.Item>
              <Select.Item value="mango">
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>Mango</Select.ItemText>
              </Select.Item>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ),
};

export const Grouped: StoryObj = {
  render: () => (
    <Select.Root>
      <Select.Trigger className="w-48" aria-label="Select an option">
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
                <Select.Item value="apple">
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                  <Select.ItemText>Apple</Select.ItemText>
                </Select.Item>
                <Select.Item value="banana">
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                  <Select.ItemText>Banana</Select.ItemText>
                </Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.GroupLabel>Vegetables</Select.GroupLabel>
                <Select.Item value="carrot">
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                  <Select.ItemText>Carrot</Select.ItemText>
                </Select.Item>
                <Select.Item value="broccoli">
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                  <Select.ItemText>Broccoli</Select.ItemText>
                </Select.Item>
              </Select.Group>
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  ),
};

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
    >
      <path d="M2 6L5 9L10 3" />
    </svg>
  );
}
