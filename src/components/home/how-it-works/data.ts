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

import { GitPullRequest, Rocket, Globe, GitMerge } from "lucide-react";
import type { Step } from "./types";

export const steps: Step[] = [
  {
    id: "open-pr",
    number: 1,
    title: "Open a pull request",
    description:
      "Push your branch. Lifecycle picks it up the moment the pull request opens.",
    icon: GitPullRequest,
  },
  {
    id: "provision",
    number: 2,
    title: "Lifecycle builds it",
    description:
      "Every service builds, deploys, and wires together from one config.",
    icon: Rocket,
  },
  {
    id: "access",
    number: 3,
    title: "Test on a real URL",
    description:
      "A unique URL lands in the pull request. Share with reviewers, QA, designers.",
    icon: Globe,
  },
  {
    id: "merge",
    number: 4,
    title: "Merge, it’s gone",
    description:
      "Close or merge. The env tears itself down. No stale envs, no orphan costs.",
    icon: GitMerge,
  },
];
