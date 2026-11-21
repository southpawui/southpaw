# Kbd — Change Log

## 2026-11-13 — Default variant is now `outline` (George, at sign-off)

- **What changed:** the default `variant` changed from `raised` to `outline`. `raised` (the key-cap bottom border) is still available. Stories, tests and RESEARCH.md are updated, and `outline` is listed first.
- **Why:** George's call at sign-off. Outline is quieter in menus, tooltips and buttons, where Kbd is mostly used. `raised` is there for prose or anywhere a physical-key look is wanted.

## 2026-11-13 — /improve fixes (after George's sign-off; George approved all)

### What changed

- **Group story fixed (a11y).** The icon example (`<CommandIcon />`, `<ArrowFatUpIcon />`) had no spoken name, so screen readers announced only "P". The icons are now `aria-hidden` with hidden "command" and "shift" text, and a comment explains the pattern.
- **JSDoc on `children`.** It now says that children render as-is: symbols and icons get no spoken name. Use `keys` or add hidden text. This is aimed at Tooltip (Lane 1) and Menu, which will build on Kbd.
- **Empty `keys` falls back to `children`.** `keys=""` or `keys="   "` used to produce an empty `<kbd data-slot="kbd-group">`.
- **`full` format can be copied.** Prose like "press Ctrl + K" now copies with the shortcut included. `condensed` keys (menus, buttons, tooltips) stay `select-none`. The hidden spoken text and the hidden "then" are always `select-none`, so a copy gives "Ctrl + K", not "Ctrlcontrol + Kk".
- **13 new tests (32 in total):**
  - platform detection from mocked `navigator` values (`platform`, `userAgentData.platform`, `userAgent`; Mac, iPhone, Windows, Linux);
  - Meta shows as "Win" on Windows, and an explicit `platform` overrides detection;
  - server rendering: `renderToString` gives `Ctrl+K`, `hydrateRoot` raises no recoverable errors, and the client then shows `⌘K`;
  - `ref` and `render` reach the outer group on multi-cap output;
  - the empty-`keys` fallback, and copy behaviour by format.

### Why

`/improve` ran because Kbd is a new component that Tooltip and Menu will depend on. These were the four gaps found (the fourth was missing tests), plus one suggestion (copying in prose). The API did not change.

## 2026-11-13 — Accessibility review fixes (George spotted axe inconclusives)

### What changed

- **One glyph span per key cap.** Visible glyphs are now one `aria-hidden` string (`⌘⇧P`, `Ctrl+Shift+P`) with one hidden spoken phrase ("command shift p"). Before, each key had its own span, so ⌘ sat alone in an element.
- **Line-height bug fixed.** `cn()` (tailwind-merge) was dropping `leading-none` because `text-xs` also sets line-height in Tailwind v4. Each glyph box was getting a 16px line-height inside a 13px compact cap. Sizes now use `text-xs/none`, `text-sm/none` and `text-[0.6875rem]/none`.
- **`relative` on the cap**, so the hidden spoken text is positioned inside the key instead of against some distant ancestor.
- Removed the `capGap` classes, which are no longer needed with one visible child per cap.

### Why

- George saw colour-contrast inconclusives in the Storybook a11y panel. The first explanation (semi-transparent backgrounds) was wrong. axe's actual reasons were `nonBmp` (symbol-only content) and, in compact density, `elmPartiallyObscured`.
- Total went from 122 inconclusive nodes to 18.

### Remaining inconclusives (accepted, needs George's call on compact)

- **`nonBmp` (13 nodes): accepted by George, 2026-11-13.** These are caps with only symbols, like ⌘ alone, ⌘⌫ or ⏎. axe never runs text contrast on characters from the symbol blocks (arrows, Misc Technical) and leaves them for a human to check; this is how axe works by design. They have been checked by hand: the glyphs use the same colour as the key's text, which passes AA (lowest 5.5:1, measured in Playwright). Any story with a symbol-only cap will show one colour-contrast inconclusive in the Storybook a11y panel. This is expected.
  - _Considered and rejected:_ drawing the Apple symbols as inline SVGs owned by Kbd. That would clear the inconclusives and avoid fallback-font glyphs (Atkinson Hyperlegible has no ⌘/⌥/⏎), but it means maintaining about 13 hand-drawn icons. George chose to accept the axe limitation instead.
- **`elmPartiallyObscured` / `shortTextContent` (5 nodes, compact density only): accepted by George, 2026-11-13.** The font reserves a 16px box for 12px text, and a compact md cap is 16px including its 3px of borders. The visible letters fit (glyph boxes measured at 11/12/14px inside caps of 11/13/17px), nothing clips, and default and comfortable are clean.
  - _Considered and rejected:_ raising the compact minimum (md 16 → 18px, sm 14 → 16px) to clear the flag. Compact md would then be almost the default size (20px), so density would barely change Kbd. Keeping compact keys at half the control height matches the other densities and the dense surfaces Kbd is used on (shadcn is 20px with no density modes; Primer has `small`). Known risk: accented capitals (É, Ñ) at compact may touch the cap's border. Not tested yet; revisit if it comes up.

## 2026-11-13 — New component (GEO-940)

### What changed

- New `Kbd` and `Kbd.Group` components. Research is in RESEARCH.md (all 9 libraries).
- `Kbd` renders `<kbd>` through Base UI `useRender`, so it has a `render` prop like other Southpaw components. Base UI has no Kbd primitive.
- `keys` string API (from Primer): `+` joins a chord, a space separates a sequence, and `Mod` shows ⌘ on Apple and Ctrl elsewhere. Aliases are accepted (`cmd`, `option`, `esc`, `ArrowUp`, `plus`, and so on). A literal plus is written `Mod++` or `Plus`.
- `format`: `condensed` (one key cap per step, symbols) or `full` (one cap per key, spelled out, joined with a visible `+`).
- `platform`: `auto` (default), `apple`, `windows` or `other`. `auto` uses `useSyncExternalStore` and renders `other` on the server, so there is no hydration mismatch.
- `variant`: `outline` (default; changed from `raised` at sign-off, see the entry above), `raised`, `subtle` or `plain` (Chakra's set).
- `size`: `sm`, `md` (default) or `lg`. Height is half the matching `--sp-control-height-*` token, so it follows density: sm 14/16/20, md 16/20/24, lg 20/24/28px (compact/default/comfortable).
- `Kbd.Group` renders an outer `<kbd>` around inner `<kbd>`s, which is the HTML spec's markup for a key combination. It passes `variant` and `size` to its keys through context; a prop on a key wins. Optional `separator`, hidden from screen readers.
- Data slots: `kbd`, `kbd-group`, `kbd-glyph`, `kbd-spoken`, `kbd-separator`. `data-variant` and `data-size` are set on each cap.
- 18 unit tests. 8 stories: Default, Variants, Keys, Group, InContext, States, Density, Themes.
- No shared files were touched. The package exports `./*` by glob.

### Why

- **Shared component before Menu, ContextMenu and Menubar (GEO-925/926/927).** Each one planned its own shortcut styling, and the Input story already had a hand-written `<kbd>`. The coordinating thread will replace that one after the restack, since it lives outside this lane.
- **Spoken key names.** Each visible glyph is `aria-hidden` and has a visually hidden name next to it ("command", "shift", "return"). Without this, screen readers read ⌘ as "place of interest sign" or skip it. Only Primer does this.
- **Hidden "then" between sequence steps.** Keys within a chord are announced with spaces, so a sequence needs another word between steps. In `full` format "then" is visible, since that format is meant for prose.
- **`dir="ltr"` on combinations.** Stops ⌘K becoming K⌘ in right-to-left layouts (React Aria, Mantine).
- **Colours from currentColor** (`border-current/20`, `bg-current/5`, etc.). A key adapts to any surface (dark tooltip, solid brand or danger button, success or danger text) with no props and no dependency on other components' slot names. This replaces shadcn's Tooltip special case and Primer's `onEmphasis`/`onPrimary` variants.
- **One cap per chord in condensed format** (⌘⇧P), as Primer and macOS menus do. Chords and sequences then look different: a sequence gets one cap per step.
- **Words off Apple, joined with `+`.** Windows and Linux show `Ctrl+Shift+P`, as VS Code and Windows menus do. The `+` is `aria-hidden`.
- **Explicit radii (3/4/6px).** The theme's `rounded-sm` is 8px, which made keys look like pills.
- **`pointer-events: none` and `select-none`** (shadcn). Kbd is display-only and must not catch clicks meant for its parent button.

### Verification

- `pnpm verify kbd`: tests, a11y, duplicate IDs, accessible names, DOM redundancy and screenshots for all 8 stories.
- axe reports colour-contrast as "inconclusive" because the key backgrounds are semi-transparent. Checked by hand in Playwright, layering each key's background over its first solid parent: every non-disabled key passes AA (lowest 5.5:1). Keys below AAA (7:1) only appear inside brand or danger buttons and success or danger text, where the parent's own colour sets the limit.
- Computed styles checked: heights per density, 2px raised bottom border, pointer-events and user-select.

### Considered and rejected

- **`color` prop** (Chakra `colorPalette`). George agreed it isn't needed: keys take their colour from the text around them, so a key inside a danger or success section already matches it.
- **5 sizes** (Mantine xs–xl). George approved sm/md/lg to match Badge. Density scaling covers the rest.
- **`aria-keyshortcuts` on Kbd.** It belongs on the element that does the action (a menu item or button), not on the hint. Menu (GEO-925) will set it on items. React Spectrum links the item to its shortcut with `aria-describedby`; this will be decided in GEO-925.
- **Sorting modifiers into platform order** (⌃⌥⇧⌘). Keys render in the order the author writes them. Silent reordering is surprising and none of the 9 libraries does it.
- **Primer's ⌃ for `Mod` off Apple.** Windows and Linux users know "Ctrl" better than ⌃.
- **Valid, error and disabled states.** Kbd is not interactive. The States story shows it in default and muted text, inside disabled buttons (it fades with the button), and in success and danger contexts.
- **Putting Kbd inside a Button as a plain child.** Button only adds a gap when it has an `icon`, so the key touched the label. Stories use Button's trailing slot (`icon={<Kbd … />} iconPosition="end"`), as Primer recommends. Kbd stays free of Button-specific styles.
