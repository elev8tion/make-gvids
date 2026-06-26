# Phase 6 — Animate: Motion, Camera & Lip-Sync (Performance Video)

**Status:** 🟦 DESIGN (documented, not built)
**Generation step.** Turns the composed still + chosen audio into the performance video.

## Goal
Animate the composed still (Phase 4) into a video where the **performer moves**
(body/performance motion), there is optional **camera motion**, and the **lips sync**
to the chosen audio clip (Phase 5, 10s or 15s).

## Inputs
- Composed still (Phase 4) — performer in scene, dressed, identity locked.
- Chosen audio section (Phase 5) — 10s or 15s, mp3/wav.
- A motion/camera **prompt** (body actions + camera direction).

## The ordering constraint (why this matters)
Lip-sync is a **mouth-region edit conditioned on audio**. Anything that re-renders
frames *after* lip-sync (more motion, restyle, upscale) destroys the sync.
Therefore lip-sync must be **joint with motion** or the **terminal pass** —
**never before motion**. (Confirmed: Kling's standalone lip-sync accepts a *still
image* only, not a video, so "animate then Kling-lipsync" is impossible.)

This leaves two viable paths.

## Path A — Integrated single-pass ✅ RECOMMENDED
One model ingests image + audio → motion + camera + lip-sync **together**.

- **Model:** Kling **Avatar** — `POST /v1/videos/avatar/image2video`
  (`../providers/kling/source/02-video/07-avatar.md`)
- **Inputs:** `image` (≤10MB, ≥300px), `sound_file` **our audio directly**
  (mp3/wav/m4a/aac, ≤5MB, **2–300s**) or `audio_id`; `prompt` (body actions +
  **camera movements**, ≤2500 chars); `mode` std/pro.
- **Output:** one video — body motion + camera + lip-sync to our audio. Covers 10/15s.
- **Why preferred:** no chaining, no post-hoc sync degradation, audio-native,
  duration fits, and integrated models handle non-ideal framing better than
  post-hoc lip-sync (see risk below).

## Path B — Chain (fallback for heavier cinematic camera)
Use when Avatar's body/camera dynamism is insufficient for a shot.

```
image → image-to-video (body + camera motion, prompt-driven, NO audio)
      → terminal VIDEO-input lip-sync (applies our audio to the moving video)
```
- **i2v stage:** Kling i2v (3.0 omni has explicit `camera_control`) / Wan i2v / Veo.
  Motion + camera only; no audio sync here.
- **Lip-sync stage (terminal):** a **video-input** lip-sync model (sync.so /
  latentsync / wav2lip) run on **fal** (execution layer): upload video + audio to
  fal CDN → `POST https://queue.fal.run/{model_id}` → poll/webhook
  (`../providers/fal/source/documentation/model-apis/inference/queue.md`).
  *(Kling lip-sync can't be used here — it's still-image only.)*
- **Order is fixed:** motion first, lip-sync last.

## Provider verdict for this phase
| Provider | Fit |
|----------|-----|
| **Kling** | ✅ Best — Avatar = single-pass image+audio→performance+camera+lipsync (Path A) |
| **fal** | ✅ Execution layer for Path B (hosts video-lipsync + i2v models; schemas live on fal.ai/models, not in our KB) |
| **Eachlabs** | ❌ No lip-sync/avatar models; video caps ~5s (15s Veo). Not used here. |

## Risk to plan around — framing vs lip-sync fidelity
Our scenes are **full-body, wide** compositions (`scenes/refs/gv-001` is a full
figure mid-field). Lip-sync is strongest on **head-and-shoulders**; at full-body
scale the mouth is small and sync fidelity drops. Mitigations to evaluate:
- Prefer Path A (integrated handles non-ideal framing better than post-hoc).
- Consider shot framings / scene picks where the performer is larger during sung lines.
- Accept looser sync at full-body as a known tradeoff, or add a tighter-framed cut.

## Open questions (resolve before building)
1. **Avatar motion/camera range** — does Kling Avatar give enough body + camera
   dynamism for a music-video feel, or do some shots need Path B? (Test.)
2. **Duration** — confirm 10/15s maps cleanly to Avatar output length.
3. **Cost/latency** — std vs pro mode; per-clip cost (`../providers/kling/source/07-pricing/`).
4. **Prompt authoring** — how we turn scene + performance intent into the Avatar
   prompt (camera + actions), reusing Phase-4 scene context.
5. **Fallback trigger** — define when a shot escalates from Path A to Path B.

## Model selection — OPEN (pending user web research)
The recommendation above (Path A / Kling Avatar) stands as the **current default**,
derived from our **local doc KBs only** (`../providers/`), which are a *subset* of
each provider's live catalog. The user is separately researching all three
providers' **websites** for additional models/capabilities that may fit (e.g.
OmniHuman / Hedra / sync.so / other audio-driven performance or i2v models not in
our KB). Final model choice for this phase is **not locked** — record website
findings here as they come in and revisit the Path A/B decision.

| Candidate (from web) | Provider | Capability | Notes / verdict |
|----------------------|----------|------------|-----------------|
| _Kling Avatar_ (current default) | Kling | image+audio → motion+camera+lipsync | from KB; single-pass |
| _(to be added from user research)_ | | | |

## Recommended approach
1. **Build Path A first** (Kling Avatar) — it's the single model that already does
   motion + camera + lip-sync from image + our audio, with the least risk.
2. **Keep Path B documented** as the escalation for shots needing stronger
   cinematic camera, executed via fal with lip-sync as the terminal pass.
3. Validate against our **full-body framing** early, since that's the main fidelity risk.

## Acceptance criteria (draft)
- Given composed still + chosen audio + prompt, produce one 10/15s video.
- Performer moves; camera moves per prompt; lips track the audio.
- Identity/outfit/scene from earlier phases preserved.

## Downstream
The performance video is the (near-)final deliverable; remaining phases (final
audio mux/cleanup, export, delivery) to be defined.
