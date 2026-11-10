import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";

const meta: Meta = {
  title: "Components/Progress",
};

export default meta;
type Story = StoryObj;

/* ---- Helper ---- */
function ProgressDemo({
  label,
  value,
  ...props
}: { label: string; value: number | null } & Omit<
  React.ComponentProps<typeof Progress.Root>,
  "value"
>) {
  return (
    <Progress.Root value={value} {...props}>
      <div className="flex justify-between">
        <Progress.Label>{label}</Progress.Label>
        {value !== null && <Progress.Value />}
      </div>
      <Progress.Track>
        <Progress.Indicator />
      </Progress.Track>
    </Progress.Root>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <ProgressDemo label="Loading..." value={60} />
      <ProgressDemo label="Uploading" value={25} />
      <ProgressDemo label="Complete" value={100} />
      <ProgressDemo label="Empty" value={0} />
    </div>
  ),
};

/* ============================================================
 * SIZES
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Progress.Root key={size} value={65}>
          <div className="flex justify-between">
            <Progress.Label>{size}</Progress.Label>
            <Progress.Value />
          </div>
          <Progress.Track size={size}>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * COLOURS
 * ============================================================ */

export const Colours: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      {(["default", "brand", "success", "danger", "warning"] as const).map((color) => (
        <ProgressDemo
          key={color}
          label={color.charAt(0).toUpperCase() + color.slice(1)}
          value={70}
          color={color}
        />
      ))}
    </div>
  ),
};

/* ============================================================
 * INDETERMINATE
 * ============================================================ */

export const Indeterminate: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <ProgressDemo label="Processing..." value={null} />
      <ProgressDemo label="Uploading..." value={null} color="brand" />
      <ProgressDemo label="Validating..." value={null} color="success" />
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
          <div className="flex flex-col gap-4 sm:max-w-md">
            {(["default", "brand", "success", "danger", "warning"] as const).map((color) => (
              <ProgressDemo
                key={color}
                label={color.charAt(0).toUpperCase() + color.slice(1)}
                value={65}
                color={color}
              />
            ))}
            <ProgressDemo label="Indeterminate" value={null} color="brand" />
          </div>
        </div>
      ))}
    </div>
  ),
};
