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

import { afterEach, describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  contractInputsFromEnvironment,
  validateContracts,
} from "../../scripts/validateContracts";

const temporaryRoots = new Set<string>();

async function temporaryRoot(): Promise<string> {
  const root = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), "lifecycle-docs-contract-test-"),
  );
  temporaryRoots.add(root);
  await fs.promises.mkdir(path.join(root, "src/pages/docs"), {
    recursive: true,
  });
  return root;
}

async function write(
  root: string,
  relative: string,
  contents: string,
): Promise<string> {
  const file = path.join(root, relative);
  await fs.promises.mkdir(path.dirname(file), { recursive: true });
  await fs.promises.writeFile(file, contents);
  return file;
}

afterEach(async () => {
  await Promise.all(
    [...temporaryRoots].map((root) =>
      fs.promises.rm(root, { force: true, recursive: true }),
    ),
  );
  temporaryRoots.clear();
});

describe("portable contract inputs", () => {
  test("rejects malformed command argv", () => {
    expect(() =>
      contractInputsFromEnvironment({
        DOCS_SCHEMA_VALIDATOR_COMMAND: "node validator.js",
      }),
    ).toThrow("must be a JSON argv array");
  });

  test("require-all reports every unavailable contract", async () => {
    const root = await temporaryRoot();
    const result = await validateContracts({
      rootDir: root,
      inputs: {},
      requireAll: true,
    });
    expect(result.issues).toHaveLength(3);
    expect(result.checks.every((check) => check.status === "skip")).toBe(true);
  });
});

describe("schema contract checks", () => {
  test("reports the source page and line for a rejected named example", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/guides/guide.mdx",
      `# Guide

\`\`\`yaml filename="lifecycle.yaml"
invalid: true
\`\`\`
`,
    );
    const validator = await write(
      root,
      "validator.mjs",
      `import fs from "node:fs";
const content = fs.readFileSync(process.argv[2], "utf8");
if (content.includes("invalid")) {
  console.error("invalid example");
  process.exit(1);
}
`,
    );

    const result = await validateContracts({
      rootDir: root,
      inputs: {
        schemaValidatorCommand: [process.execPath, validator],
      },
    });
    expect(result.issues).toEqual([
      {
        file: "src/pages/docs/guides/guide.mdx:3",
        message: "canonical lifecycle.yaml validation failed: invalid example",
      },
    ]);
    expect(result.checks.find((check) => check.name === "schema")?.status).toBe(
      "fail",
    );
  });
});

describe("OpenAPI contract checks", () => {
  test("accepts present operations and reports missing methods", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/api.mdx",
      `Use GET /api/v2/environments/{uuid}.
Do not claim DELETE /api/v2/environments/{uuid}.
`,
    );
    const spec = await write(
      root,
      "openapi.json",
      JSON.stringify({
        openapi: "3.0.0",
        paths: {
          "/api/v2/environments/{environmentId}": {
            get: {},
          },
        },
      }),
    );

    const result = await validateContracts({
      rootDir: root,
      inputs: { openApiSpecPath: spec },
    });
    expect(result.issues).toEqual([
      {
        file: "src/pages/docs/api.mdx:2",
        message:
          "DELETE /api/v2/environments/{uuid}. is not present in the supplied OpenAPI contract",
      },
    ]);
    expect(
      result.checks.find((check) => check.name === "openapi")?.status,
    ).toBe("fail");
  });
});

describe("CLI contract checks", () => {
  test("checks command paths and documented flags through help", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/cli.mdx",
      `\`\`\`sh
lfc builds list --mine
lfc builds list --invented
\`\`\`
`,
    );
    const cli = await write(
      root,
      "lfc.mjs",
      `const args = process.argv.slice(2);
if (args.join(" ") === "--help") {
  console.log("Commands:\\n  builds  manage builds");
} else if (args.join(" ") === "builds --help") {
  console.log("Commands:\\n  list  list builds");
} else if (args.join(" ") === "builds list --help") {
  console.log("Options:\\n  --mine  show my builds");
} else {
  process.exit(1);
}
`,
    );

    const result = await validateContracts({
      rootDir: root,
      inputs: { cliCommand: [process.execPath, cli] },
    });
    expect(result.issues).toEqual([
      {
        file: "src/pages/docs/cli.mdx:3",
        message: "--invented is not present in help for lfc builds list",
      },
    ]);
    expect(result.checks.find((check) => check.name === "cli")?.status).toBe(
      "fail",
    );
  });

  test("walks nested command help and rejects an invented leaf", async () => {
    const root = await temporaryRoot();
    await write(
      root,
      "src/pages/docs/cli.mdx",
      `\`\`\`sh
lfc builds env get <uuid> --json
lfc builds env invented <uuid>
\`\`\`
`,
    );
    const cli = await write(
      root,
      "lfc.mjs",
      `const command = process.argv.slice(2).join(" ");
const help = {
  "--help": "Options:\\n  --version  print version\\nCommands:\\n  builds  manage builds",
  "builds --help": "Commands:\\n  env  manage environment variables",
  "builds env --help": "Commands:\\n  get  read values\\n  set  write values\\n  unset  remove values",
  "builds env get --help": "Options:\\n  --json  print JSON",
};
if (help[command]) {
  console.log(help[command]);
} else {
  process.exit(1);
}
`,
    );

    const result = await validateContracts({
      rootDir: root,
      inputs: { cliCommand: [process.execPath, cli] },
    });
    expect(result.issues).toEqual([
      {
        file: "src/pages/docs/cli.mdx:3",
        message: "CLI subcommand is unavailable: lfc builds env invented",
      },
    ]);
    expect(result.checks.find((check) => check.name === "cli")?.status).toBe(
      "fail",
    );
  });
});
