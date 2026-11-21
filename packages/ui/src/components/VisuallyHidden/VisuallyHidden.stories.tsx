import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HouseIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import { VisuallyHidden } from "./VisuallyHidden";
import { cn } from "../../lib/cn";

const meta: Meta<typeof VisuallyHidden> = {
  title: "Components/VisuallyHidden",
  component: VisuallyHidden,
  parameters: {
    docs: {
      description: {
        component:
          "Text that screen readers announce but that isn’t shown, like the “ name” in “Change name”. It’s Tailwind’s `sr-only` plus GOV.UK’s fixes: no negative margin, no text selection, and spacer pseudo-elements so hidden text never runs into the words around it. `focusable` keeps it hidden until it, or something inside it, has focus. For a one-off inside a component, plain `sr-only` is fine.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">{children}</p>
);

/** What a screen reader announces for the example next to it. */
const Hears = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted mt-2 text-xs">
    Screen readers hear: <q className="text-fg-default">{children}</q>
  </p>
);

const link =
  "text-fg-default focus-visible:sp-focus-ring rounded-sm underline underline-offset-2 outline-none";

/* ============================================================
 * Shared examples
 * ============================================================ */

/** GOV.UK summary-list actions: each "Change" link names its row. */
function SummaryActions() {
  const rows = [
    ["Name", "Sarah Philips"],
    ["Email address", "sarah.philips@example.com"],
  ] as const;
  return (
    <dl className="divide-border-default border-border-default divide-y border-y text-sm">
      {rows.map(([key, value]) => (
        <div key={key} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
          <dt className="text-fg-default w-32 font-semibold">{key}</dt>
          <dd className="text-fg-default min-w-0 flex-1 break-words">{value}</dd>
          <dd>
            <a href={`#change-${key}`} className={link}>
              Change<VisuallyHidden> {key.toLowerCase()}</VisuallyHidden>
            </a>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** In a flex row with an icon: the hidden text still joins the visible word. */
function IconLinks() {
  return (
    <div className="flex items-center gap-4 text-sm">
      <a href="#edit" className={cn(link, "inline-flex items-center gap-1.5")}>
        <PencilSimpleIcon aria-hidden className="size-4" />
        Edit<VisuallyHidden> delivery address</VisuallyHidden>
      </a>
      <a href="#delete" className={cn(link, "inline-flex items-center gap-1.5")}>
        <TrashIcon aria-hidden className="size-4" />
        Delete<VisuallyHidden> delivery address</VisuallyHidden>
      </a>
    </div>
  );
}

const focusableLink =
  "bg-surface-raised text-fg-default border-border-default inline-block rounded-md border px-3 py-2 text-sm font-semibold shadow-md outline-none focus-visible:sp-focus-ring";

/* ============================================================
 * DEFAULT
 * ============================================================ */

/** Hidden text completes a visible label, so every “Change” link has a unique name. */
export const Default: Story = {
  render: () => (
    <div className="sm:max-w-md">
      <SummaryActions />
      <Hears>Change name, Change email address</Hears>
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

/**
 * Valid, error and disabled don’t apply: it’s text, not a control. The
 * states are hidden, focusable (hidden until focused) and focusable while
 * focused.
 */
function StateGrid({ className }: { className?: string }) {
  return (
    <ul className={cn("grid gap-8 sm:grid-cols-2", className)}>
      <li>
        <Label>Hidden (default)</Label>
        <a href="#change-name" className={cn(link, "text-sm")}>
          Change<VisuallyHidden> name</VisuallyHidden>
        </a>
        <Hears>Change name</Hears>
      </li>
      <li>
        <Label>In a flex row, with icons</Label>
        <IconLinks />
        <Hears>Edit delivery address, Delete delivery address</Hears>
      </li>
      <li>
        <Label>Focusable, not focused</Label>
        <p className="text-fg-default text-sm">
          (Nothing shows. Tab here to reveal the link.)
          <VisuallyHidden focusable>
            <a href="#results" className={focusableLink}>
              Skip to results
            </a>
          </VisuallyHidden>
        </p>
        <Hears>Skip to results</Hears>
      </li>
      <li>
        <Label>Focusable, focused (preview)</Label>
        {/* A static picture of the focused state: inert, so it can't be tabbed to */}
        <div inert>
          <a href="#results" className={cn(focusableLink, "sp-focus-ring")}>
            Skip to results
          </a>
        </div>
      </li>
    </ul>
  );
}

export const States: Story = {
  render: () => <StateGrid className="sm:max-w-2xl" />,
};

/* ============================================================
 * DENSITY
 * ============================================================ */

/** Density doesn’t change it: the hidden text takes no space at any density. */
export const Density: Story = {
  render: () => (
    <ul className="grid gap-8 lg:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <li key={density} data-density={density}>
          <Label>{density}</Label>
          <SummaryActions />
        </li>
      ))}
    </ul>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          aria-label={theme}
          className="bg-surface-base text-fg-default rounded-lg p-6"
        >
          <Label>{theme}</Label>
          <StateGrid />
        </section>
      ))}
    </div>
  ),
};

/* ============================================================
 * RENDER
 * ============================================================ */

/** `render` swaps the element, e.g. a heading that structures the page for screen readers only. */
export const Render: Story = {
  render: () => (
    <section className="sm:max-w-md">
      <VisuallyHidden render={(props) => <h2 {...props}>{props.children}</h2>}>
        Search results
      </VisuallyHidden>
      <p className="text-fg-default text-sm">
        24 books match “garden”. The heading above is only for screen readers, so they can jump to
        the results by heading.
      </p>
      <Hears>Heading level 2, Search results</Hears>
    </section>
  ),
};

/* ============================================================
 * RTL
 * ============================================================ */

/**
 * Right to left: hidden text at the start and end of a line, in a flex row and in
 * a table cell, never adds a horizontal scrollbar.
 */
export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" lang="ar" className="text-fg-default flex flex-col gap-6 text-sm sm:max-w-md">
      <p>
        <VisuallyHidden>بداية: </VisuallyHidden>
        نص مرئي في السطر
        <VisuallyHidden> :نهاية</VisuallyHidden>
      </p>
      <div className="flex items-center gap-2">
        <a href="#home" className={cn(link, "inline-flex items-center gap-1.5")}>
          <HouseIcon aria-hidden className="size-4" />
          الرئيسية<VisuallyHidden> للمكتبة</VisuallyHidden>
        </a>
        <span>شريط أدوات</span>
      </div>
      <table className="border-border-default w-full border text-start">
        <caption className="sr-only">طلبات</caption>
        <thead>
          <tr>
            <th className="border-border-default border p-2 text-start">الطلب</th>
            <th className="border-border-default border p-2 text-start">
              <VisuallyHidden>إجراءات</VisuallyHidden>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-border-default border p-2">#1024</td>
            <td className="border-border-default border p-2">
              <a href="#order" className={link}>
                تغيير<VisuallyHidden> الطلب 1024</VisuallyHidden>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
