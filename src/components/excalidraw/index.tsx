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

import dynamic from "next/dynamic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExcalidrawElement = any;

interface ExcalidrawDiagramProps {
  elements: readonly ExcalidrawElement[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appState?: any;
  className?: string;
}

// Dynamically import Excalidraw with SSR disabled
const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="my-6 h-64 flex items-center justify-center bg-slate-800 rounded">
        <span className="text-gray-400">Loading diagram...</span>
      </div>
    ),
  },
);

// UIOptions to hide all UI controls
const uiOptions = {
  canvasActions: {
    changeViewBackgroundColor: false,
    clearCanvas: false,
    loadScene: false,
    saveToActiveFile: false,
    toggleTheme: false,
    saveAsImage: false,
    export: false,
  },
  tools: {
    image: false,
  },
};

export function ExcalidrawDiagram({
  elements,
  appState,
  className = "",
}: ExcalidrawDiagramProps) {
  return (
    <div
      className={`excalidraw-readonly my-6 h-80 rounded overflow-hidden ${className}`}
    >
      <style>{`
        .excalidraw-readonly .Island,
        .excalidraw-readonly .App-menu,
        .excalidraw-readonly .layer-ui__wrapper__top-right,
        .excalidraw-readonly .layer-ui__wrapper__footer,
        .excalidraw-readonly .ToolIcon,
        .excalidraw-readonly .HintViewer,
        .excalidraw-readonly [class*="zoom"],
        .excalidraw-readonly .App-bottom-bar,
        .excalidraw-readonly .FixedSideContainer {
          display: none !important;
        }
        .excalidraw-readonly .excalidraw {
          --ui-font: system-ui, sans-serif;
        }
      `}</style>
      <Excalidraw
        initialData={{
          elements,
          appState: {
            viewBackgroundColor: "#0f172a",
            zoom: { value: 1 },
            scrollX: 0,
            scrollY: 0,
            ...appState,
          },
        }}
        viewModeEnabled={true}
        zenModeEnabled={true}
        gridModeEnabled={false}
        theme="dark"
        UIOptions={uiOptions}
      />
    </div>
  );
}

export default ExcalidrawDiagram;
