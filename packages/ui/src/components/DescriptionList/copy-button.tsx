"use client";

import * as React from "react";
import { CheckIcon, CopyIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Button } from "../Button/Button";
import { Tooltip } from "../Tooltip/Tooltip";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import { cn } from "../../lib/cn";
import { useCopyToClipboard } from "../../lib/use-copy-to-clipboard";

/* ============================================================
 * Internal copy button (GEO-966)
 *
 * Not exported from the package yet: GEO-978 lifts it into the public
 * CopyButton. The Primer / GitHub / Mantine pattern:
 *
 * - an icon Button whose Tooltip is its label ("Copy" + the term as hidden
 *   context, so it's named "Copy email");
 * - after a copy, the icon swaps to a check and the tooltip says "Copied",
 *   held open for 2s, then both go back. A failure shows "Copy failed" the
 *   same way;
 * - screen readers hear "Copied" through the shared announcer (the hook);
 * - the swap is instant; the tooltip's fade and the colour change use the
 *   --sp-duration tokens, which are 0 under prefers-reduced-motion.
 * ============================================================ */

export interface CopyButtonLabels {
  copy: string;
  copied: string;
  copyFailed: string;
}

export interface CopyButtonProps {
  /** Text to copy, read when pressed. */
  getText: () => string;
  /** Hidden context after the visible label, e.g. the term: "Copy" + " email". */
  context?: string;
  labels: CopyButtonLabels;
  className?: string;
}

export function CopyButton({ getText, context, labels, className }: CopyButtonProps) {
  const { copy, status } = useCopyToClipboard({
    announce: { copied: labels.copied, failed: labels.copyFailed },
  });
  // Hover/focus opens the tooltip as usual; a result holds it open until it resets,
  // unless Escape dismissed it (WCAG 1.4.13: dismissible without moving).
  const [open, setOpen] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const showResult = status !== "idle" && !dismissed;

  const text =
    status === "copied" ? labels.copied : status === "failed" ? labels.copyFailed : labels.copy;
  const icon =
    status === "copied" ? (
      <CheckIcon aria-hidden="true" weight="bold" />
    ) : status === "failed" ? (
      <WarningCircleIcon aria-hidden="true" />
    ) : (
      <CopyIcon aria-hidden="true" />
    );

  return (
    <Tooltip.Root
      type="label"
      open={open || showResult}
      onOpenChange={(next, details) => {
        setOpen(next);
        if (!next && details.reason === "escape-key") setDismissed(true);
      }}
    >
      <Tooltip.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            data-slot="description-list-copy"
            data-status={status}
            icon={icon}
            onClick={() => {
              setDismissed(false);
              void copy(getText());
            }}
            className={cn(
              // Smaller than a control so the row keeps its height; the negative
              // margin stops it pushing the line apart.
              "text-fg-muted hover:text-fg-default -my-1 size-[var(--sp-control-height-sm)] shrink-0 [&_svg]:size-[1em]",
              status === "copied" && "text-success hover:text-success",
              status === "failed" && "text-danger hover:text-danger",
              className,
            )}
          />
        }
      />
      <Tooltip.Content variant={status === "failed" ? "danger" : "neutral"}>
        {text}
        {status === "idle" && context ? <VisuallyHidden> {context}</VisuallyHidden> : null}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
