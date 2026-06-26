import type { BasePhaseProps } from '../../types/pipeline';

/** Phase 4 — Compose the still. User picks Path A (quick) or B (precise). */
export interface PhaseComposeProps extends BasePhaseProps {}

export function PhaseCompose(props: PhaseComposeProps) {
  const { composeMode, output } = props.state;
  return (
    <div className="phase-stub">
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 4</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-3">Compose — coming soon</h2>
      <p className="text-[#a1a1aa] mb-4">
        Generate the composed still — subject placed into the scene. Choose compose mode and aspect ratio.
      </p>
      <div className="text-sm text-[#71717a]">
        Compose mode: <span className="text-white font-medium">Path {composeMode}</span>
        {'  ·  '}
        Aspect: <span className="text-white font-medium">{output.aspect}</span>
      </div>
    </div>
  );
}
