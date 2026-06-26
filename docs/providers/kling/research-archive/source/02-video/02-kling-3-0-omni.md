# Kling 3.0 & 3.0 Omni

**Source:** https://kling.ai/document-api/api/video/3-0-omni

## Available Sub-pages
- Text to Video
- Image to Video
- Omni Video Generation
- Motion Control
- Element Management
- Voice Management

---

## Image to Video — Create Task

**POST** `/v1/videos/image2video`

### Request Body

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| model_name | string | No | kling-v1 | kling-v1, kling-v1-5, kling-v1-6, kling-v2-master, kling-v2-1, kling-v2-1-master, kling-v2-5-turbo, kling-v2-6, kling-v3 |
| image | string | No | - | Reference image (URL or Base64). .jpg/.jpeg/.png, ≤10MB, ≥300px, ratio 1:2.5~2.5:1. At least one of image/image_tail required. |
| image_tail | string | No | - | End frame control image. Same format as image. |
| multi_shot | boolean | No | false | Multi-shot video generation |
| shot_type | string | No | - | customize / intelligence (required when multi_shot=true) |
| prompt | string | No | - | Text prompt (max 2500 chars). Reference elements/images/videos with `<<<element_1>>>`, `<<<image_1>>>`, `<<<video_1>>>`. Voice with `<<<voice_1>>>` |
| multi_prompt | array | No | - | Storyboard info. Supports up to 6 storyboards. Format: `[{"index":int,"prompt":"string","duration":"5"}]` |
| negative_prompt | string | No | - | Negative prompt (max 2500 chars) |
| element_list | array | No | - | Reference elements from element library. Up to 3. Format: `[{"element_id": long}]` |
| voice_list | array | No | - | Voice references. Up to 2. Format: `[{"voice_id":"id"}]` |
| sound | string | No | off | on / off |
| cfg_scale | float | No | 0.5 | Creativity [0, 1]. Higher = more relevant to prompt. Not supported in v2.x |
| mode | string | No | std | std (720p), pro (1080p), 4k (4K) |
| static_mask | string | No | - | Static brush mask image |
| dynamic_masks | array | No | - | Dynamic brush configs (up to 6 groups, each with mask + trajectories) |
| camera_control | object | No | - | Camera movement control |
| camera_control.type | string | Yes | - | simple / down_back / forward_up / right_turn_forward / left_turn_forward |
| camera_control.config | object | No | - | horizontal, vertical, pan, tilt, roll, zoom (range [-10,10]) |
| duration | string | No | 5 | Video duration: 3-15 seconds |
| callback_url | string | No | - | Callback URL |
| external_task_id | string | No | - | Custom task ID (unique per account) |

### Response (200)
```json
{
  "code": 0,
  "message": "string",
  "request_id": "string",
  "data": {
    "task_id": "string",
    "task_info": { "external_task_id": "string" },
    "task_status": "submitted | processing | succeed | failed",
    "created_at": 1722769557708,
    "updated_at": 1722769557708
  }
}
```

### Query Task (Single)
**GET** `/v1/videos/image2video/{task_id}`

| Param | Type | Description |
|---|---|---|
| task_id | string | System task ID |
| external_task_id | string | Custom task ID |

### Query Task (List)
**GET** `/v1/videos/image2video?pageNum=1&pageSize=30`

| Param | Type | Default | Description |
|---|---|---|---|
| pageNum | int | 1 | [1, 1000] |
| pageSize | int | 30 | [1, 500] |

### Scenario Examples

**Multi-Shot Video:**
```bash
curl --location 'https://xxx/v1/videos/image2video' \
--header 'Authorization: Bearer xxx' \
--header 'Content-Type: application/json' \
--data '{
    "model_name": "kling-v3",
    "image": "xxx",
    "multi_shot": true,
    "shot_type": "customize",
    "multi_prompt": [
        {"index": 1, "prompt": "Two friends talking under a streetlight...", "duration": "2"},
        {"index": 2, "prompt": "A runner sprinting through a forest...", "duration": "3"}
    ],
    "duration": "5",
    "mode": "pro"
}'
```

**Voice Control:**
```bash
curl --location 'https://api-singapore.klingai.com/v1/videos/image2video/' \
--header 'Authorization: Bearer {token}' \
--header 'Content-Type: application/json; charset=utf-8' \
--data '{
    "model_name": "kling-v2-6",
    "image": "...",
    "prompt": "<<<voice_1>>>Say welcome",
    "voice_list": [{"voice_id": "..."}],
    "duration": "5",
    "mode": "pro",
    "sound": "on"
}'
```
