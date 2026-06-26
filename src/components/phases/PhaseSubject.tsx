import { useCallback, useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Upload, X, Loader2, Scissors, AlertCircle, Check } from 'lucide-react';

import type { BasePhaseProps, SubjectImage } from '../../types/pipeline';
import { isolate, pollJob } from '../../lib/api';

/** Phase 1 — Subject ingest & isolation. Upload 1–3 images, isolate the person. */
export interface PhaseSubjectProps extends BasePhaseProps {}

const MAX_IMAGES = 3;
const ACCEPTED = 'image/png,image/jpeg,image/jpg,image/webp';

export function PhaseSubject({ state, update, onNext }: PhaseSubjectProps) {
  const { subject } = state;
  const images = subject.images;

  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke any object URLs we created when the component unmounts.
  const previewUrls = useRef<Set<string>>(new Set());
  useEffect(() => {
    const created = previewUrls.current;
    return () => {
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const incoming = Array.from(files).filter((f) => f.type.startsWith('image/'));
      if (incoming.length === 0) return;

      const room = MAX_IMAGES - images.length;
      if (room <= 0) {
        setError(`You can upload at most ${MAX_IMAGES} images.`);
        return;
      }

      const next: SubjectImage[] = incoming.slice(0, room).map((file) => {
        const preview = URL.createObjectURL(file);
        previewUrls.current.add(preview);
        return { id: crypto.randomUUID(), file, preview };
      });

      // New uploads invalidate any prior isolation result.
      update({ subject: { images: [...images, ...next] } });
    },
    [images, update],
  );

  const removeImage = useCallback(
    (id: string) => {
      const target = images.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.preview);
        previewUrls.current.delete(target.preview);
      }
      update({ subject: { images: images.filter((img) => img.id !== id) } });
    },
    [images, update],
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const runIsolation = useCallback(async () => {
    if (images.length === 0) {
      setError('Upload at least one photo first.');
      return;
    }
    setBusy(true);
    setError(null);
    setProgress('Removing background…');

    try {
      const isolated: SubjectImage[] = [];
      // Isolate each image independently (fal rembg is single-image).
      for (let i = 0; i < images.length; i++) {
        setProgress(`Removing background ${i + 1} of ${images.length}…`);
        const { jobId } = await isolate([images[i].file]);
        const url = await pollJob(jobId);
        isolated.push({ ...images[i], isolatedUrl: url });
      }

      update({
        subject: {
          images: isolated,
          isolatedUrl: isolated[0]?.isolatedUrl,
        },
      });
      setProgress('Cutout ready');
      onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Background removal failed.');
      setProgress(null);
    } finally {
      setBusy(false);
    }
  }, [images, update, onNext]);

  const isolatedCount = images.filter((img) => img.isolatedUrl).length;

  return (
    <div>
      <div className="text-[#3b82f6] text-xs tracking-[2px] font-medium mb-2">PHASE 1</div>
      <h2 className="text-3xl font-semibold tracking-[-1px] mb-2">Subject</h2>
      <p className="text-[#a1a1aa] mb-6 max-w-2xl">
        Upload 1–3 photos of the performer (same person). We remove the background to produce a
        clean cutout used through the rest of the pipeline.
      </p>

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`dropzone rounded-2xl px-6 py-10 text-center cursor-pointer outline-none ${
          dragOver ? 'dragover' : ''
        } ${images.length >= MAX_IMAGES ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <Upload className="mx-auto mb-3 text-[#3b82f6]" size={28} />
        <div className="font-medium">
          {images.length >= MAX_IMAGES ? 'Maximum reached' : 'Drag photos here, or click to browse'}
        </div>
        <div className="text-sm text-[#71717a] mt-1">
          PNG / JPG / WebP · up to {MAX_IMAGES} images · {images.length}/{MAX_IMAGES} added
        </div>
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative rounded-xl overflow-hidden border border-[#262626] bg-[#0a0a0c] aspect-[3/4] group"
            >
              <img
                src={img.isolatedUrl ?? img.preview}
                alt="Subject reference"
                className="w-full h-full object-cover"
              />
              {img.isolatedUrl && (
                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] px-2 py-0.5">
                  <Check size={10} /> cutout
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                disabled={busy}
                aria-label="Remove image"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition disabled:opacity-30"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Status / errors */}
      {error && (
        <div className="mt-5 flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {busy && progress && (
        <div className="mt-5 flex items-center gap-2 text-sm text-[#a1a1aa]">
          <Loader2 size={16} className="animate-spin text-[#3b82f6]" />
          {progress}
        </div>
      )}

      {/* Action */}
      <div className="mt-7 flex items-center gap-3">
        <button
          type="button"
          onClick={runIsolation}
          disabled={busy || images.length === 0}
          className="btn btn-primary px-6 flex items-center gap-2"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Scissors size={16} />}
          {isolatedCount === images.length && isolatedCount > 0
            ? 'Re-isolate & continue'
            : 'Remove background & continue'}
        </button>
        {isolatedCount > 0 && !busy && (
          <span className="text-xs text-[#71717a]">
            {isolatedCount}/{images.length} isolated
          </span>
        )}
      </div>
    </div>
  );
}
