import { useMemo } from 'react';
import { Download, Smartphone, Monitor, PackageOpen } from 'lucide-react';

import type { BasePhaseProps, ResultVideo, VideoAspect } from '../../types/pipeline';

/** Phase 8 — Download / export (one or both orientations, named convention). */
export interface PhaseDownloadProps extends BasePhaseProps {}

/** `9:16` → `9x16` so filenames are filesystem-safe & distinguishable on disk. */
function fileSlug(aspect: VideoAspect): string {
  return aspect.replace(':', 'x');
}

function downloadName(aspect: VideoAspect): string {
  return `make-gvids-${fileSlug(aspect)}.mp4`;
}

export function PhaseDownload(props: PhaseDownloadProps) {
  const { resultVideos } = props.state;

  // Stable order: portrait first, then landscape.
  const ordered = useMemo(() => {
    const order: VideoAspect[] = ['9:16', '16:9'];
    return [...resultVideos].sort((a, b) => order.indexOf(a.aspect) - order.indexOf(b.aspect));
  }, [resultVideos]);

  const isEmpty = ordered.length === 0;

  return (
    <div>
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 8</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-2">Download your video</h2>
      <p className="text-[#a1a1aa] mb-6 max-w-prose">
        {isEmpty
          ? 'Your finished MP4 will be available here once the render completes.'
          : ordered.length > 1
            ? 'Both orientations are ready. Download each version below.'
            : 'Your finished MP4 is ready. Download it below.'}
      </p>

      {isEmpty ? (
        <EmptyDownload />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
          {ordered.map((video) => (
            <DownloadCard key={video.aspect} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── A single download affordance per produced orientation ───────────────── */
function DownloadCard({ video }: { video: ResultVideo }) {
  const isPortrait = video.aspect === '9:16';
  const name = downloadName(video.aspect);

  return (
    <div className="glass rounded-2xl p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
          {isPortrait ? <Smartphone size={18} /> : <Monitor size={18} />}
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">
            {video.aspect} · {isPortrait ? 'Portrait' : 'Landscape'}
          </div>
          <div className="text-xs text-[#71717a] truncate font-mono">{name}</div>
        </div>
      </div>

      <a
        href={video.url}
        download={name}
        className="btn btn-primary w-full mt-auto"
      >
        <Download size={16} />
        Download {video.aspect}
      </a>
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
function EmptyDownload() {
  return (
    <div className="glass rounded-2xl border border-dashed border-[#2a2a2d] p-12 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center mb-4">
        <PackageOpen size={24} className="text-[#3b82f6]" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Nothing to download yet</h3>
      <p className="text-sm text-[#71717a] max-w-xs">
        Finish generating your performance and the downloadable MP4(s) will show up here.
      </p>
      <button type="button" disabled className="btn btn-primary mt-5 opacity-40">
        <Download size={16} />
        Download
      </button>
    </div>
  );
}
