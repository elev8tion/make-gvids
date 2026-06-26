/**
 * Per-scene subject placement — the ref-guide-sourced source of truth for where
 * the composited subject lands in each scene.
 *
 * This replaces the old single global `COMPOSITE_SUBJECT_HEIGHT_FRAC` env var
 * (one size for every scene) with a per-scene table keyed by scene id. The
 * framing for each entry is read from the scene reference guide images at
 * `public/assets/scenes/refs/<id>.png`, which show the intended composition.
 *
 * Each entry (all fields optional — missing fields inherit DEFAULT):
 *   frame      : 'portrait' | 'full'   framing mode (see provider.js)
 *   --- portrait mode (default; head + upper body, large face for lip-sync) ---
 *   subjectFillFrac : 0..1  canvas height covers this much of the FULL figure
 *                           (lower = more zoomed toward the face)
 *   headroomFrac    : 0..1  clearance above the head
 *   hAlign / insetFrac : optional horizontal nudge
 *   --- full mode (whole figure; for top-down / flat-lay plates) ---
 *   heightFrac : 0..1   fraction of canvas height the figure occupies
 *   hAlign     : 'left' | 'center' | 'right'
 *   vAlign     : 'bottom' | 'center'
 *   insetFrac  : 0..1   margin (fraction of canvas width) from the aligned edge
 *
 * DEFAULT is portrait — the Avatar pipeline animates the composed still, and a
 * lip-sync model needs a large, clear face (full-body framing was the main
 * reason the rendered face looked mushy). OVERRIDES carries per-scene framing
 * read from the ref guide (public/assets/scenes/refs/<id>.png).
 */

const DEFAULT = {
  frame: 'portrait',
  subjectFillFrac: parseFloat(process.env.COMPOSITE_SUBJECT_FILL_FRAC || '0.5'), // head→hips
  headroomFrac: 0.04,
  hAlign: 'center',
  insetFrac: 0,
  // full-mode fallback knobs (used only when frame:'full')
  heightFrac: parseFloat(process.env.COMPOSITE_SUBJECT_HEIGHT_FRAC || '0.82'),
  vAlign: 'bottom',
};

// Per-scene framing sourced from public/assets/scenes/refs/<id>.png.
// Top-down / flat-lay plates can't host a portrait performer — show the whole
// figure smaller and centered instead.
const OVERRIDES = {
  'gv-014': { frame: 'full', heightFrac: 0.55, vAlign: 'center' }, // top-down dirt + leaves
  'gv-021': { frame: 'full', heightFrac: 0.55, vAlign: 'center' }, // top-down flat-lay rug
};

export function getPlacement(sceneId) {
  return { ...DEFAULT, ...(OVERRIDES[String(sceneId)] || {}) };
}
