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

type SearchPage = {
  title: string;
  data: Record<string, string>;
};

type SearchIndex = Record<string, SearchPage>;

export type SearchIndexContract = {
  route: string;
  text: string;
  source: string;
};

export const SEARCH_INDEX_CONTRACTS: SearchIndexContract[] = [
  {
    route: "/docs/features/sites",
    text: "a1b2c3d4e5",
    source: "src/pages/docs/features/sites.mdx",
  },
];

export function validateSearchIndexData(
  index: SearchIndex,
  contracts: SearchIndexContract[] = SEARCH_INDEX_CONTRACTS,
): string[] {
  const issues: string[] = [];

  for (const contract of contracts) {
    const page = index[contract.route];
    if (!page) {
      issues.push(
        `${contract.route} is missing from the search index (${contract.source})`,
      );
      continue;
    }

    const searchableText = [page.title, ...Object.values(page.data)].join("\n");
    if (!searchableText.includes(contract.text)) {
      issues.push(
        `${contract.route} does not index fenced-code text ${JSON.stringify(contract.text)} (${contract.source})`,
      );
    }
  }

  return issues;
}

export async function validateSearchIndex(
  rootDir = process.cwd(),
): Promise<string[]> {
  const indexPath = path.join(
    rootDir,
    "out/_next/static/chunks/nextra-data-en-US.json",
  );
  const contents = await fs.promises.readFile(indexPath, "utf8");
  const index = JSON.parse(contents) as SearchIndex;
  return validateSearchIndexData(index);
}

async function runCli() {
  const issues = await validateSearchIndex();
  if (issues.length > 0) {
    for (const issue of issues) console.error(issue);
    process.exit(1);
  }

  console.log("Search index validation passed.");
}

if (import.meta.main) {
  await runCli();
}
