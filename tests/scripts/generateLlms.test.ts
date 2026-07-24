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
import { fileURLToPath } from "node:url";
import {
  collectPublicDocsPages,
  generateLlms,
} from "../../scripts/generateLlms";

const temporaryRoots = new Set<string>();
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

async function temporaryRoot(): Promise<string> {
  const root = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "lifecycle-docs-llms-"),
  );
  temporaryRoots.add(root);
  await fs.promises.mkdir(path.join(root, "src/pages/docs"), {
    recursive: true,
  });
  await write(root, "public/CNAME", "docs.example.test\n");
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
      supportStatuses: [],
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

function page(title: string, description?: string): string {
  return `---
title: ${title}
${description === undefined ? "" : `description: ${description}\n`}audience:
  - application-developer
lastVerified: "2026-07-24"
verificationBaseline: test
---

# ${title}
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

describe("llms.txt generation", () => {
  test("follows curated navigation order and excludes hidden pages", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/_meta.ts",
      `export default {
        index: { title: "Home", display: "hidden" },
        overview: { title: "Lifecycle overview" },
        guides: { title: "Guides" },
        separator: { type: "separator" },
        upstream: { title: "Upstream", href: "https://example.test" }
      };`,
    );
    await write(
      root,
      "src/pages/docs/guides/_meta.ts",
      `export default {
        second: { title: "Second guide" },
        first: { title: "First guide" },
        private: { title: "Private guide", display: "hidden" }
      };`,
    );
    await write(root, "src/pages/docs/index.mdx", page("Home", "Landing page"));
    await write(
      root,
      "src/pages/docs/overview.mdx",
      page("Overview", "Understand Lifecycle"),
    );
    await write(
      root,
      "src/pages/docs/guides/first.mdx",
      page("First", "First description"),
    );
    await write(
      root,
      "src/pages/docs/guides/second.mdx",
      page("Second", "Second description"),
    );
    await write(
      root,
      "src/pages/docs/guides/private.mdx",
      page("Private", "Hidden description"),
    );

    const pages = await collectPublicDocsPages({ rootDir: root });
    expect(pages.map((item) => item.route)).toEqual([
      "/docs/overview",
      "/docs/guides/second",
      "/docs/guides/first",
    ]);
    expect(pages.map((item) => item.sectionTitle)).toEqual([
      "Start here",
      "Guides",
      "Guides",
    ]);

    const output = await generateLlms({
      rootDir: root,
      publicOrigin: "https://docs.example.test/",
    });
    expect(output).toContain(
      "- [Lifecycle overview](https://docs.example.test/docs/overview.md): Understand Lifecycle",
    );
    expect(output.indexOf("Second guide")).toBeLessThan(
      output.indexOf("First guide"),
    );
    expect(output).not.toContain("Private guide");
    expect(output).not.toContain("Upstream");
  });

  test("fails when a public page lacks required frontmatter", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/_meta.ts",
      `export default { guide: { title: "Guide" } };`,
    );
    await write(root, "src/pages/docs/guide.mdx", page("Guide"));

    await expect(collectPublicDocsPages({ rootDir: root })).rejects.toThrow(
      "requires non-empty description frontmatter",
    );
  });

  test("fails when navigation omits a local page", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/_meta.ts",
      `export default { guide: { title: "Guide" } };`,
    );
    await write(root, "src/pages/docs/guide.mdx", page("Guide", "A guide"));
    await write(
      root,
      "src/pages/docs/orphan.mdx",
      page("Orphan", "Not in navigation"),
    );

    await expect(collectPublicDocsPages({ rootDir: root })).rejects.toThrow(
      "omits public target(s): orphan",
    );
  });

  test("fails when navigation points to a missing target", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/_meta.ts",
      `export default { missing: { title: "Missing" } };`,
    );

    await expect(collectPublicDocsPages({ rootDir: root })).rejects.toThrow(
      'declares missing target "missing"',
    );
  });

  test("rejects the retired /docs/cm navigation target", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/_meta.ts",
      `export default { cm: { title: "Retired docs" } };`,
    );
    await write(
      root,
      "src/pages/docs/cm/_meta.ts",
      `export default { guide: { title: "Guide" } };`,
    );
    await write(
      root,
      "src/pages/docs/cm/guide.mdx",
      page("Guide", "Retired guide"),
    );

    await expect(collectPublicDocsPages({ rootDir: root })).rejects.toThrow(
      "declares the retired /docs/cm target",
    );
  });

  test("fails when a public documentation directory lacks navigation metadata", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/_meta.ts",
      `export default { guides: { title: "Guides" } };`,
    );
    await write(
      root,
      "src/pages/docs/guides/guide.mdx",
      page("Guide", "A nested guide"),
    );

    await expect(collectPublicDocsPages({ rootDir: root })).rejects.toThrow(
      "src/pages/docs/guides/_meta.ts is required",
    );
  });

  test("covers the repository's key end-user journeys", async () => {
    const pages = await collectPublicDocsPages({ rootDir: repositoryRoot });
    const routes = pages.map((item) => item.route);
    const requiredRoutes = [
      "/docs/what-is-lifecycle",
      "/docs/setup/prerequisites",
      "/docs/getting-started/onboard-repository",
      "/docs/getting-started/create-environment",
      "/docs/features/lifecycle-ui",
      "/docs/features/cli",
      "/docs/features/cli-telemetry",
      "/docs/features/api-environments",
      "/docs/features/sites",
      "/docs/features/agent-sessions",
      "/docs/features/agent-administration",
      "/docs/features/workspace-backends",
      "/docs/features/ai-agent-configuration",
      "/docs/features/mcp-server",
      "/docs/api/overview",
      "/docs/api-authentication/overview",
      "/docs/api-authentication/api-keys",
      "/docs/operations/architecture",
      "/docs/operations/configuration",
      "/docs/operations/day-two",
      "/docs/operations/monitoring",
      "/docs/operations/security",
      "/docs/reference/statuses",
      "/docs/releases",
      "/docs/releases/compatibility",
      "/docs/schema/overview",
      "/docs/schema/configuration",
      "/docs/schema/environment",
      "/docs/schema/external-http",
      "/docs/setup/install-lifecycle",
      "/docs/troubleshooting/access-and-api",
      "/docs/troubleshooting/build-issues",
      "/docs/troubleshooting/deploy-issues",
      "/docs/troubleshooting/github-app-webhooks",
      "/docs/troubleshooting/stuck-environment",
    ];

    expect(new Set(routes).size).toBe(routes.length);
    expect(routes.length).toBeGreaterThanOrEqual(65);
    for (const route of requiredRoutes) expect(routes).toContain(route);
  });
});
