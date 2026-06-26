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

  if (kind === 'isolate') return fal.rembg(request.image);
  if (kind === 'tryon') return kling.tryOn(request.humanImage, request.clothImage, request);
  return kling.composeImage(request);
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

  // Legacy /generate sends reference_images[]; fall back to the first one.
  const image = request.image || request.reference_images?.[0]?.url;
  return kling.avatar(image, request.audio, request.prompt, request);
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
