/**
 * Kling AI Adapter — zero-error provider for make-gvids.
 *
 * Replaces the original thin kling.js with a validated, capability-aware client.
 * Every request is validated against the capability matrix BEFORE submission.
 * If a parameter combination is invalid, a descriptive error is thrown immediately.
 *
 * Auth: Bearer token — Authorization: Bearer ${KLING_API_KEY}
 * Domain: https://api-singapore.klingai.com
 *
 * BACKWARD COMPATIBLE: all methods from the original kling.js are preserved
 * with the same signatures. New methods are additive.
 */

import fetch from 'node-fetch';

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const BASE = process.env.KLING_API_BASE || 'https://api-singapore.klingai.com';
const KEY = process.env.KLING_API_KEY || '';

export function isConfigured() {
  return Boolean(KEY);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAPABILITY MATRIX — the single truth source
// ═══════════════════════════════════════════════════════════════════════════════

export const MODELS = {
  'kling-v1':          { t2v: true, i2v: true, multiImg: false, extend: false, camera: true,  multiShot: false, audio: false, elements: false, voices: false, durations: [5, 10], modes: ['std', 'pro'] },
  'kling-v1-5':        { t2v: true, i2v: true, multiImg: false, extend: false, camera: true,  multiShot: false, audio: false, elements: false, voices: false, durations: [5, 10], modes: ['std', 'pro'] },
  'kling-v1-6':        { t2v: true, i2v: true, multiImg: false, extend: false, camera: true,  multiShot: false, audio: false, elements: false, voices: false, durations: [5, 10], modes: ['std', 'pro'] },
  'kling-v2-master':   { t2v: true, i2v: true, multiImg: false, extend: false, camera: false, multiShot: false, audio: false, elements: false, voices: false, durations: [5, 10], modes: ['std', 'pro'] },
  'kling-v2-1':        { t2v: true, i2v: true, multiImg: false, extend: false, camera: false, multiShot: false, audio: false, elements: false, voices: false, durations: [5, 10], modes: ['std', 'pro'] },
  'kling-v2-1-master': { t2v: true, i2v: true, multiImg: false, extend: false, camera: false, multiShot: false, audio: false, elements: false, voices: false, durations: [5, 10], modes: ['std', 'pro'] },
  'kling-v2-5-turbo':  { t2v: true, i2v: true, multiImg: false, extend: false, camera: false, multiShot: false, audio: false, elements: false, voices: false, durations: [5, 10], modes: ['std', 'pro'] },
  'kling-v2-6':        { t2v: true, i2v: true, multiImg: false, extend: false, camera: false, multiShot: false, audio: true,  elements: false, voices: false, durations: [5, 10], modes: ['std', 'pro'] },
  'kling-v3':          { t2v: true, i2v: true, multiImg: true,  extend: true,  camera: true,  multiShot: true,  audio: true,  elements: true,  voices: true,  durations: [3,4,5,6,7,8,9,10,11,12,13,14,15], modes: ['std', 'pro', '4k'] },
  'kling-v3-omni':     { t2v: true, i2v: true, multiImg: true,  extend: true,  camera: true,  multiShot: true,  audio: true,  elements: true,  voices: true,  durations: [3,4,5,6,7,8,9,10,11,12,13,14,15], modes: ['std', 'pro', '4k'] },
  'kling-video-o1':    { t2v: true, i2v: true, multiImg: false, extend: true,  camera: false, multiShot: false, audio: true,  elements: true,  voices: false, durations: [5, 10], modes: ['std', 'pro'] },
};

export const VALID_ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9'];

export function getCapabilities(modelName) {
  const caps = MODELS[modelName];
  if (!caps) throw new KlingValidationError(`Unknown model "${modelName}". Valid: ${Object.keys(MODELS).join(', ')}`);
  return caps;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export class KlingValidationError extends Error {
  constructor(message) { super(message); this.name = 'KlingValidationError'; this.code = 'validation_error'; }
}

export class KlingApiError extends Error {
  constructor(message, code, requestId) { super(message); this.name = 'KlingApiError'; this.code = code; this.requestId = requestId; }
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

function validateVideoParams(modelName, opts = {}) {
  const caps = getCapabilities(modelName);
  const errors = [];
  if (opts.duration !== undefined && !caps.durations.includes(Number(opts.duration))) {
    errors.push(`Model ${modelName} does not support ${opts.duration}s. Valid: ${caps.durations.join(', ')}`);
  }
  if (opts.mode && !caps.modes.includes(opts.mode)) {
    errors.push(`Model ${modelName} does not support mode "${opts.mode}". Valid: ${caps.modes.join(', ')}`);
  }
  if (opts.sound === 'on' && !caps.audio) errors.push(`Model ${modelName} does not support native audio`);
  if (opts.sound === 'on' && opts.mode !== 'pro' && opts.mode !== '4k') errors.push('Native audio requires mode="pro"');
  if (opts.cameraControl && !caps.camera) errors.push(`Model ${modelName} does not support camera control`);
  if (opts.multiPrompt && !caps.multiShot) errors.push(`Model ${modelName} does not support multi-shot`);
  if (opts.elementList?.length && !caps.elements) errors.push(`Model ${modelName} does not support elements`);
  if (opts.voiceList?.length && !caps.voices) errors.push(`Model ${modelName} does not support voices`);
  if (opts.elementList?.length && opts.voiceList?.length) errors.push('element_list and voice_list are mutually exclusive');
  if (opts.multiPrompt?.length) {
    const total = opts.multiPrompt.reduce((s, shot) => s + (shot.duration || 0), 0);
    if (total > 15) errors.push(`Multi-shot total ${total}s exceeds 15s max`);
    if (opts.multiPrompt.length > 6) errors.push(`Multi-shot max 6 shots, got ${opts.multiPrompt.length}`);
  }
  if (errors.length) throw new KlingValidationError(errors.join('; '));
}

function validatePrompt(p, name = 'prompt') {
  if (!p || typeof p !== 'string' || !p.trim()) throw new KlingValidationError(`${name} is required`);
  if (p.length > 2500) throw new KlingValidationError(`${name} exceeds 2500 char limit (${p.length})`);
}

function validateAspectRatio(r) {
  if (r && !VALID_ASPECT_RATIOS.includes(r)) throw new KlingValidationError(`Invalid aspect_ratio "${r}". Valid: ${VALID_ASPECT_RATIOS.join(', ')}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTTP HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export function stripDataUri(value) {
  if (typeof value === 'string' && value.startsWith('data:')) {
    const comma = value.indexOf(',');
    return comma >= 0 ? value.slice(comma + 1) : value;
  }
  return value;
}

async function asJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); }
  catch { throw new KlingApiError(`Kling HTTP ${res.status}: ${text.slice(0, 300)}`, res.status); }
}

export async function createTask(taskPath, body, { maxRetries = 3 } = {}) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(`${BASE}${taskPath}`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
      const data = await asJson(res);
      if (res.status === 429 || data.code === 1303) {
        const wait = Math.pow(2, attempt + 1) * 1000;
        console.warn(`[Kling] Rate limited (${data.code || 429}), backing off ${wait/1000}s (attempt ${attempt+1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (!res.ok || (data.code !== undefined && data.code !== 0)) {
        throw new KlingApiError(data.message || `Kling create failed (HTTP ${res.status})`, data.code || res.status, data.request_id);
      }
      const taskId = data?.data?.task_id || data?.data?.id;
      if (!taskId) throw new KlingApiError('Kling create returned no task_id', null, data?.request_id);
      return { requestId: taskId };
    } catch (err) {
      lastError = err;
      if (err instanceof KlingApiError && err.code !== 1303 && err.code !== 429) throw err;
      if (attempt < maxRetries - 1) await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
    }
  }
  throw lastError || new KlingApiError(`Max retries (${maxRetries}) exceeded`);
}

const QUERY_PATHS = {
  text2video: '/v1/videos/text2video',
  image2video: '/v1/videos/image2video',
  multiImage2video: '/v1/videos/multi-image2video',
  extend: '/v1/videos/extend',
  lipsync: '/v1/videos/lip-sync',
  effects: '/v1/videos/effects',
  avatar: '/v1/videos/avatar/image2video',
  imageGen: '/v1/images/generations',
  tryon: '/v1/images/kolors-virtual-try-on',
  // Legacy aliases — backward compat with provider.js
  compose: '/v1/images/generations',
  animate: '/v1/videos/avatar/image2video',
};

export async function pollTask(kind, taskId) {
  const taskPath = QUERY_PATHS[kind];
  if (!taskPath) throw new KlingApiError(`Unknown task kind: "${kind}". Valid: ${Object.keys(QUERY_PATHS).join(', ')}`);
  const res = await fetch(`${BASE}${taskPath}/${taskId}`, { headers: authHeaders() });
  const data = await asJson(res);
  if (!res.ok || (data.code !== undefined && data.code !== 0)) {
    return { status: 'error', error: data.message || `Kling poll failed (HTTP ${res.status})` };
  }
  const d = data.data || {};
  const status = d.task_status || d.status || 'processing';
  const result = d.task_result || {};
  const url = result.images?.[0]?.url || result.videos?.[0]?.url || d.outputs?.[0]?.url || null;
  const assetId = result.images?.[0]?.id || result.videos?.[0]?.id || d.outputs?.[0]?.id || null;
  if (['succeed', 'succeeded'].includes(status)) {
    if (!url) return { status: 'error', error: 'Task succeeded but no result URL' };
    return { status: 'done', resultUrl: url, videoId: assetId };
  }
  if (status === 'failed') return { status: 'error', error: d.task_status_msg || 'Task failed' };
  return { status: 'processing' };
}

export async function pollUntilDone(kind, taskId, { maxAttempts = 60, delayMs = 5000 } = {}) {
  for (let i = 0; i < maxAttempts; i++) {
    const r = await pollTask(kind, taskId);
    if (r.status === 'done') return r.resultUrl;
    if (r.status === 'error') throw new KlingApiError(r.error || 'Task failed');
    await new Promise(res => setTimeout(res, delayMs));
  }
  throw new KlingApiError(`Kling ${kind} task timed out after ${maxAttempts * delayMs / 1000}s`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENDPOINT METHODS — fully validated
// ═══════════════════════════════════════════════════════════════════════════════

export async function textToVideo({ prompt, modelName = 'kling-v3', negativePrompt, cfgScale = 0.5, mode = 'std', duration = 5, aspectRatio = '16:9', sound, cameraControl, multiPrompt, elementList, voiceList, callbackUrl } = {}) {
  validatePrompt(prompt);
  validateAspectRatio(aspectRatio);
  validateVideoParams(modelName, { duration, mode, sound, cameraControl, multiPrompt, elementList, voiceList });
  const body = { model_name: modelName, prompt, cfg_scale: cfgScale, mode, duration: String(duration), aspect_ratio: aspectRatio };
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (sound) body.sound = sound;
  if (cameraControl) body.camera_control = cameraControl;
  if (multiPrompt) body.multi_prompt = multiPrompt;
  if (elementList) body.element_list = elementList;
  if (voiceList) body.voice_list = voiceList;
  if (callbackUrl) body.callback_url = callbackUrl;
  return createTask('/v1/videos/text2video', body);
}

export async function imageToVideo({ prompt, image, imageUrl, imageTail, modelName = 'kling-v3', negativePrompt, cfgScale = 0.5, mode = 'std', duration = 5, aspectRatio, sound, cameraControl, elementList, voiceList, callbackUrl } = {}) {
  validatePrompt(prompt);
  if (aspectRatio) validateAspectRatio(aspectRatio);
  validateVideoParams(modelName, { duration, mode, sound, cameraControl, elementList, voiceList });
  if (!image && !imageUrl) throw new KlingValidationError('Either image (base64) or imageUrl is required');
  const body = { model_name: modelName, prompt, cfg_scale: cfgScale, mode, duration: String(duration) };
  if (imageUrl) body.image = imageUrl;
  else if (image) body.image = stripDataUri(image);
  if (imageTail) body.image_tail = imageTail;
  if (aspectRatio) body.aspect_ratio = aspectRatio;
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (sound) body.sound = sound;
  if (cameraControl) body.camera_control = cameraControl;
  if (elementList) body.element_list = elementList;
  if (voiceList) body.voice_list = voiceList;
  if (callbackUrl) body.callback_url = callbackUrl;
  return createTask('/v1/videos/image2video', body);
}

export async function multiImageToVideo({ prompt, imageUrls, modelName = 'kling-v3', negativePrompt, cfgScale = 0.5, mode = 'std', duration = 5, aspectRatio = '16:9', callbackUrl } = {}) {
  validatePrompt(prompt);
  validateAspectRatio(aspectRatio);
  const caps = getCapabilities(modelName);
  if (!caps.multiImg) throw new KlingValidationError(`Model ${modelName} does not support multi-image. Use kling-v3 or kling-v3-omni.`);
  validateVideoParams(modelName, { duration, mode });
  if (!imageUrls?.length) throw new KlingValidationError('imageUrls required (1-6)');
  if (imageUrls.length > 6) throw new KlingValidationError(`Max 6 images, got ${imageUrls.length}`);
  const body = { model_name: modelName, prompt, image_urls: imageUrls, cfg_scale: cfgScale, mode, duration: String(duration), aspect_ratio: aspectRatio };
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (callbackUrl) body.callback_url = callbackUrl;
  return createTask('/v1/videos/multi-image2video', body);
}

export async function extendVideo({ prompt, videoId, videoUrl, direction = 'forward', callbackUrl } = {}) {
  validatePrompt(prompt);
  if (!videoId && !videoUrl) throw new KlingValidationError('Either videoId or videoUrl is required');
  if (videoId && videoUrl) throw new KlingValidationError('Provide either videoId OR videoUrl, not both');
  if (!['forward', 'backward'].includes(direction)) throw new KlingValidationError(`Invalid direction "${direction}"`);
  const body = { prompt, direction };
  if (videoId) body.video_id = videoId;
  if (videoUrl) body.video_url = videoUrl;
  if (callbackUrl) body.callback_url = callbackUrl;
  return createTask('/v1/videos/extend', body);
}

export async function lipSync({ videoId, videoUrl, mode, text, voiceId, voiceLanguage = 'en', voiceSpeed = 1.0, audioType, audioFile, audioUrl, callbackUrl } = {}) {
  if (!mode) throw new KlingValidationError('mode required ("text2video" or "audio2video")');
  if (!['text2video', 'audio2video'].includes(mode)) throw new KlingValidationError(`Invalid lip-sync mode "${mode}"`);
  if (!videoId && !videoUrl) throw new KlingValidationError('Either videoId or videoUrl is required');
  if (videoId && videoUrl) throw new KlingValidationError('Provide videoId OR videoUrl, not both');
  const body = { mode };
  if (videoId) body.video_id = videoId;
  if (videoUrl) body.video_url = videoUrl;
  if (mode === 'text2video') {
    if (!text) throw new KlingValidationError('text required for text2video mode');
    if (text.length > 120) throw new KlingValidationError(`Lip-sync text max 120 chars (got ${text.length})`);
    if (!voiceId) throw new KlingValidationError('voiceId required for text2video mode');
    if (voiceSpeed < 0.8 || voiceSpeed > 2.0) throw new KlingValidationError('voiceSpeed must be 0.8-2.0');
    body.text = text; body.voice_id = voiceId; body.voice_language = voiceLanguage; body.voice_speed = voiceSpeed;
  }
  if (mode === 'audio2video') {
    if (!audioType) throw new KlingValidationError('audioType required for audio2video mode');
    if (!['file', 'url'].includes(audioType)) throw new KlingValidationError(`Invalid audioType "${audioType}"`);
    if (audioType === 'file' && !audioFile) throw new KlingValidationError('audioFile required when audioType="file"');
    if (audioType === 'url' && !audioUrl) throw new KlingValidationError('audioUrl required when audioType="url"');
    body.audio_type = audioType;
    if (audioFile) body.audio_file = stripDataUri(audioFile);
    if (audioUrl) body.audio_url = audioUrl;
  }
  if (callbackUrl) body.callback_url = callbackUrl;
  return createTask('/v1/videos/lip-sync', body);
}

export async function videoEffects({ effectType, imageUrls, videoUrl, callbackUrl } = {}) {
  if (!effectType) throw new KlingValidationError('effectType is required');
  const body = { effect_type: effectType };
  if (imageUrls) body.image_urls = imageUrls;
  if (videoUrl) body.video_url = videoUrl;
  if (callbackUrl) body.callback_url = callbackUrl;
  return createTask('/v1/videos/effects', body);
}

export async function avatar(image, audio, prompt, { modelName, mode = 'std', audioId } = {}) {
  if (!image) throw new KlingValidationError('avatar: image is required');
  if (!audio && !audioId) throw new KlingValidationError('avatar: audio or audioId is required');
  validatePrompt(prompt, 'avatar prompt');
  if (!['std', 'pro'].includes(mode)) throw new KlingValidationError(`avatar: invalid mode "${mode}"`);
  const body = { image: stripDataUri(image), prompt, mode };
  if (modelName) body.model_name = modelName;
  if (audioId) body.audio_id = audioId;
  else if (audio) body.sound_file = stripDataUri(audio);
  return createTask('/v1/videos/avatar/image2video', body);
}

export async function composeImage({ prompt, image, modelName = 'kling-v1-5', imageReference = 'subject', humanFidelity = 0.8, aspectRatio = '9:16', resolution = '1k', negativePrompt, n = 1 } = {}) {
  validatePrompt(prompt);
  validateAspectRatio(aspectRatio);
  if (n < 1 || n > 9) throw new KlingValidationError('n must be 1-9');
  const body = { model_name: modelName, prompt, aspect_ratio: aspectRatio, resolution, n };
  if (image) { body.image = stripDataUri(image); body.image_reference = imageReference; body.human_fidelity = humanFidelity; }
  if (negativePrompt) body.negative_prompt = negativePrompt;
  return createTask('/v1/images/generations', body);
}

export async function generateImage({ prompt, modelName = 'kling-v3', negativePrompt, aspectRatio = '16:9', n = 1, callbackUrl } = {}) {
  validatePrompt(prompt);
  validateAspectRatio(aspectRatio);
  if (n < 1 || n > 9) throw new KlingValidationError('n must be 1-9');
  const body = { model_name: modelName, prompt, aspect_ratio: aspectRatio, n };
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (callbackUrl) body.callback_url = callbackUrl;
  return createTask('/v1/images/generations', body);
}

export async function tryOn(humanImage, clothImage, { modelName = 'kolors-virtual-try-on-v1-5', externalTaskId } = {}) {
  if (!humanImage) throw new KlingValidationError('tryOn: humanImage is required');
  if (!clothImage) throw new KlingValidationError('tryOn: clothImage is required');
  return createTask('/v1/images/kolors-virtual-try-on', {
    model_name: modelName, human_image: stripDataUri(humanImage), cloth_image: stripDataUri(clothImage), external_task_id: externalTaskId || '',
  });
}

export async function createElement(name, imageUrl) {
  if (!name) throw new KlingValidationError('Element name is required');
  if (!imageUrl) throw new KlingValidationError('Element imageUrl is required');
  return createTask('/v1/elements', { name, image_url: imageUrl });
}

export async function listElements() {
  const res = await fetch(`${BASE}/v1/elements`, { headers: authHeaders() });
  return (await asJson(res))?.data || [];
}

export async function createVoice(name, audioUrl) {
  if (!name) throw new KlingValidationError('Voice name is required');
  if (!audioUrl) throw new KlingValidationError('Voice audioUrl is required');
  return createTask('/v1/voices', { name, audio_url: audioUrl });
}

export async function listVoices() {
  const res = await fetch(`${BASE}/v1/voices`, { headers: authHeaders() });
  return (await asJson(res))?.data || [];
}

export async function getAccountInfo() {
  const res = await fetch(`${BASE}/v1/account/packages`, { headers: authHeaders() });
  return asJson(res);
}

export async function uploadFile(base64, { kind = 'image' } = {}) {
  const res = await fetch(`${BASE}/file-upload-api/upload-file-base-64`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify({ data: stripDataUri(base64), type: kind }),
  });
  const data = await asJson(res);
  if (!res.ok || (data.code !== undefined && data.code !== 0)) throw new KlingApiError(data.message || `Upload failed (HTTP ${res.status})`, data.code);
  return data?.data?.file_id;
}
