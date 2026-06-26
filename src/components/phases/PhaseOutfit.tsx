import type { BasePhaseProps } from '../../types/pipeline';

/** Phase 2 — Outfit selection. 4 optional slots (tops/bottoms/shoes/hats). */
export interface PhaseOutfitProps extends BasePhaseProps {}

export function PhaseOutfit(props: PhaseOutfitProps) {
  const { outfit } = props.state;
  const chosen = [outfit.topId, outfit.bottomId, outfit.shoeId, outfit.hatId].filter(Boolean).length;
  return (
    <div className="phase-stub">
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 2</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-3">Outfit — coming soon</h2>
      <p className="text-[#a1a1aa] mb-4">
        Dress the subject from the outfit library. Each slot is optional — blank keeps the original.
      </p>
      <div className="text-sm text-[#71717a]">
        Slots selected: <span className="text-white font-medium">{chosen} / 4</span>
      </div>
    </div>
  );
}
