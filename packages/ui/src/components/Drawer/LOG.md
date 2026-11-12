# Drawer — Change Log

## 2026-11-12 — Full enhancement

### What changed

- Added `direction` prop on Root: left/right (default)/top/bottom — maps to Base UI's `swipeDirection`
- Added `size` prop on Popup: sm/md/lg/full — responsive widths for left/right, vh heights for top/bottom
- Added `Drawer.Header` — flex container for title + close button
- Added `Drawer.Body` — scrollable content area (overflow-y-auto, flex-1)
- Added `Drawer.Footer` — sticky action bar with border-top separator
- Added `Drawer.CloseButton` — styled X, hidden on mobile (`hidden sm:block`)
- Added `Drawer.Handle` — drag pill for bottom/top sheets, hidden on desktop (`sm:hidden`)
- Handle + CloseButton swap at `sm` breakpoint: mobile gets handle (swipe), desktop gets X (click)
- Left/right drawers: full height (inset-y-0), responsive width (w-full on mobile, constrained on sm+)
- Top/bottom drawers: full width (inset-x-0), vh-based height
- Slide animation using `--sp-duration-drawer` (500ms) and `--sp-easing-drawer` (iOS curve)
- Trigger is unstyled (consumer wraps with Button, matching Dialog pattern)
- Close is unstyled (consumer wraps with Button)
- Switched all hardcoded colours to semantic tokens
- Width classes scoped to `data-[swipe-direction=left/right]` so top/bottom aren't constrained
- 8 unit tests, 5 stories (Default, Directions, BottomSheet, Sizes, Themes)
- 0 a11y violations

### Why

- **Direction**: shadcn, Mantine, Chakra, MUI, Ant (5/9). Essential for navigation (left), detail panels (right), bottom sheets (bottom), notifications (top).
- **Responsive widths**: On mobile, left/right drawers go full width (w-full) since the viewport is narrow. On desktop, they constrain to sm/md/lg. Top/bottom always span full width.
- **Handle + CloseButton swap**: Mobile users swipe to dismiss (handle as visual affordance), desktop users click X. Both are always in DOM for keyboard accessibility.
- **Drawer easing**: Uses `--sp-easing-drawer` (iOS-style curve from Emil Kowalski) and `--sp-duration-drawer` (500ms) — slower and more expressive than dialog animation because drawers are larger surface changes.
- **Footer border-top**: Unlike Dialog, Drawer footer has a top border to visually separate it from scrollable body content. Drawers tend to have longer content, so the separation is more important.
- **Unstyled Trigger/Close**: Matches Dialog pattern — consumer chooses which Button variant to use.

### Considered and rejected

- **Snap points**: Only shadcn/vaul (1/9). Complex interaction model, niche use case. Consumers can build on top of Base UI's swipe mechanics if needed.
- **Nested drawers**: Only shadcn/vaul (1/9). Base UI supports natively but adds complexity.
- **Scale background**: Only shadcn/vaul (1/9). Visual polish but non-standard pattern.
- **Mouse drag on desktop**: Base UI's swipe is touch-only by design. Desktop users use X/Escape/backdrop. This matches shadcn/vaul, iOS, and Google Maps patterns.
- **Fixed pixel widths**: User feedback — should use Tailwind responsive classes, not hardcoded px values. Switched to w-72/w-80/w-96 etc.
