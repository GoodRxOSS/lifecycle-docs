---
name: update-lifecycle-docs
description: Update, correct, reorganize, or review Lifecycle's end-user MDX documentation and UI screenshots. Use for source-PR documentation impact, new or changed product behavior, configuration/schema/API/CLI synchronization, troubleshooting guides, navigation changes, screenshot capture or refresh, and docs drift audits in lifecycle-docs.
---

# Update Lifecycle Docs

Follow the repository `AGENTS.md` throughout this workflow.

## Classify the Work

For an upstream change, choose one:

- **No docs needed:** internal-only behavior with no user, API, configuration, installation, or interface impact.
- **Docs needed:** a user-visible behavior, workflow, contract, default, command, route, or support boundary changed.
- **Uncertain:** the authoritative source does not establish the user impact.

Do not manufacture a docs change for the first case. For the third, identify the missing product decision or evidence instead of guessing.

## Update Workflow

1. **Choose the user and task.**

   - Name the reader: evaluator, application developer, platform operator, Agent user, or administrator.
   - State the outcome the page must help them reach.

2. **Find the owning contract.**

   - Use the source routing in `AGENTS.md`.
   - Inspect implementation, schema, OpenAPI/validators, CLI registration, chart values, or live UI as appropriate.
   - Record the commit or PR used for verification.
   - Surface contradictions between sources before editing.
   - Treat support status as a product decision. If source code and the live UI
     do not establish it, record the question for the product owner.

3. **Assess the existing journey.**

   - Read the target page, neighboring pages, navigation metadata, and incoming/outgoing links.
   - Prefer correcting an existing page.
   - Create a new page only for a distinct user task or audience.

4. **Author for task completion.**

   - Lead with the outcome.
   - Add prerequisites and support/feature status before the procedure.
   - Use the smallest safe sequence with tested examples.
   - Add observable success criteria, recovery, troubleshooting, and the next action.
   - Keep reference tables separate from task guidance when either becomes hard to scan.

5. **Decide whether a screenshot helps.**

   - Use a screenshot only when recognizing a page/state, locating an action, or understanding a dense UI materially improves success.
   - For screenshot work, read `references/screenshots.md` completely before capture.
   - Prefer a diagram for concepts and selectable text for code, commands, schemas, or payloads.
   - Get user authorization before creating a fixture PR or otherwise changing
     external repository state.

6. **Keep navigation coherent.**

   - Update the nearest `_meta.ts` when adding, moving, or renaming a page.
   - Run generated metadata steps through the normal build.
   - Review generated changes and links rather than accepting churn blindly.

7. **Verify content and rendering.**

   - Validate examples against the owning schema, CLI, API, or chart.
   - Format changed files only.
   - Run `bun run verify`.
   - Inspect every changed route in desktop Chrome.
   - Check every theme enabled in `src/theme.config.tsx`; the current site
     forces the dark theme.

8. **Prepare the handoff.**
   - Summarize the reader task, authoritative evidence, changed routes, validation, and remaining uncertainty.
   - Record screenshot fixture and cleanup when applicable.
   - Create a docs PR only when authorized; never merge it without explicit authorization.

## Page Shape

Use this order when it fits the task:

1. Outcome
2. Audience, prerequisites, and support status
3. Procedure
4. Verify the result
5. Recover or roll back
6. Troubleshoot
7. Next steps
8. Version/owner last verified

Do not force headings that add no value, but do not omit safety, verification, or recovery when the workflow changes state.

## Safety and Accuracy

- Do not infer public support from code acceptance alone.
- Do not describe Labs or admin-gated controls as universally available.
- Do not publish private values, credentials, unrestricted examples, or destructive shortcuts.
- Do not silently reconcile conflicting contracts. Report the conflict and identify the owner.
- Do not add placeholders or TODO-only pages to navigation.
- Do not preserve obsolete terminology merely because an old page uses it.
