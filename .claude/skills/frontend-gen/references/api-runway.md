# Runway API Reference (Skill Local)

Base URL: `https://api.dev.runwayml.com/v1`

Required headers:
- `Authorization: Bearer $RUNWAY_API_KEY`
- `X-Runway-Version: 2024-11-06`
- `Content-Type: application/json`

## Endpoints used by this project
- `POST /text_to_video`
- `POST /image_to_video`
- `GET /tasks/{taskId}`

## Create task payload fields
- `model` (default: `veo3`). Available models: `gen3a_turbo`, `gen4.5`, `veo3`, `veo3.1`, `veo3.1_fast`
- `ratio` (default: `1280:720`). Available: `1280:720`, `720:1280`, `1104:832`, `960:960`, `832:1104`
- `duration` (required). For `veo3`: must be `8`. For `veo3.1`/`veo3.1_fast`: `4` or `8`.
- `promptText`
- `promptImage` (image-to-video only)

## Polling behavior
- Poll every 10 seconds.
- Timeout after 300 seconds (veo3 generation can take 2-4 minutes).
- Tasks may go through `THROTTLED` → `RUNNING` → `SUCCEEDED` states.
- Treat `FAILED` and `CANCELLED` as non-fatal generation failure.
- On success, use task output URL to download media into `public/generated/`.

## Model Availability Notes
- `gen4_turbo` — DEPRECATED, do not use
- `gen3a_turbo` — may have access restrictions on some plans (403 errors)
- `gen4.5` — may have access restrictions on some plans (403 errors)
- `veo3` — RECOMMENDED default. Duration must be `8`.
- `veo3.1` / `veo3.1_fast` — newer models, duration `4` or `8`

## Prompt Engineering Tips

### Camera Movement
Always specify one of:
- "slow tracking shot" — camera moves alongside or through scene
- "slow pan" — camera rotates in place
- "dolly in/out" — camera moves toward/away from subject
- "static wide shot" — no camera movement, atmospheric

### Pacing
"slow" for atmospheric/luxury, "medium" for product demos. Never "fast" for landing pages.

### Atmosphere
Specify mood explicitly — "serene", "dramatic", "energetic", "contemplative"

### Multi-Video Coherence
When generating multiple videos for one page (hero + showcase), ensure prompts share:
- Same location/space type
- Same lighting conditions
- Same color temperature
- Different camera angles/movements

Example: "Slow tracking shot through a stark white Nordic apartment, cool diffused light from floor-to-ceiling windows, camera gliding past birch furniture with precise geometry, serene atmosphere"

## Environment
Scripts don't auto-load `.env.local`. Run with:
```bash
env $(grep -v '^#' .env.local | xargs) node scripts/generate-assets.mjs
```
