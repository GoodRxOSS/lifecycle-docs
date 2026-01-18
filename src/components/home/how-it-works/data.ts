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
    title: "Open a Pull Request",
    description:
      "Push your code and open a pull request as you normally would. Lifecycle detects the PR automatically.",
    icon: GitPullRequest,
  },
  {
    id: "provision",
    number: 2,
    title: "Environment Provisioned",
    description:
      "Lifecycle spins up a complete, isolated environment with all your services configured and connected.",
    icon: Rocket,
  },
  {
    id: "access",
    number: 3,
    title: "Access Your Environment",
    description:
      "Get a unique URL posted to your PR. Share it with teammates for testing and review.",
    icon: Globe,
  },
  {
    id: "merge",
    number: 4,
    title: "Merge and Cleanup",
    description:
      "Merge your PR when ready. Lifecycle automatically tears down the environment, freeing up resources.",
    icon: GitMerge,
  },
];
