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

import { InlineAnnotation, AnnotationHandler } from "codehike/code";
import { BlockAnnotationComponentProps } from "@/components/codehike/annotations/types";

export const callout: AnnotationHandler = {
  name: "callout",
  transform: (annotation: InlineAnnotation) => {
    const { name, query, lineNumber, fromColumn, toColumn, data } = annotation;
    return {
      name,
      query,
      fromLineNumber: lineNumber,
      toLineNumber: lineNumber,
      data: { ...data, column: (fromColumn + toColumn) / 2 },
    };
  },
  Block: ({ annotation, children }: BlockAnnotationComponentProps) => {
    const { column } = annotation.data;
    return (
      <>
        {children}
        <div
          style={{ minWidth: `${column + 4}ch` }}
          className="w-fit border border-border bg-background rounded-md px-2 py-1 relative -ml-[1ch] mt-1 whitespace-break-spaces text-sm"
        >
          <div
            style={{ left: `${column}ch` }}
            className="absolute border-l border-t border-border w-2 h-2 rotate-45 -translate-y-1/2 -top-[1px] bg-background"
          />
          {annotation.query}
        </div>
      </>
    );
  },
};
