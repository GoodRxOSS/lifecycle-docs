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

const logo = <p className="flex flex-nowrap">Lifecycle</p>;

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
    <a href="https://discord.gg/TEtKgCs8T84">
      <Discord className="size-6" />
    </a>
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
  // TODO: update to new repo before oss release
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
    // TODO: update to new repo before oss release
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
    content: (
      <span>
        Lifecycle,{" "}
        {new Date().getFullYear()}. Happy Coding!
      </span>
    ),
  },
  components: {
    Code,
    pre: Code,
  },
};
