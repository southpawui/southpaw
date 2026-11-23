import path from "node:path";
import pc from "picocolors";
import { readConfig } from "../config/config.js";
import type { SouthpawConfig } from "../config/schema.js";
import { CONFIG_FILE } from "../constants.js";
import type { Context } from "../context.js";
import { CliError } from "../errors.js";
import { installDependencies, missingDependencies } from "../install/dependencies.js";
import { rewriteImports } from "../install/rewrite-imports.js";
import { assertRealPathInside, resolveTarget } from "../install/targets.js";
import { writeFiles, type PlannedFile, type WriteResult } from "../install/write-files.js";
import { detectAgent } from "../project/package-manager.js";
import { readPackageJson } from "../project/package-json.js";
import { normaliseRegistry } from "../registry/fetch.js";
import { resolveItems } from "../registry/resolve.js";

export interface AddOptions {
  cwd: string;
  overwrite?: boolean;
  yes?: boolean;
  dryRun?: boolean;
  registry?: string;
}

export interface AddResult {
  exitCode: number;
  items: string[];
  files: WriteResult;
  installed: string[];
}

/** The registry to use: --registry, then SOUTHPAW_REGISTRY_URL, then southpaw.json. */
export function pickRegistry(flag: string | undefined, ctx: Context, config: SouthpawConfig) {
  return normaliseRegistry(flag ?? ctx.env.SOUTHPAW_REGISTRY_URL ?? config.registry);
}

/** Installs items into a project that already has a southpaw.json. */
export async function installItems(
  names: string[],
  opts: AddOptions,
  config: SouthpawConfig,
  ctx: Context,
): Promise<AddResult> {
  const { cwd } = opts;
  // Fail before writing anything if this isn't a package.
  const pkg = readPackageJson(cwd);
  const registry = pickRegistry(opts.registry, ctx, config);
  const items = await resolveItems(names, registry, { fetcher: ctx.fetcher });

  // Later items win when two write the same path, like the shadcn CLI.
  const planned = new Map<string, PlannedFile>();
  const componentsDirAbs = path.resolve(cwd, config.paths.components);
  for (const item of items) {
    for (const file of item.files) {
      const abs = resolveTarget(file, config, cwd);
      assertRealPathInside(abs, cwd);
      const content = rewriteImports(file.content, {
        alias: config.aliases.components,
        componentsDirAbs,
        fileAbs: abs,
      });
      planned.set(abs, { abs, content });
    }
  }

  const files = await writeFiles([...planned.values()], {
    cwd,
    overwrite: Boolean(opts.overwrite),
    yes: Boolean(opts.yes),
    dryRun: Boolean(opts.dryRun),
    interactive: ctx.interactive,
    ask: (rel) => ctx.ui.conflict(rel),
  });

  const missing = missingDependencies(
    items.flatMap((i) => i.dependencies ?? []),
    pkg,
  );
  let installed: string[] = [];
  if (missing.length && !opts.dryRun) {
    const agent = await detectAgent(cwd);
    ctx.ui.info(`Installing ${missing.join(", ")} with ${agent}…`);
    await installDependencies(missing, { cwd, agent, runner: ctx.runner });
    installed = missing;
  } else if (missing.length) {
    installed = missing;
  }

  return {
    exitCode: files.unresolved.length ? 1 : 0,
    items: items.map((i) => i.name),
    files,
    installed,
  };
}

export function reportFiles(result: AddResult, ctx: Context, dryRun = false) {
  const { files } = result;
  const verb = dryRun ? "Would" : "";
  const list = (xs: string[]) => xs.map((f) => `  ${f}`).join("\n");
  if (files.created.length)
    ctx.ui.success(
      `${verb ? "Would create" : "Created"} ${files.created.length} file(s):\n${list(files.created)}`,
    );
  if (files.updated.length)
    ctx.ui.success(
      `${verb ? "Would overwrite" : "Overwrote"} ${files.updated.length} file(s):\n${list(files.updated)}`,
    );
  if (files.unchanged.length) ctx.ui.info(`${files.unchanged.length} file(s) already up to date.`);
  if (files.kept.length)
    ctx.ui.warn(`Kept your version of ${files.kept.length} file(s):\n${list(files.kept)}`);
  if (files.unresolved.length) {
    ctx.ui.error(
      `${files.unresolved.length} file(s) already exist and differ, and there was no one to ask:\n${list(files.unresolved)}\nRe-run with --overwrite to replace them, or --yes to keep yours.`,
    );
  }
  if (result.installed.length) {
    ctx.ui.info(`${dryRun ? "Would install" : "Installed"}: ${result.installed.join(", ")}`);
  }
}

/** `southpawui add <names…>` */
export async function add(names: string[], opts: AddOptions, ctx: Context): Promise<number> {
  if (names.length === 0) {
    throw new CliError("Name at least one component, e.g. `southpawui add dialog`.");
  }
  let config = await readConfig(opts.cwd);
  if (!config) {
    if (
      ctx.interactive &&
      !opts.yes &&
      !opts.dryRun &&
      (await ctx.ui.confirm(`No ${CONFIG_FILE} here. Set up Southpaw now?`))
    ) {
      const { init } = await import("./init.js");
      const code = await init({ cwd: opts.cwd, registry: opts.registry, yes: opts.yes }, ctx);
      if (code !== 0) return code;
      config = await readConfig(opts.cwd);
    }
    if (!config) {
      throw new CliError(`No ${CONFIG_FILE} in this project.`, "Run `npx southpawui init` first.");
    }
  }
  const result = await installItems(names, opts, config, ctx);
  reportFiles(result, ctx, opts.dryRun);
  if (result.exitCode === 0)
    ctx.ui.success(
      `${opts.dryRun ? "Dry run: nothing was written." : `Added ${pc.bold(result.items.join(", "))}.`}`,
    );
  return result.exitCode;
}
