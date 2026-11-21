import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SkipLink } from "./SkipLink";

const meta: Meta<typeof SkipLink> = {
  title: "Components/SkipLink",
  component: SkipLink,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "“Skip to main content”: hidden until it gets focus, it moves keyboard focus past the navigation to the main content (WCAG 2.4.1). Put it first in `<body>`, or straight after a cookie banner, never inside `<nav>` or `<header>`. Press Tab in a story to see it.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">{children}</p>
);

/*
 * Placeholder site header. NavigationMenu (GEO-924) lives in another lane;
 * a story with it replaces this at the restack.
 */
function SiteHeader({ sticky = false }: { sticky?: boolean }) {
  const links = ["Books", "Events", "Your account", "Help"];
  return (
    <header
      className={
        "border-border-default bg-surface-base flex flex-wrap items-center gap-6 border-b px-6 py-4" +
        (sticky ? " sticky top-0 z-10" : "")
      }
    >
      <a href="/" className="text-fg-default text-lg font-semibold">
        City Library
      </a>
      <nav aria-label="Main">
        <ul className="flex flex-wrap gap-4 text-sm">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`/${link.toLowerCase().replace(/ /g, "-")}`}
                className="text-fg-default underline"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function Content({ heading = "Find a book" }: { heading?: string }) {
  return (
    <>
      <h1 className="text-fg-default text-2xl font-semibold">{heading}</h1>
      <p className="text-fg-default mt-3 max-w-prose text-sm">
        Press Tab: the skip link appears first. Activate it and focus moves here, so the next Tab
        lands on{" "}
        <a href="/catalogue" className="underline">
          the catalogue
        </a>{" "}
        instead of the navigation.
      </p>
    </>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

/** The usual page: link first, then the header, then `<main id="main-content">`. */
export const Default: Story = {
  render: () => (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content" className="p-6">
        <Content />
      </main>
    </>
  ),
};

/* ============================================================
 * TARGET
 * ============================================================ */

/**
 * `SkipLink.Target` marks where the link lands when the main content has no
 * id. `scrollMargin` keeps a sticky header from covering it.
 */
export const Target: Story = {
  render: () => (
    <>
      <SkipLink />
      <SiteHeader sticky />
      <main className="p-6">
        <div className="text-fg-muted h-[60vh] text-sm">(Banner and promotions)</div>
        <SkipLink.Target scrollMargin="5rem" />
        <Content heading="Opening times" />
      </main>
    </>
  ),
};

/* ============================================================
 * SEVERAL LINKS
 * ============================================================ */

/** Two skip links side by side. One is usually enough (WebAIM). */
export const SeveralLinks: Story = {
  render: () => (
    <>
      <SkipLink />
      <SkipLink
        href="#search"
        className="start-[max(14rem,env(safe-area-inset-left))] rtl:start-[max(14rem,env(safe-area-inset-right))]"
      >
        Skip to search
      </SkipLink>
      <SiteHeader />
      <main id="main-content" className="flex flex-col gap-6 p-6">
        <Content />
        <section id="search" aria-label="Search" className="text-fg-default text-sm">
          Search the catalogue (placeholder)
        </section>
      </main>
    </>
  ),
};

/* ============================================================
 * HASH ROUTER
 * ============================================================ */

/**
 * For hash routers, where `#main-content` would be read as a route:
 * `updateHash={false}` keeps the URL as it is and focuses the target by hand.
 */
export const HashRouter: Story = {
  render: () => (
    <>
      <SkipLink updateHash={false} />
      <SiteHeader />
      <main id="main-content" className="p-6">
        <Content />
      </main>
    </>
  ),
};

/* ============================================================
 * TRANSLATED
 * ============================================================ */

export const Translated: Story = {
  render: () => (
    <div lang="cy">
      <SkipLink>Neidio i’r prif gynnwys</SkipLink>
      <SiteHeader />
      <main id="main-content" className="p-6">
        <Content heading="Dod o hyd i lyfr" />
      </main>
    </div>
  ),
};

/* ============================================================
 * STATES (static previews of the focused link)
 * ============================================================ */

// The focused look, in normal flow, for screenshots
const preview = "static translate-y-0 opacity-100 sp-focus-ring";

function Previews() {
  // Static pictures of the focused link: inert, so they can't be tabbed to or clicked
  return (
    <ul inert className="flex flex-col gap-6">
      <li>
        <Label>Focused (default text)</Label>
        <SkipLink className={preview} />
      </li>
      <li>
        <Label>Focused, custom text</Label>
        <SkipLink href="#search" className={preview}>
          Skip to search
        </SkipLink>
      </li>
    </ul>
  );
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-6">
      <Previews />
      <p className="text-fg-muted text-sm">
        Unfocused, the link is off-screen and can’t be seen or tapped. Tab into the Default story to
        see it appear.
      </p>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <ul className="grid gap-8 p-6 sm:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <li key={density} data-density={density} inert>
          <Label>{density}</Label>
          <SkipLink className={preview} />
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
    <div className="flex flex-col gap-6 p-6">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          aria-label={theme}
          className="bg-surface-base text-fg-default rounded-lg p-6"
        >
          <Label>{theme}</Label>
          <Previews />
        </section>
      ))}
    </div>
  ),
};
