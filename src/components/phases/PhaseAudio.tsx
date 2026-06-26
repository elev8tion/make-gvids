import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Play, Pause, Check, Music, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

import type { AudioSection, AudioSectionLength, BasePhaseProps } from '../../types/pipeline';

/** Phase 5 — Audio upload & section selection (10s or 15s consecutive sections). */
export interface PhaseAudioProps extends BasePhaseProps {}

/** A computed section enriched with playback/display fields used only by this UI. */
interface UISection extends AudioSection {
  /** Actual end of the window, clamped to the track length. */
  endSec: number;
  /** Real seconds available to play (== durationSec for full sections, less for the remainder). */
  playDurationSec: number;
}

const SECTION_LENGTHS: readonly AudioSectionLength[] = [10, 15];

/** mm:ss for a time in seconds. */
function fmt(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

/** Accept only .mp3 / .wav (extension first; MIME as a fallback since some browsers omit it). */
function isValidAudio(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith('.mp3') || name.endsWith('.wav')) return true;
  return /^audio\/(mpeg|mp3|wav|x-wav|wave|vnd\.wave)$/.test(file.type);
}

function makeAudioContext(): AudioContext {
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return new Ctor!();
}

export function PhaseAudio(props: PhaseAudioProps) {
  const { update } = props;
  const { audioFile, audioSectionLength, selectedAudioSection } = props.state;

  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  /** Identity of the file we've already decoded — guards the decode effect against loops. */
  const decodedFileRef = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [duration, setDuration] = useState(0);
  const [decoding, setDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // ── Playback ──────────────────────────────────────────────────────────────
  const stopPlayback = useCallback(() => {
    const src = sourceRef.current;
    if (src) {
      src.onended = null;
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
      try {
        src.disconnect();
      } catch {
        /* noop */
      }
      sourceRef.current = null;
    }
    setPlayingIndex(null);
  }, []);

  const playSection = useCallback(
    (sec: UISection) => {
      const ctx = ctxRef.current;
      const buffer = bufferRef.current;
      if (!ctx || !buffer || !sec.previewable) return;

      // Toggle off if this section is already playing.
      if (playingIndex === sec.index) {
        stopPlayback();
        return;
      }
      stopPlayback();

      if (ctx.state === 'suspended') void ctx.resume();

      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.onended = () => {
        // Only react to natural end of the *current* source (manual stop nulls onended).
        if (sourceRef.current === src) {
          sourceRef.current = null;
          setPlayingIndex(null);
        }
      };
      src.start(0, sec.startSec, sec.playDurationSec);
      sourceRef.current = src;
      setPlayingIndex(sec.index);
    },
    [playingIndex, stopPlayback],
  );

  // ── Decode ────────────────────────────────────────────────────────────────
  const decodeFile = useCallback(async (file: File) => {
    decodedFileRef.current = file;
    setDecoding(true);
    setError(null);
    setDuration(0);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = ctxRef.current ?? (ctxRef.current = makeAudioContext());
      // decodeAudioData detaches the ArrayBuffer; we hand it a fresh one each time.
      const buffer = await ctx.decodeAudioData(arrayBuffer);
      bufferRef.current = buffer;
      setDuration(buffer.duration);
    } catch {
      bufferRef.current = null;
      setDuration(0);
      setError('Could not decode that file. Please upload a valid .mp3 or .wav.');
    } finally {
      setDecoding(false);
    }
  }, []);

  // Decode whenever the stored file changes (covers both fresh uploads and
  // re-entering this step with a file already in wizard state).
  useEffect(() => {
    if (audioFile && audioFile !== decodedFileRef.current) {
      stopPlayback();
      void decodeFile(audioFile);
    }
    if (!audioFile) {
      decodedFileRef.current = null;
      bufferRef.current = null;
      setDuration(0);
    }
  }, [audioFile, decodeFile, stopPlayback]);

  // Cleanup on unmount: stop any node and release the AudioContext.
  useEffect(() => {
    return () => {
      stopPlayback();
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      bufferRef.current = null;
    };
  }, [stopPlayback]);

  // ── Sectioning ────────────────────────────────────────────────────────────
  const sections = useMemo<UISection[]>(() => {
    if (!duration) return [];
    const out: UISection[] = [];
    const len = audioSectionLength;
    let index = 0;
    // Epsilon avoids a degenerate sliver section from float rounding at the tail.
    for (let start = 0; start < duration - 0.1; start += len) {
      const remaining = duration - start;
      const full = remaining >= len - 0.001;
      out.push({
        index,
        startSec: start,
        durationSec: len,
        previewable: full,
        endSec: Math.min(start + len, duration),
        playDurationSec: full ? len : remaining,
      });
      index += 1;
    }
    return out;
  }, [duration, audioSectionLength]);

  // ── Handlers that write wizard state ────────────────────────────────────────
  const handlePick = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;
      if (!isValidAudio(file)) {
        setError(`"${file.name}" is not supported. Upload an .mp3 or .wav file.`);
        return;
      }
      setError(null);
      stopPlayback();
      // Decode is triggered by the effect watching audioFile.
      update({ audioFile: file, selectedAudioSection: null });
    },
    [stopPlayback, update],
  );

  const setLength = useCallback(
    (len: AudioSectionLength) => {
      if (len === audioSectionLength) return;
      stopPlayback();
      // Re-section happens via useMemo; selection no longer maps to new sections.
      update({ audioSectionLength: len, selectedAudioSection: null });
    },
    [audioSectionLength, stopPlayback, update],
  );

  const selectSection = useCallback(
    (sec: UISection) => {
      if (!sec.previewable) return; // remainder is not a valid performance clip
      const picked: AudioSection = {
        index: sec.index,
        startSec: sec.startSec,
        durationSec: sec.durationSec,
        previewable: sec.previewable,
      };
      update({ selectedAudioSection: picked });
    },
    [update],
  );

  const fullCount = sections.filter((s) => s.previewable).length;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.wav,audio/mpeg,audio/wav,audio/x-wav"
        className="hidden"
        onChange={(e) => {
          handlePick(e.target.files?.[0]);
          e.target.value = ''; // allow re-selecting the same file
        }}
      />

      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 5</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-2">Audio &amp; section</h2>
      <p className="text-[#a1a1aa] mb-6">
        Upload a track, split it into {audioSectionLength}s sections, preview each, and pick the one
        that drives the performance.
      </p>

      {/* Upload / current file */}
      {!audioFile ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handlePick(e.dataTransfer.files?.[0]);
          }}
          className={`dropzone w-full rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 text-center ${
            dragOver ? 'dragover' : ''
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#3b82f6]/15 flex items-center justify-center">
            <Upload size={22} className="text-[#3b82f6]" />
          </div>
          <div className="text-white font-medium">Drop a track or click to upload</div>
          <div className="text-xs text-[#71717a]">.mp3 or .wav</div>
        </button>
      ) : (
        <div className="glass rounded-2xl px-5 py-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 flex items-center justify-center flex-shrink-0">
            <Music size={20} className="text-[#3b82f6]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-medium truncate">{audioFile.name}</div>
            <div className="text-xs text-[#71717a] mt-0.5">
              {decoding ? (
                <span className="inline-flex items-center gap-1.5">
                  <Loader2 size={12} className="animate-spin" /> Decoding…
                </span>
              ) : duration ? (
                `${fmt(duration)} · ${sections.length} section${sections.length === 1 ? '' : 's'}`
              ) : (
                '—'
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn btn-secondary btn-sm flex-shrink-0"
          >
            <RefreshCw size={14} /> Replace
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 text-sm text-[#fca5a5] bg-[#7c1018]/20 border border-[#fca5a5]/30 rounded-xl px-3 py-2.5">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Length toggle */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm text-[#71717a]">Section length</span>
        <div className="inline-flex rounded-xl border border-[#262626] p-1 bg-[#111113]">
          {SECTION_LENGTHS.map((len) => (
            <button
              key={len}
              type="button"
              onClick={() => setLength(len)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                audioSectionLength === len
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              {len}s
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      {audioFile && !decoding && sections.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs tracking-[2px] text-[#71717a]">
              SECTIONS · {fullCount} × {audioSectionLength}s
            </div>
            {selectedAudioSection && (
              <div className="text-xs text-emerald-300">
                Selected #{selectedAudioSection.index + 1}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-auto pr-1">
            {sections.map((sec) => {
              const isSelected = selectedAudioSection?.index === sec.index;
              const isPlaying = playingIndex === sec.index;
              const range = `${fmt(sec.startSec)}–${fmt(sec.endSec)}`;
              return (
                <div
                  key={sec.index}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                    isSelected
                      ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                      : sec.previewable
                        ? 'border-[#262626] bg-[#111113] hover:border-white/25'
                        : 'border-[#1d1d20] bg-[#0d0d0f] opacity-60'
                  }`}
                >
                  {/* Play / pause */}
                  <button
                    type="button"
                    onClick={() => playSection(sec)}
                    disabled={!sec.previewable}
                    aria-label={isPlaying ? `Pause section ${sec.index + 1}` : `Play section ${sec.index + 1}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                      sec.previewable
                        ? isPlaying
                          ? 'bg-[#3b82f6] text-white'
                          : 'bg-white/5 text-white hover:bg-white/10'
                        : 'bg-white/5 text-[#52525b] cursor-not-allowed'
                    }`}
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
                  </button>

                  {/* Label */}
                  <button
                    type="button"
                    onClick={() => selectSection(sec)}
                    disabled={!sec.previewable}
                    className="flex-1 min-w-0 text-left disabled:cursor-not-allowed"
                  >
                    <div className="text-sm font-medium text-white">
                      Section {sec.index + 1}
                    </div>
                    <div className="text-xs text-[#71717a] font-mono">
                      {range}
                      {!sec.previewable && ' · remainder (too short)'}
                    </div>
                  </button>

                  {/* Selected check */}
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#3b82f6] flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!selectedAudioSection && (
            <p className="mt-3 text-xs text-[#71717a]">
              Preview sections, then click one to select it as the performance clip.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
