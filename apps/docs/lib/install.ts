/**
 * The southpawui install commands, shared by the docs install tabs and the
 * Markdown output for LLMs.
 *
 * TODO(GEO-973): set to true once George publishes southpawui to npm. While
 * it's false the install tabs open on Manual and say the CLI arrives with v0.2.0.
 */
export const SOUTHPAWUI_PUBLISHED = false;
export const SOUTHPAWUI_AVAILABLE_FROM = "v0.2.0";

export const MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
export type Manager = (typeof MANAGERS)[number];

const dlx: Record<Manager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx",
};
const addDeps: Record<Manager, string> = {
  pnpm: "pnpm add",
  npm: "npm install",
  yarn: "yarn add",
  bun: "bun add",
};

export const southpawuiInit = (m: Manager) => `${dlx[m]} southpawui@latest init`;
export const southpawuiAdd = (m: Manager, names: string[]) =>
  `${dlx[m]} southpawui@latest add ${names.join(" ")}`;
export const installDeps = (m: Manager, deps: string[]) => `${addDeps[m]} ${deps.join(" ")}`;
