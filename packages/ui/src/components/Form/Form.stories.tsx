import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Form, type FormErrors, type StandardSchemaV1 } from "./Form";
import { Field } from "../Field/Field";
import { Fieldset } from "../Fieldset/Fieldset";
import { Input } from "../Input/Input";
import { Textarea } from "../Textarea/Textarea";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { Button } from "../Button/Button";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";
import { DescriptionList } from "../DescriptionList/DescriptionList";
import { Link } from "../Link/Link";
import { cn } from "../../lib/cn";

const meta: Meta<typeof Form.Root> = {
  title: "Components/Form",
  component: Form.Root,
  parameters: {
    docs: {
      description: {
        component:
          "Base UI's Form with GOV.UK's error handling built in. Fields validate on submit, then again as they change. A failed submit shows an error summary at the top that takes focus, lists each error as a link to its field and puts “Error:” in the page title. Server errors go in `errors` (by field name) and `formErrors`. Labels mark optional fields with “(optional)”, never asterisks. Use `Form.Submit` for the call to action: it shows the pending state of a server `action` or an async `onFormSubmit`. Browser validation is off (Base UI sets `noValidate`), so write your own messages: “Enter your full name”, not “This field is required”.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Form.Root>;

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide", className)}>
    {children}
  </p>
);

const Frame = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("w-full sm:max-w-lg", className)}>{children}</div>
);

/** GOV.UK wording: an instruction when it's empty. */
const required = (message: string) => (value: unknown) =>
  value == null || String(value).trim() === "" ? message : null;
const email = (value: unknown) =>
  String(value ?? "").trim() === ""
    ? null
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
      ? null
      : "Enter an email address in the correct format, like name@example.com";

function NameField({ defaultValue }: { defaultValue?: string }) {
  return (
    <Field.Root name="name" validate={required("Enter your full name")}>
      <Field.Label>Full name</Field.Label>
      <Field.Content>
        <Input autoComplete="name" defaultValue={defaultValue} />
        <Field.Error />
      </Field.Content>
    </Field.Root>
  );
}

function EmailField({ optional, defaultValue }: { optional?: boolean; defaultValue?: string }) {
  return (
    <Field.Root
      name="email"
      validate={(v) =>
        optional ? email(v) : (required("Enter your email address")(v) ?? email(v))
      }
    >
      <Field.Label optional={optional} required={!optional}>
        Email address
      </Field.Label>
      {/* Field.Content keeps description, control and error together in horizontal layouts */}
      <Field.Content>
        <Field.Description>We’ll only use this to send your receipt.</Field.Description>
        <Input type="email" autoComplete="email" spellCheck={false} defaultValue={defaultValue} />
        <Field.Error />
      </Field.Content>
    </Field.Root>
  );
}

function ContactField() {
  return (
    <Field.Root name="contact" validate={required("Select how you’d like to be contacted")}>
      <Field.Label>How would you like to be contacted?</Field.Label>
      <RadioGroup.Root>
        {["Email", "Phone", "Post"].map((option) => (
          <Field.Item key={option}>
            <Field.Group direction="row">
              <RadioGroup.Item value={option.toLowerCase()} aria-label={option} />
              <Field.Label className="cursor-pointer font-normal">{option}</Field.Label>
            </Field.Group>
          </Field.Item>
        ))}
      </RadioGroup.Root>
      <Field.Error />
    </Field.Root>
  );
}

function DetailsFields() {
  return (
    <>
      <NameField />
      <EmailField />
      <Field.Root name="phone">
        <Field.Label optional>Phone number</Field.Label>
        <Input type="tel" autoComplete="tel" />
      </Field.Root>
      <ContactField />
    </>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

/** Submit it empty to see the error summary, the inline errors and the page title. */
export const Default: Story = {
  render: () => (
    <Frame>
      <Form.Root aria-label="Your details" onFormSubmit={() => {}}>
        <DetailsFields />
        <Form.Submit>Continue</Form.Submit>
      </Form.Root>
    </Frame>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

/**
 * Field states inside a form (default, valid, error, disabled), a pending submit, and a
 * disabled form. Error shows the inline message; the summary appears after a submit.
 */
export const States: Story = {
  render: () => (
    <div className="grid w-full gap-10 md:grid-cols-2">
      <div>
        <Label>Field states</Label>
        <Form.Root aria-label="Field states" errorSummary={false}>
          <Field.Root name="default">
            <Field.Label>Default</Field.Label>
            <Input />
          </Field.Root>
          <Field.Root name="valid">
            <Field.Label>Valid</Field.Label>
            <Input valid defaultValue="sarah@example.com" />
          </Field.Root>
          <Field.Root name="error" invalid>
            <Field.Label>Error</Field.Label>
            <Input defaultValue="sarah@" />
            <Field.Error>
              Enter an email address in the correct format, like name@example.com
            </Field.Error>
          </Field.Root>
          <Field.Root name="disabled" disabled>
            <Field.Label>Disabled</Field.Label>
            <Input defaultValue="Can’t be changed" />
          </Field.Root>
          <Form.Submit loading>Saving</Form.Submit>
        </Form.Root>
      </div>
      <div>
        <Label>Disabled form</Label>
        <Form.Root aria-label="Disabled form" disabled>
          <NameField defaultValue="Sarah Philips" />
          <EmailField defaultValue="sarah@example.com" />
          <ButtonGroup.Root>
            <Form.Submit>Save</Form.Submit>
            <Button variant="outline" type="reset">
              Reset
            </Button>
          </ButtonGroup.Root>
        </Form.Root>
      </div>
    </div>
  ),
};

/* ============================================================
 * ERRORS
 * ============================================================ */

/**
 * Errors from a server: `errors` by field name (shown inline and linked in the summary), and
 * `formErrors` for the whole form (listed first, without a link). The summary takes focus.
 */
export const ServerErrors: Story = {
  render: () => (
    <Frame>
      <Form.Root
        aria-label="Sign up"
        errors={{
          email: "An account already exists with this email address",
          name: "Enter your full name",
        }}
        formErrors={["Your session expired. Your answers have been saved; submit again."]}
        onFormSubmit={() => {}}
      >
        <NameField />
        <EmailField defaultValue="sarah@example.com" />
        <Form.Submit>Create account</Form.Submit>
      </Form.Root>
    </Frame>
  ),
};

/** `Form.ErrorSummary` places the summary yourself, e.g. under the page heading (GOV.UK). */
export const SummaryPlacement: Story = {
  render: () => (
    <Frame>
      <Form.Root aria-label="Apply" onFormSubmit={() => {}}>
        <h1 className="text-fg-default text-2xl font-semibold">Apply for a library card</h1>
        <Form.ErrorSummary />
        <NameField />
        <Form.Submit>Apply</Form.Submit>
      </Form.Root>
    </Frame>
  ),
};

/** `focusTarget`: the summary (default), `auto` (the field when there are fewer than 3 errors), or `field`. */
export const FocusTarget: Story = {
  render: () => (
    <div className="grid w-full gap-10 md:grid-cols-3">
      {(["summary", "auto", "field"] as const).map((target) => (
        <div key={target}>
          <Label>{target}</Label>
          <Form.Root aria-label={`Focus ${target}`} focusTarget={target} onFormSubmit={() => {}}>
            <NameField />
            <Form.Submit>Continue</Form.Submit>
          </Form.Root>
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * SUBMITTING
 * ============================================================ */

/** An async `onFormSubmit`: Form.Submit shows the pending state until it settles. */
export const AsyncSubmit: Story = {
  render: function AsyncSubmitStory() {
    const [saved, setSaved] = React.useState<string | null>(null);
    return (
      <Frame className="flex flex-col gap-4">
        <Form.Root
          aria-label="Profile"
          onFormSubmit={async (values) => {
            await new Promise((r) => setTimeout(r, 1500));
            setSaved(String(values.name));
          }}
        >
          <NameField defaultValue="Sarah Philips" />
          <Form.Submit pendingLabel="Saving">Save</Form.Submit>
        </Form.Root>
        {saved && (
          <p role="status" className="text-fg-default text-sm">
            Saved {saved}.
          </p>
        )}
      </Frame>
    );
  },
};

/**
 * A server action with `useActionState`: `action` keeps the native submit, `errors` come
 * back from the action, and Form.Submit reads `useFormStatus`. Here the "server" is a
 * client function that waits a second; leave the name empty to get an error back.
 */
export const ServerAction: Story = {
  render: function ServerActionStory() {
    type State = { errors?: FormErrors; done?: string };
    const [state, formAction] = React.useActionState<State, FormData>(async (_prev, data) => {
      await new Promise((r) => setTimeout(r, 1000));
      const name = String(data.get("name") ?? "").trim();
      if (!name) return { errors: { name: "Enter your full name" } };
      return { done: name };
    }, {});
    return (
      <Frame className="flex flex-col gap-4">
        <Form.Root aria-label="Server action" action={formAction} errors={state.errors}>
          <Field.Root name="name">
            <Field.Label>Full name</Field.Label>
            <Input name="name" autoComplete="name" />
            <Field.Error />
          </Field.Root>
          <Form.Submit pendingLabel="Sending">Send</Form.Submit>
        </Form.Root>
        {state.done && (
          <p role="status" className="text-fg-default text-sm">
            Thanks, {state.done}.
          </p>
        )}
      </Frame>
    );
  },
};

/* ============================================================
 * SCHEMA & VALUES
 * ============================================================ */

// A hand-written Standard Schema v1; Zod, Valibot and ArkType produce the same shape.
const signUpSchema: StandardSchemaV1<{ email: string; age: number }> = {
  "~standard": {
    version: 1,
    vendor: "example",
    validate: (value) => {
      const v = value as { email?: string; age?: string };
      const issues: { message: string; path: string[] }[] = [];
      if (!v.email?.includes("@"))
        issues.push({
          message: "Enter an email address in the correct format, like name@example.com",
          path: ["email"],
        });
      const age = Number(v.age);
      if (!Number.isInteger(age) || age < 16)
        issues.push({ message: "You must be 16 or older to sign up", path: ["age"] });
      return issues.length ? { issues } : { value: { email: v.email!, age } };
    },
  },
};

/** `schema` takes any Standard Schema (Zod 3.24+, Valibot, ArkType…); its issues show by name. */
export const Schema: Story = {
  render: () => (
    <Frame>
      <Form.Root aria-label="Sign up" schema={signUpSchema} onFormSubmit={() => {}}>
        <Field.Root name="email">
          <Field.Label>Email address</Field.Label>
          <Input defaultValue="sarah" />
          <Field.Error />
        </Field.Root>
        <Field.Root name="age">
          <Field.Label>Age</Field.Label>
          <Input inputMode="numeric" defaultValue="12" className="w-24" />
          <Field.Error />
        </Field.Root>
        <Form.Submit>Sign up</Form.Submit>
      </Form.Root>
    </Frame>
  ),
};

/** `transformValues` reshapes the values before `schema` and `onFormSubmit`: here, trimmed. */
export const TransformValues: Story = {
  render: function TransformStory() {
    const [out, setOut] = React.useState<string>("");
    return (
      <Frame className="flex flex-col gap-4">
        <Form.Root
          aria-label="Postcode"
          transformValues={(v) => ({
            postcode: String(v.postcode ?? "")
              .replace(/\s+/g, "")
              .toUpperCase(),
          })}
          onFormSubmit={(v) => setOut(JSON.stringify(v))}
        >
          <Field.Root name="postcode">
            <Field.Label>Postcode</Field.Label>
            <Field.Description>We’ll remove spaces and capitalise it.</Field.Description>
            <Input defaultValue=" sw1a 1aa " className="w-40" />
          </Field.Root>
          <Form.Submit>Check</Form.Submit>
        </Form.Root>
        {out && (
          <p role="status" className="text-fg-default font-mono text-sm">
            {out}
          </p>
        )}
      </Frame>
    );
  },
};

/* ============================================================
 * LABELS & LAYOUT
 * ============================================================ */

/**
 * `necessity`: “(optional)” after optional fields (default, GOV.UK), “(required)” after
 * required ones (when most are optional), or no marking. Never asterisks inside a Form.
 */
export const Necessity: Story = {
  render: () => (
    <div className="grid w-full gap-10 md:grid-cols-3">
      {(["optional", "required", "none"] as const).map((necessity) => (
        <div key={necessity}>
          <Label>{necessity}</Label>
          <Form.Root
            aria-label={`Necessity ${necessity}`}
            necessity={necessity}
            errorSummary={false}
          >
            <Field.Root name="name">
              <Field.Label required>Full name</Field.Label>
              <Input required />
            </Field.Root>
            <Field.Root name="nickname">
              <Field.Label optional>Nickname</Field.Label>
              <Input />
            </Field.Root>
          </Form.Root>
        </div>
      ))}
    </div>
  ),
};

/**
 * `orientation`: labels above (vertical, default), beside (horizontal), or above on small
 * screens and beside from `sm` (responsive). `labelWidth` sets the label column.
 */
export const Orientation: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-10 sm:max-w-xl">
      {(["vertical", "horizontal", "responsive"] as const).map((orientation) => (
        <div key={orientation}>
          <Label>{orientation}</Label>
          <Form.Root
            aria-label={`Orientation ${orientation}`}
            orientation={orientation}
            labelWidth="10rem"
            errorSummary={false}
          >
            <NameField />
            <EmailField optional />
          </Form.Root>
        </div>
      ))}
    </div>
  ),
};

/** `warnOnUnsavedChanges`: the browser asks before leaving while a field has unsaved changes. */
export const UnsavedChanges: Story = {
  render: () => (
    <Frame>
      <Form.Root aria-label="Notes" warnOnUnsavedChanges onFormSubmit={() => {}}>
        <Field.Root name="notes">
          <Field.Label>Notes</Field.Label>
          <Field.Description>Type something, then try to reload the page.</Field.Description>
          <Textarea />
        </Field.Root>
        <Form.Submit>Save</Form.Submit>
      </Form.Root>
    </Frame>
  ),
};

/* ============================================================
 * PATTERNS (GOV.UK)
 * ============================================================ */

/** GOV.UK's date-of-birth messages, checked on the Day field so the summary link focuses Day. */
function dateOfBirthError(_value: unknown, values: Record<string, unknown>) {
  const day = String(values["dob-day"] ?? "").trim();
  const month = String(values["dob-month"] ?? "").trim();
  const year = String(values["dob-year"] ?? "").trim();
  if (!day && !month && !year) return "Enter your date of birth";
  if (!day) return "Date of birth must include a day";
  if (!month) return "Date of birth must include a month";
  if (!year) return "Date of birth must include a year";
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  const date = new Date(y, m - 1, d);
  if (
    !/^\d{4}$/.test(year) ||
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return "Date of birth must be a real date";
  }
  if (date > new Date()) return "Date of birth must be in the past";
  return null;
}

/**
 * One thing per page (GOV.UK): the question is the page heading. A date is a fieldset whose
 * legend is the h1, with three labelled inputs sized to what they hold. The one message sits
 * on the Day field, so the summary link focuses Day.
 */
export const QuestionPage: Story = {
  render: () => (
    <Frame>
      <Form.Root aria-labelledby="question-heading" onFormSubmit={() => {}}>
        <Form.ErrorSummary />
        <Fieldset.Root className="m-0 flex flex-col gap-2 border-0 p-0">
          <Fieldset.Legend className="mb-1">
            <h1 id="question-heading" className="text-fg-default m-0 text-2xl font-semibold">
              What is your date of birth?
            </h1>
          </Fieldset.Legend>
          <Fieldset.Description>For example, 27 3 2007</Fieldset.Description>
          <div className="grid grid-cols-[auto_auto_auto] justify-start gap-x-4 gap-y-1.5">
            {/* `contents`: Day's label, input and error take part in this grid, so the error
                can span all three columns above the inputs (GOV.UK) */}
            <Field.Root name="dob-day" validate={dateOfBirthError} className="contents">
              <Field.Label className="row-start-2">Day</Field.Label>
              <Input
                inputMode="numeric"
                autoComplete="bday-day"
                className="row-start-3 w-[4.5rem]"
              />
              <Field.Error className="col-span-3 row-start-1" />
            </Field.Root>
            <Field.Root name="dob-month" className="row-span-2 row-start-2 w-auto">
              <Field.Label>Month</Field.Label>
              <Input inputMode="numeric" autoComplete="bday-month" className="w-[4.5rem]" />
            </Field.Root>
            <Field.Root name="dob-year" className="row-span-2 row-start-2 w-auto">
              <Field.Label>Year</Field.Label>
              <Input inputMode="numeric" autoComplete="bday-year" className="w-[6rem]" />
            </Field.Root>
          </div>
        </Fieldset.Root>
        <Form.Submit>Continue</Form.Submit>
      </Form.Root>
    </Frame>
  ),
};

/** Check answers: a summary list with Change links (DescriptionList), then one submit. */
export const CheckAnswers: Story = {
  render: () => (
    <Frame>
      <Form.Root aria-labelledby="check-heading" onFormSubmit={() => {}}>
        <h1 id="check-heading" className="text-fg-default m-0 text-2xl font-semibold">
          Check your answers before sending your application
        </h1>
        <DescriptionList.Root labelStyle="strong">
          <DescriptionList.Item>
            <DescriptionList.Term>Name</DescriptionList.Term>
            <DescriptionList.Details>Sarah Philips</DescriptionList.Details>
            <DescriptionList.Actions>
              <DescriptionList.Action href="#name">Change</DescriptionList.Action>
            </DescriptionList.Actions>
          </DescriptionList.Item>
          <DescriptionList.Item>
            <DescriptionList.Term>Date of birth</DescriptionList.Term>
            <DescriptionList.Details>5 January 1978</DescriptionList.Details>
            <DescriptionList.Actions>
              <DescriptionList.Action href="#dob">Change</DescriptionList.Action>
            </DescriptionList.Actions>
          </DescriptionList.Item>
          <DescriptionList.Item>
            <DescriptionList.Term>Phone number</DescriptionList.Term>
            <DescriptionList.Details />
            <DescriptionList.Actions>
              <DescriptionList.Action href="#phone">Change</DescriptionList.Action>
            </DescriptionList.Actions>
          </DescriptionList.Item>
        </DescriptionList.Root>
        <h2 className="text-fg-default m-0 text-xl font-semibold">Now send your application</h2>
        <p className="text-fg-default m-0 text-base">
          By submitting this application you are confirming that, to the best of your knowledge, the
          details you are providing are correct.
        </p>
        <Form.Submit className="self-start">Accept and send</Form.Submit>
      </Form.Root>
    </Frame>
  ),
};

/** Confirmation: what happened, the reference, and what happens next. */
export const Confirmation: Story = {
  render: () => (
    <Frame className="flex flex-col gap-6">
      <div
        role="status"
        className="bg-success text-fg-on-success flex flex-col gap-2 rounded-md p-6 text-center"
      >
        <h1 className="m-0 text-2xl font-semibold">Application complete</h1>
        <p className="m-0 text-lg">
          Your reference number
          <br />
          <strong>HDJ2123F</strong>
        </p>
      </div>
      <p className="text-fg-default m-0">We have sent you a confirmation email.</p>
      <h2 className="text-fg-default m-0 text-xl font-semibold">What happens next</h2>
      <p className="text-fg-default m-0">
        We’ve sent your application to the library. They will contact you within 5 working days.
      </p>
      <Link href="#feedback">What did you think of this service?</Link>
    </Frame>
  ),
};

/* ============================================================
 * RECIPES
 * ============================================================ */

const recipes = [
  {
    title: "React Hook Form",
    code: `const { control, handleSubmit, formState } = useForm();
// Base UI never calls onFormSubmit while a field is invalid, so let RHF validate:
<Form.Root onSubmit={handleSubmit(save)} errors={toFormErrors(formState.errors)}>
  <Controller name="email" control={control} rules={{ required: "Enter your email address" }}
    render={({ field, fieldState }) => (
      <Field.Root name="email" invalid={fieldState.invalid} touched={fieldState.isTouched}>
        <Field.Label>Email address</Field.Label>
        <Input {...field} />
        <Field.Error match={!!fieldState.error}>{fieldState.error?.message}</Field.Error>
      </Field.Root>
    )} />
</Form.Root>
// toFormErrors: Object.fromEntries(Object.entries(errors).map(([k, e]) => [k, e.message]))`,
  },
  {
    title: "TanStack Form",
    code: `const form = useForm({ defaultValues, validators: { onSubmit: schema }, onSubmit: save });
<Form.Root onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
>
  <form.Field name="email">{(field) => (
    <Field.Root name="email" invalid={!field.state.meta.isValid}>
      <Input value={field.state.value} onValueChange={field.handleChange} onBlur={field.handleBlur} />
      <Field.Error match={!field.state.meta.isValid}>{field.state.meta.errors[0]}</Field.Error>
    </Field.Root>)}
  </form.Field>
</Form.Root>`,
  },
  {
    title: "Server action (Next.js, React 19)",
    code: `"use server" // actions.ts: return { errors: { email: "…" }, formErrors: ["…"] }
const [state, formAction] = useActionState(signUp, {});
<Form.Root action={formAction} errors={state.errors} formErrors={state.formErrors}>
  …fields with name=…
  <Form.Submit>Sign up</Form.Submit>   {/* reads useFormStatus().pending */}
</Form.Root>`,
  },
];

/**
 * How Form works with form libraries and server actions. No adapter packages: Southpaw's
 * controls take `value`/`onValueChange`, forward refs and render named inputs.
 */
export const Recipes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6 sm:max-w-3xl">
      {recipes.map((r) => (
        <section key={r.title} aria-label={r.title}>
          <h2 className="text-fg-default mb-2 text-base font-semibold">{r.title}</h2>
          <pre className="bg-surface-sunken text-fg-default overflow-x-auto rounded-md p-4 text-xs">
            <code>{r.code}</code>
          </pre>
        </section>
      ))}
    </div>
  ),
};

/* ============================================================
 * DENSITY & THEMES
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <div className="grid w-full gap-10 md:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <Label>{density}</Label>
          <Form.Root aria-label={`Density ${density}`} errorSummary={false}>
            <NameField />
            <EmailField optional />
            <Form.Submit>Continue</Form.Submit>
          </Form.Root>
        </div>
      ))}
    </div>
  ),
};

/** Every state in each theme: summary, error, valid, disabled, optional marking, the brand submit. */
export const Themes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          aria-label={theme}
          className="bg-surface-base text-fg-default grid gap-8 rounded-lg p-6 md:grid-cols-2"
        >
          <div>
            <Label>{theme} · errors</Label>
            <Form.Root
              aria-label={`${theme} errors`}
              errors={{ [`${theme}-email`]: "An account already exists with this email address" }}
              formErrors={["Your session expired. Submit again."]}
              focusTarget="field"
            >
              <Field.Root name={`${theme}-email`}>
                <Field.Label>Email address</Field.Label>
                <Input defaultValue="sarah@example.com" />
                <Field.Error />
              </Field.Root>
              <Form.Submit>Create account</Form.Submit>
            </Form.Root>
          </div>
          <div>
            <Label>{theme} · states</Label>
            <Form.Root aria-label={`${theme} states`} errorSummary={false}>
              <Field.Root name="valid">
                <Field.Label>Valid</Field.Label>
                <Input valid defaultValue="Sarah Philips" />
              </Field.Root>
              <Field.Root name="optional">
                <Field.Label optional>Nickname</Field.Label>
                <Input />
              </Field.Root>
              <Field.Root name="disabled" disabled>
                <Field.Label>Disabled</Field.Label>
                <Input defaultValue="Can’t be changed" />
              </Field.Root>
              <ButtonGroup.Root>
                <Form.Submit loading>Saving</Form.Submit>
                <Form.Submit disabled>Disabled</Form.Submit>
              </ButtonGroup.Root>
            </Form.Root>
          </div>
        </section>
      ))}
    </div>
  ),
};
