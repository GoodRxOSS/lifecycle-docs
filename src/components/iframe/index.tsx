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
import { Loader } from "@/components";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { IframeProps } from "@/components/iframe/types";
export const Iframe = ({ src }: IframeProps) => {
  return (
    <Card className="relative w-full my-8 border rounded-md pt-6 my-4">
      <CardContent>
        <AspectRatio ratio={16 / 9}>
          <iframe src={src} className="absolute inset-0 h-full w-full" />
        </AspectRatio>
      </CardContent>
    </Card>
  );
};

export default dynamic(() => Promise.resolve(Iframe), {
  loading: () => <Loader />,
  ssr: false,
});
