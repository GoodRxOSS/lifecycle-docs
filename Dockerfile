# Copyright 2025 GoodRx, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Stage 1: Build the Nextra app with secrets injection
FROM oven/bun:1.2.4 AS builder
WORKDIR /app

# Copy dependency files
COPY package*.json bun.lock* ./
RUN bun install
ARG SYNC_LIFECYCLE_DOCS
ENV SYNC_LIFECYCLE_DOCS=${SYNC_LIFECYCLE_DOCS}

COPY . .

RUN bun run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/out /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
