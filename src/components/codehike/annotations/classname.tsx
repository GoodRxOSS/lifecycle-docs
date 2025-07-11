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

import { AnnotationHandler } from "codehike/code";
import { AnnotationComponentProps } from "@/components/codehike/annotations/types";

export const className: AnnotationHandler = {
  name: "className",
  Block: ({ annotation, children }: AnnotationComponentProps) => (
    <div className={annotation.query}>{children}</div>
  ),
  Inline: ({ annotation, children }: AnnotationComponentProps) => (
    <span className={annotation.query}>{children}</span>
  ),
};
