import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigationMenu } from "./NavigationMenu";

afterEach(() => {
  vi.restoreAllMocks();
});

type RootProps = React.ComponentProps<typeof NavigationMenu.Root>;

function Nav({ children, ...props }: Partial<RootProps> & { children?: React.ReactNode }) {
  return (
    <NavigationMenu.Root aria-label="Main" collapseBelow="never" {...props}>
      <NavigationMenu.List>
        {children ?? (
          <>
            <NavigationMenu.Item value="products">
              <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Group label="Platform">
                  <NavigationMenu.Link href="#analytics" description="Measure behaviour">
                    Analytics
                  </NavigationMenu.Link>
                  <NavigationMenu.Link href="#automation">Automation</NavigationMenu.Link>
                </NavigationMenu.Group>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
            </NavigationMenu.Item>
          </>
        )}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

const button = (name: string | RegExp) => screen.getByRole("button", { name });

describe("NavigationMenu", () => {
  describe("structure and landmarks", () => {
    it("renders one named navigation landmark with a list of items", () => {
      render(<Nav />);
      expect(screen.getByRole("navigation", { name: "Main" })).toHaveAttribute(
        "data-slot",
        "navigation-menu",
      );
      expect(screen.getAllByRole("navigation")).toHaveLength(1);
      expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute(
        "data-slot",
        "navigation-menu-link",
      );
    });

    it("warns in development when the landmark has no name", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <NavigationMenu.Root collapseBelow="never">
          <NavigationMenu.List />
        </NavigationMenu.Root>,
      );
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("give the navigation landmark"));
    });

    it("throws when parts are used outside Root", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<NavigationMenu.Trigger>X</NavigationMenu.Trigger>)).toThrow();
    });
  });

  describe("opening", () => {
    it("opens a panel on click, with aria-expanded, and closes on Escape", async () => {
      const user = userEvent.setup();
      render(<Nav />);
      const trigger = button("Products");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(await screen.findByRole("link", { name: /Analytics/ })).toBeInTheDocument();
      // The popup is a div, not a second unnamed <nav>
      expect(screen.getAllByRole("navigation")).toHaveLength(1);
      await user.keyboard("{Escape}");
      await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
    });

    it("labels grouped links with the group label", async () => {
      const user = userEvent.setup();
      render(<Nav />);
      await user.click(button("Products"));
      const list = await screen.findByRole("list", { name: "Platform" });
      expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    });

    it("hover opens by default; openOn='click' ignores hover", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<Nav delay={0} />);
      await user.hover(button("Products"));
      await waitFor(() => expect(button("Products")).toHaveAttribute("aria-expanded", "true"));
      unmount();
      render(<Nav delay={0} openOn="click" />);
      await user.hover(button("Products"));
      await new Promise((r) => setTimeout(r, 150));
      expect(button("Products")).toHaveAttribute("aria-expanded", "false");
      await user.click(button("Products"));
      expect(button("Products")).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("current page", () => {
    it("active link gets aria-current=page and a <strong> fallback", () => {
      render(
        <Nav>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#a" active>
              Docs
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Nav>,
      );
      const link = screen.getByRole("link", { name: "Docs" });
      expect(link).toHaveAttribute("aria-current", "page");
      expect(link.querySelector("strong")).toHaveTextContent("Docs");
    });

    it("active='section' gives aria-current=true", () => {
      render(
        <Nav>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#a" active="section">
              Guides
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Nav>,
      );
      expect(screen.getByRole("link", { name: "Guides" })).toHaveAttribute("aria-current", "true");
    });

    it("Item current marks its trigger as the current section", () => {
      render(
        <Nav>
          <NavigationMenu.Item current>
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="#x">X</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </Nav>,
      );
      expect(button("Products")).toHaveAttribute("aria-current", "true");
    });
  });

  describe("highlight", () => {
    it("line (default): a decorative sliding line and no hover/open fill", () => {
      const { container } = render(<Nav />);
      expect(container.querySelector("[data-slot='navigation-menu-indicator']")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(button("Products").className).not.toContain("hover:bg-state-hover");
      expect(screen.getByRole("link", { name: "Pricing" }).className).not.toContain(
        "[&[aria-current]]:bg-state-selected",
      );
    });

    it("fill: hover/open fill and a selected fill on the current item, with no line", () => {
      const { container } = render(<Nav highlight="fill" />);
      expect(container.querySelector("[data-slot='navigation-menu-indicator']")).toBeNull();
      expect(button("Products").className).toContain("hover:bg-state-hover");
      expect(button("Products").className).toContain("aria-expanded:bg-state-hover");
      expect(screen.getByRole("link", { name: "Pricing" }).className).toContain(
        "[&[aria-current]]:bg-state-selected",
      );
    });
  });

  describe("mobile", () => {
    it("renders a Menu toggle that opens a drawer with accordion sections", async () => {
      const user = userEvent.setup();
      render(<Nav collapseBelow="always" />);
      await user.click(button("Menu"));
      const dialog = await screen.findByRole("dialog");
      const nav = within(dialog).getByRole("navigation", { name: "Main" });
      const section = within(nav).getByRole("button", { name: "Products" });
      expect(section).toHaveAttribute("aria-expanded", "false");
      await user.click(section);
      expect(section).toHaveAttribute("aria-expanded", "true");
      expect(within(nav).getByRole("link", { name: /Analytics/ })).toBeInTheDocument();
    });

    it("closes the drawer when a link is followed", async () => {
      const user = userEvent.setup();
      render(<Nav collapseBelow="always" />);
      await user.click(button("Menu"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("link", { name: "Pricing" }));
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });

    it("has a visible, labelled close button and is labelled by its heading", async () => {
      const user = userEvent.setup();
      render(<Nav collapseBelow="always" labels={{ close: "Cau'r ddewislen" }} />);
      await user.click(button("Menu"));
      const dialog = await screen.findByRole("dialog", { name: "Menu" });
      const close = within(dialog).getByRole("button", { name: "Cau'r ddewislen" });
      expect(close).toHaveAttribute("data-slot", "navigation-menu-mobile-close");
      expect(close.className).not.toMatch(/(^|\s)hidden(\s|$)/);
      await user.click(close);
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      expect(button("Menu")).toHaveFocus();
    });

    it("Escape closes the drawer and returns focus to the Menu button", async () => {
      const user = userEvent.setup();
      render(<Nav collapseBelow="always" />);
      await user.click(button("Menu"));
      const dialog = await screen.findByRole("dialog");
      await user.click(within(dialog).getByRole("button", { name: "Products" }));
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      expect(button("Menu")).toHaveFocus();
    });

    it("marks the current page in the drawer", async () => {
      const user = userEvent.setup();
      render(
        <Nav collapseBelow="always">
          <NavigationMenu.Item>
            <NavigationMenu.Link href="#pricing" active>
              Pricing
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Nav>,
      );
      await user.click(button("Menu"));
      const dialog = await screen.findByRole("dialog");
      const link = within(dialog).getByRole("link", { name: "Pricing" });
      expect(link).toHaveAttribute("aria-current", "page");
      expect(link.className).toContain("before:bg-accent");
    });

    it("closes the drawer when the viewport reaches the desktop breakpoint", async () => {
      const listeners: Array<() => void> = [];
      let matches = false;
      const original = window.matchMedia;
      window.matchMedia = ((query: string) => ({
        get matches() {
          return matches;
        },
        media: query,
        addEventListener: (_: string, cb: () => void) => listeners.push(cb),
        removeEventListener: () => {},
      })) as unknown as typeof window.matchMedia;
      try {
        const user = userEvent.setup();
        render(<Nav collapseBelow="md" />);
        await user.click(button("Menu"));
        expect(await screen.findByRole("dialog")).toBeInTheDocument();
        matches = true;
        listeners.forEach((cb) => cb());
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
      } finally {
        window.matchMedia = original;
      }
    });

    it("collapseBelow='never' renders no toggle; labels are localisable", () => {
      const { unmount } = render(<Nav />);
      expect(screen.queryByRole("button", { name: "Menu" })).not.toBeInTheDocument();
      unmount();
      render(<Nav collapseBelow="always" labels={{ menu: "Dewislen" }} />);
      expect(button("Dewislen")).toBeInTheDocument();
    });
  });

  describe("overflow", () => {
    function mockLayout(itemWidth: number, available: number) {
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
        this: HTMLElement,
      ) {
        const w = this.tagName === "LI" ? itemWidth : 0;
        return {
          width: w,
          height: 40,
          top: 0,
          left: 0,
          right: w,
          bottom: 40,
          x: 0,
          y: 0,
          toJSON() {},
        };
      });
      vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (
        this: HTMLElement,
      ) {
        return this.getAttribute("data-slot") === "navigation-menu-list-wrapper" ? available : 0;
      });
    }

    function Many(props: Partial<RootProps>) {
      return (
        <Nav {...props}>
          {["One", "Two", "Three", "Four"].map((name) => (
            <NavigationMenu.Item key={name}>
              <NavigationMenu.Link href={`#${name}`} active={name === "Four"}>
                {name}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </Nav>
      );
    }

    it("moves items that don't fit into a More menu that reflects the current page", async () => {
      mockLayout(100, 250);
      const user = userEvent.setup();
      render(<Many />);
      const more = await screen.findByRole("button", { name: /More/ });
      expect(more).toHaveAccessibleName("More, includes current page");
      expect(more).toHaveAttribute("aria-current", "true");
      expect(screen.getByRole("link", { name: "One" })).toBeVisible();
      await user.click(more);
      const panel = await screen.findByRole("link", { name: "Four" });
      expect(panel).toHaveAttribute("aria-current", "page");
    });

    it("renders no More menu when everything fits", () => {
      mockLayout(50, 1000);
      render(<Many />);
      expect(screen.queryByRole("button", { name: /More/ })).not.toBeInTheDocument();
    });

    it("overflow='scroll' uses a scroll container", () => {
      const { container } = render(<Many overflow="scroll" />);
      expect(container.querySelector("[data-slot='navigation-menu-scroller']")).toBeInTheDocument();
    });
  });

  describe("panels and submenus", () => {
    it("following a link in a panel closes it", async () => {
      const user = userEvent.setup();
      render(<Nav />);
      await user.click(button("Products"));
      await user.click(await screen.findByRole("link", { name: "Automation" }));
      await waitFor(() => expect(button("Products")).toHaveAttribute("aria-expanded", "false"));
    });

    it("closeOnClick={false} keeps the panel open", async () => {
      const user = userEvent.setup();
      render(
        <Nav>
          <NavigationMenu.Item value="p">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="#x" closeOnClick={false}>
                Stay
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </Nav>,
      );
      await user.click(button("Products"));
      await user.click(await screen.findByRole("link", { name: "Stay" }));
      await new Promise((r) => setTimeout(r, 100));
      expect(button("Products")).toHaveAttribute("aria-expanded", "true");
    });

    it("renders an inline nested submenu that opens inside the panel", async () => {
      const user = userEvent.setup();
      render(
        <Nav>
          <NavigationMenu.Item value="docs">
            <NavigationMenu.Trigger>Docs</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Root submenu="inline">
                <NavigationMenu.List>
                  <NavigationMenu.Item value="components">
                    <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
                    <NavigationMenu.Content>
                      <NavigationMenu.Link href="#button">Button</NavigationMenu.Link>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </NavigationMenu.Root>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </Nav>,
      );
      await user.click(button("Docs"));
      const sub = await screen.findByRole("button", { name: "Components" });
      expect(sub.closest("[data-slot='navigation-menu-sub']")).toBeInTheDocument();
      await user.click(sub);
      expect(await screen.findByRole("link", { name: "Button" })).toBeInTheDocument();
    });
  });

  describe("sizes and orientation", () => {
    it("applies size classes and a vertical list", () => {
      render(<Nav size="lg" orientation="vertical" />);
      expect(button("Products").className).toContain("min-h-[var(--sp-control-height-lg)]");
      expect(screen.getByRole("navigation")).toHaveAttribute("data-orientation", "vertical");
    });
  });

  describe("built on Link (GEO-967)", () => {
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      React.ComponentPropsWithRef<"a"> & { to: string }
    >(({ to, children, ...props }, ref) => (
      <a ref={ref} {...props} href={to} data-router="">
        {children}
      </a>
    ));
    RouterLink.displayName = "RouterLink";

    it("a new-tab link gets the icon, hidden text and rel", () => {
      render(
        <Nav>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="https://example.org" target="_blank">
              Blog
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Nav>,
      );
      const link = screen.getByRole("link", { name: /Blog\s*\(opens in new tab\)/ });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("data-slot", "navigation-menu-link");
      expect(link.querySelector("svg[aria-hidden=true]")).not.toBeNull();
      // Navigation rows: no underline, no visited colour
      expect(link).toHaveClass("no-underline");
      expect(link.className).not.toContain("visited:");
    });

    it("passes a router link through on desktop (element and function render)", () => {
      render(
        <Nav>
          <NavigationMenu.Item>
            <NavigationMenu.Link render={<RouterLink to="/events" />}>Events</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link render={(props) => <RouterLink {...props} to="/help" />}>
              Help
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Nav>,
      );
      for (const [name, href] of [
        ["Events", "/events"],
        ["Help", "/help"],
      ]) {
        const link = screen.getByRole("link", { name });
        expect(link).toHaveAttribute("data-router");
        expect(link).toHaveAttribute("href", href);
      }
    });

    it("the drawer honours a function render too (it used to ignore it)", async () => {
      const user = userEvent.setup();
      render(
        <Nav collapseBelow="always">
          <NavigationMenu.Item>
            <NavigationMenu.Link render={(props) => <RouterLink {...props} to="/help" />}>
              Help
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </Nav>,
      );
      await user.click(button("Menu"));
      const dialog = await screen.findByRole("dialog");
      const link = within(dialog).getByRole("link", { name: "Help" });
      expect(link).toHaveAttribute("data-router");
      expect(link).toHaveAttribute("href", "/help");
      await user.click(link);
      await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });
  });
});
