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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { InlineAnnotationComponentProps } from "@/components/codehike/annotations/types";

// Tooltip component that shows additional information on hover
export const TooltipComponent: AnnotationHandler["Inline"] = ({
  children,
  annotation,
}: InlineAnnotationComponentProps) => {
  // The query parameter contains the URL in the link annotation
  // For tooltip, it should contain the tooltip text if data.children is not available
  const tooltipContent = annotation?.data?.children || annotation?.query || "";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dashed *:!inline">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="indent-0">{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Handler for tooltip annotations
export const tooltip: AnnotationHandler = {
  name: "tooltip",
  Inline: TooltipComponent,
  onlyIfAnnotated: true,
};
