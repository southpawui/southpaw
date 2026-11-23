import { createMDX } from "fumadocs-mdx/next";

// TODO(domain): the docs have no public domain yet. Registry URLs and install commands
// use NEXT_PUBLIC_SITE_URL, falling back to http://localhost:3001 (packages/registry/build.mjs).
// Set NEXT_PUBLIC_SITE_URL in the deploy environment once the domain exists.
const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Next 16 writes an AGENTS.md by default; the repo keeps agent docs in .claude/.
  agentRules: false,
  devIndicators: { position: "bottom-right" },
  transpilePackages: ["@southpawui/ui", "@southpawui/registry"],
  async rewrites() {
    // Every docs page is also served as Markdown at /docs/<slug>.md (BRIEF §8).
    return [{ source: "/docs/:path*.md", destination: "/llms.mdx/docs/:path*.md" }];
  },
};

export default withMDX(config);
