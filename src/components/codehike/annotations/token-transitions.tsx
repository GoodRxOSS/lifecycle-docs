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

import React from "react";
import {
  AnnotationHandler,
  InnerToken,
  CustomPreProps,
  InnerPre,
  getPreRef,
} from "codehike/code";
import {
  TokenTransitionsSnapshot,
  calculateTransitions,
  getStartingSnapshot,
} from "codehike/utils/token-transitions";

import { MAX_TRANSITION_DURATION } from "@/components/codehike/constants";

export class SmoothPre extends React.Component<CustomPreProps> {
  ref: React.RefObject<HTMLPreElement>;
  constructor(props: CustomPreProps) {
    super(props);
    this.ref = getPreRef(this.props);
  }

  render() {
    return <InnerPre merge={this.props} style={{ position: "relative" }} />;
  }

  getSnapshotBeforeUpdate() {
    return getStartingSnapshot(this.ref.current!);
  }

  componentDidUpdate(
    _prevProps: never,
    _prevState: never,
    snapshot: TokenTransitionsSnapshot,
  ) {
    const transitions = calculateTransitions(this.ref.current!, snapshot);
    transitions.forEach(({ element, keyframes, options }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { translateX, translateY, ...kf } = keyframes as any;
      if (translateX && translateY) {
        kf.translate = [
          `${translateX[0]}px ${translateY[0]}px`,
          `${translateX[1]}px ${translateY[1]}px`,
        ];
      }
      element.animate(kf, {
        duration: options.duration * MAX_TRANSITION_DURATION,
        delay: options.delay * MAX_TRANSITION_DURATION,
        easing: options.easing,
        fill: "both",
      });
    });
  }
}

export const tokenTransitions: AnnotationHandler = {
  name: "token-transitions",
  PreWithRef: SmoothPre,
  Token: (props) => (
    <InnerToken merge={props} style={{ display: "inline-block" }} />
  ),
};
