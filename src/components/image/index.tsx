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
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ImageProps, DefinedImageProps } from "@/components/image/types";

export const LifecycleDocsImg = ({
  src,
  alt = "",
  border = true,
  ratio,
  width = 800,
  height = 500,
}: ImageProps) => {
  const initialClassNames = "grid relative w-full pt-6";
  const cardClassNames = border
    ? `${initialClassNames} border rounded-md my-4`
    : initialClassNames;
  const updatedRatio = ratio || width / height || 16 / 9;
  return (
    <Card className={cardClassNames}>
      <CardContent>
        <AspectRatio ratio={updatedRatio}>
          <DefinedImage src={src} alt={alt} width={width} height={height} />
        </AspectRatio>
      </CardContent>
    </Card>
  );
};

export const DefinedImage = ({
  src,
  alt = "",
  width = 800,
  height = 500,
}: DefinedImageProps) => {
  const currentSrc = src;
  return width && height ? (
    <Image
      src={currentSrc}
      className="absolute inset-0 h-full w-full"
      alt={alt}
      width={width}
      height={height}
    />
  ) : (
    <img src={src} className="absolute inset-0 h-full w-full" alt={alt} />
  );
};

export default dynamic(() => Promise.resolve(LifecycleDocsImg), {
  loading: () => <Loader />,
  ssr: false,
});
