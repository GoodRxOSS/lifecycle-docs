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

import React, { useState, useEffect } from "react";
import { Pre, HighlightedCode, highlight, RawCode } from "codehike/code";
import {
  callout,
  className,
  tabs,
  mark,
  diff,
  focus,
  button,
  foldinline,
  foldblock,
  lineNumbers,
  tokenTransitions,
  link,
  tooltip,
} from "@/components/codehike/annotations";
import Loader from "@/components/loader";
import { SlideshowProps, Step } from "@/components/codehike/types";

export function Slideshow(props: SlideshowProps) {
  const steps = props?.steps;
  if (!steps) return null;
  return (
    <Slides
      slides={steps?.map((step: Step, i) => (
        <div key={i}>
          <Code codeblock={step.code} />
          <div className="mt-4">{step.children}</div>
          <div>
            <Controls length={steps?.length} />
          </div>
        </div>
      ))}
    />
  );
}

function Code({ codeblock }: { codeblock: RawCode | HighlightedCode }) {
  const [highlightedCode, setHighlightedCode] =
    useState<HighlightedCode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function highlightCode() {
      try {
        if ("tokens" in codeblock && "themeName" in codeblock) {
          setHighlightedCode(codeblock as HighlightedCode);
        } else {
          const rawCode: RawCode = {
            value: codeblock.value || "",
            lang: codeblock.lang || "jsx",
            meta: codeblock.meta || "",
          };
          const highlighted = await highlight(rawCode, "github-dark");
          setHighlightedCode(highlighted);
        }
      } catch (error) {
        console.error("Error highlighting code:", error);
      } finally {
        setLoading(false);
      }
    }

    highlightCode();
  }, [codeblock]);

  if (loading) return <Loader />;
  if (!highlightedCode) return <div>Error highlighting code</div>;

  return (
    <Pre
      code={highlightedCode}
      handlers={[
        callout,
        className,
        tabs,
        mark,
        diff,
        focus,
        button,
        foldinline,
        foldblock,
        lineNumbers,
        link,
        tooltip,
        tokenTransitions,
      ]}
      className="p-4 mt-4 border rounded-md"
    />
  );
}

const StepIndexContext = React.createContext<
  [number, React.Dispatch<React.SetStateAction<number>>]
>([0, () => {}]);

export function Slides({ slides }: { slides: React.ReactNode[] }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <StepIndexContext.Provider value={[selectedIndex, setSelectedIndex]}>
      {slides[selectedIndex]}
    </StepIndexContext.Provider>
  );
}

export function Controls({ length }: { length: number }) {
  const [selectedIndex, setSelectedIndex] = React.useContext(StepIndexContext);
  const isFirst = selectedIndex === 0;
  const isLast = selectedIndex === length - 1;
  return (
    <div className="flex justify-center py-4 items-center">
      <button
        disabled={isFirst}
        className={`mr-4 ${isFirst ? "opacity-50" : ""}`}
        onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
      >
        Prev
      </button>
      {[...Array(length)].map((_, i) => (
        <button
          key={i}
          className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${
            selectedIndex === i ? "bg-background" : "bg-foreground"
          }`}
          onClick={() => setSelectedIndex(i)}
        />
      ))}
      <button
        className={`ml-4 ${isLast ? "opacity-50" : ""}`}
        disabled={isLast}
        onClick={() =>
          setSelectedIndex(Math.min(length - 1, selectedIndex + 1))
        }
      >
        Next
      </button>
    </div>
  );
}
