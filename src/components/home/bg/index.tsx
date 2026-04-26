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

import { GridPattern } from "@/components/home/bg/grid";

export const Bg = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <GridPattern
        width={56}
        height={56}
        x="-1"
        y="-1"
        className="absolute inset-0 h-full w-full stroke-foreground/[0.05] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_30%,transparent_75%)] dark:stroke-foreground/[0.07]"
      />
    </div>
  );
};

export default Bg;
