import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { SkipLink } from "./SkipLink";

function Page({ link, main }: { link?: React.ReactNode; main?: React.ReactNode }) {
  return (
    <>
      {link ?? <SkipLink />}
      <nav aria-label="Main">
        <a href="/books">Books</a>
      </nav>
      {main ?? (
        <main id="main-content">
          <a href="/catalogue">Catalogue</a>
        </main>
      )}
    </>
  );
}

const link = () => screen.getByRole("link", { name: "Skip to main content" });

afterEach(() => {
  window.history.replaceState(null, "", "/");
  vi.restoreAllMocks();
});

describe("SkipLink", () => {
  it("is the first link, pointing at #main-content, with translatable text", () => {
    render(<Page />);
    expect(link()).toHaveAttribute("href", "#main-content");
    expect(link()).toHaveAttribute("data-slot", "skip-link");
    render(<SkipLink>Neidio i’r prif gynnwys</SkipLink>);
    expect(screen.getByRole("link", { name: "Neidio i’r prif gynnwys" })).toBeInTheDocument();
  });

  it("is hidden off-screen, never with display:none or the hidden attribute", () => {
    render(<Page />);
    expect(link()).not.toHaveAttribute("hidden");
    expect(link().className).toMatch(/opacity-0/);
    expect(link().className).toMatch(/focus:opacity-100/);
    expect(link().className).not.toMatch(/(^|\s)(hidden|invisible)(\s|$)/);
  });

  it("is the first stop in the tab order", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.tab();
    expect(link()).toHaveFocus();
  });

  it("moves focus to the target with a temporary tabindex, removed on blur", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const main = screen.getByRole("main");
    await user.click(link());
    expect(main).toHaveFocus();
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(main.style.outlineStyle).toBe("none");
    // The next Tab continues from the main content
    await user.tab();
    expect(screen.getByRole("link", { name: "Catalogue" })).toHaveFocus();
    expect(main).not.toHaveAttribute("tabindex");
    expect(main.style.outlineStyle).toBe("");
  });

  it("keeps a tabindex the target already had", async () => {
    const user = userEvent.setup();
    render(
      <Page
        main={
          <main id="main-content" tabIndex={-1}>
            Content
          </main>
        }
      />,
    );
    const main = screen.getByRole("main");
    await user.click(link());
    expect(main).toHaveFocus();
    main.blur();
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  it("supports a custom href", async () => {
    const user = userEvent.setup();
    render(
      <Page
        link={<SkipLink href="#search">Skip to search</SkipLink>}
        main={<section id="search" aria-label="Search" />}
      />,
    );
    await user.click(screen.getByRole("link", { name: "Skip to search" }));
    expect(screen.getByRole("region", { name: "Search" })).toHaveFocus();
  });

  it("lets the browser update the hash by default", () => {
    render(<Page />);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("updateHash={false} cancels navigation, scrolls and focuses by hand", () => {
    render(<Page link={<SkipLink updateHash={false} />} />);
    const main = screen.getByRole("main");
    const scroll = vi.fn();
    main.scrollIntoView = scroll;
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(scroll).toHaveBeenCalled();
    expect(main).toHaveFocus();
  });

  it("warns in development when the target is missing, and stays a plain link", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Page main={<main>No id</main>} />);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link().dispatchEvent(event);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"#main-content"'));
    expect(event.defaultPrevented).toBe(false);
  });

  it("leaves links to another page alone", () => {
    render(<Page link={<SkipLink href="/other#main-content" />} />);
    const main = screen.getByRole("main");
    fireEvent.click(link());
    expect(main).not.toHaveFocus();
    expect(main).not.toHaveAttribute("tabindex");
  });

  it("a consumer onClick can cancel it", () => {
    render(<Page link={<SkipLink onClick={(e) => e.preventDefault()} />} />);
    fireEvent.click(link());
    expect(screen.getByRole("main")).not.toHaveFocus();
  });

  it("render swaps the link element", () => {
    render(
      <SkipLink
        render={(props) => (
          <a {...props} data-router="">
            {props.children}
          </a>
        )}
      />,
    );
    expect(link()).toHaveAttribute("data-router");
  });

  it("renders on the server", () => {
    expect(() => renderToString(<Page />)).not.toThrow();
  });
});

describe("SkipLink sign-off regressions", () => {
  it("updateHash={false} keeps the hash even when the target is missing", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Page link={<SkipLink updateHash={false} />} main={<main>No id</main>} />);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("a second activation while the target has focus doesn't lose its outline", async () => {
    const user = userEvent.setup();
    render(<Page />);
    const main = screen.getByRole("main");
    fireEvent.click(link());
    expect(main).toHaveFocus();
    fireEvent.click(link()); // e.g. screen-reader browse mode: focus never left main
    await user.tab();
    expect(main.style.outlineStyle).toBe("");
    expect(main).not.toHaveAttribute("tabindex");
  });

  it("undoes everything when the target can't take focus", () => {
    render(<Page main={<main id="main-content" inert />} />);
    const main = screen.getByRole("main", { hidden: true });
    vi.spyOn(main, "focus").mockImplementation(() => {});
    fireEvent.click(link());
    expect(main).not.toHaveAttribute("tabindex");
    expect(main).not.toHaveAttribute("data-skip-link-focused");
    expect(main.style.outlineStyle).toBe("");
  });

  it("a link with a different query string is another page", () => {
    window.history.replaceState(null, "", "/?lang=en");
    render(<Page link={<SkipLink href="?lang=cy#main-content" />} />);
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    link().dispatchEvent(event);
    expect(screen.getByRole("main")).not.toHaveFocus();
  });

  it("a page URL with a query string still matches a bare hash", () => {
    window.history.replaceState(null, "", "/?q=books");
    render(<Page />);
    fireEvent.click(link());
    expect(screen.getByRole("main")).toHaveFocus();
  });

  it("a malformed escape in the hash doesn't throw", () => {
    render(<Page link={<SkipLink href="#100%" />} main={<main id="100%">Content</main>} />);
    expect(() => fireEvent.click(link())).not.toThrow();
    expect(screen.getByRole("main")).toHaveFocus();
  });

  it("uses an href set on a render element", () => {
    render(
      <Page
        link={<SkipLink render={<a href="#search">Skip to search</a>} />}
        main={<section id="search" aria-label="Search" />}
      />,
    );
    fireEvent.click(screen.getByRole("link", { name: "Skip to search" }));
    expect(screen.getByRole("region", { name: "Search" })).toHaveFocus();
  });

  it("the hidden link can't catch taps", () => {
    render(<SkipLink />);
    expect(link().className).toMatch(/pointer-events-none/);
    expect(link().className).toMatch(/focus:pointer-events-auto/);
  });

  it("forwards its ref to the anchor", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<SkipLink ref={ref} />);
    expect(ref.current).toBe(link());
  });

  it("Target keeps a consumer tabIndex and takes a numeric scrollMargin", () => {
    render(<SkipLink.Target tabIndex={0} scrollMargin={64} />);
    const target = document.querySelector<HTMLElement>("[data-slot=skip-link-target]")!;
    expect(target).toHaveAttribute("tabindex", "0");
    expect(target.style.scrollMarginTop).toBe("64px");
  });
});

describe("SkipLink.Target", () => {
  it("renders the landing point with the default id, tabindex -1 and scroll margin", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <SkipLink.Target scrollMargin="4rem" />
      </>,
    );
    const target = document.querySelector<HTMLElement>("[data-slot=skip-link-target]")!;
    expect(target).toHaveAttribute("id", "main-content");
    expect(target).toHaveAttribute("tabindex", "-1");
    expect(target.style.scrollMarginTop).toBe("4rem");
    await user.click(link());
    expect(target).toHaveFocus();
  });

  it("can render as the main element", () => {
    render(<SkipLink.Target render={<main />}>Content</SkipLink.Target>);
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });
});
