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

export const findMdxFiles = (dir, ignorePatterns) => {
  const globPattern = `${dir}/**/*.mdx`;
  return sync(globPattern, { ignore: ignorePatterns });
};

export const extractBodyText = (content) => {
  content = content.replace(/import\s.+from\s.+;\n?/g, "");
  content = content.replace(/export\s.+;/g, "");

  content = content.replace(/<[^>]+>/g, "");
  return content.trim();
};

export const extractFileContent = (filePath, baseDir) => {
  const content = readFileSync(filePath, "utf8");
  const {
    data: { title = null, description = null, date = null },
    content: rawBody,
  } = matter(content);

  const body = extractBodyText(rawBody);

  const path = relative(baseDir, filePath).replace(/\.mdx$/, "");

  return {
    title,
    description,
    date,
    path,
    body,
  };
};

export const ensureDirectoryExists = (dir) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
};

export const organizeFileContent = (
  inputDir,
  outputFilePath,
  ignore,
  debug,
) => {
  if (debug) console.log(`Scanning directory: ${inputDir}`);
  const mdxFiles = findMdxFiles(inputDir, ignore).filter(
    (filePath) => !filePath.includes("/tags/"),
  );

  if (debug)
    console.log(
      `Found ${mdxFiles.length} MDX files (after applying ignore and exclude patterns)`,
    );

  const fileData = mdxFiles.map((file) => extractFileContent(file, inputDir));

  if (debug) console.log(`Processed content for ${fileData.length} files`);

  const outputDir = dirname(outputFilePath);
  ensureDirectoryExists(outputDir);
  const content = JSON.stringify(fileData, null, 2);
  const outputData = `export const blogContent = ${content};\n`;
  writeFileSync(outputFilePath, outputData, "utf8");
  const outJSON = outputFilePath.replace(".ts", ".json");
  console.log(`File content saved to ${outJSON}`);
  writeFileSync(outJSON, content, "utf8");
  if (debug) console.log(`File content saved to ${outputFilePath}`);
};

export const actionGenerateContent = (options) => {
  const { input, output, ignore, debug } = options;

  if (!input || !output) {
    console.error("Error: Both --input and --output options are required.");
    process.exit(1);
  }

  try {
    organizeFileContent(input, output, ignore, debug);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

const program = new Command();

program
  .name("extract-file-content")
  .description("Extract body text from MDX files and save it as a JSON file.")
  .option(
    "-i, --input <directory>",
    "Input directory to scan for MDX files",
    "src/pages",
  )
  .option(
    "-o, --output <file>",
    "Output file path (JSON)",
    "src/lib/static/blogcontent/blogcontent.ts",
  )
  .option(
    "--ignore <patterns>",
    "Comma-separated list of glob patterns to ignore",
    (val) => val.split(","),
    ["**/index.mdx", "src/pages/tags/**"],
  )
  .option("-d, --debug", "Enable debug logging", false)
  .action(actionGenerateContent);

program.parse(process.argv);
