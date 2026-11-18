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

## 2026-11-18 — Disabled Fieldset no longer double-dims its contents (GEO-962)

- **Bug:** a disabled Fieldset put `disabled:opacity-[--sp-state-disabled-opacity]` on its whole container. The controls inside already dim themselves (native `:disabled`), and since GEO-896 so do Field.Labels (Base UI `data-disabled` from this Fieldset). So everything inside ended up at about 0.14, measured in Playwright: label 0.144, input 0.144.
- **Fix (George, via the coordinator):** the Fieldset dims only its own text.
  - The container has no opacity.
  - `Fieldset.Legend` gets `data-[disabled]:opacity-…`; Base UI sets `data-disabled` on the legend.
  - `Fieldset.Description` (a plain `<p>`) gets `[[data-slot=fieldset][data-disabled]_&]:opacity-…`.
- **Measured after (effective opacity, including ancestors):** legend 0.38, description 0.38, Field.Label 0.38 and input 0.38, the same as a disabled Field outside a Fieldset (label 0.38, input 0.38). The legend reads like a disabled label.
- **Visible side effect:** the disabled card's border is now at full strength; before, the container opacity dimmed it. The border is structure, not a disabled control. Flagged for George.
- **Updates "Considered and rejected → Disabled propagation via context":** native `<fieldset disabled>` still does the disabling, and Base UI's Fieldset context is what dims the Field.Labels inside.
- **Scope:** only the Fieldset stories nest a disabled Fieldset (States and Themes); I checked both in light, dark and high-contrast.
- **Checks:**
  - Test added: no container opacity; legend and description classes present; the Field inside is disabled with `data-disabled` on its label.
  - `pnpm test`: 390 passed.
  - `STORYBOOK_PORT=6009 pnpm verify fieldset`: all checks pass.
- **George's decision (2026-11-18):** keep the disabled Fieldset's border at full strength, as built. It's structure, not a disabled control.

**Signed off** by George, 2026-11-18. /improve was a quick self-review with no new findings.
