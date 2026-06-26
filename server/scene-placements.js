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
 *   heightFrac : 0..1   fraction of canvas height the subject occupies
 *   hAlign     : 'left' | 'center' | 'right'   horizontal anchor
 *   vAlign     : 'bottom' | 'center'           vertical anchor
 *   insetFrac  : 0..1   margin (fraction of canvas width) from the aligned edge
 *
 * DEFAULT still honors the env var so existing deployments keep their tuning;
 * OVERRIDES carries the per-scene framing pulled from the ref guide. Extend
 * OVERRIDES as more scenes are framed from their refs.
 */

const DEFAULT = {
  heightFrac: parseFloat(process.env.COMPOSITE_SUBJECT_HEIGHT_FRAC || '0.82'),
  hAlign: 'center',
  vAlign: 'bottom',
  insetFrac: 0,
};

// Per-scene framing sourced from public/assets/scenes/refs/<id>.png.
// Top-down / flat-lay plates can't host a full-height bottom-anchored figure —
// a standing performer there reads as pasted-on, so they center smaller.
const OVERRIDES = {
  'gv-014': { heightFrac: 0.55, vAlign: 'center' }, // top-down dirt + leaves
  'gv-021': { heightFrac: 0.55, vAlign: 'center' }, // top-down flat-lay rug
  'gv-013': { heightFrac: 0.74, hAlign: 'right', insetFrac: 0.04 }, // studio chair set, light at left
  'gv-002': { heightFrac: 0.78, hAlign: 'right', insetFrac: 0.05 }, // TV at left, leave it visible
};

export function getPlacement(sceneId) {
  return { ...DEFAULT, ...(OVERRIDES[String(sceneId)] || {}) };
}
