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

import { initialNodes, edges } from "@/components/home/flows/static/data";
import { StaticFlow } from "@/components/home/flows/static/staticflow";

export const Static = () => {
  return (
    <StaticFlow
      flowHeight={600}
      flowWidth={830}
      initialNodes={initialNodes}
      initialEdges={edges}
      description="Even better, you can use the latest deployed version of Lifecycle services from a single static environment instead of managing multiple services and repositories for development environments."
    />
  );
};

export default Static;
