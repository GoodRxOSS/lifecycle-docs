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

import { Command } from "commander";
import { Octokit } from "@octokit/rest";
import fg from "fast-glob";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import pLimit from "p-limit";

import dotenv from "dotenv";

dotenv.config();

const auth = process.env.SYNC_LIFECYCLE_DOCS;
const octokit = new Octokit({ auth });

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export const updateFrontmatter = async (
  filePath: string,
  commitDate: string,
): Promise<void> => {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);
    if (frontmatter.date) return;
    frontmatter.date = commitDate;
    const updatedContent = matter.stringify(content, frontmatter);
    await fs.writeFile(filePath, updatedContent, "utf-8");
    console.log(`Updated date for ${filePath}: ${commitDate}`);
  } catch (error) {
    console.error(`Error updating frontmatter for ${filePath}:`, error);
  }
};

export const getLatestCommitsForFiles = async ({
  files,
  owner = "goodrxoss",
  repo = "lifecycle-docs",
}): Promise<FileCommit[]> => {
  const limit = pLimit(10);
  try {
    const commitRequests = files.map((file) =>
      limit(async () => {
        const relativePath = path.relative(process.cwd(), file);
        const resp = await octokit.repos.listCommits({
          owner,
          repo,
          path: relativePath,
          per_page: 1,
        });
        const commits = resp?.data;
        const lastCommit = commits?.[0]?.commit;
        const rawCommitDate =
          lastCommit?.author?.date || new Date().toISOString();
        const commitDate = formatDate(rawCommitDate);
        const commitMessage = lastCommit?.message || "No commit message";

        await updateFrontmatter(file, commitDate);

        return {
          fileName: path.basename(file),
          filePath: relativePath,
          commitDate,
          commitMessage,
        };
      }),
    );

    const fileCommits = await Promise.all(commitRequests);
    return fileCommits.sort(
      (a, b) =>
        new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime(),
    );
  } catch (error) {
    console.info("Error fetching commits:", error);
    return [];
  }
};

export const syncDocDatesAction = async ({
  files,
  owner = "goodrxoss",
  repo = "lifecycle-docs",
}: SyncDocDatesActionOptions): Promise<void> => {
  const resolvedFiles = await fg(files);
  if (resolvedFiles.length === 0) {
    console.error(`No matching files found for patterns: ${files.join(", ")}`);
    return;
  }
  console.log(`Found ${resolvedFiles.length} files. Processing...`);
  const latestDocs = await getLatestCommitsForFiles({
    owner,
    repo,
    files: resolvedFiles,
  });
  console.log("Latest Docs:");
  latestDocs.forEach((doc) =>
    console.log(`- ${doc.fileName}: ${doc.commitDate} (${doc.commitMessage})`),
  );
};

const program = new Command();

program
  .description("Update .mdx frontmatter with the latest Git commit date.")
  .option("-o, --owner <owner>", "GitHub repository owner", "goodrxoss")
  .option("-r, --repo <repo>", "GitHub repository name", "lifecycle-docs")
  .arguments("<files...>")
  .action((files: string[], options: ActionOptions) =>
    syncDocDatesAction({ ...options, files }),
  );

program.parseAsync(process.argv);

export type FileCommit = {
  fileName: string;
  filePath: string;
  commitDate: string;
  commitMessage: string;
};

export type GetLatestCommitsForFilesOptions = {
  owner?: string;
  repo?: string;
  filePath: string;
};

export type ActionOptions = {
  owner?: string;
  repo?: string;
};

export type SyncDocDatesActionOptions = {
  owner?: string;
  repo?: string;
  files: string[];
};
