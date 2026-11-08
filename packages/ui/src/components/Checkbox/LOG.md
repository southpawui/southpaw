# Checkbox — Change Log

## 2026-11-07

### Initial styling (Phase 1) — f00b5c1

Styled Checkbox with token system.

## 2026-11-08

### Full enhancement (GEO-901) — 41649a3

**Phosphor Check/Minus icons**: Replaced inline SVG with Phosphor icons. Why: consistency — all icons come from one library. The inline SVG was a Radix pattern we inherited; Phosphor is our chosen icon set.

**Auto-render Indicator**: Root renders `<Indicator />` by default if no children passed. Why: reduces boilerplate — every checkbox needs an indicator, so make it automatic. Consumer can still pass custom children to override.

**`valid` prop (green fill)**: Green background when checked. Why: matches Input/Textarea valid state pattern for consistency.

**`data-[invalid]` border**: Red border from Field context. Why: Field.Root sets `data-invalid` on its children; checkbox needs to respond to it visually.

**Disabled opacity on label wrapper**: Uses `has-[[data-disabled]]` on the wrapping label, not on the checkbox itself. Why: when the checkbox has a label, both the checkbox AND the label text should fade. If opacity is only on the checkbox, the label looks interactive when it's not.

### Considered and rejected

**`label` prop on Checkbox.Root**: Initially built this — checkbox renders its own label text. User tested it and decided labels should stay in the Field system. Why: consistency with how all other controls work. The checkbox is just the control; Field.Label handles the text. This matches shadcn's approach where label is always a separate component.
