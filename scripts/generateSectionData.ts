/**
 * Copyright 2025 GoodRx, Inc.
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

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";
import { Command } from "commander";

const program = new Command();

async function generateDataFiles(
  directoryPath: string,
  outDir: string,
  isDebugging: boolean,
): Promise<void> {
  if (isDebugging) console.log(`Processing directory: ${directoryPath}`);
  const files = readdirSync(directoryPath);

  const data: { name: string; title: string; description: string }[] = [];

  await Promise.all(
    files.map(async (file) => {
      const filePath = join(directoryPath, file);
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        if (isDebugging) console.log(`Processing directory: ${filePath}`);
        await generateDataFiles(filePath, outDir, isDebugging);
      } else if (file.endsWith(".mdx")) {
        if (isDebugging) console.log(`Processing file: ${filePath}`);
        const fileContent = readFileSync(filePath, "utf8");
        const { data: frontmatter } = matter(fileContent);
        data.push({
          name: file.replace(".mdx", ""),
          title: frontmatter.title,
          description: frontmatter.description,
        });
      }
    }),
  );

  if (data.length > 0) {
    const relativeDirPath = relative(program.opts().dir, directoryPath);
    const outputDirPath = join(outDir, relativeDirPath);
    if (!existsSync(outputDirPath)) {
      mkdirSync(outputDirPath, { recursive: true });
    }

    const dataFilePath = join(outputDirPath, `section.data.ts`);

    const dataContent = `export default ${JSON.stringify(data, null, 2)};`;
    writeFileSync(dataFilePath, dataContent);

    if (isDebugging) console.log(`Generated data file: ${dataFilePath}`);
  }
}

program
  .option("-d, --dir <directory>", "directory of pages", "./src/pages")
  .option("-o, --out <directory>", "output directory", "./src/lib/data")
  .option("--debug", "enable debug logs", false);

program.parse(process.argv);

const { dir, debug, out } = program.opts();

(async () => {
  await generateDataFiles(dir, out, debug);
  console.log("Meta files generated successfully!");
})();
