# Kling 3.0 Turbo

**Source:** https://kling.ai/document-api/api/video/3-0-turbo

## Endpoints

### Image to Video — Create Task

**POST** `/image-to-video/kling-3.0-turbo`

Creates an image-to-video generation task.

```bash
curl --location 'https://api-singapore.klingai.com/image-to-video/kling-3.0-turbo' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {apikey}' \
  --data-raw '{
    "contents": [
      {
        "type": "prompt",
        "text": "A girl sat on the train, looking out the window with a melancholic expression, her head swaying with the train."
      },
      {
        "type": "first_frame",
        "url": "https://p2-kling.klingai.com/kcdn/cdn-kling112452/kling-tob-release_note/image_25.png"
      }
    ],
    "settings": {
      "resolution": "1080p",
      "duration": 10
    },
    "options": {
      "callback_url": "https://xxx/callback",
      "external_task_id": "",
      "watermark_info": {
        "enabled": true
      }
    }
  }'
```

**Response (200):**
```json
{
  "code": 0,
  "message": "string",
  "request_id": "string",
  "data": {
    "id": "893605946402811985",
    "status": "string",
    "create_time": 1781080778802,
    "update_time": 1781080794151,
    "external_id": "string"
  }
}
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| contents | array | Required | Collection of references (prompts, images, etc.) |
| contents[].type | string | Required | Reference type: `prompt`, `first_frame` |
| contents[].text | string | Optional | Text prompt (max 2500 chars). For multi-shot videos, use format: `"shot n, m, words; shot n, m, words;"` (supports up to 6 storyboards) |
| contents[].url | string | Optional | First frame image URL (jpg/jpeg/png, max 50MB, ≥300px, aspect ratio 1:2.5 to 2.5:1) |
| settings | object | Optional | Output configuration |
| settings.resolution | string | Optional | `720p` (default) or `1080p` |
| settings.duration | int | Optional | Video length in seconds: 3-15 (default: 5) |
| options | object | Optional | General configurations |
| options.callback_url | string | Optional | Callback URL for task result notification |
| options.external_task_id | string | Optional | Custom task ID (must be unique per account) |
| options.watermark_info.enabled | boolean | Optional | Generate watermarked result (default: false) |

### Query Task (Specified ID)

**GET** `/tasks`

```bash
curl --location 'https://api-singapore.klingai.com/tasks?external_task_ids=123' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {apikey}'
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| task_ids | string | Optional | System task IDs (comma-separated, batch) |
| external_task_ids | string | Optional | Custom task IDs (comma-separated, batch) |

> Note: task_ids and external_task_ids cannot be used simultaneously.

### Query Task (By Cursor)

**POST** `/tasks`

```bash
curl --location 'https://api-singapore.klingai.com/tasks' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {apikey}' \
  --data '{
    "start_time": "1781193600000",
    "end_time": "1781516352968",
    "cursor": "",
    "limit": 500,
    "filters": [
      {"key": "status", "values": ["succeeded"]},
      {"key": "product_type", "values": ["video"]}
    ]
  }'
```

**Request Body Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| start_time | string | Optional | Start time (Unix ms), default: end_time - 30 days |
| end_time | string | Optional | End time (Unix ms), default: current time |
| cursor | string | Optional | Pagination cursor from previous response |
| limit | int | Optional | Number of tasks (max: 500, default: 100) |
| filters | array | Optional | Filter criteria |
| filters[].key | string | Optional | `status` or `product_type` |
| filters[].values | array | Optional | status: submitted/processing/succeeded/failed; product_type: video/image/try_on |

### Response Schema (Task Object)

```json
{
  "id": "string",
  "status": "submitted | processing | succeeded | failed",
  "message": "string",
  "create_time": 1781080778802,
  "update_time": 1781080794151,
  "external_id": "string",
  "outputs": [
    {
      "type": "video",
      "id": "string",
      "url": "string",
      "watermark_url": "string",
      "duration": "string"
    },
    {
      "type": "image",
      "url": "string",
      "watermark_url": "string",
      "group_id": "string"
    },
    {
      "type": "audio",
      "id": "string",
      "mp3_url": "string",
      "wav_url": "string",
      "mp3_duration": "string",
      "wav_duration": "string"
    }
  ],
  "billing": [
    {
      "charge_type": "cash | unit",
      "amount": "string",
      "currency": "CNY | USD",
      "package_type": "video | image | audio"
    }
  ]
}
```

> **Note:** Generated results are cleared after 30 days. Please save them promptly.
