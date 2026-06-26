# Phase 4 — Generate the Composed Image

**Status:** 🟦 DESIGN (documented, not built)
**First generation step** — this is the first phase that calls a provider model.

## Goal
Generate a single **composed still**: the styled subject placed into the selected
scene, matching the composition reference (position, scale, pose, framing,
lighting). This image is the visual foundation the video phase will animate.

## Inputs (from earlier phases)
- **Styled subject** (Phase 2) — the performer, dressed, identity to be preserved.
- **Scene clean plate** (Phase 3, `thumbnails/<id>.png`) — the background.
- **Composition ref** (Phase 3, `refs/<id>.png`) — the placement/pose/scale/
  lighting/staging target (the stand-in person to be replaced by our subject).

## Output
- One **composed image**: our performer, in the selected outfit, placed into the
  scene per the composition ref — identity and clothing preserved, lighting
  harmonized. 9:16 vertical.
- This still becomes the **seed / first frame** for the video phase.

## Role of each input in the generation
| Input | Provides |
|-------|----------|
| Styled subject | Face/identity + outfit (must be preserved) |
| Clean plate | Background / environment |
| Composition ref | Where the subject stands — position, scale, pose, framing, light |

## Open questions (resolve before building)
1. **Single pass vs. chained?** One call (subject + plate + ref → composed) or a
   chain (place subject → harmonize lighting/color → finalize)?
2. **Model / provider.** This needs **multi-reference image composition with
   identity preservation**. Candidates per `../providers/README.md`:
   - Kling **image-omni** (multi-reference) — direct API.
   - fal / Eachlabs hosted: **Nano-Banana Pro** (Gemini multi-image edit),
     **Flux Kontext**, **Seedream v4.5**.
   Pick based on how many reference images it accepts and identity fidelity.
3. **Reference-image count limits.** Confirm the chosen model accepts the inputs we
   need (subject [+ multi-angle?] + plate + composition ref) in one request.
4. **Staging props** (ties to Phase 3 Q2). Does the composed image keep scene
   staging from the ref (e.g. `gv-001`'s burning couch), or just the subject in
   the plain scene?
5. **Identity + outfit drift.** Define a check that the face (Phase 1) and garments
   (Phase 2) survive the composite without drift.
6. **Output count.** One image, or N candidates for the user to choose/regenerate?
7. **Architecture impact.** Today `server/provider.js` is **video-shaped**
   (`submitGeneration`/`pollStatus` for a video request). This phase needs an
   **image-generation** call. Decide whether to: (a) generalize the seam to a
   `generateImage()` alongside `generateVideo()`, or (b) add a separate image
   provider module. Flag for when we wire it.

## Acceptance criteria (draft)
- Given subject + scene plate + composition ref, produce one composed 9:16 image.
- Performer identity and selected outfit are preserved.
- The subject's placement/scale/pose matches the composition ref.
- Output is stored and ready as the first frame for the video phase.

## Downstream
The composed still feeds the video-generation phase (image-to-video), and later
lip-sync to the performance audio (to be defined).
