/* global console, process */
/**
 * Type-check the docs app.
 *
 * The docs import packages/ui source, so tsc also checks it. packages/ui has
 * pre-existing type errors (Field, Input, Select, lib/input/card-utils) that
 * aren't the docs' to fix. This fails on any error in apps/docs and reports
 * packages/ui errors without failing.
 *
 * TODO(GEO-970): once packages/ui type-checks cleanly, replace this with
 * `tsc --noEmit` and remove `typescript.ignoreBuildErrors` from next.config.mjs.
 */
import { spawnSync } from "node:child_process";

const run = spawnSync("pnpm", ["exec", "tsc", "--noEmit", "--pretty", "false"], {
  encoding: "utf8",
});
const lines = `${run.stdout}${run.stderr}`.split("\n");
const errorLine = /^(.+?)\(\d+,\d+\): error TS\d+/;

const docs = [];
const ui = [];
for (const [i, line] of lines.entries()) {
  const m = errorLine.exec(line);
  if (!m) continue;
  // Keep each error's indented continuation lines with it.
  const block = [line];
  for (let j = i + 1; j < lines.length && /^\s/.test(lines[j]); j++) block.push(lines[j]);
  (m[1].includes("packages/ui/") ? ui : docs).push(block.join("\n"));
}

if (ui.length) {
  console.warn(`Known packages/ui type errors (not failing the docs, see GEO-970): ${ui.length}`);
  for (const e of ui) console.warn(`  ${e.split("\n")[0]}`);
}
if (docs.length) {
  console.error(`\napps/docs type errors: ${docs.length}`);
  for (const e of docs) console.error(e);
  process.exit(1);
}
if (run.status !== 0 && !ui.length) {
  console.error(`${run.stdout}${run.stderr}`);
  process.exit(run.status ?? 1);
}
console.log("apps/docs: no type errors.");
