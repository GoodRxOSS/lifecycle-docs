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

export type FlowerNodeServiceProps = {
  yaml: string;
  name: string;
  description: string;
  Svg: React.FC<React.SVGProps<SVGSVGElement>>;
};

export type FlowNodeProps = {
  id: string;
  connections: string[];
  height: number;
  width: number;
  type: string;
  service: FlowerNodeServiceProps;
};

export type CelebrationProps = {
  id: string;
};

export type EmittersType = {
  direction: string;
  rate: {
    quantity: number;
    delay: number;
  };
  position: {
    x: number;
    y: number;
  };
};
