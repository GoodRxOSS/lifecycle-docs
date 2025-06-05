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

import { Copy, Check } from "lucide-react";
import { useState, useRef } from "react";
import { AnnotationHandler, InnerPre } from "codehike/code";
import {
  COPY_BUTTON_CLASS,
  LINE_NUMBER_CLASS,
} from "@/components/codehike/constants";
import { ExtendedPreProps } from "@/components/codehike/annotations/types";

export function CopyButton({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement> | null;
}) {
  const [copied, setCopied] = useState(false);

  if (!containerRef) return null;
  const copyToClipboard = async () => {
    if (!containerRef.current) {
      console.error("Container ref is null");
      return;
    }

    let text = "";

    const codeElements = containerRef.current.querySelectorAll("code");
    if (codeElements.length > 0) {
      text = Array.from(codeElements)
        .map((el) => (el as HTMLElement)?.textContent || "")
        .join("\n");
    } else {
      const lineNumberElements = containerRef.current.querySelectorAll(
        `.${LINE_NUMBER_CLASS}`,
      );
      if (lineNumberElements.length > 0) {
        const tempContainer = containerRef.current.cloneNode(
          true,
        ) as HTMLElement;
        const lineNumsInTemp = tempContainer.querySelectorAll(
          `.${LINE_NUMBER_CLASS}`,
        );
        lineNumsInTemp.forEach((el) => el.parentNode?.removeChild(el));
        text = tempContainer.textContent || "";
      } else {
        text = containerRef.current.textContent || "";
      }
    }

    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch (e) {
        console.error("Fallback copy failed: ", e, err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <button
      className={COPY_BUTTON_CLASS}
      aria-label="Copy to clipboard"
      onClick={copyToClipboard}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

export const PreWithCopyButton = (props: ExtendedPreProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative group" ref={containerRef}>
      <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        {containerRef && (
          <CopyButton
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
          />
        )}
      </div>
      <InnerPre merge={props} />
    </div>
  );
};

export const button: AnnotationHandler = {
  name: "button",
  Pre: PreWithCopyButton,
};
