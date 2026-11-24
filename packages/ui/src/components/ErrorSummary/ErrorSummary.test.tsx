import * as React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ErrorSummary,
  ErrorMessagesProvider,
  defaultErrorMessages,
  getErrorMessage,
  getValidityKey,
  type ErrorSummaryError,
} from "./ErrorSummary";
import { lowerFirst } from "./error-messages";
import { Form } from "../Form/Form";
import { Field } from "../Field/Field";
import { Input } from "../Input/Input";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { Select } from "../Select/Select";
import { Combobox } from "../Combobox/Combobox";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import { renderToString } from "react-dom/server";

const summary = () => document.querySelector<HTMLElement>("[data-slot=error-summary]")!;

function Targets() {
  return (
    <>
      <label htmlFor="name">Full name</label>
      <input id="name" />
      <label htmlFor="email">Email address</label>
      <input id="email" />
    </>
  );
}

const errors: ErrorSummaryError[] = [
  { message: "Enter your full name", target: "name" },
  { message: "Enter your email address", target: "email" },
];

afterEach(() => {
  document.title = "";
});

describe("ErrorSummary", () => {
  /* ---------- structure ---------- */

  it("is hidden with no errors", () => {
    render(<ErrorSummary.Root errors={[]} />);
    expect(summary()).toHaveAttribute("hidden");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("renders the GOV.UK anatomy: inner alert, heading and links", () => {
    render(
      <>
        <ErrorSummary.Root errors={errors} focusTarget="none" updateTitle={false} />
        <Targets />
      </>,
    );
    const alert = screen.getByRole("alert");
    expect(alert.parentElement).toBe(summary());
    const heading = screen.getByRole("heading", { level: 2, name: "There is a problem" });
    expect(heading).toHaveAttribute("data-slot", "error-summary-title");
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["#name", "#email"]);
    expect(links[0]).toHaveAttribute("data-slot", "error-summary-link");
  });

  it("an error without a target is plain text", () => {
    render(<ErrorSummary.Root errors={[{ message: "Session expired" }]} focusTarget="none" />);
    expect(screen.getByText("Session expired").closest("a")).toBeNull();
  });

  it("title and description shorthands", () => {
    render(
      <ErrorSummary.Root
        errors={errors}
        title="Check your answers"
        description="Fix these to continue."
        focusTarget="none"
      />,
    );
    expect(screen.getByRole("heading", { name: "Check your answers" })).toBeInTheDocument();
    expect(screen.getByText("Fix these to continue.")).toHaveAttribute(
      "data-slot",
      "error-summary-description",
    );
  });

  it("custom anatomy without a list (high-level message)", () => {
    render(
      <ErrorSummary.Root errors={errors} focusTarget="none">
        <ErrorSummary.Title />
        <ErrorSummary.Description>Some answers need changing.</ErrorSummary.Description>
      </ErrorSummary.Root>,
    );
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("Some answers need changing.")).toBeInTheDocument();
  });

  it("Item render swaps the link element", () => {
    render(
      <>
        <ErrorSummary.Root errors={errors} focusTarget="none">
          <ErrorSummary.List>
            {(error, i) => (
              <ErrorSummary.Item
                key={i}
                target={error.target}
                render={(props) => (
                  <a {...props} data-router="">
                    {props.children}
                  </a>
                )}
              >
                {error.message}
              </ErrorSummary.Item>
            )}
          </ErrorSummary.List>
        </ErrorSummary.Root>
        <Targets />
      </>,
    );
    expect(screen.getAllByRole("link")[0]).toHaveAttribute("data-router");
  });

  /* ---------- focus ---------- */

  it("takes focus when shown, with a tabindex removed on blur", async () => {
    render(<ErrorSummary.Root errors={errors} updateTitle={false} />);
    await waitFor(() => expect(summary()).toHaveFocus());
    expect(summary()).toHaveAttribute("tabindex", "-1");
    summary().blur();
    expect(summary()).not.toHaveAttribute("tabindex");
  });

  it("focusTarget=none leaves focus alone", async () => {
    render(<ErrorSummary.Root errors={errors} focusTarget="none" />);
    await new Promise((r) => setTimeout(r, 10));
    expect(summary()).not.toHaveFocus();
  });

  it("focusTarget=auto focuses the first field when there are fewer than 3 errors", async () => {
    render(
      <>
        <ErrorSummary.Root errors={errors} focusTarget="auto" />
        <Targets />
      </>,
    );
    await waitFor(() => expect(document.getElementById("name")).toHaveFocus());
  });

  it("focusTarget=auto focuses the summary with 3 or more errors", async () => {
    render(
      <>
        <ErrorSummary.Root
          errors={[...errors, { message: "Third", target: "name" }]}
          focusTarget="auto"
        />
        <Targets />
      </>,
    );
    await waitFor(() => expect(summary()).toHaveFocus());
  });

  it("a new array with the same errors doesn't steal focus again", async () => {
    const { rerender } = render(
      <>
        <ErrorSummary.Root errors={[...errors]} />
        <Targets />
      </>,
    );
    await waitFor(() => expect(summary()).toHaveFocus());
    document.getElementById("email")!.focus();
    rerender(
      <>
        <ErrorSummary.Root errors={[...errors]} />
        <Targets />
      </>,
    );
    await new Promise((r) => setTimeout(r, 10));
    expect(document.getElementById("email")).toHaveFocus();
  });

  it("a link moves focus to its field", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ErrorSummary.Root errors={errors} focusTarget="none" />
        <Targets />
      </>,
    );
    await user.click(screen.getByRole("link", { name: "Enter your email address" }));
    expect(document.getElementById("email")).toHaveFocus();
  });

  it("errors can name a field, looked up in the form", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <ErrorSummary.Root errors={[{ message: "Enter a postcode", name: "postcode" }]} />
        <input name="postcode" id="pc" aria-label="Postcode" />
      </form>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "#pc");
    await user.click(screen.getByRole("link"));
    expect(screen.getByRole("textbox", { name: "Postcode" })).toHaveFocus();
  });

  /* ---------- page title ---------- */

  it('prefixes the page title with "Error: (n errors)" and restores it', () => {
    document.title = "Apply";
    const { rerender, unmount } = render(<ErrorSummary.Root errors={errors} focusTarget="none" />);
    expect(document.title).toBe("Error: (2 errors) Apply");
    rerender(<ErrorSummary.Root errors={errors.slice(0, 1)} focusTarget="none" />);
    expect(document.title).toBe("Error: (1 error) Apply");
    rerender(<ErrorSummary.Root errors={[]} focusTarget="none" />);
    expect(document.title).toBe("Apply");
    rerender(<ErrorSummary.Root errors={errors} focusTarget="none" />);
    unmount();
    expect(document.title).toBe("Apply");
  });

  it("updateTitle={false} leaves the title; labels translate it", () => {
    document.title = "Apply";
    const { unmount } = render(
      <ErrorSummary.Root errors={errors} focusTarget="none" updateTitle={false} />,
    );
    expect(document.title).toBe("Apply");
    unmount();
    render(
      <ErrorSummary.Root
        errors={errors}
        focusTarget="none"
        labels={{
          title: "Il y a un problème",
          titlePrefix: "Erreur : ",
          titleCount: (n) => `(${n} erreurs) `,
        }}
      />,
    );
    expect(document.title).toBe("Erreur : (2 erreurs) Apply");
    expect(screen.getByRole("heading", { name: "Il y a un problème" })).toBeInTheDocument();
  });

  /* ---------- collect mode ---------- */

  function CollectForm({ onErrorsChange }: { onErrorsChange?: (e: ErrorSummaryError[]) => void }) {
    return (
      <Form.Root>
        <ErrorSummary.Root updateTitle={false} onErrorsChange={onErrorsChange} />
        <Field.Root name="name">
          <Field.Label>Full name</Field.Label>
          <Input required />
          <Field.Error match="valueMissing">Enter your full name</Field.Error>
        </Field.Root>
        <Field.Root name="email">
          <Field.Label>Email address</Field.Label>
          <Input type="email" required />
        </Field.Root>
        <Field.Root name="plan">
          <Field.Label>Plan</Field.Label>
          <RadioGroup.Root required>
            <RadioGroup.Item value="free" aria-label="Free" />
            <RadioGroup.Item value="pro" aria-label="Pro" />
          </RadioGroup.Root>
        </Field.Root>
        <button type="submit">Send</button>
      </Form.Root>
    );
  }

  it("collects the form's errors on submit, using the inline text or a template", async () => {
    const user = userEvent.setup();
    const onErrorsChange = vi.fn();
    render(<CollectForm onErrorsChange={onErrorsChange} />);
    expect(summary()).toHaveAttribute("hidden");
    await user.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(summary()).not.toHaveAttribute("hidden"));
    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Enter your full name",
      "Enter email address",
      "Select plan",
    ]);
    expect(onErrorsChange).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(summary()).toHaveFocus());
  });

  it("a radio group's error links to its first option", async () => {
    const user = userEvent.setup();
    render(<CollectForm />);
    await user.click(screen.getByRole("button", { name: "Send" }));
    const link = await screen.findByRole("link", { name: "Select plan" });
    await user.click(link);
    expect(screen.getByRole("radio", { name: "Free" })).toHaveFocus();
  });

  it("clears when the form is resubmitted without errors", async () => {
    const user = userEvent.setup();
    render(<CollectForm />);
    await user.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(summary()).not.toHaveAttribute("hidden"));
    await user.type(screen.getByRole("textbox", { name: "Full name" }), "Ada");
    await user.type(screen.getByRole("textbox", { name: "Email address" }), "ada@example.com");
    await user.click(screen.getByRole("radio", { name: "Pro" }));
    await user.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(summary()).toHaveAttribute("hidden"));
  });

  it("clears on form reset", async () => {
    const user = userEvent.setup();
    render(<CollectForm />);
    await user.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(summary()).not.toHaveAttribute("hidden"));
    fireEvent.reset(summary().closest("form")!);
    await waitFor(() => expect(summary()).toHaveAttribute("hidden"));
  });

  it("messages and ErrorMessagesProvider override the templates", async () => {
    const user = userEvent.setup();
    render(
      <ErrorMessagesProvider
        messages={{ valueMissing: ({ lowerLabel }) => `Saisissez ${lowerLabel}` }}
      >
        <Form.Root>
          <ErrorSummary.Root
            updateTitle={false}
            messages={{ typeMismatch: () => "Format incorrect" }}
          />
          <Field.Root name="name">
            <Field.Label>Nom</Field.Label>
            <Input required />
          </Field.Root>
          <Field.Root name="email">
            <Field.Label>E-mail</Field.Label>
            <Input type="email" defaultValue="x@" />
          </Field.Root>
          <button type="submit">Envoyer</button>
        </Form.Root>
      </ErrorMessagesProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Envoyer" }));
    await waitFor(() =>
      expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual([
        "Saisissez nom",
        "Format incorrect",
      ]),
    );
  });
});

describe("ErrorSummary sign-off regressions", () => {
  it("an error by name focuses the visible radio, not Base UI's hidden input", async () => {
    const user = userEvent.setup();
    render(
      <Form.Root>
        <ErrorSummary.Root
          errors={[{ message: "Select a plan", name: "plan" }]}
          focusTarget="none"
        />
        <Field.Root name="plan">
          <Field.Label>Plan</Field.Label>
          <RadioGroup.Root name="plan">
            <RadioGroup.Item value="free" aria-label="Free" />
            <RadioGroup.Item value="pro" aria-label="Pro" />
          </RadioGroup.Root>
        </Field.Root>
      </Form.Root>,
    );
    await user.click(screen.getByRole("link", { name: "Select a plan" }));
    expect(screen.getByRole("radio", { name: "Free" })).toHaveFocus();
  });

  it("an error by name focuses a Select's trigger and links to it", async () => {
    const user = userEvent.setup();
    render(
      <Form.Root>
        <ErrorSummary.Root
          errors={[{ message: "Select your country", name: "country" }]}
          focusTarget="none"
        />
        <Field.Root name="country">
          <Field.Label>Country</Field.Label>
          <Select.Root name="country" items={[{ value: "uk", label: "UK" }]}>
            <Select.Trigger>
              <Select.Value placeholder="Select a country" />
            </Select.Trigger>
          </Select.Root>
        </Field.Root>
      </Form.Root>,
    );
    const link = screen.getByRole("link", { name: "Select your country" });
    const trigger = screen.getByRole("combobox", { name: "Country" });
    await waitFor(() => expect(link).toHaveAttribute("href", `#${trigger.id}`));
    await user.click(link);
    expect(trigger).toHaveFocus();
  });

  it("collect mode reports an invalid field with no label", async () => {
    const user = userEvent.setup();
    render(
      <Form.Root>
        <ErrorSummary.Root updateTitle={false} focusTarget="none" />
        <Field.Root name="q">
          <Input required placeholder="Search" />
        </Field.Root>
        <button type="submit">Go</button>
      </Form.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByRole("link", { name: "Enter search" })).toBeInTheDocument();
  });

  it("leaves VisuallyHidden text (including focusable) out of the label in messages", async () => {
    const user = userEvent.setup();
    render(
      <Form.Root>
        <ErrorSummary.Root updateTitle={false} focusTarget="none" />
        <Field.Root name="postcode">
          <Field.Label>
            Postcode<VisuallyHidden> for delivery</VisuallyHidden>
            <VisuallyHidden focusable> (shown on focus)</VisuallyHidden>
          </Field.Label>
          <Input required />
        </Field.Root>
        <button type="submit">Go</button>
      </Form.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByRole("link", { name: "Enter postcode" })).toBeInTheDocument();
  });

  it("a Combobox gets Select wording", async () => {
    const user = userEvent.setup();
    render(
      <Form.Root>
        <ErrorSummary.Root updateTitle={false} focusTarget="none" />
        <Field.Root name="fruit">
          <Field.Label>Fruit</Field.Label>
          <Combobox.Root items={["Apple"]} required>
            <Combobox.Input />
          </Combobox.Root>
        </Field.Root>
        <button type="submit">Go</button>
      </Form.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByRole("link", { name: "Select fruit" })).toBeInTheDocument();
  });

  it("two summaries share one title prefix with the total, and restore it", () => {
    document.title = "Apply";
    const { rerender } = render(
      <>
        <ErrorSummary.Root errors={errors} focusTarget="none" />
        <ErrorSummary.Root errors={errors.slice(0, 1)} focusTarget="none" />
      </>,
    );
    expect(document.title).toBe("Error: (3 errors) Apply");
    rerender(
      <>
        <ErrorSummary.Root errors={[]} focusTarget="none" />
        <ErrorSummary.Root errors={errors.slice(0, 1)} focusTarget="none" />
      </>,
    );
    expect(document.title).toBe("Error: (1 error) Apply");
    rerender(
      <>
        <ErrorSummary.Root errors={[]} focusTarget="none" />
        <ErrorSummary.Root errors={[]} focusTarget="none" />
      </>,
    );
    expect(document.title).toBe("Apply");
  });

  it("keeps a title the app set while errors showed", () => {
    document.title = "Step 1";
    const { rerender } = render(<ErrorSummary.Root errors={errors} focusTarget="none" />);
    document.title = "Step 2";
    rerender(<ErrorSummary.Root errors={errors.slice(0, 1)} focusTarget="none" />);
    expect(document.title).toBe("Error: (1 error) Step 2");
    rerender(<ErrorSummary.Root errors={[]} focusTarget="none" />);
    expect(document.title).toBe("Step 2");
  });

  it("renders on the server without touching the DOM", () => {
    expect(() =>
      renderToString(
        <ErrorSummary.Root form="signup" errors={[{ message: "Enter an email", name: "email" }]} />,
      ),
    ).not.toThrow();
  });

  it("a changed JSX message takes focus again", async () => {
    const { rerender } = render(
      <>
        <ErrorSummary.Root errors={[{ message: <>Enter a name</>, target: "name" }]} />
        <Targets />
      </>,
    );
    await waitFor(() => expect(summary()).toHaveFocus());
    document.getElementById("email")!.focus();
    rerender(
      <>
        <ErrorSummary.Root errors={[{ message: <>Name is too long</>, target: "name" }]} />
        <Targets />
      </>,
    );
    await waitFor(() => expect(summary()).toHaveFocus());
  });

  it("removes the temporary tabindex when hidden while focused", async () => {
    const { rerender } = render(<ErrorSummary.Root errors={errors} updateTitle={false} />);
    await waitFor(() => expect(summary()).toHaveAttribute("tabindex", "-1"));
    rerender(<ErrorSummary.Root errors={[]} updateTitle={false} />);
    expect(summary()).not.toHaveAttribute("tabindex");
  });

  it("form reset reports the cleared errors", async () => {
    const user = userEvent.setup();
    const onErrorsChange = vi.fn();
    render(
      <Form.Root>
        <ErrorSummary.Root updateTitle={false} onErrorsChange={onErrorsChange} />
        <Field.Root name="name">
          <Field.Label>Name</Field.Label>
          <Input required />
        </Field.Root>
        <button type="submit">Go</button>
      </Form.Root>,
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    await waitFor(() => expect(onErrorsChange).toHaveBeenCalledTimes(1));
    fireEvent.reset(summary().closest("form")!);
    expect(onErrorsChange).toHaveBeenLastCalledWith([]);
  });
});

describe("error message templates", () => {
  const ctx = { label: "Full name", lowerLabel: "full name", kind: "text" as const };
  const validity = (flags: Partial<ValidityState>) =>
    ({ valid: false, ...flags }) as unknown as ValidityState;

  it("follow GOV.UK wording per validity type", () => {
    expect(getErrorMessage(validity({ valueMissing: true }), ctx)).toBe("Enter full name");
    expect(getErrorMessage(validity({ valueMissing: true }), { ...ctx, kind: "choice" })).toBe(
      "Select full name",
    );
    expect(getErrorMessage(validity({ tooLong: true }), { ...ctx, maxLength: 35 })).toBe(
      "Full name must be 35 characters or less",
    );
    expect(getErrorMessage(validity({ tooShort: true }), { ...ctx, minLength: 2 })).toBe(
      "Full name must be 2 characters or more",
    );
    expect(getErrorMessage(validity({ typeMismatch: true }), { ...ctx, type: "email" })).toMatch(
      /^Enter an email address in the correct format/,
    );
    expect(
      getErrorMessage(validity({ rangeUnderflow: true }), { ...ctx, label: "Age", min: "16" }),
    ).toBe("Age must be 16 or more");
    expect(
      getErrorMessage(validity({ rangeOverflow: true }), {
        ...ctx,
        label: "Date",
        max: "2026-01-01",
        type: "date",
      }),
    ).toMatch(/^Date must be the same as or before .*2026$/);
    expect(
      getErrorMessage(validity({ stepMismatch: true }), { ...ctx, label: "Age", step: "1" }),
    ).toBe("Age must be a whole number");
    expect(getErrorMessage(validity({ badInput: true }), { ...ctx, label: "Age" })).toBe(
      "Age must be a number",
    );
    expect(getErrorMessage({ valid: true } as ValidityState, ctx)).toBeNull();
  });

  it("covers time, fractional steps and choice wording", () => {
    expect(
      getErrorMessage(validity({ rangeUnderflow: true }), {
        ...ctx,
        label: "Start time",
        min: "09:00",
        type: "time",
      }),
    ).toBe("Start time must be the same as or after 09:00");
    expect(
      getErrorMessage(validity({ stepMismatch: true }), {
        ...ctx,
        label: "Weight",
        step: "1",
        min: "0.5",
        type: "number",
      }),
    ).toBe("Weight must be in steps of 1, starting from 0.5");
    expect(
      getErrorMessage(validity({ customError: true }), {
        ...ctx,
        lowerLabel: "plan",
        kind: "choice",
      }),
    ).toBe("Select plan");
  });

  it("missing information comes before other failures", () => {
    expect(getValidityKey(validity({ valueMissing: true, patternMismatch: true }))).toBe(
      "valueMissing",
    );
    expect(getValidityKey(validity({ customError: true }))).toBe("invalid");
  });

  it("lowerFirst keeps acronyms", () => {
    expect(lowerFirst("Full name")).toBe("full name");
    expect(lowerFirst("NHS number")).toBe("NHS number");
  });

  it("defaults never say please, sorry, valid or invalid", () => {
    const all = Object.values(defaultErrorMessages).map((fn) =>
      fn({ ...ctx, type: "email", minLength: 1, maxLength: 2, min: "1", max: "2", step: "2" }),
    );
    for (const text of all) expect(text).not.toMatch(/please|sorry|\bvalid\b|invalid/i);
  });
});
