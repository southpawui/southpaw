import * as p from "@clack/prompts";
import pc from "picocolors";
import type { ConflictAnswer } from "./install/write-files.js";
import { defaultRunner, type Runner } from "./install/dependencies.js";
import type { Fetcher } from "./registry/fetch.js";

/** Everything the commands do to the outside world, so tests can swap it out. */
export interface Context {
  env: Record<string, string | undefined>;
  /** True when a person can answer prompts. */
  interactive: boolean;
  fetcher: Fetcher;
  runner: Runner;
  ui: Ui;
}

export interface Ui {
  info(message: string): void;
  success(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  confirm(message: string): Promise<boolean>;
  select(message: string, options: { value: string; label: string }[]): Promise<string>;
  conflict(relPath: string): Promise<ConflictAnswer>;
}

function cancelled(): never {
  p.cancel("Cancelled. Nothing else was changed.");
  process.exit(130);
}

export const terminalUi: Ui = {
  info: (m) => p.log.info(m),
  success: (m) => p.log.success(m),
  warn: (m) => p.log.warn(m),
  error: (m) => p.log.error(m),
  async confirm(message) {
    const answer = await p.confirm({ message });
    if (p.isCancel(answer)) cancelled();
    return answer;
  },
  async select(message, options) {
    const answer = await p.select({ message, options });
    if (p.isCancel(answer)) cancelled();
    return answer as string;
  },
  async conflict(relPath) {
    const answer = await p.select<ConflictAnswer>({
      message: `${pc.bold(relPath)} already exists and is different. Overwrite it?`,
      options: [
        { value: "keep", label: "No, keep mine" },
        { value: "overwrite", label: "Yes, overwrite" },
        { value: "keep-all", label: "No to all" },
        { value: "overwrite-all", label: "Yes to all" },
      ],
      initialValue: "keep",
    });
    if (p.isCancel(answer)) cancelled();
    return answer;
  },
};

export function defaultContext(): Context {
  const env = process.env;
  return {
    env,
    interactive: Boolean(process.stdin.isTTY && process.stdout.isTTY && !env.CI),
    fetcher: fetch,
    runner: defaultRunner,
    ui: terminalUi,
  };
}
