import type { Meta, StoryObj } from "@storybook/react";
import { PreviewCard } from "./PreviewCard";

const meta: Meta = {
  title: "Components/PreviewCard",
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <p className="text-sm">
      Check out{" "}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="https://github.com/southpaw-ui">Southpaw UI</PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner sideOffset={8}>
            <PreviewCard.Popup>
              <div className="flex flex-col gap-2">
                <div className="h-24 rounded bg-neutral-100" />
                <div>
                  <p className="text-sm font-semibold">Southpaw UI</p>
                  <p className="text-xs text-neutral-500">
                    A React component library built on Base UI with Tailwind styling.
                  </p>
                </div>
              </div>
            </PreviewCard.Popup>
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>{" "}
      for more details.
    </p>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <p className="text-sm">
      Hover over{" "}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="https://example.com">this link</PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner sideOffset={8}>
            <PreviewCard.Popup>
              <PreviewCard.Arrow />
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold">Example Website</p>
                <p className="text-xs text-neutral-500">
                  This is a preview of the linked content. It appears on hover to give users a quick
                  glance at what they will find.
                </p>
              </div>
            </PreviewCard.Popup>
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>{" "}
      to see a preview.
    </p>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <p className="text-sm">
      Posted by{" "}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#">@georgeyiakoumi</PreviewCard.Trigger>
        <PreviewCard.Portal>
          <PreviewCard.Positioner sideOffset={8}>
            <PreviewCard.Popup>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-200" />
                <div>
                  <p className="text-sm font-semibold">George Yiakoumi</p>
                  <p className="text-xs text-neutral-500">@georgeyiakoumi</p>
                  <p className="mt-2 text-xs text-neutral-600">
                    Building Southpaw UI. Design systems enthusiast.
                  </p>
                </div>
              </div>
            </PreviewCard.Popup>
          </PreviewCard.Positioner>
        </PreviewCard.Portal>
      </PreviewCard.Root>
    </p>
  ),
};
