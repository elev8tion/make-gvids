# Phase 1 — Subject Ingest & Isolation

**Status:** 🟦 DESIGN (documented, not built)

## Goal
Let the user upload **1–3 images** of the person who will appear in the music
video, then **isolate that person** from their background — producing a clean
subject reference (the person with the background removed / cut out).

## Input
- 1 to 3 uploaded images (JPG/PNG) of the **same person**.
- These are the source of the performer's likeness for all downstream phases.

## Output
- An **isolated subject** for each (or the best) uploaded image: the person with
  the background removed — i.e. a transparent-background cutout (PNG with alpha).
- This clean subject becomes the reference fed into the next phase.

## ✅ Decision — isolation engine: fal `rembg`
Background removal uses **`fal-ai/imageutils/rembg`** (fal). See capture:
[`../providers/fal/captures/rembg.md`](../providers/fal/captures/rembg.md).
This is the **one fal dependency** in an otherwise Kling-primary pipeline.
- Input: `image_url` (upload the user's photo to fal CDN via `fal.storage.upload()`,
  or any public URL), via `fal.subscribe("fal-ai/imageutils/rembg", { input })`.
- Output: transparent-background PNG (the subject cutout).
- Resolves open question 3 ("where isolation runs") → **provider (fal rembg)**, not local.

## What "isolate" means here
The user described this as the person being **"extracted"** or having the
**"background removed."** Both describe the same outcome: the subject separated
from their original scene. Resolve the exact technique at build time (see open
questions).

## Open questions (resolve before building)
1. **One cutout per image, or pick one?** With 1–3 uploads, do we isolate all of
   them (multi-angle reference set) or select a single best image?
2. **"Extracted" vs "remove background" — same thing or two modes?** Confirm
   whether the user wants a single isolation behavior or a choice between:
   - *Background removal* — keep the full original image, just delete the backdrop.
   - *Subject extraction/crop* — tightly crop to the person, then remove background.
3. **Where does isolation run?**
   - Local model (e.g. an in-process / self-hosted background-removal model), or
   - A provider model (fal / Eachlabs host background-removal & segmentation models;
     Kling has image-recognition but bg-removal is not its core).
   Decide using `../providers/README.md` when we lock this phase's provider.
4. **Quality gate?** Do we validate the cutout (e.g. a face is present, subject
   not over-cropped) before accepting it for the next phase?

## Acceptance criteria (draft)
- User can upload 1–3 images.
- Each accepted image yields a person-only cutout with the background removed
  (transparent alpha).
- The cutout(s) are stored/available as the reference handed to Phase 2.

## Downstream
The isolated subject from this phase is the likeness reference consumed by the
next phase (to be defined).
