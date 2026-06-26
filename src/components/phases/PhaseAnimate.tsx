import { useState } from 'react';
import { Loader2, Film, AlertCircle, Video } from 'lucide-react';

import type { BasePhaseProps, VideoAspect, ResultVideo } from '../../types/pipeline';
import { animate, pollJob } from '../../lib/api';

/** Phase 6 — Animate: motion, camera & lip-sync (Kling Avatar). */
export interface PhaseAnimateProps extends BasePhaseProps {}

const MAX_PROMPT = 2500;

export function PhaseAnimate({ state, update, onNext }: PhaseAnimateProps) {
  const { composedImageUrl, audioFile, selectedAudioSection, performancePrompt, output, jobStatus } =
    state;

  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const busy = jobStatus === 'processing';

  // Which orientations to render — `both` produces two videos.
  const orientations: VideoAspect[] =
    output.aspect === 'both' ? ['9:16', '16:9'] : [output.aspect];

  const canGenerate = Boolean(composedImageUrl) && !busy;

  const generate = async () => {
    if (!composedImageUrl) {
      setError('No composed still found — go back to the Compose step first.');
      return;
    }
    setError(null);
    update({ jobStatus: 'processing', resultVideos: [] });

    try {
      const videos: ResultVideo[] = [];
      for (let i = 0; i < orientations.length; i++) {
        const aspect = orientations[i];
        setProgress(
          orientations.length > 1
            ? `Rendering ${aspect} (${i + 1}/${orientations.length})…`
            : 'Rendering performance video…',
        );

        const { jobId } = await animate({
          imageUrl: composedImageUrl,
          audio: audioFile,
          section: selectedAudioSection,
          prompt: performancePrompt,
          output,
          aspect,
        });
        const url = await pollJob(jobId);
        videos.push({ aspect, url });
        // Surface partial results as soon as each orientation completes.
        update({ resultVideos: [...videos] });
      }

      update({ resultVideos: videos, jobStatus: 'done' });
      setProgress(null);
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video generation failed.');
      setProgress(null);
      update({ jobStatus: 'error' });
    }
  };

  const promptLen = performancePrompt.length;

  return (
    <div>
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 6</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-2">Animate</h2>
      <p className="text-[#a1a1aa] mb-6 max-w-2xl">
        Turn the composed still into a lip-synced performance video — body motion, camera movement,
        and mouth synced to your audio. Resolution is set in the sidebar.
      </p>

      {/* Performance prompt */}
      <div className="mb-6">
        <label htmlFor="perf-prompt" className="block text-sm text-[#71717a] mb-2">
          Performance prompt — body actions + camera movement
        </label>
        <textarea
          id="perf-prompt"
          value={performancePrompt}
          maxLength={MAX_PROMPT}
          onChange={(e) => update({ performancePrompt: e.target.value })}
          disabled={busy}
          rows={5}
          placeholder="e.g. Singer steps forward and gestures to the camera; slow dolly-in, slight handheld sway, warm key light…"
          className="w-full rounded-xl bg-[#0a0a0c] border border-[#262626] focus:border-[#3b82f6] outline-none px-4 py-3 text-sm text-white resize-y disabled:opacity-60"
        />
        <div className="text-[10px] text-[#71717a] mt-1.5 text-right">
          {promptLen}/{MAX_PROMPT}
        </div>
      </div>

      {/* Render summary */}
      <div className="mb-6 flex flex-wrap gap-2 text-xs">
        <Chip label={`Resolution · ${output.resolution}`} />
        <Chip label={`Aspect · ${output.aspect}`} />
        <Chip
          label={
            selectedAudioSection
              ? `Audio · #${selectedAudioSection.index} (${selectedAudioSection.durationSec}s)`
              : 'Audio · none'
          }
        />
        {!composedImageUrl && <Chip label="⚠ no composed still" warn />}
      </div>

      {/* Result previews */}
      {state.resultVideos.length > 0 && (
        <div className="mb-6 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {state.resultVideos.map((v) => (
            <div key={v.aspect} className="rounded-2xl overflow-hidden border border-[#262626] bg-[#0a0a0c]">
              <video src={v.url} controls className="w-full h-auto block" />
              <div className="px-3 py-2 text-xs text-[#a1a1aa] flex items-center gap-1.5">
                <Video size={12} /> {v.aspect}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status / errors */}
      {error && (
        <div className="mb-5 flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {busy && progress && (
        <div className="mb-5">
          <div className="flex items-center gap-2 text-sm text-[#a1a1aa] mb-2">
            <Loader2 size={16} className="animate-spin text-[#3b82f6]" />
            {progress}
          </div>
          <div className="h-1.5 rounded-full bg-[#1a1a1e] overflow-hidden">
            <div className="progress-bar h-full w-1/3 animate-pulse" />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={generate}
        disabled={!canGenerate}
        className="btn btn-primary px-6 flex items-center gap-2"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Film size={16} />}
        {state.resultVideos.length > 0 ? 'Regenerate video' : 'Generate video'}
      </button>
    </div>
  );
}

function Chip({ label, warn }: { label: string; warn?: boolean }) {
  return (
    <span
      className={`px-3 py-1.5 rounded-full border ${
        warn
          ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
          : 'border-[#262626] bg-[#111113] text-[#a1a1aa]'
      }`}
    >
      {label}
    </span>
  );
}
