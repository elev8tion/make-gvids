/**
 * make-gvids Backend — provider-agnostic video generation
 *
 * The concrete generation API is wired in server/provider.js. This server owns
 * the request shaping, the toolchest pre/post pipeline, audio trimming, image
 * compression, and job polling — all provider-neutral.
 *
 * Endpoints:
 *   POST /generate   → multipart (images + audio) → submits a generation job, returns { jobId }
 *   GET  /jobs/:id   → poll for { status, resultUrl?, error?, steps }
 *   GET  /health     → liveness + provider-configured flag
 */

// MUST be first: loads server/.env into process.env BEFORE the provider modules
// (imported below) read their keys at module-load time. Otherwise keys placed only
// in .env would be invisible to fal/kling clients.
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { spawn } from 'node:child_process';

import * as provider from './provider.js';

const app = express();
const PORT = process.env.PORT || 8787;
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// Serve generated videos with replaced audio
const GENERATED_DIR = path.join(process.cwd(), 'generated');
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}
app.use('/generated', express.static(GENERATED_DIR, { maxAge: '1h' }));

// ============================================
// In-memory job store (replace with Redis/DB in production)
// ============================================
const jobStore = new Map(); // jobId → { status: 'processing'|'done'|'error', resultUrl?, error?, createdAt, steps?, ... }

// Reference image handling.
// Refs are sent only when ENABLE_REFS=1 (some providers don't accept them, and large
// base64 payloads can trigger TLS errors). Compression keeps the payload reasonable.
const ENABLE_REFS = process.env.ENABLE_REFS === '1';
const MAX_REF_IMAGE_LONG_EDGE = parseInt(process.env.MAX_REF_IMAGE_LONG_EDGE || '1280', 10);
const REF_IMAGE_JPEG_QUALITY = parseInt(process.env.REF_IMAGE_JPEG_QUALITY || '88', 10);
const VIDEO_MODEL = process.env.VIDEO_MODEL || 'default';

// Toolchest pipeline (pre/post interceptors around the generation call) — dynamic import because server is ESM
const toolchest = await import('../toolchest/index.js');
const { promptEnhancer, audioAnalyzer, audioReplacer, audioLipSyncWav2Lip } = toolchest;
const ENABLE_WAV2LIP = process.env.WAV2LIP_ENABLED === '1';

const parseFlag = (value, defaultValue = true) => {
  if (value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    return !(lower === 'false' || lower === '0' || lower === 'off');
  }
  return Boolean(value);
};

/**
 * Compresses an image buffer for use as a reference image.
 * Goals: Keep payload size reasonable to avoid TLS "bad record mac" errors,
 * while preserving enough detail for face/character consistency.
 */
async function compressImageForRef(buffer, originalMime = 'image/jpeg') {
  try {
    const image = sharp(buffer, { failOn: 'none' });

    // Resize so the longest edge is at most MAX_REF_IMAGE_LONG_EDGE
    const metadata = await image.metadata();
    const longEdge = Math.max(metadata.width || 0, metadata.height || 0);

    let pipeline = image;
    if (longEdge > MAX_REF_IMAGE_LONG_EDGE) {
      pipeline = pipeline.resize({
        width: MAX_REF_IMAGE_LONG_EDGE,
        height: MAX_REF_IMAGE_LONG_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to JPEG at controlled quality (best size/quality tradeoff for faces)
    const compressedBuffer = await pipeline
      .jpeg({ quality: REF_IMAGE_JPEG_QUALITY, mozjpeg: true })
      .toBuffer();

    const base64 = compressedBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    console.warn('[Compress] Image compression failed, using original:', err.message);
    // Fallback: return original as-is (still better than crashing)
    const base64 = buffer.toString('base64');
    const mime = originalMime || 'image/jpeg';
    return `data:${mime};base64,${base64}`;
  }
}

// Run post-interceptors against a finished video URL and finalize the job.
async function finalizeJob(jobId, resultUrl) {
  const existingJob = jobStore.get(jobId) || {};
  let finalUrl = resultUrl;

  try {
    const flags = existingJob.pipelineFlags || {};
    const postPipeline = toolchest.buildPipeline({
      enableAudioAnalysis: flags.enableAudioAnalysis ?? true,
      enablePromptEnhancer: flags.enablePromptEnhancer ?? true,
      enableAudioReplace: flags.enableAudioReplace ?? true,
      enableWav2Lip: ENABLE_WAV2LIP,
      preInterceptors: [promptEnhancer, audioAnalyzer],
      postInterceptors: ENABLE_WAV2LIP ? [audioReplacer, audioLipSyncWav2Lip] : [audioReplacer],
    });

    const postContext = {
      ...existingJob,
      jobId,
      audioPath: existingJob.originalAudioPath || existingJob.audioPath,
    };

    const { videoUrl: processedUrl, steps: postSteps } = await postPipeline.runPost(finalUrl, postContext);
    finalUrl = processedUrl;

    const finalSteps = [
      ...(existingJob.steps || []),
      ...postSteps,
      { name: 'done', status: 'completed' },
    ];

    jobStore.set(jobId, {
      ...existingJob,
      status: 'done',
      resultUrl: finalUrl,
      createdAt: Date.now(),
      steps: finalSteps,
    });
    console.log('[Job]', jobId, 'completed with url', finalUrl);
  } catch (postErr) {
    console.error('[Poller] Post-processing failed:', postErr);
    jobStore.set(jobId, {
      ...existingJob,
      status: 'error',
      error: {
        stage: postErr?.stage || 'post',
        interceptor: postErr?.interceptor,
        message: postErr?.message || 'post_processing_failed',
      },
      createdAt: Date.now(),
    });
  }
}

// Poll the provider's status endpoint until completion/failure.
async function pollVideoStatus(jobId, requestId, attempt = 0) {
  const MAX_ATTEMPTS = 60; // ~5 minutes at 5s interval
  const DELAY_MS = 5000;

  try {
    const result = await provider.pollStatus('video', requestId);

    if (result.status === 'done' && result.resultUrl) {
      await finalizeJob(jobId, result.resultUrl);
      return;
    }

    if (result.status === 'error') {
      jobStore.set(jobId, { status: 'error', error: result.error || 'Provider reported failure', createdAt: Date.now() });
      console.error('[Status] job', jobId, 'failed:', result.error);
      return;
    }

    if (attempt + 1 >= MAX_ATTEMPTS) {
      jobStore.set(jobId, { status: 'error', error: 'Video still processing (timeout)', createdAt: Date.now() });
      console.warn('[Status] job', jobId, 'timed out');
      return;
    }

    // keep polling
    setTimeout(() => {
      pollVideoStatus(jobId, requestId, attempt + 1).catch(err => {
        console.error('[Status] poller error for job', jobId, err);
        jobStore.set(jobId, { status: 'error', error: err.message || 'poller failed', createdAt: Date.now() });
      });
    }, DELAY_MS);
  } catch (err) {
    console.error('[Status] unexpected error for job', jobId, err);
    jobStore.set(jobId, { status: 'error', error: err.message || 'poller failed', createdAt: Date.now() });
  }
}

// ============================================
// Video generation (proxies to the configured provider)
// ============================================
app.post('/generate', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'audio', maxCount: 1 }
]), async (req, res) => {
  const { prompt, shotName, trimStart, trimDuration, faceDescription, resolution: requestedResolution } = req.body;

  const imageFiles = req.files?.images || [];
  const audioFile = (req.files?.audio || [])[0];

  console.log('[Generate] prompt len:', (prompt || '').length, 'shot:', shotName);
  console.log('[Generate] trim:', trimStart, trimDuration, 'face:', faceDescription ? 'yes' : 'no');
  console.log('[Generate] images:', imageFiles.length, 'audio:', !!audioFile);

  const pipelineFlags = {
    enableAudioAnalysis: parseFlag(req.body.enableAudioAnalysis, true),
    enablePromptEnhancer: parseFlag(req.body.enablePromptEnhancer, true),
    enableAudioReplace: parseFlag(req.body.enableAudioReplace, true),
  };
  const pipelineInstance = toolchest.buildPipeline({
    ...pipelineFlags,
    enableWav2Lip: ENABLE_WAV2LIP,
    preInterceptors: [promptEnhancer, audioAnalyzer],
    postInterceptors: ENABLE_WAV2LIP ? [audioReplacer, audioLipSyncWav2Lip] : [audioReplacer],
  });

  const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);

  // If audio was uploaded, preserve it for later audio replacement (muxing) and trim to the selected 8s window
  let preservedAudioPath = null;
  let trimmedAudioPath = null;
  let audioDataUri = null;
  let audioDataBytes = 0;
  if (audioFile) {
    const ext = path.extname(audioFile.originalname) || '.mp3';
    preservedAudioPath = path.join(GENERATED_DIR, `${jobId}-original-audio${ext}`);
    fs.copyFileSync(audioFile.path, preservedAudioPath);

    const startSeconds = Math.max(0, parseFloat(trimStart) || 0);
    const durationSeconds = Math.max(1, Math.min(12, parseFloat(trimDuration) || 8));
    const candidateTrimPath = path.join(GENERATED_DIR, `${jobId}-trimmed-audio${ext}`);

    try {
      await new Promise((resolve, reject) => {
        const proc = spawn('/opt/homebrew/bin/ffmpeg', [
          '-y',
          '-ss', String(startSeconds),
          '-t', String(durationSeconds),
          '-i', preservedAudioPath,
          '-acodec', 'copy',
          candidateTrimPath,
        ]);
        proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
        proc.on('error', reject);
      });
      trimmedAudioPath = candidateTrimPath;
      console.log('[Audio] Trimmed user audio to', `${startSeconds}-${startSeconds + durationSeconds}s`, '→', candidateTrimPath);
    } catch (err) {
      console.warn('[Audio] Failed to trim audio, falling back to full clip:', err?.message || err);
    }

    // Prepare small audio reference (guarded to avoid payload bloat). Only used if the provider accepts audio.
    const audioPathForRef = trimmedAudioPath || preservedAudioPath;
    try {
      const buf = fs.readFileSync(audioPathForRef);
      audioDataBytes = buf.length;
      const MAX_AUDIO_BYTES = 1_200_000; // ~1.2 MB guardrail
      if (audioDataBytes <= MAX_AUDIO_BYTES) {
        const mime = audioFile.mimetype || 'audio/mpeg';
        audioDataUri = `data:${mime};base64,${buf.toString('base64')}`;
      } else {
        console.warn('[Audio] Skipping audio data URI (size too large):', (audioDataBytes / 1024).toFixed(0), 'KB');
      }
    } catch (e) {
      console.warn('[Audio] failed to read audio for data URI');
    }
  }

  const cleanup = () => {
    for (const f of imageFiles) { try { fs.unlinkSync(f.path); } catch {} }
    if (audioFile) { try { fs.unlinkSync(audioFile.path); } catch {} }
  };

  const sendRefs = ENABLE_REFS;

  try {
    // Convert images to (optionally compressed) data URIs
    const referenceImages = [];
    for (const f of imageFiles) {
      try {
        const buf = fs.readFileSync(f.path);
        const mime = f.mimetype || 'image/jpeg';

        let finalDataUri;
        if (sendRefs) {
          const originalSize = buf.length;
          finalDataUri = await compressImageForRef(buf, mime);
          const compressedSize = Math.round((finalDataUri.length * 3) / 4);
          console.log(`[Compress] ${f.originalname}: ${(originalSize / 1024).toFixed(0)} KB → ~${(compressedSize / 1024).toFixed(0)} KB`);
        } else {
          finalDataUri = `data:${mime};base64,${buf.toString('base64')}`;
        }

        referenceImages.push(finalDataUri);
      } catch (e) {
        console.warn('[Generate] failed to process image', f.originalname, e.message);
      }
    }

    console.log('[Generate] Prepared referenceImages count:', referenceImages.length);

    const duration = Math.max(4, Math.min(12, parseInt(trimDuration || '8', 10) || 8));

    const normalizeVideoGenerationPayload = (raw) => {
      // Map user-facing resolution to Kling's mode parameter:
      //   480p / 720p → std (720p output)
      //   1080p       → pro (1080p output)
      const resolutionToMode = { '480p': 'std', '720p': 'std', '1080p': 'pro' };
      let mode = resolutionToMode[raw.requestedResolution] || 'std';
      let resolution = ['480p', '720p', '1080p'].includes(raw.requestedResolution)
        ? raw.requestedResolution
        : '720p';

      // Kling's actual valid aspect ratios
      const allowedAspectRatios = ['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9'];
      let aspect_ratio = allowedAspectRatios.includes(raw.aspect_ratio)
        ? raw.aspect_ratio
        : '16:9';

      // Kling's actual valid durations depend on model. Avatar accepts any 2-300s
      // via audio length, but for standard video gen: [5, 10] for most models,
      // [3-15] for V3. Snap to nearest valid value for the common case.
      let finalDuration = raw.duration;
      const standardDurations = [5, 10];
      if (!standardDurations.includes(finalDuration)) {
        finalDuration = finalDuration <= 7 ? 5 : 10;
      }

      return { resolution, mode, aspect_ratio, duration: finalDuration };
    };

    const normalized = normalizeVideoGenerationPayload({
      requestedResolution,
      aspect_ratio: '16:9',
      duration,
    });

    let genPayload = {
      prompt: prompt || `Cinematic 8s music video performance in ${shotName || 'studio'}`,
      negative_prompt: 'text, watermark, logo, UI, blurry, low quality, artifacts, deformed, jitter, face mismatch',
      aspect_ratio: normalized.aspect_ratio,
      duration: normalized.duration,
      // Kling uses 'mode' (std/pro), not 'resolution'. Pass both so runAnimate can pick.
      mode: normalized.mode,
      resolution: normalized.resolution,
    };

    const generationContext = {
      jobId,
      originalPrompt: prompt,
      referenceImages: sendRefs ? referenceImages : [],
      audioPath: (trimmedAudioPath || preservedAudioPath) || undefined,
      shot: { id: shotName, name: shotName, description: '', promptHint: '' },
      faceDescription,
      trimWindow: { start: parseFloat(trimStart) || 0, duration: parseFloat(trimDuration) || 8 },
    };

    let preSteps = [];
    try {
      const preResult = await pipelineInstance.runPre(genPayload, generationContext);
      genPayload = preResult.request;
      preSteps = preResult.steps;
      console.log('[Toolchest] Pre steps completed:', preSteps.map(s => s.name).join(' → '));
    } catch (err) {
      cleanup();
      if (err instanceof toolchest.PipelineInterceptorError) {
        return res.status(400).json({
          error: 'pre_interceptor_failed',
          details: { stage: err.stage, interceptor: err.interceptor, message: err.message },
        });
      }
      console.error('[Toolchest] Pre-interceptor error:', err);
      return res.status(500).json({ error: 'pre_interceptor_failed', message: err?.message || 'Pre-processing failed' });
    }

    jobStore.set(jobId, {
      status: 'processing',
      createdAt: Date.now(),
      originalAudioPath: trimmedAudioPath || preservedAudioPath,
      steps: preSteps,
      pipelineFlags,
    });

    // Respond only after pre-processing succeeded
    res.json({ jobId, status: 'processing' });

    // Background: submit to the provider
    (async () => {
      try {
        if (sendRefs && referenceImages.length) {
          genPayload.reference_images = referenceImages.map(uri => ({ url: uri }));
        }
        if (sendRefs && faceDescription) genPayload.face_description = faceDescription;
        if (sendRefs && shotName) genPayload.shot_name = shotName;
        if (sendRefs && audioDataUri) genPayload.audio = audioDataUri;

        const payloadSize = Buffer.byteLength(JSON.stringify(genPayload), 'utf8');
        console.log('============================================================');
        console.log('[Provider] FINAL PAYLOAD SUMMARY BEFORE SENDING');
        console.log('  Refs enabled           :', sendRefs);
        console.log('  Model                  :', genPayload.model);
        console.log('  Reference images       :', genPayload.reference_images ? genPayload.reference_images.length : 0, '(auto-compressed)');
        console.log('  Audio included         :', !!audioDataUri, audioDataUri ? `(size ${(audioDataBytes / 1024).toFixed(0)} KB)` : '(not sent)');
        console.log('  Prompt length          :', (genPayload.prompt || '').length, 'chars');
        console.log('  Total payload size     :', (payloadSize / 1024).toFixed(0), 'KB');
        console.log('  Keys being sent        :', Object.keys(genPayload).join(', '));
        console.log('============================================================');

        let submission;
        try {
          // Pass everything runAnimate needs: the genPayload fields PLUS
          // the files (for audio) and trim info that the payload doesn't carry.
          submission = await provider.generateVideo({
            ...genPayload,
            kind: 'animate',
            files: [...imageFiles, ...(audioFile ? [audioFile] : [])],
            trimStart,
            trimDuration,
          });
        } catch (submitErr) {
          const notConfigured = submitErr instanceof provider.ProviderNotConfiguredError;
          const validationFailed = submitErr instanceof provider.KlingValidationError;
          console.error('[Provider] generateVideo failed:', submitErr.message);
          jobStore.set(jobId, {
            status: 'error',
            error: notConfigured
              ? 'No video provider configured. Set KLING_API_KEY, or MOCK_GENERATION=1 for placeholder output.'
              : validationFailed
              ? `Validation error: ${submitErr.message}`
              : `Provider error: ${submitErr.message}`,
            createdAt: Date.now(),
          });
          cleanup();
          return;
        }

        // Synchronous result
        if (submission?.resultUrl) {
          console.log('[Generate] job', jobId, 'returned a synchronous result');
          await finalizeJob(jobId, submission.resultUrl);
          cleanup();
          return;
        }

        // Asynchronous: poll provider status
        if (submission?.requestId) {
          const existingJob = jobStore.get(jobId) || {};
          jobStore.set(jobId, {
            ...existingJob,
            status: 'processing',
            providerRequestId: submission.requestId,
            createdAt: Date.now(),
            steps: existingJob.steps || preSteps,
          });
          console.log('[Generate] job', jobId, 'submitted to provider as request', submission.requestId);

          pollVideoStatus(jobId, submission.requestId).catch(err => {
            console.error('[Generate] background status poller failed for job', jobId, err);
          });
        } else {
          console.warn('[Provider] submitGeneration returned neither requestId nor resultUrl');
          jobStore.set(jobId, {
            status: 'error',
            error: 'Unexpected response from provider (no requestId or resultUrl)',
            createdAt: Date.now(),
          });
        }
      } catch (err) {
        console.error('[Provider] call failed:', err);
        jobStore.set(jobId, {
          status: 'error',
          error: err.message || 'Provider request failed',
          createdAt: Date.now(),
        });
      } finally {
        cleanup();
      }
    })();
  } catch (err) {
    cleanup();
    console.error('[Generate] failed to start generation:', err);
    return res.status(500).json({ error: 'generate_failed', message: err?.message || 'Failed to start generation' });
  }
});

// ============================================
// Job status polling
// ============================================
app.get('/jobs/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = jobStore.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'job_not_found' });
  }
  res.json({
    jobId,
    status: job.status,
    resultUrl: job.resultUrl || null,
    error: job.error || null,
    steps: job.steps || [],
    // Surfaced when try-on degraded gracefully (no Virtual Try-On pack on the Kling plan).
    tryOnSkipped: job.tryOnSkipped || false,
    note: job.note || null,
  });
});

// ============================================
// Pipeline endpoints (multi-stage: isolate → tryon → compose → animate)
//
// Generic job pattern: each POST returns { jobId } immediately, work runs in the
// background (mock or real provider), result is persisted to /generated, and the
// client polls GET /jobs/:id. In MOCK MODE (no keys, or MOCK_GENERATION=1) every
// stage resolves to a deterministic placeholder so the full flow completes.
// ============================================

function newJobId(kind) {
  return `${kind}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const IMAGE_KINDS = new Set(['isolate', 'tryon', 'compose']);

// Drive a generation seam to completion: handle sync result or poll async, then
// persist the output to /generated and finalize the job.
async function runStage(jobId, kind, request) {
  jobStore.set(jobId, { status: 'processing', kind, createdAt: Date.now() });
  try {
    const seam = IMAGE_KINDS.has(kind) ? provider.generateImage : provider.generateVideo;
    const submission = await seam({ ...request, kind });

    const finish = async (resultUrl, mock, extra = {}) => {
      const persisted = await provider.persistToGenerated(resultUrl, jobId);
      jobStore.set(jobId, { status: 'done', kind, resultUrl: persisted, mock: Boolean(mock), createdAt: Date.now(), ...extra });
      console.log('[Stage]', kind, jobId, 'done →', persisted, mock ? '(mock)' : '', extra.note ? `— ${extra.note}` : '');
    };

    if (submission?.resultUrl) {
      // try-on degraded gracefully (no Virtual Try-On resource pack on the account):
      // the subject's original outfit is used. Surface a note so the UI can inform the user.
      const extra = submission.tryOnSkipped
        ? { tryOnSkipped: true, note: 'Virtual try-on is unavailable on your current Kling plan — used the original outfit.' }
        : {};
      await finish(submission.resultUrl, submission.mock, extra);
      return;
    }
    if (!submission?.requestId) throw new Error('Provider returned neither requestId nor resultUrl');

    // Poll until done/error/timeout (~5 min @ 5s).
    const requestId = submission.requestId;
    const MAX_ATTEMPTS = 60;
    const DELAY_MS = 5000;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const status = await provider.pollStatus(kind, requestId);
      if (status.status === 'done' && status.resultUrl) return finish(status.resultUrl, false);
      if (status.status === 'error') {
        jobStore.set(jobId, { status: 'error', kind, error: status.error || 'provider failure', createdAt: Date.now() });
        return;
      }
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
    jobStore.set(jobId, { status: 'error', kind, error: 'timeout', createdAt: Date.now() });
  } catch (err) {
    console.error('[Stage]', kind, jobId, 'failed:', err.message);
    jobStore.set(jobId, { status: 'error', kind, error: err.message || 'stage failed', createdAt: Date.now() });
  }
}

function makeStageEndpoint(kind) {
  return (req, res) => {
    const jobId = newJobId(kind);
    res.json({ jobId, status: 'processing', kind });
    // Multipart (multer) → fields in req.body, uploads in req.files. We forward both;
    // mock mode ignores them, real provider wiring (fal.storage / Kling file_id) consumes
    // req.files. Without the multer middleware these would be dropped silently.
    const request = { ...(req.body || {}), files: req.files || [] };
    runStage(jobId, kind, request).catch(err => {
      console.error('[Stage] uncaught', kind, jobId, err);
      jobStore.set(jobId, { status: 'error', kind, error: err.message, createdAt: Date.now() });
    });
  };
}

// Stage endpoints accept multipart (images/audio + text fields) via multer.
app.post('/isolate', upload.any(), makeStageEndpoint('isolate'));   // Phase 1 — fal rembg
app.post('/tryon', upload.any(), makeStageEndpoint('tryon'));       // Phase 2 — kolors try-on
app.post('/compose', upload.any(), makeStageEndpoint('compose'));   // Phase 4 — images/generations
app.post('/animate', upload.any(), makeStageEndpoint('animate'));   // Phase 6 — Kling Avatar

app.get('/health', (req, res) => res.json({
  ok: true,
  backend: BACKEND_URL,
  providerConfigured: provider.isConfigured(),
  mockMode: provider.MOCK_GENERATION,
  providers: {
    kling: provider.isConfigured('kling'),
    fal: provider.isConfigured('fal'),
  },
}));

app.listen(PORT, () => {
  console.log(`make-gvids backend running on ${BACKEND_URL}`);
  const mockReason = provider.MOCK_GENERATION
    ? 'MOCK_GENERATION=1 (forced)'
    : (!provider.isConfigured('kling') || !provider.isConfigured('fal'))
      ? 'some provider keys missing — those stages return placeholders'
      : null;
  if (mockReason) console.log(`  🧪  Mock mode active: ${mockReason}`);
  console.log(`  Providers: kling=${provider.isConfigured('kling') ? 'configured' : 'MOCK'}, fal=${provider.isConfigured('fal') ? 'configured' : 'MOCK'}`);
  console.log('  Pipeline endpoints: POST /isolate /tryon /compose /animate → poll GET /jobs/:id');
  console.log('  Video resolution policy: only 480p / 720p / 1080p are accepted (other values normalize to 720p)');
  console.log(`  Image compression (refs): long edge ≤ ${MAX_REF_IMAGE_LONG_EDGE}px @ quality ${REF_IMAGE_JPEG_QUALITY} (tune with MAX_REF_IMAGE_LONG_EDGE / REF_IMAGE_JPEG_QUALITY)`);
});
