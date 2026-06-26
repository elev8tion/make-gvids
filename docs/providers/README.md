# Provider Reference

Local knowledge bases for the three generation providers we're choosing between.
Each folder is a [docgraph](https://) extraction: human-readable docs live under
`<provider>/source/`, and `<provider>/GRAPH_REPORT.md` + `graph.json` are the
queryable graph (regenerable artifacts).

> Status: **reference only.** Nothing here is wired into the app yet. The app's
> provider seam is `server/provider.js`. When we lock a provider for a workflow
> phase, we implement `submitGeneration()` / `pollStatus()` there using these docs.

## The three providers at a glance

| Provider | What it is | Auth | Base URL | Async model |
|----------|-----------|------|----------|-------------|
| **Kling** (`kling/`) | Kling's **direct API** — first-party access to Kling video/image models | API Key (+ JWT) | `https://api-singapore.klingai.com` | Task + poll / callbacks |
| **fal** (`fal/`) | **Platform/SDK** that hosts *many* third-party models behind one queue API (Kling, Veo, Wan, Flux, …) | API Key | `https://queue.fal.run` (via SDK) | Queue + webhooks/streaming |
| **Eachlabs** (`eachlabs/`) | **Aggregator** — one `prediction` endpoint over a model catalog (Veo, Kling, Sora, Wan, Flux, ElevenLabs, …) + a workflow engine | API Key | `https://api.eachlabs.ai` | `POST /v1/prediction` + poll/webhook |

**They're complementary, not interchangeable.** Kling gives the deepest control
over Kling models (incl. purpose-built lip-sync); fal and Eachlabs are unified
gateways that let us reach Veo / Sora / Wan / Flux / Kling without integrating each
vendor separately.

## Capability map → our music-video workflow

| Workflow need | Kling | fal | Eachlabs |
|---------------|-------|-----|----------|
| Selfie → consistent character **image** | image-omni, virtual-try-on | hosts Flux/Nano-Banana/Seedream | `flux-kontext-pro`, `nano-banana-pro`, `seedream-v4-5`, `gemini-imagen-4` |
| **Image → video** (animate the character) | 2.1 I2V, 2.6, 3.0 | hosts Kling/Wan I2V | `kling-2-1-image-to-video`, `wan-v2-6-image-to-video` |
| Text → video (cinematic) | 3.0 turbo/omni, o1 | hosts Veo/Sora | `veo-3`, `sora-2-pro`, `kling-3-0`, `pixverse-v4-1` |
| **Lip-sync to audio** | ✅ **purpose-built** `POST /v1/videos/lip-sync` (image + audio → talking head) | model-dependent | model-dependent |
| TTS / music | audio-generation + TTS | model-dependent | `elevenlabs-tts`, `mureka`, `stable-audio-2-5` |
| Effects / try-on | effects catalog, virtual-try-on | — | — |

**Standout for our use case:** Kling's first-party **lip-sync** endpoint takes an
image + audio file directly — exactly the "performer photo + 8s vocal clip → talking
performance" shape we want, no prompt-only workaround.

## Where to look (per provider)

### Kling — `kling/source/`
> 📘 **Start with [`kling/CAPABILITIES-AND-WORKFLOWS.md`](kling/CAPABILITIES-AND-WORKFLOWS.md)** —
> a synthesized capability map + creative workflow designs + pricing + prompt
> playbook (from a 6-agent deep dive). Raw endpoint captures in `kling/captures/`.

- `01-get-started/` — auth, error-codes, concurrency, **callbacks**, webhook-security, **file-upload**, asset-download
- `02-video/` — model docs (`01-kling-3-0-turbo` … `14-kling-1-0`), **`15-lip-sync.md`**, `07-avatar`, `06-motion-control`, `17-video-extension`, `08-audio-generation`
- `03-image/` — image models + `09-virtual-try-on.md`
- `04-effects/`, `06-guides/` (model-selection, prompt-engineering), `07-pricing/` (unit system)

### fal — `fal/source/`
- `documentation/model-apis/inference/` — **queue.md**, **webhooks.md**, streaming, sync, real-time, reliability, client-setup
- `documentation/model-apis/` — common-parameters, model-arguments, pricing, concurrency-limits, media-expiration, fal-cdn
- `api-reference/client-libraries/{javascript,python}/` — SDK clients (queue, storage, realtime)
- `api-reference/platform-apis/` — for-models, for-storage, for-keys, openapi-schema
- ⚠️ Specific per-model input schemas are **not** in this set — they live on `fal.ai/models/<id>`. This KB is the platform/SDK layer.

### Eachlabs — `eachlabs/source/`
- `api/predictions/` — **create-prediction.md** (`POST /v1/prediction` `{model, version, input, webhook_url}`), get-prediction
- `api/models/` — list-models, get-model · `api/webhooks/` — payload-reference
- `models/{video-generation,image-generation,audio-music}/` — per-model input docs + a **comparison table** in each `*.md` overview
- `workflows/`, `sense/` (agentic), `llm-router/`, `storage/`

## How to query deeply (when the time is right)

1. **Skim** `<provider>/GRAPH_REPORT.md` for the doc map and key nodes.
2. **Read** the specific file under `<provider>/source/...` (paths above).
3. For structured questions across a whole set, use the **docgraph** skill against
   `<provider>/` (e.g. "ask the kling KB how lip-sync audio input works").

## Open decision — endpoint per phase

We have not committed a provider per workflow phase yet. The natural split to weigh:
- **Kling direct** when we want max control + native lip-sync.
- **fal or Eachlabs** when we want one integration that reaches Veo/Sora/Wan/Flux.

We'll decide this phase by phase as we design the workflow.
