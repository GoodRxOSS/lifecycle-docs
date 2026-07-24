/**
 * Copyright 2026 GoodRx, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import fg from "fast-glob";
import matter from "gray-matter";
import {
  loadDocumentationMetadata,
  resolvePageMetadata,
  type DocumentationMetadata,
} from "./docsMetadata";
import { docsRouteToRawOutputRelativePath } from "./generateRawMarkdown";

export type PublicDocsPage = {
  audience: string[];
  lastVerified: string;
  route: string;
  sectionTitle: string;
  supportStatus: string | null;
  title: string;
  description: string;
  verificationBaseline: string;
};

export type DocsGenerationOptions = {
  rootDir?: string;
  publicOrigin?: string;
};

type MetaEntry = {
  display?: unknown;
  href?: unknown;
  title?: unknown;
  type?: unknown;
};

const START_SECTION = "Start here";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pageRoute(rootDir: string, file: string): string {
  const relative = path
    .relative(path.join(rootDir, "src/pages"), file)
    .replace(/\\/g, "/")
    .replace(/\.mdx$/, "");
  return `/${relative.replace(/\/index$/, "")}`;
}

function fallbackTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeDescription(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeOrigin(value: string): string {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`Docs public URL must use http or https: ${value}`);
  }
  return url.toString().replace(/\/$/, "");
}

async function resolvePublicOrigin(
  rootDir: string,
  explicitOrigin?: string,
): Promise<string> {
  if (explicitOrigin) return normalizeOrigin(explicitOrigin);
  if (process.env.DOCS_PUBLIC_URL) {
    return normalizeOrigin(process.env.DOCS_PUBLIC_URL);
  }
  const cname = (
    await fs.promises.readFile(path.join(rootDir, "public/CNAME"), "utf8")
  ).trim();
  if (!cname) throw new Error("public/CNAME must contain the docs hostname");
  return normalizeOrigin(`https://${cname}`);
}

async function loadMeta(directory: string): Promise<Record<string, unknown>> {
  const metaPath = path.join(directory, "_meta.ts");
  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(metaPath);
  } catch {
    throw new Error(
      `${metaPath} is required to define curated public navigation`,
    );
  }

  const url = pathToFileURL(metaPath);
  url.searchParams.set("revision", `${stat.mtimeMs}-${stat.size}`);
  const imported: unknown = await import(url.href);
  const exported = isRecord(imported) ? imported.default : null;
  if (!isRecord(exported)) {
    throw new Error(`${metaPath} must default-export a navigation object`);
  }
  return exported;
}

async function directoryContainsPage(directory: string): Promise<boolean> {
  const matches = await fg("**/*.mdx", {
    cwd: directory,
    onlyFiles: true,
  });
  return matches.length > 0;
}

function metaEntry(value: unknown): MetaEntry {
  if (typeof value === "string") return { title: value };
  return isRecord(value) ? value : {};
}

function isSeparator(entry: MetaEntry): boolean {
  return entry.type === "separator";
}

function isHidden(entry: MetaEntry): boolean {
  return entry.display === "hidden";
}

function isExternalOnly(entry: MetaEntry): boolean {
  const href = nonEmptyString(entry.href);
  return Boolean(href && !href.startsWith("/docs"));
}

async function readPage(
  rootDir: string,
  file: string,
  sectionTitle: string,
  navigationTitle: string | null,
  registry: DocumentationMetadata,
): Promise<PublicDocsPage> {
  const source = await fs.promises.readFile(file, "utf8");
  const { data } = matter(source);
  const title = nonEmptyString(data.title);
  const description = nonEmptyString(data.description);
  const relative = path.relative(rootDir, file);

  if (!title || !description) {
    const missing = [
      !title ? "title" : null,
      !description ? "description" : null,
    ]
      .filter(Boolean)
      .join(" and ");
    throw new Error(
      `${relative} requires non-empty ${missing} frontmatter before llms.txt can be generated`,
    );
  }
  const resolution = resolvePageMetadata(data, registry);
  if (!resolution.metadata) {
    throw new Error(
      `${relative} has invalid documentation metadata: ${resolution.issues.join("; ")}`,
    );
  }
  const { audience, lastVerified, supportStatus, verificationBaseline } =
    resolution.metadata;

  return {
    audience,
    lastVerified,
    route: pageRoute(rootDir, file),
    sectionTitle,
    supportStatus,
    title: navigationTitle || title,
    description: normalizeDescription(description),
    verificationBaseline,
  };
}

async function collectDirectoryPages({
  rootDir,
  directory,
  sectionTitle,
  visible,
  isDocsRoot,
  registry,
}: {
  rootDir: string;
  directory: string;
  sectionTitle: string;
  visible: boolean;
  isDocsRoot: boolean;
  registry: DocumentationMetadata;
}): Promise<PublicDocsPage[]> {
  const navigation = await loadMeta(directory);
  const diskEntries = await fs.promises.readdir(directory, {
    withFileTypes: true,
  });
  const pageSlugs = new Set(
    diskEntries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .map((entry) => entry.name.replace(/\.mdx$/, "")),
  );
  const directorySlugs = new Set<string>();

  for (const entry of diskEntries) {
    if (
      entry.isDirectory() &&
      (await directoryContainsPage(path.join(directory, entry.name)))
    ) {
      directorySlugs.add(entry.name);
    }
  }

  const declaredTargets = new Set<string>();
  const pages: PublicDocsPage[] = [];

  for (const [slug, rawEntry] of Object.entries(navigation)) {
    const entry = metaEntry(rawEntry);
    if (isSeparator(entry) || isExternalOnly(entry)) continue;
    if (isDocsRoot && slug === "cm") {
      throw new Error(
        `${path.relative(rootDir, path.join(directory, "_meta.ts"))} declares the retired /docs/cm target`,
      );
    }

    const pageExists = pageSlugs.has(slug);
    const directoryExists = directorySlugs.has(slug);
    if (pageExists && directoryExists) {
      throw new Error(
        `${path.relative(rootDir, directory)} navigation target "${slug}" is ambiguous`,
      );
    }
    if (!pageExists && !directoryExists) {
      throw new Error(
        `${path.relative(rootDir, path.join(directory, "_meta.ts"))} declares missing target "${slug}"`,
      );
    }

    declaredTargets.add(slug);
    const navigationTitle = nonEmptyString(entry.title) || fallbackTitle(slug);
    const entryVisible = visible && !isHidden(entry);

    if (pageExists) {
      const page = await readPage(
        rootDir,
        path.join(directory, `${slug}.mdx`),
        sectionTitle,
        navigationTitle,
        registry,
      );
      if (entryVisible) pages.push(page);
      continue;
    }

    const nestedSection = isDocsRoot ? navigationTitle : sectionTitle;
    pages.push(
      ...(await collectDirectoryPages({
        rootDir,
        directory: path.join(directory, slug),
        sectionTitle: nestedSection,
        visible: entryVisible,
        isDocsRoot: false,
        registry,
      })),
    );
  }

  const undeclared = [...pageSlugs, ...directorySlugs]
    .filter((slug) => !declaredTargets.has(slug))
    .sort();
  if (undeclared.length > 0) {
    throw new Error(
      `${path.relative(rootDir, path.join(directory, "_meta.ts"))} omits public target(s): ${undeclared.join(", ")}`,
    );
  }

  return pages;
}

export async function collectPublicDocsPages({
  rootDir = process.cwd(),
}: Pick<DocsGenerationOptions, "rootDir"> = {}): Promise<PublicDocsPage[]> {
  const resolvedRoot = path.resolve(rootDir);
  const docsRoot = path.join(resolvedRoot, "src/pages/docs");
  const registry = await loadDocumentationMetadata(resolvedRoot);
  const pages = await collectDirectoryPages({
    rootDir: resolvedRoot,
    directory: docsRoot,
    sectionTitle: START_SECTION,
    visible: true,
    isDocsRoot: true,
    registry,
  });
  const routes = new Set<string>();
  for (const page of pages) {
    if (routes.has(page.route)) {
      throw new Error(
        `Curated navigation contains duplicate route ${page.route}`,
      );
    }
    routes.add(page.route);
  }
  return pages;
}

export function renderLlms(
  pages: PublicDocsPage[],
  publicOrigin: string,
): string {
  const lines = [
    "# Lifecycle",
    "",
    "> End-user documentation for Lifecycle environments, configuration, automation, agents, and platform operations.",
    "",
    "This index is generated from the human documentation. Follow the linked page for current prerequisites, procedures, support boundaries, and recovery guidance.",
    "",
  ];

  let currentSection: string | null = null;
  for (const page of pages) {
    if (page.sectionTitle !== currentSection) {
      if (currentSection !== null) lines.push("");
      currentSection = page.sectionTitle;
      lines.push(`## ${page.sectionTitle}`, "");
    }
    const metadata = [
      `audience: ${page.audience.join(", ")}`,
      `last verified: ${page.lastVerified}`,
      `baseline: ${page.verificationBaseline}`,
      page.supportStatus ? `status: ${page.supportStatus}` : null,
    ]
      .filter(Boolean)
      .join("; ");
    const rawMarkdownPath = `/${docsRouteToRawOutputRelativePath(page.route)}`;
    lines.push(
      `- [${page.title}](${publicOrigin}${rawMarkdownPath}): ${page.description} _(${metadata})_`,
    );
  }

  return `${lines.join("\n").trim()}\n`;
}

export async function generateLlms({
  rootDir = process.cwd(),
  publicOrigin,
}: DocsGenerationOptions = {}): Promise<string> {
  const resolvedRoot = path.resolve(rootDir);
  const pages = await collectPublicDocsPages({ rootDir: resolvedRoot });
  const origin = await resolvePublicOrigin(resolvedRoot, publicOrigin);
  return renderLlms(pages, origin);
}

async function runCli() {
  const rootDir = process.cwd();
  const output = await generateLlms({ rootDir });
  const outputPath = path.join(rootDir, "public/llms.txt");
  if (process.argv.includes("--check")) {
    let current: string | null = null;
    try {
      current = await fs.promises.readFile(outputPath, "utf8");
    } catch {
      current = null;
    }
    if (current !== output) {
      throw new Error(
        "public/llms.txt is stale or missing. Run `bun run build:llms` and commit the result.",
      );
    }
    console.log("public/llms.txt matches the documentation page tree.");
    return;
  }

  await fs.promises.writeFile(outputPath, output);
  console.log("Generated public/llms.txt from curated public navigation.");
}

if (import.meta.main) {
  try {
    await runCli();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
