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

_(more phases added as we define them)_

## Cross-cutting specs
- [output-spec.md](output-spec.md) — output **resolution** (480p/720p) & **aspect
  ratio** (9:16 / 16:9 / both). Aspect chosen at Phase 4, resolution at Phase 6.
  ⚠️ scene assets are 9:16 only — 16:9 needs a strategy.

## Principles
- One phase defined and agreed before the next.
- Provider choice is decided **per phase** using `../providers/README.md`.
- Nothing wires into the app until its phase is locked; the integration point is
  the provider seam at `server/provider.js`.
