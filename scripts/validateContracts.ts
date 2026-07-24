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

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fg from "fast-glob";

export type ContractIssue = {
  file: string;
  message: string;
};

export type ContractCheck = {
  detail: string;
  name: "schema" | "openapi" | "cli";
  status: "fail" | "pass" | "skip";
};

export type ContractInputs = {
  cliCommand?: string[];
  openApiSpecPath?: string;
  schemaValidatorCommand?: string[];
};

export type ContractValidationOptions = {
  inputs?: ContractInputs;
  requireAll?: boolean;
  rootDir?: string;
};

export type ContractValidationResult = {
  checks: ContractCheck[];
  issues: ContractIssue[];
};

type SourceFile = {
  file: string;
  source: string;
};

type CommandResult = {
  code: number;
  output: string;
};

type CliInvocation = {
  file: string;
  line: number;
  source: string;
  tokens: string[];
};

const INPUT_NAMES = {
  schemaValidatorCommand: "DOCS_SCHEMA_VALIDATOR_COMMAND",
  openApiSpecPath: "DOCS_OPENAPI_SPEC_PATH",
  cliCommand: "DOCS_CLI_COMMAND",
} as const;

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
];
const GLOBAL_OPTIONS_WITH_VALUES = new Set([
  "--api-url",
  "--profile",
  "--config-dir",
]);

function lineAt(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

function parseArgv(
  name: string,
  value: string | undefined,
): string[] | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`${name} must be a JSON argv array`);
  }
  if (
    !Array.isArray(parsed) ||
    parsed.length === 0 ||
    parsed.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    throw new Error(`${name} must be a non-empty JSON array of strings`);
  }
  return parsed as string[];
}

export function contractInputsFromEnvironment(
  env: Record<string, string | undefined> = process.env,
): ContractInputs {
  return {
    schemaValidatorCommand: parseArgv(
      INPUT_NAMES.schemaValidatorCommand,
      env[INPUT_NAMES.schemaValidatorCommand],
    ),
    openApiSpecPath: env[INPUT_NAMES.openApiSpecPath]?.trim() || undefined,
    cliCommand: parseArgv(INPUT_NAMES.cliCommand, env[INPUT_NAMES.cliCommand]),
  };
}

async function runCommand(
  argv: string[],
  extra: string[] = [],
): Promise<CommandResult> {
  return await new Promise((resolve, reject) => {
    const child = spawn(argv[0], [...argv.slice(1), ...extra], {
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const chunks: Buffer[] = [];
    child.stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => chunks.push(chunk));
    child.once("error", reject);
    child.once("close", (code) => {
      resolve({
        code: code ?? 1,
        output: Buffer.concat(chunks).toString("utf8").trim(),
      });
    });
  });
}

async function readSources(rootDir: string): Promise<SourceFile[]> {
  const files = (
    await fg("src/pages/docs/**/*.mdx", {
      absolute: true,
      cwd: rootDir,
    })
  ).sort();
  return await Promise.all(
    files.map(async (file) => ({
      file,
      source: await fs.promises.readFile(file, "utf8"),
    })),
  );
}

async function validateSchemaExamples(
  rootDir: string,
  sources: SourceFile[],
  command: string[],
): Promise<{ count: number; issues: ContractIssue[] }> {
  const examples: Array<{
    content: string;
    file: string;
    line: number;
  }> = [];
  for (const { file, source } of sources) {
    for (const match of source.matchAll(/```ya?ml([^\n]*)\n([\s\S]*?)```/g)) {
      if (!/\bfilename=["']lifecycle\.ya?ml["']/.test(match[1])) continue;
      examples.push({
        content: match[2],
        file,
        line: lineAt(source, match.index ?? 0),
      });
    }
  }

  const temporaryRoot = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "lifecycle-docs-contracts-"),
  );
  const issues: ContractIssue[] = [];
  try {
    for (const [index, example] of examples.entries()) {
      const temporaryFile = path.join(temporaryRoot, `example-${index}.yaml`);
      await fs.promises.writeFile(temporaryFile, example.content);
      const result = await runCommand(command, [temporaryFile]);
      if (result.code !== 0) {
        issues.push({
          file: `${path.relative(rootDir, example.file)}:${example.line}`,
          message: `canonical lifecycle.yaml validation failed${
            result.output ? `: ${result.output.replace(/\s+/g, " ")}` : ""
          }`,
        });
      }
    }
  } finally {
    await fs.promises.rm(temporaryRoot, { force: true, recursive: true });
  }
  return { count: examples.length, issues };
}

function normalizeApiPath(value: string): string {
  return value
    .replace(/[`'",.;:)\]]+$/g, "")
    .split(/[?#]/, 1)[0]
    .replace(/<[^>]+>|\{[^}]+\}/g, "{}")
    .replace(/\/$/, "");
}

function collectApiClaims(
  rootDir: string,
  sources: SourceFile[],
): Array<{
  file: string;
  line: number;
  method: string;
  normalized: string;
  path: string;
}> {
  const claims: Array<{
    file: string;
    line: number;
    method: string;
    normalized: string;
    path: string;
  }> = [];
  for (const { file, source } of sources) {
    for (const [index, line] of source.split(/\r?\n/).entries()) {
      for (const pathMatch of line.matchAll(/\/api\/v2(?:\/[^\s`"')|,]+)+/g)) {
        const prefix = line.slice(0, pathMatch.index);
        const methods = HTTP_METHODS.filter((method) =>
          new RegExp(`\\b${method}\\b`).test(prefix),
        );
        for (const method of methods) {
          claims.push({
            file: path.relative(rootDir, file),
            line: index + 1,
            method,
            normalized: normalizeApiPath(pathMatch[0]),
            path: pathMatch[0],
          });
        }
      }
    }
  }
  return claims;
}

async function validateOpenApiClaims(
  rootDir: string,
  sources: SourceFile[],
  specPath: string,
): Promise<{ count: number; issues: ContractIssue[] }> {
  const resolvedPath = path.resolve(rootDir, specPath);
  const spec: unknown = JSON.parse(
    await fs.promises.readFile(resolvedPath, "utf8"),
  );
  if (
    typeof spec !== "object" ||
    spec === null ||
    !("paths" in spec) ||
    typeof spec.paths !== "object" ||
    spec.paths === null
  ) {
    throw new Error(`${specPath} does not contain an OpenAPI paths object`);
  }

  const operations = new Map<string, Set<string>>();
  for (const [apiPath, pathItem] of Object.entries(
    spec.paths as Record<string, unknown>,
  )) {
    if (typeof pathItem !== "object" || pathItem === null) continue;
    operations.set(
      normalizeApiPath(apiPath),
      new Set(Object.keys(pathItem).map((method) => method.toUpperCase())),
    );
  }

  const claims = collectApiClaims(rootDir, sources);
  const issues: ContractIssue[] = [];
  for (const claim of claims) {
    if (!operations.get(claim.normalized)?.has(claim.method)) {
      issues.push({
        file: `${claim.file}:${claim.line}`,
        message: `${claim.method} ${claim.path} is not present in the supplied OpenAPI contract`,
      });
    }
  }
  return { count: claims.length, issues };
}

function shellTokens(command: string): string[] {
  const tokens: string[] = [];
  for (const match of command.matchAll(/"([^"]*)"|'([^']*)'|([^\s]+)/g)) {
    tokens.push(match[1] ?? match[2] ?? match[3]);
  }
  return tokens;
}

function collectCliInvocations(
  rootDir: string,
  sources: SourceFile[],
): CliInvocation[] {
  const invocations: CliInvocation[] = [];
  for (const { file, source } of sources) {
    for (const fence of source.matchAll(
      /```(?:sh|bash|shell)[^\n]*\n([\s\S]*?)```/g,
    )) {
      const content = fence[1].replace(/\\\r?\n[ \t]*/g, " ");
      const fenceLine = lineAt(source, fence.index ?? 0);
      for (const [offset, line] of content.split(/\r?\n/).entries()) {
        const lfcIndex = line.search(/\blfc(?:\s|$)/);
        if (lfcIndex < 0) continue;
        const invocation = line
          .slice(lfcIndex)
          .replace(/\s+#.*$/, "")
          .trim();
        invocations.push({
          file: path.relative(rootDir, file),
          line: fenceLine + offset + 1,
          source: invocation,
          tokens: shellTokens(invocation),
        });
      }
    }
  }
  return invocations;
}

function helpCommands(output: string): Set<string> {
  const commands = new Set<string>();
  const lines = output.split(/\r?\n/);
  let inCommands = false;
  for (const line of lines) {
    if (/^\s*Commands:\s*$/.test(line)) {
      inCommands = true;
      continue;
    }
    if (!inCommands) continue;
    if (/^\S/.test(line) || /^\s*(?:Options|Arguments):\s*$/.test(line)) break;
    const command = line.match(/^\s{2,}([a-z][a-z0-9-]*)\b/)?.[1];
    if (command) commands.add(command);
  }
  return commands;
}

function optionName(token: string): string | null {
  const cleaned = token.replace(/^[[(]+|[\]),;]+$/g, "").split("=", 1)[0];
  return /^--?[a-z][a-z0-9-]*$/i.test(cleaned) ? cleaned : null;
}

async function validateCliInvocations(
  rootDir: string,
  sources: SourceFile[],
  command: string[],
): Promise<{ count: number; issues: ContractIssue[] }> {
  const invocations = collectCliInvocations(rootDir, sources);
  const issues: ContractIssue[] = [];
  const helpCache = new Map<string, CommandResult>();
  async function help(commandPath: string[]): Promise<CommandResult> {
    const key = commandPath.join(" ");
    const cached = helpCache.get(key);
    if (cached) return cached;
    const result = await runCommand(command, [...commandPath, "--help"]);
    helpCache.set(key, result);
    return result;
  }

  const rootHelp = await help([]);
  if (rootHelp.code !== 0) {
    throw new Error(
      `CLI root --help failed${rootHelp.output ? `: ${rootHelp.output}` : ""}`,
    );
  }
  const rootCommands = helpCommands(rootHelp.output);

  for (const invocation of invocations) {
    const raw = invocation.tokens.slice(1);
    const helpOutputs = [rootHelp.output];
    const commandSetsByToken = new Map<number, Set<string>>();
    let topIndex = -1;
    for (let index = 0; index < raw.length; index += 1) {
      const token = raw[index];
      if (GLOBAL_OPTIONS_WITH_VALUES.has(token)) {
        index += 1;
        continue;
      }
      if (token.startsWith("-")) continue;
      if (rootCommands.has(token)) {
        topIndex = index;
        break;
      }
    }

    const commandPath: string[] = [];
    if (topIndex < 0) {
      const hasUnexpectedPositional = raw.some((token, index) => {
        if (index > 0 && GLOBAL_OPTIONS_WITH_VALUES.has(raw[index - 1])) {
          return false;
        }
        return token !== "|" && !token.startsWith("-") && !/^[[(<]/.test(token);
      });
      if (hasUnexpectedPositional) {
        issues.push({
          file: `${invocation.file}:${invocation.line}`,
          message: `cannot resolve a documented CLI command from: ${invocation.source}`,
        });
      }
    } else {
      commandPath.push(raw[topIndex]);
      commandSetsByToken.set(topIndex, rootCommands);
      let commandTokenIndex = topIndex;

      while (commandPath.length > 0) {
        const commandHelp = await help(commandPath);
        if (commandHelp.code !== 0) {
          issues.push({
            file: `${invocation.file}:${invocation.line}`,
            message: `CLI command is unavailable: lfc ${commandPath.join(" ")}`,
          });
          break;
        }
        helpOutputs.push(commandHelp.output);

        const subcommands = helpCommands(commandHelp.output);
        if (subcommands.size === 0) break;

        const nextIndex = commandTokenIndex + 1;
        const nextToken = raw[nextIndex];
        if (!nextToken) break;
        const nextCommand = nextToken.replace(/^[[(]+|[\]),;]+$/g, "");
        if (subcommands.has(nextCommand)) {
          commandPath.push(nextCommand);
          commandSetsByToken.set(nextIndex, subcommands);
          commandTokenIndex = nextIndex;
          continue;
        }

        if (
          nextToken === "|" ||
          nextToken.startsWith("-") ||
          /^[[(<]/.test(nextToken)
        ) {
          break;
        }
        issues.push({
          file: `${invocation.file}:${invocation.line}`,
          message: `CLI subcommand is unavailable: lfc ${[
            ...commandPath,
            nextCommand,
          ].join(" ")}`,
        });
        break;
      }
    }

    const availableHelp = helpOutputs.join("\n");
    for (const token of raw) {
      const option = optionName(token);
      if (
        option &&
        option !== "--help" &&
        !new RegExp(
          `(^|[\\s,])${option.replace(/-/g, "\\-")}(?=[\\s,=<\\[])`,
          "m",
        ).test(availableHelp)
      ) {
        issues.push({
          file: `${invocation.file}:${invocation.line}`,
          message: `${option} is not present in help for ${
            commandPath.length > 0 ? `lfc ${commandPath.join(" ")}` : "lfc"
          }`,
        });
      }
    }

    for (let index = 1; index < raw.length - 1; index += 1) {
      if (raw[index] !== "|") continue;
      const siblingCommands = commandSetsByToken.get(index - 1);
      if (!siblingCommands) continue;
      const alternative = raw[index + 1]?.replace(/^[[(]+|[\]),;]+$/g, "");
      if (alternative && !siblingCommands.has(alternative)) {
        issues.push({
          file: `${invocation.file}:${invocation.line}`,
          message: `CLI subcommand alternative is unavailable: ${alternative}`,
        });
      }
    }
  }
  return { count: invocations.length, issues };
}

export async function validateContracts({
  rootDir = process.cwd(),
  inputs = contractInputsFromEnvironment(),
  requireAll = false,
}: ContractValidationOptions = {}): Promise<ContractValidationResult> {
  const resolvedRoot = path.resolve(rootDir);
  const sources = await readSources(resolvedRoot);
  const issues: ContractIssue[] = [];
  const checks: ContractCheck[] = [];

  for (const [key, environmentName] of Object.entries(INPUT_NAMES)) {
    if (requireAll && !inputs[key as keyof ContractInputs]) {
      issues.push({
        file: "contract inputs",
        message: `${environmentName} is required by --require-all`,
      });
    }
  }

  if (inputs.schemaValidatorCommand) {
    const result = await validateSchemaExamples(
      resolvedRoot,
      sources,
      inputs.schemaValidatorCommand,
    );
    issues.push(...result.issues);
    checks.push({
      name: "schema",
      status: result.issues.length > 0 ? "fail" : "pass",
      detail: `${result.count} named lifecycle.yaml example(s) checked`,
    });
  } else {
    checks.push({
      name: "schema",
      status: "skip",
      detail: `${INPUT_NAMES.schemaValidatorCommand} not supplied`,
    });
  }

  if (inputs.openApiSpecPath) {
    const result = await validateOpenApiClaims(
      resolvedRoot,
      sources,
      inputs.openApiSpecPath,
    );
    issues.push(...result.issues);
    checks.push({
      name: "openapi",
      status: result.issues.length > 0 ? "fail" : "pass",
      detail: `${result.count} explicit API operation claim(s) checked`,
    });
  } else {
    checks.push({
      name: "openapi",
      status: "skip",
      detail: `${INPUT_NAMES.openApiSpecPath} not supplied`,
    });
  }

  if (inputs.cliCommand) {
    const result = await validateCliInvocations(
      resolvedRoot,
      sources,
      inputs.cliCommand,
    );
    issues.push(...result.issues);
    checks.push({
      name: "cli",
      status: result.issues.length > 0 ? "fail" : "pass",
      detail: `${result.count} CLI invocation(s) checked`,
    });
  } else {
    checks.push({
      name: "cli",
      status: "skip",
      detail: `${INPUT_NAMES.cliCommand} not supplied`,
    });
  }

  return { checks, issues };
}

async function runCli() {
  let result: ContractValidationResult;
  try {
    result = await validateContracts({
      requireAll: process.argv.includes("--require-all"),
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  for (const check of result.checks) {
    console.log(`${check.status.toUpperCase()} ${check.name}: ${check.detail}`);
  }
  for (const issue of result.issues) {
    console.error(`${issue.file} — ${issue.message}`);
  }
  if (result.issues.length > 0) process.exit(1);
}

if (import.meta.main) {
  await runCli();
}
