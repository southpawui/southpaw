import IMask from "imask";
import {
  VisaMonoIcon,
  MastercardMonoIcon,
  AmexIcon,
  DiscoverMonoIcon,
  GenericMonoIcon,
} from "react-svg-credit-card-payment-icons";

/* ---- Brand detection ---- */

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

export function detectCardBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6(?:011|5|4[4-9])/.test(digits)) return "discover";
  return "unknown";
}

export const cardBrandIcons: Record<
  CardBrand,
  React.ComponentType<{ width?: number; height?: number }>
> = {
  visa: VisaMonoIcon,
  mastercard: MastercardMonoIcon,
  amex: AmexIcon,
  discover: DiscoverMonoIcon,
  unknown: GenericMonoIcon,
};

/* ---- Formatting via imask ---- */

function applyMask(value: string, maskOpts: IMask.AnyMaskedOptions): string {
  const mask = IMask.createMask(maskOpts);
  mask.resolve(value);
  return mask.value;
}

export function formatCardNumber(value: string): string {
  const raw = value.replace(/\D/g, "");
  const isAmex = /^3[47]/.test(raw);
  return applyMask(raw, {
    mask: isAmex ? "0000 000000 00000" : "0000 0000 0000 0000",
  });
}

export function formatCardExpiry(value: string): string {
  return applyMask(value, {
    mask: "MM / YY",
    blocks: {
      MM: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
      YY: { mask: IMask.MaskedRange, from: 0, to: 99, maxLength: 2 },
    },
  });
}

export function formatCvv(value: string): string {
  return applyMask(value, { mask: "0000" });
}
