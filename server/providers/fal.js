/**
 * fal client — background removal (Phase 1 / isolate).
 *
 * Model: `fal-ai/imageutils/rembg`. The one fal dependency in an otherwise
 * Kling-primary pipeline. Auth via the `FAL_KEY` env var.
 *
 * Uses `@fal-ai/client` when installed (synchronous `fal.subscribe`); otherwise
 * falls back to a REST stub against the fal queue API. Only runs with a key set.
 *
 * Docs: docs/providers/fal/captures/rembg.md
 */

import fetch from 'node-fetch';
import fs from 'node:fs';
import path from 'node:path';

const KEY = process.env.FAL_KEY || '';
const MODEL = 'fal-ai/imageutils/rembg';
const QUEUE_BASE = process.env.FAL_QUEUE_BASE || 'https://queue.fal.run';

/** True once a fal key is present. */
export function isConfigured() {
  return Boolean(KEY);
}

function authHeaders() {
  return {
    Authorization: `Key ${KEY}`,
    'Content-Type': 'application/json',
  };
}

// Lazily try the official client; null if not installed.
let _client = null;
let _clientTried = false;
async function getClient() {
  if (_clientTried) return _client;
  _clientTried = true;
  try {
    const mod = await import('@fal-ai/client');
    _client = mod.fal;
    _client.config({ credentials: KEY });
  } catch {
    _client = null; // fall back to REST
  }
  return _client;
}

/**
 * Remove the background from an image.
 * @param {string} imageUrl  publicly reachable URL (or fal CDN url)
 * @returns {Promise<{ resultUrl?: string, requestId?: string }>}
 *   resultUrl → synchronous (official client); requestId → poll via pollTask()
 */
export async function rembg(imageUrl) {
  const client = await getClient();

  if (client) {
    const result = await client.subscribe(MODEL, {
      input: { image_url: imageUrl },
      logs: false,
    });
    const url = result?.data?.image?.url;
    if (!url) throw new Error('fal rembg returned no image url');
    return { resultUrl: url };
  }

  // REST stub: enqueue and let provider.js poll.
  const res = await fetch(`${QUEUE_BASE}/${MODEL}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ image_url: imageUrl }),
  });
  const data = await res.json();
  if (!res.ok || !data?.request_id) {
    throw new Error(data?.detail || `fal rembg enqueue failed (HTTP ${res.status})`);
  }
  return { requestId: data.request_id };
}

/**
 * Upload a LOCAL file to fal storage and return its public URL.
 * Requires the official @fal-ai/client.
 */
export async function uploadLocalFile(filePath, mimeType = 'image/png') {
  const client = await getClient();
  if (!client) throw new Error('fal upload requires @fal-ai/client (not installed)');
  const buffer = fs.readFileSync(filePath);
  const name = path.basename(filePath) + (path.extname(filePath) ? '' : '.png');
  // fal accepts a Blob/File; prefer File (with a name) for content-type inference.
  const blob = new Blob([buffer], { type: mimeType });
  const fileObj = typeof File !== 'undefined' ? new File([blob], name, { type: mimeType }) : blob;
  return client.storage.upload(fileObj);
}

/**
 * Background-remove a LOCAL image file: upload to fal storage → rembg.
 * @returns {Promise<{ resultUrl?: string, requestId?: string }>}
 */
export async function rembgFile(filePath, mimeType = 'image/png') {
  const url = await uploadLocalFile(filePath, mimeType);
  return rembg(url);
}

/**
 * Poll a queued fal request (REST path only).
 * @returns {Promise<{ status: 'processing'|'done'|'error', resultUrl?, error? }>}
 */
export async function pollTask(requestId) {
  const statusRes = await fetch(`${QUEUE_BASE}/${MODEL}/requests/${requestId}/status`, {
    headers: authHeaders(),
  });
  const status = await statusRes.json();
  if (!statusRes.ok) {
    return { status: 'error', error: status?.detail || `fal status HTTP ${statusRes.status}` };
  }
  if (status.status !== 'COMPLETED') return { status: 'processing' };

  const res = await fetch(`${QUEUE_BASE}/${MODEL}/requests/${requestId}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  const url = data?.image?.url;
  if (!res.ok || !url) {
    return { status: 'error', error: data?.detail || 'fal result missing image url' };
  }
  return { status: 'done', resultUrl: url };
}
