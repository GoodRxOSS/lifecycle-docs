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

import { AnnotationHandler } from "codehike/code";
import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { ChildrenProps } from "@/components/codehike/types";
import { InlineAnnotationComponentProps } from "@/components/codehike/annotations/types";

type HoverContextType = {
  activeHover: string | null;
  setActiveHover: Dispatch<SetStateAction<string | null>>;
};

const HoverContext = createContext<HoverContextType>({
  activeHover: null,
  setActiveHover: () => null,
});

export const HoverProvider = ({ children }: ChildrenProps) => {
  const [activeHover, setActiveHover] = useState<string | null>(null);

  return (
    <HoverContext.Provider value={{ activeHover, setActiveHover }}>
      {children}
    </HoverContext.Provider>
  );
};

export const HoverContainer = ({ children }: ChildrenProps) => {
  return <HoverProvider>{children}</HoverProvider>;
};

type HoverLinkProps = {
  id: string;
  children: ReactNode;
};

export const HoverLink = ({ id, children }: HoverLinkProps) => {
  const { setActiveHover } = useContext(HoverContext);

  return (
    <span
      className="text-blue-400 cursor-pointer hover:underline"
      onMouseEnter={() => setActiveHover(id)}
      onMouseLeave={() => setActiveHover(null)}
    >
      {children}
    </span>
  );
};

export const codeMentions: AnnotationHandler = {
  name: "hover",
  Inline: ({ annotation, children }: InlineAnnotationComponentProps) => {
    const { activeHover } = useContext(HoverContext);
    const isActive = activeHover === annotation.query;

    return (
      <span
        className={`transition-colors duration-200 ${
          isActive ? "bg-blue-500/30 outline outline-1 outline-blue-500/50" : ""
        }`}
      >
        {children}
      </span>
    );
  },
};
