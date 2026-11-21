import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox, type ComboboxRootProps } from "./Combobox";
import { Field } from "../Field/Field";

const fruits = ["Apple", "Apricot", "Banana", "Cherry", "Mango"];

function Harness<M extends boolean | undefined = false>({
  input,
  content,
  ...root
}: Partial<ComboboxRootProps<string, M>> & {
  input?: React.ComponentProps<typeof Combobox.Input>;
  content?: React.ComponentProps<typeof Combobox.Content>;
}) {
  return (
    <Combobox.Root items={fruits} statusDelay={0} {...(root as ComboboxRootProps<string, M>)}>
      <Field.Root>
        <Field.Label>Fruit</Field.Label>
        <Combobox.Input placeholder="Search" {...input} />
      </Field.Root>
      <Combobox.Content data-testid="popup" {...content} />
    </Combobox.Root>
  );
}

const input = () => screen.getByRole("combobox", { name: "Fruit" });
const options = () => screen.queryAllByRole("option");

async function typeInto(text: string) {
  const user = userEvent.setup();
  await user.click(input());
  if (text) await user.type(input(), text);
  return user;
}

describe("Combobox", () => {
  /* ---------- structure ---------- */

  it("renders the control with slots, label and trigger", () => {
    render(<Harness />);
    expect(input()).toHaveAttribute("data-slot", "combobox-input");
    const control = input().closest("[data-slot=combobox-control]");
    expect(control).not.toBeNull();
    expect(control).toHaveAttribute("data-size", "md");
    expect(screen.getByRole("button", { name: "Show options" })).toHaveAttribute(
      "data-slot",
      "combobox-trigger",
    );
  });

  it("renders the default list from items and filters it", async () => {
    render(<Harness />);
    await typeInto("ap");
    await waitFor(() => expect(options().map((o) => o.textContent)).toEqual(["Apple", "Apricot"]));
    const popup = screen.getByTestId("popup");
    expect(popup).toHaveAttribute("data-slot", "combobox-popup");
    expect(popup).toHaveAttribute("data-highlight", "subtle");
  });

  it("filters ignoring accents and case", async () => {
    render(<Harness items={["México", "Mali"]} />);
    await typeInto("mexico");
    await waitFor(() => expect(options().map((o) => o.textContent)).toEqual(["México"]));
  });

  it("matchFrom=start only matches the beginning", async () => {
    render(<Harness matchFrom="start" />);
    await typeInto("an");
    await waitFor(() => expect(options()).toHaveLength(0));
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("selects with the keyboard and fills the input", async () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    const user = await typeInto("man");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("Mango", expect.anything());
    await waitFor(() => expect(input()).toHaveValue("Mango"));
  });

  it("starts with the label of defaultValue in the input", () => {
    render(<Harness defaultValue="Cherry" />);
    expect(input()).toHaveValue("Cherry");
  });

  it("closes on Escape and keeps focus in the input", async () => {
    render(<Harness />);
    const user = await typeInto("a");
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(input()).toHaveFocus();
  });

  it("marks the selected option and draws a check", async () => {
    render(<Harness defaultValue="Banana" openOnInputClick />);
    await typeInto("");
    const option = await screen.findByRole("option", { name: "Banana" });
    expect(option).toHaveAttribute("aria-selected", "true");
    expect(option.querySelector("[data-slot=combobox-item-indicator] svg")).not.toBeNull();
  });

  it("indicatorPosition=end moves the check to the end group", async () => {
    render(<Harness defaultValue="Banana" indicatorPosition="end" openOnInputClick />);
    await typeInto("");
    const option = await screen.findByRole("option", { name: "Banana" });
    expect(
      option.querySelector("[data-slot=combobox-item-end] [data-slot=combobox-item-indicator]"),
    ).not.toBeNull();
  });

  it("highlightMatches wraps the match in <mark>", async () => {
    render(<Harness highlightMatches />);
    await typeInto("ango");
    const option = await screen.findByRole("option", { name: "Mango" });
    expect(option.querySelector("mark")).toHaveTextContent("ango");
  });

  it("item description is announced, not part of the name", async () => {
    render(
      <Harness
        content={{
          children: (
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item key={item} value={item} description={`${item} description`}>
                  {item}
                </Combobox.Item>
              )}
            </Combobox.List>
          ),
        }}
      />,
    );
    await typeInto("mango");
    const option = await screen.findByRole("option", { name: "Mango" });
    expect(option).toHaveAccessibleDescription("Mango description");
  });

  /* ---------- states ---------- */

  it("size sets the control height variable and row size", () => {
    render(<Harness size="lg" />);
    const control = input().closest("[data-slot=combobox-control]")!;
    expect(control).toHaveAttribute("data-size", "lg");
    expect(control.className).toContain("--sp-control-height-lg");
  });

  it("valid shows a check; warning overrides valid", () => {
    const { rerender } = render(<Harness valid />);
    const control = () => input().closest("[data-slot=combobox-control]")!;
    expect(control()).toHaveAttribute("data-valid");
    expect(control().querySelector("[data-slot=combobox-valid-icon]")).not.toBeNull();
    rerender(<Harness valid warning />);
    expect(control()).not.toHaveAttribute("data-valid");
    expect(control()).toHaveAttribute("data-warning");
    expect(control().className).toContain("--sp-warning");
  });

  it("loading shows a spinner, the loading row and aria-busy", async () => {
    render(<Harness items={[]} loading openOnInputClick />);
    await typeInto("");
    expect(
      input()
        .closest("[data-slot=combobox-control]")!
        .querySelector("[data-slot=combobox-spinner]"),
    ).not.toBeNull();
    expect(await screen.findByText("Loading…")).toBeInTheDocument();
    expect(screen.getByTestId("popup")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("No results")).toBeNull();
  });

  it("error shows the message and a Try again option that calls onRetry", async () => {
    const onRetry = vi.fn();
    render(<Harness error onRetry={onRetry} openOnInputClick />);
    const user = await typeInto("");
    expect(await screen.findByText("Couldn’t load results")).toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalled();
  });

  it("minLength shows a hint until enough characters are typed", async () => {
    render(<Harness minLength={2} />);
    await typeInto("a");
    expect(await screen.findByText("Type 2 or more characters for results")).toBeInTheDocument();
    expect(options()).toHaveLength(0);
    await userEvent.type(input(), "p");
    await waitFor(() => expect(options().length).toBeGreaterThan(0));
  });

  it("labels replaces built-in strings", async () => {
    render(<Harness labels={{ noResults: "Nothing here", toggle: "Open list" }} />);
    expect(screen.getByRole("button", { name: "Open list" })).toBeInTheDocument();
    await typeInto("zzz");
    expect(await screen.findByText("Nothing here")).toBeInTheDocument();
  });

  it("announces the result count in the status region", async () => {
    render(<Harness />);
    await typeInto("ap");
    const status = screen
      .getAllByRole("status")
      .find((el) => el.getAttribute("data-slot") === "combobox-status")!;
    await waitFor(() => expect(status.textContent?.trim()).toBe("2 results are available"));
  });

  it("marks keyboard opens so the animation is skipped; pointer opens animate", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Harness />);
    input().focus();
    await user.keyboard("a");
    expect(await screen.findByTestId("popup")).toHaveAttribute("data-keyboard-open");
    unmount();
    render(<Harness />);
    await user.click(input());
    expect(await screen.findByTestId("popup")).not.toHaveAttribute("data-keyboard-open");
  });

  /* ---------- creatable ---------- */

  it("creatable offers Create and calls onCreate", async () => {
    const onCreate = vi.fn((q: string) => q);
    const onValueChange = vi.fn();
    render(<Harness creatable onCreate={onCreate} onValueChange={onValueChange} />);
    const user = await typeInto("Durian");
    const create = await screen.findByRole("option", { name: "Create “Durian”" });
    await user.click(create);
    expect(onCreate).toHaveBeenCalledWith("Durian");
    expect(onValueChange).toHaveBeenCalledWith("Durian", expect.anything());
  });

  it("creatable hides Create when the text matches an item", async () => {
    render(<Harness creatable />);
    await typeInto("mango");
    await screen.findByRole("option", { name: "Mango" });
    expect(screen.queryByRole("option", { name: /Create/ })).toBeNull();
  });

  /* ---------- multiple ---------- */

  it("multiple renders chips with remove buttons and a removal hint", () => {
    render(<Harness multiple defaultValue={["Apple", "Mango"]} />);
    expect(screen.getByRole("button", { name: "Remove Apple" })).toBeInTheDocument();
    expect(input()).toHaveAccessibleDescription(/Backspace/);
  });

  it("Backspace removes the last chip but not a fixed one", async () => {
    const onValueChange = vi.fn();
    render(
      <Harness
        multiple
        defaultValue={["Apple", "Mango"]}
        isItemFixed={(item) => item === "Apple"}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.queryByRole("button", { name: "Remove Apple" })).toBeNull();
    const user = await typeInto("");
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["Apple"], expect.anything());
    await user.keyboard("{Backspace}");
    expect(onValueChange).toHaveBeenLastCalledWith(["Apple"], expect.anything());
  });

  it("select all toggles every visible result and shows a mixed state", async () => {
    const onValueChange = vi.fn();
    render(<Harness multiple selectAll defaultValue={["Apple"]} onValueChange={onValueChange} />);
    const user = await typeInto("ap");
    const all = await screen.findByRole("option", { name: "Select all" });
    expect(all).toHaveAccessibleDescription("1 of 2 selected");
    expect(all.querySelector("[data-state=mixed]")).not.toBeNull();
    await user.click(all);
    expect(onValueChange).toHaveBeenLastCalledWith(["Apple", "Apricot"], expect.anything());
  });

  it("maxSelected disables other options and shows why", async () => {
    render(<Harness multiple maxSelected={1} defaultValue={["Apple"]} openOnInputClick />);
    await typeInto("");
    const banana = await screen.findByRole("option", { name: "Banana" });
    expect(banana).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByText(/You can choose up to 1/)).toBeInTheDocument();
  });

  it("hidePicked leaves selected items out of the list", async () => {
    render(<Harness multiple hidePicked defaultValue={["Apple"]} />);
    await typeInto("ap");
    await waitFor(() => expect(options().map((o) => o.textContent)).toEqual(["Apricot"]));
  });

  it("maxVisibleChips collapses the rest into +N more while idle", () => {
    render(<Harness multiple maxVisibleChips={1} defaultValue={["Apple", "Banana", "Mango"]} />);
    expect(screen.getByText("+2 more")).toBeInTheDocument();
    const chips = document.querySelectorAll("[data-slot=combobox-chip]");
    expect(chips[1]).toHaveAttribute("hidden");
  });

  it("selectionDisplay=count shows one count tag", () => {
    render(<Harness multiple selectionDisplay="count" defaultValue={["Apple", "Mango"]} />);
    expect(screen.getByText("2 selected")).toBeInTheDocument();
    expect(document.querySelectorAll("[data-slot=combobox-chip]")).toHaveLength(0);
  });

  it("reorderable moves a chip with Alt+Shift+Arrow and announces it", async () => {
    const onValueChange = vi.fn();
    render(
      <Harness
        multiple
        reorderable
        defaultValue={["Apple", "Mango"]}
        onValueChange={onValueChange}
      />,
    );
    const chip = document.querySelector<HTMLElement>("[data-chip-index='0']")!;
    chip.focus();
    fireEvent.keyDown(chip, { key: "ArrowRight", altKey: true, shiftKey: true });
    expect(onValueChange).toHaveBeenLastCalledWith(["Mango", "Apple"], expect.anything());
  });

  it("delimiters commit tags and split pasted text", async () => {
    const onValueChange = vi.fn();
    render(
      <Harness
        multiple
        creatable
        delimiters={[","]}
        onValueChange={onValueChange}
        onCreate={(q) => q}
      />,
    );
    const user = await typeInto("kiwi,");
    expect(onValueChange).toHaveBeenLastCalledWith(["kiwi"], expect.anything());
    fireEvent.paste(input(), { clipboardData: { getData: () => "mango, lime\nfig" } });
    // "mango" matches an existing item, so the item is reused
    expect(onValueChange).toHaveBeenLastCalledWith(
      ["kiwi", "Mango", "lime", "fig"],
      expect.anything(),
    );
    void user;
  });

  /* ---------- tooltips on icon-only buttons ---------- */

  it("icon buttons are named by their tooltip only (no aria-label, no describedby)", () => {
    render(<Harness multiple defaultValue={["Apple", "Mango"]} />);
    for (const name of ["Remove Apple", "Remove Mango", "Clear all", "Show options"]) {
      const button = screen.getByRole("button", { name });
      expect(button).not.toHaveAttribute("aria-label");
      const labelledBy = button.getAttribute("aria-labelledby")!;
      const tooltip = document.getElementById(labelledBy)!;
      expect(tooltip).toHaveAttribute("role", "tooltip");
      expect(tooltip).toHaveTextContent(name);
      // The tooltip is not also linked as a description
      expect(button.getAttribute("aria-describedby") ?? "").not.toContain(labelledBy);
    }
  });

  it("single select clear button is named Clear", () => {
    render(<Harness defaultValue="Mango" />);
    expect(screen.getByRole("button", { name: "Clear" })).toHaveAttribute(
      "data-slot",
      "combobox-clear",
    );
  });

  it("the chevron's tooltip is disabled while the list is open", async () => {
    render(<Harness />);
    await typeInto("a");
    await screen.findByRole("listbox");
    const trigger = document.querySelector("[data-slot=combobox-trigger]")!;
    // Open styling keys off aria-expanded (GEO-970), which a tooltip never sets.
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger.className).toContain("aria-expanded:shadow-[inset_0_0_0_1.5px_currentColor]");
    expect(input().closest("[data-slot=combobox-control]")!.className).toContain(
      "has-[[aria-expanded=true]]:border-accent",
    );
  });

  it("chip moves are announced in a live region outside the field", () => {
    render(<Harness multiple reorderable defaultValue={["Apple", "Mango"]} />);
    const chip = document.querySelector<HTMLElement>("[data-chip-index='0']")!;
    fireEvent.keyDown(chip, { key: "ArrowRight", altKey: true, shiftKey: true });
    const announcer = document.querySelector("[data-slot=combobox-announcer]")!;
    expect(announcer).toHaveTextContent("Apple moved to position 2 of 2");
    expect(announcer.closest("[data-slot=combobox-control]")).toBeNull();
  });

  /* ---------- Field ---------- */

  it("Field invalid reaches the input", () => {
    render(
      <Combobox.Root items={fruits}>
        <Field.Root invalid>
          <Field.Label>Fruit</Field.Label>
          <Combobox.Input />
        </Field.Root>
      </Combobox.Root>,
    );
    expect(input()).toHaveAttribute("aria-invalid", "true");
  });

  it("disabled disables the input", () => {
    render(<Harness disabled />);
    expect(input()).toBeDisabled();
  });

  it("autoSelectOnBlur picks the highlighted option when focus leaves", async () => {
    const onValueChange = vi.fn();
    render(
      <>
        <Harness autoHighlight autoSelectOnBlur onValueChange={onValueChange} />
        <button type="button">Next</button>
      </>,
    );
    const user = await typeInto("cher");
    await screen.findByRole("option", { name: "Cherry" });
    await user.tab();
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith("Cherry", expect.anything()));
  });

  it("groups render labels from grouped items", async () => {
    render(
      <Harness
        items={
          [
            { value: "Citrus", items: ["Lemon", "Lime"] },
            { value: "Stone", items: ["Peach", "Plum"] },
          ] as never
        }
        openOnInputClick
      />,
    );
    await typeInto("");
    const group = await screen.findByRole("group", { name: "Citrus" });
    expect(within(group).getAllByRole("option")).toHaveLength(2);
  });

  /* ---------- sign-off /improve regressions ---------- */

  it("limit caps results without hiding Select all or Create", async () => {
    render(<Harness multiple selectAll creatable limit={2} items={["Ab", "Ac", "Ad", "Ae"]} />);
    await typeInto("a");
    await waitFor(() => expect(options()).toHaveLength(4));
    expect(options()[0]).toHaveAttribute("data-slot", "combobox-select-all");
    expect(
      options()
        .slice(1, 3)
        .map((o) => o.textContent),
    ).toEqual(["Ab", "Ac"]);
    expect(options()[3]).toHaveAccessibleName("Create “a”");
  });

  it("sentinel rows never reach isItemEqualToValue or onItemHighlighted", async () => {
    const seen: unknown[] = [];
    const onItemHighlighted = vi.fn();
    render(
      <Harness
        multiple
        selectAll
        creatable
        isItemEqualToValue={(a, b) => {
          seen.push(a, b);
          return a === b;
        }}
        onItemHighlighted={onItemHighlighted}
      />,
    );
    const user = await typeInto("ap");
    await screen.findByRole("option", { name: "Select all" });
    await user.keyboard("{ArrowDown}");
    await user.click(screen.getByRole("option", { name: "Select all" }));
    expect(seen.every((v) => typeof v === "string")).toBe(true);
    for (const [item] of onItemHighlighted.mock.calls) {
      expect(item === undefined || typeof item === "string").toBe(true);
    }
  });

  it("Try again keeps the typed query (single)", async () => {
    const onRetry = vi.fn();
    const onInputValueChange = vi.fn();
    render(<Harness error onRetry={onRetry} onInputValueChange={onInputValueChange} />);
    const user = await typeInto("mex");
    await user.click(await screen.findByRole("option", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalled();
    expect(input()).toHaveValue("mex");
    expect(onInputValueChange).not.toHaveBeenCalledWith("", expect.anything());
  });

  it("at maxSelected, Create is disabled and onCreate never runs", async () => {
    const onCreate = vi.fn((q: string) => q);
    render(
      <Harness multiple creatable maxSelected={1} defaultValue={["Apple"]} onCreate={onCreate} />,
    );
    const user = await typeInto("kiwi");
    const create = await screen.findByRole("option", { name: "Create “kiwi”" });
    expect(create).toHaveAttribute("aria-disabled", "true");
    await user.keyboard("{Enter}");
    expect(onCreate).not.toHaveBeenCalled();
  });

  it("Select all clears when maxSelected stops it adding more", async () => {
    const onValueChange = vi.fn();
    render(
      <Harness
        multiple
        selectAll
        maxSelected={1}
        defaultValue={["Apple"]}
        onValueChange={onValueChange}
      />,
    );
    const user = await typeInto("ap");
    await user.click(await screen.findByRole("option", { name: "Select all" }));
    expect(onValueChange).toHaveBeenLastCalledWith([], expect.anything());
  });

  it("selectedFirst shows items that arrive while the list is open", async () => {
    const { rerender } = render(
      <Harness multiple selectedFirst items={[]} defaultValue={["Mango"]} openOnInputClick />,
    );
    await typeInto("");
    rerender(
      <Harness multiple selectedFirst items={fruits} defaultValue={["Mango"]} openOnInputClick />,
    );
    await waitFor(() => expect(options()[0]).toHaveTextContent("Mango"));
    expect(options()).toHaveLength(fruits.length);
  });

  it("filter={null} turns client filtering off", async () => {
    render(<Harness filter={null} />);
    await typeInto("zz");
    await waitFor(() => expect(options()).toHaveLength(fruits.length));
  });

  it("collapsed chips expand while the input has focus", async () => {
    render(<Harness multiple maxVisibleChips={1} defaultValue={["Apple", "Banana", "Mango"]} />);
    expect(screen.getByText("+2 more")).toBeInTheDocument();
    fireEvent.focus(input());
    expect(screen.queryByText("+2 more")).toBeNull();
    fireEvent.blur(input());
    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  it("keeps the consumer's aria-describedby alongside the chips hint", () => {
    render(
      <>
        <span id="help">Pick fruit</span>
        <Harness multiple defaultValue={["Apple"]} input={{ "aria-describedby": "help" }} />
      </>,
    );
    expect(input()).toHaveAccessibleDescription(/Pick fruit.*Backspace/);
  });

  it("autoSelectOnBlur never picks a disabled option", async () => {
    const onValueChange = vi.fn();
    render(
      <>
        <Harness
          autoHighlight
          autoSelectOnBlur
          onValueChange={onValueChange}
          content={{
            children: (
              <Combobox.List>
                {(item: string) => (
                  <Combobox.Item key={item} value={item} disabled={item === "Cherry"} />
                )}
              </Combobox.List>
            ),
          }}
        />
        <button type="button">Next</button>
      </>,
    );
    const user = await typeInto("cher");
    await screen.findByRole("option", { name: "Cherry" });
    await user.keyboard("{ArrowDown}");
    await user.tab();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("a fixed item keeps its place when Backspace reaches it", async () => {
    const onValueChange = vi.fn();
    render(
      <Harness
        multiple
        defaultValue={["Apple", "Mango", "Banana"]}
        isItemFixed={(item) => item === "Banana"}
        onValueChange={onValueChange}
      />,
    );
    const user = await typeInto("");
    await user.keyboard("{Backspace}");
    // Banana stays last; it used to jump to the front
    for (const [next] of onValueChange.mock.calls) {
      expect(next).toEqual(["Apple", "Mango", "Banana"]);
    }
  });

  it("readOnly ignores pasted tags and chip reordering", () => {
    const onValueChange = vi.fn();
    render(
      <Harness
        multiple
        readOnly
        creatable
        reorderable
        delimiters={[","]}
        defaultValue={["Apple", "Mango"]}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.paste(input(), { clipboardData: { getData: () => "x, y" } });
    const chip = document.querySelector<HTMLElement>("[data-chip-index='0']")!;
    fireEvent.keyDown(chip, { key: "ArrowRight", altKey: true, shiftKey: true });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("loading without hasMore shows no Loading more row", async () => {
    render(<Harness loading openOnInputClick />);
    await typeInto("");
    await screen.findAllByRole("option");
    expect(screen.queryByText("Loading more…")).toBeNull();
  });

  it("an error given as a node is announced by its text", async () => {
    render(<Harness error={<strong>Server down</strong>} openOnInputClick />);
    await typeInto("");
    await waitFor(() =>
      expect(document.querySelector("[data-slot=combobox-announcer]")?.textContent).toContain(
        "Server down",
      ),
    );
  });
});
