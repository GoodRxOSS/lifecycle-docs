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
import { Iframe } from "@/components/iframe";

export function Hero() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <HeroContent />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <Iframe src="https://www.youtube.com/embed/ld9rWBPU3R8?si=1TTGy7cPhaqoF2Ev" />
        </motion.div>
      </div>
    </section>
  );
}

export { HeroContent } from "./HeroContent";
