# Raw Markdown routes

Read this reference when you add a page, change MDX component usage, or change
the build and deployment path.

## Architecture decision

This repository uses Nextra 3 with the Next.js Pages Router and
[static export](https://nextra.site/docs/guide/static-exports). Nextra 3 does
not provide raw Markdown endpoints. Nextra 4 requires the App Router, and its
copy-page feature copies MDX source rather than a clean Markdown rendering.

[Next.js static export](https://nextjs.org/docs/pages/guides/static-exports)
does not support a runtime API route or rewrite for this purpose. A pre-build
projection into `public/` gives local development, static export, GitHub Pages,
and Nginx the same files.

Re-evaluate this decision only during an intentional framework migration.
Require the replacement to support clean Markdown, exact `.md` paths, static
export, component conversion, and fail-closed handling.

## Public contract

Append `.md` to an HTML documentation route to get clean Markdown:

| HTML route           | Raw Markdown route      |
| -------------------- | ----------------------- |
| `/docs`              | `/docs.md`              |
| `/docs/releases`     | `/docs/releases.md`     |
| `/docs/features/cli` | `/docs/features/cli.md` |

The mapping follows the public route. It does not follow the `.mdx` file name
when that file is an `index.mdx`.

## Source and generated files

The `.mdx` page is the source. `scripts/generateRawMarkdown.ts` creates a clean
GitHub Flavored Markdown projection under `public/` before the Next.js static
export.

Generated raw files have a sentinel and are ignored by Git:

```txt
public/docs.md
public/docs/**/*.md
```

Do not edit or commit them. The generator refuses to replace or delete a
reserved Markdown file without its generated sentinel.

Use:

```sh
bun run build:raw
bun run check:raw
```

`build:prep`, `dev`, and `build` run the generator. If you edit an MDX file
while `next dev` is already running, run `bun run build:raw` again to refresh
its `.md` route.

## Projection contract

The projector keeps normal Markdown and converts the supported MDX vocabulary:

- `Callout` becomes a labeled GitHub alert blockquote.
- `Steps` keeps its ordered content.
- `Tabs` becomes a sequence of labeled sections.
- `Cards` becomes a linked list.
- `Image` becomes a Markdown image.
- `Iframe` becomes a titled link.
- A static string inside `<code>` becomes inline code.
- Layout-only `div` elements keep their content.
- `br` becomes a Markdown line break.
- Useful code-fence filenames become adjacent Markdown text.
- Imports are removed.

The projector fails with the source file and line when it finds an unknown
component, dynamic expression, unsafe attribute, raw HTML, or unsupported
code-fence metadata. It must never discard unknown content silently.

When you introduce a new MDX construct:

1. Define its lossless Markdown representation.
2. Add the explicit projector transform.
3. Add a golden projection test.
4. Confirm that all documentation pages project.
5. Run the full build and inspect the emitted `.md` file under `out/`.

## Index policy

`public/llms.txt` lists the public pages and links to their raw Markdown
routes. Update frontmatter and navigation, then regenerate the index. Do not
edit `public/llms.txt` directly.

## Deployment

Next.js copies generated files from `public/` to `out/`. GitHub Pages serves
them from the static export. The repository Nginx configuration gives `.md`
files the `text/markdown; charset=utf-8` media type and returns 404 for a
missing `.md` path. Its HTML fallback checks `$uri.html` before `$uri`. This
order prevents a page asset directory, such as `/docs/guide/`, from hiding the
exported `/docs/guide.html` page.

After a deployment-path or asset-path change, use the production server
configuration to confirm all four conditions:

- Each documentation `.md` route returns `200` and readable UTF-8 Markdown.
- A missing `.md` route returns `404` instead of the HTML fallback.
- A page with a same-name asset directory still returns its exported HTML.
- The page assets return `200`.
