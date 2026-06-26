# Phase 4 — Generate the Composed Image

**Status:** 🟦 DESIGN (documented, not built)
**First generation step** — this is the first phase that calls a provider model.

## Goal
Generate a single **composed still**: the styled subject placed into the selected
scene, matching the composition reference (position, scale, pose, framing,
lighting). This image is the visual foundation the video phase will animate.

## Output format
The composed still is rendered at the user-selected **aspect ratio** (`9:16` or
`16:9` — chosen here / in visual setup), since the still is the video's first frame
and must match the final canvas. Resolution is applied later at render (Phase 6).
See [output-spec.md](output-spec.md). ⚠️ Scene assets are 9:16 only — 16:9 needs a
strategy (see that spec).

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
## ✅ Decision — TWO selectable compose modes (user picks A or B)
Kling has **no single tri-image (subject+outfit+scene) call**, so we offer the user
a **choice of path** at the compose step. Both produce the composed still; the user
picks per-project.

### Path A — "Quick" / prompt-composited (default)
- One `POST /v1/images/generations` call (Kling image model, e.g. `kling-v1-5`/`v3`).
- `image` = the styled subject (Phase 1+2), `image_reference: "subject"`,
  `human_fidelity` tuned for identity strength; **scene + lighting + placement
  authored in the `prompt`**.
- **Scene prompt = pre-written default + optional custom override.** Each `gv-*`
  scene ships a **pre-authored description** (a scene-descriptions data file). At
  compose time the user can **enter their own custom (long) text prompt** that
  supplements/overrides the default for that scene. The final prompt = (custom or
  default scene text) + performer/outfit/lighting framing.
- Fewest steps, cheapest, fastest. Scene comes from text, not the exact ref pixels.

### Path B — "Precise" / reference-composited
- Register the subject as a reusable **element** (Element Management API), reference
  it as `<<<element_1>>>`; lean on the scene plate/composition ref for truer match
  and cross-shot **identity consistency**.
- More calls / setup; higher control + consistency. Best when Path A drifts or for
  multi-shot continuity.

**Default = A; B available as an opt-in toggle.** The UI exposes a "Composition
mode: Quick (A) / Precise (B)" choice; the backend adapter implements both call
patterns behind one image-generation seam.

## Open questions (resolve before building)
1. **Shoes/hats** (from Phase 2) — apply here via prompt/elements, or excluded in v1.
2. **Staging props** (ties to Phase 3 Q2). Keep scene staging from the ref
   (e.g. `gv-001`'s burning couch), or just the subject in the plain scene?
3. **Identity + outfit drift.** Define a check that face (Phase 1) + garments
   (Phase 2) survive the composite. (`human_fidelity` is the Path A dial.)
4. **Output count.** One image, or N candidates to choose/regenerate?
5. **Architecture.** `server/provider.js` is video-shaped today; this phase needs an
   **image-generation** call → add a `generateImage()` seam (both A and B route
   through it). Verify the **Element Management API** for Path B (doc gap).

## Acceptance criteria (draft)
- User can choose compose mode **A (quick) or B (precise)**.
- Both produce one composed 9:16 image with performer identity + selected outfit preserved.
- Output is stored and ready as the first frame for the video phase.

## Downstream
The composed still feeds the video-generation phase (image-to-video), and later
lip-sync to the performance audio (to be defined).
