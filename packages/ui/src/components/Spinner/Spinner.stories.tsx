import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./Spinner";

const meta: Meta = {
  title: "Components/Spinner",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

/* ============================================================
 * WITH LABEL
 * ============================================================ */

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Spinner size="md" label="Loading..." />
      <Spinner size="sm" label="Saving changes..." className="text-fg-muted" />
      <Spinner size="lg" label="Processing payment..." className="text-brand" />
    </div>
  ),
};

/* ============================================================
 * DOTS
 * ============================================================ */

export const Dots: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        <Spinner variant="dots" size="sm" />
        <Spinner variant="dots" size="md" />
        <Spinner variant="dots" size="lg" />
      </div>
      <Spinner variant="dots" size="md" label="Typing..." className="text-fg-muted" />
    </div>
  ),
};

/* ============================================================
 * COLOURS
 * ============================================================ */

export const Colours: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        <Spinner size="md" className="text-fg-default" />
        <Spinner size="md" className="text-brand" />
        <Spinner size="md" className="text-danger" />
        <Spinner size="md" className="text-success" />
        <Spinner size="md" className="text-fg-muted" />
      </div>
      <div className="flex items-center gap-6">
        <Spinner variant="dots" size="md" className="text-fg-default" />
        <Spinner variant="dots" size="md" className="text-brand" />
        <Spinner variant="dots" size="md" className="text-danger" />
        <Spinner variant="dots" size="md" className="text-success" />
        <Spinner variant="dots" size="md" className="text-fg-muted" />
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
        <div
          key={theme}
          data-theme={theme}
          className="bg-surface-base text-fg-default rounded-lg p-6"
        >
          <p className="text-fg-muted mb-4 text-xs font-semibold uppercase tracking-wide">
            {theme}
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
            <div className="flex items-center gap-6">
              <Spinner size="md" />
              <Spinner size="md" className="text-brand" />
              <Spinner size="md" className="text-danger" />
              <Spinner size="md" className="text-success" />
              <Spinner size="md" className="text-fg-muted" />
            </div>
            <div className="flex items-center gap-6">
              <Spinner variant="dots" size="md" />
              <Spinner variant="dots" size="md" className="text-brand" />
              <Spinner variant="dots" size="md" className="text-danger" />
              <Spinner variant="dots" size="md" className="text-success" />
              <Spinner variant="dots" size="md" className="text-fg-muted" />
            </div>
            <Spinner size="sm" label="Loading data..." />
            <Spinner variant="dots" size="sm" label="Typing..." />
          </div>
        </div>
      ))}
    </div>
  ),
};
