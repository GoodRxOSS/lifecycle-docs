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
import { Check, X } from "lucide-react";

const easeOutQuart = [0.25, 1, 0.5, 1] as const;

const without = [
  "One shared staging. One queue at a time.",
  "Local works. Staging doesn't. The drift is the norm.",
  "Twelve services, wired by hand, for one PR.",
  "Old envs linger. Costs creep. Cleanup is manual.",
];

const with_ = [
  "Each pull request opens its own isolated environment.",
  "Run the exact branch, against the exact dependencies.",
  "Multi-service topology builds itself from one config.",
  "Merge or close. The env is gone. No janitor needed.",
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutQuart },
  },
};

const columnVariants = (delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delay,
      staggerChildren: 0.07,
    },
  },
});

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutQuart },
  },
};

export function Contrast() {
  return (
    <section
      aria-labelledby="contrast-heading"
      className="relative border-y border-border/60 py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={headerVariants}
          className="mx-auto max-w-2xl"
        >
          <p className="kicker text-muted-foreground">{"// the shift"}</p>
          <h2
            id="contrast-heading"
            className="mt-3 text-headline text-foreground"
          >
            Stop sharing one staging.
            <br />
            <span className="text-muted-foreground">
              Start shipping in parallel.
            </span>
          </h2>
        </motion.header>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={columnVariants(0)}
            className="bg-background p-7 sm:p-9"
          >
            <motion.h3
              variants={itemVariants}
              className="flex items-center gap-3 kicker text-muted-foreground"
            >
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-sm border border-border text-foreground/60"
                aria-hidden="true"
              >
                <X className="h-3 w-3" strokeWidth={2.25} />
              </span>
              Without Lifecycle
            </motion.h3>
            <ul className="mt-6 space-y-4">
              {without.map((line, i) => (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="flex gap-3 text-base leading-relaxed text-muted-foreground"
                >
                  <span
                    className="mt-2 h-px w-3 shrink-0 bg-foreground/30"
                    aria-hidden="true"
                  />
                  <span>{line}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={columnVariants(0.35)}
            className="bg-background p-7 sm:p-9"
          >
            <motion.h3
              variants={itemVariants}
              className="flex items-center gap-3 kicker text-muted-foreground"
            >
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-primary-foreground"
                aria-hidden="true"
              >
                <Check className="h-3 w-3" strokeWidth={2.5} />
              </span>
              With Lifecycle
            </motion.h3>
            <ul className="mt-6 space-y-4">
              {with_.map((line, i) => (
                <motion.li
                  key={i}
                  variants={itemVariants}
                  className="flex gap-3 text-base leading-relaxed text-foreground"
                >
                  <span
                    className="mt-2 h-px w-3 shrink-0 bg-primary"
                    aria-hidden="true"
                  />
                  <span>{line}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contrast;
