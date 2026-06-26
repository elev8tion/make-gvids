import { useMemo } from 'react';
import { Check, Sparkles, X } from 'lucide-react';

import type { BasePhaseProps, OutfitSelection } from '../../types/pipeline';
import {
  SLOTS,
  COORDINATED_FITS,
  findItem,
  type OutfitItem,
  type SlotMeta,
  type CoordinatedFit,
} from '../../data/outfits';

/** Phase 2 — Outfit selection. 4 optional slots (tops/bottoms/shoes/hats). */
export interface PhaseOutfitProps extends BasePhaseProps {}

export function PhaseOutfit(props: PhaseOutfitProps) {
  const { outfit } = props.state;

  /** Read the selected id for a slot off the current selection. */
  const selectedId = (field: keyof OutfitSelection): string | undefined => outfit[field];

  /** Toggle a single garment: pick it, or deselect if it's already chosen. */
  const toggleItem = (field: keyof OutfitSelection, id: string) => {
    const next: OutfitSelection = { ...outfit };
    if (next[field] === id) delete next[field];
    else next[field] = id;
    props.update({ outfit: next });
  };

  /** Apply a coordinated fit{N} set across every slot it covers (overwrites). */
  const applyFit = (fit: CoordinatedFit) => {
    props.update({
      outfit: {
        topId: fit.topId,
        bottomId: fit.bottomId,
        shoeId: fit.shoeId,
        hatId: fit.hatId,
      },
    });
  };

  const clearAll = () => props.update({ outfit: {} });

  const chosenCount = useMemo(
    () => SLOTS.filter((s) => Boolean(outfit[s.field])).length,
    [outfit],
  );

  /** Which coordinated set (if any) the current selection exactly matches. */
  const activeFitN = useMemo(() => {
    const match = COORDINATED_FITS.find(
      (f) =>
        f.topId === outfit.topId &&
        f.bottomId === outfit.bottomId &&
        f.shoeId === outfit.shoeId &&
        f.hatId === outfit.hatId &&
        f.count > 0,
    );
    return match?.n ?? null;
  }, [outfit]);

  return (
    <div>
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 2</div>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h2 className="text-3xl font-semibold tracking-[-1px]">Outfit</h2>
          <p className="text-[#a1a1aa] mt-2 max-w-2xl">
            Dress the subject from the outfit library. Every slot is optional —
            leave a slot blank to keep the original garment. Click a selected item
            again to deselect it.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="text-sm text-[#71717a] whitespace-nowrap">
            <span className="text-white font-medium">{chosenCount}</span> / 4 slots
          </div>
          {chosenCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-[#a1a1aa] hover:text-white flex items-center gap-1 transition"
            >
              <X size={12} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Coordinated fits — one-click full looks */}
      <section className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={15} className="text-[#3b82f6]" />
          <h3 className="text-sm font-medium tracking-wide">Coordinated fits</h3>
          <span className="text-xs text-[#71717a]">
            one click fills every matching slot — tweak individual items afterwards
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {COORDINATED_FITS.map((fit) => {
            const active = activeFitN === fit.n;
            return (
              <button
                key={fit.n}
                type="button"
                onClick={() => applyFit(fit)}
                aria-pressed={active}
                title={`Fit ${fit.n} — covers ${fit.count} slot(s)`}
                className={`group relative flex-shrink-0 w-24 rounded-xl border overflow-hidden transition ${
                  active
                    ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/40'
                    : 'border-[#262626] hover:border-white/30'
                }`}
              >
                <div className="aspect-[3/4] bg-[#0f0f11] flex items-center justify-center">
                  <img
                    src={fit.preview}
                    alt={`Fit ${fit.n}`}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {active && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <div className="px-2 py-1.5 text-left">
                  <div className="text-xs font-medium text-white">Fit {fit.n}</div>
                  <div className="text-[10px] text-[#71717a]">{fit.count} pieces</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Per-slot pickers */}
      <div className="mt-8 space-y-8">
        {SLOTS.map((slot) => (
          <SlotPicker
            key={slot.slot}
            meta={slot}
            selected={selectedId(slot.field)}
            onToggle={(id) => toggleItem(slot.field, id)}
          />
        ))}
      </div>

      {/* Selection summary */}
      <div className="mt-8 glass rounded-2xl p-4">
        <div className="text-xs tracking-[2px] text-[#71717a] mb-3">CURRENT OUTFIT</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SLOTS.map((slot) => {
            const item = findItem(slot.slot, outfit[slot.field]);
            return (
              <div key={slot.slot} className="text-sm">
                <div className="text-[#71717a] mb-1">{slot.label}</div>
                <div className="font-medium text-white truncate">
                  {item ? item.id : <span className="text-[#52525b]">keep original</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SlotPickerProps {
  meta: SlotMeta;
  selected: string | undefined;
  onToggle: (id: string) => void;
}

function SlotPicker({ meta, selected, onToggle }: SlotPickerProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium tracking-wide">{meta.label}</h3>
        <span className="text-xs text-[#71717a]">{meta.items.length} options · optional</span>
        {meta.experimental && (
          <span className="text-[10px] uppercase tracking-wide text-amber-300/90 border border-amber-400/30 bg-amber-400/10 rounded-full px-2 py-0.5">
            experimental
          </span>
        )}
      </div>
      {meta.experimental && (
        <p className="text-xs text-[#71717a] mb-3 -mt-1">
          Shoes &amp; hats aren&apos;t officially supported by the try-on engine — they&apos;re
          carried into the compose step and may or may not appear.
        </p>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2.5">
        {meta.items.map((item) => (
          <Thumb
            key={item.id}
            item={item}
            selected={selected === item.id}
            onClick={() => onToggle(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

function Thumb({
  item,
  selected,
  onClick,
}: {
  item: OutfitItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      title={item.id}
      className={`group relative rounded-xl border overflow-hidden transition ${
        selected
          ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/40'
          : 'border-[#262626] hover:border-white/30'
      }`}
    >
      <div className="aspect-square bg-[#0f0f11] flex items-center justify-center p-1.5">
        <img
          src={item.url}
          alt={item.id}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
        />
      </div>
      {selected && (
        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center">
          <Check size={12} className="text-white" />
        </div>
      )}
    </button>
  );
}
