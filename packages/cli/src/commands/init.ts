import { existsSync } from "node:fs";
import path from "node:path";
import { hasConfig, readConfig, writeConfig } from "../config/config.js";
import type { SouthpawConfig } from "../config/schema.js";
import { BASE_ITEMS, CONFIG_FILE, DEFAULT_REGISTRY, TOKENS_ENTRY } from "../constants.js";
import type { Context } from "../context.js";
import { CliError } from "../errors.js";
import { ensureTokensImport } from "../install/css-import.js";
import { detectAliases } from "../project/aliases.js";
import {
  assertTailwindStylesheet,
  findTailwindStylesheets,
  importsTailwind,
  tailwindMissing,
} from "../project/css.js";
import { detectFramework, FRAMEWORK_LABEL } from "../project/framework.js";
import { assertReact19, readPackageJson } from "../project/package-json.js";
import { normaliseRegistry } from "../registry/fetch.js";
import { installItems, reportFiles } from "./add.js";

export interface InitOptions {
  cwd: string;
  registry?: string;
  css?: string;
  yes?: boolean;
  force?: boolean;
}

async function pickStylesheet(
  opts: InitOptions,
  existing: SouthpawConfig | null,
  framework: SouthpawConfig["framework"],
  ctx: Context,
) {
  if (opts.css) {
    assertTailwindStylesheet(opts.cwd, opts.css);
    return opts.css.replace(/\\/g, "/");
  }
  if (existing && !opts.force) {
    const abs = path.resolve(opts.cwd, existing.css);
    if (existsSync(abs) && importsTailwind(abs)) return existing.css;
  }
  const found = findTailwindStylesheets(opts.cwd, framework);
  if (found.length === 0) throw tailwindMissing();
  if (found.length === 1 || !ctx.interactive || opts.yes) return found[0]!;
  return ctx.ui.select(
    "Which stylesheet is your global CSS?",
    found.map((f) => ({ value: f, label: f })),
  );
}

/** `southpawui init` */
export async function init(opts: InitOptions, ctx: Context): Promise<number> {
  const { cwd } = opts;
  const pkg = readPackageJson(cwd);
  assertReact19(pkg);

  let existing: SouthpawConfig | null = null;
  if (hasConfig(cwd)) {
    try {
      existing = await readConfig(cwd);
    } catch (err) {
      if (!opts.force) throw err;
    }
  }
  if (existing && !opts.force)
    ctx.ui.info(`Found ${CONFIG_FILE}. Keeping its settings and filling in anything missing.`);

  const framework = existing && !opts.force ? existing.framework : detectFramework(cwd, pkg);
  const aliases = detectAliases(cwd);
  const css = await pickStylesheet(opts, existing, framework, ctx);
  const registry = normaliseRegistry(
    opts.registry ??
      ctx.env.SOUTHPAW_REGISTRY_URL ??
      (opts.force ? undefined : existing?.registry) ??
      DEFAULT_REGISTRY,
  );

  const derived: SouthpawConfig = {
    registry,
    framework,
    tsx: true,
    css,
    aliases: { components: aliases.components },
    paths: { components: aliases.componentsDir },
  };
  const config: SouthpawConfig =
    existing && !opts.force
      ? {
          ...derived,
          ...existing,
          // Explicit flags beat the saved values.
          registry: opts.registry ? registry : existing.registry,
          css: opts.css ? css : existing.css,
        }
      : derived;

  ctx.ui.info(
    [
      `Framework: ${FRAMEWORK_LABEL[config.framework]}`,
      `Stylesheet: ${config.css}`,
      `Components: ${config.paths.components}/southpaw${config.aliases.components ? ` (imported as ${config.aliases.components}/southpaw/…)` : ""}`,
      `Registry: ${config.registry}`,
    ].join("\n"),
  );

  await writeConfig(cwd, config);
  ctx.ui.success(`Wrote ${CONFIG_FILE}.`);

  const result = await installItems(
    [...BASE_ITEMS],
    { cwd, yes: opts.yes, overwrite: false },
    config,
    ctx,
  );
  reportFiles(result, ctx);

  const tokensAbs = path.resolve(cwd, config.paths.components, TOKENS_ENTRY);
  if (!existsSync(tokensAbs)) {
    throw new CliError(
      "The tokens weren't installed, so the stylesheet wasn't changed.",
      "Re-run `southpawui init` and keep the tokens files when asked.",
    );
  }
  const cssResult = await ensureTokensImport(path.resolve(cwd, config.css), tokensAbs);
  if (cssResult !== "unchanged")
    ctx.ui.success(
      `${cssResult === "added" ? "Added" : "Fixed"} the Southpaw tokens import in ${config.css}.`,
    );

  ctx.ui.info(
    [
      "Next:",
      "  • Add components: npx southpawui add dialog",
      '  • Give your app root its own stacking context (className="isolate") so dialogs and menus layer above it.',
      '  • For now, render Southpaw components from Client Components ("use client").',
    ].join("\n"),
  );
  return result.exitCode;
}
