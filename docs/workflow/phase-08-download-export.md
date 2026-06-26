# Phase 8 — Download / Export

**Status:** 🟦 DESIGN (documented, not built)
**Delivery step** — the user takes the finished video(s) away.

## Goal
Let the user **download** what was generated — **one or both** aspect-ratio
versions (9:16 and/or 16:9), per the [output-spec.md](output-spec.md) choice.

## Input
- The generated video(s) from **Phase 6**, as presented in **Phase 7**.

## Behavior
- **Single orientation** (9:16 *or* 16:9): one download button → the MP4.
- **Both orientations:** allow downloading **each** version (two buttons, or a
  download action per shown view in the Phase 7 switcher).
- Download is the original generated MP4 (no transcode needed unless we add one).

## Open questions (resolve before building)
1. **Filename convention** — e.g. `make-gvids-<id>-9x16.mp4` / `-16x9.mp4` so both
   versions are distinguishable on disk.
2. **"Download both" affordance** — individual buttons per orientation, or a single
   "download both" (zip / sequential)?
3. **Source of the file** — direct provider result URL vs. our backend-served copy
   (post audio-mux); confirm what we hand the browser. (The backend already serves
   from `/generated`.)
4. **Format** — MP4 as-is. Any need for other containers/codecs? (Default: no.)

## Acceptance criteria (draft)
- User can download the generated MP4 for the orientation(s) produced.
- When both orientations exist, each is downloadable and clearly labeled.

## Note
Phase 7 (display) already surfaces a download affordance inline; Phase 8 is the
explicit, complete **export deliverable** — naming, both-orientation handling, and
where the bytes come from. This is the end of the core (MVP) workflow.
