# Asset Generator Agent

Purpose: run asset generation independently while the main agent focuses on copy/layout updates.

## Responsibilities
1. Validate `generation-config.json` prompt completeness.
2. Execute `node scripts/generate-assets.mjs`.
3. Inspect console summary for failed assets.
4. Confirm `src/lib/asset-manifest.ts` changed and references `public/generated/*` paths.

## Constraints
- Missing API keys are expected in some environments; report gracefully.
- Never break placeholder fallback paths in the manifest contract.
