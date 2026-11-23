# Indicator — Change Log

## 2026-11-23 — Sign-off (GEO-964)

George signed off Indicator after the Transitions fix (the `w-fit` wrapper, below).

**/improve findings, both fixed with tests**

1. **A hidden inline count left a gap.** A 0, or `visible={false}`, was only scaled to 0, so the pill still took space after the tab or link text. Inline badges now get `display: none` when hidden, applied last so it wins over the badge's display class. Overlays still scale away, since they're out of flow.
2. **A dot with a `label` function but no count lost its fallback.** The function needs a count, so the label came out undefined instead of "New activity". It now falls back to the defaults when there's no count.

**Follow-ups:**

- `Tabs.Tab count` is **GEO-976** ("Tabs: count on Tabs.Tab using Indicator").
- The Menubar test that failed under full-suite load during this work ("Right from an open menu opens the next one…") is **GEO-977**, linked to the ToggleGroup flake GEO-974. Neither comes from Indicator.

**Checks:** 31 tests for Indicator, and the full suite passes.

## 2026-11-23 — Implementation (GEO-964)

Built to George's decisions of 2026-11-21: option (a) on all 27, the `--sp-indicator-ring` token, accent as the default count colour, and disabled meaning muted with the count kept. On 2026-11-23 he answered "Indicator: all a" to four follow-up questions:

1. **Semantic tones only.** The Y1 `color` prop comes with the Y1 palette in GEO-939.
2. **Tabs:** the inline form plus a story showing it in a tab. `Tabs.Tab count` is the follow-up ticket GEO-976 ("Tabs: count on Tabs.Tab using Indicator").
3. **Shared code:** `lib/format-count.ts` and the status shapes are built here. Avatar and Badge aren't touched; they adopt both at their GEO-939 rebuilds.
4. **Shared CSS:** keyframes and `--sp-indicator-ring` approved.

**Shared, new**

- **`lib/format-count.ts`:** `formatCount(count, { max, format, locale, formatOptions, overflow })`.
  - Uses `Intl.NumberFormat`.
  - `max` defaults to 99, with no cap when `compact`. The overflow text is localisable (default "99+").
  - Badge's `max` adopts it at GEO-939.
- **Token:** `--sp-indicator-ring` (`bg-indicator-ring`, `ring-indicator-ring`) defaults to `surface-base` in every theme, and to Canvas in forced colours. Set it on a raised or sunken container to match.
- **Keyframes** (tokens CSS):
  - `sp-indicator-pulse`: a ring that grows and fades.
  - `sp-indicator-pop`: a scale bump when the count changes.

**Indicator**

- **Overlay:** a non-interactive `span` (`relative inline-flex`) wraps the child, so it's valid inside buttons and links. `render` swaps it for block children.
- **Inline:** with no child, it renders beside text.
- **Content:** `count`, `dot`, `status` or `content` (an icon or short text). Precedence is status, then dot, then content, then count.
- **Screen readers.** The visible badge is always `aria-hidden`.
  - **Overlay:** `label` (a string, or a function of the raw count) renders in a `hidden` span. That span is merged into the child's `aria-describedby`, keeping any existing value.
    - If the child can't take it (text, or several nodes), the label is read in place as `sr-only` instead.
    - In Chromium, the Default story's button is named "Notifications" with the description "5 unread notifications".
  - **Inline:** a visually hidden " (12)" or " (label)" joins the name of the tab or link ("Issues (12)", from Primer).
  - Screen readers always get the raw count, never "99+" or "1.2K".
  - Defaults: a dot falls back to "New activity". A status falls back to its preset label: Online, Busy, Away, New or Offline.
  - A dev warning fires once per mount when an overlay count or content has no `label`.
- **Count:**
  - `max` (99), `showZero` (false), `format` ("compact"), `locale`, `formatOptions` and `formatOverflow`.
  - A negative count shows 0, with a dev warning once. It doesn't throw.
- **Placement:**
  - `position`: all 9 logical values, default `top-end`.
  - `offset`: a number, a length, or `{ x, y }`, as CSS variables. `x` follows the reading direction.
  - Translate isn't logical, so the inline part is multiplied by `--sp-indicator-dir`, which is `-1` under `rtl:`.
  - `overlap="circular"` insets the corners by 14%.
- **Tones:** accent (default), neutral, danger, success, warning and info. Never brand.
  - Accent uses `surface-base` text, which flips with the theme.
  - The warning tone needed no new token: `--sp-warning` already exists.
- **Status shapes** (inline SVG, so they never rely on colour alone):
  - success: filled circle;
  - danger: circle with a bar;
  - warning: triangle;
  - info: ringed dot;
  - neutral: hollow ring.
  - With `bordered`, the shape sits on a disc in the ring colour.
  - Inline, `showLabel` shows the label as text beside the shape.
- **Sizes:**
  - Counts are 16, 20 or 24px pills with `tabular-nums`.
  - Dots are 8, 10 or 12px. Status shapes are 10, 12 or 16px.
  - Density doesn't change them.
- **Pulse:** a ring behind the badge in the tone colour (`isolate`, with `before:-z-10`, so it sits behind the digits). Under reduced motion it becomes a still ring (scale 1.7, opacity 0.3). Disabled has no pulse.
- **Visibility:** `visible={false}` and a hidden 0 stay mounted, scale to 0 and fade, and drop the label and description.
- **Count change:** a small pop, replayed on change, never on first render. It runs on `--sp-duration-normal`, so it's instant under reduced motion.
- **Disabled:** neutral tone, no pulse, keeps the count and label.
- **`bordered`:** on by default for overlays, off inline. It's a 2px ring in `--sp-indicator-ring`.
- **Forced colours:** pills and dots use `forced-color-adjust: none` with a CanvasText fill and Canvas text. Status shapes are drawn in CanvasText. Checked in Chromium: the count is black with white text.
- **`announce`** (off by default): after a change, debounced by 400ms, it sends the label through `lib/announce`. Never on first render.

**Story fix while building**

- The Default story's icon button first used Tooltip's default `description` type plus `srOnly`, so "Notifications" was read as the name and again in the description.
- Icon-only buttons should use `Tooltip.Root type="label"`, which names the button (GEO-959 and Tooltip's LOG). Fixed in every story.

**Bug George found in review (Transitions story)**

- The badge sat at the far right of the canvas instead of on the button. The story's flex-column parent stretched the `inline-flex` wrapper to full width, and `top-end` followed the wrapper's edge. Any column flex or grid layout would do the same.
- Fixed in the component: the overlay wrapper is now `w-fit`, so it always shrinks to its child.
- Checked in Chromium: the wrapper is 40px, the same as the button, and the badge centre sits exactly on the button's top-right corner. Regression test added.
- **Why it slipped through:** verify passed, and I didn't open the Transitions screenshot before reporting that I had looked at all of them.

**Checked in Chromium (Playwright)**

- **Default:** the name is "Notifications", and the description is "5 unread notifications".
- **Reduced motion:** the pulse `::before` has `animation: none`, scale 1.7 and opacity 0.3.
- **Forced colours:** the count is filled in CanvasText.
- **RTL:** `top-end` sits on the left edge and `top-start` on the right.
- **Note:** German compact formatting gives "1234", not "1,2 k" as RESEARCH.md guessed. `Intl` doesn't abbreviate thousands in German, so this is correct.

**Tests:** 29 in `Indicator.test.tsx` at review (31 after sign-off), including the `formatCount` cases:

- `max`, the localised overflow, compact and locale formats;
- the description from the raw count, the merge with an existing `aria-describedby`, `showZero` and hidden states;
- the dot fallback, the warning once, and a negative count;
- logical position and offset variables, circular overlap, tones, and disabled muting the tone and stopping the pulse;
- bordered, forced colours, and the five status shapes and labels;
- the pop on change only, the in-place label, ref and render;
- the inline " (12)" in a link's name, the label, `showLabel`;
- `announce` off by default and debounced, and SSR.

**Stories:** Default, States, Positions (including RTL), Offset, Overlap, Inline (Tabs and status text), Formatting (en, de, ar-EG, hi-IN), Content, Transitions, Density and Themes. Themes shows every tone, dot, pulse, disabled, every status shape, all sizes, and bordered and not, in light, dark and high contrast. Valid and error don't apply.

**Not here (by decision):**

- the Y1 `color` prop (GEO-939);
- `Tabs.Tab count` (GEO-976);
- rebuilding Avatar.Status and Avatar.Badge, and Badge adopting `formatCount` (GEO-939).
