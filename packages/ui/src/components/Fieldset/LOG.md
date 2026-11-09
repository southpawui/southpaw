# Fieldset — Change Log

## 2026-11-09 — Full enhancement

### What changed

- Added `Fieldset.Description` sub-component — helper text below legend (GOV.UK, Mantine pattern)
- Added `Fieldset.Error` sub-component — error message with WarningCircle icon, `role="alert"`, sr-only "Error:" prefix
- Error supports `errors` array prop for multiple messages (renders as bullet list)
- Switched from hardcoded colours (`border-neutral-200`, `text-neutral-900`) to semantic tokens (`border-border-default`, `text-fg-default`)
- Added disabled state styling (`disabled:opacity-[var(--sp-state-disabled-opacity)]`)
- 8 unit tests, 6 stories (Default, WithDescription, WithError, States, Density, Themes)
- 0 a11y violations

### Why

- **Description slot**: GOV.UK and Mantine both offer this (2/8 competitors). Fieldsets often need context text below the legend explaining what the group is for.
- **Error slot**: GOV.UK, Mantine, Chakra, MUI all offer group-level errors (4/8). Essential for checkbox/radio groups where the error applies to the whole selection, not individual items.
- **Semantic tokens**: The original hardcoded `neutral-200` and `neutral-900` didn't respond to theme changes. Switching to `border-border-default` and `text-fg-default` means the Fieldset works correctly in dark and high-contrast themes.
- **Disabled via native fieldset**: HTML's `<fieldset disabled>` natively disables all form controls inside it. We just needed to add the visual opacity. No prop drilling needed.

### Considered and rejected

- **Valid state on Fieldset**: Fieldset is a structural grouping element, not a form control. "Valid" doesn't make semantic sense at the fieldset level — individual controls inside have valid/error states. Only error makes sense at the group level (e.g. "select at least one option").
- **Disabled propagation via context**: Native `<fieldset disabled>` already handles this in HTML. No need to reinvent with React context.
