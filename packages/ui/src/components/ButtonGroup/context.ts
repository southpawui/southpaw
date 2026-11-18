import * as React from "react";

/**
 * Defaults a ButtonGroup passes to the Buttons inside it (Chakra, MUI, Ant, Carbon).
 * A prop set on an individual Button always wins; `disabled` is OR-ed (MUI, Spectrum).
 * Lives in its own file so Button can read it without importing ButtonGroup.
 */
export interface ButtonGroupContextValue {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  color?: "default" | "brand" | "danger" | "inverse";
  disabled?: boolean;
}

export const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(null);
