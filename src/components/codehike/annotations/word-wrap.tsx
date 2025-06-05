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

/* eslint-disable react/prop-types */
import {
  AnnotationHandler,
  InnerLine,
  InnerPre,
  InnerToken,
  CustomPreProps,
} from "codehike/code";

export const wordWrap: AnnotationHandler = {
  name: "word-wrap",
  Pre: (props: CustomPreProps) => (
    <InnerPre merge={props} className="whitespace-pre-wrap" />
  ),
  Line: (props) => (
    <InnerLine
      merge={props}
      style={{
        textIndent: `${-props.indentation}ch`,
        marginLeft: `${props.indentation}ch`,
      }}
    />
  ),
  Token: (props) => <InnerToken merge={props} style={{ textIndent: 0 }} />,
};
