# make-gvids Workflow Design

End-to-end design for the music-video generation pipeline, captured **phase by
phase** as we define it. Each phase is documented before any code is written.

> Status legend: 🟦 DESIGN (documented, not built) · 🟨 IN PROGRESS · 🟩 BUILT & VERIFIED

## Phases

| # | Phase | Status | Doc |
|---|-------|--------|-----|
| 1 | Subject ingest & isolation | 🟦 DESIGN | [phase-01-subject-isolation.md](phase-01-subject-isolation.md) |
| 2 | Outfit selection & dressing | 🟦 DESIGN | [phase-02-outfit-selection.md](phase-02-outfit-selection.md) |
| 3 | Scene / background selection | 🟦 DESIGN | [phase-03-scene-selection.md](phase-03-scene-selection.md) |
| 4 | Generate the composed image | 🟦 DESIGN | [phase-04-composed-image.md](phase-04-composed-image.md) |
| 5 | Audio upload & section selection | 🟦 DESIGN | [phase-05-audio-selection.md](phase-05-audio-selection.md) |
| 6 | Animate: motion, camera & lip-sync | 🟦 DESIGN | [phase-06-animate-performance.md](phase-06-animate-performance.md) |
| 7 | Result display & preview | 🟦 DESIGN | [phase-07-result-display.md](phase-07-result-display.md) |
| 8 | Download / export | 🟦 DESIGN | [phase-08-download-export.md](phase-08-download-export.md) |

_(Phases 1–8 = the core MVP workflow.)_

## Provider decisions (live)
**Primary engine: Kling** (deep capability set, explored end-to-end). fal used only
as a small exception where noted.

| Phase | Decision | Status |
|-------|----------|--------|
| 1 — Subject isolation | **fal `rembg`** (`fal-ai/imageutils/rembg`) | ✅ chosen |
| 2 — Outfit dressing | **Kling `kolors-virtual-try-on-v1-5`** (tops/bottoms/dress only — **shoes/hats unsupported**) | ✅ chosen (shoes/hats mechanism TBD) |
| 4 — Composed image | Kling images/generations — **user picks Path A (quick/prompt) or Path B (precise/element-ref)** | ✅ dual-path chosen |
| 6 — Animate (motion+camera+lip-sync) | Kling **Avatar** (locked default; revisit on results) | ✅ chosen |

Captures: [`../providers/kling/captures/`](../providers/kling/captures/),
[`../providers/fal/captures/`](../providers/fal/captures/).

## Cross-cutting specs
- [output-spec.md](output-spec.md) — output **resolution** (480p/720p) & **aspect
  ratio** (9:16 / 16:9 / both). Aspect chosen at Phase 4, resolution at Phase 6.
  ⚠️ scene assets are 9:16 only — 16:9 needs a strategy.

## Roadmap (post-MVP, deferred)
- [roadmap.md](roadmap.md) — **R1: edit & extend** the generated video/scene by
  selecting more audio clips. Parked until Phases 1–8 are built and working.

## Principles
- One phase defined and agreed before the next.
- Provider choice is decided **per phase** using `../providers/README.md`.
- Nothing wires into the app until its phase is locked; the integration point is
  the provider seam at `server/provider.js`.
