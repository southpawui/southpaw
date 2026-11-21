import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { codeThemes } from "@/lib/code-themes";
import Link from "next/link";
import {
  getRegistryEntry,
  getRegistryItem,
  localDependencyNames,
  registryItemUrl,
} from "@/lib/registry";
import { InstallTabsView, ManagerTabs, type Manager } from "./install-tabs-view";

const dlx: Record<Manager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};
const add: Record<Manager, string> = {
  pnpm: "pnpm add",
  npm: "npm install",
  yarn: "yarn add",
  bun: "bun add",
};

function commands(make: (m: Manager) => string) {
  return Object.fromEntries(
    (Object.keys(dlx) as Manager[]).map((m) => [
      m,
      <ServerCodeBlock themes={codeThemes} key={m} code={make(m)} lang="bash" />,
    ]),
  ) as Record<Manager, React.ReactNode>;
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative ps-10">
      <span
        aria-hidden
        className="bg-surface-sunken text-fg-default absolute start-0 top-0 inline-flex size-7 items-center justify-center rounded-full text-sm font-semibold"
      >
        {n}
      </span>
      <h3 className="text-fg-default mb-3 pt-0.5 text-base font-semibold">{title}</h3>
      {children}
    </li>
  );
}

/** Installation (CLI and manual), generated from the registry item (shadcn pattern). */
export async function InstallTabs({ name }: { name: string }) {
  const entry = getRegistryEntry(name);
  const item = await getRegistryItem(name);
  if (!entry || !item) throw new Error(`InstallTabs: "${name}" is not in the registry.`);

  const deps = localDependencyNames(entry);
  const npmDeps = entry.dependencies;

  const cli = (
    <div className="flex flex-col gap-3">
      <p className="text-fg-muted text-sm">
        Adds the component, its dependencies and the Southpaw tokens with the shadcn CLI.
      </p>
      <ManagerTabs
        label="Package manager"
        blocks={commands((m) => `${dlx[m]} shadcn@latest add ${registryItemUrl(name)}`)}
      />
    </div>
  );

  const manual = (
    <ol className="flex flex-col gap-8">
      {npmDeps.length > 0 && (
        <Step n={1} title="Install the dependencies">
          <ManagerTabs
            label="Package manager (dependencies)"
            blocks={commands((m) => `${add[m]} ${npmDeps.join(" ")}`)}
          />
        </Step>
      )}
      <Step n={npmDeps.length > 0 ? 2 : 1} title="Add the shared files">
        <p className="text-fg-default text-sm">
          {item.title ?? name} needs these registry items too. Copy their files to the same paths:
        </p>
        <ul className="mt-2 list-disc ps-5 text-sm">
          {deps.map((d) => (
            <li key={d}>
              <Link
                href={registryItemUrl(d)}
                className="underline underline-offset-4 hover:no-underline"
              >
                {d}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-fg-muted mt-2 text-sm">
          Then import the tokens once, after Tailwind:{" "}
          <code>@import &quot;./components/southpaw/tokens/index.css&quot;;</code>
        </p>
      </Step>
      <Step n={npmDeps.length > 0 ? 3 : 2} title="Copy the component source">
        <div className="flex flex-col gap-4 [&_figure]:my-0">
          {item.files.map((f) => (
            <ServerCodeBlock
              themes={codeThemes}
              key={f.target}
              code={f.content.trimEnd()}
              lang={f.target.split(".").pop() ?? "tsx"}
              codeblock={{ title: f.target }}
            />
          ))}
        </div>
      </Step>
    </ol>
  );

  return <InstallTabsView cli={cli} manual={manual} />;
}
