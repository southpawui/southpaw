import { all } from "country-codes-list";
import { getExampleNumber } from "libphonenumber-js";
import examplesMobile from "libphonenumber-js/examples.mobile.json";
import { formatPhoneNumberIntl } from "react-phone-number-input";

/* ---- Country codes ---- */

export interface CountryCode {
  code: string;
  country: string;
  flag: string;
  name: string;
}

export const countryCodes: CountryCode[] = all()
  .filter((c) => c.countryCallingCode)
  .map((c) => ({
    code: `+${c.countryCallingCode}`,
    country: c.countryCode,
    flag: c.flag,
    name: c.countryNameEn,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

/* ---- Pre-computed dial-code lookup (longest-prefix-first) ---- */

const _uniqueDialCodes: [string, CountryCode][] = (() => {
  const unique = new Map<string, CountryCode>();
  for (const c of countryCodes) {
    const normalized = c.code.replace(/-/g, "");
    if (!unique.has(normalized)) unique.set(normalized, c);
  }
  return [...unique.entries()].sort((a, b) => b[0].length - a[0].length);
})();

/* ---- Detection ---- */

export function detectCountryCode(input: string): CountryCode | null {
  const clean = input.replace(/[^\d+]/g, "");
  if (!clean.startsWith("+")) return null;
  for (const [normalized, entry] of _uniqueDialCodes) {
    if (clean.startsWith(normalized)) return entry;
  }
  return null;
}

/* ---- Formatting ---- */

export function getPhoneFormat(isoCountry: string): { placeholder: string; maxDigits: number } {
  const fallback = { placeholder: "0000 000000", maxDigits: 15 };
  try {
    type CC = Parameters<typeof getExampleNumber>[0];
    const example = getExampleNumber(isoCountry as CC, examplesMobile);
    if (!example) return fallback;
    const maxDigits = example.nationalNumber.length;
    const formatted = formatPhoneNumberIntl(example.number);
    const national = formatted
      .replace(/^\+\d+\s/, "")
      .replace(/[^\d\s]/g, "")
      .trim();
    const placeholder = national.replace(/\d/g, "0") || fallback.placeholder;
    return { placeholder, maxDigits };
  } catch {
    return fallback;
  }
}

export function formatNational(digits: string, dialCode: string): string {
  if (!digits) return "";
  const e164 = `${dialCode}${digits}`;
  try {
    const formatted = formatPhoneNumberIntl(e164 as Parameters<typeof formatPhoneNumberIntl>[0]);
    if (formatted) {
      const national = formatted
        .replace(/^\+\d+\s/, "")
        .replace(/[^\d\s]/g, "")
        .trim();
      if (national) return national;
    }
  } catch {
    /* fall through */
  }
  return digits;
}
