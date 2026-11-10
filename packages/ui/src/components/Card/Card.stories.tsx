import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowRightIcon,
  GearSixIcon,
  ChartBarIcon,
  UsersIcon,
  DotsThreeIcon,
} from "@phosphor-icons/react";
import { Card } from "./Card";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";

const meta: Meta = {
  title: "Components/Card",
};

export default meta;
type Story = StoryObj;

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Card.Root className="sm:max-w-sm">
      <Card.Header>
        <Card.Title>Project settings</Card.Title>
        <Card.Description>Manage your project configuration.</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="text-fg-default text-sm">
          Your project is currently on the <strong>Pro</strong> plan.
        </p>
      </Card.Content>
      <Card.Footer className="justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button variant="solid">Save</Button>
      </Card.Footer>
    </Card.Root>
  ),
};

/* ============================================================
 * VARIANTS
 * ============================================================ */

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-sm">
      {(["elevated", "outline", "filled"] as const).map((variant) => (
        <Card.Root key={variant} variant={variant}>
          <Card.Header>
            <Card.Title>{variant.charAt(0).toUpperCase() + variant.slice(1)}</Card.Title>
            <Card.Description>The {variant} card variant.</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-fg-default text-sm">Card content goes here.</p>
          </Card.Content>
        </Card.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * WITH ICON + HEADER ACTION
 * ============================================================ */

export const WithIconAndAction: Story = {
  render: () => (
    <div className="grid gap-4 sm:max-w-2xl sm:grid-cols-2">
      {/* Icon only */}
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <ChartBarIcon />
          </Card.Icon>
          <Card.Title className="text-base">Analytics</Card.Title>
          <Card.Description>View your traffic and engagement data.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-fg-default text-2xl font-bold">12,482</p>
          <p className="text-fg-muted text-xs">Total visits this month</p>
        </Card.Content>
      </Card.Root>

      {/* Icon + Header Action */}
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <GearSixIcon />
          </Card.Icon>
          <Card.Title className="text-base">Settings</Card.Title>
          <Card.Description>Configure your workspace.</Card.Description>
          <Card.HeaderAction>
            <Button
              variant="ghost"
              size="icon"
              icon={<DotsThreeIcon weight="bold" />}
              srOnly="Options"
            />
          </Card.HeaderAction>
        </Card.Header>
        <Card.Content>
          <p className="text-fg-default text-sm">Your workspace is on the Pro plan.</p>
        </Card.Content>
      </Card.Root>

      {/* Header Action only (no icon) */}
      <Card.Root>
        <Card.Header>
          <Card.Title className="text-base">Team Members</Card.Title>
          <Card.Description>Manage who has access.</Card.Description>
          <Card.HeaderAction>
            <Button variant="outline" size="sm">
              Invite
            </Button>
          </Card.HeaderAction>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center gap-2">
            <UsersIcon className="text-fg-muted h-5 w-5" />
            <p className="text-fg-default text-sm">8 members</p>
          </div>
        </Card.Content>
      </Card.Root>

      {/* Icon + Header Action + Interactive */}
      <Card.Root interactive>
        <Card.Header>
          <Card.Icon>
            <UsersIcon />
          </Card.Icon>
          <Card.Title className="text-base">Collaborators</Card.Title>
          <Card.Description>See who&apos;s working on this project.</Card.Description>
          <Card.HeaderAction>
            <Badge variant="info" size="sm">
              3 online
            </Badge>
          </Card.HeaderAction>
        </Card.Header>
        <Card.Footer>
          <Card.Action>
            View all <ArrowRightIcon className="h-4 w-4" />
          </Card.Action>
        </Card.Footer>
      </Card.Root>
    </div>
  ),
};

/* ============================================================
 * INTERACTIVE
 * ============================================================ */

export const Interactive: Story = {
  render: () => (
    <div className="grid gap-4 sm:max-w-2xl sm:grid-cols-3">
      {(["elevated", "outline", "filled"] as const).map((variant) => (
        <Card.Root key={variant} variant={variant} interactive>
          <Card.Header>
            <Card.Eyebrow>{variant}</Card.Eyebrow>
            <Card.Title className="text-base">
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Card.Title>
            <Card.Description>Interactive {variant} card.</Card.Description>
          </Card.Header>
          <Card.Footer>
            <Card.Action>
              Open <ArrowRightIcon className="h-4 w-4" />
            </Card.Action>
          </Card.Footer>
        </Card.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * WITH IMAGE
 * ============================================================ */

export const WithImage: Story = {
  render: () => (
    <div className="grid gap-6 sm:max-w-3xl sm:grid-cols-3">
      {[
        {
          variant: "elevated" as const,
          img: "photo-1506905925346-21bda4d32df4",
          title: "Mountain Retreat",
          eyebrow: "Travel",
          desc: "A weekend getaway in the Swiss Alps.",
        },
        {
          variant: "outline" as const,
          img: "photo-1519681393784-d120267933ba",
          title: "Stargazing Tour",
          eyebrow: "Featured",
          desc: "Experience the cosmos like never before.",
        },
        {
          variant: "filled" as const,
          img: "photo-1501785888041-af3ef285b470",
          title: "Lakeside Cabin",
          eyebrow: "New",
          desc: "Peaceful retreat by the water.",
        },
      ].map(({ variant, img, title, eyebrow, desc }) => (
        <Card.Root key={variant} variant={variant} interactive>
          <Card.Image
            src={`https://images.unsplash.com/${img}?w=600&h=300&fit=crop`}
            alt={title}
            className="h-48"
          />
          <Card.Header>
            <Card.Eyebrow>{eyebrow}</Card.Eyebrow>
            <Card.Title>{title}</Card.Title>
            <Card.Description>{desc}</Card.Description>
          </Card.Header>
          <Card.Footer className="justify-between">
            <Badge variant="success" size="sm">
              Available
            </Badge>
            <Card.Action>
              View <ArrowRightIcon className="h-4 w-4" />
            </Card.Action>
          </Card.Footer>
        </Card.Root>
      ))}
    </div>
  ),
};

/* ============================================================
 * HORIZONTAL
 * ============================================================ */

export const Horizontal: Story = {
  render: () => (
    <div className="flex flex-col gap-6 sm:max-w-xl">
      {[
        {
          variant: "elevated" as const,
          img: "photo-1506905925346-21bda4d32df4",
          title: "Mountain Retreat",
          eyebrow: "Travel",
          desc: "A weekend getaway in the Swiss Alps.",
        },
        {
          variant: "outline" as const,
          img: "photo-1519681393784-d120267933ba",
          title: "Stargazing Tour",
          eyebrow: "Featured",
          desc: "Experience the cosmos like never before.",
        },
        {
          variant: "filled" as const,
          img: "photo-1501785888041-af3ef285b470",
          title: "Lakeside Cabin",
          eyebrow: "New",
          desc: "Peaceful retreat by the water.",
        },
      ].map(({ variant, img, title, eyebrow, desc }) => (
        <Card.Root key={variant} direction="horizontal" variant={variant} interactive>
          <Card.Image src={`https://images.unsplash.com/${img}?w=400&h=400&fit=crop`} alt={title} />
          <Card.Header>
            <Card.Eyebrow>{eyebrow}</Card.Eyebrow>
            <Card.Title>{title}</Card.Title>
            <Card.Description>{desc}</Card.Description>
          </Card.Header>
          <Card.Footer className="justify-between">
            <Badge variant="success" size="sm">
              Available
            </Badge>
            <Card.Action>
              View <ArrowRightIcon className="h-4 w-4" />
            </Card.Action>
          </Card.Footer>
        </Card.Root>
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
        <div key={theme} data-theme={theme} className="bg-surface-base rounded-lg p-6">
          <p className="text-fg-muted mb-4 text-xs font-semibold uppercase tracking-wide">
            {theme}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {(["elevated", "outline", "filled"] as const).map((variant) => (
              <Card.Root key={variant} variant={variant}>
                <Card.Header>
                  <Card.Eyebrow>{variant}</Card.Eyebrow>
                  <Card.Title className="text-base">Card Title</Card.Title>
                  <Card.Description>A short description for this card.</Card.Description>
                </Card.Header>
                <Card.Footer>
                  <Card.Action>
                    View <ArrowRightIcon className="h-4 w-4" />
                  </Card.Action>
                </Card.Footer>
              </Card.Root>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
