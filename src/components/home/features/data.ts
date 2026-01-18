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

import {
  GitPullRequest,
  Network,
  Trash2,
  GitFork,
  Webhook,
  MessageSquare,
} from "lucide-react";
import type { Feature } from "./types";

export const features: Feature[] = [
  {
    id: "auto-deploy",
    title: "Auto-deploy on PR",
    description:
      "Every pull request automatically gets its own isolated environment. Simple config setup.",
    icon: GitPullRequest,
  },
  {
    id: "multi-service",
    title: "Connected Multi-Service",
    description:
      "Spin up your entire stack - frontend, backend, databases - all connected and working together.",
    icon: Network,
  },
  {
    id: "auto-cleanup",
    title: "Automatic Cleanup",
    description:
      "Environments are automatically torn down when PRs are merged or closed. No resource waste.",
    icon: Trash2,
  },
  {
    id: "cross-repo",
    title: "Cross-Repo Composition",
    description:
      "Test changes across multiple repositories in a single unified environment.",
    icon: GitFork,
  },
  {
    id: "webhooks",
    title: "Webhooks & Automation",
    description:
      "Integrate with your existing CI/CD pipelines and trigger custom workflows on environment events.",
    icon: Webhook,
  },
  {
    id: "mission-control",
    title: "Mission Control Comments",
    description:
      "Get environment URLs, status updates, and deployment logs directly in your PR comments.",
    icon: MessageSquare,
  },
];
