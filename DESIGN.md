---
name: Lifecycle Docs
description: The visual system for Lifecycle's marketing home and product documentation. Built System aesthetic — sharp, dev-native, slightly irreverent.
colors:
  hi-vis-yellow: "#FDDB00"
  late-sun-gold: "#FFCE2C"
  blueprint-indigo: "#0F55A6"
  signal-amber: "#F59E0B"
  destructive-red: "#EF4444"
  schematic-black: "#020817"
  graphite-mute: "#64748B"
  drafting-line: "#E2E8F0"
  blueprint-paper: "#FFFFFE"
  workshop-coal: "#0C0A09"
  workshop-cream: "#FAFAF9"
  workshop-graphite: "#27201F"
  workshop-mute: "#A6A29B"
typography:
  display:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  body:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
    note: "Brand and chrome surfaces (home, nav, sidebar, TOC, components)."
  body-docs:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "-0.005em"
    color: "hsl(var(--foreground) / 0.92)"
    note: "Reading scale for /docs prose. Same family as body, scaled and tracked for long-form via main:not(.layout-full)."
  label:
    fontFamily: "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
  wordmark:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    textTransform: "uppercase"
    letterSpacing: "0.08em"
    note: "Nav and footer Lifecycle wordmark only. Set in mono uppercase for a coded, set-in-stone feel."
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "0"
    note: "Loaded explicitly via next/font/google. Used for code blocks, inline code, and the wordmark."
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  2xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.blueprint-indigo}"
    textColor: "{colors.blueprint-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 32px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.blueprint-indigo}"
    textColor: "{colors.blueprint-paper}"
  button-outline:
    backgroundColor: "{colors.blueprint-paper}"
    textColor: "{colors.schematic-black}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 32px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.drafting-line}"
    textColor: "{colors.schematic-black}"
  feature-card:
    backgroundColor: "{colors.blueprint-paper}"
    textColor: "{colors.schematic-black}"
    rounded: "{rounded.xl}"
    padding: "24px"
  feature-card-hover:
    backgroundColor: "{colors.blueprint-paper}"
    textColor: "{colors.schematic-black}"
  input-default:
    backgroundColor: "{colors.blueprint-paper}"
    textColor: "{colors.schematic-black}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  chip-tag:
    backgroundColor: "{colors.drafting-line}"
    textColor: "{colors.schematic-black}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  code-inline:
    backgroundColor: "{colors.drafting-line}"
    textColor: "{colors.schematic-black}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.schematic-black}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.blueprint-indigo}"
---

# Design System: Lifecycle Docs

## 1. Overview

**Creative North Star: "The Built System"**

Lifecycle is a tool for engineers who care about how things are built. The site is itself an artifact of that care: pixel-aligned, fast, well-typeset, with code and diagrams treated as first-class voices instead of decorative content. A skeptical platform engineer should land on this site, scan for thirty seconds, and conclude _"these people sweat the details — the product probably does too."_ That conclusion is the entire job of the visual system.

The system has a deliberate two-mode personality. **Light mode is the blueprint:** cool slate neutrals, deep indigo authority, generous negative space, the brand yellow used sparingly as a highlighter on a technical document. **Dark mode is the workshop:** warm near-black, a cream foreground that feels like paper under a lamp, and the brand yellow stepping forward as the primary signal. The same architecture, two atmospheres. Neither mode is the default; both are first-class.

What this system explicitly rejects, carried verbatim from `PRODUCT.md`: old-school Jekyll/MkDocs default themes (sidebar + content + zero design care), crypto/web3 neon-on-black (high-saturation glow, glassmorphism cards, animated gradient text), and the consumer GoodRx healthcare aesthetic (rounded warmth, photography-led marketing). Generic enterprise SaaS — stock isometric illustrations, gradient blobs, hero-metric templates, identical icon-card grids — is also out.

**Key Characteristics:**

- Two-mode personality: light is the blueprint, dark is the workshop. Not skinning, repositioning.
- Brand yellow is decorative in light, structural in dark. Its rarity in light is the point.
- Type-led, not image-led. Real diagrams (React Flow) and real code (CodeHike) over stock graphics.
- Flat at rest, lift on intent. Surfaces stay calm; hover and focus do the talking.
- Monospace is a first-class voice, not a code-block formatting choice.

## 2. Colors: The Built-System Palette

Roles split by mode. The blueprint (light) leans on cool indigo and slate; the workshop (dark) leans on warm coal and cream. Hi-Vis Yellow is the through-line that ties both modes to the brand.

### Primary

- **Hi-Vis Yellow** (`#FDDB00`, ~`oklch(89% 0.18 100)`, HSL `52 100% 49.6%`): The brand carrier. In **light mode** it appears almost exclusively in the hero gradient and as occasional emphasis — its scarcity is the point. In **dark mode** it is the primary action color (buttons, links, focus rings, the Nextra primary hue). Treat it like high-visibility paint: it earns attention because it is rationed.
- **Late Sun Gold** (`#FFCE2C`, ~`oklch(87% 0.17 89)`, HSL `46 100% 58.6%`): Hi-Vis's gradient partner. Used only in the hero background gradient (`from-primary-brand-default to-primary-brand-gold`) and never alone.

### Secondary

- **Blueprint Indigo** (`#0F55A6`, ~`oklch(46% 0.14 252)`, HSL `212 83.4% 35.5%`): The primary action color in **light mode**. Carries the hero accent on the home (`text-primary` on "that grow with you"), primary buttons, link underlines, and the focus ring. In dark mode it recedes; Hi-Vis takes over.

### Tertiary

- **Signal Amber** (`#F59E0B`): Reserved for system-level callouts (warnings, in-progress states, "experimental" badges). Distinct enough from Hi-Vis to never be confused with the brand. Use sparingly.
- **Destructive Red** (`#EF4444`, HSL `0 84.2% 60.2%`): Errors, destruction confirmations, the heart icon in the footer. Never decorative.

### Neutral — Blueprint (light mode)

- **Schematic Black** (`#020817`, HSL `222.2 84% 4.9%`): Body text, headings, foreground icons. Cool-tipped, not pure black.
- **Graphite Mute** (`#64748B`, HSL `215.4 16.3% 46.9%`): Secondary text, captions, sub-headings.
- **Drafting Line** (`#E2E8F0`, HSL `214.3 31.8% 91.4%`): Borders, dividers, input strokes, code-inline backgrounds.
- **Blueprint Paper** (`#FFFFFE`, HSL `0 0% 100%`): Background and card surface. Tinted toward the cool family by 1% to keep it from being clinical pure-white.

### Neutral — Workshop (dark mode)

- **Workshop Coal** (`#0C0A09`, HSL `20 14.3% 4.1%`): Background. Warm-tipped near-black, never `#000`. Reads like a desk lamp turned low, not a void.
- **Workshop Graphite** (`#27201F`, HSL `12 6.5% 15.1%`): Cards, secondary surfaces, borders, dividers, input strokes. One note above Coal.
- **Workshop Mute** (`#A6A29B`, HSL `24 5.4% 63.9%`): Secondary text and captions.
- **Workshop Cream** (`#FAFAF9`, HSL `60 9.1% 97.8%`): Body text and headings. Warm, paper-like, never pure white.

### Named Rules

**The Highlighter Rule.** In light mode, Hi-Vis Yellow appears on no more than 5–10% of the visible surface and is reserved for moments that genuinely matter: the hero gradient, "new" badges, occasional text emphasis, callout headers. The rest of the page belongs to slate and indigo. Yellow stops being a brand and starts being noise the moment it spreads.

**The Hue Inversion Rule.** Light mode and dark mode use different neutral hue families on purpose. Light is `cool-slate` (220° hue, low chroma). Dark is `warm-coal` (12–60° hue, low chroma). Do not unify them to a single grey ramp. The cool/warm split is what makes light feel like a blueprint and dark feel like a workshop.

**The No Pure Extremes Rule.** Never `#000`, never `#fff`. Light backgrounds tint slightly cool; dark backgrounds tint slightly warm. Pure extremes look clinical and undermine the lived-in atmosphere.

## 3. Typography

The stack is two explicitly-loaded fonts via `next/font/google`. No third face, ever.

**IBM Plex Sans** is the entire sans layer: home, nav, sidebar, TOC, marketing copy, component labels, docs prose. Plex has engineered DNA with slight humanist warmth, the right register for a system that wants to read as built rather than designed. Long-form prose in `/docs` runs at a slightly larger reading scale (1.0625rem / 1.7 / `-0.005em`) scoped via `article.nextra-content main:not(.layout-full)`; everything else uses the standard 1rem body.

**JetBrains Mono** carries everything coded: code blocks, inline code, command flags, env vars, schema keys, and the `Lifecycle` wordmark in nav and footer (set uppercase with `0.08em` tracking).

### Hierarchy

- **Display** (Plex 700, `clamp(2.25rem, 5.5vw, 4.5rem)`, line-height 1.05, `-0.02em` tracking): Hero headlines on the home. One per page, maximum.
- **Headline** (Plex 700, `clamp(1.75rem, 3vw, 2.5rem)`, line-height 1.15, `-0.01em` tracking): Section openers in marketing pages.
- **Title** (Plex 600, `1.125rem`, line-height 1.4): Component headings inside cards, sidebar group labels, callout titles.
- **Body — brand** (Plex 400, `1rem`, line-height 1.65): Marketing prose on the home and any non-docs surface.
- **Body — docs** (Plex 400, `1.0625rem`, line-height 1.7, `-0.005em` tracking, color at 92% foreground): All long-form prose in `/docs`. Maximum line length 75ch. Headings inside docs: h1 700/`-0.024em`/1.15, h2 600/`-0.018em`/1.25, h3-h4 600/`-0.018em`/1.3.
- **Label** (Plex 600, `0.75rem`, `0.06em` tracking): Tag chips, `[NEW]` / `[BETA]` badges, button text, table headers, the few uppercase moments allowed.
- **Wordmark** (JetBrains Mono 600, `0.875rem` uppercase, `0.08em` tracking): Nav and footer `Lifecycle` only. The mono uppercase setting reads as a label etched into the chrome, not a brand name in disguise.
- **Mono** (JetBrains Mono 500, `0.875rem`, line-height 1.55): Inline code, file paths, command flags, environment variable names, schema keys. Treated as a structural voice in the documentation.

### Named Rules

**The Mono-As-Voice Rule.** When body prose names a file, flag, command, env var, or schema key, it is set in mono — never quoted, never italicized, never both. Mono is how the docs _speak_ about the system, not just how they format a code block.

**The Long-Line Floor Rule.** Body prose never exceeds 75 characters per line. Fixed, not advisory. Wide screens widen the gutters, not the text column.

**The Display-Once Rule.** Display weight (the largest, tightest setting) appears at most once per page. If a page wants two display headlines, the second one steps down to Headline. Hierarchy collapses the moment it repeats.

## 4. Elevation

The system is **flat at rest, lift on intent**. Surfaces sit at a single z-plane by default; hover, focus, and selection are when elevation appears. This matches the existing `FeatureCard` pattern in the codebase and reinforces "tactile and snappy" without crossing into Material-style ambient shadows everywhere.

### Shadow Vocabulary

- **`shadow-sm`** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): The default for cards. Almost imperceptible in light mode, completely invisible in dark mode. The job is reassurance, not depth.
- **`shadow-lg`** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): Hover state for cards, dropdowns, popovers, tooltips. Always paired with a `-translate-y-1` micro-lift; shadow alone reads as a Bootstrap-era box.
- **No "shadow-xl"** is used anywhere. If a surface needs more elevation than `shadow-lg`, it should be a different surface (modal, popover) — not a louder shadow.

### Named Rules

**The Lift-On-Intent Rule.** Elevation is a response, never a default. Cards, callouts, and feature tiles ship flat. They lift only when the user signals interest (hover, focus). The lift is `transform: translateY(-4px)` plus `shadow-lg`, never one without the other. A flat card with a heavy shadow looks broken.

**The Border-Over-Shadow Rule.** In dark mode, a `1px` border in `Workshop Graphite` does the work that `shadow-sm` does in light mode. Shadows on dark surfaces almost always read as soot, not depth.

## 5. Components

The library is shadcn/ui (Radix primitives) extended for docs. Below is the on-tone behavior — not a re-spec of every prop.

### Buttons

- **Shape:** Rounded corners (`rounded-md`, 6px). Not pills, not square. Small radius keeps them on the "sharp" side of friendly.
- **Primary** (light mode): Blueprint Indigo background, paper foreground, `h-11` (44px) on `lg` size, `0 32px` horizontal padding. Hover: opacity-90, no color shift. Focus: 2px Blueprint Indigo ring with 2px offset.
- **Primary** (dark mode): Hi-Vis Yellow background, Workshop Coal foreground. Yellow is structural in dark; this is its main canvas.
- **Outline:** Drafting Line border, paper background, Schematic Black text. Hover: Drafting Line background fill. Used as the secondary CTA next to Primary (e.g. "View on GitHub" next to "Get Started").
- **Ghost / Link:** Used in nav. Underline-on-hover for link variant; subtle accent background for ghost.

### Feature Cards

The signature surface on the home `/`. Defines the hover personality of the whole site.

- **Shape:** `rounded-xl` (12px). Larger radius than buttons by design — the card is the object, the button is the action.
- **At rest:** `bg-card`, `1px border` in Drafting Line (light) or Workshop Graphite (dark), no shadow.
- **Hover:** Border shifts to Blueprint Indigo at 50% opacity, `shadow-lg` appears, the entire card lifts `-translate-y-1` over 300ms ease-out. The icon container background brightens from `primary/10` to `primary/20`.
- **Internal padding:** 24px (`p-6`). The icon-tile is 48×48 with 8px radius, sitting top-left.
- **Anti-pattern guard:** never group more than 6 of these in one viewport. If a section needs more than 6, the pattern is wrong (use a list, a table, or a tabbed interface).

### Cards (generic shadcn `<Card>`)

- **Shape:** `rounded-lg` (8px) — one step tighter than Feature Cards.
- **Background:** `bg-card`, identical to surface; the card's edge comes from a `1px` border, not a fill contrast.
- **Internal padding:** 24px header, 24px content, 24px footer (`p-6`).
- **Shadow:** `shadow-sm` at rest. No hover lift unless the card is interactive; static cards stay flat.

### Inputs / Fields

- **Style:** `1px` border in Drafting Line / Workshop Graphite, paper background, `rounded-md` (6px), 40px height, 12px horizontal padding.
- **Focus:** 2px ring in Blueprint Indigo (light) or Hi-Vis Yellow (dark) with 2px offset. The ring sits _outside_ the border, not replacing it.
- **Placeholder:** Graphite Mute / Workshop Mute, never the same color as filled-input text.

### Chips / Tags

Used for doc tags (`core`, `lifecycle`, `intro`, etc.) and inline `[NEW]` / `[BETA]` badges.

- **Style:** Pill (`rounded-full`), Drafting Line / Workshop Graphite background, Schematic Black / Workshop Cream text.
- **Padding:** 4px vertical, 10px horizontal.
- **Typography:** Label setting (12px, 600, 0.06em tracking).

### Navigation

- **Top nav (Nextra):** Logo + section links + theme toggle + Discord icon. Logo has a custom `shake` animation on hover (`logo-shake` class) — keep it; it is the system's one allowed wink.
- **Sidebar (Nextra):** `defaultMenuCollapseLevel: 2`, `defaultOpen: false`. Active link is Blueprint Indigo / Hi-Vis Yellow. Inactive links are Schematic Black / Workshop Cream. Hover background is a subtle accent tint.
- **Right TOC (Nextra):** `float: true` with `extraContent` for related-tag content. "Back to top" uses Title typography.

### Code Surfaces

The single most important content type in `/docs`. Treat with care.

- **Inline code:** Drafting Line / Workshop Graphite background, mono typography, `rounded-sm` (4px), 2px vertical / 6px horizontal padding. No border.
- **Block code (CodeHike):** Full-width within the prose column, `rounded-lg` (8px), system-monospace, syntax tokens via CodeHike's own theme. Always show the language label as a chip in the top-right.
- **Diagrams (React Flow):** Transparent backgrounds (`background-color: transparent !important` is in `globals.css` for a reason — keep). The diagram inherits the page's atmosphere instead of imposing its own.

### Signature Component: The Hero Gradient + Grid

The home page's defining visual: a yellow→gold gradient masked into a radial fade, overlaid with a sparse grid pattern (72×56 tile grid, four highlighted squares at fixed coordinates). This is the strongest brand signature in the system. It appears once, on `/`. **Do not replicate it on docs pages, landing-style sections, or as a section divider.** Its rarity is what makes it land.

## 6. Do's and Don'ts

### Do:

- **Do** treat Hi-Vis Yellow as decorative in light mode and structural in dark mode. The mode-asymmetry is the point.
- **Do** lead with type and information density. DevOps readers scan; reward fast eyes with crisp hierarchy and short scannable blocks.
- **Do** set file names, flag names, command names, env vars, and schema keys in mono inline. Prose talks about the system; mono is how it names parts of it.
- **Do** keep body prose to 65–75ch on every viewport. Wider gutters, not wider text.
- **Do** use real diagrams (React Flow) and real code walks (CodeHike) over stock illustrations or screenshots. The codebase already has these; lean into them.
- **Do** use Drafting Line (light) / Workshop Graphite (dark) `1px` borders to define surface edges. Borders carry more weight than ambient shadows in this system.
- **Do** ship motion that respects `prefers-reduced-motion`. The existing keyframes (`fade-up`, `slide-in-*`, `draw-line`, `pulse`, `shake`) all need motion-safe variants.
- **Do** verify AA contrast in both themes before shipping. The brand yellow on a white background fails — never use Hi-Vis as a body-text color in light mode.
- **Do** keep the logo `shake` animation. It is the system's one sanctioned wink.

### Don't:

- **Don't** ship the **old-school Jekyll/MkDocs default theme** (sidebar + content + zero typographic care). Carried directly from `PRODUCT.md` as an anti-reference.
- **Don't** ship **crypto / web3 neon-on-black** styling: no glassmorphism cards, no animated gradient text, no high-saturation glow, no "matrix" hero effects. From `PRODUCT.md`, repeated by name.
- **Don't** borrow the **consumer GoodRx healthcare aesthetic** (rounded warmth, photography-led marketing, the consumer color palette from goodrx.com). From `PRODUCT.md`, repeated by name.
- **Don't** ship **generic enterprise SaaS** patterns: no stock isometric illustrations, no gradient blobs, no hero-metric template (big number + small label + supporting stats), no identical icon-card grids beyond the existing six-card Features section.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored stripe on cards, callouts, or alerts. Replace with a full border, a leading icon/number, or a tinted background.
- **Don't** use `background-clip: text` with a gradient. No gradient headlines, ever. Emphasis goes through weight, size, or a single color shift.
- **Don't** use `#000` or `#fff`. All neutrals tint toward the mode's hue family.
- **Don't** spread Hi-Vis Yellow onto more than ~10% of any light-mode screen. It is a highlighter, not a fill.
- **Don't** put a heavy shadow on a flat card. The lift is `translate-y-1` _plus_ `shadow-lg`, never shadow alone.
- **Don't** introduce a third font. The stack is IBM Plex Sans (everything not coded) + JetBrains Mono (code and wordmark). Two faces, every surface. Adding a serif display, a "designer" font, or a second sans for "variety" undercuts the Built System voice.
- **Don't** use modal dialogs as a first thought. For a docs site this is almost always laziness — exhaust inline, drawer, popover, and routed-page alternatives first.
- **Don't** use em dashes in any UI copy. Commas, colons, semicolons, periods, parentheses. Also not `--`.
- **Don't** repeat the hero gradient on docs pages or as a section divider. Its rarity is what makes it land on `/`.
