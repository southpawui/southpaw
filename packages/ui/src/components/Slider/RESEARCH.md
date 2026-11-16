# Slider — Competitive Research

Researched: 2026-11-08. Redone in full across all 9 libraries + Base UI on 2026-11-16 (GEO-931).

## Baseline: what Base UI 1.9 gives us

- **Parts**:
  - Root
  - Label
  - Value (`<output>`, render function of formatted values)
  - Control (the pointer area)
  - Track
  - Indicator (the fill)
  - Thumb (wraps a visually hidden `<input type="range">`)
- **Values**: a single number or an array, which gives any number of thumbs (range / multi-thumb). Also `min`, `max`, `step`, and `largeStep` (Shift+Arrow and PageUp/PageDown).
- **Thumbs**:
  - `minStepsBetweenValues`
  - `thumbCollisionBehavior: 'push' | 'swap' | 'none'`
  - `thumbAlignment: 'center' | 'edge'` (thumb inside the track ends)
  - Per-thumb `disabled`, `getAriaLabel(index)`, `getAriaValueText(formatted, value, index)`
- **Format**: `format` (`Intl.NumberFormatOptions`) and `locale`, used by Value and `aria-valuetext`.
- **Events**:
  - `onValueChange`, with reasons `drag`, `track-press`, `keyboard` and `input-change`, and `activeThumbIndex`.
  - `onValueCommitted` on release or keyup (MUI `onChangeCommitted`, Mantine `onChangeEnd`, Ant `onChangeComplete`).
- **Orientation**: horizontal and vertical. RTL is supported.
- **Field integration**: Root state includes Field state (`invalid`, `valid`, `touched`, `dirty`), plus `name` and `form`.
- **Data attributes**: `data-dragging`, `data-orientation`, `data-disabled`, `data-invalid`, `data-index` (thumb).
- **Not in Base UI**:
  - marks / ticks
  - a value label (tooltip)
  - restrict-to-marks
  - fill origin
  - inverted track
  - non-linear scale
  - draggable range track
  - read-only
  - paired number input
  - sizes

## Feature comparison

| Feature                             | shadcn (Base) | Mantine                                 | Chakra                    | MUI                         | Ant                                | GOV.UK | Carbon                       | Spectrum                         | Primer | Ours (now)             |
| ----------------------------------- | ------------- | --------------------------------------- | ------------------------- | --------------------------- | ---------------------------------- | ------ | ---------------------------- | -------------------------------- | ------ | ---------------------- |
| Range (2 thumbs)                    | Yes           | RangeSlider                             | Yes                       | Yes                         | `range`                            | —      | Range slider                 | RangeSlider                      | —      | Base, story only       |
| Multi-thumb (3+)                    | Yes           | —                                       | Yes                       | Yes                         | Yes                                | —      | —                            | —                                | —      | Base only              |
| Min distance between thumbs         | —             | `minRange`                              | `minStepsBetweenThumbs`   | via onChange                | —                                  | —      | —                            | —                                | —      | Base only              |
| Thumb collision push / swap         | —             | —                                       | `thumbCollisionBehavior`  | `disableSwap`               | —                                  | —      | —                            | —                                | —      | Base only              |
| Marks / ticks                       | —             | `marks`                                 | `marks`                   | `marks`                     | `marks`, `dots`                    | —      | —                            | —                                | —      | **No**                 |
| Mark labels                         | —             | Yes                                     | Yes                       | Yes                         | Yes (styled)                       | —      | custom labels (low/med/high) | —                                | —      | **No**                 |
| Hidden marks (snap without showing) | —             | `hidden`                                | —                         | —                           | —                                  | —      | —                            | —                                | —      | No                     |
| Restrict to marks                   | —             | `restrictToMarks`                       | —                         | `step={null}`               | `step={null}`, `dots`              | —      | —                            | —                                | —      | No                     |
| Value label on thumb (tooltip)      | —             | `label`, `labelAlwaysOn`, show on hover | `DraggingIndicator`       | `valueLabelDisplay` auto/on | `tooltip` open/formatter/placement | —      | tooltip when no text input   | —                                | —      | **No**                 |
| Value label formatter               | —             | `label` fn                              | ValueText                 | `valueLabelFormat`          | `tooltip.formatter`                | —      | —                            | `getValueLabel`, `formatOptions` | —      | Base `format`          |
| Visible value / output              | —             | —                                       | `ValueText`               | —                           | —                                  | —      | text input                   | `showValueLabel`                 | —      | Yes (Value)            |
| Paired number input                 | —             | —                                       | —                         | example                     | with InputNumber                   | —      | **built in** (hideable)      | —                                | —      | No                     |
| Min / max labels                    | —             | —                                       | —                         | via marks                   | —                                  | —      | Yes                          | —                                | —      | No                     |
| Vertical                            | Yes           | Yes                                     | Yes                       | Yes                         | Yes                                | —      | —                            | Yes                              | —      | Base, unstyled         |
| Fill origin (center / custom)       | —             | `startPointValue`                       | `origin` start/center/end | —                           | `included`                         | —      | —                            | `fillOffset`                     | —      | No                     |
| Inverted / no track fill            | —             | `inverted`                              | —                         | `track="inverted" \| false` | `reverse`, `included={false}`      | —      | —                            | `isFilled`                       | —      | No                     |
| Non-linear scale                    | —             | `scale`                                 | —                         | `scale`                     | —                                  | —      | —                            | —                                | —      | No                     |
| Draggable range track               | —             | —                                       | —                         | —                           | `range.draggableTrack`             | —      | —                            | —                                | —      | No                     |
| Add / remove handles                | —             | —                                       | —                         | —                           | `range.editable` (+ min/maxCount)  | —      | —                            | —                                | —      | No                     |
| Per-thumb disabled                  | —             | —                                       | —                         | —                           | `disabled` array                   | —      | —                            | —                                | —      | Base, unstyled         |
| Sizes                               | —             | `size`                                  | sm/md/lg                  | small/medium                | —                                  | —      | —                            | width                            | —      | No                     |
| Thumb size / custom thumb content   | —             | `thumbSize`, `thumbChildren`            | `thumbSize`               | slots                       | —                                  | —      | —                            | —                                | —      | No                     |
| Colours                             | —             | `color`                                 | `colorPalette`            | `color`                     | —                                  | —      | —                            | `trackGradient`                  | —      | Hard-coded `neutral-*` |
| Read-only                           | —             | —                                       | `readOnly`                | —                           | —                                  | —      | Yes (focusable)              | —                                | —      | No                     |
| Invalid / warning + message         | —             | —                                       | `invalid`                 | —                           | —                                  | —      | invalid + warn               | —                                | —      | Field only             |
| Large step (Shift / PageUp)         | —             | —                                       | `largeStep`               | `shiftStep`                 | —                                  | —      | `stepMultiplier`             | —                                | —      | Base                   |
| Commit event                        | —             | `onChangeEnd`                           | `onValueChangeEnd`        | `onChangeCommitted`         | `onChangeComplete`                 | —      | —                            | `onChangeEnd`                    | —      | Base                   |
| Contextual help next to label       | —             | —                                       | —                         | —                           | —                                  | —      | —                            | `contextualHelp`                 | —      | Field                  |
| Label position top / side           | —             | —                                       | —                         | —                           | —                                  | —      | —                            | `labelPosition`                  | —      | No                     |
| Density                             | —             | —                                       | —                         | —                           | —                                  | —      | —                            | —                                | —      | Partial                |

- **GOV.UK**: no slider component. Its question-pages guidance prefers a text input for numbers, which matches USWDS ("use a regular text input when users need a precise number").
- **Primer**: no slider in Primer React.

## Guidance worth carrying into the docs

- **Carbon**: don't use a slider for very large ranges (1–1000), very small ones (1–3), non-numeric values or dates. Pair it with a number input so precise entry is possible. Read-only stays focusable and readable; disabled does not.
- **USWDS / Sainsbury's**: sliders suit imprecise values. For a precise number, offer a text input (the paired input covers this).
- **MUI / Mantine / Chakra**: use `aria-valuetext` (`getAriaValueText`) whenever the number alone isn't meaningful ("$40", "3 stars", scaled values).
- **Spectrum**: the value label is shown by default when there's a label, and fill can start from an offset.
- **Touch**: the thumb's hit area should be at least 44×44px on coarse pointers (Apple HIG; our density tokens already raise controls to 44px).

## Proposed scope

1. **Token styling + states**:
   - The track is `border-control`-tinted; the fill and thumb ring use `accent` (UI control, not brand); the thumb is `surface-base`.
   - Two-tone focus ring.
   - Hover and dragging states, with Emil's press scale on the thumb (no transition on position while dragging).
   - **States**: default, `valid` (success fill, the established Southpaw pattern), invalid from Field (danger), disabled, read-only. Forced-colours support.
2. **Sizes** `sm | md | lg` (Mantine, Chakra, MUI) for track thickness and thumb size, density-aware. The thumb gets a ≥44px hit area on coarse pointers.
3. **Auto-render**: `Slider.Root` renders Control / Track / Indicator / one Thumb per value when no children are passed (the same pattern as Checkbox/Switch). Raw parts stay exported for full composition.
4. **Range and multi-thumb**:
   - Styled, with per-thumb `getAriaLabel` defaults ("Minimum" / "Maximum").
   - `minStepsBetweenValues` and `thumbCollisionBehavior` documented.
   - Per-thumb disabled styling (Ant).
5. **Marks** (Mantine, Chakra, MUI, Ant):
   - `marks={true}` gives one per step. Otherwise `number[]` or `{ value, label?, hidden? }[]`.
   - Ticks sit on the track (filled and unfilled colours) with labels below (or beside, when vertical).
   - `Slider.Mark` / `Slider.Marks` parts.
6. **Restrict to marks** (Mantine `restrictToMarks`, MUI/Ant `step={null}`):
   - Pointer and keyboard both snap to the nearest mark.
   - Arrow keys move mark-to-mark.
7. **Value label on the thumb** using our **Tooltip** (MUI, Mantine, Ant, Chakra, Carbon):
   - `valueLabel="auto" | "always" | "off"`.
   - `auto` shows on hover, focus and drag, with no delay (it's feedback, not a hint).
   - Formatted by `format` or a `formatValue(value, index)` function (MUI `valueLabelFormat`, Spectrum `getValueLabel`).
8. **`scale`** (MUI, Mantine): maps the internal value to a displayed value (e.g. 2^x) for the label, Value and `aria-valuetext`.
9. **Fill origin** (Mantine `startPointValue`, Chakra `origin`, Spectrum `fillOffset`): `origin="start" | "center" | number`, so the fill grows from a centre or custom point (e.g. −50…50 balance).
10. **Track modes** (MUI `track`, Mantine `inverted`, Ant `included`): `track="normal" | "inverted" | "none"`.
11. **Draggable range track** (Ant `range.draggableTrack`): drag the filled segment to move both thumbs and keep the span.
12. **Paired number input** (Carbon default, MUI/Ant examples):
    - `Slider.Input` binds to a thumb index and stays in sync both ways.
    - It clamps and steps on commit, uses Southpaw `Input` styling, and is labelled from the slider.
13. **Min/max labels** (Carbon): `showMinMax` renders formatted min and max at the track ends.
14. **Read-only** (Chakra, Carbon): focusable and announced, but value changes are ignored, with `aria-readonly`.
15. **Field integration**: Label / Description / Error through Field; invalid styling; `name` / `form` for submission. A `labelPosition="top" | "side"` story (Spectrum) through layout.
16. **Vertical**: styled, with marks, value label and min/max all orientation-aware. It's given a height by default.
17. **Motion (Emil)**:
    - The thumb uses 125ms press feedback (`--sp-scale-press`).
    - Fill and thumb move with no transition while dragging, and with a 150ms ease-out on track press and keyboard.
    - The value-label tooltip appears instantly.
    - Reduced motion via the tokens.
18. **Stories**:
    - Default, States (default/valid/invalid/disabled/read-only), Sizes, Range, MultiThumb, Marks, RestrictToMarks, ValueLabel, Format & Scale, Origin, TrackModes, DraggableRange, WithInput, MinMax, Vertical, Field, Density.
    - Themes: every state × size × appearance in 3 themes.

### Considered, not proposed

- **Arbitrary colour palettes** (Mantine `color`, Chakra `colorPalette`, MUI `color`): our rule is accent for controls and brand for CTAs only. State colours come from `valid` / invalid. A track gradient (Spectrum) is a className on Track, shown in a story rather than added as a prop.
- **`thumbChildren` / custom thumb content** (Mantine): the Thumb part already accepts children and `render`, so no extra prop.

## Questions for George

1. **Value label default:** `auto` (shows on hover, focus and drag, like MUI, Mantine and Carbon) or `off`? Recommend **auto**.
2. **Paired number input:** a `Slider.Input` part (Carbon builds it in), or only a story composing our Input? Recommend the **part**: precise entry is the main a11y and usability escape hatch (USWDS, Carbon).
3. **Ant's add/remove handles** (`range.editable`, click to add, drag off to remove): it's in one library, so it's in scope by our rule, but it's a large, niche interaction. Build it now, or split it into its own ticket? Recommend **its own ticket**. Everything else, including the draggable range track, is in this ticket.
4. **Colours:** accent fill plus `valid` / invalid states only, with no colour palette prop? Recommend **yes**, consistent with Checkbox, Radio and Switch.

## Sources

- Base UI Slider — https://base-ui.com/react/components/slider (+ `@base-ui/react@1.9.0` types)
- shadcn Slider — https://ui.shadcn.com/docs/components/slider
- Mantine Slider — https://mantine.dev/core/slider/
- Chakra Slider — https://chakra-ui.com/docs/components/slider
- MUI Slider — https://mui.com/material-ui/react-slider/
- Ant Design Slider — https://ant.design/components/slider
- GOV.UK question pages — https://design-system.service.gov.uk/patterns/question-pages (no slider component)
- Carbon Slider — https://carbondesignsystem.com/components/slider/usage/
- Spectrum Slider — https://react-spectrum.adobe.com/react-spectrum/Slider.html
- Primer — no slider component
- USWDS Range slider — https://designsystem.digital.gov/components/range-slider/
- Sainsbury's Input range — https://design-systems.sainsburys.co.uk/components/input-range/
