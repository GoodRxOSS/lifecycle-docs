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

import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import { useConfig } from "nextra-theme-docs";
import TagContent from "@/components/tags";
import "../styles/globals.css";
import "@xyflow/react/dist/style.css";

export default function App({ Component, pageProps }: AppProps) {
  const [isClient, setIsClient] = useState(false);
  const { frontMatter } = useConfig();

  useEffect(() => {
    if (!isClient) return;
    const el = document.documentElement;
    const nextraWrapper = el.querySelector("[dir='ltr']");
    if (!nextraWrapper) return;
    const footer = el.querySelector("footer");
    if (!footer) return;
    footer.id = "nextra-footer";
    footer.style.backgroundColor = "transparent";
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Component {...pageProps} />
      {frontMatter?.tags?.length > 0 && <TagContent tags={frontMatter.tags} />}
    </>
  );
}
