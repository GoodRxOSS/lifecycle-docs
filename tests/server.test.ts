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

import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import fs from "node:fs";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import os from "node:os";
import path from "node:path";
import { createStaticServer } from "../server.mjs";

const files: Record<string, string> = {
  "index.html": "<p>shell</p>",
  "404.html": "<p>not found</p>",
  "docs/guide.html": "<p>guide page</p>",
  "docs/guide/diagram.png": "png",
  "docs/guide.md": "# Guide",
  "docs/cm.html": "<p>retired</p>",
  "docs/cm.md": "# Retired",
  "docs/cm/old.html": "<p>retired child</p>",
  "docs/section/index.html": "<p>section index</p>",
  "_next/static/app.js": "console.log(1)",
};

let root: string;
let server: Server;
let baseUrl: string;

beforeAll(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "lifecycle-docs-server-"));
  for (const [relative, contents] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
    fs.writeFileSync(path.join(root, relative), contents);
  }
  server = createStaticServer(root);
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

afterAll(async () => {
  await new Promise((done) => server.close(done));
  fs.rmSync(root, { recursive: true, force: true });
});

async function get(route: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${route}`, init);
  return {
    status: response.status,
    type: response.headers.get("content-type"),
    cache: response.headers.get("cache-control"),
    body: await response.text(),
  };
}

describe("static server", () => {
  test("serves raw Markdown as UTF-8 Markdown", async () => {
    expect(await get("/docs/guide.md")).toMatchObject({
      status: 200,
      type: "text/markdown; charset=utf-8",
      body: "# Guide",
    });
  });

  test("returns the exported 404 page for missing Markdown instead of the HTML shell", async () => {
    expect(await get("/docs/missing.md")).toMatchObject({
      status: 404,
      body: "<p>not found</p>",
    });
  });

  test("returns 404 for the retired /docs/cm routes", async () => {
    for (const route of [
      "/docs/cm",
      "/docs/cm.md",
      "/docs/cm/old",
      "/docs/cm.md/",
      "/docs/cm.html",
      "/docs/cm.html/",
    ]) {
      expect(await get(route)).toMatchObject({
        status: 404,
        body: "<p>not found</p>",
      });
    }
  });

  test("prefers an exported HTML page over a same-name asset directory", async () => {
    expect(await get("/docs/guide")).toMatchObject({
      status: 200,
      type: "text/html; charset=utf-8",
      body: "<p>guide page</p>",
    });
    expect((await get("/docs/guide/diagram.png")).body).toBe("png");
  });

  test("serves directory index pages and falls back to the shell for unknown routes", async () => {
    expect((await get("/docs/section")).body).toBe("<p>section index</p>");
    expect(await get("/docs/unknown")).toMatchObject({
      status: 200,
      body: "<p>shell</p>",
    });
  });

  test("caches static assets and 404s missing ones", async () => {
    expect(await get("/_next/static/app.js")).toMatchObject({
      status: 200,
      cache: "public, max-age=15552000",
    });
    expect(await get("/_next/static/missing.js")).toMatchObject({
      status: 404,
      cache: "no-cache",
      body: "<p>not found</p>",
    });
  });

  test("serves the root index without looking outside the root", async () => {
    fs.writeFileSync(`${root}.html`, "outside");
    try {
      expect(await get("/")).toMatchObject({
        status: 200,
        body: "<p>shell</p>",
      });
    } finally {
      fs.rmSync(`${root}.html`);
    }
  });

  test("does not serve files outside the root", async () => {
    fs.writeFileSync(`${root}-sibling.md`, "outside");
    try {
      for (const route of [
        "/%2e%2e/%2e%2e/etc/passwd",
        `/..%2f${path.basename(root)}-sibling.md`,
      ]) {
        const response = await get(route);
        expect(response.body).not.toContain("root:");
        expect(response.body).not.toBe("outside");
      }
    } finally {
      fs.rmSync(`${root}-sibling.md`);
    }
  });

  test("normalizes the path before applying the retired-route rule", async () => {
    for (const route of [
      "//docs/cm",
      "/docs//cm",
      "/docs/x/..%2fcm",
      "/docs/cm/%0a%2f..%2f..%2fcm",
    ]) {
      expect((await get(route)).status).toBe(404);
    }
  });

  test("rejects malformed and NUL-containing paths", async () => {
    expect((await get("/%ff")).status).toBe(400);
    expect((await get("/docs%00.md")).status).toBe(400);
  });

  test("answers HEAD without a body and revalidates with 304", async () => {
    const head = await fetch(`${baseUrl}/docs/guide.md`, { method: "HEAD" });
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");

    const etag = head.headers.get("etag") ?? "";
    expect(etag).not.toBe("");
    const revalidated = await fetch(`${baseUrl}/docs/guide.md`, {
      headers: { "If-None-Match": etag },
    });
    expect(revalidated.status).toBe(304);
  });

  test("rejects methods other than GET and HEAD", async () => {
    expect((await get("/", { method: "POST" })).status).toBe(405);
  });
});
