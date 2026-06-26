# Phase 7 — Result Display & Preview

**Status:** 🟦 DESIGN (documented, not built)
**Frontend / presentation step** (no generation).

## Goal
Present the generated video appropriately for its aspect ratio:
- **9:16** → shown inside a **mock iPhone device** frame (vertical).
- **16:9** → shown in a **normal/standard** player (landscape).
- **Both** → a **switcher** to toggle between the two views (9:16 in the phone
  mock, 16:9 in the normal player).

## Input
- The generated performance video(s) from **Phase 6**, plus the chosen output
  format from [output-spec.md](output-spec.md) (aspect = 9:16 / 16:9 / both).

## Display behavior
| Output aspect | Presentation |
|---------------|--------------|
| `9:16` | Video composited inside a **mock iPhone** (device bezel/notch frame), portrait. |
| `16:9` | Standard responsive video player, landscape (no device frame). |
| `both` | Both versions available with a **toggle/segmented control** to switch between the phone-framed 9:16 and the normal 16:9. |

- Standard playback controls (play/pause/scrub), `playsInline`, looping optional.
- Keeps the existing **download** affordance (download the MP4); when `both`, allow
  downloading each orientation.

## Open questions (resolve before building)
1. **iPhone mock implementation** — pure CSS device frame, an SVG/PNG bezel asset,
   or a small library? Which iPhone style (notch / Dynamic Island)? Confirm we want
   iPhone specifically vs a generic phone mock.
2. **"Both" switcher UX** — segmented toggle (9:16 | 16:9), tabs, or side-by-side?
   Default view when both exist?
3. **Autoplay/loop/audio** — autoplay muted then unmute, or click-to-play? Loop the
   10/15s clip?
4. **Download** — single button per shown orientation; filename convention
   (e.g. `make-gvids-<id>-9x16.mp4`).
5. **Placement** — replaces the current inline result section in the app
   (`src/App.tsx` generated-result block) once built.

## Acceptance criteria (draft)
- A 9:16 result renders inside an iPhone device frame.
- A 16:9 result renders in a standard landscape player.
- When both exist, the user can switch between the two presentations.
- Each shown video is playable and downloadable.

## Downstream
This is the viewing/delivery surface for the finished video. Any further steps
(saving to a gallery, sharing/export) to be defined.
