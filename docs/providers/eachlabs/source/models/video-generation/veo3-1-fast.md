---
title: "Veo 3.1 Fast"
description: "Generate videos quickly with Google's speed-optimized Veo 3.1 Fast model."
---

## Model Overview

| Property     | Value              |
|--------------|--------------------|
| **Slug**     | `veo3-1-fast`      |
| **Version**  | `1.0.0`            |
| **Category** | Video Generation   |
| **Output**   | Video (URL)        |
| **Speed**    | Fast               |
| **Best For** | Quick video generation |

## Input Parameters

| Parameter    | Type    | Required | Default  | Description                          |
|--------------|---------|----------|----------|--------------------------------------|
| prompt       | string  | Yes      | -        | Text description of the video        |
| duration     | integer | No       | 5        | Video duration in seconds            |
| aspect_ratio | string  | No       | `16:9`   | Output aspect ratio                  |
| seed         | integer | No       | random   | Random seed                          |

## Code Examples

### each::api

```bash cURL
curl -X POST https://api.eachlabs.ai/v1/prediction \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $EACHLABS_API_KEY" \
  -d '{
    "model": "veo3-1-fast",
    "version": "1.0.0",
    "input": {
      "prompt": "A drone shot flying over a mountain lake at sunrise",
      "duration": 5,
      "aspect_ratio": "16:9"
    }
  }'
```

```python Python
import requests

response = requests.post(
    "https://api.eachlabs.ai/v1/prediction",
    headers={"X-API-Key": "YOUR_API_KEY"},
    json={
        "model": "veo3-1-fast",
        "version": "1.0.0",
        "input": {
            "prompt": "A drone shot flying over a mountain lake at sunrise",
            "duration": 5,
            "aspect_ratio": "16:9"
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
    model: "veo3-1-fast",
    version: "1.0.0",
    input: {
      prompt: "A drone shot flying over a mountain lake at sunrise",
      duration: 5,
      aspect_ratio: "16:9",
    },
  }),
});
const { predictionID } = await response.json();
```

### each::sense

```python each::sense
from openai import OpenAI

client = OpenAI(api_key="YOUR_API_KEY", base_url="https://eachsense-agent.core.eachlabs.run/v1")

response = client.chat.completions.create(
    model="eachsense/beta",
    messages=[{"role": "user", "content": "Generate a drone shot over a mountain lake at sunrise using veo3-1-fast"}],
)
```

## Tips

- Speed-optimized variant of Veo. Use this when turnaround time matters more than maximum quality.
- Perfect for previews and quick iterations before committing to a slower, higher-quality model.
- Uses the same prompt format as Veo 3, so switching between them is a breeze.

## Related Models

  - **[Veo 3](/models/video-generation/veo-3)** — Full-quality Veo with synchronized audio output.

  - **[Kling 3.0](/models/video-generation/kling-3-0)** — High-quality text-to-video with strong motion coherence.

> **📝  Note:** Use `GET /v1/model?slug=veo3-1-fast` to retrieve the full model schema including all available parameters and their constraints.

> **📝  Note:** Video generation is an async process. Predictions may take longer to complete depending on duration and model load. Poll the prediction status endpoint to check for completion.

