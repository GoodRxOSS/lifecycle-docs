/**
 * Copyright 2026 GoodRx, Inc.
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

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  ".webmanifest": "application/manifest+json",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const STATIC_ASSETS = new Set([
  ".ico",
  ".css",
  ".js",
  ".gif",
  ".jpg",
  ".jpeg",
  ".png",
  ".woff",
  ".woff2",
  ".eot",
  ".ttf",
  ".otf",
  ".svg",
  ".map",
]);

const RETIRED_ROUTE = /^\/docs\/cm(?:\.md|\/.*)?$/;

async function findFile(candidate) {
  try {
    const info = await stat(candidate);
    return info.isFile() ? candidate : null;
  } catch {
    return null;
  }
}

/**
 * Maps a decoded URL path to the file to serve and its status.
 *
 * Raw Markdown and static assets fail closed with the exported 404 page instead of the HTML shell, so
 * agents fetching `.md` never receive HTML. HTML routes prefer `<route>.html` over a same-name asset
 * directory, then fall back to `index.html` for client-side routing.
 */
export async function resolveRequest(root, urlPath) {
  const notFound = {
    file: await findFile(join(root, "404.html")),
    status: 404,
  };
  if (RETIRED_ROUTE.test(urlPath)) return notFound;

  const base = join(root, normalize(urlPath).replace(/^[/\\]+/, ""));
  if (base !== root && !base.startsWith(root + sep)) return notFound;

  const ext = extname(urlPath).toLowerCase();
  if (ext === ".md" || STATIC_ASSETS.has(ext)) {
    const file = await findFile(base);
    return file ? { file, status: 200 } : notFound;
  }

  for (const candidate of [
    `${base}.html`,
    base,
    join(base, "index.html"),
    join(root, "index.html"),
  ]) {
    const file = await findFile(candidate);
    if (file) return { file, status: 200 };
  }
  return notFound;
}

export function createStaticServer(rootDir) {
  const root = resolve(rootDir);
  return createServer(async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }

    let urlPath;
    try {
      urlPath = decodeURIComponent(
        new URL(req.url ?? "/", "http://localhost").pathname,
      );
    } catch {
      res.writeHead(400).end();
      return;
    }

    const { file, status } = await resolveRequest(root, urlPath);
    if (!file) {
      res.writeHead(status).end();
      return;
    }

    const { size } = await stat(file);
    const ext = extname(file).toLowerCase();
    res.writeHead(status, {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Content-Length": size,
      "Cache-Control":
        status === 200 && STATIC_ASSETS.has(ext)
          ? "public, max-age=15552000"
          : "no-cache",
      "X-Content-Type-Options": "nosniff",
    });

    if (req.method === "HEAD") {
      res.end();
      return;
    }
    createReadStream(file)
      .on("error", () => res.destroy())
      .pipe(res);
  });
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const root = process.env.STATIC_ROOT ?? "/app/public";
  const port = Number(process.env.PORT ?? 8080);
  const server = createStaticServer(root);
  server.keepAliveTimeout = 65_000;
  server.listen(port, () => console.log(`serving ${root} on :${port}`));

  for (const signal of ["SIGTERM", "SIGINT"]) {
    process.on(signal, () => server.close(() => process.exit(0)));
  }
}
