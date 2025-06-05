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

/* eslint-disable react/prop-types */
import { AnnotationHandler, InnerLine } from "codehike/code";
import { InlineAnnotationComponentProps } from "@/components/codehike/annotations/types";

export const mark: AnnotationHandler = {
  name: "mark",
  onlyIfAnnotated: true,
  Line: ({ annotation, ...props }) => {
    // For now, let's just use a simple approach without trying to check for empty lines
    const color = annotation?.query || "rgb(14 165 233)";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isNewLine = (props as any)?.children?.[0] === "\n";
    // Check if line numbers are present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasLineNumbers = (props as any)?.children?.some?.(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (child: any) => child?.props?.className?.includes?.("select-none"),
    );

    return (
      <div
        className={`flex relative ${hasLineNumbers ? "left-0" : "-left-4"}`}
        style={{
          borderLeft: annotation ? `solid 2px ${color}` : "none",
          backgroundColor: annotation
            ? `rgb(from ${color} r g b / 0.1)`
            : "transparent",
          width: annotation ? "calc(100% + 2rem)" : "100%", // Extend beyond parent on right
          marginRight: annotation ? "-2rem" : "0", // Negative margin to extend beyond container
          paddingLeft: hasLineNumbers ? "0" : "2px",
          marginLeft: hasLineNumbers ? "-2px" : "0", // Adjust for line numbers
        }}
      >
        <InnerLine
          merge={props}
          className={`${hasLineNumbers ? "pl-0" : "px-2"} flex-1`}
          style={{ display: isNewLine ? "none" : "block" }}
        />
      </div>
    );
  },
  Inline: ({ annotation, children }: InlineAnnotationComponentProps) => {
    const color = annotation?.query || "rgb(14 165 233)";
    return (
      <span
        className="rounded px-0.5 py-0 -mx-0.5"
        style={{
          outline: `solid 1px rgb(from ${color} r g b / 0.5)`,
          background: `rgb(from ${color} r g b / 0.13)`,
        }}
      >
        {children}
      </span>
    );
  },
};
