import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Collapsible } from "./Collapsible";

afterEach(() => {
  vi.restoreAllMocks();
});

function Basic(props: React.ComponentProps<typeof Collapsible.Root>) {
  return (
    <Collapsible.Root {...props}>
      <Collapsible.Trigger>Details</Collapsible.Trigger>
      <Collapsible.Panel>Hidden content</Collapsible.Panel>
    </Collapsible.Root>
  );
}

describe("Collapsible", () => {
  describe("Root + Trigger + Panel", () => {
    it("renders data-slots and a button trigger", () => {
      const { container } = render(<Basic />);
      expect(container.querySelector("[data-slot='collapsible']")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Details" })).toHaveAttribute(
        "data-slot",
        "collapsible-trigger",
      );
    });

    it("toggles open on click and links trigger to panel", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      const trigger = screen.getByRole("button", { name: "Details" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByText("Hidden content")).toBeVisible();
      const panel = screen.getByText("Hidden content").closest("[data-slot='collapsible-panel']")!;
      expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    });

    it("supports keyboard (Enter / Space)", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      const trigger = screen.getByRole("button", { name: "Details" });
      trigger.focus();
      await user.keyboard("{Enter}");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await user.keyboard(" ");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("works controlled", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { rerender } = render(<Basic open={false} onOpenChange={onOpenChange} />);
      await user.click(screen.getByRole("button"));
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
      rerender(<Basic open onOpenChange={onOpenChange} />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });

    it("respects defaultOpen", () => {
      render(<Basic defaultOpen />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });

    it("does not toggle when disabled", async () => {
      const user = userEvent.setup();
      render(<Basic disabled />);
      const trigger = screen.getByRole("button");
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("data-disabled");
    });

    it("calls onOpenChangeComplete after toggling", async () => {
      const user = userEvent.setup();
      const onOpenChangeComplete = vi.fn();
      render(<Basic onOpenChangeComplete={onOpenChangeComplete} />);
      await user.click(screen.getByRole("button"));
      await waitFor(() => expect(onOpenChangeComplete).toHaveBeenCalledWith(true));
    });

    it("sets transition duration / easing variables", () => {
      const { container } = render(<Basic transitionDuration={400} transitionEasing="linear" />);
      const root = container.firstElementChild as HTMLElement;
      expect(root.style.getPropertyValue("--sp-collapsible-duration")).toBe("400ms");
      expect(root.style.getPropertyValue("--sp-collapsible-easing")).toBe("linear");
    });
  });

  describe("Panel", () => {
    it("is hidden until found by default (find-in-page)", () => {
      render(<Basic />);
      const panel = screen.getByText("Hidden content").closest("[data-slot='collapsible-panel']");
      expect(panel).toHaveAttribute("hidden", "until-found");
    });

    it("unmounts when closed with hiddenUntilFound={false}", () => {
      render(
        <Collapsible.Root>
          <Collapsible.Trigger>Details</Collapsible.Trigger>
          <Collapsible.Panel hiddenUntilFound={false}>Hidden content</Collapsible.Panel>
        </Collapsible.Root>,
      );
      expect(screen.queryByText("Hidden content")).toBeNull();
    });

    it("can be a region labelled by the trigger", () => {
      render(
        <Collapsible.Root defaultOpen>
          <Collapsible.Trigger>Shipping</Collapsible.Trigger>
          <Collapsible.Panel role="region">Ships in 2 days</Collapsible.Panel>
        </Collapsible.Root>,
      );
      expect(screen.getByRole("region", { name: "Shipping" })).toHaveTextContent("Ships in 2 days");
    });

    it("stays labelled when the Trigger has a custom id", () => {
      render(
        <Collapsible.Root defaultOpen>
          <Collapsible.Trigger id="shipping-trigger">Shipping</Collapsible.Trigger>
          <Collapsible.Panel role="region">Ships in 2 days</Collapsible.Panel>
        </Collapsible.Root>,
      );
      const region = screen.getByRole("region", { name: "Shipping" });
      expect(region).toHaveAttribute("aria-labelledby", "shipping-trigger");
    });

    it("wraps content in a padded content slot", () => {
      render(<Basic defaultOpen size="lg" />);
      const content = screen.getByText("Hidden content");
      expect(content).toHaveAttribute("data-slot", "collapsible-content");
      expect(content.className).toContain("px-4");
    });

    it("adds opacity animation classes with animateOpacity", () => {
      render(<Basic defaultOpen animateOpacity />);
      const panel = screen.getByText("Hidden content").parentElement!;
      expect(panel.className).toContain("data-[starting-style]:opacity-0");
    });

    it("animates width when horizontal", () => {
      render(<Basic defaultOpen orientation="horizontal" />);
      const panel = screen.getByText("Hidden content").parentElement!;
      expect(panel.className).toContain("w-[var(--collapsible-panel-width)]");
    });
  });

  describe("Trigger", () => {
    it("renders a decorative chevron at the end by default", () => {
      render(<Basic />);
      const trigger = screen.getByRole("button");
      const icon = trigger.querySelector("[data-slot='collapsible-icon']")!;
      expect(icon).toHaveAttribute("aria-hidden", "true");
      expect(trigger.lastElementChild).toBe(icon);
    });

    it("puts the icon first with iconPosition='start'", () => {
      render(
        <Collapsible.Root>
          <Collapsible.Trigger iconPosition="start">Folder</Collapsible.Trigger>
        </Collapsible.Root>,
      );
      const trigger = screen.getByRole("button");
      expect(trigger.firstElementChild).toHaveAttribute("data-slot", "collapsible-icon");
    });

    it("hides the icon with icon={null}", () => {
      render(
        <Collapsible.Root>
          <Collapsible.Trigger icon={null}>Plain</Collapsible.Trigger>
        </Collapsible.Root>,
      );
      expect(screen.getByRole("button").querySelector("[data-slot='collapsible-icon']")).toBeNull();
    });

    it("swaps icons by state with an icon function", async () => {
      const user = userEvent.setup();
      render(
        <Collapsible.Root>
          <Collapsible.Trigger icon={(open) => (open ? "−" : "+")}>More</Collapsible.Trigger>
        </Collapsible.Root>,
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("+");
      await user.click(trigger);
      expect(trigger).toHaveTextContent("−");
    });

    it("wraps the trigger in a heading with headingLevel", () => {
      render(
        <Collapsible.Root>
          <Collapsible.Trigger headingLevel={3}>Billing</Collapsible.Trigger>
        </Collapsible.Root>,
      );
      const heading = screen.getByRole("heading", { level: 3, name: "Billing" });
      expect(heading).toContainElement(screen.getByRole("button", { name: "Billing" }));
    });

    it("switches the accessible name of an icon-only trigger by state", async () => {
      const user = userEvent.setup();
      render(
        <Collapsible.Root>
          <Collapsible.Header>
            <span>Notes</span>
            <Collapsible.Trigger closedLabel="Expand notes" openLabel="Collapse notes" />
          </Collapsible.Header>
        </Collapsible.Root>,
      );
      await user.click(screen.getByRole("button", { name: "Expand notes" }));
      expect(screen.getByRole("button", { name: "Collapse notes" })).toBeInTheDocument();
    });

    it("prefers state labels over a static aria-label", async () => {
      const user = userEvent.setup();
      render(
        <Collapsible.Root>
          <Collapsible.Trigger
            aria-label="Notes"
            closedLabel="Expand notes"
            openLabel="Collapse notes"
          />
        </Collapsible.Root>,
      );
      await user.click(screen.getByRole("button", { name: "Expand notes" }));
      expect(screen.getByRole("button", { name: "Collapse notes" })).toBeInTheDocument();
    });

    it("warns in development when an icon-only trigger has no name", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <Collapsible.Root>
          <Collapsible.Trigger />
        </Collapsible.Root>,
      );
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
    });

    it("does not warn for a named icon-only trigger", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(
        <Collapsible.Root>
          <Collapsible.Trigger aria-label="Toggle notes" />
        </Collapsible.Root>,
      );
      expect(warn).not.toHaveBeenCalled();
    });

    it("applies size and variant classes", () => {
      render(
        <Collapsible.Root size="sm" variant="ghost">
          <Collapsible.Trigger>Small</Collapsible.Trigger>
        </Collapsible.Root>,
      );
      const cls = screen.getByRole("button").className;
      expect(cls).toContain("min-h-[var(--sp-control-height-sm)]");
      expect(cls).toContain("!px-0");
    });

    it("throws a helpful error outside Root", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<Collapsible.Trigger>x</Collapsible.Trigger>)).toThrow(
        /must be used inside Collapsible.Root/,
      );
    });
  });

  describe("Show more", () => {
    function mockSizes(contentHeight: number, collapsed: number) {
      vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(contentHeight);
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        height: collapsed,
      } as DOMRect);
    }

    function ShowMoreExample(props: React.ComponentProps<typeof Collapsible.Root>) {
      return (
        <Collapsible.Root {...props}>
          <Collapsible.Panel collapsedHeight={100}>
            <p>Long text</p>
            <a href="#deep">Deep link</a>
          </Collapsible.Panel>
          <Collapsible.ShowMore />
        </Collapsible.Root>
      );
    }

    it("shows a partial preview with a fade and a toggle", async () => {
      mockSizes(500, 100);
      render(<ShowMoreExample />);
      const toggle = await screen.findByRole("button", { name: /show more/i });
      const panel = screen
        .getByText("Long text")
        .closest("[data-slot='collapsible-panel']") as HTMLElement;
      expect(panel.style.height).toBe("100px");
      expect(panel.className).toContain("mask-image");
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(toggle).toHaveAttribute("aria-controls", panel.id);
    });

    it("expands to full height and switches the label", async () => {
      mockSizes(500, 100);
      const user = userEvent.setup();
      render(<ShowMoreExample />);
      await user.click(await screen.findByRole("button", { name: /show more/i }));
      const toggle = screen.getByRole("button", { name: /show less/i });
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      const panel = screen
        .getByText("Long text")
        .closest("[data-slot='collapsible-panel']") as HTMLElement;
      expect(panel.style.height).toBe("500px");
      expect(panel.className).not.toContain("mask-image");
    });

    it("hides the toggle and fade when content fits", async () => {
      mockSizes(80, 100);
      render(<ShowMoreExample />);
      await waitFor(() => expect(screen.queryByRole("button")).toBeNull());
      const panel = screen
        .getByText("Long text")
        .closest("[data-slot='collapsible-panel']") as HTMLElement;
      expect(panel.className).not.toContain("mask-image");
    });

    it("expands when keyboard focus enters the clipped content", async () => {
      mockSizes(500, 100);
      const onOpenChange = vi.fn();
      render(<ShowMoreExample onOpenChange={onOpenChange} />);
      await screen.findByRole("button", { name: /show more/i });
      screen.getByRole("link", { name: "Deep link" }).focus();
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /show less/i })).toBeInTheDocument(),
      );
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: "none" }));
    });

    it("still expands on focus when the consumer passes onFocus", async () => {
      mockSizes(500, 100);
      const onFocus = vi.fn();
      render(
        <Collapsible.Root>
          <Collapsible.Panel collapsedHeight={100} onFocus={onFocus}>
            <a href="#deep">Deep link</a>
          </Collapsible.Panel>
          <Collapsible.ShowMore />
        </Collapsible.Root>,
      );
      await screen.findByRole("button", { name: /show more/i });
      screen.getByRole("link", { name: "Deep link" }).focus();
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /show less/i })).toBeInTheDocument(),
      );
      expect(onFocus).toHaveBeenCalled();
    });

    it("gives Trigger and ShowMore distinct ids", async () => {
      mockSizes(500, 100);
      const { container } = render(
        <Collapsible.Root>
          <Collapsible.Trigger>Review</Collapsible.Trigger>
          <Collapsible.Panel collapsedHeight={100}>Text</Collapsible.Panel>
          <Collapsible.ShowMore />
        </Collapsible.Root>,
      );
      await screen.findByRole("button", { name: /show more/i });
      const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("uses custom labels", async () => {
      mockSizes(500, 100);
      render(
        <Collapsible.Root>
          <Collapsible.Panel collapsedHeight={100}>Text</Collapsible.Panel>
          <Collapsible.ShowMore showLabel="Read full review" hideLabel="Hide review" />
        </Collapsible.Root>,
      );
      expect(await screen.findByRole("button", { name: /read full review/i })).toBeInTheDocument();
    });
  });
});
