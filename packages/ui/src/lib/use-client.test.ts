/* ============================================================
 * Guard: Server Component safety (GEO-972)
 *
 * Next.js App Router treats any module without "use client" as server code.
 * A component that uses hooks, context, Base UI or useRender there crashes
 * ("createContext is not a function"). And Phosphor's main entry uses React
 * context, so a server-safe module must import icons from
 * "@phosphor-icons/react/ssr" instead.
 *
 * This scans the source, so a new component can't ship without the directive.
 * ============================================================ */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = join(__dirname, "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    if (!/\.tsx?$/.test(name) || /\.(test|stories)\.tsx?$/.test(name)) return [];
    return [path];
  });
}

// Anything that only works in a client component
const CLIENT_ONLY =
  /\bReact\.(use[A-Z]\w*|createContext)\b|\b(useState|useEffect|useLayoutEffect|useRef|useMemo|useCallback|useContext|useId|useReducer|useTransition|useSyncExternalStore|useImperativeHandle|createContext|useRender)\b|from "@base-ui\/react/;

// The directive must be the first statement (comments may come before it)
const hasDirective = (source: string) =>
  /^(\s|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*["']use client["'];?/.test(source);

const files = [...sourceFiles(join(SRC, "components")), ...sourceFiles(join(SRC, "lib"))];

describe("Server Component safety (GEO-972)", () => {
  it("finds the source files", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it.each(files.map((f) => [relative(SRC, f), f]))(
    '%s: client code has "use client"; server code imports Phosphor from /ssr',
    (_name, file) => {
      const source = readFileSync(file, "utf8");
      if (CLIENT_ONLY.test(source)) {
        expect(
          hasDirective(source),
          'uses hooks, context or Base UI: needs "use client" first',
        ).toBe(true);
      } else if (!hasDirective(source)) {
        expect(
          /from "@phosphor-icons\/react"/.test(source),
          'server-safe module: import icons from "@phosphor-icons/react/ssr"',
        ).toBe(false);
      }
    },
  );

  // Compound components: the entry builds the namespace from the client parts.
  // A Server Component can read `Tabs.Root` off a plain object of client
  // references, but not off a client module (Base UI's pattern).
  const entries = readdirSync(join(SRC, "components"))
    .map((dir) => join(SRC, "components", dir, `${dir}.tsx`))
    .filter((file) => {
      try {
        return statSync(file).isFile();
      } catch {
        return false;
      }
    });

  it.each(entries.map((f) => [relative(SRC, f), f]))(
    "%s: a namespace entry is server-safe (parts live in X.parts.tsx)",
    (_name, file) => {
      const source = readFileSync(file, "utf8");
      const namespace = /^export const [A-Z]\w*(?::[^=]+)? = (\{|Object\.assign\()/m.test(source);
      const hasParts = (() => {
        try {
          return statSync(file.replace(/\.tsx$/, ".parts.tsx")).isFile();
        } catch {
          return false;
        }
      })();
      if (hasParts) {
        expect(hasDirective(source), "the entry must not be a client module").toBe(false);
        expect(CLIENT_ONLY.test(source), "no hooks, context or Base UI in the entry").toBe(false);
      }
      if (hasDirective(source)) {
        expect(
          namespace,
          "a client module can't export a namespace: move the parts to X.parts.tsx",
        ).toBe(false);
      }
    },
  );

  it("pure helpers stay server-safe (no directive)", () => {
    for (const helper of [
      "lib/cn.ts",
      "lib/merge-class-name.ts",
      "lib/format-count.ts",
      "lib/delay.ts",
    ]) {
      expect(hasDirective(readFileSync(join(SRC, helper), "utf8")), helper).toBe(false);
    }
  });
});
