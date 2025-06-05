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

"use client";

import { AnnotationHandler } from "codehike/code";
import { useState } from "react";

// Import our standard props type
import { BlockAnnotationComponentProps } from "@/components/codehike/annotations/types";
// No constants needed

export const collapse: AnnotationHandler = {
  name: "collapse",
  Block: ({ annotation, children }: BlockAnnotationComponentProps) => {
    const [isCollapsed, setIsCollapsed] = useState(
      annotation.query?.includes("collapsed") || false,
    );

    const header =
      Array.isArray(children) && children.length > 0 ? (
        children?.[0]
      ) : (
        <div>Click to expand/collapse</div>
      );

    return (
      <div className="relative">
        <div
          className="cursor-pointer hover:bg-opacity-10 hover:bg-current px-2 py-1 rounded"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {header}
          <span className="ml-2 opacity-60 text-xs">
            {isCollapsed ? "▶" : "▼"}
          </span>
        </div>
        <div className={isCollapsed ? "hidden" : "block"}>
          {Array.isArray(children) && children.length > 1
            ? children.slice(1)
            : null}
        </div>
      </div>
    );
  },
};
