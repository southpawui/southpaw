# Button — Change Log

## 2026-11-07

### Initial styling (Phase 1) — f5b50d1

Styled with token system. Basic unstyled Base UI wrapper.

### Full enhancement (GEO-895) — 178c84c

**Variant × Color separation**: Split visual style into `variant` (solid/outline/ghost) and `color` (default/brand/danger/inverse). Why: shadcn and Chakra both separate these concerns — combining them into a single prop (like "destructive") limits composition. A ghost danger button needs both axes.

**`label` prop**: Shorthand for children text. Why: matches the pattern where a prop is simpler than wrapping children for the common case. Label takes precedence over children so you can't have conflicting content.

**`srOnly` prop**: Screen reader label for icon-only buttons. Why: icon-only buttons need accessible names but shouldn't show visible text. This avoids verbose `aria-label` boilerplate.

**`icon` + `iconPosition`**: Icon as a ReactNode prop, not a child. Why: lets us apply asymmetric padding (less padding on the icon side) and swap the icon for a Spinner during loading without the consumer managing the layout.

**`loading` state**: Spinner replaces icon, button gets `aria-busy`. Why: every major library has this. Without it, consumers build inconsistent loading patterns.

**Nested radius via `--sp-nested-radius`**: When a button is inside a container (card, toolbar), it reads the container's radius variable and adjusts. Why: concentric border radius is a Material Design 3 principle — inner radius = outer radius - padding.

**Brand colour reserved for CTAs**: `color="default"` uses accent (not brand). Brand is only for primary CTAs. Why: user decision — brand should be rare and intentional, accent is for everyday UI controls.

## 2026-11-18 — ButtonGroup integration (GEO-896, approved shared change)

- **Reads `ButtonGroupContext`** (`../ButtonGroup/context.ts`). The group's `size`, `variant` and `color` are defaults, and the Button's own prop wins. The group's `disabled` disables every Button, even one with `disabled={false}` (MUI, Spectrum).
- **Adds `data-variant`**, so an attached ButtonGroup can draw dividers between solid buttons.
- **Icon-only size follows the group.** `size="icon"` takes the sm, md or lg square from the group's size, so it matches its neighbours. It's unchanged outside a group (still the md square).
- **Bug fix:** `disabled` is destructured out of the rest props. Before, `{...props}` came after `disabled={loading || props.disabled}`, so an explicit `disabled={false}` re-enabled a loading Button. A regression test is in ButtonGroup.test.tsx.
- **Pre-existing, not changed:** a loading Button is also `disabled`, so the disabled opacity stacks on top of `opacity-80`, which contradicts the "Loading keeps full opacity" comment. Flagged for its own ticket.
- `pnpm verify button`: all checks pass. The existing Button tests are unchanged and pass.

## 2026-11-18 — `inactive` (GEO-932, approved shared change)

- **George's decision:** build Primer's focusable "inactive" for **both** Button and Toggle, with the Button change in its own commit.
- **What it does:** `inactive` looks disabled but **stays focusable and hoverable**, so a Tooltip can explain why it's unavailable.
- **How:** Base UI Button's `disabled` + `focusableWhenDisabled`. Base UI keeps the tab stop, sets `aria-disabled="true"` (no native `disabled`), and swallows click, Enter and Space.
- **Styling:**
  - the disabled opacity and `cursor-not-allowed`;
  - pointer events stay **on** (unlike `disabled:pointer-events-none`) so a Tooltip can open;
  - hover classes are filtered out of the colour × variant map at runtime (the literals stay in the source for Tailwind);
  - no press scale;
  - `data-inactive`.
- **Precedence:** `disabled` and `loading` win over `inactive`. A ButtonGroup's `disabled` still makes it really disabled.
- **Story:** Inactive (variants, colours, icon, icon-only, and an enabled/disabled/inactive row to Tab through).
- **Tests:**
  - it's focusable and `aria-disabled`, and a click, Enter or Space doesn't call `onClick`;
  - its classes have no hover and no scale;
  - `disabled` wins.
- **Checks:** `pnpm verify button` passes all checks.
- **GEO-959:** the icon-only inactive "Settings" button in the story needs a Tooltip once Tooltip lands.

**Signed off** by George, 2026-11-18 (with Toggle). /improve was a quick self-review with no new findings.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.

## 2026-11-21 — Loading Button no longer shows the disabled fade (GEO-961, GEO-970 Part A)

- **Bug:** a loading Button is natively `disabled`. The `disabled:opacity-[--sp-state-disabled-opacity]` rule has higher specificity than `opacity-80`, so every loading Button rendered at **0.38**, the full disabled fade. The comment said loading keeps its look.
- **Fix:** the disabled fade applies only when the Button isn't loading. Loading keeps a light **`opacity-90`** (the busy cue) along with the spinner and `aria-busy`. `pointer-events-none` stays.
- **0.9, not 0.8 (George, at sign-off):** at 0.8, brand on light measured 4.5028:1, which passes AA with no margin. 0.9 gives it room.
- **Measured in Chromium (Loading story):**
  - Opacity before: all variants 0.38. After: all variants 0.9.
  - Label contrast at 0.9, composited over the page:
    - light: solid, outline and ghost 13.10, brand **5.55**, danger 5.54;
    - dark: solid 13.93, brand 7.49, danger 6.81;
    - high-contrast: solid 17.49, brand 8.07, danger 6.86.
  - Everything is at least 5.5:1. At 0.8, light-theme brand was 4.50.
- **Tests:** loading has `opacity-90` and no disabled-fade class; plain disabled keeps the disabled fade. `pnpm verify button` passes all checks.
