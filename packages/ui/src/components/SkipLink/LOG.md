# SkipLink — Change Log

## 2026-11-21 — Stories use NavigationMenu (GEO-970)

The placeholder header nav, a `<nav>` with a plain list of links, is now a real `NavigationMenu`. It has a "Books" disclosure with three links, plus Events, Your account and Help. This was planned for the restack, once NavigationMenu shared a base with SkipLink.

The header stays on one row: the home link doesn't shrink, and the nav takes the rest of the width. Below `md` it collapses to NavigationMenu's "Menu" button, and there's no horizontal scroll at 390px.

Checked with Playwright:

- **Tab order:** skip link, City Library, Books, Events, Your account.
- **Skipping:** activating the skip link focuses `main#main-content`, and the next Tab lands on the in-content link, not the nav.
- **Other stories:** the Books panel opens below the header, and the sticky-header Target story still focuses the target.

## 2026-11-21 — Forced-colours focus workaround removed (GEO-950, GEO-970)

`sp-focus-ring` now covers forced colours itself. Windows High Contrast strips the box-shadow ring, so the utility now adds a transparent 2px outline there, which the system paints in its own colour. So the link's `forced-colors:focus:outline-*` fallback is gone. That was the local workaround noted at sign-off. The outline only applies in forced colours, so normal mode is unchanged. Checked with Playwright forced-colours emulation: the outline is solid 2px at offset 2px, and normal mode matches what it was before.

## 2026-11-18 — Signed off by George; /improve findings fixed

The read-only audit found 9 issues. All of them checked out against the code, and each is fixed, with 10 new regression tests.

- **Hash-router mode let the hash change when the target was missing or the href was `#`.** With `updateHash={false}`, the click is now cancelled before the missing-target check.
- **Activating the link again while the target still had focus left `outline-style: none` on it permanently.** This happens with screen-reader browse mode or a programmatic `.click()`. A repeat activation now just focuses the target, so blur listeners no longer stack up.
- **The invisible link could catch taps under a tall top safe-area inset**, such as a notch with `viewport-fit=cover`.
  - The slide now clears the inset as well.
  - The link has `pointer-events-none` until it gets focus.
  - Checked in Chromium: hidden, it sits at top −56 to −16px with pointer-events none. Focused, it sits at 12px with pointer-events auto.
- **The href was resolved differently from the browser.** It now reads the anchor's resolved `href`, which follows `<base>` and an href set on a `render` element.
- **The same-page check ignored the query string.** It now compares origin, pathname and search, so `?lang=cy#main-content` counts as another page. A bare `#main-content` on a page with `?q=` still works.
- **A target that couldn't take focus kept the temporary tabindex and the hidden outline.** Examples are a hidden, `inert` or closed `<details>` target. If focus doesn't land, both are undone straight away.
- **RTL used the left safe-area inset.** It now uses the right one.
- **A malformed escape such as `#100%` threw in the click handler.** The raw id is now used as a fallback.
- **`SkipLink.Target` forced `tabIndex={-1}` over the consumer's value.** The consumer's `tabIndex` now wins.
- **Stories:** the static previews are `inert`, so they can't be tabbed to or clicked, and they're out of the accessibility tree. I removed the "unfocused" preview, which said to tab to it but couldn't take focus; a note points to the Default story instead.

The audit also confirmed four things:

- Ref forwarding through `useRender` works.
- A `render` element's `onClick` runs first and can cancel.
- All the Tailwind v4 classes exist.
- The component is safe for server rendering.

**Checks:**

- 25 SkipLink tests; `pnpm test` 548 passing.
- `verify skiplink` passes with no inconclusives.
- Lint is clean, and the scratch type-check (GEO-951) is clean.

## 2026-11-18 — Implementation

George chose option (a) on all 10 decisions, as relayed by the coordinator.

- **`SkipLink`:**
  - An `<a>` rendered through Base UI `useRender`, so `render` can swap in a router's link.
  - `href` defaults to `#main-content`. The default text is "Skip to main content", and you translate it by passing other text as children.
  - `data-slot="skip-link"`.
- **Focus (from govuk-frontend):**
  - Clicking the link focuses the target.
  - If the target has no tabindex, it gets a temporary `tabindex="-1"`. The target's outline is hidden while it has focus (`outline-style: none` set inline, so no global CSS is needed).
  - On blur, both changes are undone. A tabindex the target already had is left alone.
  - Links to another page or origin are left to the browser.
  - The click isn't cancelled, so the URL hash and native scroll still happen.
  - A consumer `onClick` that calls `preventDefault()` cancels it.
- **Missing target:** a `console.warn` in development only, using the same `isDev` pattern as ScrollArea. The link then behaves as a plain anchor. GOV.UK throws instead, which would crash a React page.
- **`updateHash={false}`, for hash routers:** cancels the click, scrolls the target into view and focuses it, so `#main-content` isn't read as a route.
- **`SkipLink.Target`:**
  - Renders `id="main-content"`, `tabIndex={-1}` and no outline, with `data-slot="skip-link-target"`.
  - `scrollMargin` keeps a sticky header from covering the target.
  - `render={<main />}` makes it the main element itself.
- **How it shows:**
  - Off-screen and transparent until it has focus. It's never `display:none` or `hidden`, so it stays in the tab order.
  - Revealed on `:focus`, not `:focus-visible`, as a fixed overlay at the top-start corner.
  - Safe-area insets, `z-[9999]`, control height, surface-base background, a border, semibold text and `sp-focus-ring`.
  - It slides in using `--sp-duration-normal` with the default easing. That duration is 0ms under reduced motion.
  - Hidden when printed.
- **Forced colours:** `sp-focus-ring` can't be seen in this mode (GEO-950), so a solid outline in the system Highlight colour shows on focus for now. Swap it for the fixed ring at the restack.
- **Stories:**
  - Default: link first, a placeholder header and `<nav>`, then `<main id="main-content">`.
  - Target, with a sticky header and `scrollMargin`.
  - SeveralLinks: a second link that skips to search.
  - HashRouter, Translated (Welsh), States, Density and Themes. The focused-state previews show the link in normal flow.
- **NavigationMenu:** the header and nav are semantic HTML placeholders. NavigationMenu is in Lane 3, and its story will be added at the restack.
- **Chromium checks:**
  - Before focus, the link sits at top −60px with opacity 0. After Tab it shows at 12px, 12px with opacity 1 and the focus ring.
  - Enter focuses `main#main-content`, sets the hash to `#main-content`, and adds `tabindex="-1"` with no outline.
  - The next Tab lands on the first link in the content, and the added tabindex is gone.
  - With a sticky header, the Target ends up below the header.
  - HashRouter leaves the URL hash unchanged and focuses `main`.
  - Reduced motion gives a 0s transition. Forced colours shows a solid Highlight outline.
- **Checks:** 15 unit tests, 538 in total. `verify skiplink` passes with no inconclusives. Lint is clean, and the scratch type-check (GEO-951) is clean.

## Considered and rejected

- **An always-visible variant (`visible` prop):** rejected by George. WCAG G1 calls a visible link "preferable", but no library ships one, and `className` can override the hiding.
- **A group API for several links:** rejected by George. Several `SkipLink`s next to each other already work (see the SeveralLinks story), and WebAIM says one link is usually enough.

## 2026-11-18 — Research (GEO-952)

- I researched all 9 libraries (see RESEARCH.md). Only GOV.UK, Carbon and Chakra ship a component. GOV.UK is the main reference, because it's the only one that moves focus with JS.
- Decisions sent for approval:
  1. Parts
  2. Focus behaviour
  3. Missing target
  4. How it shows
  5. Motion
  6. Several links
  7. Always-visible variant
  8. Printing, forced colours and safe area
  9. Hash routers
  10. Placement
- No code yet.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.
