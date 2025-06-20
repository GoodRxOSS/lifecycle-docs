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

import { useState, useEffect } from "react";
import { useWindowSize } from "react-use";
import { ReactFlow, ReactFlowProvider, ColorMode } from "@xyflow/react";
import { Separator } from "@/components/ui/separator";
import { CardNode } from "@/components/home/flows/static/cardnode";
import { StaticFlowProps } from "@/components/home/flows/static/types";
import { TabbedParentNode } from "@/components/home/flows/static/tabparentnode";
import ResultNode from "@/components/home/flows/resultnode";

export const StaticFlow = ({
  flowHeight,
  flowWidth,
  initialNodes,
  initialEdges,
  description,
}: StaticFlowProps) => {
  const [theme, setTheme] = useState<ColorMode>();
  const [isClient, setIsClient] = useState(false);
  const { width = flowWidth } = useWindowSize();

  useEffect(() => {
    if (!isClient) return;
    const el = document.documentElement;
    if (el.classList.contains("dark")) setTheme("dark");
    if (el.classList.contains("light")) setTheme("light");
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (width < flowWidth) return null;

  return (
    <ReactFlowProvider>
      <section id="home-static-flow-section" className="grid mt-20">
        <Separator />
        <header className="flex md:justify-center mb-4 mt-20">
          <h2 className="max-w-[800px] text-4xl font-bold text-primary/75">
            {description}
          </h2>
        </header>
        <div className="flex justify-center mt-20">
          <div style={{ height: flowHeight, width: flowWidth }}>
            <ReactFlow
              nodes={initialNodes}
              edges={initialEdges}
              colorMode={theme}
              style={{ background: "none" }}
              nodeTypes={{
                tabbed: TabbedParentNode,
                card: CardNode,
                result: ResultNode,
              }}
              proOptions={{ hideAttribution: true }}
              fitView
              zoomOnScroll={false}
              panOnDrag={false}
              preventScrolling={false}
              nodesDraggable={false}
            />
          </div>
        </div>
      </section>
    </ReactFlowProvider>
  );
};

export default StaticFlow;
