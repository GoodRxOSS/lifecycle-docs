# ASD-STE100 review coverage

Use this checklist for every canonical end-user page. It tracks all 53 writing
rules in ASD-STE100 Issue 9 without reproducing the standard. Read the
[official Issue 9 PDF](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)
for the authoritative rule text, definitions, permitted forms, categories,
and examples.

`check:styles` is a mechanical aid. In the table:

- **Mechanical** means that the repository check covers an objective part of
  the rule.
- **Human** means that an editor must review meaning and context.
- **Source** means that product source or approved terminology must establish
  the technical term.

No end-user page or rule has a waiver.

## Complete rule matrix

| Rule | Project review question                                                                           | Coverage          |
| ---- | ------------------------------------------------------------------------------------------------- | ----------------- |
| 1.1  | Is each general word approved, or is it a necessary technical term?                               | Human, Source     |
| 1.2  | Does each approved word use its permitted part of speech?                                         | Human             |
| 1.3  | Does each approved word use its permitted meaning?                                                | Human             |
| 1.4  | Does each verb or adjective use a permitted form?                                                 | Human             |
| 1.5  | Does each technical noun fit an Issue 9 technical-noun category?                                  | Human, Source     |
| 1.6  | Is each unapproved word used only as a valid technical noun?                                      | Human, Source     |
| 1.7  | Is every technical noun used as a noun, not as a verb?                                            | Human             |
| 1.8  | Does product or industry evidence approve each technical noun?                                    | Human, Source     |
| 1.9  | Is each selected technical noun short and easy to understand?                                     | Human             |
| 1.10 | Is technical terminology free of regional language, slang, and jargon?                            | Human             |
| 1.11 | Does one technical noun identify one item consistently?                                           | Human, Source     |
| 1.12 | Does each technical verb fit an Issue 9 technical-verb category?                                  | Human, Source     |
| 1.13 | Is every technical verb used as a verb, not as a noun?                                            | Human             |
| 1.14 | Does prose use American English spelling?                                                         | Human             |
| 2.1  | Does a normal multi-word noun contain no more than three words?                                   | Human             |
| 2.2  | Is an official technical noun longer than three words written in full?                            | Human, Source     |
| 3.1  | Does each general verb use a dictionary-approved form?                                            | Human             |
| 3.2  | Does each verb use a form and tense permitted by Issue 9?                                         | Human             |
| 3.3  | Is each past participle used only in a permitted adjective role?                                  | Human             |
| 3.4  | Does prose avoid complex auxiliary verb groups?                                                   | Mechanical, Human |
| 3.5  | Does each `-ing` form have a permitted technical-noun or modifier role?                           | Human             |
| 3.6  | Is the voice active unless Issue 9 permits passive voice in that context?                         | Human             |
| 3.7  | Does each action use a verb instead of a noun phrase?                                             | Human             |
| 4.1  | Is each sentence short, direct, and clear?                                                        | Mechanical, Human |
| 4.2  | Does each sentence keep necessary words and avoid contractions?                                   | Mechanical, Human |
| 4.3  | Does complex information use a vertical list?                                                     | Human             |
| 4.4  | Do related sentences use clear, approved connections?                                             | Human             |
| 4.5  | Does prose include necessary articles or demonstrative adjectives?                                | Human             |
| 5.1  | Does each procedural sentence contain no more than 20 words?                                      | Mechanical        |
| 5.2  | Does each procedural sentence contain one instruction, except for an allowed simultaneous action? | Mechanical, Human |
| 5.3  | Does each instruction use the imperative form?                                                    | Mechanical, Human |
| 5.4  | Does a necessary condition occur before its instruction?                                          | Mechanical, Human |
| 5.5  | Does each note contain information only?                                                          | Human             |
| 6.1  | Does descriptive text introduce information in a useful sequence?                                 | Human             |
| 6.2  | Do headings and key terms make the information structure clear?                                   | Human             |
| 6.3  | Does each descriptive sentence contain no more than 25 words?                                     | Mechanical        |
| 6.4  | Does each paragraph contain related information?                                                  | Human             |
| 6.5  | Does each paragraph have one topic?                                                               | Human             |
| 6.6  | Does each descriptive paragraph contain no more than six sentences?                               | Mechanical        |
| 7.1  | Does each safety message identify the correct severity?                                           | Human, Source     |
| 7.2  | Does each safety instruction start with an unambiguous command or condition?                      | Human             |
| 7.3  | Does each safety message state the risk or possible result?                                       | Human, Source     |
| 8.1  | Does prose avoid semicolons and use punctuation correctly?                                        | Mechanical, Human |
| 8.2  | Do hyphens connect only directly related words?                                                   | Human             |
| 8.3  | Does each parenthetical expression have a permitted purpose?                                      | Human             |
| 8.4  | Does a colon introduce vertical-list content clearly?                                             | Human             |
| 8.5  | Does sentence-length review count a parenthetical expression as Issue 9 specifies?                | Mechanical, Human |
| 8.6  | Does sentence-length review count protected strings and symbols as Issue 9 specifies?             | Mechanical, Human |
| 8.7  | Does sentence-length review count a hyphenated word as one word?                                  | Mechanical        |
| 9.1  | If direct wording is not possible, does a new sentence construction keep the meaning?             | Human             |
| 9.2  | Is each approved word correct for its selected meaning and context?                               | Human             |
| 9.3  | Does prose avoid unapproved phrasal verbs?                                                        | Human             |
| 9.4  | Are terminology and sentence patterns consistent across the page and site?                        | Human, Source     |

## Review record

For each changed canonical page:

1. Verify facts and technical terms against the owning source revision.
2. Review all rule rows against the title, description, navigation text,
   headings, paragraphs, lists, tables, callouts, links, captions, and alt
   text.
3. Run `bun run check:styles` and resolve every mechanical finding.
4. Review the rendered page for sentence purpose, topic boundaries, safety
   meaning, and information sequence.
5. Run `bun run update:style-baseline` only after the complete review.

The baseline stores a content hash, profile, and review date for every route.
It proves review coverage and detects later changes. It does not certify
compliance.
