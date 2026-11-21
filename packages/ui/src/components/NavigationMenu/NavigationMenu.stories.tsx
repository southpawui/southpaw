import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BookOpen,
  ChartLine,
  Code,
  Lightning,
  PlugsConnected,
  Robot,
  ShieldCheck,
  UsersThree,
} from "@phosphor-icons/react";
import { NavigationMenu, type NavigationMenuSize } from "./NavigationMenu";
import { Badge } from "../Badge/Badge";

const meta: Meta = {
  title: "Components/NavigationMenu",
  parameters: {
    docs: {
      description: {
        component:
          "Site navigation built on the APG disclosure pattern (not `role=menu`). " +
          "Recommended companion: a **SkipLink** (“Skip to main content”) placed before the header, " +
          "so keyboard users can bypass the navigation (WCAG 2.4.1).",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const caption = "text-fg-muted mb-2 text-xs font-medium uppercase tracking-wide";
const icon = "size-5";

/* ============================================================
 * Shared example
 * ============================================================ */

function ProductsPanel() {
  return (
    <>
      <div className="grid gap-1 sm:grid-cols-2">
        <NavigationMenu.Group label="Platform">
          <NavigationMenu.Link
            href="#analytics"
            icon={<ChartLine className={icon} />}
            description="Track and measure user behaviour"
          >
            Analytics
          </NavigationMenu.Link>
          <NavigationMenu.Link
            href="#automation"
            icon={<Robot className={icon} />}
            description="Automate repetitive workflows"
          >
            Automation
          </NavigationMenu.Link>
        </NavigationMenu.Group>
        <NavigationMenu.Group label="Connect">
          <NavigationMenu.Link
            href="#integrations"
            icon={<PlugsConnected className={icon} />}
            description="Connect with third-party tools"
            badge={<Badge size="sm">New</Badge>}
          >
            Integrations
          </NavigationMenu.Link>
          <NavigationMenu.Link
            href="#security"
            icon={<ShieldCheck className={icon} />}
            description="SSO, audit logs and permissions"
          >
            Security
          </NavigationMenu.Link>
        </NavigationMenu.Group>
      </div>
      <NavigationMenu.Footer>
        <span>New: realtime dashboards are here.</span>
        <NavigationMenu.Link href="#whats-new" className="w-auto font-medium">
          See what’s new →
        </NavigationMenu.Link>
      </NavigationMenu.Footer>
    </>
  );
}

function ResourcesPanel() {
  return (
    <NavigationMenu.Group className="sm:w-64">
      <NavigationMenu.Link href="#docs" icon={<BookOpen className="size-4" />}>
        Documentation
      </NavigationMenu.Link>
      <NavigationMenu.Link href="#api" icon={<Code className="size-4" />}>
        API reference
      </NavigationMenu.Link>
      <NavigationMenu.Link
        href="#community"
        icon={<UsersThree className="size-4" />}
        badge={<Badge size="sm">12</Badge>}
      >
        Community
      </NavigationMenu.Link>
      <NavigationMenu.Link href="#changelog" icon={<Lightning className="size-4" />}>
        Changelog
      </NavigationMenu.Link>
    </NavigationMenu.Group>
  );
}

function SiteNav({
  current = "pricing",
  children,
  ...props
}: Partial<React.ComponentProps<typeof NavigationMenu.Root>> & { current?: string }) {
  return (
    <NavigationMenu.Root aria-label="Main" collapseBelow="never" {...props}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ProductsPanel />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources" current={current === "resources"}>
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ResourcesPanel />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#pricing" active={current === "pricing"}>
            Pricing
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#customers" active={current === "customers"}>
            Customers
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        {children}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

/** Stories open panels with room below so screenshots capture them. */
function Frame({ children, tall = true }: { children: React.ReactNode; tall?: boolean }) {
  return <div className={tall ? "min-h-[26rem]" : undefined}>{children}</div>;
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

export const Default: Story = {
  render: () => (
    <Frame>
      <SiteNav />
      <p className="text-fg-muted mt-4 max-w-md text-xs">
        Pair with a SkipLink (“Skip to main content”) before the header so keyboard users can jump
        past the navigation.
      </p>
    </Frame>
  ),
};

/* ============================================================
 * STATES — valid / error don't apply to navigation
 * ============================================================ */

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className={caption}>Current page (Pricing) · indicator rests on it</p>
        <SiteNav aria-label="Current page example" />
      </div>
      <div>
        <p className={caption}>Current section (Resources → aria-current=“true”)</p>
        <SiteNav aria-label="Current section example" current="resources" />
      </div>
      <div>
        <p className={caption}>Disabled trigger</p>
        <NavigationMenu.Root aria-label="Disabled example" collapseBelow="never">
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Trigger disabled>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <ResourcesPanel />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * SIZES
 * ============================================================ */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as NavigationMenuSize[]).map((size) => (
        <div key={size}>
          <p className={caption}>{size}</p>
          <SiteNav size={size} aria-label={`Main (${size})`} />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * MEGA MENU — groups, icons, descriptions, badges, footer
 * ============================================================ */

export const MegaMenu: Story = {
  render: () => (
    <Frame>
      <SiteNav aria-label="Mega menu example" backdrop arrow />
      <p className="text-fg-muted mt-4 max-w-md text-xs">
        Hover or click Products. This example adds <code>backdrop</code> and <code>arrow</code>.
      </p>
    </Frame>
  ),
};

/* ============================================================
 * HIGHLIGHT — line (default) or fill, never both
 * ============================================================ */

export const Highlight: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className={caption}>
          highlight=“line” (default) — a line slides to the hovered or open item and rests on the
          current page; no fill
        </p>
        <SiteNav aria-label="Line highlight" />
      </div>
      <div>
        <p className={caption}>
          highlight=“fill” — a fill on hover or open; the current page keeps a stronger fill; no
          line
        </p>
        <SiteNav aria-label="Fill highlight" highlight="fill" />
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="w-56">
          <p className={caption}>vertical · line</p>
          <SiteNav aria-label="Vertical line" orientation="vertical" />
        </div>
        <div className="w-56">
          <p className={caption}>vertical · fill</p>
          <SiteNav aria-label="Vertical fill" orientation="vertical" highlight="fill" />
        </div>
      </div>
      <p className="text-fg-muted max-w-md text-xs">
        The chevron rotates when open in both. Under prefers-reduced-motion the line jumps to its
        new position without sliding.
      </p>
    </div>
  ),
};

/* ============================================================
 * OPEN ON CLICK / SEPARATE PANELS
 * ============================================================ */

export const OpenBehaviour: Story = {
  render: () => (
    <div className="flex min-h-[26rem] flex-col gap-8">
      <div>
        <p className={caption}>openOn=“click” — hover does nothing</p>
        <SiteNav aria-label="Click to open" openOn="click" />
      </div>
      <div>
        <p className={caption}>viewport=&#123;false&#125; — each panel opens on its own</p>
        <SiteNav aria-label="Separate panels" viewport={false} />
      </div>
    </div>
  ),
};

/* ============================================================
 * SUBMENUS — nested flyout and inline
 * ============================================================ */

function NestedSubmenu({ submenu }: { submenu: "flyout" | "inline" }) {
  return (
    <NavigationMenu.Root aria-label={`Docs (${submenu})`} collapseBelow="never">
      <NavigationMenu.List>
        <NavigationMenu.Item value="docs">
          <NavigationMenu.Trigger>Docs</NavigationMenu.Trigger>
          <NavigationMenu.Content className="sm:w-64">
            <NavigationMenu.Root submenu={submenu}>
              <NavigationMenu.List>
                <NavigationMenu.Item>
                  <NavigationMenu.Link href="#start">Getting started</NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item value="components">
                  <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
                  <NavigationMenu.Content className="sm:w-56">
                    <NavigationMenu.Group>
                      <NavigationMenu.Link href="#button">Button</NavigationMenu.Link>
                      <NavigationMenu.Link href="#dialog">Dialog</NavigationMenu.Link>
                      <NavigationMenu.Link href="#accordion">Accordion</NavigationMenu.Link>
                    </NavigationMenu.Group>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link href="#tokens">Tokens</NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#blog">Blog</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

export const Submenus: Story = {
  render: () => (
    <div className="grid min-h-[22rem] gap-8 sm:grid-cols-2">
      <div>
        <p className={caption}>Flyout (default)</p>
        <NestedSubmenu submenu="flyout" />
      </div>
      <div>
        <p className={caption}>Inline</p>
        <NestedSubmenu submenu="inline" />
      </div>
    </div>
  ),
};

/* ============================================================
 * MOBILE — Menu button → Drawer with Accordion sections
 * ============================================================ */

export const Mobile: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <SiteNav collapseBelow="always" aria-label="Main (current page)" />
      <SiteNav collapseBelow="always" aria-label="Main (current section)" current="resources" />
      <p className="text-fg-muted max-w-md text-xs">
        Below the <code>collapseBelow</code> breakpoint (default <code>md</code>) the list becomes a
        “Menu” button. Dropdowns turn into accordion sections in a drawer, and following a link
        closes it. Here it’s forced with <code>collapseBelow=“always”</code>.
      </p>
    </div>
  ),
};

/* ============================================================
 * OVERFLOW — More menu (default) and scroll arrows
 * ============================================================ */

const sections = [
  "Overview",
  "Pricing",
  "Customers",
  "Changelog",
  "Docs",
  "Community",
  "Careers",
  "Contact",
];

function Overflowing({ overflow }: { overflow: "more" | "scroll" }) {
  return (
    <NavigationMenu.Root
      aria-label={`Sections (${overflow})`}
      collapseBelow="never"
      overflow={overflow}
    >
      <NavigationMenu.List>
        {sections.map((name) => (
          <NavigationMenu.Item key={name}>
            <NavigationMenu.Link href={`#${name.toLowerCase()}`} active={name === "Contact"}>
              {name}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

export const Overflow: Story = {
  render: () => (
    <div className="flex min-h-[22rem] flex-col gap-8">
      <div className="max-w-md">
        <p className={caption}>overflow=“more” (default) — current page hidden in More</p>
        <Overflowing overflow="more" />
      </div>
      <div className="max-w-md">
        <p className={caption}>overflow=“scroll” — arrows appear at the edges</p>
        <Overflowing overflow="scroll" />
      </div>
    </div>
  ),
};

/* ============================================================
 * VERTICAL — sidebar
 * ============================================================ */

export const Vertical: Story = {
  render: () => (
    <div className="min-h-[24rem] w-56">
      <SiteNav aria-label="Sidebar" orientation="vertical" />
    </div>
  ),
};

/* ============================================================
 * RTL
 * ============================================================ */

export const RTL: Story = {
  render: () => (
    <div dir="rtl" className="min-h-[18rem]">
      <NavigationMenu.Root aria-label="الرئيسية" collapseBelow="never">
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>المنتجات</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Group label="المنصة" className="sm:w-64">
                <NavigationMenu.Link
                  href="#a"
                  icon={<ChartLine className={icon} />}
                  description="قياس سلوك المستخدم"
                >
                  التحليلات
                </NavigationMenu.Link>
                <NavigationMenu.Link
                  href="#b"
                  icon={<Robot className={icon} />}
                  description="أتمتة المهام"
                >
                  الأتمتة
                </NavigationMenu.Link>
              </NavigationMenu.Group>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#pricing" active>
              الأسعار
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  parameters: { density: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-6">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <p className={caption}>{density}</p>
          <SiteNav aria-label={`Main (${density})`} />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * THEMES — states, sizes and orientation per theme
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="bg-surface-base rounded-lg p-6">
          <p className="text-fg-muted mb-4 text-xs font-medium uppercase tracking-wide">{theme}</p>
          <div className="flex flex-col gap-4">
            <SiteNav aria-label={`${theme}: current page`} />
            <SiteNav aria-label={`${theme}: current section`} current="resources" />
            <SiteNav aria-label={`${theme}: fill, current page`} highlight="fill" />
            <SiteNav
              aria-label={`${theme}: fill, current section`}
              highlight="fill"
              current="resources"
            />
            <SiteNav aria-label={`${theme}: small`} size="sm" />
            <div className="w-56">
              <SiteNav aria-label={`${theme}: vertical`} orientation="vertical" />
            </div>
            <div className="w-56">
              <SiteNav
                aria-label={`${theme}: vertical fill`}
                orientation="vertical"
                highlight="fill"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
};
