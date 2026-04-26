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
import { ArrowRight, BookOpen, Github } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { motion, type Variants } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const easeOutQuart = [0.25, 1, 0.5, 1] as const;

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutQuart },
  },
};

export function TwoDoors() {
  return (
    <section
      aria-labelledby="two-doors-heading"
      className="relative py-20 md:py-28"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="container mx-auto px-4"
      >
        <motion.header variants={blockVariants} className="max-w-2xl">
          <p className="kicker text-muted-foreground">{"// pick a door"}</p>
          <h2
            id="two-doors-heading"
            className="mt-3 text-headline text-foreground"
          >
            Run it, or build it with us.
          </h2>
        </motion.header>

        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
          <motion.div
            variants={blockVariants}
            className="flex flex-col bg-background p-7 sm:p-9"
          >
            <p className="kicker text-muted-foreground">01 · run it</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              Get it running on a sample repo.
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Clone, follow the guide, watch your first pull request spin up its
              own env in under ten minutes.
            </p>

            <div className="mt-auto pt-7">
              <Link
                href="/docs/getting-started/create-environment"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-11 px-6 text-base sm:w-auto",
                )}
              >
                Read the getting-started guide
                <ArrowRight
                  className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={blockVariants}
            className="flex flex-col bg-background p-7 sm:p-9"
          >
            <p className="kicker text-muted-foreground">02 · community</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              Star it, hang out, send pull requests.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Apache 2.0, built in the open.
            </p>

            <ul className="mt-6 flex flex-col gap-1 text-sm">
              {[
                {
                  href: "https://github.com/GoodRxOSS/lifecycle",
                  icon: Github,
                  label: "Star on GitHub",
                },
                {
                  href: "https://discord.gg/M5fhHJuEX8",
                  icon: FaDiscord,
                  label: "Join the Discord",
                },
                {
                  href: "https://github.com/GoodRxOSS/lifecycle/blob/main/CONTRIBUTING.md",
                  icon: BookOpen,
                  label: "Contributing guide",
                },
              ].map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 rounded-sm py-2 text-foreground/90 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex items-center gap-2.5 font-medium">
                      <Icon
                        className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary"
                        aria-hidden="true"
                      />
                      {label}
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default TwoDoors;
