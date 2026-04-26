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

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const easeOutQuart = [0.25, 1, 0.5, 1] as const;

type CopyState = "idle" | "copied" | "failed";

const lifecycleYaml = `version: "1.0.0"

environment:
  defaultServices:
    - name: "api"
    - name: "postgres"

services:
  - name: "api"
    github:
      repository: "acme/api"
      branchName: "main"
      docker:
        defaultTag: "main"
        app:
          dockerfilePath: "Dockerfile"
          ports: [8080]
          env:
            DATABASE_URL: "postgresql://app:pw@{{{postgres_internalHostname}}}:5432/appdb"

  - name: "postgres"
    docker:
      dockerImage: "postgres"
      defaultTag: "15-alpine"
      ports: [5432]
      env:
        POSTGRES_USER: "app"
        POSTGRES_PASSWORD: "pw"
        POSTGRES_DB: "appdb"`;

const headerStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const headerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutQuart },
  },
};

const capabilities = [
  {
    label: "Auto-deploy on pull request",
    body: "Push, get an environment. No imperative steps.",
  },
  {
    label: "Cross-repo composition",
    body: "Compose services from multiple repos in one env.",
  },
  {
    label: "Automatic cleanup",
    body: "Merge or close › environment is reclaimed.",
  },
  {
    label: "Webhooks & automation",
    body: "Hook env events into your existing CI/CD.",
  },
  {
    label: "Mission-control comments",
    body: "URLs, status, logs delivered into the pull request.",
  },
  {
    label: "Debug from chat",
    body: "Triage build and deploy failures in a chat-driven agent session.",
  },
];

export function Capabilities() {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lifecycleYaml);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 2400);
    }
  };

  return (
    <section
      aria-labelledby="capabilities-heading"
      className="relative border-y border-border/60 py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={headerStagger}
          className="grid gap-6 md:grid-cols-12"
        >
          <div className="md:col-span-5">
            <motion.p
              variants={headerItem}
              className="kicker text-muted-foreground"
            >
              {"// what it does"}
            </motion.p>
            <motion.h2
              variants={headerItem}
              id="capabilities-heading"
              className="mt-3 text-headline text-foreground"
            >
              Connected multi-service.
              <br />
              <span className="text-muted-foreground">From one config.</span>
            </motion.h2>
          </div>
          <motion.p
            variants={headerItem}
            className="md:col-span-7 md:pt-4 text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Most preview tools start a container. Lifecycle starts the topology:
            frontend, APIs, queues, databases. Each on ephemeral DNS, wired like
            prod.
          </motion.p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="mt-12 overflow-hidden rounded-md border border-border bg-card"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border pl-4 pr-1 py-1 kicker text-muted-foreground">
            <span>lifecycle.yaml</span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={
                copyState === "copied"
                  ? "Copied"
                  : copyState === "failed"
                    ? "Copy failed"
                    : "Copy lifecycle.yaml"
              }
              className="inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-[11px] font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copyState === "copied" ? (
                <>
                  <Check className="h-3 w-3" aria-hidden="true" />
                  copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" aria-hidden="true" />
                  copy
                </>
              )}
            </button>
          </div>

          <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-foreground sm:px-6">
            {lifecycleYaml}
          </pre>

          <p
            role="status"
            aria-live="polite"
            className={cn(
              "sr-only",
              copyState === "failed" &&
                "not-sr-only px-5 pb-2 text-xs text-muted-foreground sm:px-6",
            )}
          >
            {copyState === "copied"
              ? "Copied lifecycle.yaml"
              : copyState === "failed"
                ? "copy blocked · use ⌘C / Ctrl+C"
                : ""}
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: easeOutQuart, delay: 0.55 }}
            className="border-t border-border px-5 py-4 text-sm text-muted-foreground sm:px-6"
          >
            <span className="kicker">result ›</span>{" "}
            <span className="text-foreground">
              one pull request builds api + postgres, wired through ephemeral
              DNS.
            </span>
          </motion.div>
        </motion.div>

        <ul className="mt-14 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {capabilities.map((cap, i) => (
            <motion.li
              key={cap.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.45,
                ease: easeOutQuart,
                delay: i * 0.05,
              }}
              className="grid grid-cols-[auto_1fr] items-baseline gap-4 border-b border-border/60 pb-5"
            >
              <span className="kicker text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {cap.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {cap.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: easeOutQuart }}
          className="mt-12 kicker text-muted-foreground"
        >
          Self-hosted on your Kubernetes · brings its own controller · no SaaS
          lock-in
        </motion.p>
      </div>
    </section>
  );
}

export default Capabilities;
