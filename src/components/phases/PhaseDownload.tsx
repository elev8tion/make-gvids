import type { BasePhaseProps } from '../../types/pipeline';

/** Phase 8 — Download / export (one or both orientations, named convention). */
export interface PhaseDownloadProps extends BasePhaseProps {}

export function PhaseDownload(props: PhaseDownloadProps) {
  const { resultVideos, output } = props.state;
  return (
    <div className="phase-stub">
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 8</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-3">Download — coming soon</h2>
      <p className="text-[#a1a1aa] mb-4">
        Download the finished MP4(s). When both orientations exist, each is labeled and downloadable.
      </p>
      <div className="text-sm text-[#71717a]">
        Requested: <span className="text-white font-medium">{output.aspect}</span>
        {'  ·  '}
        Available: <span className="text-white font-medium">{resultVideos.length}</span>
      </div>
    </div>
  );
}
