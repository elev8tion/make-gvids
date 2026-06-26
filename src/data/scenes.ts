// Phase 3 scene manifest — the selectable scene library.
//
// Each entry pairs a clean background plate (thumbnail the user browses) with
// its composition reference (placement/pose/scale/light guide). Files are served
// statically from `public/assets/scenes/` at:
//   thumbnail → /assets/scenes/thumbnails/<id>.png
//   ref       → /assets/scenes/refs/<id>.png
//
// Only the paired `gv-*` set is included. The orphan thumbnail `stlac-21` has no
// matching ref and is intentionally excluded (see docs/workflow/phase-03).

export interface SceneAsset {
  /** Scene id stem, e.g. `gv-001`. */
  id: string;
  /** Clean background plate URL (served from /public). */
  thumbnailUrl: string;
  /** Composition reference URL (served from /public). */
  refUrl: string;
}

/** Number of paired gv-* scenes (gv-001 … gv-100). */
const SCENE_COUNT = 100;

/** All selectable scenes — generated from the gv-001…gv-100 paired set. */
export const SCENES: SceneAsset[] = Array.from({ length: SCENE_COUNT }, (_, i) => {
  const id = `gv-${String(i + 1).padStart(3, '0')}`;
  return {
    id,
    thumbnailUrl: `/assets/scenes/thumbnails/${id}.png`,
    refUrl: `/assets/scenes/refs/${id}.png`,
  };
});

/** Lookup a single scene asset by id. */
export function getScene(id: string): SceneAsset | undefined {
  return SCENES.find((s) => s.id === id);
}
