import path from "node:path";
import { describe, expect, it } from "vitest";
import { detectAgent } from "../src/project/package-manager.js";
import { makeProject } from "./helpers.js";

describe("detectAgent", () => {
  it("finds a workspace root's lockfile from an app folder (pnpm monorepo)", async () => {
    const root = makeProject({
      "pnpm-lock.yaml": "lockfileVersion: '9.0'\n",
      "pnpm-workspace.yaml": "packages: ['apps/*']\n",
      "apps/web/package.json": "{}",
    });
    expect(await detectAgent(path.join(root, "apps/web"))).toBe("pnpm");
  });
  it("reads the project's own lockfile", async () => {
    expect(await detectAgent(makeProject({ "package.json": "{}", "yarn.lock": "" }))).toMatch(
      /^yarn/,
    );
    expect(await detectAgent(makeProject({ "package.json": "{}", "bun.lock": "" }))).toBe("bun");
  });
});
