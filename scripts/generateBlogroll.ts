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

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import matter from "gray-matter";
import { sync } from "fast-glob";
import { Command } from "commander";

export const findMdxFiles = (
  dir: string,
  ignorePatterns: string[],
): string[] => {
  const globPattern = `${dir}/**/*.mdx`;
  return sync(globPattern, { ignore: ignorePatterns });
};

export const extractFrontmatter = (
  filePath: string,
  baseDir: string,
): Record<string, string | null> => {
  const content = readFileSync(filePath, "utf8");
  const {
    data: { title = null, description = null, date = null },
  } = matter(content);

  const path = relative(baseDir, filePath).replace(/\.mdx$/, "");

  return {
    title,
    description,
    date,
    path,
  };
};

export const ensureDirectoryExists = (dir: string) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

export const organizeFrontmatter = (
  inputDir: string,
  outputFilePath: string,
  ignore: string[],
  debug: boolean,
) => {
  if (debug) console.log(`Scanning directory: ${inputDir}`);
  const mdxFiles = findMdxFiles(inputDir, ignore).filter(
    (filePath) => !filePath.includes("/tags/"),
  );

  if (debug)
    console.log(
      `Found ${mdxFiles.length} MDX files (after applying ignore and exclude patterns)`,
    );

  const frontmatterData = mdxFiles.map((file) =>
    extractFrontmatter(file, inputDir),
  );

  if (debug)
    console.log(`Extracted frontmatter for ${frontmatterData.length} files`);

  const outputDir = dirname(outputFilePath);
  ensureDirectoryExists(outputDir);

  const tsObject = `export const blogRoll = ${JSON.stringify(frontmatterData, null, 2)};\n`;

  writeFileSync(outputFilePath, tsObject, "utf8");
  if (debug) console.log(`Frontmatter data saved to ${outputFilePath}`);
};

export const actionGenerateBlogroll = (options) => {
  const { input, output, ignore, debug } = options;

  if (!input || !output) {
    console.error("Error: Both --input and --output options are required.");
    process.exit(1);
  }

  try {
    organizeFrontmatter(input, output, ignore, debug);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

const program = new Command();

program
  .name("extract-frontmatter")
  .description("Extract frontmatter from MDX files and save it to a JSON file.")
  .option(
    "-i, --input <directory>",
    "Input directory to scan for MDX files",
    "src/pages",
  )
  .option(
    "-o, --output <file>",
    "Output file path (JSON)",
    "src/lib/data/blogroll/blogroll.ts",
  )
  .option(
    "--ignore <patterns>",
    "Comma-separated list of glob patterns to ignore",
    (val) => val.split(","),
    ["**/index.mdx"],
  )
  .option("-d, --debug", "Enable debug logging", false)
  .action(actionGenerateBlogroll);

program.parse(process.argv);
