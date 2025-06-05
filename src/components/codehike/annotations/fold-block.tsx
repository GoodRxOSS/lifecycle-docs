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
import { BlockAnnotationComponentProps } from "@/components/codehike/annotations/types";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnnotationHandler } from "codehike/code";
import { cn } from "@/lib/utils";

// Component for block folding (multiple lines of code)
const FoldBlock = ({ children }: BlockAnnotationComponentProps) => {
  const [folded, setFolded] = useState(true);

  // Toggle fold state
  const toggleFold = () => {
    setFolded(!folded);
  };

  return (
    <div className="w-full relative">
      {!folded && (
        <div className="">
          <div className="">{children}</div>
        </div>
      )}
      <div className="-left-5 absolute -top-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFold}
          aria-label={folded ? "Expand code" : "Collapse code"}
          title={folded ? "Expand code" : "Collapse code"}
          className="h-6 w-6"
        >
          <ChevronRight
            size={16}
            className={cn(
              "transition-transform duration-200",
              !folded && "transform rotate-90",
            )}
          />
        </Button>
      </div>
    </div>
  );
};

// Export the component as default
// Handler for all fold annotations
export const foldblock: AnnotationHandler = {
  name: "foldblock",
  Block: FoldBlock,
  onlyIfAnnotated: true,
};
