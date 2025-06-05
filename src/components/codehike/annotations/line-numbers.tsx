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

import { AnnotationHandler, InnerLine } from "codehike/code";
import { LINE_NUMBER_CLASS } from "@/components/codehike/constants";

export const lineNumbers: AnnotationHandler = {
  name: "line-numbers",
  // Using a more generic approach to avoid type conflicts
  Line: (props) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lineProps = props as any;
    const lineNumber = lineProps.lineNumber;
    const totalLines = lineProps.totalLines || 1;
    const width = String(totalLines).length + 1;

    // We're adding consistent padding to line numbers

    return (
      <div className="flex">
        <span
          className={`select-none pr-4 ${LINE_NUMBER_CLASS}`}
          style={{
            minWidth: `${width}ch`,
            paddingLeft: "1rem",
          }}
        >
          {lineNumber}
        </span>
        <InnerLine merge={props} className="flex-1" />
      </div>
    );
  },
};
