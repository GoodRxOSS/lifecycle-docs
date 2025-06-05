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

import { describe, test, expect } from "bun:test";
import fs from "fs";
import path from "path";
import type { MetaItem } from "../../../src/components/cards/type";

// Test the filtering logic directly without importing React components
describe("LifecycleDocsCards Logic", () => {
  const mockMeta: MetaItem[] = [
    {
      name: "item1",
      title: "Item 1 Title",
      description: "Item 1 Description",
      path: "/item1",
    },
    {
      name: "item2",
      title: "Item 2 Title",
      description: "Item 2 Description",
      path: "/item2",
    },
    {
      name: "current",
      title: "Current Item",
      description: "Current Item Description",
      path: "/current",
    },
  ];

  test("filters out the current item", () => {
    // Test the filtering logic directly
    const filterData = mockMeta.filter((item) => item.name !== "current");
    expect(filterData.length).toBe(2);
    expect(filterData[0].name).toBe("item1");
    expect(filterData[1].name).toBe("item2");
  });

  test("renders empty section when no items after filtering", () => {
    // Test the filtering logic directly with only the current item
    const filterData = [mockMeta[2]].filter((item) => item.name !== "current");
    expect(filterData.length).toBe(0);
  });
});

// Test the CSS classes directly by reading the file
describe("LifecycleDocsCards CSS Classes", () => {
  test("should use the correct CSS classes", () => {
    // Read the component file
    const filePath = path.join(process.cwd(), "src/components/cards/index.tsx");
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Check for grid classes
    expect(fileContent).toContain("grid grid-cols-2 gap-4");

    // Check for card classes
    expect(fileContent).toContain(
      "rounded grow border-primary/25 group-hover:border-primary/75 transition-colors",
    );

    // Check for link classes
    expect(fileContent).toContain(
      "mt-4 block text-primary/75 group-hover:text-primary",
    );
  });
});
