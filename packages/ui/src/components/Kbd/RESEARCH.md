# Kbd — Competitive Research

Researched: 2026-11-13 (GEO-940). New component, no previous version.

Base UI has no Kbd primitive. The closest thing in the Base UI ecosystem is `useRender`, which gives us the `render` prop every other Southpaw component exposes.

## Who has what

| Library  | Component                                                                       | Element    | Notes                                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| shadcn   | `Kbd`, `KbdGroup`                                                               | `kbd`      | Only `className`. Auto-restyles inside Tooltip via `[[data-slot=tooltip-content]_&]`. Icon sizing.                                                                                               |
| Mantine  | `Kbd`                                                                           | `kbd`      | `size` xs–xl. Mono, bold, 3px bottom border ("raised"). Examples wrap combos in `dir="ltr"`.                                                                                                     |
| Chakra   | `Kbd`, `KbdGroup` (v3)                                                          | `kbd`      | `variant` raised/outline/subtle/plain, `size` sm/md/lg, `colorPalette`, `as`/`asChild`. Group sets size + variant for children.                                                                  |
| MUI      | None. Menu uses `Typography body2 text.secondary`. Menubar `MenuItem hint="⌘X"` | `p`/`span` | No semantic `kbd`. Shortcut is plain secondary text.                                                                                                                                             |
| Ant      | `Typography.Text keyboard`                                                      | `kbd`      | Boolean prop wraps text in `<kbd>`. Mono font, raised bottom border.                                                                                                                             |
| GOV.UK   | None                                                                            | —          | No component and no `kbd` styling. Uses `<kbd>Shift</kbd>` in prose only (Exit This Page docs).                                                                                                  |
| Carbon   | None. `MenuItem shortcut="⌘X"`                                                  | `div`      | Hint only; does not register the shortcut. No `aria-keyshortcuts`.                                                                                                                               |
| Spectrum | `Keyboard` (RSP), `Keyboard` (RAC)                                              | `kbd`      | Unstyled; parent (Menu item) styles and positions it via slot/context. RAC forces `dir="ltr"`.                                                                                                   |
| Primer   | `KeybindingHint`                                                                | `kbd`      | `keys="Mod+Shift+P"` string API. Platform-aware `Mod`. Chords (`+`) vs sequences (space). `format` condensed/full. `variant` normal/onEmphasis/onPrimary. `size` normal/small. Accessible names. |

## Feature comparison

| Feature                                    | shadcn       | Mantine | Chakra  | MUI | Ant | GOV.UK | Carbon | Spectrum      | Primer                         | Proposed           |
| ------------------------------------------ | ------------ | ------- | ------- | --- | --- | ------ | ------ | ------------- | ------------------------------ | ------------------ |
| Semantic `<kbd>`                           | Yes          | Yes     | Yes     | No  | Yes | N/A    | No     | Yes           | Yes                            | Yes                |
| Group / combination wrapper                | Yes          | No      | Yes     | No  | No  | N/A    | No     | No            | Yes                            | Yes                |
| Visible `+` separator option               | No           | Example | Example | No  | No  | N/A    | No     | No            | Yes (`full`)                   | Yes                |
| Sizes                                      | No           | 5       | 3       | No  | No  | N/A    | No     | No            | 2                              | Yes                |
| Visual variants                            | No           | No      | 4       | No  | No  | N/A    | No     | No            | 3 (surface)                    | Yes                |
| Colour palette                             | No           | No      | Yes     | No  | No  | N/A    | No     | No            | No                             | Yes (see Q2)       |
| Adapts to dark/emphasis surfaces           | Tooltip only | No      | No      | No  | No  | N/A    | No     | Parent-styled | Yes (`onEmphasis`/`onPrimary`) | Yes (currentColor) |
| Platform-aware modifier (`Mod` → ⌘ / Ctrl) | No           | No      | No      | No  | No  | N/A    | No     | No            | Yes                            | Yes                |
| `keys` string API (chord + sequence)       | No           | No      | No      | No  | No  | N/A    | No     | No            | Yes                            | Yes                |
| Screen-reader names (“command”, not “⌘”)   | No           | No      | No      | No  | No  | N/A    | No     | No            | Yes                            | Yes                |
| Sequence announced with “then”             | No           | No      | No      | No  | No  | N/A    | No     | No            | Yes                            | Yes                |
| Forced LTR for combos                      | No           | Example | No      | No  | No  | N/A    | No     | Yes           | No                             | Yes                |
| Icon children sized automatically          | Yes          | No      | No      | No  | No  | N/A    | No     | No            | No                             | Yes                |
| Polymorphic (`as` / `asChild` / `render`)  | No           | No      | Yes     | No  | No  | N/A    | No     | No            | No                             | Yes (`render`)     |
| Non-interactive (`pointer-events: none`)   | Yes          | No      | No      | No  | No  | N/A    | No     | No            | No                             | Yes                |

## Proposed API

```tsx
// Single key
<Kbd>Esc</Kbd>

// Manual combination
<Kbd.Group>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</Kbd.Group>

// String API, platform-aware (Primer model)
<Kbd keys="Mod+K" />            // ⌘ K on Apple, Ctrl K elsewhere
<Kbd keys="Mod+Shift+P" format="full" />  // Ctrl + Shift + P
<Kbd keys="g i" />              // sequence: G, then I
```

| Prop       | Values                                       | Default     | Notes                                                                                                                                    |
| ---------- | -------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`     | string                                       | —           | `+` joins a chord, space separates a sequence. `Mod` = ⌘ on Apple, Ctrl elsewhere. When set, renders a group of keys.                    |
| `format`   | `condensed` \| `full`                        | `condensed` | `condensed`: ⌘ ⇧ P glyphs, no separator (menus, tooltips). `full`: Ctrl + Shift + P words (prose).                                       |
| `platform` | `auto` \| `apple` \| `windows` \| `other`    | `auto`      | Override for docs and tests. `auto` is SSR-safe (renders `other` on the server, then updates).                                           |
| `variant`  | `outline` \| `raised` \| `subtle` \| `plain` | `outline`   | Chakra's set. `raised` = thicker bottom border (Mantine, Chakra, Ant). Default changed from `raised` to `outline` by George at sign-off. |
| `size`     | `sm` \| `md` \| `lg`                         | `md`        | Scales with `data-density`. See Q1.                                                                                                      |
| `render`   | element / function                           | —           | Base UI `useRender`, same as other Southpaw components.                                                                                  |

`Kbd.Group` takes `variant`, `size` and `separator` (e.g. `"+"`, `"then"`), and passes `variant` + `size` to its keys through context (Chakra). It renders an outer `<kbd>` around inner `<kbd>`s, which is the HTML spec's markup for a key combination.

### Accessibility

- Each glyph (⌘, ⇧, ⌥, ⏎) is `aria-hidden`, with a visually hidden spoken name next to it ("command", "shift", "option", "enter"). Without this, screen readers read "⌘" as "place of interest sign" or skip it.
- Sequences put a visually hidden "then" between chords.
- Visible `+` separators are `aria-hidden` (Primer: keeps announcements short).
- `dir="ltr"` on groups, so ⌘K doesn't flip to K⌘ in RTL layouts.
- Kbd is display-only. It does not register shortcuts (Carbon and Primer both say this). `aria-keyshortcuts` belongs on the actionable element, so Menu (GEO-925) will set it on the item, not on Kbd.
- Raised border keeps keys distinguishable for low-vision users. Flattening borders and padding makes keys harder to spot.

### Surface adaptation

shadcn special-cases Tooltip and Primer needs `onEmphasis`/`onPrimary` props. Instead, all variants build border and background from `currentColor` mixed with transparency, so a Kbd inside a dark Tooltip, a solid brand Button or a danger Toast adapts on its own, with no props and no dependency on other components' `data-slot` names.

## Sources

- [shadcn Kbd](https://ui.shadcn.com/docs/components/kbd) and [source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/kbd.tsx)
- [Mantine Kbd](https://mantine.dev/core/kbd/) and [CSS](https://github.com/mantinedev/mantine/blob/master/packages/@mantine/core/src/components/Kbd/Kbd.module.css)
- [Chakra Kbd](https://chakra-ui.com/docs/components/kbd) and [recipe](https://github.com/chakra-ui/chakra-ui/blob/main/packages/react/src/theme/recipes/kbd.ts)
- [MUI Menu IconMenu demo](https://github.com/mui/material-ui/blob/master/docs/data/material/components/menus/demos/icon/IconMenu.tsx), [MUI Menubar shortcut hints](https://github.com/mui/material-ui/blob/master/docs/data/material/components/menubar/demos/shortcut-hints/ShortcutHintsMenubar.tsx)
- [Ant Design Typography](https://ant.design/components/typography) (`keyboard` prop; `components/typography/Base/index.tsx` wraps in `kbd`)
- GOV.UK: no Kbd component; `<kbd>` only in [Exit This Page](https://design-system.service.gov.uk/components/exit-this-page/) docs
- [Carbon MenuItem source](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Menu/MenuItem.tsx) (`shortcut` prop)
- [React Spectrum Keyboard](https://react-spectrum.adobe.com/react-spectrum/Keyboard.html), [RAC Keyboard source](https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Keyboard.tsx)
- [Primer KeybindingHint](https://primer.style/product/components/keybinding-hint/) and [source](https://github.com/primer/react/tree/main/packages/react/src/KeybindingHint)
- [MDN `<kbd>`](https://developer.mozilla.org/docs/Web/HTML/Element/kbd) (nested `kbd` for combinations)
