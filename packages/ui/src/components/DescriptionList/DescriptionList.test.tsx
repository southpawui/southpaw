import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { DescriptionList, SummaryCard, formatDescriptionValue } from "./DescriptionList";
import { isEmptyValue } from "./format";
import { copyText } from "../../lib/use-copy-to-clipboard";
import { destroyAnnouncer } from "../../lib/announce";

const announcer = () => document.querySelector("[data-slot=announcer]");
// The copy button's tooltip. Not getByText: the shared announcer says "Copied" too, and
// once its 100ms write lands both match (a race that only shows under load).
const tooltip = () => document.querySelector<HTMLElement>("[data-slot=tooltip-popup]")!;

const DL = DescriptionList;

afterEach(() => {
  vi.restoreAllMocks();
  destroyAnnouncer();
});

function Basic(props: React.ComponentProps<typeof DL.Root>) {
  return (
    <DL.Root {...props}>
      <DL.Item>
        <DL.Term>Name</DL.Term>
        <DL.Details>Sarah Philips</DL.Details>
        <DL.Actions>
          <DL.Action href="#name">Change</DL.Action>
        </DL.Actions>
      </DL.Item>
      <DL.Item>
        <DL.Term>Date of birth</DL.Term>
        <DL.Details>5 January 1978</DL.Details>
      </DL.Item>
    </DL.Root>
  );
}

describe("DescriptionList structure", () => {
  it("renders dl > div > dt + dd with slots", () => {
    const { container } = render(<Basic />);
    const dl = container.querySelector("dl")!;
    expect(dl).toHaveAttribute("data-slot", "description-list");
    const rows = dl.querySelectorAll(":scope > div");
    expect(rows).toHaveLength(2);
    expect(rows[0]!.querySelector(":scope > dt")).toHaveTextContent("Name");
    expect(rows[0]!.querySelectorAll(":scope > dd")).toHaveLength(2);
    expect(rows[1]!.querySelectorAll(":scope > dd")).toHaveLength(1);
  });

  it("defaults: responsive, divided, md, muted terms", () => {
    const { container } = render(<Basic />);
    const dl = container.querySelector("dl")!;
    expect(dl).toHaveAttribute("data-orientation", "responsive");
    expect(dl).toHaveAttribute("data-variant", "divided");
    expect(dl.className).toContain("sm:grid-cols-[minmax(0,var(--sp-dl-label-width,30%))");
    const row = dl.querySelector("[data-slot=description-list-item]")!;
    expect(row.className).toContain("sm:grid-cols-subgrid");
    expect(row.className).toContain("not-last:border-b");
    expect(document.querySelector("dt")!.className).toContain("text-fg-muted");
  });

  it("labelStyle strong bolds terms; labelAlign end is logical", () => {
    render(<Basic labelStyle="strong" labelAlign="end" />);
    const dt = document.querySelector("dt")!;
    expect(dt.className).toContain("font-semibold");
    expect(dt.className).toContain("sm:text-end");
  });

  it("labelWidth sets the column variable", () => {
    const { container } = render(<Basic labelWidth={200} />);
    expect(container.querySelector("dl")!.style.getPropertyValue("--sp-dl-label-width")).toBe(
      "200px",
    );
  });

  it("orientation horizontal and vertical", () => {
    const { container, rerender } = render(<Basic orientation="horizontal" />);
    const row = () => container.querySelector("[data-slot=description-list-item]")!;
    expect(row().className).toContain("grid-cols-subgrid");
    expect(row().className).not.toContain("sm:grid");
    rerender(<Basic orientation="vertical" />);
    expect(row().className).toContain("flex-col");
    expect(row().className).not.toContain("subgrid");
  });

  it("variants: bordered boxes the list, striped tints rows, plain has no dividers", () => {
    const { container, rerender } = render(<Basic variant="bordered" />);
    const row = () => container.querySelector("[data-slot=description-list-item]")!;
    expect(container.querySelector("dl")!.className).toContain("border");
    expect(row().className).toContain("px-4");
    rerender(<Basic variant="striped" />);
    expect(row().className).toContain("odd:bg-surface-alternate");
    expect(row().className).toContain("forced-colors:not-last:border-b");
    rerender(<Basic variant="plain" />);
    expect(row().className).not.toContain("border-b");
  });

  it("divider={false} drops one row's divider", () => {
    render(
      <DL.Root>
        <DL.Item divider={false} data-testid="a">
          <DL.Term>A</DL.Term>
          <DL.Details>1</DL.Details>
        </DL.Item>
        <DL.Item data-testid="b">
          <DL.Term>B</DL.Term>
          <DL.Details>2</DL.Details>
        </DL.Item>
      </DL.Root>,
    );
    expect(screen.getByTestId("a").className).not.toContain("border-b");
  });

  it("sizes change text and padding", () => {
    const { container, rerender } = render(<Basic size="sm" />);
    expect(container.querySelector("dl")!.className).toContain("text-sm");
    rerender(<Basic size="lg" />);
    expect(container.querySelector("dl")!.className).toContain("text-lg");
    expect(container.querySelector("[data-slot=description-list-item]")!.className).toContain(
      "py-[calc(var(--sp-control-gap)*2)]",
    );
  });

  it("columns: per-breakpoint grid, rows lay themselves out, span clamps", () => {
    const { container } = render(
      <DL.Root columns={{ base: 1, md: 3 }}>
        <DL.Item span={2} data-testid="wide">
          <DL.Term>A</DL.Term>
          <DL.Details>1</DL.Details>
        </DL.Item>
        <DL.Item span="full" data-testid="full">
          <DL.Term>B</DL.Term>
          <DL.Details>2</DL.Details>
        </DL.Item>
      </DL.Root>,
    );
    const dl = container.querySelector("dl")!;
    expect(dl.className).toContain("grid-cols-1");
    expect(dl.className).toContain("md:grid-cols-3");
    const wide = screen.getByTestId("wide");
    expect(wide.className).not.toContain("subgrid");
    // base and sm have one column, so the span is clamped to 1 there
    expect(wide.className).toContain("col-span-1");
    expect(wide.className).toContain("md:col-span-2");
    expect(screen.getByTestId("full").className).toContain("col-span-full");
  });

  it("hideEmpty leaves out rows whose values are all empty", () => {
    render(
      <DL.Root
        hideEmpty
        items={[{ term: "Shown", details: "x" }, { term: "Missing" }, { term: "Blank", value: "" }]}
      >
        <DL.Item>
          <DL.Term>Also missing</DL.Term>
          <DL.Details />
          <DL.Details value={[]} />
        </DL.Item>
        <DL.Item hideEmpty={false}>
          <DL.Term>Kept</DL.Term>
          <DL.Details />
        </DL.Item>
        <DL.Item>
          <DL.Term>Partly filled</DL.Term>
          <DL.Details />
          <DL.Details>07700 900457</DL.Details>
        </DL.Item>
      </DL.Root>,
    );
    const terms = Array.from(document.querySelectorAll("dt")).map((dt) => dt.textContent);
    expect(terms).toEqual(["Shown", "Kept", "Partly filled"]);
  });

  it("an Item can opt in to hideEmpty on its own", () => {
    render(
      <DL.Root>
        <DL.Item hideEmpty>
          <DL.Term>Gone</DL.Term>
          <DL.Details />
        </DL.Item>
      </DL.Root>,
    );
    expect(document.querySelector("dt")).toBeNull();
  });

  it("a standalone Item is its own dl", () => {
    const { container } = render(
      <DL.Item>
        <DL.Term>Status</DL.Term>
        <DL.Details>Active</DL.Details>
      </DL.Item>,
    );
    const dl = container.firstElementChild!;
    expect(dl.tagName).toBe("DL");
    expect(dl).toHaveAttribute("data-standalone");
  });

  it("several Details per Term are allowed", () => {
    const { container } = render(
      <DL.Root>
        <DL.Item>
          <DL.Term>Phone</DL.Term>
          <DL.Details>01234 567890</DL.Details>
          <DL.Details>07700 900457</DL.Details>
        </DL.Item>
      </DL.Root>,
    );
    expect(container.querySelectorAll("dd")).toHaveLength(2);
  });

  it("merges className as a string or function", () => {
    const { container } = render(<Basic className="extra" />);
    expect(container.querySelector("dl")!.className).toContain("extra");
  });

  it("warns when an Item has no Term", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <DL.Root>
        <DL.Item>
          <DL.Details>Orphan</DL.Details>
        </DL.Item>
      </DL.Root>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("has no Term"));
  });
});

describe("Header", () => {
  it("renders above the dl and names it", () => {
    render(
      <DL.Root>
        <DL.Header headingLevel={3}>Personal details</DL.Header>
        <DL.Item>
          <DL.Term>Name</DL.Term>
          <DL.Details>Sarah</DL.Details>
        </DL.Item>
      </DL.Root>,
    );
    const heading = screen.getByRole("heading", { level: 3, name: "Personal details" });
    const dl = document.querySelector("dl")!;
    expect(dl).toHaveAttribute("aria-labelledby", heading.id);
    expect(dl.contains(heading)).toBe(false);
    expect(dl.parentElement).toHaveAttribute("data-slot", "description-list-container");
  });

  it("defaults to h2; header actions get the title as context", () => {
    render(
      <DL.Root>
        <DL.Header actions={<DL.Action href="#e">Edit</DL.Action>}>Contact</DL.Header>
      </DL.Root>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Edit\s*\(Contact\)$/ })).toBeInTheDocument();
  });

  it("aria-label wins over the header", () => {
    render(
      <DL.Root aria-label="Custom">
        <DL.Header>Title</DL.Header>
      </DL.Root>,
    );
    expect(document.querySelector("dl")).not.toHaveAttribute("aria-labelledby");
  });
});

describe("Actions", () => {
  it("adds the term as hidden context", () => {
    render(<Basic />);
    expect(screen.getByRole("link", { name: /^Change\s*Name$/ })).toHaveAttribute("href", "#name");
  });

  it("takes an explicit context, or none", () => {
    render(
      <DL.Root>
        <DL.Item>
          <DL.Term>
            <strong>Email</strong>
          </DL.Term>
          <DL.Details>a@b.c</DL.Details>
          <DL.Actions>
            <DL.Action href="#1" context="email address">
              Change
            </DL.Action>
            <DL.Action href="#2" context={false}>
              Remove all
            </DL.Action>
          </DL.Actions>
        </DL.Item>
      </DL.Root>,
    );
    expect(screen.getByRole("link", { name: /^Change\s*email address$/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Remove all" })).toBeInTheDocument();
  });

  it("reads a nested term from the DOM when it isn't plain text", async () => {
    render(
      <DL.Root>
        <DL.Item>
          <DL.Term>
            <em>Postcode</em>
          </DL.Term>
          <DL.Details>SW1A 1AA</DL.Details>
          <DL.Actions>
            <DL.Action href="#p">Change</DL.Action>
          </DL.Actions>
        </DL.Item>
      </DL.Root>,
    );
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /^Change\s*Postcode$/ })).toBeInTheDocument(),
    );
  });

  it("two or more actions become a list", () => {
    render(
      <DL.Root>
        <DL.Item>
          <DL.Term>Contact</DL.Term>
          <DL.Details>x</DL.Details>
          <DL.Actions>
            <DL.Action href="#a">Change</DL.Action>
            <DL.Action href="#b">Remove</DL.Action>
          </DL.Actions>
        </DL.Item>
      </DL.Root>,
    );
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("data-slot", "description-list-action-list");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /^Remove\s*Contact$/ })).toBeInTheDocument();
  });

  it("one action renders bare", () => {
    render(<Basic />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});

describe("Details", () => {
  it("shows 'Not provided' for missing values, and a custom empty", () => {
    render(
      <DL.Root>
        <DL.Item>
          <DL.Term>A</DL.Term>
          <DL.Details />
        </DL.Item>
        <DL.Item>
          <DL.Term>B</DL.Term>
          <DL.Details value="" empty="None given" />
        </DL.Item>
      </DL.Root>,
    );
    const a = screen.getByText("Not provided");
    expect(a.closest("dd")).toHaveAttribute("data-empty");
    expect(screen.getByText("None given")).toBeInTheDocument();
  });

  it("the empty text is translatable", () => {
    render(
      <DL.Root labels={{ empty: "Heb ei ddarparu" }}>
        <DL.Item>
          <DL.Term>A</DL.Term>
          <DL.Details />
        </DL.Item>
      </DL.Root>,
    );
    expect(screen.getByText("Heb ei ddarparu")).toBeInTheDocument();
  });

  it("formats values with Intl, using the Root's locale", () => {
    render(
      <DL.Root locale="en-GB">
        <DL.Item>
          <DL.Term>Price</DL.Term>
          <DL.Details value={1234.5} format={{ style: "currency", currency: "GBP" }} />
        </DL.Item>
        <DL.Item>
          <DL.Term>Colours</DL.Term>
          <DL.Details value={["Red", "Green", "Blue"]} />
        </DL.Item>
      </DL.Root>,
    );
    expect(screen.getByText("£1,234.50")).toBeInTheDocument();
    expect(screen.getByText("Red, Green and Blue")).toBeInTheDocument();
  });

  it("children win over value", () => {
    render(
      <DL.Item>
        <DL.Term>A</DL.Term>
        <DL.Details value={5}>Five</DL.Details>
      </DL.Item>,
    );
    expect(screen.getByText("Five")).toBeInTheDocument();
  });

  it("copyable adds a labelled copy button that copies the shown text", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(
      <DL.Root>
        <DL.Item>
          <DL.Term>Email</DL.Term>
          <DL.Details copyable>sarah@example.com</DL.Details>
        </DL.Item>
      </DL.Root>,
    );
    const button = screen.getByRole("button", { name: /^Copy\s*Email$/ });
    await userEvent.click(button);
    expect(writeText).toHaveBeenCalledWith("sarah@example.com");
    // Check icon, "Copied" in the tooltip (held open), and a polite announcement
    expect(button).toHaveAttribute("data-status", "copied");
    expect(button.querySelector("svg")).toBeInTheDocument();
    await waitFor(() => {
      expect(tooltip()).toHaveTextContent("Copied");
      expect(tooltip()).toBeVisible();
    });
    await waitFor(() => expect(announcer()).toHaveTextContent("Copied"));
    // Only the shared announcer: no live region of the button's own
    expect(document.querySelectorAll("[role=status]")).toHaveLength(1);
  });

  it("copyable as a string copies that value; no button when empty", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(
      <DL.Root>
        <DL.Item>
          <DL.Term>Key</DL.Term>
          <DL.Details copyable="sk_live_123">sk_live_•••</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>Other</DL.Term>
          <DL.Details copyable />
        </DL.Item>
      </DL.Root>,
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await userEvent.click(screen.getByRole("button"));
    expect(writeText).toHaveBeenCalledWith("sk_live_123");
  });

  it("a failed copy says so", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });
    document.execCommand = vi.fn().mockReturnValue(false);
    render(
      <DL.Item>
        <DL.Term>Email</DL.Term>
        <DL.Details copyable>x</DL.Details>
      </DL.Item>,
    );
    await userEvent.click(screen.getByRole("button"));
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-status", "failed");
    await waitFor(() => {
      expect(tooltip()).toHaveTextContent("Copy failed");
      expect(tooltip()).toBeVisible();
    });
    await waitFor(() => expect(announcer()).toHaveTextContent("Copy failed"));
  });

  it("goes back to Copy after 2 seconds", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(
      <DL.Item>
        <DL.Term>Email</DL.Term>
        <DL.Details copyable>x</DL.Details>
      </DL.Item>,
    );
    const button = screen.getByRole("button");
    await act(async () => {
      button.click();
    });
    expect(button).toHaveAttribute("data-status", "copied");
    await act(async () => {
      vi.advanceTimersByTime(2100);
    });
    expect(button).toHaveAttribute("data-status", "idle");
    expect(button).toHaveAccessibleName(/^Copy\s*Email$/);
    vi.useRealTimers();
  });
});

describe("Term info", () => {
  it("adds an info button named after the term", () => {
    render(
      <DL.Item>
        <DL.Term info="Where we send receipts">Email</DL.Term>
        <DL.Details>x</DL.Details>
      </DL.Item>,
    );
    expect(screen.getByRole("button", { name: "More about Email" })).toBeInTheDocument();
  });
});

describe("items shorthand", () => {
  it("renders the same markup", () => {
    render(
      <DL.Root
        items={[
          { term: "Name", details: "Sarah", actions: [{ href: "#n", children: "Change" }] },
          { term: "Phones", details: ["1", "2"] },
          { term: "Nickname" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: /^Change\s*Name$/ })).toBeInTheDocument();
    expect(document.querySelectorAll("dd")).toHaveLength(5);
    expect(screen.getByText("Not provided")).toBeInTheDocument();
  });
});

describe("SummaryCard", () => {
  it("labels the list, and adds the card title to every action", () => {
    render(
      <SummaryCard
        title="University of Bristol"
        headingLevel={3}
        actions={
          <>
            <DL.Action href="#d">Delete choice</DL.Action>
            <DL.Action href="#w">Withdraw</DL.Action>
          </>
        }
      >
        <DL.Root>
          <DL.Item>
            <DL.Term>Course</DL.Term>
            <DL.Details>English</DL.Details>
            <DL.Actions>
              <DL.Action href="#c">Change</DL.Action>
            </DL.Actions>
          </DL.Item>
        </DL.Root>
      </SummaryCard>,
    );
    const heading = screen.getByRole("heading", { level: 3, name: "University of Bristol" });
    expect(document.querySelector("dl")).toHaveAttribute("aria-labelledby", heading.id);
    expect(
      screen.getByRole("link", { name: /^Change\s*Course \(University of Bristol\)$/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /^Delete choice\s*\(University of Bristol\)$/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("list")).toHaveLength(1);
  });

  it("renders on the server with the hidden context already there", () => {
    const html = renderToString(
      <SummaryCard title="Card">
        <Basic />
      </SummaryCard>,
    );
    expect(html).toContain("Name (Card)");
  });
});

describe("format helper", () => {
  it("numbers, dates, lists and ranges", () => {
    expect(formatDescriptionValue(0.25, { style: "percent" }, "en-GB")).toBe("25%");
    expect(
      formatDescriptionValue(new Date(Date.UTC(2026, 0, 5)), { timeZone: "UTC" }, "en-GB"),
    ).toBe("05/01/2026");
    expect(formatDescriptionValue(new Date(Date.UTC(2026, 0, 5)), undefined, "en-GB")).toMatch(
      /5 Jan 2026/,
    );
    expect(formatDescriptionValue(["a", "b"], { type: "disjunction" }, "en-GB")).toBe("a or b");
    expect(formatDescriptionValue({ start: 3, end: 5 }, undefined, "en-GB")).toMatch(/3.5/);
  });

  it("isEmptyValue", () => {
    expect(isEmptyValue(null)).toBe(true);
    expect(isEmptyValue("  ")).toBe(true);
    expect(isEmptyValue([])).toBe(true);
    expect(isEmptyValue(0)).toBe(false);
    expect(isEmptyValue(new Date("x"))).toBe(true);
  });

  it("copyText falls back to execCommand", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    document.execCommand = vi.fn().mockReturnValue(true);
    await act(async () => {
      expect(await copyText("hi")).toBe(true);
    });
    expect(document.execCommand).toHaveBeenCalledWith("copy");
  });
});

describe("signoff regressions", () => {
  const mockClipboard = () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    return writeText;
  };

  it("a second copy within the announcer's window is announced again (force)", async () => {
    mockClipboard();
    render(
      <DL.Root>
        <DL.Item>
          <DL.Term>A</DL.Term>
          <DL.Details copyable>one</DL.Details>
        </DL.Item>
        <DL.Item>
          <DL.Term>B</DL.Term>
          <DL.Details copyable>two</DL.Details>
        </DL.Item>
      </DL.Root>,
    );
    const [first, second] = screen.getAllByRole("button");
    await userEvent.click(first!);
    await waitFor(() => expect(announcer()).toHaveTextContent("Copied"));
    await userEvent.click(second!);
    // Forced: the region empties, then says "Copied" again
    expect(announcer()).toHaveTextContent("");
    await waitFor(() => expect(announcer()).toHaveTextContent("Copied"));
  });

  it("Escape dismisses the held-open 'Copied' tooltip (WCAG 1.4.13)", async () => {
    mockClipboard();
    render(
      <DL.Item>
        <DL.Term>Email</DL.Term>
        <DL.Details copyable>x</DL.Details>
      </DL.Item>,
    );
    const button = screen.getByRole("button");
    await userEvent.click(button);
    await waitFor(() => {
      expect(tooltip()).toHaveTextContent("Copied");
      expect(tooltip()).toBeVisible();
    });
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(tooltip()).not.toBeVisible());
    // Still in the copied state; only the tooltip was dismissed
    expect(button).toHaveAttribute("data-status", "copied");
  });

  it("copy labels are translatable", async () => {
    mockClipboard();
    render(
      <DL.Root labels={{ copy: "Copïo", copied: "Wedi copïo" }}>
        <DL.Item>
          <DL.Term>E-bost</DL.Term>
          <DL.Details copyable>x</DL.Details>
        </DL.Item>
      </DL.Root>,
    );
    const button = screen.getByRole("button", { name: /^Copïo\s*E-bost$/ });
    await userEvent.click(button);
    await waitFor(() => expect(announcer()).toHaveTextContent("Wedi copïo"));
  });

  it("a new labels.info function is used even if its source text is the same", () => {
    const make = (word: string) => ({ info: () => word });
    const tree = (labels: ReturnType<typeof make>) => (
      <DL.Root labels={labels}>
        <DL.Item>
          <DL.Term info="help">Email</DL.Term>
          <DL.Details>x</DL.Details>
        </DL.Item>
      </DL.Root>
    );
    const { rerender } = render(tree(make("first")));
    expect(screen.getByRole("button", { name: "first" })).toBeInTheDocument();
    rerender(tree(make("second")));
    expect(screen.getByRole("button", { name: "second" })).toBeInTheDocument();
  });

  it("SummaryCard context stands in for a title that isn't plain text", () => {
    render(
      <SummaryCard title={<em>Bristol</em>} context="University of Bristol">
        <DL.Root>
          <DL.Item>
            <DL.Term>Course</DL.Term>
            <DL.Details>English</DL.Details>
            <DL.Actions>
              <DL.Action href="#c">Change</DL.Action>
            </DL.Actions>
          </DL.Item>
        </DL.Root>
      </SummaryCard>,
    );
    expect(
      screen.getByRole("link", { name: /^Change\s*Course \(University of Bristol\)$/ }),
    ).toBeInTheDocument();
  });

  it("formats a date range", () => {
    expect(
      formatDescriptionValue(
        { start: new Date(Date.UTC(2026, 0, 1)), end: new Date(Date.UTC(2026, 11, 31)) },
        { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" },
        "en-GB",
      ),
    ).toMatch(/1 Jan.+31 Dec 2026/);
  });
});

describe("Item loading (Skeleton)", () => {
  it("keeps the term, turns the value into a skeleton, and says Loading", () => {
    render(
      <DL.Root>
        <DL.Item loading>
          <DL.Term>Balance</DL.Term>
          <DL.Details />
          <DL.Actions>
            <DL.Action href="#b">Change</DL.Action>
          </DL.Actions>
        </DL.Item>
      </DL.Root>,
    );
    expect(document.querySelector("dt")).toHaveTextContent("Balance");
    const dd = document.querySelector("[data-slot=description-list-details]")!;
    expect(dd).toHaveAttribute("aria-busy", "true");
    expect(dd).toHaveAttribute("data-loading");
    expect(dd.querySelector("[data-slot=skeleton]")).toHaveAttribute("aria-hidden", "true");
    expect(dd).toHaveTextContent("Loading");
    // Loading isn't empty
    expect(screen.queryByText("Not provided")).not.toBeInTheDocument();
    // Actions are hidden and inert until it loads
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    const skeleton = document.querySelector(
      "[data-slot=description-list-actions] [data-slot=skeleton]",
    );
    expect(skeleton).toHaveAttribute("inert");
  });

  it("a value that's already there keeps its size under the skeleton", () => {
    render(
      <DL.Item loading>
        <DL.Term>Name</DL.Term>
        <DL.Details>Sarah Philips</DL.Details>
      </DL.Item>,
    );
    const skeleton = document.querySelector(
      "[data-slot=description-list-details] [data-slot=skeleton]",
    )!;
    expect(skeleton).toHaveTextContent("Sarah Philips");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });

  it("hideEmpty never hides a loading row; it renders normally once loaded", () => {
    const { rerender } = render(
      <DL.Root hideEmpty>
        <DL.Item loading>
          <DL.Term>Balance</DL.Term>
          <DL.Details />
        </DL.Item>
      </DL.Root>,
    );
    expect(screen.getByText("Balance")).toBeInTheDocument();
    rerender(
      <DL.Root hideEmpty>
        <DL.Item>
          <DL.Term>Balance</DL.Term>
          <DL.Details value={1200} />
        </DL.Item>
      </DL.Root>,
    );
    expect(document.querySelector("[data-slot=skeleton]")).toBeNull();
    expect(document.querySelector("dd")).not.toHaveAttribute("aria-busy");
  });

  it("the loading text is translatable, and the items shorthand takes loading", () => {
    render(
      <DL.Root labels={{ loading: "Yn llwytho" }} items={[{ term: "Balans", loading: true }]} />,
    );
    expect(document.querySelector("dd")).toHaveTextContent("Yn llwytho");
  });
});
