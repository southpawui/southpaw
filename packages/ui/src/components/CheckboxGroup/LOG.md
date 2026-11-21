# CheckboxGroup — Change Log

## 2026-11-09 — Full enhancement

### What changed

- Rewrote as compound export (`CheckboxGroup.Root`) wrapping Base UI's CheckboxGroup
- Removed raw HTML layout from stories — each item now uses `Field.Item` + `Field.Group direction="row"` + `Checkbox.Root`
- Group label via `Field.Label`, error via `Field.Error`, description via `Field.Description` (composition, not built-in slots)
- Density-responsive gap via `--sp-control-gap` (6/8/12px)
- 4 unit tests, 4 stories (Default, States, Density, Themes)
- All states shown in States + Themes: default, valid, error, disabled

### Why

- **Composition over slots**: Rather than building description/error slots into CheckboxGroup itself, we compose with Field sub-components. This matches how RadioGroup works and avoids duplicating Field's functionality. The consumer composes `Field.Root > Field.Label + CheckboxGroup.Root + Field.Error` — same pattern everywhere.
- **No fieldset/legend**: The RESEARCH.md flagged this as a must-add (GOV.UK pattern). However, Base UI's CheckboxGroup already renders `role="group"` and Field.Label provides `aria-labelledby`. For stronger semantics, consumers can wrap in Fieldset.Root + Fieldset.Legend. We didn't bake it in because it would force a `<fieldset>` border/padding that most consumers don't want — composition is more flexible.
- **No orientation prop**: Only Carbon (1/8) supports horizontal layout for checkbox groups. Doesn't meet the 2+ competitor threshold.

### Considered and rejected

- **Built-in Legend/Description/Error sub-components** — would duplicate what Field already provides. shadcn doesn't have a CheckboxGroup component at all — they compose with Field. We follow the same principle.
- **Horizontal orientation** — only 1/8 competitors offer it. If needed, consumer can override with `className="flex-row"` on Root.

## 2026-11-18 — Expose aria-disabled (approved shared change, GEO-896 follow-up)

- **Bug:** Base UI's CheckboxGroup, unlike its RadioGroup, doesn't set `aria-disabled` on its `role="group"`, so screen readers weren't told a disabled group is disabled. That applies whether it's disabled directly, through `Field.Root`, or through an ancestor Fieldset or ButtonGroup.
- **Found by:** dimming `Field.Label` when disabled (Field change, same day). axe then flagged the disabled group's label ("Preferences") for colour contrast, because nothing marked the labelled group as inactive. WCAG 1.4.3 exempts inactive components, but only if they're exposed as inactive.
- **Fix:** a default `render` adds `aria-disabled={state.disabled || undefined}` from Base UI's state. A consumer's own `render` still wins.
- **Tests:** `aria-disabled` is set when the group is disabled directly and when it's disabled through Field. There's none when enabled, and a consumer's `render` is respected.
- **Checks:** `pnpm verify checkboxgroup` passes all checks, including the States and Themes stories that failed before.
- **Approved** by George (2026-11-18).

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
