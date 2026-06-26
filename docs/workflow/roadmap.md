# Roadmap — Post-MVP (deferred)

Captured intent for work to plan **after** the core workflow (Phases 1–8) is built
and working. **Not designed yet** — these get their own planning pass later.

## R1 — Edit & Extend the generated video
**User intent:** after a video is generated, be able to **edit** it and/or
**extend** the video **and** the scene by **selecting more audio clips** to drive
the additional length.

### What this implies (notes for the future plan, not a design)
- **Extension via more audio:** reuse Phase 5's audio sectioning — the user picks
  **additional** 10/15s sections to extend the performance, and the video + scene
  are continued to match the new audio length.
- **Editing:** trim, reorder, swap shots/scenes, adjust, or re-generate segments of
  an existing result.

### Known constraints to carry into that plan (from Phase 6 research)
- **Lip-sync must stay joint-or-terminal** — extending a lip-synced video can't be a
  naive concatenation if it re-renders frames over the vocal; each extended segment
  needs lip-sync applied consistently with its audio.
- **Kling video-extension caveat:** Kling's `video-extension` only supports
  **v1-series** models and **does not carry audio forward**
  (`../providers/kling/source/02-video/17-video-extension.md`) — so it's likely the
  *wrong* tool for audio-driven extension. More plausible: generate each new
  segment from a continued still + its audio section (Avatar/i2v), then stitch.
- **Continuity:** scene, identity, outfit, lighting must stay consistent across
  extended segments (use the last frame / composed still as the seed for the next).
- **Stitching:** concatenating segments + muxing the full audio (backend already has
  ffmpeg) — define seam handling.

### Dependencies
- Core workflow (Phases 1–8) built and stable first.
- Audio sectioning (Phase 5) reused for "select more clips."
- Provider/model choice for extension revisited (Avatar/i2v per-segment + stitch,
  not Kling video-extension).

> Status: **parked.** Revisit and create a full phase plan once the MVP works.
