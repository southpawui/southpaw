import { describe, expect, it } from "vitest";
import { detectAliases } from "../src/project/aliases.js";
import { findTailwindStylesheets } from "../src/project/css.js";
import { detectFramework } from "../src/project/framework.js";
import { assertReact19, readPackageJson } from "../src/project/package-json.js";
import { makeProject, nextApp } from "./helpers.js";

describe("detectFramework", () => {
  it("tells Next App Router from Pages Router", () => {
    const app = makeProject(nextApp());
    expect(detectFramework(app, readPackageJson(app))).toBe("next-app");
    const pages = makeProject({
      "package.json": JSON.stringify({ dependencies: { next: "16", react: "19" } }),
      "pages/index.tsx": "",
    });
    expect(detectFramework(pages, readPackageJson(pages))).toBe("next-pages");
  });
  it("detects Next with src/app", () => {
    const dir = makeProject({
      "package.json": JSON.stringify({ dependencies: { next: "16", react: "19" } }),
      "src/app/page.tsx": "",
    });
    expect(detectFramework(dir, readPackageJson(dir))).toBe("next-app");
  });
  it("detects React Router 7 before Vite", () => {
    const dir = makeProject({
      "package.json": JSON.stringify({
        devDependencies: { vite: "7", "@react-router/dev": "7" },
        dependencies: { react: "19" },
      }),
    });
    expect(detectFramework(dir, readPackageJson(dir))).toBe("react-router");
  });
  it("detects Vite, and falls back to other", () => {
    const vite = makeProject({
      "package.json": JSON.stringify({ devDependencies: { vite: "7" } }),
    });
    expect(detectFramework(vite, readPackageJson(vite))).toBe("vite");
    const other = makeProject({ "package.json": "{}" });
    expect(detectFramework(other, readPackageJson(other))).toBe("other");
  });
});

describe("assertReact19", () => {
  it("accepts React 19 and rejects older or missing React", () => {
    expect(() => assertReact19({ dependencies: { react: "^19.2.0" } })).not.toThrow();
    expect(() => assertReact19({ dependencies: { react: "^18.3.1" } })).toThrow(/needs React 19/);
    expect(() => assertReact19({})).toThrow(/isn't a dependency/);
  });
});

describe("detectAliases", () => {
  it("reads @/* from tsconfig paths", () => {
    expect(detectAliases(makeProject(nextApp()))).toEqual({
      components: "@/components",
      componentsDir: "components",
    });
  });
  it("handles src/ and a ~/* alias", () => {
    const dir = makeProject({
      "tsconfig.json": JSON.stringify({ compilerOptions: { paths: { "~/*": ["./src/*"] } } }),
    });
    expect(detectAliases(dir)).toEqual({
      components: "~/components",
      componentsDir: "src/components",
    });
  });
  it("follows extends and baseUrl", () => {
    const dir = makeProject({
      "tsconfig.base.json": JSON.stringify({
        compilerOptions: { baseUrl: "src", paths: { "@/*": ["./*"] } },
      }),
      "tsconfig.json": JSON.stringify({ extends: "./tsconfig.base.json" }),
    });
    expect(detectAliases(dir)).toEqual({
      components: "@/components",
      componentsDir: "src/components",
    });
  });
  it("reads Vite's referenced tsconfig.app.json", () => {
    const dir = makeProject({
      "tsconfig.json": JSON.stringify({
        files: [],
        references: [{ path: "./tsconfig.app.json" }, { path: "./tsconfig.node.json" }],
      }),
      "tsconfig.app.json": JSON.stringify({
        compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
      }),
      "tsconfig.node.json": JSON.stringify({ compilerOptions: {} }),
    });
    expect(detectAliases(dir)).toEqual({
      components: "@/components",
      componentsDir: "src/components",
    });
  });
  it("works without an alias", () => {
    expect(detectAliases(makeProject({ "tsconfig.json": "{}", "src/main.tsx": "" }))).toEqual({
      components: null,
      componentsDir: "src/components",
    });
    expect(detectAliases(makeProject({ "tsconfig.json": "{}" }))).toEqual({
      components: null,
      componentsDir: "components",
    });
  });
  it("rejects JavaScript-only projects (TypeScript only in v1)", () => {
    expect(() => detectAliases(makeProject({ "jsconfig.json": "{}" }))).toThrow(
      /JavaScript project/,
    );
    expect(() => detectAliases(makeProject({}))).toThrow(/No tsconfig/);
  });
});

describe("findTailwindStylesheets", () => {
  it("prefers the framework default, then any file importing tailwindcss", () => {
    const dir = makeProject({
      "app/globals.css": '@import "tailwindcss";',
      "styles/extra.css": "@import 'tailwindcss' source(none);",
      "styles/plain.css": "body{}",
    });
    expect(findTailwindStylesheets(dir, "next-app")).toEqual([
      "app/globals.css",
      "styles/extra.css",
    ]);
  });
  it("ignores Tailwind v3 directives and node_modules", () => {
    const dir = makeProject({
      "app/globals.css": "@tailwind base;",
      "node_modules/x/a.css": '@import "tailwindcss";',
    });
    expect(findTailwindStylesheets(dir, "next-app")).toEqual([]);
  });
});
