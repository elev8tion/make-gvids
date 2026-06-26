import type { BasePhaseProps } from '../../types/pipeline';

/** Phase 6 — Animate: motion, camera & lip-sync (Kling Avatar). */
export interface PhaseAnimateProps extends BasePhaseProps {}

export function PhaseAnimate(props: PhaseAnimateProps) {
  const { output, jobStatus } = props.state;
  return (
    <div className="phase-stub">
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 6</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-3">Animate — coming soon</h2>
      <p className="text-[#a1a1aa] mb-4">
        Animate the still into a lip-synced performance video. Choose render resolution here.
      </p>
      <div className="text-sm text-[#71717a]">
        Resolution: <span className="text-white font-medium">{output.resolution}</span>
        {'  ·  '}
        Job: <span className="text-white font-medium">{jobStatus}</span>
      </div>
    </div>
  );
}
