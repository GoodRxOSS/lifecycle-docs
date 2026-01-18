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

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Pre, type CustomPreProps } from "codehike/code";
import {
  callout,
  className,
  tabs,
  mark,
  diff,
  focus,
  button,
  foldinline,
  foldblock,
  lineNumbers,
  tokenTransitions,
  link,
  tooltip,
} from "@/components/codehike/annotations";
import { CodeHikeProps } from "@/components/codehike/types";
import Loader from "@/components/loader";

export const CodeHikeSSR = ({
  codeblock,
  handlers = [
    callout,
    className,
    tabs,
    mark,
    diff,
    focus,
    button,
    foldinline,
    foldblock,
    lineNumbers,
    link,
    tooltip,
    tokenTransitions,
  ],
  theme: initialTheme = "github-dark",
  classes = "",
  ...props
}: CodeHikeProps & Omit<CustomPreProps, "code" | "handlers">) => {
  const [isClient, setIsClient] = useState(false);
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "github-dark" : "github-light");
  }, []);

  const className = `text-sm line-height-6 overflow-auto${classes?.length ? ` ${classes}` : ""}`;

  return (
    <div className="border rounded p-4 my-4">
      <Pre
        code={{
          ...codeblock,
          themeName: theme,
        }}
        handlers={handlers}
        className={className}
        {...props}
      />
    </div>
  );
};

export const Code = dynamic(
  () => import("@/components/codehike/code").then((mod) => mod.CodeHikeSSR),
  { ssr: false, loading: () => <Loader /> },
);

export const CodeHikeDynamic = Code;
export const CodeHike = Code;
export default Code;
