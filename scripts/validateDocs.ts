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
import fg from "fast-glob";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import yaml from "js-yaml";
import {
  DOCUMENTATION_METADATA,
  loadDocumentationMetadata,
  resolvePageMetadata,
  type DocumentationMetadata,
} from "./docsMetadata";

export type ValidationIssue = {
  file: string;
  message: string;
};

export type ValidationOptions = {
  rootDir?: string;
};

type ValidationContext = {
  publicRoot: string;
  rootDir: string;
};

type ScreenshotReference = {
  asset: string;
  declaredHeight: number | null;
  declaredWidth: number | null;
  file: string;
  index: number;
  source: string;
};

type ScreenshotCatalogEntry = {
  asset: string;
  fields: string[];
  line: number;
  status: string;
};

type ImageDimensions = {
  height: number;
  width: number;
};

const SCREENSHOT_CATALOG =
  ".agents/skills/update-lifecycle-docs/references/screenshots.md";
const RAW_MARKDOWN_SERVER_CONFIG = "default.conf";
const RASTER_EXTENSIONS = new Set([".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const NON_SCREENSHOT_RASTERS = new Set(["/logo.png"]);
const SCREENSHOT_STATUSES = new Set(["keep", "remove", "replace"]);
const PORTABLE_GUIDANCE_FILES = [
  "AGENTS.md",
  "CLAUDE.md",
  "README.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  ".agents/skills/update-lifecycle-docs/SKILL.md",
  ".agents/skills/update-lifecycle-docs/references/language-profile.md",
  ".agents/skills/update-lifecycle-docs/references/raw-markdown.md",
  ".agents/skills/update-lifecycle-docs/references/screenshots.md",
  ".agents/skills/update-lifecycle-docs/references/ste100-review.md",
  ".agents/skills/update-lifecycle-docs/agents/openai.yaml",
  "package.json",
];
const PORTABILITY_PATTERNS = [
  {
    pattern: /\/Users\/[^/\s"'`]+/g,
    message: "tracked guidance contains a contributor-specific macOS path",
  },
  {
    pattern: /\/home\/[^/\s"'`]+/g,
    message: "tracked guidance contains a contributor-specific home path",
  },
  {
    pattern: /[A-Za-z]:\\Users\\[^\\\s"'`]+/g,
    message: "tracked guidance contains a contributor-specific Windows path",
  },
  {
    pattern:
      /https?:\/\/(?:localhost|127(?:\.\d{1,3}){3})(?::\d{2,5})?(?:[/?#][^\s"'`]*)?/gi,
    message: "tracked guidance contains a fixed local development URL",
  },
  {
    pattern: /\b[^\s"'`]*\.nip\.io\b/gi,
    message: "tracked guidance contains a local-only nip.io hostname",
  },
  {
    pattern: /(?<!\S)(?:-p|--port)\s+\d{2,5}\b/g,
    message: "tracked guidance or scripts contain a fixed development port",
  },
  {
    pattern: /\blabs\s*=\s*true\b/gi,
    message: "tracked guidance contains a local Labs bypass",
  },
  {
    pattern: /\borigin\/main\b/g,
    message: "tracked guidance assumes the fixture default branch",
  },
  {
    pattern:
      /\b(?:standard local workspace|standard personal workspace|personal workspace)\b/gi,
    message: "tracked guidance assumes one contributor's workspace",
  },
];
const DOCUMENTATION_AUDIT_PATTERNS = [
  {
    pattern: /\b(?:current UI|reviewed(?: UI)?) source\b/gi,
    message:
      "end-user prose must state supported behavior, not narrate source inspection",
  },
  {
    pattern: /\bat the reviewed revision\b/gi,
    message:
      "end-user prose must not include the documentation verification timeline",
  },
  {
    pattern: /\b(?:source|code|implementation) comment\b/gi,
    message:
      "end-user prose must not compare product behavior with source comments",
  },
  {
    pattern:
      /\b(?:the )?(?:current )?(?:source code|implementation)\s+(?:shows?|confirms?|reveals?|uses?|stores?|exposes?|calls?|defines?|accepts?|rejects?)\b/gi,
    message:
      "end-user prose must state supported behavior, not narrate implementation evidence",
  },
  {
    pattern:
      /\b(?:verified|reviewed|checked|compared)\s+(?:against|in)\s+(?:the )?(?:source|source code|implementation|revision|commit)\b/gi,
    message: "end-user prose must keep verification evidence in review notes",
  },
  {
    pattern:
      /\b(?:at|in)\s+(?:the )?(?:reviewed|current)\s+(?:revision|commit)\b/gi,
    message:
      "end-user prose must not include the documentation verification timeline",
  },
  {
    pattern: /\ban older [^.\n]{0,80}\bcomment\b/gi,
    message:
      "end-user prose must not compare product behavior with older comments",
  },
  {
    pattern: /\bincorrectly calls?\b/gi,
    message:
      "end-user prose must not narrate a discrepancy found during source review",
  },
  {
    pattern: /\bwhat the implementation exposes\b/gi,
    message:
      "end-user headings must describe the user capability, not the implementation",
  },
  {
    pattern: /\binternally,\s+Lifecycle\b/gi,
    message:
      "end-user prose must describe user-observable behavior, not implementation machinery",
  },
  {
    pattern: /\binternally\b/gi,
    message:
      "end-user prose must describe user-observable behavior, not implementation machinery",
  },
  {
    pattern: /\bprocess-local\b/gi,
    message:
      "end-user prose must not expose process cache implementation details",
  },
  {
    pattern: /\btyped configuration writes clear\b/gi,
    message:
      "end-user prose must describe supported configuration results, not cache implementation",
  },
  {
    pattern: /\bperiodic refresh code\b/gi,
    message:
      "end-user prose must describe supported configuration results, not refresh implementation",
  },
  {
    pattern:
      /\b(?:database (?:record|row|table)|Redis (?:key|record)|handler name|controller name|service class)\b/gi,
    message:
      "end-user prose must not expose non-actionable implementation structures",
  },
  {
    pattern:
      /\b(?:stored|cached)\s+in\s+(?:the\s+)?(?:database|Postgres|Redis|memory|process)\b/gi,
    message:
      "end-user prose must describe the supported task, not internal persistence or cache placement",
  },
  {
    pattern: /\bsource-backed\b/gi,
    message:
      "end-user prose must state the verified result without documentation-audit labels",
  },
  {
    pattern: /\bdocumentation (?:verification )?baseline\b/gi,
    message:
      "end-user prose must not expose documentation maintenance metadata",
  },
  {
    pattern: /\bmachine-readable audience\b/gi,
    message:
      "end-user prose must not expose documentation maintenance metadata",
  },
  {
    pattern: /\bmaintainer-access source revision\b/gi,
    message:
      "end-user prose must not expose maintainer-only verification evidence",
  },
  {
    pattern:
      /\bthis (?:JSON|example|reference) documents the runtime (?:shape|value)\b/gi,
    message:
      "end-user prose must explain the supported task, not how an internal value was documented",
  },
  {
    pattern: /\bnot a database-edit procedure\b/gi,
    message:
      "end-user prose must not frame internal data as a documentation procedure",
  },
  {
    pattern: /\bthe database is not a supported editor\b/gi,
    message:
      "end-user prose must name the supported configuration surface instead of internal storage",
  },
  {
    pattern: /\bproduct contract has a defect\b/gi,
    message:
      "end-user prose must give a supported action instead of maintainer triage",
  },
  {
    pattern: /\bowning maintainer\b/gi,
    message:
      "end-user prose must give a user support path instead of maintainer workflow",
  },
  {
    pattern: /\bversioned,\s+release-approved\b/gi,
    message:
      "end-user prose must link a supported procedure instead of describing review status",
  },
];

function context(rootDir: string): ValidationContext {
  const resolvedRoot = path.resolve(rootDir);
  return {
    rootDir: resolvedRoot,
    publicRoot: path.join(resolvedRoot, "public"),
  };
}

export async function validateRawMarkdownDelivery({
  rootDir = process.cwd(),
}: ValidationOptions = {}): Promise<ValidationIssue[]> {
  const resolvedRoot = path.resolve(rootDir);
  const configPath = path.join(resolvedRoot, RAW_MARKDOWN_SERVER_CONFIG);
  let source: string;
  try {
    source = await fs.promises.readFile(configPath, "utf8");
  } catch (error) {
    return [
      {
        file: RAW_MARKDOWN_SERVER_CONFIG,
        message: `raw Markdown server configuration is unavailable: ${
          error instanceof Error ? error.message.split("\n")[0] : String(error)
        }`,
      },
    ];
  }

  const location = source.match(
    /location\s+~\s+\\\.md\$\s*\{([\s\S]*?)^\s*\}/m,
  )?.[1];
  if (!location) {
    return [
      {
        file: RAW_MARKDOWN_SERVER_CONFIG,
        message: "raw Markdown requires a dedicated .md location",
      },
    ];
  }

  const issues: ValidationIssue[] = [];
  if (!/\btypes\s*\{\s*\}/.test(location)) {
    issues.push({
      file: RAW_MARKDOWN_SERVER_CONFIG,
      message:
        "raw Markdown must clear inherited MIME mappings before setting its UTF-8 media type",
    });
  }
  if (
    !/\bdefault_type\s+["']text\/markdown;\s*charset=utf-8["']\s*;/i.test(
      location,
    )
  ) {
    issues.push({
      file: RAW_MARKDOWN_SERVER_CONFIG,
      message:
        'raw Markdown must use Content-Type "text/markdown; charset=utf-8"',
    });
  }
  if (!/\btry_files\s+\$uri\s+=404\s*;/.test(location)) {
    issues.push({
      file: RAW_MARKDOWN_SERVER_CONFIG,
      message:
        "raw Markdown must return 404 for a missing file instead of the HTML fallback",
    });
  }
  const retiredRouteLocations = [
    /location\s*=\s*\/docs\/cm\s*\{\s*return\s+404\s*;\s*\}/,
    /location\s*=\s*\/docs\/cm\.md\s*\{\s*return\s+404\s*;\s*\}/,
    /location\s+\^~\s+\/docs\/cm\/\s*\{\s*return\s+404\s*;\s*\}/,
  ];
  if (retiredRouteLocations.some((pattern) => !pattern.test(source))) {
    issues.push({
      file: RAW_MARKDOWN_SERVER_CONFIG,
      message: "retired /docs/cm routes must return 404",
    });
  }
  if (!/\berror_page\s+404\s+\/404\.html\s*;/.test(source)) {
    issues.push({
      file: RAW_MARKDOWN_SERVER_CONFIG,
      message: "404 responses must use the exported 404 page",
    });
  }
  const htmlLocation = source.match(/location\s+\/\s*\{([\s\S]*?)^\s*\}/m)?.[1];
  if (
    !htmlLocation ||
    !/\btry_files\s+\$uri\.html\s+\$uri(?:\s+\$uri\/)?\s+\/index\.html\s*;/.test(
      htmlLocation,
    )
  ) {
    issues.push({
      file: RAW_MARKDOWN_SERVER_CONFIG,
      message:
        "HTML routes must prefer the exported .html file before a same-name asset directory",
    });
  }
  return issues;
}

function routeFor(rootDir: string, file: string): string {
  const relative = path
    .relative(path.join(rootDir, "src/pages"), file)
    .replace(/\\/g, "/")
    .replace(/\.mdx$/, "");
  return `/${relative.replace(/\/index$/, "")}`;
}

function stripDestination(destination: string): string {
  return destination.split(/[?#]/, 1)[0].replace(/\/$/, "") || "/";
}

function headingText(markdown: string): string {
  return markdown
    .replace(/\s+\{#[^}]+\}\s*$/, "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function headingFragments(source: string): Set<string> {
  const fragments = new Set<string>();
  const slugger = new GithubSlugger();
  const withoutFences = source.replace(
    /^(?: {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?^(?: {0,3})\1[ \t]*$/gm,
    "",
  );

  for (const match of withoutFences.matchAll(
    /^(?: {0,3})#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm,
  )) {
    const explicit = match[1].match(/\s+\{#([^}]+)\}\s*$/)?.[1];
    if (explicit) fragments.add(explicit);
    const text = headingText(match[1]);
    if (text) fragments.add(slugger.slug(text));
  }

  for (const match of withoutFences.matchAll(
    /<(?:a|[hH][1-6])\b[^>]*\bid=["']([^"']+)["'][^>]*>/g,
  )) {
    fragments.add(match[1]);
  }

  return fragments;
}

function sourceLine(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

function addIssue(
  issues: ValidationIssue[],
  ctx: ValidationContext,
  file: string,
  source: string,
  index: number,
  message: string,
) {
  issues.push({
    file: `${path.relative(ctx.rootDir, file)}:${sourceLine(source, index)}`,
    message,
  });
}

function validateFrontmatter(
  issues: ValidationIssue[],
  ctx: ValidationContext,
  file: string,
  data: Record<string, unknown>,
  metadata: DocumentationMetadata | null,
) {
  for (const key of ["title", "description"]) {
    if (typeof data[key] !== "string" || data[key].trim() === "") {
      issues.push({
        file: path.relative(ctx.rootDir, file),
        message: `frontmatter requires a non-empty ${key}`,
      });
    }
  }

  if (metadata) {
    for (const message of resolvePageMetadata(data, metadata).issues) {
      issues.push({ file: path.relative(ctx.rootDir, file), message });
    }
  }
}

function validateInternalLinks(
  issues: ValidationIssue[],
  ctx: ValidationContext,
  file: string,
  source: string,
  routes: Set<string>,
  fragmentsByRoute: Map<string, Set<string>>,
) {
  const destinations = [
    ...source.matchAll(/\]\(((?:\/[^)\s]+|#[^)\s]+))(?:\s+["'][^"']*["'])?\)/g),
    ...source.matchAll(/\bhref=["']((?:\/[^"']+|#[^"']+))["']/g),
  ];

  for (const match of destinations) {
    const destination = match[1];
    if (!destination.startsWith("/docs") && !destination.startsWith("#")) {
      continue;
    }
    if (destination.includes(".mdx")) {
      addIssue(
        issues,
        ctx,
        file,
        source,
        match.index ?? 0,
        `internal link must use a public route, not an .mdx path: ${destination}`,
      );
      continue;
    }

    const route = destination.startsWith("#")
      ? routeFor(ctx.rootDir, file)
      : stripDestination(destination);
    if (!routes.has(route)) {
      addIssue(
        issues,
        ctx,
        file,
        source,
        match.index ?? 0,
        `internal link targets a missing docs route: ${destination}`,
      );
      continue;
    }

    const encodedFragment = destination.includes("#")
      ? destination.slice(destination.indexOf("#") + 1)
      : "";
    if (!encodedFragment) continue;

    let fragment = encodedFragment;
    try {
      fragment = decodeURIComponent(encodedFragment);
    } catch {
      addIssue(
        issues,
        ctx,
        file,
        source,
        match.index ?? 0,
        `internal link contains an invalid encoded fragment: ${destination}`,
      );
      continue;
    }

    if (!fragmentsByRoute.get(route)?.has(fragment)) {
      addIssue(
        issues,
        ctx,
        file,
        source,
        match.index ?? 0,
        `internal link targets a missing docs fragment: ${destination}`,
      );
    }
  }
}

function localAssetPath(
  ctx: ValidationContext,
  sourcePath: string,
): string | null {
  if (!sourcePath.startsWith("/")) return null;
  const normalized = path.posix.normalize(sourcePath.split(/[?#]/, 1)[0]);
  const resolved = path.resolve(ctx.publicRoot, normalized.replace(/^\/+/, ""));
  const publicPrefix = `${path.resolve(ctx.publicRoot)}${path.sep}`;
  if (!resolved.startsWith(publicPrefix)) return null;
  return resolved;
}

function validateMedia(
  issues: ValidationIssue[],
  ctx: ValidationContext,
  file: string,
  source: string,
) {
  for (const match of source.matchAll(/<Image\b[\s\S]*?\/>/g)) {
    const component = match[0];
    const index = match.index ?? 0;
    for (const prop of ["src", "alt", "width", "height"]) {
      if (!new RegExp(`\\b${prop}=`).test(component)) {
        addIssue(issues, ctx, file, source, index, `<Image> requires ${prop}`);
      }
    }

    const src = component.match(/\bsrc=["']([^"']+)["']/)?.[1];
    if (src?.startsWith("/")) {
      const asset = localAssetPath(ctx, src);
      if (!asset || !fs.existsSync(asset)) {
        addIssue(
          issues,
          ctx,
          file,
          source,
          index,
          `<Image> asset does not exist: ${src}`,
        );
      }
    }
  }

  for (const match of source.matchAll(/<Iframe\b[\s\S]*?\/>/g)) {
    if (!/\btitle=/.test(match[0])) {
      addIssue(
        issues,
        ctx,
        file,
        source,
        match.index ?? 0,
        "<Iframe> requires title",
      );
    }
  }

  for (const match of source.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    if (match[1].trim() === "") {
      addIssue(
        issues,
        ctx,
        file,
        source,
        match.index ?? 0,
        "Markdown images require descriptive alt text",
      );
    }
  }
}

function validateYaml(
  issues: ValidationIssue[],
  ctx: ValidationContext,
  file: string,
  source: string,
) {
  for (const match of source.matchAll(/```ya?ml[^\n]*\n([\s\S]*?)```/g)) {
    try {
      yaml.loadAll(match[1]);
    } catch (error) {
      addIssue(
        issues,
        ctx,
        file,
        source,
        match.index ?? 0,
        `YAML example does not parse: ${
          error instanceof Error ? error.message.split("\n")[0] : String(error)
        }`,
      );
    }
  }
}

function validatePlaceholders(
  issues: ValidationIssue[],
  ctx: ValidationContext,
  file: string,
  source: string,
  content: string,
) {
  const match = /\b(?:TODO|TBD|FIXME)\b/.exec(content);
  if (match) {
    const contentOffset = source.indexOf(content);
    addIssue(
      issues,
      ctx,
      file,
      source,
      Math.max(contentOffset, 0) + match.index,
      "published docs must not contain unresolved TODO, TBD, or FIXME markers",
    );
  }
}

function validateHeadingHierarchy(
  issues: ValidationIssue[],
  ctx: ValidationContext,
  file: string,
  source: string,
  content: string,
) {
  const withoutFences = content.replace(
    /^(?: {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?^(?: {0,3})\1[ \t]*$/gm,
    "",
  );
  const contentOffset = source.indexOf(content);

  for (const match of withoutFences.matchAll(/^(?: {0,3})#[ \t]+.+$/gm)) {
    addIssue(
      issues,
      ctx,
      file,
      source,
      Math.max(contentOffset, 0) + (match.index ?? 0),
      "page body headings must start at level 2 because frontmatter renders the page H1",
    );
  }
}

function maskMarkdownCode(source: string): string {
  const mask = (value: string) => value.replace(/[^\n]/g, " ");
  return source
    .replace(
      /^(?: {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?^(?: {0,3})\1[ \t]*$/gm,
      mask,
    )
    .replace(/`[^`\n]+`/g, mask);
}

function validateDocumentationVoice(
  issues: ValidationIssue[],
  ctx: ValidationContext,
  file: string,
  source: string,
) {
  const prose = maskMarkdownCode(source);
  for (const { pattern, message } of DOCUMENTATION_AUDIT_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of prose.matchAll(pattern)) {
      addIssue(issues, ctx, file, source, match.index ?? 0, message);
    }
  }
}

export async function validatePortableGuidance({
  rootDir = process.cwd(),
}: ValidationOptions = {}): Promise<ValidationIssue[]> {
  const ctx = context(rootDir);
  const issues: ValidationIssue[] = [];

  for (const relative of PORTABLE_GUIDANCE_FILES) {
    const file = path.join(ctx.rootDir, relative);
    if (!fs.existsSync(file)) continue;
    const source = await fs.promises.readFile(file, "utf8");
    for (const { pattern, message } of PORTABILITY_PATTERNS) {
      pattern.lastIndex = 0;
      for (const match of source.matchAll(pattern)) {
        addIssue(issues, ctx, file, source, match.index ?? 0, message);
      }
    }
  }

  return issues;
}

function numericProp(component: string, name: string): number | null {
  const match = component.match(
    new RegExp(`\\b${name}=\\{?\\s*["']?(\\d+)["']?\\s*\\}?`),
  );
  return match ? Number.parseInt(match[1], 10) : null;
}

function collectScreenshotReferences(
  files: Array<{ file: string; source: string }>,
): ScreenshotReference[] {
  const references: ScreenshotReference[] = [];
  for (const { file, source } of files) {
    for (const match of source.matchAll(/<Image\b[\s\S]*?\/>/g)) {
      const component = match[0];
      const src = component.match(/\bsrc=["']([^"']+)["']/)?.[1];
      if (!src?.startsWith("/")) continue;
      const asset = path.posix.normalize(src.split(/[?#]/, 1)[0]);
      if (!RASTER_EXTENSIONS.has(path.posix.extname(asset).toLowerCase())) {
        continue;
      }
      references.push({
        asset,
        file,
        source,
        index: match.index ?? 0,
        declaredWidth: numericProp(component, "width"),
        declaredHeight: numericProp(component, "height"),
      });
    }
  }
  return references;
}

function parseCatalog(source: string): Map<string, ScreenshotCatalogEntry[]> {
  const entries = new Map<string, ScreenshotCatalogEntry[]>();
  const lines = source.split(/\r?\n/);

  for (const [index, line] of lines.entries()) {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    const asset = cells[0]?.match(/^`(\/[^`]+)`$/)?.[1];
    if (!asset) continue;
    const status = cells.at(-1)?.replace(/`/g, "").trim().toLowerCase() || "";
    const entry = { asset, fields: cells, line: index + 1, status };
    entries.set(asset, [...(entries.get(asset) || []), entry]);
  }

  return entries;
}

function pngDimensions(buffer: Buffer): ImageDimensions | null {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (buffer.length < 24 || !buffer.subarray(0, 8).equals(signature)) {
    return null;
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function gifDimensions(buffer: Buffer): ImageDimensions | null {
  const header = buffer.subarray(0, 6).toString("ascii");
  if (buffer.length < 10 || (header !== "GIF87a" && header !== "GIF89a")) {
    return null;
  }
  return {
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8),
  };
}

function jpegDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }
  const startOfFrame = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce,
    0xcf,
  ]);
  let offset = 2;

  while (offset + 3 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 1 >= buffer.length) break;
    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) break;
    if (startOfFrame.has(marker) && segmentLength >= 7) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      };
    }
    offset += segmentLength;
  }

  return null;
}

function uint24LE(buffer: Buffer, offset: number): number {
  return (
    buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16)
  );
}

function webpDimensions(buffer: Buffer): ImageDimensions | null {
  if (
    buffer.length < 30 ||
    buffer.subarray(0, 4).toString("ascii") !== "RIFF" ||
    buffer.subarray(8, 12).toString("ascii") !== "WEBP"
  ) {
    return null;
  }

  const chunk = buffer.subarray(12, 16).toString("ascii");
  if (chunk === "VP8X") {
    return {
      width: uint24LE(buffer, 24) + 1,
      height: uint24LE(buffer, 27) + 1,
    };
  }
  if (chunk === "VP8 " && buffer.length >= 30) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L" && buffer.length >= 25 && buffer[20] === 0x2f) {
    return {
      width: 1 + buffer[21] + ((buffer[22] & 0x3f) << 8),
      height:
        1 + (buffer[22] >> 6) + (buffer[23] << 2) + ((buffer[24] & 0x0f) << 10),
    };
  }
  return null;
}

async function readImageDimensions(file: string): Promise<ImageDimensions> {
  const buffer = await fs.promises.readFile(file);
  const extension = path.extname(file).toLowerCase();
  const dimensions =
    extension === ".png"
      ? pngDimensions(buffer)
      : extension === ".gif"
        ? gifDimensions(buffer)
        : extension === ".jpg" || extension === ".jpeg"
          ? jpegDimensions(buffer)
          : extension === ".webp"
            ? webpDimensions(buffer)
            : null;
  if (!dimensions || dimensions.width <= 0 || dimensions.height <= 0) {
    throw new Error(`cannot read intrinsic ${extension || "image"} dimensions`);
  }
  return dimensions;
}

function catalogIssue(
  issues: ValidationIssue[],
  line: number,
  message: string,
) {
  issues.push({ file: `${SCREENSHOT_CATALOG}:${line}`, message });
}

function isUnverifiedCatalogValue(value: string): boolean {
  const normalized = value.replace(/`/g, "").trim();
  return (
    normalized === "" ||
    /^(?:n\/a\b|none\b)/i.test(normalized) ||
    /\b(?:pending|tbd|unknown|unverified)\b/i.test(normalized)
  );
}

function catalogText(value: string): string {
  return value.replace(/^`|`$/g, "").trim();
}

export async function validateScreenshots({
  rootDir = process.cwd(),
}: ValidationOptions = {}): Promise<ValidationIssue[]> {
  const ctx = context(rootDir);
  const issues: ValidationIssue[] = [];
  const docsFiles = (
    await fg("src/pages/docs/**/*.mdx", {
      absolute: true,
      cwd: ctx.rootDir,
    })
  ).sort();
  const sources = await Promise.all(
    docsFiles.map(async (file) => ({
      file,
      source: await fs.promises.readFile(file, "utf8"),
    })),
  );
  const references = collectScreenshotReferences(sources);
  const referencesByAsset = new Map<string, ScreenshotReference[]>();
  for (const reference of references) {
    referencesByAsset.set(reference.asset, [
      ...(referencesByAsset.get(reference.asset) || []),
      reference,
    ]);
  }

  const catalogPath = path.join(ctx.rootDir, SCREENSHOT_CATALOG);
  if (!fs.existsSync(catalogPath)) {
    issues.push({
      file: SCREENSHOT_CATALOG,
      message: "screenshot catalog does not exist",
    });
    return issues;
  }
  const catalogSource = await fs.promises.readFile(catalogPath, "utf8");
  const catalog = parseCatalog(catalogSource);

  for (const [asset, entries] of catalog) {
    if (entries.length > 1) {
      catalogIssue(
        issues,
        entries[1].line,
        `screenshot catalog contains duplicate asset ${asset}`,
      );
    }
    const entry = entries[0];
    if (!SCREENSHOT_STATUSES.has(entry.status)) {
      catalogIssue(
        issues,
        entry.line,
        `${asset} requires review status keep, replace, or remove`,
      );
    } else if (entry.status !== "keep") {
      catalogIssue(
        issues,
        entry.line,
        `${asset} is marked ${entry.status} and must be remediated`,
      );
    } else {
      const requiredFields = [
        ["user point", entry.fields[2] || ""],
        ["UI route/state", entry.fields[3] || ""],
        ["fixture and cleanup", entry.fields[4] || ""],
        ["viewport/theme", entry.fields[5] || ""],
        ["UI revision", entry.fields[6] || ""],
        ["verification date", entry.fields[7] || ""],
      ];
      const unresolvedFields = requiredFields
        .filter(([, value]) => isUnverifiedCatalogValue(value))
        .map(([label]) => label);
      if (unresolvedFields.length > 0) {
        catalogIssue(
          issues,
          entry.line,
          `${asset} is marked keep but has unresolved catalog field(s): ${unresolvedFields.join(", ")}`,
        );
      }
    }

    if (!referencesByAsset.has(asset)) {
      catalogIssue(
        issues,
        entry.line,
        `${asset} is cataloged but not referenced by a docs page`,
      );
    } else {
      const catalogRoute = catalogText(entry.fields[1] || "");
      const referenceRoutes = new Set(
        (referencesByAsset.get(asset) || []).map((reference) =>
          routeFor(ctx.rootDir, reference.file),
        ),
      );
      if (
        !catalogRoute.startsWith("/docs") ||
        referenceRoutes.size !== 1 ||
        !referenceRoutes.has(catalogRoute)
      ) {
        catalogIssue(
          issues,
          entry.line,
          `${asset} catalog docs page ${catalogRoute || "(missing)"} does not match reference route(s): ${[...referenceRoutes].join(", ")}`,
        );
      }
    }
    const file = localAssetPath(ctx, asset);
    if (!file || !fs.existsSync(file)) {
      catalogIssue(
        issues,
        entry.line,
        `${asset} is cataloged but the public asset does not exist`,
      );
    }
  }

  for (const reference of references) {
    if (!catalog.has(reference.asset)) {
      addIssue(
        issues,
        ctx,
        reference.file,
        reference.source,
        reference.index,
        `${reference.asset} is missing from the screenshot catalog`,
      );
    }

    const file = localAssetPath(ctx, reference.asset);
    if (!file || !fs.existsSync(file)) continue;
    if (reference.declaredWidth === null || reference.declaredHeight === null) {
      addIssue(
        issues,
        ctx,
        reference.file,
        reference.source,
        reference.index,
        `${reference.asset} requires numeric width and height for the screenshot audit`,
      );
      continue;
    }

    try {
      const actual = await readImageDimensions(file);
      if (
        actual.width !== reference.declaredWidth ||
        actual.height !== reference.declaredHeight
      ) {
        addIssue(
          issues,
          ctx,
          reference.file,
          reference.source,
          reference.index,
          `${reference.asset} declares ${reference.declaredWidth}x${reference.declaredHeight} but is ${actual.width}x${actual.height}`,
        );
      }
    } catch (error) {
      addIssue(
        issues,
        ctx,
        reference.file,
        reference.source,
        reference.index,
        `${reference.asset} ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  const publicRasters = await fg("public/**/*.{gif,jpeg,jpg,png,webp}", {
    cwd: ctx.rootDir,
    onlyFiles: true,
  });
  for (const relative of publicRasters) {
    const asset = `/${path
      .relative(ctx.publicRoot, path.join(ctx.rootDir, relative))
      .replace(/\\/g, "/")}`;
    if (
      !NON_SCREENSHOT_RASTERS.has(asset) &&
      !referencesByAsset.has(asset) &&
      !catalog.has(asset)
    ) {
      issues.push({
        file: relative,
        message:
          "raster asset is neither referenced nor classified in the screenshot catalog",
      });
    }
  }

  for (const { pattern, message } of PORTABILITY_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of catalogSource.matchAll(pattern)) {
      addIssue(
        issues,
        ctx,
        catalogPath,
        catalogSource,
        match.index ?? 0,
        `screenshot catalog ${message}`,
      );
    }
  }

  return issues;
}

export async function validateDocs({
  rootDir = process.cwd(),
}: ValidationOptions = {}): Promise<ValidationIssue[]> {
  const ctx = context(rootDir);
  const files = (
    await fg("src/pages/docs/**/*.mdx", {
      absolute: true,
      cwd: ctx.rootDir,
    })
  ).sort();
  const routes = new Set(files.map((file) => routeFor(ctx.rootDir, file)));
  const sources = new Map(
    await Promise.all(
      files.map(async (file) => [
        file,
        await fs.promises.readFile(file, "utf8"),
      ]),
    ),
  );
  const fragmentsByRoute = new Map(
    files.map((file) => [
      routeFor(ctx.rootDir, file),
      headingFragments(sources.get(file) || ""),
    ]),
  );
  const issues: ValidationIssue[] = [];
  let metadata: DocumentationMetadata | null = null;
  try {
    metadata = await loadDocumentationMetadata(ctx.rootDir);
  } catch (error) {
    issues.push({
      file: DOCUMENTATION_METADATA,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  for (const file of files) {
    const source = sources.get(file) || "";
    let parsed: ReturnType<typeof matter> | null = null;
    try {
      parsed = matter(source);
    } catch (error) {
      issues.push({
        file: path.relative(ctx.rootDir, file),
        message: `frontmatter does not parse: ${
          error instanceof Error ? error.message.split("\n")[0] : String(error)
        }`,
      });
    }
    if (parsed) validateFrontmatter(issues, ctx, file, parsed.data, metadata);
    validateInternalLinks(issues, ctx, file, source, routes, fragmentsByRoute);
    validateMedia(issues, ctx, file, source);
    validateYaml(issues, ctx, file, source);
    validateDocumentationVoice(issues, ctx, file, source);
    if (parsed) {
      validateHeadingHierarchy(issues, ctx, file, source, parsed.content);
      validatePlaceholders(issues, ctx, file, source, parsed.content);
    }
  }

  issues.push(...(await validatePortableGuidance({ rootDir })));
  issues.push(...(await validateRawMarkdownDelivery({ rootDir })));
  return issues;
}

async function runCli() {
  const screenshotsOnly = process.argv.includes("--screenshots-only");
  const issues = screenshotsOnly
    ? await validateScreenshots()
    : await validateDocs();
  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(`${issue.file} — ${issue.message}`);
    }
    console.error(
      `\n${screenshotsOnly ? "Screenshot" : "Documentation"} validation failed with ${issues.length} issue(s).`,
    );
    process.exit(1);
  }

  if (screenshotsOnly) {
    console.log(
      "Screenshot structural validation passed. Manual pixel privacy and live-state review is still required.",
    );
  } else {
    console.log("Documentation validation passed.");
  }
}

if (import.meta.main) {
  await runCli();
}
