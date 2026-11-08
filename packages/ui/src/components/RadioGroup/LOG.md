# RadioGroup — Change Log

## 2026-11-07

### Initial styling (Phase 1) — f00b5c1

Styled Radio and RadioGroup with token system as separate components.

## 2026-11-08

### Radio enhancement (GEO-902) — 49c1c73

**Valid prop (green ring only)**: Border ring turns green, but the inner dot stays accent. Why: user caught that the dot was also turning green and said "I thought we were only doing the ring." The dot is the selection indicator — it shouldn't change colour with validation state.

**Field.Item for radio options**: Each radio option wrapped in `Field.Item` instead of its own `Field.Root`. Why: `Field.Root` creates a new ID context, which blocked `data-invalid` propagation from the parent. `Field.Item` stays within the parent's Field context, so error states flow through.

**`aria-label` on every radio**: Why: when using `Field.Item` instead of `Field.Root`, the label association (`aria-labelledby`) is lost because there's no `Field.Label` generating an ID. Explicit `aria-label` ensures screen readers always have a name.

### Density-responsive gap (GEO-902) — 49c1c73

RadioGroup and CheckboxGroup both changed from hardcoded gap to `--sp-control-gap` (6px compact, 8px default, 12px comfortable). Why: the Density story showed no visible difference between densities because the gap wasn't scaling.

### Merge Radio into RadioGroup (GEO-903) — 06c84c6

**Single compound component**: `RadioGroup.Root`, `RadioGroup.Item`, `RadioGroup.Indicator`. Deleted standalone Radio. Why: shadcn/Radix have no standalone Radio — radios always exist in groups. A standalone radio makes no semantic sense (that's what Checkbox or Switch is for). Merging simplifies imports and matches user expectations.

### ChoiceCards story (GEO-903) — 06c84c6

**`Field.Item render={<label>}`**: Cards need three things: unique IDs (from Field context), label semantics (entire card clickable), and no redundant div wrapper. We tried:

1. Raw `<label>` wrapping `<span role="radio">` — axe flagged inconclusive because label text content conflicted with `aria-label`
2. `<div>` with onClick — created redundant `<div>` > `<div>` wrapper (Field.Item renders a div)
3. `Field.Item render={<label>}` — Base UI's render prop lets Field.Item render as a `<label>` instead of `<div>`. Solved all three requirements.

### Considered and rejected

**Horizontal orientation**: Built `orientation="horizontal"` prop with `flex-row flex-wrap`. User didn't like the spacing and noted only 2/8 competitors (Chakra, Carbon) offer it. Removed. Revisit if there's demand.

### Bug fixes from /improve

**ChoiceCard CSS concatenation**: Class strings concatenated with `+` but missing trailing spaces — `ease-[...)]hover:border-fg-muted` was an invalid class. Hover and selected styles weren't applying. Fixed by adding spaces.

**verify.ts 3× redundant navigation**: Each story was navigated to 3 separate times (a11y, duplicate IDs, accessible names). Consolidated into single navigation per story. ~3× faster verification.
