"use client";

import { Kbd } from "@southpawui/ui/Kbd";
import { DocsTable } from "./table";

export interface KeyRow {
  /** Kbd `keys` syntax: `+` joins keys pressed together, e.g. "Shift+Tab". */
  keys: string;
  action: string;
}

/** Keyboard map (BRIEF §8.7). Keys use Southpaw Kbd, so screen readers hear the key names. */
export function KeyboardTable({ rows }: { rows: KeyRow[] }) {
  return (
    <DocsTable
      label="Keyboard interactions"
      columns={["Key", "Action"]}
      rows={rows.map((r) => ({
        key: r.keys,
        header: <Kbd keys={r.keys} format="full" />,
        cells: [r.action],
      }))}
    />
  );
}
