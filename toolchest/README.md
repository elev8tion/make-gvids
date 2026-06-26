# make-gvids Toolchest

Custom, fully-owned interceptors and tools that sit around the video generation call.

The toolchest is **provider-agnostic**: it wraps whatever generation API you wire
into `server/provider.js` with a pre/post interceptor pipeline. The actual API call
is injected as a callback, so the pipeline never needs to know which provider you use.

## Philosophy
- The generation provider is pluggable (Replicate, Fal, Runway, Luma, Pika, Kling, …).
- Everything around the call is code we control and can improve.
- Inspired by real production pipeline patterns, adapted to a clean, self-owned tool approach.

## Current Interceptors

### Pre (before the generation call)
- `prompt-enhancer` — Strengthens the prompt with explicit reference image and audio instructions.
- `audio-analyzer` — Injects data-driven timing/phrasing hints derived from the user's audio.

### Post (after the generation call)
- `audio-replacer` — Replaces the generated audio track with the user's exact clip using ffmpeg.
- `audio-lip-sync-wav2lip` — Optional Wav2Lip lip-sync pass (enabled via `WAV2LIP_ENABLED=1`).

## How to Use (in server/index.js)

```ts
import { InterceptorPipeline, promptEnhancer, audioReplacer } from '../toolchest';

const pipeline = new InterceptorPipeline()
  .registerPre(promptEnhancer)
  .registerPost(audioReplacer);

// Later, when generating — the provider call is injected:
const finalVideoUrl = await pipeline.execute(payload, context, async (req) => {
  const { requestId, resultUrl } = await provider.submitGeneration(req);
  return resultUrl; // or resolve the requestId via provider.pollStatus()
});
```

In practice `server/index.js` calls `runPre()` and `runPost()` directly so it can
respond to the client between the two phases while the provider job runs.

## Future Tool Ideas
- Face normalizer / best-frame selector
- Structured outfit / clothing prompting
- Lyrics / text overlay engine
- Audio feature extractor (beat grid, phoneme timestamps) for better prompting
- Quality scorer + auto-retry
- Background / lighting harmonization

This folder is meant to grow as our own private toolchest, 100% under our control.
