## Reader and task

- Audience:
- Task/outcome:

## Source of truth

- Exact owning repository revisions, PR head SHAs, or immutable artifacts:
- Frontmatter verification baseline added or reused:
- Product or runtime verification:
- Contract checks (schema / OpenAPI / CLI; identify any **SKIP**):
- Unavailable or unresolved sources:

## Documentation changes

- Changed pages:
- ASD-STE100 human review:
- Navigation or redirects:
- Raw Markdown projection:
- External state: sanitized authorization and cleanup assertion, with only
  public or non-sensitive references (keep private identifiers in task scratch):
- Screenshots, catalog status, and manual pixel/state review:

## Verification

- [ ] Formatted changed files
- [ ] Kept source-review evidence and non-actionable implementation details out of end-user prose
- [ ] Confirmed that each changed sentence helps the reader understand, complete, verify, or recover the task
- [ ] Reviewed all 53 rule rows in `.agents/skills/update-lifecycle-docs/references/ste100-review.md`
- [ ] `bun run check:styles`
- [ ] Updated the style baseline only after the complete human review
- [ ] `bun run check:raw`
- [ ] `bun run verify`
- [ ] `bun run check:contracts --require-all` when schema, API, or CLI claims changed
- [ ] Checked changed routes with an approved desktop browser inspection tool
- [ ] Checked every theme enabled by the current theme config
- [ ] Ran `bun run check:screenshots` when visuals changed
- [ ] Confirmed screenshots contain no secrets or personal/private data
- [ ] Confirmed tracked guidance has no contributor-specific paths, hosts, credentials, or fixture identities
