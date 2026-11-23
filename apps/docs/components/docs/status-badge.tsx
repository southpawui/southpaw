"use client";

import { Badge, type BadgeProps } from "@southpawui/ui/Badge";
import type { Status } from "@/lib/shared";

const STATUS: Record<Status, { label: string; variant: BadgeProps["variant"]; help: string }> = {
  alpha: { label: "Alpha", variant: "warning", help: "API may change without notice." },
  beta: {
    label: "Beta",
    variant: "info",
    help: "API is settling; breaking changes are announced.",
  },
  stable: { label: "Stable", variant: "success", help: "Follows semantic versioning." },
  deprecated: {
    label: "Deprecated",
    variant: "danger",
    help: "Will be removed. See the alternatives.",
  },
};

/** Lifecycle status from the page's `status` frontmatter (BRIEF §8). */
export function StatusBadge({ status }: { status: Status }) {
  const s = STATUS[status];
  return (
    <p data-slot="docs-status" className="not-prose flex items-center gap-2 text-sm">
      <Badge variant={s.variant} appearance="outline" size="md">
        <span className="sr-only">Status: </span>
        {s.label}
      </Badge>
      <span className="text-fg-muted">{s.help}</span>
    </p>
  );
}
