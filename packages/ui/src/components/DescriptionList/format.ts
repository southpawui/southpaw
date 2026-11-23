/* ============================================================
 * Value formatting for DescriptionList.Details (GEO-966, Spectrum LabeledValue)
 *
 * Numbers, dates, lists and ranges go through Intl, so "1234.5" in GBP reads
 * "£1,234.50" and ["Red", "Blue"] reads "Red and Blue" in the page's locale.
 * ============================================================ */

export type DescriptionRange = { start: number | bigint | Date; end: number | bigint | Date };

/** What `Details value` accepts. Strings pass through unchanged. */
export type DescriptionValue = string | number | bigint | Date | string[] | DescriptionRange;

/** Intl options for the value's type: number, date/time, or list. */
export type DescriptionFormat =
  Intl.NumberFormatOptions | Intl.DateTimeFormatOptions | Intl.ListFormatOptions;

const isRange = (v: unknown): v is DescriptionRange =>
  typeof v === "object" && v !== null && !(v instanceof Date) && !Array.isArray(v) && "start" in v;

/** True for values that should show the empty text: nothing, "", or an empty list. */
export function isEmptyValue(value: DescriptionValue | null | undefined): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Date) return Number.isNaN(value.getTime());
  return false;
}

// formatRange is ES2023 for NumberFormat; typed loosely so the ES2022 lib still compiles.
type RangeFormatter = { formatRange: (a: unknown, b: unknown) => string };

/**
 * Format a value with Intl. `locale` defaults to the runtime's (pass one for
 * server rendering, so server and client agree).
 */
export function formatDescriptionValue(
  value: DescriptionValue,
  format?: DescriptionFormat,
  locale?: string | string[],
): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return new Intl.ListFormat(locale, {
      type: "conjunction",
      ...(format as Intl.ListFormatOptions),
    }).format(value);
  }
  if (value instanceof Date) {
    return new Intl.DateTimeFormat(locale, {
      ...(format ? {} : { dateStyle: "medium" }),
      ...(format as Intl.DateTimeFormatOptions),
    }).format(value);
  }
  if (isRange(value)) {
    const { start, end } = value;
    if (start instanceof Date && end instanceof Date) {
      const f = new Intl.DateTimeFormat(locale, {
        ...(format ? {} : { dateStyle: "medium" }),
        ...(format as Intl.DateTimeFormatOptions),
      });
      return f.formatRange(start, end);
    }
    const f = new Intl.NumberFormat(locale, format as Intl.NumberFormatOptions);
    const r = f as unknown as Partial<RangeFormatter>;
    return r.formatRange
      ? r.formatRange(start, end)
      : `${f.format(start as number)}–${f.format(end as number)}`;
  }
  return new Intl.NumberFormat(locale, format as Intl.NumberFormatOptions).format(value);
}
