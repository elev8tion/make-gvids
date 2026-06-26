# KlingAI Open Platform — API Documentation

**Source:** https://kling.ai/document-api  
**Base API URL:** https://api-singapore.klingai.com  
**Last updated:** 2026-06-26

> 📊 **Companion resource:** [Kling AI Pricing Reference](07-pricing/README.md) — complete pricing for all video, image, and effects models.

---

## Table of Contents

### 1. Get Started
| # | Document | Description |
|---|---|---|
| 1 | [Authentication](01-get-started/01-authentication.md) | API Key & JWT auth, base URL |
| 2 | [Error Codes](01-get-started/02-error-codes.md) | HTTP status codes, service codes, solutions |
| 3 | [Concurrency Rules](01-get-started/03-concurrency-rules.md) | Concurrency limits, quotas, retry strategy |
| 4 | [Callback Protocol](01-get-started/04-callbacks.md) | New + legacy callback schemas |
| 5 | [Kling Skills](01-get-started/05-kling-skills.md) | Agent integration (Claude Code, Cursor, etc.) |
| 6 | [Webhook Security](01-get-started/06-webhook-security.md) | HMAC-SHA256 signature verification |
| 7 | [File Upload](01-get-started/07-file-upload.md) | Base64, stream, and URL upload methods |
| 8 | [Asset Download](01-get-started/08-asset-download.md) | Re-download generated assets, credit checks |

### 2. Video APIs
| # | Model | Endpoint | Description |
|---|---|---|---|
| 1 | [Kling 3.0 Turbo](02-video/01-kling-3-0-turbo.md) | `/image-to-video/kling-3.0-turbo` | Latest gen — Image to Video |
| 2 | [Kling 3.0 & 3.0 Omni](02-video/02-kling-3-0-omni.md) | `/v1/videos/image2video`, `/v1/videos/text2video` | Multi-shot, elements, voice, motion control |
| 3 | [Kling O1](02-video/03-kling-o1.md) | `/v1/videos/omni-video` | Omni video generation |
| 4 | [Kling 2.6](02-video/04-kling-2-6.md) | `/v1/videos/text2video`, `/v1/videos/image2video` | Text + Image to Video |
| 5 | [Kling 2.5 Turbo](02-video/05-kling-2-5-turbo.md) | Same as 2.6 | Faster variant |
| 6 | [Motion Control](02-video/06-motion-control.md) | `/v1/videos/motion-control` | Motion brush, static/dynamic masks |
| 7 | [Avatar](02-video/07-avatar.md) | `/v1/videos/avatar/image2video` | Talking avatar with audio |
| 8 | [Audio Generation](02-video/08-audio-generation.md) | `/v1/audio/generations` | TTS + custom voices |
| 9 | [Kling 2.1 Master](02-video/09-kling-2-1-master.md) | Same as 2.1 | Master quality variant |
| 10 | [Kling 2.1](02-video/10-kling-2-1.md) | Same as 2.6 | Legacy model |
| 11 | [Kling 2.0 Master](02-video/11-kling-2-0-master.md) | Same as 2.6 | Master quality variant |
| 12 | [Kling 1.6](02-video/12-kling-1-6.md) | Same as 2.6 | Legacy model |
| 13 | [Kling 1.5](02-video/13-kling-1-5.md) | Same as 2.6 | Legacy model |
| 14 | [Kling 1.0](02-video/14-kling-1-0.md) | Same as 2.6 | Legacy model |
| 15 | [Lip Sync](02-video/15-lip-sync.md) | `/v1/videos/lip-sync` | Lip-synced talking head |
| 16 | [Image Recognition](02-video/16-image-recognition.md) | `/v1/images/recognition` | Image analysis |
| 17 | [Video Extension](02-video/17-video-extension.md) | `/kling/v1/videos/video-extend` | Extend generated videos (v1 models) |

### 3. Image APIs
| # | Model | Endpoint | Description |
|---|---|---|---|
| 1 | [Kling Image 3.0 & 3.0 Omni](03-image/01-kling-image-3-0-omni.md) | `/v1/images/generations` | Text-to-Image, Image-to-Image |
| 2 | [Kling Image O1](03-image/02-kling-image-o1.md) | Same as above | Optimized image model |
| 3 | [General](03-image/03-general.md) | Same as above | Shared/common docs |
| 4 | [Kling Image 2.1](03-image/04-kling-image-2-1.md) | Same as above | Legacy model |
| 5 | [Kling Image 2.0 New](03-image/05-kling-image-2-0-new.md) | Same as above | Updated v2 model |
| 6 | [Kling Image 2.0](03-image/06-kling-image-2-0.md) | Same as above | Legacy model |
| 7 | [Kling Image 1.5](03-image/07-kling-image-1-5.md) | Same as above | With face/subject reference |
| 8 | [Kling Image 1.0](03-image/08-kling-image-1-0.md) | Same as above | Legacy model |
| 9 | [Virtual Try-On](03-image/09-virtual-try-on.md) | `/v1/images/kolors-virtual-try-on` | Clothing try-on |

### 4. Solution APIs (Effects)
| # | Document | Endpoint | Description |
|---|---|---|---|
| 1 | [Effect Templates](04-effects/01-effect-templates.md) | `/v1/effects/templates`, `/v1/effects/apply` | Pre-built visual effects |
| 2 | [Video Effects](04-effects/02-video-effects.md) | `/v1/videos/effects` | Video post-processing |

### 5. Asset APIs
| # | Document | Endpoint | Description |
|---|---|---|---|
| 1 | [Account Usage](05-assets/01-account-usage.md) | `/v1/account/usage` | Usage, balance, resources |

### 6. Guides
| # | Document | Description |
|---|---|---|
| 1 | [Model Selection Guide](06-guides/01-model-selection.md) | Which model for which use case — decision matrices, cost comparison, feature availability |
| 2 | [Prompt Engineering Guide](06-guides/02-prompt-engineering.md) | Prompt structure, reference syntax, parameter tuning, templates |

---

## Quick Reference — All API Endpoints

| Method | Endpoint | Category |
|---|---|---|
| POST | `/image-to-video/kling-3.0-turbo` | Video 3.0 Turbo |
| POST | `/v1/videos/text2video` | Video (Text to Video) |
| POST | `/v1/videos/image2video` | Video (Image to Video) |
| POST | `/v1/videos/omni-video` | Video (Omni) |
| POST | `/v1/videos/motion-control` | Video (Motion) |
| POST | `/v1/videos/avatar/image2video` | Video (Avatar) |
| POST | `/v1/videos/lip-sync` | Video (Lip Sync) |
| POST | `/v1/audio/generations` | Audio (TTS) |
| POST | `/v1/voices` | Audio (Custom Voice) |
| POST | `/v1/images/generations` | Image |
| POST | `/v1/images/kolors-virtual-try-on` | Image (Try-On) |
| POST | `/v1/images/recognition` | Image (Recognition) |
| POST | `/v1/videos/effects` | Effects |
| POST | `/v1/effects/apply` | Effects (Templates) |
| GET | `/tasks` (3.0 Turbo query) | Video 3.0 Turbo |
| GET | `/v1/videos/*/...` | Video (Query) |
| GET | `/v1/images/*/...` | Image (Query) |
| GET | `/v1/audio/*/...` | Audio (Query) |
| GET | `/v1/account/usage` | Account |
| POST | `/kling/v1/videos/video-extend` | Video (Extension) |
| POST | `/file-upload-api/upload-file-base-64` | File Upload |
| POST | `/file-upload-api/upload-file-stream` | File Upload |
| POST | `/file-upload-api/upload-file-url` | File Upload |
| POST | `/common-api/download-url` | Asset Download |
| GET | `/common-api/get-account-credits` | Account |

## Companion: Pricing Reference

Complete pricing data lives in a separate folder:

| File | Contents |
|---|---|
| [Pricing README](07-pricing/README.md) | Overview, unit system ($0.14/unit), billing models |
| [Video Pricing](07-pricing/01-video-pricing.md) | 20+ model/config combinations with per-second costs |
| [Image Pricing](07-pricing/02-image-pricing.md) | 15+ model/function combos with per-image costs |
| [Effects Pricing](07-pricing/03-effects-pricing.md) | ~181 effect templates with individual pricing |
| [Unit System](07-pricing/04-unit-system.md) | Billing models, cost examples, calculation methods |

## Authentication

All requests require: `Authorization: Bearer {api_key}` or `Authorization: Bearer {jwt_token}`

See [Authentication](01-get-started/01-authentication.md) for details.
