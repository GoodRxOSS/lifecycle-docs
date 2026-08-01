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

import { afterEach, describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  collectRawMarkdownPages,
  docsRouteToHtmlOutputRelativePath,
  generateRawMarkdown,
  GENERATED_RAW_MARKDOWN_SENTINEL,
  projectMdxToMarkdown,
  rawMarkdownRouteForSource,
  runRawMarkdownCli,
  sourceRelativePathToDocsRoute,
  sourceRelativePathToRawOutputRelativePath,
  validateDocumentationSourcePaths,
  validateExportedFileBijection,
} from "../../scripts/generateRawMarkdown";

const temporaryRoots = new Set<string>();

async function temporaryRoot(): Promise<string> {
  const root = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "lifecycle-docs-raw-markdown-"),
  );
  temporaryRoots.add(root);
  await fs.promises.mkdir(path.join(root, "src/pages/docs"), {
    recursive: true,
  });
  return root;
}

async function write(
  root: string,
  relative: string,
  contents: string,
): Promise<void> {
  const file = path.join(root, relative);
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, contents);
}

function page(title: string, body = "Body text."): string {
  return `---
title: ${title}
description: Learn how to complete this task.
---

${body}
`;
}

async function writePage(
  root: string,
  sourceRelativePath: string,
  source = page("Documentation page"),
): Promise<void> {
  await write(root, `src/pages/docs/${sourceRelativePath}`, source);
}

afterEach(async () => {
  await Promise.all(
    [...temporaryRoots].map((root) =>
      fs.promises.rm(root, { force: true, recursive: true }),
    ),
  );
  temporaryRoots.clear();
});

describe("MDX to raw Markdown projection", () => {
  test("converts the supported component vocabulary without losing technical text", () => {
    const source = `---
title: Raw Markdown example
description: Show every supported projection.
---

import { Callout, Cards, Steps, Tabs } from "nextra/components";
import { Image, Iframe } from "@lifecycle-docs/components";

<Callout type="warning">
  Keep <code>{"{{aws:path:key}}"}</code> literal.
</Callout>

<Steps>

1. Preserve [the link](https://example.test) and \`inline_code\`.
2. Keep the template \`{{{service_publicUrl}}}\`.

</Steps>

<Tabs items={["First option", "Second option"]}>

<Tabs.Tab>

| Name | Value |
| --- | --- |
| one | two |

</Tabs.Tab>

<Tabs.Tab>

\`\`\`mermaid filename="flow.mmd" {1}
graph LR
  A --> B
\`\`\`

</Tabs.Tab>

</Tabs>

<Cards>
  <Cards.Card title="Read a guide" href="/docs/guide">
    Description with ordinary text.
  </Cards.Card>
</Cards>

<div className="grid">
  <Image src="/docs/example.png" alt="Example state" width={100} height={50} />
</div>

<Iframe src="https://video.example.test/embed/1" title="Product video" />

Line one.<br />Line two.

![Existing image](/existing.png)

\`\`\`yaml filename="lifecycle.yaml" {2-3}
value: "{{template_value}}"
literal: "{{{triple_template}}}"
\`\`\`
`;

    const output = projectMdxToMarkdown(source, "src/pages/docs/example.mdx");

    expect(output.startsWith(GENERATED_RAW_MARKDOWN_SENTINEL)).toBe(true);
    expect(output).toContain("# Raw Markdown example");
    expect(output).toContain("Show every supported projection.");
    expect(output).toContain(
      "> [!WARNING]\n> Keep `{{aws:path:key}}` literal.",
    );
    expect(output).toContain("1. Preserve [the link](https://example.test)");
    expect(output).toContain("`{{{service_publicUrl}}}`");
    expect(output).toContain("**First option**");
    expect(output).toContain("| Name | Value |");
    expect(output).toContain("**Second option**");
    expect(output).toContain("**File:** `flow.mmd`");
    expect(output).toContain("```mermaid\ngraph LR\n  A --> B\n```");
    expect(output).toContain(
      "- [Read a guide](/docs/guide) — Description with ordinary text.",
    );
    expect(output).toContain("![Example state](/docs/example.png)");
    expect(output).toContain(
      "[Product video](https://video.example.test/embed/1)",
    );
    expect(output).toContain("Line one.\\\nLine two.");
    expect(output).toContain("![Existing image](/existing.png)");
    expect(output).toContain("**File:** `lifecycle.yaml`");
    expect(output).toContain('value: "{{template_value}}"');
    expect(output).toContain('literal: "{{{triple_template}}}"');
    expect(output).not.toContain("filename=");
    expect(output).not.toContain("<Callout");
    expect(output).not.toContain("<Tabs");
    expect(output).not.toContain("<Cards");
    expect(output).not.toContain("<Image");
    expect(output).not.toContain("<Iframe");
    expect(output).not.toContain("import {");
    expect(output).not.toContain("description:");
  });

  test("preserves a bare CodeHike filename as adjacent prose", () => {
    const output = projectMdxToMarkdown(
      page(
        "Bare filename",
        `\`\`\`hcl secrets.auto.tfvars
token = "redacted"
\`\`\``,
      ),
      "src/pages/docs/example.mdx",
    );
    expect(output).toContain(
      '**File:** `secrets.auto.tfvars`\n\n```hcl\ntoken = "redacted"\n```',
    );
  });

  test("fails closed with file and node context for unsupported JSX", () => {
    expect(() =>
      projectMdxToMarkdown(
        page("Unsupported", "<Accordion>Hidden details.</Accordion>"),
        "src/pages/docs/unsupported.mdx",
      ),
    ).toThrow(
      /src\/pages\/docs\/unsupported\.mdx:\d+:\d+: Unsupported (?:inline|flow) JSX element \[mdxJsx(?:Text|Flow)Element <Accordion>\]/,
    );
  });

  test("rejects dynamic expressions and non-import module code", () => {
    expect(() =>
      projectMdxToMarkdown(
        page("Dynamic", "The value is {dynamicValue}."),
        "src/pages/docs/dynamic.mdx",
      ),
    ).toThrow("Standalone MDX expressions are not supported");

    expect(() =>
      projectMdxToMarkdown(
        page("Export", "export const value = 1;"),
        "src/pages/docs/export.mdx",
      ),
    ).toThrow("Only import declarations can be removed from raw Markdown");
  });

  test("accepts only the reviewed static Callout decorations used by the repository", () => {
    const output = projectMdxToMarkdown(
      page(
        "Decorative Callouts",
        `import { Info } from "lucide-react";

<Callout type="error" emoji="⚠️">
  Static warning decoration.
</Callout>

<Callout type="info" emoji={<Info />}>
  Static JSX decoration.
</Callout>

<Callout icon={Info}>
  Static icon reference.
</Callout>`,
      ),
      "src/pages/docs/decorations.mdx",
    );

    expect(output).toContain("> [!CAUTION]\n> Static warning decoration.");
    expect(output).toContain("> [!NOTE]\n> Static JSX decoration.");
    expect(output).toContain("> [!NOTE]\n> Static icon reference.");
  });

  test("rejects Callout decorations that could carry discarded meaning or behavior", () => {
    expect(() =>
      projectMdxToMarkdown(
        page(
          "Meaningful emoji",
          `<Callout emoji="Read this first">

Important text.

</Callout>`,
        ),
        "src/pages/docs/meaningful-emoji.mdx",
      ),
    ).toThrow('"emoji" must be a reviewed static decoration');

    expect(() =>
      projectMdxToMarkdown(
        page(
          "Dynamic icon",
          `<Callout icon={selectIcon(state)}>

Important text.

</Callout>`,
        ),
        "src/pages/docs/dynamic-icon.mdx",
      ),
    ).toThrow('"icon" must be the reviewed static decoration');

    expect(() =>
      projectMdxToMarkdown(
        page(
          "Meaningful JSX",
          `<Callout emoji={<Info label="Read this" />}>

Important text.

</Callout>`,
        ),
        "src/pages/docs/meaningful-jsx.mdx",
      ),
    ).toThrow('"emoji" must be a reviewed static decoration');
  });
});

describe("raw Markdown routes", () => {
  test("maps root, nested indexes, and leaf pages", () => {
    expect(sourceRelativePathToDocsRoute("index.mdx")).toBe("/docs");
    expect(sourceRelativePathToRawOutputRelativePath("index.mdx")).toBe(
      "docs.md",
    );
    expect(sourceRelativePathToDocsRoute("guides/index.mdx")).toBe(
      "/docs/guides",
    );
    expect(sourceRelativePathToRawOutputRelativePath("guides/index.mdx")).toBe(
      "docs/guides.md",
    );
    expect(sourceRelativePathToRawOutputRelativePath("guides/task.mdx")).toBe(
      "docs/guides/task.md",
    );
    expect(docsRouteToHtmlOutputRelativePath("/docs")).toBe("docs.html");
    expect(docsRouteToHtmlOutputRelativePath("/docs/guides/task")).toBe(
      "docs/guides/task.html",
    );
  });

  test("validates one exported raw Markdown file for every HTML file", () => {
    const routes = [
      rawMarkdownRouteForSource("index.mdx"),
      rawMarkdownRouteForSource("guides/index.mdx"),
      rawMarkdownRouteForSource("guides/task.mdx"),
    ];

    expect(() => validateExportedFileBijection(routes)).not.toThrow();
    expect(() =>
      validateExportedFileBijection([
        {
          ...routes[1],
          outputRelativePath: "docs/guides/index.md",
        },
      ]),
    ).toThrow(
      "maps to docs/guides.html, so its raw counterpart must be docs/guides.md",
    );
  });

  test("rejects the retired /docs/cm source namespace", () => {
    expect(
      validateDocumentationSourcePaths(["index.mdx", "guides/task.mdx"]),
    ).toBe(2);
    expect(() =>
      validateDocumentationSourcePaths(["index.mdx", "cm/guide.mdx"]),
    ).toThrow(
      "The retired /docs/cm route namespace cannot contain source pages: cm/guide.mdx",
    );
    expect(() => validateDocumentationSourcePaths(["cm.mdx"])).toThrow(
      "The retired /docs/cm route namespace cannot contain source pages: cm.mdx",
    );
  });

  test("collects every documentation route", async () => {
    const root = await temporaryRoot();
    await writePage(root, "index.mdx");
    await writePage(root, "guides/task.mdx");

    const { pages } = await collectRawMarkdownPages(root);

    expect(pages).toHaveLength(2);
    expect(pages.map((item) => item.route)).toEqual([
      "/docs/guides/task",
      "/docs",
    ]);
    expect(new Set(pages.map((item) => item.outputRelativePath)).size).toBe(2);
  });

  test("rejects index and leaf pages that reserve the same raw route", async () => {
    const root = await temporaryRoot();
    await write(root, "src/pages/docs/guide.mdx", page("Guide leaf"));
    await write(root, "src/pages/docs/guide/index.mdx", page("Guide index"));

    await expect(collectRawMarkdownPages(root)).rejects.toThrow(
      "both map to /docs/guide",
    );
  });
});

describe("raw Markdown file generation", () => {
  test("--check projects every page without requiring generated files", async () => {
    const root = await temporaryRoot();
    await writePage(root, "index.mdx");
    await writePage(root, "guides/task.mdx");

    const result = await generateRawMarkdown({ check: true, rootDir: root });

    expect(result).toEqual({
      outdatedCount: 0,
      projectedCount: 2,
      removedCount: 0,
      staleCount: 0,
      writtenCount: 0,
    });
    expect(await fs.promises.readdir(root)).not.toContain("public");
  });

  test("CLI check rejects outdated present files and accepts exact present files", async () => {
    const root = await temporaryRoot();
    await writePage(root, "index.mdx");
    await generateRawMarkdown({ rootDir: root });

    await expect(runRawMarkdownCli(["--check"], root)).resolves.toMatchObject({
      outdatedCount: 0,
      projectedCount: 1,
    });

    await write(
      root,
      "src/pages/docs/index.mdx",
      page("Documentation page", "Updated body text."),
    );
    const result = await generateRawMarkdown({ check: true, rootDir: root });
    expect(result.outdatedCount).toBe(1);
    await expect(runRawMarkdownCli(["--check"], root)).rejects.toThrow(
      "1 outdated generated raw Markdown file(s) differ from their MDX source",
    );
  });

  test("writes exact .md routes and safely removes stale generated files", async () => {
    const root = await temporaryRoot();
    await writePage(root, "index.mdx");
    await writePage(root, "guides/task.mdx");
    await write(
      root,
      "public/docs/stale/old.md",
      `${GENERATED_RAW_MARKDOWN_SENTINEL}\n\n# Old\n`,
    );
    await write(root, "public/manual.md", "# Maintained by a human\n");

    const result = await generateRawMarkdown({ rootDir: root });

    expect(result.writtenCount).toBe(2);
    expect(result.removedCount).toBe(1);
    expect(
      await fs.promises.readFile(path.join(root, "public/docs.md"), "utf8"),
    ).toContain("# Documentation page");
    expect(
      await fs.promises.readFile(
        path.join(root, "public/docs/guides/task.md"),
        "utf8",
      ),
    ).toContain("# Documentation page");
    expect(
      await fs.promises
        .access(path.join(root, "public/docs/stale/old.md"))
        .then(() => true)
        .catch(() => false),
    ).toBe(false);
    expect(
      await fs.promises.readFile(path.join(root, "public/manual.md"), "utf8"),
    ).toBe("# Maintained by a human\n");
  });

  test("refuses to overwrite a reserved non-generated .md file", async () => {
    const root = await temporaryRoot();
    await writePage(root, "guides/task.mdx");
    await write(
      root,
      "public/docs/guides/task.md",
      "# Maintained by a human\n",
    );

    await expect(generateRawMarkdown({ rootDir: root })).rejects.toThrow(
      "Refusing to overwrite non-generated raw Markdown file: public/docs/guides/task.md",
    );
    expect(
      await fs.promises.readFile(
        path.join(root, "public/docs/guides/task.md"),
        "utf8",
      ),
    ).toBe("# Maintained by a human\n");
  });

  test("refuses an unexpected non-generated file in the reserved namespace", async () => {
    const root = await temporaryRoot();
    await writePage(root, "index.mdx");
    await write(root, "public/docs/orphan.md", "# Maintained by a human\n");

    await expect(generateRawMarkdown({ rootDir: root })).rejects.toThrow(
      "Refusing unmanaged file in the reserved raw Markdown namespace: public/docs/orphan.md",
    );
  });

  test("CLI check reports stale generated raw files", async () => {
    const root = await temporaryRoot();
    await writePage(root, "index.mdx");
    await write(
      root,
      "public/docs/stale.md",
      `${GENERATED_RAW_MARKDOWN_SENTINEL}\n\n# Stale\n`,
    );

    await expect(runRawMarkdownCli(["--check"], root)).rejects.toThrow(
      "1 stale generated raw Markdown file(s) remain",
    );
  });

  test("removes generated files for the retired /docs/cm namespace", async () => {
    const root = await temporaryRoot();
    await writePage(root, "index.mdx");
    await write(
      root,
      "public/docs/cm.md",
      `${GENERATED_RAW_MARKDOWN_SENTINEL}\n\n# Retired\n`,
    );
    await write(
      root,
      "public/docs/cm/legacy.md",
      `${GENERATED_RAW_MARKDOWN_SENTINEL}\n\n# Retired\n`,
    );

    const check = await generateRawMarkdown({ check: true, rootDir: root });
    expect(check.staleCount).toBe(2);

    const result = await generateRawMarkdown({ rootDir: root });
    expect(result.removedCount).toBe(2);
    expect(
      await fs.promises
        .access(path.join(root, "public/docs/cm.md"))
        .then(() => true)
        .catch(() => false),
    ).toBe(false);
    expect(
      await fs.promises
        .access(path.join(root, "public/docs/cm/legacy.md"))
        .then(() => true)
        .catch(() => false),
    ).toBe(false);
  });
});
