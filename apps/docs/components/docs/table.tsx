import type { ReactNode } from "react";

export interface DocsTableRow {
  key: string;
  /** The row header (first column). */
  header: ReactNode;
  /** The remaining cells, in column order. */
  cells: ReactNode[];
}

/**
 * Shared table for the template blocks.
 *
 * From `sm` up it's a real table. On phones the same rows render as a list of
 * cards (header, then each column as a labelled pair), so nothing scrolls
 * sideways or wraps one word per line. Only one of the two is displayed at a
 * time, so assistive tech meets the content once.
 */
export function DocsTable({
  label,
  columns,
  rows,
}: {
  label: string;
  /** Column headings; the first labels the row headers. */
  columns: string[];
  rows: DocsTableRow[];
}) {
  return (
    <div data-slot="docs-table" className="not-prose my-4">
      <div className="border-border-default hidden overflow-hidden rounded-[var(--radius-lg)] border sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">{label}</caption>
          <thead className="bg-surface-alternate">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="border-border-default whitespace-nowrap border-b px-4 py-2.5 font-semibold"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.key}
                className="border-border-default [&>*]:border-border-default [&:not(:last-child)>*]:border-b"
              >
                <th scope="row" className="px-4 py-2.5 text-left align-top font-semibold">
                  {r.header}
                </th>
                {r.cells.map((cell, i) => (
                  <td key={i} className="px-4 py-2.5 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul aria-label={label} className="flex flex-col gap-3 sm:hidden">
        {rows.map((r) => (
          <li
            key={r.key}
            className="border-border-default rounded-[var(--radius-lg)] border p-4 text-sm"
          >
            <p className="font-semibold">{r.header}</p>
            <dl className="mt-2 flex flex-col gap-2">
              {r.cells.map((cell, i) => (
                <div key={i}>
                  <dt className="text-fg-muted text-xs font-semibold">{columns[i + 1]}</dt>
                  <dd className="mt-0.5">{cell}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="bg-surface-sunken text-fg-default whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">
      {children}
    </code>
  );
}
