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
  loadDocumentationMetadata,
  resolvePageMetadata,
  type DocumentationMetadata,
} from "../../scripts/docsMetadata";

const temporaryRoots = new Set<string>();

function registry(supportStatuses: string[] = []): DocumentationMetadata {
  return {
    audiences: new Set(["application-developer", "platform-operator"]),
    baselines: new Map([
      [
        "source-a",
        {
          verifiedOn: "2026-07-01",
          sources: {
            lifecycle: "9956d3e70a89c81a23c6502d03e237750c3886a4",
          },
        },
      ],
    ]),
    maintenance: {
      owner: "Lifecycle documentation maintainers",
      reviewTrigger: "owning-contract-change",
    },
    supportStatuses: new Set(supportStatuses),
  };
}

function page(overrides: Record<string, unknown> = {}) {
  return {
    audience: ["application-developer"],
    lastVerified: "2026-07-24",
    verificationBaseline: "source-a",
    ...overrides,
  };
}

afterEach(async () => {
  await Promise.all(
    [...temporaryRoots].map((root) =>
      fs.promises.rm(root, { force: true, recursive: true }),
    ),
  );
  temporaryRoots.clear();
});

describe("page documentation metadata", () => {
  test("accepts later reverification and an omitted support status", () => {
    const result = resolvePageMetadata(page(), registry(), "2026-07-24");
    expect(result.issues).toEqual([]);
    expect(result.metadata?.supportStatus).toBeNull();
  });

  test("accepts only registered support status values", () => {
    expect(
      resolvePageMetadata(
        page({ supportStatus: "labs" }),
        registry(["labs"]),
        "2026-07-24",
      ).issues,
    ).toEqual([]);
    expect(
      resolvePageMetadata(
        page({ supportStatus: "stable" }),
        registry(["labs"]),
        "2026-07-24",
      ).issues,
    ).toContain(
      "supportStatus must use an established value from documentation-metadata.json",
    );
  });

  test("rejects unknown or duplicate audiences", () => {
    expect(
      resolvePageMetadata(
        page({ audience: ["unknown"] }),
        registry(),
        "2026-07-24",
      ).issues[0],
    ).toContain("audience");
    expect(
      resolvePageMetadata(
        page({
          audience: ["application-developer", "application-developer"],
        }),
        registry(),
        "2026-07-24",
      ).issues[0],
    ).toContain("unique");
  });

  test("rejects malformed, future, and pre-baseline dates", () => {
    expect(
      resolvePageMetadata(
        page({ lastVerified: "24 July 2026" }),
        registry(),
        "2026-07-24",
      ).issues,
    ).toContain("frontmatter requires lastVerified in YYYY-MM-DD format");
    expect(
      resolvePageMetadata(
        page({ lastVerified: "2026-07-25" }),
        registry(),
        "2026-07-24",
      ).issues,
    ).toContain("lastVerified cannot be in the future");
    expect(
      resolvePageMetadata(
        page({ lastVerified: "2026-06-30" }),
        registry(),
        "2026-07-24",
      ).issues[0],
    ).toContain("cannot predate verification baseline");
  });

  test("rejects an unknown verification baseline", () => {
    expect(
      resolvePageMetadata(
        page({ verificationBaseline: "missing" }),
        registry(),
        "2026-07-24",
      ).issues,
    ).toContain(
      "frontmatter requires a verificationBaseline defined in documentation-metadata.json",
    );
  });
});

describe("documentation metadata registry", () => {
  test("rejects malformed source revisions", async () => {
    const root = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), "lifecycle-docs-metadata-"),
    );
    temporaryRoots.add(root);
    await fs.promises.writeFile(
      path.join(root, "documentation-metadata.json"),
      JSON.stringify({
        schemaVersion: 1,
        maintenance: {
          owner: "Lifecycle documentation maintainers",
          reviewTrigger: "owning-contract-change",
        },
        audiences: ["application-developer"],
        supportStatuses: [],
        verificationBaselines: {
          source: {
            verifiedOn: "2026-07-24",
            sources: { lifecycle: "short-sha" },
          },
        },
      }),
    );

    await expect(loadDocumentationMetadata(root)).rejects.toThrow(
      "one or more named full commit revisions",
    );
  });
});
