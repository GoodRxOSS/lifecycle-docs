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

import { motion, type Variants } from "framer-motion";
import type { Step as StepType } from "./types";

const easeOutQuart = [0.25, 1, 0.5, 1] as const;
const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const container = (index: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: index * 0.2,
      staggerChildren: 0.08,
    },
  },
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutQuart },
  },
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: easeOutExpo },
  },
};

const dotIn: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { duration: 0.35, ease: easeOutExpo },
  },
};

const haloPulse: Variants = {
  hidden: { scale: 0.6, opacity: 0 },
  visible: {
    scale: [0.6, 2.6],
    opacity: [0.55, 0],
    transition: { duration: 0.9, ease: easeOutExpo, delay: 0.2 },
  },
};

const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

interface StepProps {
  step: StepType;
  index: number;
  isLast?: boolean;
}

export function Step({ step, index, isLast = false }: StepProps) {
  const Icon = step.icon;
  const num = String(step.number).padStart(2, "0");

  return (
    <motion.li
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container(index)}
      className="relative flex flex-col"
    >
      <div className="flex items-center justify-between gap-4">
        <motion.span
          variants={fadeUp}
          className="kicker text-muted-foreground tabular-nums"
        >
          {num}
        </motion.span>
        <motion.span variants={popIn} className="inline-flex">
          <Icon
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
            strokeWidth={1.75}
          />
        </motion.span>
      </div>

      <div className="relative mt-4 flex h-3 items-center" aria-hidden="true">
        <span className="relative flex h-1.5 w-1.5 shrink-0 items-center justify-center">
          <motion.span
            variants={haloPulse}
            className="absolute inset-0 rounded-full bg-primary"
            style={{ transformOrigin: "center" }}
          />
          <motion.span
            variants={dotIn}
            className="relative h-1.5 w-1.5 rounded-full bg-primary"
          />
        </span>
        {!isLast && (
          <motion.span
            variants={drawLine}
            style={{ transformOrigin: "left center" }}
            className="ml-1 h-px flex-1 bg-primary/30"
          />
        )}
      </div>

      <motion.h3
        variants={fadeUp}
        className="mt-5 text-lg font-semibold tracking-tight text-foreground"
      >
        {step.title}
      </motion.h3>
      <motion.p
        variants={fadeUp}
        className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground"
      >
        {step.description}
      </motion.p>
    </motion.li>
  );
}
