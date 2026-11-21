import { DocsTable } from "./table";

export interface ScreenReaderRow {
  reader: string;
  browser: string;
  status: "pass" | "issues" | "not-tested";
  notes?: string;
}

const LABEL = { pass: "Pass", issues: "Issues found", "not-tested": "Not yet tested" } as const;

/**
 * Screen readers and browsers tested (BRIEF §8.7). Untested pairs say so; the
 * table never implies coverage that hasn't happened.
 */
export function ScreenReaderTable({ rows }: { rows: ScreenReaderRow[] }) {
  return (
    <DocsTable
      label="Screen reader and browser testing"
      columns={["Screen reader", "Browser", "Result", "Notes"]}
      rows={rows.map((r) => ({
        key: `${r.reader}-${r.browser}`,
        header: r.reader,
        cells: [
          r.browser,
          <span
            key="s"
            data-status={r.status}
            className="data-[status=issues]:text-danger data-[status=not-tested]:text-fg-muted data-[status=pass]:text-success"
          >
            {LABEL[r.status]}
          </span>,
          r.notes ?? "None",
        ],
      }))}
    />
  );
}
