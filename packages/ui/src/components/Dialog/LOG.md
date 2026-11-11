# Dialog — Change Log

## 2026-11-11 — Full enhancement

### What changed

- Added `size` prop on Popup: sm (384px) / md (448px, default) / lg (512px) / full (viewport)
- Added `Dialog.Header` — flex container for title + close button (justify-between)
- Added `Dialog.Body` — scrollable content area (`overflow-y-auto`, use `max-h-[60vh]` for long content)
- Added `Dialog.Footer` — action buttons, responsive (full-width stacked on mobile, row on sm+)
- Added `Dialog.CloseButton` — styled X button in top-right with Phosphor X icon, accessible `aria-label="Close"`
- Footer uses `flex-col-reverse` on mobile so primary action appears first visually
- Footer targets buttons via `[data-slot=button]` and `[data-slot=dialog-close]>[data-slot=button]` for full-width
- Popup uses `flex flex-col` layout for Header/Body/Footer structure
- Mobile: non-full dialogs constrained to `max-w-[calc(100vw-2rem)]` so they don't touch edges
- Full size: removes border-radius, fills viewport
- Animation: scale + opacity entrance/exit using `--sp-scale-enter` and `--sp-duration-entrance`
- Backdrop: `bg-black/50` with opacity fade
- 9 unit tests, 5 stories (Default, Sizes, LongContent, WithForm, Themes)
- 0 a11y violations

### Why

- **Size variants**: 5/9 competitors have this. Different content needs different widths — a confirmation is sm, a form is md, a complex workflow is lg.
- **Header/Body/Footer structure**: 7/9 competitors use this pattern. Separates concerns — title area, scrollable content, sticky actions.
- **CloseButton**: 8/9 competitors have a built-in X button. Without it, consumers manually compose it every time.
- **Scrollable Body**: All competitors handle long content. `overflow-y-auto` on Body means the header and footer stay visible while content scrolls.
- **Mobile responsive footer**: Same pattern as Card — buttons stack full-width on small screens for touch targets. `flex-col-reverse` puts primary action on top (thumb-friendly).
- **Cancel button optional**: Default story uses single primary action since the X close button handles dismissal. Stories with two actions (Terms, confirmations) show the two-button pattern.

### Considered and rejected

- **Nested dialogs**: 4/9 support this. Base UI handles it natively — no additional work needed from us. Documented as supported but no dedicated story (complex to demonstrate).
- **Non-modal option**: 2/9 (Base UI, Radix). Base UI supports via `modal` prop. Niche use case — not worth a dedicated prop.
- **Draggable**: 0/9 competitors. Skip.
- **Dividers between sections**: Not a widespread pattern. Consumers can use Separator component inside Body if needed.
- **Destructive variant**: Belongs on AlertDialog (GEO-916), not Dialog. Dialog is for general-purpose modals.
