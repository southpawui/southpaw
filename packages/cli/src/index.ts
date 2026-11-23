#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { cac } from "cac";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { add } from "./commands/add.js";
import { init } from "./commands/init.js";
import { defaultContext } from "./context.js";
import { CliError } from "./errors.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

async function run(task: () => Promise<number>) {
  try {
    process.exitCode = await task();
  } catch (err) {
    if (err instanceof CliError) {
      p.log.error(err.message);
      if (err.hint) p.log.message(pc.dim(err.hint));
    } else {
      p.log.error(err instanceof Error ? (err.stack ?? err.message) : String(err));
    }
    process.exitCode = 1;
  }
}

const cwdOf = (cwd?: string) => path.resolve(cwd ?? process.cwd());
const cli = cac("southpawui");

cli
  .command("init", "Set up Southpaw UI in this project")
  .option("--cwd <path>", "Project root (default: current directory)")
  .option(
    "--registry <url>",
    "Registry base URL (default: SOUTHPAW_REGISTRY_URL or the Southpaw docs)",
  )
  .option("--css <path>", "Global stylesheet that imports Tailwind")
  .option("-y, --yes", "Don't ask; use detected values and keep existing files")
  .option("--force", "Ignore an existing southpaw.json and detect everything again")
  .action((options) =>
    run(() => {
      p.intro(pc.bold("Southpaw UI"));
      return init(
        {
          cwd: cwdOf(options.cwd),
          registry: options.registry,
          css: options.css,
          yes: options.yes,
          force: options.force,
        },
        defaultContext(),
      );
    }),
  );

cli
  .command("add [...components]", "Add components to this project")
  .option("--cwd <path>", "Project root (default: current directory)")
  .option("--overwrite", "Replace existing files that differ, without asking")
  .option("-y, --yes", "Don't ask; keep existing files that differ")
  .option("--dry-run", "Show what would change without writing anything")
  .option("--registry <url>", "Registry base URL for this run")
  .example("southpawui add dialog button")
  .action((components: string[], options) =>
    run(() =>
      add(
        components,
        {
          cwd: cwdOf(options.cwd),
          overwrite: options.overwrite,
          yes: options.yes,
          dryRun: options.dryRun,
          registry: options.registry,
        },
        defaultContext(),
      ),
    ),
  );

cli.help();
cli.version(pkg.version);
cli.parse();
if (!cli.matchedCommand && !cli.options.help && !cli.options.version) {
  if (cli.args.length > 0) {
    p.log.error(`Unknown command: ${cli.args[0]}`);
    process.exitCode = 1;
  }
  cli.outputHelp();
}
