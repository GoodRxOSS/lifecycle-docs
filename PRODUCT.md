# Product

## Register

brand

This site is a split surface: the home page (`/`) is brand-led marketing, and `/docs/*` is utility-led product. PRODUCT.md carries `brand` as the default because the home is the high-stakes first impression and the docs reading experience benefits from brand-level craft (typography, atmosphere, editorial pacing). For deep utility surfaces inside `/docs/*` (tables, schema reference, troubleshooting), override per task with `product`.

## Users

Two audiences in one site:

- **Decision makers — Platform / DevOps engineers.** They land on the home page or "What is Lifecycle?" while evaluating tools. They are skeptical, scan-first, terminal-adjacent, and reading on a 27-inch monitor in a dim office or a laptop on a flight. Their job: decide in under five minutes whether Lifecycle is worth a deeper look, then forward a link to a teammate.
- **Day-to-day consumers — App developers.** They land in `/docs/*` from a Google search or an internal Slack link, mid-task, with a specific question. Their job: find the exact recipe / flag / config / troubleshooting note, copy it, and get back to their PR. They do not want narrative; they want the answer.

The site must serve both without compromising either: the home convinces, the docs deliver.

## Product Purpose

Documentation and marketing site for **Lifecycle** — an open-source ephemeral environments orchestrator that turns every GitHub pull request into a fully-functional preview environment. Lifecycle is licensed Apache 2.0 and maintained by GoodRx OSS.

The site exists to:

1. Convince a new visitor — in under a minute — that Lifecycle replaces brittle shared dev/staging environments with per-PR isolation that cleans up after itself.
2. Get an evaluator from "what is this?" → "I have it running on a sample repo" with the fewest dead-ends possible.
3. Be the canonical answer-source for existing operators and consumers (config, schema, troubleshooting, recipes).
4. Carry the OSS community: visible paths to GitHub (stars, contribution) and Discord (community), without making the home feel like a star-farming page.

Success looks like: a DevOps lead reads the home, opens the demo iframe, skims one feature page, and either installs or sends the link to their platform team. A developer searching "lifecycle environment variable templating" lands directly on the relevant docs page and copies the exact snippet they need within seconds.

## Brand Personality

**Sharp, dev-native, slightly irreverent.**

- **Voice:** Direct. Technical without being dry. Explains hard things without dumbing them down. Earns trust by being precise about what Lifecycle does and does not do.
- **Tone:** Confident but not corporate. Comfortable with code, monospace, and shell snippets as first-class content. Allowed to wink — emoji in a `## A Developer's Story` heading is on-brand; corporate marketing copy is not.
- **Emotional goals:** A reader should feel "this was built by engineers who care", not "this was wrapped by a marketing team". The site itself should feel like a small piece of evidence that the product is well-made.

## Anti-references

- **Old-school Jekyll / MkDocs / read-the-docs default theme.** Sidebar + content + zero design care. The OSS docs we are not.
- **Crypto / web3 neon-on-black.** No high-saturation glow, no glassmorphism cards, no animated gradient text, no "matrix" hero.
- **Consumer GoodRx healthcare aesthetic (goodrx.com).** Do not borrow the parent brand's consumer color palette, rounded warmth, or photography style. Lifecycle is OSS infra, not a healthcare app.
- **Generic enterprise SaaS** (implied — guard against drift). No stock isometric illustrations, no gradient blobs, no "hero metric + 3 supporting stats" template, no identical icon-card grids.

## Design Principles

1. **Practice what you preach.** Lifecycle is a tool for engineers who care about craft. The docs themselves are evidence — pixel-aligned, fast, well-typeset. Sloppy docs would undercut the pitch.
2. **Two doors, one welcome.** The home funnels visitors to two endings — _install_ (read → run) and _community_ (GitHub star + Discord). Both must be visible from the home without competing for the same pixel or feeling like a star-farming bar.
3. **Density rewards the scanner.** DevOps readers scan before they read. Reward fast eyes with information-dense layouts, real code, real diagrams. Avoid hero-paragraph filler and stock-illustration negative space.
4. **Show the system, don't describe it.** The codebase already ships React Flow diagrams and CodeHike code walks — lean into them. A live diagram of "PR → environment → cleanup" beats a paragraph every time.
5. **Sharpness over softness.** Personality is sharp/dev-native, so the interface is too: crisp edges where appropriate, monospace as a first-class voice, code blocks treated as content not as ornament. Avoid rounded "consumer warmth".

## Accessibility & Inclusion

- **Target:** WCAG 2.1 AA. Treat as a hard floor, not a ceiling.
- **Color:** All text and code blocks must meet AA contrast in both light and dark themes. Brand yellow is decorative — never the carrier of meaning.
- **Keyboard:** Every interactive element (theme toggle, sidebar, code-tabs, accordions, React Flow controls, copy-code buttons) must be reachable and operable via keyboard with a visible focus ring.
- **Motion:** Respect `prefers-reduced-motion`. Hero/feature animations must have a non-animated fallback. The existing custom keyframes (`fade-up`, `slide-in-*`, `draw-line`, logo `shake`) all need motion-safe variants.
- **Content:** Code samples must be selectable and copyable, not images of code. Diagrams (React Flow) must have a textual description nearby for screen-reader users.
