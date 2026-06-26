import type { BasePhaseProps } from '../../types/pipeline';

/** Phase 5 — Audio upload & section selection (10s or 15s consecutive sections). */
export interface PhaseAudioProps extends BasePhaseProps {}

export function PhaseAudio(props: PhaseAudioProps) {
  const { audioFile, audioSectionLength, selectedAudioSection } = props.state;
  return (
    <div className="phase-stub">
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 5</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-3">Audio — coming soon</h2>
      <p className="text-[#a1a1aa] mb-4">
        Upload a track, split it into {audioSectionLength}s sections, preview each, and pick one.
      </p>
      <div className="text-sm text-[#71717a]">
        Audio: <span className="text-white font-medium">{audioFile ? audioFile.name : '—'}</span>
        {'  ·  '}
        Section: <span className="text-white font-medium">{selectedAudioSection ? `#${selectedAudioSection.index}` : '—'}</span>
      </div>
    </div>
  );
}
