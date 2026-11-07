import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta = {
  title: "Components/Tooltip",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 px-4 text-sm font-medium hover:bg-neutral-100">
          Hover me
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={8}>
            <Tooltip.Popup>
              This is a tooltip
              <Tooltip.Arrow />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const Positions: StoryObj = {
  render: () => (
    <Tooltip.Provider>
      <div className="flex items-center gap-4 p-16">
        <Tooltip.Root>
          <Tooltip.Trigger className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 px-4 text-sm font-medium hover:bg-neutral-100">
            Top
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner side="top" sideOffset={8}>
              <Tooltip.Popup>
                Top tooltip
                <Tooltip.Arrow />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 px-4 text-sm font-medium hover:bg-neutral-100">
            Bottom
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner side="bottom" sideOffset={8}>
              <Tooltip.Popup>
                Bottom tooltip
                <Tooltip.Arrow />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 px-4 text-sm font-medium hover:bg-neutral-100">
            Left
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner side="left" sideOffset={8}>
              <Tooltip.Popup>
                Left tooltip
                <Tooltip.Arrow />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>

        <Tooltip.Root>
          <Tooltip.Trigger className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 px-4 text-sm font-medium hover:bg-neutral-100">
            Right
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Positioner side="right" sideOffset={8}>
              <Tooltip.Popup>
                Right tooltip
                <Tooltip.Arrow />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  ),
};
