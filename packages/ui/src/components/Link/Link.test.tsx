import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { Link } from "./Link";
import { getLinkBehaviour, linkClasses, mergeRel, printableUrl } from "../../lib/link";

afterEach(() => vi.restoreAllMocks());

describe("Link", () => {
  it("renders an anchor with its slot, variant and the link classes", () => {
    render(<Link href="/books">Books</Link>);
    const link = screen.getByRole("link", { name: "Books" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/books");
    expect(link).toHaveAttribute("data-slot", "link");
    expect(link).toHaveAttribute("data-variant", "default");
    expect(link).toHaveClass("text-link", "underline", "visited:text-link-visited");
  });

  it("variants: muted, inherit and inverse have no visited colour", () => {
    for (const variant of ["muted", "inherit", "inverse"] as const) {
      const { unmount } = render(
        <Link href="#a" variant={variant}>
          {variant}
        </Link>,
      );
      const link = screen.getByRole("link", { name: variant });
      expect(link).toHaveAttribute("data-variant", variant);
      expect(link.className).not.toContain("visited:text-link-visited");
      unmount();
    }
  });

  it("visited={false} drops the visited colour", () => {
    render(
      <Link href="#a" visited={false}>
        A
      </Link>,
    );
    expect(screen.getByRole("link").className).not.toContain("visited:");
  });

  describe("underline", () => {
    it("inline links keep their underline, and warn when asked to drop it", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <Link href="#a" underline="none">
          A
        </Link>,
      );
      const link = screen.getByRole("link");
      expect(link).toHaveClass("underline");
      expect(link).not.toHaveClass("no-underline");
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("only applies to standalone"));
    });

    it("standalone links can underline on hover only, or not at all", () => {
      render(
        <>
          <Link href="#a" standalone underline="hover">
            Hover
          </Link>
          <Link href="#b" standalone underline="none">
            None
          </Link>
        </>,
      );
      expect(screen.getByRole("link", { name: "Hover" })).toHaveClass(
        "no-underline",
        "hover:underline",
      );
      const none = screen.getByRole("link", { name: "None" });
      expect(none).toHaveClass("no-underline");
      expect(none.className).not.toContain("hover:underline");
    });
  });

  it("standalone: medium weight, a 24px minimum target, size and an icon", () => {
    render(
      <Link href="#a" standalone size="lg" icon={<svg data-testid="icon" />} iconPosition="start">
        Back
      </Link>,
    );
    const link = screen.getByRole("link", { name: "Back" });
    expect(link).toHaveAttribute("data-standalone");
    expect(link).toHaveClass("inline-flex", "min-h-6", "font-medium", "text-lg");
    expect(link.firstElementChild).toBe(screen.getByTestId("icon"));
  });

  it("ignores the icon on inline links", () => {
    render(
      <Link href="#a" icon={<svg data-testid="icon" />}>
        A
      </Link>,
    );
    expect(screen.queryByTestId("icon")).toBeNull();
  });

  describe("new tab", () => {
    it("adds the icon, hidden text and rel", () => {
      render(
        <Link href="https://example.org" target="_blank">
          Guidance
        </Link>,
      );
      const link = screen.getByRole("link", { name: /Guidance\s*\(opens in new tab\)/ });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAttribute("data-new-tab");
      expect(link.querySelector("[data-slot=link-external] svg")).not.toBeNull();
      expect(screen.getByText("(opens in new tab)")).toHaveAttribute(
        "data-slot",
        "visually-hidden",
      );
    });

    it("keeps the consumer's rel and adds noopener noreferrer", () => {
      render(
        <Link href="https://example.org" target="_blank" rel="external nofollow">
          A
        </Link>,
      );
      expect(screen.getByRole("link")).toHaveAttribute(
        "rel",
        "external nofollow noopener noreferrer",
      );
    });

    it("externalIcon={false} hides the icon but keeps the hidden text", () => {
      render(
        <Link href="https://example.org" target="_blank" externalIcon={false}>
          A
        </Link>,
      );
      const link = screen.getByRole("link");
      expect(link.querySelector("svg")).toBeNull();
      expect(screen.getByText("(opens in new tab)")).toBeInTheDocument();
    });

    it("keeps the icon with the last word of plain-text children", () => {
      render(
        <Link href="https://example.org" target="_blank">
          Public library guidance
        </Link>,
      );
      const nowrap = screen.getByRole("link").querySelector(".whitespace-nowrap")!;
      expect(nowrap.textContent).toMatch(/^guidance/);
      expect(nowrap.querySelector("[data-slot=link-external]")).not.toBeNull();
    });

    it("element children: a word joiner hidden from screen readers", () => {
      render(
        <Link href="https://example.org" target="_blank">
          <strong>Guidance</strong>
        </Link>,
      );
      const joiner = [...screen.getByRole("link").querySelectorAll("[aria-hidden=true]")].find(
        (n) => n.textContent === "⁠",
      );
      expect(joiner).toBeDefined();
    });
  });

  it("download: icon and hidden text", () => {
    render(
      <Link href="/files/times.pdf" download>
        Opening times (PDF)
      </Link>,
    );
    const link = screen.getByRole("link", { name: /Opening times \(PDF\)\s*\(download\)/ });
    expect(link).toHaveAttribute("download");
    expect(link.querySelector("[data-slot=link-download] svg")).not.toBeNull();
  });

  it("labels translate the hidden text", () => {
    render(
      <Link
        href="https://example.org"
        target="_blank"
        labels={{ newTab: "(yn agor mewn tab newydd)" }}
      >
        Canllawiau
      </Link>,
    );
    expect(screen.getByText("(yn agor mewn tab newydd)")).toBeInTheDocument();
  });

  describe("print URL", () => {
    it("adds a print-only URL for absolute and root-relative links", () => {
      render(<Link href="https://example.org/a">A</Link>);
      const url = screen.getByRole("link").querySelector("[data-slot=link-print-url]")!;
      expect(url).toHaveClass("hidden", "print:inline");
      // Paper only: never part of the accessible name
      expect(url).toHaveAttribute("aria-hidden", "true");
      expect(url.textContent).toBe(" (https://example.org/a)");
    });

    it("none for hashes, or with printUrl={false}", () => {
      render(
        <>
          <Link href="#main">Hash</Link>
          <Link href="/a" printUrl={false}>
            Off
          </Link>
        </>,
      );
      for (const name of ["Hash", "Off"]) {
        expect(
          screen.getByRole("link", { name }).querySelector("[data-slot=link-print-url]"),
        ).toBeNull();
      }
    });
  });

  it("passes aria-current through", () => {
    render(
      <Link href="/events" aria-current="page">
        Events
      </Link>,
    );
    const link = screen.getByRole("link", { name: "Events" });
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("aria-[current=page]:font-semibold");
  });

  it("warns when someone tries to disable a link", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Link href="#a" aria-disabled="true">
        A
      </Link>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("can't be disabled"));
  });

  it('aria-disabled="false" is not an attempt to disable, so no warning', () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Link href="#a" aria-disabled="false">
        A
      </Link>,
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it("warns once per mount, not on every render", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(
      <Link href="#a" underline="none">
        A
      </Link>,
    );
    rerender(
      <Link href="#a" underline="none">
        B
      </Link>,
    );
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("focus gap: inline links pad the ring out above and below; standalone links don't", () => {
    render(
      <>
        <Link href="#a">Inline</Link>
        <Link href="#b" standalone>
          Standalone
        </Link>
      </>,
    );
    const inline = screen.getByRole("link", { name: "Inline" });
    expect(inline).toHaveClass("py-0.5");
    // Not on the sides: it would push the ring over the neighbouring letters
    expect(inline.className).not.toMatch(/(^|\s)-?(px|mx)-0\.5/);
    const standalone = screen.getByRole("link", { name: "Standalone" });
    expect(standalone.className).not.toMatch(/(^|\s)py-0\.5/);
  });

  describe("render", () => {
    const RouterLink = React.forwardRef<
      HTMLAnchorElement,
      React.ComponentPropsWithRef<"a"> & { to: string }
    >(({ to, children, ...props }, ref) => (
      <a ref={ref} {...props} href={to} data-router="">
        {children}
      </a>
    ));
    RouterLink.displayName = "RouterLink";

    it("an element keeps Link's classes and content", () => {
      render(<Link render={<RouterLink to="/events" />}>Events</Link>);
      const link = screen.getByRole("link", { name: "Events" });
      expect(link).toHaveAttribute("data-router");
      expect(link).toHaveAttribute("href", "/events");
      expect(link).toHaveClass("text-link");
    });

    it("a function gets the props to spread", () => {
      render(<Link render={(props) => <RouterLink {...props} to="/account" />}>Account</Link>);
      const link = screen.getByRole("link", { name: "Account" });
      expect(link).toHaveAttribute("data-router");
      expect(link).toHaveAttribute("data-slot", "link");
    });
  });

  it("forwards its ref and merges className", () => {
    let node: HTMLAnchorElement | null = null;
    render(
      <Link href="#a" className="custom" ref={(n) => void (node = n)}>
        A
      </Link>,
    );
    expect(node).toBe(screen.getByRole("link"));
    expect(node!).toHaveClass("custom", "text-link");
  });

  it("renders on the server", () => {
    const html = renderToString(
      <Link href="https://example.org" target="_blank">
        A
      </Link>,
    );
    expect(html).toContain('data-slot="link"');
    expect(html).toContain("(opens in new tab)");
  });
});

describe("lib/link", () => {
  it("mergeRel only adds for new tabs and doesn't duplicate", () => {
    expect(mergeRel(undefined, false)).toBeUndefined();
    expect(mergeRel("nofollow", false)).toBe("nofollow");
    expect(mergeRel("noopener", true)).toBe("noopener noreferrer");
  });

  it("printableUrl: absolute and root-relative only", () => {
    expect(printableUrl("https://a.org")).toBe("https://a.org");
    expect(printableUrl("/books")).toBe("/books");
    for (const href of ["#main", "mailto:a@b.org", "tel:123", "books", "//cdn.org/x", undefined]) {
      expect(printableUrl(href)).toBeUndefined();
    }
  });

  it("getLinkBehaviour reads target and download", () => {
    expect(getLinkBehaviour({ target: "_blank" }).newTab).toBe(true);
    expect(getLinkBehaviour({ download: "" }).download).toBe(true);
    expect(getLinkBehaviour({ download: false }).download).toBe(false);
  });

  it("linkClasses forces the underline for inline links", () => {
    expect(linkClasses({ underline: "none" })).toContain("underline");
    expect(linkClasses({ standalone: true, underline: "none" })).toContain("no-underline");
  });
});
