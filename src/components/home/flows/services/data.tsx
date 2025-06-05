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

import { Edge, MarkerType } from "@xyflow/react";
import { SiPostgresql } from "react-icons/si";
import { FaGolang } from "react-icons/fa6";
import { FaReact } from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { GrGraphQl } from "react-icons/gr";
import { MdOutlineRocketLaunch } from "react-icons/md";

import { TabNodeType } from "@/components/home/flows/services/types";

export const defaultNodeProperties = {
  width: 200,
  height: 150,
  hasLeftHandle: true,
  hasRightHandle: true,
  hasTopHandle: false,
  hasBottomHandle: false,
  type: "tabbed",
};

export const nodes: TabNodeType[] = [
  {
    ...defaultNodeProperties,
    id: "database",
    type: "tabbed",
    position: { x: 0, y: 0 },
    data: {
      ...defaultNodeProperties,
      hasLeftHandle: false,
      name: "Database",
      description: "A postgres database",
      yaml: `- name: database\n  repository: 'lifecycle/database'\n  branch: 'main'`,
      svg: <SiPostgresql size={20} className="fill-primary" />,
      id: "database",
    },
  },
  {
    ...defaultNodeProperties,
    id: "grpc",
    type: "tabbed",
    position: { x: 0, y: 180 },
    data: {
      ...defaultNodeProperties,
      hasLeftHandle: false,
      name: "Golang Service",
      description: "A gRPC microservice",
      yaml: `- name: service\n  repository: 'lifecycle/service'\n  branch: 'main'`,
      svg: <FaGolang size={28} className="fill-primary" />,
      id: "grpc",
    },
  },
  {
    ...defaultNodeProperties,
    id: "microservice",
    type: "tabbed",
    position: { x: 240, y: 90 },
    data: {
      ...defaultNodeProperties,
      name: "Microservice",
      description: "A backend microservice",
      yaml: `- name: microservice\n  repository: 'lifecycle/microservice'\n  branch: 'main'`,
      svg: <MdComputer size={22} className="fill-primary" />,
      hasBottomHandle: true,
      id: "microservice",
    },
  },
  {
    ...defaultNodeProperties,
    id: "graph",
    type: "tabbed",
    position: { x: 480, y: 90 },
    data: {
      ...defaultNodeProperties,
      name: "Graph API",
      description: "A middleware API",
      yaml: `- name: graph-api\n  repository: 'lifecycle/graph-api'\n  branch: 'graph-updates'`,
      svg: <GrGraphQl size={20} className="fill-primary" />,
      hasBottomHandle: true,
      id: "graph",
    },
  },
  {
    ...defaultNodeProperties,
    id: "website",
    type: "tabbed",
    position: { x: 720, y: 90 },
    data: {
      ...defaultNodeProperties,
      hasRightHandle: false,
      name: "Cool Website",
      description: "A react app frontend",
      yaml: `- name: web-app\n  repository: 'lifecycle/web-app'\n  branch: 'new-cooler-website'`,
      svg: <FaReact size={20} className="fill-primary" />,
      hasBottomHandle: true,
      id: "website",
    },
  },
  {
    ...defaultNodeProperties,
    id: "lifecycle",
    type: "result",
    position: { x: 480, y: 280 },
    data: {
      ...defaultNodeProperties,
      width: 220,
      height: 180,
      hasRightHandle: false,
      hasLeftHandle: false,
      hasTopHandle: true,
      name: "Deploy full stack dev envs with ease",
      description:
        "Deploy a complex group of services into one simple development environment!",
      svg: <MdOutlineRocketLaunch size={25} className="fill-primary" />,
      type: "result",
      id: "lifecycle",
    },
  },
];

export const defaultEdgeAttributes = {
  animated: true,
};

export const edges: Edge[] = [
  {
    ...defaultEdgeAttributes,
    id: "database-microservice",
    source: "database",
    target: "microservice",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    ...defaultEdgeAttributes,
    id: "grpc-microservice",
    source: "grpc",
    target: "microservice",
  },
  {
    ...defaultEdgeAttributes,
    id: "microservice-graph",
    source: "microservice",
    target: "graph",
  },
  {
    ...defaultEdgeAttributes,
    id: "graph-website",
    source: "graph",
    target: "website",
  },
  {
    ...defaultEdgeAttributes,
    id: "microservice-lifecycle",
    source: "microservice",
    target: "lifecycle",
    sourceHandle: "microservice-bottom",
    targetHandle: "lifecycle-top",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    ...defaultEdgeAttributes,
    id: "graph-lifecycle",
    source: "graph",
    target: "lifecycle",
    sourceHandle: "graph-bottom",
    targetHandle: "lifecycle-top",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    ...defaultEdgeAttributes,
    id: "website-lifecycle",
    source: "website",
    target: "lifecycle",
    sourceHandle: "website-bottom",
    targetHandle: "lifecycle-top",
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];
