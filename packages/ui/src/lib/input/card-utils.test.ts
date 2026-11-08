import { detectCardBrand, formatCardNumber, formatCardExpiry, formatCvv } from "./card-utils";

describe("detectCardBrand", () => {
  it("detects Visa (starts with 4)", () => {
    expect(detectCardBrand("4242424242424242")).toBe("visa");
    expect(detectCardBrand("4")).toBe("visa");
  });

  it("detects Mastercard (starts with 51-55 or 22-27)", () => {
    expect(detectCardBrand("5100000000000000")).toBe("mastercard");
    expect(detectCardBrand("5500000000000000")).toBe("mastercard");
    expect(detectCardBrand("2200000000000000")).toBe("mastercard");
    expect(detectCardBrand("2700000000000000")).toBe("mastercard");
  });

  it("detects Amex (starts with 34 or 37)", () => {
    expect(detectCardBrand("340000000000000")).toBe("amex");
    expect(detectCardBrand("370000000000000")).toBe("amex");
  });

  it("detects Discover (starts with 6011, 65, 644-649)", () => {
    expect(detectCardBrand("6011000000000000")).toBe("discover");
    expect(detectCardBrand("6500000000000000")).toBe("discover");
  });

  it("returns unknown for unrecognized prefixes", () => {
    expect(detectCardBrand("")).toBe("unknown");
    expect(detectCardBrand("9999")).toBe("unknown");
    expect(detectCardBrand("1234")).toBe("unknown");
  });
});

describe("formatCardNumber", () => {
  it("formats standard 16-digit card as 4-4-4-4", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
  });

  it("formats Amex as 4-6-5", () => {
    expect(formatCardNumber("340000000000000")).toBe("3400 000000 00000");
  });

  it("strips non-digit characters", () => {
    expect(formatCardNumber("4242-4242-4242-4242")).toBe("4242 4242 4242 4242");
  });

  it("handles partial input", () => {
    expect(formatCardNumber("4242")).toBe("4242");
    expect(formatCardNumber("42424")).toBe("4242 4");
  });

  it("handles empty input", () => {
    expect(formatCardNumber("")).toBe("");
  });
});

describe("formatCardExpiry", () => {
  it("formats MM/YY", () => {
    expect(formatCardExpiry("1225")).toBe("12 / 25");
  });

  it("handles partial input", () => {
    expect(formatCardExpiry("1")).toBe("1");
    expect(formatCardExpiry("12")).toBe("12");
  });
});

describe("formatCvv", () => {
  it("allows up to 4 digits", () => {
    expect(formatCvv("123")).toBe("123");
    expect(formatCvv("1234")).toBe("1234");
  });

  it("strips non-digits", () => {
    expect(formatCvv("12ab")).toBe("12");
  });

  it("handles empty input", () => {
    expect(formatCvv("")).toBe("");
  });
});
