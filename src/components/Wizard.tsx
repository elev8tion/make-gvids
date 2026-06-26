import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

import {
  WIZARD_STEPS,
  WIZARD_STEP_COUNT,
  createInitialWizardState,
  type WizardState,
  type Resolution,
  type AspectChoice,
} from '../types/pipeline';

import { PhaseSubject } from './phases/PhaseSubject';
import { PhaseOutfit } from './phases/PhaseOutfit';
import { PhaseScene } from './phases/PhaseScene';
import { PhaseCompose } from './phases/PhaseCompose';
import { PhaseAudio } from './phases/PhaseAudio';
import { PhaseAnimate } from './phases/PhaseAnimate';
import { PhaseResult } from './phases/PhaseResult';
import { PhaseDownload } from './phases/PhaseDownload';

interface WizardProps {
  onClose: () => void;
}

/** Per-step gate: whether the user is allowed to advance from `step`. */
function canProceed(state: WizardState): boolean {
  switch (state.currentStep) {
    case 0: // subject — at least one image
      return state.subject.images.length >= 1;
    case 2: // scene — must select one
      return state.scene !== null;
    case 4: // audio — must select a section
      return state.selectedAudioSection !== null;
    // 1 outfit (all optional), 3 compose, 5 animate, 6 result, 7 download
    default:
      return true;
  }
}

export function Wizard({ onClose }: WizardProps) {
  const [state, setState] = useState<WizardState>(() => createInitialWizardState());

  const update = (patch: Partial<WizardState>) =>
    setState((prev) => ({ ...prev, ...patch }));

  const goNext = () =>
    setState((prev) =>
      canProceed(prev) && prev.currentStep < WIZARD_STEP_COUNT - 1
        ? { ...prev, currentStep: prev.currentStep + 1 }
        : prev,
    );

  const goBack = () =>
    setState((prev) =>
      prev.currentStep > 0 ? { ...prev, currentStep: prev.currentStep - 1 } : prev,
    );

  const step = state.currentStep;
  const meta = WIZARD_STEPS[step];
  const isLast = step === WIZARD_STEP_COUNT - 1;
  const proceed = canProceed(state);

  const phaseProps = { state, update, onNext: goNext, onBack: goBack };

  const phaseEl = useMemo(() => {
    switch (meta.key) {
      case 'subject':
        return <PhaseSubject {...phaseProps} />;
      case 'outfit':
        return <PhaseOutfit {...phaseProps} />;
      case 'scene':
        return <PhaseScene {...phaseProps} />;
      case 'compose':
        return <PhaseCompose {...phaseProps} />;
      case 'audio':
        return <PhaseAudio {...phaseProps} />;
      case 'animate':
        return <PhaseAnimate {...phaseProps} />;
      case 'result':
        return <PhaseResult {...phaseProps} />;
      case 'download':
        return <PhaseDownload {...phaseProps} />;
      default:
        return null;
    }
  }, [meta.key, state]);

  // Output-spec controls surface at the right step: aspect ~compose, resolution ~animate.
  const showAspect = meta.key === 'compose';
  const showResolution = meta.key === 'animate';

  return (
    <motion.div
      className="fixed inset-0 bg-[#0a0a0a] z-[80] flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="h-14 border-b border-[#262626] flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#3b82f6]" />
          <div>
            <div className="font-semibold">Wizard</div>
            <div className="text-[10px] text-[#71717a] -mt-1">make-gvids pipeline</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[#a1a1aa] hover:text-white p-2"
          aria-label="Close wizard"
        >
          <X size={20} />
        </button>
      </div>

      {/* Stepper */}
      <div className="border-b border-[#262626] px-6 py-3 flex-shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {WIZARD_STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition ${
                    active
                      ? 'bg-[#3b82f6]/20 border-[#3b82f6] text-white'
                      : done
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#111113] border-[#2a2a2d] text-[#71717a]'
                  }`}
                >
                  <span className="font-mono">
                    {done ? <Check size={12} /> : s.phase}
                  </span>
                  <span>{s.title}</span>
                </div>
                {i < WIZARD_STEPS.length - 1 && (
                  <div className="w-4 h-px bg-[#2a2a2d]" aria-hidden />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col p-8 pb-12 overflow-auto min-h-0">
          <div className="max-w-4xl mx-auto w-full glass rounded-3xl p-8">
            <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">
              STEP {step + 1} OF {WIZARD_STEP_COUNT}
            </div>
            {phaseEl}
          </div>
        </div>

        {/* Sidebar — output spec + summary */}
        <div className="w-80 border-l border-[#262626] p-6 flex-shrink-0 overflow-auto hidden lg:block">
          <div className="text-xs tracking-[2px] text-[#71717a] mb-3">OUTPUT</div>

          {/* Aspect ratio (surfaced around compose) */}
          <div className={`mb-5 ${showAspect ? '' : 'opacity-60'}`}>
            <div className="text-[#71717a] text-sm mb-1.5">Aspect ratio</div>
            <div className="flex gap-2">
              {(['9:16', '16:9', 'both'] as AspectChoice[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => update({ output: { ...state.output, aspect: a } })}
                  className={`flex-1 rounded-xl border px-2 py-2 text-xs font-medium transition ${
                    state.output.aspect === a
                      ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-white'
                      : 'border-[#262626] hover:border-white/30 text-[#a1a1aa]'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            {showAspect && (
              <div className="text-[10px] text-[#71717a] mt-1.5">Chosen at compose — sets the canvas.</div>
            )}
          </div>

          {/* Resolution (surfaced around animate) */}
          <div className={`mb-6 ${showResolution ? '' : 'opacity-60'}`}>
            <div className="text-[#71717a] text-sm mb-1.5">Resolution</div>
            <div className="flex gap-2">
              {(['480p', '720p'] as Resolution[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update({ output: { ...state.output, resolution: r } })}
                  className={`flex-1 rounded-xl border px-3 py-2 text-xs font-medium transition ${
                    state.output.resolution === r
                      ? 'border-[#3b82f6] bg-[#3b82f6]/10 text-white'
                      : 'border-[#262626] hover:border-white/30 text-[#a1a1aa]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {showResolution && (
              <div className="text-[10px] text-[#71717a] mt-1.5">Applied at render.</div>
            )}
          </div>

          <div className="text-xs tracking-[2px] text-[#71717a] mb-3">SUMMARY</div>
          <div className="space-y-3 text-sm">
            <SummaryRow label="Subject" value={`${state.subject.images.length} photo(s)`} />
            <SummaryRow label="Scene" value={state.scene?.id ?? '—'} />
            <SummaryRow label="Compose" value={`Path ${state.composeMode}`} />
            <SummaryRow
              label="Audio"
              value={state.selectedAudioSection ? `#${state.selectedAudioSection.index} (${state.selectedAudioSection.durationSec}s)` : '—'}
            />
            <SummaryRow label="Output" value={`${state.output.aspect} · ${state.output.resolution}`} />
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="h-16 border-t border-[#262626] flex items-center justify-between px-6 flex-shrink-0 bg-[#0a0a0a]">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="btn btn-ghost disabled:opacity-40 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {isLast ? (
          <button type="button" onClick={onClose} className="btn btn-primary px-8">
            Done
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!proceed}
            className="btn btn-primary disabled:opacity-40 flex items-center gap-2 px-6"
          >
            Continue <ArrowRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[#71717a]">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
