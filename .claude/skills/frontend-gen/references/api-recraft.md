# Recraft API Reference (Skill Local)

Base URL: `https://external.api.recraft.ai/v1`

Required headers:
- `Authorization: Bearer $RECRAFT_API_TOKEN`
- `Content-Type: application/json`

## Endpoint used by this project
- `POST /images/generations`

## Payload fields
- `prompt`
- `style`
  - `vector_illustration` for logos/icons
  - `digital_illustration` for hero images
- `response_format` (`url` in this implementation)
- `size` (e.g. `1024x1024`, `1536x1024`)

## Output handling
- Primary: use URL and download into `public/generated/`.
- Fallbacks: if `svg` or base64 payload is returned, persist directly.

## Validated Sizes
- `1024x1024` — square, icons/logos
- `1536x1024` — landscape, hero images (RECOMMENDED)
- `1024x1536` — portrait
- `1792x1024` — may fail, avoid

## SVG Post-Processing (Required)
Recraft SVGs come with issues that must be fixed after download:
1. **White background**: First `<path>` element is typically a white/near-white background rectangle. Remove it.
2. **Dark fills**: Fills use dark colors (rgb(37,37,37), rgb(48,48,48), etc.) designed for light backgrounds. Replace with theme-appropriate light colors for dark themes.
3. **preserveAspectRatio**: Often set to `"none"`. Change to `"xMidYMid meet"` for proper scaling.

## Prompt Engineering Tips

### Hero Images
Always specify:
- Photography style (architectural, editorial, product, lifestyle)
- Lighting (natural overcast, warm golden hour, cool studio, dramatic directional)
- Composition (ultra wide, centered subject, rule of thirds)
- Color temperature (warm, cool, neutral)
- Format context ("ultra wide format", "square crop")
- Example: "Nordic minimalist apartment interior with pale birch built-in shelving, polished concrete floor, single designer chair by large window, overcast cool natural light, architectural photography, ultra wide format"

### Feature Icons (SVG)
Always specify:
- Stroke weight ("thin strokes", "medium weight lines")
- Color constraint ("cool white on transparent", "single color on transparent")
- Style consistency ("minimal line icon", "geometric icon")
- Subject matter specific to the brief (not generic)
- Example: "Minimal line icon of a geometric cube being reduced to essential form, thin strokes, cool white on transparent, SVG"

### Logos
- Text/wordmark generation is UNRELIABLE with Recraft — it produces random illustrations instead of clean text
- PREFER code-generated SVG text wordmarks (inline `<svg><text>` in NavBar component)
- Only use Recraft for abstract symbol/icon marks
- If using Recraft for logo: request "abstract geometric mark" not "wordmark for BrandName"

## Environment
Scripts don't auto-load `.env.local`. Run with:
```bash
env $(grep -v '^#' .env.local | xargs) node scripts/generate-assets.mjs
```
