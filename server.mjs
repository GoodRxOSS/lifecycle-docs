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
import { extname, join, posix, resolve } from "node:path";
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
  ".wasm": "application/wasm",
  ".htm": "text/html; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".rss": "application/rss+xml",
  ".atom": "application/atom+xml",
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

const RETIRED_ROUTE = /^\/docs\/cm(?:\.md|\/[\s\S]*)?$/;
const SHUTDOWN_TIMEOUT_MS = 25_000;

async function findFile(candidate) {
  try {
    const info = await stat(candidate);
    return info.isFile() ? { path: candidate, info } : null;
  } catch {
    return null;
  }
}

/**
 * Turns a raw request target into a canonical absolute path, or null when it cannot be served.
 *
 * Slashes are collapsed and dot segments resolved before any routing rule runs, so `/docs//cm` or
 * `/docs/x/..%2fcm` cannot slip past the retired-route check, and no path can climb above the root.
 */
export function canonicalPath(target) {
  const raw = (target ?? "/").split(/[?#]/, 1)[0];
  let decoded;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }
  if (decoded.includes("\0")) return null;
  return posix.normalize(
    `/${decoded.replace(/\\/g, "/")}`.replace(/\/+/g, "/"),
  );
}

/**
 * Maps a canonical URL path to the file to serve and its status.
 *
 * Raw Markdown and static assets fail closed with the exported 404 page instead of the HTML shell, so
 * agents fetching `.md` never receive HTML. HTML routes prefer `<route>.html` over a same-name asset
 * directory, then fall back to `index.html` for client-side routing.
 */
export async function resolveRequest(root, urlPath) {
  const notFound = async () => ({
    file: await findFile(join(root, "404.html")),
    status: 404,
  });
  if (RETIRED_ROUTE.test(urlPath)) return notFound();

  const route = urlPath.replace(/\/+$/, "");
  const base = join(root, route);

  const ext = extname(route);
  if (ext === ".md" || STATIC_ASSETS.has(ext.toLowerCase())) {
    const file = await findFile(base);
    return file ? { file, status: 200 } : notFound();
  }

  const candidates = route
    ? [`${base}.html`, base, join(base, "index.html")]
    : [join(root, "index.html")];
  for (const candidate of [...candidates, join(root, "index.html")]) {
    const file = await findFile(candidate);
    if (file) return { file, status: 200 };
  }
  return notFound();
}

function isNotModified(req, etag, mtime) {
  const ifNoneMatch = req.headers["if-none-match"];
  if (ifNoneMatch) {
    return ifNoneMatch.split(",").some((tag) => tag.trim() === etag);
  }
  const ifModifiedSince = Date.parse(req.headers["if-modified-since"] ?? "");
  return (
    !Number.isNaN(ifModifiedSince) &&
    Math.floor(mtime.getTime() / 1000) <= Math.floor(ifModifiedSince / 1000)
  );
}

export function createStaticServer(rootDir) {
  const root = resolve(rootDir);
  return createServer(async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }

    const urlPath = canonicalPath(req.url);
    if (!urlPath) {
      res.writeHead(400).end();
      return;
    }

    const { file, status } = await resolveRequest(root, urlPath);
    if (!file) {
      res.writeHead(status).end();
      return;
    }

    const { size, mtime } = file.info;
    const ext = extname(file.path).toLowerCase();
    const etag = `W/"${size.toString(16)}-${mtime.getTime().toString(16)}"`;
    const headers = {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Cache-Control":
        status === 200 && STATIC_ASSETS.has(ext)
          ? "public, max-age=15552000"
          : "no-cache",
      ETag: etag,
      "Last-Modified": mtime.toUTCString(),
      "X-Content-Type-Options": "nosniff",
    };

    if (status === 200 && isNotModified(req, etag, mtime)) {
      res.writeHead(304, headers).end();
      return;
    }

    res.writeHead(status, { ...headers, "Content-Length": size });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    createReadStream(file.path)
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
    process.on(signal, () => {
      server.close(() => process.exit(0));
      server.closeIdleConnections();
      setTimeout(() => process.exit(0), SHUTDOWN_TIMEOUT_MS).unref();
    });
  }
}
