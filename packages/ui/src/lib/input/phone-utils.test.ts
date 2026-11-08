import { detectCountryCode, getPhoneFormat, formatNational, countryCodes } from "./phone-utils";

describe("countryCodes", () => {
  it("is a non-empty array", () => {
    expect(countryCodes.length).toBeGreaterThan(100);
  });

  it("each entry has code, country, flag, and name", () => {
    for (const c of countryCodes.slice(0, 10)) {
      expect(c.code).toMatch(/^\+\d+/);
      expect(c.country).toMatch(/^[A-Z]{2}$/);
      expect(c.flag).toBeTruthy();
      expect(c.name).toBeTruthy();
    }
  });

  it("is sorted by name", () => {
    const names = countryCodes.map((c) => c.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});

describe("detectCountryCode", () => {
  it("detects +44 dial code", () => {
    const result = detectCountryCode("+447911123456");
    expect(result).not.toBeNull();
    expect(result!.code).toBe("+44");
    // Multiple countries share +44 (GB, GG, IM, JE) — first alphabetically wins
    expect(["GB", "GG", "IM", "JE"]).toContain(result!.country);
  });

  it("detects US code +1", () => {
    const result = detectCountryCode("+12025551234");
    expect(result).not.toBeNull();
    expect(result!.code).toBe("+1");
  });

  it("returns null for input without +", () => {
    expect(detectCountryCode("447911123456")).toBeNull();
    expect(detectCountryCode("hello")).toBeNull();
  });

  it("returns null for empty input", () => {
    expect(detectCountryCode("")).toBeNull();
  });

  it("prefers longer codes over shorter ones", () => {
    const result = detectCountryCode("+44123");
    expect(result).not.toBeNull();
    expect(result!.code).toBe("+44");
  });
});

describe("getPhoneFormat", () => {
  it("returns placeholder and maxDigits for GB", () => {
    const format = getPhoneFormat("GB");
    expect(format.maxDigits).toBeGreaterThan(0);
    expect(format.placeholder).toBeTruthy();
  });

  it("returns fallback for unknown country", () => {
    const format = getPhoneFormat("XX");
    expect(format).toEqual({ placeholder: "0000 000000", maxDigits: 15 });
  });
});

describe("formatNational", () => {
  it("formats UK number nationally", () => {
    const result = formatNational("7911123456", "+44");
    expect(result).toBeTruthy();
    expect(result).not.toContain("+44");
    expect(result).toContain(" ");
  });

  it("returns empty string for empty digits", () => {
    expect(formatNational("", "+44")).toBe("");
  });

  it("returns raw digits for very short input", () => {
    const result = formatNational("1", "+44");
    expect(result).toBeTruthy();
  });
});
