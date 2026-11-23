import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "./Link";
import { cn } from "../../lib/cn";

const meta: Meta<typeof Link> = {
  title: "Components/Link",
  component: Link,
  parameters: {
    docs: {
      description: {
        component:
          'A text link. Inline links sit inside a sentence and always keep their underline; `standalone` links stand on their own (lists, “Back”, “View all”) and may drop it. GOV.UK’s underline thickens on hover, visited links turn purple, and `target="_blank"` adds an icon and hidden “(opens in new tab)” text. Links can’t be disabled: show plain text and say why instead. Use `render` for router links.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide", className)}>
    {children}
  </p>
);

const VARIANTS = ["default", "muted", "inherit", "inverse"] as const;

// Static pictures of states the browser only shows on interaction or from history
// (inert, not tabbable). Browsers hide :visited from scripts, so visited is a preview too.
const thick = "decoration-[length:max(3px,0.1875rem,0.12em)] [text-decoration-skip-ink:none]";
const hoverLook: Record<(typeof VARIANTS)[number], string> = {
  default: `${thick} text-link-hover`,
  muted: `${thick} text-fg-default`,
  inherit: thick,
  inverse: thick,
};
const focusLook = "sp-focus-ring";
// Only the default variant shows a visited colour
const visitedLook = (variant: (typeof VARIANTS)[number]) =>
  variant === "default" ? "text-link-visited" : undefined;

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <p className="text-fg-default max-w-prose text-base">
      You can <Link href="#renew">renew your library card online</Link>. It takes about 5 minutes,
      and you’ll need your card number.
    </p>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

/**
 * Rest, hover, focus, visited and current page. Hover, focus and visited are
 * static previews. Valid, error and disabled don’t apply: links can’t be disabled.
 */
function StateGrid({
  variant = "default",
  labelClassName,
}: {
  variant?: (typeof VARIANTS)[number];
  labelClassName?: string;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-8 gap-y-4 text-base sm:grid-cols-5">
      <li>
        <Label className={labelClassName}>Rest</Label>
        <Link variant={variant} href="#rest">
          Find a book
        </Link>
      </li>
      <li inert>
        <Label className={labelClassName}>Hover</Label>
        <Link variant={variant} href="#hover" className={hoverLook[variant]}>
          Find a book
        </Link>
      </li>
      <li inert>
        <Label className={labelClassName}>Focus</Label>
        <Link variant={variant} href="#focus" className={focusLook}>
          Find a book
        </Link>
      </li>
      <li inert>
        <Label className={labelClassName}>Visited</Label>
        <Link variant={variant} href="#visited" className={visitedLook(variant)}>
          Find a book
        </Link>
      </li>
      <li inert>
        <Label className={labelClassName}>Current page</Label>
        <Link variant={variant} href="#current" aria-current="page">
          Find a book
        </Link>
      </li>
    </ul>
  );
}

export const States: Story = {
  render: () => (
    <div className="text-fg-default flex flex-col gap-6">
      <StateGrid />
      <p className="text-fg-muted max-w-prose text-sm">
        Links can’t be disabled. If a link isn’t available, show plain text and say why, e.g.
        “Renewals open on 1 March”.
      </p>
    </div>
  ),
};

/* ============================================================
 * VARIANTS
 * ============================================================ */

function VariantList() {
  return (
    <ul className="flex flex-col gap-4 text-base">
      {VARIANTS.map((variant) => (
        <li
          key={variant}
          className={cn(
            variant === "inverse" ? "bg-brand text-fg-on-brand rounded-md p-3" : "text-fg-default",
          )}
        >
          <Label>
            <span className={variant === "inverse" ? "text-fg-on-brand" : undefined}>
              {variant}
            </span>
          </Label>
          Read our{" "}
          <Link variant={variant} href={`#${variant}`}>
            borrowing rules
          </Link>{" "}
          before you visit.
        </li>
      ))}
    </ul>
  );
}

/**
 * `default` is the link blue. `muted` for secondary links. `inherit` takes the text
 * colour around it (ErrorSummary, NavigationMenu). `inverse` sits on a solid brand surface.
 */
export const Variants: Story = {
  render: () => (
    <div className="sm:max-w-lg">
      <VariantList />
    </div>
  ),
};

/* ============================================================
 * STANDALONE
 * ============================================================ */

/**
 * Standalone links stand on their own, so they can drop the underline (`hover` or
 * `none`), take a `size` and an icon. Inside a sentence the underline always stays.
 */
export const Standalone: Story = {
  render: () => (
    <div className="text-fg-default flex flex-col gap-6">
      <div>
        <Label>Sizes</Label>
        <ul className="flex flex-col gap-2">
          {(["sm", "md", "lg"] as const).map((size) => (
            <li key={size}>
              <Link standalone size={size} href={`#size-${size}`}>
                View all events ({size})
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Label>Underline</Label>
        <ul className="flex flex-col gap-2">
          <li>
            <Link standalone href="#always">
              Always underlined (default)
            </Link>
          </li>
          <li>
            <Link standalone underline="hover" href="#hover-only">
              Underlined on hover
            </Link>
          </li>
          <li>
            <Link standalone underline="none" variant="inherit" href="#none">
              No underline (navigation rows)
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <Label>Icons</Label>
        <div className="flex flex-wrap gap-6">
          <Link
            standalone
            href="#back"
            icon={<ArrowLeftIcon aria-hidden className="size-[1em] rtl:-scale-x-100" />}
            iconPosition="start"
          >
            Back
          </Link>
          <Link
            standalone
            href="#next"
            icon={<ArrowRightIcon aria-hidden className="size-[1em] rtl:-scale-x-100" />}
          >
            Next page
          </Link>
        </div>
      </div>
    </div>
  ),
};

/* ============================================================
 * NEW TAB AND DOWNLOAD
 * ============================================================ */

/**
 * `target="_blank"` adds an icon, hidden “(opens in new tab)” text and
 * `rel="noopener noreferrer"`. `download` adds an icon and hidden “(download)”.
 * Put the file type and size in the visible text.
 */
export const NewTabAndDownload: Story = {
  render: () => (
    <div className="text-fg-default flex flex-col gap-4 text-base sm:max-w-md">
      <p>
        Read the{" "}
        <Link href="https://www.gov.uk/guidance/public-library-services" target="_blank">
          public library guidance
        </Link>{" "}
        on GOV.UK.
      </p>
      <p>
        <Link href="/files/opening-times.pdf" download>
          Opening times (PDF, 120 KB)
        </Link>
      </p>
      <p>
        <Link href="https://example.org" target="_blank" externalIcon={false}>
          No icon, hidden text kept
        </Link>
      </p>
      <p className="text-fg-muted text-sm">
        The icon stays on the same line as the last word, even when the link wraps.
      </p>
    </div>
  ),
};

/* ============================================================
 * ROUTER LINKS
 * ============================================================ */

/** Stand-in for a router's link (Next.js `Link`, React Router `NavLink`). */
const RouterLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithRef<"a"> & { to: string }
>(({ to, children, ...props }, ref) => (
  <a ref={ref} {...props} href={to} data-router-link="">
    {children}
  </a>
));
RouterLink.displayName = "RouterLink";

/**
 * `render` swaps the anchor for a router link while keeping Link’s styles and
 * behaviour. A function `render` gets the props to spread.
 */
export const RouterLinks: Story = {
  render: () => (
    <ul className="text-fg-default flex flex-col gap-2 text-base">
      <li>
        <Link render={<RouterLink to="/events" />}>Events (element)</Link>
      </li>
      <li>
        <Link render={(props) => <RouterLink {...props} to="/account" />}>
          Your account (function)
        </Link>
      </li>
    </ul>
  ),
};

/* ============================================================
 * RTL
 * ============================================================ */

export const RightToLeft: Story = {
  render: () => (
    <div dir="rtl" lang="ar" className="text-fg-default flex flex-col gap-4 text-base sm:max-w-md">
      <p>
        اقرأ{" "}
        <Link href="https://example.org" target="_blank">
          قواعد الاستعارة
        </Link>{" "}
        قبل زيارتك.
      </p>
      <Link
        standalone
        href="#next"
        icon={<ArrowRightIcon aria-hidden className="size-[1em] rtl:-scale-x-100" />}
      >
        الصفحة التالية
      </Link>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

/** Inline links follow the text; standalone links keep a 24px minimum target at every density. */
export const Density: Story = {
  render: () => (
    <ul className="grid gap-8 sm:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <li
          key={density}
          data-density={density}
          className="text-fg-default flex flex-col gap-2 text-base"
        >
          <Label>{density}</Label>
          <p>
            Read our <Link href={`#rules-${density}`}>borrowing rules</Link>.
          </p>
          <Link standalone href={`#all-${density}`}>
            View all events
          </Link>
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
          className="bg-surface-base text-fg-default flex flex-col gap-6 rounded-lg p-6"
        >
          <Label>{theme}</Label>
          {VARIANTS.filter((v) => v !== "inverse").map((variant) => (
            <div key={variant}>
              <Label>{variant}</Label>
              <StateGrid variant={variant} />
            </div>
          ))}
          <div className="bg-brand text-fg-on-brand rounded-md p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide">inverse</p>
            <StateGrid variant="inverse" labelClassName="text-fg-on-brand" />
          </div>
          <div className="flex flex-wrap items-center gap-6 text-base">
            <Link standalone underline="hover" href="#s1">
              Standalone, hover underline
            </Link>
            <Link href="https://example.org" target="_blank">
              Opens in new tab
            </Link>
            <Link href="/files/a.pdf" download>
              Download (PDF)
            </Link>
          </div>
        </section>
      ))}
    </div>
  ),
};
