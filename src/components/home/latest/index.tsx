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

import dynamic from "next/dynamic";
import { Loader } from "@/components";
import { LatestPosts } from "@/components/home/latest/latestposts";
import { Separator } from "@/components/ui/separator";
import { blogRoll } from "@/lib/data/blogroll/blogroll";
import { Post } from "@/components/home/latest/types";

export const LatestPostsSection = () => {
  return (
    <section className="grid mt-20">
      <Separator />
      <header className="flex md:justify-center mb-4 mt-20 w-full">
        <h2 className="max-w-[800px] text-4xl font-bold text-primary/75">
          Lifecycle is continually improving. The team is working to keep our
          current product working optimally for our customers while implementing
          new features consistently. View Lifecycle&apos;s latest articles and
          documentation!
        </h2>
      </header>
      <LatestPosts blogRoll={blogRoll as Post[]} />
    </section>
  );
};

export default dynamic(() => Promise.resolve(LatestPostsSection), {
  loading: () => <Loader />,
  ssr: false,
});
