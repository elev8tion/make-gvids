// Frontend API client for the make-gvids backend.
//
// The backend (server/index.js) exposes four generation seams as job endpoints:
//   POST /isolate  → Phase 1 (fal rembg — background removal / cutout)
//   POST /tryon    → Phase 2 (kolors virtual try-on)
//   POST /compose  → Phase 4 (composed still)
//   POST /animate  → Phase 6 (Kling Avatar — motion + camera + lip-sync)
// Each returns `{ jobId }` immediately; the work runs in the background and the
// result is polled via `GET /jobs/:id` → `{ status, resultUrl, error }`.
//
// In MOCK MODE (no provider keys, or MOCK_GENERATION=1) every stage still returns
// a real, viewable placeholder URL under /generated, so the whole flow completes
// end-to-end without any keys.

import type {
  OutfitSelection,
  Scene,
  ComposeMode,
  AspectChoice,
  VideoAspect,
  OutputFormat,
  AudioSection,
} from '../types/pipeline';

/** Backend base URL — override via Vite env (`VITE_BACKEND_URL`). */
export const BACKEND: string =
  (import.meta.env?.VITE_BACKEND_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:8787';

// ────────────────────────────────────────────────────────────────────────────
// Job polling
// ────────────────────────────────────────────────────────────────────────────

/** Coarse status reported by the backend job store. */
export type BackendJobStatus = 'processing' | 'done' | 'error';

/** A single pipeline step as reported by the backend (best-effort). */
export interface JobStep {
  name: string;
  status: string;
}

/** Shape of `GET /jobs/:id`. */
export interface JobSnapshot {
  jobId: string;
  status: BackendJobStatus;
  resultUrl: string | null;
  error: string | null;
  steps?: JobStep[];
  /** True when try-on was unavailable and the subject's original outfit was used. */
  tryOnSkipped?: boolean;
  /** Human-readable note (e.g. try-on skipped) for the UI to surface. */
  note?: string | null;
}

/** Returned by every generation seam. */
export interface JobHandle {
  jobId: string;
}

const POLL_INTERVAL_MS = 1500;
const POLL_TIMEOUT_MS = 5 * 60 * 1000; // ~5 min, matches the backend poller budget

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function errorText(err: unknown): string {
  if (typeof err === 'string') return err;
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: unknown }).message);
  }
  return JSON.stringify(err);
}

/**
 * Poll `GET /jobs/:id` until the job reaches `done` (resolves with the result
 * URL) or `error` / timeout (rejects). `onProgress` fires on every snapshot so
 * callers can render live status / step info.
 */
export async function pollJob(
  jobId: string,
  onProgress?: (snapshot: JobSnapshot) => void,
): Promise<string> {
  const startedAt = Date.now();

  for (;;) {
    const res = await fetch(`${BACKEND}/jobs/${jobId}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error(`Job ${jobId} not found`);
      throw new Error(`Failed to poll job ${jobId} (HTTP ${res.status})`);
    }

    const snapshot = (await res.json()) as JobSnapshot;
    onProgress?.(snapshot);

    if (snapshot.status === 'done') {
      if (!snapshot.resultUrl) throw new Error('Job completed without a result URL');
      return snapshot.resultUrl;
    }

    if (snapshot.status === 'error') {
      throw new Error(errorText(snapshot.error) || 'Generation job failed');
    }

    if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
      throw new Error('Generation timed out — please try again');
    }

    await sleep(POLL_INTERVAL_MS);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Low-level POST helpers
// ────────────────────────────────────────────────────────────────────────────

async function startJob(path: string, body: FormData): Promise<JobHandle> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND}${path}`, { method: 'POST', body });
  } catch (err) {
    throw new Error(`Cannot reach backend at ${BACKEND} — is it running? (${errorText(err)})`);
  }

  if (!res.ok) {
    let message = `Request to ${path} failed (HTTP ${res.status})`;
    try {
      const data = (await res.json()) as { error?: string; message?: string };
      message = data.message || data.error || message;
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new Error(message);
  }

  const data = (await res.json()) as { jobId?: string };
  if (!data.jobId) throw new Error(`Backend did not return a jobId for ${path}`);
  return { jobId: data.jobId };
}

/** Append a value to FormData only when it is meaningfully present. */
function put(form: FormData, key: string, value: string | number | undefined | null) {
  if (value === undefined || value === null || value === '') return;
  form.append(key, String(value));
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 1 — isolate (background removal → cutout)
// ────────────────────────────────────────────────────────────────────────────

/**
 * Submit one or more source photos for background removal. Returns the job
 * handle; poll with {@link pollJob} to get the cutout URL.
 */
export async function isolate(images: File[]): Promise<JobHandle> {
  const form = new FormData();
  images.forEach((file) => form.append('images', file, file.name));
  // First image is the canonical subject for single-image (fal rembg) seams.
  if (images[0]) form.append('image', images[0], images[0].name);
  return startJob('/isolate', form);
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 2 / 4 — try-on (optional, when outfit items are selected)
// ────────────────────────────────────────────────────────────────────────────

export interface TryOnParams {
  /** Isolated subject cutout URL (preferred), or raw upload as a fallback. */
  subjectUrl?: string;
  subjectImage?: File;
  outfit: OutfitSelection;
}

/** Apply the selected outfit to the subject. */
export async function tryOn({ subjectUrl, subjectImage, outfit }: TryOnParams): Promise<JobHandle> {
  const form = new FormData();
  put(form, 'humanImage', subjectUrl);
  put(form, 'subjectUrl', subjectUrl);
  if (subjectImage) form.append('image', subjectImage, subjectImage.name);
  put(form, 'topId', outfit.topId);
  put(form, 'bottomId', outfit.bottomId);
  put(form, 'shoeId', outfit.shoeId);
  put(form, 'hatId', outfit.hatId);
  form.append('outfit', JSON.stringify(outfit));
  return startJob('/tryon', form);
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 4 — compose (subject placed into the scene → composed still)
// ────────────────────────────────────────────────────────────────────────────

export interface ComposeParams {
  /** Subject to place — the tried-on result, else the isolated cutout. */
  subjectUrl?: string;
  subjectImage?: File;
  scene: Scene | null;
  outfit?: OutfitSelection;
  composeMode: ComposeMode;
  /** Final scene prompt (custom override, else the scene's default description). */
  prompt: string;
  aspect: AspectChoice;
  /** 'portrait' = tight face (best lip-sync), 'fullBody' = whole figure visible. */
  framing?: 'portrait' | 'fullBody';
}

/** Generate the composed still (Path A quick / Path B precise). */
export async function compose({
  subjectUrl,
  subjectImage,
  scene,
  outfit,
  composeMode,
  prompt,
  aspect,
}: ComposeParams): Promise<JobHandle> {
  const form = new FormData();
  put(form, 'image', subjectUrl);
  put(form, 'subjectUrl', subjectUrl);
  if (subjectImage) form.append('image', subjectImage, subjectImage.name);
  put(form, 'prompt', prompt);
  put(form, 'composeMode', composeMode);
  put(form, 'aspect_ratio', aspect === 'both' ? '9:16' : aspect);
  if (scene) {
    put(form, 'sceneId', scene.id);
    put(form, 'scenePlateUrl', scene.thumbnailUrl);
    put(form, 'sceneRefUrl', scene.refUrl);
  }
  if (outfit) form.append('outfit', JSON.stringify(outfit));
  put(form, 'framing', framing || 'portrait');
  return startJob('/compose', form);
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 6 — animate (composed still + audio → performance video)
// ────────────────────────────────────────────────────────────────────────────

export interface AnimateParams {
  /** Composed still — the seed / first frame. */
  imageUrl: string;
  audio?: File | null;
  section?: AudioSection | null;
  /** Performance prompt: body actions + camera movement (≤2500 chars). */
  prompt: string;
  output: OutputFormat;
  /** Concrete orientation for this render (required when output.aspect === 'both'). */
  aspect: VideoAspect;
}

/** Render one performance video for a single orientation. */
export async function animate({
  imageUrl,
  audio,
  section,
  prompt,
  output,
  aspect,
}: AnimateParams): Promise<JobHandle> {
  const form = new FormData();
  put(form, 'image', imageUrl);
  put(form, 'composedImageUrl', imageUrl);
  if (audio) form.append('audio', audio, audio.name);
  put(form, 'prompt', prompt);
  put(form, 'resolution', output.resolution);
  put(form, 'aspect_ratio', aspect);
  if (section) {
    put(form, 'trimStart', section.startSec);
    put(form, 'trimDuration', section.durationSec);
  }
  return startJob('/animate', form);
}
