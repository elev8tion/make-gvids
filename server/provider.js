/**
 * Provider seam — image + video generation.
 *
 * This is the single place the backend talks to generation providers. It splits
 * the old single video-shaped seam into TWO:
 *   • generateImage(request)  → Phases 1 (isolate), 2 (try-on), 4 (compose)
 *   • generateVideo(request)  → Phase 6 (animate / Kling Avatar)
 * plus a shared pollStatus(kind, requestId). Each generate* returns one of:
 *   { requestId }  → asynchronous; backend polls pollStatus(kind, requestId)
 *   { resultUrl }  → synchronous; result already available
 *
 * Provider HTTP lives in ./providers/{kling,fal}.js. Mock placeholders live in
 * ./providers/mock.js.
 *
 * MOCK MODE: when the relevant key is NOT configured (or MOCK_GENERATION=1), the
 * seams return a deterministic placeholder under /generated instead of throwing,
 * so the whole app flows end-to-end without any keys. This is logged explicitly.
 *
 * Resolved tech choices (see docs/workflow/BUILD-PLAN.md): API-Key auth,
 * polling-first, persist every output to the /generated folder (Kling assets
 * purge after 30 days — generate ≠ keep).
 */

import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch';
import sharp from 'sharp';
import { spawn } from 'node:child_process';

import * as kling from './providers/kling.js';
import * as fal from './providers/fal.js';
import { mockResult, MOCK_GENERATION } from './providers/mock.js';

const PORT = process.env.PORT || 8787;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;
const GENERATED_DIR = path.join(process.cwd(), 'generated');

export { MOCK_GENERATION };

/** Raised when generation is attempted before a provider/key is configured. */
export class ProviderNotConfiguredError extends Error {
  constructor(message = 'No generation provider is configured. Set KLING_API_KEY / FAL_KEY or MOCK_GENERATION=1.') {
    super(message);
    this.name = 'ProviderNotConfiguredError';
    this.code = 'provider_not_configured';
  }
}

// Which underlying provider backs each generation kind.
const PROVIDER_FOR_KIND = {
  isolate: fal,    // fal rembg
  tryon: kling,    // kolors-virtual-try-on
  compose: kling,  // images/generations
  animate: kling,  // videos/avatar/image2video
};

/**
 * Configuration status.
 *   isConfigured()         → true if ANY provider is usable (incl. mock mode)
 *   isConfigured('kling')  → Kling key present
 *   isConfigured('fal')    → fal key present
 */
export function isConfigured(which) {
  if (which === 'kling') return kling.isConfigured();
  if (which === 'fal') return fal.isConfigured();
  return MOCK_GENERATION || kling.isConfigured() || fal.isConfigured();
}

function providerConfiguredForKind(kind) {
  const p = PROVIDER_FOR_KIND[kind];
  return Boolean(p && p.isConfigured());
}

/** Mock when explicitly forced OR when the backing provider has no key. */
function shouldMock(kind) {
  return MOCK_GENERATION || !providerConfiguredForKind(kind);
}

// ── Input resolution helpers (frontend inputs → what Kling accepts) ──────────

const OUTFITS_DIR = path.join(process.cwd(), '..', 'public', 'assets', 'outfits');
const OUTFIT_SLOT_DIR = { top: 'tops', bottom: 'bottoms', shoe: 'shoes', hat: 'hats' };
const FFMPEG = process.env.FFMPEG_PATH || '/opt/homebrew/bin/ffmpeg';

function pickFile(files, field) {
  return (files || []).find((f) => f && f.fieldname === field);
}

/** Resize ≤1280px + JPEG q88 → RAW base64 (keeps Kling payloads small). */
async function compressToBase64(buffer) {
  const out = await sharp(buffer, { failOn: 'none' })
    .resize({ width: 1280, height: 1280, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  return out.toString('base64');
}

/** Read a local `/generated` URL, a remote URL, or an uploaded file → compressed RAW base64. */
async function imageToBase64({ url, file }) {
  let buffer;
  if (url) {
    if (url.includes('/generated/')) {
      buffer = fs.readFileSync(path.join(GENERATED_DIR, path.basename(new URL(url, BACKEND_URL).pathname)));
    } else {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch image (HTTP ${res.status})`);
      buffer = Buffer.from(await res.arrayBuffer());
    }
  } else if (file?.path) {
    buffer = fs.readFileSync(file.path);
  } else {
    throw new Error('no image input (url or file)');
  }
  return compressToBase64(buffer);
}

/** Load a wardrobe asset (public/assets/outfits/<dir>/<id>.png) → compressed RAW base64. */
async function outfitClothToBase64(slot, id) {
  const dir = OUTFIT_SLOT_DIR[slot];
  if (!dir) throw new Error(`unknown outfit slot ${slot}`);
  const file = path.join(OUTFITS_DIR, dir, `${id}.png`);
  return compressToBase64(fs.readFileSync(file));
}

/** Trim an uploaded audio file to [start, duration] and return RAW base64 mp3 (≤5MB for Avatar). */
function trimAudioToBase64(inputPath, startSec, durationSec) {
  return new Promise((resolve, reject) => {
    const out = path.join(GENERATED_DIR, `tmp-audio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.mp3`);
    const proc = spawn(FFMPEG, [
      '-y', '-ss', String(startSec || 0), '-t', String(durationSec || 10),
      '-i', inputPath, '-c:a', 'libmp3lame', '-b:a', '128k', out,
    ]);
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error(`ffmpeg audio trim failed (exit ${code})`));
      try {
        const buf = fs.readFileSync(out);
        try { fs.unlinkSync(out); } catch {}
        if (buf.length > 5_000_000) return reject(new Error('Trimmed audio exceeds the 5MB Avatar limit'));
        resolve(buf.toString('base64'));
      } catch (e) { reject(e); }
    });
  });
}

// ── Kling stage runners ──────────────────────────────────────────────────────

/** Phase 2 — dress the subject. Chains try-on over upper(top)+lower(bottom); shoes/hats are skipped (unsupported by Kolors). */
async function runTryOn(request) {
  const garments = [];
  if (request.topId) garments.push(['top', request.topId]);
  if (request.bottomId) garments.push(['bottom', request.bottomId]);
  const subjectUrl = request.subjectUrl || request.humanImage;

  if (!garments.length) {
    if (subjectUrl) return { resultUrl: subjectUrl }; // nothing to apply → pass subject through
    throw new Error('tryon: no garments selected and no subject');
  }

  // First human image = the subject cutout (localhost /generated → base64, since Kling can't reach it).
  // Loading the subject is wrapped so any failure here (e.g. unreadable cutout) still
  // degrades gracefully when we have a subject URL to fall back to, instead of hard-failing
  // the whole generation. Only re-throws when there is genuinely no subject to fall back to.
  let human;
  try {
    human = await imageToBase64({ url: subjectUrl, file: pickFile(request.files, 'image') });
  } catch (err) {
    if (subjectUrl) {
      console.warn(`[TryOn] could not load subject for try-on (${err.message}) — using original subject`);
      return { resultUrl: subjectUrl, tryOnSkipped: true };
    }
    throw err;
  }
  let lastUrl = null;
  let applied = 0;
  for (const [slot, id] of garments) {
    try {
      const cloth = await outfitClothToBase64(slot, id);
      const { requestId } = await kling.tryOn(human, cloth);
      lastUrl = await kling.pollUntilDone('tryon', requestId);
      human = lastUrl; // chain: next garment dresses the public Kling result URL
      applied++;
    } catch (err) {
      // Graceful degradation — e.g. "Account balance not enough" when the account has
      // no Virtual Try-On resource package (separate billing type from video/image).
      // Skip this garment rather than failing the whole generation; the subject keeps
      // their original clothing and the pipeline continues.
      console.warn(`[TryOn] skipping ${slot}=${id}: ${err.message} — proceeding without it`);
    }
  }
  if (!applied) {
    if (subjectUrl) {
      console.warn('[TryOn] no garments applied (try-on unavailable) — using original subject');
      return { resultUrl: subjectUrl, tryOnSkipped: true };
    }
    throw new Error('tryon failed and no subject URL to fall back to');
  }
  return { resultUrl: lastUrl };
}

/** Phase 4 — place the (dressed) subject into the scene. Path A: subject ref + scene-in-prompt. */
async function runCompose(request) {
  const subjectB64 = await imageToBase64({
    url: request.subjectUrl || request.image,
    file: pickFile(request.files, 'image'),
  });
  const scenePrompt = (request.prompt || 'A cinematic music-video scene').trim();
  const prompt = `${scenePrompt} Place the person from the reference image naturally into this scene, preserving their face, hairstyle and clothing. Cohesive lighting, perspective and color grade; photorealistic, high detail.`.slice(0, 2500);
  return kling.composeImage({
    prompt,
    image: subjectB64,
    imageReference: 'subject',
    humanFidelity: 0.8,
    aspectRatio: request.aspect_ratio || '9:16',
    resolution: '1k',
    negativePrompt: 'extra people, duplicate person, distorted face, deformed hands, text, watermark, logo, low quality',
  });
}

/** Phase 6 — animate composed still + chosen audio section → Avatar performance video. */
async function runAnimate(request) {
  const imageB64 = await imageToBase64({
    url: request.composedImageUrl || request.image,
    file: pickFile(request.files, 'image'),
  });
  const audioFile = pickFile(request.files, 'audio');
  if (!audioFile?.path) throw new Error('animate: no audio uploaded');
  const audioB64 = await trimAudioToBase64(
    audioFile.path,
    parseFloat(request.trimStart) || 0,
    parseInt(request.trimDuration, 10) || 10,
  );
  const prompt = (request.prompt
    || 'The performer sings to camera with natural expression, subtle head movement and body sway to the beat. Slow, smooth camera push-in.').slice(0, 2500);
  return kling.avatar(imageB64, audioB64, prompt, { mode: 'std' }); // std=720p
}

// ── Image seam (Phases 1, 2, 4) ─────────────────────────────────────────────

/**
 * Generate an image.
 * @param {object} request  { kind: 'isolate'|'tryon'|'compose', ... }
 *   isolate: { image }                          (image = public URL)
 *   tryon:   { humanImage, clothImage, modelName? }
 *   compose: { prompt, image?, ...composeOpts } (see kling.composeImage)
 * @returns {Promise<{ requestId?: string, resultUrl?: string, mock?: boolean }>}
 */
export async function generateImage(request = {}) {
  const kind = request.kind || 'compose';
  if (!['isolate', 'tryon', 'compose'].includes(kind)) {
    throw new Error(`generateImage: unsupported kind "${kind}"`);
  }

  if (shouldMock(kind)) {
    console.log(`[Provider] MOCK image (${kind}) — provider key missing or MOCK_GENERATION=1`);
    return mockResult(kind);
  }

  if (kind === 'isolate') {
    // Frontend uploads a file (multer → request.files); upload it to fal then rembg.
    const file = pickFile(request.files, 'image') || request.files?.[0];
    if (file?.path) return fal.rembgFile(file.path, file.mimetype);
    if (request.image) return fal.rembg(request.image); // URL fallback
    throw new Error('isolate: no image file or url provided');
  }
  if (kind === 'tryon') return runTryOn(request);   // chains garments, returns { resultUrl }
  return runCompose(request);                        // single task, returns { requestId }
}

// ── Video seam (Phase 6) ─────────────────────────────────────────────────────

/**
 * Generate a video.
 * @param {object} request  { kind?: 'animate', image, audio?, prompt, ... }
 * @returns {Promise<{ requestId?: string, resultUrl?: string, mock?: boolean }>}
 */
export async function generateVideo(request = {}) {
  const kind = request.kind || 'animate';
  if (kind !== 'animate') throw new Error(`generateVideo: unsupported kind "${kind}"`);

  if (shouldMock(kind)) {
    console.log(`[Provider] MOCK video (${kind}) — provider key missing or MOCK_GENERATION=1`);
    return mockResult(kind);
  }

  return runAnimate(request); // resolves image + trims audio → Kling Avatar, returns { requestId }
}

// ── Shared polling ──────────────────────────────────────────────────────────

/**
 * Poll a previously-submitted task.
 * @param {string} kind  task kind: 'isolate'|'tryon'|'compose'|'animate'
 *                       (coarse 'image'/'video' accepted; 'video'→'animate')
 * @param {string} requestId
 * @returns {Promise<{ status: 'processing'|'done'|'error', resultUrl?, error? }>}
 */
export async function pollStatus(kind, requestId) {
  let taskKind = kind;
  if (kind === 'video') taskKind = 'animate';
  if (kind === 'image') taskKind = 'compose';

  if (taskKind === 'isolate') return fal.pollTask(requestId);
  return kling.pollTask(taskKind, requestId);
}

// ── Persistence (30-day-expiry mitigation) ──────────────────────────────────

/**
 * Download a (remote or already-local) result URL into /generated and return a
 * stable backend URL. Provider results expire after 30 days, so we copy on
 * completion. Local /generated URLs (e.g. mock output) are passed through.
 */
export async function persistToGenerated(resultUrl, basename) {
  if (!fs.existsSync(GENERATED_DIR)) fs.mkdirSync(GENERATED_DIR, { recursive: true });

  // Already served by us (mock / prior persist) → nothing to copy.
  if (resultUrl.startsWith(BACKEND_URL) || resultUrl.startsWith('/generated/')) {
    return resultUrl;
  }

  const res = await fetch(resultUrl);
  if (!res.ok) throw new Error(`Failed to fetch result for persistence (HTTP ${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());

  const urlExt = path.extname(new URL(resultUrl).pathname) || '';
  const fileName = path.extname(basename) ? basename : `${basename}${urlExt || '.bin'}`;
  fs.writeFileSync(path.join(GENERATED_DIR, fileName), buf);
  const localUrl = `${BACKEND_URL}/generated/${fileName}`;
  console.log('[Persist] saved', resultUrl, '→', localUrl);
  return localUrl;
}
