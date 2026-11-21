import * as React from "react";

/**
 * Defaults a ButtonGroup passes to the Buttons inside it (Chakra, MUI, Ant, Carbon).
 * A prop set on an individual Button always wins; `disabled` is OR-ed (MUI, Spectrum).
 * `disabled` also cascades to every other control natively: the group renders a <fieldset>.
 * Lives in its own file so Button can read it without importing ButtonGroup.
 */
export interface ButtonGroupContextValue {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  color?: "default" | "brand" | "danger" | "inverse";
  /**
   * Disable the whole group. Like `<fieldset disabled>`, it disables every control inside:
   * Buttons, Toggles, Inputs, Select triggers, NumberField, OTPField…
   *
   * Checkbox, Switch, Radio and Slider aren't native form controls, so a fieldset can't
   * disable them on its own: wrap each in `Field.Root` (the library convention) and Base UI
   * passes the disabled state down. A bare `<Checkbox.Root />` stays enabled.
   */
  disabled?: boolean;
}

export const ButtonGroupContext = React.createContext<ButtonGroupContextValue | null>(null);
