"use client";

import * as React from "react";

/**
 * What a ToggleGroup passes to its Toggles beyond the shared ButtonGroupContext
 * (size/variant/color/disabled). Own file so Toggle can read it without importing ToggleGroup.
 */
export interface ToggleGroupContextValue {
  /** Every item focusable, none can change (Mantine, Chakra). */
  readOnly?: boolean;
  /** Draws every item's danger border and sets aria-invalid on them. */
  invalid?: boolean;
  /** So ToggleGroup.Separator can run across the group. */
  orientation?: "horizontal" | "vertical";
  attached?: boolean;
}

export const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);
