import type { Meta, StoryObj } from "@storybook/react";
import { Meter } from "./Meter";

const meta: Meta = {
  title: "Components/Meter",
};

export default meta;
type Story = StoryObj;

/* ---- Helper ---- */
function MeterDemo({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof Meter.Root>) {
  return (
    <Meter.Root {...props}>
      <div className="flex justify-between">
        <Meter.Label>{label}</Meter.Label>
        <Meter.Value />
      </div>
      <Meter.Track>
        <Meter.Indicator />
      </Meter.Track>
    </Meter.Root>
  );
}

/* ============================================================
 * DEFAULT (no thresholds)
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <MeterDemo label="Storage used" value={45} />
      <MeterDemo label="CPU load" value={72} />
      <MeterDemo label="Memory" value={90} />
    </div>
  ),
};

/* ============================================================
 * AUTO COLOUR (with thresholds)
 * ============================================================ */

export const AutoColour: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-md">
      <div>
        <p className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
          Low optimum (e.g. CPU — lower is better)
        </p>
        <div className="flex flex-col gap-4">
          <MeterDemo label="CPU 15%" value={15} low={30} high={70} optimum={0} />
          <MeterDemo label="CPU 50%" value={50} low={30} high={70} optimum={0} />
          <MeterDemo label="CPU 85%" value={85} low={30} high={70} optimum={0} />
        </div>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
          High optimum (e.g. battery — higher is better)
        </p>
        <div className="flex flex-col gap-4">
          <MeterDemo label="Battery 90%" value={90} low={20} high={60} optimum={100} />
          <MeterDemo label="Battery 40%" value={40} low={20} high={60} optimum={100} />
          <MeterDemo label="Battery 10%" value={10} low={20} high={60} optimum={100} />
        </div>
      </div>

      <div>
        <p className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
          Middle optimum (e.g. temperature — middle is ideal)
        </p>
        <div className="flex flex-col gap-4">
          <MeterDemo label="Temp 50°" value={50} low={30} high={70} optimum={50} />
          <MeterDemo label="Temp 20°" value={20} low={30} high={70} optimum={50} />
          <MeterDemo label="Temp 80°" value={80} low={30} high={70} optimum={50} />
        </div>
      </div>
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
        <Meter.Root key={size} value={65}>
          <div className="flex justify-between">
            <Meter.Label>{size}</Meter.Label>
            <Meter.Value />
          </div>
          <Meter.Track size={size}>
            <Meter.Indicator />
          </Meter.Track>
        </Meter.Root>
      ))}
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
            <MeterDemo label="Default (no thresholds)" value={60} />
            <MeterDemo label="Good (low CPU)" value={15} low={30} high={70} optimum={0} />
            <MeterDemo label="Warning (mid CPU)" value={50} low={30} high={70} optimum={0} />
            <MeterDemo label="Danger (high CPU)" value={85} low={30} high={70} optimum={0} />
          </div>
        </div>
      ))}
    </div>
  ),
};
