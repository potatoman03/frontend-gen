# frontend-studio

A [skills.sh](https://skills.sh) skill that builds tasteful, production-grade frontends with distinctive design — never AI slop.

## Install

```bash
npx skills add potatoman03/frontend-workflow
```

## What it does

Give it a brief ("build a landing page for a notes app") and it:

1. Generates **3 distinct design directions** — each with a full palette, typography system, layout architecture, and hero technique
2. Serves an **interactive workbench** on localhost where you can mix tokens across directions, reorder sections, add per-section comments, and preview your design in real time
3. Scaffolds a **React + Tailwind + shadcn/ui** project and builds the frontend using your confirmed spec
4. Self-reviews against **accessibility, layout, and quality rules** before presenting output

Every generation produces a unique, handcrafted result. The same brief yields completely different designs each time.

## How it works

1. You describe what you want built
2. The agent generates 3 mood boards and opens the workbench at `localhost:3333`
3. You customize — pick a base direction, swap individual tokens (palette from Board A, typography from Board B), drag sections around, leave comments
4. Click **Confirm** and tell the agent "confirmed"
5. The agent reads your spec and builds a full React project

## What's inside

| File | Purpose |
|------|---------|
| `SKILL.md` | The skill — decision framework, technique library, quality rules |
| `assets/mood-board-viewer.html` | Interactive workbench for customizing design directions |
| `assets/serve-workbench.mjs` | Node server for the workbench + saving confirmed specs |

## Stack

The default output is **React + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui** with your choice of animation library (Framer Motion, GSAP, Three.js, Lottie, Rive, CSS, or Spine — selected in the workbench).

## Design decisions, not templates

The skill is not a component library. It's a **decision framework** that makes 5 deliberate choices per build:

1. **Aesthetic direction** — editorial, brutalist, warm minimal, technical, organic, or custom
2. **Palette** — considered backgrounds, unexpected signal colors, neutral hierarchy
3. **Typography** — 3 distinctive fonts (display, body, mono) — never Inter or Roboto
4. **Layout** — breathing, grid-structured, asymmetric editorial, or full-bleed rhythm
5. **Hero technique** — kinetic typography, 3D/WebGL, compositional, or data-driven

Different decisions on the same brief produce completely different sites.
