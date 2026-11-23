import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toolbar } from "./Toolbar";

describe("Toolbar.Link", () => {
  it("uses the shared link focus ring", () => {
    render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Link href="/help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByRole("link", { name: "Help" });
    expect(link).toHaveAttribute("data-slot", "toolbar-link");
    expect(link).toHaveClass("focus-visible:sp-focus-ring");
    expect(link.className).not.toContain("outline-neutral-900");
    expect(link).not.toHaveAttribute("rel");
  });

  it("keeps its own rounded-md corners (the ring doesn't bring Link's small radius)", () => {
    render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Link href="/help">Help</Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByRole("link", { name: "Help" });
    expect(link).toHaveClass("rounded-md");
    expect(link).not.toHaveClass("rounded-sm");
  });

  it("keeps a function className alongside the shared classes (GEO-958)", () => {
    render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Link href="/help" className={() => "from-state"}>
          Help
        </Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByRole("link", { name: "Help" });
    expect(link).toHaveClass("from-state", "focus-visible:sp-focus-ring", "rounded-md");
  });

  it("a new-tab link gets the icon, hidden text and a merged rel", () => {
    render(
      <Toolbar.Root aria-label="Formatting">
        <Toolbar.Link href="https://example.com" target="_blank" rel="external">
          Docs
        </Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByRole("link", { name: /Docs\s*\(opens in new tab\)/ });
    expect(link).toHaveAttribute("rel", "external noopener noreferrer");
    expect(link.querySelector("svg[aria-hidden=true]")).not.toBeNull();
  });
});
