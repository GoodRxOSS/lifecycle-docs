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
import { Handle, Position } from "@xyflow/react";
import { Pre, highlight, HighlightedCode } from "codehike/code";
import { useScrollContainer } from "react-indiana-drag-scroll";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "@/components";
import { TabNodeProps } from "@/components/home/flows/static/types";

export const TabbedParentNode = ({ data }: TabNodeProps) => {
  const {
    height,
    width,
    hasLeftHandle,
    hasRightHandle,
    hasBottomHandle,
    hasTopHandle,
    type,
    id,
  } = data;

  const [highlightedYaml, setHighlightedYaml] =
    useState<HighlightedCode | null>(null);
  const [isLoadingYaml, setIsLoadingYaml] = useState<boolean>(true);
  const scrollContainer = useScrollContainer();

  useEffect(() => {
    let isActive = true;
    setIsLoadingYaml(true);

    const yamlToHighlight = {
      value: data.yaml || "",
      lang: "yaml",
      theme: "github-dark",
      meta: "",
    };

    highlight(yamlToHighlight, "github-dark")
      .then((code) => {
        if (isActive) {
          setHighlightedYaml(code);
          setIsLoadingYaml(false);
        }
      })
      .catch((error) => {
        if (isActive) {
          console.error("Error highlighting YAML in TabNode:", error);
          setHighlightedYaml(null);
          setIsLoadingYaml(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [data.yaml]);

  if (type !== "tabbed") return null;

  const handleTabChange = (value: string) => {
    if (!document) return;
    const homeStaticFlowSection = document.getElementById(
      "home-static-flow-section",
    );
    if (!homeStaticFlowSection) return;
    if (value === "yaml") {
      homeStaticFlowSection.classList.add("home-section-static-env-tab-yaml");
    } else {
      homeStaticFlowSection.classList.remove(
        `home-section-static-env-tab-yaml`,
      );
    }
  };

  return (
    <div
      className="tabbed-node-container border rounded-md shadow-lg"
      style={{
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <Tabs
        defaultValue="service"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="rounded-none !rounded-t-md w-full justify-start">
          <TabsTrigger value="service">Service</TabsTrigger>
          <TabsTrigger value="yaml">YAML</TabsTrigger>
        </TabsList>
        <TabsContent value="service">
          <h2 className="mt-2 text-primary font-semibold text-center">
            {data.name}
          </h2>
          <p className="mt-2 text-center text-sm">{data.description}</p>
          <div className="flex justify-center mt-2">
            {data.svg as React.ReactNode}
          </div>
        </TabsContent>
        <TabsContent
          value="yaml"
          className="mt-0 overflow-hidden bg-background h-[470px]"
        >
          {isLoadingYaml ? (
            <div className="flex justify-center items-center h-full p-4">
              <Loader />
            </div>
          ) : highlightedYaml ? (
            <div
              ref={scrollContainer.ref}
              className="w-[260px] overflow-hidden"
            >
              <Pre
                code={highlightedYaml}
                className={`p-2 ${data.yamlClassNames}`}
              />
            </div>
          ) : null}
        </TabsContent>
      </Tabs>

      {hasLeftHandle && (
        <Handle type="target" id={`${id}-left`} position={Position.Left} />
      )}
      {hasRightHandle && (
        <Handle type="source" id={`${id}-right`} position={Position.Right} />
      )}
      {hasBottomHandle && (
        <Handle type="source" id={`${id}-bottom`} position={Position.Bottom} />
      )}
      {hasTopHandle && (
        <Handle type="target" id={`${id}-top`} position={Position.Top} />
      )}
    </div>
  );
};
export default TabbedParentNode;
