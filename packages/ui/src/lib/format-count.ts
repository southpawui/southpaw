/* ============================================================
 * Shared count formatting (GEO-964)
 *
 * One formatter for every visible count, so "99+" looks the same
 * everywhere: Indicator now, Badge's `max` at its GEO-939 rebuild.
 *
 * - Locale-aware via Intl.NumberFormat (no dependency): "1,234", "1.234",
 *   "١٬٢٣٤".
 * - `max` caps the display: 120 with max 99 → "99+". The "+" is
 *   localisable through `overflow`.
 * - `format: "compact"` → "1.2K", "1,2 k". Compact has no default cap.
 * - Screen readers should get the raw count, never this string.
 * ============================================================ */

export interface FormatCountOptions {
  /** Highest number shown before "+". Default 99, or none with `compact`. `false` for no cap. */
  max?: number | false;
  /** `standard` (default) or `compact` ("1.2K"). */
  format?: "standard" | "compact";
  /** BCP 47 locale. Default: the runtime's. */
  locale?: string | string[];
  /** Extra Intl.NumberFormat options, merged over the format's. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Build the capped text from the formatted max. Default `(max) => \`${max}+\``. */
  overflow?: (formattedMax: string) => string;
}

const defaultOverflow = (max: string) => `${max}+`;

/** The text to show for `count`. */
export function formatCount(count: number, options: FormatCountOptions = {}): string {
  const { format = "standard", locale, formatOptions, overflow = defaultOverflow } = options;
  const max = options.max ?? (format === "compact" ? false : 99);
  const formatter = new Intl.NumberFormat(locale, {
    ...(format === "compact" ? { notation: "compact", maximumFractionDigits: 1 } : {}),
    ...formatOptions,
  });
  if (max !== false && count > max) return overflow(formatter.format(max));
  return formatter.format(count);
}
