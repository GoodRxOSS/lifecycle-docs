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

import { describe, expect, test } from "bun:test";
import { remarkCodeHike } from "codehike/mdx";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import {
  codeHikeSource,
  remarkCodeHikeSearch,
} from "../../src/lib/remark-codehike-search.mjs";

const codeHikeConfig = {
  components: { code: "Code" },
  syntaxHighlighting: { theme: "github-dark" },
};

type SearchNode = {
  type?: unknown;
  name?: unknown;
  children?: unknown;
};

function findCode(node: unknown): SearchNode | null {
  if (!node || typeof node !== "object") return null;
  const candidate = node as SearchNode;
  if (candidate.type === "mdxJsxFlowElement" && candidate.name === "Code") {
    return candidate;
  }

  const children = Array.isArray(candidate.children) ? candidate.children : [];
  for (const child of children) {
    const result = findCode(child);
    if (result) return result;
  }
  return null;
}

describe("CodeHike search indexing", () => {
  test("restores fenced-code text after CodeHike transforms the node", async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkCodeHike, codeHikeConfig)
      .use(remarkCodeHikeSearch, { componentName: "Code" });
    const tree = await processor.run(
      processor.parse("# Sites\n\n```bash\nlfc sites get a1b2c3d4e5\n```"),
    );
    const code = findCode(tree);
    if (!code) throw new Error("CodeHike did not produce the Code component");

    expect(codeHikeSource(code)).toBe("lfc sites get a1b2c3d4e5");
    expect(code.children).toEqual([
      { type: "text", value: "lfc sites get a1b2c3d4e5" },
    ]);
  });

  test("does not add search text to a different MDX component", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "mdxJsxFlowElement",
          name: "Example",
          attributes: [],
          children: [],
        },
      ],
    };

    remarkCodeHikeSearch({ componentName: "Code" })(tree);

    expect(tree.children[0].children).toEqual([]);
  });
});
