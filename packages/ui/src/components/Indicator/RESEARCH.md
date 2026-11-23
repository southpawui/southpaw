# Indicator — Research (GEO-964)

Indicator is a small count or dot placed on the corner of another element, such as "99+" on an icon button or a status dot on an avatar. With no child it renders inline, like Primer's CounterLabel, for counts beside text (Tabs, nav items). It takes over the count and overlay features that Badge rejected (Badge LOG, 2026-11-09 and 2026-11-21).

Researched on 2026-11-21 across all 9 libraries.

## Who has what

| Feature                    | shadcn                        | Mantine            | Chakra               | MUI                                          | Ant                      | GOV.UK   | Carbon                              | Spectrum                                 | Primer                                        |
| -------------------------- | ----------------------------- | ------------------ | -------------------- | -------------------------------------------- | ------------------------ | -------- | ----------------------------------- | ---------------------------------------- | --------------------------------------------- |
| Overlay component          | – (AvatarBadge only)          | ✅ Indicator       | Float + Badge        | ✅ Badge                                     | ✅ Badge                 | –        | ✅ BadgeIndicator (IconButton only) | ✅ NotificationBadge (ActionButton slot) | –                                             |
| Inline count               | Badge recipe (`tabular-nums`) | –                  | Badge                | –                                            | ✅ standalone            | –        | –                                   | ✅ outside a button                      | ✅ CounterLabel                               |
| Count + max ("99+")        | manual "99", "20+"            | ✅ `maxValue`      | –                    | ✅ `max` (99)                                | ✅ `overflowCount` (99)  | –        | fixed 999                           | fixed 99                                 | –                                             |
| Locale number format       | –                             | –                  | –                    | –                                            | –                        | –        | –                                   | ✅ NumberFormatter                       | –                                             |
| Compact ("1.2K")           | –                             | –                  | –                    | –                                            | –                        | –        | –                                   | –                                        | – (GitHub app does it)                        |
| `showZero`                 | –                             | ✅ (default on)    | –                    | ✅                                           | ✅                       | –        | 0 → dot                             | throws on 0                              | –                                             |
| Dot                        | ✅ AvatarBadge                | ✅ (no label)      | ✅ Float + Circle    | ✅ `variant="dot"`                           | ✅ `dot`                 | –        | ✅ (no count)                       | ✅ (no value)                            | –                                             |
| Positions                  | –                             | 9 (logical)        | 9 (logical)          | 4 corners (physical)                         | top-end + offset         | –        | fixed                               | fixed (logical)                          | –                                             |
| Offset                     | –                             | ✅ number or {x,y} | ✅ offsetX/Y         | –                                            | ✅ [x, y]                | –        | –                                   | –                                        | –                                             |
| Circular overlap           | –                             | –                  | –                    | ✅ `overlap` (14%)                           | –                        | –        | –                                   | –                                        | –                                             |
| Status presets             | –                             | –                  | ✅ Status (separate) | –                                            | ✅ 5 statuses + `text`   | Tag only | ✅ shape indicators                 | StatusLight (separate)                   | –                                             |
| Distinct shapes per status | –                             | –                  | –                    | –                                            | –                        | –        | ✅ guidance                         | –                                        | –                                             |
| Processing pulse           | –                             | ✅ `processing`    | –                    | –                                            | ✅ `status="processing"` | –        | –                                   | –                                        | –                                             |
| Visibility toggle          | –                             | `disabled` hides   | –                    | ✅ `invisible`                               | auto on 0                | –        | –                                   | –                                        | –                                             |
| Show/hide animation        | –                             | –                  | –                    | ✅ scale                                     | ✅ zoom                  | –        | –                                   | –                                        | –                                             |
| Count-change animation     | –                             | –                  | –                    | –                                            | ✅ ScrollNumber roll     | –        | –                                   | –                                        | –                                             |
| Border ring                | –                             | ✅ `withBorder`    | via className        | –                                            | ✅ 1px shadow            | –        | –                                   | –                                        | –                                             |
| Disabled                   | –                             | hides              | –                    | –                                            | –                        | –        | hidden when button disabled         | hidden when button disabled              | –                                             |
| Sizes                      | –                             | ✅ number          | ✅ (Status sm–lg)    | –                                            | ✅ small/default         | –        | –                                   | ✅ S–XL                                  | –                                             |
| Forced colours             | –                             | –                  | –                    | –                                            | –                        | –        | –                                   | ✅ ButtonFace + border                   | –                                             |
| Screen-reader approach     | –                             | none               | none                 | badge `aria-hidden`, meaning in owner's name | native `title`           | –        | `aria-describedby` on button        | dot `role="img"` "New activity"          | visual `aria-hidden` + VisuallyHidden " (12)" |
| Live region on change      | –                             | –                  | –                    | –                                            | –                        | –        | –                                   | –                                        | –                                             |

### shadcn/ui

- Badge docs show a count recipe: `h-5 min-w-5 rounded-full px-1 font-mono tabular-nums` with "8", "99", "20+" (registry `badge-demo.tsx`). https://ui.shadcn.com/docs/components/badge
- No overlay count. The new Avatar has an `AvatarBadge` slot for a dot or icon. https://ui.shadcn.com/docs/components/avatar

### Mantine

- `Indicator` wraps a child: `position` (9 values, `top-start` … `bottom-end`, logical), `offset` (number or `{x, y}`), `inline`, `label`, `maxValue`, `showZero` (default true), `processing`, `withBorder`, `disabled` (hides), `size`, `radius`, `color`, `autoContrast`. https://mantine.dev/core/indicator/
- `label` is the visible content, not an accessible name. The page has no accessibility guidance.
- `inline` only changes the wrapper to `inline-block`. It is not an inline count.

### Chakra UI v3

- No count component. `Float` pins any child to an edge of a `position: relative` parent: `placement` (9 values, default `top-end`), `offset`, `offsetX`, `offsetY`, `asChild`. Avatar docs compose Float for status. https://chakra-ui.com/docs/components/float
- `Status` (Root + Indicator) is a separate dot + label, `colorPalette` and sizes sm–lg. No a11y notes. https://chakra-ui.com/docs/components/status

### MUI

- `Badge` is overlay only: `badgeContent`, `max` (default 99), `showZero`, `invisible`, `variant="dot"`, `anchorOrigin` (top/bottom × left/right), `overlap` rectangular (default) or circular, `color`. https://mui.com/material-ui/react-badge/
- Source: `overlap="circular"` insets by 14%, the badge has `aria-hidden`, and hiding is a `scale(0)` transform transition. https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Badge/Badge.js
- Guidance: put the meaning in the owner's accessible name, for example `aria-label="Inbox, 4 unread messages"`. Use a dot only when the context makes the state clear.

### Ant Design

- `Badge`: `count`, `overflowCount` (99), `showZero`, `dot`, `offset` `[x, y]`, `status` (success, processing, default, error, warning) with `text`, `color` (preset or free), `size` (default, small), `title`. With no children it renders standalone. https://ant.design/components/badge
- The count rolls digit by digit (ScrollNumber), and show/hide uses a zoom motion. `processing` pulses.
- Its only a11y hook is a native `title` attribute, which defaults to the count.
- `Badge.Ribbon` uses logical `placement` start/end.

### GOV.UK Design System

- No count or overlay component. Tag is for status only and always uses words ("Completed", "In progress"). https://design-system.service.gov.uk/components/tag/
- The lesson for us is to say status in text, not by colour or a bare number.

### IBM Carbon

- `BadgeIndicator` (`count`, shows "999+" above 999, a dot with no count). Experimental `IconButton badgeCount` renders it and sets the button's `aria-describedby` to the badge id. It is hidden when the button is disabled, and only allowed on large ghost icon buttons. https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/BadgeIndicator
- Status indicator pattern: badge indicators sit on header icon buttons and clear once seen. Use numbers when the exact count matters and a dot when it doesn't. https://carbondesignsystem.com/patterns/status-indicator-pattern/
- Shape indicators: use at least two of colour, shape and symbol. Don't reuse one shape in different colours. Keep 3:1 contrast against the page and between colours.

### Adobe Spectrum (S2, React Spectrum, React Aria)

- S2 `NotificationBadge`: `value` (positive integer, or none for a dot), sizes S–XL. It formats with the locale's `NumberFormatter` and caps at a localised "99+". A dot gets `role="img"` and the label "New activity". https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/s2/src/NotificationBadge.tsx
- Forced colours: `ButtonFace` fill, `ButtonText` text and a 1px `ButtonBorder`.
- Inside `ActionButton` it is positioned through a context with `insetStart` (logical) and hidden when the button is disabled. https://react-spectrum.adobe.com/s2/
- `StatusLight` is a separate dot + label for status. https://react-spectrum.adobe.com/StatusLight

### GitHub Primer (React)

- `CounterLabel`: inline, `variant` primary or secondary. The visible number has `aria-hidden="true"` and a `VisuallyHidden` sibling reads " (12)". https://github.com/primer/react/blob/main/packages/react/src/CounterLabel/CounterLabel.tsx
- Always place it next to text that says what is counted ("Issues 12"). https://primer.style/product/components/counter-label/
- UnderlineNav and UnderlinePanels tabs take `counter` and `loadingCounters` and render CounterLabel inline. https://github.com/primer/react/blob/main/packages/react/src/internal/components/UnderlineTabbedInterface.tsx

## Our base: what Base UI, Tailwind and the repo already give us

- **Base UI has no badge or indicator primitive.** We build on `useRender` (for `render`) and `mergeProps`, as SkipLink does.
- **Avatar.Status** (on `origin/geo-941-avatar-tooltip`) is an absolute `span` at physical `bottom-0 right-0` with `ring-2 ring-surface-base`, `role="img"` and `aria-label="Status: online"`. It uses colour only, and away is a hard-coded OKLCH. It should become a preset on Indicator (Avatar decisions 7 and 8).
- **Tokens:** `--sp-danger`, `--sp-success`, `--sp-info`, `--sp-accent`, `--sp-fg-on-*` and surfaces exist. There is **no warning token** yet (GEO-955). Y1 categorical colours are approved but not built yet. In forced colours `--sp-danger` maps to `LinkText`, but backgrounds are stripped, so a filled dot disappears.
- **Motion:** `--sp-duration-*` drop to 0ms under reduced motion. A looping `@keyframes` pulse needs its own `motion-reduce:animate-none`.
- **Announce utility:** decided with Spinner, not built yet.
- **No locale plumbing** beyond Combobox and Autocomplete's `locale` prop. `Intl.NumberFormat` needs no dependency.
- **Tailwind:** `tabular-nums`, logical `start-*`/`end-*` insets, `sr-only` and `forced-colors:` variants cover most of the styling.

## Proposed scope

- One component, `Indicator`. With children it is an overlay wrapper. Without children it renders inline.
- Content: `count` (number), `dot`, or free `content` (an icon or short text such as "New"). `label` is the accessible text.
- Count formatting with `Intl.NumberFormat` (`locale`, `formatOptions`, compact), `max` (default 99) and `showZero` (default false).
- `position` (9 logical values, default `top-end`), `offset` (number or `{ x, y }`) and `overlap` (rectangular or circular).
- `tone` (accent, neutral, danger, success, warning and info) and the Y1 `color` set. Plus `status` presets with a distinct shape each.
- `pulse`, `visible`, `disabled`, `bordered` and `size` (sm, md, lg, from GEO-954).
- Show/hide and count-change transitions, forced-colours styling, and RTL.
- Screen-reader text through `aria-describedby` on the child, or inline visually hidden text. An opt-in announcement uses the shared announce utility.

## Decisions

1. **Anatomy:** (a) one `Indicator` that wraps its child, which becomes inline when it has no child. Parts: `data-slot="indicator"` (wrapper), `indicator-badge` and `indicator-label`. (b) Compound `Indicator.Root` + `Indicator.Badge` [Chakra Float]. (c) Separate overlay and inline components [Primer CounterLabel, MUI].
2. **Wrapper element:** (a) a `span` with `relative inline-flex`, so it is valid inside buttons and links and shrinks to its child, with `render` for block children. It has no role, no tabindex and no handlers, so it never makes a nested interactive element. (b) a `div` [Mantine, Chakra].
3. **Content props:** (a) `count` for numbers, `dot` for a dot, `content` for an icon or short text, and `label` only for accessible text. Document that Mantine's `label` is our `content`. (b) Copy Mantine's `label` for visible content [Mantine]. (c) One `content` prop for everything [MUI `badgeContent`, Ant `count`].
4. **Screen-reader text (overlay):** (a) The visible badge is `aria-hidden`. `label` (a string, or `(count) => string`, e.g. `n => \`${n} unread notifications\``) renders in a `hidden`span with an id, merged into the single child's`aria-describedby`. This survives an `aria-label`or Tooltip on icon-only buttons and is not read twice in browse mode [Carbon]. (b)`aria-hidden`only, and document that the meaning goes in the owner's name [MUI]. (c) A`title` attribute [Ant].
5. **Screen-reader text (inline):** (a) the visible number is `aria-hidden`, with an `sr-only` sibling of " (12)" or the `label`, so the count joins the name of the tab or link it sits in [Primer]. (b) plain text with no extra handling [shadcn].
6. **Missing label:** (a) a dev warning when `count` or `dot` has no `label` and no `aria-hidden`; a dot falls back to "New activity" [Spectrum]. (b) no default.
7. **Raw numbers for screen readers:** (a) `label` gets the raw count, so readers hear "1,234 unread", not "1.2 K" or "99 plus". (b) read the visible string.
8. **Live announcement:** (a) off by default. `announce` (`"polite"`) sends changes through the shared announce utility, debounced, and never on first render. (b) skip it; no library does it [none].
9. **Count format:** (a) `Intl.NumberFormat` with `locale` (default: the browser's) and `formatOptions`, plus `format="compact"` as a shortcut ("1.2K", "1,2 k" in German). The "+" for `max` is a localisable string [Spectrum]. (b) plain `String(count)` [MUI, Ant, Mantine].
10. **`max`:** (a) default 99, formatted in the locale ("99+"), and `max={false}` for no cap. With `compact`, there is no default cap [Ant, MUI, Spectrum]. (b) default 999 [Carbon].
11. **`showZero`:** (a) default false, so 0 hides the indicator [MUI, Ant]. (b) default true [Mantine]. (c) 0 becomes a dot [Carbon].
12. **Position:** (a) all 9 logical values (`top-start` … `bottom-end`, plus `middle-*` and `*-center`), default `top-end`, using `start`/`end` insets so RTL flips [Mantine, Chakra, Spectrum]. (b) 4 corners only [MUI].
13. **Offset:** (a) `offset` as a number or `{ x, y }`, applied as CSS variables, with `x` along the inline direction so it flips in RTL [Mantine, Ant, Chakra]. (b) className only.
14. **Overlap:** (a) `overlap="rectangular" | "circular"`. Circular insets the badge by 14% so it sits on the curve. Avatar sets circular through context [MUI]. (b) offset only [Ant].
15. **Colour:** (a) `tone`: accent (default for counts, because Indicator sits on controls), neutral, danger, success, warning (needs GEO-955) and info. Plus a Y1 categorical `color` for dots. Never brand. (b) danger as the default count colour, which is the red-notification habit [Ant, Carbon]. (c) semantic tones only, without Y1 [Spectrum].
16. **Status presets:** (a) `status` = success, danger, warning, info, neutral, each with its own shape (for example filled circle, circle with a bar, triangle, ringed dot, hollow ring). Avatar maps online, busy, away and offline onto them. Shapes follow Avatar decision 7 [Ant, Carbon shape indicators]. (b) colour only [Ant, Chakra Status].
17. **Status text:** (a) the status preset gives a default `label` ("Online", "Busy"), and the inline form can show it as visible text beside the dot [Ant `text`, Chakra Status, Spectrum StatusLight]. (b) no visible text.
18. **Pulse:** (a) `pulse` boolean: an expanding ring in the tone colour, turned off by `motion-reduce:animate-none` and shown as a static ring instead [Mantine, Ant]. (b) name it `processing` [Mantine, Ant].
19. **Visibility:** (a) `visible` (default true). Hidden indicators stay mounted, scaled to 0 and faded, and their label is removed [MUI `invisible`]. (b) unmount when hidden.
20. **Transitions:** (a) scale and fade for show and hide, plus a small scale "pop" when the count changes, on `--sp-duration-fast`, so both are 0ms under reduced motion [MUI, Ant]. (b) no animation.
21. **Border ring:** (a) `bordered`, on by default for overlays and off for inline. A 2px ring in `--sp-indicator-ring`, which defaults to `--sp-surface-base`, so it can match raised or sunken parents [Mantine, Ant, Avatar.Status]. (b) off by default [Mantine].
22. **Disabled:** (a) `disabled` mutes the indicator to the neutral tone and stops the pulse. It keeps the count and label, so the information isn't lost [none]. (b) `disabled` hides it [Mantine, Carbon, Spectrum].
23. **Size:** (a) `sm`, `md` and `lg` from GEO-954. A count is 16, 20 or 24px high with `min-width` equal to its height, pill-shaped and `tabular-nums`. A dot is 8, 10 or 12px. Density doesn't change the size [Spectrum, Ant, Mantine]. (b) also accept a number [Mantine].
24. **Forced colours:** (a) `forced-color-adjust: none` with `Canvas` and `CanvasText`, or a 1px `CanvasText` border, so dots and counts stay visible. Status shapes carry the meaning [Spectrum]. (b) rely on tokens alone, which fails because backgrounds are stripped.
25. **Generic positioning:** (a) no separate `Float`. Indicator with `content` covers it, and the positioning classes are shared internally with Avatar. (b) export a `Float` primitive [Chakra].
26. **Tabs counters:** (a) use Indicator's inline form (Primer model): `Tabs.Tab` gets a `count` that renders `<Indicator count>` after the text, with sr text " (12)" in the tab name. An overlay on a text tab looks wrong [Primer, Mantine `rightSection`]. (b) an overlay dot or count on the tab [none].
27. **Badge's inline `max`:** (a) keep Badge's `max` for numeric children, and share the formatting helper (`formatCount`) so both give the same "99+" [Badge decision 8]. (b) Badge renders Indicator inline for numbers.

## Exceptions (recommended not to build)

- **Digit-roll animation** [Ant ScrollNumber]: it needs a column per digit, which breaks with compact and locale formats ("1.2K", Arabic-Indic digits). Decision 20's pop covers the change cue.
- **Free colour strings** [Mantine, Ant]: against the no-free-colour rule. Tones and Y1 cover it.
- **`autoContrast`** [Mantine]: only needed with free colours.
- **`radius` prop** [Mantine]: counts are pills and dots are circles. Use className.
- **Native `title` tooltip** [Ant]: not keyboard or touch accessible, and duplicates the label.
- **Ribbon** [Ant]: already rejected for Badge. Card plus Badge composes it.
- **Throwing on 0 or negative values** [Spectrum]: `showZero` handles 0. Negatives are a dev warning, not a crash.
- **Restricting to one button kind and size** [Carbon]: Indicator works on any child.

## Stories and tests planned

**Stories** (each wrapped in `sm:max-w-md`):

- **Default:** an icon-only Button (with Tooltip, GEO-959) showing a count of 5 and the label "5 unread notifications".
- **States:** count, 0 hidden, 0 with `showZero`, "99+", compact "1.2K", dot, pulse, hidden, disabled, bordered and not bordered, plus every status shape.
- **Density:** compact, default and comfortable, to show the size stays fixed while the child changes.
- **Themes:** light, dark and high contrast, each showing every tone, the Y1 colours, every status, dot and count, all sizes, pulse, disabled and bordered.
- **Feature stories:** Positions (9, plus RTL), Offset, Overlap (Avatar circle vs square vs Card), Inline (Tabs and nav items), Formatting (en, de, ar, hi, compact), Content (icon, "New"), Transitions (buttons to add, remove and hide), Forced colours (emulated).

**Unit tests (Vitest):**

- `max`, `showZero`, compact and locale formatting, and the localised "+".
- The label gets the raw count. `aria-describedby` merges with any existing value on the child. The visible badge is `aria-hidden`, and the label goes when hidden.
- No live region unless `announce` is set, and none on first render.
- Inline sr text. A dev warning when there is no label.
- Logical position classes, `offset` variables and circular overlap.
- `disabled` mutes the tone and stops the pulse. The pulse has `motion-reduce:animate-none`.
- `render`, `data-slot`s and ref forwarding.

**E2E:** `pnpm verify indicator`, covering axe, duplicate ids, accessible names (the child keeps its name, and the description includes the count), no nested interactive elements, forced-colours emulation, RTL screenshots, and computed `transform` and `animation` under reduced motion.

## George's decisions (2026-11-21)

- **(a) on every decision**, as recommended.
- **Token approved:** `--sp-indicator-ring`. This is a shared token change.
- **#15:** accent is the default count colour, not danger.
- **#22:** when disabled, the indicator is muted (neutral, no pulse) and keeps its count. It is not hidden.

### Considered and rejected (approved by George, 2026-11-21)

- **Digit-roll animation** [Ant]: it breaks with compact numbers and locale digits; the count-change pop covers it.
- **Free colour strings** [Mantine, Ant]: no-free-colour rule.
- **`autoContrast`** [Mantine]: only needed with free colours.
- **`radius` prop** [Mantine]: counts are pills and dots are circles; className covers the rest.
- **Native `title` tooltip** [Ant]: it can't be reached by keyboard or touch.
- **Ribbon** [Ant]: already rejected for Badge.
- **Throwing on 0 or negative values** [Spectrum]: `showZero` handles 0, and negatives get a dev warning.
- **Restricting it to one button kind and size** [Carbon]: there's no need.

## Re-check before the build (2026-11-23)

The research above still stands. What changed in the repo since 2026-11-21:

- **The warning tone is unblocked.** `--sp-warning`, `--sp-warning-subtle` and `--sp-fg-on-warning` already exist in every theme. GEO-955 is Field's warning state, not the token, so Indicator doesn't wait for it.
- **The announcer exists.** `lib/announce.ts` shipped with Skeleton (GEO-963). The opt-in `announce` (decision 8) reuses it: one shared polite region, with repeats skipped.
- **`lib/delay.ts` doesn't apply.** Indicator has no "wait before showing" behaviour. A count is shown as soon as it's known.
- **The Y1 categorical palette is still not built.** It's planned with the GEO-939 Badge and Avatar work. The `color` prop for dots (decision 15) depends on it.
- **Avatar.Status, Badge's `max` and Tabs counters are unchanged.** Decisions 16, 26 and 27 describe how those components will use Indicator, which changes their own APIs.
- **Sizes don't need GEO-954.** That ticket is Input's sizes, and Indicator's sm/md/lg (16/20/24px counts, 8/10/12px dots) are its own.
