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

function propertyName(property) {
  if (property?.type !== "Property" || property.computed) return null;
  if (property.key?.type === "Identifier") return property.key.name;
  if (property.key?.type === "Literal") return property.key.value;
  return null;
}

function stringProperty(objectExpression, name) {
  if (objectExpression?.type !== "ObjectExpression") return null;

  for (const property of objectExpression.properties || []) {
    if (propertyName(property) !== name) continue;
    if (property.value?.type !== "Literal") return null;
    return typeof property.value.value === "string"
      ? property.value.value
      : null;
  }

  return null;
}

export function codeHikeSource(node, componentName = "Code") {
  if (node?.type !== "mdxJsxFlowElement" || node.name !== componentName) {
    return null;
  }

  const attribute = (node.attributes || []).find(
    (item) => item?.type === "mdxJsxAttribute" && item.name === "codeblock",
  );
  const program = attribute?.value?.data?.estree;
  const expression = program?.body?.[0]?.expression;

  return (
    stringProperty(expression, "value") ?? stringProperty(expression, "code")
  );
}

function addSearchText(node, componentName) {
  const source = codeHikeSource(node, componentName);
  if (source !== null) {
    node.children = [{ type: "text", value: source }];
  }

  for (const child of node?.children || []) {
    addSearchText(child, componentName);
  }
}

/**
 * Restores fenced-code text after CodeHike converts Markdown code nodes into
 * MDX components. Nextra's later structurizer can then include the text in its
 * FlexSearch data.
 */
export function remarkCodeHikeSearch({ componentName = "Code" } = {}) {
  return (tree) => addSearchText(tree, componentName);
}
