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

export const MAX_TRANSITION_DURATION = 900;

export const THEMES = [
  "dracula",
  "github-dark",
  "github-light",
  "material-darker",
  "material-lighter",
  "nord",
  "one-dark-pro",
  "solarized-dark",
  "solarized-light",
  "vs-dark",
  "vs-light",
  "min-light",
  "min-dark",
  "poimandres",
  "slack-dark",
  "slack-ochin",
];

// CodeHike Theme Constants using Tailwind classes

// Mark annotation
export const MARK_LINE_CLASS = "border-l-2";
export const MARK_INLINE_CLASS = "outline outline-1 outline-sky-500/50";

// Callout annotation
export const CALLOUT_BG_CLASS = "bg-neutral-800/90 dark:bg-neutral-800/90";
export const CALLOUT_BORDER_CLASS =
  "border-neutral-600 dark:border-neutral-600";

// Diff annotation
export const DIFF_ADD_CLASS = "bg-green-900/30 border-l-2 border-green-500";
export const DIFF_ADD_TEXT_CLASS = "text-green-500";
export const DIFF_REMOVE_CLASS = "bg-red-900/30 border-l-2 border-red-500";
export const DIFF_REMOVE_TEXT_CLASS = "text-red-500";

// Focus annotation
export const FOCUS_LINE_CLASS = "transition-colors duration-200";

// Copy button
export const COPY_BUTTON_CLASS = "p-1.5 rounded-md transition-colors";

// Line numbers
export const LINE_NUMBER_CLASS = "opacity-60";

// Code block base classes
export const CODE_BLOCK_BASE_CLASS =
  "border rounded-md shadow-lg py-2 px-4 my-4";
