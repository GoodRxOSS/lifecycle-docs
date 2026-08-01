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

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const easeOutQuart = [0.25, 1, 0.5, 1] as const;

export function HeroContent() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-start text-left motion-reduce:transition-none">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOutQuart }}
        className="inline-flex items-center gap-2 kicker text-muted-foreground"
      >
        <span className="h-px w-8 bg-foreground/30" aria-hidden="true" />
        <span>Apache 2.0 · Ephemeral environments · GoodRx OSS</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOutQuart, delay: 0.05 }}
        className="mt-6 text-balance text-display text-foreground"
      >
        Every pull request gets a{" "}
        <span className="text-primary">real environment.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOutQuart, delay: 0.12 }}
        className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
      >
        A multi-service env per pull request. Builds itself. Tears itself down
        on merge.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOutQuart, delay: 0.18 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
      >
        <Link
          href="/docs"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group h-11 px-6 text-base",
          )}
        >
          Choose your path
          <ArrowRight
            className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="https://github.com/GoodRxOSS/lifecycle"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 px-6 text-base",
          )}
        >
          <Github className="mr-2 h-4 w-4" aria-hidden="true" />
          View on GitHub
        </Link>
      </motion.div>
    </div>
  );
}
