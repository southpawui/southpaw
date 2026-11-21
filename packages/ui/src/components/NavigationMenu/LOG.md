# NavigationMenu — Change Log

## 2026-11-16 — Scope approved (GEO-924, Lane 3)

Research across all 9 libraries is in RESEARCH.md. George approved the proposed scope on 2026-11-16 (relayed by the coordinator), with these decisions:

1. **Small screens:** below a breakpoint, a "Menu" button opens a Drawer, and dropdown sections become Accordion items (Mantine, MUI, Carbon). This is why GEO-924 follows Accordion in Lane 3. The alternative was GOV.UK's in-place disclosure.
2. **Overflow:** items that don't fit on desktop move into a "More" menu by default (Primer UnderlineNav, AntD). Scroll arrows (MUI Tabs) are opt-in.
3. **Opening:** hover or click by default (Base UI's behaviour; keyboard and touch still work through click and Enter). `openOn="click"` is opt-in (Carbon).
4. **Skip link:** a separate SkipLink component on its own ticket, created by the coordinator. It's not built into NavigationMenu. The stories mention it as the recommended companion.
5. **Sliding indicator: on by default.** This is George's call, overriding my recommendation to make it opt-in. `indicator={false}` turns it off. Under reduced motion it moves without sliding.

The rest of the proposed scope was approved as written (see RESEARCH.md, "Proposed scope").

## 2026-11-16 — Full enhancement (GEO-924, Lane 3)

### What changed

- **Root**
  - Renders the shared panel itself (Portal → Positioner → Popup → Viewport), plus an optional `arrow` and `backdrop`.
  - Props: `size` (sm/md/lg, density-aware), `indicator` (default **on**), `viewport` (shared morphing panel; `false` gives separate panels), `openOn` (`hover` | `click`), `collapseBelow` (`sm`/`md`/`lg`/`always`/`never`, default `md`), `overflow` (`more` | `scroll` | `none`, default `more`), `sideOffset`, `submenu` (`flyout` | `inline`, for nested Roots), `labels` (localisable "Menu", "More", "includes current page" and the scroll-button names).
  - Gives the landmark a name with `aria-label`, and warns in development when it's missing (Primer's invariant).
- **Click mode:** `openOn="click"` cancels Base UI's `trigger-hover` value changes in `onValueChange`, so hovering never opens or closes a panel (Carbon). Base UI has no prop for this.
- **Popup renders a `div`.** Base UI's Popup is a second `<nav>`, which added an unnamed duplicate landmark on every open panel.
- **Morph:** the Popup animates `--popup-width/height` and the Positioner animates its position. Content slides from the side the pointer came from (`data-activation-direction`). `viewport={false}` turns the size, position and slide transitions off, so each panel just appears under its own trigger. Base UI always portals content into a viewport, so a truly per-item dropdown isn't possible; this gives the same visual result.
- **Indicator** (on by default, George's call; later folded into `highlight`, see the review section below)
  - A 2px accent bar.
  - It sits under the hovered or keyboard-focused item, otherwise under the open trigger, otherwise under the current item (or under More when that holds the current page).
  - Vertical mode puts it on the inline-start edge, and it flips in RTL.
  - It's moved with a transform, and the transition is removed under reduced motion: it moves without sliding. Measured: `transition-duration` is 0s under `prefers-reduced-motion`.
  - (Superseded: `indicator={false}`'s static underline was replaced by `highlight="fill"`.)
- **Current state**
  - Link `active` / `active="page"` gives `aria-current="page"` (Base UI). `active="section"` gives `aria-current="true"` (GOV.UK, Carbon).
  - `Item current` marks its trigger as the current section.
  - The current link's text is wrapped in `<strong>`, so it stays identifiable without CSS (GOV.UK).
- **Mobile:** below `collapseBelow`, a "Menu" button opens a Drawer containing `<nav aria-label>` (same label as the desktop nav). The same children re-render in "stacked" mode:
  - List becomes `Accordion.Root` rendered as a `<ul>`.
  - Item becomes `Accordion.Item` rendered as an `<li>`.
  - Trigger becomes an Accordion header/trigger.
  - Content becomes an Accordion panel.
  - Links become plain anchors that close the drawer when followed (modifier clicks don't close it).
  - Desktop panel widths and grids collapse to one column inside the drawer.
- **More overflow**
  - Items are measured with a ResizeObserver, and trailing items that don't fit are hidden.
  - A "More" item lists them in the same stacked style, so dropdown items become accordion sections.
  - If the current page is among them, More gets `aria-current="true"`, the current styling, and a visually hidden ", includes current page" (Primer).
  - Following a link closes the dropdown through Base UI's `actionsRef.close()`.
- **Scroll overflow (opt-in):** a scroll container with arrow buttons that appear only at an edge with more content. They're `tabIndex={-1}`, since keyboard users Tab through the items, which scroll into view. They respect RTL and reduced motion.
- **Links:** `icon`, `description` (mega-menu card layout) and `badge` (counters, "New").
- **New parts:** `Group` (a labelled `<ul>` of links; each child is wrapped in an `<li>`) and `Footer` (a featured strip).
- **Trigger:** built-in chevron (`CollapsibleChevron`) that flips when open. It points to the side in vertical and flyout menus, and down in inline submenus. `icon={null}` hides it.
- **Tokens:** semantic tokens only; motion uses `--sp-duration-*` / `--sp-easing-*`. Forced colours: a `Highlight` focus outline (the GEO-950 workaround, same as Accordion), and a CanvasText indicator and borders.
- **Tests:** 18 unit tests.
- **Stories:** Default, States, Sizes, MegaMenu, Indicator, OpenBehaviour, Submenus, Mobile, Overflow, Vertical, RTL, Density, Themes. The docs description and the Default story recommend SkipLink as the companion; it's built separately, on the coordinator's ticket.

### Verified in Chromium (Playwright)

- **Hover:** opens; the panel morphs 562×261 → 275×170 between Products and Resources, and the indicator follows.
- **Keyboard:** Tab, Enter, Tab into the panel and Escape (focus returns to the trigger) all work, and ArrowRight moves to the next trigger.
- **Click mode:** hover does nothing, and the panel stays open after the pointer leaves.
- **Mobile:** the drawer's sections show the current section, and following a link closes the drawer.
- **More:** it lists Docs, Community, Careers and Contact (Contact current), and closes when a link is followed.
- **Scroll:** the end arrow scrolls 220px, then the start arrow appears.
- **Submenus:** flyout and inline both open.

### Bugs found and fixed while building

- **The backdrop closed hover-opened panels at once.** It appeared over the trigger, so the pointer "left" it. The backdrop is now `pointer-events-none` (Base UI's outside-press uses a document listener), and the nav is raised above it so the header isn't dimmed.
- **Passing `aria-current={undefined}` overrode Base UI's `aria-current="page"`.** It's now only set for sections.
- **Panel content overflowed the drawer** (desktop `sm:w-*` classes and two-column grids).

### Considered and rejected

- **Opening panels by default in stories.** While a panel is open, Base UI/Floating UI renders `tabindex=0` `aria-hidden` focus-guard spans, which axe reports as `aria-hidden-focus` (serious). They're intentional (they hand focus straight to the popup), but the verify gate can't tell. So no story opens a panel by default, and the open states were checked with Playwright instead. The shared exclusion already exists: commit ccda1cc (`chore(e2e): ignore Base UI focus guards in aria-hidden-focus check`, Lane 2, PR #45, approved by George). It's narrow: only `[data-base-ui-focus-guard]` nodes, only for `aria-hidden-focus`, in e2e/verify.ts. This branch doesn't have it yet; it arrives at the restack. Per the coordinator, it isn't cherry-picked here.
  - **Follow-up after the restack:** add open-by-default showcase stories (mega menu open, More open, an open panel in Themes).
- **Hiding the desktop or mobile version with `matchMedia`.** Both render, and CSS (`hidden md:block`) switches between them, so there's no hydration flash. The drawer content isn't mounted until it opens.
- **`role="menu"` semantics, hover-only opening, and F6 landmark cycling:** see RESEARCH.md "Not proposed".

## 2026-11-16 — George's review fixes (approved with sign-off)

### Mobile drawer

- **No visible way to close it.**
  - `Drawer.CloseButton` is `hidden sm:block` by design: below `sm`, Drawer expects a swipe handle. The drawer is also full width at 390px, so there's no backdrop to tap.
  - NavigationMenu now renders its own always-visible ×: a `Drawer.Close` rendered as our `Button` (`size="icon"`, ghost) with a localisable `labels.close` (default "Close menu").
  - The header is `items-center`, so the × lines up with the "Menu" title (measured: 40×40, vertical centre offset 0).
  - Drawer itself is unchanged, since it's outside Lane 3.
- **Escape "didn't close".** I traced this with Playwright at 390×760.
  - Escape closes the dialog immediately: `data-closed` and `data-ending-style` are set within 50ms.
  - The element then stays in the DOM for the 500ms `--sp-duration-drawer` slide-out and is removed at about 800ms, when focus returns to the "Menu" toggle.
  - So the "still open at 500ms" result was the exit animation, not a stuck dialog. It's the same whether focus is on the popup, on an accordion section, or after clicking inside.
  - New tests cover Escape (focus back on "Menu") and the × (closes, focus back).
- **Dialog name:** confirmed it's labelled by the visible "Menu" heading (`aria-labelledby` points to the Drawer.Title). This is asserted in a test.
- **Current page in the drawer:**
  - The Mobile story had `current="resources"`, so Pricing wasn't the current page. It now shows both cases (current page, and current section).
  - Current items in stacked mode (drawer and More) now get an accent bar on the inline-start edge plus semibold text, on both links and section triggers. Measured: 2px accent bar, weight 600.
- **Drawer list uses Accordion's `filled` variant.** That means no divider lines, so hover, current and open fills never sit between two lines. This is the same principle as George's Accordion and Menu divider feedback. The More dropdown uses the same stacked list, so it changes too.
- Considered and rejected: turning the "Menu" toggle into "Close" (GOV.UK). That works for GOV.UK's in-place disclosure, but here the drawer is modal and covers the toggle, so the swap would never be seen. The × in the drawer header is the visible close.

### Hover styles: `highlight="line" | "fill"` (replaces `indicator`)

- **Before:** a hovered or open trigger got a grey fill, the sliding line and the rotated chevron all at once. George found that too heavy.
- **One prop, so the two styles can't be combined.** `highlight` matches the Menu naming in Lane 2.
  - `line` (default, following George's earlier "indicator on" decision): the sliding line plus the chevron rotate. No background on hover or open. The line rests on the current page when nothing is hovered or open.
  - `fill`: background on hover or open (`state-hover`) plus the chevron rotate. No line. The current page keeps a stronger `state-selected` fill and semibold text. In forced colours it gets an outline, because fills disappear there.
  - `indicator` is removed (it was never released). `highlight="fill"` replaces the old `indicator={false}` static underline.
  - Rows inside panels (nested triggers, links) always use the fill style, because they're list rows, not top-level tabs.
- **Measured in Chromium:**
  - Line style: Products background `rgba(0,0,0,0)` at rest and when open. The line moves from Pricing (x 237, w 57) to Products (x 8, w 86). The chevron rotates 180°.
  - Fill style: Products is `rgba(0,0,0,0.04)` when open, with no indicator element. Pricing (current) is `rgba(0,0,0,0.06)` and weight 600.
- **Stories:** "Indicator" became "Highlight": both styles, horizontal and vertical. Themes now shows both styles (current page and current section) in every theme.

### Panel width

- "Connect with third-party tools" broke at the hyphen because the panel was a fixed `sm:w-[34rem]` split into two columns.
- Card links (links with a `description`) now have `sm:min-w-[18rem]`, and the story grid no longer fixes a width. Measured: every description fits on one line.
- In the drawer, `!min-w-0` cancels this so the content still fits.

Tests: 21 (3 new for mobile; the highlight tests replace the indicator tests). `pnpm verify navigationmenu`: 0 violations, 0 inconclusives.

## 2026-11-16 — Signed off; /improve fixes before commit

George approved on 2026-11-16 (relayed by the coordinator), including the review fixes above. The coordinator checked the mobile close, Escape, the current page, both highlight styles and the panel width in Playwright before giving the go.

/improve (quick, scoped to this folder) found five issues. All are fixed, with 4 new regression tests:

1. **Desktop panel links didn't close the panel.** Base UI's `closeOnClick` defaults to false, but the drawer and More links already close, so single-page apps were left with the panel open after navigating. Links inside a panel now default to `closeOnClick` = true; `closeOnClick={false}` opts out, and top-level links are unaffected.
2. **The drawer stayed open if the viewport grew past `collapseBelow`.** It's modal, so it would trap focus over the desktop layout. It now closes when the breakpoint's `matchMedia` query matches (Tailwind defaults: sm 40rem, md 48rem, lg 64rem).
3. **The `arrow` on a vertical menu's flyout assumed LTR** (`-left`, border sides). It now uses `-start` with `ltr:`/`rtl:` border variants.
4. **A no-op conditional** (`align={vertical ? "start" : "start"}`) is simplified.
5. **Test gaps** are covered: panel link closes, `closeOnClick={false}`, the inline nested submenu, and the breakpoint close.

Rejected after tracing:

- **Arrow keys landing on items hidden in More:** they're `display:none`, so not focusable.
- **A nested Root picking up overflow or indicator behaviour:** both are gated on `!nested`.

**Forced-colours focus outline:** the same local workaround as Accordion, until **GEO-950** lands (the coordinator removes it after the restack).
**Follow-up after the restack:** open-by-default showcase stories, once the focus-guard exclusion (ccda1cc) is on this branch.

Checks: full suite 407 tests (25 NavigationMenu), `pnpm verify navigationmenu` with 0 violations and 0 inconclusives, eslint, prettier and typecheck clean.

## 2026-11-21 — Function `className` is no longer dropped (GEO-958, GEO-970 Part A)

- Base UI types `className` as `string | (state) => string`. `cn()` (clsx) silently ignores functions, so a consumer's state-function `className` was lost.
- Every `className={cn(…, className)}` here is now `mergeClassName(cn(…), className)` (`lib/merge-class-name.ts`). A string gives exactly the same output as before: the consumer `className` was always the last argument, and tailwind-merge is idempotent. A function now merges per state.
- Tests: `lib/merge-class-name.test.tsx`, one or more real components per family. The new packages/ui typecheck (GEO-951) found every place a function reached a plain element.

## 2026-11-21 — Open styling keys off `aria-expanded`, not `data-popup-open` (GEO-970 Part A)

- **Why:** Base UI sets `data-popup-open` on a **Tooltip** trigger while its tooltip shows. A tooltip on a disclosure trigger therefore faked the open look. Combobox had worked around it with its own `data-list-open`.
- **One convention now:** a trigger's open state is styled from `aria-expanded="true"`. Disclosures set it (Menu, Select, NavigationMenu and Combobox, checked in Chromium); Tooltip triggers never do.
- The trigger's open text and fill use `aria-expanded:`, and so does the sliding indicator's lookup (`:scope > [aria-expanded=true]`, with `aria-expanded` in the MutationObserver filter).
- Not changed: the chevron is Base UI's Icon part, which has its own state.
- `pnpm verify` passes all checks.
