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
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { Command } from "commander";

const program = new Command();

export async function generateMetaFiles(directoryPath, isDebugging) {
  if (isDebugging) console.log(`Processing directory: ${directoryPath}`);
  const files = readdirSync(directoryPath);

  const metaFilePath = join(directoryPath, "_meta.ts");

  let existingMetaData = {};
  if (existsSync(metaFilePath)) {
    const metaModule = await import(metaFilePath);
    existingMetaData = metaModule.default;
  }
  const metaData = {};

  await Promise.all(
    files.map(async (file) => {
      const filePath = join(directoryPath, file);
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        if (isDebugging) console.log(`Processing directory: ${file}`);
        await generateMetaFiles(filePath, isDebugging);
      } else if (file.endsWith(".mdx")) {
        const fileContent = readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);
        const name = file.replace(".mdx", "");
        const currentMetaData = existingMetaData?.[`${name}`] || {};
        /**
         * @note navtext is useful for the sidebar if the title is too long
         * if `navtext` is not present, title is used for the sidebar text
         */
        const title = data?.navtext || data.title;
        metaData[`${name}`] = { ...currentMetaData, title };
      }
    }),
  );

  const mergedMetaData = { ...existingMetaData, ...metaData };
  if (isDebugging)
    console.log("merged data", { existingMetaData, metaData, mergedMetaData });
  const metaContent = `export default ${JSON.stringify(mergedMetaData, null, 2)};`;
  writeFileSync(metaFilePath, metaContent);
}

program
  .option("-d, --dir <directory>", "directory of pages", "./src/pages")
  .option("--debug", "enable debug logs", false);

program.parse(process.argv);

const { dir, debug } = program.opts();

(async () => {
  await generateMetaFiles(dir, debug);
  console.log("Meta files generated successfully!");
})();
