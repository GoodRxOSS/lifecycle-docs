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

import nextra from "nextra";
import { remarkCodeHike, recmaCodeHike } from "codehike/mdx";

/** @type {import('codehike/mdx').CodeHikeConfig} */
export const chConfig = {
  components: { code: "Code" },
  syntaxHighlighting: {
    theme: "github-dark",
  },
}

export const mdxOptions = {
  remarkPlugins: [[remarkCodeHike, chConfig]],
  recmaPlugins: [[recmaCodeHike, chConfig]],
  // jsx: true,
}


const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./src/theme.config.tsx",
  codeHighlight: false,
  staticImage: true,
  defaultShowCopyCode: true,
  mdxOptions,
});

const nextConfig = {
  output: 'export',
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx", "css"],
  reactStrictMode: true,
  assetPrefix: '/lifecycle-docs',
  basePath: '/lifecycle-docs',
  eslint: {
    dirs: ["src"],
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }

    // Support CodeHike
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'github-production-user-asset-6210df.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'img.shields.io',
      },
    ],
    unoptimized: true,
  },
};

export default withNextra(nextConfig);
