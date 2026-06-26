import type { PreInterceptor, PostInterceptor, VideoGenRequest, GenerationContext, PipelineStep, PipelineStepExecution } from './types';
import { audioAnalyzer } from './interceptors/pre/audio-analyzer';
import { promptEnhancer } from './interceptors/pre/prompt-enhancer';
import { audioReplacer } from './interceptors/post/audio-replacer';
import { audioLipSyncWav2Lip } from './interceptors/post/audio-lip-sync-wav2lip';

export interface PipelineExecutionResult {
  finalVideoUrl: string;
  steps: PipelineStepExecution[];
}

export class PipelineInterceptorError extends Error {
  stage: 'pre' | 'post';
  interceptor: string;

  constructor(stage: 'pre' | 'post', interceptor: string, message: string) {
    super(message);
    this.stage = stage;
    this.interceptor = interceptor;
  }
}

export class InterceptorPipeline {
  private preInterceptors: PreInterceptor[] = [];
  private postInterceptors: PostInterceptor[] = [];

  registerPre(interceptor: PreInterceptor) {
    this.preInterceptors.push(interceptor);
    return this;
  }

  registerPost(interceptor: PostInterceptor) {
    this.postInterceptors.push(interceptor);
    return this;
  }

  getPreInterceptors() {
    return [...this.preInterceptors];
  }

  getPostInterceptors() {
    return [...this.postInterceptors];
  }

  private async runInterceptors<T>(
    stage: 'pre' | 'post',
    interceptors: Array<PreInterceptor | PostInterceptor>,
    value: T,
    context: GenerationContext,
    steps: PipelineStepExecution[],
  ): Promise<T> {
    let current: any = value;

    for (const interceptor of interceptors) {
      const stepName: PipelineStep = stage === 'pre'
        ? (interceptor.name === 'audio-analyzer' ? 'audio_analysis' : 'enhance_prompt')
        : 'audio_merge';

      const start = Date.now();
      const stepEntry: PipelineStepExecution = {
        name: stepName,
        status: 'running',
        startedAt: start,
      };
      steps.push(stepEntry);

      try {
        console.debug(`[Toolchest] ${stage} interceptor start: ${interceptor.name}`);
        if (stage === 'pre') {
          current = await (interceptor as PreInterceptor).run(current, context);
        } else {
          current = await (interceptor as PostInterceptor).run(current as any, context);
        }
        stepEntry.status = 'completed';
        stepEntry.durationMs = Date.now() - start;
        console.debug(`[Toolchest] ${stage} interceptor done: ${interceptor.name} in ${stepEntry.durationMs}ms`);
      } catch (err: any) {
        stepEntry.status = 'failed';
        stepEntry.durationMs = Date.now() - start;
        console.error(`[Toolchest] ${stage} interceptor failed: ${interceptor.name}`, err);
        throw new PipelineInterceptorError(stage, interceptor.name, err?.message || 'Interceptor failed');
      }
    }

    return current as T;
  }

  async runPre(
    initialRequest: VideoGenRequest,
    context: GenerationContext,
  ): Promise<{ request: VideoGenRequest; steps: PipelineStepExecution[] }> {
    const steps: PipelineStepExecution[] = [];
    const request = await this.runInterceptors('pre', this.preInterceptors, initialRequest, context, steps);
    return { request, steps };
  }

  async runPost(
    initialVideoUrl: string,
    context: GenerationContext,
  ): Promise<{ videoUrl: string; steps: PipelineStepExecution[] }> {
    const steps: PipelineStepExecution[] = [];
    const videoUrl = await this.runInterceptors('post', this.postInterceptors, initialVideoUrl, context, steps);
    return { videoUrl, steps };
  }

  /**
   * Executes the full pre → generation → post pipeline.
   * Designed for maximum observability and long-term maintainability.
   */
  async execute(
    initialRequest: VideoGenRequest,
    context: GenerationContext,
    generateCall: (req: VideoGenRequest) => Promise<string>
  ): Promise<PipelineExecutionResult> {
    const steps: PipelineStepExecution[] = [];

    // === Pre-processing phase ===
    const { request, steps: preSteps } = await this.runPre(initialRequest, context);
    steps.push(...preSteps);

    // === Core generation call (as its own step) ===
    const start = Date.now();
    const coreStep: PipelineStepExecution = { name: 'video_gen', status: 'running', startedAt: start };
    steps.push(coreStep);
    let videoUrl: string;
    try {
      console.debug(`[Toolchest] core generation call start`);
      videoUrl = await generateCall(request);
      coreStep.status = 'completed';
      coreStep.durationMs = Date.now() - start;
      console.debug(`[Toolchest] core generation call done in ${coreStep.durationMs}ms`);
    } catch (err: any) {
      coreStep.status = 'failed';
      coreStep.durationMs = Date.now() - start;
      throw err;
    }

    if (!videoUrl) {
      throw new Error('Generation call returned no video URL');
    }

    // === Post-processing phase ===
    const { videoUrl: finalVideoUrl, steps: postSteps } = await this.runPost(videoUrl, context);
    steps.push(...postSteps, { name: 'done', status: 'completed' });

    return {
      finalVideoUrl,
      steps,
    };
  }
}

export interface BuildPipelineOptions {
  enableAudioAnalysis?: boolean;
  enablePromptEnhancer?: boolean;
  enableAudioReplace?: boolean;
  enableWav2Lip?: boolean;
  preInterceptors?: PreInterceptor[];
  postInterceptors?: PostInterceptor[];
}

export function buildPipeline(opts: BuildPipelineOptions = {}): InterceptorPipeline {
  const pipeline = new InterceptorPipeline();
  const {
    enableAudioAnalysis = true,
    enablePromptEnhancer = true,
    enableAudioReplace = true,
    enableWav2Lip = false,
    preInterceptors,
    postInterceptors,
  } = opts;

  const registerPre = (interceptor: PreInterceptor) => {
    if ((interceptor === audioAnalyzer || interceptor.name === audioAnalyzer.name) && !enableAudioAnalysis) {
      return;
    }
    if ((interceptor === promptEnhancer || interceptor.name === promptEnhancer.name) && !enablePromptEnhancer) {
      return;
    }
    pipeline.registerPre(interceptor);
  };

  const registerPost = (interceptor: PostInterceptor) => {
    if ((interceptor === audioReplacer || interceptor.name === audioReplacer.name) && !enableAudioReplace) {
      return;
    }
    if ((interceptor === audioLipSyncWav2Lip || interceptor.name === audioLipSyncWav2Lip.name) && !enableWav2Lip) {
      return;
    }
    pipeline.registerPost(interceptor);
  };

  if (preInterceptors?.length) {
    preInterceptors.forEach(registerPre);
  } else {
    registerPre(audioAnalyzer);
    registerPre(promptEnhancer);
  }

  if (postInterceptors?.length) {
    postInterceptors.forEach(registerPost);
  } else {
    registerPost(audioReplacer);
    if (enableWav2Lip) registerPost(audioLipSyncWav2Lip);
  }

  return pipeline;
}

export const defaultPipeline = buildPipeline({
  preInterceptors: [promptEnhancer, audioAnalyzer],
  postInterceptors: [audioReplacer],
});
