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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { ReactElement } from "react";
import { useConfig } from "nextra-theme-docs";
import { FaDiscord as Discord } from "react-icons/fa";
import TagContent from "@/components/tags";
import { Archived } from "@/components/archived";
import { Separator } from "@/components/ui/separator";
import { Code } from "@/components";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";

const logo = (
  <div className="flex items-center gap-2.5 logo-shake">
    <Image
      src="/logo.png"
      alt="Lifecycle"
      width={28}
      height={28}
      className="rounded logo-image"
    />
    <span className="font-mono text-sm font-semibold uppercase tracking-[0.08em]">
      Lifecycle
    </span>
  </div>
);

export type MainProps = {
  children?: ReactElement;
};

export const updateAnchorHrefByText = (text: string, newHref: string) => {
  if (typeof document === "undefined") return;
  const anchors = document.getElementsByTagName("a");
  for (let i = 0; i < anchors.length; i++) {
    if (anchors[i].textContent !== text) continue;
    else {
      anchors[i].href = newHref;
      break;
    }
  }
};

const updateProjectLink = (frontMatter: {
  RemoteEditUrl?: string;
  editUrl?: string;
}) => {
  const editUrl =
    frontMatter?.RemoteEditUrl ||
    frontMatter?.editUrl ||
    "https://github.com/GoodRxOSS/lifecycle-docs/blob/main"; // TODO: update to new repo before oss release
  updateAnchorHrefByText("Edit this page", editUrl);
};

export const HeadMeta = () => {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Lifecycle" />
      <meta property="og:description" content="Documentation for Lifecycle" />
      <link rel="icon" type="image/png" href="/logo.png" />
    </>
  );
};

export const MainTemplate = ({ children }: MainProps) => {
  const config = useConfig();
  const frontMatter = config.frontMatter;
  const layout = config.normalizePagesResult?.activeThemeContext?.layout;
  if (layout !== "full") {
    return (
      <>
        <header className="mt-10">
          <h1 className="_text-4xl _font-bold">{frontMatter.title}</h1>
          <p className="_text-2xl">{frontMatter.description}</p>
          {frontMatter?.tags?.length > 0 && (
            <Archived tags={frontMatter.tags} />
          )}
        </header>
        <section className="mt-10">{children}</section>
      </>
    );
  }

  return <main className="grid layout-full mt-10">{children}</main>;
};

export const TopNavExtraContent = () => {
  return (
    <div className="flex items-center gap-2">
      <a
        href="https://discord.gg/M5fhHJuEX8"
        aria-label="Lifecycle Discord"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
      >
        <Discord className="size-5" />
      </a>
    </div>
  );
};

export const TocExtraContent = () => {
  const { frontMatter } = useConfig();
  // HACK: fix remote edit url
  updateProjectLink(frontMatter);
  return (
    frontMatter?.tags?.length > 0 && (
      <section>
        <Separator className="_my-8" />
        <p className="_mb-4 _font-semibold _tracking-tight">Related Content</p>
        <TagContent tags={frontMatter.tags} />
        <Separator className="_my-8" />
      </section>
    )
  );
};

export const TocBackToTop = () => {
  return <p className="_font-semibold _tracking-tight">Back to top</p>;
};

export default {
  docsRepositoryBase: "https://github.com/GoodRxOSS/lifecycle-docs/blob/main",
  editLink: {
    text: "Edit this page",
  },
  head: <HeadMeta />,
  logo,
  main: MainTemplate,
  navbar: {
    extraContent: <TopNavExtraContent />,
  },
  navigation: {
    prev: true,
    next: true,
  },
  project: {
    link: "https://github.com/GoodRxOSS/lifecycle",
  },
  search: {
    placeholder: "Search...",
  },
  sidebar: {
    defaultOpen: false,
    defaultMenuCollapseLevel: 2,
  },
  toc: {
    float: true,
    backToTop: TocBackToTop,
    extraContent: TocExtraContent,
  },
  footer: {
    content: <SiteFooter />,
  },
  darkMode: false,
  themeSwitch: {
    component: null,
  },
  nextThemes: {
    defaultTheme: "dark",
    forcedTheme: "dark",
  },
  components: {
    Code,
    pre: Code,
  },
};
