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
import {
  installDeps,
  MANAGERS,
  SOUTHPAWUI_AVAILABLE_FROM,
  SOUTHPAWUI_PUBLISHED,
  southpawuiAdd,
  southpawuiInit,
} from "@/lib/install";

function commands(make: (m: Manager) => string) {
  return Object.fromEntries(
    MANAGERS.map((m) => [
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

/** Installation (southpawui and manual), generated from the registry item. */
export async function InstallTabs({ name }: { name: string }) {
  const entry = getRegistryEntry(name);
  const item = await getRegistryItem(name);
  if (!entry || !item) throw new Error(`InstallTabs: "${name}" is not in the registry.`);

  const deps = localDependencyNames(entry);
  const npmDeps = entry.dependencies;

  const cli = (
    <div className="flex flex-col gap-4">
      {!SOUTHPAWUI_PUBLISHED && (
        <p
          data-slot="docs-install-notice"
          className="border-border-default bg-surface-alternate text-fg-default rounded-[var(--radius-lg)] border px-4 py-3 text-sm"
        >
          <strong>Available with {SOUTHPAWUI_AVAILABLE_FROM}.</strong> The <code>southpawui</code>{" "}
          package isn&apos;t published yet. Until then, use the Manual tab.
        </p>
      )}
      <ol className="flex flex-col gap-8">
        <Step n={1} title="Set up Southpaw (once per project)">
          <p className="text-fg-muted mb-3 text-sm">
            Writes <code>southpaw.json</code>, adds the tokens and the <code>cn</code> helper, and
            imports the tokens in your global stylesheet.
          </p>
          <ManagerTabs label="Package manager (init)" blocks={commands(southpawuiInit)} />
        </Step>
        <Step n={2} title={`Add ${item.title ?? name}`}>
          <p className="text-fg-muted mb-3 text-sm">
            Copies the component and anything it needs into your project, and installs its npm
            dependencies.
          </p>
          <ManagerTabs
            label="Package manager (add)"
            blocks={commands((m) => southpawuiAdd(m, [name]))}
          />
        </Step>
      </ol>
    </div>
  );

  const manual = (
    <ol className="flex flex-col gap-8">
      {npmDeps.length > 0 && (
        <Step n={1} title="Install the dependencies">
          <ManagerTabs
            label="Package manager (dependencies)"
            blocks={commands((m) => installDeps(m, npmDeps))}
          />
        </Step>
      )}
      <Step n={npmDeps.length > 0 ? 2 : 1} title="Add the shared files">
        <p className="text-fg-default text-sm">
          {item.title ?? name} needs these registry items too. Copy their files to the same paths:
        </p>
        <ul className="mt-2 flex list-disc flex-col gap-1 ps-5 text-sm">
          {deps.map((d) => (
            <li key={d}>
              <Link
                href={registryItemUrl(d)}
                // WCAG 2.2 target size: at least 24px tall, as these short links sit close together.
                className="inline-flex min-h-6 items-center underline underline-offset-4 hover:no-underline"
              >
                {d}
              </Link>
            </li>
          ))}
        </ul>
        <p className="text-fg-muted mb-2 mt-3 text-sm">
          Then import the tokens once in your global stylesheet, after Tailwind. The path is
          relative to that file:
        </p>
        <ServerCodeBlock
          themes={codeThemes}
          lang="css"
          code={'@import "tailwindcss";\n@import "../components/southpaw/tokens/index.css";'}
        />
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

  return (
    <InstallTabsView
      cli={cli}
      manual={manual}
      defaultTab={SOUTHPAWUI_PUBLISHED ? "cli" : "manual"}
    />
  );
}
