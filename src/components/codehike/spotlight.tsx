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

import { useEffect, useState } from "react";
import { Block, CodeBlock, parseProps } from "codehike/blocks";
import { Pre, HighlightedCode, highlight, RawCode } from "codehike/code";
import { z } from "zod";
import {
  Selection,
  Selectable,
  SelectionProvider,
} from "codehike/utils/selection";
import {
  callout,
  wordWrap,
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

const Schema = Block.extend({
  steps: z.array(Block.extend({ code: CodeBlock })),
});

export function Spotlight(props: unknown) {
  const { steps } = parseProps(props, Schema);
  return (
    <SelectionProvider className="flex gap-4 my-4">
      <div className="flex-1 prose">
        {steps.map((step, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={["click"]}
            className="border p-4 mb-4 rounded data-[selected=true]:border-foreground cursor-pointer transition-colors duration-200 ease-in-out"
          >
            <h2 className="mt-4 text-xl text-foreground">{step.title}</h2>
            <div className="text-foreground">{step.children}</div>
          </Selectable>
        ))}
      </div>
      <div className="w-[60%] max-w-xl">
        <div className="top-20 sticky overflow-auto">
          <Selection
            from={steps.map((step, i) => (
              <Code key={i} codeblock={step.code} />
            ))}
          />
        </div>
      </div>
    </SelectionProvider>
  );
}

function Code({ codeblock }: { codeblock: RawCode | HighlightedCode }) {
  const [highlightedCode, setHighlightedCode] =
    useState<HighlightedCode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function highlightCode() {
      try {
        // If it's already a HighlightedCode object, use it directly
        if ("tokens" in codeblock && "themeName" in codeblock) {
          setHighlightedCode(codeblock as HighlightedCode);
        } else {
          // Otherwise, highlight it
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
        wordWrap,
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
      className="p-4 border rounded-md"
    />
  );
}
