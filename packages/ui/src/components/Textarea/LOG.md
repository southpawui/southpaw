# Textarea — Change Log

## 2026-11-07

### Initial build (Phase 1) — ff665ba

Built Textarea alongside Input styling.

## 2026-11-08

### Full enhancement (GEO-899) — 939350c

**Autosize via CSS `field-sizing: content`**: No JS library needed. Why: modern CSS feature that eliminates the need for heavy autosize libraries. Falls back gracefully — textarea just doesn't auto-grow in older browsers.

**Resize prop on wrapper div**: Resize handle controls the wrapper, not just the textarea. Why: if the textarea resizes but the border stays fixed-width, it looks broken. Moving resize to the wrapper means the entire visual control (border + content) resizes together.

**Character count removed from component**: Use `Field.CharacterCount` instead. Why: composition over duplication. Character count is a Field concern, not a Textarea concern. An Input could need it too.

### Bug fixes (GEO-899)

**`:read-only` false positive** — fc75341: The `has-[:read-only]` selector on the wrapper matched `<span>` elements (like the checkmark icon) because non-form elements match `:read-only` by default in CSS. Fixed by scoping to `has-[textarea:read-only]`. Why: same bug we had with Input's phone selector `<select>` element.

**Valid/error border cascade** — a290972: Tailwind v4's utility specificity wasn't winning over the component's base border-color. Fixed with `!important`. Why: Tailwind v4 changed how specificity works compared to v3. The `!important` is scoped to the state selectors only.

**Overflow for resize** — e5998d0: Removed `overflow-hidden` thinking it was unnecessary, but CSS `resize` only works when `overflow ≠ visible`. Used `overflow-clip` instead — clips like hidden but doesn't create a scroll container (no double scrollbar risk).

**Default autosize rows**: Changed from 1 to 3. Why: a textarea with 1 visible row looks identical to an input. 3 rows immediately communicates "this is for multi-line content."
