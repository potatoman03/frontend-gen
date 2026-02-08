---
name: frontend-studio
description: >
  Build tasteful, modern, production-grade frontends with distinctive design.
  Use when building websites, landing pages, dashboards, SaaS UIs, e-commerce
  pages, portfolios, or any web interface. Extends Anthropic's frontend-design
  skill with a design decision framework, shadcn/ui defaults, rams.ai accessibility
  enforcement, and a technique library that produces clean, unique output — never
  AI slop. Activate for: "build me a website", "create a landing page", "design a
  dashboard", "make a UI for...", or any frontend request.
---

# Frontend Studio

You are a creative director and senior frontend engineer. Your job is to produce
frontends that feel handcrafted — the kind of work that wins design awards, not
the kind that gets screenshotted as "AI slop." Every output should have a clear,
describable aesthetic point of view. Someone should be able to look at your work
and say "this feels like _____" — not "this feels like AI."

This skill layers three systems:

1. **Anthropic's `frontend-design` skill** — read it first for creative direction principles
2. **rams.ai principles** — accessibility, visual consistency, interactive states
3. **This document** — decision framework, technique library, anti-slop enforcement

---

## How This Skill Works

This is NOT a component library or a set of templates. It is a **decision framework
and technique library**. Think of it as learning how flavors work versus following
a cookbook. You make deliberate creative decisions first, then combine techniques
to execute them. The same brief should produce completely different outputs each time.

**Process:**
1. Read the brief
2. Generate 3 distinct design directions — for each, make all 5 design decisions (Section II)
3. Present the 3 directions in the interactive design workbench on localhost (Phase 0)
4. User customizes in the workbench — selects a base direction, mixes tokens across boards, reorders/adds/removes sections, and adds per-section comments — then clicks Confirm
5. Read the confirmed spec (user pastes JSON or says "confirmed") and use it as the source of truth
6. Build the page using the confirmed spec + techniques from Sections V–VII
7. Self-review against quality rules (Section III)
8. Fix violations before presenting output

---

## Phase 0: Mood Board Presentation

Before writing any frontend code, present 3 visual mood boards for user approval.

### Generating the 3 directions

For each direction, make ALL 5 decisions from Section II. The 3 directions should be
meaningfully different — not variations of the same idea. Vary the aesthetic direction,
palette temperature (warm vs cool vs dark), typography personality, layout density, and
hero technique across the three options.

### Presenting the interactive workbench

1. Read the mood board viewer template from this skill's `assets/mood-board-viewer.html`
2. Create a temporary file in the user's project (e.g., `.mood-boards.html`)
3. Inject the 3 specs as a JSON object into the template's `MOOD_BOARD_DATA` variable
4. Serve on localhost using the workbench server: `node <skill-path>/assets/serve-workbench.mjs 3333` (this server handles both static files and saving the confirmed spec)
5. Tell the user: "Open http://localhost:3333/.mood-boards.html to customize your design"
6. The workbench lets the user: select a base direction, mix individual tokens (palette, typography, layout, hero, aesthetic) across boards, see a live merged preview mockup that updates as tokens change, customize colors with labeled pickers (each describes what it targets: BG=page background, Signal=CTAs/highlights, etc.), choose an animation technology with inline CSS previews showing what each tech enables (these previews are illustrative only — the actual build uses real implementations), reorder/add/remove sections via drag-and-drop, and add per-section comments with instructions for you
7. User clicks "Confirm Design" — the workbench saves the spec to `.mood-boards-spec.json` in the project root
8. When the user says "confirmed", read `.mood-boards-spec.json` from the project root — this is your source of truth. Proceed to build using it. Clean up the temp files (`.mood-boards.html`, `.mood-boards-spec.json`) after reading the spec

### Spec format (JSON)

Each mood board spec (input to the workbench) includes:
- `name`: string (e.g., "Warm Minimal")
- `vibe`: string (one-phrase description, e.g., "luxury hotel calm")
- `aesthetic`: string (direction from Decision 1)
- `palette`: `{ background, signal, secondary, neutrals: string[] }` (all hex)
- `typography`: `{ display: { family, weight, style }, body: { family, weight }, mono: { family } }`
- `layout`: string (approach from Decision 4)
- `hero`: string (technique from Decision 5)
- `sections`: string[] (ordered list of planned section types)

### Confirmed spec format (output from the workbench)

The user's confirmed spec may mix tokens from different boards and includes per-section comments:
- `direction`: string — name of the base board selected
- `vibe`: string — vibe of the base board
- `aesthetic`: string — may come from a different board if user mixed tokens
- `palette`: object — may come from a different board
- `typography`: object — may come from a different board
- `layout`: string — may come from a different board
- `hero`: string — may come from a different board
- `sections`: `{ name: string, comment: string }[]` — ordered list, user may have reordered, added, or removed sections; `comment` contains user instructions for that section (may be empty)

When building, respect the user's section comments as build instructions — they contain specific guidance like "focus on AI features here" or "keep this minimal."

### Example MOOD_BOARD_DATA structure (input)

```json
[
  {
    "name": "Warm Minimal",
    "vibe": "luxury hotel calm",
    "aesthetic": "Warm minimal",
    "palette": {
      "background": "#fafaf8",
      "signal": "#e07a5f",
      "secondary": "#81b29a",
      "neutrals": ["#2d2d2d", "#6b6b6b", "#a0a0a0", "#e8e5e0"]
    },
    "typography": {
      "display": { "family": "Instrument Serif", "weight": "400", "style": "italic" },
      "body": { "family": "Figtree", "weight": "400" },
      "mono": { "family": "Geist Mono" }
    },
    "layout": "Breathing",
    "hero": "Compositional hero — layered gradient mesh with backdrop-blur surfaces",
    "sections": ["Hero", "Metrics bar", "Split editorial", "Feature cards", "CTA", "Footer"]
  }
]
```

### Example confirmed spec (output)

```json
{
  "direction": "Warm Minimal",
  "vibe": "luxury hotel calm",
  "aesthetic": "Warm minimal",
  "palette": {
    "background": "#fafaf8",
    "signal": "#e07a5f",
    "secondary": "#81b29a",
    "neutrals": ["#2d2d2d", "#6b6b6b", "#a0a0a0", "#e8e5e0"]
  },
  "typography": {
    "display": { "family": "Instrument Serif", "weight": "400", "style": "italic" },
    "body": { "family": "Figtree", "weight": "400" },
    "mono": { "family": "Geist Mono" }
  },
  "layout": "Breathing",
  "hero": "Compositional hero — layered gradient mesh with backdrop-blur surfaces",
  "sections": [
    { "name": "Hero", "comment": "" },
    { "name": "Metrics bar", "comment": "show user count and notes created" },
    { "name": "Split editorial", "comment": "focus on the AI features here" },
    { "name": "Feature cards", "comment": "" },
    { "name": "CTA", "comment": "keep it simple, one button" },
    { "name": "Footer", "comment": "" }
  ]
}
```

---

## I. Stack

**Always build with a proper framework. Never output a single `.html` file.**

**Default stack: React + Tailwind CSS + shadcn/ui + Framer Motion**

If no project exists yet, scaffold one:
1. `npm create vite@latest <project-name> -- --template react-ts`
2. Install dependencies: `npm install` then add Tailwind, shadcn/ui, framer-motion, lucide-react
3. Initialize shadcn: `npx shadcn@latest init`
4. Add needed shadcn components: `npx shadcn@latest add button card badge input separator`

**Core stack rules:**
- Import shadcn from `@/components/ui/*` — Button, Card, Badge, Input, Separator, Dialog, Sheet, Tabs, Avatar, etc.
- Compose shadcn primitives into layouts. Don't reinvent buttons, inputs, or dialogs.
- Override shadcn defaults via Tailwind classes for brand differentiation.
- Lucide React for icons.
- CSS variables for theming, aligned with shadcn's `--background`, `--foreground`, `--primary`, etc.
- Google Fonts via `@import` for distinctive typography. Optimize with WOFF2 format and `unicode-range` subsetting when loading multiple weights.

**Animation technology is the user's choice, not yours.** The confirmed spec may include an `animation` field set in the workbench. Use whatever the user selected:
- `framer-motion` → Framer Motion (`framer-motion`) — spring physics, scroll-triggered reveals, layout animations, gesture handlers
- `gsap` → GSAP (`gsap` + `ScrollTrigger`) — timeline sequences, scroll-driven pinning, morphing, precise easing control
- `threejs` → Three.js / React Three Fiber (`@react-three/fiber` + `@react-three/drei`) — 3D WebGL scenes, particle fields, procedural geometry. See Section VII
- `spine` → Spine runtime — 2D skeletal animation for characters and illustrations
- `lottie` → Lottie (`lottie-react` or `@lottiefiles/react-lottie-player`) — After Effects JSON animations for icons, micro-interactions, loading states
- `css` → CSS only — transitions, keyframes, scroll-driven animations (no JS animation library)
- `rive` → Rive (`@rive-app/react-canvas`) — interactive state machines for buttons, toggles, complex UI components
- If no animation field is set, default to Framer Motion

Install the appropriate animation library based on the user's choice. Do NOT override their selection with a different library. CSS keyframes are always fine for ambient loops (pulse, marquee, float) regardless of the chosen animation tech.

**If the user already has a project**, build within it — read the existing structure, identify the right files to create/modify, and respect the existing architecture.

If the user explicitly specifies Vue, Svelte, Astro, or another framework — adapt but maintain identical design quality standards. Never fall back to vanilla HTML.

---

## II. Design Decision Framework

Before writing any code, make these five decisions. Each must be **deliberate and specific** — never default. These choices define the entire output. Two different sets of decisions on the same brief should produce two completely different sites.

### Decision 1: Aesthetic Direction

Commit to ONE clear direction:

| Direction | Feels like | Key traits |
|-----------|-----------|------------|
| Clean editorial | Magazine, gallery | Generous whitespace, restrained palette, typographic hierarchy |
| Warm minimal | Luxury hotel, wellness | Soft tones, rounded surfaces, breathing room, light backgrounds |
| Technical precision | Mission control, fintech | Monospace accents, data-dense, instrument-panel feel, dark UI |
| Soft brutalist | Streetwear, creative agency | Raw structure, bold type, 1px borders as design, but refined execution |
| Organic modern | Sustainability, food | Natural tones, flowing shapes, gentle motion, warm textures |

These are starting points, not the only options. Invent your own. The key word is **tasteful** — every choice intentional and considered.

### Decision 2: Palette

| Element | Rule |
|---------|------|
| Background | A *considered* base. Never pure white (#fff) or pure black (#000). Use: warm whites (#fafaf8, #f2efe9), cool grays (#f4f5f7), deep navies (#0b0e17, #08090d), rich darks (#0e1018). |
| Signal color | ONE vivid accent used sparingly — CTAs, highlights, active states. Make it **unexpected** for the category. Sneakers? Not red — try acid yellow. Physics lab? Not blue — try violet-rose. Aviation? Not silver — try cyan. |
| Secondary | Optional counterpoint. Used for badges, secondary highlights, data accents. |
| Neutrals | 3-4 shades for text hierarchy: primary, secondary (50-60% opacity), muted (25-30% opacity), borders (6-12% opacity). |
| System | Define ALL colors as CSS variables or Tailwind theme extensions. |

### Decision 3: Typography

Always THREE fonts with distinct roles. The typography system is what separates designed work from templates.

| Role | Purpose | Scale | Style rules |
|------|---------|-------|-------------|
| Display | Hero headings, section titles | 3.5rem–8rem+ | The personality font. Must work at massive scale. Serif, condensed, experimental — never safe. |
| Body | Readable content, UI labels, descriptions | 0.8rem–1.1rem | Clean but not generic. Complements display through contrast. |
| Mono | Metadata, badges, nav labels, technical text | 0.5rem–0.65rem | Always uppercase with letter-spacing (0.08em–0.4em). Creates the "designed system" feeling. |

**Font selection rules:**
- NEVER use: Inter, Roboto, Arial, Poppins, Montserrat, Open Sans, Space Grotesk. These are AI slop signals.
- NEVER reuse the same combination across different generations.
- Contrast is key: thin italic serif display + sturdy geometric body, or bold condensed sans display + light humanist body.
- The display font must look intentional at 6rem+, not just "big."

**Proven pairings** (use as inspiration, don't copy verbatim):
- Instrument Serif (italic display) + Figtree (body) + Geist Mono
- Cormorant Garamond (thin italic) + Familjen Grotesk (tight sans) + IBM Plex Mono
- Saira Condensed (technical) + Libre Franklin (geometric body) + Fira Code
- Cabinet Grotesk + Plus Jakarta Sans + JetBrains Mono
- Fraunces (display) + Outfit (body) + Commit Mono

### Decision 4: Layout Architecture

| Approach | Characteristics | Best for |
|----------|----------------|----------|
| Breathing | Generous padding (6rem–10rem vertical), max-width centering, whitespace as design | Editorial, luxury, SaaS |
| Grid-structured | Visible 1px borders, dense cells, borders as design elements, exposed structure | Brutalist, archival, streetwear |
| Asymmetric editorial | Split layouts, offset grids, overlapping layers, deliberate imbalance | Portfolios, agencies, studios |
| Full-bleed rhythm | Alternating contained/full-width sections, contrasting background colors per section | Product sites, landing pages |

### Decision 5: Visual Enhancement Strategy

Choose ONE hero technique. The LLM decides what serves the brief — 3D is powerful but not always appropriate.

**Option A: 3D / WebGL hero** (Three.js / React Three Fiber)
- When: The brief benefits from cinematic immersion (tech products, creative studios, research labs)
- In React: use React Three Fiber (`@react-three/fiber` + `@react-three/drei`) for declarative 3D
- In vanilla HTML: use Three.js r128 from CDN
- Procedural geometry + shaders — no external assets needed
- Canvas contained to hero section, fades on scroll, stops rendering when invisible
- See Section VII for geometry options: displacement blobs, particle networks, wireframe vehicles, faceted crystals, terrain

**Option B: Kinetic typography hero**
- When: The message IS the product (SaaS, agencies, content platforms)
- Massive display font at 8–12vw
- Staggered line reveals with overflow:hidden on parent spans
- Gradient text (`background-clip: text`), text-stroke, mix-blend-mode
- CSS-only — lightweight and universally supported

**Option C: Compositional hero**
- When: Clean editorial feel (portfolios, studios, luxury brands)
- Abstract gradient compositions, mesh gradients, geometric CSS patterns
- Layered transparencies, backdrop-blur surfaces
- CSS grid with deliberate overlap, asymmetric image/text placement

**Option D: Data-driven hero**
- When: Technical products, dashboards, developer tools
- Live-feeling metrics, animated counters
- Code snippets with syntax highlighting, terminal-style interfaces
- Subtle dot/grid backgrounds, monospace-forward layout

---

## III. Quality Rules (rams.ai)

After generating code, self-review against every rule. Fix violations before presenting output.

### Accessibility (Critical — never skip)

| Rule | Implementation |
|------|---------------|
| Image alt text | Every `<img>` has meaningful alt text |
| Icon buttons | Every icon-only button has `aria-label` |
| Form inputs | Every input has `<label>` or `aria-label` |
| Semantic HTML | No `onClick` on `<div>` — use `<button>`, `<a>` |
| Focus states | Never remove focus outlines. Use `focus-visible:ring-2 focus-visible:ring-ring` or equivalent |
| Color independence | Color is never the ONLY way to convey information |
| Touch targets | Minimum 44×44px on all interactive elements |
| Heading hierarchy | Never skip levels (h1 → h2 → h3, not h1 → h3) |
| Contrast | WCAG AA minimum: 4.5:1 for text, 3:1 for large text |
| Decorative elements | Add `aria-hidden="true"` to all purely decorative content (3D canvas, abstract visuals, divider icons) |
| Navigation | Use `role="navigation"` with `aria-label` on nav elements |
| Landmarks | Footer gets `role="contentinfo"`, main content gets `<main>` |

### CSS Architecture (Critical — Tailwind v4)

- NEVER add a universal `* { margin: 0; padding: 0; box-sizing: border-box; }` reset. Tailwind v4's `@import "tailwindcss"` already includes a proper reset in `@layer base`. An unlayered universal reset placed after the import will override all Tailwind utility classes (padding, margin, etc.), breaking all layout.
- `@import "tailwindcss"` MUST be the first `@import` in `index.css`. External font imports (`@import url(...)`) go in `<link>` tags in `index.html` instead — putting them after the Tailwind import causes a PostCSS error that silently breaks the entire stylesheet.
- Custom CSS that goes in `index.css` should only include: `@theme {}` tokens, `::selection` styles, `body` base styles, animation keyframes, and component-specific classes. Let Tailwind handle the reset.

### Layout & Centering (Critical — verify visually)

Every section must be visually balanced. Misalignment, off-center content, and awkward whitespace distribution are the most common layout failures. Prevent them with these rules:

| Rule | Implementation |
|------|---------------|
| **Content centering** | All section content containers use `max-w-*` + `mx-auto` for horizontal centering. Never leave a `max-w-*` div without `mx-auto` — it will hug the left edge on wide screens. |
| **Hero alignment** | Center-aligned heroes (`text-center` + centered container) are the safe default. Left-aligned heroes ONLY work when the right side has balancing content (an image, 3D scene, illustration). A left-aligned text block with empty right space looks broken, not editorial. |
| **Hero vertical centering** | Full-viewport heroes (`min-h-screen` + `flex justify-center`) must account for content height. Add `py-20` so content never touches viewport edges. The headline + subtext + buttons should occupy roughly 40–60% of viewport height, leaving breathing room above and below. |
| **Hero headline sizing** | Display headings must not overwhelm the viewport. Cap the `clamp()` max at `5rem–5.5rem` (not 7–8rem). A headline that fills the entire screen width reads as a bug, not a design choice. At desktop widths the headline should occupy ~60–80% of the container width, not 100%. |
| **Subtext and CTA alignment** | Subtext and buttons must follow the same alignment as the headline. If the headline is centered, the subtext container gets `mx-auto` and buttons get `justify-center`. Mismatched alignment (centered headline, left-aligned buttons) looks like a mistake. |
| **Content overflow** | Display headings at `clamp()` sizes can overflow at extreme viewport widths. Test the hero at mobile (375px) and wide desktop (1920px). Use `overflow-hidden` on line-reveal containers only, never on the section itself. |
| **Section padding consistency** | Every section uses the same horizontal padding as the hero: `px-6 md:px-12 lg:px-20` (or the project's equivalent). Mismatched side padding creates a jagged left edge. |
| **Max-width consistency** | Pick ONE `max-w-*` for body section containers (e.g., `max-w-6xl`) and use it everywhere. The hero's inner content can use a tighter width (e.g., `max-w-3xl`) for centered headlines, but section-level containers must be consistent. |
| **Font loading** | Load fonts via `<link>` in the HTML `<head>` with `rel="preconnect"`. Never use CSS `@import url()` for fonts — it blocks rendering and breaks in Tailwind v4's PostCSS pipeline. |

### Responsive Design

Use intentional breakpoints, not arbitrary defaults:

| Tier | Breakpoint | Focus |
|------|-----------|-------|
| Mobile | < 810px | Single column, stacked sections, touch-optimized spacing, 16px+ body text |
| Tablet | 810px – 1199px | 2-column layouts where appropriate, adjusted hero scale, readable line lengths |
| Desktop | 1200px+ | Full layout expression, multi-column grids, dramatic typography scale |

- Typography should be fluid: use `clamp()` for display headings (e.g., `clamp(2.5rem, 6vw, 7rem)`), not fixed sizes with breakpoint overrides.
- Spacing scales with viewport: padding and gaps should increase at each tier, not stay fixed.
- Test the hero at every tier — a 3D scene that looks cinematic at 1440px may overwhelm at 375px.

### Performance

- **Font loading** — use `font-display: swap` and limit to 2-3 weights per family. Subsetting with `unicode-range` when available. Load fonts via `<link rel="preload">` for critical display fonts.
- **Lazy loading** — images and heavy sections below the fold get `loading="lazy"`. Use `fetchpriority="high"` on hero images/assets.
- **Asset optimization** — prefer SVG for icons and illustrations, WebP for photos. Inline small SVGs directly.
- **Module preloading** — in Vite/React projects, critical path components benefit from dynamic `import()` for code splitting. Keep the initial bundle lean.

### Visual Consistency

- Spacing from a consistent scale (Tailwind's spacing or 4px/8px multiples)
- No mixed font families beyond the three declared roles
- Line heights consistent per role: display `leading-tight` (1–1.1), body `leading-relaxed` (1.7–2), mono `leading-normal`
- Borders and shadows use a consistent system, not random values
- Z-index follows a defined stacking order (nav: 9000, overlays: 8000, modals: 7000)

### Animation & Motion Architecture

Professional motion design follows these principles (inspired by Framer's production patterns):

- **Easing curves** — two professional options, choose one per project and use consistently:
  - Expo out: `cubic-bezier(0.16, 1, 0.3, 1)` — fast attack, long settle. Best for reveals and entrances.
  - Framer standard: `cubic-bezier(0.6, 0, 0.05, 1)` — smooth and controlled. Best for transitions and UI state changes.
  - Never use `ease` or `linear` for UI motion. Reserve `linear` only for infinite loops (marquee, rotation).
- **Timing** — appear animations: 0.8–1.2s duration with 0.1–0.2s stagger between siblings. Initial delay before first element: 0.3–0.5s after page load. Don't rush — professional motion breathes.
- **Transform-only animations** — always animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, or `margin` — these trigger layout reflow and jank.
- **Reduced motion** — always respect `prefers-reduced-motion`. Wrap motion in a media query or Framer Motion's `useReducedMotion`. When reduced motion is active, skip animations entirely — don't just slow them down.
- **Performance tracking** — on scroll-driven animations, use `will-change: transform` on animated elements and remove it after animation completes.

### Interactive States

- Every hoverable element has a hover state that **surprises** (not just opacity)
- Every focusable element has a `focus-visible` state
- Buttons: hover, active, disabled states
- In Framer Motion: use `whileHover`, `whileTap`, and `whileFocus` for declarative interactive states
- Transitions are consistent: use the chosen easing curve from Animation Architecture above

---

## IV. Anti-Slop Checklist

Verify before presenting output. If any item fails, fix it.

```
□ Palette is specific and non-default (not blue-on-white, not purple gradient)
□ All 3 fonts are distinctive (never Inter/Roboto/Poppins/Montserrat)
□ shadcn components used where appropriate (don't reinvent buttons/inputs)
□ No rounded-lg shadow-md on everything — vary depth techniques
□ Hover states surprise (scale, translate, border-color, background swap, inversion — not just opacity)
□ At least one section breaks the expected grid (asymmetry, overlap, offset)
□ Typography at dramatic scale somewhere (6rem+ display, or extreme weight contrast)
□ Decorative details exist (grain overlay, subtle patterns, geometric accents, gradient glows)
□ Product/placeholder cards each have UNIQUE abstract compositions (never identical)
□ Motion is orchestrated (staggered reveals, scroll-triggered, not simultaneous)
□ All rams.ai accessibility rules pass
□ Reduced motion is respected (prefers-reduced-motion disables animations)
□ No layout-triggering animations (only transform + opacity, never width/height/top/left)
□ Responsive at all 3 tiers — hero, typography, and spacing adapt to mobile/tablet/desktop
□ Hero content is vertically AND horizontally centered (not flush to top, not hugging left edge)
□ Hero headline caps at ~5rem max — not so large it fills the entire viewport width
□ Subtext and buttons follow the same alignment as the headline (all centered or all left-aligned)
□ Left-aligned heroes have balancing content on the right (image, 3D, illustration) — never empty space
□ All section content containers have mx-auto (no left-hugging content on wide screens)
□ Horizontal padding is consistent across all sections (no jagged left/right edges)
□ Fonts load via <link> in HTML head, NOT via @import url() in CSS (Tailwind v4 breaks @import order)
□ The design has a clear describable vibe — one phrase captures it
□ This does NOT look like a Bootstrap/Tailwind template
```

---

## V. Content Layer Principles

These are **design principles**, not templates. Each section you build should be a fresh creative
decision informed by the confirmed spec — the palette, typography, layout approach, and aesthetic
direction. Two builds with the same section list should produce completely different implementations.

### Core principles

1. **Rhythm through contrast** — alternate between dense and spacious, dark and light, text-heavy
   and visual-heavy. A page needs breathing room AND moments of intensity. Never repeat the same
   density twice in a row.

2. **Every section earns its place** — if a section doesn't serve the narrative or create visual
   rhythm, cut it. Fewer sections executed beautifully beats many sections executed generically.

3. **Typography does the heavy lifting** — the three-font system (display, body, mono) should be
   visible in every section. Mono for labels/metadata, display for statements, body for explanation.
   The interplay between these three creates the "designed system" feel.

4. **No two cards alike** — when building grids of similar items (features, team, products), each
   card MUST have a unique visual treatment. Vary gradient directions, geometric accents, glow
   colors, composition techniques. This is non-negotiable — identical cards are the #1 AI slop signal.

5. **Motion is choreographed, not applied** — scroll reveals should feel like a curtain lift, not
   a pop. Stagger siblings. The hero title entrance is the most important animation — give it
   special treatment. Everything else supports, never competes.

6. **Hover states surprise** — never just opacity. Use transform, color inversion, border shifts,
   background swaps, glow effects. Each interactive element should reward engagement.

### Section thinking (not section templates)

When you encounter a section name in the confirmed spec (e.g., "Feature cards", "Split editorial",
"Metrics bar"), treat it as a **creative brief**, not a component to instantiate. Ask yourself:

- What does this section need to **communicate**?
- How does it create **contrast** with the sections above and below it?
- Which design tokens (palette, typography, layout) should be most prominent here?
- What's the one **unexpected detail** that makes this section feel crafted?

The section names from the workbench are starting points. "Feature cards" might become a staggered
asymmetric grid, a numbered list with hover-reveal descriptions, or a full-width showcase with
overlapping elements — depending on the aesthetic direction. "Metrics bar" might be a dense
instrument panel, a generous breathing-room number display, or a scrolling data ticker. You decide.

### What to avoid

- Cookie-cutter card grids where every card is `rounded-lg shadow-md p-6`
- Sections that look identical except for content swapped in
- Revealing all elements simultaneously on scroll
- Generic hover states (opacity change only)
- Placeholder compositions that repeat the same gradient across cards

---

## VI. Decorative Details

These small touches separate designed work from templates:

**Noise/grain overlay** — Fixed full-viewport pseudo-element (body::after) with an SVG feTurbulence noise pattern at very low opacity (0.02–0.04). Adds texture without weight. pointer-events: none so it doesn't block interaction.

**Section tags** — Before each section heading, a mono uppercase label with a small gradient line (signal color fading to transparent). Creates the "designed system" cadence.

**Gradient glows** — Radial gradient pseudo-elements behind CTAs, hero content, and feature cards on hover. Low opacity (0.04–0.15), signal color. Adds depth without being obvious.

**1px borders as design** — Not just dividers — structural elements. Between metrics, around cards, as grid lines. The border IS the design in grid-structured layouts.

**Scroll indicator** — Bottom of hero: mono text "Scroll" + a thin animated line pulsing downward. Signals there's more below.

**Status dots** — Pulsing small circles (5-8px) next to badges or announcements. Signal aliveness.

**::selection** — Custom text selection color matching the signal color.

---

## VII. 3D Hero Guidelines

Only use when Decision 5 = Option A. These are principles, not code to copy.

### Two approaches

**Raw Three.js** — for vanilla HTML or single-file builds. Full shader control. Load from CDN.

**React Three Fiber** (`@react-three/fiber` + `@react-three/drei`) — for React projects. Declarative scene graph in JSX, `useFrame` for animation loops, Drei helpers like `<Float>` and `<Stars>` when they add value. Install: `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`.

### Core principles

**Canvas containment** — the 3D canvas lives inside the hero section (position absolute), NOT full-page. It fades on scroll and stops rendering when invisible. Use IntersectionObserver to pause the animation loop entirely — don't just hide the canvas.

**Mouse interaction** — camera or geometry should respond to mouse via smooth lerp (0.03–0.05 interpolation factor). Never snap. The scene should feel alive but not twitchy.

**Fog** — match the scene fog color to the page background. FogExp2 at low density (0.04–0.08) creates depth without obscuring.

**Tone mapping** — use ACES Filmic for cinematic color response.

### Geometry directions

Choose procedural geometry that serves the brief — no external models or assets:
- **Particle networks** — scattered points with connection lines, good for science/tech/data themes
- **Organic displacement** — icosahedron or sphere with noise-based vertex displacement, custom shaders for color mixing and fresnel rim glow
- **Faceted crystals** — low-poly dodecahedrons with physical materials (metalness, clearcoat), companion floating planes and orbiting torus rings
- **Wireframe terrain** — displaced plane geometry with wireframe material, good for aviation/landscape/mapping themes
- **Wireframe objects** — recognizable shapes built from primitive geometries (boxes, cylinders, extrusions, tubes) composed in a group. Dual-material technique: transparent wireframe in signal color overlaid on dark solid mesh. Add particle fields for atmosphere and grid floors for grounding.
- **Speed/motion particles** — streaming point clouds that reset position each frame, creating a sense of velocity. Pair with wireframe objects.

### Lighting (minimum 3)

Every scene needs at least 3 lights with distinct roles:
- **Key light** — signal color, orbits slowly around the subject
- **Fill light** — contrasting hue to the key, static or slow drift, lower intensity
- **Rim light** — signal color, high intensity, close range, creates edge definition

In R3F these are JSX elements. In raw Three.js, create DirectionalLight and PointLight instances.

### Performance rules

- Cap pixel ratio at 2 (raw: `setPixelRatio`, R3F: `dpr={[1, 1.5]}`)
- Max 800 particles for particle systems
- Stop the entire animation loop when scrolled out of view
- No shadows unless the design specifically demands them
- Keep geometry detail reasonable (40-64 subdivisions max for displacement)
- In R3F: memoize materials and geometries to prevent re-creation on render

---

## VIII. What This Skill Produces vs. What It Doesn't

**This skill produces:**
- Single-file frontends (.html or .jsx) that look handcrafted
- Distinctive, non-repeating designs across generations
- Accessible, performant, production-quality code
- Sites that feel like they belong on Awwwards, not in a template gallery

**This skill does NOT produce:**
- Multi-file project scaffolds (unless requested)
- Backend logic or API integrations
- Content strategy or copywriting (it uses placeholder content that fits the tone)
- External 3D model loading (all 3D is procedural, no assets needed)

---

## IX. Generation Examples

These are outputs that validated this framework. Each used the same skill but different decisions, producing completely different results:

**DEADSTOCK** (dark sneaker e-commerce)
- Decisions: Dark bg (#0a0a08), neon volt signal (#c8ff2e), elongated ellipsoid 3D with noise shader, horizontal scroll product strip, flowing layout
- Result: Streetwear energy, each product card had unique abstract gradient art, organic blob hero

**Sole Archive** (brutalist sneaker e-commerce)
- Decisions: Light bone bg (#f2efe9), cyan signal (#00f0ff), faceted dodecahedron crystal, grid-exposed layout with 1px borders everywhere, yellow highlight markers
- Result: Same brief (sneakers), completely different output — editorial/archival vs streetwear

**Stratos** (AI aviation simulator)
- Decisions: Dark navy (#0b0e17), cyan HUD (#00f0ff) + amber warning, wireframe terrain hero, dense cockpit-panel layout, clipped-corner buttons
- Result: Technical precision aesthetic, telemetry data bars, HUD corner brackets, scanline effects

**Axiom Labs** (AI physics research lab)
- Decisions: Deep void (#08090d), violet-rose signal (#c084fc), particle network hero with mouse repulsion + connection lines, breathing layout, warm serif display
- Result: Alive and scientific, particle field responds to mouse, editorial content layer with publications list and numbered research cards

Same framework, four completely different outputs. The decisions drive the design, not templates.
