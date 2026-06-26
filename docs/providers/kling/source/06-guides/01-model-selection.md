# Model Selection Guide

**Last updated:** 2026-06  
**Related:** [Video Pricing](../07-pricing/01-video-pricing.md) · [Image Pricing](../07-pricing/02-image-pricing.md)

## Overview

Kling AI offers 15+ video models and 9+ image models spanning three generations (v1, v2, v3). This guide helps you pick the right model for your use case, budget, and quality requirements.

---

## Video Models — Decision Matrix

### By Use Case

| Use Case | Recommended Model | Why |
|---|---|---|
| **Social media clips (TikTok, Reels, Shorts)** | kling-3.0-turbo | Fastest v3 generation, native audio, 720p–1080p, $0.084–0.14/s |
| **Cinematic quality short film** | kling-v3 (4K) | Highest visual fidelity at 4K, $0.42/s |
| **Multi-scene storyboard** | kling-v3-omni | Native multi-shot support, element references, voice control |
| **Talking head / presenter** | Avatar (image2video) | Image + TTS → talking avatar. $0.056–0.112/s. Or Lip Sync for simpler lip-sync only ($0.07/5s) |
| **Product demo with camera moves** | kling-v2-6 + Motion Control | Motion brush + camera control at low cost ($0.042–0.07/s) |
| **Fast iteration / A/B testing** | kling-v2-5-turbo | Cheapest non-v1 model at $0.042/s (720p). Good enough for drafts |
| **Lowest possible cost** | kling-v1 (720p) | $0.028/s — legacy quality but functional for prototyping |
| **Character consistency across scenes** | kling-v3-omni | Element library for reusable characters, scenes, voices |
| **AI-generated soundtrack** | kling-v3 + native audio | Built-in audio generation with video (no separate TTS call) |
| **Video from multiple reference images** | kling-v1-6 (multi-image) | Legacy but uniquely supports multi-image input per video |
| **Extend an existing video** | kling-v1-6 (Video Extension) | Only v1 models support extension. $0.28/call at 720p |

### By Generation (Quality → Speed → Cost)

| Generation | Models | Quality | Speed | Cost (720p/s) | Best For |
|---|---|---|---|---|---|
| **v3** | kling-v3, v3-omni, 3.0-turbo, video-o1 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | $0.084–0.14 | Production, storytelling |
| **v2** | v2-6, v2-5-turbo, v2-1, v2-1-master | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | $0.042–0.28 | Fast iteration, motion control |
| **v1** | v1-6, v1-5, v1 | ⭐⭐⭐ | ⭐⭐⭐ | $0.028–0.098 | Prototyping, extension, multi-image |

### Quick Cost Comparison (5s Video, 1080p, No Audio)

| Model | Cost per 5s Clip | Relative |
|---|---|---|
| kling-3.0-turbo | $0.70 | 5.0× |
| kling-v3 | $0.56 | 4.0× |
| kling-v3-omni | $0.56 | 4.0× |
| kling-video-o1 | $0.56 | 4.0× |
| kling-v2-6 | $0.35 | 2.5× |
| kling-v2-5-turbo | $0.35 | 2.5× |
| kling-v2-1 | $0.49 | 3.5× |
| kling-v2-1-master | $1.40 | 10× |
| kling-v1-6 | $0.49 | 3.5× |
| kling-v1 | $0.49 | 3.5× |
| **kling-v1 (720p)** | **$0.14** | **1.0× (baseline)** |

---

## Feature Availability Matrix

| Feature | v3 Turbo | v3 | v3 Omni | O1 | v2-6 | v2-5T | v2-1 | v1-6 |
|---|---|---|---|---|---|---|---|---|
| Text-to-Video | — | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Image-to-Video | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Multi-shot | ✅ | ✅ | ✅ | ✅ | — | — | — | — |
| End frame control | ✅ | ✅ | ✅ | — | — | — | — | — |
| Native audio (no voice) | ✅ | ✅ | ✅ | — | ✅ | — | — | — |
| Native audio + voice control | — | — | ✅ | — | ✅ | — | — | — |
| Motion control | — | ✅ | — | — | ✅ | ✅ | ✅ | ✅ |
| Camera control | — | ✅ | — | — | ✅ | ✅ | ✅ | ✅ |
| Element references | ✅ | ✅ | ✅ | ✅ | — | — | — | — |
| Voice references | — | ✅ | ✅ | — | ✅ | — | — | — |
| 4K output | — | ✅ | ✅ | — | — | — | — | — |
| Video extension | — | — | — | — | — | — | — | ✅ |
| Multi-image input | — | — | — | — | — | — | — | ✅ |
| 3.0 Turbo endpoint | ✅ | — | — | — | — | — | — | — |
| v1 API endpoint | — | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ |

---

## Image Models — Decision Matrix

### By Use Case

| Use Case | Recommended Model | Why |
|---|---|---|
| **General text-to-image** | kling-image-v3 | Latest quality at $0.028/image (2K) |
| **High-res 4K output** | kling-image-v3-omni | Only model supporting 4K at $0.056/image |
| **Face/character consistency** | kling-image-v1-5 + face reference | `image_reference: "face"` with human_fidelity tuning |
| **Image variation / img2img** | kling-image-v3-omni | Best img2img fidelity |
| **Multi-image composition** | kling-image-v2-1 (multi) | Merge multiple references. $0.056/image |
| **Cheapest possible image** | kling-image-v1 | $0.0035/image (1K) — 8× cheaper than v3 |
| **Fashion / clothing try-on** | kolors-virtual-try-on-v1-5 | Upper+lower combo support. $0.07/image |
| **Batch generation (n=9)** | kling-image-v2-1 | $0.014/image at 2K — cheapest v2 for bulk |

### Quick Cost Comparison

| Model | Resolution | Text-to-Image | Image-to-Image | Multi-image |
|---|---|---|---|---|
| kling-image-v3 | 2K | $0.028 | $0.028 | — |
| kling-image-v3-omni | 2K | $0.028 | $0.028 | — |
| kling-image-v3-omni | 4K | $0.056 | $0.056 | — |
| kling-image-o1 | 2K | $0.028 | $0.028 | — |
| kling-image-v2-1 | 2K | $0.014 | $0.028 | $0.056 |
| kling-image-v2 | 2K | $0.014 | $0.028 | $0.056 |
| kling-image-v1-5 | 1K | $0.014 | $0.028 | — |
| kling-image-v1 | 1K | $0.0035 | $0.0035 | — |

---

## Decision Flowcharts

### Video Model Selection

```
Need to generate a video?
│
├─ Need audio + video in one call?
│   ├─ With custom voice? → kling-v3-omni or kling-v2-6
│   └─ Ambient/narration only? → kling-3.0-turbo or kling-v3
│
├─ Multi-scene storyboard? (2–6 shots)
│   └─ → kling-3.0-turbo or kling-v3-omni
│
├─ Precise camera or object motion?
│   └─ → kling-v2-6 + motion/camera control
│
├─ Character must look the same across scenes?
│   └─ → kling-v3-omni + element library
│
├─ Need to extend a video beyond 15s?
│   └─ → kling-v1-6 (chain extensions)
│
├─ Budget ≤ $0.20 per clip?
│   └─ → kling-v1 (720p, 5s = $0.14)
│
├─ Fastest iteration?
│   └─ → kling-v2-5-turbo (720p, $0.042/s)
│
└─ Best quality, budget no concern?
    └─ → kling-v3-omni (4K, $0.42/s)
```

### Image Model Selection

```
Need to generate an image?
│
├─ Highest quality? → kling-image-v3-omni (4K, $0.056)
├─ Best value quality/cost? → kling-image-v3 (2K, $0.028)
├─ Lowest cost? → kling-image-v1 (1K, $0.0035)
├─ Face of a specific person? → kling-image-v1-5 + face ref
├─ Multiple reference images? → kling-image-v2-1 multi
├─ Clothing try-on? → kolors-virtual-try-on-v1-5
└─ Batch of 9 cheap images? → kling-image-v1, n=9 ($0.031 total)
```

---

## Cost Optimization Strategies

### 1. Draft cheap, finalize premium
```python
# Generate 4 rapid drafts
drafts = [create_video("kling-v2-5-turbo", prompt, "720p", 5) for _ in range(4)]

# User picks best draft → upscale model + resolution
best_prompt = refine_prompt(drafts[chosen_index])
final = create_video("kling-v3-omni", best_prompt, "1080p", 10)

# Cost: 4 × $0.21 + 1 × $1.12 = $1.96  (vs $4.48 if all v3)
```

### 2. Use n-parameter for images
```bash
# Generate 9 variations in one call (uses 9 concurrency, 1 API call)
curl ... -d '{"model_name":"kling-image-v3","prompt":"...","n":9,"resolution":"2k"}'
# Cost: 9 × $0.028 = $0.252 (same as 9 separate calls, but faster)
```

### 3. Shorter videos for testing
```bash
# Test composition at 3s → final render at 10s
# 3s saves 70% cost during experimentation
```

### 4. Match resolution to platform
| Platform | Needed Resolution | Cost Tier |
|---|---|---|
| TikTok / Reels | 720p | Cheapest |
| YouTube Shorts | 1080p | Mid |
| YouTube long-form | 1080p or 4K | Mid–Premium |
| Cinema / broadcast | 4K | Premium |

### 5. Pre-render static storyboard
Use cheap image generation ($0.0035–0.028 each) to pre-visualize scenes before committing to video generation ($0.14–0.70 each).

---

## Model Endpoint Reference

### Video
| Model | Create Endpoint | Query Endpoint | Auth Type |
|---|---|---|---|
| kling-3.0-turbo | `POST /image-to-video/kling-3.0-turbo` | `GET /tasks` | API Key |
| kling-v3, v2-6, v2-5T, v2-1, v1-* | `POST /v1/videos/image2video` | `GET /v1/videos/image2video/{id}` | AK/SK (JWT) |
| kling-v3-omni, video-o1 | `POST /v1/videos/omni-video` | `GET /v1/videos/omni-video/{id}` | AK/SK (JWT) |
| Motion Control | `POST /v1/videos/motion-control` | `GET /v1/videos/motion-control/{id}` | AK/SK (JWT) |
| Avatar | `POST /v1/videos/avatar/image2video` | `GET /v1/videos/avatar/image2video/{id}` | AK/SK (JWT) |
| Lip Sync | `POST /v1/videos/lip-sync` | `GET /v1/videos/lip-sync/{id}` | AK/SK (JWT) |
| Video Extension | `POST /kling/v1/videos/video-extend` | `GET /kling/v1/videos/video-extend/{id}` | AK/SK (JWT) |

### Image
| Model | Create Endpoint | Query Endpoint |
|---|---|---|
| All image models | `POST /v1/images/generations` | `GET /v1/images/generations/{id}` |
| Virtual Try-On | `POST /v1/images/kolors-virtual-try-on` | `GET /v1/images/kolors-virtual-try-on/{id}` |
| Image Recognition | `POST /v1/images/recognition` | `GET /v1/images/recognition/{id}` |

> ⚠️ **3.0 Turbo vs v3**: They use entirely different endpoints, authentication, and response schemas. 3.0 Turbo uses API Key + `/image-to-video/kling-3.0-turbo`. All other models use AK/SK (JWT) + `/v1/videos/*`. Plan your integration accordingly — you may need both auth types if using 3.0 Turbo alongside other models.
