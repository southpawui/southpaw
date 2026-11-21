import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ErrorSummary,
  ErrorMessagesProvider,
  type ErrorMessages,
  type ErrorSummaryError,
  type ErrorSummaryRootProps,
} from "./ErrorSummary";
import { Form } from "../Form/Form";
import { Field } from "../Field/Field";
import { Fieldset } from "../Fieldset/Fieldset";
import { Input } from "../Input/Input";
import { Textarea } from "../Textarea/Textarea";
import { Select } from "../Select/Select";
import { Combobox } from "../Combobox/Combobox";
import { NumberField } from "../NumberField/NumberField";
import { OTPField } from "../OTPField/OTPField";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { CheckboxGroup } from "../CheckboxGroup/CheckboxGroup";
import { Checkbox } from "../Checkbox/Checkbox";
import { Switch } from "../Switch/Switch";
import { Button } from "../Button/Button";
import { cn } from "../../lib/cn";

const meta: Meta<typeof ErrorSummary.Root> = {
  title: "Components/ErrorSummary",
  component: ErrorSummary.Root,
  parameters: {
    docs: {
      description: {
        component:
          "Shown at the top of a form after a failed submit (GOV.UK pattern). It takes focus, links each error to its field and puts “Error: (2 errors)” before the page title. Leave out `errors` and it collects them from the form on submit; pass `errors` to control it (server errors, Form).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorSummary.Root>;

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-fg-muted mb-2 text-xs font-semibold uppercase tracking-wide">{children}</p>
);

/* ============================================================
 * Form pieces
 * ============================================================ */

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Select.Item value={value}>
      <Select.ItemIndicator />
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}

const countries = [
  { value: "uk", label: "United Kingdom" },
  { value: "ie", label: "Ireland" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
];

function CountrySelect({ name = "country" }: { name?: string }) {
  return (
    <Select.Root name={name} required items={countries}>
      <Select.Trigger>
        <Select.Value placeholder="Select a country" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.List>
              {countries.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

function Option({
  value,
  label,
  kind,
}: {
  value: string;
  label: string;
  kind: "radio" | "checkbox";
}) {
  return (
    <Field.Item>
      <Field.Group direction="row">
        {kind === "radio" ? (
          <RadioGroup.Item value={value} aria-label={label} />
        ) : (
          <Checkbox.Root name={value} value={value} aria-label={label} />
        )}
        <Field.Label className="cursor-pointer font-normal">{label}</Field.Label>
      </Field.Group>
    </Field.Item>
  );
}

const fruits = ["Apple", "Banana", "Cherry", "Grape", "Mango"];

/**
 * A realistic application form built from the library's form components.
 * Native constraints plus Field.Error messages that match the summary's wording.
 */
function ApplicationForm({
  summary,
  onValid,
}: {
  summary?: Partial<ErrorSummaryRootProps>;
  onValid?: () => void;
}) {
  const [sent, setSent] = React.useState(false);
  return (
    <Form
      className="flex flex-col gap-6 sm:max-w-lg"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
        onValid?.();
      }}
    >
      <ErrorSummary.Root {...summary} />
      <h1 className="text-fg-default text-2xl font-semibold">Apply for a library card</h1>

      <Fieldset.Root className="flex flex-col gap-4">
        <Fieldset.Legend>Your details</Fieldset.Legend>
        <Field.Root name="fullName">
          <Field.Label>Full name</Field.Label>
          <Input required maxLength={35} autoComplete="name" />
          <Field.Error match="valueMissing">Enter your full name</Field.Error>
          <Field.Error match="tooLong">Full name must be 35 characters or less</Field.Error>
        </Field.Root>
        <Field.Root name="email">
          <Field.Label>Email address</Field.Label>
          <Field.Description>We’ll only use this to send your card number.</Field.Description>
          <Input type="email" required autoComplete="email" />
          <Field.Error match="valueMissing">Enter your email address</Field.Error>
          <Field.Error match="typeMismatch">
            Enter an email address in the correct format, like name@example.com
          </Field.Error>
        </Field.Root>
        <Field.Root name="code">
          <Field.Label>Confirmation code</Field.Label>
          <Field.Description>
            Enter the 6-digit code we sent to your email address.
          </Field.Description>
          <OTPField.Root length={6} groups={[3, 3]} required />
          <Field.Error match="valueMissing">Enter the confirmation code</Field.Error>
          {/* A partly filled code reports patternMismatch (the hidden input is \d{6}) */}
          <Field.Error match="patternMismatch">Confirmation code must be 6 digits</Field.Error>
        </Field.Root>
        <Field.Root name="country">
          <Field.Label>Country</Field.Label>
          <CountrySelect />
          <Field.Error match="valueMissing">Select your country</Field.Error>
        </Field.Root>
      </Fieldset.Root>

      <Field.Root name="genre">
        <Field.Label>Favourite fruit to read about</Field.Label>
        <Combobox.Root items={fruits} required>
          <Combobox.Input placeholder="Search fruit" />
          <Combobox.Content />
        </Combobox.Root>
        <Field.Error match="valueMissing">Select a fruit</Field.Error>
      </Field.Root>

      <Field.Root name="books">
        <Field.Label>How many books do you want to borrow at a time?</Field.Label>
        <Field.Description>Up to 10.</Field.Description>
        <NumberField.Root required min={1} max={10}>
          <NumberField.Group />
        </NumberField.Root>
        <Field.Error match="valueMissing">
          Enter how many books you want to borrow at a time
        </Field.Error>
      </Field.Root>

      <Field.Root name="contact">
        <Field.Label>How should we contact you?</Field.Label>
        <RadioGroup.Root required>
          <Option kind="radio" value="email" label="Email" />
          <Option kind="radio" value="post" label="Post" />
          <Option kind="radio" value="phone" label="Phone" />
        </RadioGroup.Root>
        <Field.Error match="valueMissing">Select how we should contact you</Field.Error>
      </Field.Root>

      <Field.Root
        name="interests"
        validate={(value) =>
          Array.isArray(value) && value.length > 0 ? null : "Select at least one interest"
        }
      >
        <Field.Label>Interests</Field.Label>
        <CheckboxGroup.Root defaultValue={[]}>
          <Option kind="checkbox" value="fiction" label="Fiction" />
          <Option kind="checkbox" value="history" label="History" />
          <Option kind="checkbox" value="science" label="Science" />
        </CheckboxGroup.Root>
        <Field.Error match="customError">Select at least one interest</Field.Error>
      </Field.Root>

      <Field.Root name="reason">
        <Field.Label>Why do you want a card?</Field.Label>
        <Textarea required minLength={10} rows={3} />
        <Field.Error match="valueMissing">Enter why you want a card</Field.Error>
        <Field.Error match="tooShort">
          Why you want a card must be 10 characters or more
        </Field.Error>
      </Field.Root>

      <Field.Root name="newsletter">
        <Field.Group direction="row">
          <Switch.Root aria-label="Send me the newsletter" />
          <Field.Label className="cursor-pointer font-normal">Send me the newsletter</Field.Label>
        </Field.Group>
      </Field.Root>

      <Field.Root name="terms">
        <Field.Group direction="row">
          <Checkbox.Root required aria-label="I accept the terms" />
          <Field.Label className="cursor-pointer font-normal">I accept the terms</Field.Label>
        </Field.Group>
        <Field.Error match="valueMissing">Select to accept the terms</Field.Error>
      </Field.Root>

      <div className="flex gap-3">
        <Button type="submit">Apply</Button>
        {sent && (
          <p role="status" className="text-fg-default self-center text-sm">
            Application sent.
          </p>
        )}
      </div>
    </Form>
  );
}

/* ============================================================
 * DEFAULT
 * ============================================================ */

/** Press Apply with the form empty. Fix a field and press Apply again. */
export const Default: Story = {
  render: () => <ApplicationForm />,
};

/* ============================================================
 * SHOWCASE (static, no focus)
 * ============================================================ */

function Targets() {
  return (
    <div className="flex flex-col gap-4">
      <Field.Root invalid>
        <Field.Label>Full name</Field.Label>
        <Input id="showcase-name" />
        <Field.Error match>Enter your full name</Field.Error>
      </Field.Root>
      <Field.Root invalid>
        <Field.Label>Email address</Field.Label>
        <Input id="showcase-email" type="email" defaultValue="name@" />
        <Field.Error match>
          Enter an email address in the correct format, like name@example.com
        </Field.Error>
      </Field.Root>
    </div>
  );
}

const showcaseErrors: ErrorSummaryError[] = [
  { message: "Enter your full name", target: "showcase-name" },
  {
    message: "Enter an email address in the correct format, like name@example.com",
    target: "showcase-email",
  },
];

/* ============================================================
 * CONTROLLED (server errors)
 * ============================================================ */

/**
 * Errors from the server, keyed by field `name`. The same object feeds Base UI
 * Form's `errors` (inline messages) and the summary (looked up by name).
 */
export const ServerErrors: Story = {
  render: () => <ServerErrorsDemo />,
};

function ServerErrorsDemo() {
  {
    const [serverErrors, setServerErrors] = React.useState<Record<string, string>>({});
    const [pending, setPending] = React.useState(false);
    const summaryErrors = Object.entries(serverErrors).map(([name, message]) => ({
      name,
      message,
    }));
    return (
      <Form
        className="flex flex-col gap-6 sm:max-w-md"
        errors={serverErrors}
        onSubmit={(event) => {
          event.preventDefault();
          setPending(true);
          setTimeout(() => {
            setPending(false);
            setServerErrors({
              username: "That username is taken. Try another, like reader_42",
              postcode: "Enter a real postcode",
            });
          }, 600);
        }}
      >
        <ErrorSummary.Root errors={summaryErrors} />
        <Field.Root name="username">
          <Field.Label>Username</Field.Label>
          <Input defaultValue="reader" />
          <Field.Error />
        </Field.Root>
        <Field.Root name="postcode">
          <Field.Label>Postcode</Field.Label>
          <Input defaultValue="ZZ99" />
          <Field.Error />
        </Field.Root>
        <Button type="submit" loading={pending}>
          Create account
        </Button>
      </Form>
    );
  }
}

/* ============================================================
 * FOCUS
 * ============================================================ */

/**
 * `focusTarget="auto"` (Primer): with fewer than 3 errors, focus goes to the
 * first field instead of the summary. Fill all but one field and submit.
 */
export const FocusFirstField: Story = {
  render: () => <ApplicationForm summary={{ focusTarget: "auto" }} />,
};

/* ============================================================
 * MESSAGES
 * ============================================================ */

const fieldLabels = {
  en: {
    name: "Full name",
    email: "Email address",
    nhs: "NHS number",
    age: "Age",
    plan: "Plan",
    free: "Free",
    pro: "Pro",
    submit: "Continue",
  },
  fr: {
    name: "Nom complet",
    email: "Adresse e-mail",
    nhs: "Numéro NHS",
    age: "Âge",
    plan: "Formule",
    free: "Gratuite",
    pro: "Pro",
    submit: "Continuer",
  },
};

function TemplateForm({
  lang = "en",
  summary,
}: {
  lang?: keyof typeof fieldLabels;
  summary?: Partial<ErrorSummaryRootProps>;
}) {
  const t = fieldLabels[lang];
  return (
    <Form className="flex flex-col gap-5 sm:max-w-md" onSubmit={(e) => e.preventDefault()}>
      <ErrorSummary.Root updateTitle={false} {...summary} />
      <Field.Root name="name">
        <Field.Label>{t.name}</Field.Label>
        <Input required />
      </Field.Root>
      <Field.Root name="email">
        <Field.Label>{t.email}</Field.Label>
        <Input type="email" required defaultValue="name@" />
      </Field.Root>
      <Field.Root name="nhs">
        <Field.Label>{t.nhs}</Field.Label>
        <Input required pattern="[0-9]{10}" defaultValue="123" />
      </Field.Root>
      <Field.Root name="age">
        <Field.Label>{t.age}</Field.Label>
        <Input type="number" min={16} max={120} defaultValue="12" />
      </Field.Root>
      <Field.Root name="plan">
        <Field.Label>{t.plan}</Field.Label>
        <RadioGroup.Root required>
          <Option kind="radio" value="free" label={t.free} />
          <Option kind="radio" value="pro" label={t.pro} />
        </RadioGroup.Root>
      </Field.Root>
      <Button type="submit">{t.submit}</Button>
    </Form>
  );
}

const french: Partial<ErrorMessages> = {
  valueMissing: ({ lowerLabel, kind }) =>
    kind === "text" ? `Saisissez ${lowerLabel}` : `Sélectionnez ${lowerLabel}`,
  typeMismatch: () => "Saisissez une adresse e-mail au bon format, par exemple nom@exemple.fr",
  patternMismatch: ({ lowerLabel }) => `Saisissez ${lowerLabel} au bon format`,
  tooShort: ({ label, minLength }) => `${label} doit comporter au moins ${minLength} caractères`,
  rangeUnderflow: ({ label, min }) => `${label} doit être supérieur ou égal à ${min}`,
};

/**
 * Fields without a Field.Error get the default message for their validation
 * type (GOV.UK wording, with the field's label). Submit each form to see them.
 * The second form translates them with `ErrorMessagesProvider` and `labels`.
 */
export const Messages: Story = {
  render: () => (
    <div className="grid gap-12 md:grid-cols-2">
      <div>
        <Label>Default messages</Label>
        <TemplateForm />
      </div>
      <div lang="fr">
        <Label>Translated (French)</Label>
        <ErrorMessagesProvider messages={french}>
          <TemplateForm
            lang="fr"
            summary={{
              labels: {
                title: "Il y a un problème",
                titlePrefix: "Erreur : ",
                titleCount: (n) => `(${n} ${n === 1 ? "erreur" : "erreurs"}) `,
              },
            }}
          />
        </ErrorMessagesProvider>
      </div>
    </div>
  ),
};

/* ============================================================
 * ANATOMY
 * ============================================================ */

/**
 * The parts, for custom content: a description, a render function for the
 * list, an item rendered through a router-style link (`render`), an error
 * with no field (plain text), and a summary with no list (a high-level
 * message only).
 */
export const Anatomy: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-lg">
      <div>
        <Label>Custom parts</Label>
        <ErrorSummary.Root errors={showcaseErrors} focusTarget="none" updateTitle={false}>
          <ErrorSummary.Title>Check your answers</ErrorSummary.Title>
          <ErrorSummary.Description>
            Fix the following before you continue.
          </ErrorSummary.Description>
          <ErrorSummary.List>
            {(error, index) => (
              <ErrorSummary.Item
                key={index}
                target={error.target}
                render={(props) => (
                  // Stand-in for a router's Link component
                  <a {...props} data-router-link="">
                    {props.children}
                  </a>
                )}
              >
                {error.message}
              </ErrorSummary.Item>
            )}
          </ErrorSummary.List>
        </ErrorSummary.Root>
      </div>
      <div>
        <Label>Error with no field</Label>
        <ErrorSummary.Root
          errors={[{ message: "Your session expired. Sign in again to save your answers." }]}
          focusTarget="none"
          updateTitle={false}
        />
      </div>
      <div>
        <Label>High-level message, no list</Label>
        <ErrorSummary.Root errors={showcaseErrors} focusTarget="none" updateTitle={false}>
          <ErrorSummary.Title />
          <ErrorSummary.Description>
            Some answers need changing. They’re marked below.
          </ErrorSummary.Description>
        </ErrorSummary.Root>
      </div>
      <Targets />
    </div>
  ),
};

/* ============================================================
 * STATES
 * ============================================================ */

const manyErrors: ErrorSummaryError[] = [
  ...showcaseErrors,
  { message: "Select your country", target: "showcase-name" },
  { message: "Select how we should contact you", target: "showcase-email" },
  { message: "Why you want a card must be 10 characters or more", target: "showcase-name" },
];

function StatesGrid({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div>
        <Label>One error</Label>
        <ErrorSummary.Root
          errors={showcaseErrors.slice(0, 1)}
          focusTarget="none"
          updateTitle={false}
        />
      </div>
      <div>
        <Label>Several errors, with a description</Label>
        <ErrorSummary.Root
          errors={manyErrors}
          description="Your application has not been sent."
          focusTarget="none"
          updateTitle={false}
        />
      </div>
      <div>
        <Label>Linked and plain-text errors</Label>
        <ErrorSummary.Root
          errors={[
            showcaseErrors[0]!,
            { message: "The service is busy. Try again in a few minutes." },
          ]}
          focusTarget="none"
          updateTitle={false}
        />
      </div>
      <div>
        <Label>No errors (renders nothing)</Label>
        <ErrorSummary.Root errors={[]} />
        <p className="text-fg-muted text-sm">The summary is hidden.</p>
      </div>
    </div>
  );
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8 sm:max-w-lg">
      <StatesGrid />
      <Targets />
    </div>
  ),
};

/* ============================================================
 * DENSITY
 * ============================================================ */

export const Density: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-3">
      {(["compact", "default", "comfortable"] as const).map((density) => (
        <div key={density} data-density={density}>
          <Label>{density}</Label>
          <ErrorSummary.Root
            errors={manyErrors.slice(0, 3)}
            focusTarget="none"
            updateTitle={false}
          />
        </div>
      ))}
    </div>
  ),
};

/* ============================================================
 * THEMES
 * ============================================================ */

export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["light", "dark", "high-contrast"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="bg-surface-base text-fg-default rounded-lg p-6"
        >
          <Label>{theme}</Label>
          <StatesGrid className="sm:max-w-lg" />
        </div>
      ))}
    </div>
  ),
};
