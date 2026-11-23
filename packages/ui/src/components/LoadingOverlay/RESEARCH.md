# LoadingOverlay — Research (GEO-965)

LoadingOverlay covers a busy region, such as a card, table or form section, with a backdrop and a Spinner. While it shows, the region is `aria-busy` and `inert`, so nobody can click, type or tab into stale content. It is built on Spinner's new `srLabel`, `delay` and the shared announce utility.

Researched on 2026-11-21 across all 9 libraries.

## Who has what

| Feature                        | shadcn                   | Mantine                                 | Chakra                           | MUI                                  | Ant                              | GOV.UK | Carbon                          | Spectrum             | Primer                            |
| ------------------------------ | ------------------------ | --------------------------------------- | -------------------------------- | ------------------------------------ | -------------------------------- | ------ | ------------------------------- | -------------------- | --------------------------------- |
| Component                      | – (Spinner + Empty demo) | ✅ LoadingOverlay                       | recipe (Box + Spinner)           | Backdrop; X DataGrid `loading`       | ✅ Spin with children            | –      | Loading `withOverlay`           | –                    | –                                 |
| API shape                      | –                        | overlay inside a `pos: relative` parent | overlay inside a relative parent | Backdrop is fixed; DataGrid built in | wraps children                   | –      | full-viewport only              | –                    | –                                 |
| Region (not viewport)          | –                        | ✅                                      | ✅                               | DataGrid only                        | ✅                               | –      | –                               | –                    | –                                 |
| Full screen                    | –                        | via fixed parent                        | –                                | ✅ Backdrop                          | ✅ `fullscreen`                  | –      | ✅ (default)                    | –                    | interstitial guidance             |
| Blocks pointer                 | –                        | ✅                                      | – (`userSelect: none` only)      | ✅                                   | ✅                               | –      | ✅                              | –                    | –                                 |
| Blocks keyboard (inert / trap) | –                        | – (docs warn)                           | –                                | –                                    | –                                | –      | ✅ focus trap                   | –                    | –                                 |
| `aria-busy`                    | –                        | –                                       | ✅                               | –                                    | ✅                               | –      | –                               | –                    | ✅ guidance                       |
| Live announcement              | –                        | –                                       | –                                | –                                    | `aria-live="polite"` on root     | –      | `aria-live="assertive"`         | pending is announced | ✅ guidance (start/finish)        |
| Backdrop opacity / colour      | –                        | ✅ 0.75, light/dark colours             | `bg/80`                          | ✅                                   | content 0.5 + mask 0.4           | –      | `$overlay` token                | –                    | –                                 |
| Backdrop blur                  | –                        | ✅ `blur`                               | –                                | –                                    | –                                | –      | –                               | –                    | –                                 |
| Description / tip              | Empty title              | loader `children`                       | –                                | –                                    | ✅ `description` (was `tip`)     | –      | ✅ `description`                | –                    | loading text                      |
| Custom loader                  | ✅ any icon              | ✅ `loaderProps.children`               | –                                | –                                    | ✅ `indicator`                   | –      | –                               | –                    | –                                 |
| Delay                          | –                        | –                                       | –                                | 1s guidance                          | ✅ `delay`                       | –      | 3s guidance                     | opacity-delay note   | ✅ (1s guidance, Spinner `delay`) |
| Minimum display time           | –                        | –                                       | –                                | –                                    | –                                | –      | 1.5s "finished" (InlineLoading) | –                    | –                                 |
| Transition                     | –                        | ✅ fade (`duration: 0` default)         | –                                | ✅ Fade                              | ✅ opacity                       | –      | ✅ bg transition                | –                    | –                                 |
| z-index                        | –                        | ✅ `zIndex` 400                         | –                                | `drawer + 1`                         | 1 (section), popup base (full)   | –      | `z('overlay')`                  | –                    | –                                 |
| Determinate / progress         | –                        | –                                       | –                                | DataGrid linear variant              | ✅ `percent` (number / `'auto'`) | –      | –                               | –                    | determinate >3s guidance          |
| Cancel button                  | ✅ Empty demo            | –                                       | –                                | –                                    | –                                | –      | disable related actions         | –                    | –                                 |
| Skeleton alternative           | –                        | –                                       | –                                | DataGrid `skeleton` variant          | –                                | –      | ✅ preferred for page loads     | –                    | ✅ for large areas                |

### shadcn/ui

- No overlay. Spinner is an SVG with `role="status"` and `aria-label="Loading"`. https://ui.shadcn.com/docs/components/spinner
- The "Empty" demo pairs a Spinner, "Processing your request" and a **Cancel** button. This is the only cancel example across the 9.

### Mantine

- `LoadingOverlay` with `visible`, `zIndex` (default 400), `overlayProps` (default `backgroundOpacity: 0.75`, plus `blur`, `color`, `radius`), `loaderProps` (its `children` replace the Loader) and `transitionProps` (fade, default duration 0). https://mantine.dev/core/loading-overlay/
- The parent must be `pos="relative"`. It renders two overlays, one light and one dark, hidden by colour scheme. Source: https://github.com/mantinedev/mantine/blob/master/packages/@mantine/core/src/components/LoadingOverlay/LoadingOverlay.tsx
- No ARIA attributes. The docs warn that covered elements "are still focusable with the keyboard". It unmounts when hidden.

### Chakra UI v3

- No component. The Spinner "with overlay" recipe: a `Box position="relative" aria-busy="true" userSelect="none"` holding the content, plus `Box pos="absolute" inset="0" bg="bg/80"` with a centred Spinner. https://chakra-ui.com/docs/components/spinner
- Covered content is still focusable.

### MUI

- `Backdrop`: `open`, Fade transition (swappable via `slots.transition`), and a loader example with `CircularProgress`. The docs set `zIndex: theme.zIndex.drawer + 1`. It is viewport-fixed, not region-scoped. https://mui.com/material-ui/react-backdrop/
- MUI X DataGrid has a `loading` prop. Its loading overlay comes in `circular-progress`, `linear-progress` and `skeleton` variants, so it is region-scoped and shows determinate-style bars. https://mui.com/x/react-data-grid/overlays/
- Guidance: show a loader only after about 1s. https://mui.com/material-ui/react-progress/

### Ant Design

- `Spin` wraps children (nested mode). Props: `spinning`, `delay` (debounced; never shows if loading ends in time), `description` (replaces the deprecated `tip`), `indicator`, `percent` (number or `'auto'`), `size`, `fullscreen`. https://ant.design/components/spin
- The nested root gets `aria-busy={spinning}` and `aria-live="polite"`. Source: https://github.com/ant-design/ant-design/blob/master/components/spin/index.tsx
- While spinning, the content drops to opacity 0.5 with `pointer-events: none` and `user-select: none`. A `::after` mask in `colorBgContainer` at 0.4 opacity sits over it. Keyboard focus is not blocked. Source: `components/spin/style/index.ts`
- Fullscreen uses a `colorBgMask` mask at `zIndexPopupBase`, with an opacity transition.

### GOV.UK Design System

- No spinner or overlay component, and nothing in the backlog. GOV.UK prefers server-rendered pages over client-side waits.
- Other public-sector systems: NSW says show a loader only after 1s and say why the user is waiting. Queensland uses `role="status"` with a specific label. https://designsystem.nsw.gov.au/components/loader/index.html

### IBM Carbon

- `Loading` with `active`, `withOverlay` (default `true`), `description` (default "loading") and `small`. Source: https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Loading/Loading.tsx
- With an overlay, the wrapper gets `role="dialog"`, `aria-label={description}` and `tabIndex=-1`, and focus is trapped while active. The spinner container is `aria-live="assertive"`.
- The overlay is `position: fixed` with the `$overlay` colour and `z('overlay')`. It is full-viewport only, with no region mode. Source: `packages/styles/scss/components/loading/_loading.scss`
- Guidance: use only for waits over 3s, and prefer skeletons for page loads. Overlays block all interaction. Announce "loading complete" when done, or move focus. Disable related actions such as Cancel during inline loading. https://carbondesignsystem.com/components/loading/usage/ and /accessibility/

### Adobe Spectrum / React Aria

- No overlay. ProgressCircle is indeterminate or has a `value`. Collections (TableView, ListView, Picker) take `loadingState` and show their own inline loader.
- React Aria Button `isPending`: the button stays focusable but is otherwise disabled, and the pending change is announced. The progress element must be in the accessibility tree from the start. To delay showing it, use opacity, never `display: none` or `visibility: hidden`. https://react-aria.adobe.com/Button
- Focus guidance: avoid losing focus, so pending controls keep it. FocusScope restores focus on unmount. https://react-aria.adobe.com/FocusScope

### GitHub Primer

- No overlay. Spinner has `srText` and `delay`. https://primer.style/product/components/spinner/
- Loading pattern: show nothing under 1s, indeterminate for 1–3s, determinate for 3–10s, and a background task over 10s. Use skeletons for large areas and keep the indicator within the viewport. Use a full-page interstitial only to block data changes. https://primer.style/ui-patterns/loading/
- A11y: announce start, progress, finish and failure through a status region that is always in the DOM. Use `aria-busy="true"` while a region updates, so screen readers skip partial changes. After loading, focus the first focusable element of new content, or the error.
- Primer says loading animation should stay on under reduced motion, but be subtle.

### Not from the 9, but relevant

- Browsers run the HTML "focus fixup rule": when the focused element becomes `inert`, it loses focus and `document.activeElement` falls back to `<body>`. Screen-reader users then lose their place. WPT test: `inert/dynamic-inert-on-focused-element.html`.
- `spin-delay` (Kent C. Dodds) is the common pattern for avoiding flashes: a delay before showing (500ms) plus a minimum display time once shown (200ms).
- React: a `<Suspense>` fallback replaces content (a Skeleton's job). `useTransition` keeps the old UI on screen and exposes `isPending`, which fits `loading={isPending}`.

## Our base: what Base UI, Tailwind and the repo already give us

- **Spinner** (being rebuilt): `srLabel` (`null` makes it decorative), a status region that stays mounted, `delay` (`true` = 1000ms, `"short"` = 300ms, or a number), `status`, and `xs`/`xl` sizes. The shared **announce utility** is built with it.
- **Progress** (Base UI `Progress`) for the determinate variant.
- **Base UI Dialog**: a modal with focus trap, outside-`inert`, scroll lock and focus restore. This is the right engine for full screen. It has no LoadingOverlay primitive.
- **`useRender`** for the `render` prop, as in SkipLink.
- **React 19** supports the `inert` prop natively.
- **Tokens:** `--sp-surface-base` and `--sp-surface-overlay` per theme, and motion tokens (`--sp-duration-fast` and `--sp-duration-exit`) that drop to 0ms under reduced motion. Dialog's backdrop is a hard-coded `bg-black/50`; we should not copy that.
- **Tailwind:** `isolate`, `inert:` variants, `motion-reduce:`, `forced-colors:` and `supports-[backdrop-filter]:`.
- **Not yet in the repo:** the announce utility, any z-index scale (components use ad-hoc `z-10`, `z-50` and `z-[9999]`), and a backdrop token.

## Proposed scope

```tsx
<LoadingOverlay loading={isPending} label="Loading orders">
  <OrdersTable />
</LoadingOverlay>
```

Markup:

```
Root  div[data-slot=loading-overlay]  relative, isolate   (render prop)
├─ Content  div[data-slot=loading-overlay-content]  isolate, aria-busy, inert
└─ Overlay  div[data-slot=loading-overlay-backdrop]  absolute inset-0
   └─ Panel  div[data-slot=loading-overlay-panel]  sticky-centred
      ├─ Spinner (srLabel={null}) or Progress (when value is set)
      ├─ label + description (visible text)
      └─ action (e.g. a Cancel Button)
```

Props: `loading`, `label` (default "Loading"), `description`, `doneLabel`, `delay` (default `"short"`), `minDuration` (default 500ms), `value` (determinate), `action`, `blur`, `fullscreen`, `onFocusMove`/focus options, and `render`.

## Decisions (numbered; the same list you return)

1. **API shape:** (a) wrap the region, as Ant does. Only a wrapper can put `inert` and `aria-busy` on the content itself; an overlay that sits beside the content (Mantine) can't. (b) An overlay inside a relative parent, plus a `targetRef` to make inert. (c) Compound `Root`/`Content`/`Overlay` only. [Ant, Chakra recipe vs Mantine]
2. **Name:** (a) a `LoadingOverlay` component, which in effect is the region wrapper with a `loading` prop. (b) A `loading` prop on Card, Table and the like, reusing it internally later. Start with (a). [Ant, Mantine]
3. **Inert and busy:** (a) put `aria-busy` and `inert` on Content only. The overlay stays outside the busy subtree, so its own text and Cancel button stay reachable. (b) Put both on Root. [Ant, Chakra, Primer]
4. **Focus when the focused element becomes inert:** (a) if focus is inside Content when the overlay shows, move it to the overlay panel (`tabIndex=-1`, labelled by `label`), or to `action` if there is one. When loading ends, restore focus to the saved element if it is still connected and focusable, else to Content. (b) Don't move focus and let it fall to `<body>` (the browser default). (c) Trap focus like Carbon. [Carbon, React Aria, Primer]
5. **Delay vs blocking:** (a) set `aria-busy` at once. Apply `inert`, the backdrop and the announcement only after `delay`. If loading ends within the delay, nothing shows or is announced. (b) Block at once and delay only the visuals. [Ant, Primer, MUI]
6. **Delay values:** (a) the same API as Spinner (`true` = 1000ms, `"short"` = 300ms, or a number), defaulting to `"short"` because the overlay blocks interaction. (b) Default off, like Spinner. [Ant, Primer]
7. **Minimum display time:** (a) `minDuration`, default 500ms, so a shown overlay never flickers off. (b) Leave it out. No library in the 9 has it, but it is the `spin-delay` pattern. [Carbon InlineLoading 1.5s finish, spin-delay]
8. **Announcements:** (a) the overlay's Spinner gets `srLabel={null}`. LoadingOverlay calls the shared announce utility once with `label` when shown, and once with `doneLabel` when it finishes (only if it was shown). No other live region is used, so nothing is announced twice. (b) Use Spinner's own status region for the start and announce only the finish. [Primer, Carbon, Ant `aria-live`]
9. **Done message:** (a) `doneLabel` defaults to `null` (silent), with docs saying to set it or to move focus to new content. (b) Default "Loading complete" (Carbon). [Carbon, Primer]
10. **Backdrop colour:** (a) a new semantic token `--sp-backdrop-loading`, using `color-mix` on `--sp-surface-base` at about 75% per theme, and near-opaque in high contrast. No free colour or opacity props. (b) `opacity` prop. [Mantine 0.75, Chakra /80, Ant 0.5 + 0.4]
11. **Blur:** (a) `blur` boolean, off by default, only applied under `supports-[backdrop-filter]`, and dropped under `prefers-reduced-transparency`. (b) No blur. [Mantine]
12. **Forced colours:** (a) the backdrop keeps its alpha but is forced to Canvas, so status must not rely on it. The panel gets a `CanvasText` border and visible label text. The Spinner stroke uses `CanvasText`. Content is inert anyway. (b) A fully opaque backdrop in forced colours. [repo rule]
13. **Transitions:** (a) an opacity fade only: in at `--sp-duration-fast`, out at `--sp-duration-exit`. Both are 0ms under reduced motion. Keep it mounted during exit (Base UI-style `data-starting-style`/`data-ending-style`). (b) No transition (Mantine default 0). [Mantine, MUI, Ant, Carbon]
14. **Reduced motion and the spinner:** (a) follow Spinner's approved behaviour (the ring slows to 3s and the dots pulse), not a full stop, as Primer advises. (b) Stop the spinner fully, as the ticket says. George to pick, since the ticket and the Spinner decision differ. [Primer]
15. **Stacking:** (a) Root and Content both `isolate`, overlay at `z-[1]`. Sticky table headers inside Content can't rise above the overlay, and the overlay never rises above page-level sticky headers or popovers. No z-index prop. (b) A `zIndex` prop, as Mantine has. [Mantine, Ant, MUI]
16. **Tall regions:** (a) the panel is `sticky` and centred within the visible part of the region, so it stays in the viewport. (b) Centred in the region. [Primer]
17. **Full screen:** (a) `fullscreen` renders through Base UI Dialog as a modal: portalled and fixed, with the rest of the page inert, scroll locked, focus moved in and restored. Close requests (Escape, outside click) are ignored, and `role="dialog"` uses `label` as its name. (b) A fixed div plus `inert` on an app root the consumer passes in. [Ant, Carbon, MUI Backdrop]
18. **Description and custom content:** (a) `description` (a ReactNode under the label) and an `action` slot, with no free indicator slot. This is consistent with the approved Spinner exception. (b) Free `children` for the panel (Mantine, Ant `indicator`). [Ant, Carbon, Mantine, shadcn]
19. **Progress variant:** (a) `value` (0–100 or `null`) swaps the Spinner for a Southpaw Progress bar labelled by `label`. Announcements stay start and finish only, not every percent. (b) Leave it to composition. [Ant `percent`, MUI DataGrid, Primer guidance]
20. **Cancel:** (a) `action` takes a Button, such as Cancel, that stays focusable outside the inert Content. Docs say it should abort the request, not just hide the overlay. (b) None, following Carbon's "disable related actions". [shadcn]
21. **Skeleton vs LoadingOverlay:** (a) document it. Use Skeleton (GEO-963) for a first load with no content yet, which is also the `<Suspense>` fallback. Use LoadingOverlay to reload, filter or save content that is already on screen, which is `useTransition` `isPending`. Use Spinner alone for inline waits. [Carbon, Primer, MUI DataGrid]
22. **React patterns:** (a) a Storybook example with `useTransition` (`loading={isPending}`) and docs that point Suspense users to Skeleton. Don't ship a Suspense-aware wrapper. (b) Export a `<LoadingOverlay.Suspense>` helper.

## Exceptions (recommended not to build)

- **Free indicator / loader slot** [Mantine, Ant, shadcn]: George already rejected it for Spinner; `value` and `action` cover the real needs.
- **Free colour / opacity / `zIndex` props** [Mantine, MUI]: no free colours (repo rule). Stacking is solved by `isolate`.
- **Assertive announcements and a focus trap for region mode** [Carbon]: too strong for a section reload. They stay only in full-screen mode, where the Dialog handles them.
- **Spinner `size` prop on the overlay** [Ant `size`]: the panel picks `xl`, or `lg` in compact density, from density. One fewer knob.

## Stories and tests planned

**Stories** (each wrapped in `sm:max-w-lg`):

- **Default:** a Card with a table and a "Reload" button that toggles `loading` for 2s.
- **States:** idle, loading (label only), with description, with action (Cancel), determinate (`value` 40), and finished with `doneLabel`.
- **Density:** compact, default and comfortable, side by side.
- **Themes:** every state above, with and without blur, in light, dark and high contrast. Plus a forced-colours check through Playwright emulation.
- **Feature stories:** Delay and MinDuration (fast and slow requests), FocusInside (Reload button inside the region keeps focus with the overlay), StickyHeader (a scrolling table with a sticky head under a sticky page header), TallRegion (sticky panel), Fullscreen, Progress, Cancel, UseTransition, and SkeletonVsOverlay.

**Unit tests:**

- `aria-busy` toggles at once, and `inert` only after the delay.
- With fake timers: nothing shows if loading ends within the delay, and a shown overlay stays for `minDuration`.
- Focus moves to the panel or action when it was inside Content, and is restored after (or falls back to Content).
- Announce is called once on start and once on finish, and not at all when loading ends within the delay.
- The Spinner inside has no `role="status"` (decorative).
- `value` renders Progress with the label as its name.
- Fullscreen renders `role="dialog"` named by `label`, makes outside content inert, and ignores Escape.
- `data-slot`s are present, `render` works, and axe passes.

**E2E checks:** `pnpm verify`, plus computed checks that the backdrop colour differs per theme, the transition duration is 0ms under reduced motion, the overlay sits above a sticky `thead`, and focus is never on `<body>` after loading starts.

## George's decisions (2026-11-21)

- **(a) on every decision**, as recommended.
- **Token approved:** `--sp-backdrop-loading`. This is a shared token change, and Dialog may reuse it later in place of its hard-coded `bg-black/50`.
- **#14:** under reduced motion, keep Spinner's approved slow spin and pulse. This supersedes the ticket's "no animation".

### Considered and rejected (approved by George, 2026-11-21)

- **Free indicator/loader slot** [Mantine, Ant, shadcn]: already rejected for Spinner; `value` plus `action` cover the real needs.
- **Free colour, opacity or `zIndex` props** [Mantine, MUI]: the no-free-colour rule, and stacking contexts solve z-index.
- **Assertive live region and a focus trap in region mode** [Carbon]: too strong for a section reload; only fullscreen mode does this, through Dialog.
- **Size prop** [Ant]: the panel takes its size from density.

## Re-check before the build (2026-11-23)

The research and George's decisions above still stand. What changed in the repo since 2026-11-21:

- **`lib/delay.ts` exists** (from Skeleton, GEO-963). It is exactly decision 6's API: `true` is 1000ms, `"short"` 300ms, or a number. Reuse it, with `"short"` as the default.
- **`lib/announce.ts` exists** (from Skeleton). Decision 8's start and finish announcements go through it. It skips an identical message still in the region (7s), so a second reload of the same region within 7s would say nothing. Lane 4 is adding a `force` repeat option in the DescriptionList commit, which is this branch's base. LoadingOverlay will use `force` for its start and finish messages, and won't change announce itself.
- **The Spinner rebuild hasn't happened.** It's part of GEO-939, not yet started, so `srLabel`, Spinner's own `delay`, the always-mounted status region and the `xs`/`xl` sizes don't exist yet. Today's Spinner always sets `role="status"`, but it spreads props after that, so a caller can override the role.
  - LoadingOverlay only needs Spinner as a picture: `lib/delay` handles the timing and `lib/announce` the speech.
  - That makes it buildable now, with the overlay's Spinner made decorative.
- **Progress and Dialog** (Base UI) are in the repo for decisions 19 and 17.
- **There's still no z-index scale.** Decision 15's `isolate` and `z-[1]` approach doesn't need one.
- **There's no backdrop token yet.** `--sp-backdrop-loading` (approved) is added with this build.
