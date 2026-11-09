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
