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

import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { Octokit } from "@octokit/core";
import { Command } from "commander";
import yaml from "js-yaml";
import dotenv from "dotenv";

dotenv.config();

const auth = process.env.SYNC_LIFECYCLE_DOCS;

if (!auth) {
  console.error("SYNC_LIFECYCLE_DOCS not found in .env file");
  process.exit(1);
}

const octokit = new Octokit({ auth });

export const fetchFileFromRepo = async ({
  owner = "goodrxoss",
  repo = "lifecycle",
  path = "docs/schema/yaml/2.3.0.yaml",
  branch = "main",
  debug = false,
}: FetchFileOptions): Promise<string> => {
  try {
    const sanitizedPath = path.startsWith("/") ? path.slice(1) : path;

    if (debug) {
      console.log(`Fetching file: ${owner}/${repo}/${sanitizedPath}@${branch}`);
    }

    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path: sanitizedPath,
        ref: branch,
      },
    );

    if (!("content" in response.data)) {
      throw new Error("File content not found in response");
    }

    const content = Buffer.from(response.data.content, "base64").toString(
      "utf-8",
    );
    if (debug) console.log("File fetched successfully");
    return content;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
};

export const convertYamlToJson = <T = Record<string, unknown>>(
  yamlContent: string,
): T => {
  try {
    return yaml.load(yamlContent) as T;
  } catch (error) {
    console.error("Failed to parse YAML:", error);
    throw error;
  }
};

export const syncYamlFile = async (options: SyncOptions) => {
  const {
    owner = "goodrxoss",
    repo = "lifecycle",
    // docs/schema/yaml/2.3.0.yaml
    path = "docs/schema/yaml/2.3.0.yaml",
    dest = "src/lib/data/lifecycle-schema",
    name = "lifecycle",
    debug = false,
    branch = "main",
  } = options;

  try {
    const yamlContent = await fetchFileFromRepo({
      owner,
      repo,
      path,
      branch,
      debug,
    });

    const yamlFileName = `${name}.yaml.ts`;
    const jsonFileName = `${name}.json.ts`;
    const yamlFilePath = join(dest, yamlFileName);
    const jsonFilePath = join(dest, jsonFileName);

    const dir = dirname(yamlFilePath);
    await mkdir(dir, { recursive: true });

    const yamlExport = `export const yamlContent = \`${yamlContent.replace(/`/g, "\\`")}\`;\n`;
    await writeFile(yamlFilePath, yamlExport, "utf-8");
    console.log(`YAML exported as TypeScript string at ${yamlFilePath}`);
    const parsedJson = convertYamlToJson(yamlContent);
    const jsonExport = `export const jsonContent = ${JSON.stringify(parsedJson, null, 2)};\n`;
    await writeFile(jsonFilePath, jsonExport, "utf-8");
    console.log(`JSON exported as TypeScript object at ${jsonFilePath}`);
  } catch (error) {
    console.error("Error processing YAML file:", error);
  }
};

const program = new Command();

program
  .option("-r, --repo <repo>", "Source repository name", "lifecycle")
  .option("-p, --path <path>", "Path to YAML file in source repo")
  .option(
    "-d, --dest <dest>",
    "Path to store YAML and JSON files locally",
    "src/lib/data/lifecycle-schema",
  )
  .option("-n, --name <name>", "Base name for output files", "lifecycle") // New option for output file naming
  .option("-o, --owner <owner>", "GitHub owner or organization", "goodrxoss")
  .option("-b, --branch <branch>", "GitHub branch to fetch from", "main")
  .option("--debug", "Enable debug logging", false);

program.parse(process.argv);
const options = program.opts();

(async () => {
  await syncYamlFile(options as SyncOptions);
})();

export type SyncOptions = {
  owner?: string;
  repo?: string;
  path?: string;
  dest?: string;
  name?: string;
  debug?: boolean;
  branch?: string;
};

export type FetchFileOptions = {
  owner?: string;
  repo?: string;
  path?: string;
  branch?: string;
  debug?: boolean;
};
