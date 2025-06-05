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

import { HighlightedCode, AnnotationHandler } from "codehike/code";

export type CodeHikeProps = {
  codeblock: HighlightedCode;
  handlers?: AnnotationHandler[];
  theme?: string;
  classes?: string;
  id?: string;
};

export type CodeProps = {
  codeblock: HighlightedCode;
  handlers?: AnnotationHandler[];
};

export type ChildrenProps = { children: React.ReactNode };

export interface CodeInput {
  code: string;
  lang?: string;
}

// Define the RawCode type based on CodeHike's definition
export type RawCode = {
  value: string;
  lang: string;
  meta: string;
};

export interface TokenTransitionToggleProps {
  before?: CodeInput;
  after?: CodeInput;
  beforeLabel?: string;
  afterLabel?: string;
}

export type Step = {
  code: RawCode | HighlightedCode;
  children: React.ReactNode;
};

export type SlideshowProps = {
  steps: {
    code: RawCode | HighlightedCode;
    children: React.ReactNode;
  }[];
};
