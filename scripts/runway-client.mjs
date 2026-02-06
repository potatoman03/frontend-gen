const RUNWAY_BASE_URL = 'https://api.dev.runwayml.com/v1';
const RUNWAY_VERSION = '2024-11-06';
const DEFAULT_MODEL = 'veo3';
const DEFAULT_POLL_INTERVAL_MS = 5_000;
const DEFAULT_TIMEOUT_MS = 300_000;

function getRunwayApiKey() {
  const key = process.env.RUNWAY_API_KEY;

  if (!key) {
    throw new Error('RUNWAY_API_KEY is missing.');
  }

  return key;
}

function runwayHeaders() {
  return {
    Authorization: `Bearer ${getRunwayApiKey()}`,
    'X-Runway-Version': RUNWAY_VERSION,
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
    throw new Error(`Runway returned invalid JSON (${response.status}): ${text.slice(0, 280)}`);
  }
}

function getTaskId(payload) {
  return payload.id ?? payload.taskId ?? payload.task_id ?? null;
}

function extractOutputUrl(payload) {
  const direct = payload.output;
  if (typeof direct === 'string') {
    return direct;
  }

  if (Array.isArray(direct) && direct.length > 0) {
    const first = direct[0];
    if (typeof first === 'string') {
      return first;
    }
    if (first && typeof first.url === 'string') {
      return first.url;
    }
    if (first && typeof first.outputUrl === 'string') {
      return first.outputUrl;
    }
  }

  if (payload.output && typeof payload.output.url === 'string') {
    return payload.output.url;
  }

  return null;
}

async function createRunwayTask({ promptText, promptImage = null, model = DEFAULT_MODEL, ratio = '1280:720', duration = 8 }) {
  const endpoint = promptImage ? '/image_to_video' : '/text_to_video';
  const body = {
    model,
    ratio,
    duration,
    promptText
  };

  if (promptImage) {
    body.promptImage = promptImage;
  }

  const response = await fetch(`${RUNWAY_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: runwayHeaders(),
    body: JSON.stringify(body)
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    const message = payload.error?.message ?? payload.message ?? 'Unknown Runway error';
    throw new Error(`Runway create task failed (${response.status}): ${message}`);
  }

  const taskId = getTaskId(payload);

  if (!taskId) {
    throw new Error(`Runway create task response did not include a task id: ${JSON.stringify(payload)}`);
  }

  return {
    taskId,
    status: payload.status ?? 'PENDING',
    raw: payload
  };
}

export async function pollRunwayTask(taskId, options = {}) {
  const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const response = await fetch(`${RUNWAY_BASE_URL}/tasks/${taskId}`, {
      headers: runwayHeaders()
    });

    const payload = await parseJson(response);

    if (!response.ok) {
      const message = payload.error?.message ?? payload.message ?? 'Unknown Runway error';
      throw new Error(`Runway poll failed (${response.status}): ${message}`);
    }

    const status = String(payload.status ?? 'UNKNOWN').toUpperCase();
    const outputUrl = extractOutputUrl(payload);

    if (status === 'SUCCEEDED' && outputUrl) {
      return {
        taskId,
        status,
        outputUrl,
        raw: payload
      };
    }

    if (status === 'FAILED' || status === 'CANCELLED') {
      throw new Error(`Runway task ${taskId} ended with status ${status}.`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Runway task ${taskId} timed out after ${Math.round(timeoutMs / 1000)}s.`);
}

export async function generateRunwayVideo(options) {
  const task = await createRunwayTask(options);
  return pollRunwayTask(task.taskId, options);
}

export async function generateTextToVideo(promptText, options = {}) {
  return generateRunwayVideo({ promptText, ...options });
}

export async function generateImageToVideo(promptText, promptImage, options = {}) {
  return generateRunwayVideo({ promptText, promptImage, ...options });
}
