import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  CopyIcon,
  FloppyDiskIcon,
  GearSixIcon,
  ScissorsIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Tooltip } from "./Tooltip";
import { Button } from "../Button/Button";

const meta: Meta = {
  title: "Components/Tooltip",
};

export default meta;
type Story = StoryObj;

const VARIANTS = ["neutral", "info", "success", "danger"] as const;

/**
 * Portalled tooltips render at <body>, outside any data-theme wrapper.
 * Panels that need themed (or scoped) tooltips pass themselves as the portal container.
 */
function usePortalContainer() {
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  return [el, setEl] as const;
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex justify-center pt-16">
      <Tooltip.Root>
        <Tooltip.Trigger render={<Button variant="outline" />}>Hover or focus me</Tooltip.Trigger>
        <Tooltip.Content>Add to library</Tooltip.Content>
      </Tooltip.Root>
    </div>
  ),
};

/* ============================================================
 * STATES — neutral (default), success (valid), danger (error),
 * info, with icons, and a disabled trigger
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-x-8 gap-y-20 px-4 pb-6 pt-16 sm:grid-cols-2 lg:grid-cols-4">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-20">
          <Tooltip.Root defaultOpen>
            <Tooltip.Trigger render={<Button variant="outline" />}>{variant}</Tooltip.Trigger>
            <Tooltip.Content variant={variant}>
              {variant === "neutral" ? "Default tooltip" : `${variant} tooltip`}
            </Tooltip.Content>
          </Tooltip.Root>
          {variant !== "neutral" && (
            <Tooltip.Root defaultOpen>
              <Tooltip.Trigger render={<Button variant="outline" />}>
                {variant} + icon
              </Tooltip.Trigger>
              <Tooltip.Content variant={variant} showIcon>
                {variant === "success"
                  ? "Changes saved"
                  : variant === "danger"
                    ? "This can't be undone"
                    : "Syncs every 5 minutes"}
              </Tooltip.Content>
            </Tooltip.Root>
          )}
        </div>
      ))}
      <div className="flex flex-col items-center">
        {/* Primer: keep the control focusable (aria-disabled) so the tooltip is reachable by keyboard */}
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger
            render={
              <Button
                disabled
                focusableWhenDisabled
                className="data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--sp-state-disabled-opacity)]"
              />
            }
          >
            Publish
          </Tooltip.Trigger>
          <Tooltip.Content>Add a title before publishing</Tooltip.Content>
        </Tooltip.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * PLACEMENTS — 12 positions (side × align)
 * ============================================================ */

export const Placements: Story = {
  render: () => {
    const sides = ["top", "right", "bottom", "left"] as const;
    const aligns = ["start", "center", "end"] as const;
    return (
      <div className="grid grid-cols-1 gap-x-48 gap-y-20 px-24 py-16 md:grid-cols-3">
        {sides.flatMap((side) =>
          aligns.map((align) => (
            <div key={`${side}-${align}`} className="flex justify-center">
              <Tooltip.Root defaultOpen>
                <Tooltip.Trigger render={<Button variant="outline" size="sm" />}>
                  {side} {align}
                </Tooltip.Trigger>
                <Tooltip.Content side={side} align={align}>
                  {side}-{align}
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
          )),
        )}
      </div>
    );
  },
};

/* ============================================================
 * TOOLBAR — icon-only buttons labelled by their tooltip.
 * Hover one, then slide across: neighbours open instantly with no
 * animation (Emil Kowalski / Base UI warm group).
 * ============================================================ */

const toolbar = [
  { label: "Bold", icon: <TextBIcon />, shortcut: "⌘B" },
  { label: "Italic", icon: <TextItalicIcon />, shortcut: "⌘I" },
  { label: "Underline", icon: <TextUnderlineIcon />, shortcut: "⌘U" },
  { label: "Undo", icon: <ArrowCounterClockwiseIcon />, shortcut: "⌘Z" },
  { label: "Redo", icon: <ArrowClockwiseIcon />, shortcut: "⇧⌘Z" },
];

export const Toolbar: Story = {
  render: () => (
    <Tooltip.Provider>
      <div className="flex justify-center gap-[var(--sp-control-gap)] pt-16">
        {toolbar.map(({ label, icon }) => (
          <Tooltip.Root key={label} type="label">
            <Tooltip.Trigger render={<Button variant="ghost" size="icon" icon={icon} />} />
            <Tooltip.Content>{label}</Tooltip.Content>
          </Tooltip.Root>
        ))}
      </div>
    </Tooltip.Provider>
  ),
};

/* ============================================================
 * KEYBOARD SHORTCUT (Primer keybindingHint, shadcn)
 * ============================================================ */

export const KeyboardShortcut: Story = {
  render: () => (
    <div className="flex flex-wrap justify-center gap-x-16 gap-y-20 pt-16">
      {[
        { label: "Save", icon: <FloppyDiskIcon />, shortcut: "⌘S", keys: "Meta+S" },
        { label: "Copy", icon: <CopyIcon />, shortcut: "⌘C", keys: "Meta+C" },
        { label: "Cut", icon: <ScissorsIcon />, shortcut: "⌘X", keys: "Meta+X" },
      ].map(({ label, icon, shortcut, keys }) => (
        <Tooltip.Root key={label} type="label" defaultOpen>
          <Tooltip.Trigger render={<Button variant="outline" size="icon" icon={icon} />} />
          <Tooltip.Content>
            {label}
            <Tooltip.Shortcut keys={keys}>{shortcut}</Tooltip.Shortcut>
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * LONG CONTENT — wraps at max-w-xs (MUI ~300px, Ant 250px)
 * ============================================================ */

export const LongContent: Story = {
  render: () => (
    <div className="flex justify-center pt-28">
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger render={<Button variant="outline" />}>Retention policy</Tooltip.Trigger>
        <Tooltip.Content>
          Deleted items stay in the bin for 30 days. After that they are removed permanently and
          can&apos;t be restored by support.
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  ),
};

/* ============================================================
 * WITHOUT ARROW
 * ============================================================ */

export const WithoutArrow: Story = {
  render: () => (
    <div className="flex justify-center pt-16">
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger render={<Button variant="outline" />}>No arrow</Tooltip.Trigger>
        <Tooltip.Content arrow={false}>Tooltip without an arrow</Tooltip.Content>
      </Tooltip.Root>
    </div>
  ),
};

/* ============================================================
 * FOLLOW CURSOR (MUI followCursor, Mantine Tooltip.Floating)
 * ============================================================ */

export const FollowCursor: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6 pt-16">
      {(["x", "both"] as const).map((axis) => (
        <Tooltip.Root key={axis} trackCursorAxis={axis}>
          <Tooltip.Trigger
            render={<Button variant="outline" className="h-24 w-full sm:max-w-md" />}
          >
            Tracks the cursor on {axis === "both" ? "both axes" : "the x axis"}
          </Tooltip.Trigger>
          <Tooltip.Content>Following your pointer</Tooltip.Content>
        </Tooltip.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * CONTROLLED + CLOSE ON CLICK
 * ============================================================ */

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="flex flex-col items-center gap-6 pt-16">
        <Tooltip.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger render={<Button variant="outline" />}>
            Controlled trigger
          </Tooltip.Trigger>
          <Tooltip.Content>Opened from outside</Tooltip.Content>
        </Tooltip.Root>
        <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide tooltip" : "Show tooltip"}
        </Button>
        <Tooltip.Root>
          <Tooltip.Trigger closeOnClick={false} render={<Button variant="outline" />}>
            Stays open on click
          </Tooltip.Trigger>
          <Tooltip.Content>closeOnClick=false</Tooltip.Content>
        </Tooltip.Root>
      </div>
    );
  },
};

/* ============================================================
 * SHARED TOOLTIP — one tooltip, many detached triggers (handle + payload)
 * Ant `unique` / Spectrum "one at a time"
 * ============================================================ */

const sharedHandle = Tooltip.createHandle<string>();

export const SharedTooltip: Story = {
  render: () => (
    <div className="flex justify-center gap-[var(--sp-control-gap)] pt-16">
      {[
        { label: "Settings", icon: <GearSixIcon /> },
        { label: "Duplicate", icon: <CopyIcon /> },
        { label: "Delete", icon: <TrashIcon /> },
      ].map(({ label, icon }) => (
        <Tooltip.Trigger
          key={label}
          handle={sharedHandle}
          payload={label}
          aria-label={label}
          render={<Button variant="ghost" size="icon" icon={icon} />}
        />
      ))}
      <Tooltip.Root handle={sharedHandle}>
        {({ payload }) => <Tooltip.Content>{payload}</Tooltip.Content>}
      </Tooltip.Root>
    </div>
  ),
};

/* ============================================================
 * DEFINITION — term in running text (Carbon definition tooltip).
 * The trigger is still a button so keyboard users can reach it.
 * ============================================================ */

export const Definition: Story = {
  render: () => (
    <p className="text-fg-default mx-auto pt-16 text-base sm:max-w-md">
      Your plan includes{" "}
      <Tooltip.Root>
        <Tooltip.Trigger className="focus-visible:sp-focus-ring cursor-help rounded-sm underline decoration-dotted underline-offset-4">
          egress
        </Tooltip.Trigger>
        <Tooltip.Content>Data transferred out of your project</Tooltip.Content>
      </Tooltip.Root>{" "}
      up to 250 GB per month.
    </p>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <p className="text-fg-muted mb-3 text-xs font-medium uppercase tracking-wide">
            {density}
          </p>
          <div className="flex flex-wrap gap-x-40 gap-y-16 px-16 pt-12">
            <Tooltip.Root defaultOpen>
              <Tooltip.Trigger render={<Button variant="outline" />}>Text</Tooltip.Trigger>
              <Tooltip.Content>Add to library</Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root defaultOpen>
              <Tooltip.Trigger render={<Button variant="outline" />}>Icon</Tooltip.Trigger>
              <Tooltip.Content variant="info" showIcon>
                Syncs every 5 minutes
              </Tooltip.Content>
            </Tooltip.Root>
            <Tooltip.Root defaultOpen type="label">
              <Tooltip.Trigger
                render={<Button variant="outline" size="icon" icon={<FloppyDiskIcon />} />}
              />
              <Tooltip.Content>
                Save<Tooltip.Shortcut keys="Meta+S">⌘S</Tooltip.Shortcut>
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * THEMES — every variant (with and without icon) in every theme
 * ============================================================ */

function ThemePanel({ theme }: { theme: "light" | "dark" | "high-contrast" }) {
  const [container, setContainer] = usePortalContainer();
  return (
    <section
      ref={setContainer}
      data-theme={theme}
      className="bg-surface-base text-fg-default relative rounded-lg p-6"
    >
      <p className="text-fg-muted mb-4 text-xs font-semibold uppercase tracking-wide">{theme}</p>
      {container && (
        <div className="grid grid-cols-2 gap-x-6 gap-y-16 pt-12 sm:grid-cols-4">
          {VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-16">
              <Tooltip.Root defaultOpen>
                <Tooltip.Trigger render={<Button variant="outline" size="sm" />}>
                  {variant}
                </Tooltip.Trigger>
                <Tooltip.Content variant={variant} container={container}>
                  {variant} tooltip
                </Tooltip.Content>
              </Tooltip.Root>
              <Tooltip.Root defaultOpen>
                <Tooltip.Trigger render={<Button variant="outline" size="sm" />}>
                  {variant === "neutral" ? "shortcut" : `${variant} icon`}
                </Tooltip.Trigger>
                <Tooltip.Content variant={variant} showIcon container={container}>
                  {variant === "neutral" ? (
                    <>
                      Save<Tooltip.Shortcut keys="Meta+S">⌘S</Tooltip.Shortcut>
                    </>
                  ) : (
                    `With ${variant} icon`
                  )}
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <ThemePanel key={theme} theme={theme} />
      ))}
    </div>
  ),
};
