import { Code, DocsTable } from "./table";

export interface AnatomyPart {
  /** The part's name in the compound API, e.g. `Dialog.Popup`. */
  name: string;
  /** Its `data-slot` value, or null for pass-through parts that render nothing of their own. */
  slot: string | null;
  /** The rendered element and role. */
  element: string;
  description: string;
  required?: boolean;
}

/** Anatomy: every named part with its data-slot (BRIEF §8.3). */
export function Anatomy({ parts, tree }: { parts: AnatomyPart[]; tree?: string }) {
  return (
    <>
      {tree && (
        <figure data-slot="docs-anatomy-tree" className="not-prose my-4">
          <pre className="bg-surface-alternate border-border-default overflow-x-auto rounded-[var(--radius-lg)] border p-4 font-mono text-[0.8125rem] leading-relaxed">
            {tree}
          </pre>
          <figcaption className="sr-only">Part structure</figcaption>
        </figure>
      )}
      <DocsTable
        label="Anatomy: parts and data-slots"
        columns={["Part", "data-slot", "Renders", "Purpose"]}
        rows={parts.map((p) => ({
          key: p.name,
          header: (
            <>
              <Code>{p.name}</Code>
              {p.required && (
                <span className="text-fg-muted ms-1.5 text-xs font-normal">required</span>
              )}
            </>
          ),
          cells: [
            p.slot ? (
              <Code key="s">{p.slot}</Code>
            ) : (
              <span key="s" className="text-fg-muted">
                none
              </span>
            ),
            <span key="e" className="text-fg-muted">
              {p.element}
            </span>,
            p.description,
          ],
        }))}
      />
    </>
  );
}
