# Kling 2.6

**Source:** https://kling.ai/document-api/api/video/2-6

## Text to Video — Create Task

**POST** `/v1/videos/text2video`

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| model_name | string | No | kling-v2-6 | Model version |
| prompt | string | No | - | Text prompt (max 2500 chars) |
| negative_prompt | string | No | - | Negative prompt |
| duration | string | No | 5 | 3-15 seconds |
| mode | string | No | std | std / pro |
| aspect_ratio | string | No | 16:9 | 16:9, 9:16, 1:1 |
| cfg_scale | float | No | 0.5 | [0, 1] |
| callback_url | string | No | - | Callback URL |
| external_task_id | string | No | - | Custom task ID |

### Query Task
**GET** `/v1/videos/text2video/{id}` | **GET** `/v1/videos/text2video`

## Image to Video — Create Task

**POST** `/v1/videos/image2video`

Uses same parameter structure as Kling 3.0 Omni (image, image_tail, prompt, duration, mode, etc.) with `model_name: "kling-v2-6"`.
