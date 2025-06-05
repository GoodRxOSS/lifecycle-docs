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

// scripts/generate-tag-pages.js
import { writeFile, readFile, readdir, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

import { Command } from "commander";

const program = new Command();

async function processDirectory(directory, tags, data) {
  const fileNames = await readdir(directory);

  for (const fileName of fileNames) {
    const filePath = join(directory, fileName);
    const foundState = await stat(filePath);

    if (foundState.isDirectory()) {
      await processDirectory(filePath, tags, data);
    } else if (foundState.isFile() && fileName.endsWith(".mdx")) {
      const specificDir = "pages";
      const startIndex = filePath.indexOf(specificDir) + specificDir.length;
      const updatedPath = filePath.substring(startIndex);
      const fileContents = await readFile(filePath, "utf8");
      const matterResult = matter(fileContents);
      matterResult.data.tags?.forEach((tag) => tags.add(tag));

      const lowerCaseTags =
        matterResult.data.tags?.map((tag) => tag.toLowerCase()) || [];

      data.push({
        name: fileName.replace(".mdx", ""),
        title: matterResult.data.title,
        description: matterResult.data.description,
        tags: lowerCaseTags,
        path: updatedPath.replace(".mdx", ""),
      });
    }
  }
}

export async function generateTagPages({
  dir = "src/pages",
  out = "src/pages/tag",
  template = "scripts/tagtemplatepage.mdx",
  dataDir = "src/lib/data",
  isDebugging = false,
} = {}) {
  const contentDirectory = join(process.cwd(), dir);
  const outputDirectory = join(process.cwd(), out);
  const templatePath = join(process.cwd(), template);
  const dataDirectory = join(process.cwd(), dataDir);
  const templateContent = await readFile(templatePath, "utf8");
  const fileNames = await readdir(contentDirectory);

  if (isDebugging) console.log({ fileNames });
  const tags = new Set();
  const data = [] as unknown as {
    name: string;
    title: string;
    description: string;
    tags: string[];
  }[];

  await processDirectory(contentDirectory, tags, data);

  if (isDebugging) console.log({ tags, data });

  for (const tag of tags) {
    const lowerCaseTag = (tag as string).toLowerCase();
    const tagPageContent = templateContent.replace(
      /\[tag\]/g,
      lowerCaseTag as string,
    );
    await mkdir(outputDirectory, { recursive: true });
    const tagPagePath = join(outputDirectory, `${lowerCaseTag}.mdx`);
    await writeFile(tagPagePath, tagPageContent, "utf8");

    const tagDataDir = join(dataDirectory, lowerCaseTag as string);
    await mkdir(tagDataDir, { recursive: true });

    const tagDataPath = join(tagDataDir, "tag.data.ts");
    const tagData = data.filter((item) =>
      item.tags?.includes(lowerCaseTag as string),
    );
    const dataContent = `export default ${JSON.stringify(tagData, null, 2)};`;
    await writeFile(tagDataPath, dataContent, "utf8");
    if (isDebugging)
      console.log(
        `wrote "${lowerCaseTag}.mdx" and "/src/lib/data/${lowerCaseTag}" with:`,
        {
          tagData,
        },
      );
  }
}

program
  .option("-d, --dir <directory>", "directory of pages", "./src/pages")
  .option("-o, --out <directory>", "output directory", "./src/pages/tags")
  .option(
    "-t, --template <path>",
    "path to template file",
    "scripts/tagtemplatepage.mdx",
  )
  .option(
    "--dataDir <directory>",
    "output directory for data files",
    "./src/lib/data",
  )
  .option("--debug", "enable debug logs", false);

program.parse(process.argv);

const { dir, out, debug, template, dataDir } = program.opts();

(async () => {
  await generateTagPages({
    dir: dir,
    out: out,
    template: template,
    isDebugging: debug,
    dataDir: dataDir,
  });
  console.log("Meta files generated successfully!");
})();
