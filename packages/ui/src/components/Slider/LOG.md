# Slider — Change Log

## 2026-11-16 — Sign-off + /improve fixes (GEO-931)

George signed off "as it is" (relayed by the coordinator). /improve was run on `Slider/`. Every valid finding is fixed, each with a regression test that fails without the fix.

### Fixed

1. **`aria-label` on `Slider.Root` named nothing.**
   - Base UI leaves it on the root `div`, so a slider labelled that way had an unnamed thumb.
   - It now names a single thumb ("Volume") and prefixes range thumbs ("Price, minimum" / "Price, maximum"). `getAriaLabel` still wins.
2. **The value label didn't appear for keyboard use after a pointer focus.**
   - The label opened only on `:focus-visible` at focus time, so clicking a thumb and then pressing arrows showed nothing.
   - Any key on the thumb now opens it (MUI behaviour).
3. **`restrictToMarks` didn't apply to Southpaw-driven changes.** A track drag could leave values between marks. `setValues` now snaps too, covering track drags and added handles.
4. **End mark labels overflowed the slider by about half a label.**
   - This risked horizontal page scroll on full-width mobile layouts.
   - Labels at 0% and 100% now align inward to the slider's edges (`data-edge`).

### Noted, unchanged (George approved as is)

- **Value-label placement on touch**: during a touch drag the finger can cover the label. MUI, Mantine and Carbon place it above the thumb and offset it on touch. The coordinator raised it, and George kept the current behaviour.
- **Slashed zero** in values and labels, from `tabular-nums` in the current font. The coordinator raised it, and George kept it.

### Follow-up

- **GEO-953**: `Slider.Input` built on NumberField (GEO-929). Until then, the `WithInput` story shows the pairing with `Input`.

### Checks

- Tests: 45 for Slider (40 → 45), 440 across the suite.
- `pnpm verify slider`: all checks passed (19 stories, 0 violations, 0 inconclusives).
- eslint and prettier are clean. Typecheck passes via the scratch tsconfig; the turbo typecheck doesn't cover packages/ui.
- Re-screenshotted Marks: the end labels sit flush with the slider edges.

## 2026-11-16 — Full enhancement (GEO-931)

Research: see RESEARCH.md (all 9 libraries + Base UI 1.9).

### What changed

- **Controlled internally.** Root owns the value (controlled or uncontrolled for the consumer) and passes it to Base UI. This is what makes snapping, read-only, add/remove and track dragging possible. `onValueChange` / `onValueCommitted` keep Base UI's details, and get `undefined` details for Southpaw-initiated changes.
- **Token styling + states**:
  - The track is `surface-sunken` with a 50% `border-control` inset ring. The fill and thumb ring use `accent`, the thumb is `surface-base`, and focus uses the two-tone `sp-focus-ring` (via `has-[:focus-visible]`).
  - **States**:
    - `valid`: success.
    - invalid: danger, read from Field.
    - disabled: only the control is dimmed, so label and value text keep AA contrast.
    - `readOnly`: muted fill, focusable, `aria-readonly`, changes ignored.
  - Forced colours: CanvasText borders and ticks.
- **Sizes** `sm | md | lg`: track 4 / 6 / 8px. The thumb is 0.8× / 1× / 1.2× of `--sp-control-icon`, so it follows density (16 / 20 / 24px for md). Coarse pointers get a ≥44px hit area through a `::before` (−12px inset).
- **Auto-render**: Root renders Body > Control > Track > Indicator / Marks / Thumbs (+ MarkLabels, MinMax) unless Body or Control is composed. The parts are exported: Header, Label, Value, Body, Control, Track, Indicator, Marks, MarkLabels, MinMax, Thumb, Thumbs, AddHandle, RemoveHandle.
- **Range / multi-thumb**: defaults to "Minimum" / "Maximum" for two thumbs and "Handle n of N" for more, overridable with `getAriaLabel`. `minStepsBetweenValues` / `thumbCollisionBehavior` pass through.
- **Marks**:
  - `marks={true}` gives one per step (capped at 200). Also accepts `number[]` or `{ value, label, hidden }[]`.
  - Ticks change colour inside the fill. Labels sit under the track, or beside it when vertical. All marks are `aria-hidden`.
- **`restrictToMarks`**: pointer values snap to the nearest mark (hidden marks included). Arrows and PageUp/PageDown move mark to mark, Home/End jump to the ends, and it's RTL-aware.
- **Value label** (`valueLabel`, default `auto`, as George decided):
  - It's a `Tooltip` anchored to the thumb, opening on hover, keyboard focus (`:focus-visible`) or drag. `always` and `off` are also available.
  - It's portalled into the Control, so it inherits theme and density, and it's `aria-hidden` because the thumb already announces `aria-valuetext`.
  - It follows the thumb while dragging (measured: label centre equals thumb centre).
- **Format**: Base UI's `format` / `locale`, plus `formatValue(value, index)` and `scale(value)`. Both drive the value label, `Slider.Value`, MinMax and `aria-valuetext`.
- **Fill origin**: `origin="start" | "center" | number`.
- **Track modes**: `track="normal" | "inverted" | "none"`. The custom Indicator draws one or two segments using logical `inset-inline-start` (bottom/height when vertical).
- **Draggable range** (`draggableTrack`): dragging the fill moves every thumb by the same step-rounded delta, clamped so the span is kept.
- **Editable handles** (`editable`, opt-in, `{ minCount = 1, maxCount = ∞ }`, Ant `range.editable`):
  - **Add**: press the bare track (or the fill, unless `draggableTrack`), or use `Slider.AddHandle` (adds in the middle of the widest gap).
  - **Remove**: Delete/Backspace on a focused handle (`aria-keyshortcuts`), `Slider.RemoveHandle` (removes the last-focused handle), or drag a handle more than 40px off the track (`data-removing` shows it fading).
  - Counts are respected: the buttons disable at the limits.
  - A polite `role="status"` region announces "Handle added at 35. 4 handles." / "Handle at 20 removed. 3 handles.", and focus moves to the new handle or its neighbour.
- **`showMinMax`**: formatted min and max at the track ends (Carbon).
- **Vertical**: fully styled (default height `h-56`), with marks, labels, min/max and the value label on the right.
- **Field**: Label / Description / Error work through Field, and invalid styling comes from Field state. `name` / `form` pass through.
- **Motion (Emil)**: 125ms press scale on the thumb, no transition on position while dragging, and an instant value label (controlled open, no delay). Reduced motion via the tokens.
- **Stories (19)**: Default, States, Sizes, Range, MultiThumb, Marks, RestrictToMarks, ValueLabel, FormatAndScale, Origin, TrackModes, DraggableRange, Editable, WithInput, MinMax, Vertical, WithField, Density, Themes.
- **Tests**: 40.
  - Mutation-checked: restrict-to-marks keyboard, read-only and drag-off removal.

### Paired number input

As George decided, there is no `Slider.Input` part yet. The `WithInput` story pairs the slider with our `Input`:

- It's synced both ways: typing 75 and pressing Enter moves the thumb; arrow keys update the input.
- It clamps on commit (250 becomes 100).
- Both controls are labelled.

**Follow-up**: GEO-953, a `Slider.Input` built on NumberField (GEO-929).

### Fixed during verification

- **Disabled text contrast**: dimming the whole Root dropped label/value text to 2.4:1 (axe serious). Now only the control is dimmed.
- **Editable story**: rendered two tracks, because auto-render only looked for a composed Control and missed one inside Body. It now checks for Body too (test added).
- **Track press on the fill in editable mode** moved a thumb instead of adding a handle. Fixed.
- **Drag-off removal never fired**:
  - The removing thumb wasn't known until its value changed. It's now taken from the pressed thumb (`data-index`).
  - The release handler was unsubscribed by the drag-end re-render. Removal now runs from Root's drag-end handler, deferred after Base UI's own commit.
- **Value label in themed panels**: when portalled to `<body>` it used the page theme, so it's now portalled into the Control.
- **Density**: the thumb was a fixed size; it now follows `--sp-control-icon`.

### Verified

- `pnpm verify slider`: all checks passed (19 stories, 0 violations, 0 inconclusives). Full suite: 435 tests.
- **Playwright**:

  | Check                             | Result                                                                                                                 |
  | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
  | Label on hover                    | Opens                                                                                                                  |
  | Label during drag                 | Follows the thumb (x 317 = 317, above it)                                                                              |
  | Label after release               | Hides                                                                                                                  |
  | Keyboard Tab                      | Focus ring (two-tone) + label                                                                                          |
  | Shift+Arrow / End                 | Work                                                                                                                   |
  | Coarse pointer                    | Hit area 44px                                                                                                          |
  | Draggable range                   | 30–60 → 44–74                                                                                                          |
  | Editable                          | Click adds 35 and announces it; focus moves to the new handle; drag-off removes 20 and announces it; Add disables at 5 |
  | Restrict to marks                 | Click at 70 snaps to the hidden 60 mark                                                                                |
  | Vertical                          | Click near the top gives 90                                                                                            |
  | High-contrast / dark value labels | Render with theme colours                                                                                              |
  | Paired input                      | Synced both ways, clamps                                                                                               |

## 2026-11-16 — Scope decisions (GEO-931)

- **Branch**: `geo-931-enhance-slider`, off `geo-921-enhance-previewcard` @ `088e26d`.
- **Blocker**: GEO-919 Tooltip is done. The value label will use `Tooltip`.
- **Research**: RESEARCH.md covers all 9 libraries plus Base UI 1.9. GOV.UK and Primer have no slider.

### Decisions (George, 2026-11-16)

1. **Value label**: `valueLabel="auto"` by default. It shows on hover, focus and drag, using Tooltip.
2. **Paired number input**: no `Slider.Input` part yet.
   - NumberField (GEO-929) is being built in Lane 4, and the part should be built on it.
   - For now, a story pairs the slider with our `Input`, synced both ways and accessible.
   - Follow-up ticket: `Slider.Input` built on NumberField. The coordinator creates it.
3. **Ant add/remove handles (`range.editable`)**: build now, opt-in.
   - Add by clicking the track or a button.
   - Remove with Delete/Backspace on the focused handle, a button, or by dragging off the track (Ant).
   - Respect min and max handle counts.
   - Keyboard accessible, with screen-reader announcements for add and remove.
4. **Colours**: accent plus `valid` / invalid only, with no palette prop.
5. The rest of the proposed scope is approved.

### Questions (now answered)

1. **Value label default**: `auto` (hover/focus/drag) or `off`? Recommend auto.
2. **Paired number input**: a `Slider.Input` part, or a story only? Recommend the part.
3. **Ant add/remove handles**: build now, or as its own ticket? Recommend its own ticket.
4. **Colours**: accent plus `valid` / invalid only, with no palette prop? Recommend yes.
