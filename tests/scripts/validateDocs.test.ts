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
  validateDocs,
  validatePortableGuidance,
  validateRawMarkdownDelivery,
  validateScreenshots,
} from "../../scripts/validateDocs";

const temporaryRoots = new Set<string>();
const catalogPath =
  ".agents/skills/update-lifecycle-docs/references/screenshots.md";

async function temporaryRoot(): Promise<string> {
  const root = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "lifecycle-docs-validation-"),
  );
  temporaryRoots.add(root);
  await write(
    root,
    "documentation-metadata.json",
    JSON.stringify({
      schemaVersion: 1,
      maintenance: {
        owner: "Lifecycle documentation maintainers",
        reviewTrigger: "owning-contract-change",
      },
      audiences: ["application-developer"],
      supportStatuses: ["labs"],
      verificationBaselines: {
        test: {
          verifiedOn: "2026-07-24",
          sources: {
            lifecycle: "9956d3e70a89c81a23c6502d03e237750c3886a4",
          },
        },
      },
    }),
  );
  await write(
    root,
    "default.conf",
    `server {
  location = /docs/cm { return 404; }
  location = /docs/cm.md { return 404; }
  location ^~ /docs/cm/ { return 404; }
  location ~ \\.md$ {
    types {}
    default_type "text/markdown; charset=utf-8";
    try_files $uri =404;
  }
  location / {
    try_files $uri.html $uri $uri/ /index.html;
  }
  error_page 404 /404.html;
}
`,
  );
  return root;
}

async function write(
  root: string,
  relative: string,
  contents: string | Buffer,
): Promise<void> {
  const file = path.join(root, relative);
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, contents);
}

function page(contents = ""): string {
  return `---
title: Guide
description: Complete the task safely
audience:
  - application-developer
lastVerified: "2026-07-24"
verificationBaseline: test
---

## Guide

${contents}
`;
}

function png(width: number, height: number): Buffer {
  const buffer = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(buffer);
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  return buffer;
}

function catalog(asset: string, status = "keep"): string {
  return `| Asset | Docs page | User point | UI route/state | Fixture | Viewport/theme | UI revision | Last verified | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| \`${asset}\` | \`/docs/guide\` | Find the control | Guide view | Neutral fixture | 1440×900 / light | \`abc123\` | 2026-07-24 | \`${status}\` |
`;
}

afterEach(async () => {
  await Promise.all(
    [...temporaryRoots].map((root) =>
      fs.promises.rm(root, { force: true, recursive: true }),
    ),
  );
  temporaryRoots.clear();
});

describe("documentation validation", () => {
  test("accepts complete frontmatter, routes, media, and YAML", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(`[Return to this guide](/docs/guide#guide)

\`\`\`yaml
service:
  name: api
\`\`\``),
    );

    expect(await validateDocs({ rootDir: root })).toEqual([]);
  });

  test("reports missing metadata, broken links, invalid YAML, and placeholders", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      `---
title: Guide
---

[Missing](/docs/missing.mdx)

\`\`\`yaml
service: [
\`\`\`

TODO
`,
    );

    const messages = (await validateDocs({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(messages).toContain("frontmatter requires a non-empty description");
    expect(
      messages.some((message) => message.includes("not an .mdx path")),
    ).toBe(true);
    expect(messages.some((message) => message.includes("does not parse"))).toBe(
      true,
    );
    expect(
      messages.some((message) => message.includes("unresolved TODO")),
    ).toBe(true);
  });

  test("reports broken local documentation fragments", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(`[Good section](#guide)

[Missing section](/docs/guide#not-a-heading)`),
    );

    const messages = (await validateDocs({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(messages).toContain(
      "internal link targets a missing docs fragment: /docs/guide#not-a-heading",
    );
    expect(messages).not.toContain(
      "internal link targets a missing docs fragment: #guide",
    );
  });

  test("reports contributor-specific local guidance", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "README.md",
      "Run `next dev -p 3333`, then open http://localhost:3333 from /Users/example/work.",
    );
    await write(
      root,
      ".agents/skills/update-lifecycle-docs/references/ste100-review.md",
      "Read the review copy from /home/example/private-review.",
    );

    const messages = (await validatePortableGuidance({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(messages).toContain(
      "tracked guidance contains a fixed local development URL",
    );
    expect(messages).toContain(
      "tracked guidance contains a contributor-specific macOS path",
    );
    expect(messages).toContain(
      "tracked guidance contains a contributor-specific home path",
    );
    expect(messages).toContain(
      "tracked guidance or scripts contain a fixed development port",
    );
  });

  test("reports malformed frontmatter without aborting validation", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      `---
title: [
---

# Guide
`,
    );

    const messages = (await validateDocs({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(
      messages.some((message) =>
        message.startsWith("frontmatter does not parse"),
      ),
    ).toBe(true);
  });

  test("reports a second page-level heading outside code fences", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(`# Duplicate page title

\`\`\`dockerfile
# This is a comment, not a heading
\`\`\``),
    );

    expect(
      (await validateDocs({ rootDir: root })).map((issue) => issue.message),
    ).toContain(
      "page body headings must start at level 2 because frontmatter renders the page H1",
    );
  });

  test("reports documentation-audit narration in end-user prose", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(`Current UI source places this feature behind a gate.

Typed configuration writes clear the process-local cache. An older source
comment incorrectly calls the interval hourly.

The current implementation stores the setting in a database record. The
periodic refresh code reads it later. This was verified against the source.

The documentation baseline includes a maintainer-access source revision.
This JSON documents the runtime shape, not a database-edit procedure.`),
    );

    const messages = (await validateDocs({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(messages).toContain(
      "end-user prose must state supported behavior, not narrate source inspection",
    );
    expect(messages).toContain(
      "end-user prose must not expose process cache implementation details",
    );
    expect(messages).toContain(
      "end-user prose must state supported behavior, not narrate implementation evidence",
    );
    expect(messages).toContain(
      "end-user prose must keep verification evidence in review notes",
    );
    expect(messages).toContain(
      "end-user prose must describe supported configuration results, not refresh implementation",
    );
    expect(messages).toContain(
      "end-user prose must not expose non-actionable implementation structures",
    );
    expect(messages).toContain(
      "end-user prose must not narrate a discrepancy found during source review",
    );
    expect(messages).toContain(
      "end-user prose must not expose documentation maintenance metadata",
    );
    expect(messages).toContain(
      "end-user prose must not expose maintainer-only verification evidence",
    );
    expect(messages).toContain(
      "end-user prose must explain the supported task, not how an internal value was documented",
    );
  });

  test("ignores documentation-audit phrases in code examples", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(`Use this test fixture:

\`\`\`text
Current UI source
process-local
\`\`\``),
    );

    expect(await validateDocs({ rootDir: root })).toEqual([]);
  });

  test("accepts current source as an Environment input", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page("A redeploy reuses the current source and configuration."),
    );

    expect(await validateDocs({ rootDir: root })).toEqual([]);
  });

  test("requires UTF-8 Markdown delivery and a fail-closed missing route", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "default.conf",
      `server {
  location = /docs/cm { return 404; }
  location = /docs/cm.md { return 404; }
  location ^~ /docs/cm/ { return 404; }
  location ~ \\.md$ {
    default_type text/markdown;
    try_files $uri $uri.html /index.html;
  }
  location / {
    try_files $uri.html $uri $uri/ /index.html;
  }
  error_page 404 /404.html;
}
`,
    );

    expect(
      (await validateRawMarkdownDelivery({ rootDir: root })).map(
        (issue) => issue.message,
      ),
    ).toEqual([
      "raw Markdown must clear inherited MIME mappings before setting its UTF-8 media type",
      'raw Markdown must use Content-Type "text/markdown; charset=utf-8"',
      "raw Markdown must return 404 for a missing file instead of the HTML fallback",
    ]);
  });

  test("requires explicit 404 responses for the retired /docs/cm routes", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "default.conf",
      `server {
  location ~ \\.md$ {
    types {}
    default_type "text/markdown; charset=utf-8";
    try_files $uri =404;
  }
  location / {
    try_files $uri.html $uri $uri/ /index.html;
  }
  error_page 404 /404.html;
}
`,
    );

    expect(
      (await validateRawMarkdownDelivery({ rootDir: root })).map(
        (issue) => issue.message,
      ),
    ).toEqual(["retired /docs/cm routes must return 404"]);
  });

  test("requires the exported 404 page for missing routes", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "default.conf",
      `server {
  location = /docs/cm { return 404; }
  location = /docs/cm.md { return 404; }
  location ^~ /docs/cm/ { return 404; }
  location ~ \\.md$ {
    types {}
    default_type "text/markdown; charset=utf-8";
    try_files $uri =404;
  }
  location / {
    try_files $uri.html $uri $uri/ /index.html;
  }
  error_page 404 /index.html;
}
`,
    );

    expect(
      (await validateRawMarkdownDelivery({ rootDir: root })).map(
        (issue) => issue.message,
      ),
    ).toEqual(["404 responses must use the exported 404 page"]);
  });

  test("prefers an exported HTML page over a same-name asset directory", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "default.conf",
      `server {
  location = /docs/cm { return 404; }
  location = /docs/cm.md { return 404; }
  location ^~ /docs/cm/ { return 404; }
  location ~ \\.md$ {
    types {}
    default_type "text/markdown; charset=utf-8";
    try_files $uri =404;
  }
  location / {
    try_files $uri $uri.html /index.html;
  }
  error_page 404 /404.html;
}
`,
    );

    expect(
      (await validateRawMarkdownDelivery({ rootDir: root })).map(
        (issue) => issue.message,
      ),
    ).toEqual([
      "HTML routes must prefer the exported .html file before a same-name asset directory",
    ]);
  });
});

describe("screenshot validation", () => {
  const asset = "/docs/guide/control.png";

  test("accepts a cataloged image with matching intrinsic dimensions", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(
        `<Image src="${asset}" alt="The control in the guide" width={8} height={5} ratio={8 / 5} />`,
      ),
    );
    await write(root, `public${asset}`, png(8, 5));
    await write(root, catalogPath, catalog(asset));

    expect(await validateScreenshots({ rootDir: root })).toEqual([]);
  });

  test("reports dimension drift and unresolved catalog review", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(
        `<Image src="${asset}" alt="The control in the guide" width={9} height={5} ratio={9 / 5} />`,
      ),
    );
    await write(root, `public${asset}`, png(8, 5));
    await write(root, catalogPath, catalog(asset, "replace"));

    const messages = (await validateScreenshots({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(messages).toContain(
      `${asset} is marked replace and must be remediated`,
    );
    expect(messages).toContain(`${asset} declares 9x5 but is 8x5`);
  });

  test("reports referenced screenshots missing from the catalog", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(
        `<Image src="${asset}" alt="The control in the guide" width={8} height={5} ratio={8 / 5} />`,
      ),
    );
    await write(root, `public${asset}`, png(8, 5));
    await write(
      root,
      catalogPath,
      "| Asset | Docs page | Review |\n| --- | --- | --- |\n",
    );

    const messages = (await validateScreenshots({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(messages).toContain(
      `${asset} is missing from the screenshot catalog`,
    );
  });

  test("reports detectable local markers in tracked screenshot records", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(
        `<Image src="${asset}" alt="The control in the guide" width={8} height={5} ratio={8 / 5} />`,
      ),
    );
    await write(root, `public${asset}`, png(8, 5));
    await write(
      root,
      catalogPath,
      catalog(asset).replace(
        "Neutral fixture",
        "Fixture at http://localhost:3333",
      ),
    );

    const messages = (await validateScreenshots({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(messages).toContain(
      "screenshot catalog tracked guidance contains a fixed local development URL",
    );
  });

  test("does not accept unresolved provenance or cleanup for a kept screenshot", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(
        `<Image src="${asset}" alt="The control in the guide" width={8} height={5} ratio={8 / 5} />`,
      ),
    );
    await write(root, `public${asset}`, png(8, 5));
    await write(
      root,
      catalogPath,
      catalog(asset).replace(
        "Neutral fixture",
        "Authorized fixture; cleanup pending",
      ),
    );

    const messages = (await validateScreenshots({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(messages).toContain(
      `${asset} is marked keep but has unresolved catalog field(s): fixture and cleanup`,
    );
  });

  test("reports a catalog page that does not own the image reference", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guide.mdx",
      page(
        `<Image src="${asset}" alt="The control in the guide" width={8} height={5} ratio={8 / 5} />`,
      ),
    );
    await write(root, `public${asset}`, png(8, 5));
    await write(
      root,
      catalogPath,
      catalog(asset).replace(
        " | `/docs/guide` | Find",
        " | `/docs/other` | Find",
      ),
    );

    const messages = (await validateScreenshots({ rootDir: root })).map(
      (issue) => issue.message,
    );
    expect(messages).toContain(
      `${asset} catalog docs page /docs/other does not match reference route(s): /docs/guide`,
    );
  });
});
