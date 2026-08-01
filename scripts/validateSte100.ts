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

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import {
  readNavigationMetadata,
  type NavigationSource,
} from "./navigationMetadata";

export const STYLE_BASELINE_FILE = "documentation-style-baseline.json";
export const ASD_STE100_REFERENCE = "ASD-STE100 Issue 9";
export const CANONICAL_CONTENT_PROFILE = "asd-ste100";
export const ASD_STE100_RULE_IDS = [
  ...Array.from({ length: 14 }, (_, index) => `1.${index + 1}`),
  ...Array.from({ length: 2 }, (_, index) => `2.${index + 1}`),
  ...Array.from({ length: 7 }, (_, index) => `3.${index + 1}`),
  ...Array.from({ length: 5 }, (_, index) => `4.${index + 1}`),
  ...Array.from({ length: 5 }, (_, index) => `5.${index + 1}`),
  ...Array.from({ length: 6 }, (_, index) => `6.${index + 1}`),
  ...Array.from({ length: 3 }, (_, index) => `7.${index + 1}`),
  ...Array.from({ length: 7 }, (_, index) => `8.${index + 1}`),
  ...Array.from({ length: 4 }, (_, index) => `9.${index + 1}`),
];
export type Ste100Issue = {
  file: string;
  line: number;
  message: string;
};

export type StyleBaselineIssue = {
  file: string;
  message: string;
};

export type Ste100ValidationOptions = {
  rootDir?: string;
};

type ProseBlock = {
  informationalCallout: boolean;
  line: number;
  procedure: boolean;
  text: string;
};

type StylePage = {
  file: string;
  hash: string;
  profile: string;
  route: string;
};

type StyleSurface = {
  file: string;
  hash: string;
  id: string;
  profile: string;
};

type StyleBaselineEntry = {
  file: string;
  profile: string;
  reviewedOn: string;
  sha256: string;
};

type StyleBaseline = {
  schemaVersion: number;
  updatedOn: string;
  references: {
    canonical: string;
    canonicalRules: string[];
  };
  pages: Record<string, StyleBaselineEntry>;
  surfaces: Record<string, StyleBaselineEntry>;
};

const SITE_CHROME_FILES = [
  {
    file: "src/theme.config.tsx",
    id: "site-chrome:theme",
  },
  {
    file: "src/components/site-footer/index.tsx",
    id: "site-chrome:footer",
  },
] as const;

const CONTRACTIONS =
  /\b(?:aren't|can't|couldn't|didn't|doesn't|don't|hadn't|hasn't|haven't|he'll|he's|isn't|it'll|it's|mustn't|shan't|she'll|she's|shouldn't|that's|there's|they'll|they're|they've|wasn't|we'll|we're|we've|weren't|won't|wouldn't|you'll|you're|you've)\b/gi;
const COMPLEX_VERB_GROUP =
  /\b(?:has|have|had|will)\s+(?:not\s+)?(?:been|being|have)\b|\b(?:am|are|is|was|were)\s+(?:not\s+)?being\b/gi;
const CONDITION = /\b(?:after|before|if|when)\b/i;
const INSTRUCTION_STARTS = new Set([
  "add",
  "apply",
  "attach",
  "build",
  "check",
  "choose",
  "click",
  "close",
  "configure",
  "confirm",
  "copy",
  "create",
  "delete",
  "deploy",
  "disable",
  "enable",
  "enter",
  "follow",
  "go",
  "install",
  "keep",
  "make",
  "open",
  "provide",
  "remove",
  "replace",
  "review",
  "run",
  "save",
  "select",
  "set",
  "start",
  "stop",
  "use",
  "verify",
  "wait",
]);

function routeFor(relative: string): string {
  return `/${relative
    .replace(/\\/g, "/")
    .replace(/\.mdx$/, "")
    .replace(/\/index$/, "")}`;
}

function replaceProtected(source: string): string {
  return source
    .replace(
      /^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?^ {0,3}\1[ \t]*$/gm,
      (value) => value.replace(/[^\n]/g, " "),
    )
    .replace(/`+[^`\n]+`+/g, " TERM ")
    .replace(/\{[^{}\n]*\}/g, " TERM ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, (value) => value.replace(/[^\n]/g, " "))
    .replace(/https?:\/\/\S+/g, " URL ")
    .replace(/&(?:amp|lt|gt|quot|apos);/g, " TERM ");
}

function plainText(source: string): string {
  return replaceProtected(source)
    .replace(/^ {0,3}#{1,6}[ \t]+/gm, "")
    .replace(/^ {0,3}(?:[-+*]|\d+[.)])[ \t]+/gm, "")
    .replace(/^ {0,3}>[ \t]?/gm, "")
    .replace(/\*\*|__|~~/g, "")
    .replace(/(?<!\w)[*_](?!\w)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstWord(value: string): string {
  return (
    plainText(value)
      .match(/^[("'[]*([A-Za-z]+)/)?.[1]
      ?.toLowerCase() || ""
  );
}

function isInstruction(value: string): boolean {
  return INSTRUCTION_STARTS.has(firstWord(value));
}

function collectBlocks(content: string, lineOffset = 0): ProseBlock[] {
  const lines = content.split(/\r?\n/);
  const blocks: ProseBlock[] = [];
  let current: string[] = [];
  let currentInformationalCallout = false;
  let currentLine = 1;
  let currentProcedure = false;
  let fence: string | null = null;
  let inImport = false;
  let stepsDepth = 0;
  const calloutStack: boolean[] = [];

  function flush(): void {
    const text = plainText(current.join(" "));
    if (text) {
      blocks.push({
        informationalCallout: currentInformationalCallout,
        line: currentLine,
        procedure: currentProcedure || isInstruction(text),
        text,
      });
    }
    current = [];
    currentInformationalCallout = false;
    currentProcedure = false;
  }

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1 + lineOffset;
    const fenceMarker = line.match(/^ {0,3}(`{3,}|~{3,})/)?.[1];
    if (fence) {
      if (
        fenceMarker?.startsWith(fence[0]) &&
        fenceMarker.length >= fence.length
      ) {
        fence = null;
      }
      continue;
    }
    if (fenceMarker) {
      flush();
      fence = fenceMarker;
      continue;
    }

    if (inImport) {
      if (/;\s*$/.test(line)) inImport = false;
      continue;
    }
    if (/^\s*import\b/.test(line)) {
      flush();
      inImport = !/;\s*$/.test(line);
      continue;
    }

    const callout = line.match(/<Callout\b([^>]*)>/);
    if (callout) {
      flush();
      const type = callout[1].match(/\btype=["']([^"']+)["']/i)?.[1];
      calloutStack.push(
        type === undefined || ["info", "note"].includes(type.toLowerCase()),
      );
    }
    if (/<Steps\b/.test(line)) stepsDepth += 1;
    const closesSteps = /<\/Steps>/.test(line);
    const closesCallout = /<\/Callout>/.test(line);
    const stripped = plainText(line);
    const isTable = /^\s*\|.*\|\s*$/.test(line);
    const isTableRule =
      isTable &&
      line
        .split("|")
        .slice(1, -1)
        .every((cell) => /^\s*:?-{3,}:?\s*$/.test(cell));
    const startsList = /^\s*(?:[-+*]|\d+[.)])\s+/.test(line);
    const ordered = /^\s*\d+[.)]\s+/.test(line);
    const heading = /^\s*#{1,6}\s+/.test(line);
    const informationalCallout = calloutStack.includes(true);

    if (!stripped || isTableRule) {
      flush();
    } else if (isTable) {
      flush();
      for (const cell of line.split("|").slice(1, -1)) {
        const text = plainText(cell);
        if (text) {
          blocks.push({
            informationalCallout,
            line: lineNumber,
            procedure: isInstruction(text),
            text,
          });
        }
      }
    } else if (startsList || heading) {
      flush();
      currentLine = lineNumber;
      currentInformationalCallout = informationalCallout;
      currentProcedure = ordered || stepsDepth > 0;
      current.push(line);
      flush();
    } else {
      if (current.length === 0) currentLine = lineNumber;
      currentInformationalCallout ||= informationalCallout;
      currentProcedure ||= stepsDepth > 0;
      current.push(line);
    }

    if (closesSteps) stepsDepth = Math.max(0, stepsDepth - 1);
    if (closesCallout) {
      flush();
      calloutStack.pop();
    }
  }
  flush();
  return blocks;
}

function collectMdxProseAttributes(
  content: string,
  lineOffset = 0,
): ProseBlock[] {
  const fields = new Map<string, Set<string>>([
    ["Cards.Card", new Set(["title"])],
    ["Iframe", new Set(["title"])],
    ["Image", new Set(["alt", "title"])],
  ]);
  const blocks: ProseBlock[] = [];
  for (const element of content.matchAll(
    /<(Cards\.Card|Iframe|Image)\b([\s\S]*?)>/g,
  )) {
    const allowed = fields.get(element[1]);
    if (!allowed) continue;
    const attributes = element[2];
    for (const attribute of attributes.matchAll(
      /\b([A-Za-z][A-Za-z0-9]*)=(?:"([^"]*)"|'([^']*)')/g,
    )) {
      if (!allowed.has(attribute[1])) continue;
      const text = plainText(attribute[2] ?? attribute[3] ?? "");
      if (!text) continue;
      const index =
        (element.index ?? 0) +
        element[0].indexOf(attributes) +
        (attribute.index ?? 0);
      blocks.push({
        informationalCallout: false,
        line: lineOffset + content.slice(0, index).split(/\r?\n/).length,
        procedure: false,
        text,
      });
    }
  }
  return blocks;
}

function sentences(text: string): string[] {
  const values = text.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g) || [];
  return values.map((value) => value.trim()).filter(Boolean);
}

export function ste100WordCount(sentence: string): number {
  const counted = sentence
    .replace(/["“][^"”\n]+["”]/g, " TERM ")
    .replace(/\([^().!?\n]*\)/g, " TERM ")
    .replace(
      /\b\d+(?:[.,]\d+)?\s+(?:bytes?|days?|degrees?\s+(?:Celsius|Fahrenheit)|gib|gb|hours?|kb|kilobytes?|mb|milliseconds?|minutes?|mib|ms|seconds?|tb|vcpus?)\b/gi,
      " TERM ",
    );
  return (
    counted.match(/\b(?:[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*|TERM|URL)\b/g) || []
  ).length;
}

function isInstructionSentence(value: string): boolean {
  if (isInstruction(value)) return true;
  const afterCondition = plainText(value).match(
    /^(?:after|before|if|when)\b[^,]*,\s*(.+)$/i,
  )?.[1];
  return afterCondition ? isInstruction(afterCondition) : false;
}

function indexOfSentence(block: ProseBlock, sentence: string): number {
  return Math.max(0, block.text.indexOf(sentence));
}

function sentenceLine(block: ProseBlock, sentence: string): number {
  return (
    block.line +
    block.text.slice(0, indexOfSentence(block, sentence)).split("\n").length -
    1
  );
}

function checkPattern(
  issues: Ste100Issue[],
  file: string,
  block: ProseBlock,
  pattern: RegExp,
  message: string,
): void {
  pattern.lastIndex = 0;
  for (const match of block.text.matchAll(pattern)) {
    issues.push({
      file,
      line: block.line,
      message: `${message}: ${match[0]}`,
    });
  }
}

function validateBlocks(
  issues: Ste100Issue[],
  file: string,
  blocks: ProseBlock[],
): void {
  for (const block of blocks) {
    checkPattern(
      issues,
      file,
      block,
      /;/g,
      "STE100 prose must not use a semicolon",
    );
    checkPattern(
      issues,
      file,
      block,
      CONTRACTIONS,
      "STE100 prose must not use a contraction",
    );
    checkPattern(
      issues,
      file,
      block,
      /\band\/or\b/gi,
      "STE100 prose must state the applicable alternative",
    );
    checkPattern(
      issues,
      file,
      block,
      COMPLEX_VERB_GROUP,
      "STE100 prose must use a simple verb group",
    );

    const blockSentences = sentences(block.text);
    if (!block.procedure && blockSentences.length > 6) {
      issues.push({
        file,
        line: block.line,
        message: `STE100 descriptive paragraph has ${blockSentences.length} sentences; maximum is 6`,
      });
    }

    for (const sentence of blockSentences) {
      if (block.informationalCallout && isInstructionSentence(sentence)) {
        issues.push({
          file,
          line: sentenceLine(block, sentence),
          message: "STE100 note must give information, not an instruction",
        });
      }

      const count = ste100WordCount(sentence);
      const maximum = block.procedure ? 20 : 25;
      if (count > maximum) {
        issues.push({
          file,
          line: sentenceLine(block, sentence),
          message: `STE100 ${block.procedure ? "procedural" : "descriptive"} sentence has ${count} words; maximum is ${maximum}`,
        });
      }

      if (block.procedure) {
        const condition = sentence.match(CONDITION);
        if (condition && (condition.index || 0) > 2) {
          issues.push({
            file,
            line: sentenceLine(block, sentence),
            message:
              "STE100 procedure must put an after, before, if, or when condition first",
          });
        }
        const secondInstruction = sentence.match(
          new RegExp(
            `\\band\\s+(?:then\\s+)?(?:${[...INSTRUCTION_STARTS].join("|")})\\b`,
            "i",
          ),
        );
        if (secondInstruction) {
          issues.push({
            file,
            line: sentenceLine(block, sentence),
            message: "STE100 procedural sentence must contain one instruction",
          });
        }
      }
    }
  }
}

function navigationEntry(value: unknown): Record<string, unknown> {
  if (typeof value === "string") return { title: value };
  return isRecord(value) ? value : {};
}

function navigationTitleBlocks(
  source: NavigationSource,
  visibleOnly: boolean,
): ProseBlock[] {
  const blocks: ProseBlock[] = [];
  for (const value of Object.values(source.navigation)) {
    const entry = navigationEntry(value);
    if (
      entry.type === "separator" ||
      (visibleOnly && entry.display === "hidden")
    ) {
      continue;
    }
    const title =
      typeof value === "string"
        ? value
        : typeof entry.title === "string"
          ? entry.title
          : null;
    if (!title?.trim()) continue;
    const index = source.source.indexOf(JSON.stringify(title));
    blocks.push({
      informationalCallout: false,
      line: index < 0 ? 1 : source.source.slice(0, index).split(/\r?\n/).length,
      procedure: false,
      text: plainText(title),
    });
  }
  return blocks;
}

async function validateCanonicalNavigation(
  issues: Ste100Issue[],
  rootDir: string,
): Promise<void> {
  const docsMetaFiles = (
    await fg("src/pages/docs/**/_meta.ts", {
      absolute: true,
      cwd: rootDir,
      onlyFiles: true,
    })
  ).sort();
  const rootMeta = path.join(rootDir, "src/pages/_meta.ts");
  const files = [
    ...docsMetaFiles.map((file) => ({ file, visibleOnly: false })),
    ...(fs.existsSync(rootMeta) ? [{ file: rootMeta, visibleOnly: true }] : []),
  ];

  for (const { file, visibleOnly } of files) {
    const relative = path.relative(rootDir, file).replace(/\\/g, "/");
    try {
      const source = await readNavigationMetadata(file);
      validateBlocks(
        issues,
        `${relative} (navigation title)`,
        navigationTitleBlocks(source, visibleOnly),
      );
    } catch (error) {
      issues.push({
        file: relative,
        line: 1,
        message: `navigation metadata does not parse: ${
          error instanceof Error ? error.message.split("\n")[0] : String(error)
        }`,
      });
    }
  }
}

export async function validateSte100({
  rootDir = process.cwd(),
}: Ste100ValidationOptions = {}): Promise<Ste100Issue[]> {
  const resolvedRoot = path.resolve(rootDir);
  const files = (
    await fg("src/pages/docs/**/*.mdx", {
      absolute: true,
      cwd: resolvedRoot,
      onlyFiles: true,
    })
  ).sort();
  const issues: Ste100Issue[] = [];

  for (const file of files) {
    const relative = path.relative(resolvedRoot, file);
    const source = await fs.promises.readFile(file, "utf8");
    let parsed: ReturnType<typeof matter>;
    try {
      parsed = matter(source);
    } catch (error) {
      issues.push({
        file: relative,
        line: 1,
        message: `frontmatter does not parse: ${
          error instanceof Error ? error.message.split("\n")[0] : String(error)
        }`,
      });
      continue;
    }

    if (parsed.data.contentProfile !== CANONICAL_CONTENT_PROFILE) {
      issues.push({
        file: relative,
        line: 1,
        message: `documentation frontmatter requires contentProfile: ${CANONICAL_CONTENT_PROFILE}`,
      });
    }
    if (
      parsed.data.docsVariant !== undefined ||
      parsed.data.canonicalRoute !== undefined
    ) {
      issues.push({
        file: relative,
        line: 1,
        message:
          "documentation frontmatter must not declare docsVariant or canonicalRoute",
      });
    }

    const frontmatterProse = [
      ["title", parsed.data.title],
      ["description", parsed.data.description],
      ["navtext", parsed.data.navtext],
    ] as const;
    for (const [field, value] of frontmatterProse) {
      if (typeof value !== "string" || value.trim() === "") continue;
      validateBlocks(issues, `${relative} (${field})`, [
        {
          informationalCallout: false,
          line: 1,
          procedure: false,
          text: plainText(value),
        },
      ]);
    }
    const bodyStart = source.indexOf(parsed.content);
    const lineOffset =
      bodyStart < 0 ? 0 : source.slice(0, bodyStart).split(/\r?\n/).length - 1;
    validateBlocks(issues, relative, collectBlocks(parsed.content, lineOffset));
    validateBlocks(
      issues,
      relative,
      collectMdxProseAttributes(parsed.content, lineOffset),
    );
  }

  await validateCanonicalNavigation(issues, resolvedRoot);

  return issues;
}

function styleHash(source: string): string {
  const parsed = matter(source);
  const reviewed = JSON.stringify({
    title: parsed.data.title || null,
    description: parsed.data.description || null,
    navtext: parsed.data.navtext || null,
    content: parsed.content.replace(/\r\n/g, "\n"),
  });
  return createHash("sha256").update(reviewed).digest("hex");
}

function reviewedHash(value: string | Record<string, unknown>): string {
  const reviewed =
    typeof value === "string"
      ? value.replace(/\r\n/g, "\n")
      : JSON.stringify(value);
  return createHash("sha256").update(reviewed).digest("hex");
}

async function collectStylePages(rootDir: string): Promise<StylePage[]> {
  const files = (
    await fg("src/pages/docs/**/*.mdx", {
      absolute: true,
      cwd: rootDir,
      onlyFiles: true,
    })
  ).sort();
  return await Promise.all(
    files.map(async (file) => {
      const relative = path.relative(rootDir, file).replace(/\\/g, "/");
      const source = await fs.promises.readFile(file, "utf8");
      const data = matter(source).data;
      return {
        file: relative,
        hash: styleHash(source),
        profile:
          typeof data.contentProfile === "string" ? data.contentProfile : "",
        route: routeFor(path.relative(path.join(rootDir, "src/pages"), file)),
      };
    }),
  );
}

async function collectStyleSurfaces(rootDir: string): Promise<StyleSurface[]> {
  const docsMetaFiles = (
    await fg("src/pages/docs/**/_meta.ts", {
      absolute: true,
      cwd: rootDir,
      onlyFiles: true,
    })
  ).sort();
  const surfaces: StyleSurface[] = [];

  for (const file of docsMetaFiles) {
    const relative = path.relative(rootDir, file).replace(/\\/g, "/");
    const { navigation } = await readNavigationMetadata(file);
    const docsDirectory = path
      .relative(path.join(rootDir, "src/pages"), path.dirname(file))
      .replace(/\\/g, "/");
    surfaces.push({
      file: relative,
      hash: reviewedHash(navigation),
      id: `navigation:/${docsDirectory}`,
      profile: CANONICAL_CONTENT_PROFILE,
    });
  }

  const rootMetaFile = path.join(rootDir, "src/pages/_meta.ts");
  if (fs.existsSync(rootMetaFile)) {
    const relative = path.relative(rootDir, rootMetaFile).replace(/\\/g, "/");
    const { navigation } = await readNavigationMetadata(rootMetaFile);
    const visibleNavigation = Object.fromEntries(
      Object.entries(navigation).filter(([slug, value]) => {
        if (slug === "*") return false;
        return navigationEntry(value).display !== "hidden";
      }),
    );
    surfaces.push({
      file: relative,
      hash: reviewedHash(visibleNavigation),
      id: "navigation:/",
      profile: CANONICAL_CONTENT_PROFILE,
    });
  }

  for (const chrome of SITE_CHROME_FILES) {
    const file = path.join(rootDir, chrome.file);
    if (!fs.existsSync(file)) continue;
    surfaces.push({
      file: chrome.file,
      hash: reviewedHash(await fs.promises.readFile(file, "utf8")),
      id: chrome.id,
      profile: CANONICAL_CONTENT_PROFILE,
    });
  }

  return surfaces.sort((left, right) => left.id.localeCompare(right.id));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBaseline(value: unknown): StyleBaseline | null {
  if (
    !isRecord(value) ||
    value.schemaVersion !== 3 ||
    typeof value.updatedOn !== "string" ||
    !isRecord(value.references) ||
    value.references.canonical !== ASD_STE100_REFERENCE ||
    Object.keys(value.references).sort().join(",") !==
      "canonical,canonicalRules" ||
    !Array.isArray(value.references.canonicalRules) ||
    JSON.stringify(value.references.canonicalRules) !==
      JSON.stringify(ASD_STE100_RULE_IDS) ||
    !isRecord(value.pages) ||
    !isRecord(value.surfaces)
  ) {
    return null;
  }
  return value as unknown as StyleBaseline;
}

export async function validateStyleBaseline({
  rootDir = process.cwd(),
}: Ste100ValidationOptions = {}): Promise<StyleBaselineIssue[]> {
  const resolvedRoot = path.resolve(rootDir);
  const baselinePath = path.join(resolvedRoot, STYLE_BASELINE_FILE);
  let baseline: StyleBaseline | null = null;
  try {
    baseline = parseBaseline(
      JSON.parse(await fs.promises.readFile(baselinePath, "utf8")),
    );
  } catch {
    baseline = null;
  }
  if (!baseline) {
    return [
      {
        file: STYLE_BASELINE_FILE,
        message:
          "style review baseline is missing or invalid; run the reviewed baseline update workflow",
      },
    ];
  }

  const [pages, surfaces] = await Promise.all([
    collectStylePages(resolvedRoot),
    collectStyleSurfaces(resolvedRoot),
  ]);
  const actualRoutes = new Set(pages.map((page) => page.route));
  const actualSurfaceIds = new Set(surfaces.map((surface) => surface.id));
  const issues: StyleBaselineIssue[] = [];
  for (const page of pages) {
    const entry = baseline.pages[page.route];
    if (!entry) {
      issues.push({
        file: page.file,
        message: `style review baseline does not include ${page.route}`,
      });
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedOn)) {
      issues.push({
        file: STYLE_BASELINE_FILE,
        message: `${page.route} requires a reviewedOn date`,
      });
    }
    if (
      entry.file !== page.file ||
      entry.profile !== page.profile ||
      entry.sha256 !== page.hash
    ) {
      issues.push({
        file: page.file,
        message: `reviewed ${page.profile || "(missing)"} content changed; complete its language-profile review and update ${STYLE_BASELINE_FILE}`,
      });
    }
  }
  for (const route of Object.keys(baseline.pages).filter(
    (route) => !actualRoutes.has(route),
  )) {
    issues.push({
      file: STYLE_BASELINE_FILE,
      message: `style review baseline contains stale route ${route}`,
    });
  }
  for (const surface of surfaces) {
    const entry = baseline.surfaces[surface.id];
    if (!entry) {
      issues.push({
        file: surface.file,
        message: `style review baseline does not include ${surface.id}`,
      });
      continue;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedOn)) {
      issues.push({
        file: STYLE_BASELINE_FILE,
        message: `${surface.id} requires a reviewedOn date`,
      });
    }
    if (
      entry.file !== surface.file ||
      entry.profile !== surface.profile ||
      entry.sha256 !== surface.hash
    ) {
      issues.push({
        file: surface.file,
        message: `reviewed ${surface.profile} surface changed; complete its language-profile review and update ${STYLE_BASELINE_FILE}`,
      });
    }
  }
  for (const id of Object.keys(baseline.surfaces).filter(
    (id) => !actualSurfaceIds.has(id),
  )) {
    issues.push({
      file: STYLE_BASELINE_FILE,
      message: `style review baseline contains stale surface ${id}`,
    });
  }
  return issues;
}

export async function writeStyleBaseline({
  rootDir = process.cwd(),
}: Ste100ValidationOptions = {}): Promise<void> {
  const resolvedRoot = path.resolve(rootDir);
  const ste100Issues = await validateSte100({ rootDir: resolvedRoot });
  if (ste100Issues.length > 0) {
    throw new Error(
      `cannot update the style baseline while ${ste100Issues.length} mechanical STE100 issue(s) remain`,
    );
  }
  const [pages, surfaces] = await Promise.all([
    collectStylePages(resolvedRoot),
    collectStyleSurfaces(resolvedRoot),
  ]);
  const invalidProfiles = pages.filter(
    (page) => page.profile !== CANONICAL_CONTENT_PROFILE,
  );
  if (invalidProfiles.length > 0) {
    throw new Error(
      `cannot update the style baseline while ${invalidProfiles.length} page(s) have an invalid contentProfile`,
    );
  }
  let prior: StyleBaseline | null = null;
  try {
    prior = parseBaseline(
      JSON.parse(
        await fs.promises.readFile(
          path.join(resolvedRoot, STYLE_BASELINE_FILE),
          "utf8",
        ),
      ),
    );
  } catch {
    prior = null;
  }
  const today = new Date().toISOString().slice(0, 10);
  const baseline: StyleBaseline = {
    schemaVersion: 3,
    updatedOn: today,
    references: {
      canonical: ASD_STE100_REFERENCE,
      canonicalRules: ASD_STE100_RULE_IDS,
    },
    pages: Object.fromEntries(
      pages
        .sort((left, right) => left.route.localeCompare(right.route))
        .map((page) => [
          page.route,
          (() => {
            const priorEntry = prior?.pages[page.route];
            const unchanged =
              priorEntry?.file === page.file &&
              priorEntry.profile === page.profile &&
              priorEntry.sha256 === page.hash;
            return {
              file: page.file,
              profile: page.profile,
              reviewedOn: unchanged ? priorEntry.reviewedOn : today,
              sha256: page.hash,
            };
          })(),
        ]),
    ),
    surfaces: Object.fromEntries(
      surfaces.map((surface) => [
        surface.id,
        (() => {
          const priorEntry = prior?.surfaces[surface.id];
          const unchanged =
            priorEntry?.file === surface.file &&
            priorEntry.profile === surface.profile &&
            priorEntry.sha256 === surface.hash;
          return {
            file: surface.file,
            profile: surface.profile,
            reviewedOn: unchanged ? priorEntry.reviewedOn : today,
            sha256: surface.hash,
          };
        })(),
      ]),
    ),
  };
  await fs.promises.writeFile(
    path.join(resolvedRoot, STYLE_BASELINE_FILE),
    `${JSON.stringify(baseline, null, 2)}\n`,
  );
}

async function runCli(): Promise<void> {
  if (process.argv.includes("--update-baseline")) {
    try {
      await writeStyleBaseline();
      console.log(
        `Updated ${STYLE_BASELINE_FILE} after the completed human language-profile review.`,
      );
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
    return;
  }

  const [ste100Issues, baselineIssues] = await Promise.all([
    validateSte100(),
    validateStyleBaseline(),
  ]);
  for (const issue of ste100Issues) {
    console.error(`${issue.file}:${issue.line} — ${issue.message}`);
  }
  for (const issue of baselineIssues) {
    console.error(`${issue.file} — ${issue.message}`);
  }
  if (ste100Issues.length + baselineIssues.length > 0) {
    console.error(
      `\nLanguage profile validation failed with ${
        ste100Issues.length + baselineIssues.length
      } issue(s).`,
    );
    process.exit(1);
  }
  console.log(
    "All documentation pages pass mechanical STE100 checks, and all reviewed style hashes match.",
  );
}

if (import.meta.main) {
  await runCli();
}
