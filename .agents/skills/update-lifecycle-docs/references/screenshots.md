# Lifecycle documentation screenshots

Use this reference only when adding, replacing, or reviewing UI screenshots.

## Contents

- [When a screenshot is worth maintaining](#when-a-screenshot-is-worth-maintaining)
- [Capture standard](#capture-standard)
- [Fixture workflow](#fixture-workflow)
- [Asset placement and accessibility](#asset-placement-and-accessibility)
- [Screenshot catalog](#screenshot-catalog)
- [Capture checklist](#capture-checklist)

## When a Screenshot Is Worth Maintaining

Use a screenshot when it materially helps a reader:

- Recognize a page, dialog, or state
- Find an action in a dense interface
- Distinguish success, pending, and failure states
- Understand the relationship between an Environment, its Services, logs, or Agent activity

Do not use a screenshot for:

- Code, terminal commands, schemas, or API payloads
- Conceptual architecture that a diagram explains more clearly
- Decorative proof that a feature exists
- Rapidly changing Labs controls unless the page names the status and the catalog has a refresh owner

Keep the smallest screenshot set that explains the journey.

## Capture Standard

- Use the running local Lifecycle UI in desktop Chrome through Chrome DevTools.
- In the standard local workspace, verify the UI at `http://localhost:3000`.
  Follow the workspace operations guide and `lifecycle-ui/AGENTS.md` to start or
  authenticate it; do not invent credentials or bypass authentication.
- Set the viewport to 1440×900 at device scale factor 1 and browser zoom 100%.
- Use the light theme for the current screenshot series.
- Set `labs=true` before capturing Labs-gated surfaces.
- Wait for loading, transitions, toasts, and live updates to settle.
- Prefer a component or application-region capture. Keep enough surrounding UI for orientation.
- Use viewport position or element capture instead of editing pixels afterward.
- Do not bake arrows, labels, or explanatory text into the bitmap; put explanation in prose and captions.
- Do not use generative image editing on product screenshots.
- Capture PNG for UI text. Optimize only when legibility and dimensions remain unchanged.
- Keep raw captures in task scratch; only reviewed images belong in `public/`.
- If Chrome DevTools cannot persist a file, capture the returned image bytes exactly through a trusted local tool. Do not re-render or transform the UI.
- Prefer neutral fixture values at the source. If an authorized private
  fixture's identity is incidental and cannot be avoided, replace only
  identity-bearing DOM text and links before capture. Record the substitutions
  in task scratch, never alter product labels, statuses, controls, or messages,
  and re-inspect the final image.

Use neutral fixtures. Exclude or avoid:

- Tokens, secrets, environment-variable values, and one-time credentials
- Personal names, avatars, emails, and private repository ownership
- Internal cluster identifiers or unrelated local resources
- Incidental timestamps, random identifiers, and hostnames when they do not teach the task
- Browser chrome, developer-tool overlays, unrelated tabs, and transient notifications

Crop or choose a narrower UI region rather than blurring. If a user-facing identifier is necessary to explain the task, use a neutral fixture value.

## Fixture Workflow

Use only a fixture repository explicitly authorized for the task. In the
standard personal workspace, the root workspace instructions may name one.
Resolve its actual GitHub identity from the local worktree instead of recording
a private repository or owner in tracked documentation:

```sh
git -C <fixture-worktree> remote get-url origin
gh repo view <owner>/<repository> --json nameWithOwner,defaultBranchRef,viewerPermission
```

Before mutation:

1. Confirm that the user authorized creating a PR and changing external
   repository state for the capture.
2. Inspect the exact repository, worktree status, existing worktrees, open PRs, and current `lifecycle.yaml`.
3. Never switch the user's existing checkout or reuse, close, or modify a pre-existing PR.
4. Create a unique branch in a temporary git worktree from `origin/main`.
5. Use one minimal Service and a neutral PR title.
6. Never merge a fixture PR.
7. Record the branch, PR, Environment UUID, and cleanup status in task scratch.

Use this minimal healthy manifest when the current schema still validates it:

```yaml
---
version: "2.1.0"

environment:
  autoDeploy: false
  defaultServices:
    - name: web

services:
  - name: web
    docker:
      dockerImage: nginx
      defaultTag: 1.27.4-alpine
      ports:
        - 80
      deployment:
        public: true
        resource:
          cpu:
            request: 10m
          memory:
            request: 50Mi
        readiness:
          tcpSocketPort: 80
```

Validate it against the current Lifecycle schema before use. Apply `lifecycle-deploy!` and, only when needed, `lifecycle-status-comments!`.

To produce a deterministic image/deploy failure after capturing the healthy state, change only the tag to a clearly nonexistent value and push another commit. For a distinct build failure, use a GitHub Service with a deliberately missing Dockerfile path only after validating that fixture against the current schema.

Cleanup order:

1. Verify the PR's head branch exactly matches the recorded fixture branch.
2. Close the PR without deleting the branch.
3. Wait for teardown and confirm the Environment namespace is gone.
4. Delete only the recorded remote branch.
5. Remove the temporary worktree.
6. Attempt to delete the local branch with `git branch -d`. A fixture branch
   from an unmerged, closed PR may require `git branch -D`; before doing that,
   re-verify its exact name and commit against the task record and confirm the
   remote branch and Environment are already gone.
7. Stop if cleanup finds unexpected changes or a target mismatch.

Long term, prefer a dedicated GoodRx-owned public documentation fixture repository. The private shared test repository is suitable for controlled local captures but creates avoidable ownership and accumulated-state noise.

## Asset Placement and Accessibility

- Mirror the page route under `public/docs/`; for example, a screenshot for `/docs/troubleshooting/deploy-issues` belongs under `public/docs/troubleshooting/deploy-issues/`.
- Use a descriptive, stable filename such as `service-deploy-failure.png`, not a UUID or date.
- Add explicit `width`, `height`, and `ratio` to `<Image>`.
- Write alt text that explains the information contributed by the image, not every visible control.
- Keep all operational instructions in nearby text so the page remains usable without the image.
- Add a caption when the state, scope, or support status is not obvious.

## Screenshot Catalog

Update this table whenever a tracked screenshot is added or refreshed.

| Asset                                                             | Docs page                                   | User point                                                  | UI route/state                                                              | Fixture                                                                                                     | Viewport/theme   | UI commit                                  | Last verified |
| ----------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------ | ------------- |
| `/docs/getting-started/explore-environment/environment-ready.png` | `/docs/getting-started/explore-environment` | Recognize a ready Environment and Service                   | `/environments/<uuid>`, selected Service Summary, `Deployed` / `Ready`      | Temporary authorized private fixture; one Docker Service; identity values neutralized; cleaned up           | 1440×900 / light | `b1df0cd64b4680fb241364be6cab985a2dce1f4f` | 2026-07-24    |
| `/docs/troubleshooting/deploy-issues/service-deploy-failure.png`  | `/docs/troubleshooting/deploy-issues`       | Recognize failure signals and find the first failure reason | `/environments/<uuid>`, selected Service Summary, `Error` / `Deploy failed` | Temporary authorized private fixture; nonexistent Docker image tag; identity values neutralized; cleaned up | 1440×900 / light | `b1df0cd64b4680fb241364be6cab985a2dce1f4f` | 2026-07-24    |

The images under `public/getting-started/` predate this catalog. Treat their
fixture, source revision, and freshness as unknown until they are recaptured or
explicitly verified.

## Capture Checklist

- [ ] The screenshot teaches a point that text or a diagram cannot communicate as well.
- [ ] The owning UI behavior was verified in the running app.
- [ ] The fixture is neutral, minimal, and recorded.
- [ ] Loading, animation, and transient UI have settled.
- [ ] No secret, personal, private, or unrelated data is visible.
- [ ] The crop retains enough context for orientation.
- [ ] Alt text and adjacent instructions carry the same essential meaning.
- [ ] The asset path and catalog entry are updated.
- [ ] The rendered page was checked in every theme enabled by
      `src/theme.config.tsx` (currently dark only).
- [ ] Temporary PR, branch, Environment, Site, or session state was cleaned up.
