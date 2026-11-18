import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Autocomplete, type AutocompleteRootProps } from "./Autocomplete";
import { Field } from "../Field/Field";

const tags = ["react", "redux", "routing", "testing", "typescript"];

function Harness({
  input,
  ...root
}: Partial<AutocompleteRootProps<string>> & {
  input?: React.ComponentProps<typeof Autocomplete.Input>;
}) {
  return (
    <Autocomplete.Root items={tags} statusDelay={0} {...root}>
      <Field.Root>
        <Field.Label>Tag</Field.Label>
        <Autocomplete.Input placeholder="Search" {...input} />
      </Field.Root>
      <Autocomplete.Content data-testid="popup" />
    </Autocomplete.Root>
  );
}

const input = () => screen.getByRole("combobox", { name: "Tag" });
const options = () => screen.queryAllByRole("option");

async function typeInto(text: string) {
  const user = userEvent.setup();
  await user.click(input());
  if (text) await user.type(input(), text);
  return user;
}

describe("Autocomplete", () => {
  it("renders the shared control with autocomplete slots and no chevron by default", () => {
    render(<Harness />);
    expect(input()).toHaveAttribute("data-slot", "autocomplete-input");
    expect(input().closest("[data-slot=autocomplete-control]")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Show options" })).toBeNull();
  });

  it("showTrigger adds the chevron", () => {
    render(<Harness input={{ showTrigger: true }} />);
    expect(screen.getByRole("button", { name: "Show options" })).toHaveAttribute(
      "data-slot",
      "autocomplete-trigger",
    );
  });

  it("keeps free text that matches nothing", async () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    await typeInto("zzz");
    expect(onValueChange).toHaveBeenLastCalledWith("zzz", expect.anything());
    expect(input()).toHaveValue("zzz");
  });

  it("filters and fills the input with a picked suggestion", async () => {
    const onValueChange = vi.fn();
    render(<Harness onValueChange={onValueChange} />);
    const user = await typeInto("red");
    await waitFor(() => expect(options().map((o) => o.textContent)).toEqual(["redux"]));
    await user.keyboard("{ArrowDown}{Enter}");
    await waitFor(() => expect(input()).toHaveValue("redux"));
  });

  it("has no selection indicator on suggestions", async () => {
    render(<Harness />);
    await typeInto("re");
    const option = await screen.findByRole("option", { name: "react" });
    expect(option.querySelector("[data-slot=combobox-item-indicator]")).toBeNull();
  });

  it("matchFrom=start and limit", async () => {
    render(<Harness matchFrom="start" limit={1} />);
    await typeInto("r");
    await waitFor(() => expect(options().map((o) => o.textContent)).toEqual(["react"]));
  });

  it("minLength shows the hint before suggestions", async () => {
    render(<Harness minLength={3} />);
    await typeInto("re");
    expect(await screen.findByText("Type 3 or more characters for results")).toBeInTheDocument();
    expect(options()).toHaveLength(0);
  });

  it("minLength wins over loading", async () => {
    render(<Harness minLength={3} loading />);
    await typeInto("re");
    expect(await screen.findByText("Type 3 or more characters for results")).toBeInTheDocument();
    expect(screen.queryByText("Loading…")).toBeNull();
  });

  it("loading shows the spinner and loading row", async () => {
    render(<Harness items={[]} loading />);
    await typeInto("re");
    expect(await screen.findByText("Loading…")).toBeInTheDocument();
    expect(document.querySelector("[data-slot=autocomplete-spinner]")).not.toBeNull();
  });

  it("error offers Try again without changing the text", async () => {
    const onRetry = vi.fn();
    render(<Harness error="Server unavailable" onRetry={onRetry} />);
    const user = await typeInto("re");
    expect(await screen.findByText("Server unavailable")).toBeInTheDocument();
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onRetry).toHaveBeenCalled();
    expect(input()).toHaveValue("re");
  });

  it("highlightMatches marks the match", async () => {
    render(<Harness highlightMatches />);
    await typeInto("script");
    const option = await screen.findByRole("option", { name: "typescript" });
    expect(option.querySelector("mark")).toHaveTextContent("script");
  });

  it("submitOnEnter submits the surrounding form", async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Harness submitOnEnter />
      </form>,
    );
    const user = await typeInto("test");
    await user.keyboard("{Enter}");
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it("announces the suggestion count", async () => {
    render(<Harness />);
    await typeInto("re");
    const status = screen
      .getAllByRole("status")
      .find((el) => el.getAttribute("data-slot") === "autocomplete-status")!;
    await waitFor(() => expect(status.textContent?.trim()).toBe("2 results are available"));
  });

  it("valid, warning and size reach the control", () => {
    render(<Harness valid warning size="sm" />);
    const control = input().closest("[data-slot=autocomplete-control]")!;
    expect(control).toHaveAttribute("data-warning");
    expect(control).not.toHaveAttribute("data-valid");
    expect(control).toHaveAttribute("data-size", "sm");
  });

  /* ---------- sign-off /improve regressions ---------- */

  it("submitOnEnter respects the consumer's preventDefault", async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Harness
          submitOnEnter
          input={{ onKeyDown: (event) => event.key === "Enter" && event.preventDefault() }}
        />
      </form>,
    );
    const user = await typeInto("test");
    await user.keyboard("{Enter}");
    await new Promise((r) => setTimeout(r, 20));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submitOnEnter does not submit when Enter picks Try again", async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const onRetry = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <Harness submitOnEnter error onRetry={onRetry} />
      </form>,
    );
    const user = await typeInto("re");
    await screen.findByRole("option", { name: "Try again" });
    await user.keyboard("{ArrowDown}{Enter}");
    await new Promise((r) => setTimeout(r, 20));
    expect(onRetry).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("match highlighting uses the autocomplete slot", async () => {
    render(<Harness highlightMatches />);
    await typeInto("re");
    await screen.findAllByRole("option");
    expect(document.querySelector("[data-slot=autocomplete-match]")).not.toBeNull();
    expect(document.querySelector("[data-slot=combobox-match]")).toBeNull();
  });

  it("composed options are hidden below minLength", async () => {
    render(
      <Autocomplete.Root minLength={2} statusDelay={0}>
        <Field.Root>
          <Field.Label>Tag</Field.Label>
          <Autocomplete.Input />
        </Field.Root>
        <Autocomplete.Content>
          <Autocomplete.List>
            <Autocomplete.Item value="react" />
          </Autocomplete.List>
        </Autocomplete.Content>
      </Autocomplete.Root>,
    );
    await typeInto("r");
    expect(await screen.findByText("Type 2 or more characters for results")).toBeInTheDocument();
    expect(options()).toHaveLength(0);
  });
});
