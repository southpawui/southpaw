# VisuallyHidden — Research (GEO-968)

Text that screen readers announce but sighted users don't see, for example `Change<VisuallyHidden> name</VisuallyHidden>`. It's a thin layer over Tailwind's `sr-only`. It adds the fixes `sr-only` lacks (word spacing, the VoiceOver margin quirk, no text selection), a `focusable` mode, and `render`.

Researched on 2026-11-21 across all 9 libraries.

## Who has what

| Feature                                 | shadcn                  | Mantine        | Chakra                   | MUI                 | Ant | GOV.UK                     | Carbon            | Spectrum                        | Primer         |
| --------------------------------------- | ----------------------- | -------------- | ------------------------ | ------------------- | --- | -------------------------- | ----------------- | ------------------------------- | -------------- |
| Component                               | – (`sr-only`; Radix VH) | ✅             | ✅                       | – (style object)    | –   | – (Sass mixin + class)     | – (class + mixin) | ✅                              | ✅             |
| Change the element                      | –                       | ✅ `component` | ✅ `asChild`             | n/a                 | –   | n/a                        | n/a               | ✅ `elementType` (default div)  | ✅ `as`        |
| Visible on focus                        | –                       | –              | –                        | –                   | –   | ✅ `-focusable` mixin      | –                 | ✅ `isFocusable` (focus-within) | –              |
| Toggle hidden off by prop               | –                       | –              | –                        | –                   | –   | –                          | –                 | –                               | ✅ `isVisible` |
| Hook / exported styles                  | –                       | – (`.classes`) | ✅ `visuallyHiddenStyle` | ✅ `visuallyHidden` | –   | ✅ mixin                   | ✅ mixin          | ✅ `useVisuallyHidden`          | –              |
| `clip-path: inset(50%)`                 | ✅ (TW)                 | – (`clip`)     | – (`clip`)               | ✅                  | –   | ✅ (+ `clip`)              | – (`clip`)        | ✅ (+ `clip`)                   | – (`clip`)     |
| `white-space: nowrap`                   | ✅                      | ✅             | ✅                       | ✅                  | –   | ✅                         | ✅                | ✅                              | ✅             |
| `margin: 0` (not -1px)                  | – (-1px)                | – (-1px)       | – (-1px)                 | – (-1px)            | –   | ✅                         | – (-1px)          | – (-1px)                        | – (-1px)       |
| Space pseudo-elements (no word-joining) | –                       | –              | –                        | –                   | –   | ✅ `::before/::after` nbsp | –                 | –                               | –              |
| `user-select: none`                     | –                       | –              | –                        | –                   | –   | ✅                         | –                 | –                               | –              |
| `!important`                            | –                       | –              | –                        | –                   | –   | ✅ (opt-out)               | –                 | –                               | –              |
| Logical properties                      | –                       | –              | –                        | –                   | –   | –                          | ✅ `inline-size`  | –                               | –              |

### shadcn/ui

- No component. Uses Tailwind `sr-only` throughout, e.g. `<span className="sr-only">Toggle Sidebar</span>` in `sidebar.tsx` and `SheetHeader className="sr-only"`. https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/sidebar.tsx
- The Radix-era docs suggested Radix `VisuallyHidden` for a hidden `DialogTitle`. Base UI has no public equivalent.

### Mantine

- `VisuallyHidden`, a `span` via `Box` (polymorphic `component`). https://github.com/mantinedev/mantine/tree/master/packages/@mantine/core/src/components/VisuallyHidden
- CSS: `clip: rect(0 0 0 0)`, 1px, `margin: -1px`, absolute, `nowrap`. No `clip-path`. No focusable mode.

### Chakra UI v3

- `VisuallyHidden` = `chakra("span", { base: visuallyHiddenStyle })`. `asChild` swaps the element; the docs show it on an `<input>`. https://chakra-ui.com/docs/components/visually-hidden
- Exports `visuallyHiddenStyle` for reuse. Uses `clip: rect(0,0,0,0)`, `margin: -1px`. https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/components/visually-hidden/visually-hidden.tsx

### MUI

- No component. `@mui/utils` exports a `visuallyHidden` style object: `clipPath: inset(50%)`, 1px, `margin: -1px`, absolute, `nowrap`. Used for table sort labels. https://github.com/mui/material-ui/blob/master/packages/mui-utils/src/visuallyHidden/visuallyHidden.ts

### Ant Design

- Nothing public. Components hide text internally with their own styles. No class, no component.

### GOV.UK

- `govuk-visually-hidden` mixin and class; `govuk-visually-hidden-focusable` for skip links. https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/helpers/_visually-hidden.scss
- `margin: 0`, because a negative margin can make VoiceOver on macOS read text in the wrong order.
- `::before` and `::after` with `content: "\00a0"`: absolute positioning drops the whitespace around the hidden text, so it runs into neighbouring words.
- `user-select: none`, so copying visible text doesn't pick up hidden text.
- `!important` on every property by default (`$important: true`), so utility classes can't unhide it.
- Focusable: hiding applies under `:not(:active):not(:focus)`. Kept visible while `:active` so a mouse click doesn't make it jump.
- Used in summary list actions: `Change<span class="govuk-visually-hidden"> name</span>`.

### Carbon

- `cds--visually-hidden` / `cds--assistive-text` class and a `visually-hidden` mixin. Logical `inline-size`/`block-size`, `clip: rect(0,0,0,0)`, `margin: -1px`, `visibility: inherit`. No component. https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/utilities/_visually-hidden.scss

### Spectrum (React Aria)

- `VisuallyHidden` with `elementType` (default `div`) and `isFocusable`. https://github.com/adobe/react-spectrum/blob/main/packages/react-aria/src/visually-hidden/VisuallyHidden.tsx
- `useVisuallyHidden()` returns `visuallyHiddenProps` (inline style + focus-within handlers), for elements that can't be wrapped. React Aria uses it for hidden native inputs.
- `isFocusable` uses focus-within in JS state, so it works when a focusable child sits inside. Styles: `clip` + `clipPath: inset(50%)`, `margin: -1px`.

### Primer

- `VisuallyHidden` (`span`, polymorphic `as`), and `isVisible` to turn hiding off. CSS module: `clip: rect(0,0,0,0)`, `margin: -1px`, `nowrap`. https://github.com/primer/react/blob/main/packages/react/src/_VisuallyHidden.tsx

## Our base: what Base UI, Tailwind and the repo already give us

**Tailwind v4.3.4 `sr-only`** (from `node_modules/tailwindcss/dist/lib.js`):

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border-width: 0;
}
.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip-path: none;
  white-space: normal;
}
```

Compared with GOV.UK, `sr-only` has no `margin: 0`, no space pseudo-elements, no `user-select: none` and no `!important`. It drops the legacy `clip` (fine: IE11 is out of scope).

**Base UI** has no public VisuallyHidden. `@base-ui/utils/visuallyHidden` (internal, not a dependency of `packages/ui`) has `visuallyHidden` (`position: fixed; top: 0; left: 0`) and `visuallyHiddenInput` (absolute). Base UI already hides its own native inputs (Checkbox, Switch, Radio, Select, OTPField), so we never hide inputs ourselves.

**SkipLink** (`SkipLink.tsx`) does not use `sr-only`. It is `fixed`, `opacity-0`, translated above the viewport, and slides in on `:focus` with motion tokens, safe-area insets and a forced-colours outline.

### The differences that matter

1. **Word-joining.** Absolute positioning blockifies the span, and leading/trailing whitespace inside it collapses. `Change<VisuallyHidden> name</VisuallyHidden>` can be read as "Changename". Our own `Field.Error` and `Fieldset.Error` rely on a trailing space in `"Error: "`, and Button puts `srOnly` text directly before the visible text with no space. GOV.UK's nbsp pseudo-elements fix this. Accessible-name computation includes CSS generated content, and names are trimmed, so the extra spaces are harmless.
2. **RTL horizontal scroll.** An absolute box with no insets sits at its static position. With `margin: -1px` (and with long `nowrap` text before clipping), it can poke past the containing block. Overflow on the inline-start side isn't scrollable, but a box placed past the inline-end edge can be, and some table/flex cases resolve the static position oddly. Known reports: Tailwind `sr-only` in a `<th>` widening the page (fixed with `relative` on the cell), and Drupal RTL skip links with `left: -10000px`. Mitigation: `margin: 0`, no physical offsets, and a Playwright test that checks `scrollWidth === clientWidth` in `dir="rtl"`. Base UI's `fixed; top:0; left:0` also avoids it, but fixed boxes move the screen-reader cursor to the viewport corner and break under transformed ancestors.
3. **Only child of a flex container.** An absolute child is out of flow. A flex parent whose only child is hidden has no in-flow content, so it collapses to its padding, and `gap` ignores the hidden element. That's correct for hidden text, but a link or button whose only content is VisuallyHidden has no visible box or focus ring. The pseudo-elements sit inside the hidden span, so they never become flex items. In `focusable` mode, the focused element does become a flex item.
4. **`!important` vs utility overrides.** `cn()` (tailwind-merge) keeps `sr-only relative` and `sr-only flex` as-is: it doesn't see them as conflicts. Tailwind v4 emits `.relative` after `.sr-only`, so `className="relative"` wins and puts the box back in flow (still clipped by `clip-path`, but it now takes 1px of space). `not-sr-only` is merged correctly. Tailwind's `sr-only!` emits `!important` on every property.
5. **Focusable handling.** GOV.UK hides under `:not(:active):not(:focus)`; React Aria uses focus-within. Tailwind v4 expresses this as `not-focus-within:not-active:sr-only`, with no JS. Using focus-within covers both the element itself and a focusable child. When visible, the pseudo-element spaces must not render, so they also sit under `not-focus-within:`.

### Current `sr-only` uses (`packages/ui/src`, non-test)

Found: 10 in component code, 3 in stories, 7 in tests, the rest in LOG/RESEARCH prose (about 23 in all).

| File                                     | Use                                  | Component reads better?                                                                                      |
| ---------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `Field/Field.tsx:134`                    | `"Error: "` prefix                   | Yes. Fixes the trailing-space reliance.                                                                      |
| `Fieldset/Fieldset.tsx:83`               | `"Error: "` prefix                   | Yes. Same.                                                                                                   |
| `Button/Button.tsx:143`                  | `srOnly` text before visible label   | Yes. No space between hidden and visible text today ("Go to next pageNext").                                 |
| `Kbd/Kbd.tsx:426`                        | `then` separator                     | Yes. Sits between other hidden spans; risk of "Kthen".                                                       |
| `Kbd/Kbd.tsx:362`                        | spoken key names                     | Maybe. Already `select-none`. Next to an aria-hidden glyph.                                                  |
| `Spinner/Spinner.tsx:91`                 | `Loading` fallback                   | Maybe. Only child of the status span, so no joining risk. Rewritten by the Spinner rebuild anyway.           |
| `Combobox/combobox-shared.tsx:472, 1858` | `role="status"` announcers           | No. Live regions, not inline text. Keep `sr-only`.                                                           |
| `Combobox/combobox-shared.tsx:1244`      | `BaseCombobox.Status`                | No. Base UI part; keep the class.                                                                            |
| `ErrorSummary/ErrorSummary.tsx:676`      | `.sr-only` selector in `visibleText` | n/a. Must also match `[data-slot="visually-hidden"]`, or focusable/hidden text leaks into the visible title. |
| `Kbd/Kbd.stories.tsx:122, 126`           | icon + hidden word                   | Yes, as docs of the pattern.                                                                                 |
| `ScrollArea/ScrollArea.stories.tsx:462`  | hidden `<caption>`                   | No. Keep `sr-only` on the caption.                                                                           |

Tests that assert the `.sr-only` class (`Kbd.test.tsx`, `Button.test.tsx`, `Field.test.tsx`) stay green if the default variant keeps the literal `sr-only` class.

## Proposed scope

- `VisuallyHidden`: a `span` by default, `render` via `useRender`, `data-slot="visually-hidden"`, `cn()` for `className`.
- Classes: `sr-only m-0 select-none` plus `before:content-['\00a0'] after:content-['\00a0']`. The literal `sr-only` class stays, so `.sr-only` selectors still match.
- `focusable`: `not-focus-within:not-active:sr-only` (and the same prefix on margin, select and pseudo-elements). No JS. Styling when shown is the consumer's job.
- No `!important` by default (see Decision 3).
- Export from the package index. Document `sr-only` for one-off cases inside components.

## Decisions

1. Base CSS: (a) `sr-only` + `m-0` + `select-none` + nbsp pseudo-elements, keeping the `sr-only` class name [GOV.UK]; (b) plain `sr-only` only [shadcn, MUI]; (c) Base UI's `fixed; top:0; left:0` [Base UI].
2. Word spacing: (a) nbsp `::before/::after` always, while hidden [GOV.UK]; (b) a `spacing` prop to turn them off; (c) none, and document "put spaces outside".
3. `!important`: (a) no; `className` can override, documented as "don't add layout classes" [Mantine, Chakra, Primer]; (b) always `sr-only!` [GOV.UK]; (c) an `important` prop.
4. Focusable: (a) `focusable` prop via CSS `not-focus-within:not-active:` [GOV.UK + Spectrum focus-within]; (b) `:focus` only, as GOV.UK; (c) JS focus-within state, as React Aria.
5. Element: (a) `span` default + `render` [Mantine, Chakra, Primer]; (b) `div` default [Spectrum].
6. Hook / style export: (a) none; `render` covers elements and Base UI hides its own inputs; (b) export a `visuallyHiddenClassName` string [Chakra, MUI]; (c) `useVisuallyHidden` hook [Spectrum].
7. `isVisible` toggle: (a) skip; conditional rendering or `render` covers it; (b) add `visible` prop [Primer].
8. SkipLink: (a) keep its own fixed, sliding positioning; it's an overlay chip with motion and safe-area handling, not inline text [Carbon, Chakra, MUI]; (b) rebuild on `focusable` [GOV.UK].
9. ErrorSummary `visibleText`: (a) also strip `[data-slot="visually-hidden"]` (one-line change, done when the component lands); (b) rely on the `sr-only` class only (misses `focusable`).
10. Migration: (a) none now; adopt in Field, Fieldset, Button `srOnly` and Kbd `then` as follow-ups, each with its own LOG entry; (b) migrate those four in this ticket.

## Exceptions (recommended not to build)

- `useVisuallyHidden` hook [Spectrum]: Base UI already hides native inputs, and `render` covers any element we own.
- Exported style object [MUI, Chakra]: no runtime CSS-in-JS here; `sr-only` is the exported "class".
- `isVisible` prop [Primer]: conditional rendering does the same thing.
- `!important` [GOV.UK]: blocks intentional overrides; tailwind-merge already resolves `not-sr-only`.
- Legacy `clip: rect()` [GOV.UK, Carbon, Mantine, Chakra, Primer, Spectrum]: only for IE11.

## Stories and tests planned

**Stories** (wrapped in `sm:max-w-md`):

- Default: `Change<VisuallyHidden> name</VisuallyHidden>` link-style action.
- States: hidden, focusable (unfocused), focusable (focused, via `pnpm interact`), inside a flex row, only child of a link.
- Density: compact, default, comfortable. Shows the component is unaffected.
- Themes: light, dark, high-contrast, forced colours; each shows every state above, with the focused focusable variant visible.
- Feature: `render` as `<h2>` and `<div>`; RTL (`dir="rtl"`) page with hidden text at line start and end, in a flex row and in a table cell.

**Unit (Vitest)**:

- Renders a `span` with `data-slot="visually-hidden"` and the `sr-only` class.
- Text is in the accessibility tree: `getByText` and `getByRole("link", { name: "Change name" })` with the hidden suffix.
- `render` swaps the element; `className` merges.
- `focusable` adds the `not-focus-within:` classes and not the bare `sr-only` class.

**E2E (Playwright)**:

- Computed styles: 1px box, `clip-path: inset(50%)`, `margin: 0`, `user-select: none`, `::before` content is nbsp.
- Accessible name of `Change<VisuallyHidden> name</VisuallyHidden>` is "Change name", not "Changename".
- Focusable: tab to it, computed `clip-path` is `none` and the box has real size; blur hides it again.
- RTL: `document.scrollingElement.scrollWidth === clientWidth` with hidden text at start, end, in flex, in a table cell and inside an overflow container.
- axe, duplicate IDs and accessible names via `pnpm verify visuallyhidden`.

## George's decisions (2026-11-21)

- **Option (a) on all 10 decisions.**
- **Migration** of the 4 existing uses (Field, Fieldset, Button `srOnly`, Kbd "then") is a follow-up during the Button and Field builds, not part of this ticket.

### Considered and rejected (approved by George, 2026-11-21)

- **`useVisuallyHidden` hook** [Spectrum]: Base UI hides its own native inputs, and `render` covers the rest.
- **Exported style object** [MUI, Chakra]: there's no runtime CSS-in-JS, and `sr-only` already fills that role.
- **`isVisible` prop** [Primer]: conditional rendering does the same.
- **`!important` by default** [GOV.UK]: it blocks intentional overrides.
- **Legacy `clip: rect()`** [GOV.UK, Carbon, Mantine, Chakra, Primer, Spectrum]: only needed for IE11.
