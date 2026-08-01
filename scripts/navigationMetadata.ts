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
import ts from "typescript";

export type NavigationSource = {
  navigation: Record<string, unknown>;
  source: string;
};

function propertyName(
  name: ts.PropertyName,
  sourceFile: ts.SourceFile,
): string {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text;
  }
  throw new Error(
    `${sourceFile.fileName}:${sourceFile.getLineAndCharacterOfPosition(name.getStart()).line + 1} navigation keys must be static strings`,
  );
}

function literalValue(
  expression: ts.Expression,
  sourceFile: ts.SourceFile,
): unknown {
  if (
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isParenthesizedExpression(expression)
  ) {
    return literalValue(expression.expression, sourceFile);
  }
  if (
    ts.isStringLiteral(expression) ||
    ts.isNoSubstitutionTemplateLiteral(expression)
  ) {
    return expression.text;
  }
  if (ts.isNumericLiteral(expression)) return Number(expression.text);
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (expression.kind === ts.SyntaxKind.NullKeyword) return null;
  if (
    ts.isPrefixUnaryExpression(expression) &&
    expression.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(expression.operand)
  ) {
    return -Number(expression.operand.text);
  }
  if (ts.isArrayLiteralExpression(expression)) {
    return expression.elements.map((element) =>
      literalValue(element, sourceFile),
    );
  }
  if (ts.isObjectLiteralExpression(expression)) {
    const value: Record<string, unknown> = {};
    for (const property of expression.properties) {
      if (!ts.isPropertyAssignment(property)) {
        throw new Error(
          `${sourceFile.fileName}:${sourceFile.getLineAndCharacterOfPosition(property.getStart()).line + 1} navigation metadata must use static property assignments`,
        );
      }
      value[propertyName(property.name, sourceFile)] = literalValue(
        property.initializer,
        sourceFile,
      );
    }
    return value;
  }
  throw new Error(
    `${sourceFile.fileName}:${sourceFile.getLineAndCharacterOfPosition(expression.getStart()).line + 1} navigation metadata must use literal values`,
  );
}

export async function readNavigationMetadata(
  file: string,
): Promise<NavigationSource> {
  const source = await fs.promises.readFile(file, "utf8");
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const parseError = sourceFile.parseDiagnostics.find(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  if (parseError) {
    const position = sourceFile.getLineAndCharacterOfPosition(
      parseError.start ?? 0,
    );
    throw new Error(
      `${file}:${position.line + 1} ${ts.flattenDiagnosticMessageText(parseError.messageText, " ")}`,
    );
  }
  const assignment = sourceFile.statements.find(
    (statement): statement is ts.ExportAssignment =>
      ts.isExportAssignment(statement) && !statement.isExportEquals,
  );
  if (!assignment) {
    throw new Error(`${file} must default-export a navigation object`);
  }
  const navigation = literalValue(assignment.expression, sourceFile);
  if (
    typeof navigation !== "object" ||
    navigation === null ||
    Array.isArray(navigation)
  ) {
    throw new Error(`${file} must default-export a navigation object`);
  }
  return {
    navigation: navigation as Record<string, unknown>,
    source,
  };
}
