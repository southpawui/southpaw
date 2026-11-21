import * as React from "react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "./Accordion";

afterEach(() => {
  vi.restoreAllMocks();
  window.sessionStorage.clear();
});

type RootProps = React.ComponentProps<typeof Accordion.Root>;

function Basic({
  itemProps,
  ...props
}: RootProps & { itemProps?: Partial<React.ComponentProps<typeof Accordion.Item>>[] }) {
  return (
    <Accordion.Root {...props}>
      {["One", "Two", "Three"].map((title, i) => (
        <Accordion.Item key={title} value={title.toLowerCase()} {...itemProps?.[i]}>
          <Accordion.Header>
            <Accordion.Trigger>{title}</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>{title} content</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}

const trigger = (name: string | RegExp) => screen.getByRole("button", { name });

describe("Accordion", () => {
  describe("structure", () => {
    it("renders data-slots, an h3 heading per item and button triggers", () => {
      const { container } = render(<Basic />);
      expect(container.querySelector("[data-slot='accordion']")).toBeInTheDocument();
      expect(container.querySelectorAll("[data-slot='accordion-item']")).toHaveLength(3);
      const headings = screen.getAllByRole("heading", { level: 3 });
      expect(headings).toHaveLength(3);
      expect(headings[0]).toContainElement(trigger("One"));
      expect(trigger("One")).toHaveAttribute("data-slot", "accordion-trigger");
    });

    it("supports headingLevel on Root and level per Header", () => {
      render(
        <Accordion.Root headingLevel={2}>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>A</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header level={4}>
              <Accordion.Trigger>B</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("A");
      expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent("B");
    });

    it("throws when parts are used outside Root", () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      expect(() => render(<Accordion.Item />)).toThrow(/inside Accordion.Root/);
    });
  });

  describe("opening", () => {
    it("toggles on click and links trigger to panel", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
      await user.click(trigger("One"));
      expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
      const panel = screen.getByText("One content").closest("[data-slot='accordion-panel']")!;
      expect(trigger("One").getAttribute("aria-controls")).toBe(panel.id);
    });

    it("single mode closes the other item; multiple keeps both", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<Basic defaultValue={["one"]} />);
      await user.click(trigger("Two"));
      expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
      expect(trigger("Two")).toHaveAttribute("aria-expanded", "true");
      unmount();
      render(<Basic multiple defaultValue={["one"]} />);
      await user.click(trigger("Two"));
      expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
      expect(trigger("Two")).toHaveAttribute("aria-expanded", "true");
    });

    it("works controlled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      function Controlled() {
        const [value, setValue] = React.useState<unknown[]>(["two"]);
        return (
          <Basic
            value={value}
            onValueChange={(v, d) => {
              onValueChange(v, d);
              setValue(v);
            }}
          />
        );
      }
      render(<Controlled />);
      expect(trigger("Two")).toHaveAttribute("aria-expanded", "true");
      await user.click(trigger("Three"));
      expect(onValueChange).toHaveBeenCalledWith(["three"], expect.anything());
      expect(trigger("Three")).toHaveAttribute("aria-expanded", "true");
    });

    it("Enter and Space toggle", async () => {
      const user = userEvent.setup();
      render(<Basic multiple />);
      trigger("One").focus();
      await user.keyboard("{Enter}");
      expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
      await user.keyboard(" ");
      expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
    });

    it("disabled items and roots don't toggle", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<Basic itemProps={[{ disabled: true }]} />);
      await user.click(trigger("One"));
      expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
      expect(trigger("One")).toHaveAttribute("data-disabled");
      unmount();
      render(<Basic disabled />);
      await user.click(trigger("Two"));
      expect(trigger("Two")).toHaveAttribute("aria-expanded", "false");
    });

    it("Item onOpenChangeComplete fires after the change (no transition in jsdom)", async () => {
      const user = userEvent.setup();
      const done = vi.fn();
      render(<Basic itemProps={[{ onOpenChangeComplete: done }]} />);
      await user.click(trigger("One"));
      await waitFor(() => expect(done).toHaveBeenCalledWith(true));
    });
  });

  describe("collapsible={false}", () => {
    it("keeps the last open item open and marks its trigger aria-disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Basic collapsible={false} defaultValue={["one"]} onValueChange={onValueChange} />);
      expect(trigger("One")).toHaveAttribute("aria-disabled", "true");
      await user.click(trigger("One"));
      expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
      expect(onValueChange).not.toHaveBeenCalled();
      await user.click(trigger("Two"));
      expect(trigger("Two")).toHaveAttribute("aria-expanded", "true");
      expect(trigger("One")).not.toHaveAttribute("aria-disabled");
    });
  });

  describe("panels", () => {
    it("defaults to hidden=until-found so find-in-page can open panels", () => {
      render(<Basic />);
      const panel = screen.getByText("One content").closest("[data-slot='accordion-panel']")!;
      expect(panel).toHaveAttribute("hidden", "until-found");
    });

    it("hiddenUntilFound={false} unmounts closed panels", () => {
      render(<Basic hiddenUntilFound={false} />);
      expect(screen.queryByText("One content")).not.toBeInTheDocument();
    });

    it("has no region role by default; regions adds it, labelled by the trigger", () => {
      const { unmount } = render(<Basic defaultValue={["one"]} />);
      expect(screen.queryByRole("region")).not.toBeInTheDocument();
      const panel = screen.getByText("One content").closest("[data-slot='accordion-panel']")!;
      expect(panel).not.toHaveAttribute("aria-labelledby");
      unmount();
      render(<Basic regions defaultValue={["one"]} />);
      expect(screen.getByRole("region", { name: "One" })).toHaveTextContent("One content");
    });

    it("animates height via the Base UI css var and puts padding on an inner content slot", () => {
      render(<Basic defaultValue={["one"]} />);
      const panel = screen.getByText("One content").closest("[data-slot='accordion-panel']")!;
      expect(panel.className).toContain("h-[var(--accordion-panel-height)]");
      expect(screen.getByText("One content")).toHaveAttribute("data-slot", "accordion-content");
    });

    it("exposes duration/easing overrides as css vars", () => {
      const { container } = render(<Basic transitionDuration={400} transitionEasing="linear" />);
      const root = container.querySelector<HTMLElement>("[data-slot='accordion']")!;
      expect(root.style.getPropertyValue("--sp-collapsible-duration")).toBe("400ms");
      expect(root.style.getPropertyValue("--sp-collapsible-easing")).toBe("linear");
    });
  });

  describe("trigger content", () => {
    it("renders summary, leading icon and state text, with summary and state text in the name", async () => {
      const user = userEvent.setup();
      render(
        <Accordion.Root stateText>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger summary="Visa ending 4242" leadingIcon={<svg />}>
                Payment
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel>Card</Accordion.Panel>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const btn = trigger(/Payment/);
      expect(btn).toHaveAccessibleName("Payment Visa ending 4242 Show");
      expect(btn.querySelector("[data-slot='accordion-leading-icon']")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      await user.click(btn);
      expect(btn).toHaveAccessibleName("Payment Visa ending 4242 Hide");
    });

    it("localises state text", () => {
      render(<Basic stateText={{ closed: "Mostrar", open: "Ocultar" }} />);
      expect(trigger(/One/)).toHaveAccessibleName("One Mostrar");
    });

    it("supports icon position, function icons and hidden icons", () => {
      render(
        <Accordion.Root iconPosition="start" defaultValue={["b"]}>
          <Accordion.Item value="a">
            <Accordion.Header>
              <Accordion.Trigger>A</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item value="b">
            <Accordion.Header>
              <Accordion.Trigger icon={(open) => (open ? "−" : "+")}>B</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
          <Accordion.Item value="c">
            <Accordion.Header>
              <Accordion.Trigger icon={null}>C</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      expect(trigger("A").firstElementChild).toHaveAttribute("data-slot", "accordion-icon");
      expect(trigger("B").querySelector("[data-slot='accordion-icon']")).toHaveTextContent("−");
      expect(trigger("C").querySelector("[data-slot='accordion-icon']")).toBeNull();
    });

    it("header actions sit beside the heading, not inside it", () => {
      render(
        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Header actions={<button type="button">Edit</button>}>
              <Accordion.Trigger>Address</Accordion.Trigger>
            </Accordion.Header>
          </Accordion.Item>
        </Accordion.Root>,
      );
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).not.toContainElement(trigger("Edit"));
      expect(heading.parentElement).toHaveAttribute("data-slot", "accordion-header-row");
    });
  });

  describe("expand all", () => {
    it("opens and closes every enabled item, with localisable labels", async () => {
      const user = userEvent.setup();
      render(
        <Basic
          multiple
          expandAll={{ expandLabel: "Open all", collapseLabel: "Close all" }}
          itemProps={[{}, {}, { disabled: true }]}
        />,
      );
      const toggle = trigger("Open all");
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      await user.click(toggle);
      expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
      expect(trigger("Two")).toHaveAttribute("aria-expanded", "true");
      expect(trigger("Three")).toHaveAttribute("aria-expanded", "false");
      expect(trigger("Close all")).toHaveAttribute("aria-expanded", "true");
      await user.click(trigger("Close all"));
      expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
    });

    it("flips to 'hide' once every item is opened by hand", async () => {
      const user = userEvent.setup();
      render(<Basic multiple expandAll />);
      for (const name of ["One", "Two", "Three"]) await user.click(trigger(name));
      expect(trigger("Hide all sections")).toBeInTheDocument();
    });

    it("isn't rendered (and warns) without multiple", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<Basic expandAll />);
      expect(screen.queryByRole("button", { name: /all sections/ })).not.toBeInTheDocument();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("`expandAll` needs `multiple`"));
    });
  });

  describe("expand all — edge cases", () => {
    it("is disabled when the Root is disabled", async () => {
      const user = userEvent.setup();
      render(<Basic multiple expandAll disabled />);
      const toggle = trigger("Show all sections");
      expect(toggle).toBeDisabled();
      await user.click(toggle);
      expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
    });

    it("with collapsible={false}, 'hide all' keeps the first open section", async () => {
      const user = userEvent.setup();
      render(<Basic multiple expandAll collapsible={false} defaultValue={["two"]} />);
      await user.click(trigger("Show all sections"));
      await user.click(trigger("Hide all sections"));
      expect(trigger("Two")).toHaveAttribute("aria-expanded", "true");
      expect(trigger("One")).toHaveAttribute("aria-expanded", "false");
      expect(trigger("Three")).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("default variant dividers", () => {
    it("hides the lines around a hovered header via item selectors (top borders)", () => {
      const { container } = render(<Basic />);
      const item = container.querySelector("[data-slot='accordion-item']")!;
      expect(item.className).toContain("border-t");
      expect(item.className).toContain("first:border-t-0");
      // own line (above) and the next item's line (below) go transparent on hover
      expect(item.className).toMatch(/\[&:has\(.*:hover.*\)\]:border-t-transparent/);
      expect(item.className).toMatch(
        /:not\(\[data-open\]\):has\(.*:hover.*\)\+&\]:border-t-transparent/,
      );
    });
  });

  describe("keyboardNavigation", () => {
    it("is off by default: arrow keys don't move focus", async () => {
      const user = userEvent.setup();
      render(<Basic />);
      trigger("One").focus();
      await user.keyboard("{ArrowDown}");
      expect(trigger("One")).toHaveFocus();
    });

    it("moves with arrows (looping), Home and End, skipping disabled items", async () => {
      const user = userEvent.setup();
      render(<Basic keyboardNavigation itemProps={[{}, { disabled: true }, {}]} />);
      trigger("One").focus();
      await user.keyboard("{ArrowDown}");
      expect(trigger("Three")).toHaveFocus();
      await user.keyboard("{ArrowDown}");
      expect(trigger("One")).toHaveFocus();
      await user.keyboard("{ArrowUp}");
      expect(trigger("Three")).toHaveFocus();
      await user.keyboard("{Home}");
      expect(trigger("One")).toHaveFocus();
      await user.keyboard("{End}");
      expect(trigger("Three")).toHaveFocus();
    });
  });

  describe("rememberKey", () => {
    beforeEach(() => window.sessionStorage.clear());

    it("stores open items and restores them on the next mount", async () => {
      const user = userEvent.setup();
      const { unmount } = render(<Basic multiple rememberKey="faq" />);
      await user.click(trigger("Two"));
      expect(JSON.parse(window.sessionStorage.getItem("sp-accordion:faq")!)).toEqual(["two"]);
      unmount();
      render(<Basic multiple rememberKey="faq" />);
      expect(trigger("Two")).toHaveAttribute("aria-expanded", "true");
    });

    it("doesn't write when controlled", async () => {
      const user = userEvent.setup();
      function Controlled() {
        const [value, setValue] = React.useState<unknown[]>([]);
        return <Basic value={value} onValueChange={setValue} rememberKey="faq" />;
      }
      render(<Controlled />);
      await user.click(trigger("One"));
      expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
      expect(window.sessionStorage.getItem("sp-accordion:faq")).toBeNull();
    });

    it("survives blocked storage", async () => {
      const user = userEvent.setup();
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("blocked");
      });
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("blocked");
      });
      render(<Basic rememberKey="faq" />);
      await user.click(trigger("One"));
      expect(trigger("One")).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("ordered", () => {
    it("renders an <ol> of <li> items with a hidden number", () => {
      const { container } = render(<Basic ordered />);
      const list = screen.getByRole("list");
      expect(list.tagName).toBe("OL");
      expect(screen.getAllByRole("listitem")).toHaveLength(3);
      expect(container.querySelector("[data-slot='accordion-number']")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      expect(trigger("One")).toHaveAccessibleName("One");
    });
  });

  describe("variants and sizes", () => {
    it("applies variant and size data attributes and classes", () => {
      const { container } = render(<Basic variant="separated" size="lg" />);
      const root = container.querySelector("[data-slot='accordion']")!;
      expect(root).toHaveAttribute("data-variant", "separated");
      expect(root).toHaveAttribute("data-size", "lg");
      expect(root.className).toContain("gap-2");
      expect(trigger("One").className).toContain("min-h-[var(--sp-control-height-lg)]");
    });
  });

  describe("Skeleton", () => {
    it("renders a status with an accessible label and decorative rows", () => {
      const { container } = render(<Accordion.Skeleton count={4} label="Loading FAQs" />);
      expect(screen.getByRole("status")).toHaveTextContent("Loading FAQs");
      expect(container.querySelectorAll("[data-slot='accordion-skeleton-item']")).toHaveLength(4);
    });
  });
});
