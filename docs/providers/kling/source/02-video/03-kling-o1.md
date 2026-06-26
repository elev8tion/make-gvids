# Kling O1

**Source:** https://kling.ai/document-api/api/video/o1

## Omni Video Generation — Create Task

**POST** `/v1/videos/omni-video`

### Request Body

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| model_name | string | No | kling-video-o1 | kling-video-o1, kling-v3-omni |
| multi_shot | boolean | No | false | Multi-shot video generation |
| shot_type | string | No | - | customize / intelligence (required when multi_shot=true) |
| prompt | string | No | - | Text prompt (max 2500 chars). Reference with `<<<element_1>>>`, `<<<image_1>>>`, `<<<video_1>>>` |
| multi_prompt | array | No | - | Storyboard info (up to 6). Format: `[{"index":int,"prompt":"string","duration":"5"}]` |
| image_list | array | No | - | Reference images. Elements, scene, style references. Use type: first_frame/end_frame |
| element_list | array | No | - | Reference elements (up to 3). Format: `[{"element_id": long}]` |
| duration | string | No | 5 | 3-15 seconds |
| mode | string | No | std | std (720p), pro (1080p) |
| aspect_ratio | string | No | - | 16:9, 9:16, 1:1 |
| callback_url | string | No | - | Callback URL |
| external_task_id | string | No | - | Custom task ID |

### Query Task (Single)
**GET** `/v1/videos/omni-video/{id}`

### Query Task (List)
**GET** `/v1/videos/omni-video`

### Example
```bash
curl --request POST \
  --url https://api-singapore.klingai.com/v1/videos/omni-video \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
  "model_name": "kling-video-o1",
  "prompt": "Make the person in <<<image_1>>> wave to the camera",
  "image_list": [
    {"image_url": "https://example.com/image.png"}
  ],
  "duration": "5",
  "mode": "pro",
  "aspect_ratio": "16:9"
}'
```
