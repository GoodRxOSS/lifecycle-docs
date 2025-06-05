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

import { useState } from "react";
import { AnnotationHandler } from "codehike/code";
import { InlineAnnotationComponentProps } from "@/components/codehike/annotations/types";

// Simple inline fold component following the CodeHike docs example
export const FoldInline: AnnotationHandler["Inline"] = ({
  children,
}: InlineAnnotationComponentProps) => {
  const [folded, setFolded] = useState(true);

  if (!folded) {
    return children;
  }

  return (
    <button
      onClick={() => setFolded(false)}
      aria-label="Expand"
      className="inline-flex items-center text-xs transition-colors"
      title="Expand folded code"
    >
      ...
    </button>
  );
};

// Handler for fold annotations
export const foldinline: AnnotationHandler = {
  name: "foldinline",
  Inline: FoldInline,
  onlyIfAnnotated: true,
};
