import type { BasePhaseProps } from '../../types/pipeline';

/** Phase 3 — Scene / background selection. Browse thumbnails, resolve paired ref. */
export interface PhaseSceneProps extends BasePhaseProps {}

export function PhaseScene(props: PhaseSceneProps) {
  const { scene } = props.state;
  return (
    <div className="phase-stub">
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 3</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-3">Scene — coming soon</h2>
      <p className="text-[#a1a1aa] mb-4">
        Pick a scene by browsing thumbnails; its paired reference defines where the subject appears.
      </p>
      <div className="text-sm text-[#71717a]">
        Selected scene: <span className="text-white font-medium">{scene ? scene.id : '—'}</span>
      </div>
    </div>
  );
}
