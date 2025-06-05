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

import { AnnotationHandler, CustomPreProps } from "codehike/code";

// Define a custom type that extends CustomPreProps with the code property
type ExtendedPreProps = CustomPreProps & {
  code?: {
    meta?: string;
    [key: string]: unknown;
  };
};

export const filename: AnnotationHandler = {
  name: "filename",
  Pre: (props: ExtendedPreProps) => {
    const { children } = props;
    // Access code through props directly
    const meta = props.code?.meta || "";
    const filename = meta.split(" ")?.[0];

    if (!filename) return children;

    return (
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 px-4 py-1 bg-opacity-80 border-b border-opacity-20 text-sm rounded-t">
          {filename}
        </div>
        <div className="pt-8">{children}</div>
      </div>
    );
  },
};
