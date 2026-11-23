# Skeleton — Research (GEO-963)

Skeleton is a placeholder that keeps the shape of content while it loads. It ships shapes (text lines, circle, rectangle), presets sized from our tokens, and a wrapper that hides real children until they arrive. It is silent to screen readers: the surrounding region carries `aria-busy` and one announcement goes through the shared announce utility.

Researched on 2026-11-21 across all 9 libraries.

## Who has what

| Feature                                | shadcn         | Mantine             | Chakra                       | MUI                 | Ant                                | GOV.UK                  | Carbon                   | Spectrum               | Primer                     |
| -------------------------------------- | -------------- | ------------------- | ---------------------------- | ------------------- | ---------------------------------- | ----------------------- | ------------------------ | ---------------------- | -------------------------- |
| Basic box                              | ✅ div         | ✅                  | ✅                           | ✅ span             | ✅ Node                            | –                       | ✅ Placeholder           | –                      | ✅ SkeletonBox             |
| Shapes: text / circle / rect / rounded | className only | `circle`, `radius`  | Circle, Text                 | ✅ all 4            | Avatar `shape`, `round`            | –                       | Text, Icon, Placeholder  | text line boxes        | Text, Avatar `square`, Box |
| Pulse                                  | ✅             | ✅ 1.5s opacity     | ✅ default                   | ✅ default          | –                                  | –                       | –                        | –                      | –                          |
| Wave / shimmer                         | –              | –                   | `shine`                      | `wave`              | `active`                           | –                       | ✅ default               | ✅ default             | ✅ default                 |
| No animation                           | –              | `animate={false}`   | `none`                       | `false`             | default                            | –                       | –                        | –                      | –                          |
| Loading wrapper with children          | –              | `visible` (overlay) | `loading`                    | children infer size | `loading` + children               | –                       | –                        | `isLoading`            | –                          |
| Auto-size to children                  | –              | –                   | ✅                           | ✅ `fitContent`     | –                                  | –                       | –                        | ✅                     | –                          |
| Multi-line text                        | –              | –                   | `noOfLines`                  | –                   | `paragraph.rows`                   | –                       | `paragraph`, `lineCount` | real text              | `lines`                    |
| Last line shorter                      | –              | –                   | 80%                          | –                   | 61% / `width` array                | –                       | random widths            | real text              | 65%                        |
| Text sized to type scale               | –              | –                   | –                            | em-based            | –                                  | –                       | `heading`                | inherits               | `size`                     |
| Presets                                | –              | –                   | Circle, Text                 | –                   | Avatar, Button, Input, Image, Node | –                       | 40+ per-component        | –                      | Avatar, Text, Box          |
| Fade-in on load                        | –              | –                   | ✅ 0.1s                      | –                   | –                                  | –                       | –                        | –                      | –                          |
| Delay before showing                   | –              | –                   | –                            | –                   | –                                  | –                       | –                        | –                      | ✅ `short`/`long`/ms       |
| Reduced motion                         | –              | –                   | –                            | animation off       | –                                  | "show text" (community) | animation off            | animation off          | shimmer off                |
| Forced colours                         | –              | –                   | –                            | –                   | –                                  | –                       | CanvasText fill          | –                      | transparent outline        |
| Hidden from SR                         | –              | –                   | children `visibility:hidden` | children hidden     | – (`ul/li` exposed)                | –                       | – (`<p>` exposed)        | `inert`                | –                          |
| Region `aria-busy` / one announcement  | –              | –                   | –                            | –                   | –                                  | `aria-live` status      | guidance                 | –                      | guidance                   |
| Synced animation across items          | –              | –                   | –                            | –                   | –                                  | –                       | –                        | ✅ WAAPI `startTime=0` | –                          |
| Disables controls inside               | –              | –                   | –                            | –                   | –                                  | –                       | –                        | ✅                     | –                          |

### shadcn/ui

- One `div` with `data-slot="skeleton"`, `animate-pulse rounded-md bg-accent`. Size is set by className. https://ui.shadcn.com/docs/components/skeleton
- No a11y attributes, no reduced-motion handling (Tailwind's `animate-pulse` ignores the media query). Source: https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/skeleton.tsx

### Mantine

- `height`, `width`, `circle` (width and radius from height), `radius`, `animate` (default true). https://mantine.dev/core/skeleton/
- `visible` covers wrapped children with `::before`/`::after` overlays. Children stay in the a11y tree and are read out.
- Pulse is a 1.5s opacity fade (0.4 to 1). No reduced-motion or forced-colours rules. Source: `Skeleton.module.css` in mantinedev/mantine.

### Chakra UI v3

- `Skeleton`, `SkeletonCircle` (`size`), `SkeletonText` (`noOfLines`, default 3, last line 80%). https://chakra-ui.com/docs/components/skeleton
- `loading` (default true). While loading, children get `visibility: hidden` (out of the a11y tree) and text goes transparent. When `loading` turns false, a 0.1s `fade-in` runs.
- `variant`: `pulse` (default), `shine` (gradient sweep, 5s), `none`. Colours via `--start-color`/`--end-color`.
- No reduced-motion rule in the recipe. Source: `theme/recipes/skeleton.ts`.

### MUI

- `variant`: `text` (default), `circular`, `rectangular`, `rounded`. `animation`: `pulse` (default), `wave`, `false`. https://mui.com/material-ui/react-skeleton/
- `text` takes height from the font size (1.2em scaled to 60%), so it matches typography.
- Children infer width and height (`withChildren`, `fitContent`, `heightAuto`), and children get `visibility: hidden`.
- Reduced motion sets `animation: none` via `getReducedMotionStyles`. Fill is text colour at 11% (light) / 13% (dark). Docs: "ARIA: none", not focusable.

### Ant Design

- `Skeleton` composite: `avatar`, `title`, `paragraph` (`rows`, `width` number or array per row), `round`, `active` (shimmer), `loading` (shows children when false). https://ant.design/components/skeleton
- Presets: `Skeleton.Avatar` (`shape`, `size`), `Skeleton.Button` (`shape`, `size`, `block`), `Skeleton.Input` (`size`), `Skeleton.Image`, `Skeleton.Node` (custom content).
- Last paragraph row is 61%. Paragraph renders `<ul><li>`, so screen readers hear an empty list.
- Shimmer is a background-position gradient. No reduced-motion or forced-colours rules. Source: `components/skeleton/style/index.ts`.

### GOV.UK

- No Skeleton component. The "Loading spinner" backlog discussion is the only loading guidance. https://github.com/alphagov/govuk-design-system/discussions/6167
- Advice there: avoid the wait, say what is happening in words, use an `aria-live` status, and show "Loading…" text instead of animation under reduced motion.
- Skeleton screens are not mentioned. Their bar is "server-render it and avoid the wait".

### IBM Carbon

- `SkeletonText` (`paragraph`, `lineCount`, `width`, `heading`), `SkeletonPlaceholder`, `SkeletonIcon`, and 40+ per-component skeletons (ButtonSkeleton, TextInputSkeleton, DataTableSkeleton, TagSkeleton…). https://carbondesignsystem.com/patterns/loading-pattern/
- Shimmer: 3s `::before` sweep; `prefers-reduced-motion` turns it off. Forced colours: `CanvasText` fill with a `Canvas` sweep.
- SkeletonText widths are random, set in a layout effect: a post-hydration shift, and lines render as empty `<p>`.
- Guidance: skeletons for containers and data (tiles, tables, cards, text). Not for toasts, menus, dropdown items, modals. Load in batches. A screen reader should hear "loading" and failures.

### Adobe Spectrum (S2 / React Spectrum)

- `<Skeleton isLoading>` wraps real components with mock data. Text, Image, Link, Icon, StatusLight, Badge and Meter render as placeholders through context. https://react-spectrum.adobe.com/Skeleton
- Text uses inline spans with `box-decoration-break: clone` and transparent text, so each wrapped line becomes its own bar. Placeholders are `inert`. Form components inside are disabled.
- Shimmer via the Web Animations API with `startTime = 0`, so every skeleton on the page is in phase. Off under reduced motion. Source: `packages/@react-spectrum/s2/src/Skeleton.tsx`.

### GitHub Primer

- `SkeletonBox` (`width`, `height`, `delay`: `'short'` 300ms, `'long'` 1000ms, or ms), `SkeletonText` (`size` on the type scale, `lines`, `maxWidth`; last line 65%, min 50px), `SkeletonAvatar` (`size`, `square`). https://primer.style/product/components/skeleton-box/
- Shimmer only under `prefers-reduced-motion: no-preference`; static otherwise. Forced colours: `outline: 1px solid transparent` so the shape shows.
- Loading pattern: nothing under 1s, skeletons for 1–3s, one loading announcement for a collection, `aria-busy` while updating, a specific label. https://primer.style/product/ui-patterns/loading/
- `delay` returns `null` until the timer fires, so the space is not reserved (layout shift) and SSR renders nothing.

## Our base: what Base UI, Tailwind and the repo already give us

- **Base UI** has no Skeleton. `useRender` gives us the `render` prop. `Avatar.Fallback` already has a `delay` and shows while the image loads, so it can hold a skeleton.
- **Tailwind** ships `animate-pulse` (2s opacity). It has no reduced-motion rule, so we add `motion-reduce:` ourselves. A wave keyframe is not built in.
- **Tokens**: motion durations drop to 0ms under reduced motion. A looping animation must not use them, or it stops dead (0ms infinite). The fade-in can use them. Density gives `--sp-control-height(-sm/-lg)` and `--sp-control-gap`.
- **Surfaces differ per theme.** Dark `sunken` (neutral-800) is darker than `raised` (neutral-700), and high-contrast `sunken` (#f0f0f0) on white is near-invisible. A single surface token won't read well on every surface.
- **Forced colours** only remaps brand, accent, danger, focus and `border-control`. A background-only fill vanishes.
- **Keyframes must ship in the package.** Progress's keyframes live only in Storybook CSS (Progress RESEARCH). The wave keyframe must go in tokens/UI CSS.
- **Announce utility** is decided but not built yet (comes with the Spinner rebuild).
- **Combobox loading today** (`combobox-shared.tsx`): the popup gets `aria-busy`; an empty list shows a decorative Spinner plus "Loading…" inside Base UI's `Empty`, which is its own polite live region; a "Loading more…" row sits under the list; the count `Status` stays silent while loading. Select has no loading state.
- Card, Avatar and Switch research already point loading placeholders at this ticket.

## Proposed scope

- `Skeleton` (one shape): `shape`, `animation`, `width`/`height`, `render`, `data-slot="skeleton"`, always `aria-hidden`.
- `Skeleton` with children and `loading`: wraps real content, hides it (`visibility: hidden` + `inert`), sizes to it, fades it in when done.
- `Skeleton.Text`: `lines`, last line shorter, optional per-line widths, em-sized so it follows the surrounding type.
- Presets: `Skeleton.Avatar`, `Skeleton.Button`, `Skeleton.Input`, `Skeleton.Image`, sized from shared tokens and density.
- `Skeleton.Group`: the region. Sets `aria-busy`, makes one announcement, and passes `loading`, `animation` and `delay` down by context.
- `delay` with the Spinner API, done in CSS so space is reserved and SSR works.
- Theme fill that works on every surface, a border in high-contrast and forced colours, RTL-aware wave, reduced-motion slow pulse.

## Decisions

1. **Shape prop.** (a) `shape`: `text` | `circle` | `rectangle` | `rounded` (default `rounded`, nested radius). `variant` is already "visual style" in Southpaw. (b) MUI's `variant` names as-is. (c) className only, like shadcn. [MUI, Mantine, Chakra, Ant, Primer, Carbon]
2. **Animation.** (a) `animation`: `pulse` (default) | `wave` | `none`. Pulse is opacity only, cheap, and needs no RTL work. (b) `wave` default, like Carbon, Primer and Spectrum. [MUI, Chakra, Mantine, Ant, Carbon, Spectrum, Primer]
3. **Reduced motion.** (a) Both animations become a slow opacity pulse (about 3s, small range), matching the Spinner decision. No spatial movement. (b) static, like Carbon, Primer, Spectrum and MUI. [Primer guidance says keep a subtle indicator; Carbon, Primer, Spectrum, MUI code turns it off]
4. **Loop timing.** (a) Own fixed loop durations, not the `--sp-duration-*` tokens (those go to 0ms). (b) new `--sp-duration-loop` token with its own reduced-motion value. [Progress precedent]
5. **Wave direction.** (a) Wave runs with reading direction (flipped under `rtl:`), and its keyframe ships in package CSS. (b) always left to right. [Carbon uses logical `inset-inline-start`]
6. **Synced animation.** (a) CSS only; items that mount together run in phase. (b) Web Animations API with `startTime = 0`, like Spectrum, so late mounts stay in phase. [Spectrum]
7. **Loading wrapper.** (a) `<Skeleton loading={bool}>children</Skeleton>`: while loading, children render with `visibility: hidden` and `inert`, and the skeleton takes their size. When `loading` is false it renders children only, with no wrapper element. (b) Ant-style: render placeholder shapes instead of children. (c) Mantine overlay that leaves children in the a11y tree. [Chakra, MUI, Ant, Spectrum, Mantine]
8. **Auto-size.** (a) With children and no `width`/`height`, fit content (`w-fit`); inline text children use `box-decoration-break: clone` so each wrapped line becomes a bar. (b) block fit only, like MUI. [MUI, Chakra, Spectrum]
9. **Text lines.** (a) `Skeleton.Text lines={n}`: lines are `1em` tall inside the line box, so they follow the font size and line-height around them; last line 60%; optional `widths` array. Deterministic widths only (SSR safe). (b) Primer's `size` on our type scale. (c) Carbon's random widths. [Chakra, Ant, Primer, Carbon, MUI]
10. **Paragraph and heading.** (a) Covered by `Skeleton.Text` plus a text-size class (`text-xl` for a heading). No Ant `title`/`paragraph` composite. (b) Ant composite `<Skeleton avatar title paragraph />`. [Ant, Carbon `heading`]
11. **Presets.** (a) `Skeleton.Avatar` (Avatar sizes and shapes), `Skeleton.Button` and `Skeleton.Input` (control heights, follow density, `size` sm/md/lg), `Skeleton.Image` (`aspectRatio`, optional decorative icon). Ant's `Node` is covered by `Skeleton` with `render`. (b) only Text and Avatar, like Primer. (c) a `loading` prop on every component, like Carbon's per-component skeletons. [Ant, Carbon, Primer, Chakra]
12. **Fade-in.** (a) Children fade in with opacity over `--sp-duration-normal` when `loading` turns false; instant under reduced motion. (b) no fade. [Chakra]
13. **Fill colour.** (a) A new semantic token `--sp-skeleton` set per theme as `fg-default` mixed to about 10% (`color-mix`), so it reads on base, sunken, raised and alternate. Wave highlight is a lighter mix. (b) reuse `surface-sunken`. [MUI text alpha, Chakra `bg.emphasized`, Ant `colorFillContent`]
14. **High contrast and forced colours.** (a) Every shape has `border border-transparent`. Forced colours turns it into a system-colour outline (Primer's trick). The high-contrast theme sets the border to `border-control`. (b) Carbon's solid `CanvasText` fill. [Primer, Carbon]
15. **Screen readers.** (a) Every shape is `aria-hidden` and never focusable. Wrapped children are `inert` and `visibility: hidden`. No `ul`/`li` or `<p>` for lines. [Spectrum, Chakra, MUI]
16. **Region and announcement.** (a) `Skeleton.Group` with `loading` and `label`: sets `aria-busy` on itself, calls the shared announce utility once ("Loading orders") after the delay, and optionally "Orders loaded" when done. Child skeletons read `loading`/`animation`/`delay` from it. (b) no component; document `aria-busy` + announce for consumers. [Primer, Carbon, GOV.UK]
17. **Delay.** (a) `delay` with the Spinner API (`true` 1000ms, `"short"` 300ms, number), done with a CSS `animation-delay` from hidden to visible. Space stays reserved, no layout shift, works without JS. (b) Primer's JS timer that renders nothing until then. [Primer]
18. **Minimum display time.** (a) Not built in; the Group's announcement is skipped if loading ends before the delay. (b) a `minDuration` to stop a quick flash. [GOV.UK discussion only, no library]
19. **SSR.** (a) Pure CSS shapes, no measuring, no random widths, no effects except the Group announcement. Server output matches the client. [Mantine, Chakra, Primer vs Carbon]
20. **Density.** (a) Text follows font size; presets use `--sp-control-height*`; Group and Text gaps use `--sp-control-gap`. [Spectrum density, Ant `size`]

## Exceptions (recommended not to build)

- **Carbon's 40+ per-component skeletons** (DataTable, DatePicker, Tag…): the presets plus composition in stories cover them without one export per component.
- **Spectrum's context mode** (every component renders itself as a skeleton inside `isLoading`): every component would need to opt in; the children wrapper (7, 8) gets the same result.
- **Spectrum disabling form controls inside**: `inert` already blocks them.
- **Mantine's overlay mode**: it leaves stale or mock children readable by screen readers.
- **Ant's `title`/`paragraph`/`avatar` composite**: `Skeleton.Text` plus `Skeleton.Avatar` compose it in two lines.
- **Free colour props** (Chakra `--start-color`/`--end-color`, Ant gradient tokens): breaks the "no free colour" rule; the theme token covers it.
- **Carbon AI skeletons**: tied to Carbon's AI label, which we don't have.
- **Random line widths** [Carbon]: breaks SSR and causes a shift after hydration.

## Stories and tests planned

**Stories** (all wrapped in `sm:max-w-md`):

- Default: one rounded block.
- Shapes: text, circle, rectangle, rounded.
- Animation: pulse, wave, none side by side.
- Text: 1, 3 and 5 lines; heading size; custom `widths`.
- Presets: Avatar (each size and shape), Button and Input (sm/md/lg), Image (aspect ratios).
- Wrapper: toggle `loading` on real content (Avatar, heading, paragraph, Button) to show auto-size and fade-in.
- Group: region with label, delay and a Loaded/Loading toggle; shows the single announcement.
- Delay: `"short"`, `true` and a number, with a timer readout.
- Card loading: Card built from Skeleton (Card stories reuse it).
- Combobox/Select loading rows (if decided in Dependencies).
- States: loading, loaded, delayed (hidden), each animation, reduced motion (forced via class).
- Density: compact, default and comfortable, with presets and text.
- Themes: light, dark and high-contrast; every shape, every animation, every preset, on base, sunken, raised and alternate surfaces.
- RTL: wave direction and last-line alignment.

**Tests**:

- Every shape has `aria-hidden="true"`, `data-slot`, and no tab stop.
- Wrapper: children are `inert` and hidden while loading; no wrapper element after; ref and `render` pass through.
- `Skeleton.Text`: line count, last line width, `widths` array; no list or paragraph roles.
- Group: `aria-busy` toggles; announce is called once per loading cycle, not per item; skipped if done before the delay.
- `delay` values map to 300ms / 1000ms / number.
- `shape`, `animation` and `size` set the right data attributes.
- SSR: `renderToString` matches the client render.
- E2E: axe (violations and inconclusives), duplicate IDs, computed animation name and duration under `reducedMotion: 'reduce'`, forced-colours emulation shows a border, fill contrast against each surface, RTL wave direction.

## George's decisions (2026-11-21)

- **(a) on every decision**, as recommended.
- **Token approved:** `--sp-skeleton`. This is a shared token change.
- **Combobox:** skeleton rows are optional and always silent, so Combobox's existing "Loading…" announcement isn't doubled.
- **Skeleton.Avatar:** standalone, for lists that are still loading. It does not sit inside Avatar.Fallback.

### Considered and rejected (approved by George, 2026-11-21)

- **Carbon's 40+ per-component skeletons**: the presets plus story examples cover them.
- **Spectrum's context mode**: every component would have to opt in, and the wrapper does the same job.
- **Disabling the form controls inside** [Spectrum]: `inert` already blocks them.
- **Mantine's overlay**: screen readers still read the children underneath.
- **Ant's avatar/title/paragraph composite**: two lines of composition do the same.
- **Free colour props** [Chakra, Ant]: no-free-colour rule.
- **Carbon AI skeletons**: no AI label component.
- **Random line widths** [Carbon]: they break SSR and shift the layout after load.
