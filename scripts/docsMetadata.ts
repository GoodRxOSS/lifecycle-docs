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

export const DOCUMENTATION_METADATA = "documentation-metadata.json";

export type VerificationBaseline = {
  sources: Record<string, string>;
  verifiedOn: string;
};

export type DocumentationMetadata = {
  audiences: Set<string>;
  baselines: Map<string, VerificationBaseline>;
  maintenance: {
    owner: string;
    reviewTrigger: string;
  };
  supportStatuses: Set<string>;
};

export type ResolvedPageMetadata = {
  audience: string[];
  lastVerified: string;
  supportStatus: string | null;
  verificationBaseline: string;
};

export type PageMetadataResolution = {
  issues: string[];
  metadata: ResolvedPageMetadata | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function stringRegistry(
  value: unknown,
  field: string,
  { allowEmpty = false }: { allowEmpty?: boolean } = {},
): string[] {
  if (
    !Array.isArray(value) ||
    (!allowEmpty && value.length === 0) ||
    value.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    throw new Error(
      `${field} requires ${allowEmpty ? "an" : "a non-empty"} array of strings`,
    );
  }
  const values = value as string[];
  if (new Set(values).size !== values.length) {
    throw new Error(`${field} must not contain duplicate values`);
  }
  return values;
}

export async function loadDocumentationMetadata(
  rootDir: string,
): Promise<DocumentationMetadata> {
  const file = path.join(rootDir, DOCUMENTATION_METADATA);
  let parsed: unknown;
  try {
    parsed = JSON.parse(await fs.promises.readFile(file, "utf8"));
  } catch (error) {
    throw new Error(
      `documentation metadata is missing or invalid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!isRecord(parsed) || parsed.schemaVersion !== 1) {
    throw new Error("documentation metadata requires schemaVersion 1");
  }

  const maintenance = parsed.maintenance;
  if (
    !isRecord(maintenance) ||
    typeof maintenance.owner !== "string" ||
    maintenance.owner.trim() === "" ||
    typeof maintenance.reviewTrigger !== "string" ||
    maintenance.reviewTrigger.trim() === ""
  ) {
    throw new Error(
      "maintenance requires a non-empty owner and event-driven reviewTrigger",
    );
  }

  const audiences = stringRegistry(parsed.audiences, "audiences");
  const supportStatuses = stringRegistry(
    parsed.supportStatuses,
    "supportStatuses",
    { allowEmpty: true },
  );
  const baselines = new Map<string, VerificationBaseline>();
  if (!isRecord(parsed.verificationBaselines)) {
    throw new Error("verificationBaselines requires a keyed object");
  }

  for (const [id, rawBaseline] of Object.entries(
    parsed.verificationBaselines,
  )) {
    if (
      !id.trim() ||
      !isRecord(rawBaseline) ||
      typeof rawBaseline.verifiedOn !== "string" ||
      !isIsoDate(rawBaseline.verifiedOn) ||
      !isRecord(rawBaseline.sources) ||
      Object.keys(rawBaseline.sources).length === 0 ||
      Object.entries(rawBaseline.sources).some(
        ([source, revision]) =>
          !source.trim() ||
          typeof revision !== "string" ||
          !/^[0-9a-f]{40}$/i.test(revision),
      )
    ) {
      throw new Error(
        `verification baseline ${id || "(empty)"} requires verifiedOn YYYY-MM-DD and one or more named full commit revisions`,
      );
    }
    baselines.set(id, {
      sources: rawBaseline.sources as Record<string, string>,
      verifiedOn: rawBaseline.verifiedOn,
    });
  }
  if (baselines.size === 0) {
    throw new Error("verificationBaselines requires at least one baseline");
  }

  return {
    audiences: new Set(audiences),
    baselines,
    maintenance: {
      owner: maintenance.owner.trim(),
      reviewTrigger: maintenance.reviewTrigger.trim(),
    },
    supportStatuses: new Set(supportStatuses),
  };
}

export function resolvePageMetadata(
  data: Record<string, unknown>,
  registry: DocumentationMetadata,
  today = new Date().toISOString().slice(0, 10),
): PageMetadataResolution {
  const issues: string[] = [];
  const rawAudience = data.audience;
  const audience = Array.isArray(rawAudience)
    ? rawAudience.filter(
        (value): value is string =>
          typeof value === "string" && value.trim() !== "",
      )
    : [];
  if (
    audience.length === 0 ||
    audience.length !== rawAudience?.length ||
    new Set(audience).size !== audience.length ||
    audience.some((value) => !registry.audiences.has(value))
  ) {
    issues.push(
      "frontmatter requires a non-empty, unique audience array using documentation-metadata.json values",
    );
  }

  const lastVerified =
    typeof data.lastVerified === "string" ? data.lastVerified : "";
  if (!isIsoDate(lastVerified)) {
    issues.push("frontmatter requires lastVerified in YYYY-MM-DD format");
  } else if (lastVerified > today) {
    issues.push("lastVerified cannot be in the future");
  }

  const verificationBaseline =
    typeof data.verificationBaseline === "string"
      ? data.verificationBaseline
      : "";
  const baseline = registry.baselines.get(verificationBaseline);
  if (!baseline) {
    issues.push(
      "frontmatter requires a verificationBaseline defined in documentation-metadata.json",
    );
  } else if (isIsoDate(lastVerified) && lastVerified < baseline.verifiedOn) {
    issues.push(
      `lastVerified cannot predate verification baseline ${verificationBaseline} (${baseline.verifiedOn})`,
    );
  }

  const supportStatus =
    typeof data.supportStatus === "string" ? data.supportStatus : null;
  if (
    data.supportStatus !== undefined &&
    (!supportStatus || !registry.supportStatuses.has(supportStatus))
  ) {
    issues.push(
      "supportStatus must use an established value from documentation-metadata.json",
    );
  }

  return {
    issues,
    metadata:
      issues.length === 0
        ? {
            audience,
            lastVerified,
            supportStatus,
            verificationBaseline,
          }
        : null,
  };
}
