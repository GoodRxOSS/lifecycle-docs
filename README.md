# Lifecycle Docs 📕

Documentation for Lifecycle.

Agents and contributors must read `AGENTS.md` before making changes. For
documentation synchronization, gap analysis, or screenshot work, also follow
`.agents/skills/update-lifecycle-docs/SKILL.md`.

---

## Adding documentation

1. Create the `.mdx` page under `src/pages/docs`.
2. Add the required task and verification frontmatter:

   ```md
   ---
   title: My task
   description: Complete the task safely and verify the result.
   audience:
     - application-developer
   lastVerified: "<YYYY-MM-DD>"
   verificationBaseline: "<registered-baseline-id>"
   contentProfile: asd-ste100
   ---
   ```

   Use audience and baseline values registered in
   `documentation-metadata.json`. Add `supportStatus` only when that registry
   contains a product-approved value; omission does not mean Stable.

3. Read
   `.agents/skills/update-lifecycle-docs/references/language-profile.md`.
   Write the page to ASD-STE100 Issue 9. Use
   `.agents/skills/update-lifecycle-docs/references/ste100-review.md` to cover
   all 53 rule identifiers.
4. Add the page to the nearest `_meta.ts` in its intended public navigation
   order.
5. Put any maintained image under `public/` in a directory that mirrors the
   documentation route:

   ```txt
   src/pages/docs/troubleshooting/<new-page>.mdx
   public/docs/troubleshooting/<new-page>/
   ```

6. When adding a UI screenshot, follow the capture and catalog workflow in
   `.agents/skills/update-lifecycle-docs/references/screenshots.md`.

---

## External contract checks

`bun run check:contracts` validates against upstream contracts when their
portable inputs are supplied:

| Variable | Value |
| --- | --- |
| `DOCS_SCHEMA_VALIDATOR_COMMAND` | JSON argv array for the canonical validator; each extracted `filename="lifecycle.yaml"` file is appended |
| `DOCS_OPENAPI_SPEC_PATH` | Path to the reviewed OpenAPI JSON artifact |
| `DOCS_CLI_COMMAND` | JSON argv array for the reviewed `lfc` executable |

The default command reports every unavailable input as **SKIP**. Use
`bun run check:contracts --require-all` in a cross-repository validation job
that supplies all three inputs. Commands are argv arrays, not shell strings, so
the workflow remains portable and does not evaluate contributor-specific shell
syntax.

---

## Components

Lifecycle Docs provides a few extra components [in addition to components provided by Nextra](https://nextra.site/docs/built-ins).
View all the currently exported components [here](https://github.com/GoodRxOSS/lifecycle-docs/blob/main/src/components/index.tsx).

- Components like Image & Iframe have been added to make the docs look more consistent visually.
---

### `<Image>`

The `<Image>` component is a wrapper around next/image that provides a few extra features to make it easier to look nice in the docs.

```mdx
import { Image } from '@lifecycle-docs/components';

<Image src="/path/to/image.png" alt="Alt text" width={16} height={9} ratio={16 / 9} />
```

`alt` is required. Describe the information the image contributes to the
surrounding instructions.

You can constrain and center an image with normal layout classes:

```mdx
<div className="grid pt-6">
  <div className="w-[500px] place-self-center">
    <Image
      src="/custom-multi-service-lifecycle-environments/additional-optional-services.png"
      alt="Additional Optional Services"
      height={906}
      width={538}
      ratio={538 / 906}
    />
  </div>
</div>
```

---

### `<Iframe>`

The `<Iframe>` component is a wrapper around an iframe that provides a few extra features to make it easier to look nice in the docs.

```mdx
import { Iframe } from '@lifecycle-docs/components';

<Iframe src="https://example.com" title="Example" />
```

---

## Development

Install the Bun version declared by `packageManager`, then install dependencies:

```bash
bun install
```

Run the development server

```bash
bun run dev
```

Open the URL printed by the development server.

Before opening a pull request, run:

```bash
bun run verify
```

Useful focused checks:

```bash
bun run check:docs
bun run check:styles
bun run check:llms
bun run check:raw
bun run check:screenshots
```

`public/llms.txt` is generated from curated public navigation and page
frontmatter. Update the canonical page and `_meta.ts` files, then run
`bun run build:llms`; do not edit `public/llms.txt` directly.

## Raw Markdown

Every documentation route also has clean Markdown at the same path with `.md`
appended:

| HTML | Markdown |
| --- | --- |
| `/docs` | `/docs.md` |
| `/docs/features/cli` | `/docs/features/cli.md` |

`bun run build:raw` projects MDX into untracked files under `public/` before
the static build. Do not edit or commit `public/docs.md` or
`public/docs/**/*.md`.

The projector supports the repository component vocabulary and fails when a
component cannot be represented without content loss. Read
`.agents/skills/update-lifecycle-docs/references/raw-markdown.md` before you
add a new MDX construct.

`documentation-style-baseline.json` stores hashes for completed ASD-STE100
page reviews. It also tracks documentation navigation, the visible root Docs
navigation, and visible site chrome. After
the human review and focused checks pass, run
`bun run update:style-baseline`. Do not update the baseline only to silence a
content change.

The screenshot check validates references, intrinsic dimensions, catalog
coverage, review status, and detectable tracked-text markers. It cannot decide
whether rendered pixels show private data or whether the captured UI state is
current. Manually inspect every final image and record the review in
`.agents/skills/update-lifecycle-docs/references/screenshots.md`.

## Deployment

The canonical deployment path is the GitHub Actions workflow in
`.github/workflows/deploy.yml`. A push to `main` builds the static site and
publishes `out/` to the `gh-pages` branch.

`bun run deploy` creates the local static output and `.nojekyll` marker; it does
not authorize or perform a production publication. Do not switch deployment
branches, push generated output, or change GitHub Pages settings unless a
maintainer explicitly authorizes that external state change.

The public site is available at `https://uselifecycle.com/`.
