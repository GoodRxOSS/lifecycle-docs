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

import { useState, useEffect } from "react";
import { Pre, highlight, HighlightedCode } from "codehike/code";
import { tokenTransitions } from "@/components/codehike/annotations";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";
import {
  RawCode,
  TokenTransitionToggleProps,
} from "@/components/codehike/types";

// Client-side component that handles the toggle
function TokenTransitionToggleClient({
  beforeHighlighted,
  afterHighlighted,
  beforeLabel = "Before",
  afterLabel = "After",
}: TokenTransitionToggleProps & {
  beforeHighlighted: HighlightedCode;
  afterHighlighted: HighlightedCode;
}) {
  const [showAfter, setShowAfter] = useState(false);

  const toggleCode = () => {
    setShowAfter(!showAfter);
  };

  const currentCode = showAfter ? afterHighlighted : beforeHighlighted;
  const currentLabel = showAfter ? afterLabel : beforeLabel;

  return (
    <div className="my-4 border rounded-md overflow-hidden">
      <div className="p-2 flex justify-between items-center">
        <span className="text-sm font-medium">{currentLabel}</span>
        <button onClick={toggleCode} className="px-3 py-1 rounded text-sm">
          Show {showAfter ? beforeLabel : afterLabel}
        </button>
      </div>
      <div className="relative">
        <Pre
          code={currentCode}
          handlers={[tokenTransitions]}
          className="p-4 rounded-none"
          style={{ position: "relative" }}
        />
      </div>
    </div>
  );
}

// Server component that handles the async work
export async function TokenTransitionToggle(props: TokenTransitionToggleProps) {
  const { before, after, beforeLabel, afterLabel } = props;

  if (!before || !before.code || !after || !after.code) {
    console.error("Missing code in props:", props);
    return <div>Error: Missing code in props</div>;
  }

  // Create proper RawCode objects with all required properties
  const beforeRawCode: RawCode = {
    value: before.code || "",
    lang: before.lang || "jsx",
    meta: "",
  };

  const afterRawCode: RawCode = {
    value: after.code || "",
    lang: after.lang || "jsx",
    meta: "",
  };

  try {
    const beforeHighlighted = await highlight(beforeRawCode, "github-dark");
    const afterHighlighted = await highlight(afterRawCode, "github-dark");

    return (
      <TokenTransitionToggleClient
        before={before}
        after={after}
        beforeHighlighted={beforeHighlighted}
        afterHighlighted={afterHighlighted}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
      />
    );
  } catch (error) {
    console.error("Error in server component:", error);
    return <div>Error highlighting code</div>;
  }
}

// Client-side wrapper component
function TokenTransitionToggleWrapper(props: TokenTransitionToggleProps) {
  const [loading, setLoading] = useState(true);
  const [highlightedCode, setHighlightedCode] = useState<{
    beforeHighlighted: HighlightedCode;
    afterHighlighted: HighlightedCode;
  } | null>(null);

  useEffect(() => {
    async function processProps() {
      try {
        const { before, after } = props;

        if (!before || !before.code || !after || !after.code) {
          console.error("Missing code in props:", props);
          setLoading(false);
          return;
        }

        // Create proper RawCode objects with all required properties
        const beforeRawCode: RawCode = {
          value: before.code || "",
          lang: before.lang || "jsx",
          meta: "",
        };

        const afterRawCode: RawCode = {
          value: after.code || "",
          lang: after.lang || "jsx",
          meta: "",
        };

        try {
          const beforeHighlighted = await highlight(
            beforeRawCode,
            "github-dark",
          );
          const afterHighlighted = await highlight(afterRawCode, "github-dark");
          setHighlightedCode({ beforeHighlighted, afterHighlighted });
        } catch (highlightError) {
          console.error("Error highlighting code:", highlightError);
        }
      } catch (error) {
        console.error("Error processing code:", error);
      } finally {
        setLoading(false);
      }
    }

    processProps();
  }, [props]);

  if (loading) return <Loader />;
  if (!highlightedCode) return <div>Error loading code</div>;

  return (
    <TokenTransitionToggleClient
      {...props}
      beforeHighlighted={highlightedCode.beforeHighlighted}
      afterHighlighted={highlightedCode.afterHighlighted}
    />
  );
}

// Export a client-side only version
export const CodeTransition = dynamic(
  () => Promise.resolve(TokenTransitionToggleWrapper),
  { ssr: false, loading: () => <Loader /> },
);
