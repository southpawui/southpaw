# Dialog — Competitive Research

Researched: 2026-11-08, updated 2026-11-11

## Feature comparison

| Feature               | shadcn | Mantine | Chakra | MUI | Ant | GOV.UK | Carbon | Spectrum | Primer | Ours |
| --------------------- | ------ | ------- | ------ | --- | --- | ------ | ------ | -------- | ------ | ---- |
| Focus trap            | Yes    | Yes     | Yes    | Yes | Yes | Yes    | Yes    | Yes      | Yes    | Yes  |
| Backdrop click close  | Yes    | Yes     | Yes    | Yes | Yes | No     | Yes    | Yes      | Yes    | Yes  |
| Escape to close       | Yes    | Yes     | Yes    | Yes | Yes | Yes    | Yes    | Yes      | Yes    | Yes  |
| Size variants         | No     | Yes     | Yes    | Yes | Yes | No     | Yes    | Yes      | No     | Yes  |
| Scroll locking        | Yes    | Yes     | Yes    | Yes | Yes | Yes    | Yes    | Yes      | Yes    | Yes  |
| Nested dialogs        | No     | Yes     | No     | No  | Yes | No     | No     | No       | No     | Yes  |
| Return focus on close | Yes    | Yes     | Yes    | Yes | Yes | Yes    | Yes    | Yes      | Yes    | Yes  |
| Entry/exit animation  | Yes    | Yes     | Yes    | Yes | Yes | No     | Yes    | Yes      | No     | Yes  |
| Built-in close X      | Yes    | Yes     | Yes    | Yes | Yes | No     | Yes    | Yes      | No     | Yes  |
| Header/Footer slots   | Yes    | Yes     | Yes    | Yes | Yes | No     | Yes    | Yes      | Yes    | Yes  |
| Scrollable body       | Yes    | Yes     | Yes    | Yes | Yes | Yes    | Yes    | Yes      | Yes    | Yes  |
| Mobile responsive     | No     | Yes     | Yes    | Yes | No  | No     | No     | No       | No     | Yes  |

## Features added

- **Size variants** (sm/md/lg/full) — 5/9 competitors
- **Built-in CloseButton** with Phosphor X icon — 8/9 competitors
- **Header/Body/Footer** structure — 7/9 competitors
- **Scrollable body** for long content — all competitors
- **Mobile responsive footer** — buttons stack full-width on mobile
- **Entry/exit animation** — scale + opacity using motion tokens

## Accessibility

- Focus trap: Tab cycles within dialog, never escapes to page behind
- First focusable element receives focus on open
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (Title), `aria-describedby` (Description)
- Escape key closes dialog
- Return focus to trigger element on close
- CloseButton has `aria-label="Close"`

## Sources

- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog)
- [MUI Dialog](https://mui.com/material-ui/react-dialog/)
- [Spectrum Dialog](https://react-spectrum.adobe.com/react-spectrum/Dialog.html)
- [Base UI Dialog](https://base-ui.com/react/components/dialog)
- [GOV.UK Modal Dialog](https://design-system.service.gov.uk/)
- [Mantine Modal](https://mantine.dev/core/modal/)
- [Chakra Modal](https://chakra-ui.com/docs/components/modal)
- [Ant Design Modal](https://ant.design/components/modal)
- [Carbon Modal](https://carbondesignsystem.com/components/modal/usage/)
