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

- Resolve the running Lifecycle UI from the task context, runtime output, or
  `LIFECYCLE_UI_URL`. Never assume a host, port, authentication provider, or
  test user.
- Use an available desktop browser inspection tool and an authorized,
  authenticated non-production session. Follow the owning UI repository's
  instructions when they are available; do not invent credentials or bypass
  authentication.
- Set the viewport to 1440×900 at device scale factor 1 and browser zoom 100%.
- Use the theme required by the page and keep a screenshot series consistent.
  Record the chosen theme in the catalog rather than assuming one here.
- Enable Labs only through the supported task/runtime procedure. Do not publish
  a local cookie or developer bypass as an end-user enablement step.
- Wait for loading, transitions, toasts, and live updates to settle.
- Prefer a component or application-region capture. Keep enough surrounding UI for orientation.
- Use viewport position or element capture instead of editing pixels afterward.
- Do not bake arrows, labels, or explanatory text into the bitmap; put explanation in prose and captions.
- Do not use generative image editing on product screenshots.
- Capture PNG for UI text. Optimize only when legibility and dimensions remain unchanged.
- Keep raw captures in task scratch; only reviewed images belong in `public/`.
- If the browser tool cannot persist a file, save the returned image bytes
  exactly through a trusted task-local mechanism. Do not re-render or transform
  the UI.
- Prefer neutral fixture values at the source. For an authorized,
  non-production fixture whose incidental identity, hostname, UUID, or
  timestamp cannot be controlled at the source or cropped without losing the
  teaching point, substitute only those identity-bearing DOM text or link
  values before capture. Record every substitution in task scratch, preserve
  product labels, statuses, actions, controls, and messages exactly, and
  re-inspect the final pixels and live state. Never use this exception for
  private or production data.
- If no approved browser tool or authenticated runtime is available, stop the
  capture and report visual verification as incomplete. Do not infer the
  rendered state from source or disrupt another session's browser.

Use neutral fixtures. Exclude or avoid:

- Tokens, secrets, environment-variable values, and one-time credentials
- Personal names, avatars, emails, and private repository ownership
- Internal cluster identifiers or unrelated local resources
- Incidental timestamps, random identifiers, and hostnames when they do not teach the task
- Browser chrome, developer-tool overlays, unrelated tabs, and transient notifications

Crop or choose a narrower UI region rather than blurring. If a user-facing identifier is necessary to explain the task, use a neutral fixture value.

## Fixture Workflow

Use only a disposable fixture repository explicitly authorized for the task.
Resolve its identity at runtime from `DOCS_SCREENSHOT_FIXTURE_REPOSITORY`, the
task context, or the fixture checkout. Never put a private repository or owner
in tracked instructions:

```sh
gh repo view "$DOCS_SCREENSHOT_FIXTURE_REPOSITORY" \
  --json nameWithOwner,defaultBranchRef,viewerPermission
```

Before mutation:

1. Confirm the user authorized every planned external mutation: branch push,
   PR creation, label or comment changes, PR closure, branch deletion, and
   resulting Lifecycle resource creation/cleanup.
2. Inspect and record the exact repository, default branch, current revision,
   worktree status, existing worktrees, open PRs, and current `lifecycle.yaml`.
3. Never switch the user's existing checkout or reuse, close, or modify a pre-existing PR.
4. Resolve the fixture's default branch and remote, then create a unique branch
   in an isolated temporary worktree from the fetched default-branch revision.
5. Use one minimal Service and a neutral PR title.
6. Never merge a fixture PR.
7. Record the branch, PR, Environment UUID, and cleanup status in task scratch.

Build the smallest fixture from the current authoritative schema. Do not keep a
copy of a product manifest in this skill: it will drift independently from the
runtime contract. Validate the fixture with the current server-side validator
before pushing it. Use current configured control labels rather than assuming
their default names.

For a failure screenshot, prefer a deterministic, reversible fault with one
changed input. Record the exact change and verify that the resulting user-facing
state is the state the guide explains. Do not infer a build-versus-deploy
failure from the fixture alone.

Cleanup order:

1. Verify the PR's head branch exactly matches the recorded fixture branch.
2. Close the PR without deleting the branch.
3. Wait for teardown and confirm the recorded Environment reached the expected
   terminal cleanup state, such as `Torn down`, through the user-visible UI or
   supported API. Lifecycle can retain terminal Environment history. Use
   cluster inspection only when the task explicitly includes operator access.
4. Delete only the recorded remote branch.
5. Remove the temporary worktree.
6. Attempt to delete the local branch with `git branch -d`. A fixture branch
   from an unmerged, closed PR may require `git branch -D`; before doing that,
   re-verify its exact name and commit against the task record and confirm the
   remote branch is gone and the Environment reached its terminal cleanup
   state.
7. Stop if cleanup finds unexpected changes or a target mismatch.

If any authorized cleanup cannot complete, leave unrelated state untouched and
report the exact remaining PR, branch, Environment, Site, or session identifier
and the last verified state in the private task handoff. Use only a sanitized
cleanup statement in a public PR or issue.

## Asset Placement and Accessibility

- Mirror the page route under `public/docs/`; for example, a screenshot for `/docs/troubleshooting/deploy-issues` belongs under `public/docs/troubleshooting/deploy-issues/`.
- After you add a page asset directory, test the parent HTML route through the
  deployment server. The server must prefer the exported `.html` file over the
  same-name directory.
- Use a descriptive, stable filename such as `service-deploy-failure.png`, not a UUID or date.
- Add explicit `width`, `height`, and `ratio` to `<Image>`.
- Write alt text that explains the information contributed by the image, not every visible control.
- Keep all operational instructions in nearby text so the page remains usable without the image.
- Add a caption when the state, scope, or support status is not obvious.

## Screenshot Catalog

Update this table whenever a tracked screenshot is added, refreshed, removed,
or found to be stale. `keep` means the final pixels and live state were manually
reviewed. `replace` and `remove` deliberately fail `bun run check:screenshots`
until the referenced debt is resolved.

| Asset                                                             | Docs page                                   | User point                                  | UI route/state                                                      | Fixture                                                                                                                        | Viewport/theme   | UI revision                                                        | Last verified | Review |
| ----------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------ | ------------- | ------ |
| `/docs/getting-started/explore-environment/environment-ready.png` | `/docs/getting-started/explore-environment` | Recognize a ready Environment and Service   | Environment details, selected Service Summary, `Deployed` / `Ready` | Authorized disposable fixture; incidental identity, hostname, UUID, and timestamp values generalized in DOM; cleanup confirmed | 1440×900 / light | `b1df0cd64b4680fb241364be6cab985a2dce1f4f`                         | 2026-07-24    | `keep` |
| `/docs/getting-started/onboard-repository/repository-list.png`    | `/docs/getting-started/onboard-repository`  | Find and select a repository for onboarding | `/onboard`, installed but not-onboarded repository filtered         | Authorized disposable fixture; incidental identity, hostname, UUID, and timestamp values generalized in DOM; cleanup confirmed | 1440×900 / light | `b1df0cd64b4680fb241364be6cab985a2dce1f4f`                         | 2026-07-24    | `keep` |
| `/docs/features/lifecycle-ui/environment-list.png`                | `/docs/features/lifecycle-ui`               | Find, filter, and select an Environment     | `/environments`, one `Torn down` Environment filtered               | Authorized disposable fixture; incidental identity, hostname, UUID, and timestamp values generalized in DOM; cleanup confirmed | 1440×900 / light | `b1df0cd64b4680fb241364be6cab985a2dce1f4f`                         | 2026-07-24    | `keep` |
| `/docs/releases/keycloak-management-client-capabilities.png`      | `/docs/releases`                            | Configure the management client flows       | Keycloak management client, capability configuration                | Authorized local non-production realm; component crop contains no hostname, identity, or secret                                | 1440×900 / dark  | Keycloak `26.4.7`; Helm `78b680595d4beda3184124312d61d86ce0cc51e7` | 2026-08-01    | `keep` |
| `/docs/releases/keycloak-management-client-scope.png`             | `/docs/releases`                            | Verify least-privilege scope mappings       | Dedicated management client scope with full scope off               | Authorized local non-production realm; component crop contains no hostname, identity, or secret                                | 1440×900 / dark  | Keycloak `26.4.7`; Helm `78b680595d4beda3184124312d61d86ce0cc51e7` | 2026-08-01    | `keep` |

The structural check cannot read meaning from rendered pixels. A `keep` status
is a human assertion that the final image contains no secret, personal,
private, local-only, stale, or misleading content; automation verifies only
references, intrinsic dimensions, catalog state, and detectable tracked-text
markers.

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
      `src/theme.config.tsx`.
- [ ] `bun run check:screenshots` passes.
- [ ] Temporary PR, branch, Environment, Site, or session state was cleaned up.
