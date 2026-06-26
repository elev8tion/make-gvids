# Output Spec (cross-cutting)

User-selectable output format for the produced video. This is **cross-cutting** —
it touches the composed image (Phase 4) and the performance video (Phase 6), so
it's documented once here and referenced from those phases.

## Selectable options
- **Resolution:** `480p` or `720p`
- **Aspect ratio:** `9:16` (vertical) **or** `16:9` (horizontal) **or both**
  (produce both orientations).

## Where each is selected ("the appropriate phase")
| Setting | Selected at | Why there |
|---------|-------------|-----------|
| **Aspect ratio** | **Phase 4 (composed image) — or earlier in visual setup** | It sets the composition **canvas**; the still's framing must match the final video aspect, so it can't wait until render. |
| **Resolution** | **Phase 6 (animate / render)** | Pure render setting; doesn't change composition. |

UX suggestion: surface the **aspect ratio** toggle during scene/compose (Phase 3–4)
and the **resolution** toggle at the render step (Phase 6). The chosen values
propagate through every generation call downstream.

## ⚠️ Constraint — 16:9 vs our 9:16 scene assets
Our scene library (`public/assets/scenes/`) is **9:16 vertical only** (thumbnails +
refs). Producing **16:9** therefore needs a strategy — open decision:
1. **Generate / source 16:9 scene assets** (parallel set), or
2. **Outpaint** the 9:16 scene to 16:9 at compose time (generative widen), or
3. **Reframe/crop** within generation (risky — loses the vertical composition), or
4. **Restrict 16:9** until 16:9 scenes exist (ship 9:16 first).

9:16 is the **native, lowest-risk path** today. Decide the 16:9 approach before
enabling that option.

## "Both" = two renders
Selecting both orientations means producing **two outputs** (a 9:16 and a 16:9),
each potentially needing its own composed frame (different canvas) → roughly 2× the
generation cost/time. Confirm whether "both" is a real requirement or a later add.

## Propagation
- **Phase 4** composes the still at the chosen **aspect ratio**.
- **Phase 6** renders the video at the chosen **aspect ratio + resolution**
  (e.g. Kling Avatar / i2v `aspect_ratio` + resolution params; values normalized to
  the allowed set).
- If **both** orientations are selected, Phases 4 + 6 run once per orientation.

## Open questions
1. Confirm allowed set is exactly {480p, 720p} × {9:16, 16:9}. (Earlier server code
   also accepted 1080p — drop it unless wanted.)
2. Pick the **16:9 strategy** (above) before exposing the 16:9 option.
3. Is **"both"** needed at launch, or 9:16-first?
