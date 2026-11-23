# Link — Change Log

## 2026-11-23 — `mergeClassName` after the restack onto Part A (GEO-967, GEO-958)

- Rebased onto `geo-968-visually-hidden`, which now sits on Part A (GEO-970). Storybook's `@source` widening now comes from Part A, so the local-only `styles.css` edit is gone.
- Link merges `className` with `mergeClassName(linkClasses(…), className)` instead of `cn`, matching every other wrapper since Part A. Link's `className` is a string, so the output is unchanged.
- The conflicts in ErrorSummary, SkipLink, NavigationMenu, Menu and Toolbar were resolved by keeping Part A's `mergeClassName` and Link's changes. See Toolbar's LOG for the one real fix.

## 2026-11-23 — Sign-off (GEO-967)

George signed off Link, asking for a gap around the focus ring.

**High-contrast colours confirmed:** hover `#002f6c` and visited `#4c2c92` (GOV.UK's purple), as the 2026-11-22 entry lists.

**Focus-ring gap: George chose option (a), 2px above and below on inline links.**

- **Why not `outline-offset`:** `sp-focus-ring` is a box-shadow (2px inner, 3px outer), so `outline-offset` has no effect on it. It only applies in forced colours, where the outline is already offset by 2px.
- **How:** inline links get `py-0.5`. Vertical padding on an inline box doesn't change the line box, so no compensating margin is needed and no line moves. Checked in Chromium for Link and ErrorSummary, in light, dark, high contrast and forced colours: only the link's own box changes size. In forced colours the 2px outline now sits 2px past the padding.
- **Sides:** left as they were, with the ring on the text box.
- **Standalone links keep the ring on the box edge.** They're boxes, like every other control: SkipLink, the NavigationMenu rows, and standalone links' 24px boxes. Menu.LinkItem and Toolbar.Link use the focus classes directly, so they're unchanged.

**Considered and rejected**

- **(b) A gap on all sides** (`px-0.5 py-0.5 -mx-0.5`): built and measured, and nothing moved. But a word space is about 4px, so the ring reached 7px past the text and covered part of the next character ("ca[n]", "online[.]").
- **(c) GOV.UK's focus style** (yellow background and a thick underline instead of the ring): a design change, and it would differ from every other control's focus ring.

**/improve findings**

1. **Fixed:** dev warnings fired on every render. They now fire once per mount, in an effect, as in Accordion and Collapsible. Test: re-rendering warns once.
2. **Fixed:** `aria-disabled="false"` set off the "can't be disabled" warning. Test added.
3. **Fixed, in Toolbar:** `linkFocusClasses` brings `rounded-sm`, which overrode Toolbar.Link's `rounded-md`. Toolbar now uses `focusRingClasses`. See Toolbar's LOG.
4. **Test gap closed:** inline links carry `py-0.5` and no side padding, and standalone links have no gap.

**Checks:** 1,046 tests across 48 files.

## 2026-11-22 — Implementation (GEO-967)

Built to George's 18 decisions (option (a) on all of them), with his approved tokens and wording. See RESEARCH.md.

**Tokens** (packages/tokens, approved): `--sp-link`, `--sp-link-hover` and `--sp-link-visited`, mapped to `text-link`, `text-link-hover` and `text-link-visited`. All are solid colours, because `:visited` ignores alpha.

- **Light:** `#0b57d0`, `#083f99` and `#6b2fb3`.
- **Dark:** `#a8c7fa`, `#d0e0ff` and `#c8a8ff`.
- **High contrast:** `#00449e`, `#002f6c` and `#4c2c92`. Hover and visited are new values; visited is GOV.UK's purple.
- **Forced colours:** LinkText and VisitedText.

Measured on the base surface (rest / hover):

| Theme         | Rest   | Hover   |
| ------------- | ------ | ------- |
| Light         | 6.39:1 | 9.63:1  |
| Dark          | 10.9:1 | 14.09:1 |
| High contrast | 9.05:1 | 12.94:1 |

None of these reaches 3:1 against body text, so inline links always keep their underline (WCAG 1.4.1).

**`lib/link.ts`** (shared): `linkClasses()`, `focusRingClasses`/`linkFocusClasses`, `getLinkBehaviour()`, `mergeRel()`, `printableUrl()` and `defaultLinkLabels` ("(opens in new tab)", "(download)").

**Link**

- One `<a>` built with `useRender`, so `render` takes an element or a function (router links). The ref is forwarded.
- `data-slot` defaults to "link". A component built on Link can keep its own slot.
- Variants: `default`, `muted`, `inherit` and `inverse`. Only `default` shows visited, and `visited={false}` turns it off.
- Underline: GOV.UK's, 1px at rest and `max(3px,.1875rem,.12em)` on hover, with skip-ink off on hover.
  - `underline="hover"` and `"none"` work on **standalone links only**. Inline links keep their underline, and a dev warning fires.
- `standalone`: medium weight, a 24px minimum height, `size` sm/md/lg, and `icon`/`iconPosition`.
- New tab: `target="_blank"` adds an `ArrowSquareOut` icon (mirrored in RTL), VisuallyHidden "(opens in new tab)" and `noopener noreferrer` merged into `rel`.
  - `externalIcon={false}` keeps the hidden text.
  - `labels` translates the hidden text.
- Download: an icon plus "(download)".
- `aria-current="page"` shows as semibold, in `fg-default` on default links.
- Print: absolute and root-relative URLs are printed after the link. That span is `aria-hidden`, and `printUrl={false}` turns it off.
- No `disabled` prop. A dev warning fires if `disabled` or `aria-disabled` is passed.

**Two bugs found while building**

- **The new-tab icon wrapped onto its own line**, and a word joiner didn't stop it. With plain-text children, the last word and the icon now share a no-wrap span. Other children fall back to a word joiner, which is `aria-hidden` so it stays out of the name.
- **The word joiner leaked into the accessible name** ("guidance⁠ (opens in new tab)"). Fixed by the `aria-hidden` above.

**Checked in Chromium**

- Names read "public library guidance (opens in new tab)" and "Opening times (PDF, 120 KB) (download)".
- The icon stays with the last word at 230, 180 and 150px.
- `rel` is merged.
- The standalone hover-only underline shows only on hover.
- Standalone heights are 24px, and 28px for lg.
- The focus ring wraps with the text (`box-decoration-break: clone`).
- Forced colours: LinkText, the underline stays, and focus shows a 2px solid outline.
- RTL icon `scale: -1 1`.
- The print URL is hidden on screen and inline in print.

**Refactors onto Link and `lib/link`**

- ErrorSummary.Item, SkipLink and NavigationMenu (desktop and stacked).
- Menu.LinkItem: wording and the `rel` merge.
- Toolbar.Link: shared focus ring and new-tab behaviour.

Each has its own LOG entry. Button `href` and Card.Link wait for the GEO-939 build.

**Stories:** Default, States, Variants, Standalone, NewTabAndDownload, RouterLinks, RightToLeft, Density and Themes.

- Hover, focus and visited are inert previews, because browsers hide `:visited` from scripts.
- Valid, error and disabled don't apply to links.

**Storybook note:** `apps/storybook/styles.css` `@source` was widened to `*.{ts,tsx}` **locally only**, so `lib/link.ts` gets scanned. It isn't committed. Part A (GEO-970) changes that exact line. Run `git checkout -- apps/storybook/styles.css` before rebasing.
