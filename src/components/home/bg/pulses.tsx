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

import { motion } from "framer-motion";

const easeOutQuart = [0.25, 1, 0.5, 1] as const;
const cell = 56;

type Pulse = {
  axis: "x" | "y";
  lane: number;
  length: number;
  duration: number;
  delay: number;
  repeatDelay: number;
  reverse?: boolean;
};

const pulses: Pulse[] = [
  {
    axis: "x",
    lane: 4,
    length: 168,
    duration: 5.6,
    delay: 0.0,
    repeatDelay: 4.4,
  },
  {
    axis: "x",
    lane: 8,
    length: 112,
    duration: 4.0,
    delay: 2.4,
    repeatDelay: 5.6,
    reverse: true,
  },
  {
    axis: "x",
    lane: 11,
    length: 96,
    duration: 3.6,
    delay: 1.4,
    repeatDelay: 5.0,
  },
  {
    axis: "y",
    lane: 6,
    length: 140,
    duration: 5.4,
    delay: 0.6,
    repeatDelay: 4.8,
  },
  {
    axis: "y",
    lane: 14,
    length: 112,
    duration: 4.2,
    delay: 3.0,
    repeatDelay: 5.8,
  },
  {
    axis: "y",
    lane: 19,
    length: 84,
    duration: 3.8,
    delay: 4.0,
    repeatDelay: 6.0,
    reverse: true,
  },
];

const gradientFor = (axis: "x" | "y", reverse: boolean) => {
  const angle =
    axis === "x" ? (reverse ? "270deg" : "90deg") : reverse ? "0deg" : "180deg";
  return `linear-gradient(${angle}, transparent 0%, hsl(var(--primary) / 0.05) 30%, hsl(var(--primary) / 0.55) 75%, hsl(var(--primary)) 96%, transparent 100%)`;
};

export function GridPulses() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_30%,transparent_75%)]"
    >
      {pulses.map((p, i) => {
        const isX = p.axis === "x";
        const reverse = p.reverse ?? false;
        const lineOffset = `${p.lane * cell + 55.5}px`;

        const start = isX
          ? { x: reverse ? "120vw" : "-25vw" }
          : { y: reverse ? "120vh" : "-25vh" };
        const animate = isX
          ? { x: reverse ? ["120vw", "-25vw"] : ["-25vw", "120vw"] }
          : { y: reverse ? ["120vh", "-25vh"] : ["-25vh", "120vh"] };

        return (
          <motion.span
            key={i}
            initial={start}
            animate={animate}
            transition={{
              duration: p.duration,
              ease: easeOutQuart,
              repeat: Infinity,
              repeatDelay: p.repeatDelay,
              delay: p.delay,
            }}
            style={{
              position: "absolute",
              [isX ? "top" : "left"]: lineOffset,
              [isX ? "left" : "top"]: 0,
              [isX ? "width" : "height"]: `${p.length}px`,
              [isX ? "height" : "width"]: "1px",
              background: gradientFor(p.axis, reverse),
              boxShadow: "0 0 6px hsl(var(--primary) / 0.3)",
              willChange: "transform",
            }}
          />
        );
      })}
    </div>
  );
}

export default GridPulses;
