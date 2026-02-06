# Design Rules Reference

## Core Principles

- Simplicity is the ultimate sophistication. If it feels complicated, the design is wrong.
- Start with the user's eyes. Where do they land? That's your hierarchy test.
- Remove until it breaks. Then add back the last thing.
- The details users never see should be as refined as the ones they do.
- Design is not decoration. It is how it works.
- Every pixel references the system. No rogue values. No exceptions.
- Every screen must feel inevitable at every screen size.
- Propose everything. Implement nothing without approval. Your taste guides. The user decides.

## Simplicity Is Architecture

- Every element must justify its existence.
- If it doesn't serve the user's immediate goal, it's clutter.
- The best interface is the one the user never notices.
- Complexity is a design failure, not a feature.

## Hierarchy Drives Everything

- Every screen has one primary action. Make it unmissable.
- Secondary actions support, they never compete.
- If everything is bold, nothing is bold.
- Visual weight must match functional importance.

## Whitespace Is a Feature

- Space is not empty. It is structure.
- Crowded interfaces feel cheap. Breathing room feels premium.
- When in doubt, add more space, not more elements.

## Consistency Is Non-Negotiable

- The same component must look and behave identically everywhere it appears.
- If you find inconsistency, flag it. Do not invent a third variation.
- All values must reference design system tokens — no hardcoded colors, spacing, or sizes.

## Alignment Is Precision

- Every element sits on a grid. No exceptions.
- If something is off by 1-2 pixels, it's wrong.
- Alignment is what separates premium from good-enough.
- The eye detects misalignment before the brain can name it.

## Design the Feeling

- Premium apps feel calm, confident, and quiet.
- Every interaction should feel responsive and intentional.
- Transitions should feel like physics, not decoration.
- The app should feel like it respects the user's time and attention.

## Responsive Is the Real Design

- Mobile is the starting point. Tablet and desktop are enhancements.
- Design for thumbs first, then cursors.
- Every screen must feel intentional at every viewport — not just resized.
- If it looks "off" at any screen size, it's not done.

## No Cosmetic Fixes Without Structural Thinking

- Do not suggest "make this blue" without explaining what the color change accomplishes in the hierarchy.
- Do not suggest "add more padding" without explaining what the spacing change does to the rhythm.
- Every change must have a design reason, not just a preference.

---

## Animation

- **Compositor-only**: Only animate `transform` (translate, scale, rotate) and `opacity`. These run on the GPU compositor thread and don't trigger layout or paint.
- **No animated blur/filter**: `filter: blur()` forces re-rasterization every frame. If blur is needed, apply it statically to a wrapper element — never to the element being animated.
- **Entrance easing**: Use `ease-out` (or a custom cubic-bezier with ease-out character like `[0.2, 0.65, 0.2, 1]`). Never `linear` for UI entrances.
- **Off-screen pause**: Looping animations (e.g. GradientBlob) should pause when off-screen via IntersectionObserver or framer-motion's `whileInView`. Saves GPU cycles.
- **`prefers-reduced-motion`**: Wrap motion in framer-motion's `<MotionConfig reducedMotion="user">` or equivalent. Already configured project-wide.
- **Duration**: Entrances 0.3-0.7s. Looping ambient 12-25s. Never > 1s for user-triggered transitions.

### Scroll-Driven Animations

- **Sticky/pinned sections**: Scroll container height should be 2-4x viewport height. Inner container uses `sticky top-0 h-[100dvh]` to pin content while the outer container scrolls.
- **Image sequences**: Minimum 3 images for smooth transitions. Use crossfade (opacity-based) transitions — never hard-cut. Wrap in a tall scroll container so each image gets enough scroll distance.
- **Horizontal scroll galleries**: Items should be 70-80vw wide at desktop, 90vw at mobile. Driven by vertical scroll mapped to horizontal `translateX` via `useTransform`.
- **Implementation**: All scroll-driven animations must use framer-motion `useScroll` + `useTransform`. These produce compositor-only transforms.
- **Layout safety**: Never animate layout properties (width, height, padding, margin, flex) during scroll — only `transform` and `opacity`.

### Animation Mode Design Guidelines

The user selects an animation mode during Phase 2. Each mode has distinct design implications beyond just which components are available.

**Static**: Motion is removed, not degraded. The page must feel complete and intentional without any animation. Invest more in typographic hierarchy — larger headline/body contrast, more deliberate weight usage, stronger visual rhythm through spacing and alignment. The page should feel like a well-designed print layout: every element precisely placed, every relationship between elements clearly communicated through size, weight, and space alone.

**Subtle**: Entrance animations create progressive discovery as the user scrolls. Vary entrance directions across sections (fadeInUp for content, fadeInLeft/Right for split layouts, scaleIn for featured elements). Don't compensate for missing scroll-driven effects with MORE entrance animations — restraint is key. Fewer well-placed entrances are better than animating everything. A section with one carefully timed reveal has more impact than a section where every element bounces in.

**Cinematic**: Every scroll effect must earn its place. A horizontal gallery with only 2 items is worse than a grid. A pinned section with a single phase is worse than a simple scroll. Vary between fast-flowing sections (normal scroll with entrance animations) and pinned/scroll-driven sections to create pacing and rhythm. The experience should feel choreographed — like a film with establishing shots, close-ups, and transitions — not overwhelming.

**Background Ambient**: Content itself is static and immediate — no entrance animations, no scroll-triggered reveals. Atmosphere comes from the background: slow-drifting gradient blobs, gentle parallax on decorative layers, video backgrounds with overlays. The effect is calm and atmospheric. This mode suits brands that want visual richness and mood without making the user feel like they're "driving" the animation through scrolling.

**Scroll-driven animations (ScrollPinnedReveal, HorizontalScrollGallery, ScrollImageSequence, ScrollLinkedProgress) are Cinematic mode only.**

## Gradients

- Allowed for dark-theme atmosphere: surface tints, subtle radial accents behind cards, section backgrounds.
- **Never purple-on-white** or neon-on-light. These read as generic AI slop.
- **Never as primary affordances** (buttons should use solid/semi-transparent fills, not gradient-only).
- Max 1-2 gradient uses per section. More reads as noisy.
- Keep gradient colors within the theme palette; don't introduce arbitrary hues.

## Blur

- Static decorative blur ≤ 16px is fine (e.g. `blur-2xl` on a non-animated decorative element).
- **Never animate blur**. `filter: blur()` is not compositor-friendly and causes jank.
- Never apply large blur (> 8px) to an element that also has transform animations — the browser must re-composite the blurred layer every frame.
- Backdrop-filter (`backdrop-blur`) is acceptable for static glass-morphism effects on non-animated containers.

## Typography

- `text-balance` on all headings (`h1`-`h4`). Prevents awkward short last lines.
- `text-pretty` on all body/paragraph text. Improves line-break quality.
- **Font must be distinctive** — never default to Inter, Roboto, Arial, or system-ui. Pick a font that reinforces the brief's tone (e.g. Space Grotesk for tech, Libre Baskerville for editorial, DM Sans for friendly SaaS).
- Vary the font between generations so pages don't look identical.
- Use 2-3 font weights max per page. Excessive weight variation looks messy.
- **Hero headlines**: `text-6xl md:text-8xl` minimum for editorial/luxury tones. Undersized hero text kills the premium feel.
- **Section headings**: `text-3xl md:text-5xl` for clear hierarchy below the hero.
- **Weight at scale**: Use `font-extralight` or `font-light` for large headlines. Heavy weights at large sizes feel aggressive and crowd the viewport.
- **Letter-spacing**: `tracking-tight` for geometric/sans-serif fonts. `tracking-wide` for serif/editorial fonts. Match spacing to the font's character.

## Color

- Color is used with restraint and purpose.
- Colors guide attention, they never scatter it.
- Contrast must be sufficient for accessibility (WCAG AA minimum).
- Keep the palette tight: 1 primary accent, 1-2 secondary/tertiary. No rogue hues.
- **Dark theme surface hierarchy**: Use 2-3 background levels (page-bg, surface, surface-elevated) for depth. Each level should be subtly lighter than the last.
- **Accent discipline**: Max 1 primary accent, 1 secondary accent. Never 3+ competing accent colors — it fragments attention.
- **Text on dark backgrounds**: Pure white (`#fff`) is harsh and fatiguing. Use off-white in the `#eef1f5` range for body text. Reserve pure white for primary headlines only.

## Iconography

- Icons must be consistent in style, weight, and size across the entire app.
- Use one cohesive set, never mix from different libraries.
- Icons support meaning, they don't decorate.

## Glow Effects

- Never use glowing blobs or halos as primary visual affordances.
- Subtle ambient glow (e.g. a faint radial gradient behind a hero) is fine at low opacity (≤ 0.3).
- `box-shadow` with colored spread for button hover is acceptable at moderate intensity.
- If a section already has a gradient background, don't stack a glow on top.

## Layout

- Use `dvh` (dynamic viewport height) instead of `vh` for full-height sections. `vh` doesn't account for mobile browser chrome and causes content to be hidden behind toolbars.
- `min-h-[100dvh]` for full-page sections, `min-h-[88dvh]` for near-full hero sections.
- **Section rhythm**: Alternate between full-bleed sections and contained sections (`max-w-6xl mx-auto`) to create visual rhythm. A page of all full-bleed or all contained sections feels monotonous.
- **Vertical padding**: `py-24` minimum between sections. `py-32` for major transitions (e.g. before/after hero, before CTA). Generous spacing is what separates premium from cramped.
- **Hero sections**: Always full-bleed, always `min-h-[100dvh]`. The hero sets the tone — it must command the entire viewport.

## Logo / Wordmark

- **Code-generated SVG text wordmarks** are more reliable than AI-generated logos. Use an inline `<svg>` with a `<text>` element styled with the theme font for consistent, crisp results.
- **Recraft for logos**: Only use Recraft for symbol marks or abstract icons — never for text or wordmarks. AI text rendering is unreliable and often produces illegible results.
- **SVG post-processing** is required for all Recraft-generated SVGs:
  1. Remove the first `<path>` element (white background rectangle that Recraft always includes)
  2. Replace dark fills (anything darker than `rgb(80, 80, 80)`) with theme-appropriate light colors
  3. Fix `preserveAspectRatio="none"` to `"xMidYMid meet"` for correct scaling

## 3D / WebGL Elements

- **Optional enhancement** — not required for every generation. Use when it genuinely elevates the experience.
- **Best for**: Product showcases, architectural/interior design, tech products, hero sections where a static image feels flat.
- **Lazy-load always**: Use `React.lazy` + `Suspense` to avoid impacting initial paint and core web vitals.
- **Fallback required**: Fall back to a static image on mobile or low-performance devices. WebGL support is not universal.
- **Interaction**: Auto-rotate slowly or link rotation to scroll progress via `useScroll`. Never make 3D elements user-draggable by default — it creates accidental interactions on mobile.
- **Scene complexity**: Keep it minimal. Single object + ambient light + subtle contact shadow. Complex scenes with multiple objects, multiple lights, and environment maps tank performance on mid-range devices.

## Aesthetic Direction

- Every generation must commit to a **specific tone** derived from the brief. Examples: "brutalist fintech", "warm editorial", "minimal developer tool", "retro gaming".
- Never default to "generic SaaS" — no safe blue-purple gradients, no generic "Accelerate your workflow" copy.
- Vary visual identity between generations: different fonts, different accent palettes, different section ordering.
- The tone should inform every choice: border radius, spacing density, animation intensity, color temperature.

## States

- **Empty states**: Every screen/section with no data must feel intentional, not broken. Guide the user toward their first action.
- **Loading states**: Skeleton screens, spinners, or placeholders must be consistent. The app should feel alive while waiting, not frozen.
- **Error states**: Error messages styled consistently, helpful and clear, never hostile or technical.
- **Hover/Focus/Disabled**: All interactive elements must account for every state. No unhandled interactions.

## Anti-Patterns to Avoid (AI Slop)

- Purple-cyan gradient backgrounds on everything
- Animated blur on text reveals
- Floating glow orbs with no design purpose
- Generic stock-photo-style hero with overlay
- "Built for the future" / "Accelerate your workflow" copy
- 4+ gradient colors in a single element
- Excessive border-radius on everything (pick a radius system and stick to it)
- Identical card grids for every section — vary layouts between sections
- Same animation preset (`fadeInUp`) for every element — mix presets across sections
- Same vertical padding for every section — vary rhythm with different spacing
- Gradient blobs without a clear design purpose — if it's just "atmosphere", question whether it's needed
- Feature icons that add visual noise without meaning — numbered lists are often cleaner and more editorial
- Using Inter/system-ui and calling it "clean design"
- Elements that exist for visual flair but communicate nothing
- Inconsistent spacing that makes sections feel disconnected
- Typography that competes with itself (too many sizes, weights, or styles)
- Using scroll-driven components (ScrollPinnedReveal, HorizontalScrollGallery, ScrollImageSequence) when the user chose Static or Subtle mode
- Installing heavy animation libraries (framer-motion, GSAP) when the user chose Static mode and the repo has none — use CSS or no animation
- Ignoring the target repo's existing patterns and conventions — always adapt to what's already there
- Generating framer-motion code in Vue/Svelte/Astro projects instead of using framework-native solutions
- Treating Static mode as "Cinematic minus the animations" — Static requires its own design approach with stronger typography and composition
