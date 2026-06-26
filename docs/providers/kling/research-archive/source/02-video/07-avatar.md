# Avatar

**Source:** https://kling.ai/document-api/api/video/avatar

## Create Task

**POST** `/v1/videos/avatar/image2video`

### Request Body

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| image | string | Required | - | Avatar reference image (Base64 or URL). .jpg/.jpeg/.png, ≤10MB, ≥300px, ratio 1:2.5~2.5:1 |
| audio_id | string | Optional | - | Audio ID from TTS API. Duration 2-300s, within last 30 days. Mutually exclusive with sound_file |
| sound_file | string | Optional | - | Audio file (Base64 or URL). .mp3/.wav/.m4a/.aac, ≤5MB, 2-300s. Mutually exclusive with audio_id |
| prompt | string | Optional | - | Defines avatar actions, emotions, camera movements (max 2500 chars) |
| mode | string | Optional | std | std / pro |
| watermark_info | object | Optional | - | `{"enabled": boolean}` |
| callback_url | string | Optional | - | Callback URL |
| external_task_id | string | Optional | - | Custom task ID |

> Either audio_id or sound_file must be provided.

### Query Task
**GET** `/v1/videos/avatar/image2video/{id}` | **GET** `/v1/videos/avatar/image2video`
