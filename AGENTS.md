# Lifecycle Docs Agent Guide

Lifecycle Docs is the public, end-user documentation for Lifecycle. Keep it accurate, task-oriented, safe to follow, and easy to scan.

## Load Order

1. Read `PRODUCT.md` for audiences, voice, and accessibility goals. It is editorial direction, not product-behavior truth.
2. Read `README.md` for MDX and component mechanics.
3. Read the target page, its nearest `_meta.ts`, and adjacent pages before editing.
4. Read `DESIGN.md` and `DESIGN.json` only for component, layout, brand, or visual-system work.
5. Inspect the owning product source before asserting behavior.
6. Use `$update-lifecycle-docs` for documentation synchronization, new guides, troubleshooting, or UI screenshots.

## Sources of Truth

When sibling repositories are available, route claims as follows:

| Claim                                                               | Owning source                                                  |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| Product behavior, API, OpenAPI, `lifecycle.yaml`, and Agent runtime | `../lifecycle`                                                 |
| UI routes, labels, states, and interactions                         | `../lifecycle-ui` and the running UI                           |
| CLI commands, flags, output, and exit behavior                      | `../lifecycle-cli`                                             |
| Installation defaults and Helm values                               | `../helm-charts`                                               |
| Demo/evaluation infrastructure                                      | `../lifecycle-opentofu`; never imply it is production guidance |
| Public explanation, navigation, and task guidance                   | This repository, after verifying the owner above               |

If an owning repository is unavailable, require an upstream PR, commit, schema, or other authoritative artifact. Mark behavior as unverified instead of guessing. Never use an existing docs page as proof that the same page is correct.

## Authoring Rules

- Name the intended reader and task before editing.
- Lead with the outcome, then prerequisites, steps, expected result, recovery, and next action.
- Explain user-observable behavior rather than internal implementation.
- Prefer canonical product language. Use **Environment** for the user concept; mention **Build** only when an API or CLI compatibility context requires it.
- Give every page useful `title` and `description` frontmatter.
- Prefer updating an existing page unless a distinct user task needs its own page.
- Put copyable code, commands, and payloads in text—not screenshots.
- Give every meaningful image descriptive alt text and adjacent instructions or a caption.
- Give every iframe a useful title.
- Clearly label Stable, Alpha/Beta, Labs, admin-gated, evaluation-only, and production-supported behavior.
- Use a product decision, release note, or visible product label as the source
  for support status. Code presence alone does not prove public support; if the
  status is unresolved, say so in the handoff instead of inventing a label.
- Never publish credentials, secret values, broad secret-decoding commands, direct database mutation as normal setup, or destructive diagnostic shortcuts.
- Do not expose private repository ownership, personal identities, access tokens, internal-only hostnames, or incidental local data in screenshots.
- Preserve unrelated changes and review generated `_meta.ts` output for accidental ordering churn.

## UI and Screenshot Work

- Verify UI claims in the running desktop UI through Chrome DevTools; source inspection alone is not enough for visual behavior.
- Use a 1440×900 desktop viewport. Do not add mobile captures unless the task explicitly requires them.
- Set `labs=true` before inspecting Labs-gated surfaces.
- The common local UI URL is `http://localhost:3000`; confirm it from the
  current workspace run instructions rather than assuming it.
- Never create a fixture PR, push a fixture branch, or mutate another external
  repository unless the user authorized that external state change.
- Capture only stable, task-relevant states. Prefer focused application regions over full browser windows.
- Use neutral, reversible fixture data and meaningful alt text. Do not use blur or generative editing to hide sensitive content.
- Read `.agents/skills/update-lifecycle-docs/references/screenshots.md` before creating or refreshing screenshots.

## Verification

Format only the files you changed:

```sh
bunx prettier --check <changed-files>
```

Run the repository verification suite:

```sh
bun run verify
```

When content or visuals change, inspect the rendered routes in desktop Chrome.
Check every theme enabled in `src/theme.config.tsx`; the current site forces the
dark theme. If a change enables another theme, verify that theme before
shipping.

For local rendering, run `bun run dev` and open `http://localhost:3333`.

In the PR summary, identify:

- Intended reader and task
- Owning source or commit used for verification
- Changed pages
- Runtime/browser verification
- Screenshot fixture and cleanup, when applicable
