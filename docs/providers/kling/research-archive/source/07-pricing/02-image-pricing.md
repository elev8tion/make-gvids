# Kling AI — Image Pricing

> Source: https://kling.ai/document-api/pricing/base/image  
> Billing: Per image (or per call for special services)  
> Unit: 1 Unit = $0.14 USD

## Current-Gen (v3)

| Model | Function | Resolution | Price |
|-------|----------|------------|-------|
| **kling-image-v3** | Text-to-Image, Image-to-Image | 1K, 2K | 8U ($0.028)/image |
| **kling-image-v3-omni** | Text-to-Image, Image-to-Image | 1K, 2K | 8U ($0.028)/image |
| **kling-image-v3-omni** | Text-to-Image, Image-to-Image | 4K | 16U ($0.056)/image |
| **kling-image-o1** | Text-to-Image, Image-to-Image | 1K, 2K | 8U ($0.028)/image |

## v2.x Models

| Model | Function | Resolution | Price |
|-------|----------|------------|-------|
| **kling-image-v2-1** | Text-to-Image | 1K, 2K | 4U ($0.014)/image |
| **kling-image-v2-1** | Image-to-Image | 1K, 2K | 8U ($0.028)/image |
| **kling-image-v2-1** | Multi-image to Image | 1K, 2K | 16U ($0.056)/image |
| **kling-image-v2-new** | Image-to-Image | 1K | 8U ($0.028)/image |
| **kling-image-v2** | Text-to-Image | 1K, 2K | 4U ($0.014)/image |
| **kling-image-v2** | Image-to-Image | 1K | 8U ($0.028)/image |
| **kling-image-v2** | Multi-image to Image | 1K | 16U ($0.056)/image |

## v1.x Models

| Model | Function | Resolution | Price |
|-------|----------|------------|-------|
| **kling-image-v1-5** | Text-to-Image | 1K | 4U ($0.014)/image |
| **kling-image-v1-5** | Image-to-Image | 1K | 8U ($0.028)/image |
| **kling-image-v1** | Text-to-Image, Image-to-Image | 1K | 1U ($0.0035)/image |

## Special Services

| Service | Function | Resolution | Price |
|---------|----------|------------|-------|
| **General** | AI Multi-Shot | 1K | 20U ($0.07)/call |
| **General** | Outpainting | 1K | 8U ($0.028)/image |
| **Virtual Try-on** | — | 1K | 1U ($0.07)/image |

> **Note**: Virtual Try-on unit price = $0.07/unit (different from standard $0.14/unit for resource packages)

## Quick Cost Comparison (Text-to-Image, 2K)

| Model | Cost/Image |
|-------|-----------|
| kling-image-v3 | $0.028 |
| kling-image-v3-omni | $0.028 |
| kling-image-o1 | $0.028 |
| kling-image-v2-1 | $0.014 |
| kling-image-v2 | $0.014 |
| kling-image-v1-5 | $0.014 (1K only) |
| kling-image-v1 | $0.0035 (1K only) |

## Model Generation Timeline

| Generation | Models |
|------------|--------|
| **v3** | kling-image-v3, kling-image-v3-omni, kling-image-o1 |
| **v2** | kling-image-v2-1, kling-image-v2-new, kling-image-v2 |
| **v1** | kling-image-v1-5, kling-image-v1 |
