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
import type { Step as StepType } from "./types";

interface StepProps {
  step: StepType;
  isLast: boolean;
}

export function Step({ step, isLast }: StepProps) {
  const Icon = step.icon;
  const isEven = step.number % 2 === 0;

  return (
    <div className="relative flex items-start gap-6">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-6 top-14 w-0.5 h-[calc(100%-2rem)] bg-gradient-to-b from-primary/50 to-primary/10" />
      )}

      {/* Number circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: step.number * 0.1 }}
        className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg"
      >
        {step.number}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 20 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: step.number * 0.1 + 0.1 }}
        className="flex-1 pb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            {step.title}
          </h3>
        </div>
        <p className="text-muted-foreground leading-relaxed pl-[52px]">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}
