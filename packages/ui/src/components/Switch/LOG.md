# Switch — Change Log

## 2026-11-09 — Full enhancement

### What changed

- Auto-render Thumb inside Root (no need to pass as children)
- Added `valid` prop — green track when checked (matches Input/Textarea/Select/Checkbox pattern)
- Added `data-[invalid]` error ring from Field context
- Added `onLabel`/`offLabel` props — text inside the track (e.g. "On"/"Off", "Yes"/"No")
- Added `checkedIcon`/`uncheckedIcon` props — icon inside the thumb with opacity crossfade
- Track widens from 44px to 56px when labels present to fit text comfortably
- Thumb grows from 20px to 22px when labels or icons present
- Fixed thumb asymmetry — checked position calculated as `track - thumb - offset` (was using `translate-x-5` which was 2px short)
- Added `motion-reduce:transition-none` on Thumb (reduced motion support)
- Field.Group `direction="row"` changed from `items-start` to `items-center` (fixes alignment for Switch, Checkbox, Radio)
- Field.Group gap now uses `--sp-control-gap` for density-responsiveness (was fixed `gap-2`)
- 7 unit tests, 6 stories (Default, States, WithLabels, WithIcons, Density, Themes), 0 a11y violations

### Why

- **On/Off text labels**: GOV.UK and Carbon both implement this — provides non-colour state indication for users who can't distinguish colour (WCAG). Only 2/8 competitors have it, but it's an accessibility win.
- **Thumb icons**: Material Design 3, MUI, and Mantine all support icons inside the thumb. Common use case is check/X for state clarity, or sun/moon for dark mode toggle.
- **Thumb asymmetry fix**: The off-state had 2px padding on the left, but the on-state had 4px on the right. Now both sides have equal 2px padding.
- **items-center on Field.Group**: Switch is 24px tall, label text is 20px. `items-start` caused the label to sit 2px higher than the switch centre. `items-center` aligns them properly. This also improves Checkbox and Radio alignment.
- **--sp-control-gap**: Density should affect spacing between control and label, not just the control size. Compact=6px, Default=8px, Comfortable=12px.

### Considered and rejected

- **On/Off text as default** — Apple HIG explicitly recommends against text inside the switch. Material Design also advises against it. Made it opt-in via props.
- **Horizontal orientation** — Removed from RadioGroup; not adding to Switch either. Only 2/8 competitors have it.
- **Size variants (xs-xl)** — Mantine and MUI have these. Decided density handles sizing better — one system, not two competing sizing mechanisms.
