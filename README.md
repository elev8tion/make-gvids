# make-gvids

Drop a few selfies → pick a cinematic "Shot" scene → get a stunning, lip-synced
music video performance in ~90 seconds.

The app is **provider-agnostic**: the video-generation API is wired into a single
seam (`server/provider.js`), so you can plug in whichever generation service you
choose (Replicate, Fal, Runway, Luma, Pika, Kling, …) without touching the rest of
the stack.

## Features

- **Full interactive creation wizard**:
  - 3–5 selfie upload (drag & drop + preview grid)
  - Short audio clip upload with in-browser smart 8s window selection
  - 11+ premium curated Shots (On The Radar, Analog Reverie, Blue Cube Studio, Neon Rooftop, …)
  - Review + one-click Generate
- **Toolchest pipeline** — provider-neutral pre/post interceptors (prompt enhancement,
  audio analysis, ffmpeg audio muxing, optional Wav2Lip lip-sync) that wrap the generation call
- **Quality toggle** — choose 480p (faster/cheaper) or 720p (recommended) per generation
- **Live progress stages** during generation
- **Fully responsive**, cinematic dark + neon design language

## Quick Start

```bash
# Terminal 1 — backend
cd server
cp .env.example .env      # then set VIDEO_API_KEY once you've wired a provider
npm install
npm start

# Terminal 2 — frontend
cd ..
npm install
npm run dev
```

Or run both at once from the repo root with `npm run up` (uses `concurrently`).

Open http://localhost:5175.

> Until a provider is wired up, the UI runs end-to-end but `/generate` returns a
> clear "no provider configured" error. See **Wiring a provider** below.

## Wiring a provider

All provider-specific code lives in **`server/provider.js`**. Implement two functions:

```js
// Submit a job. Return { requestId } for async polling, or { resultUrl } if synchronous.
export async function submitGeneration(request) { ... }

// Poll a job. Return { status: 'processing' | 'done' | 'error', resultUrl?, error? }.
export async function pollStatus(requestId) { ... }
```

Then set the credentials in `server/.env`:

```
VIDEO_API_KEY=your_key_here
VIDEO_API_BASE=https://...        # optional, provider-specific
VIDEO_MODEL=...                   # optional, provider-specific
```

The backend hands `submitGeneration()` a **provider-neutral request**:

```json
{
  "model": "...",
  "prompt": "Cinematic 8-second ... (rich prompt built in Studio — face + shot + lip-sync instructions)",
  "negative_prompt": "...",
  "aspect_ratio": "16:9",
  "duration": 8,
  "resolution": "720p"
}
```

Notes:
- The frontend `buildPrompt()` already embeds the face description + shot details +
  explicit "lip-sync to the exact 8s vocal window" instructions, so generations are
  strongly personalized from the prompt alone.
- **Reference images** are sent only when `ENABLE_REFS=1` (some providers don't accept
  them, and large base64 payloads can trigger TLS errors). When enabled, images are
  auto-resized (long edge ≤ 1280px) + JPEG-compressed (quality ~88). Tune with
  `MAX_REF_IMAGE_LONG_EDGE` / `REF_IMAGE_JPEG_QUALITY`.
- The server prints a **FINAL PAYLOAD SUMMARY** block before each call so you can see
  exactly what was sent (keys, model, payload size, ref count).

## Backend endpoints

- `POST /generate` — multipart (images[] up to 5, optional audio, prompt, trim*, shotName,
  faceDescription, resolution). Runs the pre-pipeline, submits to the provider, returns `{ jobId }`.
- `GET /jobs/:jobId` — poll for `{ status, resultUrl?, error?, steps }`.
- `GET /health` — liveness + `providerConfigured` flag.

The frontend submits to `/generate` and polls `/jobs/:id` until `status === 'done'`
(with `resultUrl`) or `error`, then plays the result inline with a download button.

## Architecture Notes

- Vite + React + TypeScript + Tailwind + Framer Motion frontend
- Express backend (`server/`) — request shaping, toolchest pipeline, ffmpeg audio trim,
  image compression, in-memory job store
- `toolchest/` — provider-agnostic pre/post interceptor pipeline (see `toolchest/README.md`)
- Audio trimming + smart 8s selection runs fully in-browser
- The Shots are curated for music-video aesthetics (studio, neon, urban, cinematic, raw)

## Adding More Shots / Videos

1. Drop new thumbnails in `public/assets/shots/` and clips in `public/assets/videos/`
2. Add entries to the `SHOTS` array in `src/App.tsx`

## Future Enhancements

- Real audio waveform visualizer (WaveSurfer.js)
- Drag-to-reorder reference photos
- Prompt refinement textarea before generation
- "Regenerate variation" button
- Export options (vertical 9:16 for TikTok/Reels)
- User gallery of past generations
