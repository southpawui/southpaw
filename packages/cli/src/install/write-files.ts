import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface PlannedFile {
  abs: string;
  content: string;
}

export type ConflictAnswer = "overwrite" | "keep" | "overwrite-all" | "keep-all";

export interface WriteOptions {
  cwd: string;
  /** Replace files that differ, without asking. */
  overwrite: boolean;
  /** Answer prompts with the safe default (keep the existing file). */
  yes: boolean;
  dryRun: boolean;
  interactive: boolean;
  /** Asked for each differing file when interactive and no flag decides. */
  ask: (relPath: string) => Promise<ConflictAnswer>;
}

export interface WriteResult {
  created: string[];
  updated: string[];
  unchanged: string[];
  /** Kept because the user (or --yes) chose to. */
  kept: string[];
  /** Differing files left alone because nobody could be asked (non-interactive, no flag). */
  unresolved: string[];
}

/** Line endings don't count: git's autocrlf mustn't turn every re-run into a conflict. */
const sameText = (a: string, b: string) => a.replace(/\r\n/g, "\n") === b.replace(/\r\n/g, "\n");

/** Writes the planned files, deciding what to do with each existing one. */
export async function writeFiles(files: PlannedFile[], opts: WriteOptions): Promise<WriteResult> {
  const result: WriteResult = { created: [], updated: [], unchanged: [], kept: [], unresolved: [] };
  let sticky: "overwrite" | "keep" | null = null;

  for (const file of files) {
    const rel = path.relative(opts.cwd, file.abs).split(path.sep).join("/");
    const exists = existsSync(file.abs);
    if (exists && sameText(await readFile(file.abs, "utf8"), file.content)) {
      result.unchanged.push(rel);
      continue;
    }
    if (exists) {
      let decision: "overwrite" | "keep" | "unresolved";
      if (opts.overwrite) decision = "overwrite";
      else if (sticky) decision = sticky;
      else if (opts.yes) decision = "keep";
      else if (!opts.interactive) decision = "unresolved";
      else {
        const answer = await opts.ask(rel);
        if (answer === "overwrite-all") sticky = "overwrite";
        if (answer === "keep-all") sticky = "keep";
        decision = answer.startsWith("overwrite") ? "overwrite" : "keep";
      }
      if (decision === "keep") {
        result.kept.push(rel);
        continue;
      }
      if (decision === "unresolved") {
        result.unresolved.push(rel);
        continue;
      }
    }
    if (!opts.dryRun) {
      await mkdir(path.dirname(file.abs), { recursive: true });
      await writeFile(file.abs, file.content);
    }
    (exists ? result.updated : result.created).push(rel);
  }
  return result;
}
