import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Wand2, AlertCircle, Zap, Crosshair, User, Maximize } from 'lucide-react';

import type { BasePhaseProps, ComposeMode, OutfitSelection } from '../../types/pipeline';
import { tryOn, compose, pollJob } from '../../lib/api';

/** Phase 4 — Compose the still. User picks Path A (quick) or B (precise). */
export interface PhaseComposeProps extends BasePhaseProps {}

function hasOutfit(outfit: OutfitSelection): boolean {
  return Boolean(outfit.topId || outfit.bottomId || outfit.shoeId || outfit.hatId);
}

const MODES: { id: ComposeMode; label: string; sub: string; icon: typeof Zap }[] = [
  { id: 'A', label: 'Quick', sub: 'Prompt-composited · fastest', icon: Zap },
  { id: 'B', label: 'Precise', sub: 'Reference-composited · best identity match', icon: Crosshair },
];

export function PhaseCompose({ state, update }: PhaseComposeProps) {
  const { subject, scene, outfit, composeMode, customScenePrompt, composedImageUrl, output, framing } = state;

  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Seed the prompt with the scene's pre-authored description (once, if empty).
  useEffect(() => {
    if (!customScenePrompt && scene?.description) {
      update({ customScenePrompt: scene.description });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene?.id]);

  const promptValue = customScenePrompt || scene?.description || '';

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      let subjectUrl = subject.isolatedUrl;
      const subjectImage = subject.images[0]?.file;

      // If outfit items are selected, dress the subject first (try-on), then compose.
      if (hasOutfit(outfit)) {
        setProgress('Applying outfit…');
        const tryJob = await tryOn({ subjectUrl, subjectImage, outfit });
        let tryNote: string | null = null;
        subjectUrl = await pollJob(tryJob.jobId, (snap) => {
          if (snap.tryOnSkipped && snap.note) tryNote = snap.note;
        });
        // Try-on unavailable on the plan → generation still proceeds with the original outfit.
        if (tryNote) toast.info(tryNote);
      }

      setProgress('Composing the scene…');
      const composeJob = await compose({
        subjectUrl,
        subjectImage: subjectUrl ? undefined : subjectImage,
        scene,
        outfit,
        composeMode,
        prompt: promptValue,
        aspect: output.aspect,
        framing,
      });
      const url = await pollJob(composeJob.jobId);

      update({ composedImageUrl: url });
      setProgress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Composition failed.');
      setProgress(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 4</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-2">Compose</h2>
      <p className="text-[#a1a1aa] mb-6 max-w-2xl">
        Place the styled subject into the scene to produce the composed still — the first frame the
        video animates from. Aspect ratio is set in the sidebar.
      </p>

      {/* Compose mode toggle */}
      <div className="mb-6">
        <div className="text-sm text-[#71717a] mb-2">Compose mode</div>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = composeMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => update({ composeMode: m.id })}
                disabled={busy}
                className={`text-left rounded-2xl border px-4 py-3 transition disabled:opacity-50 ${
                  active
                    ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                    : 'border-[#262626] hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-2 font-medium">
                  <Icon size={16} className={active ? 'text-[#3b82f6]' : 'text-[#a1a1aa]'} />
                  Path {m.id} · {m.label}
                </div>
                <div className="text-xs text-[#71717a] mt-1">{m.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Framing toggle */}
      <div className="mb-6">
        <div className="text-sm text-[#71717a] mb-3">Framing</div>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => update({ framing: 'portrait' })}
            disabled={busy}
            className={`text-left rounded-2xl border px-4 py-3 transition disabled:opacity-50 ${
              framing === 'portrait'
                ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                : 'border-[#262626] hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              <User size={16} className={framing === 'portrait' ? 'text-[#3b82f6]' : 'text-[#a1a1aa]'} />
              Portrait
            </div>
            <div className="text-xs text-[#71717a] mt-1">Tight face · best lip-sync</div>
          </button>
          <button
            type="button"
            onClick={() => update({ framing: 'fullBody' })}
            disabled={busy}
            className={`text-left rounded-2xl border px-4 py-3 transition disabled:opacity-50 ${
              framing === 'fullBody'
                ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                : 'border-[#262626] hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              <Maximize size={16} className={framing === 'fullBody' ? 'text-[#3b82f6]' : 'text-[#a1a1aa]'} />
              Full Body
            </div>
            <div className="text-xs text-[#71717a] mt-1">Entire figure · wide shot</div>
          </button>
        </div>
        {framing === 'fullBody' && (
          <p className="mt-2 text-xs text-amber-300/80">
            Full body needs a clear full-figure cutout. If your upload is a head-shot, the engine will generate a full-body version first.
          </p>
        )}
      </div>

      {/* Scene prompt */}
      <div className="mb-6">
        <label htmlFor="scene-prompt" className="block text-sm text-[#71717a] mb-2">
          Scene prompt {scene ? `· ${scene.id}` : ''}
        </label>
        <textarea
          id="scene-prompt"
          value={promptValue}
          onChange={(e) => update({ customScenePrompt: e.target.value })}
          disabled={busy}
          rows={5}
          placeholder="Describe the scene, lighting, placement and mood…"
          className="w-full rounded-xl bg-[#0a0a0c] border border-[#262626] focus:border-[#3b82f6] outline-none px-4 py-3 text-sm text-white resize-y disabled:opacity-60"
        />
        <div className="text-[10px] text-[#71717a] mt-1.5">
          Defaults to the scene's authored description — edit to supplement or override it.
        </div>
      </div>

      {/* Preview */}
      {composedImageUrl && (
        <div className="mb-6">
          <div className="text-sm text-[#71717a] mb-2">Composed still</div>
          <div className="rounded-2xl overflow-hidden border border-[#262626] bg-[#0a0a0c] inline-block max-w-sm">
            <img src={composedImageUrl} alt="Composed still" className="w-full h-auto block" />
          </div>
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
        <div className="mb-5 flex items-center gap-2 text-sm text-[#a1a1aa]">
          <Loader2 size={16} className="animate-spin text-[#3b82f6]" />
          {progress}
        </div>
      )}

      <button
        type="button"
        onClick={generate}
        disabled={busy}
        className="btn btn-primary px-6 flex items-center gap-2"
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
        {composedImageUrl ? 'Regenerate composed image' : 'Generate composed image'}
      </button>
    </div>
  );
}
