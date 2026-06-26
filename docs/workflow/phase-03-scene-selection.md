# Phase 3 — Scene / Background Selection

**Status:** 🟦 DESIGN (documented, not built)

## Goal
Let the user pick a **shot/scene** by browsing scene thumbnails. The selected
scene's paired **reference image** defines **where and how the subject should
appear** in that scene (placement, scale, pose, framing, lighting).

## Input
- The styled subject from **Phase 2**.
- User's scene selection (one scene).

## Scene library — `public/assets/scenes/`
201 PNGs across two paired sets:

| Set | Dir | Count | Role |
|-----|-----|-------|------|
| Thumbnails | `thumbnails/` | 101 | Clean **empty background plate** — what the user browses/selects |
| Refs | `refs/` | 100 | **Composition reference** — same scene with a stand-in person placed in it |

- **Paired by filename stem:** `thumbnails/gv-001.png` ↔ `refs/gv-001.png`
  (naming `gv-001` … `gv-NNN`).
- **One orphan:** thumbnail `stlac-21.png` has **no matching ref** (101 thumbs vs 100 refs).
- Orientation: **vertical (9:16)**.

### Thumbnail vs ref (observed, `gv-001`)
- **Thumbnail** = the bare scene: a dusk landscape (twin-peak mountain, grassy
  field). No person. This is the selectable preview.
- **Ref** = the *same* scene with a person composited in: a full-body figure
  standing center-frame, mid-ground, with scene staging (a burning couch prop),
  lighting integrated. This is the **placement template** — it shows the target
  position, scale, pose, framing, and how the subject should sit in the light.

## Behavior
- User picks a scene (from thumbnails).
- The system pulls the matching **ref** as the placement guide for where the
  subject (from Phase 2) belongs in that scene.

## Scene text (for compose Path A)
Each `gv-*` scene carries a **pre-written text description** (authored once, kept in
a scene-descriptions data file keyed by scene id). At compose time (Phase 4 Path A)
the user can **also enter a custom, possibly long, text prompt** for the scene that
supplements/overrides the default. Available for any `gv-*` scene.

## Output
- The selected scene as a pair:
  - **clean plate** (`thumbnails/<id>.png`) — the background, and
  - **composition ref** (`refs/<id>.png`) — the "where/how the subject appears" guide.
- This pair is the placement spec handed to the generation phase that actually
  composes the subject into the scene.

## Open questions (resolve before building)
1. **Ref person — replace or guide?** Is the stand-in person in the ref meant to be
   **fully replaced** by our Phase 2 subject (identity swap into the composition),
   or is the ref only a **positional/pose guide** and generation uses the clean
   plate + derived placement? (Leaning: replace the stand-in with our subject,
   matching their position/scale/pose/light.)
2. **Scene staging props.** Refs contain scene-specific staging (e.g. the burning
   couch in `gv-001`). Selecting a scene → do we **keep that staging** as part of
   the desired shot, or is it incidental to the reference?
3. **Orphan `stlac-21`.** Exclude it from the selectable list, or source/generate a
   matching ref?
4. **Output orientation.** Refs/thumbs are **9:16 vertical only**. Final output
   aspect (9:16 / 16:9 / both) is a cross-cutting choice — see
   [output-spec.md](output-spec.md); 16:9 needs a strategy since no 16:9 scenes exist.
5. **How placement is achieved (downstream).** The actual compositing — subject +
   clean plate + ref placement → composed image — is the next generation phase.
   Candidate capabilities: image editing / subject-into-scene models on
   fal/Eachlabs, or Kling image-omni. Decide per `../providers/README.md`.

## Acceptance criteria (draft)
- User can browse thumbnails and select one scene.
- The matching ref is resolved and attached as the placement spec.
- Output carries forward: { styled subject, clean plate, composition ref } for the
  generation phase.

## Downstream
The { subject + scene plate + composition ref } bundle feeds the generation phase
that places the performer into the scene (to be defined).
