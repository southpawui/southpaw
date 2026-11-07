import type { Meta, StoryObj } from "@storybook/react";
import { NumberField } from "./NumberField";

const meta: Meta = {
  title: "Components/NumberField",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <NumberField.Root defaultValue={0}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="mb-1 text-sm font-medium">Number</label>
      <NumberField.Group>
        <NumberField.Decrement>
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Input aria-label="Number value" />
        <NumberField.Increment>
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <NumberField.Root defaultValue={1} min={1} max={10}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="mb-1 text-sm font-medium">Quantity</label>
      <NumberField.Group>
        <NumberField.Decrement>
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Input aria-label="Number value" />
        <NumberField.Increment>
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const WithStep: Story = {
  render: () => (
    <NumberField.Root defaultValue={0} step={5}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="mb-1 text-sm font-medium">Step by 5</label>
      <NumberField.Group>
        <NumberField.Decrement>
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Input aria-label="Number value" />
        <NumberField.Increment>
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  ),
};

export const WithScrubArea: Story = {
  render: () => (
    <NumberField.Root defaultValue={50}>
      <NumberField.ScrubArea>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="mb-1 cursor-ew-resize text-sm font-medium">Drag to scrub</label>
      </NumberField.ScrubArea>
      <NumberField.Group>
        <NumberField.Decrement>
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Input aria-label="Number value" />
        <NumberField.Increment>
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  ),
};

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}
