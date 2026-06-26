# Motion Control

**Source:** https://kling.ai/document-api/api/video/motion-control

## Create Task

**POST** `/v1/videos/motion-control`

Motion Brush feature - control specific areas of an image to generate motion in videos.

### Request Body

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| model_name | string | No | kling-v2-6 | kling-v2-6, kling-v2-5-turbo, kling-v2-1, kling-v1-6, kling-v1-5 |
| image | string | No | - | Reference image (URL or Base64) |
| prompt | string | Optional | - | Text prompt |
| static_mask | string | Optional | - | Static brush mask area (image created via motion brush tool) |
| dynamic_masks | array | Optional | - | Dynamic brush config (up to 6 groups): `[{"mask":"...", "trajectories":[{"x":int,"y":int}]}]` |
| camera_control | object | Optional | - | Camera movement control (see 3.0 Omni for schema) |
| duration | string | No | 5 | 3-15 seconds |
| mode | string | No | std | std / pro |
| callback_url | string | No | - | Callback URL |
| external_task_id | string | No | - | Custom task ID |

### Query Task (Single)
**GET** `/v1/videos/motion-control/{id}`

### Query Task (List)
**GET** `/v1/videos/motion-control`

See also: [Kling "Motion Control" User Guide](https://kling.ai)
