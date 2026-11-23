import { CheckCircle, MinusCircle } from "@phosphor-icons/react/dist/ssr";
import { DocsTable } from "./table";

export interface StateRow {
  state: string;
  /** "yes": supported and styled. "n/a": doesn't apply to this component. */
  support: "yes" | "n/a";
  notes: string;
}

/** States (BRIEF §8.5): every listed state, marked supported or not applicable, never invented. */
export function StateTable({ states }: { states: StateRow[] }) {
  return (
    <DocsTable
      label="States"
      columns={["State", "Supported", "Notes"]}
      rows={states.map((s) => ({
        key: s.state,
        header: s.state,
        cells: [
          s.support === "yes" ? (
            <span
              key="y"
              className="text-success inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <CheckCircle aria-hidden weight="fill" className="size-4" /> Yes
            </span>
          ) : (
            <span
              key="n"
              className="text-fg-muted inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <MinusCircle aria-hidden className="size-4" /> Not applicable
            </span>
          ),
          s.notes,
        ],
      }))}
    />
  );
}
