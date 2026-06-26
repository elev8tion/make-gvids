import type { BasePhaseProps } from '../../types/pipeline';

/** Phase 1 — Subject ingest & isolation. Upload 1–3 images, isolate the person. */
export interface PhaseSubjectProps extends BasePhaseProps {}

export function PhaseSubject(props: PhaseSubjectProps) {
  const { subject } = props.state;
  return (
    <div className="phase-stub">
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 1</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-3">Subject — coming soon</h2>
      <p className="text-[#a1a1aa] mb-4">
        Upload 1–3 photos of the performer; the background is removed to produce a clean cutout.
      </p>
      <div className="text-sm text-[#71717a]">
        Uploaded references: <span className="text-white font-medium">{subject.images.length}</span>
      </div>
    </div>
  );
}
