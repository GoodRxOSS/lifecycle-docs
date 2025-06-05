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

import { Edge } from "@xyflow/react";

export type TabDataType = {
  name: string;
  svg: React.ReactNode | Element;
  description: string;
  yaml?: string;
  height: number;
  width: number;
  nodeType?: string;
  sourcePosition?: string;
  targetPosition?: string;
  hasLeftHandle?: boolean;
  hasRightHandle?: boolean;
  hasTopHandle?: boolean;
  hasBottomHandle?: boolean;
  type?: string;
  id?: string;
};

export type TabNodeProps = {
  data: TabDataType;
};

export type TabNodeType = TabNodeProps & {
  id: string;
  position: { x: number; y: number };
  height: number;
  width: number;
  type: string;
  data: TabDataType;
};

export type TabFlowProps = {
  nodeExpandedHeight?: number;
  flowHeight: number;
  flowWidth: number;
  className?: string;
  initialNodes: TabNodeType[];
  initialEdges: Edge[];
  description: string;
};
