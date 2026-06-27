// Shared pipeline types for the make-gvids 8-step wizard (Stage 0 foundation).
// These are the contract every phase + the backend seams implement against.
// Phases map 1:1 to the workflow docs (docs/workflow/phase-01..08).

// ────────────────────────────────────────────────────────────────────────────
// Output format (cross-cutting — aspect chosen ~Phase 4, resolution ~Phase 6)
// ────────────────────────────────────────────────────────────────────────────
export type Resolution = '480p' | '720p';
/** User-facing aspect choice. `both` = produce two orientations. */
export type AspectChoice = '9:16' | '16:9' | 'both';
/** A concrete produced orientation (never `both`). */
export type VideoAspect = '9:16' | '16:9';

export interface OutputFormat {
  resolution: Resolution;
  aspect: AspectChoice;
}

/** Phase 4 compose path: A = quick/prompt, B = precise/element-ref. */
export type ComposeMode = 'A' | 'B';

// ────────────────────────────────────────────────────────────────────────────
// Phase 1 — Subject ingest & isolation
// ────────────────────────────────────────────────────────────────────────────
export interface SubjectImage {
  id: string;
  /** Original uploaded file. */
  file: File;
  /** Local preview (object URL / data URL) for the upload UI. */
  preview: string;
  /** Background-removed cutout URL, filled in by the backend (fal rembg). */
  isolatedUrl?: string;
}

export interface Subject {
  /** 1–3 uploaded images of the same person. */
  images: SubjectImage[];
  /** The chosen/best isolated cutout handed to Phase 2 (backend-filled). */
  isolatedUrl?: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 2 — Outfit selection (4 slots, each optional; blank = keep original)
// ────────────────────────────────────────────────────────────────────────────
export interface OutfitSelection {
  /** Asset id, e.g. `fit3_top`. */
  topId?: string;
  bottomId?: string;
  shoeId?: string;
  hatId?: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 3 — Scene / background selection
// ────────────────────────────────────────────────────────────────────────────
export interface Scene {
  /** Scene id stem, e.g. `gv-001`. */
  id: string;
  /** Clean background plate (`thumbnails/<id>.png`). */
  thumbnailUrl: string;
  /** Composition reference (`refs/<id>.png`) — placement/pose/scale/light guide. */
  refUrl: string;
  /** Pre-written scene prompt text (for compose Path A). */
  description: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 5 — Audio upload & section selection
// ────────────────────────────────────────────────────────────────────────────
export type AudioSectionLength = 10 | 15;

export interface AudioSection {
  /** Position in the consecutive-section list. */
  index: number;
  startSec: number;
  durationSec: AudioSectionLength;
  /** Whether this section can be previewed (false for a short trailing remainder). */
  previewable: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// Phase 7 / 8 — Result + download
// ────────────────────────────────────────────────────────────────────────────
export interface ResultVideo {
  aspect: VideoAspect;
  url: string;
}

// ────────────────────────────────────────────────────────────────────────────
// Job / step status (pipeline progress reporting)
// ────────────────────────────────────────────────────────────────────────────
export type StepStatus = 'idle' | 'pending' | 'running' | 'done' | 'error';
export type JobStatus = 'idle' | 'queued' | 'processing' | 'done' | 'error';

// ────────────────────────────────────────────────────────────────────────────
// Wizard state machine
// ────────────────────────────────────────────────────────────────────────────
/** Stable keys for the 8 wizard steps (index === step order). */
export type WizardStepKey =
  | 'subject'
  | 'outfit'
  | 'scene'
  | 'compose'
  | 'audio'
  | 'animate'
  | 'result'
  | 'download';

export interface WizardStepMeta {
  key: WizardStepKey;
  /** Short title shown in the stepper. */
  title: string;
  /** Workflow phase number (1–8). */
  phase: number;
}

export const WIZARD_STEPS: readonly WizardStepMeta[] = [
  { key: 'subject', title: 'Subject', phase: 1 },
  { key: 'outfit', title: 'Outfit', phase: 2 },
  { key: 'scene', title: 'Scene', phase: 3 },
  { key: 'compose', title: 'Compose', phase: 4 },
  { key: 'audio', title: 'Audio', phase: 5 },
  { key: 'animate', title: 'Animate', phase: 6 },
  { key: 'result', title: 'Result', phase: 7 },
  { key: 'download', title: 'Download', phase: 8 },
] as const;

export const WIZARD_STEP_COUNT = WIZARD_STEPS.length;

/**
 * The full wizard state. `currentStep` is the active step index (0–7); every
 * other field is per-phase state, accumulated as the user advances.
 */
export interface WizardState {
  currentStep: number;

  // Phase 1 — Subject
  subject: Subject;

  // Phase 2 — Outfit
  outfit: OutfitSelection;

  // Phase 3 — Scene
  scene: Scene | null;

  // Phase 4 — Compose
  composeMode: ComposeMode;
  /** Optional long custom scene prompt that supplements/overrides the default. */
  customScenePrompt: string;
  composedImageUrl: string | null;
  /** 'portrait' = tight face (best lip-sync), 'fullBody' = whole figure visible */
  framing: 'portrait' | 'fullBody';

  // Phase 5 — Audio
  audioFile: File | null;
  audioSectionLength: AudioSectionLength;
  selectedAudioSection: AudioSection | null;

  // Phase 6 — Animate
  /** Performance prompt: body actions + camera movement (≤2500 chars). */
  performancePrompt: string;

  // Cross-cutting output spec (aspect set ~Phase 4, resolution ~Phase 6)
  output: OutputFormat;

  // Pipeline progress
  jobStatus: JobStatus;

  // Phase 7 / 8 — Result(s)
  resultVideos: ResultVideo[];
}

/** Factory for a fresh wizard state. */
export function createInitialWizardState(): WizardState {
  return {
    currentStep: 0,
    subject: { images: [] },
    outfit: {},
    scene: null,
    composeMode: 'A',
    customScenePrompt: '',
    composedImageUrl: null,
    framing: 'portrait',
    audioFile: null,
    audioSectionLength: 10,
    selectedAudioSection: null,
    performancePrompt: '',
    output: { resolution: '720p', aspect: '9:16' },
    jobStatus: 'idle',
    resultVideos: [],
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Phase component contract
// ────────────────────────────────────────────────────────────────────────────
/**
 * Props every phase component receives from the wizard shell. Downstream agents
 * implement each phase against its own interface (which extends this base).
 */
export interface BasePhaseProps {
  /** Current wizard state (read-only — mutate via `update`). */
  state: WizardState;
  /** Merge a partial patch into wizard state. */
  update: (patch: Partial<WizardState>) => void;
  /** Advance to the next step (no-op if the step can't proceed). */
  onNext: () => void;
  /** Return to the previous step. */
  onBack: () => void;
}
