# LoadingOverlay — Change Log

## 2026-11-23 — Sign-off (GEO-965)

George signed off LoadingOverlay after the ToggleGroup fix to the useTransition story. The overlay covering the card border is the intended default; George didn't ask for a change.

**/improve findings, both fixed with tests**

1. **The fading backdrop swallowed clicks.** For about 250ms after loading ended, the content was no longer inert, but the fading backdrop still sat over it and caught clicks. The closing backdrop now has `pointer-events: none`.
2. **The Content fallback left a permanent `tabindex`.** When focus fell back to the Content wrapper itself (nothing focusable left), it got `tabindex="-1"` and kept it, so the wrapper stayed focusable by click. The attribute is now removed on the first blur.

**Checked and kept as built:** loading turning back on during `minDuration` keeps it shown with no flicker; focus outside the region is never moved; `aria-busy` lasts through the fade-out; fullscreen focus is restored by Base UI.

**Checks:** 21 tests for LoadingOverlay, and the full suite passes.

## 2026-11-23 — Implementation (GEO-965)

Built to George's decisions of 2026-11-21: option (a) on all 22, the `--sp-backdrop-loading` token, the Spinner keeping its slow spin under reduced motion (#14), and 4 exceptions rejected. On 2026-11-23 he answered "LoadingOverlay: all a" to three follow-ups:

1. **Today's Spinner, decorative, at size `lg`.** `role="presentation"` and `aria-hidden`; Spinner spreads its props after `role`, so the override works. Spinner isn't changed.
   - **Switch at GEO-939's Spinner rebuild:** use `srLabel={null}` instead of the role override, and `size="xl"` (`lg` in compact density), per decision 18's exception.
2. **Focus goes to the panel** (`tabIndex=-1`, `role="group"`, named by the label). When there's an action, it goes to the action's first control instead. Focus is restored when the overlay closes.
3. **Shared CSS approved:** `--sp-backdrop-loading` and a fade-in keyframe.

**Shared, new**

- **Token:** `--sp-backdrop-loading` (`bg-backdrop-loading`) is `surface-base` at 75% (light and dark) or 92% (high contrast), and Canvas in forced colours. Dialog can swap its hard-coded `bg-black/50` for it later.
- **Keyframe:** `sp-loading-overlay-in` (opacity) runs on `--sp-duration-fast`, so it's instant under reduced motion.

**Reused:** `lib/delay` (decision 6's API) and `lib/announce` with L4's `force` option, so a second reload of the same region is still heard. Announce itself isn't changed.

**LoadingOverlay**

- **Structure:** Root (`relative isolate`, with `render`) contains Content (`isolate`, `aria-busy`, `inert`) and the backdrop beside it. The overlay is outside the busy subtree, so its text and Cancel stay reachable.
- **Timing:**
  - `aria-busy` is set as soon as `loading` turns on.
  - After `delay` (default `"short"`, 300ms) come `inert`, the backdrop and the start announcement. If loading ends first, nothing shows and nothing is said.
  - Once shown, it stays for `minDuration` (default 500ms), then fades out over `--sp-duration-exit` and unmounts.
- **Focus (region mode):**
  - Before `inert` lands (it would drop focus to `<body>`), focus inside Content is saved and moved to the action's first control, else the panel.
  - When the overlay closes, focus is restored to the saved element if it's still connected and focusable. If not, it goes to Content's first control, and failing that to Content itself.
  - Focus is only restored if it's still on the overlay or lost; if the user has moved on, it's left alone.
  - Focus outside the region is never moved.
- **Announcements:** `label` when shown, and `doneLabel` (default none) when finished, if it was shown. Both use `force`. No other live region: the Spinner is decorative.
- **The panel:** surface-overlay with a border and shadow. It shows the Spinner, or Progress when `value` is set (0–100 determinate, or `null` indeterminate, named by the label), plus the label, `description` and `action`.
- **Tall regions:** the panel's wrapper is sticky and at most `100svh` tall, so the panel stays in view.
- **Backdrop:**
  - `z-[1]` inside the `isolate` Root, so a sticky `thead` inside Content stays under it, and it never rises above page-level layers.
  - `blur` adds `backdrop-blur-sm` where supported, and none under `prefers-reduced-transparency`.
  - Forced colours: the backdrop becomes Canvas, and the panel keeps a CanvasText border.
- **`fullscreen`:** a Base UI modal Dialog. It's portalled and fixed, makes the rest of the page inert, locks scroll, and moves and restores focus. Escape and outside clicks do nothing, and the Dialog is named by the label. Content keeps `aria-busy`, and the Dialog handles inerting the page.

**Tests:** 19 in `LoadingOverlay.test.tsx` at review (21 after sign-off), with fake timers:

- idle;
- busy at once, but inert, backdrop and announcement only after the delay;
- nothing if loading ends within the delay;
- `minDuration`, the fade-out and unmount;
- the overlay outside the content;
- a decorative Spinner with no status of its own;
- focus moving to the panel and back, to Cancel, left alone if it was outside, and the fallback when the saved element is gone;
- start and finish announcements, a forced repeat, and no done message without `doneLabel`;
- description and action, and `value` giving Progress;
- blur classes;
- fullscreen: a named dialog that ignores Escape, with Content not inert;
- `render`/ref and SSR.

Note: with fake timers, the announcer's write is scheduled when `act` flushes effects, so the tests give an announcement its own tick. That's a test timing detail, not a bug.

**Stories:** Default (Reload inside a Card), States, Delay and minimum duration, Tall region with sticky header, Fullscreen, With useTransition, Skeleton or overlay?, Density and Themes. Themes shows every loading state, with and without blur, in light, dark and high contrast.

**Checked in Chromium (Playwright)**

- **Region focus,** sampled every 50ms through a reload: Reload, then the panel, then Reload. It never landed on `<body>`.
- **Forced colours with reduced motion:** the panel has a 1px CanvasText border, and the backdrop becomes Canvas. Animation and transition are both 0s.
- **Tall region:** after scrolling, the element over the sticky `thead` is the backdrop, and the panel stays inside the viewport.
- **Fullscreen:**
  - Focus moves to the panel, and the dialog is named "Submitting your application".
  - Escape leaves it open.
  - Base UI marks `#storybook-root` `aria-hidden` and `data-base-ui-inert`, so Tab stays in the panel and the page button is out of the accessibility tree.
  - Focus returns to "Submit application" afterwards.

**Note on the first screenshots:** the Storybook on 6007 had been running since before this branch, so it hadn't generated the new token's class, the keyframe, or the panel padding. The backdrop looked missing and the panel looked squashed. Restarting Storybook fixed it; nothing in the code changed. After a token change, restart Storybook before judging screenshots.

**Review fix (coordinator): the active filter in the useTransition story**

- The "All" and "Returned" filters were plain outline Buttons, so neither showed which filter was active (`aria-pressed` was null).
- They're now a single-selection `ToggleGroup` named "Filter orders", with "All" pressed by default. The value is controlled, and an empty selection is ignored, so pressing the active filter keeps it on.
- Checked in Chromium:
  - before: All `aria-pressed=true`, Returned false;
  - after clicking Returned: All false, Returned true, and the overlay shows "Filtering orders" over the old rows;
  - then one row (1039, Returned);
  - re-clicking Returned keeps it pressed.
- **Verify inconclusive (pre-existing, from Toggle):** axe reports `color-contrast` "background could not be determined due to a pseudo element" on the two toggle labels. ToggleGroup's own Default story gets the same item on all three of its labels. Measured directly, the labels are `rgb(11, 26, 51)` on white, 17.4:1, and stay well above 4.5:1 on the pressed state's light grey. It isn't a contrast failure.
