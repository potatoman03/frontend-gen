# Animation Presets & Components

Defined in `src/lib/animation-presets.ts`. Components in `src/components/ui/`.

---

## Available Presets

### `fadeInUp`
- **Description**: Element fades in while sliding up from below.
- **Use case**: Default entrance for section content — headings, paragraphs, buttons, cards.
- **Values**: `y: 28 -> 0`, `opacity: 0 -> 1`
- **Duration**: 0.65s
- **Easing**: `[0.2, 0.65, 0.2, 1]` (ease-out)

### `fadeInDown`
- **Description**: Element fades in while sliding down from above.
- **Use case**: Top-entering elements — dropdown content, navbar items, notification-style reveals.
- **Values**: `y: -24 -> 0`, `opacity: 0 -> 1`
- **Duration**: 0.65s
- **Easing**: `[0.2, 0.65, 0.2, 1]`

### `fadeInLeft`
- **Description**: Element fades in while sliding in from the left.
- **Use case**: Asymmetric layouts — media on the left side of split sections, numbered list items entering from left.
- **Values**: `x: -30 -> 0`, `opacity: 0 -> 1`
- **Duration**: 0.65s
- **Easing**: `[0.2, 0.65, 0.2, 1]`

### `fadeInRight`
- **Description**: Element fades in while sliding in from the right.
- **Use case**: Asymmetric layouts — content on the right side of split sections, paired with `fadeInLeft` for visual dialogue.
- **Values**: `x: 30 -> 0`, `opacity: 0 -> 1`
- **Duration**: 0.65s
- **Easing**: `[0.2, 0.65, 0.2, 1]`

### `scaleIn`
- **Description**: Element fades in while scaling up from slightly smaller.
- **Use case**: Cards, images, CTA sections, anything that should feel like it's "arriving" with presence.
- **Values**: `scale: 0.92 -> 1`, `opacity: 0 -> 1`
- **Duration**: 0.65s
- **Easing**: `[0.2, 0.65, 0.2, 1]`

### `staggerContainer(stagger, delayChildren)`
- **Description**: Container variant that staggers its children's entrance animations. Does not animate itself — it orchestrates child timing.
- **Use case**: Grids, lists, feature rows, any group of items that should reveal sequentially.
- **Parameters**:
  - `stagger` (default `0.1`): Delay between each child's entrance in seconds.
  - `delayChildren` (default `0`): Initial delay before the first child begins.
- **Children**: Each child must use its own variant (e.g. `fadeInUp`, `scaleIn`) with `hidden`/`visible` states.

### `shimmer`
- **Description**: Background position animation that creates a shimmer/loading effect. Loops infinitely.
- **Use case**: Loading placeholder backgrounds for images or content that hasn't loaded yet.
- **Values**: `backgroundPosition: 200% 0% -> -200% 0%`
- **Duration**: 2.4s per cycle
- **Easing**: `linear` (appropriate for continuous background animation)
- **Loop**: Infinite

---

## Available Components

### `ScrollReveal`
**File**: `src/components/ui/ScrollReveal.tsx`

Wraps any element with a scroll-triggered entrance animation. When the element enters the viewport, it transitions from `hidden` to `visible` using the specified variant.

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variants` | `Variants` | `fadeInUp` | Framer-motion variant object with `hidden`/`visible` states |
| `delay` | `number` | `0` | Delay before animation starts (seconds) |
| `once` | `boolean` | `true` | If true, animates only the first time element enters viewport |
| `amount` | `number` | `0.25` | Fraction of element that must be visible to trigger (0-1) |
| `className` | `string` | — | Additional CSS classes |

**Example**:
```tsx
<ScrollReveal variants={scaleIn} delay={0.1}>
  <Card>...</Card>
</ScrollReveal>
```

### `StaggerChildren`
**File**: `src/components/ui/StaggerChildren.tsx`

Container that staggers the entrance of its children. Each child should use a variant with `hidden`/`visible` states (typically via `ScrollReveal` or direct `motion.div`).

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stagger` | `number` | `0.12` | Delay between each child's entrance (seconds) |
| `delayChildren` | `number` | `0` | Initial delay before first child animates |
| `className` | `string` | — | Additional CSS classes |

**Example**:
```tsx
<StaggerChildren stagger={0.1}>
  {items.map(item => (
    <ScrollReveal key={item.id} variants={fadeInUp}>
      <Card>{item.title}</Card>
    </ScrollReveal>
  ))}
</StaggerChildren>
```

### `ParallaxLayer`
**File**: `src/components/ui/ParallaxLayer.tsx`

Scroll-linked depth movement. The element translates vertically as the user scrolls, creating a parallax depth effect. Uses `useScroll` + `useTransform` for compositor-only animation.

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `number` | `-40` | Starting translateY value (px) when element enters viewport |
| `to` | `number` | `40` | Ending translateY value (px) when element exits viewport |
| `className` | `string` | — | Additional CSS classes |

**Example**:
```tsx
<ParallaxLayer from={-30} to={30}>
  <h1>Hero Headline</h1>
</ParallaxLayer>
```

### `AnimatedText`
**File**: `src/components/ui/AnimatedText.tsx`

Word-by-word or letter-by-letter headline entrance animation. Each token fades in and slides up with a staggered delay.

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | — | The text to animate (required) |
| `mode` | `"word" \| "letter"` | `"word"` | Split by words or individual letters |
| `delay` | `number` | `0` | Initial delay before first token animates |
| `className` | `string` | — | Additional CSS classes |

**Timing**:
- Word mode: 0.04s delay between each word, 0.45s duration per word
- Letter mode: 0.015s delay between each letter, 0.45s duration per letter
- Easing: `[0.2, 0.65, 0.2, 1]`

**Example**:
```tsx
<h1>
  <AnimatedText text="Design Without Compromise" mode="word" />
</h1>
```

### `VideoBackground`
**File**: `src/components/ui/VideoBackground.tsx`

Full-coverage video or image background with a dark overlay. Handles three states with `AnimatePresence` crossfade: video playing, fallback image, or gradient placeholder.

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videoSrc` | `string \| null` | — | URL to video file. If null, falls back to image or gradient |
| `fallbackImageSrc` | `string \| null` | — | URL to fallback image when no video is available |
| `overlayOpacity` | `number` | `0.45` | Opacity of the dark overlay (0-1) |
| `className` | `string` | — | Classes for the outer container |
| `overlayClassName` | `string` | — | Classes for the overlay element |

**Behavior**:
- Video: autoplays, muted, loops, plays inline
- Crossfade: 0.7s opacity transition between states
- Overlay: solid dark color at specified opacity, positioned over media

**Example**:
```tsx
<VideoBackground
  videoSrc={assets.heroVideo}
  fallbackImageSrc={assets.heroImage}
  overlayOpacity={0.4}
/>
```

### `GradientBlob`
**File**: `src/components/ui/GradientBlob.tsx`

Animated atmospheric decoration element. A blurred radial gradient that slowly scales, rotates, and drifts. **Use sparingly** — only for subtle dark-theme atmosphere, never as a primary affordance or focal point.

**Props**:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorA` | `string` | `var(--accent-primary)` | First gradient color |
| `colorB` | `string` | `var(--accent-tertiary)` | Second gradient color |
| `duration` | `number` | `18` | Full animation cycle duration (seconds) |
| `className` | `string` | — | Additional CSS classes (must include positioning + size) |

**Animation**: Scale (1 -> 1.16 -> 0.94 -> 1), rotate (0 -> 180deg), drift (x/y translate). Mirrors infinitely.

**Constraints**:
- Always `aria-hidden` and `pointer-events-none`
- Always includes `blur-3xl` (static blur, not animated)
- Maximum 1-2 per page. If a section already has a gradient background, do not add a blob
- Question whether a blob is needed at all — if it's just "atmosphere", the section may be better without it

---

## Usage Patterns

Which components pair with which sections:

### Hero
`VideoBackground` + `ParallaxLayer` (content wrapper) + `AnimatedText` (headline) + `ScrollReveal` (subheadline, CTAs)

### Features / Grid
`StaggerChildren` (container) + `ScrollReveal` with `fadeInUp` (each item)

### Showcase / Split Layout
`ScrollReveal` with `fadeInLeft` (media side) + `ScrollReveal` with `fadeInRight` (content side)

### Testimonials / Grid
`StaggerChildren` + `ScrollReveal` with `fadeInUp`

### CTA
`ScrollReveal` with `scaleIn` for a subtle "arrival" feel

### Numbered List / Feature Rows
`ScrollReveal` with alternating `fadeInLeft` / `fadeInRight` per row for visual dialogue

### General Rule
Vary presets across sections. Never use the same animation for every section on a page — it flattens the experience and makes the motion feel mechanical rather than choreographed.

---

## Design Constraints

- **Compositor-only**: Only animate `transform` (translate, scale, rotate) and `opacity`. No layout properties (width, height, padding, margin, flex). No paint properties (background-color, border-color, box-shadow).
- **No animated blur/filter**: `filter: blur()` forces GPU re-rasterization every frame. Apply blur statically via CSS class (e.g. `blur-3xl`) — never animate the blur value itself.
- **Entrance easing**: Ease-out `[0.2, 0.65, 0.2, 1]` or similar deceleration curve. Never `linear` for UI entrances — linear motion feels robotic.
- **Duration ranges**: Entrances 0.3-0.7s. Ambient/looping animations 12-25s. Never exceed 1s for user-triggered transitions.
- **Off-screen pause**: Looping animations must pause when off-screen via IntersectionObserver or framer-motion's `whileInView`. Prevents unnecessary GPU work for elements the user cannot see.
- **`prefers-reduced-motion`**: Handled project-wide via `<MotionConfig reducedMotion="user">`. No per-component implementation needed.

---

## Future Components (Planned)

These components are planned for Phase 2 and do not exist yet. Document them here so the skill knows what's coming and can reference them in design discussions.

### `ScrollPinnedReveal`
Full-viewport sticky section that pins in place while content animates through sequential phases on scroll. Outer container `h-[300vh]` (configurable), inner container `sticky top-0 h-[100dvh]`. Uses `useScroll` + `useTransform` to map scroll progress to phase transitions.

### `ScrollImageSequence`
Crossfades through an array of images driven by scroll progress. Minimum 3 images for smooth transitions. Tall scroll container with sticky inner viewport. Each image absolutely positioned, opacity computed from distance to active index.

### `HorizontalScrollGallery`
Vertical scroll drives horizontal panning of a wide gallery. Items 70-80vw wide at desktop, 90vw at mobile. Uses `useTransform` to map vertical `scrollYProgress` to horizontal `translateX`.

### `CounterAnimation`
Number that counts up from 0 to target value when scrolled into view. Uses `useInView` to trigger and `useMotionValue` + `animate()` to drive the count. Spring easing, 1.5s duration.

### `ScrollLinkedProgress`
Thin horizontal line that grows with scroll progress within its parent section. `useScroll` mapped to `scaleX` with `transformOrigin: 'left'`. For section dividers and visual rhythm.

### `ThreeDElement`
React Three Fiber component for rendering `.glb` models. Lazy-loaded with `React.lazy` + `Suspense`. Auto-rotates or responds to scroll. Falls back to static image on mobile or when WebGL is unavailable. Minimal scene: single object + ambient light + subtle contact shadow.

---

## Per-Mode Usage Table

Quick reference for which presets and components are available in each animation mode.

### Presets by Mode

| Preset | Static | Subtle | Cinematic | Background Ambient |
|---|---|---|---|---|
| `fadeInUp` | ✗ | ✓ | ✓ | ✗ |
| `fadeInDown` | ✗ | ✓ | ✓ | ✗ |
| `fadeInLeft` | ✗ | ✓ | ✓ | ✗ |
| `fadeInRight` | ✗ | ✓ | ✓ | ✗ |
| `slideInLeft` | ✗ | ✓ | ✓ | ✗ |
| `slideInRight` | ✗ | ✓ | ✓ | ✗ |
| `scaleIn` | ✗ | ✓ | ✓ | ✗ |
| `scaleReveal` | ✗ | ✓ | ✓ | ✗ |
| `staggerContainer` | ✗ | ✓ | ✓ | ✗ |
| `shimmer` | ✓ (loading only) | ✓ | ✓ | ✓ (loading only) |

### Components by Mode

| Component | Static | Subtle | Cinematic | Background Ambient |
|---|---|---|---|---|
| ScrollReveal | ✗ | ✓ | ✓ | ✗ |
| StaggerChildren | ✗ | ✓ | ✓ | ✗ |
| AnimatedText | ✗ | ✓ | ✓ | ✗ |
| ScrollPinnedReveal | ✗ | ✗ | ✓ | ✗ |
| ScrollImageSequence | ✗ | ✗ | ✓ | ✗ |
| HorizontalScrollGallery | ✗ | ✗ | ✓ | ✗ |
| ParallaxLayer | ✗ | ✗ | ✓ | ✓ (background only) |
| ScrollLinkedProgress | ✗ | ✗ | ✓ | ✗ |
| CounterAnimation | ✗ | ✓ | ✓ | ✗ |
| VideoBackground | ✗ | ✓ | ✓ | ✓ |
| ThreeDElement | ✗ | ✗ | ✓ | ✗ |
| GradientBlob | ✗ | ✗ | sparingly | ✓ |

---

## Static Mode Replacements

Concrete code patterns for replacing animated components in Static mode. The page must feel complete and intentional — not like a broken animated page with missing motion.

### ScrollReveal → Direct Render

```tsx
// Instead of:
<ScrollReveal variants={fadeInUp}>
  <Card>...</Card>
</ScrollReveal>

// Render directly:
<Card>...</Card>
```

### StaggerChildren → Direct Render

```tsx
// Instead of:
<StaggerChildren stagger={0.1}>
  {items.map(item => (
    <ScrollReveal key={item.id} variants={fadeInUp}>
      <Card>{item.title}</Card>
    </ScrollReveal>
  ))}
</StaggerChildren>

// Render directly:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id}>{item.title}</Card>
  ))}
</div>
```

### ScrollPinnedReveal → Static Full-Viewport Section

```tsx
// Instead of ScrollPinnedReveal with pinHeight and progress:
<section className="min-h-[100dvh] flex items-center justify-center px-6">
  <div className="max-w-4xl text-center">
    <h2 className="text-5xl md:text-7xl font-extralight tracking-tight" style={{ textWrap: 'balance' }}>
      {headline}
    </h2>
    <p className="mt-6 text-lg text-muted" style={{ textWrap: 'pretty' }}>
      {description}
    </p>
  </div>
</section>
```

### HorizontalScrollGallery → CSS Grid

```tsx
// Instead of horizontal scroll:
<section className="px-6 py-24">
  <div className="mx-auto max-w-6xl">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <div key={item.id} className="overflow-hidden rounded-lg">
          <Image src={item.image} alt={item.title} ... />
          <div className="p-4">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### ScrollImageSequence → Single Image or Grid

```tsx
// For 1 key image:
<section className="relative min-h-[80dvh]">
  <Image src={images[0]} alt={captions[0]} fill className="object-cover" />
  <div className="absolute inset-0 bg-black/40 flex items-end p-12">
    <p className="text-xl text-white">{captions[0]}</p>
  </div>
</section>

// For multiple images as a grid:
<section className="px-6 py-24">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {images.map((src, i) => (
      <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image src={src} alt={captions[i]} fill className="object-cover" />
      </div>
    ))}
  </div>
</section>
```

### CounterAnimation → Static Number

```tsx
// Instead of:
<CounterAnimation value={2500} prefix="$" suffix="+" />

// Render directly:
<span className="text-4xl font-bold tabular-nums">
  ${(2500).toLocaleString()}+
</span>
```

### AnimatedText → Plain Text

```tsx
// Instead of:
<h1><AnimatedText text="Design Without Compromise" mode="word" /></h1>

// Render directly:
<h1 className="text-6xl md:text-8xl font-extralight tracking-tight" style={{ textWrap: 'balance' }}>
  Design Without Compromise
</h1>
```

### VideoBackground → Static Image

```tsx
// Instead of VideoBackground with video:
<div className="relative min-h-[100dvh]">
  <Image src={fallbackImageSrc} alt="" fill className="object-cover" />
  <div className="absolute inset-0 bg-black/45" />
  <div className="relative z-10 flex min-h-[100dvh] items-center">
    {/* Content */}
  </div>
</div>
```

### ThreeDElement → Static Image

```tsx
// Instead of ThreeDElement:
<div className="relative aspect-square">
  <Image src={fallbackImage} alt={alt} fill className="object-contain" />
</div>
```

### ScrollLinkedProgress → Themed Divider

```tsx
// Instead of ScrollLinkedProgress:
<hr className="mx-auto max-w-xs border-t" style={{ borderColor: 'var(--accent-primary)' }} />
```

---

## Subtle Mode Composition Patterns

Code examples showing how to compose sections using only Subtle-mode-allowed components.

### Hero Section (Subtle)

```tsx
<section className="relative min-h-[100dvh] flex items-center">
  <VideoBackground
    videoSrc={assets.heroVideo}
    fallbackImageSrc={assets.heroImage}
    overlayOpacity={0.45}
  />
  <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
    <AnimatedText
      text="Design Without Compromise"
      mode="word"
      className="text-6xl md:text-8xl font-extralight tracking-tight"
    />
    <ScrollReveal variants={fadeInUp} delay={0.4}>
      <p className="mt-6 text-lg text-white/70" style={{ textWrap: 'pretty' }}>
        {subtitle}
      </p>
    </ScrollReveal>
    <ScrollReveal variants={fadeInUp} delay={0.6}>
      <button className="mt-8 px-8 py-3 rounded-lg bg-accent text-base font-semibold">
        Get Started
      </button>
    </ScrollReveal>
  </div>
</section>
```

### Grid Section (Subtle)

```tsx
<section className="px-6 py-24">
  <div className="mx-auto max-w-6xl">
    <ScrollReveal variants={fadeInUp}>
      <h2 className="text-3xl md:text-5xl font-light text-center" style={{ textWrap: 'balance' }}>
        {sectionTitle}
      </h2>
    </ScrollReveal>
    <StaggerChildren stagger={0.1} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, i) => (
        <ScrollReveal key={feature.id} variants={fadeInUp}>
          <div className="rounded-lg border p-6" style={{ background: 'var(--surface)' }}>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted" style={{ textWrap: 'pretty' }}>
              {feature.description}
            </p>
          </div>
        </ScrollReveal>
      ))}
    </StaggerChildren>
  </div>
</section>
```

### Stats Row (Subtle)

```tsx
<section className="px-6 py-20">
  <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-12">
    {stats.map((stat, i) => (
      <ScrollReveal key={stat.label} variants={scaleIn} delay={i * 0.1}>
        <div className="text-center">
          <CounterAnimation
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
          />
          <p className="mt-2 text-sm text-muted">{stat.label}</p>
        </div>
      </ScrollReveal>
    ))}
  </div>
</section>
```

### Showcase / Split Section (Subtle)

```tsx
<section className="px-6 py-24">
  <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
    <ScrollReveal variants={fadeInLeft}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image src={showcaseImage} alt="" fill className="object-cover" />
      </div>
    </ScrollReveal>
    <ScrollReveal variants={fadeInRight}>
      <div>
        <h2 className="text-3xl font-light" style={{ textWrap: 'balance' }}>{title}</h2>
        <p className="mt-4 text-muted" style={{ textWrap: 'pretty' }}>{description}</p>
      </div>
    </ScrollReveal>
  </div>
</section>
```
