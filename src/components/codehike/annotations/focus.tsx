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

import React, { useLayoutEffect, useRef } from "react";
import {
  AnnotationHandler,
  InnerLine,
  InnerPre,
  getPreRef,
} from "codehike/code";
import { FOCUS_LINE_CLASS } from "@/components/codehike/constants";

export const PreWithFocus: AnnotationHandler["PreWithRef"] = (props) => {
  const ref = getPreRef(props);
  useScrollToFocus(ref);
  return <InnerPre merge={props} />;
};

export const focus: AnnotationHandler = {
  name: "focus",
  onlyIfAnnotated: true,
  PreWithRef: PreWithFocus,
  Line: (props) => <InnerLine merge={props} className={FOCUS_LINE_CLASS} />,
  AnnotatedLine: ({ ...props }) => (
    <InnerLine
      merge={props}
      data-focus={true}
      className={`${FOCUS_LINE_CLASS} bg-current bg-opacity-10`}
    />
  ),
};

export function useScrollToFocus(ref: React.RefObject<HTMLPreElement>): void {
  const firstRender = useRef(true);
  useLayoutEffect(() => {
    if (ref.current) {
      // find all descendants with data-focus="true"
      const focusedElements = ref.current.querySelectorAll(
        "[data-focus=true]",
      ) as NodeListOf<HTMLElement>;

      // find top and bottom of the focused elements
      const containerRect = ref.current.getBoundingClientRect();
      let top = Infinity;
      let bottom = -Infinity;
      focusedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        top = Math.min(top, rect.top - containerRect.top);
        bottom = Math.max(bottom, rect.bottom - containerRect.top);
      });

      // scroll to the focused elements if any part of them is not visible
      if (bottom > containerRect.height || top < 0) {
        ref.current.scrollTo({
          top: ref.current.scrollTop + top - 10,
          behavior: firstRender.current ? "instant" : "smooth",
        });
      }
      firstRender.current = false;
    }
  }, [ref]); // Add ref as a dependency
}
