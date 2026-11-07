import type { Meta, StoryObj } from "@storybook/react";
import { Autocomplete } from "./index";

const meta: Meta = {
  title: "Components/Autocomplete",
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
    <Autocomplete.Root>
      <Autocomplete.Input placeholder="Search fruits..." className="w-64" />
      <Autocomplete.Portal>
        <Autocomplete.Positioner sideOffset={4}>
          <Autocomplete.Popup>
            <Autocomplete.List>
              {fruits.map((fruit) => (
                <Autocomplete.Item key={fruit} value={fruit}>
                  {fruit}
                </Autocomplete.Item>
              ))}
            </Autocomplete.List>
            <Autocomplete.Empty>No fruits found.</Autocomplete.Empty>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
      <Autocomplete.Status />
    </Autocomplete.Root>
  ),
};
