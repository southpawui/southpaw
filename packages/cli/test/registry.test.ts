import { describe, expect, it } from "vitest";
import { fetchItem, itemUrl, normaliseRegistry } from "../src/registry/fetch.js";
import { resolveItems } from "../src/registry/resolve.js";
import { fakeRegistry, item, REGISTRY } from "./helpers.js";

describe("itemUrl / normaliseRegistry", () => {
  it("maps names, @southpaw names and same-origin URLs", () => {
    expect(itemUrl("dialog", REGISTRY)).toBe(`${REGISTRY}/r/dialog.json`);
    expect(itemUrl("@southpaw/radio-group", REGISTRY)).toBe(`${REGISTRY}/r/radio-group.json`);
    expect(itemUrl(`${REGISTRY}/r/a.json`, REGISTRY)).toBe(`${REGISTRY}/r/a.json`);
  });
  it("refuses URLs on other origins (typed or from registry content)", () => {
    for (const u of [
      "https://x.test/r/a.json",
      "http://169.254.169.254/x.json",
      "http://registry.test:8080/r/a.json",
    ]) {
      expect(() => itemUrl(u, REGISTRY), u).toThrow(/isn't on the Southpaw registry/);
    }
  });
  it("rejects other registries and unsafe names", () => {
    expect(() => itemUrl("@shadcn/button", REGISTRY)).toThrow(/another registry/);
    expect(() => itemUrl("../etc/passwd", REGISTRY)).toThrow(/valid component name/);
    expect(() => itemUrl("Dialog", REGISTRY)).toThrow(/valid component name/);
  });
  it("normalises the registry URL and only allows http(s)", () => {
    expect(normaliseRegistry("http://localhost:3001/")).toBe("http://localhost:3001");
    expect(() => normaliseRegistry("file:///etc")).toThrow(/http\(s\)/);
    expect(() => normaliseRegistry("not a url")).toThrow(/valid registry URL/);
  });
});

describe("fetchItem", () => {
  it("explains 404s, server errors, bad JSON, invalid items and network failures", async () => {
    const { fetcher } = fakeRegistry([]);
    await expect(fetchItem(`${REGISTRY}/r/nope.json`, { fetcher })).rejects.toThrow(
      /No component at/,
    );
    await expect(
      fetchItem("u", {
        fetcher: async () => new Response("x", { status: 500, statusText: "Oops" }),
      }),
    ).rejects.toThrow(/500 Oops/);
    await expect(fetchItem("u", { fetcher: async () => new Response("{nope") })).rejects.toThrow(
      /valid JSON/,
    );
    await expect(
      fetchItem("u", { fetcher: async () => new Response(JSON.stringify({ name: 1 })) }),
    ).rejects.toThrow(/valid registry item/);
    await expect(
      fetchItem("u", {
        fetcher: async () => {
          throw new Error("ECONNREFUSED");
        },
      }),
    ).rejects.toThrow(/Couldn't reach.*ECONNREFUSED/);
  });
});

describe("resolveItems", () => {
  it("returns dependencies first, each item once", async () => {
    const { fetcher, requested } = fakeRegistry([
      item("dialog", { registryDependencies: ["@southpaw/lib-cn", "@southpaw/tokens"] }),
      item("input", { registryDependencies: ["@southpaw/button", "@southpaw/lib-cn"] }),
      item("button", { registryDependencies: ["@southpaw/lib-cn"] }),
      item("lib-cn"),
      item("tokens"),
    ]);
    const items = await resolveItems(["dialog", "input"], REGISTRY, { fetcher });
    expect(items.map((i) => i.name)).toEqual(["lib-cn", "tokens", "dialog", "button", "input"]);
    expect(new Set(requested).size).toBe(requested.length);
  });
  it("survives dependency cycles", async () => {
    const { fetcher } = fakeRegistry([
      item("a", { registryDependencies: ["@southpaw/b"] }),
      item("b", { registryDependencies: ["@southpaw/a"] }),
    ]);
    expect((await resolveItems(["a"], REGISTRY, { fetcher })).map((i) => i.name)).toEqual([
      "b",
      "a",
    ]);
  });
  it("fails clearly when a dependency is missing", async () => {
    const { fetcher } = fakeRegistry([item("a", { registryDependencies: ["@southpaw/missing"] })]);
    await expect(resolveItems(["a"], REGISTRY, { fetcher })).rejects.toThrow(/missing\.json/);
  });
});

describe("resolveItems with hostile registry content", () => {
  it("refuses a registryDependency pointing at another host", async () => {
    const { fetcher, requested } = fakeRegistry([
      item("a", { registryDependencies: ["http://169.254.169.254/latest.json"] }),
    ]);
    await expect(resolveItems(["a"], REGISTRY, { fetcher })).rejects.toThrow(
      /isn't on the Southpaw registry/,
    );
    expect(requested).toEqual([`${REGISTRY}/r/a.json`]);
  });
});
