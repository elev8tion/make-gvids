import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Smartphone, Monitor, Film } from 'lucide-react';

import type { BasePhaseProps, ResultVideo, VideoAspect } from '../../types/pipeline';

/** Phase 7 — Result display & preview (iPhone mock for 9:16, normal for 16:9). */
export interface PhaseResultProps extends BasePhaseProps {}

export function PhaseResult(props: PhaseResultProps) {
  const { resultVideos } = props.state;

  // Index produced videos by aspect for quick lookup + toggle logic.
  const byAspect = useMemo(() => {
    const map = new Map<VideoAspect, ResultVideo>();
    for (const v of resultVideos) map.set(v.aspect, v);
    return map;
  }, [resultVideos]);

  const portrait = byAspect.get('9:16');
  const landscape = byAspect.get('16:9');
  const hasBoth = !!portrait && !!landscape;

  // Which orientation is currently displayed. Prefer 9:16 when present.
  const [view, setView] = useState<VideoAspect>(portrait ? '9:16' : '16:9');

  // Keep the active view valid as results stream in / change.
  useEffect(() => {
    if (view === '9:16' && !portrait && landscape) setView('16:9');
    if (view === '16:9' && !landscape && portrait) setView('9:16');
  }, [portrait, landscape, view]);

  const isEmpty = resultVideos.length === 0;

  return (
    <div>
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 7</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-2">Your result</h2>
      <p className="text-[#a1a1aa] mb-6 max-w-prose">
        Preview the finished performance. Vertical clips play inside a phone, widescreen clips in a
        standard player. {hasBoth && 'Toggle between the two orientations below.'}
      </p>

      {isEmpty ? (
        <EmptyResult />
      ) : (
        <div className="flex flex-col items-center">
          {hasBoth && (
            <div
              role="tablist"
              aria-label="Choose orientation"
              className="inline-flex p-1 rounded-full bg-[#111113] border border-[#262626] mb-8"
            >
              <SegmentButton
                active={view === '9:16'}
                onClick={() => setView('9:16')}
                icon={<Smartphone size={14} />}
                label="9:16"
              />
              <SegmentButton
                active={view === '16:9'}
                onClick={() => setView('16:9')}
                icon={<Monitor size={14} />}
                label="16:9"
              />
            </div>
          )}

          {view === '9:16' && portrait ? (
            <PhoneMock video={portrait} />
          ) : landscape ? (
            <LandscapePlayer video={landscape} />
          ) : portrait ? (
            <PhoneMock video={portrait} />
          ) : null}

          <div className="mt-6 text-xs text-[#71717a] flex items-center gap-2">
            <Film size={13} />
            <span>
              {resultVideos.length} orientation{resultVideos.length === 1 ? '' : 's'} ready
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Segmented toggle button ─────────────────────────────────────────────── */
function SegmentButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition ${
        active
          ? 'bg-[#3b82f6] text-white shadow-[0_2px_10px_-2px_rgba(59,130,246,0.6)]'
          : 'text-[#a1a1aa] hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ── 16:9 standard landscape player ──────────────────────────────────────── */
function LandscapePlayer({ video }: { video: ResultVideo }) {
  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-2xl overflow-hidden border border-[#262626] bg-black shadow-[0_24px_60px_-26px_rgba(0,0,0,0.8)]">
        <video
          key={video.url}
          src={video.url}
          controls
          playsInline
          loop
          className="w-full aspect-video bg-black block"
        />
      </div>
      <div className="mt-3 text-center text-[11px] tracking-[2px] uppercase text-[#71717a]">
        16:9 · Landscape
      </div>
    </div>
  );
}

/* ── 9:16 mock iPhone device frame (pure CSS, Dynamic Island) ────────────── */
function PhoneMock({ video }: { video: ResultVideo }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative shrink-0"
        style={{ width: 'min(300px, 78vw)' }}
        aria-label="iPhone preview"
      >
        {/* Outer titanium bezel */}
        <div
          className="relative rounded-[3rem] p-[10px] bg-gradient-to-b from-[#2a2a2e] via-[#161618] to-[#0a0a0c] border border-white/10"
          style={{
            boxShadow:
              '0 40px 80px -30px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 2px rgba(0,0,0,0.6)',
          }}
        >
          {/* Side buttons */}
          {/* Silent switch + volume (left) */}
          <span className="absolute -left-[3px] top-[120px] w-[3px] h-7 rounded-l bg-[#0a0a0c] border-l border-white/10" />
          <span className="absolute -left-[3px] top-[165px] w-[3px] h-12 rounded-l bg-[#0a0a0c] border-l border-white/10" />
          <span className="absolute -left-[3px] top-[225px] w-[3px] h-12 rounded-l bg-[#0a0a0c] border-l border-white/10" />
          {/* Power (right) */}
          <span className="absolute -right-[3px] top-[185px] w-[3px] h-16 rounded-r bg-[#0a0a0c] border-r border-white/10" />

          {/* Screen */}
          <div className="relative rounded-[2.35rem] overflow-hidden bg-black aspect-[9/16]">
            <video
              key={video.url}
              src={video.url}
              controls
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover bg-black"
            />

            {/* Dynamic Island */}
            <div className="pointer-events-none absolute top-[11px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 h-[26px] px-3 rounded-full bg-black/95 border border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#1c1c1f]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#101012] ring-1 ring-white/5" />
            </div>

            {/* Home indicator */}
            <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 z-10 w-1/3 h-1 rounded-full bg-white/45" />
          </div>
        </div>
      </div>
      <div className="mt-4 text-center text-[11px] tracking-[2px] uppercase text-[#71717a]">
        9:16 · Portrait
      </div>
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
function EmptyResult() {
  return (
    <div className="glass rounded-2xl border border-dashed border-[#2a2a2d] p-12 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center mb-4">
        <Film size={24} className="text-[#3b82f6]" />
      </div>
      <h3 className="text-lg font-semibold mb-1">No result yet</h3>
      <p className="text-sm text-[#71717a] max-w-xs">
        Once the performance finishes rendering, your video will appear here — ready to preview and
        download.
      </p>
    </div>
  );
}
