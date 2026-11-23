import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/docs/status-badge";
import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = `${page.url}.md`;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      // The TOC is navigation: give it a landmark named by its "On this page" heading.
      tableOfContent={{ container: { role: "navigation", "aria-labelledby": "toc-title" } }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      {page.data.status && <StatusBadge status={page.data.status} />}
      <div className="border-border-default flex flex-row flex-wrap items-center gap-3 border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <Link
          href={markdownUrl}
          className="text-fg-muted hover:text-fg-default text-sm underline underline-offset-4"
        >
          View as Markdown
        </Link>
      </div>
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { types: { "text/markdown": `${page.url}.md` } },
  };
}
