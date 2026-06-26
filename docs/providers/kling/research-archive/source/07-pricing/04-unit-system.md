# Kling AI — Unit System & Billing Models

## Unit Pricing

| Currency | 1 Unit |
|----------|--------|
| **USD** | $0.14 |

> Derived from the official pricing: 0.8 Units = $0.112, 1.0 Unit = $0.14  

## Billing Models

### 1. Per Second (Video Generation)
- Used for all video generation models (kling-v1 through kling-3.0-turbo)
- Also used for Avatar and Lip Sync
- Billed by the second of generated video
- Price varies by: Model, Features (audio, motion control, video input), Resolution (720P/1080P/4K)

### 2. Per Image (Image Generation)
- Used for text-to-image, image-to-image, multi-image-to-image
- Billed per generated image
- Price varies by: Model, Function, Resolution

### 3. Per Request / Per Call
- Used for: Video Extension, TTS, Face Recognition, Audio Generation, Custom Voice, Image Recognition
- Fixed price per API call regardless of output length

### 4. Per 5 Seconds (Lip Sync)
- Billed per 5-second segment processed

### 5. Per Effect (Effects)
- Each effect template has a fixed unit cost
- Range: 1.0 Unit ($0.14) to 12.0 Units ($1.68)

## Cost Examples

| Service | Model | Resolution | Features | Cost |
|---------|-------|------------|----------|------|
| Video (5s) | kling-3.0-turbo | 1080P | Native Audio | 5 × $0.14 = $0.70 |
| Video (5s) | kling-v3 | 1080P | No Audio | 5 × $0.112 = $0.56 |
| Video (5s) | kling-v2-6 | 720P | No Audio | 5 × $0.042 = $0.21 |
| Video (5s) | kling-v2-5-turbo | 1080P | No Audio | 5 × $0.07 = $0.35 |
| Image | kling-image-v3 | 2K | Text-to-Image | $0.028 |
| Image | kling-image-v3-omni | 4K | Text-to-Image | $0.056 |
| Image | kling-image-v1 | 1K | Text-to-Image | $0.0035 |
| Effect | Bra Hot Dance | — | — | $0.56 |
| Effect | Bullet Time | — | — | $0.98 |
| Audio | Text to Audio | — | — | $0.035 |
| Lip Sync | — | — | — | $0.07 per 5s |
