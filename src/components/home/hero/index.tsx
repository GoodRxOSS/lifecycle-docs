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
import { HeroContent } from "./HeroContent";

const easeOutQuart = [0.25, 1, 0.5, 1] as const;

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">
      <div className="container mx-auto px-4">
        <HeroContent />

        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOutQuart, delay: 0.3 }}
          className="mx-auto mt-16 max-w-5xl"
        >
          <div className="overflow-hidden rounded-md border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
                demo · 14 min walkthrough
              </span>
              <span className="hidden sm:inline">lifecycle.dev</span>
            </div>
            <div className="relative aspect-video">
              <iframe
                src="https://www.youtube.com/embed/ld9rWBPU3R8?si=1TTGy7cPhaqoF2Ev"
                title="Lifecycle 14-minute walkthrough"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
          <figcaption className="sr-only">
            Fourteen-minute walkthrough showing a pull request creating an
            ephemeral environment.
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

export { HeroContent } from "./HeroContent";
