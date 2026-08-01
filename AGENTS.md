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

Resolve product sources from the task context instead of assuming a particular
workspace layout. Prefer, in order:

1. A source checkout or path explicitly supplied for the task
2. A configured workspace mapping
3. The upstream commit or PR head SHA, schema, OpenAPI document, release
   artifact, or published repository

These optional environment variables provide a portable source map for scripts
and agent sessions:

| Variable                     | Owning source                                     |
| ---------------------------- | ------------------------------------------------- |
| `LIFECYCLE_SOURCE_DIR`       | API, OpenAPI, `lifecycle.yaml`, and Agent runtime |
| `LIFECYCLE_UI_SOURCE_DIR`    | UI routes, labels, states, and interactions       |
| `LIFECYCLE_CLI_SOURCE_DIR`   | CLI commands, flags, output, and exit behavior    |
| `LIFECYCLE_HELM_SOURCE_DIR`  | Installation defaults and Helm values             |
| `LIFECYCLE_INFRA_SOURCE_DIR` | Demo/evaluation infrastructure                    |

For automated cross-repository checks, provide
`DOCS_SCHEMA_VALIDATOR_COMMAND`, `DOCS_OPENAPI_SPEC_PATH`, and
`DOCS_CLI_COMMAND` as documented in `README.md`. Run
`bun run check:contracts --require-all` when all three reviewed artifacts are
available. A reported **SKIP** is not contract verification.

Do not require those exact variables when another authoritative source is
already available. If an owning source cannot be resolved, require an upstream
PR, commit, contract artifact, or maintainer decision. Mark the claim
unverified instead of guessing. Never use an existing docs page as proof that
the same page is correct.

Before editing, record the exact owning source revision for each claim. If a
checkout is dirty, distinguish committed evidence from uncommitted behavior.
When no checkout is available, use an immutable public commit, exact PR head
SHA, release, or contract URL. If none exists, stop at an explicit unverified
claim or decision request; do not fill the gap from memory.

The public explanation, navigation, and task guidance belong in this
repository only after the owning product contract has been verified.

## Authoring Rules

- Read
  `.agents/skills/update-lifecycle-docs/references/language-profile.md`
  completely before any end-user content change.
- Name the intended reader and task before editing.
- Lead with the outcome, then prerequisites, steps, expected result, recovery, and next action.
- Explain user-observable behavior rather than internal implementation.
- Keep source comparisons, code-comment discrepancies, verification reasoning,
  and implementation evidence in private review notes. Do not publish them as
  end-user documentation.
- In the final user-voice review, keep each sentence only when it helps the
  reader understand, complete, verify, or recover the documented task.
- Prefer canonical product language. Use **Environment** for the user concept; mention **Build** only when an API or CLI compatibility context requires it.
- Give every page useful `title`, `description`, `audience`, `lastVerified`,
  and `verificationBaseline` frontmatter. Resolve allowed values and exact
  source revisions through `documentation-metadata.json`.
- Prefer updating an existing page unless a distinct user task needs its own page.
- Put copyable code, commands, and payloads in text—not screenshots.
- Give every meaningful image descriptive alt text and adjacent instructions or a caption.
- Give every iframe a useful title.
- Clearly label Stable, Alpha/Beta, Labs, admin-gated, evaluation-only, and production-supported behavior.
- Add `supportStatus` only when a product or release decision establishes it;
  the absence of the field never implies Stable.
- Use a product decision, release note, or visible product label as the source
  for support status. Code presence alone does not prove public support; if the
  status is unresolved, say so in the handoff instead of inventing a label.
- Never publish credentials, secret values, broad secret-decoding commands, direct database mutation as normal setup, or destructive diagnostic shortcuts.
- Do not expose private repository ownership, personal identities, access tokens, internal-only hostnames, or incidental local data in screenshots.
- Keep tracked agent guidance portable. Do not record contributor-specific
  filesystem paths, fixed development hosts or ports, private fixture
  repositories, local credentials, or one workspace's process-management
  rules.
- Treat generated navigation and `public/llms.txt` as derivatives. Update their
  canonical page/frontmatter/navigation sources, then run the generators and
  review the diff; do not hand-edit generated output.
- Preserve unrelated changes and review generated `_meta.ts` output for accidental ordering churn.

## ASD-STE100 Language Profile

- Maintain one end-user documentation tree under `src/pages/docs/**`.
- Apply ASD-STE100 Issue 9 to every title, description, heading,
  paragraph, callout, table, list, link label, caption, and image alt text.
- Apply the same profile to maintained navigation titles and visible
  site-chrome copy.
- Use
  `.agents/skills/update-lifecycle-docs/references/ste100-review.md` to review
  all 53 rule identifiers for every changed page.
- Set `contentProfile: asd-ste100` on each page.
- Do not create a page-level ASD-STE100 exclusion.
- Run `bun run check:styles`.
- Update `documentation-style-baseline.json` only after the complete human
  review. The baseline covers pages, documentation navigation, root Docs
  navigation, and visible site chrome. A matching hash records review
  coverage; it does not certify ASD-STE100 compliance.
- Do not copy or commit the ASD-STE100 PDF, dictionaries, licensed checker
  data, or verbatim rule text.

## Raw Markdown

- Read
  `.agents/skills/update-lifecycle-docs/references/raw-markdown.md` before you
  add an MDX construct or change the build path.
- Every HTML documentation route must also work when `.md` is appended.
- `scripts/generateRawMarkdown.ts` is the fail-closed MDX-to-GFM projector.
- Treat `public/docs.md` and `public/docs/**/*.md` as untracked generated
  files. Do not edit or commit them.
- Add an explicit projector transform and a golden test for each new MDX
  construct. Never discard an unknown construct silently.
- Keep `public/llms.txt` canonical-only and link it to the raw `.md` routes.
- Run `bun run check:raw` and confirm the static build contains every expected
  Markdown route.

## UI and Screenshot Work

- Resolve the UI URL from the task, runtime output, or `LIFECYCLE_UI_URL`;
  never assume a host or port.
- Verify UI claims in a running desktop UI through an available browser
  inspection tool; source inspection alone is not enough for visual behavior.
- Use a 1440×900 desktop viewport. Do not add mobile captures unless the task explicitly requires them.
- Enable Labs only through the supported task/runtime procedure, and label
  Labs surfaces in the resulting documentation.
- Never create a fixture PR, push a fixture branch, or mutate another external
  repository unless the user authorized that external state change.
- Before any authorized external mutation, record the exact target and
  pre-existing state. Record every created PR, branch, Environment, Site, or
  session and its cleanup result. Authorization to create state does not imply
  permission to merge, reuse, or delete unrelated state.
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

The suite includes STE100 mechanical checks, style-review hashes, and raw
Markdown projection.

When the task changes schema, API, or CLI claims, also supply the exact reviewed
contract inputs and run:

```sh
bun run check:contracts --require-all
```

For screenshot changes, also inspect the focused output from
`bun run check:screenshots`. It verifies structural properties but cannot
replace manual review of rendered pixels and live UI state.

When content or visuals change, inspect the rendered routes with an approved
desktop browser inspection tool. If no such tool or authenticated runtime is
available, report visual verification as incomplete; do not infer rendered
behavior from source or disrupt another session's browser. Derive the required
theme checks from `src/theme.config.tsx` instead of recording a theme
assumption in tracked guidance.

For local rendering, run `bun run dev` and use the URL printed by the
development server. A caller may supply `DOCS_BASE_URL` when verification is
performed against an existing preview or deployment.

In the PR summary, identify:

- Intended reader and task
- Exact owning source revisions or immutable artifacts used for each claim
- Changed pages
- Runtime/browser verification
- A sanitized external-state authorization and cleanup assertion, when
  applicable. Keep private fixture repositories, branches, PRs, users, and
  other contributor-specific identifiers in task scratch; include only public
  or non-sensitive references in the PR.
- Screenshot structural audit and manual pixel/state review, when applicable
