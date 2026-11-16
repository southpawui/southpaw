import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PreviewCard, type PreviewCardSize } from "./PreviewCard";
import { Avatar } from "../Avatar/Avatar";

const meta: Meta = {
  title: "Components/PreviewCard",
};

export default meta;
type Story = StoryObj;

/**
 * Portalled cards render at <body>, outside any data-theme wrapper.
 * Panels that need themed cards pass themselves as the portal container.
 */
function usePortalContainer() {
  const [el, setEl] = React.useState<HTMLElement | null>(null);
  return [el, setEl] as const;
}

/**
 * Static stories show several open cards on one tall page. Keep each card on the
 * side it was given and visible even when its trigger is outside the viewport
 * (the real component hides detached cards — Mantine `hideDetached`).
 */
const STATIC_POSITIONER = {
  className: "data-[anchor-hidden]:visible",
  collisionAvoidance: { side: "none", align: "none" },
} as const;

/* ------------------------------------------------------------
 * Reusable card bodies
 * ------------------------------------------------------------ */

function LinkPreview() {
  return (
    <>
      <PreviewCard.Media>
        <div className="from-info-subtle to-success-subtle size-full bg-gradient-to-br" />
      </PreviewCard.Media>
      <div className="flex flex-col gap-1">
        <PreviewCard.Title>Southpaw UI</PreviewCard.Title>
        <PreviewCard.Description>
          GOV.UK-level rigour with shadcn&apos;s ergonomics, built on Base UI.
        </PreviewCard.Description>
        <p className="text-fg-muted text-xs">github.com/southpawui/southpaw</p>
      </div>
    </>
  );
}

function ProfilePreview({
  name = "Ada Lovelace",
  handle = "ada",
  initials = "AL",
  bio = "Wrote the first published algorithm intended for a machine.",
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Avatar.Root size="lg" tooltip={false}>
          <Avatar.Image src="" alt="" />
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar.Root>
        <div className="flex min-w-0 flex-col">
          <PreviewCard.Title>{name}</PreviewCard.Title>
          <p className="text-fg-muted text-sm">@{handle}</p>
        </div>
      </div>
      <PreviewCard.Description>{bio}</PreviewCard.Description>
      <p className="text-fg-muted flex gap-4 text-xs">
        <span>
          <strong className="text-fg-default font-semibold">1,843</strong> followers
        </span>
        <span>
          <strong className="text-fg-default font-semibold">12</strong> repositories
        </span>
      </p>
    </>
  );
}

/* ------------------------------------------------------------
 * Default — link preview in running text
 * ------------------------------------------------------------ */

export const Default: Story = {
  render: () => (
    <p className="text-fg-default text-sm sm:max-w-md">
      Read the source on{" "}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="https://github.com/southpawui/southpaw">
          GitHub
        </PreviewCard.Trigger>
        <PreviewCard.Content>
          <LinkPreview />
        </PreviewCard.Content>
      </PreviewCard.Root>{" "}
      before you install.
    </p>
  ),
};

/* ------------------------------------------------------------
 * Profile — Avatar + name + bio + stats
 * ------------------------------------------------------------ */

export const Profile: Story = {
  render: () => (
    <p className="text-fg-default text-sm sm:max-w-md">
      Reviewed by{" "}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="#ada">@ada</PreviewCard.Trigger>
        <PreviewCard.Content size="sm" arrow>
          <ProfilePreview />
        </PreviewCard.Content>
      </PreviewCard.Root>
      .
    </p>
  ),
};

/* ------------------------------------------------------------
 * Definition — glossary term
 * ------------------------------------------------------------ */

export const Definition: Story = {
  render: () => (
    <p className="text-fg-default text-sm sm:max-w-md">
      Every control meets the{" "}
      <PreviewCard.Root>
        <PreviewCard.Trigger href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum">
          minimum target size
        </PreviewCard.Trigger>
        <PreviewCard.Content size="sm">
          <PreviewCard.Title>Target size (minimum)</PreviewCard.Title>
          <PreviewCard.Description>
            WCAG 2.5.8: pointer targets are at least 24 × 24 CSS pixels, or have enough spacing.
          </PreviewCard.Description>
        </PreviewCard.Content>
      </PreviewCard.Root>
      .
    </p>
  ),
};

/* ------------------------------------------------------------
 * Placements — open by default so every side is visible
 * ------------------------------------------------------------ */

const SIDES = ["top", "right", "bottom", "left"] as const;

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-x-96 gap-y-64 px-80 py-48">
      {SIDES.map((side) => (
        <div key={side} className="flex justify-center">
          <PreviewCard.Root defaultOpen>
            <PreviewCard.Trigger href={`#${side}`}>{side}</PreviewCard.Trigger>
            <PreviewCard.Content positionerProps={STATIC_POSITIONER} side={side} size="sm" arrow>
              <PreviewCard.Title>Placed {side}</PreviewCard.Title>
              <PreviewCard.Description>
                &quot;side&quot; prop; in real use it flips when there isn&apos;t room.
              </PreviewCard.Description>
            </PreviewCard.Content>
          </PreviewCard.Root>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------
 * Sizes — sm / md / lg
 * ------------------------------------------------------------ */

const SIZES: PreviewCardSize[] = ["sm", "md", "lg"];

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-y-72 pb-72">
      {SIZES.map((size) => (
        <div key={size}>
          <PreviewCard.Root defaultOpen>
            <PreviewCard.Trigger href={`#${size}`}>size=&quot;{size}&quot;</PreviewCard.Trigger>
            <PreviewCard.Content
              positionerProps={STATIC_POSITIONER}
              size={size}
              side="right"
              align="start"
            >
              <PreviewCard.Title>{size} card</PreviewCard.Title>
              <PreviewCard.Description>
                {size === "sm" ? "256px" : size === "md" ? "320px (default)" : "384px"} wide, never
                wider than the viewport allows.
              </PreviewCard.Description>
            </PreviewCard.Content>
          </PreviewCard.Root>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------
 * Group — first card waits, neighbours open instantly (Emil)
 * ------------------------------------------------------------ */

const PEOPLE = [
  {
    name: "Ada Lovelace",
    handle: "ada",
    initials: "AL",
    bio: "Wrote the first published algorithm intended for a machine.",
  },
  {
    name: "Grace Hopper",
    handle: "grace",
    initials: "GH",
    bio: "Built the first compiler and popularised machine-independent languages.",
  },
  {
    name: "Alan Turing",
    handle: "alan",
    initials: "AT",
    bio: "Formalised computation with the Turing machine.",
  },
];

export const Group: Story = {
  render: () => (
    <PreviewCard.Group>
      <p className="text-fg-default text-sm sm:max-w-md">
        Contributors:{" "}
        {PEOPLE.map((person, i) => (
          <React.Fragment key={person.handle}>
            <PreviewCard.Root>
              <PreviewCard.Trigger href={`#${person.handle}`}>@{person.handle}</PreviewCard.Trigger>
              <PreviewCard.Content size="sm">
                <ProfilePreview {...person} />
              </PreviewCard.Content>
            </PreviewCard.Root>
            {i < PEOPLE.length - 1 ? ", " : "."}
          </React.Fragment>
        ))}
      </p>
      <p className="text-fg-muted mt-2 text-xs">
        The first card opens after 500ms; move along the links and the next ones open instantly.
      </p>
    </PreviewCard.Group>
  ),
};

/* ------------------------------------------------------------
 * SharedCard — one card, many triggers (handle + payload + Viewport)
 * ------------------------------------------------------------ */

type Person = (typeof PEOPLE)[number];
const sharedHandle = PreviewCard.createHandle<Person>();

function SharedCardDemo() {
  // Anchor the shared card to the list, not to each link, so it never covers
  // the other triggers (their names have different widths).
  const listRef = React.useRef<HTMLUListElement>(null);
  return (
    <div className="flex flex-col gap-2 sm:max-w-md">
      <ul ref={listRef} className="text-fg-default flex w-fit flex-col gap-1 text-sm">
        {PEOPLE.map((person) => (
          <li key={person.handle}>
            <PreviewCard.Trigger handle={sharedHandle} payload={person} href={`#${person.handle}`}>
              {person.name}
            </PreviewCard.Trigger>
          </li>
        ))}
      </ul>
      <PreviewCard.Root handle={sharedHandle}>
        {({ payload }) => (
          <PreviewCard.Portal>
            <PreviewCard.Positioner side="right" align="start" anchor={listRef}>
              <PreviewCard.Popup size="sm">
                <PreviewCard.Viewport>
                  {payload && <ProfilePreview {...payload} />}
                </PreviewCard.Viewport>
              </PreviewCard.Popup>
            </PreviewCard.Positioner>
          </PreviewCard.Portal>
        )}
      </PreviewCard.Root>
    </div>
  );
}

export const SharedCard: Story = { render: () => <SharedCardDemo /> };

/* ------------------------------------------------------------
 * Disabled — the link still works, no card
 * ------------------------------------------------------------ */

export const Disabled: Story = {
  render: () => (
    <p className="text-fg-default text-sm sm:max-w-md">
      Previews are off for{" "}
      <PreviewCard.Root disabled>
        <PreviewCard.Trigger href="#disabled">this link</PreviewCard.Trigger>
        <PreviewCard.Content>
          <LinkPreview />
        </PreviewCard.Content>
      </PreviewCard.Root>
      ; it still navigates.
    </p>
  ),
};

/* ------------------------------------------------------------
 * Touch — opt-in long-press
 * ------------------------------------------------------------ */

export const Touch: Story = {
  render: () => (
    <p className="text-fg-default text-sm sm:max-w-md">
      On a touch device, long-press{" "}
      <PreviewCard.Root touch>
        <PreviewCard.Trigger href="#touch">this link</PreviewCard.Trigger>
        <PreviewCard.Content size="sm">
          <PreviewCard.Title>Opened by long-press</PreviewCard.Title>
          <PreviewCard.Description>
            A normal tap still follows the link. Off by default.
          </PreviewCard.Description>
        </PreviewCard.Content>
      </PreviewCard.Root>{" "}
      to preview it.
    </p>
  ),
};

/* ------------------------------------------------------------
 * Density
 * ------------------------------------------------------------ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-y-64 pb-64">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <PreviewCard.Root defaultOpen>
            <PreviewCard.Trigger href={`#${density}`}>{density}</PreviewCard.Trigger>
            <PreviewCard.Content
              positionerProps={STATIC_POSITIONER}
              side="right"
              align="start"
              size="sm"
            >
              <ProfilePreview />
            </PreviewCard.Content>
          </PreviewCard.Root>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------
 * Themes — link preview (arrow) + profile, every size, 3 themes
 * ------------------------------------------------------------ */

function ThemePanel({ theme }: { theme: "light" | "dark" | "high-contrast" }) {
  const [container, setContainer] = usePortalContainer();
  return (
    <section
      ref={setContainer}
      data-theme={theme}
      className="bg-surface-base text-fg-default relative rounded-lg p-6"
    >
      <h3 className="text-fg-muted mb-4 text-xs font-semibold uppercase tracking-wide">{theme}</h3>
      {container && (
        <div className="flex justify-between gap-x-6 pb-80 text-sm">
          <span>
            <PreviewCard.Root defaultOpen>
              <PreviewCard.Trigger href="#lg">Link preview (lg, arrow)</PreviewCard.Trigger>
              <PreviewCard.Content
                positionerProps={STATIC_POSITIONER}
                size="lg"
                arrow
                align="start"
                container={container}
              >
                <LinkPreview />
              </PreviewCard.Content>
            </PreviewCard.Root>
          </span>
          <span>
            <PreviewCard.Root defaultOpen>
              <PreviewCard.Trigger href="#sm">Definition (sm, arrow)</PreviewCard.Trigger>
              <PreviewCard.Content
                positionerProps={STATIC_POSITIONER}
                size="sm"
                arrow
                container={container}
              >
                <PreviewCard.Title>Target size (minimum)</PreviewCard.Title>
                <PreviewCard.Description>
                  WCAG 2.5.8: pointer targets are at least 24 × 24 CSS pixels.
                </PreviewCard.Description>
              </PreviewCard.Content>
            </PreviewCard.Root>
          </span>
          <span>
            <PreviewCard.Root defaultOpen>
              <PreviewCard.Trigger href="#md">Profile (md)</PreviewCard.Trigger>
              <PreviewCard.Content
                positionerProps={STATIC_POSITIONER}
                size="md"
                align="end"
                container={container}
              >
                <ProfilePreview />
              </PreviewCard.Content>
            </PreviewCard.Root>
          </span>
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
