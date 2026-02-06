const RECRAFT_BASE_URL = 'https://external.api.recraft.ai/v1';
const VECTOR_STYLE = 'vector_illustration';
const IMAGE_STYLE = 'digital_illustration';

function getRecraftToken() {
  const token = process.env.RECRAFT_API_TOKEN;

  if (!token) {
    throw new Error('RECRAFT_API_TOKEN is missing.');
  }

  return token;
}

function recraftHeaders() {
  return {
    Authorization: `Bearer ${getRecraftToken()}`,
    'Content-Type': 'application/json'
  };
}

async function parseJson(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Recraft returned invalid JSON (${response.status}): ${text.slice(0, 280)}`);
  }
}

function normalizeResult(payload) {
  const first = payload.data?.[0] ?? payload.output?.[0] ?? payload.result?.[0] ?? payload;

  if (!first || typeof first !== 'object') {
    throw new Error(`Unexpected Recraft payload shape: ${JSON.stringify(payload).slice(0, 360)}`);
  }

  return {
    url: first.url ?? first.image_url ?? first.output_url ?? null,
    base64: first.b64_json ?? first.base64 ?? first.data ?? null,
    svg: first.svg ?? first.svg_text ?? null,
    mimeType: first.mime_type ?? first.mimeType ?? null,
    raw: first
  };
}

async function generateWithRecraft({ prompt, style, responseFormat = 'url', size = '1792x1024' }) {
  const payload = {
    prompt,
    style,
    response_format: responseFormat,
    size
  };

  const response = await fetch(`${RECRAFT_BASE_URL}/images/generations`, {
    method: 'POST',
    headers: recraftHeaders(),
    body: JSON.stringify(payload)
  });

  const body = await parseJson(response);

  if (!response.ok) {
    const message = body.error?.message ?? body.message ?? 'Unknown Recraft error';
    throw new Error(`Recraft request failed (${response.status}): ${message}`);
  }

  return normalizeResult(body);
}

export async function generateRecraftSvg(prompt) {
  return generateWithRecraft({
    prompt,
    style: VECTOR_STYLE,
    responseFormat: 'url',
    size: '1024x1024'
  });
}

export async function generateRecraftImage(prompt, size = '1792x1024') {
  return generateWithRecraft({
    prompt,
    style: IMAGE_STYLE,
    responseFormat: 'url',
    size
  });
}
