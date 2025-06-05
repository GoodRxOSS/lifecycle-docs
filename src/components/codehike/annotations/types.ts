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

import {
  BlockAnnotation,
  InlineAnnotation,
  CustomPreProps,
} from "codehike/code";
import React from "react";

export type BlockAnnotationComponentProps = {
  annotation: BlockAnnotation;
  children: React.ReactNode;
};

export type InlineAnnotationComponentProps = {
  annotation: InlineAnnotation;
  children: React.ReactNode;
};

// Generic type that can be used for both Block and Inline annotations
export type AnnotationComponentProps = {
  annotation: BlockAnnotation | InlineAnnotation;
  children: React.ReactNode;
};

export type ExtendedPreProps = CustomPreProps & {
  code?: {
    meta?: string;
    [key: string]: unknown;
  };
};
