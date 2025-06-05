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

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LatestPostsProps } from "@/components/home/latest/types";

export const LatestPosts = ({ blogRoll }: LatestPostsProps) => {
  const latestPosts = blogRoll
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 9);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
      {latestPosts.map(({ title, description, path }) => (
        <Card
          key={title}
          className="rounded border-primary/25 hover:border-primary/75 transition-colors"
        >
          <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {description}
            </CardDescription>
            <Link
              href={`/${path}`}
              className="mt-4 block text-primary/75 hover:text-primary"
            >
              Read more →
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LatestPosts;
