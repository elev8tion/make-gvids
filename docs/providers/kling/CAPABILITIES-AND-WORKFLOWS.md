# Kling API — Capabilities & Creative Workflows

Synthesis from a 6-agent deep dive of `docs/providers/kling/source/` (the local Kling
KB). Every fact is doc-grounded; documentation gaps are flagged as "verify live."
Pricing in USD at **1 Unit = $0.14** (Virtual Try-On unit = $0.07).

Base domain: **`https://api-singapore.klingai.com`**

---

## 0. TL;DR — what Kling gives us

- **One model already does our hardest step.** Kling **Avatar** (`/v1/videos/avatar/image2video`) turns a still + our audio + a prompt into a performance video with body motion, emotion, and camera — in one pass. ($0.056/s @720p, $0.112/s @1080p.)
- **Deep cinematic control** the old plan didn't know about: programmatic **camera moves** (5 types × 6 axes), **multi-shot storyboards** (up to 6 cuts in one call), **motion brush** (paint what moves + trajectories), **element references** for character consistency, **end-frame morphs**, and **~181 effect templates**.
- **Big constraints to design around:** lip-sync/avatar take a **still** (not video); **no single tri-image compose** call (subject+outfit+scene); **video-extension is v1-only and drops audio**; results **expire in 30 days**; image jobs cost **`n` concurrency slots**; two auth schemes + two callback schemas.
- **Economics reward a draft→final split:** iterate on cheap v2-5-turbo ($0.042/s), finalize on v3/4K.

---

## 1. Platform foundations

### Auth (`01-get-started/01-authentication.md`)
- All requests: `Authorization: Bearer <token>` (space after "Bearer").
- **Two schemes:**
  - **API Key** — works for *all* models (created in console, shown once).
  - **AK/SK → JWT** — for *3.0 and earlier*: per-request JWT (HS256), payload `{iss: ak, exp: now+1800, nbf: now-5}`, signed with SK.
- ⚠️ **3.0-Turbo uses API-Key auth + a different endpoint** (`/image-to-video/kling-3.0-turbo`); legacy models use `/v1/videos/*`. Mixed pipelines may need both.

### File upload (`07-file-upload.md`)
- Inputs accepted as **external URL, Base64, or `file_id`** from the upload API.
- Endpoints under `/file-upload-api/`: `upload-file-base-64`, `upload-file-stream` (multipart, avoids base64 bloat), `upload-file-url` (Kling fetches it). All return `data.file_id` (reusable across keys, account-scoped).
- Limits: images JPG/PNG ≤10MB; audio MP3/WAV/M4A/AAC ≤5MB; files retained **30 days**.

### Async, callbacks, webhook security (`04-callbacks.md`, `06-webhook-security.md`)
- Tasks are async (video ~1–5 min). Provide `callback_url`; status `submitted→processing→succeeded/failed`.
- **Two payload schemas:** *new* (`id/status/outputs[]/billing[]`, 3.0-Turbo+) vs *legacy* (`task_id/task_status/task_result.{images,videos}[]`). Handle both if mixing families.
- **Verify webhooks:** HMAC-SHA256 over `timestamp + "." + raw_body`, header `X-Kie-Signature`; reject if `|now − X-Kie-Timestamp| > 300s` (replay window); compare on the raw body before parsing.

### Concurrency (`03-concurrency-rules.md`)
- Limit is per **account × model-version × package-type**, shared across keys. **No QPS limit.**
- Only task-creation consumes a slot (held submitted→done). Quota = highest single active package (5-pkg + 10-pkg ⇒ **10**, not 15).
- **Cost per task:** video & try-on = 1 slot; **image = `n` slots** (an `n=9` image call alone can saturate a 10-cap). Over-limit ⇒ code **1303** (HTTP 429) → exponential backoff (≥1s).

### Asset lifecycle (`08-asset-download.md`, `05-assets/01-account-usage.md`)
- **Results purge after 30 days, no recovery.** Re-mint time-limited URLs via `POST /common-api/download-url` `{file_ids, expiry?}` (default 1h). **Persist outputs to our own storage immediately.**
- Credits/usage: `GET /common-api/get-account-credits`, `/v1/account/{usage,balance,resources}`.

### "kling-skills" (`05-kling-skills.md`)
- An **official Kling agent skill** (supports Claude Code, Cursor, Codex…) that auto-routes intent to video/image/element endpoints. Installable via ClawHub; Node 18+. Useful as a reference implementation / possible accelerator.

---

## 2. Capability catalog (factual)

### 2.1 Video generation — T2V / I2V (`02-video/01,02,03,04` + stubs 05–14)
- **Two API generations:** new `contents/settings/options` (3.0-Turbo only) vs legacy flat `/v1/videos/{text2video,image2video}` (everything else); O1 has its own `/v1/videos/omni-video`. Models 2.5-turbo→1.0 are **stubs that inherit the 2.6 schema** (differ only by `model_name`).
- **Common params:** `prompt`/`negative_prompt` (≤2500), `image`/`image_tail` (start/end frame; URL/Base64, ≤10MB, ≥300px, ratio 1:2.5–2.5:1), `aspect_ratio` (`16:9/9:16/1:1`), `duration` (`"3"`–`"15"`, default 5), `mode` (`std`=720p / `pro`=1080p / `4k` on v3 image2video), `cfg_scale` [0,1] (**v1.x & v3 only, NOT v2.x**).
- **Camera control** (detailed in `02`): `type` ∈ {simple, down_back, forward_up, right_turn_forward, left_turn_forward}; `config` 6 axes each [−10,10] = horizontal, vertical, pan, tilt, roll, zoom.
- **Multi-shot storyboard:** `multi_shot:true` + `shot_type` + `multi_prompt[]` (**up to 6 shots**, each `{index, prompt, duration}`; durations must sum to total).
- **References inline:** `element_list` (saved elements, ≤3, `<<<element_N>>>`), `voice_list` (≤2 voices, `<<<voice_N>>>`), `sound:on/off` (native audio), `<<<image_N>>>`/`<<<video_N>>>`.
- **Masking:** `static_mask` + `dynamic_masks` (≤6, mask+trajectories) for localized motion.

**Feature availability (from guide `06-guides/01`):**
| Feature | Models |
|---------|--------|
| Text-to-Video | v3, v3-omni, o1, v2-6, v2-5T, v2-1, v1-6 (**not** 3.0-turbo) |
| Image-to-Video | all |
| Multi-shot / end-frame / element refs / 4K | **v3-tier only** |
| Motion + camera control | v3, v2-6, v2-5T, v2-1, v1-6 |
| Native audio + voice | **v3-omni, v2-6** |
| Video extension / multi-image input | **v1-6 only** |

### 2.2 Performance / motion / audio (`02-video/06,07,08,15,16,17`)
| Capability | Endpoint | In → Out | Key facts |
|-----------|----------|----------|-----------|
| **Avatar** ⭐ | `POST /v1/videos/avatar/image2video` | image + audio + prompt → performance video | `image` ≤10MB ≥300px; audio = `sound_file` (mp3/wav/m4a/aac ≤5MB, **2–300s**) **or** TTS `audio_id`; `prompt` ≤2500 drives actions/emotion/**camera**; std/pro |
| **Lip-Sync** | `POST /v1/videos/lip-sync` | **still** image + audio → talking head | image only (not video); `audio_id` xor `sound_file`; precision mouth |
| **Motion Control** | `POST /v1/videos/motion-control` | image + masks + camera → video | `static_mask`, `dynamic_masks` (≤6, mask+trajectories), `camera_control`; 3–15s; v2-6 default; **no audio** |
| **TTS / Audio gen** | `POST /v1/audio/generations`, `POST /v1/voices` | text → `audio_id` (+ custom voices) | feeds Avatar/Lip-Sync/`voice_list` |
| **Video Extension** | `POST /kling/v1/videos/video-extend` | prior `task_id` → full extended video | ⚠️ **v1-series only**, **drops audio**, quality drift; 3–15s/call; returns original+extension |
| **Image Recognition** | `POST /v1/images/recognition` | image → metadata/description | for pre-flight gating |

### 2.3 Image generation & editing (`03-image/*`)
- **Unified endpoint** `POST /v1/images/generations` for all image models (differ by `model_name`: v1, v1-5, v2, v2-new, v2-1, v3, image-o1).
- Params: `prompt` (≤2500), `negative_prompt` (**not in img2img**), `image` (one ref), `image_reference` mode (**`subject`** or **`face`**), `image_fidelity` [0,1] (**v1/v1-5 only**), `human_fidelity` [0,1] (**v1-5 only** — the identity-strength dial), `element_list` (**elements+images ≤10**), `resolution` (1k/2k, 4k on v3-omni), `n` (**1–9**), `aspect_ratio` (16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9).
- **Virtual Try-On** (separate): `POST /v1/images/kolors-virtual-try-on` — `human_image` + `cloth_image`; v1-5 supports **upper+lower** combos; **upper/lower/dress only (no shoes/hats)**.
- ⚠️ **No single tri-image typed compose** (subject+outfit+scene). Mechanism = one `image` + one `image_reference` mode + `element_list` (≤10). Garment swap is the *separate* try-on endpoint.

### 2.4 Effects & templates (`04-effects/*`, priced in `07-pricing/03`)
- **Two subsystems:** Effect Templates (`GET /v1/effects/templates`, `POST /v1/effects/apply`, applies to images or videos) and Video Effects (`POST /v1/videos/effects`, post-process on videos, callback support).
- **~181 templates**, priced **1.0U ($0.14) – 12.0U ($1.68)** per application (most are 1–3U). Examples: Magic Fireball 1U, Bullet Time 7U, Bicycle Kick 12U.
- ⚠️ **The named catalog is NOT in our docs** — enumerate live via `GET /v1/effects/templates` before building.

---

## 3. Economics (`07-pricing/*`)

**Video, per second:**
| Model | 720p | 1080p | 4K |
|-------|------|-------|----|
| 3.0-turbo (native audio) | $0.112 | $0.14 | — |
| v3 (no audio) | $0.084 | $0.112 | $0.42 |
| v3 (native audio) | $0.126 | $0.168 | $0.42 |
| v2-6 / v2-5-turbo | $0.042 | $0.07 | — |
| v2-1 | $0.056 | $0.098 | — |
| v1 | $0.028 | $0.098 | — |
| **Avatar** | $0.056 | $0.112 | — |

**Special:** Lip-Sync $0.07/5s · TTS/Custom-Voice/Face-Recog $0.007/call · Audio-gen $0.035/call · Image-Recog $0.014/call · Video-Extension $0.28 (720p)–$0.49 (1080p)/call.

**Image, per image:** v3/v3-omni/o1 1K–2K $0.028 (4K $0.056) · v2-1/v2 T2I $0.014 / I2I $0.028 / multi-image $0.056 · v1 $0.0035 (cheapest) · Try-On $0.07/image · AI Multi-Shot $0.07/call · Outpainting $0.028.

**Concrete clip costs:** 10s @1080p — Avatar **$1.12**, v2-6 **$0.70**, v3 no-audio **$1.12**; 15s @1080p v2-6 **$1.05**; 15s 4K v3 **$6.30**. → draft on v2-5-turbo, finalize premium.

**Cost levers:** draft cheap → final premium · batch with `n` (mind concurrency slots) · test at 3s render at 10s · match res to platform (720p Reels / 1080p Shorts / 4K cinema) · effects are flat-cost shortcuts vs bespoke generation.

---

## 4. Prompt-engineering playbook (`06-guides/02`)

**Principles:** be visual not poetic · always include camera direction (dolly, DoF, push-in) · describe *motion/what happens* · use specific negative prompts.

**Formulas:**
- **T2V:** `[Subject] + [Action] + [Environment] + [Camera] + [Lighting] + [Mood]`
- **I2V:** `[what subject does] + [what environment does] + [camera]` (frame given → say what happens next)
- **Avatar / Lip-Sync:** prompt = **expression + head/body movement only** (vocals are in the audio). e.g. "mouthing lyrics, brows lift on emphasis, head tilts on the downbeat, shoulders sway, natural eye contact."
- **T2I:** `[Subject] + [Composition] + [Style] + [Lighting] + [Color] + [Detail]`

**Tuning:** `cfg_scale` ≈0.5 expressive / ≈0.8 precise (v3/v1 only) · `human_fidelity`↑ tighter identity (v1-5) · prompt sweet spot **100–500 chars** (>1500 risks ignored tokens) · video defaults 16:9 → for 9:16 center subject, narrow FOV.

**Gotchas:** content moderation 1301 (avoid violence/weapon words even in negatives; prefer "dynamic movement"; element refs pass moderation better than named-person text) · native audio adds ~50% cost · for recurring identity prefer element refs over re-describing.

---

## 5. Creative workflow designs (cross-domain)

1. **One-Take Lead Vocal** — Avatar `image2video` with our `sound_file` + a performance prompt → singer with body motion + camera + lip-sync in one render. *(Our Phase 6 default.)*
2. **Storyboard Symphony** — v3/3.0-turbo `multi_shot` with 6 `multi_prompt` cuts whose durations map to bars → a whole 15s, 6-shot sequence in one call.
3. **Living Album Cover (intro)** — Motion Control: `static_mask` the face, `dynamic_masks` + trajectories for hair/smoke/particles, slow `camera_control` push → cinematic instrumental opener before vocals.
4. **Beat-Drop Morph** — end-frame transition (`image` + `image_tail`) on a v3 model, prompt the morph (day→neon-night) → the "transformation" beat-drop, native 9:16.
5. **Recurring-Character Universe** — register the artist as an `element`, reference `<<<element_1>>>` across every shot/scene for identity consistency; pairs with multi-shot.
6. **Effects Hooks & Transitions** — `/v1/effects/apply` + `/v1/videos/effects` for templated viral moments (dual-subject, bullet-time) and verse/chorus transitions — flat-cost vs bespoke.
7. **Silent B-Roll Extension** — v1-6 `video-extend` chained for >15s *silent* passages (drops audio), music laid over in the edit. *(Maps to the roadmap "extend" feature.)*
8. **Cost-Tiered Pipeline** — storyboard on cheap images (v1 $0.0035), draft motion on v2-5-turbo ($0.042/s), final hero shot on v3 4K — deliberate quality/cost split.
9. **Recognition-Gated Casting** — `images/recognition` pre-flights candidate stills (face present? aspect valid?) before spending render units, auto-routing to Avatar vs Lip-Sync.

---

## 6. Mapping to our 8-phase workflow

| Phase | Kling implication |
|-------|-------------------|
| 1 — Isolation | External (fal `rembg`). Optional: Kling `images/recognition` to validate the cutout meets Avatar's image spec (≥300px, ratio 1:2.5–2.5:1). |
| 2 — Outfit | `kolors-virtual-try-on-v1-5`: tops/bottoms/dress only — **shoes/hats unsupported** (handle via prompt/elements or drop in v1). Top+bottom via chained calls or merged white-bg. |
| 4 — Compose | **No tri-image typed call.** Best path: `images/generations` with `image_reference:subject` + scene/lighting/outfit-in-prompt; `human_fidelity` for identity; optionally `element_list` props. Or chain (try-on → place). Consider **registering the subject as an element** for cross-shot consistency. |
| 5 — Audio | Our chosen section feeds Avatar `sound_file` — ⚠️ **≤5MB and ≤300s** (our 10/15s is fine; watch file size/format). |
| 6 — Animate | **Avatar** (default, $0.056–0.112/s). Alternatives: `multi_shot` v3 for cut sequences; Motion-Control for surgical motion; both support 9:16 + std/pro. |
| Output spec | Aspect 9:16/16:9 native; resolution → `std`=720p / `pro`=1080p (4K on v3). |
| Roadmap (extend) | `video-extend` is **v1-only + audio-drop** → use **per-segment Avatar + stitch** for audio-driven extension, reserve `video-extend` for silent B-roll. |

---

## 7. Constraints & gotchas (consolidated)
- Lip-sync & Avatar take a **still**, never a video → lip-sync is **joint or terminal**.
- **No single tri-image compose**; garment swap is a separate endpoint; image refs cap at elements+images ≤10.
- **Video-extension: v1-only, drops audio, quality drift.**
- **30-day expiry** on all assets/inputs → persist immediately.
- **Image jobs cost `n` concurrency slots**; over-limit = code 1303 → backoff.
- **Two auth schemes** (API-Key vs AK/SK-JWT) and **two callback schemas** (new vs legacy).
- `cfg_scale` v3/v1 only; moderation 1301; prompt 100–500 char sweet spot.
- **Effects catalog is runtime-only** (not in docs).

## 8. Verify against the live API (doc gaps)
- The named effects catalog + per-effect params (`GET /v1/effects/templates`).
- Whether **chaining** try-on (top → bottom) preserves quality, vs merged white-bg.
- Exact Avatar audio-length → output-duration mapping.
- Element Management API specifics (how to register/reuse elements/voices).
- Lip-sync duration/model/file-size limits (absent from its doc).
- Multi-image-input (`kling-v1-6`) request schema details.

---

*Sources: all under `docs/providers/kling/source/`. Captures of specific endpoints live in
`docs/providers/kling/captures/`.*
