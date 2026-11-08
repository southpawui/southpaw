# OTPField — Competitive Research

Researched: 2026-11-08

## Feature comparison

| Feature               | shadcn | Mantine | Chakra | MUI | GOV.UK | Ours |
| --------------------- | ------ | ------- | ------ | --- | ------ | ---- |
| Auto-advance on digit | Yes    | Yes     | Yes    | N/A | Yes    | Yes  |
| Paste support         | Yes    | Yes     | Yes    | N/A | Yes    | Yes  |
| Character masking     | Yes    | No      | Yes    | N/A | Yes    | No   |
| Custom length (4/6/8) | Yes    | Yes     | Yes    | N/A | Yes    | Yes  |
| Separator element     | Yes    | No      | No     | N/A | No     | Yes  |
| Input type options    | Yes    | Yes     | Yes    | N/A | Yes    | No   |

## Must-add features

- **Character masking** — optional password-style masking (shadcn, Chakra, GOV.UK)
- **Input type options** — numeric, password, text modes (Chakra)
- **Backspace** — deletes current + moves focus to previous (all libraries)

## Accessibility

- Each input has `aria-label="Digit X of N"`
- `inputMode="numeric"` for mobile keyboards
- Auto-advance focus on digit entry
- Paste: split pasted value across inputs
- Screen readers: announce "digit 1 of 6" style

## Sources

- [shadcn Input OTP](https://ui.shadcn.com/docs/components/input-otp)
- [Chakra PinInput](https://chakra-ui.com/docs/components/pin-input)
