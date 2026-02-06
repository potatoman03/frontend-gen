# Frontend Generation Workflow

## Goal
Generate premium-looking animated landing pages with progressive enhancement. Every design must feel inevitable — quiet, confident, effortless.

## Commands
- `npm run dev` - Start Next.js on `http://localhost:3000`
- `env $(grep -v '^#' .env.local | xargs) npm run generate-assets` - Generate external assets from `generation-config.json`
- `npm run poll-task -- <task-id>` - Poll a Runway task manually
- `env $(grep -v '^#' .env.local | xargs) npm run generate-mood-boards` - Generate mood board images from `mood-board-options.json`

## Pipeline
1. Create/update `mood-board-options.json` with 3-5 visual directions from a brief.
2. Run `npm run generate-mood-boards` to generate mood board images via Recraft.
3. User selects a direction.
4. Create/update `generation-config.json` from the selected direction.
5. Start the dev server so placeholders render immediately.
6. Run `npm run generate-assets` to fetch Recraft + Runway assets in parallel.
7. Let Next.js hot reload update sections when `src/lib/asset-manifest.ts` changes.
8. SVG post-processing: after Recraft SVG download, auto-fix:
   - Remove white background rectangle (first `<path>`)
   - Replace dark fills with theme-appropriate light colors
   - Fix `preserveAspectRatio="none"` to `"xMidYMid meet"`
9. Perform design audit: hierarchy, spacing, typography, color, alignment, responsiveness.

## Progressive Enhancement
- The page always renders with local placeholder assets.
- Generated assets replace placeholders when available.

## Design Philosophy
- Simplicity is the architecture. If an element can be removed without losing meaning, remove it.
- Every screen has one primary action. Make it unmissable.
- Whitespace is structure, not emptiness. Breathing room feels premium.
- Visual weight must match functional importance.
- Every element sits on a grid. The eye detects misalignment before the brain can name it.
- Design for the feeling: calm, confident, quiet.

## Design Constraints
All landing page code must follow the design rules in `.claude/skills/frontend-gen/SKILL.md` and `.claude/skills/frontend-gen/references/design-rules.md`. This is a summary. Full design rules and constraints are in `.claude/skills/frontend-gen/references/design-rules.md`. Key points:
- Animate only compositor props (transform, opacity). Never animate blur or filter.
- Static blur ≤ 16px only. No glow blobs as primary affordances.
- `text-balance` on headings, `text-pretty` on body text.
- Use `dvh` not `vh` for full-height sections.
- Gradients for atmosphere only, never as primary affordances. Max 1-2 per section.
- Font must be distinctive — never Inter/Roboto/Arial/system-ui. 2-3 weights max.
- Every change must have a design reason, not just a preference.
- Mobile-first. Every screen must feel intentional at every viewport.

## Design Audit Protocol
After generating a page, a design audit is required before presenting to the user. Full protocol in `.claude/skills/frontend-gen/SKILL.md` (Phase 4). Summary:
1. Full audit against all visual dimensions (hierarchy, spacing, typography, color, alignment, motion, states, density, responsiveness, accessibility)
2. Apply the Jobs Filter (5 questions for every element)
3. Compile phased plan (Critical → Refinement → Polish)
4. Wait for user approval before implementing each phase

## Scope Discipline
The frontend-gen skill touches: visual design, layout, spacing, typography, color, motion, accessibility.
It does NOT touch: application logic, state management, API calls, data models, backend.
Every design change must preserve existing functionality. If a design improvement requires a functionality change, flag it separately.
