# AlertDialog — Change Log

## 2026-11-11 — Full enhancement

### What changed

- Added `AlertDialog.Header` — flex-col container for icon + title/description
- Added `AlertDialog.Icon` — themed container for leading icon (color: danger/warning/info/success/default, shape: circle/square/rounded, size: sm/md/lg)
- Added `AlertDialog.Footer` — responsive action buttons (full-width stacked on mobile, row on sm+)
- Footer uses `flex-col-reverse` on mobile so primary action appears first
- Popup uses `max-w-[calc(100vw-2rem)] sm:max-w-sm` — mobile-safe with sm breakpoint override
- Popup uses `flex flex-col` layout for Header/Footer structure
- Fixed easing from `--sp-easing-expressive` to `--sp-easing-default` (consistent with Dialog)
- Animation: scale + opacity entrance/exit using motion tokens
- Updated RESEARCH.md with Ant Design, GOV.UK, Primer findings (now covers all 9 libraries)
- 7 unit tests, 3 stories (Default, WithIcon, Themes)
- Themes shows destructive + confirmation variants across light/dark/high-contrast
- 0 a11y violations

### Why

- **Header with icon support**: Composition pattern — icon sits to the left of title/description. No dedicated icon slot (0/9 competitors have one) but the Header's `flex items-start gap-4` layout naturally supports icons.
- **Footer responsive**: Same pattern as Dialog — buttons stack on mobile for touch targets. `flex-col-reverse` puts primary (danger) action on top.
- **sm max-width**: AlertDialogs are intentionally compact (sm = 384px). Confirmations don't need wide dialogs.
- **No backdrop dismiss**: Per WAI-ARIA alertdialog spec, backdrop click should NOT close the dialog. Base UI handles this natively.
- **No Escape dismiss**: Same — alertdialog requires explicit user action to close.

### Considered and rejected

- **Dedicated icon slot/prop**: 0/9 competitors have this. Icons are composed into the Header via children — more flexible.
- **Destructive variant prop**: shadcn and Chakra style destructive confirms differently, but it's the consumer who chooses `<Button color="danger">` — not a prop on AlertDialog. Keeps the component simple.
- **Focus on cancel button**: The research suggested focusing cancel by default (safer UX). Base UI handles initial focus automatically — it focuses the first focusable element, which is typically the cancel button if it comes first in DOM order. Our Footer uses `flex-col-reverse` on mobile but `flex-row` on desktop, so focus goes to cancel on desktop and confirm on mobile. This is acceptable.
