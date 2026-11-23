# DescriptionList — Competitive Research

- **2026-11-21:** first pass over all 9 libraries, which settled the scope. GOV.UK's Summary list is folded in as an optional actions column, and SummaryCard is a composition. George took the recommendations; see GEO-966.
- **2026-11-23:** detail pass. It covers GOV.UK markup, layout and card, Chakra DataList, Ant Descriptions, Spectrum LabeledValue, screen-reader support, and the remaining libraries.

## Who has what

| Library        | Component                                     | Semantics                                     | Notes                                                                                                                                                                                                                   |
| -------------- | --------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GOV.UK         | Summary list + Summary card                   | `dl > div.row > dt + dd + dd(actions)`        | Key, value and actions columns. Hidden context on actions. "Not provided" / "Enter X" link for missing values. Per-list and per-row borders. Card with title, actions and headingLevel                                  |
| Chakra v3      | DataList (Root, Item, ItemLabel, ItemValue)   | `dl > div > dt + dd`                          | orientation vertical/horizontal (default vertical), size sm/md/lg, variant subtle/bold, InfoTip next to the label, dividers via `divideY`. Flex layout, label `min-width: 120px`                                        |
| Ant Design     | Descriptions                                  | `<table>` (`th`/`td` when bordered)           | `column` responsive object (xs 1, sm 2, md+ 3, xxxl 4), layout horizontal/vertical, bordered, size, title + extra, colon, `span` incl. `'filled'`, items API. An empty value is a blank cell                            |
| React Spectrum | LabeledValue (v3, S2)                         | `div > span + span` (single pair, not a `dl`) | Intl formatting: number/currency/unit, date/time types, ranges, `string[]` via ListFormat. labelPosition top/side, labelAlign start/end (flips in RTL), contextualHelp, S2 size S–XL. `isRequired` deliberately omitted |
| Carbon         | StructuredList                                | `div role="table"`                            | "Terms and definitions" use, default and selectable variants, condensed, hang/flush                                                                                                                                     |
| Mantine        | Table `variant="vertical"`                    | `<table>`                                     | Key–value rows as a table                                                                                                                                                                                               |
| shadcn         | — (Item is a media-object row, not key–value) | —                                             | —                                                                                                                                                                                                                       |
| MUI            | — (List secondary text)                       | —                                             | —                                                                                                                                                                                                                       |
| Primer         | —                                             | —                                             | Nothing found on primer.style                                                                                                                                                                                           |

## GOV.UK specifics (govuk-frontend template + SCSS)

- **Rows without actions:**
  - When any row has actions, a row without them gets `--no-actions`. It renders no actions `dd`, and an `::after` cell keeps the columns and borders lined up.
- **Several actions:**
  - One action is a bare link.
  - Two or more become `ul > li > a`, with 1px dividers between them.
  - A focused link gets `isolation: isolate`, so wrapped links can't cover its focus ring.
- **Hidden context:**
  - Row actions read `Change<span hidden> name</span>`.
  - Inside a card, the card title is added: `Change … name (Card title)`. This was added in v5.0.
  - The aim is to make every link unique out of context.
- **Borders:**
  - `--no-border` on the list or on a row. Use it only on lists without actions.
  - Guidance: borders help zoom and magnifier users link a row to its action.
- **Missing information:**
  - Put an "Enter X" link in the value cell, with no Change link.
  - Check answers says to show "Not provided" for skipped optional questions, never a blank.
- **Multi-line values:** `<br>` or several `<p>`, with spacing between paragraphs and none after the last.
- **Layout:**
  - From tablet up: a table layout, key 30% (bold), value about 50%, actions 20% (right-aligned).
  - Below tablet everything stacks: key, value, then actions underneath and left-aligned.
  - `overflow-wrap: break-word` keeps long URLs from overflowing.
- **Card:**
  - `div.card > div.title-wrapper (h{level} + actions) + div.content > dl`. `headingLevel` defaults to 2.
  - The header has a tinted background, plus a transparent border so it stays separate in forced colours. From tablet up it's flex with `space-between`.
  - Card actions get the card title as hidden context.
  - Guidance: use cards for several lists about the same kind of thing, or for actions that apply to the whole group. Keep to 2–3 actions of about 2 words each. Not for tabular data.

## Semantics and screen readers

- **HTML spec:**
  - `dl` content is groups of one or more `dt` followed by one or more `dd`. Each group may be wrapped in a `div`, and the wrapper doesn't change the semantics.
  - Don't mix wrapped and bare groups.
  - Several `dd`s for one `dt` are alternative values.
  - GOV.UK's actions `dd` is valid markup, but it's announced as another description of the key.
- **Support** (Adrian Roselli, 2025: "generally good, VoiceOver still the outlier"):

  | Screen reader       | Announcement                                       |
  | ------------------- | -------------------------------------------------- |
  | NVDA + Firefox      | "list with N items" (counts dt and dd)             |
  | JAWS + Chrome       | "definition list with N items"                     |
  | VoiceOver macOS     | announces on read-all, not with the virtual cursor |
  | iPadOS and TalkBack | no list                                            |
  | Narrator            | doesn't announce a list                            |

  `div` wrappers and multiple `dd`s don't change announcements. Don't depend on item counts.

- **CSS:**
  - Nothing current says `display: grid` on a `dl` strips its semantics.
  - `display: contents` on `dt`/`dd` is the risky choice; Safari has a history of dropping semantics because of display properties.
  - Safe layout: a grid on the `dl`, with the `div` rows using `subgrid` (or `contents` on the **div** only). Test in Safari and VoiceOver.

## Feature list (in scope if at least one library has it)

| Feature                                                         | Libraries                                     |
| --------------------------------------------------------------- | --------------------------------------------- |
| Orientation, side vs top label                                  | Chakra, Ant, Spectrum                         |
| Responsive orientation                                          | Chakra (inferred), GOV.UK stacks below tablet |
| Responsive columns, item span, fill the rest of the row         | Ant                                           |
| Fixed aligned column widths                                     | GOV.UK                                        |
| Actions column, several actions, automatic no-actions alignment | GOV.UK                                        |
| Automatic hidden context (key + card title)                     | GOV.UK                                        |
| Header title + actions                                          | Ant title/extra, GOV.UK card                  |
| Heading level                                                   | GOV.UK                                        |
| Info tip / contextual help next to the label                    | Chakra, Spectrum                              |
| Intl value formatting                                           | Spectrum                                      |
| Missing value: "Not provided" text, or an "Enter X" link        | GOV.UK                                        |
| Multi-line values                                               | GOV.UK                                        |
| Wrapping long values                                            | GOV.UK                                        |
| Borders per list and per row                                    | GOV.UK, Ant                                   |
| Dividers                                                        | Chakra                                        |
| Label weight variants                                           | Chakra                                        |
| Sizes / density                                                 | Chakra, Ant, Spectrum                         |
| Label alignment start/end, RTL                                  | Spectrum                                      |
| Per-part styling hooks                                          | Ant                                           |

**Not built in anywhere** (our own design, approved in GEO-966): copyable values, per-item loading (Skeleton), striped rows.

## Decisions (George, 2026-11-23)

1. Copy: an internal copy button now, plus a public CopyButton ticket (GEO-978).
2. `loading` (Skeleton) waits until after the restack.
3. Layout: a grid on the `dl`, with subgrid rows.
4. Hidden context on actions is automatic (term, plus the card title).
5. Rows without actions keep the column empty. Also an option to hide rows with no value: `hideEmpty` (Root or Item).
6. Empty values show "Not provided" (translatable).
7. Per-Item `divider={false}`.
8. Multi-line values and several values per term.
9. `headingLevel` (default 2); card actions take the card title.
10. Label style: `muted` by default, `strong` as the variant.
11. Sizes sm/md/lg; logical `labelAlign`; `span="full"`.

## Considered and rejected (George approved these exceptions, 2026-11-21)

- **Carbon's selectable rows:** a description list isn't a selection control.
- **Rendering as a table** (Ant, Mantine, Carbon): wrong semantics for key–value content. Use Table for tabular data.
- **Ant's `colon` default:** labels don't get a colon.

## Sources

- GOV.UK: https://design-system.service.gov.uk/components/summary-list/ · https://design-system.service.gov.uk/patterns/check-answers/ · govuk-frontend `components/summary-list/template.njk` and `_mixin.scss`
- Chakra: https://chakra-ui.com/docs/components/data-list · chakra-ui `components/data-list/data-list.ts`, `theme/recipes/data-list.ts`
- Ant: https://ant.design/components/descriptions · ant-design `components/descriptions/*`
- Spectrum: https://react-spectrum.adobe.com/react-spectrum/LabeledValue.html · https://react-spectrum.adobe.com/LabeledValue · `@react-spectrum/s2/src/LabeledValue.tsx`
- Carbon: https://carbondesignsystem.com/components/structured-list/usage/
- Mantine: https://mantine.dev/core/table/
- shadcn: https://ui.shadcn.com/docs/components/item
- HTML spec: https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element
- Screen readers: https://adrianroselli.com/2025/01/updated-brief-note-on-description-list-support.html · https://adrianroselli.com/2022/12/brief-note-on-description-list-support.html · https://adrianroselli.com/2022/07/its-mid-2022-and-browsers-mostly-safari-still-break-accessibility-via-display-properties.html
- Not checked directly: the MUI and Primer repos (nothing found on their docs sites).
