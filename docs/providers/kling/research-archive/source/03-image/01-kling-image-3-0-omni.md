# Kling Image 3.0 & 3.0 Omni

**Source:** https://kling.ai/document-api/api/image/3-0-omni

## Image Generation — Create Task

**POST** `/v1/images/generations`

### Request Body

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| model_name | string | No | kling-v1 | kling-v1, kling-v1-5, kling-v2, kling-v2-new, kling-v2-1, kling-v3 |
| prompt | string | Required | - | Text prompt (max 2500 chars) |
| negative_prompt | string | No | - | Negative prompt (max 2500 chars). Not supported in img2img mode |
| image | string | No | - | Reference image (Base64 or URL). JPG/PNG, ≤10MB, ≥300px, ratio 1:2.5~2.5:1 |
| image_reference | string | No | - | `subject` (character feature ref) or `face` (appearance ref) |
| image_fidelity | float | No | 0.5 | Face reference intensity [0,1]. Only kling-v1, v1-5 |
| human_fidelity | float | No | 0.45 | Facial feature similarity [0,1]. Only kling-v1-5 with subject ref |
| element_list | array | No | - | Reference elements: `[{"element_id": long}]`. Sum of elements + images ≤ 10 |
| resolution | string | No | 1k | 1k / 2k |
| n | int | No | 1 | Number of images [1, 9] |
| aspect_ratio | string | No | 16:9 | 16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9 |
| watermark_info | object | No | - | `{"enabled": boolean}` |
| callback_url | string | No | - | Callback URL |
| external_task_id | string | No | - | Custom task ID |

### Query Task
**GET** `/v1/images/generations/{id}` | **GET** `/v1/images/generations`

### Response (Create Task)
```json
{
  "code": 0,
  "message": "string",
  "request_id": "string",
  "data": {
    "task_id": "string",
    "task_status": "submitted | processing | succeed | failed",
    "created_at": 1722769557708,
    "updated_at": 1722769557708
  }
}
```

### Response (Query - Task Result)
```json
{
  "data": {
    "task_result": {
      "images": [
        {
          "index": 0,
          "url": "string"
        }
      ]
    }
  }
}
```
