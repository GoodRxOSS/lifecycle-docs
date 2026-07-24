---
name: update-lifecycle-docs
description: Audit, update, correct, reorganize, or review Lifecycle's source-verified ASD-STE100 end-user MDX documentation, raw Markdown routes, and UI screenshots. Use for documentation gap analysis, upstream documentation impact, new or changed product behavior, configuration/schema/API/CLI synchronization, troubleshooting guides, navigation changes, raw Markdown projection, screenshot capture or refresh, and docs drift remediation in lifecycle-docs.
---

# Update Lifecycle Docs

Follow the repository `AGENTS.md` throughout this workflow.

## Classify the work

For an upstream change, choose one:

- **No docs needed:** Internal behavior has no user, API, configuration,
  installation, or interface effect.
- **Docs needed:** A user-visible behavior, workflow, contract, default,
  command, route, or support boundary changed.
- **Uncertain:** The authoritative source does not establish the user effect.

Do not manufacture a change for the first case. For the third case, identify
the missing product decision or evidence.

For a gap analysis, give every claim one disposition:

- **Confirmed — docs:** The owning product contract is clear.
- **Confirmed — upstream:** The product contract is broken or contradictory.
- **Blocked — decision:** Implementation exists, but public policy is not
  resolved.
- **Adjusted:** The gap is real, but its scope, evidence, or remedy changed.
- **Refuted:** Authoritative evidence contradicts the claim.

Deduplicate reports before implementation. Do not endorse an upstream defect
as a documented workflow.

## Update workflow

1. **Choose the user and task.**

   - Name the reader.
   - State the outcome that the page must help the reader reach.

2. **Find the owning contract.**

   - Use the source routing in `AGENTS.md`.
   - Resolve sources from the task context. Do not assume sibling directories,
     local ports, or one contributor's workspace.
   - Inspect the implementation, schema, OpenAPI artifact, CLI registration,
     chart values, or live UI as applicable.
   - Record the exact commit, PR head SHA, release, or immutable artifact for
     each claim.
   - Separate committed evidence from uncommitted behavior in a dirty
     checkout.
   - Add or update `audience`, `lastVerified`, and `verificationBaseline`
     frontmatter. Register new source revisions in
     `documentation-metadata.json`.
   - If no owning source is available, mark the claim unverified. Do not use
     memory or another docs page as product evidence.
   - Treat support status as a product decision. Do not infer it from code
     presence.

3. **Assess the user journey.**

   - Read the target page, adjacent pages, navigation metadata, and links.
   - Read `references/language-profile.md` before an end-user content change.
   - Read `references/ste100-review.md` before page, navigation, or visible
     site-chrome copy changes.
   - Prefer an update to an existing page.
   - Create a page only for a distinct user task or audience.

4. **Author the page.**

   - Set `contentProfile: asd-ste100`.
   - Apply ASD-STE100 Issue 9 to all end-user prose, frontmatter, headings,
     tables, callouts, links, captions, navigation text, and image alt text.
   - Do not create an ASD-STE100 waiver.
   - Keep procedural sentences at 20 words or fewer.
   - Keep descriptive sentences at 25 words or fewer.
   - Lead with the outcome.
   - Put prerequisites and product status before the procedure.
   - Use the smallest safe sequence with tested examples.
   - Add observable success criteria, recovery, troubleshooting, and the next
     action when they help the task.
   - Keep exact commands, identifiers, API routes, schema keys, UI labels,
     statuses, and error messages faithful to the owning source.
   - Keep the evidence trail out of end-user prose. Do not describe source
     inspection, code-comment disagreements, revision history, or how an
     implementation proves a claim.
   - Do not publish cache tiers, datastore records, handler names, controller
     names, or similar machinery unless a supported user task requires that
     detail.
   - Translate verified evidence into the supported condition, user-observable
     effect, user action, and expected result. Put source evidence in task
     scratch, review notes, metadata, or the handoff.

5. **Decide whether a screenshot helps.**

   - Use a screenshot only when recognition, location, or UI density makes the
     task materially easier.
   - Read `references/screenshots.md` before capture.
   - Prefer diagrams for concepts and selectable text for code, commands,
     schemas, or payloads.
   - Get explicit authorization before each external state change. Record the
     exact target, prior state, created identifiers, and cleanup result in
     private task scratch.

6. **Keep navigation and generated outputs coherent.**

   - Update the nearest `_meta.ts` when you add, move, or rename a page.
   - Run generated metadata steps and review ordering changes.
   - Treat `public/llms.txt` as generated output. Change page metadata and
     navigation, then run `bun run build:llms`.
   - Read `references/raw-markdown.md` before you add an MDX construct or
     change the build path.
   - Treat `public/docs.md` and `public/docs/**/*.md` as generated output.
     Run `bun run build:raw`.
   - Add an explicit lossless transform and a golden test for each new MDX
     construct. Do not discard unsupported content.

7. **Verify content and rendering.**

   - Validate examples against the owning schema, CLI, API, or chart.
   - Use `references/ste100-review.md` for all 53 rule checks on each changed
     page.
   - Supply the portable contract inputs in `README.md` and run
     `bun run check:contracts --require-all` when schema, API, or CLI claims
     change. A **SKIP** is not contract verification.
   - Format changed files only.
   - Run `bun run check:styles`.
   - Run `bun run check:raw`.
   - After the complete human review, run
     `bun run update:style-baseline`. Review the page, navigation, and visible
     site-chrome hash diff.
   - Run `bun run verify`.
   - Resolve the preview URL from the task, `DOCS_BASE_URL`, or development
     server output. Inspect every changed route with an approved desktop
     browser inspection tool.
   - Inspect `src/theme.config.tsx` and check each enabled theme.
   - Run `bun run check:screenshots` for screenshot changes. Manually inspect
     the final pixels and live UI state.
   - Complete a user-voice review of every changed sentence. Keep a sentence
     only when it gives a prerequisite, condition, action, observable result,
     recovery step, safety boundary, or necessary explanation for the reader.
     Remove sentences that only show how the writer verified a claim.
   - If the browser or runtime is unavailable, report visual verification as
     incomplete.

8. **Prepare the handoff.**

   - Summarize the reader task, authoritative revisions, changed routes,
     validation, and remaining uncertainty.
   - Keep private fixture identifiers in task scratch.
   - Create a docs PR only when authorized. Do not merge without explicit
     authorization.

## Page shape

Use this order when it helps the task:

1. Outcome
2. Audience, prerequisites, and support status
3. Procedure
4. Verify the result
5. Recover or roll back
6. Troubleshoot
7. Next steps
8. Version and owner last verified

Do not force headings that add no value. Do not omit safety, verification, or
recovery when the workflow changes state.

## Safety and accuracy

- Do not infer public support from code acceptance.
- Do not publish the reasoning used to verify a user-facing claim.
- Do not add `supportStatus` without a product or release decision.
- Do not describe Labs or admin-gated controls as universally available.
- Do not publish private values, credentials, unrestricted examples, or
  destructive shortcuts.
- Do not silently reconcile conflicting contracts.
- Do not add placeholders or TODO-only pages to navigation.
- Do not record personal paths, private fixture identities, fixed local URLs,
  or local credentials in tracked files.
- Do not edit generated files by hand.
- Do not copy or commit licensed ASD-STE100 rule text, dictionaries, PDFs, or
  checker data.
- Do not treat an automated style check or matching baseline hash as complete
  ASD-STE100 certification.
- Do not claim that a screenshot is private-data-safe or current from
  automated checks alone.
