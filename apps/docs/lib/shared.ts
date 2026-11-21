// TODO(domain): site URL comes from NEXT_PUBLIC_SITE_URL (see next.config.mjs).
export const appName = "Southpaw UI";
export const docsRoute = "/docs";
export const gitConfig = { user: "southpawui", repo: "southpaw", branch: "main" };
export const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/** Lifecycle status shown on every component page (BRIEF §8). */
export const STATUSES = ["alpha", "beta", "stable", "deprecated"] as const;
export type Status = (typeof STATUSES)[number];
