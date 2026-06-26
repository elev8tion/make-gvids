# Phase 5 — Audio Upload & Section Selection

**Status:** 🟦 DESIGN (documented, not built)

## Goal
Let the user upload a song, choose a clip length (**10s or 15s**), break the whole
track into consecutive sections of that length, **preview each section**, and
**choose the one** to use for the performance.

## Input
- An uploaded audio file: **`.mp3` or `.wav`**.

## Flow
1. **Upload** the audio file (mp3 / wav).
2. **Pick clip length:** **10 seconds** or **15 seconds** (toggle).
3. **Segment:** divide the entire song into consecutive, non-overlapping sections
   of the chosen length (e.g. a 3:00 track → 18 × 10s, or 12 × 15s).
4. **Preview:** play/listen to each section, in order, to compare them.
5. **Choose:** select the single section to use.

## Output
- The **chosen audio section** (a 10s or 15s clip from the song) — this is the
  performance audio consumed downstream (drives lip-sync / video length).
- Carries forward: `{ chosen clip, length (10|15), source song reference, section index/time range }`.

## Open questions (resolve before building)
1. **Remainder handling.** When the song length isn't an exact multiple of 10/15,
   the last section is shorter. Drop it, keep it as a short final section, or pad?
2. **Section model = consecutive chunks** (confirmed by "listen to each section in
   order"). Confirm we do **not** also need a free sliding/scrub selector.
3. **Clip length drives video duration?** The earlier app produced 8s clips. Does
   the 10/15s choice now set the **generated video length** (i.e. the video phase
   renders to match)? (Leaning: yes.)
4. **Where the cut happens.**
   - *Preview*: client-side, in-browser (Web Audio / `<audio>` with start/end
     offsets) — no server round-trip per section.
   - *Final clip*: extract the chosen section (server already has ffmpeg trim) for
     downstream use.
5. **File constraints.** Max file size / song length? Reject other formats (only
   mp3/wav)?
6. **Waveform UI?** Optional — a waveform with section boundaries would make
   choosing easier, but isn't required for the core flow.

## Relationship to existing code
This **replaces** the old Studio behavior (auto "smart trim" that energy-detected a
single 8s window). New behavior: user picks 10/15s, browses **all** sections
manually, and selects one. The old smart-trim/8s logic is superseded.

## Acceptance criteria (draft)
- User can upload an mp3 or wav.
- User can toggle 10s vs 15s; sections regenerate to match.
- Each section is individually playable for comparison.
- User selects one section; it is captured (with its time range) as the
  performance clip for downstream phases.

## Downstream
The chosen audio section feeds the video / lip-sync phase, and likely sets the
target video duration (to be defined).
