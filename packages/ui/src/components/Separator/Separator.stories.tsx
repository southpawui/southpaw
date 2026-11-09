import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./Separator";

const meta: Meta = {
  title: "Components/Separator",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * DEFAULT (horizontal)
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <p className="text-fg-default text-sm">Above the separator</p>
      <Separator className="my-4" />
      <p className="text-fg-default text-sm">Below the separator</p>
    </div>
  ),
};

/* ============================================================
 * VERTICAL
 * ============================================================ */

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center gap-4">
      <span className="text-fg-default text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-fg-default text-sm">Right</span>
    </div>
  ),
};

/* ============================================================
 * WITH LABEL
 * ============================================================ */

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-md">
      <div>
        <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">
          Center (default)
        </p>
        <Separator label="OR" />
      </div>

      <div>
        <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">Start</p>
        <Separator label="Section 1" labelPosition="start" />
      </div>

      <div>
        <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">End</p>
        <Separator label="Read more" labelPosition="end" />
      </div>

      <div>
        <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">
          In context
        </p>
        <p className="text-fg-default mb-4 text-sm">Sign in with email</p>
        <Separator label="OR" />
        <p className="text-fg-default mt-4 text-sm">Sign in with Google</p>
      </div>
    </div>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="bg-surface-base rounded-lg p-6">
          <p className="text-fg-muted mb-4 text-xs font-semibold uppercase tracking-wide">
            {theme}
          </p>
          <div className="flex flex-col gap-6 sm:max-w-md">
            <div>
              <p className="text-fg-default text-sm">Horizontal</p>
              <Separator className="my-3" />
              <p className="text-fg-default text-sm">Content below</p>
            </div>

            <Separator label="OR" />

            <div className="flex h-8 items-center gap-3">
              <span className="text-fg-default text-sm">Left</span>
              <Separator orientation="vertical" />
              <span className="text-fg-default text-sm">Right</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};
