# Quick Start

**Source:** https://fal.ai/docs/documentation/quickstart.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Quick Start

> Get started with fal in minutes

fal gives you two ways to work with AI models. If you want to generate images, video, audio, or other media, the [Model APIs](/documentation/model-apis/overview) let you call 1,000+ production-ready models with a single API call. If you have your own model to deploy, [Serverless](/documentation/serverless) gives you the full lifecycle: develop, test, deploy, and scale on the same infrastructure that powers the [marketplace](https://fal.ai/models).

Both paths start with an [API key](/documentation/model-apis/authentication) and take a few minutes. The "consume" path is for calling existing models through fal's [client libraries](/documentation/model-apis/inference/client-setup) or HTTP. The "deploy" path is for teams bringing their own models to run on fal's GPU infrastructure, using the same [fal.App](/documentation/development/app-setup) framework that powers every model on the platform.

  
    ### What do you want to build?

    
      - **[Generate Images](/examples/image-generation/generate-images-from-text)** — Create images from text prompts with FLUX, Nano Banana 2, and more

      - **[Generate Videos](/examples/video-generation/generate-videos-from-image)** — Transform images into videos with Kling 3.0, Sora 2, and other models

      - **[Transcribe Audio](/examples/audio-speech/convert-speech-to-text)** — Convert speech to text with Whisper

      - **[Use LLMs](/examples/integrations/use-llms)** — Build with Llama, Mistral, and other large language models

      - **[Fast FLUX](/examples/image-generation/fast-flux)** — Ultra-fast image generation with optimized FLUX

      - **[Build a Workflow UI](/examples/integrations/custom-workflow-ui)** — Create interfaces for complex AI workflows

      - **[Next.js Integration](/examples/integrations/nextjs)** — Build full-stack AI apps with Next.js and fal

      - **[Vercel Integration](/examples/integrations/vercel)** — Deploy AI-powered apps on Vercel with fal

      - **[n8n Integration](/examples/integrations/n8n)** — Automate workflows by connecting fal models to n8n

    

    ### Quick example

    Generate your first image in under a minute.

    
      
**Install the client**
```bash Python theme={null}
          pip install fal-client
          ```

          ```bash JavaScript theme={null}
          npm install @fal-ai/client
          ```

      
**Set your API key**
Get a key from the [fal dashboard](https://fal.ai/dashboard/keys) and set it as an environment variable:

        ```bash theme={null}
        export FAL_KEY="your-api-key-here"
        ```

      
**Generate an image**
```python Python theme={null}
          import fal_client

          result = fal_client.subscribe("fal-ai/flux/schnell", arguments={
              "prompt": "a futuristic cityscape at sunset"
          })
          print(result["images"][0]["url"])
          ```

          ```javascript JavaScript theme={null}
          import { fal } from "@fal-ai/client";

          const result = await fal.subscribe("fal-ai/flux/schnell", {
            input: { prompt: "a futuristic cityscape at sunset" }
          });
          console.log(result.data.images[0].url);
          ```

          ```bash cURL theme={null}
          curl -X POST "https://queue.fal.run/fal-ai/flux/schnell" \
            -H "Authorization: Key $FAL_KEY" \
            -H "Content-Type: application/json" \
            -d '{"prompt": "a futuristic cityscape at sunset"}'
          ```

    
  

  
    ### What do you want to deploy?

    
      - **[Text-to-Image Model](/examples/image-generation/deploy-text-to-image-model)** — Deploy Sana, FLUX, or your custom image generation model

      - **[Text-to-Video Model](/examples/video-generation/deploy-text-to-video-model)** — Deploy WAN or other video generation models

      - **[Text-to-Speech Model](/examples/audio-speech/deploy-text-to-speech-model)** — Deploy Kokoro or custom voice synthesis models

      - **[Text-to-Music Model](/examples/audio-speech/deploy-text-to-music-model)** — Deploy DiffRhythm or music generation models

      - **[ComfyUI Server](/examples/image-generation/deploy-comfyui-server)** — Run ComfyUI workflows as a serverless API

      - **[LoRA Training](/examples/image-generation/deploy-wan-lora-training)** — Fine-tune WAN video generation with LoRA training

      - **[Multi-GPU Inference](/examples/video-generation/deploy-multi-gpu-inference)** — Scale generation across multiple GPUs with streaming

      - **[3D Progressive Rendering](/examples/video-generation/deploy-3d-progressive-rendering)** — Stream real-time text-to-3D reconstruction

      - **[Real-time Video-to-Video](/examples/video-generation/deploy-realtime-video-to-video-model)** — Run real-time video-to-video with object detection

      - **[Real-time World Model](/examples/video-generation/deploy-realtime-world-model)** — Deploy a real-time world model powered by Matrix-Game

      - **[Custom Container](/examples/deploy-models-with-custom-containers)** — Deploy any model with custom Docker containers

    

    ### Migrating from another platform?

    
      - **[Migrate from Replicate](/examples/integrations/migrate-from-replicate)** — Move your Replicate models to fal

      - **[Migrate from Modal](/examples/integrations/migrate-from-modal)** — Move your Modal apps to fal

      - **[Migrate from RunPod](/examples/integrations/migrate-from-runpod)** — Move your RunPod Serverless workers to fal

      - **[Migrate Docker Server](/examples/integrations/migrate-external-docker-server)** — Move your existing Docker-based inference server to fal

    

    ### Quick example

    Deploy your first app in under 2 minutes.

    
      
**Install the CLI and authenticate**
```bash theme={null}
        pip install fal
        fal auth login
        ```

      
**Create your app**
Create a file called `my_app.py`:

        ```python my_app.py theme={null}
        import fal

        class MyApp(fal.App):
            @fal.endpoint("/")
            def run(self, prompt: str) -> dict:
                return {"message": f"Hello from fal! You said: {prompt}"}
        ```

      
**Test on cloud GPUs**
```bash theme={null}
        fal run my_app.py::MyApp
        ```

      
**Deploy to production**
```bash theme={null}
        fal deploy my_app.py::MyApp
        ```

    

    - **[Deploy a real model](/documentation/development/getting-started/deploy-your-first-image-generator)** — Step-by-step guide to deploying an image generation model

  

***

## Next Steps

  - **[Get Your API Key](/documentation/model-apis/authentication)** — Create an API key to authenticate your requests

  - **[AI Tools](/documentation/model-apis/mcp)** — Use AI coding assistants to build with fal faster

  - **[Explore Models](https://fal.ai/models)** — Browse 1,000+ available models

