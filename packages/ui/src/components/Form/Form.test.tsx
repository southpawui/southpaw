import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, type StandardSchemaV1 } from "./Form";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";
import { ErrorSummary } from "../ErrorSummary/ErrorSummary";

afterEach(() => {
  vi.restoreAllMocks();
  document.title = "";
});

const required = (message: string) => (value: unknown) =>
  value == null || String(value).trim() === "" ? message : null;

function Details(props: Partial<React.ComponentProps<typeof Form.Root>>) {
  return (
    <Form.Root aria-label="Details" {...props}>
      <Field.Root name="name" validate={required("Enter your full name")}>
        <Field.Label>Full name</Field.Label>
        <Input />
        <Field.Error />
      </Field.Root>
      <Field.Root name="email" validate={required("Enter your email address")}>
        <Field.Label>Email address</Field.Label>
        <Input />
        <Field.Error />
      </Field.Root>
      <Field.Root name="nickname">
        <Field.Label optional>Nickname</Field.Label>
        <Input />
      </Field.Root>
      <Form.Submit>Continue</Form.Submit>
    </Form.Root>
  );
}

const summary = () => document.querySelector<HTMLElement>("[data-slot=error-summary]")!;

describe("Form.Root", () => {
  it("is a noValidate form with a vertical, density-gap layout", () => {
    render(<Details />);
    const form = screen.getByRole("form", { name: "Details" });
    expect(form).toHaveAttribute("novalidate");
    expect(form).toHaveAttribute("data-slot", "form");
    expect(form).toHaveClass("flex", "flex-col", "gap-[calc(var(--sp-control-gap)*3)]");
  });

  it("a failed submit: summary with links, focus, onInvalid, and no onFormSubmit", async () => {
    const onFormSubmit = vi.fn();
    const onInvalid = vi.fn();
    render(<Details onFormSubmit={onFormSubmit} onInvalid={onInvalid} />);
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(summary()).toBeVisible());
    expect(
      within(summary()).getByRole("heading", { name: "There is a problem" }),
    ).toBeInTheDocument();
    const links = within(summary()).getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual([
      "Enter your full name",
      "Enter your email address",
    ]);
    await waitFor(() => expect(summary()).toHaveFocus());
    expect(onInvalid).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ message: "Enter your full name" })]),
    );
    expect(onFormSubmit).not.toHaveBeenCalled();
    expect(document.title).toMatch(/^Error: /);
  });

  it("a valid submit calls onFormSubmit with the values", async () => {
    const onFormSubmit = vi.fn();
    render(<Details onFormSubmit={onFormSubmit} />);
    await userEvent.type(screen.getByRole("textbox", { name: "Full name" }), "Sarah");
    await userEvent.type(screen.getByRole("textbox", { name: "Email address" }), "s@e.co");
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() =>
      expect(onFormSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Sarah", email: "s@e.co" }),
        expect.anything(),
      ),
    );
    expect(summary()).not.toBeVisible();
  });

  it("server errors show inline and in the summary; form errors come first, unlinked", async () => {
    render(
      <Details
        errors={{ email: "An account already exists with this email address" }}
        formErrors={["Your session expired"]}
      />,
    );
    await waitFor(() => expect(summary()).toBeVisible());
    const items = within(summary()).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Your session expired");
    expect(within(items[0]!).queryByRole("link")).toBeNull();
    expect(
      within(summary()).getByRole("link", {
        name: "An account already exists with this email address",
      }),
    ).toBeInTheDocument();
    // Inline too: a bare Field.Error shows the server message
    const inline = document.querySelectorAll("[data-slot=field-error]");
    expect(inline).toHaveLength(1);
    expect(inline[0]).toHaveTextContent("An account already exists with this email address");
  });

  it("formErrors with the same count but new wording update the summary", async () => {
    const { rerender } = render(<Details formErrors={["First problem"]} />);
    await waitFor(() => expect(summary()).toHaveTextContent("First problem"));
    rerender(<Details formErrors={["Second problem"]} />);
    await waitFor(() => expect(summary()).toHaveTextContent("Second problem"));
    expect(summary()).not.toHaveTextContent("First problem");
  });

  it("focusTarget='auto' focuses the field when there are fewer than 3 errors", async () => {
    render(
      <Form.Root aria-label="Auto" focusTarget="auto">
        <Field.Root name="only" validate={required("Enter something")}>
          <Field.Label>Only</Field.Label>
          <Input />
          <Field.Error />
        </Field.Root>
        <Form.Submit>Go</Form.Submit>
      </Form.Root>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    await waitFor(() => expect(summary()).toBeVisible());
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Only" })).toHaveFocus());
  });

  it("errorSummary={false} renders no summary", () => {
    render(<Details errorSummary={false} />);
    expect(summary()).toBeNull();
  });

  it("Form.ErrorSummary, or any ErrorSummary inside, replaces the built-in one", async () => {
    const { rerender } = render(
      <Form.Root aria-label="Placed">
        <h1>Title</h1>
        <Form.ErrorSummary />
      </Form.Root>,
    );
    await waitFor(() =>
      expect(document.querySelectorAll("[data-slot=error-summary]")).toHaveLength(1),
    );
    expect(
      document.querySelector("[data-slot=error-summary]")!.previousElementSibling?.tagName,
    ).toBe("H1");
    rerender(
      <Form.Root aria-label="Placed">
        <ErrorSummary.Root />
      </Form.Root>,
    );
    await waitFor(() =>
      expect(document.querySelectorAll("[data-slot=error-summary]")).toHaveLength(1),
    );
  });

  it("focusTarget='field' leaves focus on the first invalid field", async () => {
    render(<Details focusTarget="field" />);
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(summary()).toBeVisible());
    await act(async () => new Promise((r) => setTimeout(r, 20)));
    expect(screen.getByRole("textbox", { name: "Full name" })).toHaveFocus();
  });

  it("reset clears the summary", async () => {
    render(<Details />);
    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(summary()).toBeVisible());
    act(() => {
      screen.getByRole("form").dispatchEvent(new Event("reset", { bubbles: true }));
    });
    await waitFor(() => expect(summary()).not.toBeVisible());
  });
});

describe("necessity", () => {
  it("optional (default): '(optional)' as part of the label, never an asterisk", () => {
    render(
      <Form.Root aria-label="F">
        <Field.Root name="a">
          <Field.Label required>Name</Field.Label>
          <Input />
        </Field.Root>
        <Field.Root name="b">
          <Field.Label optional>Nickname</Field.Label>
          <Input />
        </Field.Root>
      </Form.Root>,
    );
    expect(screen.getByRole("textbox", { name: "Nickname (optional)" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
    expect(screen.queryByText("*")).toBeNull();
  });

  it("required: '(required)' after required labels; none: nothing", () => {
    const { rerender } = render(
      <Form.Root aria-label="F" necessity="required">
        <Field.Root name="a">
          <Field.Label required>Name</Field.Label>
          <Input />
        </Field.Root>
      </Form.Root>,
    );
    expect(screen.getByRole("textbox", { name: "Name (required)" })).toBeInTheDocument();
    rerender(
      <Form.Root aria-label="F" necessity="none">
        <Field.Root name="a">
          <Field.Label required>Name</Field.Label>
          <Input />
        </Field.Root>
      </Form.Root>,
    );
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("is translatable", () => {
    render(
      <Form.Root aria-label="F" labels={{ optional: "(dewisol)" }}>
        <Field.Root name="b">
          <Field.Label optional>Llysenw</Field.Label>
          <Input />
        </Field.Root>
      </Form.Root>,
    );
    expect(screen.getByRole("textbox", { name: "Llysenw (dewisol)" })).toBeInTheDocument();
  });

  it("outside a Form, Field.Label keeps its asterisk", () => {
    render(
      <Field.Root name="a">
        <Field.Label required>Name</Field.Label>
        <Input />
      </Field.Root>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});

describe("layout", () => {
  it("orientation passes to Fields; labelWidth sets the column", () => {
    const { container } = render(
      <Form.Root aria-label="F" orientation="horizontal" labelWidth="10rem">
        <Field.Root name="a">
          <Field.Label>Name</Field.Label>
          <Input />
        </Field.Root>
        <Field.Root name="b" orientation="vertical">
          <Field.Label>Own</Field.Label>
          <Input />
        </Field.Root>
      </Form.Root>,
    );
    const fields = container.querySelectorAll("[data-slot=field]");
    expect(fields[0]).toHaveAttribute("data-orientation", "horizontal");
    expect(fields[1]).toHaveAttribute("data-orientation", "vertical");
    const form = screen.getByRole("form");
    expect(form.style.getPropertyValue("--sp-field-label-width")).toBe("10rem");
    expect(form.className).toContain("[&_[data-slot=field][data-orientation=horizontal]]:flex-row");
  });

  it("responsive uses Field's stacking horizontal layout", () => {
    const { container } = render(
      <Form.Root aria-label="F" orientation="responsive">
        <Field.Root name="a">
          <Field.Label>Name</Field.Label>
          <Input />
        </Field.Root>
      </Form.Root>,
    );
    expect(container.querySelector("[data-slot=field]")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
    expect(screen.getByRole("form").className).not.toContain("flex-row");
  });

  it("disabled disables every control through a fieldset", () => {
    render(<Details disabled />);
    expect(screen.getByRole("textbox", { name: "Full name" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    expect(document.querySelector("[data-slot=form-fieldset]")).toBeDisabled();
  });
});

describe("submitting", () => {
  it("an async onFormSubmit makes Form.Submit busy until it settles", async () => {
    let resolve!: () => void;
    render(
      <Details
        onFormSubmit={() =>
          new Promise<void>((r) => {
            resolve = r;
          })
        }
      />,
    );
    await userEvent.type(screen.getByRole("textbox", { name: "Full name" }), "S");
    await userEvent.type(screen.getByRole("textbox", { name: "Email address" }), "e");
    const button = screen.getByRole("button", { name: "Continue" });
    await userEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute("aria-busy", "true"));
    expect(screen.getByRole("form")).toHaveAttribute("data-submitting");
    await act(async () => resolve());
    await waitFor(() => expect(button).not.toHaveAttribute("aria-busy"));
  });

  it("focus stays on Form.Submit while an async onFormSubmit is pending", async () => {
    let resolve!: () => void;
    render(
      <Form.Root aria-label="Async" onFormSubmit={() => new Promise<void>((r) => (resolve = r))}>
        <Form.Submit>Save</Form.Submit>
      </Form.Root>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    await userEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute("aria-busy", "true"));
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toHaveAttribute("disabled");
    await act(async () => resolve());
    await waitFor(() => expect(button).not.toHaveAttribute("aria-busy"));
    expect(button).toHaveFocus();
  });

  it("focus stays on Form.Submit while a server action is pending (useFormStatus)", async () => {
    let resolve!: () => void;
    const action = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    render(
      <Form.Root aria-label="Action" action={action}>
        <Form.Submit>Send</Form.Submit>
      </Form.Root>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    await userEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute("aria-busy", "true"));
    expect(button).toHaveFocus();
    expect(button).not.toHaveAttribute("disabled");
    await act(async () => resolve());
    await waitFor(() => expect(button).not.toHaveAttribute("aria-busy"));
    expect(button).toHaveFocus();
  });

  /** What's on screen: the text without aria-hidden parts or visually hidden spans. */
  const visibleText = (el: HTMLElement) => {
    const copy = el.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('[aria-hidden="true"], .sr-only').forEach((n) => n.remove());
    return copy.textContent?.trim() ?? "";
  };

  it("pendingLabel shows while busy, and is the name; the label comes back after", async () => {
    let resolve!: () => void;
    render(
      <Form.Root aria-label="P" onFormSubmit={() => new Promise<void>((r) => (resolve = r))}>
        <Form.Submit pendingLabel="Saving">Save</Form.Submit>
      </Form.Root>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    await userEvent.click(button);
    await waitFor(() => expect(visibleText(button)).toBe("Saving"));
    expect(button).toHaveAccessibleName("Saving");
    expect(button).not.toHaveAttribute("aria-label");
    expect(button).toHaveAttribute("aria-busy", "true");
    await act(async () => resolve());
    await waitFor(() => expect(visibleText(button)).toBe("Save"));
    expect(button).toHaveAccessibleName("Save");
  });

  it("while pending, the visible text equals the accessible name (WCAG 2.5.3)", async () => {
    let resolve!: () => void;
    const action = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    render(
      <Form.Root aria-label="A" action={action}>
        <Form.Submit pendingLabel="Sending">Send</Form.Submit>
      </Form.Root>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    await userEvent.click(button);
    await waitFor(() => expect(button).toHaveAttribute("aria-busy", "true"));
    expect(button).toHaveAccessibleName(visibleText(button));
    expect(visibleText(button)).toBe("Sending");
    await act(async () => resolve());
  });

  it("Form.Submit is a brand submit button", () => {
    render(<Details />);
    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button.className).toContain("bg-brand");
  });

  it("with `action`, the native submit isn't prevented (server actions)", async () => {
    const action = vi.fn();
    render(
      <Form.Root aria-label="A" action={action}>
        <Field.Root name="name">
          <Input name="name" defaultValue="x" />
        </Field.Root>
        <Form.Submit>Send</Form.Submit>
      </Form.Root>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(action).toHaveBeenCalled());
  });
});

describe("schema and transformValues", () => {
  const schema: StandardSchemaV1 = {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: (value) => {
        const v = value as { age?: string };
        return Number(v.age) >= 16
          ? { value: v }
          : { issues: [{ message: "You must be 16 or older", path: [{ key: "age" }] }] };
      },
    },
  };

  function AgeForm(props: Partial<React.ComponentProps<typeof Form.Root>>) {
    return (
      <Form.Root aria-label="Age" schema={schema} {...props}>
        <Field.Root name="age">
          <Field.Label>Age</Field.Label>
          <Input defaultValue="12" />
          <Field.Error />
        </Field.Root>
        <Form.Submit>Go</Form.Submit>
      </Form.Root>
    );
  }

  it("schema issues show by field name and stop the submit", async () => {
    const onFormSubmit = vi.fn();
    const onInvalid = vi.fn();
    render(<AgeForm onFormSubmit={onFormSubmit} onInvalid={onInvalid} />);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    await waitFor(() =>
      expect(
        within(summary()).getByRole("link", { name: "You must be 16 or older" }),
      ).toBeInTheDocument(),
    );
    expect(document.querySelector("[data-slot=field-error]")).toHaveTextContent(
      "You must be 16 or older",
    );
    expect(onFormSubmit).not.toHaveBeenCalled();
    expect(onInvalid).toHaveBeenCalledWith([{ name: "age", message: "You must be 16 or older" }]);
  });

  it("transformValues runs before the schema and onFormSubmit", async () => {
    const onFormSubmit = vi.fn();
    render(
      <AgeForm
        transformValues={(v) => ({ ...v, age: String(Number(v.age) + 10) })}
        onFormSubmit={onFormSubmit}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    await waitFor(() =>
      expect(onFormSubmit).toHaveBeenCalledWith({ age: "22" }, expect.anything()),
    );
  });
});

describe("warnOnUnsavedChanges", () => {
  function fireBeforeUnload() {
    const event = new Event("beforeunload", { cancelable: true }) as BeforeUnloadEvent;
    window.dispatchEvent(event);
    return event.defaultPrevented;
  }

  it("asks before leaving once a field has changed, and not before", async () => {
    render(<Details warnOnUnsavedChanges />);
    expect(fireBeforeUnload()).toBe(false);
    await userEvent.type(screen.getByRole("textbox", { name: "Full name" }), "S");
    expect(fireBeforeUnload()).toBe(true);
  });

  it("off by default", async () => {
    render(<Details />);
    await userEvent.type(screen.getByRole("textbox", { name: "Full name" }), "S");
    expect(fireBeforeUnload()).toBe(false);
  });
});
