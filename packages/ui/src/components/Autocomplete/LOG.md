# Autocomplete — Change Log

Autocomplete is built together with Combobox (GEO-934) and shares its styling module. The full history and decisions are in [Combobox/LOG.md](../Combobox/LOG.md). Entries here cover only what is specific to Autocomplete.

## 2026-11-18 — Signed off; /improve findings fixed

- Fixed with Combobox (details in Combobox/LOG.md):
  - `filter={null}` is honoured.
  - `submitOnEnter` skips "Try again" and respects a consumer's `preventDefault()`.
  - Retry is recorded on pointer press.
  - `autoSelectOnBlur` skips disabled options.
  - The full-screen input keeps its handlers.
  - Node errors are announced.
  - Composed options respect `minLength` and `error`.
  - Match marks use `autocomplete-match`.
- Themes shows the error row.
- 18 unit tests.

## 2026-11-16 — Tooltips (awaiting George's review)

- The clear button ("Clear") and the optional chevron ("Show options") get label-mode tooltips through the shared Input. Details are in Combobox/LOG.md.
- `verify autocomplete` passes. One inconclusive, `color-contrast` on `<mark>` in highlighted rows (the bar's pseudo-element), was measured manually.

## 2026-11-16 — Implementation (awaiting George's review)

- Rebuilt on the shared module in `Combobox/combobox-shared.tsx`: same control, popup, rows, states, sizes, async, virtualization, status and full-screen behaviour as Combobox. Details and checks are in Combobox/LOG.md.
- **Specific to Autocomplete:**
  - No chevron by default (`showTrigger` adds it) and no selection indicator.
  - `submitOnEnter` submits the form after Base UI fills the input (Chakra `alwaysSubmitOnEnter`).
  - "Try again" keeps the typed text: the sentinel's string value is the current input.
  - `autoSelectOnBlur` fills the input with the highlighted suggestion.
- **Stories:** Default, InlineCompletion (`mode="both"` with `matchFrom="start"`; `mode="inline"` cycles through items without filtering, which is Base UI's documented behaviour), Items, Async (debounced, minLength 2, "error" fails), SubmitOnEnter, Command palette (inline list in a Dialog; link items), Grid (emoji), Virtualized (5,000), Behaviour, Sizes, States, Density, Themes.
- 14 unit tests.

## 2026-11-16 — Research redone (GEO-934), awaiting George's approval

- RESEARCH.md now points to the shared analysis in `Combobox/RESEARCH.md` and lists what differs: free text, inline completion, command palette, grid, submit on Enter.
- No code changes yet.
