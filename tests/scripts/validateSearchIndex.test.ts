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
import { validateSearchIndexData } from "../../scripts/validateSearchIndex";

const contract = {
  route: "/docs/features/sites",
  text: "a1b2c3d4e5",
  source: "src/pages/docs/features/sites.mdx",
};

describe("search index validation", () => {
  test("accepts fenced-code text in the configured page", () => {
    const issues = validateSearchIndexData(
      {
        "/docs/features/sites": {
          title: "Sites",
          data: { "upload#Upload": "lfc sites get a1b2c3d4e5" },
        },
      },
      [contract],
    );

    expect(issues).toEqual([]);
  });

  test("reports fenced-code text missing from the configured page", () => {
    const issues = validateSearchIndexData(
      {
        "/docs/features/sites": {
          title: "Sites",
          data: { "upload#Upload": "Upload a site." },
        },
      },
      [contract],
    );

    expect(issues).toEqual([
      '/docs/features/sites does not index fenced-code text "a1b2c3d4e5" (src/pages/docs/features/sites.mdx)',
    ]);
  });
});
