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

import { Step } from "./Step";
import { steps } from "./data";

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <p className="kicker text-muted-foreground">{"// the path"}</p>
          <h2
            id="how-it-works-heading"
            className="mt-3 text-headline text-foreground"
          >
            From pull request to live URL in four steps.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            No tickets, no provisioning calls, no cleanup chores.
          </p>
        </header>

        <ol className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Step key={step.id} step={step} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export { Step } from "./Step";
export { steps } from "./data";
export type { Step as StepType } from "./types";
