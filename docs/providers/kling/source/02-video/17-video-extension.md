# Video Extension

**Source:** https://kling.ai/document-api/api/video/video-extension  
**Last updated:** 2026-06

## Overview

Video Extension allows you to extend a previously generated video by generating additional frames from its last frame. This enables creating longer videos than the standard 15-second limit by chaining extensions.

> **Note:** Video extension is only supported on v1-series models (kling-v1, kling-v1-5, kling-v1-6). It is not available on v2.x or v3.x models.

---

## Create Extension Task

**POST** `/kling/v1/videos/video-extend`

Extends an existing video by generating additional seconds from the last frame.

### Request Body

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| task_id | string | Required | — | The ID of the previously generated video task to extend |
| prompt | string | Optional | — | Text prompt describing desired continuation (max 2500 chars) |
| duration | string | Optional | 5 | Extension length in seconds (3–15) |
| mode | string | Optional | std | `std` (720p) or `pro` (1080p) |
| callback_url | string | Optional | — | Callback URL for task result notification |
| external_task_id | string | Optional | — | Custom task ID (must be unique per account) |

### Request Example

```bash
curl --location 'https://api-singapore.klingai.com/kling/v1/videos/video-extend' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {api_token}' \
  --data-raw '{
    "task_id": "893605946402811985",
    "prompt": "The character continues walking through the forest, sunlight filtering through trees",
    "duration": "5",
    "mode": "std"
  }'
```

### Response (200)

```json
{
  "code": 0,
  "message": "success",
  "request_id": "abc-123-def",
  "data": {
    "task_id": "893605946402812000",
    "task_status": "submitted",
    "created_at": 1722769557708,
    "updated_at": 1722769557708
  }
}
```

---

## Query Extension Task

**GET** `/kling/v1/videos/video-extend/{task_id}`

| Parameter | Type | Description |
|---|---|---|
| task_id | string | System task ID returned from the create call |

**GET** `/kling/v1/videos/video-extend?pageNum=1&pageSize=30`

| Parameter | Type | Default | Description |
|---|---|---|---|
| pageNum | int | 1 | Page number [1, 1000] |
| pageSize | int | 30 | Items per page [1, 500] |

### Query Response (When Complete)

```json
{
  "code": 0,
  "data": {
    "task_id": "893605946402812000",
    "task_status": "succeed",
    "created_at": 1722769557708,
    "updated_at": 1722769568000,
    "task_result": {
      "videos": [
        {
          "id": "v_abc123",
          "url": "https://kcdn.klingai.com/output/extended_video.mp4",
          "duration": "10"
        }
      ]
    }
  }
}
```

> **Note:** The returned video is the *full* video (original + extension), not just the extended portion.

---

## Chain Extension Pattern

To build a video longer than 30 seconds, chain multiple extension calls in sequence:

```
Create initial video (5s)
  → Extend by 5s → total 10s (task_id_2)
    → Extend by 5s → total 15s (task_id_3)
      → Extend by 5s → total 20s (task_id_4)
```

Each extension uses the `task_id` from the previous step. Wait for each to reach `succeed` before submitting the next.

```python
def chain_extend(initial_task_id, total_desired_seconds, seconds_per_chunk=5):
    """
    Extend a video to the desired total length by chaining
    extension calls. Each chunk adds `seconds_per_chunk` seconds.
    """
    current_task_id = initial_task_id
    current_duration = 5  # assume initial video is 5s
    extensions = []

    while current_duration < total_desired_seconds:
        chunk = min(seconds_per_chunk, total_desired_seconds - current_duration)
        new_task = create_extension(current_task_id, duration=chunk)
        poll_until_complete(new_task["task_id"])
        extensions.append(new_task["task_id"])
        current_task_id = new_task["task_id"]
        current_duration += chunk

    return extensions
```

---

## Supported Models & Pricing

Extension is only available on v1-series models. Billed **per call** (not per second):

| Model | 720P | 1080P |
|---|---|---|
| kling-v1 | 2.0 Units ($0.28) | 3.5 Units ($0.49) |
| kling-v1-5 | 2.0 Units ($0.28) | 3.5 Units ($0.49) |
| kling-v1-6 | 2.0 Units ($0.28) | 3.5 Units ($0.49) |

> Unit price: 1 Unit = $0.14 USD. See [Video Pricing](../07-pricing/01-video-pricing.md) for full pricing reference.

---

## Limitations

- **Model restriction:** Only kling-v1, kling-v1-5, kling-v1-6. v2.x and v3.x do not support extension — use `duration` parameter up to 15s on those models instead.
- **Quality drift:** Each extension is generated from the last frame of the previous output. Visual quality may degrade across multiple extensions — frame interpolation artifacts accumulate.
- **No audio extension:** If the original video had native audio, the extension will NOT carry audio forward. Audio generation for extensions is not supported.
- **Concurrency:** Extension tasks count toward your video concurrency limit.
- **30-day window:** The source video must still be available (within the 30-day retention window).
