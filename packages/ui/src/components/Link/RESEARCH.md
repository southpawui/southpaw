# Link — Research (GEO-967)

A styled anchor for navigation: inline in body text, or standalone on its own line. Base UI has no link primitive, so ErrorSummary, SkipLink and NavigationMenu each render and style their own `<a>` today. Link gives them one set of styles and behaviour: underline, visited, focus, forced colours, new-tab handling and router `render`.

Researched on 2026-11-21 across all 9 libraries.

## Who has what

| Feature                      | shadcn                      | Mantine                               | Chakra                       | MUI                      | Ant                  | GOV.UK                       | Carbon                              | Spectrum                                  | Primer               |
| ---------------------------- | --------------------------- | ------------------------------------- | ---------------------------- | ------------------------ | -------------------- | ---------------------------- | ----------------------------------- | ----------------------------------------- | -------------------- |
| Link component               | – (Button `variant="link"`) | ✅ `Anchor`                           | ✅                           | ✅                       | ✅ `Typography.Link` | ✅ CSS classes               | ✅                                  | ✅                                        | ✅                   |
| Underline control            | –                           | ✅ always / hover / never / not-hover | ✅ underline / plain         | ✅ always / hover / none | –                    | ✅ `--no-underline`          | inline = always, standalone = hover | inline = always, standalone+quiet = hover | `inline` = underline |
| Hover thickens underline     | –                           | –                                     | –                            | –                        | –                    | ✅ 1px → 3px                 | –                                   | –                                         | –                    |
| Visited style                | –                           | –                                     | –                            | –                        | –                    | ✅ on by default             | ✅ `visited` prop, off by default   | –                                         | –                    |
| No-visited-state variant     | –                           | –                                     | –                            | –                        | –                    | ✅                           | (default)                           | –                                         | –                    |
| Muted / secondary            | –                           | via `c`                               | via `colorPalette`           | via `color`              | `type="secondary"`   | ✅ muted                     | –                                   | ✅ `secondary`                            | ✅ `muted`           |
| Text colour / inherit        | –                           | `inherit`                             | gray default                 | `color="inherit"`        | –                    | ✅ text colour               | –                                   | –                                         | –                    |
| Inverse / on dark            | –                           | –                                     | –                            | –                        | –                    | ✅ `--inverse`               | –                                   | ✅ `staticColor` white / black / auto     | –                    |
| Standalone vs inline         | –                           | –                                     | –                            | –                        | –                    | –                            | ✅                                  | ✅ `isStandalone`                         | ✅ `inline`          |
| Sizes                        | –                           | via Text `size`                       | via `textStyle`              | via Typography `variant` | –                    | –                            | ✅ sm / md / lg                     | –                                         | –                    |
| Icon                         | –                           | –                                     | example                      | –                        | –                    | –                            | ✅ `renderIcon` (end)               | –                                         | –                    |
| External / new-tab indicator | –                           | –                                     | example icon                 | aria-label advice        | auto `rel`           | ✅ text "(opens in new tab)" | launch icon advice                  | –                                         | –                    |
| Download                     | –                           | –                                     | –                            | –                        | –                    | file attachment pattern      | –                                   | ✅ `download`                             | –                    |
| Current page                 | –                           | –                                     | ✅ `_currentPage`            | –                        | –                    | nav only                     | –                                   | ✅ `aria-current`                         | –                    |
| Disabled                     | –                           | –                                     | –                            | –                        | ✅ `disabled`        | ✗ advises against            | ✅ `disabled`                       | ✅ `isDisabled`                           | –                    |
| Router integration           | `render` / `asChild`        | `component`                           | `asChild`                    | `component`              | –                    | n/a                          | `as`                                | `render` / RouterProvider                 | `as`                 |
| Stretched link               | –                           | –                                     | ✅ `LinkOverlay` / `LinkBox` | –                        | –                    | –                            | –                                   | –                                         | –                    |
| Print shows URL              | –                           | –                                     | –                            | –                        | –                    | ✅ print-friendly mixin      | –                                   | –                                         | –                    |
| Ellipsis / copyable          | –                           | –                                     | –                            | –                        | ✅                   | –                            | –                                   | –                                         | –                    |
| Gradient                     | –                           | ✅                                    | –                            | –                        | –                    | –                            | –                                   | –                                         | –                    |
| Forced colours               | –                           | –                                     | –                            | –                        | –                    | ✅                           | –                                   | ✅                                        | –                    |

### shadcn/ui

- No Link component. Button has `variant="link"` (`text-primary underline-offset-4 hover:underline`).
- The Button docs say not to use `<Button render={<a />} nativeButton={false} />` for links. Use `buttonVariants` on a plain `<a>` instead.
- Source: https://ui.shadcn.com/docs/components/button

### Mantine

- `Anchor` is polymorphic Text. `underline` takes `always`, `hover`, `never` and `not-hover`. The default can be set with `Anchor.extend` in the theme.
- It takes every Text prop (`c`, `fz`, `fw`, `inherit`) and `variant="gradient"`.
- Next.js: `<Anchor component={Link} href="/" />`.
- Source: https://mantine.dev/core/anchor/

### Chakra UI v3

- `Link` has `variant`: `plain` (default) or `underline`. `colorPalette` defaults to gray.
- Router links use `asChild`. The current page is styled with `aria-current="page"` and the `_currentPage` style prop.
- The external example adds an icon by hand. `LinkOverlay` and `LinkBox` make a whole card clickable.
- Sources: https://chakra-ui.com/docs/components/link, https://chakra-ui.com/docs/components/link-overlay

### MUI

- `underline`: `always` (default), `hover` or `none`. `color="primary"` by default. `color="inherit"` uses the surrounding text colour.
- It builds on Typography, so `variant` sets the type style (default `inherit`).
- `component="button"` renders a button that looks like a link, for actions with no `href`. `component` also takes a router link.
- Advice: descriptive text, keep the underline, add an `aria-label` for new windows.
- Source: https://mui.com/material-ui/react-link/

### Ant Design

- `Typography.Link` takes the Typography text props: `type` (secondary, success, warning, danger), `disabled`, `strong`, `underline`, `ellipsis`, `copyable`.
- It sets `rel="noopener noreferrer"` itself when `target="_blank"`.
- Sources: https://ant.design/components/typography, https://github.com/ant-design/ant-design/blob/master/components/typography/Link.tsx

### GOV.UK Design System

- **Classes:** `govuk-link`, plus the `--no-visited-state`, `--inverse` and `--no-underline` modifiers. The mixins also have text-colour and muted styles.
- **Underline:** thickness `max(1px, .0625rem)` and offset `.1578em`. On hover it grows to `max(3px, .1875rem, .12em)`, with `text-decoration-skip-ink: none`.
- **States:** link, visited (purple), hover (darker), active (text colour), focus (black text on yellow, with a thick bottom bar).
  - Muted: secondary text, then text colour on hover.
  - Inverse and text colour: no visited state.
- **No underline:** only where the context shows it's a link, such as a header or side nav. The underline comes back on hover.
- **New tab:** avoid it. If you must, put "(opens in new tab)" in the link text, with `rel="noreferrer noopener"`. A visually hidden span is OK when there are many links.
- **Print:** `govuk-link-print-friendly` puts the URL after links starting `/` or `http`.
- **Disabled:** never disable links. Remove the link or explain why it's unavailable.
- Sources: https://design-system.service.gov.uk/styles/links/, https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/helpers/_links.scss, https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/settings/_links.scss

### IBM Carbon

- **Inline links** sit inside text, are always underlined and have no icon. **Standalone links** have no underline until hover, focus or press, and can have an icon.
- **Sizes:** sm 16px, md 18px, lg 22px. Inline links match the text around them.
- **Icons:** `renderIcon` puts the icon after the text, in the link colour. Use Launch for external links and ArrowRight for internal ones. The icon is part of the click target.
- **Visited:** the `visited` prop is off by default. Use it sparingly.
- **Disabled:** there is a `disabled` prop. Links navigate and buttons act.
- Sources: https://carbondesignsystem.com/components/link/usage/, https://react.carbondesignsystem.com/?path=/docs/components-link--overview

### Adobe Spectrum (Spectrum 2, React Spectrum, React Aria)

- **S2 `Link`:** `variant` is `primary` (accent) or `secondary` (neutral). `staticColor` is `white`, `black` or `auto` for coloured backgrounds. `isStandalone` uses UI type at medium weight.
- **Quiet:** `isQuiet` drops the underline (it comes back on hover or focus-visible). It only works with `isStandalone`, so inline links are always underlined.
- **React Aria:** with no `href` it renders `<span role="link">`. `isDisabled` sets `data-disabled`.
  - It also has `download`, `aria-current`, `render` for router links, and `routerOptions`.
  - State attributes: `data-hovered`, `data-pressed`, `data-focus-visible`.
- Sources: https://github.com/adobe/react-spectrum/blob/main/packages/@react-spectrum/s2/src/Link.tsx, https://react-aria.adobe.com/Link

### GitHub Primer

- `Link` has `muted` (less prominent, link colour on hover) and `inline` (underlined, for links next to text). `as` changes the element. `hoverColor` is deprecated.
- **Accessibility:** body-text links keep the underline. Nav lists can drop it. If a link has no underline, it needs 3:1 contrast with the text around it.
- **Links vs buttons:** links go somewhere, buttons do something. Links shouldn't look like buttons except for rare CTAs.
- Sources: https://primer.style/product/components/link/, https://primer.style/product/components/link/accessibility/

### Platform notes (WCAG and CSS)

- **WCAG 1.4.1:** a link in text must be shown by more than colour. Either it has an underline, or its colour has 3:1 contrast with the text around it, plus a non-colour cue on hover and focus (technique G183).
  - Our blue options against body text (`--sp-fg-default`, #0b1a33): info-700 is 2.72:1 and brand-600 is 2.57:1. Both fail, so **inline links must keep the underline**.
- **`:visited` privacy:** browsers only let `:visited` change colours: `color`, `background-color`, `border-color`, `outline-color`, `text-decoration-color`, `fill` and `stroke`.
  - The alpha channel comes from the unvisited colour.
  - `getComputedStyle` reports the unvisited style.
  - Chrome also partitions visited history by site.
  - So visited can only be a solid colour swap. It can't change the underline thickness, an icon, opacity or a transition, and tests can't read it.
- **Wrapped inline links:** a `box-shadow` focus ring on an inline element is drawn once across all the line fragments. `box-decoration-break: clone` (Tailwind `box-decoration-clone`) draws the ring around each line.
- **WCAG 2.5.8:** target size exempts inline links in text, but standalone links need a 24px target.

## Our base: what Base UI, Tailwind and the repo already give us

- **Base UI:** no Link primitive. `useRender` gives us `render` (element or function) and merges props and refs, as SkipLink and ErrorSummary already do.
  - `NavigationMenu.Link`, `Menu.LinkItem` and `Toolbar.Link` are Base UI parts that must stay the element. They can take our Link through their own `render`.
- **Tailwind v4:**
  - Utilities: `underline`, `decoration-[…]`, `underline-offset-[…]`, `decoration-skip-ink-none` and `box-decoration-clone`.
  - Variants: `visited:`, `aria-[current=page]:`, `forced-colors:`, `rtl:` and `print:`.
- **Tokens:** `sp-focus-ring` (two-tone box-shadow), the `--sp-duration-*` tokens (0ms under reduced motion), `--sp-control-gap` and `--sp-fg-default` / `--sp-fg-muted`.
  - In forced colours, `--sp-brand` and `--sp-danger` map to `LinkText` already.
- **Missing tokens:** there are no link tokens. `--sp-accent` is neutral-900, the same as body text, so it can't be the link colour. `--sp-brand` is reserved for CTAs. `--sp-info` is blue but means "info status".
- **New-tab code already exists:** `Menu.LinkItem` (packages/ui/src/components/Menu/Menu.tsx) shows `ArrowSquareOut`, adds the hidden text "Opens in a new tab" and sets `rel="noopener noreferrer"`. Link should share one helper with it.
- **Hidden text:** VisuallyHidden (GEO-968) will provide it. Until it lands, use `sr-only`.

## Proposed scope

- **`Link`:** one part that renders an `<a>` through `useRender`, with `data-slot="link"`.
- **`variant`:** `default` (link colour), `muted`, `inherit` (text colour) or `inverse` (on dark backgrounds).
- **`standalone`:** medium weight, `inline-flex` with an icon slot, a 24px minimum target and a `size` prop (sm / md / lg on the shared scale, GEO-954).
  - Inline links inherit the size and weight of the text around them.
- **`underline`:** `always` (default) or `hover`. Inline links are always underlined; `hover` only takes effect on standalone links (Spectrum's rule).
  - This keeps WCAG 1.4.1 safe without needing a check.
- **`visited`:** on by default for `default` links (GOV.UK). `visited={false}` is the "no visited state" option. `muted`, `inherit` and `inverse` never show visited.
- **States:**
  - Underline: `max(1px,.0625rem)` thick at a `.1578em` offset. On hover it grows to `max(3px,.1875rem,.12em)`, with skip-ink off.
  - Colours: hover uses the link-hover colour, and active uses `fg-default`.
  - Focus: `focus-visible:sp-focus-ring` with `box-decoration-clone` and `rounded-sm`.
  - Colour transition at `--sp-duration-fast`.
- **New tab:** `target="_blank"` adds a trailing `ArrowSquareOut` icon and the hidden text "(opens in new tab)", and merges `noopener noreferrer` into `rel`.
  - The icon is mirrored in RTL and kept on the same line as the last word.
  - `externalIcon={false}` hides the icon but keeps the hidden text.
  - The text is translatable through `labels.newTab`.
- **`icon` / `iconPosition`** on standalone links, as on Button. The default is `end`.
  - Directional icons (ArrowRight, ArrowSquareOut) get `rtl:-scale-x-100`.
- **Download:** `download` is passed through. When it's set, a download icon and the hidden text "(download)" are added. File type and size stay in the visible text.
- **Current page:** `aria-current` is passed through and styled with `aria-[current=page]:` (semibold, `fg-default`, still a link). This works with React Router `NavLink`, which sets the attribute itself.
- **Forced colours:**
  - `LinkText`, and `VisitedText` when visited is on.
  - All variants map to `LinkText`, and the underline stays.
  - Focus uses a `Highlight` outline. This is the local workaround for GEO-950, the same one SkipLink and NavigationMenu use.
- **Print:** absolute and root-relative links append ` (url)` (GOV.UK print-friendly). Opt out with `printUrl={false}`.
- **Shared module** (`lib/link.ts`):
  - `linkClasses()` for the variant, underline and standalone classes.
  - `useLinkBehaviour()` for new tab, download, `rel` and labels.
  - Button `href`, Button `variant="link"`, Card.Link, Menu.LinkItem, Toolbar.Link and NavigationMenu all reuse it.
- **Disabled:** there's no `disabled` prop. The docs say to show plain text or explain why the link is unavailable (GOV.UK). In development, a warning fires if `disabled` or `aria-disabled` is passed.
- **New tokens** (packages/tokens):

  | Token               | Light                                               | Dark              | High contrast    |
  | ------------------- | --------------------------------------------------- | ----------------- | ---------------- |
  | `--sp-link`         | info-700 #0b57d0 (6.39:1 on base, 5.79:1 on sunken) | info-300 (10.9:1) | #00449e (9.05:1) |
  | `--sp-link-hover`   | #083f99 (9.63:1)                                    | #d0e0ff (14.09:1) | –                |
  | `--sp-link-visited` | #6b2fb3 (7.83:1)                                    | #c8a8ff (9.37:1)  | –                |
  - All are solid colours, with no alpha, because of the `:visited` rules.

## Decisions

1. **Link colour token.** (a) New `--sp-link`, `--sp-link-hover` and `--sp-link-visited` tokens on the info-blue hue [GOV.UK, Carbon, Primer, Spectrum, MUI all use a blue link colour]. (b) Use `--sp-brand` [shadcn `text-primary`], which breaks the "brand for CTAs only" rule. (c) Use `--sp-accent` (neutral) and rely on the underline alone [Chakra gray default].
2. **Variants.** (a) `default | muted | inherit | inverse` [GOV.UK, Primer muted, MUI/Mantine inherit, Spectrum secondary]. (b) Add `danger` too [Ant `type`], which ErrorSummary could use. (c) Only `default | inherit`.
3. **Underline rule.** (a) `underline="always" | "hover"`, where `hover` only applies to standalone links [Spectrum quiet, Carbon]. (b) A free `underline` with `always | hover | none` anywhere [MUI, Mantine]. (c) A separate `noUnderline` boolean [GOV.UK].
4. **Hover style.** (a) The underline thickens on hover and the colour darkens [GOV.UK]. (b) Colour change only [MUI, Primer]. (c) Underline appears on hover only [shadcn].
5. **Visited.** (a) On by default for `default` links, off with `visited={false}` [GOV.UK]. (b) Off by default, on with `visited` [Carbon]. (c) Never styled [MUI, Spectrum, Primer].
6. **Focus.** (a) `sp-focus-ring` with `box-decoration-clone`, plus a forced-colours outline (GEO-950) [ticket]. (b) GOV.UK's yellow highlight and black bar as a link-only focus style [GOV.UK].
7. **Inline vs standalone.** (a) A `standalone` boolean: medium weight, icon slot, `size`, 24px target [Carbon, Spectrum `isStandalone`]. (b) `inline` boolean, default false [Primer].
8. **Size.** (a) Inline links inherit size; standalone links take `size` sm / md / lg on the shared scale (GEO-954) [Carbon]. (b) A type-style `variant` prop [MUI, Mantine].
9. **New tab.** (a) `target="_blank"` adds an icon, the hidden text "(opens in new tab)" and `rel`, with `externalIcon={false}` to hide the icon and `labels.newTab` to translate [GOV.UK, Carbon icon, Ant rel, Menu.LinkItem]. (b) An explicit `external` prop that does nothing on its own [Chakra example].
10. **External icon placement.** (a) At the end, `1em`, mirrored in RTL, kept on the same line as the last word [Carbon]. (b) No mirroring, because the arrow points "out" not "forward".
11. **Download.** (a) Pass `download` through, add a download icon and the hidden text "(download)" [React Aria, GOV.UK attachment]. (b) Pass it through only.
12. **Current page.** (a) Pass `aria-current` through, and style `page` as semibold `fg-default` [Chakra `_currentPage`, React Aria]. (b) An `active` prop like NavigationMenu.Link.
13. **Disabled.** (a) No prop. Docs and a dev warning say to use text instead [GOV.UK]. (b) `disabled` sets `aria-disabled`, removes `href` and greys it out [Carbon, Ant, React Aria].
14. **Router links.** (a) `render` through `useRender`, element or function, with the docs showing Next.js `Link` and React Router `NavLink` [shadcn, React Aria]. (b) An `as` / `component` prop [MUI, Mantine, Primer].
15. **Link-styled buttons.** (a) `Button variant="link"` uses `linkClasses()`; Link never renders a `<button>` [shadcn, MUI `component="button"`]. (b) No link-styled buttons at all [Primer advice].
16. **Print URLs.** (a) Show ` (url)` after links when printing, with `printUrl={false}` to opt out [GOV.UK]. (b) Leave it out.
17. **Shared module.** (a) `lib/link.ts` exports `linkClasses()` and `useLinkBehaviour()` for Button `href`, Card.Link, Menu.LinkItem, Toolbar.Link and NavigationMenu. (b) Each component composes `<Link>` through `render` only.
18. **Stretched link.** (a) Card.Link composes Link with an `after:absolute after:inset-0` overlay, and the focus ring moves to the card through `has-[:focus-visible]` [Chakra `LinkOverlay`]. (b) Ship a `Link.Overlay` part in Link.

## Exceptions (recommended not to build)

- **Spectrum `staticColor="black"` / `"auto"`:** `inverse` covers dark backgrounds. For a light area inside a dark page, set `data-theme` on that subtree.
- **Free colour props** (Chakra `colorPalette`, Mantine `c` and gradient, MUI `color`, Ant `type`): George's rule says no free colours. `inherit` covers the "use this colour" case.
- **Ant `ellipsis`, `copyable`, `strong`:** these are text utilities. Use `truncate` or a wrapper instead.
- **`disabled` prop** (Carbon, Ant, React Aria): GOV.UK says links shouldn't be disabled. The docs explain the alternative. Needs George's approval (Decision 13).
- **Mantine `not-hover` underline:** it reverses the usual hover cue and has no accessibility benefit.
- **React Aria `<span role="link">` without `href`:** a link with nowhere to go should be a Button.
- **React Aria `routerOptions` / RouterProvider:** `render` already hands routing to the router's own link.

## Stories and tests planned

- **Default:** an inline link in a paragraph.
- **States:** default, hover, focus-visible, active, visited, current page, new tab and download, for each of the four variants, inline and standalone.
- **Variants:** all four variants, with `visited` on and off.
- **Standalone:** sm / md / lg, start and end icons, and `underline="hover"`.
- **External and Download:** the icon, the hidden text and RTL mirroring.
- **Router:** `render` with a mock Next.js `Link` and a mock `NavLink` setting `aria-current`.
- **On dark:** `inverse` on a dark surface inside the light theme.
- **Density:** inline and standalone links under compact, default and comfortable.
- **Themes:** every variant and state in light, dark and high contrast, and in forced colours (emulated).
- **RTL:** icon placement and mirroring.
- **Tests:**
  - `rel` is merged, not replaced.
  - The hidden text is in the accessible name when `target="_blank"`.
  - `externalIcon={false}` keeps the text.
  - `underline="hover"` is ignored on inline links.
  - `render` keeps the ref, `href` and `onClick` (the consumer's `onClick` runs, and `defaultPrevented` is respected).
  - `aria-current` is passed through.
  - The dev warning fires on `disabled`.
  - The print class is only on absolute and root-relative hrefs.
- **Playwright computed styles:** decoration thickness at rest and on hover, the underline offset, the focus box-shadow, and `LinkText` under forced colours. `:visited` can't be read in tests, so check it visually with a screenshot of a visited URL.

## Refactor audit

Only two non-story files render a raw anchor: `ErrorSummary.tsx` and `SkipLink.tsx` (both `useRender({ defaultTagName: "a" })`). No component has a literal `<a>` in JSX. Raw `<a>` shows up only in stories and tests: Autocomplete, ErrorSummary and SkipLink.

### ErrorSummary.Item (packages/ui/src/components/ErrorSummary/ErrorSummary.tsx)

- **How it links today:** `useRender` "a" with its own `linkClasses`: `text-danger`, `underline-offset-2`, `hover:decoration-2`, `focus-visible:sp-focus-ring` and `rounded-sm`.
  - `href` is resolved after mount, falling back to `#`.
  - `onClick` always calls `preventDefault()` and then `focusError()`. That scrolls the label or legend into view and focuses the field with `preventScroll`.
- **What it needs from Link:**
  - `variant="inherit"` inside a `text-danger` list item, so no danger variant is needed (Decision 2a).
  - `render` passed straight through.
  - `onClick` that merges with no default behaviour of its own, so the `preventDefault` and focus-the-field logic stays in ErrorSummary.
  - Hash links must never get the print URL (`printUrl` is off for `#` hrefs) or the new-tab behaviour.
- **Gaps Link fixes:**
  - Its focus ring is invisible in forced colours (no GEO-950 workaround).
  - The underline doesn't match GOV.UK's thickness and offset.
  - There's no ref to the anchor.
  - A consumer can't pass an `onClick` or link props except through `render`.

### SkipLink (packages/ui/src/components/SkipLink/SkipLink.tsx)

- **How it links today:** `useRender` "a" with its own hidden and visible positioning: fixed, translate, opacity, pointer-events, safe-area insets and a slide on `--sp-duration-normal`.
  - It looks like a chip: border, `surface-base`, `fg-default`, semibold, underline on hover.
  - The focus ring uses `focus:`, not `focus-visible:`.
  - It has its own GEO-950 forced-colours outline, and `print:hidden`.
- **What it needs from Link:**
  - `variant="inherit"`, `standalone` and `underline="hover"`.
  - No visited state.
  - The positioning and chip classes stay in SkipLink, passed in `className`.
  - Link must accept a `focus:` ring override alongside its `focus-visible:` one.
  - Link must forward `ref`, and call the consumer's `onClick` unchanged so SkipLink's handler still reads `event.currentTarget.href` and checks `defaultPrevented`.
- **Gains:** it drops the duplicated forced-colours workaround.

### NavigationMenu (branch geo-924-enhance-navigationmenu: NavigationMenu.tsx, plus stories, tests, LOG and RESEARCH)

- **How it links today:** `NavigationMenu.Link` wraps Base UI `NavigationMenu.Link` on desktop. The drawer and the "More" list use a private `StackedLink` (`useRender` "a"), which closes the drawer on click.
  - Items are styled as nav rows: `no-underline`, fill highlight, `text-fg-muted` → `fg-default`, and semibold with a selected fill for `aria-current`.
  - `active` sets `aria-current` to `page` or `true`, and wraps the title in `<strong>`.
  - It has its own `focusRing` constant with the GEO-950 workaround.
  - `StackedLink` ignores function `render`s.
- **What it needs from Link:**
  - `Link` rendered inside Base UI's `render`, so Base UI keeps roving focus, `closeOnClick` and `active`. Link must pass through Base UI's data attributes, handlers and `aria-current`.
  - Link's own `render` must accept the user's router link, giving the chain Base UI → Link → router link.
  - `variant="inherit"` and `standalone`, with underline off. That needs `underline="none"` for standalone links, or NavigationMenu keeps `no-underline` in `className`.
  - The new-tab helper, which it doesn't have today.
  - The shared focus-ring constant, and support for function `render`.
- **Note:** this worktree still has the old, unenhanced NavigationMenu.Link, with raw `neutral-*` classes. The branch version supersedes it.

### Other link-like parts

- **Menu.LinkItem** (packages/ui/src/components/Menu/Menu.tsx): it already has new-tab code (icon, hidden "Opens in a new tab", `rel`).
  - It should use `useLinkBehaviour()` so the wording matches. Today it says "Opens in a new tab"; the ticket says "(opens in new tab)".
- **Toolbar.Link** (packages/ui/src/components/Toolbar/Toolbar.tsx): unenhanced. It has raw `neutral-*` colours and a raw outline focus.
  - It should use the shared focus ring and new-tab helper when Toolbar is enhanced.
- **Button `href`:** it should render `<a>` through `useRender` with Button's classes and `useLinkBehaviour()`, not Base UI Button with `render={<a/>}` (shadcn advice).
  - `variant="link"` uses `linkClasses()`.
  - `disabled` and `loading` with `href` need the same "links can't be disabled" rule.
- **Card.Link:** it should compose `Link` (`variant="inherit"`, `underline="hover"`) with an `after:` overlay. Card.Root shows the focus ring with `has-[:focus-visible]`.

## George's decisions (2026-11-21)

- **Option (a) on all 18 decisions.**
- **New link tokens approved:** `--sp-link`, `--sp-link-hover` and `--sp-link-visited` on the info-blue hue. This is a shared token change that George explicitly approved. Check the dark and high-contrast values at build time.
- **Wording:** "(opens in new tab)" everywhere. Menu.LinkItem's "Opens in a new tab" changes to match when it moves onto the shared helper.
- **Underline:** `underline="none"` is allowed on standalone links only, which covers NavigationMenu. Inline links always keep an underline (WCAG 1.4.1), because the link blue doesn't reach 3:1 against body text.

### Considered and rejected (approved by George, 2026-11-21)

- **`staticColor`** [Spectrum]: `inverse` and a `data-theme` subtree cover it.
- **Free colour props** [Chakra, Mantine, MUI, Ant]: against the no-free-colour rule; `inherit` covers the need.
- **`ellipsis`, `copyable`, `strong`** [Ant]: text utilities, not link features.
- **`disabled` prop**: links shouldn't be disabled (GOV.UK). Docs guidance and a dev warning instead.
- **`not-hover` underline** [Mantine]: reverses the usual hover cue.
- **`span role="link"` with no href** [React Aria]: a link with nowhere to go should be a Button.
- **RouterProvider / `routerOptions`** [React Aria]: `render` covers routing.
