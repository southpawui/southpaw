# AlertDialog — Competitive Research

Researched: 2026-11-08, updated 2026-11-11

## Feature comparison

| Feature                  | shadcn | Mantine | Chakra | MUI | Ant | GOV.UK | Carbon | Spectrum | Primer | Ours |
| ------------------------ | ------ | ------- | ------ | --- | --- | ------ | ------ | -------- | ------ | ---- |
| No backdrop dismiss      | Yes    | Yes     | Yes    | Yes | Yes | Yes    | Yes    | Yes      | Yes    | Yes  |
| Destructive variant      | Yes    | No      | Yes    | No  | No  | No     | Yes    | Yes      | Yes    | Yes  |
| Focus on cancel button   | Yes    | Yes     | Yes    | No  | Yes | Yes    | Yes    | Yes      | Yes    | Yes  |
| Cancel + Confirm actions | Yes    | Yes     | Yes    | Yes | Yes | Yes    | Yes    | Yes      | Yes    | Yes  |
| Animation                | Yes    | Yes     | Yes    | Yes | Yes | No     | Yes    | Yes      | No     | Yes  |
| Header/Footer structure  | Yes    | Yes     | Yes    | Yes | Yes | No     | Yes    | Yes      | Yes    | Yes  |
| Icon support             | No     | No      | No     | No  | No  | No     | No     | No       | No     | Yes  |

## Features added

- **Header/Footer** structure matching Dialog pattern
- **Icon composition** in Header (warning, trash, shield icons via Phosphor)
- **Responsive footer** — buttons stack full-width on mobile
- **Entry/exit animation** — scale + opacity with motion tokens

## Accessibility

- `role="alertdialog"` (NOT `role="dialog"`)
- Cannot be dismissed via backdrop click or Escape (per WAI-ARIA spec)
- Focus trapped within dialog
- First focusable element receives focus (cancel button in desktop layout)
- `aria-labelledby` + `aria-describedby` required

## Ant Design additions

- `Modal.confirm()` static method with promise-based callbacks
- `autoFocusButton` prop for controlling initial focus

## GOV.UK additions

- Prefers confirmation pages over modals for destructive actions
- Conservative approach — data safety over convenience

## Primer additions

- `ConfirmationDialog` with render props (renderHeader, renderBody, renderFooter)
- Footer buttons with type variants (default, danger, primary)

## Sources

- [WAI-ARIA AlertDialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)
- [shadcn AlertDialog](https://ui.shadcn.com/docs/components/alert-dialog)
- [Base UI AlertDialog](https://base-ui.com/react/components/alert-dialog)
- [Ant Design Modal.confirm](https://ant.design/components/modal)
- [Primer ConfirmationDialog](https://primer.style/product/components/dialog)
