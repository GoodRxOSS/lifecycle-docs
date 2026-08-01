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
  ASD_STE100_RULE_IDS,
  ste100WordCount,
  validateSte100,
  validateStyleBaseline,
  writeStyleBaseline,
} from "../../scripts/validateSte100";

const roots = new Set<string>();

async function root(): Promise<string> {
  const value = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "lifecycle-ste100-"),
  );
  roots.add(value);
  return value;
}

async function write(
  rootDir: string,
  relative: string,
  source: string,
): Promise<void> {
  const file = path.join(rootDir, relative);
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, source);
}

function page(profile: string, content: string): string {
  return `---
title: Deploy an Environment
description: Deploy an Environment and verify its status.
contentProfile: ${profile}
---

${content}
`;
}

async function writeStyleSurfaceFixture(rootDir: string): Promise<void> {
  await write(
    rootDir,
    "src/pages/docs/_meta.ts",
    `export default {
      index: { title: "Start", display: "hidden" }
    };`,
  );
  await write(
    rootDir,
    "src/pages/_meta.ts",
    `export default {
      "*": { type: "page" },
      index: { title: "Lifecycle home", display: "hidden" },
      docs: { title: "Docs", type: "page" }
    };`,
  );
  await write(
    rootDir,
    "src/theme.config.tsx",
    `export default { search: { placeholder: "Search documentation" } };`,
  );
  await write(
    rootDir,
    "src/components/site-footer/index.tsx",
    `export function SiteFooter() {
      return <footer>Lifecycle documentation</footer>;
    }`,
  );
}

afterEach(async () => {
  await Promise.all(
    [...roots].map((value) =>
      fs.promises.rm(value, { force: true, recursive: true }),
    ),
  );
  roots.clear();
});

describe("STE100 validation", () => {
  test("tracks all 53 Issue 9 writing-rule identifiers", async () => {
    expect(ASD_STE100_RULE_IDS).toHaveLength(53);
    expect(new Set(ASD_STE100_RULE_IDS).size).toBe(53);
    const matrix = await fs.promises.readFile(
      path.join(
        process.cwd(),
        ".agents/skills/update-lifecycle-docs/references/ste100-review.md",
      ),
      "utf8",
    );
    const rows = [...matrix.matchAll(/^\| (\d+\.\d+)\s+\|/gm)].map(
      (match) => match[1],
    );
    expect(rows).toEqual(ASD_STE100_RULE_IDS);
  });

  test("uses Issue 9 word-count treatment for protected text", () => {
    expect(ste100WordCount('Touch the "Service Overview" arrow.')).toBe(4);
    expect(ste100WordCount("Remove the safety pin (10).")).toBe(5);
    expect(ste100WordCount("Installation of a Business Class (B/C) Seat")).toBe(
      7,
    );
    expect(ste100WordCount("The timeout is 10 minutes.")).toBe(4);
    expect(ste100WordCount("Use the source-backed setup-infra page.")).toBe(5);
  });

  test("checks every documentation page in nested directories", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/deploy.mdx",
      page(
        "asd-ste100",
        `## Deploy

1. If the build is ready, select **Deploy**.

Lifecycle shows the Environment status.`,
      ),
    );
    await write(
      rootDir,
      "src/pages/docs/guides/verify.mdx",
      page(
        "wrong-profile",
        `## Verify

Check the Environment status.`,
      ),
    );

    expect(await validateSte100({ rootDir })).toEqual([
      {
        file: "src/pages/docs/guides/verify.mdx",
        line: 1,
        message:
          "documentation frontmatter requires contentProfile: asd-ste100",
      },
    ]);
  });

  test("rejects retired page-variant frontmatter", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/deploy.mdx",
      `---
title: Deploy an Environment
description: Deploy an Environment and verify its status.
contentProfile: asd-ste100
docsVariant: legacy
canonicalRoute: /docs/deploy
---

## Deploy

Check the Environment status.
`,
    );

    expect(
      (await validateSte100({ rootDir })).map((issue) => issue.message),
    ).toEqual([
      "documentation frontmatter must not declare docsVariant or canonicalRoute",
    ]);
  });

  test("reports objective sentence, punctuation, and procedure violations", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/deploy.mdx",
      page(
        "asd-ste100",
        `## Deploy

1. Select **Deploy** and then open the logs after the Environment is ready.

This isn't valid; this descriptive sentence contains far too many separate words for the maximum sentence length that the controlled language permits in descriptive documentation text for Lifecycle users and administrators.`,
      ),
    );

    const messages = (await validateSte100({ rootDir })).map(
      (issue) => issue.message,
    );
    expect(
      messages.some((message) => message.includes("condition first")),
    ).toBe(true);
    expect(
      messages.some((message) => message.includes("one instruction")),
    ).toBe(true);
    expect(messages.some((message) => message.includes("semicolon"))).toBe(
      true,
    );
    expect(messages.some((message) => message.includes("contraction"))).toBe(
      true,
    );
    expect(messages.some((message) => message.includes("maximum is 25"))).toBe(
      true,
    );
  });

  test("rejects instructions in informational callouts", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/deploy.mdx",
      page(
        "asd-ste100",
        `## Deploy

<Callout type="info">
  Use the deployment log to find the status.
</Callout>

<Callout type="warning">
  Stop the deployment.
</Callout>`,
      ),
    );

    expect(
      (await validateSte100({ rootDir })).map((issue) => issue.message),
    ).toEqual(["STE100 note must give information, not an instruction"]);
  });

  test("checks literal image alt text and component titles", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/deploy.mdx",
      page(
        "asd-ste100",
        `## Deploy

<Image
  src="/environment.png"
  alt="This image description contains too many words because it repeats unnecessary information about the Environment page and all its visible controls for every application developer who reads it."
/>

<Cards.Card
  title="This card title also contains far too many words for a clear descriptive sentence in the canonical Lifecycle documentation site navigation and repeats details that belong on the destination page."
  href="/docs/next"
>
  Open the next guide.
</Cards.Card>`,
      ),
    );

    const issues = await validateSte100({ rootDir });
    expect(
      issues.filter((issue) => issue.message.includes("maximum is 25")),
    ).toHaveLength(2);
    expect(issues.every((issue) => issue.line > 1)).toBe(true);
  });

  test("checks navigation titles in every documentation directory", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/_meta.ts",
      `export default {
        guide: { title: "This isn't valid" }
      };`,
    );
    await write(
      rootDir,
      "src/pages/docs/guides/_meta.ts",
      `export default {
        verify: { title: "This isn't valid either" }
      };`,
    );

    expect(
      (await validateSte100({ rootDir })).map((issue) => ({
        file: issue.file,
        message: issue.message,
      })),
    ).toEqual([
      {
        file: "src/pages/docs/_meta.ts (navigation title)",
        message: "STE100 prose must not use a contraction: isn't",
      },
      {
        file: "src/pages/docs/guides/_meta.ts (navigation title)",
        message: "STE100 prose must not use a contraction: isn't",
      },
    ]);
  });

  test("tracks every reviewed page by route, profile, and content hash", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/index.mdx",
      page("asd-ste100", "## Start\n\nUse the navigation."),
    );
    await writeStyleSurfaceFixture(rootDir);

    await writeStyleBaseline({ rootDir });
    expect(await validateStyleBaseline({ rootDir })).toEqual([]);
    const baseline = JSON.parse(
      await fs.promises.readFile(
        path.join(rootDir, "documentation-style-baseline.json"),
        "utf8",
      ),
    );
    expect(baseline.schemaVersion).toBe(3);
    expect(Object.keys(baseline.pages)).toEqual(["/docs"]);
    expect(Object.keys(baseline.references).sort()).toEqual([
      "canonical",
      "canonicalRules",
    ]);

    baseline.references.extra = "legacy";
    await write(
      rootDir,
      "documentation-style-baseline.json",
      `${JSON.stringify(baseline, null, 2)}\n`,
    );
    expect(
      (await validateStyleBaseline({ rootDir })).map((issue) => issue.message),
    ).toEqual([
      "style review baseline is missing or invalid; run the reviewed baseline update workflow",
    ]);
    delete baseline.references.extra;
    await write(
      rootDir,
      "documentation-style-baseline.json",
      `${JSON.stringify(baseline, null, 2)}\n`,
    );

    await write(
      rootDir,
      "src/pages/docs/index.mdx",
      page("asd-ste100", "## Start\n\nUse the main navigation."),
    );
    expect(
      (await validateStyleBaseline({ rootDir })).map((issue) => issue.message),
    ).toContain(
      "reviewed asd-ste100 content changed; complete its language-profile review and update documentation-style-baseline.json",
    );
  });

  test("invalidates the baseline when maintained navigation copy changes", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/index.mdx",
      page("asd-ste100", "## Start\n\nUse the navigation."),
    );
    await writeStyleSurfaceFixture(rootDir);
    await writeStyleBaseline({ rootDir });

    await write(
      rootDir,
      "src/pages/_meta.ts",
      `export default {
        "*": { type: "page" },
        index: { title: "Lifecycle home", display: "hidden" },
        docs: { title: "Documentation", type: "page" }
      };`,
    );

    expect(
      (await validateStyleBaseline({ rootDir })).map((issue) => issue.message),
    ).toContain(
      "reviewed asd-ste100 surface changed; complete its language-profile review and update documentation-style-baseline.json",
    );
  });

  test("invalidates the baseline when visible theme copy changes", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/index.mdx",
      page("asd-ste100", "## Start\n\nUse the navigation."),
    );
    await writeStyleSurfaceFixture(rootDir);
    await writeStyleBaseline({ rootDir });

    await write(
      rootDir,
      "src/theme.config.tsx",
      `export default { search: { placeholder: "Find documentation" } };`,
    );

    expect(
      (await validateStyleBaseline({ rootDir })).map((issue) => issue.message),
    ).toContain(
      "reviewed asd-ste100 surface changed; complete its language-profile review and update documentation-style-baseline.json",
    );
  });

  test("invalidates the baseline when visible footer copy changes", async () => {
    const rootDir = await root();
    await write(
      rootDir,
      "src/pages/docs/index.mdx",
      page("asd-ste100", "## Start\n\nUse the navigation."),
    );
    await writeStyleSurfaceFixture(rootDir);
    await writeStyleBaseline({ rootDir });

    await write(
      rootDir,
      "src/components/site-footer/index.tsx",
      `export function SiteFooter() {
        return <footer>Lifecycle user documentation</footer>;
      }`,
    );

    expect(
      (await validateStyleBaseline({ rootDir })).map((issue) => issue.message),
    ).toContain(
      "reviewed asd-ste100 surface changed; complete its language-profile review and update documentation-style-baseline.json",
    );
  });
});
