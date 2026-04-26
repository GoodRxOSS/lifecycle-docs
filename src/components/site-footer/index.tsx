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

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const navLinks: ReadonlyArray<{
  href: string;
  label: string;
  external?: boolean;
}> = [
  { href: "/docs/what-is-lifecycle", label: "Docs" },
  {
    href: "https://github.com/GoodRxOSS/lifecycle",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://discord.gg/M5fhHJuEX8",
    label: "Discord",
    external: true,
  },
  {
    href: "https://github.com/GoodRxOSS/lifecycle/blob/main/LICENSE",
    label: "License",
    external: true,
  },
];

const handleBackToTop = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export function SiteFooter() {
  return (
    <div className="-my-10 w-full pt-6 pb-2">
      <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Image
            src="/logo.png"
            alt=""
            width={20}
            height={20}
            className="rounded"
            aria-hidden="true"
          />
          <span className="font-semibold tracking-tight text-foreground">
            Lifecycle
          </span>
        </div>

        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          {navLinks.map(({ href, label, external }) => (
            <Link
              key={href}
              href={href}
              {...(external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            >
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleBackToTop}
            className="ml-1 inline-flex items-center gap-1.5 kicker text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            aria-label="Back to top"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            top
          </button>
        </nav>
      </div>
    </div>
  );
}

export default SiteFooter;
