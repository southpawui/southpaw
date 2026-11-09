import type { Meta, StoryObj } from "@storybook/react";
import { Check, Warning, Info, ShieldCheck, Tag } from "@phosphor-icons/react";
import { Badge } from "./Badge";

const meta: Meta = {
  title: "Components/Badge",
};

export default meta;
type Story = StoryObj;

const variants = ["default", "success", "danger", "warning", "info"] as const;

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {variants.map((v) => (
        <Badge key={v} variant={v}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};

/* ============================================================
 * SIZES
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          <span className="text-fg-muted w-8 text-xs">{size}</span>
          {variants.map((v) => (
            <Badge key={v} variant={v} size={size}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * OUTLINE
 * ============================================================ */

export const Outline: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => (
          <Badge key={v} variant={v} appearance="outline">
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => (
          <Badge key={v} variant={v} appearance="outline" size="lg">
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

/* ============================================================
 * WITH ICON
 * ============================================================ */

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="success" icon={<Check weight="bold" />}>
        Verified
      </Badge>
      <Badge variant="danger" icon={<Warning weight="bold" />}>
        Critical
      </Badge>
      <Badge variant="info" icon={<Info weight="bold" />}>
        New feature
      </Badge>
      <Badge variant="default" icon={<Tag weight="bold" />}>
        v0.2.0
      </Badge>
      <Badge variant="success" icon={<ShieldCheck weight="bold" />} appearance="outline">
        Secure
      </Badge>
    </div>
  ),
};

/* ============================================================
 * DISMISSIBLE
 * ============================================================ */

export const Dismissible: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default" onDismiss={() => {}}>
        React
      </Badge>
      <Badge variant="info" onDismiss={() => {}}>
        TypeScript
      </Badge>
      <Badge variant="success" icon={<Check weight="bold" />} onDismiss={() => {}}>
        Approved
      </Badge>
      <Badge variant="danger" onDismiss={() => {}} size="lg">
        Remove filter
      </Badge>
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
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <Badge key={v} variant={v}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <Badge key={v} variant={v} appearance="outline">
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" icon={<Check weight="bold" />}>
                Verified
              </Badge>
              <Badge variant="danger" icon={<Warning weight="bold" />}>
                Critical
              </Badge>
              <Badge variant="default" onDismiss={() => {}}>
                Dismissible
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};
