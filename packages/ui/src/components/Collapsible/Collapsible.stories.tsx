import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible } from "./index";

const meta: Meta = {
  title: "Components/Collapsible",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Collapsible.Root>
      <Collapsible.Trigger>
        <span>Toggle content</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="transition-transform"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Collapsible.Trigger>
      <Collapsible.Panel>
        <div className="py-2 text-neutral-600">
          This is the collapsible content. It can be toggled open and closed by clicking the trigger
          above. The panel animates smoothly between states.
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  ),
};
