/**
 * Kling client (https://api-singapore.klingai.com).
 *
 * Auth: API-Key scheme — `Authorization: Bearer ${KLING_API_KEY}` (works for all
 * the models we use: virtual try-on, images/generations, Avatar). AK/SK→JWT is a
 * later concern (3.0-only) and is intentionally not implemented here.
 *
 * This module is provider-specific HTTP only. The mock/persistence/orchestration
 * lives in ../provider.js. These methods only run when KLING_API_KEY is set.
 *
 * Docs: docs/providers/kling/CAPABILITIES-AND-WORKFLOWS.md
 *       docs/providers/kling/captures/kolors-virtual-try-on.md
 */

import fetch from 'node-fetch';

export const BASE = process.env.KLING_API_BASE || 'https://api-singapore.klingai.com';
const KEY = process.env.KLING_API_KEY || '';

/** True once a Kling API key is present. */
export function isConfigured() {
  return Boolean(KEY);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${KEY}`, // space after "Bearer" is required
    'Content-Type': 'application/json',
  };
}

// Query paths per task kind (used for polling — each endpoint has its own GET).
const QUERY_PATHS = {
  tryon: '/v1/images/kolors-virtual-try-on',
  compose: '/v1/images/generations',
  animate: '/v1/videos/avatar/image2video',
};

/** Try-on/Avatar need RAW base64 (no `data:image/...;base64,` prefix). */
function stripDataUri(value) {
  if (typeof value === 'string' && value.startsWith('data:')) {
    const comma = value.indexOf(',');
    return comma >= 0 ? value.slice(comma + 1) : value;
  }
  return value;
}

async function asJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Kling HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
}

// ── Generic task helpers ────────────────────────────────────────────────────

/**
 * Create a task on any Kling endpoint.
 * @returns {Promise<{ requestId: string }>}  requestId === Kling task_id (poll handle)
 */
export async function createTask(taskPath, body) {
  const res = await fetch(`${BASE}${taskPath}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const data = await asJson(res);
  if (!res.ok || (data.code !== undefined && data.code !== 0)) {
    const code = data.code;
    const err = new Error(data.message || `Kling create failed (HTTP ${res.status})`);
    err.code = code; // 1303 = concurrency-limit → caller may back off
    throw err;
  }
  const taskId = data?.data?.task_id || data?.data?.id;
  if (!taskId) throw new Error('Kling create returned no task_id');
  return { requestId: taskId };
}

/**
 * Poll a Kling task by kind + task id. Handles both the legacy
 * (`task_status` / `task_result.{images,videos}[]`) and new (`status`/`outputs[]`)
 * callback schemas.
 * @returns {Promise<{ status: 'processing'|'done'|'error', resultUrl?, error? }>}
 */
export async function pollTask(kind, taskId) {
  const taskPath = QUERY_PATHS[kind];
  if (!taskPath) throw new Error(`Unknown Kling task kind: ${kind}`);

  const res = await fetch(`${BASE}${taskPath}/${taskId}`, { headers: authHeaders() });
  const data = await asJson(res);
  if (!res.ok || (data.code !== undefined && data.code !== 0)) {
    return { status: 'error', error: data.message || `Kling poll failed (HTTP ${res.status})` };
  }

  const d = data.data || {};
  const status = d.task_status || d.status || 'processing';
  const result = d.task_result || {};
  const url =
    result.images?.[0]?.url ||
    result.videos?.[0]?.url ||
    d.outputs?.[0]?.url ||
    null;

  if (['succeed', 'succeeded'].includes(status)) {
    if (!url) return { status: 'error', error: 'Kling task succeeded but no result URL' };
    return { status: 'done', resultUrl: url };
  }
  if (status === 'failed') {
    return { status: 'error', error: d.task_status_msg || 'Kling task failed' };
  }
  return { status: 'processing' };
}

/**
 * Upload a file (base64) and return its reusable file_id.
 * STUB — request shape per docs (`07-file-upload.md`); only runs with a key set.
 */
export async function uploadFile(base64, { kind = 'image' } = {}) {
  const res = await fetch(`${BASE}/file-upload-api/upload-file-base-64`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ data: stripDataUri(base64), type: kind }),
  });
  const data = await asJson(res);
  if (!res.ok || (data.code !== undefined && data.code !== 0)) {
    throw new Error(data.message || `Kling upload failed (HTTP ${res.status})`);
  }
  return data?.data?.file_id;
}

// ── Endpoint method stubs (HTTP shapes per docs) ────────────────────────────

/**
 * Virtual Try-On (Phase 2). Upper/lower/dress only (no shoes/hats).
 * `human_image`/`cloth_image` accept a URL or RAW base64 (prefix stripped).
 */
export async function tryOn(humanImage, clothImage, { modelName = 'kolors-virtual-try-on-v1-5', externalTaskId } = {}) {
  return createTask('/v1/images/kolors-virtual-try-on', {
    model_name: modelName,
    human_image: stripDataUri(humanImage),
    cloth_image: stripDataUri(clothImage),
    external_task_id: externalTaskId || '',
  });
}

/**
 * Image compose (Phase 4) via the unified images endpoint.
 * Path A: `image_reference: 'subject'` + scene-in-prompt + `human_fidelity`.
 */
export async function composeImage({
  prompt,
  image,
  modelName = 'kling-v1-5',
  imageReference = 'subject',
  humanFidelity = 0.8,
  aspectRatio = '9:16',
  resolution = '1k',
  negativePrompt,
  n = 1,
} = {}) {
  const body = {
    model_name: modelName,
    prompt,
    aspect_ratio: aspectRatio,
    resolution,
    n,
  };
  if (image) {
    body.image = stripDataUri(image);
    body.image_reference = imageReference;
    body.human_fidelity = humanFidelity;
  }
  if (negativePrompt) body.negative_prompt = negativePrompt;
  return createTask('/v1/images/generations', body);
}

/**
 * Avatar performance video (Phase 6): still + audio + performance prompt.
 * `sound_file` = mp3/wav/m4a/aac (≤5MB, 2–300s) OR a TTS `audio_id`.
 * `prompt` drives expression + body/head movement + camera (vocals are in audio).
 */
export async function avatar(image, audio, prompt, { modelName, mode = 'std', audioId } = {}) {
  const body = {
    image: stripDataUri(image),
    prompt,
    mode, // std=720p, pro=1080p
  };
  if (modelName) body.model_name = modelName;
  if (audioId) body.audio_id = audioId;
  else if (audio) body.sound_file = stripDataUri(audio);
  return createTask('/v1/videos/avatar/image2video', body);
}
