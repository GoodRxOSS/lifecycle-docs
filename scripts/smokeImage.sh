#!/usr/bin/env bash
# Copyright 2026 GoodRx, Inc.
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

# Runs the built docs image and checks the routing contract the deployment depends on.
# Usage: scripts/smokeImage.sh <image> [host-port]
set -euo pipefail

image="${1:?usage: smokeImage.sh <image> [host-port]}"
port="${2:-18080}"
name="lifecycle-docs-smoke-$$"
base="http://127.0.0.1:${port}"
failures=0

cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run -d --name "$name" -p "127.0.0.1:${port}:8080" "$image" >/dev/null

for _ in $(seq 1 30); do
  curl -fs -o /dev/null "$base/" && break
  sleep 1
done

check() {
  local path="$1" want_status="$2" want_type="$3"
  local got
  got="$(curl -s --path-as-is -o /dev/null -w '%{http_code} %{content_type}' "$base$path")"
  if [[ "$got" == "$want_status $want_type"* ]]; then
    echo "ok   $path -> $got"
  else
    echo "FAIL $path -> $got (want $want_status $want_type)"
    failures=$((failures + 1))
  fi
}

check "/" 200 "text/html"
check "/docs" 200 "text/html"
check "/docs.md" 200 "text/markdown; charset=utf-8"
check "/llms.txt" 200 "text/plain"
check "/docs/does-not-exist.md" 404 "text/html"
check "/docs/cm" 404 "text/html"
check "/docs//cm" 404 "text/html"
check "/_next/static/does-not-exist.js" 404 "text/html"
check "/unknown/client/route" 200 "text/html"

asset="$(curl -s "$base/" | grep -oE '/_next/static/[^"]+\.js' | head -n 1)"
check "$asset" 200 "text/javascript"

user="$(docker inspect --format '{{.Config.User}}' "$image")"
if [[ -z "$user" || "$user" == "root" || "$user" == "0" ]]; then
  echo "FAIL image runs as root"
  failures=$((failures + 1))
fi

docker stop -t 10 "$name" >/dev/null
exit_code="$(docker inspect --format '{{.State.ExitCode}}' "$name")"
if [[ "$exit_code" != "0" ]]; then
  echo "FAIL container exited with $exit_code on SIGTERM"
  failures=$((failures + 1))
fi

if ((failures > 0)); then
  docker logs "$name" || true
  exit 1
fi
echo "image smoke test passed"
