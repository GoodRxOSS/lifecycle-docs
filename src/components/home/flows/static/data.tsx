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

import { GrGraphQl } from "react-icons/gr";
import { MdComputer } from "react-icons/md";
import { FaReact } from "react-icons/fa";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { MarkerType } from "@xyflow/react";

export const defaultNodeProperties = {
  hasLeftHandle: false,
  hasRightHandle: false,
  hasTopHandle: false,
  hasBottomHandle: false,
  branching: [],
};

export const parentNode = {
  id: "static",
  type: "tabbed",
  position: { x: 0, y: 0 },
  height: 515,
  width: 260,
  data: {
    ...defaultNodeProperties,
    name: "Static Environment",
    id: "static",
    type: "tabbed",
    yaml: "environment:\n  defaultServices:\n  - name: microservice\n    repository: 'lifecycle/microservice'\n    branch: 'main'\n  - name: graph-api\n    repository: 'lifecycle/graph-api'\n    branch: 'main'\n  - name: cool-website\n    repository: 'lifecycle/cool-website'\n    branch: 'main'",
    yamlClassNames: "*:h-[480px] *:rounded-b-md *:justfiy-center *:py-2",
    height: 515,
    width: 260,
  },
};

export const defaultSizeCardNodes = {
  height: 120,
  width: 200,
};

export const staticServiceNodes = [
  {
    ...defaultSizeCardNodes,
    id: "static-graph",
    type: "card",
    parentId: "static",
    position: { x: 30, y: 90 },
    data: {
      ...defaultNodeProperties,
      ...defaultSizeCardNodes,
      name: "Graph API",
      description: "A middleware API",
      svg: <GrGraphQl size={20} className="fill-primary" />,
      id: "static-graph",
      type: "card",
      parentId: "static",
    },
  },
  {
    ...defaultSizeCardNodes,
    id: "static-microservice",
    type: "card",
    position: { x: 30, y: 230 },
    parentId: "static",
    data: {
      ...defaultNodeProperties,
      ...defaultSizeCardNodes,
      name: "Microservice",
      description: "A backend microservice",
      svg: <MdComputer size={22} className="fill-primary" />,
      id: "static-microservice",
      hasRightHandle: true,
      type: "card",
      parentId: "static",
    },
  },
  {
    ...defaultSizeCardNodes,
    id: "static-website",
    type: "card",
    position: { x: 30, y: 370 },
    parentId: "static",
    data: {
      ...defaultNodeProperties,
      ...defaultSizeCardNodes,
      name: "Cool Website",
      description: "A react app frontend",
      svg: <FaReact size={20} className="fill-primary" />,
      type: "card",
      parentId: "static",
    },
  },
];

export const updatedServices = [
  {
    ...defaultSizeCardNodes,
    id: "updated-website",
    type: "card",
    position: { x: 300, y: 40 },
    data: {
      ...defaultNodeProperties,
      ...defaultSizeCardNodes,
      name: "Cool Website",
      description: "A react app frontend",
      svg: <FaReact size={20} className="fill-primary" />,
      id: "updated-website",
      hasBottomHandle: true,
      type: "card",
    },
  },
  {
    ...defaultSizeCardNodes,
    id: "updated-graph",
    type: "card",
    position: { x: 330, y: 230 },
    data: {
      ...defaultNodeProperties,
      ...defaultSizeCardNodes,
      name: "Graph API",
      description: "A middleware API",
      svg: <GrGraphQl size={20} className="fill-primary" />,
      id: "updated-graph",
      type: "card",
      hasLeftHandle: true,
      hasRightHandle: true,
      hasTopHandle: true,
    },
  },
];

export const resultNode = {
  ...defaultSizeCardNodes,
  id: "lifecycle",
  type: "result",
  position: { x: 590, y: 230 },
  data: {
    ...defaultNodeProperties,
    ...defaultSizeCardNodes,
    height: 200,
    width: 220,
    hasLeftHandle: true,
    name: "Deploy only what you need. Use latest for the rest!",
    description:
      "With Lifecycle static envs, you can use lastest from them and only build and deploy what you need!",
    svg: <MdOutlineRocketLaunch size={25} className="fill-primary" />,
    type: "result",
    id: "lifecycle",
  },
};

export const initialNodes = [
  parentNode,
  ...staticServiceNodes,
  ...updatedServices,
  resultNode,
];

export const defaultEdgeAttributes = {
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
};

export const edges = [
  {
    ...defaultEdgeAttributes,
    id: "static-microservice-graph",
    source: "static-microservice",
    target: "updated-graph",
    sourceHandle: "static-microservice-right",
    targetHandle: "updated-graph-left",
  },
  {
    ...defaultEdgeAttributes,
    id: "updated-website-updated-graph",
    source: "updated-website",
    target: "updated-graph",
    sourceHandle: "updated-website-bottom",
    targetHandle: "updated-graph-top",
  },
  {
    ...defaultEdgeAttributes,
    id: "updated-graph-lifecycle",
    source: "updated-graph",
    target: "lifecycle",
    sourceHandle: "updated-graph-right",
    targetHandle: "lifecycle-left",
  },
];
