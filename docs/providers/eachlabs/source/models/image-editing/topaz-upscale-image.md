---
title: "Topaz Upscale Image"
description: "AI-powered super resolution upscaling. Enhance image resolution while preserving detail and sharpening edges."
---

## Model Info

| Property | Value |
|----------|-------|
| **Slug** | `topaz-upscale-image` |
| **Version** | `1.0.0` |
| **Category** | Image Editing |
| **Output Type** | Image (URL) |
| **Speed** | Fast |
| **Best For** | AI-powered super resolution upscaling |

## Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `image_url` | string | Yes | `-` | URL of the image to upscale |
| `scale` | integer | No | 2 | Upscale factor (2 or 4) |

## Code Examples

### each::api

```bash cURL
curl -X POST https://api.eachlabs.ai/v1/prediction \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $EACHLABS_API_KEY" \
  -d '{
    "model": "topaz-upscale-image",
    "version": "1.0.0",
    "input": {
      "image_url": "https://example.com/photo.jpg",
      "scale": 2
    }
  }'
```

```python Python
import requests

response = requests.post(
    "https://api.eachlabs.ai/v1/prediction",
    headers={"X-API-Key": "YOUR_API_KEY"},
    json={
        "model": "topaz-upscale-image",
        "version": "1.0.0",
        "input": {
            "image_url": "https://example.com/photo.jpg",
            "scale": 2
        }
    }
)
prediction_id = response.json()["predictionID"]
```

```javascript JavaScript
const response = await fetch("https://api.eachlabs.ai/v1/prediction", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "YOUR_API_KEY",
  },
  body: JSON.stringify({
    model: "topaz-upscale-image",
    version: "1.0.0",
    input: {
      image_url: "https://example.com/photo.jpg",
      scale: 2,
    },
  }),
});
const { predictionID } = await response.json();
```

### each::sense

```python each::sense
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://eachsense-agent.core.eachlabs.run/v1"
)

response = client.chat.completions.create(
    model="eachsense/beta",
    messages=[{"role": "user", "content": "Upscale this image by 2x: https://example.com/photo.jpg"}],
)
```

## Tips

- 2x is the sweet spot for most cases, giving you a nice balance of quality and file size
- Go 4x when you've got a really low-res image that needs serious love
- Preserves detail and sharpens edges without introducing ugly artifacts
- Great as a finishing touch after AI image generation
- Mix it with background removal or editing for a complete workflow

## Related Models

  - **[Background Remover v1](/models/image-editing/eachlabs-bg-remover-v1)** — Fast, accurate background removal.

  - **[Flux 2 Edit](/models/image-editing/flux-2-edit)** — Instruction-based image editing.

> **📝  Note:** Call `GET /v1/model?slug=topaz-upscale-image` for the full parameter schema.

