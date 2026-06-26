/**
 * Video-generation provider seam.
 *
 * This is the single place where a concrete generation API is wired in.
 * The rest of the backend (toolchest pipeline, audio trimming, image
 * compression, job polling) is provider-agnostic and talks only to the two
 * functions exported here.
 *
 * To enable a provider (Replicate, Fal, Runway, Luma, Pika, Kling, ...):
 *   1. Set VIDEO_API_KEY (and optionally VIDEO_API_BASE / VIDEO_MODEL) in server/.env
 *   2. Implement submitGeneration() and pollStatus() below for that API.
 *
 * The request object passed to submitGeneration() is provider-neutral:
 *   {
 *     model:           string,
 *     prompt:          string,
 *     negative_prompt: string,
 *     aspect_ratio:    string,   // e.g. '16:9'
 *     duration:        number,   // seconds
 *     resolution:      string,   // '480p' | '720p' | '1080p'
 *     reference_images?: Array<{ url: string }>,  // data URIs, only if refs enabled
 *     audio?:          string,   // data URI, only if provider accepts audio
 *   }
 */

import fetch from 'node-fetch';

export const API_KEY = process.env.VIDEO_API_KEY || '';
export const API_BASE = process.env.VIDEO_API_BASE || '';
export const MODEL = process.env.VIDEO_MODEL || '';

/** Raised when generation is attempted before a provider/key is configured. */
export class ProviderNotConfiguredError extends Error {
  constructor(message = 'No video-generation provider is configured. Set VIDEO_API_KEY and implement server/provider.js.') {
    super(message);
    this.name = 'ProviderNotConfiguredError';
    this.code = 'provider_not_configured';
  }
}

/** True once a provider API key is present in the environment. */
export function isConfigured() {
  return Boolean(API_KEY);
}

/**
 * Submit a generation job to the provider.
 *
 * Return one of:
 *   { requestId: string }   → asynchronous; the backend will poll pollStatus()
 *   { resultUrl: string }   → synchronous; the video is already available
 *
 * @param {object} request  provider-neutral request (see file header)
 * @returns {Promise<{ requestId?: string, resultUrl?: string }>}
 */
export async function submitGeneration(request) {
  if (!isConfigured()) throw new ProviderNotConfiguredError();

  // ── Wire your provider here ──────────────────────────────────────────────
  // Example shape (pseudo):
  //   const res = await fetch(`${API_BASE}/generate`, {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ model: MODEL || request.model, ...request }),
  //   });
  //   const data = await res.json();
  //   if (!res.ok) throw new Error(data?.error?.message || `Provider HTTP ${res.status}`);
  //   return { requestId: data.id };           // or: return { resultUrl: data.output[0] };
  // ─────────────────────────────────────────────────────────────────────────
  void fetch; // keep import referenced until a real call is wired
  void request;
  throw new Error('submitGeneration() is not implemented yet — wire your chosen provider in server/provider.js');
}

/**
 * Poll a previously-submitted job for completion.
 *
 * @param {string} requestId  id returned by submitGeneration()
 * @returns {Promise<{ status: 'processing'|'done'|'error', resultUrl?: string, error?: string }>}
 */
export async function pollStatus(requestId) {
  if (!isConfigured()) throw new ProviderNotConfiguredError();

  // ── Wire your provider here ──────────────────────────────────────────────
  // Example shape (pseudo):
  //   const res = await fetch(`${API_BASE}/jobs/${requestId}`, {
  //     headers: { Authorization: `Bearer ${API_KEY}` },
  //   });
  //   const data = await res.json();
  //   if (!res.ok) return { status: 'error', error: data?.error?.message || `HTTP ${res.status}` };
  //   if (data.status === 'succeeded') return { status: 'done', resultUrl: data.output[0] };
  //   if (['failed','canceled'].includes(data.status)) return { status: 'error', error: data.error };
  //   return { status: 'processing' };
  // ─────────────────────────────────────────────────────────────────────────
  void requestId;
  throw new Error('pollStatus() is not implemented yet — wire your chosen provider in server/provider.js');
}
