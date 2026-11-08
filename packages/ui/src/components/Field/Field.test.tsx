import { render, screen } from "@testing-library/react";
import { Field } from "./Field";
import { Input } from "../Input/Input";

describe("Field.Root", () => {
  it("renders with data-slot attribute", () => {
    const { container } = render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Input aria-label="Name" />
      </Field.Root>,
    );
    expect(container.querySelector("[data-slot='field']")).toBeInTheDocument();
  });

  it("defaults to vertical orientation", () => {
    const { container } = render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
      </Field.Root>,
    );
    expect(container.querySelector("[data-slot='field']")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("supports horizontal orientation", () => {
    const { container } = render(
      <Field.Root orientation="horizontal">
        <Field.Label>Name</Field.Label>
      </Field.Root>,
    );
    expect(container.querySelector("[data-slot='field']")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(
      <Field.Root ref={ref}>
        <Field.Label>Name</Field.Label>
      </Field.Root>,
    );
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

describe("Field.Label", () => {
  it("renders label text", () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
      </Field.Root>,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows required asterisk when required prop is true", () => {
    render(
      <Field.Root>
        <Field.Label required>Email</Field.Label>
      </Field.Root>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows optional indicator when optional prop is true", () => {
    render(
      <Field.Root>
        <Field.Label optional>Nickname</Field.Label>
      </Field.Root>,
    );
    expect(screen.getByText("(Optional)")).toBeInTheDocument();
    expect(screen.getByText("(Optional)")).toHaveAttribute("aria-hidden", "true");
  });

  it("required takes precedence over optional", () => {
    render(
      <Field.Root>
        <Field.Label required optional>
          Email
        </Field.Label>
      </Field.Root>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.queryByText("(Optional)")).not.toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    const { container } = render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
      </Field.Root>,
    );
    expect(container.querySelector("[data-slot='field-label']")).toBeInTheDocument();
  });
});

describe("Field.Description", () => {
  it("renders description text", () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Description>We will never share your email.</Field.Description>
      </Field.Root>,
    );
    expect(screen.getByText("We will never share your email.")).toBeInTheDocument();
  });

  it("has data-slot attribute", () => {
    const { container } = render(
      <Field.Root>
        <Field.Description>Hint text</Field.Description>
      </Field.Root>,
    );
    expect(container.querySelector("[data-slot='field-description']")).toBeInTheDocument();
  });
});

describe("Field.Error", () => {
  // Base UI's Field.Error conditionally renders based on native validation.
  // Use match={true} to force it visible for testing our wrapper.
  it("renders single error from children", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Error match>Please enter a valid email.</Field.Error>
      </Field.Root>,
    );
    expect(screen.getByText("Please enter a valid email.")).toBeInTheDocument();
  });

  it("renders single error from errors array", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Error match errors={["Too short"]} />
      </Field.Root>,
    );
    expect(screen.getByText("Too short")).toBeInTheDocument();
  });

  it("renders multiple errors as a list", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Password</Field.Label>
        <Field.Error match errors={["Too short", "Must contain a number"]} />
      </Field.Root>,
    );
    expect(screen.getByText("Too short")).toBeInTheDocument();
    expect(screen.getByText("Must contain a number")).toBeInTheDocument();
  });

  it("includes sr-only Error: prefix", () => {
    render(
      <Field.Root invalid>
        <Field.Error match>Bad input</Field.Error>
      </Field.Root>,
    );
    expect(screen.getByText("Error:")).toHaveClass("sr-only");
  });

  it("shows error icon by default", () => {
    const { container } = render(
      <Field.Root invalid>
        <Field.Error match>Bad input</Field.Error>
      </Field.Root>,
    );
    expect(container.querySelector("[data-slot='field-error-icon']")).toBeInTheDocument();
  });

  it("hides error icon when hideIcon is true", () => {
    const { container } = render(
      <Field.Root invalid>
        <Field.Error match hideIcon>
          Bad input
        </Field.Error>
      </Field.Root>,
    );
    expect(container.querySelector("[data-slot='field-error-icon']")).not.toBeInTheDocument();
  });
});

describe("Field.CharacterCount", () => {
  it("renders current/max format", () => {
    render(<Field.CharacterCount current={42} max={100} />);
    expect(screen.getByText("42/100")).toBeInTheDocument();
  });

  it("has aria-live polite for screen reader announcements", () => {
    render(<Field.CharacterCount current={42} max={100} />);
    expect(screen.getByText("42/100")).toHaveAttribute("aria-live", "polite");
  });

  it("applies danger styling when over limit", () => {
    render(<Field.CharacterCount current={101} max={100} />);
    expect(screen.getByText("101/100").className).toContain("text-danger");
  });

  it("applies muted styling when under limit", () => {
    render(<Field.CharacterCount current={50} max={100} />);
    expect(screen.getByText("50/100").className).toContain("text-fg-muted");
  });

  it("has data-slot attribute", () => {
    const { container } = render(<Field.CharacterCount current={0} max={100} />);
    expect(container.querySelector("[data-slot='field-character-count']")).toBeInTheDocument();
  });
});

describe("Field.Separator", () => {
  it("renders without label", () => {
    const { container } = render(<Field.Separator />);
    expect(container.querySelector("[data-slot='field-separator']")).toBeInTheDocument();
  });

  it("renders with label text", () => {
    render(<Field.Separator label="Or" />);
    expect(screen.getByText("Or")).toBeInTheDocument();
  });
});

describe("Field.Group", () => {
  it("renders children with default gap", () => {
    const { container } = render(
      <Field.Group>
        <div>Field 1</div>
        <div>Field 2</div>
      </Field.Group>,
    );
    const group = container.querySelector("[data-slot='field-group']");
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute("role", "group");
    expect(group!.className).toContain("gap-4");
  });

  it("supports tight spacing", () => {
    const { container } = render(
      <Field.Group spacing="tight">
        <div />
      </Field.Group>,
    );
    expect(container.querySelector("[data-slot='field-group']")!.className).toContain("gap-3");
  });

  it("supports loose spacing", () => {
    const { container } = render(
      <Field.Group spacing="loose">
        <div />
      </Field.Group>,
    );
    expect(container.querySelector("[data-slot='field-group']")!.className).toContain("gap-6");
  });
});

describe("Field.Content", () => {
  it("renders with data-slot attribute", () => {
    const { container } = render(<Field.Content>Content</Field.Content>);
    expect(container.querySelector("[data-slot='field-content']")).toBeInTheDocument();
  });
});
