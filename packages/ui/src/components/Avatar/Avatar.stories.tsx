import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta = {
  title: "Components/Avatar",
};

export default meta;
type Story = StoryObj;

/* ---- Helper ---- */
function DemoAvatar({
  initials = "GY",
  src,
  children,
  ...props
}: { initials?: string; src?: string } & React.ComponentProps<typeof Avatar.Root>) {
  return (
    <Avatar.Root {...props}>
      <Avatar.Image src={src ?? ""} alt={initials} />
      <Avatar.Fallback>{initials}</Avatar.Fallback>
      {children}
    </Avatar.Root>
  );
}

const avatarSrc = "https://i.pravatar.cc/150?u=southpaw";

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar.Root>
        <Avatar.Image src={avatarSrc} alt="George Yiakoumi" />
        <Avatar.Fallback>GY</Avatar.Fallback>
      </Avatar.Root>
      <DemoAvatar initials="GY" />
      <DemoAvatar initials="AB" />
    </div>
  ),
};

/* ============================================================
 * SIZES
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <DemoAvatar size="sm" initials="S" />
      <DemoAvatar size="md" initials="M" />
      <DemoAvatar size="lg" initials="L" />
      <Avatar.Root size="sm">
        <Avatar.Image src={avatarSrc} alt="Small" />
        <Avatar.Fallback>S</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="md">
        <Avatar.Image src={avatarSrc} alt="Medium" />
        <Avatar.Fallback>M</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="lg">
        <Avatar.Image src={avatarSrc} alt="Large" />
        <Avatar.Fallback>L</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
};

/* ============================================================
 * SHAPES
 * ============================================================ */

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <DemoAvatar shape="circle" initials="GY" />
      <DemoAvatar shape="square" initials="GY" />
      <Avatar.Root shape="circle">
        <Avatar.Image src={avatarSrc} alt="Circle" />
        <Avatar.Fallback>C</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root shape="square">
        <Avatar.Image src={avatarSrc} alt="Square" />
        <Avatar.Fallback>S</Avatar.Fallback>
      </Avatar.Root>
    </div>
  ),
};

/* ============================================================
 * WITH STATUS
 * ============================================================ */

export const WithStatus: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["online", "offline", "busy", "away"] as const).map((status) => (
        <Avatar.Root key={status}>
          <Avatar.Image src={avatarSrc} alt={status} />
          <Avatar.Fallback>GY</Avatar.Fallback>
          <Avatar.Status status={status} />
        </Avatar.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * GROUP
 * ============================================================ */

export const GroupStory: Story = {
  name: "Group",
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
          All visible
        </p>
        <Avatar.Group>
          <DemoAvatar initials="GY" />
          <DemoAvatar initials="AB" />
          <DemoAvatar initials="CD" />
        </Avatar.Group>
      </div>
      <div>
        <p className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
          With overflow (max=3)
        </p>
        <Avatar.Group max={3}>
          <DemoAvatar initials="GY" />
          <DemoAvatar initials="AB" />
          <DemoAvatar initials="CD" />
          <DemoAvatar initials="EF" />
          <DemoAvatar initials="GH" />
        </Avatar.Group>
      </div>
      <div>
        <p className="text-fg-muted mb-3 text-xs font-semibold uppercase tracking-wide">
          With images
        </p>
        <Avatar.Group max={4}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Avatar.Root key={i}>
              <Avatar.Image src={`https://i.pravatar.cc/150?u=user${i}`} alt={`User ${i}`} />
              <Avatar.Fallback>U{i}</Avatar.Fallback>
            </Avatar.Root>
          ))}
        </Avatar.Group>
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
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <DemoAvatar size="sm" initials="GY" />
              <DemoAvatar size="md" initials="GY" />
              <DemoAvatar size="lg" initials="GY" />
              <DemoAvatar shape="square" initials="GY" />
            </div>
            <div className="flex items-center gap-3">
              {(["online", "offline", "busy", "away"] as const).map((status) => (
                <DemoAvatar key={status} initials={status[0].toUpperCase() + status[1]}>
                  <Avatar.Status status={status} />
                </DemoAvatar>
              ))}
            </div>
            <Avatar.Group max={3}>
              <DemoAvatar initials="GY" />
              <DemoAvatar initials="AB" />
              <DemoAvatar initials="CD" />
              <DemoAvatar initials="EF" />
            </Avatar.Group>
          </div>
        </div>
      ))}
    </div>
  ),
};
