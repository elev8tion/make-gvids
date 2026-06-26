import { useMemo, useState } from 'react';
import { Check, Search, X } from 'lucide-react';

import type { BasePhaseProps } from '../../types/pipeline';
import { SCENES } from '../../data/scenes';
import { getSceneDescription } from '../../data/scene-descriptions';

/** Phase 3 — Scene / background selection. Browse thumbnails, resolve paired ref. */
export interface PhaseSceneProps extends BasePhaseProps {}

export function PhaseScene(props: PhaseSceneProps) {
  const { state, update } = props;
  const selectedId = state.scene?.id ?? null;
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SCENES;
    return SCENES.filter((s) => s.id.toLowerCase().includes(q));
  }, [query]);

  const selectScene = (id: string) => {
    const asset = SCENES.find((s) => s.id === id);
    if (!asset) return;
    // Toggle off if the same scene is clicked again.
    if (selectedId === id) {
      update({ scene: null });
      return;
    }
    update({
      scene: {
        id: asset.id,
        thumbnailUrl: asset.thumbnailUrl,
        refUrl: asset.refUrl,
        description: getSceneDescription(asset.id),
      },
    });
  };

  return (
    <div>
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 3</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-2">Pick a scene</h2>
      <p className="text-[#a1a1aa] mb-6 max-w-2xl">
        Browse the scene plates and select one. Its paired reference defines where and how
        your subject appears — placement, scale, pose, framing, and light.
      </p>

      {/* Search + count */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search scenes (e.g. gv-012)"
            className="w-full bg-[#111113] border border-[#262626] rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-[#52525b] focus:border-[#3b82f6] focus:outline-none transition"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-white p-1"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="text-xs text-[#71717a]">
          {filtered.length} of {SCENES.length} scenes
          {selectedId && (
            <span className="ml-2 text-emerald-300">· selected {selectedId}</span>
          )}
        </div>
      </div>

      {/* Selected preview (clean plate + composition ref) */}
      {state.scene && (
        <div className="glass rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-4">
          <SelectedPlate label="Clean plate" url={state.scene.thumbnailUrl} />
          <SelectedPlate label="Composition ref" url={state.scene.refUrl} />
          <div className="flex-1 min-w-0">
            <div className="text-xs tracking-[2px] text-[#71717a] mb-1">SELECTED</div>
            <div className="text-lg font-semibold text-white mb-2">{state.scene.id}</div>
            <div className="text-xs tracking-[1.5px] text-[#71717a] mb-1">SCENE PROMPT</div>
            <p className="text-sm text-[#a1a1aa] leading-relaxed line-clamp-5">
              {state.scene.description}
            </p>
          </div>
        </div>
      )}

      {/* Thumbnail grid */}
      {filtered.length === 0 ? (
        <div className="text-sm text-[#71717a] py-12 text-center">
          No scenes match “{query}”.
        </div>
      ) : (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(124px, 1fr))' }}
        >
          {filtered.map((s) => {
            const active = s.id === selectedId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => selectScene(s.id)}
                aria-pressed={active}
                className={`group relative rounded-xl overflow-hidden border text-left transition focus:outline-none ${
                  active
                    ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/40'
                    : 'border-[#262626] hover:border-white/40'
                }`}
                style={{ aspectRatio: '9 / 16' }}
              >
                <img
                  src={s.thumbnailUrl}
                  alt={`Scene ${s.id}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition group-hover:scale-[1.04]"
                />
                {/* Bottom gradient + id */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                  <span className="text-[11px] font-mono text-white/90">{s.id}</span>
                </div>
                {/* Selected check badge */}
                {active && (
                  <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#3b82f6] flex items-center justify-center shadow-lg">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SelectedPlate({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex-shrink-0">
      <div className="text-[10px] tracking-[1.5px] text-[#71717a] mb-1">{label}</div>
      <div
        className="rounded-lg overflow-hidden border border-[#262626] bg-black"
        style={{ width: 84, aspectRatio: '9 / 16' }}
      >
        <img src={url} alt={label} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
