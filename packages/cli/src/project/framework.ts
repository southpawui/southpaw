import { existsSync } from "node:fs";
import path from "node:path";
import type { Framework } from "../config/schema.js";
import { allDeps, type PackageJson } from "./package-json.js";

/** Detects the framework from dependencies and folder layout. */
export function detectFramework(cwd: string, pkg: PackageJson): Framework {
  const deps = allDeps(pkg);
  const has = (p: string) => existsSync(path.join(cwd, p));
  if (deps.next) {
    return has("app") || has("src/app") ? "next-app" : "next-pages";
  }
  if (deps["@react-router/dev"] || has("react-router.config.ts") || has("react-router.config.js")) {
    return "react-router";
  }
  if (deps.vite) return "vite";
  return "other";
}

/** Each framework's usual global stylesheet, most likely first. */
export const CSS_CANDIDATES: Record<Framework, string[]> = {
  "next-app": ["app/globals.css", "src/app/globals.css"],
  "next-pages": ["styles/globals.css", "src/styles/globals.css"],
  vite: ["src/index.css", "src/main.css", "src/styles.css", "src/App.css"],
  "react-router": ["app/app.css", "app/root.css", "app/styles.css"],
  other: [],
};

export const FRAMEWORK_LABEL: Record<Framework, string> = {
  "next-app": "Next.js (App Router)",
  "next-pages": "Next.js (Pages Router)",
  vite: "Vite",
  "react-router": "React Router 7",
  other: "an unrecognised setup",
};
