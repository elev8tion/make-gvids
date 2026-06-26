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
import { getPlacement } from './scene-placements.js';

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
const SCENES_DIR = path.join(process.cwd(), '..', 'public', 'assets', 'scenes');
const OUTFIT_SLOT_DIR = { top: 'tops', bottom: 'bottoms', shoe: 'shoes', hat: 'hats' };
const FFMPEG = process.env.FFMPEG_PATH || '/opt/homebrew/bin/ffmpeg';
// Subtle, deterministic (non-AI) color-grade strength for matching the subject
// to the scene. 0 disables it. GRADE = tint toward the scene's color cast;
// GRADE_BRIGHTNESS = nudge the subject's exposure toward the scene's. Kept low
// by default so identity/scene never drift — this is a local color move, not a
// relight (AI relighting was rejected for drifting the face/background).
const GRADE_STRENGTH = parseFloat(process.env.COMPOSITE_GRADE_STRENGTH || '0.35');
const GRADE_BRIGHTNESS = parseFloat(process.env.COMPOSITE_GRADE_BRIGHTNESS || '0.20');
// The curated scene plates are only ~768px wide; that, plus full-body framing,
// starved the Avatar face of pixels. We composite onto an upscaled working
// canvas so the still carries real resolution into Kling.
const CANVAS_W = parseInt(process.env.COMPOSITE_CANVAS_W || '1080', 10);
const CANVAS_H = parseInt(process.env.COMPOSITE_CANVAS_H || '1920', 10);
// Kling Avatar quality: 'pro' = 1080p (vs 'std' = 720p). High-res still + pro.
const AVATAR_MODE = process.env.AVATAR_MODE || 'pro';
const AVATAR_MAXDIM = parseInt(process.env.AVATAR_MAXDIM || '1440', 10);
const AVATAR_JPEG_Q = parseInt(process.env.AVATAR_JPEG_Q || '95', 10);

function pickFile(files, field) {
  return (files || []).find((f) => f && f.fieldname === field);
}

/** Load an image to a RAW buffer (preserves alpha — used for the cutout in compositing). */
async function loadImageBuffer({ url, file }) {
  if (url) {
    if (url.includes('/generated/')) {
      return fs.readFileSync(path.join(GENERATED_DIR, path.basename(new URL(url, BACKEND_URL).pathname)));
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch image (HTTP ${res.status})`);
    return Buffer.from(await res.arrayBuffer());
  }
  if (file?.path) return fs.readFileSync(file.path);
  throw new Error('no image input (url or file)');
}

/**
 * Resize to ≤maxDim + JPEG → RAW base64. Defaults stay small for the early
 * stages (try-on/compose reference payloads); the Avatar still overrides with a
 * larger maxDim + higher quality so the face keeps its detail (a tiny/low-q
 * still is the main reason the animated face looked mushy).
 */
async function compressToBase64(buffer, { maxDim = 1280, quality = 88 } = {}) {
  const out = await sharp(buffer, { failOn: 'none' })
    .resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  return out.toString('base64');
}

/** Read a local `/generated` URL, a remote URL, or an uploaded file → compressed RAW base64. */
async function imageToBase64({ url, file }, opts) {
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
  return compressToBase64(buffer, opts);
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

/**
 * Phase 4 — place the subject into the SELECTED scene.
 *
 * Composite-first: deterministically place the background-removed subject cutout
 * onto the user's chosen scene plate (public/assets/scenes/thumbnails/<id>.png).
 * This GUARANTEES the exact curated scene + the exact subject identity/outfit — no
 * AI re-generation, no drift. (A single Kling image call cannot take both a subject
 * reference AND a scene image, so generating-from-text invented a wrong person and a
 * wrong background; compositing avoids that entirely.)
 *
 * Falls back to the generative path only when there is no scene plate to composite onto.
 */
async function runCompose(request) {
  const sceneId = request.sceneId;
  const platePath = sceneId
    ? path.join(SCENES_DIR, 'thumbnails', `${path.basename(String(sceneId))}.png`)
    : null;

  if (platePath && fs.existsSync(platePath)) {
    return compositeSubjectOntoPlate(request, platePath);
  }
  console.warn('[Compose] no scene plate found — falling back to generative compose');
  return runGenerativeCompose(request);
}

/**
 * Subtle, deterministic color-grade — tint the subject toward the scene's color
 * cast and nudge its exposure toward the scene's, so a studio-lit subject stops
 * reading as pasted-on over (e.g.) a dusk meadow. Pure per-pixel linear math on
 * the cutout — NO AI, so identity and the scene plate never drift. Alpha is left
 * untouched so the cutout edges stay clean.
 */
async function gradeSubjectToPlate(resizedCutBuf, platePath) {
  if (GRADE_STRENGTH <= 0 && GRADE_BRIGHTNESS <= 0) return resizedCutBuf;

  // Scene plate's average color → its color cast (luma-normalized) and exposure.
  const stats = await sharp(platePath).stats();
  const [pr, pg, pb] = stats.channels.map((c) => c.mean);
  const luma = 0.299 * pr + 0.587 * pg + 0.114 * pb || 1;

  // Tint multipliers: move the subject partway toward the scene's cast without
  // changing its overall brightness (cast is luma-normalized).
  const mr = 1 + GRADE_STRENGTH * (pr / luma - 1);
  const mg = 1 + GRADE_STRENGTH * (pg / luma - 1);
  const mb = 1 + GRADE_STRENGTH * (pb / luma - 1);
  // Exposure nudge toward the scene relative to mid-grey (darker scene → dimmer
  // subject), clamped so it stays subtle.
  const bf = Math.max(0.6, Math.min(1.4, 1 + GRADE_BRIGHTNESS * (luma / 128 - 1)));
  const mult = [mr * bf, mg * bf, mb * bf];

  const { data, info } = await sharp(resizedCutBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true }); // RGBA, info.channels === 4
  const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = clamp(Math.round(data[i] * mult[0]));
    data[i + 1] = clamp(Math.round(data[i + 1] * mult[1]));
    data[i + 2] = clamp(Math.round(data[i + 2] * mult[2]));
    // data[i + 3] (alpha) untouched
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

/** Tightly crop a transparent cutout to its subject bounding box (so the head sits at the top). */
async function trimToSubject(cutoutBuf) {
  try {
    return await sharp(cutoutBuf).ensureAlpha().trim({ threshold: 10 }).toBuffer();
  } catch {
    return cutoutBuf; // nothing to trim (already tight / fully opaque)
  }
}

/**
 * Composite the (transparent) subject cutout onto the scene plate.
 *
 * Two framing modes (per-scene, from the ref guide):
 *   • 'portrait' (default) — the head-and-upper-body framing a lip-sync Avatar
 *     model needs. The subject is scaled so the canvas covers `subjectFillFrac`
 *     of the full standing figure (the rest runs off the bottom) and pinned to
 *     the top with `headroomFrac` of clearance, so the FACE is large.
 *   • 'full' — the whole figure fits within `heightFrac`, anchored by
 *     hAlign/vAlign (for top-down / flat-lay plates where a portrait makes no sense).
 *
 * The plate is upscaled (lanczos) to the working canvas first, so the still
 * carries real resolution into Kling instead of the ~768px plate.
 */
async function compositeSubjectOntoPlate(request, platePath) {
  const cutoutBuf = await loadImageBuffer({
    url: request.subjectUrl || request.image,
    file: pickFile(request.files, 'image'),
  });

  const place = getPlacement(request.sceneId);
  const W = CANVAS_W;
  const H = CANVAS_H;

  // Upscale + cover-fit the curated plate to the working canvas.
  const plateBuf = await sharp(platePath)
    .resize({ width: W, height: H, fit: 'cover', kernel: 'lanczos3' })
    .toBuffer();

  let subj, left, top;
  if (place.frame === 'full') {
    // Whole figure, anchored (legacy behavior on the upscaled canvas).
    const boxH = Math.round(H * (place.heightFrac || 0.82));
    subj = await sharp(cutoutBuf)
      .resize({ width: W, height: boxH, fit: 'inside', withoutEnlargement: false })
      .png().toBuffer();
    subj = await gradeSubjectToPlate(subj, platePath);
    const m = await sharp(subj).metadata();
    const inset = Math.round((place.insetFrac || 0) * W);
    if (place.hAlign === 'left') left = inset;
    else if (place.hAlign === 'right') left = W - m.width - inset;
    else left = Math.round((W - m.width) / 2);
    top = place.vAlign === 'center' ? Math.round((H - m.height) / 2) : H - m.height;
  } else {
    // Portrait — adaptive to the cutout's actual shape (uploads vary between
    // head-and-shoulders and full-body), so the MOUTH is never cropped:
    //   • full-body cutout (tall) → zoom to the upper `subjectFillFrac`, crop legs.
    //   • already-portrait cutout → fit the WHOLE subject (face stays intact).
    const headroom = Math.round((place.headroomFrac ?? 0.06) * H);
    const avail = H - headroom;
    const trimmed = await trimToSubject(cutoutBuf);
    const tMeta = await sharp(trimmed).metadata();
    const aspect = tMeta.height / tMeta.width;

    let scaled;
    if (aspect >= (place.fullBodyAspect || 2.2)) {
      const fill = place.subjectFillFrac || 0.6;
      scaled = await sharp(trimmed)
        .resize({ height: Math.round(avail / fill), fit: 'inside', withoutEnlargement: false })
        .png().toBuffer();
    } else {
      scaled = await sharp(trimmed)
        .resize({ width: W, height: avail, fit: 'inside', withoutEnlargement: false })
        .png().toBuffer();
    }
    const sMeta = await sharp(scaled).metadata();
    const cropH = Math.min(sMeta.height, avail);
    const cropW = Math.min(sMeta.width, W);
    const cropX = Math.max(0, Math.round((sMeta.width - cropW) / 2));
    subj = await sharp(scaled)
      .extract({ left: cropX, top: 0, width: cropW, height: cropH })
      .png().toBuffer();
    subj = await gradeSubjectToPlate(subj, platePath);
    // Horizontal nudge from the ref guide (insetFrac shifts toward hAlign side).
    const inset = Math.round((place.insetFrac || 0) * W);
    if (place.hAlign === 'left') left = inset;
    else if (place.hAlign === 'right') left = W - cropW - inset;
    else left = Math.round((W - cropW) / 2);
    top = headroom;
  }
  left = Math.max(0, Math.min(left, W - (await sharp(subj).metadata()).width));
  top = Math.max(0, Math.min(top, H - (await sharp(subj).metadata()).height));

  const outBuf = await sharp(plateBuf)
    .composite([{ input: subj, left, top }])
    .png({ compressionLevel: 9 }) // lossless — no double-JPEG before Avatar
    .toBuffer();

  const fileName = `compose_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.png`;
  fs.writeFileSync(path.join(GENERATED_DIR, fileName), outBuf);
  console.log(
    '[Compose] composited subject onto plate', path.basename(platePath),
    `(scene=${request.sceneId || 'default'} frame=${place.frame || 'portrait'} ${W}x${H} grade=${GRADE_STRENGTH}/${GRADE_BRIGHTNESS})`,
    '→', fileName,
  );
  return { resultUrl: `${BACKEND_URL}/generated/${fileName}` };
}

/** Fallback — generative compose (subject reference + scene-in-prompt). Background is an approximation. */
async function runGenerativeCompose(request) {
  const subjectB64 = await imageToBase64({
    url: request.subjectUrl || request.image,
    file: pickFile(request.files, 'image'),
  });
  const scenePrompt = (request.prompt || 'A cinematic music-video scene').trim();
  const prompt = `${scenePrompt} Keep the EXACT same person from the reference image — same face, hairstyle, tattoos and clothing. Cohesive lighting and color grade; photorealistic, high detail.`.slice(0, 2500);
  return kling.composeImage({
    prompt,
    image: subjectB64,
    imageReference: 'subject',
    humanFidelity: 1.0, // max identity lock (agent found 0.8 invented a new person)
    aspectRatio: request.aspect_ratio || '9:16',
    resolution: '1k',
    negativePrompt: 'different person, extra people, duplicate person, distorted face, deformed hands, text, watermark, logo, low quality',
  });
}

/** Phase 6 — animate composed still + chosen audio section → Avatar performance video. */
async function runAnimate(request) {
  const imageB64 = await imageToBase64({
    url: request.composedImageUrl || request.image,
    file: pickFile(request.files, 'image'),
  }, { maxDim: AVATAR_MAXDIM, quality: AVATAR_JPEG_Q }); // large + high-q: keep the face's detail
  const audioFile = pickFile(request.files, 'audio');
  if (!audioFile?.path) throw new Error('animate: no audio uploaded');
  const audioB64 = await trimAudioToBase64(
    audioFile.path,
    parseFloat(request.trimStart) || 0,
    parseInt(request.trimDuration, 10) || 10,
  );
  // Kling Avatar prompt = expression + head/body movement ONLY (vocals are in
  // the audio; describing speech content fights the lip-sync). See
  // docs/providers/kling/source/06-guides/02-prompt-engineering.md.
  const prompt = (request.prompt
    || 'Mouthing the lyrics in time with the music, brows lift on emphasis, head tilts on the downbeat, shoulders sway to the beat, natural eye contact with occasional blinks, relaxed and confident.').slice(0, 2500);
  return kling.avatar(imageB64, audioB64, prompt, { mode: AVATAR_MODE }); // 'pro'=1080p
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
