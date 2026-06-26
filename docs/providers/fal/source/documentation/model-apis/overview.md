# Model APIs

**Source:** https://fal.ai/docs/documentation/model-apis/overview.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Model APIs

> Access 1,000+ production-ready AI models through simple API calls

Model APIs gives you instant access to state-of-the-art AI models for image, video, audio, and multimodal generation. Every model is already optimized and production-ready, so you can [authenticate](/documentation/model-apis/authentication) and start generating immediately.

Each model runs on fal's infrastructure with automatic scaling, [queue-based reliability](/documentation/model-apis/inference/queue), and [pay-per-use billing](/documentation/model-apis/pricing). You call them the same way whether you use the [Python or JavaScript client](/documentation/model-apis/inference/client-setup) or raw HTTP. If you need to deploy your own model instead, see [Serverless](/documentation/serverless).

## Quick Example

Generate an image in three lines of code. Install the client, set your [API key](/documentation/model-apis/authentication), and call a model.

  ```python Python theme={null}
  import fal_client

  result = fal_client.subscribe("fal-ai/nano-banana-2", arguments={
      "prompt": "a futuristic cityscape at sunset"
  })
  print(result["images"][0]["url"])
  ```

  ```javascript JavaScript theme={null}
  import { fal } from "@fal-ai/client";

  const result = await fal.subscribe("fal-ai/nano-banana-2", {
    input: { prompt: "a futuristic cityscape at sunset" }
  });
  console.log(result.data.images[0].url);
  ```

  ```bash cURL theme={null}
  curl -X POST "https://queue.fal.run/fal-ai/nano-banana-2" \
    -H "Authorization: Key $FAL_KEY" \
    -H "Content-Type: application/json" \
    -d '{"prompt": "a futuristic cityscape at sunset"}'
  ```

The response includes a [CDN URL](/documentation/model-apis/fal-cdn) for the generated image, along with metadata like dimensions and seed. Every model follows the same pattern: send inputs as JSON, receive outputs as JSON with media URLs.

## How It Works

Every model on fal is exposed as an HTTP endpoint. You can call it directly, or go through the [queue](/documentation/model-apis/inference/queue) for automatic retries, status tracking, and scaling. There are several calling patterns depending on your use case.

**[Direct (`run`)](/documentation/model-apis/inference/synchronous)** sends a synchronous HTTP request to `fal.run` and returns the result directly. This is the simplest approach for quick scripts and prototyping.

**[Subscribe](/documentation/model-apis/inference/synchronous)** uses the queue under the hood but handles polling automatically, so it feels synchronous. This is what the Quick Example above uses.

**[Asynchronous (`submit`)](/documentation/model-apis/inference/queue)** gives you full control over the queue. Submit a request and return immediately, then poll for status or receive results via [webhook](/documentation/model-apis/inference/webhooks). This is the recommended approach for production workloads with parallel processing.

**[Streaming](/documentation/model-apis/inference/streaming)** delivers output progressively as the model generates it. This is useful for LLMs that produce tokens incrementally, or for showing generation progress in a UI.

**[`realtime()`](/documentation/model-apis/inference/real-time)** uses WebSockets for persistent connections, bypassing the queue entirely for sub-100ms latency. Only available for models with an explicit real-time endpoint.

## What You Can Generate

The [model gallery](https://fal.ai/models) has 1,000+ models spanning several categories. Here are some popular starting points.

### Image Generation and Editing

  - **[Nano Banana 2](https://fal.ai/models/fal-ai/nano-banana-2)** — Google's fast image generation and editing model

  - **[Nano Banana Pro](https://fal.ai/models/fal-ai/nano-banana-pro)** — State-of-the-art image generation with realism and typography

  - **[Flux 2 Flex](https://fal.ai/models/fal-ai/flux-2-flex)** — Enhanced typography and text rendering from BFL

  - **[Recraft V4 Pro](https://fal.ai/models/fal-ai/recraft/v4/pro/text-to-image)** — Professional design and marketing visuals

  - **[Nano Banana 2 Edit](https://fal.ai/models/fal-ai/nano-banana-2/edit)** — Intelligent image editing with Google's latest model

  - **[FLUX Kontext Pro](https://fal.ai/models/fal-ai/flux-pro/kontext)** — Targeted edits and complex scene transformations

### Video Generation

  - **[Veo 3.1](https://fal.ai/models/fal-ai/veo3.1)** — Google DeepMind's latest video model with sound

  - **[Kling 3.0 Pro](https://fal.ai/models/fal-ai/kling-video/v2.5-turbo/pro/image-to-video)** — Cinematic image-to-video with fluid motion

  - **[Kling O3](https://fal.ai/models/fal-ai/kling-video/o3/standard/image-to-video)** — Start and end frame animation with scene guidance

  - **[Sora 2](https://fal.ai/models/fal-ai/sora-2/text-to-video)** — OpenAI's video model with audio generation

  - **[LTX-2 19B](https://fal.ai/models/fal-ai/ltx-2-19b/image-to-video)** — Video with audio from images using LTX-2

  - **[Sora 2 Pro](https://fal.ai/models/fal-ai/sora-2/text-to-video/pro)** — OpenAI's premium video model with enhanced quality

### Audio and Speech

  - **[Chatterbox TTS](https://fal.ai/models/fal-ai/chatterbox/text-to-speech)** — Natural text-to-speech from Resemble AI

  - **[MiniMax Speech-02 HD](https://fal.ai/models/fal-ai/minimax/speech-02-hd)** — High-quality multi-voice text-to-speech

  - **[Dia TTS](https://fal.ai/models/fal-ai/dia-tts/voice-clone)** — Multi-speaker dialogue with voice cloning

  - **[Beatoven Music](https://fal.ai/models/fal-ai/beatoven/music-generation)** — Royalty-free instrumental music generation

  - **[Beatoven SFX](https://fal.ai/models/fal-ai/beatoven/sound-effect-generation)** — Professional sound effect generation

  - **[ElevenLabs Music](https://fal.ai/models/fal-ai/elevenlabs/music)** — High quality, realistic music generation

- **[Explore All Models](https://fal.ai/explore)** — Browse 1,000+ models across image, video, audio, 3D, and more

Every model page on fal.ai includes a [Playground](/documentation/model-apis/playground) for testing, full API documentation with [input/output schemas](/documentation/model-apis/common-parameters), [pricing](/documentation/model-apis/pricing), and ready-to-copy code examples.

## Next Steps

  - **[Playground](/documentation/model-apis/playground)** — Test and compare models interactively before integrating

  - **[Inference](/documentation/model-apis/inference)** — Learn the different ways to call models

  - **[Client Setup](/documentation/model-apis/inference/client-setup)** — Install and configure the fal client for Python, JavaScript, and more

  - **[Examples](/examples)** — Step-by-step tutorials for image, video, and audio generation

