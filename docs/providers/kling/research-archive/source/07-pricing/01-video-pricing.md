# Kling AI — Video Pricing

> Source: https://kling.ai/document-api/pricing/base/video  
> Billing: Per second of generated video  
> Unit: 1 Unit = $0.14 USD

## Current-Gen Models (v3+)

| Model | Features | 720P | 1080P | 4K |
|-------|----------|------|-------|-----|
| **kling-3.0-turbo** | With Native Audio | 0.8U ($0.112)/s | 1.0U ($0.14)/s | — |
| **kling-v3** | No Native Audio | 0.6U ($0.084)/s | 0.8U ($0.112)/s | 3.0U ($0.42)/s |
| **kling-v3** | Native Audio (No Voice Control) | 0.9U ($0.126)/s | 1.2U ($0.168)/s | 3.0U ($0.42)/s |
| **kling-v3** | Motion Control | 0.9U ($0.126)/s | 1.2U ($0.168)/s | — |
| **kling-v3-omni** | With Video Input | 0.6U ($0.084)/s | 0.8U ($0.112)/s | 3.0U ($0.42)/s |
| **kling-v3-omni** | No Video Input + Native Audio | 0.8U ($0.112)/s | 1.0U ($0.14)/s | 3.0U ($0.42)/s |
| **kling-v3-omni** | Video Input + No Native Audio | 0.9U ($0.126)/s | 1.2U ($0.168)/s | 3.0U ($0.42)/s |
| **kling-video-o1** | No Video Input | 0.6U ($0.084)/s | 0.8U ($0.112)/s | — |
| **kling-video-o1** | With Video Input | 0.9U ($0.126)/s | 1.2U ($0.168)/s | — |

## Legacy Models (v2.x)

| Model | Features | 720P | 1080P | 4K |
|-------|----------|------|-------|-----|
| **kling-v2-6** | No Native Audio | 0.3U ($0.042)/s | 0.5U ($0.07)/s | — |
| **kling-v2-6** | Native Audio (No Voice Control) | — | 1.0U ($0.14)/s | — |
| **kling-v2-6** | Native Audio + Voice Control | — | 1.2U ($0.168)/s | — |
| **kling-v2-6** | Motion Control | 0.5U ($0.07)/s | 0.8U ($0.112)/s | — |
| **kling-v2-5-turbo** | No Native Audio | 0.3U ($0.042)/s | 0.5U ($0.07)/s | — |
| **kling-v2-1** | No Native Audio | 0.4U ($0.056)/s | 0.7U ($0.098)/s | — |
| **kling-v2-1-master** | No Native Audio | — | 2.0U ($0.28)/s | — |
| **kling-v2** | No Native Audio | — | 2.0U ($0.28)/s | — |

## v1.x Models

| Model | Features | 720P | 1080P | 4K |
|-------|----------|------|-------|-----|
| **kling-v1-6** | No Native Audio | 0.4U ($0.056)/s | 0.7U ($0.098)/s | — |
| **kling-v1-6** | Multi-image to Video | 0.4U ($0.056)/s | 0.7U ($0.098)/s | — |
| **kling-v1-6** | Multi-element Video Editing | 0.6U ($0.084)/s | 1.0U ($0.14)/s | — |
| **kling-v1-6** | Video Extension (per call) | 2.0U ($0.28)/call | 3.5U ($0.49)/call | — |
| **kling-v1-5** | No Native Audio | 0.4U ($0.056)/s | 0.7U ($0.098)/s | — |
| **kling-v1-5** | Video Extension (per call) | 2.0U ($0.28)/call | 3.5U ($0.49)/call | — |
| **kling-v1** | No Native Audio | 0.2U ($0.028)/s | 0.7U ($0.098)/s | — |
| **kling-v1** | Video Extension (per call) | 2.0U ($0.28)/call | 3.5U ($0.49)/call | — |

## Special Services

| Service | Billing | Feature | 720P | 1080P | 4K |
|---------|---------|---------|------|-------|-----|
| **Avatar** | Per second | Avatar | 0.4U ($0.056)/s | 0.8U ($0.112)/s | — |
| **Avatar** | Per request | TTS | 0.05U ($0.007)/call | — | — |
| **Lip Sync** | Per 5 seconds | Lip Sync | 0.5U ($0.07)/5s | — | — |
| **Face Recognition** | Per request | Face Recognition | 0.05U ($0.007)/call | — | — |
| **Audio Generation** | Per request | Text to Audio | 0.25U ($0.035)/call | — | — |
| **Audio Generation** | Per request | Video to Audio | 0.25U ($0.035)/call | — | — |
| **Audio Generation** | Per request | Custom Voice | 0.05U ($0.007)/call | — | — |
| **Image Recognition** | Per request | Image Recognition | 0.1U ($0.014)/call | — | — |

## Model Generation Timeline

| Generation | Latest Models | Key Features |
|------------|--------------|--------------|
| **v3** | kling-3.0-turbo, kling-v3, kling-v3-omni | Native Audio, Motion Control, Video Input |
| **v2** | kling-video-o1, kling-v2-6, kling-v2-5-turbo, kling-v2-1, kling-v2 | Native Audio (v2-6), Voice Control |
| **v1** | kling-v1-6, kling-v1-5, kling-v1 | Video Extension, Multi-image to Video |
