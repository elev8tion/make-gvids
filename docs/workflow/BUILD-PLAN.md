# Build Plan

How we turn the decided design (Phases 1–8) into working software. Ordered to
**de-risk early** and keep the app **clickable end-to-end** at every stage.

Status: 🟦 PLAN (not started). Build begins only on your go.

## Principles
1. **Skeleton first.** Build the wizard + all provider-independent UI before wiring any model — the app is navigable end-to-end with stubbed generation from day one.
2. **Wire one stage at a time, validate on real output**, then move on. Never wire two unproven model calls at once.
3. **Spike the riskiest unknown first** (Avatar on full-body framing) before investing in polish.
4. **Persist every Kling output immediately** — 30-day expiry means "generate ≠ keep."
5. Provider calls live behind seams in `server/` — the frontend never calls Kling/fal directly.

## Architecture at a glance
```
Frontend (React/Vite, evolve Studio.tsx)
  └─ 8-step wizard, per-phase state, output-spec toggles
        │ HTTP (multipart + JSON)
Backend (Express, server/)
  ├─ pipeline orchestrator (jobStore, multi-stage, toolchest pre/post)
  ├─ image seam  → generateImage()  ─┐
  ├─ video seam  → generateVideo()  ─┤→ provider clients:
  └─ provider clients ───────────────┘   • Kling client (auth, upload, submit, poll)
                                          • fal client (rembg)
```
- **Two seams** replace today's single video-shaped `server/provider.js`: `generateImage()` (Phases 1,2,4) and `generateVideo()` (Phase 6).
- **Kling client**: API-key + AK/SK-JWT auth, file upload (`file_id`), task submit + poll, both callback schemas, 1303 concurrency backoff, 30-day asset persistence. Endpoints: `images/generations`, `kolors-virtual-try-on`, `videos/avatar/image2video` (later: motion-control, multi-shot, effects).
- **fal client**: `fal-ai/imageutils/rembg` (Phase 1) via `@fal-ai/client`.

## Pipeline dependency graph
```
P1 isolate ─→ P2 dress ─→ P4 compose(A|B) ─→ P6 animate ─→ P7 display ─→ P8 download
                                               ↑
P5 audio (independent, client-side) ───────────┘
Output spec (aspect@P4, resolution@P6) threads through.
```

---

## Stage 0 — Foundations (scaffolding)
**Goal:** types + seams + wizard shell in place; nothing generates yet.
- Shared TS types: `Subject`, `OutfitSelection` (4 slots), `Scene`, `AudioSection`, `OutputFormat` (480p/720p · 9:16/16:9/both), `ComposeMode` (A|B), `PipelinePayload`, job/step status.
- Backend: split provider seam → `generateImage()` + `generateVideo()` stubs; Kling client skeleton (auth + upload + submit + poll, no endpoints yet); fal client skeleton. Env config (`KLING_*`, `FAL_KEY`). Extend `jobStore` for multi-stage steps.
- Frontend: 8-step wizard shell (state machine, nav, per-phase state), output-spec toggles.
**Done when:** wizard navigates all 8 steps with placeholder content; backend boots with both seams stubbed.

## Stage 1 — Provider-independent UI (clickable, stubbed generation)
**Goal:** the full experience works with mock outputs — zero model risk.
- **P2 outfit picker** — browse `public/assets/outfits/` (4 slots, blank = keep, optional one-click `fit{N}` set).
- **P3 scene browser** — thumbnails grid → select → resolve paired ref. Author the
  **scene-descriptions data file** (`gv-*` id → pre-written prompt text).
- **P5 audio engine** — upload mp3/wav → split into 10/15s sections → preview each (Web Audio) → select. *(Fully functional, no provider.)*
- **P7 result display** — iPhone mock (9:16) / normal (16:9) / switcher.
- **P8 download** — one or both orientations, naming convention.
**Done when:** a user can click through 1→8 end-to-end; generation steps return placeholder images/video.

## Risk spike (do early, parallel to Stage 1) — Avatar reality check
Run **Kling Avatar** once manually: a sample still + a 10s audio + a performance prompt, at our **full-body 9:16 framing**. Judge lip-sync + motion quality. This validates the single biggest unknown before we build the video pipeline. If weak → evaluate Path B / tighter framing.

## Stage 2 — Image pipeline (fal + Kling), wired one step at a time
**Goal:** produce a real composed still end-to-end.
1. **P1 isolate** — fal `rembg`: upload → cutout. *(First real call. Validate.)*
2. **P2 dress** — Kling `kolors-virtual-try-on-v1-5`: subject + garment; tops/bottoms via chained calls; shoes/hats passed through (provide-and-test). *(Validate; measure shoes/hats.)*
3. **P4 compose** — `generateImage()` with **Path A first** (Kling `images/generations`, `image_reference:subject` + scene-in-prompt, `human_fidelity`), then **Path B** (register subject as element, reference it). Add the **custom scene-prompt field** (defaults to the scene's pre-written text; user can override with a long custom prompt). *(Validate identity + the A/B toggle.)*
**Done when:** upload → cutout → dressed → composed still works for both compose modes.

## Stage 3 — Video pipeline (Kling Avatar)
**Goal:** the still becomes the performance video.
- **P6 animate** — `generateVideo()` → Kling Avatar (`videos/avatar/image2video`): composed still + chosen audio section + performance prompt. Output spec (aspect + std/pro resolution) applied.
- Hook the result into **P7 display** + **P8 download**; render both orientations when "both" is selected.
**Done when:** full run produces a downloadable, lip-synced performance clip in the chosen format(s).

## Stage 4 — Integration, robustness, polish
- **Prompt authoring**: codify the Avatar performance-prompt formula (camera + body + emotion) from the guides, fed scene/intent from earlier phases.
- **Operational hardening**: 1303 concurrency backoff; async via polling first (webhooks later); **persist all outputs to our storage** (30-day expiry); error/timeout UX.
- **Validate the experiments**: shoes/hats appearance, Path B consistency, full-body lip-sync fidelity.
- **Asset storage decision** (see open tech choices).

---

## Resolved tech choices ✅
1. **Asset storage → server folder.** Generated images/videos persist under the
   backend's `/generated` dir (already served). Because Kling purges at 30 days, we
   copy every output there immediately on completion.
2. **Async → polling first, webhooks later.** Build with simple status polling; add
   HMAC-verified webhooks as a later hardening step.
3. **Auth → API-Key by default.** Works for all the Kling models we picked
   (try-on, images/generations, Avatar). AK/SK-JWT only if a future 3.0 path needs it.
4. **Scene prompt → pre-written default + custom override.** Each `gv-*` scene
   carries a **pre-authored text description** (we write these once, stored in a
   scene-descriptions data file). At compose time the user can **also enter their own
   custom (long) text prompt** for the scene, which supplements/overrides the default.
   This feeds compose **Path A** (and is available for any `gv-*` scene).

## What's parallelizable (for an agent team)
- Stage 1 UIs (P2, P3, P5, P7, P8) are independent → parallel.
- Stage 0 backend seam/clients can proceed alongside Stage 1.
- Stages 2 and 3 are sequential (pipeline dependency) and should be done carefully, one wired step at a time.

## Suggested milestones
- **M1:** Stages 0–1 → clickable app, stubbed generation, Avatar spike done.
- **M2:** Stage 2 → real composed still (both compose modes).
- **M3:** Stage 3 → real downloadable performance video.
- **M4:** Stage 4 → hardened, validated, formats + persistence solid.
