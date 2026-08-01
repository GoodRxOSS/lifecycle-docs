# Lifecycle documentation language profile

Read this reference before you add, remove, move, or change an end-user page.

## Scope

All end-user documentation under `src/pages/docs/**` must follow ASD-STE100
Issue 9. This requirement includes every nested documentation route.

Repository maintainer files, source comments, generated Markdown, and code
examples are not end-user prose. Keep them clear and portable.

## ASD-STE100 profile

Use the
[official ASD-STE100 Issue 9 standard](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)
during the human editorial review. Do not copy or commit its
controlled-language dictionary, rule text, PDF, or licensed checker data.
Use `ste100-review.md` to track all 53 rule identifiers for every page. Its
short review questions do not replace the official standard.

Apply these project controls:

- Use American English.
- Use one term for one concept.
- Use the approved general vocabulary when it expresses the correct meaning.
- Treat exact Lifecycle product terms, UI labels, schema keys, API fields,
  commands, paths, statuses, and other required domain terms as technical
  terms.
- Define a new technical term when a reader cannot understand it from the
  task context.
- Prefer active voice.
- Use simple verb groups.
- Write all necessary words. Do not use contractions.
- Do not use semicolons.
- Put a condition before its instruction.
- Write one instruction in each procedural sentence.
- Use the imperative for an instruction.
- Keep a procedural sentence at 20 words or fewer.
- Keep a descriptive sentence at 25 words or fewer.
- Keep one topic in each descriptive paragraph.
- Keep a descriptive paragraph at six sentences or fewer.
- Use a note for information. Do not put an instruction in a note.

Apply the same profile to titles, descriptions, navigation text, headings,
paragraphs, callouts, tables, list text, link text, captions, and image alt
text.

Do not change an exact code block, command, API route, identifier, schema key,
UI label, status, or error message only to satisfy a prose rule. Correct an
exact string only when the owning product source proves that the string is
wrong.

Set this frontmatter value on every end-user page:

```yaml
contentProfile: asd-ste100
```

Do not create a page-level ASD-STE100 waiver.

## Review and validation

Run:

```sh
bun run check:styles
```

The style baseline stores a hash, profile, and review date for every page. It
also covers maintained documentation navigation and visible site chrome. The
baseline makes later prose changes require another review. It preserves the
review date for an unchanged page.

After the human review and all checks pass, update the baseline:

```sh
bun run update:style-baseline
```

Review the baseline diff. Do not update it to hide an incomplete language
review.

No automated tool can certify complete ASD-STE100 compliance. The author and
reviewer remain responsible for vocabulary, technical-term selection,
sentence meaning, and context-dependent rules.
