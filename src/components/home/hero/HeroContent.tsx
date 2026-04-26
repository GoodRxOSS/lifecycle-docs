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
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Copy, Github } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const installCommand = "git clone https://github.com/GoodRxOSS/lifecycle";
const easeOutQuart = [0.25, 1, 0.5, 1] as const;

type CopyState = "idle" | "copied" | "failed";

export function HeroContent() {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 2400);
    }
  };

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
        className="mt-8 w-full max-w-xl"
      >
        <div className="flex items-stretch overflow-hidden rounded-md border border-border bg-muted/40 font-mono text-[13px]">
          <span className="flex shrink-0 items-center px-3 text-muted-foreground">
            $
          </span>
          <code className="flex-1 truncate py-2.5 pr-2 text-foreground">
            {installCommand}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={
              copyState === "copied"
                ? "Copied"
                : copyState === "failed"
                  ? "Copy failed"
                  : "Copy install command"
            }
            className="flex shrink-0 items-center gap-1.5 border-l border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
          >
            {copyState === "copied" ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                copy
              </>
            )}
          </button>
        </div>
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "mt-2 kicker transition-opacity",
            copyState === "failed"
              ? "text-foreground/80 opacity-100"
              : "opacity-0",
          )}
        >
          {copyState === "failed" ? "copy blocked · use ⌘C / Ctrl+C" : " "}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOutQuart, delay: 0.24 }}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
      >
        <Link
          href="/docs/getting-started/create-environment"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group h-11 px-6 text-base",
          )}
        >
          Get started
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
