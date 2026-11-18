# SkipLink — Research (GEO-952)

A "Skip to main content" link. It's hidden until it gets keyboard focus, and it moves focus past the repeated navigation to the main content. This meets WCAG 2.4.1 (Bypass Blocks) using technique G1.

Researched on 2026-11-18 across all 9 libraries.

## Who has what

Only three libraries ship a public component: GOV.UK (Skip link), Carbon (`SkipToContent`) and Chakra v3 (`SkipNavLink` and `SkipNavContent`). MUI has one inside its docs site only, and Primer has a CSS utility, `.show-on-focus`. shadcn, Mantine, Ant Design and React Aria/Spectrum have nothing. React Aria uses landmark navigation instead: F6 moves between landmarks.

| Feature                                  | GOV.UK                          | Carbon           | Chakra                   | MUI (docs only)  | Primer (CSS)        |
| ---------------------------------------- | ------------------------------- | ---------------- | ------------------------ | ---------------- | ------------------- |
| Default `href`                           | `#main-content` (page template) | `#main-content`  | `#chakra-skip-nav`       | `#main-content`  | `#start-of-content` |
| Separate target component                | –                               | `Content` (main) | ✅ `SkipNavContent`      | –                | an empty div        |
| Moves focus to the target (JS)           | ✅                              | –                | – (static `tabIndex=-1`) | –                | unverified          |
| Temporary `tabindex=-1`, removed on blur | ✅                              | –                | – (always on)            | –                | –                   |
| Hides the target's outline               | ✅ (a class)                    | –                | ✅                       | –                | –                   |
| JS skipped for other pages               | ✅                              | –                | –                        | –                | –                   |
| Missing target                           | throws                          | –                | –                        | –                | –                   |
| When shown                               | pushes content down (block)     | overlay          | fixed overlay            | fixed, slides in | overlay             |
| Reduced-motion fallback                  | –                               | –                | –                        | ✅               | –                   |
| Hidden when printing                     | –                               | –                | –                        | ✅               | –                   |
| Forced-colours fix                       | ✅                              | –                | –                        | –                | –                   |
| Safe-area insets                         | ✅                              | –                | –                        | –                | –                   |
| Translatable label                       | ✅                              | ✅               | ✅                       | ✅               | n/a                 |
| Several links                            | –                               | –                | –                        | –                | –                   |

### GOV.UK (primary reference, govuk-frontend 5/6)

- **Markup:** `<a href="#main-content" class="govuk-skip-link" data-module="govuk-skip-link">Skip to main content</a>`, placed directly after `<body>` opens, or after the cookie banner. Don't wrap it in `<nav>` or put it inside the header.
- **JS:**
  - It does nothing for links to another page or origin.
  - It throws if there's no hash or no target.
  - On click it does not call `preventDefault`, so the URL updates and the page scrolls natively.
  - It adds `tabindex="-1"` only if the target has none, adds the `govuk-skip-link-focused-element` class, then focuses the target. On the first blur it removes the class and the tabindex it added.
- **CSS:**
  - Hidden with `:not(:active):not(:focus)`.
  - Shown on focus as a block that pushes the content down: padding, safe-area insets, a yellow background and outline, and a forced-colours offset.
  - The focused target gets `outline: none` (w3c/wcag#1001).

### Carbon

`SkipToContent` takes `children` ("Skip to main content"), `href` (`#main-content`) and `tabIndex`. It's the first child of the UI Shell `Header`. On focus it shows as a fixed 3rem bar in the top-left corner with a 4px focus border and z-index 9999. It has no JS.

### Chakra v3

- `SkipNavLink` links to `#${id}`.
- `SkipNavContent` renders the target: `id`, `tabIndex={-1}`, `outline: 0`. It can wrap the main content or stand alone.
- Hidden until `:focus-visible`, then fixed top-start, with a panel background and a focus ring.

### MUI (docs site only)

Its internal `SkipLink`:

- `#main-content`, with the text translated.
- `position: fixed`, slides in from `top: -10`.
- A fade under `prefers-reduced-motion`.
- `display: none` when printing.

### Others

- **Primer:** `.show-on-focus`, which keeps the element absolutely positioned and clipped until focused. github.com targets an empty `#start-of-content` div.
- **shadcn:** community versions only.
- **Mantine:** only `VisuallyHidden`.
- **Ant Design:** nothing.
- **React Aria:** `useLandmark`, where F6 cycles through landmarks.

## Pitfalls to design around

- **Never hide it with `display:none`, `visibility:hidden` or `hidden`,** because those take it out of the tab order. Use clipping, and show it on `:focus`, not `:focus-visible`, so it always appears.
- **`<main>` can't take focus without `tabindex="-1"`,** and once it has focus it shows an outline. Add the tabindex for the moment of focus and hide the outline (GOV.UK).
- **Moving focus with JS is what makes it reliable.** Some browsers have scrolled to the hash without moving the keyboard position, so the next Tab went back into the header. GOV.UK added JS for this in v4.
- **Sticky headers cover the target** after it scrolls into view. `scroll-margin-top` on the target fixes that.
- **Hash routers** (React Router `HashRouter`) treat `#main-content` as a route. Those apps need `preventDefault` and focus moved by hand.
- **One link is usually enough** (WebAIM). Nobody ships a component for several links.
- **Fast tabbing** only flashes the link, so it should look distinct.

Sources:

- design-system.service.gov.uk/components/skip-link, and the govuk-frontend `skip-link.mjs` and `_index.scss` source
- carbon `UIShell/SkipToContent.tsx`
- chakra-ui.com/docs/components/skip-nav
- MUI `packages-internal/core-docs/src/Link/SkipLink.tsx`
- primer/css `.show-on-focus`
- webaim.org/techniques/skipnav
- w3.org/WAI/WCAG22/Techniques/general/G1

## Decisions (George, 2026-11-18)

George chose option (a) on all 10. The details are in LOG.md.

### Considered and rejected

- **An always-visible variant:** no library ships one, and `className` can override the hiding.
- **A group API for several links:** several links already work, and one is usually enough.
