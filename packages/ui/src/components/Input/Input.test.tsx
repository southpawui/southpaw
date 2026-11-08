import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a text input by default", () => {
    render(<Input aria-label="Test" />);
    expect(screen.getByRole("textbox", { name: "Test" })).toBeInTheDocument();
  });

  it("applies purpose config for email", () => {
    render(<Input purpose="email" aria-label="Email" />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("applies purpose config for url", () => {
    render(<Input purpose="url" aria-label="URL" />);
    const input = screen.getByRole("textbox", { name: "URL" });
    expect(input).toHaveAttribute("autocomplete", "url");
  });

  it("renders prepend text addon", () => {
    render(<Input prepend="$" aria-label="Price" />);
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("renders append content", () => {
    render(<Input append={<span data-testid="suffix">.com</span>} aria-label="Domain" />);
    expect(screen.getByTestId("suffix")).toBeInTheDocument();
  });

  it("shows checkmark when valid prop is true", () => {
    const { container } = render(<Input valid aria-label="Valid" />);
    const svg = container.querySelector("[data-slot='input-append'] svg");
    expect(svg).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled aria-label="Disabled" />);
    expect(screen.getByRole("textbox", { name: "Disabled" })).toBeDisabled();
  });

  it("fires onChange handler", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} aria-label="Test" />);
    await user.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("formats URL input by stripping protocol", async () => {
    const user = userEvent.setup();
    render(<Input purpose="url" aria-label="URL" />);
    const input = screen.getByRole("textbox", { name: "URL" });
    await user.type(input, "https://example.com");
    expect(input).toHaveValue("example.com");
  });

  it("allows explicit type to override purpose type", () => {
    render(<Input purpose="email" type="text" aria-label="Override" />);
    expect(screen.getByRole("textbox", { name: "Override" })).toHaveAttribute("type", "text");
  });

  it("has data-slot attribute on wrapper", () => {
    const { container } = render(<Input aria-label="Test" />);
    expect(container.querySelector("[data-slot='input-group']")).toBeInTheDocument();
  });

  it("forwards ref to the input element", () => {
    const ref = vi.fn();
    render(<Input ref={ref} aria-label="Ref" />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });
});

describe("Input.Password", () => {
  it("renders as password type by default", () => {
    render(<Input.Password aria-label="Password" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("toggles visibility when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Input.Password aria-label="Password" />);
    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: /show password/i });

    expect(input).toHaveAttribute("type", "password");
    await user.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("has autocomplete new-password by default", () => {
    render(<Input.Password aria-label="Password" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "new-password");
  });

  it("accepts autocomplete current-password", () => {
    render(<Input.Password autoComplete="current-password" aria-label="Password" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "current-password");
  });
});

describe("Input.Card", () => {
  it("renders card number input by default", () => {
    render(<Input.Card aria-label="Card" />);
    const input = screen.getByRole("textbox", { name: "Card" });
    expect(input).toHaveAttribute("autocomplete", "cc-number");
    expect(input).toHaveAttribute("inputmode", "numeric");
  });

  it("formats card number as user types", async () => {
    const user = userEvent.setup();
    render(<Input.Card aria-label="Card" />);
    const input = screen.getByRole("textbox", { name: "Card" });
    await user.type(input, "4242424242424242");
    expect(input).toHaveValue("4242 4242 4242 4242");
  });

  it("renders expiry field when field='expiry'", () => {
    render(<Input.Card field="expiry" aria-label="Expiry" />);
    const input = screen.getByRole("textbox", { name: "Expiry" });
    expect(input).toHaveAttribute("autocomplete", "cc-exp");
  });

  it("renders CVV field when field='cvv'", () => {
    render(<Input.Card field="cvv" aria-label="CVV" />);
    const input = screen.getByRole("textbox", { name: "CVV" });
    expect(input).toHaveAttribute("autocomplete", "cc-csc");
  });

  it("fires onBrandChange when brand is detected", async () => {
    const user = userEvent.setup();
    const onBrandChange = vi.fn();
    render(<Input.Card onBrandChange={onBrandChange} aria-label="Card" />);
    await user.type(screen.getByRole("textbox"), "4242");
    expect(onBrandChange).toHaveBeenCalledWith("visa", true);
  });

  it("fires onBrandChange with allowed=false for disallowed brand", async () => {
    const user = userEvent.setup();
    const onBrandChange = vi.fn();
    render(<Input.Card allowedBrands={["visa"]} onBrandChange={onBrandChange} aria-label="Card" />);
    await user.type(screen.getByRole("textbox"), "5100");
    const lastCall = onBrandChange.mock.calls[onBrandChange.mock.calls.length - 1];
    expect(lastCall[0]).toBe("mastercard");
    expect(lastCall[1]).toBe(false);
  });

  it("does not clear input when brand is disallowed", async () => {
    const user = userEvent.setup();
    render(<Input.Card allowedBrands={["visa"]} aria-label="Card" />);
    const input = screen.getByRole("textbox", { name: "Card" });
    await user.type(input, "5100");
    expect(input).toHaveValue("5100");
  });
});

describe("Input.Phone", () => {
  it("renders with country code selector", () => {
    render(<Input.Phone aria-label="Phone" />);
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByText("(+44)")).toBeInTheDocument();
  });

  it("renders as tel input", () => {
    render(<Input.Phone aria-label="Phone" />);
    expect(screen.getByLabelText("Phone")).toHaveAttribute("type", "tel");
  });

  it("shows single code without dropdown when only one country allowed", () => {
    render(<Input.Phone allowedCountries={["GB"]} aria-label="Phone" />);
    expect(screen.getByText("(+44)")).toBeInTheDocument();
    expect(screen.queryByLabelText("Country code")).not.toBeInTheDocument();
  });

  it("fires onPhoneChange with full value and parts", async () => {
    const user = userEvent.setup();
    const onPhoneChange = vi.fn();
    render(<Input.Phone onPhoneChange={onPhoneChange} aria-label="Phone" />);
    await user.type(screen.getByLabelText("Phone"), "7911123456");
    expect(onPhoneChange).toHaveBeenCalled();
    const lastCall = onPhoneChange.mock.calls[onPhoneChange.mock.calls.length - 1];
    expect(lastCall[0]).toContain("+44");
    expect(lastCall[1].code).toBe("+44");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input.Phone disabled aria-label="Phone" />);
    expect(screen.getByLabelText("Phone")).toBeDisabled();
  });
});
