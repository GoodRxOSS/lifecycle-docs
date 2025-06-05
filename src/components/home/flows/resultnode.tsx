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

import { Handle, Position } from "@xyflow/react";
import { TabNodeProps } from "@/components/home/flows/services/types";
import { Bg } from "@/components/home/bg";

export const ResultNode = ({ data }: TabNodeProps) => {
  const {
    height,
    width,
    hasLeftHandle,
    hasRightHandle,
    hasTopHandle,
    hasBottomHandle,
    type,
    id,
  } = data;

  if (type !== "result") return null;
  return (
    <div
      className="custom-node-container border-2 border-primary rounded-md shadow-lg shadow-primary/50 ease-in-out duration-300"
      style={{
        height: `${height}px`,
        width: `${width}px`,
        position: "relative",
      }}
    >
      <div className="absolute size-full opacity-40 -z-0">
        <Bg />
      </div>
      <div className="rounded-none !rounded-t-md size-full grid content-center">
        <h2 className="my-1 mx-4 text-primary text-sm font-semibold">
          {data.name}
        </h2>
        <p className="my-1 mx-4 text-xs">{data.description}</p>
        <div className="flex justify-center mt-2">
          {data.svg as React.ReactNode}
        </div>
      </div>
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

export default ResultNode;
