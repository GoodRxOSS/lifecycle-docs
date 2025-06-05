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
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components";
import { LifecycleDocsCardsProps, MetaItem } from "@/components/cards/type";

export const LifecycleDocsCards = ({ meta, name }: LifecycleDocsCardsProps) => {
  const filterData = meta.filter((item) => item.name !== name);
  return (
    <section className="grid grid-cols-2 gap-4">
      {filterData.map(({ name, title, description, path }: MetaItem) => (
        <Link href={path} key={name} className="flex group">
          <Card className="rounded grow border-primary/25 group-hover:border-primary/75 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                {description}
              </CardDescription>
              <Link
                href={path}
                className="mt-4 block text-primary/75 group-hover:text-primary"
              >
                Read more →
              </Link>
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
};

export default dynamic(() => Promise.resolve(LifecycleDocsCards), {
  loading: () => <Loader />,
  ssr: false,
});
