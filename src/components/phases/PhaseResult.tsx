import type { BasePhaseProps } from '../../types/pipeline';

/** Phase 7 — Result display & preview (iPhone mock for 9:16, normal for 16:9). */
export interface PhaseResultProps extends BasePhaseProps {}

export function PhaseResult(props: PhaseResultProps) {
  const { resultVideos } = props.state;
  return (
    <div className="phase-stub">
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 7</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-3">Result — coming soon</h2>
      <p className="text-[#a1a1aa] mb-4">
        Preview the generated video — 9:16 in a phone mock, 16:9 in a standard player, or switch between both.
      </p>
      <div className="text-sm text-[#71717a]">
        Videos ready: <span className="text-white font-medium">{resultVideos.length}</span>
      </div>
    </div>
  );
}
