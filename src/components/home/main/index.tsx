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

import { Iframe } from "@/components/iframe";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export const Main = () => {
  return (
    <>
      <header className="flex items-center md:justify-end">
        <div className="w-full md:pr-20">
          <h1 className="text-center text-primary md:text-right">
            <span className="text-6xl font-bold md:block md:text-[4.25rem]">
              Introducing
            </span>
            <span className="text-6xl font-bold md:block md:text-[4.25rem]">
              Lifecycle
            </span>
          </h1>
          <p className="mt-6 text-xl text-center md:text-right md:pl-[120px]">
            Transform your pull requests into full stack multi-service
            development environments instantly!
          </p>
          <div className="my-6 flex justify-center md:mb-0 md:justify-end">
            <Link
              className={`${buttonVariants()} col-span-1 col-end-3`}
              href="/docs/getting-started/create-environment"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <figure className="mt-6 flex md:mb-0 justify-center items-center md:w-[75%]">
        <Iframe src="https://www.youtube.com/embed/ld9rWBPU3R8?si=1TTGy7cPhaqoF2Ev" />
      </figure>
    </>
  );
};
