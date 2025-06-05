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
import { AnnotationHandler, InnerLine, BlockAnnotation } from "codehike/code";

export const diff: AnnotationHandler = {
  name: "diff",
  onlyIfAnnotated: true,
  transform: (annotation: BlockAnnotation) => {
    const color = annotation.query == "-" ? "#f85149" : "#3fb950";
    return [annotation, { ...annotation, name: "mark", query: color }];
  },
  Line: ({ annotation, ...props }) => (
    <>
      <div className="flex items-center w-4 mr-2 justify-center text-xs font-bold">
        {annotation?.query}
      </div>
      <InnerLine merge={props} />
    </>
  ),
};
