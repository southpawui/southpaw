# VisuallyHidden — Change Log

## 2026-11-21 — Signed off by George; /improve findings

The /improve audit was scoped to the component and the ErrorSummary change. It was checked in Chromium:

- **Test gap (fixed):** nothing covered `focusable` together with `render` where the element itself takes focus, such as a skip-style link. A new test renders it as an `<a>` and checks the slot, `data-focusable`, the conditional `sr-only` and Tab focus. The browser check confirms that `focus-within` includes the element itself: focused, it's static and unclipped.
- **Confirmed, no change:** hidden text inside an RTL `overflow: auto` box causes no overflow (scrollWidth equals clientWidth), and it stays clipped in print.
- **Known trade-off, no change:** a layout class in `className` (for example `relative`) puts the box back in the flow. That's the cost of George's decision not to use `!important`. It's documented in the code and above, so I didn't add a dev warning.

Checks: 1010 tests pass across 46 files, 9 of them for VisuallyHidden. `pnpm verify` passes for visuallyhidden and errorsummary with no inconclusives. ESLint and Prettier are clean. The scratch type-check found no errors in either component.

## 2026-11-21 — Implementation (GEO-968)

Built to George's decisions (option (a) on all 10; see RESEARCH.md).

**Component**

- `VisuallyHidden` renders a `span` with `data-slot="visually-hidden"`. `render` (Base UI `useRender`) swaps the element, the ref is forwarded, and `className` merges through `cn()`. Switching to `mergeClassName` when GEO-958 lands is a one-line change.
- **Hidden (default):** `sr-only m-0 select-none` plus `::before` and `::after` with `content: '\00a0'`, which is GOV.UK's fix set. The literal `sr-only` class stays, so `.sr-only` selectors and the existing tests that look for it still match.
- **`focusable`:** the same classes behind `not-focus-within:not-active:`. It's hidden until it, or something inside it, has focus or is pressed. It's CSS only, with no JS, and the spacers drop away while it's shown. It carries `data-focusable`. How it looks when shown is up to the consumer.
- **No hook, style export, `!important` or `visible` prop.** These were rejected; see below.

**ErrorSummary (decision 9):** `visibleText` now also strips `[data-slot="visually-hidden"]`, because `focusable` mode has no bare `.sr-only` class. Without that, its text leaked into collected error messages ("Enter postcode (shown on focus)"). There's a new ErrorSummary test, and it fails without the change.

**Bug found while building:** the nbsp class was first written as the JS string `"before:content-['\\00a0']"`. Tailwind scans the source text, so it generated a selector for the double-backslash class, while the runtime class had a single backslash. The pseudo-elements computed to `content: none`. The class strings now use `String.raw`, so the source and the runtime value are both `\00a0`.

**Checked with Playwright (Chromium)**

- The hidden box is absolute and 1×1, with `clip-path: inset(50%)`, `margin: 0`, `user-select: none` and `white-space: nowrap`. `::before` and `::after` contain U+00A0.
- Accessible names are "Change name" and "Change email address". Hidden text butting straight against a word still reads as two words. Chromium already spaced plain `sr-only` text correctly. The spacers are for engines that don't, which GOV.UK reports for WebKit/VoiceOver. The cost is extra whitespace in the computed name ("Change name "), which screen readers ignore. GOV.UK ships the same.
- `focusable`: unfocused it's absolute 1×1 and clipped. When tabbed to, it's static, unclipped and 119×18, with no spacers. On blur it's hidden again.
- RTL story: `scrollWidth === clientWidth` at 1000px and 360px, with hidden text at the start and end of a line, in a flex row and in a table header cell.
- jsdom ignores pseudo-elements and reads "Changename", so the unit test only checks that the hidden word is in the name. The spacing is checked in the browser.

**Stories**

- Default: GOV.UK summary-list "Change" links.
- States: hidden; in a flex row with icons; focusable, not focused; focusable, focused (an inert preview). Valid, error and disabled don't apply to text.
- Density: unaffected.
- Themes: every state in light, dark and high contrast.
- Render: a heading only screen readers use.
- RightToLeft.

The flex-row demo uses icon plus visible text, not icon-only links. An icon-only link would need a Tooltip (GEO-959), and that Tooltip would become the name, which hides what the demo is showing.

**Not in this ticket (decision 10):** moving Field, Fieldset, Button `srOnly` and Kbd's "then" onto the component. Those are follow-ups in the Button and Field builds.

### Considered and rejected (approved by George, 2026-11-21)

- **`useVisuallyHidden` hook** [Spectrum]: Base UI hides its own native inputs, and `render` covers the rest.
- **Exported style object** [MUI, Chakra]: there's no runtime CSS-in-JS here, and `sr-only` already fills that role.
- **`isVisible` prop** [Primer]: conditional rendering does the same.
- **`!important` by default** [GOV.UK]: it blocks intentional overrides. Instead, the docs say not to add layout classes, because `relative`/`flex` override `sr-only`.
- **Legacy `clip: rect()`** [GOV.UK, Carbon, Mantine, Chakra, Primer, Spectrum]: it's only needed for IE11.
- **Rebuilding SkipLink on `focusable`** [GOV.UK]: SkipLink keeps its own fixed, sliding overlay. It has motion and safe-area handling, and it's a chip, not inline text.
