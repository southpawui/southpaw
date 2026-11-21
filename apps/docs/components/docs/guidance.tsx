import { CheckCircle, XCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * When to use / When not to use. A labelled panel so the two read as a pair;
 * the heading stays in the page outline (TOC, search, llms.txt).
 */
export function Guidance({ type, children }: { type: "do" | "dont"; children: ReactNode }) {
  const isDo = type === "do";
  const Icon = isDo ? CheckCircle : XCircle;
  return (
    <section
      data-slot="docs-guidance"
      data-type={type}
      aria-label={isDo ? "When to use" : "When not to use"}
      className="border-border-default data-[type=do]:border-s-success data-[type=dont]:border-s-danger my-4 rounded-[var(--radius-lg)] border border-s-4 px-5 py-1"
    >
      <p className="not-prose mt-4 flex items-center gap-2 text-sm font-semibold">
        <Icon
          aria-hidden
          weight="fill"
          className={isDo ? "text-success size-5" : "text-danger size-5"}
        />
        {isDo ? "Use it for" : "Don't use it for"}
      </p>
      {children}
    </section>
  );
}

export interface Alternative {
  name: string;
  href?: string;
  /** When to reach for it instead. */
  reason: string;
}

export function Alternatives({ items }: { items: Alternative[] }) {
  return (
    <ul data-slot="docs-alternatives" className="not-prose my-4 grid gap-3 sm:grid-cols-2">
      {items.map((a) => (
        <li
          key={a.name}
          className="border-border-default bg-surface-alternate rounded-[var(--radius-lg)] border p-4"
        >
          <p className="flex items-center gap-1.5 font-semibold">
            {a.href ? (
              <Link
                href={a.href}
                className="text-fg-default underline underline-offset-4 hover:no-underline"
              >
                {a.name}
              </Link>
            ) : (
              <span>
                {a.name} <span className="text-fg-muted text-xs font-normal">(coming soon)</span>
              </span>
            )}
            {a.href && <ArrowRight aria-hidden className="size-4" />}
          </p>
          <p className="text-fg-muted mt-1 text-sm">{a.reason}</p>
        </li>
      ))}
    </ul>
  );
}

/** Content guidance: paired do / don't examples of copy. */
export function ContentRule({
  do: good,
  dont: bad,
  children,
}: {
  do: string;
  dont: string;
  children?: ReactNode;
}) {
  return (
    <figure
      data-slot="docs-content-rule"
      className="not-prose border-border-default my-4 overflow-hidden rounded-[var(--radius-lg)] border"
    >
      <div className="grid sm:grid-cols-2">
        <div className="border-border-default border-b p-4 sm:border-b-0 sm:border-e">
          <p className="text-success flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <CheckCircle aria-hidden weight="fill" className="size-4" /> Do
          </p>
          <p className="mt-2 text-sm">{good}</p>
        </div>
        <div className="p-4">
          <p className="text-danger flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <XCircle aria-hidden weight="fill" className="size-4" /> Don&apos;t
          </p>
          <p className="mt-2 text-sm">{bad}</p>
        </div>
      </div>
      {children && (
        <figcaption className="text-fg-muted border-border-default border-t p-4 text-sm">
          {children}
        </figcaption>
      )}
    </figure>
  );
}
