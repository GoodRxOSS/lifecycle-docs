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

import {
  AnnotationHandler,
  InlineAnnotation,
  CustomPreProps,
} from "codehike/code";

// Use a safer approach with a module-level variable instead of globalThis
let footnotesList: string[] = [];

export const footnotes: AnnotationHandler = {
  name: "ref",
  transform: (annotation: InlineAnnotation) => {
    if (!footnotesList) {
      footnotesList = [];
    }

    if (!footnotesList.includes(annotation.query)) {
      footnotesList.push(annotation.query);
    }

    return annotation;
  },
  Pre: (props: CustomPreProps) => {
    const { children } = props;
    footnotesList = [];
    return children;
  },
  // Custom component to render after the code block
  // This is not part of the standard AnnotationHandler type
  // but we're adding it for our custom functionality
  // @ts-expect-error - Ignoring the type error as this is a custom extension
  Post: () => {
    if (!footnotesList || footnotesList.length === 0) {
      return null;
    }

    return (
      <ul className="mt-4 text-sm text-zinc-400">
        {footnotesList.map((note, index) => (
          <li key={index} className="flex items-start mb-1">
            <span className="mr-2">•</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    );
  },
};
