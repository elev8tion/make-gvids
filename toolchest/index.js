/**
 * make-gvids Toolchest - ESM entry point (for the server which is also ESM)
 */

import { InterceptorPipeline, buildPipeline, defaultPipeline } from './pipeline.js';
import { promptEnhancer } from './interceptors/pre/prompt-enhancer.js';
import { audioAnalyzer } from './interceptors/pre/audio-analyzer.js';
import { audioReplacer } from './interceptors/post/audio-replacer.js';
import { audioLipSyncWav2Lip } from './interceptors/post/audio-lip-sync-wav2lip.js';

// Default pipeline: pre = [promptEnhancer, audioAnalyzer], post = [audioReplacer]
const pipeline = defaultPipeline || buildPipeline();

export {
  InterceptorPipeline,
  buildPipeline,
  defaultPipeline,
  pipeline,
  promptEnhancer,
  audioAnalyzer,
  audioReplacer,
  audioLipSyncWav2Lip,
};
