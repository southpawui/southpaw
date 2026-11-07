import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./index";

const meta: Meta = {
  title: "Components/Accordion",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Accordion.Root defaultValue={[0]}>
      <Accordion.Item>
        <Accordion.Header>
          <Accordion.Trigger>
            What is Southpaw UI?
            <ChevronIcon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <div className="pb-4 text-neutral-600">
            Southpaw UI is an open-source React component library built on Base UI and styled with
            Tailwind CSS v4.
          </div>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>
          <Accordion.Trigger>
            How do I install it?
            <ChevronIcon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <div className="pb-4 text-neutral-600">
            Install via your package manager of choice: pnpm add @southpawui/ui.
          </div>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>
          <Accordion.Trigger>
            Is it accessible?
            <ChevronIcon />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>
          <div className="pb-4 text-neutral-600">
            Yes. All components are built on Base UI which provides robust accessibility out of the
            box, following WAI-ARIA patterns.
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

function ChevronIcon() {
  return (
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
  );
}
