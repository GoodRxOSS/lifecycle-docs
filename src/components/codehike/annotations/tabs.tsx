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

import { Block, CodeBlock, parseProps } from "codehike/blocks";
import {
  Pre,
  RawCode,
  highlight,
  HighlightedCode,
  AnnotationHandler,
  InlineAnnotation,
} from "codehike/code";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const Schema = Block.extend({ tabs: z.array(CodeBlock) });

// Define the tabs annotation handler
export const tabs: AnnotationHandler = {
  name: "tabs",
  transform: (annotation: InlineAnnotation) => {
    return annotation;
  },
};

// Client-side component that handles the async highlighting
function CodeTabsClient({
  tabs,
  highlighted,
}: {
  tabs: RawCode[];
  highlighted: HighlightedCode[];
}) {
  return (
    <Tabs defaultValue={tabs[0]?.meta} className="rounded border">
      <TabsList className="rounded-none flex justify-start">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.meta} value={tab.meta}>
            {tab.meta}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent key={tab.meta} value={tab.meta} className="mt-0">
          <Pre
            code={highlighted[i]}
            className="mz-4 p-2 rounded-none border-t text-sm"
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

// Server component that handles the async work
export async function CodeTabs(props: { tabs: RawCode[] }) {
  const { tabs } = props;
  const highlighted = await Promise.all(
    tabs.map((tab) => highlight(tab, "github-dark")),
  );

  // This will be rendered on the server, but the client component will take over
  return <CodeTabsClient tabs={tabs} highlighted={highlighted} />;
}

// Client-side wrapper component that handles the async CodeWithTabs
function CodeWithTabsWrapper(props: unknown) {
  const [loading, setLoading] = useState(true);
  const [highlightedTabs, setHighlightedTabs] = useState<{
    tabs: RawCode[];
    highlighted: HighlightedCode[];
  } | null>(null);

  useEffect(() => {
    async function processProps() {
      try {
        const { tabs } = parseProps(props, Schema);
        const highlighted = await Promise.all(
          tabs.map((tab) => highlight(tab, "github-dark")),
        );
        setHighlightedTabs({ tabs, highlighted });
      } catch (error) {
        console.error("Error processing tabs:", error);
      } finally {
        setLoading(false);
      }
    }

    processProps();
  }, [props]);

  if (loading) return <Loader />;
  if (!highlightedTabs) return <div>Error loading tabs</div>;

  return (
    <CodeTabsClient
      tabs={highlightedTabs.tabs}
      highlighted={highlightedTabs.highlighted}
    />
  );
}

// Export a client-side only version of CodeWithTabs
export const CodeWithTabs = dynamic(
  () => Promise.resolve(CodeWithTabsWrapper),
  { ssr: false, loading: () => <Loader /> },
);
