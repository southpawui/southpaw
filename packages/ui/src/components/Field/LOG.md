# Field — Change Log

## 2026-11-07

### Initial styling (Phase 1) — 0e141aa

Styled Field system with token system. Basic sub-components: Root, Label, Description, Error.

## 2026-11-08

### Full enhancement (GEO-897) — 90cc489

**CharacterCount sub-component**: Uses `aria-live="polite"` for screen reader announcements and changes colour when over limit. Why: Spectrum and Mantine both offer this. We chose composition (separate sub-component) over baking it into Input/Textarea so any control can use it.

**Optional indicator on Label**: Shows "(Optional)" text after the label. Why: GOV.UK's "mark the minority" pattern — if most fields are required, mark the optional ones instead of adding asterisks everywhere. More inclusive.

**ErrorIcon → Phosphor WarningCircle**: Replaced inline SVG with Phosphor icon. Why: consistency with our icon library choice. All icons should come from one source.

**Hidden "Error:" prefix**: Screen readers hear "Error: You must agree" but sighted users only see "You must agree". Why: GOV.UK pattern — gives screen reader users immediate context that this is an error message.

**Horizontal label width via CSS var**: `--sp-field-label-width` defaults to 8rem but can be overridden per form. Why: horizontal form layouts need consistent label widths. A CSS variable lets consumers adjust without breaking the component.

### Field.Group direction prop (GEO-901) — 41649a3

Added `direction` prop: `"row"` for inline checkbox/radio + label, `"column"` (default) for stacking fields. Why: shadcn's `FieldGroup` handles this inline layout — we were using raw `<div className="flex items-center gap-2">` which violated our "no raw HTML" rule. Adding direction to our existing Group component avoided creating a new sub-component.
