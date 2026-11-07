import type { Meta, StoryObj } from "@storybook/react";
import { Combobox } from "./index";

const meta: Meta = {
  title: "Components/Combobox",
};

export default meta;

const fruits = [
  "Apple",
  "Banana",
  "Blueberry",
  "Cherry",
  "Grape",
  "Kiwi",
  "Lemon",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Pineapple",
  "Raspberry",
  "Strawberry",
  "Watermelon",
];

export const Default: StoryObj = {
  render: () => (
    <Combobox.Root>
      <Combobox.Label>Favourite fruit</Combobox.Label>
      <Combobox.Input placeholder="Search fruits..." className="w-64" />
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.List>
              {fruits.map((fruit) => (
                <Combobox.Item key={fruit} value={fruit}>
                  <Combobox.ItemIndicator>
                    <CheckIcon />
                  </Combobox.ItemIndicator>
                  {fruit}
                </Combobox.Item>
              ))}
            </Combobox.List>
            <Combobox.Empty>No fruits found.</Combobox.Empty>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
      <Combobox.Status />
    </Combobox.Root>
  ),
};

export const WithTrigger: StoryObj = {
  render: () => (
    <Combobox.Root>
      <Combobox.Label>Select a fruit</Combobox.Label>
      <Combobox.InputGroup>
        <Combobox.Input placeholder="Type to search..." className="w-64 pr-8" />
        <Combobox.Trigger className="absolute right-2">
          <ChevronDownIcon />
        </Combobox.Trigger>
      </Combobox.InputGroup>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4}>
          <Combobox.Popup>
            <Combobox.List>
              {fruits.map((fruit) => (
                <Combobox.Item key={fruit} value={fruit}>
                  <Combobox.ItemIndicator>
                    <CheckIcon />
                  </Combobox.ItemIndicator>
                  {fruit}
                </Combobox.Item>
              ))}
            </Combobox.List>
            <Combobox.Empty>No results found.</Combobox.Empty>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
      <Combobox.Status />
    </Combobox.Root>
  ),
};

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
