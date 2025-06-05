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

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { CardNodeProps } from "@/components/home/flows/static/types";

export const CardNode = ({ data }: CardNodeProps) => {
  const {
    name,
    description,
    svg,
    height,
    width,
    hasLeftHandle,
    hasRightHandle,
    hasTopHandle,
    hasBottomHandle,
    type,
    id,
  } = data;
  if (type !== "card") return null;
  return (
    <div
      style={{ width, height }}
      className={`card-node-${id} !rounded-md border !border-primary/25 !p-0`}
    >
      <h2 className="mt-4 text-primary font-semibold text-sm text-center">
        {name}
      </h2>
      <p className="mt-2 text-sm text-center">{description}</p>
      <div className="flex justify-center mt-2">{svg as React.ReactNode}</div>
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
